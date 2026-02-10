"""Platform for sensor integration."""
from __future__ import annotations


from datetime import datetime, timedelta
import logging
from typing import Any

from homeassistant.components.sensor import (
    SensorEntity,
    SensorStateClass,
)
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import PERCENTAGE, EntityCategory
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers import sun as sun_helper
from homeassistant.helpers.update_coordinator import (
    CoordinatorEntity,
    DataUpdateCoordinator,
    UpdateFailed,
)

from homeassistant.util import dt as dt_util 

from .const import (
    DOMAIN,
    CONF_LATITUDE,
    CONF_LONGITUDE,
    CONF_HOUSE_ANGLE,
    CONF_ROOF_DIRECTION,
    CONF_ROOF_POWER_ENTITY,
    CONF_ROOF_POWER_ENABLED,
    CONF_ROOF_POWER_INVERT,
    CONF_FORCE_SUN_FALLBACK,
    CONF_FORCE_SUN_AZIMUTH,
    CONF_FORCE_SUN_ELEVATION,
    CONF_CEILING_TILT,
    CONF_UPDATE_INTERVAL,
    CONF_ADVANCED_MODE,
    DEFAULT_HOUSE_ANGLE,
    DEFAULT_CEILING_TILT,
    DEFAULT_ROOF_DIRECTION,
    DEFAULT_FORCE_SUN_FALLBACK,
    DEFAULT_FORCE_SUN_AZIMUTH,
    DEFAULT_FORCE_SUN_ELEVATION,
    WALLS,
    DEFAULT_UPDATE_INTERVAL,
    ROOF_DIRECTIONS,
    FALLBACK_SUN_AZIMUTH,
    FALLBACK_SUN_ELEVATION,
    CARD_SOURCE_ATTR,
    CARD_SOURCE_VALUE,
)

from .sun_calculations import calculate_sun_angle, angle_to_percentage, calculate_optimal_alignment_time


_LOGGER = logging.getLogger(__name__)


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
        self._attr_name = "Solar Alignment Percentage"
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
        self._attr_name = "Solar Alignment Status"
        self._attr_unique_id = f"{config_entry.entry_id}_solar_alignment_status"
        self._attr_icon = "mdi:sun-clock"
        # We're returning a string, so no state_class or native_unit_of_measurement
    
    @property
    def device_info(self) -> dict[str, Any]:
        """Return device information."""
        return self.coordinator.device_info
    
    @property
    def native_value(self) -> str | None:
        """Return only the status string."""
        if self.coordinator.data is None or 'optimal_alignment' not in self.coordinator.data:
            return None
        
        opt_data = self.coordinator.data['optimal_alignment']
        status = opt_data.get('status', 'unknown')
        
        # Capitalize status for display
        if status == "at_peak":
            return "At Peak"
        elif status == "approaching":
            return "Approaching"
        elif status == "declining":
            return "Declining"
        else:
            return "Unknown"
    
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
            'source': 'custom' if self.coordinator.advanced_mode else 'home_assistant',
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
                'location_source': settings['location']['source']
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
        
        # Get location - use advanced mode coordinates or HA default
        self.advanced_mode = merged_config.get(CONF_ADVANCED_MODE, False)
        if self.advanced_mode:
            self.latitude = merged_config.get(CONF_LATITUDE, hass.config.latitude)
            self.longitude = merged_config.get(CONF_LONGITUDE, hass.config.longitude)
        else:
            self.latitude = hass.config.latitude
            self.longitude = hass.config.longitude
        
        self.house_angle = merged_config.get(CONF_HOUSE_ANGLE, DEFAULT_HOUSE_ANGLE)
        self.ceiling_tilt = merged_config.get(CONF_CEILING_TILT, DEFAULT_CEILING_TILT)
        self.roof_direction = merged_config.get(CONF_ROOF_DIRECTION, DEFAULT_ROOF_DIRECTION)
        self.force_sun_fallback = merged_config.get(CONF_FORCE_SUN_FALLBACK, DEFAULT_FORCE_SUN_FALLBACK)
        self.force_sun_azimuth = float(merged_config.get(CONF_FORCE_SUN_AZIMUTH, DEFAULT_FORCE_SUN_AZIMUTH))
        self.force_sun_elevation = float(merged_config.get(CONF_FORCE_SUN_ELEVATION, DEFAULT_FORCE_SUN_ELEVATION))
        
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
        
        super().__init__(
            hass,
            _LOGGER,
            name=DOMAIN,
            update_interval=timedelta(minutes=self.update_interval_min),
        )

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

    async def _async_update_data(self):
        """Update data via library."""
        try:
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
            
            # Update statistics
            self.calculation_count += 1
            self.last_success_time = now
            
            # Build result
            result = {
                'sun_position': sun_data,
                'wall_intensities': wall_data,
                'optimal_alignment': optimal_data,
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
                "source": "custom" if self.advanced_mode else "home_assistant"
            },
            "angles": {
                "house_angle": self.house_angle,
                "ceiling_tilt": self.ceiling_tilt,
                "roof_direction": self.roof_direction,
            },
            "update_interval_min": self.update_interval_min,
            "advanced_mode": self.advanced_mode
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
        self._attr_name = f"Sun Wall Intensity {wall.title()}"
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
            'wall': self._wall,
            'last_updated': self.coordinator.data.get('last_updated', ''),
            'calculation_count': self.coordinator.calculation_count
        }

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
        self._attr_name = f"Sun Roof Intensity"
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
            'data_source': 'advanced' if self.coordinator.advanced_mode else 'ha_default',
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
            "advanced_mode": self.coordinator.advanced_mode,
            "configuration": {
                'house_angle': settings['angles']['house_angle'],
                'ceiling_tilt': settings['angles']['ceiling_tilt'],
                'roof_direction': settings['angles']['roof_direction'],
                'update_interval_min': settings['update_interval_min'],
                'latitude': settings['location']['latitude'],
                'longitude': settings['location']['longitude'],
                'location_source': settings['location']['source']
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
                'location_source': settings['location']['source']
            }
        }
