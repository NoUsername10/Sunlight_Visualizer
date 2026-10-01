"""Select platform for Sunlight Visualizer direction."""
from __future__ import annotations

from homeassistant.components.select import SelectEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import EntityCategory
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.update_coordinator import CoordinatorEntity 

from .const import (
    DOMAIN,
    CONF_HOUSE_ANGLE,
    CONF_USE_CUSTOM_ANGLE,
    CONF_ROOF_DIRECTION,
    DIRECTIONS,
    ROOF_DIRECTIONS,
    CARD_SOURCE_ATTR,
    CARD_SOURCE_VALUE,
)


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

        if self.coordinator.use_custom_angle:
            self._attr_current_option = "Custom"
            return
        
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
        """Persist house direction; the config-entry listener reloads once."""
        current_angle = int(self.coordinator.house_angle)
        if option == "Custom":
            if self.coordinator.use_custom_angle:
                return
            new_options = {
                **self._config_entry.options,
                CONF_USE_CUSTOM_ANGLE: True,
            }
        elif option in DIRECTIONS:
            new_angle = int(DIRECTIONS[option])
            if (
                not self.coordinator.use_custom_angle
                and current_angle == new_angle
            ):
                return
            new_options = {
                **self._config_entry.options,
                CONF_HOUSE_ANGLE: new_angle,
                CONF_USE_CUSTOM_ANGLE: False,
            }
        else:
            return

        self.hass.config_entries.async_update_entry(
            self._config_entry,
            options=new_options,
        )

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
            "custom_angle_mode": self.coordinator.use_custom_angle,
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
        """Persist roof direction; the config-entry listener reloads once."""
        if option not in ROOF_DIRECTIONS or option == self.coordinator.roof_direction:
            return
        self.hass.config_entries.async_update_entry(
            self._config_entry,
            options={**self._config_entry.options, CONF_ROOF_DIRECTION: option},
        )

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
        
