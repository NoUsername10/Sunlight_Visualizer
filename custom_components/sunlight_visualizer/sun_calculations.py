"""Sun calculation functions."""
import math
import logging
from datetime import datetime, time, timedelta
from typing import Any, Callable

from .const import FALLBACK_SUN_AZIMUTH, FALLBACK_SUN_ELEVATION

_LOGGER = logging.getLogger(__name__)


def _normalize_fallback(fallback: Any | None) -> tuple[float | None, float | None]:
    """Return fallback azimuth/elevation, defaulting to configured constants."""
    if fallback is None:
        return float(FALLBACK_SUN_AZIMUTH), float(FALLBACK_SUN_ELEVATION)

    if isinstance(fallback, dict):
        az = fallback.get("azimuth")
        el = fallback.get("elevation")
        return (float(az) if az is not None else None, float(el) if el is not None else None)

    try:
        az, el = fallback
        return (float(az), float(el))
    except Exception:
        return (None, None)


def calculate_sun_angle(
    dt: datetime | None = None,
    *,
    solar_position_fn: Callable[[datetime], Any] | None = None,
    tz=None,
    fallback: Any | None = None,
) -> dict[str, float] | None:
    """Get sun elevation/azimuth using HA solar helpers, with fallback values."""
    if dt is None:
        dt = datetime.now(tz) if tz else datetime.utcnow()

    if dt.tzinfo is None and tz is not None:
        dt = dt.replace(tzinfo=tz)

    if solar_position_fn is not None:
        try:
            result = solar_position_fn(dt)
            if isinstance(result, dict):
                azimuth = result.get("azimuth")
                elevation = result.get("elevation")
            else:
                azimuth, elevation = result

            if azimuth is not None and elevation is not None:
                return {
                    "elevation": float(elevation),
                    "azimuth": float(azimuth),
                    "timestamp": dt.isoformat(),
                    "source": "astral",
                }
        except Exception as err:
            _LOGGER.warning("Sun position lookup failed: %s", err, exc_info=True)

    fallback_az, fallback_el = _normalize_fallback(fallback)
    if fallback_az is not None and fallback_el is not None:
        return {
            "elevation": float(fallback_el),
            "azimuth": float(fallback_az),
            "timestamp": dt.isoformat(),
            "source": "fallback",
        }

    return None


def _angular_distance(a: float, b: float) -> float:
    """Smallest angular distance between two azimuths."""
    diff = (a - b) % 360
    return min(diff, 360 - diff)


def angle_to_percentage(sun_azimuth, surface_azimuth, surface, sun_elevation, surface_tilt=0):
    """Convert sun angle to an intensity percentage for a surface."""
    if sun_elevation <= 0:
        return 0

    distance = _angular_distance(sun_azimuth, surface_azimuth)
    if distance > 90:
        direction_factor = 0
    else:
        direction_factor = (90 - distance) / 90.0

    if surface == "ceiling":
        optimal_elevation = 90 - surface_tilt
        elevation_diff = abs(sun_elevation - optimal_elevation)
        elevation_factor = math.cos(math.radians(elevation_diff))
        return round(direction_factor * elevation_factor * 100, 2)

    if surface_tilt > 0:
        optimal_elevation = surface_tilt
        elevation_diff = abs(sun_elevation - optimal_elevation)
        elevation_factor = max(0, 1 - (elevation_diff / 90))
        return round(direction_factor * elevation_factor * 100, 2)

    return round(direction_factor * 100, 2)


def calculate_optimal_alignment_time(
    solar_position_fn,
    roof_azimuth,
    ceiling_tilt,
    date=None,
    tz=None,
    latitude=None,
    fallback_sun=None,
):
    """
    Calculate optimal alignment: Percentage of today's maximum possible intensity.
    Uses 3-stage search for efficiency and accuracy.
    """
    try:
        if tz is None:
            tz = datetime.now().astimezone().tzinfo

        if date is None:
            date = datetime.now(tz).date()

        lat = latitude if latitude is not None else 0.0

        def get_sun_data(target_time):
            sun_data = calculate_sun_angle(
                target_time,
                solar_position_fn=solar_position_fn,
                tz=tz,
                fallback=fallback_sun,
            )
            return sun_data

        def calculate_intensity_at_time(target_time):
            """Calculate ceiling intensity at a specific time."""
            sun_data = get_sun_data(target_time)
            if sun_data is None:
                return None
            return angle_to_percentage(
                sun_data["azimuth"],
                roof_azimuth,
                "ceiling",
                sun_data["elevation"],
                ceiling_tilt,
            )

        # Stage 1: COARSE SEARCH - 30-minute intervals
        max_intensity = 0
        optimal_time = None
        intensity_by_hour = {}
        all_calculations = []

        base_hour_start = 6
        base_hour_end = 18
        if abs(lat) > 50:
            base_hour_start = 4
            base_hour_end = 20
        if abs(lat) > 70:
            base_hour_start = 0
            base_hour_end = 24

        start_time = datetime.combine(date, time(base_hour_start, 0), tzinfo=tz)
        if base_hour_end == 24:
            end_time = datetime.combine(date + timedelta(days=1), time(0, 0), tzinfo=tz)
        else:
            end_time = datetime.combine(date, time(base_hour_end, 0), tzinfo=tz)

        current_time = start_time
        calculations_made = 0
        max_possible_calculations = ((base_hour_end - base_hour_start) * 2) + 1

        while current_time <= end_time and calculations_made < max_possible_calculations:
            intensity = calculate_intensity_at_time(current_time)
            calculations_made += 1

            if intensity is None:
                return _create_fallback_result(
                    roof_azimuth,
                    ceiling_tilt,
                    tz,
                    fallback_sun,
                    intensity_by_hour,
                )

            time_key = current_time.strftime("%H:%M")
            intensity_by_hour[time_key] = intensity

            total_minutes = current_time.hour * 60 + current_time.minute
            all_calculations.append((total_minutes, intensity, time_key))

            if intensity > max_intensity:
                max_intensity = intensity
                optimal_time = current_time

            current_time += timedelta(minutes=30)

        if calculations_made == 0:
            _LOGGER.warning("No calculations made for date %s", date)
            return _create_fallback_result(
                roof_azimuth,
                ceiling_tilt,
                tz,
                fallback_sun,
                intensity_by_hour,
            )

        if optimal_time is None or max_intensity == 0:
            now = datetime.now(tz)
            current_sun = get_sun_data(now)
            if current_sun is None:
                return _create_fallback_result(
                    roof_azimuth,
                    ceiling_tilt,
                    tz,
                    fallback_sun,
                    intensity_by_hour,
                )

            current_intensity = angle_to_percentage(
                current_sun["azimuth"],
                roof_azimuth,
                "ceiling",
                current_sun["elevation"],
                ceiling_tilt,
            )

            return {
                "optimal_time": None,
                "current_percentage": 0.0,
                "current_intensity": round(current_intensity, 1),
                "max_intensity_today": 0.0,
                "optimal_elevation": 90 - ceiling_tilt,
                "current_elevation": round(current_sun["elevation"], 2),
                "current_azimuth": round(current_sun["azimuth"], 2),
                "status": "unknown",
                "minutes_to_optimal": 0.0,
                "intensity_curve": intensity_by_hour,
                "search_info": {
                    "coarse_search_points": calculations_made,
                    "refined_search_points": 0,
                    "precision_search_points": 0,
                    "total_calculations": calculations_made,
                    "optimal_found_at_stage": "none",
                    "optimal_time_precision": "none",
                },
                "time_to_10%": "N/A",
                "time_to_25%": "N/A",
                "time_to_50%": "N/A",
                "time_to_75%": "N/A",
                "time_to_90%": "N/A",
            }

        # Stage 2: REFINED SEARCH - 5-minute intervals around best point ±1 hour
        refine1_start = max(optimal_time - timedelta(hours=1), start_time)
        refine1_end = min(optimal_time + timedelta(hours=1), end_time)

        best_refined1_intensity = max_intensity
        best_refined1_time = optimal_time

        refine1_time = refine1_start
        refine1_calculations = 0

        while refine1_time <= refine1_end:
            intensity = calculate_intensity_at_time(refine1_time)
            refine1_calculations += 1

            if intensity is None:
                return _create_fallback_result(
                    roof_azimuth,
                    ceiling_tilt,
                    tz,
                    fallback_sun,
                    intensity_by_hour,
                )

            time_key = refine1_time.strftime("%H:%M")
            if time_key not in intensity_by_hour:
                intensity_by_hour[time_key] = intensity
                total_minutes = refine1_time.hour * 60 + refine1_time.minute
                all_calculations.append((total_minutes, intensity, time_key))

            if intensity > best_refined1_intensity:
                best_refined1_intensity = intensity
                best_refined1_time = refine1_time

            refine1_time += timedelta(minutes=5)

        # Stage 3: PRECISION SEARCH - 1-minute intervals around best point ±30 minutes
        refine2_start = max(best_refined1_time - timedelta(minutes=30), start_time)
        refine2_end = min(best_refined1_time + timedelta(minutes=30), end_time)

        best_refined2_intensity = best_refined1_intensity
        best_refined2_time = best_refined1_time

        refine2_time = refine2_start
        refine2_calculations = 0

        while refine2_time <= refine2_end:
            intensity = calculate_intensity_at_time(refine2_time)
            refine2_calculations += 1

            if intensity is None:
                return _create_fallback_result(
                    roof_azimuth,
                    ceiling_tilt,
                    tz,
                    fallback_sun,
                    intensity_by_hour,
                )

            time_key = refine2_time.strftime("%H:%M")
            if time_key not in intensity_by_hour:
                intensity_by_hour[time_key] = intensity
                total_minutes = refine2_time.hour * 60 + refine2_time.minute
                all_calculations.append((total_minutes, intensity, time_key))

            if intensity > best_refined2_intensity:
                best_refined2_intensity = intensity
                best_refined2_time = refine2_time

            refine2_time += timedelta(minutes=1)

        max_intensity = best_refined2_intensity
        optimal_time = best_refined2_time

        now = datetime.now(tz)
        current_sun = get_sun_data(now)
        if current_sun is None:
            return _create_fallback_result(
                roof_azimuth,
                ceiling_tilt,
                tz,
                fallback_sun,
                intensity_by_hour,
            )

        current_intensity = angle_to_percentage(
            current_sun["azimuth"],
            roof_azimuth,
            "ceiling",
            current_sun["elevation"],
            ceiling_tilt,
        )

        current_percentage = (current_intensity / max_intensity) * 100 if max_intensity > 0 else 0
        current_percentage = max(0.0, min(100.0, current_percentage))

        if optimal_time and max_intensity > 0:
            time_diff = (optimal_time - now).total_seconds() / 60
            intensity_ratio = current_intensity / max_intensity if max_intensity > 0 else 0

            if abs(time_diff) < 20 and intensity_ratio >= 0.9:
                status = "at_peak"
            elif time_diff > 0:
                status = "approaching"
            else:
                status = "declining"
        else:
            status = "unknown"
            time_diff = 0

        thresholds = {}
        all_calculations.sort(key=lambda x: x[0])

        for threshold in [10, 25, 50, 75, 90]:
            threshold_value = max_intensity * (threshold / 100)
            threshold_time = "N/A"

            for i in range(len(all_calculations) - 1):
                t1, i1, _ = all_calculations[i]
                t2, i2, _ = all_calculations[i + 1]

                if (i1 <= threshold_value <= i2) or (i2 <= threshold_value <= i1):
                    if i2 != i1:
                        fraction = (threshold_value - i1) / (i2 - i1)
                    else:
                        fraction = 0.5

                    interpolated_minutes = t1 + fraction * (t2 - t1)
                    hours = int(interpolated_minutes // 60)
                    minutes = int(interpolated_minutes % 60)
                    threshold_time = f"{hours:02d}:{minutes:02d}"
                    break

            thresholds[f"time_to_{threshold}%"] = threshold_time

        total_calculations = calculations_made + refine1_calculations + refine2_calculations

        return {
            "optimal_time": optimal_time,
            "current_percentage": round(current_percentage, 1),
            "current_intensity": round(current_intensity, 1),
            "max_intensity_today": round(max_intensity, 1),
            "optimal_elevation": 90 - ceiling_tilt,
            "current_elevation": round(current_sun["elevation"], 2),
            "current_azimuth": round(current_sun["azimuth"], 2),
            "status": status,
            "minutes_to_optimal": round(time_diff, 1),
            "intensity_curve": intensity_by_hour,
            "search_info": {
                "coarse_search_points": calculations_made,
                "refined_search_points": refine1_calculations,
                "precision_search_points": refine2_calculations,
                "total_calculations": total_calculations,
                "optimal_found_at_stage": "precision",
                "optimal_time_precision": "±1 minute",
            },
            **thresholds,
        }

    except Exception as e:
        _LOGGER.error("Error calculating optimal alignment: %s", e, exc_info=True)
        return _create_fallback_result(
            roof_azimuth,
            ceiling_tilt,
            tz,
            fallback_sun,
            {},
        )


def _create_fallback_result(
    roof_azimuth,
    ceiling_tilt,
    tz,
    fallback_sun,
    intensity_by_hour,
):
    """Safe fallback result when solar position can't be calculated."""
    now = datetime.now(tz) if tz else datetime.utcnow()
    fallback_az, fallback_el = _normalize_fallback(fallback_sun)

    if fallback_az is not None and fallback_el is not None:
        current_intensity = angle_to_percentage(
            fallback_az,
            roof_azimuth,
            "ceiling",
            fallback_el,
            ceiling_tilt,
        )
        current_elevation = fallback_el
        current_azimuth = fallback_az
    else:
        current_intensity = 0.0
        current_elevation = 0.0
        current_azimuth = 0.0

    return {
        "optimal_time": None,
        "current_percentage": 0.0,
        "current_intensity": round(current_intensity, 1),
        "max_intensity_today": 0.0,
        "optimal_elevation": 90 - ceiling_tilt,
        "current_elevation": round(current_elevation, 2),
        "current_azimuth": round(current_azimuth, 2),
        "status": "unknown",
        "minutes_to_optimal": 0.0,
        "intensity_curve": intensity_by_hour,
        "search_info": {
            "coarse_search_points": 0,
            "refined_search_points": 0,
            "precision_search_points": 0,
            "total_calculations": 0,
            "optimal_found_at_stage": "fallback",
            "optimal_time_precision": "none",
        },
        "time_to_10%": "N/A",
        "time_to_25%": "N/A",
        "time_to_50%": "N/A",
        "time_to_75%": "N/A",
        "time_to_90%": "N/A",
        "fallback_used": True,
        "fallback_timestamp": now.isoformat(),
    }
