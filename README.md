# Sunlight Visualizer
<img src="https://github.com/NoUsername10/Sunlight_Visualizer/blob/main/assets/icon@2x.png" width="90" alt="Sunlight Visualizer icon">

[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-donate-orange.svg)](https://www.buymeacoffee.com/DefaultLogin)
[<img src="https://my.home-assistant.io/badges/hacs_repository.svg" alt="Open your Home Assistant instance and open Sunlight Visualizer in HACS." />](https://my.home-assistant.io/redirect/hacs_repository/?owner=NoUsername10&repository=Sunlight_Visualizer&category=integration)

**See where the sun hits, understand why, and use the values in automations.**

Sunlight Visualizer turns your home into a sun-aware dashboard: useful sensors for automations, and a playful 2.5D house that shows the sun, shadows, power flow, roof production, and optional EV charging at a glance.

> **Need the full guide?** This README is the quick visual front page. The complete setup guide, sensor explanations, automation examples, and troubleshooting live in the [Sunlight Visualizer Wiki](https://github.com/NoUsername10/Sunlight_Visualizer/wiki).

## What You Get
<p>
  <img src="https://github.com/NoUsername10/Sunlight_Visualizer/blob/main/assets/sensors-default.png" width="30%" alt="Default Sunlight Visualizer sensors">
  <img src="https://github.com/NoUsername10/Sunlight_Visualizer/blob/main/assets/sensors-extended_1.png" width="30%" alt="Open-Meteo wall radiation sensors">
  <img src="https://github.com/NoUsername10/Sunlight_Visualizer/blob/main/assets/sensors-extended_3.png" width="30%" alt="Open-Meteo roof radiation sensors">
</p>

**Sensors first:** start simple with wall/roof sun alignment and wall sun angle, then optionally add Open-Meteo radiation, shading demand, shading status, and roof radiation.

<p>
  <img src="https://github.com/NoUsername10/Sunlight_Visualizer/blob/main/assets/house-day.png" width="32%" alt="Sunlight Visualizer day scene">
  <img src="https://github.com/NoUsername10/Sunlight_Visualizer/blob/main/assets/house-dawn.png" width="32%" alt="Sunlight Visualizer dawn scene">
  <img src="https://github.com/NoUsername10/Sunlight_Visualizer/blob/main/assets/house-night.png" width="32%" alt="Sunlight Visualizer night scene">
</p>

**Then the house:** sun, shadows, moon, roof panels, Energy HUD, grid power, EV charger pulse, tree, powerline, and camera controls in one compact Lovelace card.

<p>
  <img src="https://github.com/NoUsername10/Sunlight_Visualizer/blob/main/assets/rotation.gif" width="60%" alt="Sunlight Visualizer rotating card preview">
</p>

Rotate the house manually, auto-rotate it, or save the view that best explains your installation.

## Use It For
- **Sunscreen Alert:** “UV attack incoming” — the sun reaches the pool, go outside and bring the sunscreen.
- **Blind and awning control:** close only when the right wall has direct sun and the sun angle is low enough to matter.
- **Heat-load HVAC prep:** pre-cool when roof or wall exposure rises, relax when exposure drops.
- **Solar output insights:** compare roof sun/radiation with roof power to spot underperformance.

## Quick Highlights
<table>
  <tr>
    <td><strong>Default setup</strong><br>Wall/Roof Sun Alignment + Wall Sun Angle. No external API needed.</td>
    <td><strong>Open-Meteo</strong><br>Radiation Direct/Total, Shading Demand/Status, Roof Radiation.</td>
  </tr>
  <tr>
    <td><strong>Energy HUD</strong><br><code>SOLAR</code>, <code>HOME</code>, <code>GRID</code>, optional <code>CAR</code>, plus power pulses.</td>
    <td><strong>Visual card</strong><br>Sun, shadows, moon, EV cars, powerline, WebGL fallback, camera controls.</td>
  </tr>
</table>

**Release focus:** `0.3.0` adds Open-Meteo radiation sensors, wall sun-angle sensors, Energy HUD improvements, surface `%` selectors, WebGL EV car choices with SVG fallback, zone location selection, stronger resource registration, and many visual/occlusion fixes.

<details>
<summary>Full feature highlights</summary><br>

- **A custom integration** (`sunlight_visualizer`) that calculates wall/roof sun values for automations.
- **A Lovelace card** (`custom:sunlight-visualizer-card`) that shows the sun, house, roof, shadows, power flow, Energy HUD, and optional EV charging visuals.
- **Wall and roof sun alignment:** geometric `%` values showing which surfaces face the sun.
- **Wall Sun Angle:** always-on `°` values for how low/deep sunlight enters a lit wall or window.
- **Open-Meteo radiation:** optional direct/total radiation, shading demand/status, and roof radiation using 15-minute forecast data.
- **Location selection:** Home by default, or choose a `zone.*` override in setup/options.
- **Surface `%` selectors:** choose whether labels show geometric alignment, shading demand, roof radiation percentage, or roof optimal-alignment percentage.
- **EV visuals:** choose `Mini SUV`, `Smart car`, or `SVG car`; WebGL cars fall back to SVG when WebGL is unavailable.
- **Power visuals:** bidirectional grid pulse and EV charger pulse with improved occlusion and draw order.
- **Localized:** English, Swedish, Spanish, and Polish.

</details>

## Installation
### HACS - Recommended
1. Open HACS.
2. Search for **Sunlight Visualizer**.
3. Install **Sunlight Visualizer**.
4. Restart Home Assistant.
5. Add the integration from **Settings → Devices & services → Add integration → Sunlight Visualizer**.
6. Add the card from the Lovelace card picker.

For normal HACS installs, the integration registers the Lovelace card resource automatically. You should not need to add a card resource manually.

<details>
<summary>Manual / non-HACS install backup</summary><br>

If you do not use HACS, copy `custom_components/sunlight_visualizer` into your Home Assistant `custom_components` folder, restart Home Assistant, then add the Lovelace resource manually as a JavaScript module:

```text
/sunlight_visualizer/sunlight-visualizer-card.js?v=0.3.0
```

The `?v=0.3.0` query string is a cache-busting version marker. It helps browsers load the new card bundle after updates.

</details>

## Basic Setup
<p>
  <img src="https://github.com/NoUsername10/Sunlight_Visualizer/blob/main/assets/setup-configuration.png" width="45%" alt="Sunlight Visualizer setup configuration">
  <img src="https://github.com/NoUsername10/Sunlight_Visualizer/blob/main/assets/setup-options.png" width="45%" alt="Sunlight Visualizer options flow">
</p>

**Default setup uses your Home Assistant Home location.** If you need a different place, choose a `zone.*` override. If the selected zone is removed or unavailable, the integration safely falls back to Home.

During setup/options you configure:
- **Zone override:** `Use Home (default)` or a custom `zone.*`.
- **House direction:** compass direction or exact angle for the front door.
- **Roof direction:** which side the roof slopes toward.
- **Ceiling/roof tilt:** used for roof sun and radiation calculations.
- **Update interval:** how often geometric sun values update.
- **Open-Meteo radiation sensors:** optional and disabled by default.
- **Roof power sensor:** optional power value for the roof/card/HUD.

When Open-Meteo is enabled, the integration fetches 15-minute forecast radiation data. While the sun is up it refreshes every 15 minutes; when the sun is down it refreshes hourly. The latest successful same-day forecast is cached so sensors can keep working if a later API call fails.

## Default Sensors
<p>
  <img src="https://github.com/NoUsername10/Sunlight_Visualizer/blob/main/assets/sensors-default.png" width="45%" alt="Default Sunlight Visualizer sensors">
</p>

These sensors are always available without any external weather API:
- **Wall Sun Alignment:** geometric `%` for each wall. Higher means that wall faces the sun more directly.
- **Wall Sun Angle:** `0°` when inactive, otherwise `90 - sun elevation`. Higher means lower sun and deeper light entry through windows.
- **Roof Sun Alignment:** geometric roof-facing `%` using house angle, roof direction, and roof tilt.
- **Roof Sunlight Alignment Percentage:** how close the roof is to today’s best geometric roof alignment.
- **Roof Sunlight Alignment Status:** whether roof alignment is approaching or declining.
- **Sun diagnostics:** azimuth, elevation, and active coordinates.

A simple blind/awning automation can start with **Wall Sun Alignment** and **Wall Sun Angle**. For example: close when a wall has alignment above `20%` and sun angle above `45°`.

## Optional Open-Meteo Sensors
<p>
  <img src="https://github.com/NoUsername10/Sunlight_Visualizer/blob/main/assets/sensors-extended_1.png" width="31%" alt="Open-Meteo wall radiation sensors part 1">
  <img src="https://github.com/NoUsername10/Sunlight_Visualizer/blob/main/assets/sensors-extended_2.png" width="31%" alt="Open-Meteo wall radiation sensors part 2">
  <img src="https://github.com/NoUsername10/Sunlight_Visualizer/blob/main/assets/sensors-extended_3.png" width="31%" alt="Open-Meteo roof radiation sensors">
</p>

Open-Meteo support is opt-in because it uses an external API. When enabled, the integration adds radiation and shading sensors while keeping the default sun-alignment sensors unchanged.

For each wall:
- **Wall Radiation Direct:** direct beam radiation hitting that wall (`W/m²`). This is `0` when the wall has no direct sun.
- **Wall Radiation Total:** direct + diffuse sky + reflected ground radiation (`W/m²`). This can be non-zero even when a wall is not directly lit.
- **Wall Shading Demand:** automation-friendly `%` based on direct radiation and a comfort/elevation curve.
- **Wall Shading Status:** text guidance such as `No direct sun`, `Shade useful`, or `Strong low sun`.

For the roof:
- **Roof Radiation:** forecast-adjusted radiation currently hitting the roof (`W/m²`).
- **Roof Radiation Percentage:** roof radiation relative to today’s forecast peak for that roof.

Open-Meteo can also clean up its own radiation entities when you disable it. In options, uncheck **Remove Open-Meteo sensors when disabling** if you want to keep those entity IDs for later.

| Sensor | Best use |
| --- | --- |
| `Wall Sun Alignment` | Geometry: is this wall facing the sun? |
| `Wall Sun Angle` | Comfort: is the sun low enough to enter deeply? |
| `Wall Radiation Direct` | Physics: how much direct sun hits this wall? |
| `Wall Radiation Total` | Information: all estimated radiation on the wall. |
| `Wall Shading Demand` | Automation: should blinds/awnings probably react? |
| `Wall Shading Status` | Dashboard text for humans. |
| `Roof Radiation Percentage` | How close the roof is to today’s radiation peak. |

## Diagnostics
<p>
  <img src="https://github.com/NoUsername10/Sunlight_Visualizer/blob/main/assets/diagnostic-default.png" width="38%" alt="Default diagnostic sensors">
  <img src="https://github.com/NoUsername10/Sunlight_Visualizer/blob/main/assets/diagnostic-extended.png" width="38%" alt="Open-Meteo diagnostic sensors">
</p>

Default diagnostics show the sun position and the coordinates currently used by the integration. With Open-Meteo enabled, diagnostics also show raw API radiation values and **Open-Meteo Radiation Status**.

The status sensor is intentionally text-based. `OK` means the latest API data is healthy. Error/stale states expose attributes such as latest successful update, minutes since success, fetch attempts, API status, and last error.

## Visual Card Configuration
<p>
  <img src="https://github.com/NoUsername10/Sunlight_Visualizer/blob/main/assets/visual-card-configuration-1.png" width="32%" alt="Visual card configuration orientation and percentage sources">
  <img src="https://github.com/NoUsername10/Sunlight_Visualizer/blob/main/assets/visual-card-configuration-2.png" width="32%" alt="Visual card configuration power and EV options">
  <img src="https://github.com/NoUsername10/Sunlight_Visualizer/blob/main/assets/visual-card-configuration-3.png" width="32%" alt="Visual card configuration HUD options">
</p>

The visual editor is designed so most users do not need YAML. It includes:
- **Size and layout:** card width/height, auto-scale width, and preview pane.
- **House and roof:** house direction, roof direction, roof tilt, and camera rotation.
- **Surface `%` labels:** choose what percentage is painted on walls and roof.
- **Grid connection:** grid flow sensor, sign inversion, power pole, power cable, and power pulse.
- **EV charging:** car charger power sensor, EV visual type, EV scale, and charger pulse.
- **Roof power:** optional roof/solar power sensor and invert support.
- **Energy HUD:** show/hide HUD, auto-compact behavior, roof alignment details, and opacity.
- **Auto-rotate:** default card rotation speed.

## EV Car Choices
<p>
  <img src="https://github.com/NoUsername10/Sunlight_Visualizer/blob/main/assets/car-suv.png" width="30%" alt="Mini SUV EV car">
  <img src="https://github.com/NoUsername10/Sunlight_Visualizer/blob/main/assets/car-smart.png" width="30%" alt="Smart car EV car">
  <img src="https://github.com/NoUsername10/Sunlight_Visualizer/blob/main/assets/car-svg.png" width="30%" alt="SVG EV car fallback">
</p>

The card can show three EV styles:
- **Mini SUV:** default WebGL car in `0.3.0`.
- **Smart car:** alternate WebGL car.
- **SVG car:** lightweight fallback and manual option.

If WebGL is unavailable or fails, the card automatically falls back to the SVG car. `Show mini EV car` still controls whether EV visuals appear at all.

Current EV YAML defaults:

```yaml
miniEvCarEnabled: true
evCarType: mini_suv # svg | smart | mini_suv
evCarScale: 1.25
carChargerEntity: null
```

When a valid car charger power sensor is selected, the HUD can show `CAR`, and the charger cable pulse animates toward the car while charging.

## Auto Binding + Surface % Sources
The card tries to bind integration entities automatically. In most installations you can add the card and it will find the Sunlight Visualizer sensors by their integration source attributes.

Wall percentage source options:
- `auto` — default. Uses `Wall Shading Demand` when Open-Meteo shading sensors are valid; otherwise uses `Wall Sun Alignment`.
- `sun_alignment` — always uses geometric wall sun alignment.
- `shading_demand` — uses Open-Meteo shading demand when available, with safe fallback to sun alignment.

Roof percentage source options:
- `roof_sun_alignment` — default geometric roof sun alignment.
- `roof_radiation_percentage` — Open-Meteo roof radiation relative to today’s roof peak.
- `roof_sunlight_alignment_percentage` — roof optimal-alignment timing percentage.

Legacy manual entity overrides still work when the new source selectors are not explicitly set. For new setups, the visual selectors are recommended.

## Sensor Visual Guide
<details>
<summary>Open the visual sensor guide</summary><br>

These diagrams explain how the main values relate to each other.

<p>
  <img src="assets/readme/sensor-guide-overview.svg" width="90%" alt="Sensor guide overview">
</p>

<p>
  <img src="assets/readme/wall-sunlight-explained.svg" width="90%" alt="Wall sun alignment explained">
</p>

<p>
  <img src="assets/readme/wall-sun-angle-explained.svg" width="90%" alt="Wall sun angle explained">
</p>

<p>
  <img src="assets/readme/radiation-types-explained.svg" width="90%" alt="Radiation types explained">
</p>

<p>
  <img src="assets/readme/shading-demand-explained.svg" width="90%" alt="Shading demand explained">
</p>

<p>
  <img src="assets/readme/roof-radiation-explained.svg" width="90%" alt="Roof radiation explained">
</p>

For deeper examples and troubleshooting, use the [Wiki](https://github.com/NoUsername10/Sunlight_Visualizer/wiki).
</details>

## What The Integration Creates
<details>
<summary>Entity overview</summary><br>

### Always-on sensors
- `sensor.front_wall_sunlight`, `sensor.right_wall_sunlight`, `sensor.back_wall_sunlight`, `sensor.left_wall_sunlight` — friendly names are `Front/Right/Back/Left Wall Sun Alignment`. Entity IDs stay stable from earlier releases.
- `sensor.front_wall_sun_angle`, `sensor.right_wall_sun_angle`, `sensor.back_wall_sun_angle`, `sensor.left_wall_sun_angle` — wall sun-entry angle (`°`). Returns `0°` when the wall is not lit or the sun is down.
- `sensor.roof_sunlight` — friendly name `Roof Sun Alignment`. Entity ID stays stable from earlier releases.
- `sensor.roof_sunlight_alignment_percentage` — roof optimal-alignment timing percentage (`%`).
- `sensor.roof_sunlight_alignment_status` — roof alignment trend/status text.
- `sensor.sun_azimuth`, `sensor.sun_elevation`, `sensor.sun_coordinates` — diagnostic sun/location values.

### Open-Meteo sensors, only when enabled
- `sensor.open_meteo_radiation_status` — diagnostic API/cache status.
- `sensor.open_meteo_shortwave_radiation`, `sensor.open_meteo_direct_radiation`, `sensor.open_meteo_diffuse_radiation`, `sensor.open_meteo_direct_normal_irradiance` — raw diagnostic Open-Meteo values.
- `sensor.front_wall_radiation_total`, `sensor.right_wall_radiation_total`, `sensor.back_wall_radiation_total`, `sensor.left_wall_radiation_total` — `Front/Right/Back/Left Wall Radiation Total` (`W/m²`).
- `sensor.front_wall_radiation_direct`, `sensor.right_wall_radiation_direct`, `sensor.back_wall_radiation_direct`, `sensor.left_wall_radiation_direct` — `Front/Right/Back/Left Wall Radiation Direct` (`W/m²`).
- `sensor.front_wall_shading_demand`, `sensor.right_wall_shading_demand`, `sensor.back_wall_shading_demand`, `sensor.left_wall_shading_demand` — wall shading demand (`%`).
- `sensor.front_wall_shading_status`, `sensor.right_wall_shading_status`, `sensor.back_wall_shading_status`, `sensor.left_wall_shading_status` — wall shading status text.
- `sensor.roof_radiation`, `sensor.roof_radiation_percentage` — roof forecast radiation and percentage of today’s roof peak.

### Number entities
- `number.house_angle` — exact front-door direction in degrees.
- `number.ceiling_tilt` — roof/solar panel tilt.
- `number.update_interval` — sun calculation update interval.
- `number.house_camera_rotation_h`, `number.house_camera_rotation_v` — card camera defaults.
- `number.auto_rotate_speed` — default card auto-rotate speed.

### Select entities
- `select.house_direction` — compass direction for the front door.
- `select.roof_direction` — roof downhill side.

### Switch entities
- `switch.use_custom_house_angle` — use exact angle instead of compass direction.
- `switch.fixed_sun_position` — keep sun visually fixed and rotate the scene.
- `switch.force_sun_fallback` — test mode when the sun is down.
- `switch.roof_power_label` — show roof power label.
- `switch.invert_roof_power` — force roof power positive.

</details>

## Advanced YAML Reference
<details>
<summary>Core / Binding</summary><br>

```yaml
cardWidth: 450
cardHeight: 450
autoScaleWidth: true
preferIntegrationSettings: true

siSourceAttr: sunlight_visualizer_source
siSourceValue: sunlight_visualizer

rotationHEntity: number.house_camera_rotation_h
rotationVEntity: number.house_camera_rotation_v
houseAngleEntity: number.house_angle
fixedSunRotationEnabled: false
fixedSunAzimuthDeg: 225

# Legacy manual overrides. Normally leave these unset and use auto-binding/source selectors.
wallFrontPctEntity: sensor.front_wall_sunlight
wallRightPctEntity: sensor.right_wall_sunlight
wallBackPctEntity: sensor.back_wall_sunlight
wallLeftPctEntity: sensor.left_wall_sunlight
roofPctEntity: sensor.roof_sunlight

# Percentage painted on wall and roof surfaces
wallPercentSource: auto # auto | sun_alignment | shading_demand
roofPercentSource: roof_sun_alignment # roof_sun_alignment | roof_radiation_percentage | roof_sunlight_alignment_percentage

roofPowerEntity: null
roofPowerEnabled: false
roofPowerInvert: false
gridFlowEntity: null
gridFlowInvert: false
carChargerEntity: null

energyHudEnabled: true
energyHudAutoCompact: true
energyHudRoofAlignmentEnabled: true
energyHudCompactAtPx: 360
energyHudUltraCompactAtPx: 300
energyHudOpacity: 0.45

miniEvCarEnabled: true
evCarType: mini_suv # svg | smart | mini_suv
evCarScale: 1.25

sunAzEntity: null
sunElEntity: null
useSunEntity: false
sunEntityId: sun.sun
```
</details>

<details>
<summary>House / Roof / Surface Labels</summary><br>

```yaml
houseAngle: 0
roofTiltEnabled: true
roofTiltDeg: 25
roofTiltFace: front
roofTiltMax: 89
roofTiltOpacity: 1.0

houseStyleV2: true
flatRoofEnabled: true
flatRoofOverhang: 0.15
flatRoofThickness: 0.12
flatRoofTopColor: "#e6e8ee"
flatRoofSideColor: "#9ea4af"

wallWindowsEnabled: true
frontDoorEnabled: true
roofPanelsEnabled: true

surfaceLabelEnabled: true
surfaceLabelSize: 25
surfaceLabelOffset: 0.03
wallPctVisibleThreshold: -0.215
wallPctAreaThreshold: 120
wallPctVerticalPos: 0.66
roofPctLabelScale: 1.18
roofPowerLabelScale: 0.70

floorWallLabelSize: 12
floorWallLabelOffset: 0.85
floorWallLabelScaleBoost: 1.2
floorWallLabelScaleMin: 0.5
floorWallLabelScaleMax: 1.8
```
</details>

<details>
<summary>Powerline / Energy HUD / EV</summary><br>

```yaml
powerlineEnabled: true
powerlinePulseEnabled: true
powerlinePulseIntervalSec: 5
powerPoleX: 2.2
powerPoleZ: 2.2

# Optional whole-house/grid flow source, power sensor only.
gridFlowEntity: null
gridFlowInvert: false

# Optional EV charger source, power sensor only.
carChargerEntity: null

# Energy HUD.
energyHudEnabled: true
energyHudAutoCompact: true
energyHudRoofAlignmentEnabled: true
energyHudCompactAtPx: 360
energyHudUltraCompactAtPx: 300
energyHudOpacity: 0.45

# EV car visual.
miniEvCarEnabled: true
evCarType: mini_suv # svg | smart | mini_suv
evCarScale: 1.25

# Below 300x300 the HUD uses clickable (i) mode.
# At night the HUD can collapse automatically to avoid moon overlap.
```
</details>

<details>
<summary>Visual Environment</summary><br>

```yaml
shadowEnabled: true
sunlightEnabled: true
facadeSunDimmingEnabled: true
horizonEnabled: true
skyCloudsEnabled: true
skyStarsEnabled: true
skyMoonEnabled: true
moonlightEnabled: true
sunBeamFlowEnabled: true
sunRayAnimEnabled: true
backTreeEnabled: true
floorGrassEnabled: true
```
</details>

<details>
<summary>Rotation / Performance</summary><br>

```yaml
autoRotateEnabledDefault: false
autoRotateSpeed: 25
autoRotateIntervalMs: 50
autoRotateStopOnFullTurn: true
autoRotateTurnCount: 1
autoRotateShowFps: true
autoRotateAdaptiveEnabled: true
cssFpsDebugEnabled: false
cssFpsAutoLimitEnabled: true
```
</details>

## Validation / Localization / Notes
- Current release: `0.3.0`.
- HACS-friendly resource registration is handled by the integration.
- HACS/Hassfest validation is expected for release checks.
- Supported translations: English, Swedish, Spanish, and Polish.
- In Force Sun Fallback mode, the card displays `SUN OVERRIDE ENABLED` and disables live solar-alignment calculation for testing.
- The [Wiki](https://github.com/NoUsername10/Sunlight_Visualizer/wiki) has the deeper setup guide, automation examples, troubleshooting steps, and sensor explanations.

## Changelog
See [`CHANGELOG.md`](./CHANGELOG.md).
