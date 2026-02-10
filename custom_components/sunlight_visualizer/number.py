"""Number platform for Sunlight Visualizer settings."""
from __future__ import annotations
from datetime import timedelta

import logging

from homeassistant.components.number import NumberEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import EntityCategory
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.update_coordinator import CoordinatorEntity

from .const import (
    DOMAIN,
    CONF_HOUSE_ANGLE,
    CONF_CEILING_TILT,
    CONF_UPDATE_INTERVAL,
    CONF_CAMERA_ROT_H,
    CONF_CAMERA_ROT_V,
    MIN_UPDATE_INTERVAL,
    MAX_UPDATE_INTERVAL,
    DEFAULT_CAMERA_ROT_H,
    DEFAULT_CAMERA_ROT_V,
    CARD_SOURCE_ATTR,
    CARD_SOURCE_VALUE,
)

_LOGGER = logging.getLogger(__name__)


async def async_setup_entry(
    hass: HomeAssistant,
    config_entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up number entities for settings."""
    coordinator = hass.data[DOMAIN][config_entry.entry_id]["coordinator"]
    
    entities = [
        HouseAngleNumber(coordinator, config_entry),
        CeilingTiltNumber(coordinator, config_entry),
        UpdateIntervalNumber(coordinator, config_entry),
        CameraRotationHNumber(coordinator, config_entry),
        CameraRotationVNumber(coordinator, config_entry),
    ]
    
    async_add_entities(entities)


class HouseAngleNumber(CoordinatorEntity, NumberEntity):
    """Number entity for adjusting house angle."""
    
    _attr_should_poll = False

    def __init__(self, coordinator, config_entry):
        """Initialize."""
        super().__init__(coordinator)
        self._config_entry = config_entry
        self._attr_unique_id = f"{config_entry.entry_id}_house_angle_setting"
        self._attr_name = "House Angle"
        self._attr_native_min_value = 0
        self._attr_native_max_value = 359
        self._attr_native_step = 1
        self._attr_native_unit_of_measurement = "°"
        self._attr_icon = "mdi:compass"
        self._attr_entity_category = EntityCategory.CONFIG
        self._attr_device_info = coordinator.device_info
    
    async def async_added_to_hass(self) -> None:
        """When entity is added to Home Assistant."""
        await super().async_added_to_hass()
        self.async_write_ha_state()
    
    @property
    def native_value(self) -> float | None:
        """Return the current value from coordinator."""
        return float(self.coordinator.house_angle)
    
    @property
    def available(self):
        """Return if entity is available."""
        return self.coordinator.last_update_success is not False
    
    async def async_set_native_value(self, value: float):
        """Update the house angle."""
        # Use the coordinator's update_settings method
        self.coordinator.update_settings(house_angle=int(value))
    
        # Update config entry OPTIONS
        self.hass.config_entries.async_update_entry(
            self._config_entry,
            options={**self._config_entry.options, CONF_HOUSE_ANGLE: int(value)}
        )
    
        # Force coordinator to refresh calculations
        await self.coordinator.async_request_refresh()
        
        # Update our own state
        self.async_write_ha_state()
    
    @property
    def extra_state_attributes(self):
        """Return extra state attributes."""
        return {
            "description": "House front orientation relative to North",
            "min": 0,
            "max": 359,
            "step": 1,
            "mode": "slider",
            CARD_SOURCE_ATTR: CARD_SOURCE_VALUE,
            "si_setting": "house_angle"
        }


class CeilingTiltNumber(CoordinatorEntity, NumberEntity):
    """Number entity for adjusting ceiling tilt."""
    
    _attr_should_poll = False
    
    def __init__(self, coordinator, config_entry):
        """Initialize."""
        super().__init__(coordinator)
        self._config_entry = config_entry
        self._attr_unique_id = f"{config_entry.entry_id}_ceiling_tilt_setting"
        self._attr_name = "Ceiling Tilt"
        self._attr_native_min_value = 0
        self._attr_native_max_value = 90
        self._attr_native_step = 1
        self._attr_native_unit_of_measurement = "°"
        self._attr_icon = "mdi:angle-acute"
        self._attr_entity_category = EntityCategory.CONFIG
        self._attr_device_info = coordinator.device_info
    
    async def async_added_to_hass(self) -> None:
        """When entity is added to Home Assistant."""
        await super().async_added_to_hass()
        self.async_write_ha_state()
    
    @property
    def native_value(self) -> float | None:
        """Return the current value from coordinator."""
        return float(self.coordinator.ceiling_tilt)
    
    @property
    def available(self):
        """Return if entity is available."""
        return self.coordinator.last_update_success is not False
    
    async def async_set_native_value(self, value: float):
        """Update the ceiling tilt."""
        # Use the coordinator's update_settings method
        self.coordinator.update_settings(ceiling_tilt=int(value))
    
        # Update config entry OPTIONS
        self.hass.config_entries.async_update_entry(
            self._config_entry,
            options={**self._config_entry.options, CONF_CEILING_TILT: int(value)}
        )
    
        # Force coordinator to refresh calculations
        await self.coordinator.async_request_refresh()
        
        # Update our own state
        self.async_write_ha_state()
    
    @property
    def extra_state_attributes(self):
        """Return extra state attributes."""
        return {
            "description": "Ceiling/solar panel tilt (0° = horizontal, 90° = vertical)",
            "min": 0,
            "max": 90,
            "step": 1,
            "mode": "slider",
            CARD_SOURCE_ATTR: CARD_SOURCE_VALUE,
            "si_setting": "ceiling_tilt"
        }


class UpdateIntervalNumber(CoordinatorEntity, NumberEntity):
    """Number entity for adjusting update interval."""
    
    _attr_should_poll = False
    
    def __init__(self, coordinator, config_entry):
        """Initialize."""
        super().__init__(coordinator)
        self._config_entry = config_entry
        self._attr_unique_id = f"{config_entry.entry_id}_update_interval_setting"
        self._attr_name = "Update Interval"
        self._attr_native_min_value = MIN_UPDATE_INTERVAL
        self._attr_native_max_value = MAX_UPDATE_INTERVAL
        self._attr_native_step = 1
        self._attr_native_unit_of_measurement = "min"
        self._attr_icon = "mdi:update"
        self._attr_entity_category = EntityCategory.CONFIG
        self._attr_device_info = coordinator.device_info
    
    async def async_added_to_hass(self) -> None:
        """When entity is added to Home Assistant."""
        await super().async_added_to_hass()
        self.async_write_ha_state()
    
    @property
    def native_value(self) -> float | None:
        """Return the current value from coordinator."""
        return float(self.coordinator.update_interval_min)
    
    @property
    def available(self):
        """Return if entity is available."""
        return self.coordinator.last_update_success is not False
    
    async def async_set_native_value(self, value: float):
        """Update the update interval."""
        # Use the coordinator's update_settings method
        self.coordinator.update_settings(update_interval_min=int(value))
    
        # Update config entry OPTIONS
        self.hass.config_entries.async_update_entry(
            self._config_entry,
            options={**self._config_entry.options, CONF_UPDATE_INTERVAL: int(value)}
        )
    
        # Request refresh
        await self.coordinator.async_request_refresh()
  
        # Update our own state
        self.async_write_ha_state()
    
    @property
    def extra_state_attributes(self):
        """Return extra state attributes."""
        return {
            "description": "How often sun position is recalculated",
            "min": MIN_UPDATE_INTERVAL,
            "max": MAX_UPDATE_INTERVAL,
            "step": 1,
            "mode": "slider",
            "unit": "minutes"
        }


class CameraRotationHNumber(CoordinatorEntity, NumberEntity):
    """Number entity for adjusting camera horizontal rotation."""

    _attr_should_poll = False

    def __init__(self, coordinator, config_entry):
        """Initialize."""
        super().__init__(coordinator)
        self._config_entry = config_entry
        self._attr_unique_id = f"{config_entry.entry_id}_camera_rotation_h"
        self._attr_name = "House Camera Rotation H"
        self._attr_native_min_value = 0
        self._attr_native_max_value = 359
        self._attr_native_step = 1
        self._attr_native_unit_of_measurement = "°"
        self._attr_icon = "mdi:camera-iris"
        self._attr_entity_category = EntityCategory.CONFIG
        self._attr_device_info = coordinator.device_info

    async def async_added_to_hass(self) -> None:
        """When entity is added to Home Assistant."""
        await super().async_added_to_hass()
        self.async_write_ha_state()

    @property
    def native_value(self) -> float | None:
        """Return the current value from config options."""
        return float(self._config_entry.options.get(CONF_CAMERA_ROT_H, DEFAULT_CAMERA_ROT_H))

    @property
    def available(self):
        """Return if entity is available."""
        return self.coordinator.last_update_success is not False

    async def async_set_native_value(self, value: float):
        """Update the camera horizontal rotation."""
        self.hass.config_entries.async_update_entry(
            self._config_entry,
            options={**self._config_entry.options, CONF_CAMERA_ROT_H: int(value)}
        )
        self.async_write_ha_state()

    @property
    def extra_state_attributes(self):
        """Return extra state attributes."""
        return {
            "description": "Camera horizontal rotation (view only)",
            "min": 0,
            "max": 359,
            "step": 1,
            "mode": "slider",
            CARD_SOURCE_ATTR: CARD_SOURCE_VALUE,
            "camera_rotation": "h"
        }


class CameraRotationVNumber(CoordinatorEntity, NumberEntity):
    """Number entity for adjusting camera vertical rotation."""

    _attr_should_poll = False

    def __init__(self, coordinator, config_entry):
        """Initialize."""
        super().__init__(coordinator)
        self._config_entry = config_entry
        self._attr_unique_id = f"{config_entry.entry_id}_camera_rotation_v"
        self._attr_name = "House Camera Rotation V"
        self._attr_native_min_value = 0
        self._attr_native_max_value = 90
        self._attr_native_step = 1
        self._attr_native_unit_of_measurement = "°"
        self._attr_icon = "mdi:camera-iris"
        self._attr_entity_category = EntityCategory.CONFIG
        self._attr_device_info = coordinator.device_info

    async def async_added_to_hass(self) -> None:
        """When entity is added to Home Assistant."""
        await super().async_added_to_hass()
        self.async_write_ha_state()

    @property
    def native_value(self) -> float | None:
        """Return the current value from config options."""
        return float(self._config_entry.options.get(CONF_CAMERA_ROT_V, DEFAULT_CAMERA_ROT_V))

    @property
    def available(self):
        """Return if entity is available."""
        return self.coordinator.last_update_success is not False

    async def async_set_native_value(self, value: float):
        """Update the camera vertical rotation."""
        self.hass.config_entries.async_update_entry(
            self._config_entry,
            options={**self._config_entry.options, CONF_CAMERA_ROT_V: int(value)}
        )
        self.async_write_ha_state()

    @property
    def extra_state_attributes(self):
        """Return extra state attributes."""
        return {
            "description": "Camera vertical rotation (view only)",
            "min": 0,
            "max": 90,
            "step": 1,
            "mode": "slider",
            CARD_SOURCE_ATTR: CARD_SOURCE_VALUE,
            "camera_rotation": "v"
        }
