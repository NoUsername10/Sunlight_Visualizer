"""Platform for sensor integration."""
from __future__ import annotations


from datetime import datetime, timedelta
import asyncio
import logging
import math
from typing import Any

from aiohttp import ClientError, ClientTimeout

from homeassistant.components.sensor import (
    SensorEntity,
    SensorDeviceClass,
    SensorStateClass,
)
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import PERCENTAGE, EntityCategory
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.event import async_track_point_in_time
from homeassistant.helpers.aiohttp_client import async_get_clientsession
from homeassistant.helpers import sun as sun_helper
from homeassistant.helpers.update_coordinator import (
    CoordinatorEntity,
    DataUpdateCoordinator,
    UpdateFailed,
)

from homeassistant.util import dt as dt_util 

from .const import (
    DOMAIN,
    CONF_ADVANCED_MODE,
    CONF_LATITUDE,
    CONF_LONGITUDE,
    CONF_HOUSE_ANGLE,
    CONF_LOCATION_SOURCE,
    CONF_LOCATION_ZONE_ENTITY,
    CONF_ROOF_DIRECTION,
    CONF_ROOF_POWER_ENTITY,
    CONF_ROOF_POWER_ENABLED,
    CONF_ROOF_POWER_INVERT,
    CONF_RADIATION_ENABLED,
    CONF_FORCE_SUN_FALLBACK,
    CONF_FORCE_SUN_AZIMUTH,
    CONF_FORCE_SUN_ELEVATION,
    CONF_AUTO_ROTATE_SPEED,
    CONF_FIXED_SUN_AZIMUTH,
    CONF_FIXED_SUN_ROTATION_ENABLED,
    CONF_CEILING_TILT,
    CONF_UPDATE_INTERVAL,
    DEFAULT_HOUSE_ANGLE,
    DEFAULT_CEILING_TILT,
    DEFAULT_LOCATION_ZONE_ENTITY,
    DEFAULT_ROOF_DIRECTION,
    DEFAULT_FORCE_SUN_FALLBACK,
    DEFAULT_FORCE_SUN_AZIMUTH,
    DEFAULT_FORCE_SUN_ELEVATION,
    DEFAULT_AUTO_ROTATE_SPEED,
    DEFAULT_FIXED_SUN_AZIMUTH,
    DEFAULT_FIXED_SUN_ROTATION_ENABLED,
    DEFAULT_RADIATION_ENABLED,
    WALLS,
    DEFAULT_UPDATE_INTERVAL,
    ROOF_DIRECTIONS,
    FALLBACK_SUN_AZIMUTH,
    FALLBACK_SUN_ELEVATION,
    CARD_SOURCE_ATTR,
    CARD_SOURCE_VALUE,
    LOCATION_SOURCE_HOME_ASSISTANT,
    LOCATION_SOURCE_ZONE,
)

from .sun_calculations import calculate_sun_angle, angle_to_percentage, calculate_optimal_alignment_time


_LOGGER = logging.getLogger(__name__)


OPEN_METEO_FORECAST_URL = "https://api.open-meteo.com/v1/forecast"
IRRADIANCE_UNIT = "W/m²"
GROUND_ALBEDO = 0.2
RADIATION_FIELDS = (
    "shortwave_radiation",
    "direct_radiation",
    "diffuse_radiation",
    "direct_normal_irradiance",
)
RADIATION_FORECAST_KEY = "minutely_15"
RADIATION_FORECAST_FALLBACK_KEY = "hourly"
RAW_RADIATION_OBJECT_IDS = {
    "shortwave_radiation": "open_meteo_shortwave_radiation",
    "direct_radiation": "open_meteo_direct_radiation",
    "diffuse_radiation": "open_meteo_diffuse_radiation",
    "direct_normal_irradiance": "open_meteo_direct_normal_irradiance",
}
RADIATION_FETCH_INTERVAL_DAYLIGHT = timedelta(minutes=15)
RADIATION_FETCH_INTERVAL_NIGHT = timedelta(hours=1)
OPEN_METEO_RETRY_DELAYS = (0.0, 0.5, 1.5)
OPEN_METEO_TRANSIENT_STATUSES = {429, 500, 502, 503, 504}
ELEVATION_COMFORT_CURVE = (
    (3.0, 0.0),
    (5.0, 0.25),
    (10.0, 0.60),
    (15.0, 1.00),
    (45.0, 1.00),
    (60.0, 0.65),
    (75.0, 0.25),
    (85.0, 0.05),
)
WALL_SHADING_STATUS_RECOMMENDATIONS = {
    "No direct sun": "No blind or awning action is needed from direct sun on this wall.",
    "Low need": "Direct sun impact is low; shading is usually not needed.",
    "Mild sun": "There is some direct sun. Watch glare or room comfort if this wall has windows.",
    "Shade useful": "Shading may improve comfort on this wall.",
    "Shade recommended": "Direct sun is strong enough that blinds or awnings are recommended for comfort.",
    "Strong low sun": "Low direct sun can enter deeply through windows; shading is strongly recommended.",
}

SURFACE_FRIENDLY_PREFIX = {
    "ceiling": "Roof",
    "left": "Left Wall",
    "right": "Right Wall",
    "front": "Front Wall",
    "back": "Back Wall",
}


def _surface_friendly_prefix(surface: str) -> str:
    """Return a prefix that keeps surface sensors grouped in HA alphabetical sorting."""
    return SURFACE_FRIENDLY_PREFIX.get(surface, surface.replace("_", " ").title())


def _clamp(value: float, minimum: float, maximum: float) -> float:
    """Clamp a numeric value."""
    return max(minimum, min(maximum, value))


def _safe_float(value: Any, default: float = 0.0) -> float:
    """Return a finite float or a default."""
    try:
        result = float(value)
    except (TypeError, ValueError):
        return default
    if not math.isfinite(result):
        return default
    return result


def _interp_curve(x_value: float, points: tuple[tuple[float, float], ...]) -> float:
    """Linearly interpolate a y value from a sorted curve."""
    if x_value <= points[0][0]:
        return points[0][1]
    for (x0, y0), (x1, y1) in zip(points, points[1:]):
        if x_value <= x1:
            span = max(0.0001, x1 - x0)
            ratio = (x_value - x0) / span
            return y0 + (y1 - y0) * ratio
    return points[-1][1]


def _wall_sun_angle_details(coordinator: Any, wall: str) -> dict[str, Any]:
    """Return wall sun-angle details without depending on Open-Meteo."""
    data = coordinator.data or {}
    sun_pos = data.get("sun_position", {}) or {}
    wall_intensities = data.get("wall_intensities", {}) or {}

    sun_elevation = _safe_float(sun_pos.get("elevation"))
    sun_azimuth = _safe_float(sun_pos.get("azimuth"))
    wall_sunlight = _safe_float(wall_intensities.get(wall))
    try:
        wall_azimuth = round(float(coordinator._get_surface_azimuths().get(wall, 0.0)), 2)
    except (AttributeError, TypeError, ValueError):
        wall_azimuth = None

    if coordinator.data is None:
        zero_reason = "no_data"
    elif sun_elevation <= 0:
        zero_reason = "sun_below_horizon"
    elif wall_sunlight <= 0:
        zero_reason = "wall_not_lit"
    else:
        zero_reason = None

    sun_on_wall = zero_reason is None
    wall_sun_angle = round(_clamp(90.0 - sun_elevation, 0.0, 90.0), 1) if sun_on_wall else 0.0

    return {
        "wall_sun_angle": wall_sun_angle,
        "sun_on_wall": sun_on_wall,
        "sun_elevation": round(sun_elevation, 2),
        "sun_azimuth": round(sun_azimuth, 2),
        "wall_azimuth": wall_azimuth,
        "wall_sunlight": round(wall_sunlight, 1),
        "is_zero_reason": zero_reason,
    }


def _wall_shading_status(
    shading_demand: float,
    direct_radiation: float,
    wall_sun_angle: float,
) -> str:
    """Return a human-friendly wall shading status."""
    if direct_radiation <= 0 or shading_demand <= 0:
        return "No direct sun"
    if shading_demand < 15:
        return "Low need"
    if shading_demand < 35:
        return "Mild sun"
    if shading_demand < 65:
        return "Shade useful"
    if shading_demand < 85:
        return "Shade recommended"
    if wall_sun_angle >= 45:
        return "Strong low sun"
    return "Shade recommended"


def _parse_forecast_time(value: str, tzinfo) -> datetime | None:
    """Parse Open-Meteo local time into an aware datetime."""
    try:
        parsed = datetime.fromisoformat(value.replace("Z", "+00:00"))
    except (TypeError, ValueError):
        return None
    if parsed.tzinfo is None and tzinfo is not None:
        parsed = parsed.replace(tzinfo=tzinfo)
    return parsed



def _location_source_label(source: str) -> str:
    """Return normalized location source label."""
    if source in (
        LOCATION_SOURCE_HOME_ASSISTANT,
        LOCATION_SOURCE_ZONE,
        "zone_fallback_home",
        "legacy_custom",
    ):
        return source
    return LOCATION_SOURCE_HOME_ASSISTANT


async def async_setup_entry(
    hass: HomeAssistant,
    config_entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up the sensor platform."""
    
    # Get the coordinator that was already created in __init__.py
    coordinator = hass.data[DOMAIN][config_entry.entry_id]["coordinator"]

    entities = []
    
    # Add wall intensity sensors
    for wall in WALLS:
        if wall == 'ceiling':
            entities.append(CeilingIntensitySensor(coordinator, config_entry, wall))
        else:
            entities.append(SunWallIntensitySensor(coordinator, config_entry, wall))
            entities.append(WallSunAngleSensor(coordinator, config_entry, wall))
    
    # Add sun position sensors
    entities.append(SunAzimuthSensor(coordinator, config_entry))
    entities.append(SunIncomingDirectionSensor(coordinator, config_entry))
    entities.append(SunElevationSensor(coordinator, config_entry))
    
    # Add solar alignment sensors (TWO SEPARATE SENSORS)
    entities.append(SolarAlignmentPercentageSensor(coordinator, config_entry))  # Numeric for graphing
    entities.append(SolarAlignmentStatusSensor(coordinator, config_entry))      # String for display
    
    # Add diagnostic sensors (disabled by default)
    entities.append(CalculationTimeSensor(coordinator, config_entry))
    entities.append(DataQualitySensor(coordinator, config_entry))

    # Add coordinates sensor
    entities.append(CoordinatesSensor(coordinator, config_entry))

    if coordinator.radiation_enabled:
        entities.extend([
            RawRadiationSensor(
                coordinator,
                config_entry,
                "shortwave_radiation",
                "Solar Shortwave Radiation",
                "mdi:white-balance-sunny",
            ),
            RawRadiationSensor(
                coordinator,
                config_entry,
                "direct_radiation",
                "Solar Direct Radiation",
                "mdi:sun-angle",
            ),
            RawRadiationSensor(
                coordinator,
                config_entry,
                "diffuse_radiation",
                "Solar Diffuse Radiation",
                "mdi:weather-partly-cloudy",
            ),
            RawRadiationSensor(
                coordinator,
                config_entry,
                "direct_normal_irradiance",
                "Solar Direct Normal Irradiance",
                "mdi:sun-wireless",
            ),
            OpenMeteoRadiationStatusSensor(coordinator, config_entry),
            RoofRadiationSensor(coordinator, config_entry),
            RoofRadiationPercentageSensor(coordinator, config_entry),
        ])
        for wall in ("front", "right", "back", "left"):
            entities.append(WallRadiationSensor(coordinator, config_entry, wall))
            entities.append(WallDirectRadiationSensor(coordinator, config_entry, wall))
            entities.append(WallShadingDemandSensor(coordinator, config_entry, wall))
            entities.append(WallShadingStatusSensor(coordinator, config_entry, wall))

    async_add_entities(entities)


class SolarAlignmentPercentageSensor(CoordinatorEntity, SensorEntity):
    """Numeric sensor for solar alignment percentage (for graphing)."""
    
    def __init__(
        self,
        coordinator: SunWallIntensityCoordinator,
        config_entry: ConfigEntry,
    ) -> None:
        """Initialize the sensor."""
        super().__init__(coordinator)
        self._config_entry = config_entry
        self._attr_name = "Roof Sunlight Alignment Percentage"
        self._attr_unique_id = f"{config_entry.entry_id}_solar_alignment_percentage"
        self._attr_icon = "mdi:chart-line"
        self._attr_state_class = SensorStateClass.MEASUREMENT
        self._attr_native_unit_of_measurement = PERCENTAGE
        self._attr_suggested_display_precision = 1
    
    @property
    def device_info(self) -> dict[str, Any]:
        """Return device information."""
        return self.coordinator.device_info
    
    @property
    def native_value(self) -> float | None:
        """Return the alignment percentage as a numeric value."""
        if (self.coordinator.data is None or 
            'optimal_alignment' not in self.coordinator.data):
            return None
        
        opt_data = self.coordinator.data['optimal_alignment']
        return round(opt_data.get('current_percentage', 0), 1)
    
    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        """Return alignment information."""
        if (self.coordinator.data is None or 
            'optimal_alignment' not in self.coordinator.data):
            return {CARD_SOURCE_ATTR: CARD_SOURCE_VALUE}
        
        opt_data = self.coordinator.data['optimal_alignment']
        
        # Get status and format optimal time
        status = opt_data.get('status', 'unknown')
        optimal_time_str = "Not found"
        
        if opt_data.get('optimal_time'):
            try:
                optimal_time_str = opt_data['optimal_time'].strftime("%H:%M")
            except (AttributeError, TypeError):
                optimal_time_str = "Invalid time"
        
        # Calculate minutes to optimal
        minutes = opt_data.get('minutes_to_optimal', 0)
        
        return {
            CARD_SOURCE_ATTR: CARD_SOURCE_VALUE,
            'alignment_status': status,
            'optimal_time': optimal_time_str,
            'minutes_to_optimal': round(minutes, 1),
            'current_intensity': opt_data.get('current_intensity', 0),
            'max_intensity_today': opt_data.get('max_intensity_today', 0),
            'optimal_elevation': opt_data.get('optimal_elevation', 0),
            'current_elevation': opt_data.get('current_elevation', 0),
            'current_azimuth': opt_data.get('current_azimuth', 0),
            'time_to_10%': opt_data.get('time_to_10%', 'N/A'),
            'time_to_25%': opt_data.get('time_to_25%', 'N/A'),
            'time_to_50%': opt_data.get('time_to_50%', 'N/A'),
            'time_to_75%': opt_data.get('time_to_75%', 'N/A'),
            'time_to_90%': opt_data.get('time_to_90%', 'N/A'),
            'last_updated': self.coordinator.data.get('last_updated', '')
        }
    
    @property
    def available(self) -> bool:
        """Return True if entity is available."""
        return self.coordinator.last_update_success


class SolarAlignmentStatusSensor(CoordinatorEntity, SensorEntity):
    """String sensor for solar alignment status (for display)."""
    
    def __init__(
        self,
        coordinator: SunWallIntensityCoordinator,
        config_entry: ConfigEntry,
    ) -> None:
        """Initialize the sensor."""
        super().__init__(coordinator)
        self._config_entry = config_entry
        self._attr_name = "Roof Sunlight Alignment Status"
        self._attr_unique_id = f"{config_entry.entry_id}_solar_alignment_status"
        self._attr_icon = "mdi:sun-clock"
        self._attr_device_class = SensorDeviceClass.ENUM
        self._attr_options = ["at_peak", "approaching", "declining", "unknown"]
        self._attr_translation_key = "solar_alignment_status"
    
    @property
    def device_info(self) -> dict[str, Any]:
        """Return device information."""
        return self.coordinator.device_info
    
    @property
    def native_value(self) -> str | None:
        """Return normalized status key for translation-aware UI."""
        if self.coordinator.data is None or 'optimal_alignment' not in self.coordinator.data:
            return None
        
        opt_data = self.coordinator.data['optimal_alignment']
        status = str(opt_data.get('status', 'unknown')).strip().lower()
        if status in {"at_peak", "approaching", "declining"}:
            return status
        return "unknown"
    
    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        """Return detailed alignment information."""
        if self.coordinator.data is None or 'optimal_alignment' not in self.coordinator.data:
            return {CARD_SOURCE_ATTR: CARD_SOURCE_VALUE}
    
        opt_data = self.coordinator.data['optimal_alignment']
        
        # Get status and format optimal time
        status = opt_data.get('status', 'unknown')
        optimal_time_str = "Not found"
        
        if opt_data.get('optimal_time'):
            try:
                optimal_time_str = opt_data['optimal_time'].strftime("%H:%M")
            except (AttributeError, TypeError):
                optimal_time_str = "Invalid time"
        
        # Calculate human-friendly descriptions
        minutes = opt_data.get('minutes_to_optimal', 0)
        time_description = self._format_time_description(minutes, status)
        
        # Get intensity data
        current_intensity = opt_data.get('current_intensity', 0)
        max_intensity = opt_data.get('max_intensity_today', 0)
        
        return {
            CARD_SOURCE_ATTR: CARD_SOURCE_VALUE,
            # Core metrics
            'alignment_percentage': round(opt_data.get('current_percentage', 0), 1),
            'current_intensity': round(current_intensity, 1),
            'max_intensity_today': round(max_intensity, 1),
            
            # Timing information
            'optimal_time': optimal_time_str,
            'minutes_to_optimal': round(minutes, 1),
            'time_description': time_description,
            
            # Solar position data
            'optimal_elevation': round(opt_data.get('optimal_elevation', 0), 2),
            'current_elevation': round(opt_data.get('current_elevation', 0), 2),
            'current_azimuth': round(opt_data.get('current_azimuth', 0), 2),
            
            # Performance interpretation
            'interpretation': self._get_interpretation(opt_data),
            'alignment_quality': self._get_alignment_quality(opt_data.get('current_percentage', 0)),
            
            # Threshold times
            'time_to_10%': opt_data.get('time_to_10%', 'N/A'),
            'time_to_25%': opt_data.get('time_to_25%', 'N/A'),
            'time_to_50%': opt_data.get('time_to_50%', 'N/A'),
            'time_to_75%': opt_data.get('time_to_75%', 'N/A'),
            'time_to_90%': opt_data.get('time_to_90%', 'N/A'),
            
            # Last update
            'last_updated': self.coordinator.data.get('last_updated', '')
        }
    
    def _format_time_description(self, minutes: float, status: str) -> str:
        """Create human-readable time description."""
        if status == 'at_peak':
            return "Currently at optimal alignment"
        elif status == 'approaching':
            if minutes < 1:
                return "Optimal alignment imminent"
            elif minutes < 60:
                return f"Optimal in {int(minutes)} minutes"
            else:
                hours = minutes / 60
                return f"Optimal in {hours:.1f} hours"
        elif status == 'declining':
            if abs(minutes) < 1:
                return "Just passed optimal alignment"
            elif abs(minutes) < 60:
                return f"Optimal {int(abs(minutes))} minutes ago"
            else:
                hours = abs(minutes) / 60
                return f"Optimal {hours:.1f} hours ago"
        return "Optimal time unknown"
    
    def _get_alignment_quality(self, percentage: float) -> str:
        """Return quality description based on percentage."""
        if percentage >= 90:
            return "Excellent"
        elif percentage >= 75:
            return "Good"
        elif percentage >= 50:
            return "Fair"
        elif percentage >= 25:
            return "Poor"
        else:
            return "Very Poor"
    
    def _get_interpretation(self, opt_data) -> str:
        """Provide human-readable interpretation."""
        status = opt_data.get('status', 'unknown')
        current_pct = opt_data.get('current_percentage', 0)
        current_int = opt_data.get('current_intensity', 0)
        max_int = opt_data.get('max_intensity_today', 0)
        
        if status == 'at_peak':
            return f"At today's peak: {current_int}% intensity ({current_pct}% of maximum)"
        elif status == 'approaching':
            mins = opt_data.get('minutes_to_optimal', 0)
            return f"Approaching peak: {current_int}/{max_int} ({current_pct}%), {int(mins)} min to go"
        elif status == 'declining':
            mins = opt_data.get('minutes_to_optimal', 0)
            return f"Past peak: {current_int}/{max_int} ({current_pct}%), peaked {int(abs(mins))} min ago"
        return f"Current: {current_int}/{max_int} ({current_pct}% of today's maximum)"
    
    @property
    def available(self) -> bool:
        """Return True if entity is available."""
        return self.coordinator.last_update_success
    

class CoordinatesSensor(CoordinatorEntity, SensorEntity):
    """Sensor showing current coordinates."""
    
    def __init__(
        self,
        coordinator: SunWallIntensityCoordinator,
        config_entry: ConfigEntry,
    ) -> None:
        """Initialize the sensor."""
        super().__init__(coordinator)
        self._config_entry = config_entry
        self._attr_name = "Sun Coordinates"
        self._attr_unique_id = f"{config_entry.entry_id}_coordinates"
        self._attr_icon = "mdi:map-marker"
        self._attr_entity_category = EntityCategory.DIAGNOSTIC
    
    @property
    def device_info(self) -> dict[str, Any]:
        """Return device information."""
        return self.coordinator.device_info
    
    @property
    def native_value(self) -> str | None:
        """Return the native value of the sensor."""
        if self.coordinator.data is None:
            return None
        
        # Format latitude with N/S
        lat = self.coordinator.latitude
        lat_dir = "N" if lat >= 0 else "S"
        lat_str = f"{abs(lat):.6f}° {lat_dir}"
        
        # Format longitude with E/W
        lon = self.coordinator.longitude
        lon_dir = "E" if lon >= 0 else "W"
        lon_str = f"{abs(lon):.6f}° {lon_dir}"
        
        return f"{lat_str}, {lon_str}"
    
    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        """Return extra state attributes."""
        settings = self.coordinator.settings_summary
        
        # Add raw numeric values for automation use
        return {
            CARD_SOURCE_ATTR: CARD_SOURCE_VALUE,
            'latitude': round(self.coordinator.latitude, 6),
            'longitude': round(self.coordinator.longitude, 6),
            'latitude_with_direction': self._format_latitude(),
            'longitude_with_direction': self._format_longitude(),
            'source': _location_source_label(self.coordinator.location_source_effective),
            'location_source': self.coordinator.location_source,
            'location_zone_entity': self.coordinator.location_zone_entity,
            'location_name': self.coordinator.location_name,
            'house_angle': self.coordinator.house_angle,
            'ceiling_tilt': self.coordinator.ceiling_tilt,
            'roof_direction': self.coordinator.roof_direction,
            'update_interval_min': self.coordinator.update_interval_min,
            'configuration': {
                'house_angle': settings['angles']['house_angle'],
                'ceiling_tilt': settings['angles']['ceiling_tilt'],
                'roof_direction': settings['angles']['roof_direction'],
                'update_interval_min': settings['update_interval_min'],
                'latitude': settings['location']['latitude'],
                'longitude': settings['location']['longitude'],
                'location_source': settings['location']['source'],
                'location_zone_entity': settings['location']['zone_entity'],
                'location_name': settings['location']['name'],
            }
        }
    
    def _format_latitude(self) -> str:
        """Format latitude with N/S direction."""
        lat = self.coordinator.latitude
        direction = "N" if lat >= 0 else "S"
        return f"{abs(lat):.6f}° {direction}"
    
    def _format_longitude(self) -> str:
        """Format longitude with E/W direction."""
        lon = self.coordinator.longitude
        direction = "E" if lon >= 0 else "W"
        return f"{abs(lon):.6f}° {direction}"
    
    @property
    def available(self) -> bool:
        """Return True if entity is available."""
        return self.coordinator.last_update_success


class SunWallIntensityCoordinator(DataUpdateCoordinator):
    def __init__(self, hass: HomeAssistant, config_entry: ConfigEntry, version: str) -> None:
        """Initialize."""
        self.hass = hass
        self.config_entry = config_entry
        self._version = version  # Store the version
        
        # Merge config data and options (options take precedence)
        merged_config = {**config_entry.data, **config_entry.options}

        # Location selection:
        # 1) Home Assistant home (default)
        # 2) Selected zone entity (with safe fallback to Home if missing/invalid)
        self.location_zone_entity = merged_config.get(
            CONF_LOCATION_ZONE_ENTITY, DEFAULT_LOCATION_ZONE_ENTITY
        )
        if self.location_zone_entity in ("", None):
            self.location_zone_entity = None

        self.location_source = merged_config.get(CONF_LOCATION_SOURCE)

        # Keep legacy custom-lat/lon support if an old entry still uses advanced mode.
        self.advanced_mode = merged_config.get(CONF_ADVANCED_MODE, False)
        if self.location_zone_entity:
            self.location_source = LOCATION_SOURCE_ZONE
        elif self.advanced_mode and (
            CONF_LATITUDE in merged_config and CONF_LONGITUDE in merged_config
        ):
            self.location_source = "legacy_custom"
        else:
            self.location_source = LOCATION_SOURCE_HOME_ASSISTANT

        self.location_source_effective = LOCATION_SOURCE_HOME_ASSISTANT
        self.location_name = hass.config.location_name or "Home"
        self.latitude = float(hass.config.latitude)
        self.longitude = float(hass.config.longitude)
        self._resolve_location()
        
        self.house_angle = merged_config.get(CONF_HOUSE_ANGLE, DEFAULT_HOUSE_ANGLE)
        self.ceiling_tilt = merged_config.get(CONF_CEILING_TILT, DEFAULT_CEILING_TILT)
        self.roof_direction = merged_config.get(CONF_ROOF_DIRECTION, DEFAULT_ROOF_DIRECTION)
        self.force_sun_fallback = merged_config.get(CONF_FORCE_SUN_FALLBACK, DEFAULT_FORCE_SUN_FALLBACK)
        self.force_sun_azimuth = float(merged_config.get(CONF_FORCE_SUN_AZIMUTH, DEFAULT_FORCE_SUN_AZIMUTH))
        self.force_sun_elevation = float(merged_config.get(CONF_FORCE_SUN_ELEVATION, DEFAULT_FORCE_SUN_ELEVATION))
        self.radiation_enabled = bool(
            merged_config.get(CONF_RADIATION_ENABLED, DEFAULT_RADIATION_ENABLED)
        )
        
        # Get update interval
        self.update_interval_min = merged_config.get(
            CONF_UPDATE_INTERVAL, DEFAULT_UPDATE_INTERVAL
        )
        
        # Timezone and astral helpers
        self._tz = dt_util.get_time_zone(hass.config.time_zone)
        self._astral_location = None
        try:
            astral_location = sun_helper.get_astral_location(hass)
            # Older HA returns (location, elevation)
            if isinstance(astral_location, tuple):
                astral_location = astral_location[0]
            self._astral_location = astral_location
        except Exception as err:
            _LOGGER.warning("Unable to load astral location: %s", err)

        self._fallback_sun = {
            "azimuth": FALLBACK_SUN_AZIMUTH,
            "elevation": FALLBACK_SUN_ELEVATION,
        }

        # Statistics
        self.calculation_count = 0
        self.error_count = 0
        self.last_success_time = None
        self.general_cache_hits = 0  # Add cache hit counter
        self.optimal_cache_hits = 0  # Add optimal cache hit counter
        
        # Caching for optimal alignment (calculate once per day per mode/settings)
        self._optimal_cache_key = None
        self._optimal_cache_data = None
        
        # Cache for all calculations to prevent redundant work
        self._last_calculation_time = None
        self._last_calculation_result = None
        self._cache_duration = timedelta(seconds=30)  # Cache results for 30 seconds

        # Open-Meteo radiation cache. Stores raw daily forecast so calculations can
        # keep working if the next hourly refresh fails.
        self._radiation_cache_data = None
        self._radiation_cache_key = None
        self._radiation_cache_day = None
        self._radiation_last_fetch = None
        self._radiation_last_success = None
        self._radiation_last_error = None
        self._radiation_last_status = None
        self._radiation_fetch_attempts = 0
        self._radiation_response_tz = self._tz
        self._radiation_refresh_unsub = None
        
        super().__init__(
            hass,
            _LOGGER,
            name=DOMAIN,
            update_interval=timedelta(minutes=self.update_interval_min),
        )

    def _resolve_location(self) -> None:
        """Resolve active location coordinates from source selection."""
        home_name = self.hass.config.location_name or "Home"
        home_lat = float(self.hass.config.latitude)
        home_lon = float(self.hass.config.longitude)

        self.location_source_effective = LOCATION_SOURCE_HOME_ASSISTANT
        self.location_name = home_name
        self.latitude = home_lat
        self.longitude = home_lon

        if self.location_source == LOCATION_SOURCE_ZONE and self.location_zone_entity:
            zone_state = self.hass.states.get(self.location_zone_entity)
            if zone_state is not None and zone_state.entity_id.startswith("zone."):
                zone_lat = zone_state.attributes.get("latitude")
                zone_lon = zone_state.attributes.get("longitude")
                try:
                    self.latitude = float(zone_lat)
                    self.longitude = float(zone_lon)
                    self.location_source_effective = LOCATION_SOURCE_ZONE
                    self.location_name = (
                        zone_state.attributes.get("friendly_name")
                        or zone_state.name
                        or self.location_zone_entity.split(".", 1)[1]
                        .replace("_", " ")
                        .title()
                    )
                    return
                except (TypeError, ValueError):
                    _LOGGER.debug(
                        "Zone %s has invalid coordinates, falling back to Home location",
                        self.location_zone_entity,
                    )

            self.location_source_effective = "zone_fallback_home"
            return

        # Legacy compatibility for older entries that stored custom coordinates.
        if self.location_source == "legacy_custom":
            try:
                self.latitude = float(
                    self.config_entry.options.get(
                        CONF_LATITUDE,
                        self.config_entry.data.get(CONF_LATITUDE, home_lat),
                    )
                )
                self.longitude = float(
                    self.config_entry.options.get(
                        CONF_LONGITUDE,
                        self.config_entry.data.get(CONF_LONGITUDE, home_lon),
                    )
                )
                self.location_source_effective = "legacy_custom"
                self.location_name = "Custom coordinates"
            except (TypeError, ValueError):
                self.latitude = home_lat
                self.longitude = home_lon
                self.location_source_effective = LOCATION_SOURCE_HOME_ASSISTANT
                self.location_name = home_name

    def _get_roof_azimuth(self) -> float:
        """Return roof-facing azimuth based on house angle and roof direction preset."""
        offset = ROOF_DIRECTIONS.get(self.roof_direction, 0)
        # roof_direction is defined as the *low edge* (downslope) direction.
        # The roof-facing normal should point toward that low edge.
        return (self.house_angle + offset) % 360

    def _get_surface_azimuths(self) -> dict[str, float]:
        """Return azimuth for each surface normal."""
        base = self.house_angle
        return {
            "front": base,
            "right": (base + 90) % 360,
            "back": (base + 180) % 360,
            "left": (base + 270) % 360,
            "ceiling": self._get_roof_azimuth(),
        }

    def _current_sun_from_entity(self) -> dict[str, float] | None:
        """Return sun position from the built-in sun entity if available."""
        sun_state = self.hass.states.get("sun.sun")
        if sun_state is None:
            return None

        azimuth = sun_state.attributes.get("azimuth")
        elevation = sun_state.attributes.get("elevation")
        if azimuth is None or elevation is None:
            return None

        return {
            "azimuth": float(azimuth),
            "elevation": float(elevation),
            "timestamp": dt_util.now().isoformat(),
            "source": "sun_entity",
        }

    def _astral_sun_for_time(self, target_time: datetime) -> dict[str, float] | None:
        """Return sun position using Astral for a specific time."""
        if self._astral_location is None:
            return None
        try:
            return {
                "azimuth": float(self._astral_location.solar_azimuth(target_time)),
                "elevation": float(self._astral_location.solar_elevation(target_time)),
            }
        except Exception as err:
            _LOGGER.debug("Astral position failed: %s", err)
            return None

    def async_shutdown(self) -> None:
        """Clean up coordinator-owned listeners/timers."""
        self._cancel_radiation_refresh_timer()

    def _clear_radiation_cache(self) -> None:
        """Clear cached Open-Meteo radiation data."""
        self._radiation_cache_data = None
        self._radiation_cache_key = None
        self._radiation_cache_day = None
        self._radiation_last_fetch = None
        self._radiation_last_success = None
        self._radiation_last_error = None
        self._radiation_last_status = None
        self._radiation_fetch_attempts = 0
        self._radiation_response_tz = self._tz
        self._cancel_radiation_refresh_timer()

    def _radiation_location_key(self, target_day) -> tuple[Any, ...]:
        """Return cache identity for one location/day."""
        return (
            target_day,
            round(self.latitude, 5),
            round(self.longitude, 5),
            self.location_source_effective,
            self.location_zone_entity,
        )

    def _radiation_fetch_interval_for_sun(self, sun_elevation: float) -> timedelta:
        """Return Open-Meteo refresh interval based on whether the sun is up."""
        return (
            RADIATION_FETCH_INTERVAL_DAYLIGHT
            if _safe_float(sun_elevation) > 0
            else RADIATION_FETCH_INTERVAL_NIGHT
        )

    def _radiation_fetch_metadata(
        self,
        now: datetime,
        sun_elevation: float,
    ) -> dict[str, Any]:
        """Return user-facing Open-Meteo refresh metadata."""
        fetch_interval = self._radiation_fetch_interval_for_sun(sun_elevation)
        next_fetch_due = None
        if self._radiation_last_fetch is not None:
            next_fetch_due = (self._radiation_last_fetch + fetch_interval).isoformat()

        return {
            "sun_is_up": _safe_float(sun_elevation) > 0,
            "sun_elevation": round(_safe_float(sun_elevation), 2),
            "fetch_interval_minutes": round(fetch_interval.total_seconds() / 60, 1),
            "next_fetch_due": next_fetch_due,
        }

    def _cancel_radiation_refresh_timer(self) -> None:
        """Cancel the scheduled Open-Meteo refresh callback if one exists."""
        if self._radiation_refresh_unsub is not None:
            self._radiation_refresh_unsub()
            self._radiation_refresh_unsub = None

    def _schedule_next_radiation_refresh(
        self,
        now: datetime,
        sun_elevation: float,
    ) -> None:
        """Schedule a coordinator refresh for the next Open-Meteo fetch window."""
        self._cancel_radiation_refresh_timer()
        if not self.radiation_enabled or self._radiation_last_fetch is None:
            return

        fetch_interval = self._radiation_fetch_interval_for_sun(sun_elevation)
        target_time = self._radiation_last_fetch + fetch_interval
        minimum_target = now + timedelta(seconds=2)
        if target_time < minimum_target:
            target_time = minimum_target

        def _request_refresh(_now: datetime) -> None:
            self._radiation_refresh_unsub = None
            self.hass.async_create_task(self.async_request_refresh())

        self._radiation_refresh_unsub = async_track_point_in_time(
            self.hass,
            _request_refresh,
            target_time,
        )

    def _radiation_payload_timezone(self, payload: dict[str, Any]):
        """Return API timezone for Open-Meteo local timestamps."""
        timezone_name = payload.get("timezone") if isinstance(payload, dict) else None
        if isinstance(timezone_name, str) and timezone_name:
            try:
                api_tz = dt_util.get_time_zone(timezone_name)
            except Exception as err:  # noqa: BLE001 - invalid API timezone should only fall back
                _LOGGER.debug("Unable to resolve Open-Meteo timezone %s: %s", timezone_name, err)
            else:
                if api_tz is not None:
                    return api_tz
        return self._tz

    def _radiation_payload_series(self, payload: dict[str, Any]) -> tuple[str, dict[str, Any]]:
        """Return the preferred Open-Meteo forecast series from a payload."""
        if isinstance(payload.get(RADIATION_FORECAST_KEY), dict):
            return RADIATION_FORECAST_KEY, payload[RADIATION_FORECAST_KEY]
        if isinstance(payload.get(RADIATION_FORECAST_FALLBACK_KEY), dict):
            return RADIATION_FORECAST_FALLBACK_KEY, payload[RADIATION_FORECAST_FALLBACK_KEY]
        return RADIATION_FORECAST_KEY, {}

    def _validate_radiation_payload(self, payload: dict[str, Any]) -> None:
        """Validate the Open-Meteo radiation response before caching it."""
        if not isinstance(payload, dict) or not payload:
            raise UpdateFailed("Open-Meteo response was empty or malformed")

        series_name, forecast = self._radiation_payload_series(payload)
        if not isinstance(forecast, dict) or not forecast:
            raise UpdateFailed("Open-Meteo response did not include 15-minute radiation data")

        times = forecast.get("time")
        if not isinstance(times, list) or not times:
            raise UpdateFailed(f"Open-Meteo {series_name} time data was missing or empty")

        expected_len = len(times)
        for field in RADIATION_FIELDS:
            series = forecast.get(field)
            if not isinstance(series, list):
                raise UpdateFailed(f"Open-Meteo {series_name} radiation field missing: {field}")
            if len(series) != expected_len:
                raise UpdateFailed(
                    f"Open-Meteo {series_name} radiation field length mismatch for {field}: "
                    f"expected {expected_len}, got {len(series)}"
                )

        current = payload.get("current")
        if current is not None:
            if not isinstance(current, dict):
                raise UpdateFailed("Open-Meteo current radiation data was malformed")
            missing_current = [field for field in RADIATION_FIELDS if field not in current]
            if missing_current:
                raise UpdateFailed(
                    "Open-Meteo current radiation fields missing: "
                    + ", ".join(missing_current)
                )

    async def _async_fetch_radiation_payload(self, params: dict[str, Any]) -> dict[str, Any]:
        """Fetch and validate Open-Meteo radiation data with transient retries."""
        session = async_get_clientsession(self.hass)
        last_error = "Open-Meteo fetch failed"
        self._radiation_fetch_attempts = 0

        for attempt, delay in enumerate(OPEN_METEO_RETRY_DELAYS, start=1):
            if delay:
                await asyncio.sleep(delay)

            self._radiation_fetch_attempts = attempt
            self._radiation_last_status = None

            try:
                async with session.get(
                    OPEN_METEO_FORECAST_URL,
                    params=params,
                    timeout=ClientTimeout(total=8),
                ) as response:
                    self._radiation_last_status = response.status
                    if response.status != 200:
                        last_error = f"Open-Meteo returned HTTP {response.status}"
                        self._radiation_last_error = last_error
                        if (
                            response.status in OPEN_METEO_TRANSIENT_STATUSES
                            and attempt < len(OPEN_METEO_RETRY_DELAYS)
                        ):
                            continue
                        raise UpdateFailed(last_error)

                    try:
                        payload = await response.json()
                    except Exception as err:  # noqa: BLE001 - malformed JSON can be transient
                        last_error = f"Open-Meteo returned malformed JSON: {err}"
                        self._radiation_last_error = last_error
                        if attempt < len(OPEN_METEO_RETRY_DELAYS):
                            continue
                        raise UpdateFailed(last_error) from err

                if not isinstance(payload, dict) or not payload:
                    last_error = "Open-Meteo returned empty or malformed JSON"
                    self._radiation_last_error = last_error
                    if attempt < len(OPEN_METEO_RETRY_DELAYS):
                        continue
                    raise UpdateFailed(last_error)

                self._validate_radiation_payload(payload)
                self._radiation_last_error = None
                return payload

            except UpdateFailed:
                raise
            except (ClientError, TimeoutError, asyncio.TimeoutError) as err:
                last_error = f"Open-Meteo transient fetch error: {err or type(err).__name__}"
                self._radiation_last_error = last_error
                if attempt >= len(OPEN_METEO_RETRY_DELAYS):
                    raise UpdateFailed(last_error) from err

        raise UpdateFailed(last_error)

    async def _async_ensure_radiation_cache(
        self,
        now: datetime,
        sun_elevation: float,
    ) -> str:
        """Fetch radiation data when needed and return cache source status."""
        target_day = now.date()
        cache_key = self._radiation_location_key(target_day)
        fetch_interval = self._radiation_fetch_interval_for_sun(sun_elevation)
        due_for_fetch = (
            self._radiation_cache_data is None
            or self._radiation_cache_key != cache_key
            or self._radiation_last_fetch is None
            or (now - self._radiation_last_fetch) >= fetch_interval
        )

        if not due_for_fetch:
            return "open_meteo_cached"

        self._radiation_last_fetch = now
        params = {
            "latitude": round(self.latitude, 6),
            "longitude": round(self.longitude, 6),
            "minutely_15": ",".join(RADIATION_FIELDS),
            "timezone": "auto",
            "forecast_days": 1,
        }

        try:
            payload = await self._async_fetch_radiation_payload(params)
            self._radiation_cache_data = payload
            self._radiation_cache_key = cache_key
            self._radiation_cache_day = target_day
            self._radiation_last_success = now
            self._radiation_response_tz = self._radiation_payload_timezone(payload)
            self._radiation_last_error = None
            return "open_meteo"
        except Exception as err:  # noqa: BLE001 - network/cache failure should not break core sensors
            self._radiation_last_error = str(err)
            _LOGGER.warning("Open-Meteo radiation fetch failed: %s", err)
            if (
                self._radiation_cache_data is not None
                and self._radiation_cache_key == cache_key
            ):
                return "open_meteo_stale_cache"
            return "unavailable"

    def _hourly_radiation_rows(self, target_day=None) -> list[dict[str, Any]]:
        """Return parsed 15-minute radiation rows from the cached Open-Meteo payload."""
        if not self._radiation_cache_data:
            return []

        _, forecast = self._radiation_payload_series(self._radiation_cache_data)
        times = forecast.get("time") or []
        rows: list[dict[str, Any]] = []
        for index, raw_time in enumerate(times):
            timestamp = _parse_forecast_time(raw_time, self._radiation_response_tz or self._tz)
            if timestamp is None:
                continue
            if target_day is not None and timestamp.date() != target_day:
                continue

            values = {"timestamp": timestamp}
            for field in RADIATION_FIELDS:
                series = forecast.get(field) or []
                values[field] = _safe_float(series[index]) if index < len(series) else 0.0
            rows.append(values)
        return rows

    def _radiation_values_for_time(self, target_time: datetime) -> dict[str, float] | None:
        """Return current/nearest-hour radiation values from the cached day forecast."""
        if not self._radiation_cache_data:
            return None

        current = self._radiation_cache_data.get("current") or {}
        current_time = _parse_forecast_time(
            str(current.get("time", "")), self._radiation_response_tz or self._tz
        )
        if current_time is not None and abs((target_time - current_time).total_seconds()) <= 45 * 60:
            return {field: _safe_float(current.get(field)) for field in RADIATION_FIELDS}

        rows = self._hourly_radiation_rows(target_time.date())
        if not rows:
            return None
        nearest = min(rows, key=lambda row: abs((target_time - row["timestamp"]).total_seconds()))
        return {field: _safe_float(nearest.get(field)) for field in RADIATION_FIELDS}

    def _surface_radiation_components(
        self,
        values: dict[str, float],
        sun_azimuth: float,
        sun_elevation: float,
        surface_azimuth: float,
        surface_tilt: float,
    ) -> dict[str, float]:
        """Calculate direct/diffuse/reflected radiation received by a surface."""
        tilt_rad = math.radians(surface_tilt)
        sun_az_rad = math.radians(sun_azimuth)
        sun_el_rad = math.radians(sun_elevation)
        surface_az_rad = math.radians(surface_azimuth)

        sun_vector = (
            math.cos(sun_el_rad) * math.sin(sun_az_rad),
            math.sin(sun_el_rad),
            math.cos(sun_el_rad) * math.cos(sun_az_rad),
        )
        surface_normal = (
            math.sin(tilt_rad) * math.sin(surface_az_rad),
            math.cos(tilt_rad),
            math.sin(tilt_rad) * math.cos(surface_az_rad),
        )
        dot_value = sum(a * b for a, b in zip(sun_vector, surface_normal))

        direct = values["direct_normal_irradiance"] * max(0.0, dot_value)
        diffuse = values["diffuse_radiation"] * ((1 + math.cos(tilt_rad)) / 2)
        reflected = values["shortwave_radiation"] * GROUND_ALBEDO * ((1 - math.cos(tilt_rad)) / 2)
        if sun_elevation <= 0:
            direct = 0.0

        return {
            "radiation": max(0.0, direct + diffuse + reflected),
            "direct_component": max(0.0, direct),
            "diffuse_component": max(0.0, diffuse),
            "reflected_component": max(0.0, reflected),
            "incidence_factor": max(0.0, dot_value),
        }

    def _surface_sun_position_for_row(self, row: dict[str, Any]) -> dict[str, float] | None:
        """Return sun position for a forecast row."""
        return calculate_sun_angle(
            row["timestamp"],
            solar_position_fn=self._astral_sun_for_time,
            tz=self._tz,
            fallback=self._fallback_sun,
        )

    async def _async_calculate_radiation(
        self,
        now: datetime,
        sun_data: dict[str, float],
        surface_azimuths: dict[str, float],
    ) -> dict[str, Any]:
        """Calculate radiation values from cached Open-Meteo data."""
        if not self.radiation_enabled:
            return {"enabled": False, "available": False, "source": "disabled"}

        source = await self._async_ensure_radiation_cache(
            now, _safe_float(sun_data.get("elevation"))
        )
        sun_elevation = _safe_float(sun_data.get("elevation"))
        fetch_metadata = self._radiation_fetch_metadata(now, sun_elevation)
        self._schedule_next_radiation_refresh(now, sun_elevation)
        data_age_minutes = None
        if self._radiation_last_success is not None:
            data_age_minutes = round((now - self._radiation_last_success).total_seconds() / 60, 1)

        if self._radiation_cache_data is None or source == "unavailable":
            return {
                "enabled": True,
                "available": False,
                "source": "unavailable",
                "last_fetch": self._radiation_last_fetch.isoformat() if self._radiation_last_fetch else None,
                "last_success": self._radiation_last_success.isoformat() if self._radiation_last_success else None,
                "data_age_minutes": data_age_minutes,
                "last_error": self._radiation_last_error,
                "last_status": self._radiation_last_status,
                "fetch_attempts": self._radiation_fetch_attempts,
                "api_timezone": str(self._radiation_response_tz) if self._radiation_response_tz else None,
                **fetch_metadata,
            }

        current_values = self._radiation_values_for_time(now)
        if current_values is None:
            return {
                "enabled": True,
                "available": False,
                "source": source,
                "last_fetch": self._radiation_last_fetch.isoformat() if self._radiation_last_fetch else None,
                "last_success": self._radiation_last_success.isoformat() if self._radiation_last_success else None,
                "data_age_minutes": data_age_minutes,
                "last_error": "No current radiation values available in cached forecast",
                "last_status": self._radiation_last_status,
                "fetch_attempts": self._radiation_fetch_attempts,
                "api_timezone": str(self._radiation_response_tz) if self._radiation_response_tz else None,
                **fetch_metadata,
            }

        surface_defs: dict[str, dict[str, Any]] = {
            "front": {"azimuth": surface_azimuths["front"], "tilt": 90.0, "kind": "wall"},
            "right": {"azimuth": surface_azimuths["right"], "tilt": 90.0, "kind": "wall"},
            "back": {"azimuth": surface_azimuths["back"], "tilt": 90.0, "kind": "wall"},
            "left": {"azimuth": surface_azimuths["left"], "tilt": 90.0, "kind": "wall"},
            "ceiling": {
                "azimuth": surface_azimuths["ceiling"],
                "tilt": float(self.ceiling_tilt),
                "kind": "roof",
            },
        }

        hourly_rows = self._hourly_radiation_rows(now.date())
        surfaces: dict[str, dict[str, Any]] = {}
        for surface, definition in surface_defs.items():
            current = self._surface_radiation_components(
                current_values,
                sun_data["azimuth"],
                sun_data["elevation"],
                definition["azimuth"],
                definition["tilt"],
            )

            max_radiation = 0.0
            peak_time = None
            max_direct_radiation = 0.0
            peak_direct_time = None
            for row in hourly_rows:
                row_sun = self._surface_sun_position_for_row(row)
                if row_sun is None:
                    continue
                row_components = self._surface_radiation_components(
                    row,
                    row_sun["azimuth"],
                    row_sun["elevation"],
                    definition["azimuth"],
                    definition["tilt"],
                )
                if row_components["radiation"] > max_radiation:
                    max_radiation = row_components["radiation"]
                    peak_time = row["timestamp"]
                if row_components["direct_component"] > max_direct_radiation:
                    max_direct_radiation = row_components["direct_component"]
                    peak_direct_time = row["timestamp"]

            radiation_percentage = 0.0
            if max_radiation > 0:
                radiation_percentage = _clamp(current["radiation"] / max_radiation * 100, 0.0, 100.0)

            direct_radiation_percentage = 0.0
            if max_direct_radiation > 0:
                direct_radiation_percentage = _clamp(
                    current["direct_component"] / max_direct_radiation * 100, 0.0, 100.0
                )

            shading_demand = None
            if definition["kind"] == "wall":
                elevation_factor = _interp_curve(float(sun_data["elevation"]), ELEVATION_COMFORT_CURVE)
                shading_demand = _clamp(direct_radiation_percentage * elevation_factor, 0.0, 100.0)

            minutes_to_peak = None
            if peak_time is not None:
                minutes_to_peak = round((peak_time - now).total_seconds() / 60, 1)

            minutes_to_peak_direct = None
            if peak_direct_time is not None:
                minutes_to_peak_direct = round((peak_direct_time - now).total_seconds() / 60, 1)

            surfaces[surface] = {
                "radiation": round(current["radiation"], 1),
                "radiation_percentage": round(radiation_percentage, 1),
                "shading_demand": round(shading_demand, 1) if shading_demand is not None else None,
                "max_radiation_today": round(max_radiation, 1),
                "peak_radiation_time": peak_time.isoformat() if peak_time else None,
                "minutes_to_peak_radiation": minutes_to_peak,
                "direct_radiation": round(current["direct_component"], 1),
                "direct_radiation_percentage": round(direct_radiation_percentage, 1),
                "max_direct_radiation_today": round(max_direct_radiation, 1),
                "peak_direct_radiation_time": peak_direct_time.isoformat() if peak_direct_time else None,
                "minutes_to_peak_direct_radiation": minutes_to_peak_direct,
                "surface_azimuth": round(definition["azimuth"], 2),
                "surface_tilt": round(definition["tilt"], 2),
                "direct_component": round(current["direct_component"], 1),
                "diffuse_component": round(current["diffuse_component"], 1),
                "reflected_component": round(current["reflected_component"], 1),
                "incidence_factor": round(current["incidence_factor"], 3),
            }

        return {
            "enabled": True,
            "available": True,
            "source": source,
            "current": {field: round(current_values[field], 1) for field in RADIATION_FIELDS},
            "surfaces": surfaces,
            "last_fetch": self._radiation_last_fetch.isoformat() if self._radiation_last_fetch else None,
            "last_success": self._radiation_last_success.isoformat() if self._radiation_last_success else None,
            "data_age_minutes": data_age_minutes,
            "last_error": self._radiation_last_error,
            "last_status": self._radiation_last_status,
            "fetch_attempts": self._radiation_fetch_attempts,
            "api_timezone": str(self._radiation_response_tz) if self._radiation_response_tz else None,
            **fetch_metadata,
            "location": {
                "latitude": round(self.latitude, 6),
                "longitude": round(self.longitude, 6),
                "source": _location_source_label(self.location_source_effective),
                "name": self.location_name,
            },
            "ground_albedo": GROUND_ALBEDO,
        }

    async def _async_update_data(self):
        """Update data via library."""
        try:
            prev_location = (
                self.latitude,
                self.longitude,
                self.location_source_effective,
                self.location_zone_entity,
            )
            self._resolve_location()
            if (
                self.latitude,
                self.longitude,
                self.location_source_effective,
                self.location_zone_entity,
            ) != prev_location:
                # Location changed (for example selected zone removed/updated), clear caches.
                self._optimal_cache_key = None
                self._optimal_cache_data = None
                self._last_calculation_result = None
                self._last_calculation_time = None
                self._clear_radiation_cache()

            # Check cache first (prevent redundant calculations)
            now = dt_util.now()
            if (self._last_calculation_time and 
                self._last_calculation_result and
                (now - self._last_calculation_time) < self._cache_duration):
                _LOGGER.debug("Using cached calculation result")
                self.general_cache_hits += 1  # Track cache hit
                return self._last_calculation_result
            
            # Get current sun position (forced fallback optional)
            if self.force_sun_fallback:
                sun_data = {
                    "azimuth": float(self.force_sun_azimuth),
                    "elevation": float(self.force_sun_elevation),
                    "timestamp": now.isoformat(),
                    "source": "forced",
                }
            else:
                sun_data = self._current_sun_from_entity()
                if sun_data is None:
                    sun_data = calculate_sun_angle(
                        now,
                        solar_position_fn=self._astral_sun_for_time,
                        tz=self._tz,
                        fallback=self._fallback_sun,
                    )

            if sun_data is None:
                raise UpdateFailed("Sun position unavailable")

            surface_azimuths = self._get_surface_azimuths()

            # Calculate wall intensities (inline, lightweight math)
            wall_data = {}
            for wall in WALLS:
                surface_azimuth = surface_azimuths[wall]
                if wall == "ceiling":
                    intensity = angle_to_percentage(
                        sun_data["azimuth"],
                        surface_azimuth,
                        wall,
                        sun_data["elevation"],
                        self.ceiling_tilt,
                    )
                else:
                    intensity = angle_to_percentage(
                        sun_data["azimuth"],
                        surface_azimuth,
                        wall,
                        sun_data["elevation"],
                        0,
                    )
                wall_data[wall] = round(intensity, 2)
            
            
            # Calculate optimal alignment WITH CACHING (once per day)
            today = now.date()
            roof_azimuth = surface_azimuths["ceiling"]

            # Build cache key (date + settings + force sun mode)
            if self.force_sun_fallback:
                optimal_fallback = {
                    "azimuth": float(self.force_sun_azimuth),
                    "elevation": float(self.force_sun_elevation),
                }
                optimal_solar_fn = None  # use fallback only
                optimal_cache_key = (
                    today,
                    "forced",
                    round(self.force_sun_azimuth, 3),
                    round(self.force_sun_elevation, 3),
                    round(roof_azimuth, 3),
                    round(self.ceiling_tilt, 3),
                )
            else:
                optimal_fallback = self._fallback_sun
                optimal_solar_fn = self._astral_sun_for_time
                optimal_cache_key = (
                    today,
                    "astral",
                    round(roof_azimuth, 3),
                    round(self.ceiling_tilt, 3),
                )

            if (self._optimal_cache_key != optimal_cache_key or 
                self._optimal_cache_data is None):

                _LOGGER.debug("Calculating optimal alignment for date: %s", today)
                self._optimal_cache_data = await self.hass.async_add_executor_job(
                    calculate_optimal_alignment_time,
                    optimal_solar_fn,
                    roof_azimuth,
                    self.ceiling_tilt,
                    today,
                    self._tz,
                    self.latitude,
                    optimal_fallback,
                )
                self._optimal_cache_key = optimal_cache_key
                optimal_cache_hit = False
            else:
                _LOGGER.debug("Using cached optimal alignment data")
                self.optimal_cache_hits += 1  # Track optimal cache hit
                optimal_cache_hit = True
            
            optimal_data = self._optimal_cache_data.copy()  # Make a copy so we don't modify cache

            # Update current values with actual current time (not cached time)
            current_intensity = angle_to_percentage(
                sun_data["azimuth"],
                roof_azimuth,
                "ceiling",
                sun_data["elevation"],
                self.ceiling_tilt,
            )

            if optimal_data and optimal_data.get('max_intensity_today', 0) > 0:
                max_intensity = optimal_data['max_intensity_today']
                current_percentage = (current_intensity / max_intensity) * 100
                current_percentage = max(0.0, min(100.0, current_percentage))
                
                # Determine status
                optimal_time = optimal_data.get('optimal_time')
                if optimal_time:
                    # Both now and optimal_time are timezone-aware
                    # They should be in the same timezone (Home Assistant's timezone)
                    time_diff = (optimal_time - now).total_seconds() / 60
                    intensity_ratio = current_intensity / max_intensity
                    
                    if abs(time_diff) < 20 and intensity_ratio >= 0.9:
                        status = "at_peak"
                    elif time_diff > 0:
                        status = "approaching"
                    else:
                        status = "declining"
                else:
                    status = "unknown"
                    time_diff = 0
                
                # Update with current values
                optimal_data.update({
                    'current_percentage': round(current_percentage, 1),
                    'current_intensity': round(current_intensity, 1),
                    'current_elevation': round(sun_data['elevation'], 2),
                    'current_azimuth': round(sun_data['azimuth'], 2),
                    'status': status,
                    'minutes_to_optimal': round(time_diff, 1)
                })

            radiation_data = await self._async_calculate_radiation(
                now, sun_data, surface_azimuths
            )
            
            # Update statistics
            self.calculation_count += 1
            self.last_success_time = now
            
            # Build result
            result = {
                'sun_position': sun_data,
                'wall_intensities': wall_data,
                'optimal_alignment': optimal_data,
                'radiation': radiation_data,
                'last_updated': now.isoformat(),
                'statistics': {
                    'calculation_count': self.calculation_count,
                    'error_count': self.error_count,
                    'general_cache_hits': self.general_cache_hits,  # Include in stats
                    'optimal_cache_hits': self.optimal_cache_hits,  # Include in stats
                    'update_interval': self.update_interval_min,
                    'cache_hit': optimal_cache_hit
                }
            }
            
            # Cache the result
            self._last_calculation_time = now
            self._last_calculation_result = result
            
            return result
            
        except Exception as err:
            self.error_count += 1
            # Clear cache on error
            self._last_calculation_result = None
            self._last_calculation_time = None
            
            _LOGGER.error("Error calculating sun data: %s", err, exc_info=True)
            raise UpdateFailed(f"Error communicating with API: {err}")

    @property
    def settings_summary(self):
        """Return a summary of all settings for device info."""
        return {
            "location": {
                "latitude": round(self.latitude, 6),
                "longitude": round(self.longitude, 6),
                "source": _location_source_label(self.location_source_effective),
                "selected_source": self.location_source,
                "zone_entity": self.location_zone_entity,
                "name": self.location_name,
            },
            "angles": {
                "house_angle": self.house_angle,
                "ceiling_tilt": self.ceiling_tilt,
                "roof_direction": self.roof_direction,
            },
            "update_interval_min": self.update_interval_min,
            "advanced_mode": self.advanced_mode,
            "radiation_enabled": self.radiation_enabled,
        }
    
    @property
    def device_info(self):
      """Return device information for sensors."""
      return {
          "identifiers": {(DOMAIN, self.config_entry.entry_id)},
          "name": "Sunlight Visualizer",
          "manufacturer": "NoUsername10",
          "model": "Sunlight Visualizer Calculator",
          "sw_version": f"Version {self._version}",
          "configuration_url": f"homeassistant://config/integration/integration/{DOMAIN}",
          "suggested_area": "Outside",
        }
        
    def update_settings(
        self,
        house_angle=None,
        ceiling_tilt=None,
        roof_direction=None,
        update_interval_min=None,
    ):
        """Update settings and notify entities.
        
        This method should be called whenever settings are changed
        from the Number entities or configuration flow.
        """
        if house_angle is not None:
            self.house_angle = house_angle
        if ceiling_tilt is not None:
            self.ceiling_tilt = ceiling_tilt
        if roof_direction is not None:
            self.roof_direction = roof_direction
        if update_interval_min is not None:
            self.update_interval_min = update_interval_min
            self.update_interval = timedelta(minutes=update_interval_min)
        
        # Clear optimal alignment cache when settings change
        # Otherwise we'll use max intensity calculated with old settings
        self._optimal_cache_key = None
        self._optimal_cache_data = None
        self._last_calculation_time = None  # Also clear general cache
        
        # Reset cache hit counters since cache is now invalid
        self.general_cache_hits = 0
        self.optimal_cache_hits = 0
        
        # Notify all entities to update their state
        self.async_update_listeners()


class SunWallIntensitySensor(CoordinatorEntity, SensorEntity):
    """Representation of a Sunlight Visualizer sensor."""

    def __init__(
        self,
        coordinator: SunWallIntensityCoordinator,
        config_entry: ConfigEntry,
        wall: str,
    ) -> None:
        """Initialize the sensor."""
        super().__init__(coordinator)
        self._wall = wall
        self._config_entry = config_entry
        self._attr_name = f"{_surface_friendly_prefix(wall)} Sun Alignment"
        self._attr_unique_id = f"{config_entry.entry_id}_{wall}"
        self._attr_state_class = SensorStateClass.MEASUREMENT
        self._attr_native_unit_of_measurement = PERCENTAGE
        self._attr_icon = "mdi:home-import-outline"
        self._attr_suggested_display_precision = 1

    @property
    def device_info(self) -> dict[str, Any]:
        """Return device information."""
        return self.coordinator.device_info

    @property
    def native_value(self) -> float | None:
        """Return the native value of the sensor."""
        if self.coordinator.data is None:
            return None
        return self.coordinator.data['wall_intensities'].get(self._wall)

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        """Return extra state attributes."""
        if self.coordinator.data is None:
            return {CARD_SOURCE_ATTR: CARD_SOURCE_VALUE}
        
        sun_pos = self.coordinator.data['sun_position']
        return {
            CARD_SOURCE_ATTR: CARD_SOURCE_VALUE,
            'sun_elevation': round(sun_pos['elevation'], 2),
            'sun_azimuth': round(sun_pos['azimuth'], 2),
            'house_angle': self.coordinator.house_angle,
            'force_sun_fallback': self.coordinator.force_sun_fallback,
            'force_sun_azimuth': round(self.coordinator.force_sun_azimuth, 2),
            'force_sun_elevation': round(self.coordinator.force_sun_elevation, 2),
            'roof_power_entity': (
                self._config_entry.options.get(CONF_ROOF_POWER_ENTITY)
                or self._config_entry.data.get(CONF_ROOF_POWER_ENTITY)
            ),
            'roof_power_enabled': (
                self._config_entry.options.get(CONF_ROOF_POWER_ENABLED)
                if self._config_entry.options.get(CONF_ROOF_POWER_ENABLED) is not None
                else self._config_entry.data.get(CONF_ROOF_POWER_ENABLED)
            ),
            'roof_power_invert': (
                self._config_entry.options.get(CONF_ROOF_POWER_INVERT)
                if self._config_entry.options.get(CONF_ROOF_POWER_INVERT) is not None
                else self._config_entry.data.get(CONF_ROOF_POWER_INVERT)
            ),
            'auto_rotate_speed': (
                self._config_entry.options.get(CONF_AUTO_ROTATE_SPEED)
                if self._config_entry.options.get(CONF_AUTO_ROTATE_SPEED) is not None
                else self._config_entry.data.get(CONF_AUTO_ROTATE_SPEED, DEFAULT_AUTO_ROTATE_SPEED)
            ),
            'fixed_sun_azimuth': (
                self._config_entry.options.get(CONF_FIXED_SUN_AZIMUTH)
                if self._config_entry.options.get(CONF_FIXED_SUN_AZIMUTH) is not None
                else self._config_entry.data.get(
                    CONF_FIXED_SUN_AZIMUTH,
                    DEFAULT_FIXED_SUN_AZIMUTH,
                )
            ),
            'fixed_sun_rotation_enabled': (
                self._config_entry.options.get(CONF_FIXED_SUN_ROTATION_ENABLED)
                if self._config_entry.options.get(CONF_FIXED_SUN_ROTATION_ENABLED) is not None
                else self._config_entry.data.get(
                    CONF_FIXED_SUN_ROTATION_ENABLED,
                    DEFAULT_FIXED_SUN_ROTATION_ENABLED
                )
            ),
            'wall': self._wall,
            'last_updated': self.coordinator.data.get('last_updated', ''),
            'calculation_count': self.coordinator.calculation_count
        }

    @property
    def available(self) -> bool:
        """Return True if entity is available."""
        return self.coordinator.last_update_success


class WallSunAngleSensor(CoordinatorEntity, SensorEntity):
    """Window-entry sun angle for a wall."""

    def __init__(
        self,
        coordinator: SunWallIntensityCoordinator,
        config_entry: ConfigEntry,
        wall: str,
    ) -> None:
        """Initialize the sensor."""
        super().__init__(coordinator)
        self._wall = wall
        self._attr_name = f"{_surface_friendly_prefix(wall)} Sun Angle"
        self._attr_unique_id = f"{config_entry.entry_id}_{wall}_wall_sun_angle"
        self._attr_suggested_object_id = f"{wall}_wall_sun_angle"
        self._attr_state_class = SensorStateClass.MEASUREMENT
        self._attr_native_unit_of_measurement = "°"
        self._attr_icon = "mdi:angle-acute"
        self._attr_suggested_display_precision = 1
        device_class = getattr(SensorDeviceClass, "ANGLE", None)
        if device_class is not None:
            self._attr_device_class = device_class

    @property
    def device_info(self) -> dict[str, Any]:
        """Return device information."""
        return self.coordinator.device_info

    @property
    def native_value(self) -> float | None:
        """Return the wall sun-entry angle in degrees."""
        return _wall_sun_angle_details(self.coordinator, self._wall)["wall_sun_angle"]

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        """Return extra state attributes."""
        details = _wall_sun_angle_details(self.coordinator, self._wall)
        active = bool(details["sun_on_wall"])
        details.update({
            CARD_SOURCE_ATTR: CARD_SOURCE_VALUE,
            "wall": self._wall,
            "meaning": (
                "Vertical light-entry angle through this wall/window. Higher values mean lower sun and deeper room penetration."
                if active
                else "No active sun-entry angle for this wall right now."
            ),
            "automation_hint": (
                "For blinds without weather data, combine this with wall sunlight, for example: sunlight > 20% and sun angle > 45°."
                if active
                else "Treat 0° as no direct wall/window entry for automation purposes."
            ),
            "last_updated": self.coordinator.data.get("last_updated", "") if self.coordinator.data else "",
        })
        return details

    @property
    def available(self) -> bool:
        """Return True if entity is available."""
        return self.coordinator.last_update_success


class CeilingIntensitySensor(SunWallIntensitySensor):
    """Representation of a Ceiling Intensity sensor with tilt."""
    
    def __init__(
        self,
        coordinator: SunWallIntensityCoordinator,
        config_entry: ConfigEntry,
        wall: str,
    ) -> None:
        """Initialize the sensor."""
        super().__init__(coordinator, config_entry, wall)
        self._attr_name = "Roof Sun Alignment"
        self._attr_unique_id = f"{config_entry.entry_id}_ceiling"
        self._attr_icon = "mdi:home-sound-in-outline"

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        """Return extra state attributes."""
        attrs = super().extra_state_attributes
        attrs['ceiling_tilt'] = self.coordinator.ceiling_tilt
        attrs['optimal_time'] = self._get_optimal_time()
        return attrs
    
    def _get_optimal_time(self) -> str:
        """Get optimal time from coordinator data."""
        if (self.coordinator.data is None or 
            'optimal_alignment' not in self.coordinator.data):
            return "Not available"
        
        opt_data = self.coordinator.data['optimal_alignment']
        if opt_data.get('optimal_time'):
            return opt_data['optimal_time'].strftime("%H:%M")
        return "Not found"


class RadiationSensorBase(CoordinatorEntity, SensorEntity):
    """Base class for Open-Meteo radiation sensors."""

    def __init__(self, coordinator: SunWallIntensityCoordinator, config_entry: ConfigEntry) -> None:
        """Initialize the radiation sensor."""
        super().__init__(coordinator)
        self._config_entry = config_entry
        self._attr_state_class = SensorStateClass.MEASUREMENT

    @property
    def device_info(self) -> dict[str, Any]:
        """Return device information."""
        return self.coordinator.device_info

    @property
    def _radiation_data(self) -> dict[str, Any]:
        """Return radiation payload from coordinator data."""
        if self.coordinator.data is None:
            return {}
        return self.coordinator.data.get("radiation", {}) or {}

    @property
    def available(self) -> bool:
        """Return True if entity is available."""
        radiation = self._radiation_data
        return bool(
            self.coordinator.last_update_success
            and radiation.get("enabled")
            and radiation.get("available")
        )

    def _radiation_attrs(self) -> dict[str, Any]:
        """Return common radiation metadata attributes."""
        radiation = self._radiation_data
        location = radiation.get("location", {}) or {}
        return {
            CARD_SOURCE_ATTR: CARD_SOURCE_VALUE,
            "radiation_enabled": radiation.get("enabled", False),
            "radiation_source": radiation.get("source"),
            "radiation_data_age_minutes": radiation.get("data_age_minutes"),
            "radiation_last_fetch": radiation.get("last_fetch"),
            "radiation_last_success": radiation.get("last_success"),
            "radiation_last_error": radiation.get("last_error"),
            "radiation_last_status": radiation.get("last_status"),
            "radiation_fetch_attempts": radiation.get("fetch_attempts"),
            "radiation_api_timezone": radiation.get("api_timezone"),
            "radiation_sun_is_up": radiation.get("sun_is_up"),
            "radiation_sun_elevation": radiation.get("sun_elevation"),
            "radiation_fetch_interval_minutes": radiation.get("fetch_interval_minutes"),
            "radiation_next_fetch_due": radiation.get("next_fetch_due"),
            "ground_albedo": radiation.get("ground_albedo"),
            "location_source": location.get("source"),
            "location_name": location.get("name"),
            "latitude": location.get("latitude"),
            "longitude": location.get("longitude"),
            "last_updated": self.coordinator.data.get("last_updated", "") if self.coordinator.data else "",
        }


class OpenMeteoRadiationStatusSensor(RadiationSensorBase):
    """Diagnostic status of the Open-Meteo radiation API/cache."""

    def __init__(
        self,
        coordinator: SunWallIntensityCoordinator,
        config_entry: ConfigEntry,
    ) -> None:
        """Initialize the sensor."""
        super().__init__(coordinator, config_entry)
        self._attr_name = "Open-Meteo Radiation Status"
        # Keep the very new data-age unique ID stable so existing dev installs rename cleanly.
        self._attr_unique_id = f"{config_entry.entry_id}_open_meteo_radiation_data_age"
        self._attr_suggested_object_id = "open_meteo_radiation_status"
        self._attr_icon = "mdi:cloud-check-outline"
        self._attr_state_class = None
        self._attr_entity_category = EntityCategory.DIAGNOSTIC
        device_class = getattr(SensorDeviceClass, "ENUM", None)
        if device_class is not None:
            self._attr_device_class = device_class
        self._attr_options = ["OK", "Stale cache", "API error", "No data"]

    @property
    def available(self) -> bool:
        """Return True when radiation support is enabled and coordinator data exists."""
        radiation = self._radiation_data
        return bool(self.coordinator.last_update_success and radiation.get("enabled"))

    @property
    def native_value(self) -> str | None:
        """Return Open-Meteo radiation status."""
        radiation = self._radiation_data
        if not radiation.get("enabled"):
            return None
        source = radiation.get("source")
        if radiation.get("available"):
            if source == "open_meteo_stale_cache":
                return "Stale cache"
            return "OK"
        if radiation.get("last_error"):
            return "API error"
        return "No data"

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        """Return Open-Meteo update metadata."""
        attrs = self._radiation_attrs()
        status = self.native_value
        meanings = {
            "OK": "Open-Meteo radiation data is current and usable.",
            "Stale cache": "The latest fetch failed, but the integration is still using the last successful same-day forecast cache.",
            "API error": "Open-Meteo data is not currently usable. See radiation_last_error and radiation_last_status.",
            "No data": "No successful Open-Meteo radiation data is available yet.",
        }
        attrs["status"] = status
        attrs["meaning"] = meanings.get(status)
        attrs["latest_success_minutes_ago"] = self._radiation_data.get("data_age_minutes")
        attrs["daylight_fetch_interval"] = "15 minutes"
        attrs["night_fetch_interval"] = "60 minutes"
        attrs["forecast_resolution"] = "15 minutes"
        attrs["forecast_rows"] = len(self.coordinator._hourly_radiation_rows())
        return attrs

class RawRadiationSensor(RadiationSensorBase):
    """Raw Open-Meteo radiation value."""

    def __init__(
        self,
        coordinator: SunWallIntensityCoordinator,
        config_entry: ConfigEntry,
        field: str,
        name: str,
        icon: str,
    ) -> None:
        """Initialize the sensor."""
        super().__init__(coordinator, config_entry)
        self._field = field
        self._attr_name = name
        self._attr_unique_id = f"{config_entry.entry_id}_radiation_{field}"
        self._attr_suggested_object_id = RAW_RADIATION_OBJECT_IDS.get(
            field, f"open_meteo_{field}"
        )
        self._attr_icon = icon
        self._attr_native_unit_of_measurement = IRRADIANCE_UNIT
        self._attr_suggested_display_precision = 1
        device_class = getattr(SensorDeviceClass, "IRRADIANCE", None)
        if device_class is not None:
            self._attr_device_class = device_class
        self._attr_entity_category = EntityCategory.DIAGNOSTIC

    @property
    def native_value(self) -> float | None:
        """Return the current radiation value."""
        current = self._radiation_data.get("current", {}) or {}
        if self._field not in current:
            return None
        return round(_safe_float(current.get(self._field)), 1)

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        """Return extra state attributes."""
        attrs = self._radiation_attrs()
        attrs["radiation_field"] = self._field
        return attrs


class WallRadiationSensor(RadiationSensorBase):
    """Forecast-adjusted wall radiation sensor."""

    def __init__(
        self,
        coordinator: SunWallIntensityCoordinator,
        config_entry: ConfigEntry,
        wall: str,
    ) -> None:
        """Initialize the sensor."""
        super().__init__(coordinator, config_entry)
        self._wall = wall
        self._attr_name = f"{_surface_friendly_prefix(wall)} Radiation Total"
        self._attr_unique_id = f"{config_entry.entry_id}_wall_radiation_{wall}"
        self._attr_suggested_object_id = f"{wall}_wall_radiation_total"
        self._attr_icon = "mdi:sun-angle-outline"
        self._attr_native_unit_of_measurement = IRRADIANCE_UNIT
        self._attr_suggested_display_precision = 1
        device_class = getattr(SensorDeviceClass, "IRRADIANCE", None)
        if device_class is not None:
            self._attr_device_class = device_class

    @property
    def native_value(self) -> float | None:
        """Return wall radiation in W/m2."""
        surface = self._radiation_data.get("surfaces", {}).get(self._wall, {})
        if not surface:
            return None
        return round(_safe_float(surface.get("radiation")), 1)

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        """Return wall radiation details."""
        attrs = self._radiation_attrs()
        surface = self._radiation_data.get("surfaces", {}).get(self._wall, {}) or {}
        attrs.update(surface)
        attrs["wall"] = self._wall
        return attrs


class WallDirectRadiationSensor(RadiationSensorBase):
    """Direct-sun radiation hitting a wall."""

    def __init__(
        self,
        coordinator: SunWallIntensityCoordinator,
        config_entry: ConfigEntry,
        wall: str,
    ) -> None:
        """Initialize the sensor."""
        super().__init__(coordinator, config_entry)
        self._wall = wall
        self._attr_name = f"{_surface_friendly_prefix(wall)} Radiation Direct"
        self._attr_unique_id = f"{config_entry.entry_id}_wall_direct_radiation_{wall}"
        self._attr_suggested_object_id = f"{wall}_wall_radiation_direct"
        self._attr_icon = "mdi:sun-angle"
        self._attr_native_unit_of_measurement = IRRADIANCE_UNIT
        self._attr_suggested_display_precision = 1
        device_class = getattr(SensorDeviceClass, "IRRADIANCE", None)
        if device_class is not None:
            self._attr_device_class = device_class

    @property
    def native_value(self) -> float | None:
        """Return direct wall radiation in W/m2."""
        surface = self._radiation_data.get("surfaces", {}).get(self._wall, {})
        if not surface:
            return None
        return round(_safe_float(surface.get("direct_radiation")), 1)

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        """Return direct wall radiation details."""
        attrs = self._radiation_attrs()
        surface = self._radiation_data.get("surfaces", {}).get(self._wall, {}) or {}
        attrs.update(surface)
        attrs["wall"] = self._wall
        return attrs


class WallShadingDemandSensor(RadiationSensorBase):
    """Wall shading demand sensor from direct sun and comfort elevation curve."""

    def __init__(
        self,
        coordinator: SunWallIntensityCoordinator,
        config_entry: ConfigEntry,
        wall: str,
    ) -> None:
        """Initialize the sensor."""
        super().__init__(coordinator, config_entry)
        self._wall = wall
        self._attr_name = f"{_surface_friendly_prefix(wall)} Shading Demand"
        self._attr_unique_id = f"{config_entry.entry_id}_wall_shading_demand_{wall}"
        self._attr_suggested_object_id = f"{wall}_wall_shading_demand"
        self._attr_icon = "mdi:blinds-horizontal"
        self._attr_native_unit_of_measurement = PERCENTAGE
        self._attr_suggested_display_precision = 1

    @property
    def native_value(self) -> float | None:
        """Return wall shading demand percentage."""
        surface = self._radiation_data.get("surfaces", {}).get(self._wall, {})
        if not surface or surface.get("shading_demand") is None:
            return None
        return round(_safe_float(surface.get("shading_demand")), 1)

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        """Return wall shading demand details."""
        attrs = self._radiation_attrs()
        surface = self._radiation_data.get("surfaces", {}).get(self._wall, {}) or {}
        attrs.update(surface)
        attrs["wall"] = self._wall
        attrs["elevation_comfort_curve"] = [
            {"elevation": elevation, "factor": factor}
            for elevation, factor in ELEVATION_COMFORT_CURVE
        ]
        return attrs


class WallShadingStatusSensor(RadiationSensorBase):
    """Human-friendly wall shading guidance from direct sun data."""

    def __init__(
        self,
        coordinator: SunWallIntensityCoordinator,
        config_entry: ConfigEntry,
        wall: str,
    ) -> None:
        """Initialize the sensor."""
        super().__init__(coordinator, config_entry)
        self._wall = wall
        self._attr_name = f"{_surface_friendly_prefix(wall)} Shading Status"
        self._attr_unique_id = f"{config_entry.entry_id}_wall_shading_status_{wall}"
        self._attr_suggested_object_id = f"{wall}_wall_shading_status"
        self._attr_icon = "mdi:blinds-horizontal"
        self._attr_state_class = None
        device_class = getattr(SensorDeviceClass, "ENUM", None)
        if device_class is not None:
            self._attr_device_class = device_class
        self._attr_options = list(WALL_SHADING_STATUS_RECOMMENDATIONS)

    @property
    def native_value(self) -> str | None:
        """Return wall shading status."""
        surface = self._radiation_data.get("surfaces", {}).get(self._wall, {}) or {}
        if not surface:
            return None
        angle = _wall_sun_angle_details(self.coordinator, self._wall)["wall_sun_angle"]
        return _wall_shading_status(
            _safe_float(surface.get("shading_demand")),
            _safe_float(surface.get("direct_radiation")),
            _safe_float(angle),
        )

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        """Return status explanation attributes."""
        attrs = self._radiation_attrs()
        surface = self._radiation_data.get("surfaces", {}).get(self._wall, {}) or {}
        angle_details = _wall_sun_angle_details(self.coordinator, self._wall)
        shading_demand = _safe_float(surface.get("shading_demand"))
        direct_radiation = _safe_float(surface.get("direct_radiation"))
        total_radiation = _safe_float(surface.get("radiation"))
        status = _wall_shading_status(
            shading_demand,
            direct_radiation,
            _safe_float(angle_details.get("wall_sun_angle")),
        )
        attrs.update({
            "wall": self._wall,
            "status": status,
            "recommendation": WALL_SHADING_STATUS_RECOMMENDATIONS.get(status),
            "shading_demand": round(shading_demand, 1),
            "direct_radiation": round(direct_radiation, 1),
            "total_radiation": round(total_radiation, 1),
            "wall_sunlight": angle_details.get("wall_sunlight"),
            "wall_sun_angle": angle_details.get("wall_sun_angle"),
            "sun_on_wall": angle_details.get("sun_on_wall"),
            "meaning": "Dashboard-friendly interpretation of direct sun impact on this wall.",
        })
        return attrs


class RoofRadiationSensor(RadiationSensorBase):
    """Forecast-adjusted roof radiation sensor."""

    def __init__(self, coordinator: SunWallIntensityCoordinator, config_entry: ConfigEntry) -> None:
        """Initialize the sensor."""
        super().__init__(coordinator, config_entry)
        self._attr_name = "Roof Radiation"
        self._attr_unique_id = f"{config_entry.entry_id}_roof_radiation"
        self._attr_suggested_object_id = "roof_radiation"
        self._attr_icon = "mdi:solar-power-variant"
        self._attr_native_unit_of_measurement = IRRADIANCE_UNIT
        self._attr_suggested_display_precision = 1
        device_class = getattr(SensorDeviceClass, "IRRADIANCE", None)
        if device_class is not None:
            self._attr_device_class = device_class

    @property
    def native_value(self) -> float | None:
        """Return roof radiation in W/m2."""
        surface = self._radiation_data.get("surfaces", {}).get("ceiling", {})
        if not surface:
            return None
        return round(_safe_float(surface.get("radiation")), 1)

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        """Return roof radiation details."""
        attrs = self._radiation_attrs()
        surface = self._radiation_data.get("surfaces", {}).get("ceiling", {}) or {}
        attrs.update(surface)
        attrs.update({
            "max_radiation_today": surface.get("max_radiation_today"),
            "peak_radiation_time": surface.get("peak_radiation_time"),
            "minutes_to_peak_radiation": surface.get("minutes_to_peak_radiation"),
            "roof_azimuth": surface.get("surface_azimuth"),
            "roof_tilt": self.coordinator.ceiling_tilt,
            "roof_direction": self.coordinator.roof_direction,
        })
        return attrs


class RoofRadiationPercentageSensor(RadiationSensorBase):
    """Roof radiation percentage relative to today's forecast max."""

    def __init__(self, coordinator: SunWallIntensityCoordinator, config_entry: ConfigEntry) -> None:
        """Initialize the sensor."""
        super().__init__(coordinator, config_entry)
        self._attr_name = "Roof Radiation Percentage"
        self._attr_unique_id = f"{config_entry.entry_id}_roof_radiation_percentage"
        self._attr_suggested_object_id = "roof_radiation_percentage"
        self._attr_icon = "mdi:solar-power"
        self._attr_native_unit_of_measurement = PERCENTAGE
        self._attr_suggested_display_precision = 1

    @property
    def native_value(self) -> float | None:
        """Return roof radiation percentage."""
        surface = self._radiation_data.get("surfaces", {}).get("ceiling", {})
        if not surface:
            return None
        return round(_safe_float(surface.get("radiation_percentage")), 1)

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        """Return roof radiation percentage details."""
        attrs = self._radiation_attrs()
        surface = self._radiation_data.get("surfaces", {}).get("ceiling", {}) or {}
        attrs.update(surface)
        attrs.update({
            "max_radiation_today": surface.get("max_radiation_today"),
            "peak_radiation_time": surface.get("peak_radiation_time"),
            "minutes_to_peak_radiation": surface.get("minutes_to_peak_radiation"),
            "roof_azimuth": surface.get("surface_azimuth"),
            "roof_tilt": self.coordinator.ceiling_tilt,
            "roof_direction": self.coordinator.roof_direction,
        })
        return attrs


class SunAzimuthSensor(CoordinatorEntity, SensorEntity):
    """Representation of a Sun Azimuth sensor."""

    def __init__(
        self,
        coordinator: SunWallIntensityCoordinator,
        config_entry: ConfigEntry,
    ) -> None:
        """Initialize the sensor."""
        super().__init__(coordinator)
        self._config_entry = config_entry
        self._attr_name = "Sun Azimuth"
        self._attr_unique_id = f"{config_entry.entry_id}_sun_azimuth"
        self._attr_state_class = SensorStateClass.MEASUREMENT
        self._attr_native_unit_of_measurement = "°"
        self._attr_icon = "mdi:sun-compass"
        self._attr_suggested_display_precision = 1
        self._attr_entity_category = EntityCategory.DIAGNOSTIC

    @property
    def device_info(self) -> dict[str, Any]:
        """Return device information."""
        return self.coordinator.device_info

    @property
    def native_value(self) -> float | None:
        """Return the native value of the sensor."""
        if self.coordinator.data is None:
            return None
        return round(self.coordinator.data['sun_position']['azimuth'], 2)

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        """Return extra state attributes."""
        if self.coordinator.data is None:
            return {CARD_SOURCE_ATTR: CARD_SOURCE_VALUE}
        
        sun_pos = self.coordinator.data['sun_position']
        return {
            CARD_SOURCE_ATTR: CARD_SOURCE_VALUE,
            'sun_elevation': round(sun_pos['elevation'], 2),
            'latitude': self.coordinator.latitude,
            'longitude': self.coordinator.longitude,
            'data_source': _location_source_label(self.coordinator.location_source_effective),
            'location_source': self.coordinator.location_source,
            'location_zone_entity': self.coordinator.location_zone_entity,
            'location_name': self.coordinator.location_name,
            'last_updated': self.coordinator.data.get('last_updated', ''),
            'cache_hit': (
                self.coordinator._optimal_cache_key[0] == datetime.now().date()
                if getattr(self.coordinator, "_optimal_cache_key", None) else False
            ),
            'system_info': {
                'calculation_count': self.coordinator.calculation_count,
                'error_count': self.coordinator.error_count,
                'success_rate': f"{((self.coordinator.calculation_count - self.coordinator.error_count) / max(1, self.coordinator.calculation_count)) * 100:.1f}%",
                'cache_enabled': hasattr(self.coordinator, '_optimal_cache_key')
            }
        }

    @property
    def available(self) -> bool:
        """Return True if entity is available."""
        return self.coordinator.last_update_success


class SunIncomingDirectionSensor(CoordinatorEntity, SensorEntity):
    """Sun ray incoming direction (azimuth + 180)."""

    def __init__(
        self,
        coordinator: SunWallIntensityCoordinator,
        config_entry: ConfigEntry,
    ) -> None:
        """Initialize the sensor."""
        super().__init__(coordinator)
        self._config_entry = config_entry
        self._attr_name = "Sun Incoming Direction"
        self._attr_unique_id = f"{config_entry.entry_id}_sun_incoming_direction"
        self._attr_state_class = SensorStateClass.MEASUREMENT
        self._attr_native_unit_of_measurement = "°"
        self._attr_icon = "mdi:compass-outline"
        self._attr_entity_category = EntityCategory.DIAGNOSTIC
        self._attr_entity_registry_enabled_default = False

    @property
    def device_info(self) -> dict[str, Any]:
        """Return device information."""
        return self.coordinator.device_info

    @property
    def native_value(self) -> float | None:
        """Return the incoming sun direction."""
        if self.coordinator.data is None:
            return None
        azimuth = self.coordinator.data["sun_position"]["azimuth"]
        return round((azimuth + 180) % 360, 2)

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        """Return extra state attributes."""
        if self.coordinator.data is None:
            return {CARD_SOURCE_ATTR: CARD_SOURCE_VALUE}

        sun_pos = self.coordinator.data["sun_position"]
        return {
            CARD_SOURCE_ATTR: CARD_SOURCE_VALUE,
            "sun_azimuth": round(sun_pos["azimuth"], 2),
            "sun_elevation": round(sun_pos["elevation"], 2),
            "last_updated": self.coordinator.data.get("last_updated", ""),
        }

    @property
    def available(self) -> bool:
        """Return True if entity is available."""
        return self.coordinator.last_update_success


class SunElevationSensor(CoordinatorEntity, SensorEntity):
    """Representation of a Sun Elevation sensor."""

    def __init__(
        self,
        coordinator: SunWallIntensityCoordinator,
        config_entry: ConfigEntry,
    ) -> None:
        """Initialize the sensor."""
        super().__init__(coordinator)
        self._config_entry = config_entry
        self._attr_name = "Sun Elevation"
        self._attr_unique_id = f"{config_entry.entry_id}_sun_elevation"
        self._attr_state_class = SensorStateClass.MEASUREMENT
        self._attr_native_unit_of_measurement = "°"
        self._attr_icon = "mdi:sun-angle"
        self._attr_suggested_display_precision = 1
        self._attr_entity_category = EntityCategory.DIAGNOSTIC

    @property
    def device_info(self) -> dict[str, Any]:
        """Return device information."""
        return self.coordinator.device_info

    @property
    def native_value(self) -> float | None:
        """Return the native value of the sensor."""
        if self.coordinator.data is None:
            return None
        return round(self.coordinator.data['sun_position']['elevation'], 2)

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        """Return extra state attributes."""
        if self.coordinator.data is None:
            return {CARD_SOURCE_ATTR: CARD_SOURCE_VALUE}
        
        sun_pos = self.coordinator.data['sun_position']
        return {
            CARD_SOURCE_ATTR: CARD_SOURCE_VALUE,
            'sun_azimuth': round(sun_pos['azimuth'], 2),
            'latitude': self.coordinator.latitude,
            'longitude': self.coordinator.longitude,
            'last_updated': self.coordinator.data.get('last_updated', ''),
            'system_info': {
                'update_interval': f"{self.coordinator.update_interval_min} minutes",
                'next_update_in': self._calculate_next_update(),
                'data_age': self._calculate_data_age()
            }
        }
    
    def _calculate_next_update(self) -> str:
        """Calculate when next update will happen."""
        if self.coordinator.last_update_success:
            next_update = datetime.now() + timedelta(minutes=self.coordinator.update_interval_min)
            now = datetime.now()
            diff = next_update - now
            minutes = int(diff.total_seconds() / 60)
            if minutes > 0:
                return f"{minutes} minute{'s' if minutes != 1 else ''}"
        return "Soon"
    
    def _calculate_data_age(self) -> str:
        """Calculate how old the current data is."""
        if self.coordinator.data and 'last_updated' in self.coordinator.data:
            try:
                last_updated_str = self.coordinator.data['last_updated']
                # Handle ISO format string
                if 'Z' in last_updated_str:
                    last_updated = datetime.fromisoformat(last_updated_str.replace('Z', '+00:00'))
                else:
                    last_updated = datetime.fromisoformat(last_updated_str)
                
                now = datetime.now(last_updated.tzinfo) if last_updated.tzinfo else datetime.now()
                diff = now - last_updated
                minutes = int(diff.total_seconds() / 60)
                seconds = int(diff.total_seconds() % 60)
                return f"{minutes}m {seconds}s ago"
            except (ValueError, TypeError):
                pass
        return "Unknown"

    @property
    def available(self) -> bool:
        """Return True if entity is available."""
        return self.coordinator.last_update_success



# Diagnostic Sensors (disabled by default)
class DiagnosticSensor(CoordinatorEntity, SensorEntity):
    """Base class for diagnostic sensors."""
    
    def __init__(self, coordinator, config_entry, sensor_type):
        super().__init__(coordinator)
        self._config_entry = config_entry
        self._sensor_type = sensor_type
        self._attr_entity_registry_enabled_default = False  # Hidden by default
        self._attr_unique_id = f"{config_entry.entry_id}_diag_{sensor_type}"
        self._attr_name = f"Sunlight Diagnostics {sensor_type.replace('_', ' ').title()}"
        self._attr_icon = "mdi:chart-line"
        self._attr_entity_category = EntityCategory.DIAGNOSTIC

    @property
    def device_info(self):
        """Return device information."""
        return self.coordinator.device_info


class CalculationTimeSensor(DiagnosticSensor):
    """Tracks when last calculation was performed."""
    
    def __init__(self, coordinator, config_entry):
        super().__init__(coordinator, config_entry, "last_calculation")
        self._attr_native_unit_of_measurement = None
    
    @property
    def native_value(self):
        if self.coordinator.data is None:
            return "Never"
        return self.coordinator.data.get('last_updated', 'Unknown')
    
    @property
    def extra_state_attributes(self):
        # Use the new cache hit counters
        cache_info = {
            "cache_enabled": hasattr(self.coordinator, '_optimal_cache_key'),
            "optimal_cache_key": str(self.coordinator._optimal_cache_key) if hasattr(self.coordinator, '_optimal_cache_key') else "None",
            "general_cache_available": self.coordinator._last_calculation_time is not None if hasattr(self.coordinator, '_last_calculation_time') else False,
            "general_cache_hits": getattr(self.coordinator, 'general_cache_hits', 0),  # Use the new counter
            "optimal_cache_hits": getattr(self.coordinator, 'optimal_cache_hits', 0),  # Use the new counter
        }
        
        settings = self.coordinator.settings_summary
        
        base_attrs = {
            "update_interval_min": self.coordinator.update_interval_min,
            "total_calculations": self.coordinator.calculation_count,
            "location_source": _location_source_label(self.coordinator.location_source_effective),
            "location_selected_source": self.coordinator.location_source,
            "location_zone_entity": self.coordinator.location_zone_entity,
            "location_name": self.coordinator.location_name,
            "configuration": {
                'house_angle': settings['angles']['house_angle'],
                'ceiling_tilt': settings['angles']['ceiling_tilt'],
                'roof_direction': settings['angles']['roof_direction'],
                'update_interval_min': settings['update_interval_min'],
                'latitude': settings['location']['latitude'],
                'longitude': settings['location']['longitude'],
                'location_source': settings['location']['source'],
                'location_zone_entity': settings['location']['zone_entity'],
                'location_name': settings['location']['name'],
            }
        }
        
        return {**base_attrs, **cache_info}


class DataQualitySensor(DiagnosticSensor):
    """Shows data quality metrics."""
    
    def __init__(self, coordinator, config_entry):
        super().__init__(coordinator, config_entry, "data_quality")
        self._attr_native_unit_of_measurement = None
    
    @property
    def native_value(self):
        return "good" if self.coordinator.last_update_success else "error"
    
    @property
    def extra_state_attributes(self):
        success_rate = 0
        if self.coordinator.calculation_count > 0:
            success_rate = ((self.coordinator.calculation_count - self.coordinator.error_count) / 
                          self.coordinator.calculation_count) * 100
        
        settings = self.coordinator.settings_summary
        
        return {
            "last_success": self.coordinator.last_success_time.isoformat() if self.coordinator.last_success_time else "Never",
            "error_count": self.coordinator.error_count,
            "success_rate": f"{success_rate:.1f}%",
            "calculation_count": self.coordinator.calculation_count,
            "cache_hits": getattr(self.coordinator, 'optimal_cache_hits', 0),  # Updated to use the counter
            "general_cache_hits": getattr(self.coordinator, 'general_cache_hits', 0),  # New: general cache hits
            "general_cache_enabled": hasattr(self.coordinator, '_last_calculation_time'),
            "configuration": {
                'house_angle': settings['angles']['house_angle'],
                'ceiling_tilt': settings['angles']['ceiling_tilt'],
                'roof_direction': settings['angles']['roof_direction'],
                'update_interval_min': settings['update_interval_min'],
                'latitude': settings['location']['latitude'],
                'longitude': settings['location']['longitude'],
                'location_source': settings['location']['source'],
                'location_zone_entity': settings['location']['zone_entity'],
                'location_name': settings['location']['name'],
            }
        }
