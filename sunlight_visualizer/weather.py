"""Weather entity used by the optional 3D weather visual add-on."""
from __future__ import annotations

from typing import Any

from homeassistant.components.weather import WeatherEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import UnitOfLength, UnitOfSpeed, UnitOfTemperature
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.update_coordinator import CoordinatorEntity

from .const import CARD_SOURCE_ATTR, CARD_SOURCE_VALUE, DOMAIN


def _condition_from_wmo(code: int, is_day: bool) -> str:
    """Map Open-Meteo WMO weather codes to Home Assistant conditions."""
    if code == 0:
        return "sunny" if is_day else "clear-night"
    if code == 1:
        return "sunny" if is_day else "clear-night"
    if code == 2:
        return "partlycloudy"
    if code == 3:
        return "cloudy"
    if code in (45, 48):
        return "fog"
    if code in (51, 53, 55, 56, 57):
        return "rainy"
    if code in (61, 63, 65, 66, 67):
        return "rainy"
    if code in (71, 73, 75, 77, 85, 86):
        return "snowy"
    if code in (80, 81):
        return "rainy"
    if code == 82:
        return "pouring"
    if code in (95, 96, 99):
        return "lightning-rainy"
    return "cloudy"


async def async_setup_entry(
    hass: HomeAssistant,
    config_entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up the optional Open-Meteo weather entity."""
    coordinator = hass.data[DOMAIN][config_entry.entry_id]["coordinator"]
    if coordinator.weather_visuals_enabled:
        async_add_entities([SunlightVisualizerWeather(coordinator, config_entry)])


class SunlightVisualizerWeather(CoordinatorEntity, WeatherEntity):
    """Expose normalized Open-Meteo weather for the 3D card renderer."""

    _attr_has_entity_name = True
    _attr_name = "3D Weather"
    _attr_icon = "mdi:weather-partly-cloudy"
    _attr_native_temperature_unit = UnitOfTemperature.CELSIUS
    _attr_native_wind_speed_unit = UnitOfSpeed.KILOMETERS_PER_HOUR
    _attr_native_visibility_unit = UnitOfLength.KILOMETERS

    def __init__(self, coordinator, config_entry: ConfigEntry) -> None:
        """Initialize the weather entity."""
        super().__init__(coordinator)
        self._attr_unique_id = f"{config_entry.entry_id}_open_meteo_3d_weather"

    @property
    def _weather(self) -> dict[str, Any]:
        """Return current normalized weather data."""
        data = self.coordinator.data or {}
        weather = data.get("weather")
        return weather if isinstance(weather, dict) else {}

    @property
    def available(self) -> bool:
        """Return whether weather data is usable."""
        return bool(
            self.coordinator.last_update_success
            and self._weather.get("enabled")
            and self._weather.get("available")
        )

    @property
    def condition(self) -> str | None:
        """Return Home Assistant weather condition."""
        if not self.available:
            return None
        return _condition_from_wmo(
            int(self._weather.get("weather_code", 3)),
            bool(self._weather.get("is_day")),
        )

    @property
    def native_temperature(self) -> float | None:
        return self._weather.get("temperature") if self.available else None

    @property
    def native_apparent_temperature(self) -> float | None:
        return self._weather.get("apparent_temperature") if self.available else None

    @property
    def humidity(self) -> float | None:
        return self._weather.get("humidity") if self.available else None

    @property
    def cloud_coverage(self) -> float | None:
        return self._weather.get("cloud_cover") if self.available else None

    @property
    def native_wind_speed(self) -> float | None:
        return self._weather.get("wind_speed") if self.available else None

    @property
    def native_wind_gust_speed(self) -> float | None:
        return self._weather.get("wind_gust") if self.available else None

    @property
    def wind_bearing(self) -> float | None:
        return self._weather.get("wind_direction") if self.available else None

    @property
    def native_visibility(self) -> float | None:
        return self._weather.get("visibility_km") if self.available else None

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        """Return raw values needed by the isolated 3D weather renderer."""
        weather = self._weather
        return {
            CARD_SOURCE_ATTR: CARD_SOURCE_VALUE,
            "weather_visuals_source": "open_meteo",
            "weather_code": weather.get("weather_code"),
            "precipitation": weather.get("precipitation"),
            "rain": weather.get("rain"),
            "showers": weather.get("showers"),
            "snowfall": weather.get("snowfall"),
            "is_day": weather.get("is_day"),
            "open_meteo_source": weather.get("source"),
            "open_meteo_last_success": weather.get("last_success"),
            "open_meteo_data_age_minutes": weather.get("data_age_minutes"),
            "open_meteo_last_error": weather.get("last_error"),
            "open_meteo_fetch_attempts": weather.get("fetch_attempts"),
        }

    @property
    def device_info(self):
        """Return the shared integration device."""
        return self.coordinator.device_info
