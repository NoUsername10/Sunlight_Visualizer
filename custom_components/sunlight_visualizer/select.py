"""Select platform for Sunlight Visualizer direction."""
from __future__ import annotations

import logging

from homeassistant.components.select import SelectEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import EntityCategory
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.update_coordinator import CoordinatorEntity 

from .const import (
    DOMAIN,
    CONF_HOUSE_ANGLE,
    CONF_ROOF_DIRECTION,
    DIRECTIONS,
    ROOF_DIRECTIONS,
    CARD_SOURCE_ATTR,
    CARD_SOURCE_VALUE,
)

_LOGGER = logging.getLogger(__name__)


async def async_setup_entry(
    hass: HomeAssistant,
    config_entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up the select platform."""
    coordinator = hass.data[DOMAIN][config_entry.entry_id]["coordinator"]
    
    # Create the select entity
    entities = [
        HouseDirectionSelect(coordinator, config_entry),
        RoofDirectionSelect(coordinator, config_entry),
    ]
    
    async_add_entities(entities)


class HouseDirectionSelect(CoordinatorEntity, SelectEntity):
    """Select entity for setting the house direction."""
    
    def __init__(self, coordinator, config_entry):
        """Initialize the select entity."""
        super().__init__(coordinator)
        self._config_entry = config_entry
        self._attr_unique_id = f"{config_entry.entry_id}_house_direction"
        self._attr_name = "House Direction"
        self._attr_icon = "mdi:compass"
        self._attr_entity_category = EntityCategory.CONFIG
        self._attr_device_info = coordinator.device_info
        self._attr_options = list(DIRECTIONS.keys()) + ["Custom"]
        
        # Set initial current option
        self._update_current_option()
    
    def _update_current_option(self):
        """Update the current option based on house angle."""
        current_angle = self.coordinator.house_angle
        
        # Check if current angle matches any direction
        for direction, angle in DIRECTIONS.items():
            if current_angle == angle:
                self._attr_current_option = direction
                return
        
        # If no match, set to "Custom"
        self._attr_current_option = "Custom"
    
    @property
    def current_option(self) -> str | None:
        """Return the selected option."""
        # Always check current angle to ensure sync
        self._update_current_option()
        return self._attr_current_option
    
    async def async_select_option(self, option: str) -> None:
        """Handle an option being selected."""
        if option == "Custom":
            # When Custom is selected, change to a non-compass-direction angle if needed
            current_angle = self.coordinator.house_angle
        
            # Only change if current angle matches a compass direction
            if current_angle in DIRECTIONS.values():
                # Find a non-compass angle (e.g., 1°)
                new_angle = 1  # 1° doesn't match any compass direction
                # Make sure it's not a compass direction (shouldn't be, but check)
                while new_angle in DIRECTIONS.values() and new_angle < 360:
                    new_angle += 1
            
                # Update coordinator using its update_settings method
                self.coordinator.update_settings(house_angle=new_angle)
            
                # Update config entry options
                self.hass.config_entries.async_update_entry(
                    self._config_entry,
                    options={**self._config_entry.options, CONF_HOUSE_ANGLE: new_angle}
                )
            
                # Force coordinator to recalculate
                await self.coordinator.async_request_refresh()
            # If already a non-compass angle, do nothing
            return
    
        # Convert direction to angle
        new_angle = DIRECTIONS[option]
    
        # Update coordinator using its update_settings method
        self.coordinator.update_settings(house_angle=new_angle)
    
        # Update config entry options
        self.hass.config_entries.async_update_entry(
            self._config_entry,
            options={**self._config_entry.options, CONF_HOUSE_ANGLE: new_angle}
        )
    
        # Force coordinator to recalculate
        await self.coordinator.async_request_refresh()
    
    def _handle_coordinator_update(self) -> None:
        """Handle updated data from the coordinator."""
        # Update the current option based on coordinator's house_angle
        self._update_current_option()
        self.async_write_ha_state()
    
    @property
    def extra_state_attributes(self):
        """Return extra state attributes."""
        return {
            "description": "Quickly set house direction or use custom angle",
            "current_angle": self.coordinator.house_angle,
            "angle_to_direction": {v: k for k, v in DIRECTIONS.items()},
            "is_custom": self._attr_current_option == "Custom",
            CARD_SOURCE_ATTR: CARD_SOURCE_VALUE,
            "si_setting": "house_direction"
        }


class RoofDirectionSelect(CoordinatorEntity, SelectEntity):
    """Select entity for setting the roof direction."""

    def __init__(self, coordinator, config_entry):
        """Initialize the select entity."""
        super().__init__(coordinator)
        self._config_entry = config_entry
        self._attr_unique_id = f"{config_entry.entry_id}_roof_direction"
        self._attr_name = "Roof Direction"
        self._attr_icon = "mdi:roofing"
        self._attr_entity_category = EntityCategory.CONFIG
        self._attr_device_info = coordinator.device_info
        self._attr_options = list(ROOF_DIRECTIONS.keys())
        self._attr_current_option = self.coordinator.roof_direction

    @property
    def current_option(self) -> str | None:
        """Return the selected option."""
        self._attr_current_option = self.coordinator.roof_direction
        return self._attr_current_option

    async def async_select_option(self, option: str) -> None:
        """Handle an option being selected."""
        if option not in ROOF_DIRECTIONS:
            return

        # Update coordinator
        self.coordinator.update_settings(roof_direction=option)

        # Update config entry options
        self.hass.config_entries.async_update_entry(
            self._config_entry,
            options={**self._config_entry.options, CONF_ROOF_DIRECTION: option}
        )

        # Force coordinator to recalculate
        await self.coordinator.async_request_refresh()

    def _handle_coordinator_update(self) -> None:
        """Handle updated data from the coordinator."""
        self._attr_current_option = self.coordinator.roof_direction
        self.async_write_ha_state()

    @property
    def extra_state_attributes(self):
        """Return extra state attributes."""
        return {
            "description": "Select which side of the house the roof slopes down toward",
            "roof_direction": self.coordinator.roof_direction,
            CARD_SOURCE_ATTR: CARD_SOURCE_VALUE,
            "si_setting": "roof_direction"
        }
        
