"""Switch platform for Sunlight Visualizer settings."""
from __future__ import annotations

from homeassistant.components.switch import SwitchEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import EntityCategory
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.update_coordinator import CoordinatorEntity

from .const import (
    DOMAIN,
    CONF_FIXED_SUN_ROTATION_ENABLED,
    DEFAULT_FIXED_SUN_ROTATION_ENABLED,
    CARD_SOURCE_ATTR,
    CARD_SOURCE_VALUE,
)


async def async_setup_entry(
    hass: HomeAssistant,
    config_entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up switch entities for settings."""
    coordinator = hass.data[DOMAIN][config_entry.entry_id]["coordinator"]
    async_add_entities([FixedSunRotationSwitch(coordinator, config_entry)])


class FixedSunRotationSwitch(CoordinatorEntity, SwitchEntity):
    """Switch entity for fixed sun rotation visual mode."""

    _attr_should_poll = False

    def __init__(self, coordinator, config_entry: ConfigEntry) -> None:
        """Initialize switch."""
        super().__init__(coordinator)
        self._config_entry = config_entry
        self._attr_unique_id = f"{config_entry.entry_id}_fixed_sun_rotation_enabled"
        self._attr_name = "Fixed sun position, azimuth. (Rotate scene)"
        self._attr_icon = "mdi:axis-z-rotate-clockwise"
        self._attr_entity_category = EntityCategory.CONFIG
        self._attr_device_info = coordinator.device_info

    async def async_added_to_hass(self) -> None:
        """When entity is added to Home Assistant."""
        await super().async_added_to_hass()
        self.async_write_ha_state()

    @property
    def is_on(self) -> bool | None:
        """Return true if the switch is on."""
        return bool(
            self._config_entry.options.get(
                CONF_FIXED_SUN_ROTATION_ENABLED,
                self._config_entry.data.get(
                    CONF_FIXED_SUN_ROTATION_ENABLED, DEFAULT_FIXED_SUN_ROTATION_ENABLED
                ),
            )
        )

    @property
    def available(self) -> bool:
        """Return if entity is available."""
        return self.coordinator.last_update_success is not False

    async def async_turn_on(self, **kwargs) -> None:
        """Turn on fixed sun rotation mode."""
        self.hass.config_entries.async_update_entry(
            self._config_entry,
            options={
                **self._config_entry.options,
                CONF_FIXED_SUN_ROTATION_ENABLED: True,
            },
        )
        self.async_write_ha_state()

    async def async_turn_off(self, **kwargs) -> None:
        """Turn off fixed sun rotation mode."""
        self.hass.config_entries.async_update_entry(
            self._config_entry,
            options={
                **self._config_entry.options,
                CONF_FIXED_SUN_ROTATION_ENABLED: False,
            },
        )
        self.async_write_ha_state()

    @property
    def extra_state_attributes(self) -> dict:
        """Return extra state attributes."""
        return {
            "description": "Keep sun azimuth visually fixed and rotate the scene instead",
            CARD_SOURCE_ATTR: CARD_SOURCE_VALUE,
            "si_setting": "fixed_sun_rotation_enabled",
        }
