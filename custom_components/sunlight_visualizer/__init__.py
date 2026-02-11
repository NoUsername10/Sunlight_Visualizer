"""The Sunlight Visualizer integration."""
from __future__ import annotations

import json
import os 
import logging

from homeassistant.config_entries import ConfigEntry
from homeassistant.const import Platform
from homeassistant.core import HomeAssistant
from homeassistant.components.http import async_register_static_path

from .const import DOMAIN

try:
    from homeassistant.components.lovelace import resources
    from homeassistant.components.lovelace.const import DOMAIN as LOVELACE_DOMAIN
except Exception:  # pragma: no cover - lovelace may not be loaded
    resources = None
    LOVELACE_DOMAIN = "lovelace"

_LOGGER = logging.getLogger(__name__)


# Load version from manifest
with open(os.path.join(os.path.dirname(__file__), 'manifest.json')) as fp:
    VERSION = json.load(fp)['version']


# Update PLATFORMS list:
PLATFORMS: list[Platform] = [
    Platform.SENSOR,
    Platform.NUMBER,
    Platform.SELECT, 
]

# Local resource URL for the bundled card
CARD_RESOURCE_URL = "/sunlight_visualizer/sunlight-visualizer-card.js"
CARD_STATIC_PATH = "/sunlight_visualizer"
CARD_STATIC_DIR = os.path.join(os.path.dirname(__file__), "www")

async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Sunlight Visualizer from a config entry."""
    
    # Create coordinator and store it
    from .sensor import SunWallIntensityCoordinator
    coordinator = SunWallIntensityCoordinator(hass, entry, VERSION)  # Pass VERSION as third argument
    
    await coordinator.async_config_entry_first_refresh()
    
    if DOMAIN not in hass.data:
        hass.data[DOMAIN] = {}
    
    hass.data[DOMAIN][entry.entry_id] = {
        "coordinator": coordinator
    }

    # Serve the Lovelace card JS directly from the integration (single-install)
    if not hass.data[DOMAIN].get("_static_registered"):
        try:
            async_register_static_path(hass, CARD_STATIC_PATH, CARD_STATIC_DIR, cache_headers=True)
            hass.data[DOMAIN]["_static_registered"] = True
        except Exception as err:  # pragma: no cover - best effort
            _LOGGER.warning("Failed to register static path for card JS: %s", err)
    
    # Set up update listener for config entry changes
    entry.async_on_unload(
        entry.add_update_listener(async_reload_entry)
    )
    
    # Forward to all platforms
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)

    # Auto-register the Lovelace resource for the card (best-effort)
    await _async_register_card_resource(hass)
    
    return True


async def _async_register_card_resource(hass: HomeAssistant) -> None:
    if resources is None:
        return
    if LOVELACE_DOMAIN not in hass.config.components:
        return
    try:
        registry = await resources.async_get_registry(hass)
    except Exception as err:  # pragma: no cover - registry not ready
        _LOGGER.debug("Lovelace registry not ready: %s", err)
        return

    existing = False
    for item in registry.async_items():
        url = getattr(item, "url", None)
        if url is None and isinstance(item, dict):
            url = item.get("url")
        if url == CARD_RESOURCE_URL:
            existing = True
            break

    if existing:
        return

    try:
        await registry.async_create_item({"res_type": "module", "url": CARD_RESOURCE_URL})
        _LOGGER.info("Registered Lovelace resource: %s", CARD_RESOURCE_URL)
    except Exception:
        try:
            await registry.async_create_item({"type": "module", "url": CARD_RESOURCE_URL})
            _LOGGER.info("Registered Lovelace resource: %s", CARD_RESOURCE_URL)
        except Exception as err:
            _LOGGER.warning("Failed to auto-register Lovelace resource: %s", err)

async def async_reload_entry(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Handle options update by reloading the entry."""
    await hass.config_entries.async_reload(entry.entry_id)


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a config entry."""
    # Clean up data
    if DOMAIN in hass.data and entry.entry_id in hass.data[DOMAIN]:
        del hass.data[DOMAIN][entry.entry_id]
    
    return await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
