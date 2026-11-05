"""Local GHI history and horizontal irradiance decomposition."""

from collections import deque
from datetime import datetime, timedelta
import math


WATT_PER_SQUARE_METER_UNITS = {"W/m²", "W/m2"}
SHADING_FULL_DEMAND_WALL_FACING_GHI = 400.0


def shading_demand(ghi: float, wall_incidence: float, sun_elevation: float) -> float:
    """Return source-independent wall shading demand, capped at 100%."""
    if sun_elevation <= 0 or not math.isfinite(ghi) or not math.isfinite(wall_incidence):
        return 0.0
    wall_facing_ghi = max(0.0, ghi) * max(0.0, wall_incidence)
    return min(100.0, wall_facing_ghi / SHADING_FULL_DEMAND_WALL_FACING_GHI * 100.0)


class GHIHistory:
    """Keep station reports for a time-weighted rolling mean."""

    def __init__(self) -> None:
        self._samples: deque[tuple[datetime, float]] = deque()

    def clear(self) -> None:
        """Discard readings after an unavailable or stale station interval."""
        self._samples.clear()

    def add(self, reported_at: datetime, value: float) -> None:
        """Add a new report, including unchanged values reported again."""
        if not math.isfinite(value) or value < 0:
            return
        if self._samples and reported_at <= self._samples[-1][0]:
            return
        self._samples.append((reported_at, value))

    def average(self, now: datetime, window_minutes: int, stale_minutes: int) -> float | None:
        """Return the held-value mean while the latest report remains fresh."""
        if not self._samples or now - self._samples[-1][0] > timedelta(minutes=stale_minutes):
            return None
        cutoff = now - timedelta(minutes=window_minutes)
        while len(self._samples) > 1 and self._samples[1][0] <= cutoff:
            self._samples.popleft()
        first_time, value = self._samples[0]
        cursor = max(cutoff, first_time)
        total = 0.0
        for sample_time, next_value in list(self._samples)[1:]:
            if sample_time > cursor:
                total += value * (sample_time - cursor).total_seconds()
            cursor = max(cursor, sample_time)
            value = next_value
        if now > cursor:
            total += value * (now - cursor).total_seconds()
        duration = (now - max(cutoff, first_time)).total_seconds()
        return total / duration if duration > 0 else self._samples[-1][1]

    @property
    def last_reported(self) -> datetime | None:
        """Return the last report time."""
        return self._samples[-1][0] if self._samples else None


def estimate_components(ghi: float, sun_elevation: float, when: datetime) -> dict[str, float]:
    """Estimate DHI and DNI from horizontal GHI with the Erbs model.

    Erbs was fitted to hourly averages. Short station intervals therefore remain
    estimates, especially near the horizon; conserve GHI when applying bounds.
    """
    if sun_elevation <= 0 or ghi <= 0:
        return {
            "shortwave_radiation": 0.0,
            "direct_radiation": 0.0,
            "diffuse_radiation": 0.0,
            "direct_normal_irradiance": 0.0,
        }
    sin_elevation = math.sin(math.radians(sun_elevation))
    if sun_elevation <= 5:
        diffuse = ghi
        direct_normal = 0.0
    else:
        day = when.timetuple().tm_yday
        extraterrestrial = 1361.0 * (1 + 0.033 * math.cos(2 * math.pi * day / 365))
        clearness = min(1.5, max(0.0, ghi / (extraterrestrial * sin_elevation)))
        if clearness <= 0.22:
            diffuse_fraction = 1 - 0.09 * clearness
        elif clearness <= 0.8:
            diffuse_fraction = (
                0.9511 - 0.1604 * clearness + 4.388 * clearness**2
                - 16.638 * clearness**3 + 12.336 * clearness**4
            )
        else:
            diffuse_fraction = 0.165
        diffuse = ghi * min(1.0, max(0.0, diffuse_fraction))
        direct_normal = min(extraterrestrial, (ghi - diffuse) / sin_elevation)
        diffuse = max(0.0, ghi - direct_normal * sin_elevation)
    return {
        "shortwave_radiation": ghi,
        "direct_radiation": max(0.0, ghi - diffuse),
        "diffuse_radiation": diffuse,
        "direct_normal_irradiance": direct_normal,
    }
