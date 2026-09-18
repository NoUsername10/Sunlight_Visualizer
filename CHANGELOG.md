# Changelog
All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Planned
- Configurable placement for the 2.5D power pole and tree.

## [0.5.0] - 2026-09-18

### Added
- Added a complete 26-language translation layer for integration setup, options, services, the Lovelace visual editor, card controls, weather details, graphs, renderer loading states, and 3D surface information.
- Added translation validation that requires exact key and placeholder parity across every backend and frontend locale before a build can pass.
- Added support for GLB models carrying baked night-light metadata. Their baked emissive lighting activates only at night and replaces the matching real-time Blender point lights without changing legacy models.
- Added a backend release smoke suite using Python unittest for core sun calculations, coordinator refresh/cache behavior, config-entry setup, and clean-install card/model registration.
- Added direct touch and mouse drag rotation to the strict 2.5D scene, matching the 3D camera gesture behavior without creating WebGL resources.
- Added one-hour forecast trend arrows and explicit percentage-source badges to 3D wall and roof signs.
- Added an opt-in Open-Meteo `3D Weather` entity and GLB-only weather visuals for clouds, rain, snow, fog, wind gust leaves, and horizon lightning.
- Added a compact 3D weather chip and detailed weather popup with current conditions, temperature, wind, visibility, and sunrise/sunset information.
- Added configurable 3D weather visual strength: `Automatic`, `Subtle`, `Normal`, `Strong`, or `Off`.
- Added a 3D compass rose with sun-position marker, azimuth, and elevation information.

### Fixed
- Pause 3D rendering, weather, automatic rotation and animation timers when the card is fully outside the viewport or hidden from layout. Resume from current Home Assistant state as soon as it intersects again, retaining the model and WebGL context. Covered by native-browser scroll, partial-visibility, hidden-update and reconnect tests.
- Removed the raised-surface rain targeting that concentrated droplets into a narrow column above the house. Rain now uses the broad random field while retaining collision heights, surface normals and synchronized splashes.
- Removed diagonal baked-light seams on both roof slopes by baking continuous roof UV islands into dedicated padded light/AO atlases. Preserved roof geometry, color textures, solar-panel contact shadows and all other model materials. Added a model asset revision to refresh browser caches.
- Softened fog intersections with roofs, walls and ground using the current scene depth. Reduced fog from 40 double-sided slices to 24 single-sided puffs, retained idle caching, and reuse a small non-MSAA color/depth target during foggy camera motion without redrawing house geometry.
- Kept window glass, transparent signs and weather in the same screen-space blending pass during rotation and at rest. Restored cached depth correctly so foreground geometry occludes them, with full-scene pixel comparison coverage.
- Fixed the pale color shift after releasing 3D rotation by applying the same per-material ACES tone mapping and exposure to cached and direct frames, with pixel comparison regression coverage.
- Increased the maximum GLB camera zoom from 3.6 to 4.5, including Home Assistant's saved-zoom service limit.
- Fixed baked night illumination remaining visible in daylight when GLB node metadata belongs to a parent group containing multiple material meshes. Added exported-material coverage and day/night switching checks for baked test models.
- Reduced GLB rotation cost on high-DPI screens by using a temporary interaction resolution, preserving the full-size static render target, and preventing weather or sky animation frames from redrawing an unchanged moving-camera scene. Full-quality rendering is restored immediately when movement stops.
- Reduced night-time GLB rotation cost by keeping all authored light illumination visible while temporarily omitting only the small wall-light shadow samples. Their cached full-quality shadows return as soon as camera movement stops, while interior and sun/moon shadows remain active throughout.
- Restored smooth mobile 3D camera interaction by rendering camera motion directly in one pass, coalescing touch and wheel updates through the weather animation frame, and rebuilding the high-quality static cache once when interaction ends.
- Kept Astral sun calculations compatible with Home Assistant 2026.1 while using `get_astral_observer()` on newer releases without calling the deprecated location helper.
- Replaced Home Assistant's deprecated `get_astral_location()` sun helper with the observer-based API required before Home Assistant Core 2027.7.
- Restored the hidden GLB night UFO triggers by removing the saved-zoom gate from the HUD-close trigger and giving passive appearances an independent low-frequency scheduler.
- Fixed the staged GLB moonlight in world space so camera orbit and top-down tilt no longer change its shadow direction or collapse the cast shadow.
- Corrected 3D wind-gust leaf movement so it follows the Open-Meteo wind direction shown by the card compass.
- Retried transient structurally incomplete Open-Meteo responses instead of failing immediately after an HTTP 200 response.
- Added the missing `camera_zoom` field to all `set_options` service translations.
- Kept the Home Assistant static-route registration marker for the HTTP application's lifetime, preventing duplicate route registration attempts after config-entry reloads.

### Changed
- Made maximum rain and snowfall four times denser, with intensity-dependent particle counts and more visible rain droplets. Strengthened high-intensity fog opacity and coverage while retaining 24 depth-softened particles and the existing render passes.
- Tightened the GLB camera zoom-out limit to `1.15` and extended zoom-in to `4.5` for a more useful framing range.
- Updated the user manual for the Automatic/2.5D/3D renderer split, 3D loading/fallback behavior, bundled model loading, and optional GLB weather visuals.
- Restyled 3D surface signs with a quieter light grey-white presentation and reduced the raised roof sign size.
- Improved daytime GLB readability with a wider clear center, brighter house/plot fill, and preserved dark edge framing and directional shadows.
- Reduced animated-scene GPU work by caching the static GLB color/depth pass, separating dynamic effects, updating shadow maps only when lighting or scene state changes, and moving weather motion to shader time uniforms.
- Removed remaining GLB animation-loop waste: CSS-only sun rays no longer keep WebGL awake, house bounds and UFO targets reuse cached model geometry, lightning cloud selection runs only when a strike is due, and frame invalidation/label/CSS updates avoid repeated allocation and unchanged writes.
- Open-Meteo refreshes now preserve the complete local 15-minute calendar day instead of replacing elapsed rows with a current-time forecast window.
- Roof optimal-alignment search now covers the complete local day at every latitude.
- Removed the retired Smart car/Mini SUV WebGL overlay implementation and its bundled OBJ/MTL/texture assets from the card bundle.
- Configuration number/select entities now persist options once and let the config-entry listener own the single reload.
- Kept existing entity IDs and English entity friendly names stable while localizing the card interface.
- Removed the obsolete Smart car/Mini SUV visual selector from the card editor. The strict 2.5D renderer keeps its optional SVG EV car, while 3D displays the contents authored into the GLB model.
- Enabled version-safe browser caching for the card bundle and external GLB model.
- Bumped the integration and card release version to `0.5.0`.

## [0.4.0] - Development milestone (not published)
### Added
- Three explicit card renderer modes: `Automatic`, `2.5D`, and `3D`.
- Full GLB/WebGL house renderer with real sun-direction lighting, shadows, day/night atmosphere, compass, surface data signs, touch/mouse camera controls, graphs, solar-panel animation, model lights, and the hidden night UFO easter egg.
- Accessible 3D loading screen with real GLB download progress, indeterminate progress when content length is unavailable, and clear renderer preparation/fallback states.
- Automatic 3D capability detection and safe 2.5D fallback for unsupported WebGL, renderer creation errors, model loading errors, and context loss.
- Visual-editor `Renderer` selector and translated renderer labels for English, Swedish, Spanish, and Polish.

### Changed
- Cards without an explicit renderer setting now use `Automatic`, including existing cards. Select `2.5D` manually to retain the previous SVG-only presentation.
- Separated the rendering paths: `2.5D` creates no WebGL context or GLB request, while `3D` does not generate a hidden SVG scene.
- Migrated explicit legacy `experimentalHouseRenderer` values to the matching new renderer mode while giving `rendererMode` precedence.
- Centralized shared scene values before renderer selection and retained the SVG projection model as the authoritative source for sun, camera, compass, orientation, and surface mapping.
- Externalized the experimental GLB house model so model replacements no longer require embedding the model in the JavaScript bundle.
- Bumped the integration and card release version to `0.4.0`.

### Fixed
- Prevented the previous hybrid SVG/WebGL scene from flashing or running both renderers while 3D initializes.
- Added deterministic one-instance failure handling so a failed 3D renderer does not repeatedly retry or leak resources.
- Preserved renderer-neutral HUD, graph dialogs, camera controls, surface values, and save behavior across 2.5D, 3D, and fallback transitions.
- Kept SVG and GLB sun direction, compass orientation, house handedness, and left/right surface mapping aligned through the shared projection bridge.


## [0.3.2] - 2026-05-24
### Fixed
- Reworked the SVG grid power pulse to use a real-time drawn pulse segment instead of CSS stroke-dashoffset animation, fixing low-FPS devices where the blue/yellow pulse could blink at the pole instead of travelling along the cable.

## [0.3.1] - 2026-05-24
### Added

### Changed

### Fixed
- Animation of power flow would fail during FPS limiting. (Thank you @rruki for telling me)
- Warning about thread safety in HA (Thank you @HACS-bank for telling me)


## [0.3.0] - 2026-05-09
### Added
- Open-Meteo radiation support (opt-in) with 15-minute forecast data, daytime 15-minute refresh, hourly night refresh, retry handling, API status diagnostics, and same-day cache fallback.
- Wall radiation sensors for total radiation, direct radiation, shading demand, and shading status for Front/Right/Back/Left walls.
- Roof radiation and roof radiation percentage sensors using roof direction, roof tilt, and today’s forecast radiation peak.
- Always-on Wall Sun Angle sensors for Front/Right/Back/Left walls to help blind/awning automations understand low sun entry angle without weather data.
- Zone-based location override in setup/options while keeping Home as the default location.
- Energy HUD improvements with Solar / Home / Grid / optional CAR values, roof-alignment sub-row, compact `(i)` mode, night auto-collapse behavior, and clearer value alignment.
- Surface `%` source selectors for wall and roof labels, including automatic wall Shading Demand when Open-Meteo sensors are available.
- Optional car charger power sensor with HUD `CAR` row and Three.js EV charger pulse.
- EV car visual selector with SVG car, Smart car, and Mini SUV options, plus `evCarScale` and automatic SVG fallback when WebGL is unavailable.
- Polish translation and updated English, Swedish, Spanish, and Polish translation strings for new setup/options controls.

### Changed
- Bumped integration/card release version to `0.3.0`.
- Renamed wall/roof geometric sensor friendly names from `Sunlight` to `Sun Alignment` while keeping original entity IDs stable.
- Renamed Open-Meteo wall radiation entities to surface-first names such as `front_wall_radiation_total` and `front_wall_radiation_direct`.
- Moved raw Open-Meteo API radiation sensors into the Diagnostic category.
- Updated default `floorWallLabelOffset` to `0.85` and default `evCarScale` to `1.25`.
- Improved README documentation for sensors, radiation values, card YAML, EV visuals, and automation guidance.

### Fixed
- WebGL fallback stability so successful WebGL car rendering no longer falls back to SVG after repeated support checks.
- SVG and WebGL EV car grounding, scaling, placement, selector behavior, and house/pole/tree/sun occlusion edge cases.
- SVG fallback car rendering artifacts, including roof/sides disappearing, tire visibility, and house-edge draw-order leakage.
- Grid powerline visibility through house roof/walls with segment-aware SVG clipping and pass-aware overlay layering above WebGL cars.
- Grid power pulse persistence so visible cable segments keep pulsing even when other cable segments are hidden behind the house.
- Car charger pulse timing and color behavior (`3s` travel, `2s` wait; yellow on export, blue otherwise).
- Wall shading demand now uses direct wall radiation only, so diffuse/reflected light does not create false shading demand on non-facing walls.
- Open-Meteo entity cleanup option when disabling radiation support, removing only Meteo/radiation entities when requested.
- Lovelace resource auto-registration de-duplication and async static-path registration hardening.
- Roof power sensor persistence in setup/options when the roof power label toggle is disabled.

## [0.2.6] - 2026-04-13
### Added
- Energy HUD overlay for Solar / Home / Grid values with adaptive styling.
- Small-card `(i)` interaction mode for energy HUD below `300x300` (tap to open/close details).
- Grid flow sensor support in the card (with sign invert), including runtime precedence over roof power flow.
- Power-only sensor enforcement for roof/grid flow selection.
- Utility pole + powerline rendering with bidirectional pulse flow visuals.
- Diagnostics metadata for resolved location source, selected zone entity, and active location name.
- Location selection, with resolution, supports safe fallback to Home coordinates when a selected zone is missing/invalid. Thank you @yazck for the suggestion!
- Added Polish translation file (`pl.json`) and aligned it with current config/options/service translation keys. Thank you @Adrian-czw!



### Changed
- Bumped integration/card release version to `0.2.6`.
- Improved wall `%` label projection using roof-style affine mapping.


### Fixed
- Entity picker fallback behavior in visual editor power selectors.
- Multiple card visual issues for powerline/pole/cable layering, pulse direction, and occlusion.
- Wall percent-label projection consistency and anti-stretch behavior.
- Lovelace resource auto-registration hardening:
  - URL normalization before duplicate checks (query/hash and legacy-equivalent path handling)
  - async-only static path registration path retained (`async_register_static_paths` / `async_register_static_path`)
- Roof power sensor persistence in setup/options:
  - selected roof power sensor is no longer cleared when `Enable power label` is disabled.


## [0.2.5] - 2026-03-29
### Added
- Fixed Sun Azimuth visual mode (sun rotation lock) with scene rotation compensation, thank you @HACS-bank for the suggestion!
- Visual editor section/label for `Fixed Sun Azimuth (sun rotation)`.

### Changed
- Save Camera View now batches integration-backed values (`camera_rotation_h`, `camera_rotation_v`, and `fixed_sun_azimuth`) in a single `sunlight_visualizer.set_options` call to reduce flicker.
- Bumped integration/card release version to `0.2.5`.

## [0.2.3] - [0.2.4] 2026-03-08
### Added
- Card auto-size down by available width (`autoScaleWidth`, default `true`) with minimum width clamp at `250px`.
- Visual editor option under Auto‑rotate: `Auto-scale Width`.
- One-click HACS install badge in README.
- HACS-approved installation status documented in release notes and README.

### Changed
- Bumped integration/card release version to `0.2.3`.
- README install instructions updated for HACS-approved flow and card auto-registration notes.

### Fixed
- Config flow: improved house direction/custom angle behavior and validation handling.
- Translation updates (EN/SV/ES) for clearer compass/front-door direction wording.

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
