# Changelog
All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Planned
- More translations.
- Finer precalculated sun data for sunrise and sunset
- Adding some calculated attributes to sensor section
- Auto adjust size based on width of card


### Added
- Placeholder for upcoming changes.
- Fixed error in translation layer.


## [0.2.2] - 2026-02-15
### Changed
- Bumped integration/card release version to `0.2.2`.
- Finalized manifest/HACS metadata to satisfy strict validator rules used by Hassfest and HACS.
- Confirmed CI validation flow for:
  - HACS validation (`.github/workflows/hacs.yaml`)
  - Hassfest validation (`.github/workflows/hassfest.yaml`)

### Fixed
- Resolved manifest schema and ordering issues flagged by Hassfest.
- Resolved `hacs.json` schema mismatch flagged by HACS validation.

## [0.2.1] - 2026-02-15
### Added
- Home Assistant translation files for English, Swedish, and Spanish:
  - `custom_components/sunlight_visualizer/translations/en.json`
  - `custom_components/sunlight_visualizer/translations/sv.json`
  - `custom_components/sunlight_visualizer/translations/es.json`
- GitHub Actions workflows:
  - HACS validation (`.github/workflows/hacs.yaml`)
  - Hassfest validation (`.github/workflows/hassfest.yaml`)
- Card picker metadata (`window.customCards`) so the card is discoverable in "Add card" UI.
- Repository license file (`LICENSE`, MIT).

### Changed
- `strings.json` expanded with integration title + service translations for `sunlight_visualizer.set_options`.
- `manifest.json` cleaned for Home Assistant compatibility (removed non-standard `translations` manifest key).
- `hacs.json` aligned for integration packaging (`domains` used; no frontend-only `filename` override).
- README documentation updated for validation, translations, and install/deployment expectations.

## [0.1.8] - 2026-02-15
### Added
- Major visual upgrade (`houseStyleV2`) with flat-roof house styling.
- Roof overhang + thickness rendering (`flatRoofEnabled`, `flatRoofOverhang`, `flatRoofThickness`).
- Front door and window visuals on house faces.
- Roof solar panel visuals and roof power label rendering.
- Back tree visual with camera-aware occlusion and base shadow anchoring.
- Sky enhancements: moving clouds, day/night gradient system, stars, moon, twilight transitions.
- Sunbeam flow animation and animated short sun rays around sun icon.
- On-card camera controls: manual H/V rotate, stop, save/restore view, angle readouts.
- CSS performance limiting/debug indicators for low-FPS environments.
- Floor styling improvements: grass tint, floor thickness/edge treatment, compass/tick improvements.
- Integration options for forced sun fallback and manual fallback sun azimuth/elevation.

### Changed
- Integration renamed and aligned to `sunlight_visualizer` / "Sunlight Visualizer".
- Card defaults updated for v2 visuals and readability tuning.
- Roof label rendering reworked for robust roof-plane projection and better readability.
- Roof/wall/floor draw ordering refined with explicit depth/tie-break rules.
- Facade dimming based on sunlight intensity improved with smoother curve controls.
- Auto-rotate adaptation/calibration improved for slow displays.
- Roof power handling updated to hide label when disabled and fallback to `0 W` when enabled with missing/invalid value.
- Visual editor updated to drive integration-backed settings where applicable.

### Fixed
- Sun position visual and surface intensity mapping mismatches (including 180° inversions).
- Roof direction mapping issues (front/back and left/right alignment edge cases).
- Roof top/underside/side ordering artifacts and intermittent clipping.
- Tree bleed-through and incorrect front/back pass behavior.
- Shadow clipping artifacts and low-angle shadow inversion cases.
- Card auto-registration/resource loading behavior for HACS/custom install flows.
- Config/options flow regressions for roof power entity selection and optional behavior.
- Alignment sensor edge cases and clamping behavior for roof alignment percentage.
- Camera control interaction bugs (button behavior, state sync, label alignment).

## [0.1.7] - 2026-02-11
### Added
- HACS packaging structure for integration + Lovelace card in one repository.
- Auto-registration of Lovelace card resource from integration endpoint.
- Integration-managed camera rotation entities (`House Camera Rotation H/V`).
- Roof power sensor selection, enable toggle, and invert option.
- Force sun fallback test mode support in integration options.

### Changed
- Core integration naming and docs alignment for release readiness.
- README and installation guidance expanded for custom repo use.

### Fixed
- Config flow and options flow validation/selector issues.
- Startup/resource registration errors across Home Assistant versions.
- Entity creation/runtime errors tied to roof-power option fields.

## [0.1.0] - 2026-02-03
### Added
- Initial v1 release.
- Sunlight intensity calculation for walls and roof.
- Base 2.5D house SVG card with sun, shadow, compass, and surface labels.
- Integration sensors/selects/numbers for house angle, roof direction, tilt, and update interval.
