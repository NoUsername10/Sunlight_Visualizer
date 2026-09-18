"""Release smoke tests for the Sunlight Visualizer backend."""
from __future__ import annotations

import asyncio
from datetime import datetime, timezone
from pathlib import Path
import tempfile
import unittest
from unittest.mock import AsyncMock, patch

# Home Assistant 2026.9 installs its voluptuous compatibility layer during
# import. Initialize HA first, matching the integration's production runtime.
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers import frame
import voluptuous as vol

import custom_components.sunlight_visualizer as integration
from custom_components.sunlight_visualizer.const import (
    CONF_FORCE_SUN_AZIMUTH,
    CONF_FORCE_SUN_ELEVATION,
    CONF_FORCE_SUN_FALLBACK,
    CONF_CAMERA_ZOOM,
    CONF_RADIATION_ENABLED,
    CONF_WEATHER_VISUALS_ENABLED,
    DOMAIN,
    MAX_CAMERA_ZOOM,
    MIN_CAMERA_ZOOM,
)
from custom_components.sunlight_visualizer.sensor import (
    SunWallIntensityCoordinator,
    _wall_shading_status,
)
from custom_components.sunlight_visualizer.sun_calculations import (
    angle_to_percentage,
    calculate_sun_angle,
)


def _config_entry(**data: object) -> ConfigEntry:
    """Create a current Home Assistant config entry for smoke testing."""
    return ConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Sunlight Visualizer",
        data=data,
        options={},
        source="user",
        unique_id="sunlight-visualizer-smoke",
        discovery_keys={},
        subentries_data=[],
    )


class SunCalculationSmokeTests(unittest.TestCase):
    """Protect the core geometry and fallback contracts."""

    def test_solar_position_callback_is_used(self) -> None:
        target = datetime(2026, 6, 21, 12, 0, tzinfo=timezone.utc)

        result = calculate_sun_angle(
            target,
            solar_position_fn=lambda _: {"azimuth": 180.0, "elevation": 45.0},
            fallback={"azimuth": 225.0, "elevation": 25.0},
        )

        self.assertIsNotNone(result)
        assert result is not None
        self.assertEqual(result["source"], "astral")
        self.assertEqual(result["azimuth"], 180.0)
        self.assertEqual(result["elevation"], 45.0)
        self.assertEqual(result["timestamp"], target.isoformat())

    def test_solar_position_failure_uses_configured_fallback(self) -> None:
        target = datetime(2026, 6, 21, 12, 0, tzinfo=timezone.utc)

        def unavailable_solar_position(_: datetime) -> object:
            raise RuntimeError("offline")

        with self.assertLogs(
            "custom_components.sunlight_visualizer.sun_calculations",
            level="WARNING",
        ):
            result = calculate_sun_angle(
                target,
                solar_position_fn=unavailable_solar_position,
                fallback={"azimuth": 210.0, "elevation": 30.0},
            )

        self.assertIsNotNone(result)
        assert result is not None
        self.assertEqual(result["source"], "fallback")
        self.assertEqual(result["azimuth"], 210.0)
        self.assertEqual(result["elevation"], 30.0)

    def test_surface_alignment_geometry(self) -> None:
        self.assertEqual(angle_to_percentage(180, 180, "front", 45), 100.0)
        self.assertEqual(angle_to_percentage(0, 180, "front", 45), 0.0)
        self.assertEqual(angle_to_percentage(180, 180, "front", -1), 0)
        self.assertEqual(angle_to_percentage(180, 180, "ceiling", 45, 45), 100.0)

    def test_shading_status_boundaries(self) -> None:
        self.assertEqual(_wall_shading_status(0, 500, 30), "No direct sun")
        self.assertEqual(_wall_shading_status(14.9, 100, 30), "Low need")
        self.assertEqual(_wall_shading_status(35, 200, 30), "Shade useful")
        self.assertEqual(_wall_shading_status(85, 500, 60), "Strong low sun")


class ServiceSchemaSmokeTests(unittest.TestCase):
    """Keep the backend camera service aligned with the card zoom limits."""

    def test_camera_zoom_accepts_only_the_supported_range(self) -> None:
        for zoom in (MIN_CAMERA_ZOOM, 1.5, MAX_CAMERA_ZOOM):
            validated = integration.SERVICE_SET_OPTIONS_SCHEMA({CONF_CAMERA_ZOOM: zoom})
            self.assertEqual(validated[CONF_CAMERA_ZOOM], zoom)

        for zoom in (MIN_CAMERA_ZOOM - 0.01, MAX_CAMERA_ZOOM + 0.01):
            with self.assertRaises(vol.Invalid):
                integration.SERVICE_SET_OPTIONS_SCHEMA({CONF_CAMERA_ZOOM: zoom})


class CoordinatorSmokeTests(unittest.IsolatedAsyncioTestCase):
    """Exercise the real coordinator through Home Assistant's refresh path."""

    async def asyncSetUp(self) -> None:
        self._temp_dir = tempfile.TemporaryDirectory()
        self.hass = HomeAssistant(self._temp_dir.name)
        frame.async_setup(self.hass)
        self.hass.config.latitude = 40.4168
        self.hass.config.longitude = -3.7038
        self.hass.config.time_zone = "Europe/Madrid"
        self.hass.config.location_name = "Smoke Test Home"

    async def asyncTearDown(self) -> None:
        await self.hass.async_stop(force=True)
        self._temp_dir.cleanup()

    async def test_astral_refresh_works_on_supported_ha_versions(self) -> None:
        entry = _config_entry(
            **{
                CONF_FORCE_SUN_FALLBACK: False,
                CONF_RADIATION_ENABLED: False,
                CONF_WEATHER_VISUALS_ENABLED: False,
            }
        )
        coordinator = SunWallIntensityCoordinator(
            self.hass,
            entry,
            integration.VERSION,
        )

        await coordinator.async_refresh()

        self.assertTrue(coordinator.last_update_success)
        self.assertIsNotNone(coordinator._astral_observer)
        self.assertEqual(coordinator.data["sun_position"]["source"], "astral")
        coordinator.async_shutdown()

    async def test_forced_sun_refresh_builds_complete_core_data(self) -> None:
        entry = _config_entry(
            **{
                CONF_FORCE_SUN_FALLBACK: True,
                CONF_FORCE_SUN_AZIMUTH: 180,
                CONF_FORCE_SUN_ELEVATION: 45,
                CONF_RADIATION_ENABLED: False,
                CONF_WEATHER_VISUALS_ENABLED: False,
            }
        )
        coordinator = SunWallIntensityCoordinator(
            self.hass,
            entry,
            integration.VERSION,
        )

        self.assertIsNotNone(coordinator._astral_observer)
        await coordinator.async_refresh()

        self.assertTrue(coordinator.last_update_success)
        self.assertEqual(coordinator.data["sun_position"]["source"], "forced")
        self.assertEqual(coordinator.data["sun_position"]["azimuth"], 180.0)
        self.assertEqual(coordinator.data["wall_intensities"]["front"], 100.0)
        self.assertEqual(coordinator.data["wall_intensities"]["back"], 0)
        self.assertEqual(coordinator.data["radiation"]["source"], "disabled")
        self.assertEqual(coordinator.data["weather"]["source"], "disabled")
        self.assertIn("optimal_alignment", coordinator.data)
        self.assertIn("surface_forecast", coordinator.data)

        await coordinator.async_refresh()
        self.assertEqual(coordinator.general_cache_hits, 1)
        coordinator.async_shutdown()


class _FakeCoordinator:
    """Minimal coordinator used to verify setup orchestration."""

    instance: _FakeCoordinator | None = None

    def __init__(self, hass: object, entry: object, version: str) -> None:
        self.hass = hass
        self.entry = entry
        self.version = version
        self.refreshed = False
        type(self).instance = self

    async def async_config_entry_first_refresh(self) -> None:
        self.refreshed = True

    def async_shutdown(self) -> None:
        return None


class _FakeEntry:
    entry_id = "smoke-entry"

    def __init__(self) -> None:
        self.unload_callbacks: list[object] = []

    def async_on_unload(self, callback: object) -> None:
        self.unload_callbacks.append(callback)

    def add_update_listener(self, listener: object):
        return lambda: None


class _FakeServices:
    def __init__(self) -> None:
        self.registered: list[tuple[object, ...]] = []

    def has_service(self, domain: str, service: str) -> bool:
        return False

    def async_register(self, *args: object, **kwargs: object) -> None:
        self.registered.append((*args, kwargs))


class _FakeConfigEntries:
    def __init__(self) -> None:
        self.forwarded: list[tuple[object, object]] = []

    async def async_forward_entry_setups(self, entry: object, platforms: object) -> None:
        self.forwarded.append((entry, platforms))


class _FakeBus:
    def async_listen(self, *args: object):
        return lambda: None

    def async_listen_once(self, *args: object):
        return lambda: None


class _FakeHass:
    def __init__(self) -> None:
        self.data: dict[str, object] = {}
        self.services = _FakeServices()
        self.config_entries = _FakeConfigEntries()
        self.bus = _FakeBus()
        self.tasks: list[asyncio.Task[object]] = []

    def async_create_task(self, coroutine):
        task = asyncio.create_task(coroutine)
        self.tasks.append(task)
        return task


class IntegrationSetupSmokeTests(unittest.IsolatedAsyncioTestCase):
    """Verify clean-install assets and config-entry setup wiring."""

    async def test_static_route_contains_card_and_bundled_model(self) -> None:
        class FakeHttp:
            def __init__(self) -> None:
                self.paths: list[object] = []

            async def async_register_static_paths(self, paths: list[object]) -> None:
                self.paths.extend(paths)

        hass = _FakeHass()
        hass.http = FakeHttp()

        result = await integration._async_register_static_path(hass)

        self.assertTrue(result)
        self.assertTrue(integration.CARD_JS_PATH.is_file())
        self.assertTrue(integration.CARD_MODEL_PATH.is_file())
        self.assertEqual(len(hass.http.paths), 1)
        static_path = hass.http.paths[0]
        self.assertEqual(static_path.url_path, integration.CARD_STATIC_PATH)
        self.assertEqual(Path(static_path.path), integration.CARD_STATIC_DIR)

    async def test_config_entry_setup_registers_runtime_once(self) -> None:
        hass = _FakeHass()
        entry = _FakeEntry()
        static_registration = AsyncMock(return_value=True)
        migration = AsyncMock(return_value=None)
        resource_registration = AsyncMock(return_value=True)
        retry_registration = AsyncMock(return_value=None)

        with (
            patch(
                "custom_components.sunlight_visualizer.sensor.SunWallIntensityCoordinator",
                _FakeCoordinator,
            ),
            patch.object(
                integration,
                "_async_register_static_path",
                static_registration,
            ),
            patch.object(
                integration,
                "_async_migrate_radiation_entity_ids",
                migration,
            ),
            patch.object(
                integration,
                "_async_register_card_resource",
                resource_registration,
            ),
            patch.object(
                integration,
                "_async_retry_register_card_resource",
                retry_registration,
            ),
        ):
            result = await integration.async_setup_entry(hass, entry)
            if hass.tasks:
                await asyncio.gather(*hass.tasks)

        coordinator = _FakeCoordinator.instance
        self.assertTrue(result)
        self.assertIsNotNone(coordinator)
        assert coordinator is not None
        self.assertTrue(coordinator.refreshed)
        self.assertIs(hass.data[DOMAIN][entry.entry_id]["coordinator"], coordinator)
        self.assertEqual(len(hass.config_entries.forwarded), 1)
        self.assertEqual(len(hass.services.registered), 1)
        self.assertGreaterEqual(len(entry.unload_callbacks), 4)
        static_registration.assert_awaited_once_with(hass)
        migration.assert_awaited_once_with(hass, entry)
        resource_registration.assert_awaited_once_with(hass)
        retry_registration.assert_awaited_once_with(hass)


if __name__ == "__main__":
    unittest.main()
