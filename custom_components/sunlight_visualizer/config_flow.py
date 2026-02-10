"""Config flow for Sunlight Visualizer integration."""
from __future__ import annotations

from typing import Any

import voluptuous as vol

from homeassistant import config_entries
from homeassistant.const import CONF_LATITUDE, CONF_LONGITUDE
from homeassistant.core import callback
from homeassistant.data_entry_flow import FlowResult
from homeassistant.helpers import selector
import homeassistant.helpers.config_validation as cv

from .const import (
    DOMAIN,
    CONF_HOUSE_ANGLE,
    CONF_CEILING_TILT,
    CONF_UPDATE_INTERVAL,
    CONF_ADVANCED_MODE,
    CONF_DIRECTION,
    CONF_USE_CUSTOM_ANGLE,
    CONF_ROOF_DIRECTION,
    CONF_ROOF_POWER_ENTITY,
    CONF_ROOF_POWER_ENABLED,
    CONF_ROOF_POWER_INVERT,
    CONF_FORCE_SUN_FALLBACK,
    CONF_FORCE_SUN_AZIMUTH,
    CONF_FORCE_SUN_ELEVATION,
    DIRECTIONS,
    ROOF_DIRECTIONS,
    DEFAULT_UPDATE_INTERVAL,
    MIN_UPDATE_INTERVAL,
    MAX_UPDATE_INTERVAL,
    DEFAULT_HOUSE_ANGLE,
    DEFAULT_CEILING_TILT,
    DEFAULT_ROOF_DIRECTION,
    DEFAULT_ROOF_POWER_ENTITY,
    DEFAULT_ROOF_POWER_ENABLED,
    DEFAULT_ROOF_POWER_INVERT,
    DEFAULT_FORCE_SUN_FALLBACK,
    DEFAULT_FORCE_SUN_AZIMUTH,
    DEFAULT_FORCE_SUN_ELEVATION,
)


class SunlightIntensityConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Handle a config flow for Sunlight Visualizer."""

    VERSION = 1

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> FlowResult:
        """Handle the initial step."""
        errors: dict[str, str] = {}

        if user_input is not None:
            # Always use HA's location (removed advanced mode)
            user_input[CONF_LATITUDE] = self.hass.config.latitude
            user_input[CONF_LONGITUDE] = self.hass.config.longitude
            
            # Checkbox-based direction/angle handling
            use_custom_angle = user_input.get(CONF_USE_CUSTOM_ANGLE, False)
            
            if not use_custom_angle:
                # Using direction dropdown
                direction_selected = user_input.get(CONF_DIRECTION)
                if direction_selected and direction_selected in DIRECTIONS:
                    user_input[CONF_HOUSE_ANGLE] = DIRECTIONS[direction_selected]
                else:
                    # No direction selected, use default
                    errors[CONF_DIRECTION] = "direction_required"
            else:
                # Using custom angle - ignore dropdown
                user_input[CONF_HOUSE_ANGLE] = user_input.get(CONF_HOUSE_ANGLE, DEFAULT_HOUSE_ANGLE)
            
            # Remove UI-only fields from saved data
            user_input.pop(CONF_DIRECTION, None)
            user_input.pop(CONF_USE_CUSTOM_ANGLE, None)
            if not user_input.get(CONF_ROOF_POWER_ENABLED, DEFAULT_ROOF_POWER_ENABLED):
                user_input.pop(CONF_ROOF_POWER_ENTITY, None)
                user_input.pop(CONF_ROOF_POWER_INVERT, None)
            elif user_input.get(CONF_ROOF_POWER_ENTITY) in ("", None):
                user_input.pop(CONF_ROOF_POWER_ENTITY, None)
            user_input.pop(CONF_ADVANCED_MODE, None)  # Remove if it exists
            if not user_input.get(CONF_ROOF_POWER_ENABLED, DEFAULT_ROOF_POWER_ENABLED):
                user_input.pop(CONF_ROOF_POWER_ENTITY, None)
                user_input.pop(CONF_ROOF_POWER_INVERT, None)
            elif user_input.get(CONF_ROOF_POWER_ENTITY) in ("", None):
                user_input.pop(CONF_ROOF_POWER_ENTITY, None)
            
            # Validate house angle
            try:
                house_angle = int(user_input[CONF_HOUSE_ANGLE])
                if not (0 <= house_angle <= 359):
                    errors[CONF_HOUSE_ANGLE] = "invalid_house_angle"
            except (ValueError, TypeError):
                errors[CONF_HOUSE_ANGLE] = "invalid_house_angle"
            
            # Validate ceiling tilt
            try:
                ceiling_tilt = int(user_input[CONF_CEILING_TILT])
                if not (0 <= ceiling_tilt <= 90):
                    errors[CONF_CEILING_TILT] = "invalid_ceiling_tilt"
            except (ValueError, TypeError):
                errors[CONF_CEILING_TILT] = "invalid_ceiling_tilt"
            
            # Validate update interval
            try:
                update_interval = int(user_input[CONF_UPDATE_INTERVAL])
                if not (MIN_UPDATE_INTERVAL <= update_interval <= MAX_UPDATE_INTERVAL):
                    errors[CONF_UPDATE_INTERVAL] = "invalid_update_interval"
            except (ValueError, TypeError):
                errors[CONF_UPDATE_INTERVAL] = "invalid_update_interval"

            if not errors:
                # Create the config entry
                return self.async_create_entry(
                    title="Sunlight Visualizer",
                    data=user_input,
                )

        # Get HA's current location
        ha_config = self.hass.config
        
        # Build the schema
        roof_power_selector = selector.EntitySelector(
            selector.EntitySelectorConfig(domain="sensor", device_class="power")
        )
        schema_dict = {
            vol.Optional(
                CONF_DIRECTION,
                default="S",
                description="Select compass direction"
            ): vol.In(list(DIRECTIONS.keys())),
            vol.Required(
                CONF_USE_CUSTOM_ANGLE,
                default=False,
                description="Check to enter exact angle instead of using compass direction above"
            ): bool,
            vol.Required(
                CONF_ROOF_DIRECTION,
                default=DEFAULT_ROOF_DIRECTION,
                description="Select which side of the house the roof slopes down toward"
            ): vol.In(list(ROOF_DIRECTIONS.keys())),
            vol.Required(
                CONF_HOUSE_ANGLE,
                default=DEFAULT_HOUSE_ANGLE
            ): vol.All(
                vol.Coerce(int), vol.Range(min=0, max=359)
            ),
            vol.Required(
                CONF_CEILING_TILT,
                default=DEFAULT_CEILING_TILT
            ): vol.All(
                vol.Coerce(int),
                vol.Range(min=0, max=90)
            ),
            vol.Required(
                CONF_UPDATE_INTERVAL,
                default=DEFAULT_UPDATE_INTERVAL
            ): vol.All(
                cv.positive_int,  # Using cv.positive_int for slider display
                vol.Range(min=MIN_UPDATE_INTERVAL, max=MAX_UPDATE_INTERVAL)
            ),
            vol.Required(
                CONF_ROOF_POWER_ENABLED,
                default=DEFAULT_ROOF_POWER_ENABLED,
                description="Enable roof power label"
            ): bool,
            vol.Required(
                CONF_ROOF_POWER_INVERT,
                default=DEFAULT_ROOF_POWER_INVERT,
                description="Invert roof power value (show positive)"
            ): bool,
        }

        if DEFAULT_ROOF_POWER_ENTITY:
            schema_dict[vol.Optional(
                CONF_ROOF_POWER_ENTITY,
                default=DEFAULT_ROOF_POWER_ENTITY,
                description="Optional solar power sensor (W) for roof label"
            )] = roof_power_selector
        else:
            schema_dict[vol.Optional(
                CONF_ROOF_POWER_ENTITY,
                description="Optional solar power sensor (W) for roof label"
            )] = roof_power_selector

        return self.async_show_form(
            step_id="user",
            data_schema=vol.Schema(schema_dict),
            description_placeholders={
                "latitude": f"{ha_config.latitude:.6f}",
                "longitude": f"{ha_config.longitude:.6f}",
                "location_name": ha_config.location_name or "Your Home"
            },
            errors=errors,
        )

    @staticmethod
    @callback
    def async_get_options_flow(
        config_entry: config_entries.ConfigEntry,
    ) -> config_entries.OptionsFlow:
        """Get the options flow for this handler."""
        return SunlightIntensityOptionsFlow(config_entry)


class SunlightIntensityOptionsFlow(config_entries.OptionsFlow):
    """Handle an options flow for Sunlight Visualizer."""

    def __init__(self, config_entry: config_entries.ConfigEntry) -> None:
        """Initialize options flow."""
        self._config_entry = config_entry

    @property
    def config_entry(self):
        """Return the config entry."""
        return self._config_entry

    async def async_step_init(
        self, user_input: dict[str, Any] | None = None
    ) -> FlowResult:
        """Manage the options - SHOWS CURRENT VALUES!"""
        errors: dict[str, str] = {}

        if user_input is not None:
            # Checkbox-based direction/angle handling for options
            use_custom_angle = user_input.get(CONF_USE_CUSTOM_ANGLE, False)
            
            if not use_custom_angle:
                # Using direction dropdown
                direction_selected = user_input.get(CONF_DIRECTION)
                if direction_selected and direction_selected in DIRECTIONS:
                    user_input[CONF_HOUSE_ANGLE] = DIRECTIONS[direction_selected]
                else:
                    # No direction selected, use default
                    errors[CONF_DIRECTION] = "direction_required"
            else:
                # Using custom angle - ignore dropdown
                user_input[CONF_HOUSE_ANGLE] = user_input.get(CONF_HOUSE_ANGLE, DEFAULT_HOUSE_ANGLE)
            
            # Remove UI-only fields from saved data
            user_input.pop(CONF_DIRECTION, None)
            user_input.pop(CONF_USE_CUSTOM_ANGLE, None)
            
            # Validate inputs
            try:
                house_angle = int(user_input[CONF_HOUSE_ANGLE])
                if not (0 <= house_angle <= 359):
                    errors[CONF_HOUSE_ANGLE] = "invalid_house_angle"
            except (ValueError, TypeError):
                errors[CONF_HOUSE_ANGLE] = "invalid_house_angle"
            
            try:
                ceiling_tilt = int(user_input[CONF_CEILING_TILT])
                if not (0 <= ceiling_tilt <= 90):
                    errors[CONF_CEILING_TILT] = "invalid_ceiling_tilt"
            except (ValueError, TypeError):
                errors[CONF_CEILING_TILT] = "invalid_ceiling_tilt"
            
            try:
                update_interval = int(user_input[CONF_UPDATE_INTERVAL])
                if not (MIN_UPDATE_INTERVAL <= update_interval <= MAX_UPDATE_INTERVAL):
                    errors[CONF_UPDATE_INTERVAL] = "invalid_update_interval"
            except (ValueError, TypeError):
                errors[CONF_UPDATE_INTERVAL] = "invalid_update_interval"

            if not errors:
                # Return options data
                return self.async_create_entry(title="", data=user_input)

        # Get current values (data + options merged)
        current_config = {
            **self.config_entry.data, 
            **self.config_entry.options
        }
        
        # Get the actual current house angle
        current_house_angle = current_config.get(CONF_HOUSE_ANGLE, DEFAULT_HOUSE_ANGLE)
        
        # Determine if we're using a compass direction or custom angle
        use_custom_angle = True
        matched_direction = "N"
        
        # Check if current angle matches any direction exactly
        for direction, angle in DIRECTIONS.items():
            if angle == current_house_angle:
                use_custom_angle = False
                matched_direction = direction
                break
        
        # Get other current values
        current_ceiling_tilt = current_config.get(CONF_CEILING_TILT, DEFAULT_CEILING_TILT)
        current_update_interval = current_config.get(CONF_UPDATE_INTERVAL, DEFAULT_UPDATE_INTERVAL)
        current_roof_direction = current_config.get(CONF_ROOF_DIRECTION, DEFAULT_ROOF_DIRECTION)
        current_roof_power = current_config.get(CONF_ROOF_POWER_ENTITY, DEFAULT_ROOF_POWER_ENTITY)
        current_force_sun = current_config.get(CONF_FORCE_SUN_FALLBACK, DEFAULT_FORCE_SUN_FALLBACK)
        current_force_sun_az = current_config.get(CONF_FORCE_SUN_AZIMUTH, DEFAULT_FORCE_SUN_AZIMUTH)
        current_force_sun_el = current_config.get(CONF_FORCE_SUN_ELEVATION, DEFAULT_FORCE_SUN_ELEVATION)
        
        # Get current location from config or HA
        current_latitude = current_config.get(CONF_LATITUDE, self.hass.config.latitude)
        current_longitude = current_config.get(CONF_LONGITUDE, self.hass.config.longitude)
        current_source = "custom" if current_config.get(CONF_ADVANCED_MODE, False) else "home_assistant"
        
        # Build the options form with rearranged fields
        description_placeholders = {
            "current_lat": f"{current_latitude:.6f}",
            "current_lon": f"{current_longitude:.6f}",
            "source": current_source,
            "current_interval": current_update_interval,
            "current_tilt": current_ceiling_tilt,
            "current_angle": current_house_angle
        }
        
        roof_power_selector = selector.EntitySelector(
            selector.EntitySelectorConfig(domain="sensor", device_class="power")
        )
        options_schema_dict = {
            vol.Optional(
                CONF_DIRECTION,
                default=matched_direction,
                description="Select compass direction"
            ): vol.In(list(DIRECTIONS.keys())),
            vol.Required(
                CONF_USE_CUSTOM_ANGLE,
                default=use_custom_angle,
                description="Check to enter exact angle, uncheck to use compass direction above"
            ): bool,
            vol.Required(
                CONF_ROOF_DIRECTION,
                default=current_roof_direction,
                description="Select which side of the house the roof slopes down toward"
            ): vol.In(list(ROOF_DIRECTIONS.keys())),
            vol.Required(
                CONF_HOUSE_ANGLE,
                default=current_house_angle
            ): vol.All(
                vol.Coerce(int), vol.Range(min=0, max=359)
            ),
            vol.Required(
                CONF_CEILING_TILT,
                default=current_ceiling_tilt
            ): vol.All(
                vol.Coerce(int),
                vol.Range(min=0, max=90)
            ),
            vol.Required(
                CONF_UPDATE_INTERVAL,
                default=current_update_interval
            ): vol.All(
                cv.positive_int,
                vol.Range(min=MIN_UPDATE_INTERVAL, max=MAX_UPDATE_INTERVAL)
            ),
            vol.Required(
                CONF_ROOF_POWER_ENABLED,
                default=current_config.get(CONF_ROOF_POWER_ENABLED, DEFAULT_ROOF_POWER_ENABLED),
                description="Enable roof power label"
            ): bool,
            vol.Required(
                CONF_ROOF_POWER_INVERT,
                default=current_config.get(CONF_ROOF_POWER_INVERT, DEFAULT_ROOF_POWER_INVERT),
                description="Invert roof power value (show positive)"
            ): bool,
            vol.Required(
                CONF_FORCE_SUN_FALLBACK,
                default=current_force_sun,
                description="Force fallback sun (testing)"
            ): bool,
            vol.Required(
                CONF_FORCE_SUN_AZIMUTH,
                default=current_force_sun_az,
                description="Force Sun Azimuth (degrees)"
            ): vol.All(vol.Coerce(float), vol.Range(min=0, max=359)),
            vol.Required(
                CONF_FORCE_SUN_ELEVATION,
                default=current_force_sun_el,
                description="Force Sun Elevation (degrees)"
            ): vol.All(vol.Coerce(float), vol.Range(min=-90, max=90)),
        }

        if current_roof_power:
            options_schema_dict[vol.Optional(
                CONF_ROOF_POWER_ENTITY,
                default=current_roof_power,
                description="Optional solar power sensor (W) for roof label"
            )] = roof_power_selector
        else:
            options_schema_dict[vol.Optional(
                CONF_ROOF_POWER_ENTITY,
                description="Optional solar power sensor (W) for roof label"
            )] = roof_power_selector

        options_schema = vol.Schema(options_schema_dict)

        return self.async_show_form(
            step_id="init",
            data_schema=options_schema,
            description_placeholders=description_placeholders,
            errors=errors,
        )
