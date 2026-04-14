"""Config flow for Sunlight Visualizer integration."""
from __future__ import annotations

from typing import Any

import voluptuous as vol

from homeassistant import config_entries
from homeassistant.const import CONF_LATITUDE, CONF_LONGITUDE
from homeassistant.core import callback
from homeassistant.data_entry_flow import FlowResult
import homeassistant.helpers.config_validation as cv
from homeassistant.helpers import selector

from .const import (
    CONF_ADVANCED_MODE,
    CONF_AUTO_ROTATE_SPEED,
    CONF_CEILING_TILT,
    CONF_DIRECTION,
    CONF_FIXED_SUN_ROTATION_ENABLED,
    CONF_FORCE_SUN_AZIMUTH,
    CONF_FORCE_SUN_ELEVATION,
    CONF_FORCE_SUN_FALLBACK,
    CONF_HOUSE_ANGLE,
    CONF_LOCATION_SOURCE,
    CONF_LOCATION_ZONE_ENTITY,
    CONF_ROOF_DIRECTION,
    CONF_ROOF_POWER_ENABLED,
    CONF_ROOF_POWER_ENTITY,
    CONF_ROOF_POWER_INVERT,
    CONF_UPDATE_INTERVAL,
    CONF_USE_CUSTOM_ANGLE,
    DEFAULT_AUTO_ROTATE_SPEED,
    DEFAULT_CEILING_TILT,
    DEFAULT_FIXED_SUN_ROTATION_ENABLED,
    DEFAULT_FORCE_SUN_AZIMUTH,
    DEFAULT_FORCE_SUN_ELEVATION,
    DEFAULT_FORCE_SUN_FALLBACK,
    DEFAULT_HOUSE_ANGLE,
    DEFAULT_LOCATION_SOURCE,
    DEFAULT_LOCATION_ZONE_ENTITY,
    DEFAULT_ROOF_DIRECTION,
    DEFAULT_ROOF_POWER_ENABLED,
    DEFAULT_ROOF_POWER_ENTITY,
    DEFAULT_ROOF_POWER_INVERT,
    DEFAULT_UPDATE_INTERVAL,
    DIRECTIONS,
    DOMAIN,
    LOCATION_SOURCE_HOME_ASSISTANT,
    LOCATION_SOURCE_ZONE,
    MAX_UPDATE_INTERVAL,
    MIN_UPDATE_INTERVAL,
    ROOF_DIRECTIONS,
)

ZONE_HOME_OPTION = "__use_home_default__"


def _validate_house_angle(value: Any) -> int:
    """Validate house angle as integer degrees in range 0-359."""
    if isinstance(value, bool):
        raise vol.Invalid("invalid_house_angle")

    angle: int
    if isinstance(value, int):
        angle = value
    elif isinstance(value, float):
        if not value.is_integer():
            raise vol.Invalid("invalid_house_angle")
        angle = int(value)
    elif isinstance(value, str):
        raw = value.strip()
        if raw.startswith("+"):
            raw = raw[1:]
        if not raw.isdigit():
            raise vol.Invalid("invalid_house_angle")
        angle = int(raw)
    else:
        raise vol.Invalid("invalid_house_angle")

    if not 0 <= angle <= 359:
        raise vol.Invalid("invalid_house_angle")
    return angle


def _friendly_zone_name(zone_state) -> str:
    """Return friendly name for zone state."""
    return (
        zone_state.attributes.get("friendly_name")
        or zone_state.name
        or zone_state.entity_id.split(".", 1)[1].replace("_", " ").title()
    )


def _zone_selector_options(hass, selected_zone: str | None = None) -> list[selector.SelectOptionDict]:
    """Build zone select options with Home fallback option first."""
    options: list[selector.SelectOptionDict] = [
        selector.SelectOptionDict(
            value=ZONE_HOME_OPTION,
            label="Use Home (default)",
        )
    ]
    zone_ids: set[str] = set()
    for zone_state in sorted(
        hass.states.async_all("zone"),
        key=lambda st: _friendly_zone_name(st).lower(),
    ):
        zone_ids.add(zone_state.entity_id)
        options.append(
            selector.SelectOptionDict(
                value=zone_state.entity_id,
                label=_friendly_zone_name(zone_state),
            )
        )

    if selected_zone and selected_zone not in zone_ids:
        options.append(
            selector.SelectOptionDict(
                value=selected_zone,
                label=f"{selected_zone} (unavailable)",
            )
        )

    return options


def _zone_entity_selector(hass, selected_zone: str | None = None) -> selector.SelectSelector:
    """Selector for zone entity IDs including 'Use Home (default)'."""
    return selector.SelectSelector(
        selector.SelectSelectorConfig(
            options=_zone_selector_options(hass, selected_zone),
            mode=selector.SelectSelectorMode.DROPDOWN,
            sort=False,
            custom_value=False,
        )
    )


def _normalize_zone_entity(value: Any) -> str | None:
    """Normalize submitted zone selector value to a zone entity or None."""
    if value in (None, "", ZONE_HOME_OPTION):
        return None
    if isinstance(value, str) and value.startswith("zone."):
        return value
    return None


def _resolve_location(
    hass,
    location_source: str,
    location_zone_entity: str | None,
) -> dict[str, Any]:
    """Resolve active coordinates and metadata from location selection."""
    home_name = hass.config.location_name or "Home"
    home_lat = float(hass.config.latitude)
    home_lon = float(hass.config.longitude)

    if location_source == LOCATION_SOURCE_ZONE and location_zone_entity:
        zone_state = hass.states.get(location_zone_entity)
        if zone_state is not None and zone_state.entity_id.startswith("zone."):
            zone_lat = zone_state.attributes.get("latitude")
            zone_lon = zone_state.attributes.get("longitude")
            try:
                return {
                    "source": LOCATION_SOURCE_ZONE,
                    "latitude": float(zone_lat),
                    "longitude": float(zone_lon),
                    "location_name": _friendly_zone_name(zone_state),
                    "zone_entity": location_zone_entity,
                }
            except (TypeError, ValueError):
                pass

        return {
            "source": "zone_fallback_home",
            "latitude": home_lat,
            "longitude": home_lon,
            "location_name": home_name,
            "zone_entity": location_zone_entity,
        }

    return {
        "source": LOCATION_SOURCE_HOME_ASSISTANT,
        "latitude": home_lat,
        "longitude": home_lon,
        "location_name": home_name,
        "zone_entity": None,
    }


def _source_label(source: str) -> str:
    """Human-readable label for resolved source."""
    if source == LOCATION_SOURCE_ZONE:
        return "Zone"
    if source == "zone_fallback_home":
        return "Home Assistant (zone fallback)"
    return "Home Assistant"


def _apply_location_selection(hass, user_input: dict[str, Any]) -> dict[str, Any]:
    """Normalize and resolve location fields from single zone dropdown."""
    zone_entity = _normalize_zone_entity(user_input.get(CONF_LOCATION_ZONE_ENTITY))
    selected_source = LOCATION_SOURCE_ZONE if zone_entity else LOCATION_SOURCE_HOME_ASSISTANT

    resolved = _resolve_location(hass, selected_source, zone_entity)

    user_input[CONF_LOCATION_SOURCE] = selected_source
    user_input[CONF_LOCATION_ZONE_ENTITY] = zone_entity
    # Keep lat/lon for compatibility with existing diagnostics/state consumers.
    user_input[CONF_LATITUDE] = resolved["latitude"]
    user_input[CONF_LONGITUDE] = resolved["longitude"]

    return resolved


class SunlightIntensityConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Handle a config flow for Sunlight Visualizer."""

    VERSION = 1

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> FlowResult:
        """Handle the initial step."""
        errors: dict[str, str] = {}

        # Enforce single instance for this integration
        if self._async_current_entries():
            return self.async_abort(reason="single_instance_allowed")

        if user_input is not None:
            _apply_location_selection(self.hass, user_input)

            use_custom_angle = user_input.get(CONF_USE_CUSTOM_ANGLE, False)

            if not use_custom_angle:
                direction_selected = user_input.get(CONF_DIRECTION)
                if direction_selected and direction_selected in DIRECTIONS:
                    user_input[CONF_HOUSE_ANGLE] = DIRECTIONS[direction_selected]
                else:
                    errors[CONF_DIRECTION] = "direction_required"
            else:
                try:
                    user_input[CONF_HOUSE_ANGLE] = _validate_house_angle(
                        user_input.get(CONF_HOUSE_ANGLE, DEFAULT_HOUSE_ANGLE)
                    )
                except vol.Invalid:
                    errors[CONF_HOUSE_ANGLE] = "invalid_house_angle"

            # Remove UI-only and legacy fields from saved data
            user_input.pop(CONF_DIRECTION, None)
            user_input.pop(CONF_USE_CUSTOM_ANGLE, None)
            user_input.pop(CONF_ADVANCED_MODE, None)

            # Keep selected roof power sensor/invert even when label is disabled.
            # "Enable power label" should only affect label visibility in the card.
            if user_input.get(CONF_ROOF_POWER_ENTITY) in ("", None):
                user_input.pop(CONF_ROOF_POWER_ENTITY, None)

            if CONF_HOUSE_ANGLE in user_input:
                try:
                    user_input[CONF_HOUSE_ANGLE] = _validate_house_angle(
                        user_input[CONF_HOUSE_ANGLE]
                    )
                except (vol.Invalid, ValueError, TypeError):
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

            try:
                auto_rotate_speed = float(
                    user_input.get(CONF_AUTO_ROTATE_SPEED, DEFAULT_AUTO_ROTATE_SPEED)
                )
                if not (1 <= auto_rotate_speed <= 90):
                    errors[CONF_AUTO_ROTATE_SPEED] = "invalid_auto_rotate_speed"
            except (ValueError, TypeError):
                errors[CONF_AUTO_ROTATE_SPEED] = "invalid_auto_rotate_speed"

            if not errors:
                return self.async_create_entry(
                    title="Sunlight Visualizer",
                    data=user_input,
                )

        resolved_default = _resolve_location(
            self.hass, DEFAULT_LOCATION_SOURCE, DEFAULT_LOCATION_ZONE_ENTITY
        )
        roof_power_selector = selector.EntitySelector(
            selector.EntitySelectorConfig(domain="sensor", device_class="power")
        )
        schema_dict: dict[Any, Any] = {
            vol.Required(
                CONF_LOCATION_ZONE_ENTITY,
                default=ZONE_HOME_OPTION,
            ): _zone_entity_selector(self.hass),
            vol.Optional(
                CONF_DIRECTION,
                default="S",
            ): vol.In(list(DIRECTIONS.keys())),
            vol.Required(
                CONF_USE_CUSTOM_ANGLE,
                default=False,
            ): bool,
            vol.Required(
                CONF_HOUSE_ANGLE,
                default=DEFAULT_HOUSE_ANGLE,
            ): selector.NumberSelector(
                selector.NumberSelectorConfig(
                    min=0,
                    max=9999,
                    step=1,
                    mode=selector.NumberSelectorMode.BOX,
                )
            ),
            vol.Required(
                CONF_ROOF_DIRECTION,
                default=DEFAULT_ROOF_DIRECTION,
            ): vol.In(list(ROOF_DIRECTIONS.keys())),
            vol.Required(
                CONF_CEILING_TILT,
                default=DEFAULT_CEILING_TILT,
            ): vol.All(
                vol.Coerce(int),
                vol.Range(min=0, max=90),
            ),
            vol.Required(
                CONF_UPDATE_INTERVAL,
                default=DEFAULT_UPDATE_INTERVAL,
            ): vol.All(
                cv.positive_int,
                vol.Range(min=MIN_UPDATE_INTERVAL, max=MAX_UPDATE_INTERVAL),
            ),
            vol.Required(
                CONF_AUTO_ROTATE_SPEED,
                default=DEFAULT_AUTO_ROTATE_SPEED,
            ): vol.All(
                vol.Coerce(float),
                vol.Range(min=1, max=90),
            ),
            vol.Required(
                CONF_FIXED_SUN_ROTATION_ENABLED,
                default=DEFAULT_FIXED_SUN_ROTATION_ENABLED,
            ): bool,
        }

        if DEFAULT_ROOF_POWER_ENTITY:
            schema_dict[
                vol.Optional(
                    CONF_ROOF_POWER_ENTITY,
                    default=DEFAULT_ROOF_POWER_ENTITY,
                )
            ] = roof_power_selector
        else:
            schema_dict[
                vol.Optional(
                    CONF_ROOF_POWER_ENTITY,
                )
            ] = roof_power_selector

        schema_dict.update(
            {
                vol.Required(
                    CONF_ROOF_POWER_ENABLED,
                    default=DEFAULT_ROOF_POWER_ENABLED,
                ): bool,
                vol.Required(
                    CONF_ROOF_POWER_INVERT,
                    default=DEFAULT_ROOF_POWER_INVERT,
                ): bool,
            }
        )

        return self.async_show_form(
            step_id="user",
            data_schema=vol.Schema(schema_dict),
            description_placeholders={
                "latitude": f"{resolved_default['latitude']:.6f}",
                "longitude": f"{resolved_default['longitude']:.6f}",
                "location_name": resolved_default["location_name"],
                "location_source": _source_label(resolved_default["source"]),
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
        """Manage integration options."""
        errors: dict[str, str] = {}

        if user_input is not None:
            _apply_location_selection(self.hass, user_input)

            use_custom_angle = user_input.get(CONF_USE_CUSTOM_ANGLE, False)
            if not use_custom_angle:
                direction_selected = user_input.get(CONF_DIRECTION)
                if direction_selected and direction_selected in DIRECTIONS:
                    user_input[CONF_HOUSE_ANGLE] = DIRECTIONS[direction_selected]
                else:
                    errors[CONF_DIRECTION] = "direction_required"
            else:
                try:
                    user_input[CONF_HOUSE_ANGLE] = _validate_house_angle(
                        user_input.get(CONF_HOUSE_ANGLE, DEFAULT_HOUSE_ANGLE)
                    )
                except vol.Invalid:
                    errors[CONF_HOUSE_ANGLE] = "invalid_house_angle"

            user_input.pop(CONF_DIRECTION, None)
            user_input.pop(CONF_USE_CUSTOM_ANGLE, None)
            user_input.pop(CONF_ADVANCED_MODE, None)

            # Keep selected roof power sensor/invert even when label is disabled.
            # "Enable power label" should only affect label visibility in the card.
            if user_input.get(CONF_ROOF_POWER_ENTITY) in ("", None):
                user_input.pop(CONF_ROOF_POWER_ENTITY, None)

            if CONF_HOUSE_ANGLE in user_input:
                try:
                    user_input[CONF_HOUSE_ANGLE] = _validate_house_angle(
                        user_input[CONF_HOUSE_ANGLE]
                    )
                except (vol.Invalid, ValueError, TypeError):
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

            try:
                auto_rotate_speed = float(
                    user_input.get(CONF_AUTO_ROTATE_SPEED, DEFAULT_AUTO_ROTATE_SPEED)
                )
                if not (1 <= auto_rotate_speed <= 90):
                    errors[CONF_AUTO_ROTATE_SPEED] = "invalid_auto_rotate_speed"
            except (ValueError, TypeError):
                errors[CONF_AUTO_ROTATE_SPEED] = "invalid_auto_rotate_speed"

            if not errors:
                return self.async_create_entry(title="", data=user_input)

        current_config = {**self.config_entry.data, **self.config_entry.options}

        current_house_angle = current_config.get(CONF_HOUSE_ANGLE, DEFAULT_HOUSE_ANGLE)
        use_custom_angle = True
        matched_direction = "N"
        for direction, angle in DIRECTIONS.items():
            if angle == current_house_angle:
                use_custom_angle = False
                matched_direction = direction
                break

        current_ceiling_tilt = current_config.get(CONF_CEILING_TILT, DEFAULT_CEILING_TILT)
        current_update_interval = current_config.get(
            CONF_UPDATE_INTERVAL, DEFAULT_UPDATE_INTERVAL
        )
        current_auto_rotate_speed = current_config.get(
            CONF_AUTO_ROTATE_SPEED, DEFAULT_AUTO_ROTATE_SPEED
        )
        current_roof_direction = current_config.get(
            CONF_ROOF_DIRECTION, DEFAULT_ROOF_DIRECTION
        )
        current_roof_power = current_config.get(
            CONF_ROOF_POWER_ENTITY, DEFAULT_ROOF_POWER_ENTITY
        )
        current_force_sun = current_config.get(
            CONF_FORCE_SUN_FALLBACK, DEFAULT_FORCE_SUN_FALLBACK
        )
        current_force_sun_az = current_config.get(
            CONF_FORCE_SUN_AZIMUTH, DEFAULT_FORCE_SUN_AZIMUTH
        )
        current_force_sun_el = current_config.get(
            CONF_FORCE_SUN_ELEVATION, DEFAULT_FORCE_SUN_ELEVATION
        )
        current_fixed_sun_rotation_enabled = current_config.get(
            CONF_FIXED_SUN_ROTATION_ENABLED,
            DEFAULT_FIXED_SUN_ROTATION_ENABLED,
        )
        current_location_source = current_config.get(
            CONF_LOCATION_SOURCE, DEFAULT_LOCATION_SOURCE
        )
        if current_location_source not in (LOCATION_SOURCE_HOME_ASSISTANT, LOCATION_SOURCE_ZONE):
            current_location_source = DEFAULT_LOCATION_SOURCE
        current_location_zone = _normalize_zone_entity(current_config.get(CONF_LOCATION_ZONE_ENTITY))
        # Single-dropdown behavior: a selected zone means zone source, otherwise Home.
        current_location_source = (
            LOCATION_SOURCE_ZONE if current_location_zone else LOCATION_SOURCE_HOME_ASSISTANT
        )

        resolved_location = _resolve_location(
            self.hass,
            current_location_source,
            current_location_zone,
        )
        current_latitude = resolved_location["latitude"]
        current_longitude = resolved_location["longitude"]
        current_source_label = _source_label(resolved_location["source"])

        description_placeholders = {
            "current_lat": f"{current_latitude:.6f}",
            "current_lon": f"{current_longitude:.6f}",
            "source": current_source_label,
            "location_name": resolved_location["location_name"],
            "current_interval": current_update_interval,
            "current_tilt": current_ceiling_tilt,
            "current_angle": current_house_angle,
        }

        roof_power_selector = selector.EntitySelector(
            selector.EntitySelectorConfig(domain="sensor", device_class="power")
        )
        options_schema_dict: dict[Any, Any] = {
            vol.Required(
                CONF_LOCATION_ZONE_ENTITY,
                default=current_location_zone or ZONE_HOME_OPTION,
            ): _zone_entity_selector(self.hass, current_location_zone),
            vol.Optional(
                CONF_DIRECTION,
                default=matched_direction,
            ): vol.In(list(DIRECTIONS.keys())),
            vol.Required(
                CONF_USE_CUSTOM_ANGLE,
                default=use_custom_angle,
            ): bool,
            vol.Required(
                CONF_HOUSE_ANGLE,
                default=current_house_angle,
            ): selector.NumberSelector(
                selector.NumberSelectorConfig(
                    min=0,
                    max=9999,
                    step=1,
                    mode=selector.NumberSelectorMode.BOX,
                )
            ),
            vol.Required(
                CONF_ROOF_DIRECTION,
                default=current_roof_direction,
            ): vol.In(list(ROOF_DIRECTIONS.keys())),
            vol.Required(
                CONF_CEILING_TILT,
                default=current_ceiling_tilt,
            ): vol.All(
                vol.Coerce(int),
                vol.Range(min=0, max=90),
            ),
            vol.Required(
                CONF_UPDATE_INTERVAL,
                default=current_update_interval,
            ): vol.All(
                cv.positive_int,
                vol.Range(min=MIN_UPDATE_INTERVAL, max=MAX_UPDATE_INTERVAL),
            ),
            vol.Required(
                CONF_AUTO_ROTATE_SPEED,
                default=current_auto_rotate_speed,
            ): vol.All(
                vol.Coerce(float),
                vol.Range(min=1, max=90),
            ),
            vol.Required(
                CONF_FIXED_SUN_ROTATION_ENABLED,
                default=current_fixed_sun_rotation_enabled,
            ): bool,
        }

        if current_roof_power:
            options_schema_dict[
                vol.Optional(
                    CONF_ROOF_POWER_ENTITY,
                    default=current_roof_power,
                )
            ] = roof_power_selector
        else:
            options_schema_dict[
                vol.Optional(
                    CONF_ROOF_POWER_ENTITY,
                )
            ] = roof_power_selector

        options_schema_dict.update(
            {
                vol.Required(
                    CONF_ROOF_POWER_ENABLED,
                    default=current_config.get(
                        CONF_ROOF_POWER_ENABLED, DEFAULT_ROOF_POWER_ENABLED
                    ),
                ): bool,
                vol.Required(
                    CONF_ROOF_POWER_INVERT,
                    default=current_config.get(
                        CONF_ROOF_POWER_INVERT, DEFAULT_ROOF_POWER_INVERT
                    ),
                ): bool,
                vol.Required(
                    CONF_FORCE_SUN_FALLBACK,
                    default=current_force_sun,
                ): bool,
                vol.Required(
                    CONF_FORCE_SUN_AZIMUTH,
                    default=current_force_sun_az,
                ): vol.All(vol.Coerce(float), vol.Range(min=0, max=359)),
                vol.Required(
                    CONF_FORCE_SUN_ELEVATION,
                    default=current_force_sun_el,
                ): vol.All(vol.Coerce(float), vol.Range(min=-90, max=90)),
            }
        )

        return self.async_show_form(
            step_id="init",
            data_schema=vol.Schema(options_schema_dict),
            description_placeholders=description_placeholders,
            errors=errors,
        )
