"""The Sunlight Visualizer integration."""
from __future__ import annotations

import json
import os
import logging
import asyncio
from pathlib import Path
from urllib.parse import urlsplit
import voluptuous as vol
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import Platform
from homeassistant.core import HomeAssistant, ServiceCall
from homeassistant.const import EVENT_HOMEASSISTANT_STARTED, EVENT_COMPONENT_LOADED

from homeassistant.components.http import StaticPathConfig
from homeassistant.helpers.importlib import async_import_module
from homeassistant.helpers import entity_registry as er

from .const import (
    DOMAIN,
    CONF_HOUSE_ANGLE,
    CONF_CEILING_TILT,
    CONF_ROOF_DIRECTION,
    CONF_CAMERA_ROT_H,
    CONF_CAMERA_ROT_V,
    CONF_AUTO_ROTATE_SPEED,
    CONF_FIXED_SUN_AZIMUTH,
    CONF_FIXED_SUN_ROTATION_ENABLED,
    CONF_ROOF_POWER_ENTITY,
    CONF_ROOF_POWER_ENABLED,
    CONF_ROOF_POWER_INVERT,
    RADIATION_CLEANUP_MARKER_PREFIX,
)

_LOGGER = logging.getLogger(__name__)


# Load version from manifest
with open(os.path.join(os.path.dirname(__file__), 'manifest.json')) as fp:
    VERSION = json.load(fp)['version']


# Update PLATFORMS list:
PLATFORMS: list[Platform] = [
    Platform.SENSOR,
    Platform.NUMBER,
    Platform.SELECT,
    Platform.SWITCH,
]

# Local resource URL for the bundled card
CARD_RESOURCE_URL = "/sunlight_visualizer/sunlight-visualizer-card.js"
CARD_STATIC_PATH = "/sunlight_visualizer"
CARD_STATIC_DIR = Path(__file__).parent / "www"
CARD_JS_PATH = CARD_STATIC_DIR / "sunlight-visualizer-card.js"
CARD_RESOURCE_URL_ALIASES = {
    CARD_RESOURCE_URL,
    "/sunlight_visualizer/www/sunlight-visualizer-card.js",
    "/hacsfiles/sunlight_visualizer/sunlight-visualizer-card.js",
}
SERVICE_SET_OPTIONS = "set_options"

SERVICE_SET_OPTIONS_SCHEMA = vol.Schema(
    {
        vol.Optional("entry_id"): str,
        vol.Optional(CONF_HOUSE_ANGLE): vol.All(vol.Coerce(int), vol.Range(min=0, max=359)),
        vol.Optional(CONF_CEILING_TILT): vol.All(vol.Coerce(int), vol.Range(min=0, max=90)),
        vol.Optional(CONF_ROOF_DIRECTION): vol.In(["front", "back", "left", "right"]),
        vol.Optional(CONF_CAMERA_ROT_H): vol.All(vol.Coerce(int), vol.Range(min=0, max=359)),
        vol.Optional(CONF_CAMERA_ROT_V): vol.All(vol.Coerce(int), vol.Range(min=0, max=90)),
        vol.Optional(CONF_AUTO_ROTATE_SPEED): vol.All(vol.Coerce(float), vol.Range(min=1, max=90)),
        vol.Optional(CONF_FIXED_SUN_AZIMUTH): vol.All(vol.Coerce(int), vol.Range(min=0, max=359)),
        vol.Optional(CONF_FIXED_SUN_ROTATION_ENABLED): bool,
        vol.Optional(CONF_ROOF_POWER_ENTITY): vol.Any(None, str),
        vol.Optional(CONF_ROOF_POWER_ENABLED): bool,
        vol.Optional(CONF_ROOF_POWER_INVERT): bool,
    }
)


RADIATION_ENTITY_ID_MIGRATIONS: tuple[tuple[str, str, str], ...] = (
    (
        "open_meteo_radiation_data_age",
        "sensor.open_meteo_radiation_data_age",
        "sensor.open_meteo_radiation_status",
    ),
    (
        "radiation_shortwave_radiation",
        "sensor.solar_shortwave_radiation",
        "sensor.open_meteo_shortwave_radiation",
    ),
    (
        "radiation_direct_radiation",
        "sensor.solar_direct_radiation",
        "sensor.open_meteo_direct_radiation",
    ),
    (
        "radiation_diffuse_radiation",
        "sensor.solar_diffuse_radiation",
        "sensor.open_meteo_diffuse_radiation",
    ),
    (
        "radiation_direct_normal_irradiance",
        "sensor.solar_direct_normal_irradiance",
        "sensor.open_meteo_direct_normal_irradiance",
    ),
    ("wall_radiation_left", "sensor.left_wall_total_radiation", "sensor.left_wall_radiation_total"),
    ("wall_direct_radiation_left", "sensor.left_wall_direct_radiation", "sensor.left_wall_radiation_direct"),
    ("wall_shading_demand_left", "sensor.wall_shading_demand_left", "sensor.left_wall_shading_demand"),
    ("wall_radiation_right", "sensor.right_wall_total_radiation", "sensor.right_wall_radiation_total"),
    ("wall_direct_radiation_right", "sensor.right_wall_direct_radiation", "sensor.right_wall_radiation_direct"),
    ("wall_shading_demand_right", "sensor.wall_shading_demand_right", "sensor.right_wall_shading_demand"),
    ("wall_radiation_front", "sensor.front_wall_total_radiation", "sensor.front_wall_radiation_total"),
    ("wall_direct_radiation_front", "sensor.front_wall_direct_radiation", "sensor.front_wall_radiation_direct"),
    ("wall_shading_demand_front", "sensor.wall_shading_demand_front", "sensor.front_wall_shading_demand"),
    ("wall_radiation_back", "sensor.back_wall_total_radiation", "sensor.back_wall_radiation_total"),
    ("wall_direct_radiation_back", "sensor.back_wall_direct_radiation", "sensor.back_wall_radiation_direct"),
    ("wall_shading_demand_back", "sensor.wall_shading_demand_back", "sensor.back_wall_shading_demand"),
)


async def _async_migrate_radiation_entity_ids(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Rename only Open-Meteo radiation entity IDs when it is safe."""
    registry = er.async_get(hass)

    for unique_suffix, old_entity_id, target_entity_id in RADIATION_ENTITY_ID_MIGRATIONS:
        unique_id = f"{entry.entry_id}_{unique_suffix}"
        entity_id = registry.async_get_entity_id("sensor", DOMAIN, unique_id)
        if entity_id is None or entity_id == target_entity_id:
            continue

        # Preserve manual renames and avoid collisions with existing entities.
        if entity_id != old_entity_id:
            _LOGGER.debug(
                "Skipping radiation entity ID migration for %s because current entity ID is %s",
                unique_id,
                entity_id,
            )
            continue
        if registry.async_get(target_entity_id) is not None:
            _LOGGER.debug(
                "Skipping radiation entity ID migration for %s because %s already exists",
                unique_id,
                target_entity_id,
            )
            continue

        try:
            registry.async_update_entity(entity_id, new_entity_id=target_entity_id)
            _LOGGER.debug("Migrated radiation entity ID %s -> %s", entity_id, target_entity_id)
        except (KeyError, ValueError) as err:
            _LOGGER.debug(
                "Could not migrate radiation entity ID %s -> %s: %s",
                entity_id,
                target_entity_id,
                err,
            )


RADIATION_ENTITY_UNIQUE_SUFFIXES: tuple[str, ...] = (
    "open_meteo_radiation_data_age",
    "radiation_shortwave_radiation",
    "radiation_direct_radiation",
    "radiation_diffuse_radiation",
    "radiation_direct_normal_irradiance",
    "roof_radiation",
    "roof_radiation_percentage",
    "wall_radiation_front",
    "wall_direct_radiation_front",
    "wall_shading_demand_front",
    "wall_shading_status_front",
    "wall_radiation_right",
    "wall_direct_radiation_right",
    "wall_shading_demand_right",
    "wall_shading_status_right",
    "wall_radiation_back",
    "wall_direct_radiation_back",
    "wall_shading_demand_back",
    "wall_shading_status_back",
    "wall_radiation_left",
    "wall_direct_radiation_left",
    "wall_shading_demand_left",
    "wall_shading_status_left",
)


def _remove_radiation_entities(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Remove only Open-Meteo/radiation entities from the entity registry."""
    registry = er.async_get(hass)
    removed = 0

    for unique_suffix in RADIATION_ENTITY_UNIQUE_SUFFIXES:
        unique_id = f"{entry.entry_id}_{unique_suffix}"
        entity_id = registry.async_get_entity_id("sensor", DOMAIN, unique_id)
        if entity_id is None:
            continue
        try:
            registry.async_remove(entity_id)
            removed += 1
        except KeyError:
            _LOGGER.debug("Radiation entity already removed: %s", entity_id)

    if removed:
        _LOGGER.info("Removed %s Open-Meteo radiation entities", removed)



SET_OPTIONS_KEYS = {
    CONF_HOUSE_ANGLE,
    CONF_CEILING_TILT,
    CONF_ROOF_DIRECTION,
    CONF_CAMERA_ROT_H,
    CONF_CAMERA_ROT_V,
    CONF_AUTO_ROTATE_SPEED,
    CONF_FIXED_SUN_AZIMUTH,
    CONF_FIXED_SUN_ROTATION_ENABLED,
    CONF_ROOF_POWER_ENTITY,
    CONF_ROOF_POWER_ENABLED,
    CONF_ROOF_POWER_INVERT,
}

def _normalize_resource_url(url: str | None) -> str | None:
    """Normalize resource URLs so equivalent paths compare equal."""
    if not isinstance(url, str):
        return None

    path = urlsplit(url.strip()).path
    if not path:
        return None

    while "//" in path:
        path = path.replace("//", "/")
    if path != "/" and path.endswith("/"):
        path = path.rstrip("/")

    if path in CARD_RESOURCE_URL_ALIASES:
        return CARD_RESOURCE_URL
    return path


async def _async_register_static_path(hass: HomeAssistant) -> bool:
    """Serve the Lovelace card JS directly from the integration (single-install)."""
    if hass.data.get(DOMAIN, {}).get("_static_registered"):
        return True
    try:
        if not CARD_JS_PATH.exists():
            raise RuntimeError(f"Card JS not found at {CARD_JS_PATH}")

        if hasattr(hass.http, "async_register_static_paths"):
            await hass.http.async_register_static_paths([
                StaticPathConfig(CARD_STATIC_PATH, str(CARD_STATIC_DIR), False)
            ])
        elif hasattr(hass.http, "async_register_static_path"):
            await hass.http.async_register_static_path(
                CARD_STATIC_PATH, str(CARD_STATIC_DIR), False
            )
        else:
            raise RuntimeError("No static path registration method found")

        hass.data.setdefault(DOMAIN, {})["_static_registered"] = True
        return True
    except Exception as err:  # pragma: no cover - best effort
        _LOGGER.warning("Failed to register static path for card JS: %s", err)
        return False

async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Sunlight Visualizer from a config entry."""
    
    # Create coordinator and store it
    from .sensor import SunWallIntensityCoordinator
    coordinator = SunWallIntensityCoordinator(hass, entry, VERSION)  # Pass VERSION as third argument
    entry.async_on_unload(coordinator.async_shutdown)
    
    await coordinator.async_config_entry_first_refresh()
    
    if DOMAIN not in hass.data:
        hass.data[DOMAIN] = {}
    
    hass.data[DOMAIN][entry.entry_id] = {
        "coordinator": coordinator
    }

    async def _async_handle_set_options(call: ServiceCall) -> None:
        entry_id = call.data.get("entry_id")
        target_entry: ConfigEntry | None = None

        if entry_id:
            target_entry = hass.config_entries.async_get_entry(entry_id)
            if not target_entry or target_entry.domain != DOMAIN:
                _LOGGER.warning("set_options called with invalid entry_id: %s", entry_id)
                return
        else:
            domain_entries = hass.config_entries.async_entries(DOMAIN)
            if not domain_entries:
                _LOGGER.warning("set_options called but no %s entries found", DOMAIN)
                return
            target_entry = domain_entries[0]

        updates = {k: call.data[k] for k in SET_OPTIONS_KEYS if k in call.data}
        if not updates:
            return

        new_options = dict(target_entry.options)
        for key, value in updates.items():
            if key == CONF_ROOF_POWER_ENTITY and (value is None or value == ""):
                new_options.pop(CONF_ROOF_POWER_ENTITY, None)
            else:
                new_options[key] = value

        hass.config_entries.async_update_entry(target_entry, options=new_options)

    if not hass.services.has_service(DOMAIN, SERVICE_SET_OPTIONS):
        hass.services.async_register(
            DOMAIN,
            SERVICE_SET_OPTIONS,
            _async_handle_set_options,
            schema=SERVICE_SET_OPTIONS_SCHEMA,
        )

    await _async_register_static_path(hass)
    await _async_migrate_radiation_entity_ids(hass, entry)
    
    # Set up update listener for config entry changes
    entry.async_on_unload(
        entry.add_update_listener(async_reload_entry)
    )
    
    # Forward to all platforms
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)

    # Auto-register the Lovelace resource for the card (best-effort)
    await _async_register_card_resource(hass)

    async def _register_when_lovelace_loaded(event) -> None:
        if event.data.get("component") != "lovelace":
            return
        await _async_register_card_resource(hass)

    unsub_component_loaded = hass.bus.async_listen(
        EVENT_COMPONENT_LOADED, _register_when_lovelace_loaded
    )
    entry.async_on_unload(unsub_component_loaded)

    async def _startup_retry(_: object | None = None) -> None:
        await _async_register_card_resource(hass)

    unsub_started = hass.bus.async_listen_once(
        EVENT_HOMEASSISTANT_STARTED, _startup_retry
    )
    entry.async_on_unload(unsub_started)

    # Retry for a short window in case Lovelace registry is late to initialize
    retry_task = hass.async_create_task(_async_retry_register_card_resource(hass))

    def _cancel_retry_task() -> None:
        if not retry_task.done():
            retry_task.cancel()

    entry.async_on_unload(_cancel_retry_task)
    
    return True


async def _async_get_lovelace_registry(hass: HomeAssistant):
    """Return the Lovelace resource registry across HA versions."""
    # Newer/older module API (try multiple module paths)
    for mod_name in (
        "homeassistant.components.lovelace.resources",
        "homeassistant.components.lovelace",
    ):
        try:
            mod = await async_import_module(hass, mod_name)
            async_get_registry = getattr(mod, "async_get_registry", None)
            if async_get_registry:
                return await async_get_registry(hass)
        except Exception as err:  # pragma: no cover - module may not be ready yet
            _LOGGER.debug("Lovelace resources module not ready (%s): %s", mod_name, err)

    # Fallback: look in hass.data
    lovelace_data = hass.data.get("lovelace")
    if lovelace_data:
        # dict-style storage
        if isinstance(lovelace_data, dict):
            for key in ("resources", "resource_registry", "lovelace_resources"):
                reg = lovelace_data.get(key)
                if reg and hasattr(reg, "async_items") and hasattr(reg, "async_create_item"):
                    return reg
        # object-style storage
        for attr in ("resources", "resource_registry", "lovelace_resources"):
            reg = getattr(lovelace_data, attr, None)
            if reg and hasattr(reg, "async_items") and hasattr(reg, "async_create_item"):
                return reg
    return None


async def _async_register_card_resource(hass: HomeAssistant) -> bool:
    registry = await _async_get_lovelace_registry(hass)
    if registry is None:
        _LOGGER.debug("Lovelace registry not ready")
        return False

    target_url = _normalize_resource_url(CARD_RESOURCE_URL)
    existing = False
    for item in registry.async_items():
        url = getattr(item, "url", None)
        if url is None and isinstance(item, dict):
            url = item.get("url")
        if _normalize_resource_url(url) == target_url:
            existing = True
            break

    if existing:
        hass.data.setdefault(DOMAIN, {})["_resource_registered"] = True
        return True

    try:
        await registry.async_create_item({"res_type": "module", "url": CARD_RESOURCE_URL})
        _LOGGER.info("Registered Lovelace resource: %s", CARD_RESOURCE_URL)
        hass.data.setdefault(DOMAIN, {})["_resource_registered"] = True
        return True
    except Exception:
        try:
            await registry.async_create_item({"type": "module", "url": CARD_RESOURCE_URL})
            _LOGGER.info("Registered Lovelace resource: %s", CARD_RESOURCE_URL)
            hass.data.setdefault(DOMAIN, {})["_resource_registered"] = True
            return True
        except Exception as err:
            _LOGGER.warning("Failed to auto-register Lovelace resource: %s", err)
            return False


async def _async_retry_register_card_resource(
    hass: HomeAssistant,
    attempts: int = 12,
    delay: float = 5.0,
) -> None:
    """Retry resource registration for a short period after startup."""
    for _ in range(attempts):
        if await _async_register_card_resource(hass):
            return
        await asyncio.sleep(delay)
    _LOGGER.warning("Failed to auto-register Lovelace resource after retries")

async def async_reload_entry(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Handle options update by reloading the entry."""
    await hass.config_entries.async_reload(entry.entry_id)


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a config entry."""
    unload_ok = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    if not unload_ok:
        return False

    domain_data = hass.data.get(DOMAIN)
    if isinstance(domain_data, dict):
        cleanup_key = f"{RADIATION_CLEANUP_MARKER_PREFIX}{entry.entry_id}"
        if domain_data.pop(cleanup_key, False):
            _remove_radiation_entities(hass, entry)

        domain_data.pop(entry.entry_id, None)

        has_active_entries = any(not str(key).startswith("_") for key in domain_data.keys())
        if not has_active_entries:
            if hass.services.has_service(DOMAIN, SERVICE_SET_OPTIONS):
                hass.services.async_remove(DOMAIN, SERVICE_SET_OPTIONS)
            domain_data.pop("_static_registered", None)
            domain_data.pop("_resource_registered", None)

        if not domain_data:
            hass.data.pop(DOMAIN, None)

    return True
