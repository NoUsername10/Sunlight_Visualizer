# Sunlight Visualizer
<img src="https://github.com/NoUsername10/Sunlight_Visualizer/blob/main/assets/icon@2x.png" width="10%" height="10%">

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-41BDF5.svg)](https://github.com/hacs/integration)
[![coffee_badge](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-donate-orange.svg)](https://www.buymeacoffee.com/DefaultLogin)

An interactive sunlight intensity visualizer for Home Assistant.

It includes:
- A custom integration (`sunlight_visualizer`) that calculates wall/roof sunlight values.
- A Lovelace card (`custom:sunlight-visualizer-card`) that renders a 2.5D house with sun, shadows, roof/wall values, optional roof power, sky effects, and camera controls.

<img src="https://github.com/NoUsername10/Sunlight_Visualizer/blob/main/assets/house-day.png" width="25%" height="25%"> <img src="https://github.com/NoUsername10/Sunlight_Visualizer/blob/main/assets/house-dawn.png" width="25%" height="25%"> <img src="https://github.com/NoUsername10/Sunlight_Visualizer/blob/main/assets/house-night.png" width="25%" height="25%">


GIF (on macOS Safari: right click + "Play animation"):
<br>
<img src="https://github.com/NoUsername10/Sunlight_Visualizer/blob/main/assets/rotation.gif" width="40%" height="40%">



## Instant Overview
- Real-time sun physics from azimuth/elevation + house angle + roof tilt.
- Surface intensity sensors for all 4 walls + roof.
- Roof alignment percentage/status sensors.
- Roof power label (optional) with invert support.
- Localized config/options/services text (English, Swedish, Spanish).
- Flat-roof v2 visuals: overhang, windows, door, roof panels, tree.
- Day/night scene with clouds, stars, moon, twilight gradients.
- Auto rotate + manual camera controls + save/restore view.
- Performance adaptation for slow displays.

## Quick Start (Card)
Minimal:
```yaml
type: custom:sunlight-visualizer-card
```
## Card Behavior
- Double tap card: start/stop auto-rotation.
- Side/bottom controls: manual camera rotate.
- Rotation stops automatically after configured turn count.
- Save button stores current camera H/V to integration entities.
- Restore button returns to saved integration camera values.

## Most Used (Start Here)
<details>
<summary>Setup options</summary><br>

These are the most important settings in integration setup/options:
- House Direction preset or custom House Angle
- Roof Direction (`front`, `left`, `back`, `right`)
- Ceiling Tilt
- Update Interval
- Auto Rotate Speed
- Roof power settings:
  - Enable roof power label
  - Select roof power sensor
  - Invert value if your power sensor reports negative production
- Force Sun Fallback:
  - Enable/disable override
  - Set forced sun azimuth/elevation for testing

<img src="https://github.com/NoUsername10/Sunlight_Visualizer/blob/main/assets/options.png" width="35%" height="35%">
<br>
</details>

<details>
<summary>Configuration options</summary><br>

In integration configuration/options you can tune:
- Ceiling Tilt
- House Angle
- Camera Rotation H / V (default view)
- House Direction preset
- Roof Direction
- Update Interval
- Auto rotate speed
- Force Sun fallback values

<img src="https://github.com/NoUsername10/Sunlight_Visualizer/blob/main/assets/configuration.png" width="55%" height="55%">
<br>
</details>

<details>
<summary>Sunlight sensors</summary><br>

Created entities include:
- `sensor.sun_wall_intensity_front` — Sunlight intensity on front wall (%).
- `sensor.sun_wall_intensity_left` — Sunlight intensity on left wall (%).
- `sensor.sun_wall_intensity_back` — Sunlight intensity on back wall (%).
- `sensor.sun_wall_intensity_right` — Sunlight intensity on right wall (%).
- `sensor.sun_roof_intensity` — Sunlight intensity on the roof surface (%).
- `sensor.sun_roof_alignment_percentage` — Current roof alignment versus best possible alignment for today (%).
- `sensor.sun_roof_alignment_status` — Human-readable status for roof alignment trend.

<img src="https://github.com/NoUsername10/Sunlight_Visualizer/blob/main/assets/sensors.png" width="55%" height="55%">
<br>
</details>

<details>
<summary>Visual card configuration</summary><br>

You can also configure common card behavior visually:
- Roof power options
- Auto rotation speed
- Camera controls
- House/roof orientation values

<img src="https://github.com/NoUsername10/Sunlight_Visualizer/blob/main/assets/visual_card_configuration.png" width="55%" height="55%">
<br>
</details>


## Changelog
See [`CHANGELOG.md`](./CHANGELOG.md).

## Installation (HACS)
1. Add this repository in HACS as **Integration**.
2. Install **Sunlight Visualizer**.
3. Restart Home Assistant.
4. Add integration in **Settings → Devices & Services**.
5. Add the card in Lovelace as `custom:sunlight-visualizer-card`.

The integration serves and auto-registers the card resource at:
- `/sunlight_visualizer/sunlight-visualizer-card.js`

If manual resource registration is needed:
- URL: `/sunlight_visualizer/sunlight-visualizer-card.js`
- Type: `module`

## Validation
- HACS validation workflow: `.github/workflows/hacs.yaml`
- Hassfest validation workflow: `.github/workflows/hassfest.yaml`

## Localization
- Default source strings: `/custom_components/sunlight_visualizer/strings.json`
- Runtime translations:
  - `/custom_components/sunlight_visualizer/translations/en.json`
  - `/custom_components/sunlight_visualizer/translations/sv.json`
  - `/custom_components/sunlight_visualizer/translations/es.json`

## What The Integration Creates

<details>
<summary>Sensors, Numbers, Enteties</summary><br>

### Sensors
- `sensor.sun_wall_intensity_front` — Front wall sunlight intensity (%).
- `sensor.sun_wall_intensity_left` — Left wall sunlight intensity (%).
- `sensor.sun_wall_intensity_back` — Back wall sunlight intensity (%).
- `sensor.sun_wall_intensity_right` — Right wall sunlight intensity (%).
- `sensor.sun_roof_intensity` — Roof sunlight intensity (%).
- `sensor.sun_roof_alignment_percentage` — Roof alignment percentage vs today's best available alignment.
- `sensor.sun_roof_alignment_status` — Alignment trend/status text.

### Number entities
- `number.house_angle`
- `number.ceiling_tilt`
- `number.update_interval`
- `number.house_camera_rotation_h`
- `number.house_camera_rotation_v`

### Select entities
- `select.house_direction`
- `select.roof_direction`

</details>


## Auto Binding
By default the card auto-binds to integration entities using:
- `sunlight_visualizer_source: sunlight_visualizer`

You can still override entities in YAML when needed.

## Advanced (Full YAML Reference)
<details>
<summary>Core / Binding</summary><br>

```yaml
cardWidth: 450
cardHeight: 450
preferIntegrationSettings: true

siSourceAttr: sunlight_visualizer_source
siSourceValue: sunlight_visualizer

rotationHEntity: number.house_camera_rotation_h
rotationVEntity: number.house_camera_rotation_v
houseAngleEntity: number.house_angle

wallFrontPctEntity: sensor.sun_wall_intensity_front
wallRightPctEntity: sensor.sun_wall_intensity_right
wallBackPctEntity: sensor.sun_wall_intensity_back
wallLeftPctEntity: sensor.sun_wall_intensity_left
roofPctEntity: sensor.sun_roof_intensity

roofPowerEntity: null
roofPowerEnabled: false
roofPowerInvert: false

sunAzEntity: null
sunElEntity: null
useSunEntity: false
sunEntityId: sun.sun
```
</details>

<details>
<summary>Manual Sun / Visual Sun Position</summary><br>

```yaml
sunDistance: 3.0
sunAz: 135
sunEl: 55
sunVisualElevationBiasDeg: 6
sunVisualElevationScale: 1.0
```
</details>

<details>
<summary>House / Roof Orientation</summary><br>

```yaml
houseAngle: 0
roofTiltEnabled: true
roofTiltDeg: 25
roofTiltFace: front
roofTiltMax: 89
roofTiltOpacity: 1.0

roofBackEnabled: true
roofBackMix: 0.7
roofBackOpacity: 1.0

roofSidesEnabled: true
roofSideMix: 0.45
roofSideOpacity: 1.0
roofSideDepthBias: 0.012
roofCapEnabled: true

roofGradientDarkMix: 0.125
roofGradientLightMix: 1.25
```
</details>

<details>
<summary>V2 House Style</summary><br>

```yaml
houseStyleV2: true
flatRoofEnabled: true
flatRoofOverhang: 0.15
flatRoofThickness: 0.12
flatRoofLift: 0.0
flatRoofTopColor: "#e6e8ee"
flatRoofSideColor: "#9ea4af"
flatRoofEdgeColor: "#c7ccd5"
flatRoofTopOpacity: 1.0
flatRoofEdgeOpacity: 1.0
flatRoofTopDepthBias: 0.06
flatRoofSideDepthBias: 0.025
flatRoofSkirtDepthBias: 0.02
flatRoofSideShade: 0.40

wallWindowsEnabled: true
wallWindowGlassColor: "rgba(110,178,212,0.68)"
wallWindowFrameColor: "rgba(221,228,236,0.98)"
wallWindowStrokeColor: "rgba(62,105,130,0.65)"
wallWindowStrokeWidth: 1.0

frontDoorEnabled: true
frontDoorWidth: 0.55
frontDoorHeight: 1.1
frontDoorBottomInset: 0.05
frontDoorOffset: 0.01
frontDoorOpacity: 0.9
frontDoorColor: "rgba(0,0,0,0.55)"
frontDoorFrameColor: "rgba(219,225,232,0.98)"
frontDoorKnobColor: "rgba(236,198,111,0.95)"

roofPanelsEnabled: true
roofPanelsCols: 3
roofPanelsWidthFrac: 0.90
roofPanelsGapFrac: 0.025
roofPanelsT0: 0.05
roofPanelsT1: 0.26
roofPanelColor: "#2d3f7b"
roofPanelGridColor: "rgba(214,230,255,0.65)"
roofPanelBorderColor: "rgba(185,204,234,0.85)"
roofPanelBorderWidth: 0.9
roofPanelGridCols: 5
roofPanelGridRows: 3
```
</details>

<details>
<summary>Tree / Patio / Plinth</summary><br>

```yaml
backTreeEnabled: true
backTreeX: -2.2
backTreeZ: -2.2
backTreeScale: 1.0
backTreeLeafColor: "#9bc94b"
backTreeTrunkColor: "#6f4b2a"
backTreeShadowEnabled: houseStyleV2
backTreeShadowLength: 0.015
backTreeShadowOpacity: 0.35
backTreeShadowBlur: 1.1

plinthBandEnabled: houseStyleV2
plinthBandHeight: 0.06
plinthBandMix: 0.62

patioStepEnabled: houseStyleV2
patioStepWidth: 1.1
patioStepDepth: 0.24
patioStepInset: 0.02
patioStepColor: "rgba(226,230,235,0.75)"
patioGridColor: "rgba(164,170,182,0.8)"
patioGridWidth: 1.0
```
</details>

<details>
<summary>Floor / Compass / Pointer</summary><br>

```yaml
floorScale: 2.6
floorColor: "#2f2f2f"
floorCornerRadius: 26
floorGrassEnabled: true
floorGrassColorA: "rgb(136,186,88)"
floorGrassColorB: "rgb(96,150,62)"
floorGrassOpacity: 0.30
floorThicknessPx: 7
floorThicknessColor: "rgba(150,106,64,0.9)"
floorTopStrokeColor: "rgba(72,112,56,0.8)"
floorTopStrokeWidth: 1.4

floorCompassStroke: 4
floorCompassRingBand: 0.09
floorCompassRingMiddleColor: "rgba(255,255,255,0.9)"
floorCompassRingSideColor: "rgba(210,140,140,0.345)"
floorCompassRingSideWidth: 3
floorCompassTicksEnabled: true
floorCompassTickColor: "rgba(0,0,0,0.75)"
floorCompassTickWidth: 1
floorCompassTickMajorWidth: 4
floorCompassTickLength: -0.1
floorCompassTickMajorLength: -0.2
floorCompassLabelSize: 20
floorCompassLabelInset: -0.25
floorCompassLabelScaleBoost: 1.2
floorCompassLabelScaleMin: 0.6
floorCompassLabelScaleMax: 2.0
floorCompassLabelStroke: 1

arrowScaleBoost: 0.60
floorPointerScaleMin: 0.05
floorPointerScaleMax: 1.0
floorPointerBaseWidth: 3.4
floorPointerBaseHead: 18
floorPointerColor: gold
floorPointerShadowEnabled: true
floorPointerShadowOpacity: 0.8
floorPointerShadowBlur: 1.1
floorPointerShadowOffset: 2.9
```
</details>

<details>
<summary>Surface Labels</summary><br>

```yaml
surfaceLabelEnabled: true
surfaceLabelSize: 12
surfaceLabelScaleBoost: 1.5
surfaceLabelScaleMin: 0.6
surfaceLabelScaleMax: 1.6
surfaceLabelColor: "rgba(255,213,0,.95)"
surfaceLabelStroke: "rgba(0,0,0,0.5)"
surfaceLabelStrokeWidth: 0.5
surfaceLabelOffset: 0.03

wallPctVisibleThreshold: -0.215
wallPctAreaThreshold: 120
wallPctVerticalPos: 0.66

roofPctLabelScale: 1.18
roofPowerLabelScale: 0.70
roofPowerLabelColor: "rgba(255,255,255,0.9)"

floorWallLabelSize: 12
floorWallLabelOffset: 0.55
floorWallLabelScaleBoost: 1.2
floorWallLabelScaleMin: 0.5
floorWallLabelScaleMax: 1.8
floorWallLabelScreenLift: 6
floorWallLabelColor: "rgba(255,255,255,0.9)"
floorWallLabelStroke: "rgba(0,0,0,0.6)"
floorWallLabelStrokeWidth: 0.5
wallLabelVisibleThreshold: -0.05
```
</details>

<details>
<summary>Sunlight / Shadows / Dimming</summary><br>

```yaml
shadowEnabled: true
shadowOpacity: 0.35
shadowBlur: 4
shadowContactOpacity: 0.12
shadowContactBlur: 2.5
shadowColor: "#000000"
shadowClipInset: 0.02
shadowSunMoonBlendDeg: 3

sunlightEnabled: true
sunlightColor: [255, 225, 160]
sunlightOpacity: 0.7
sunlightSpread: 0.7

facadeSunDimmingEnabled: true
facadeSunMinFactor: 0.2
facadeSunNoDimAtPct: 90
facadeSunCurve: 8

baseAnchorShadowEnabled: true
baseAnchorShadowOpacity: 0.65
baseAnchorShadowBlur: 0.2
baseAnchorShadowSpread: 0.05
baseAnchorShadowColor: "#000000"
```
</details>

<details>
<summary>Sky / Horizon / Night</summary><br>

```yaml
horizonEnabled: true
horizonBase: 0.55
horizonTiltStrength: 0.65
horizonBand: 0.15
horizonTopColor: [120, 170, 220]
horizonBandColor: [255, 210, 150]
horizonBottomColor: [70, 80, 95]

horizonSunriseTopColor: [118, 150, 206]
horizonSunriseBandColor: [236, 162, 132]
horizonSunriseBottomColor: [84, 70, 90]

horizonSunsetTopColor: [98, 106, 178]
horizonSunsetBandColor: [255, 122, 90]
horizonSunsetBottomColor: [82, 48, 76]

horizonNightTopColor: [12, 20, 42]
horizonNightBandColor: [32, 44, 82]
horizonNightBottomColor: [6, 10, 22]

skyTwilightRangeDeg: 6

skyCloudsEnabled: true
skyCloudSpeed: 1.0
skyCloudOpacity: 0.34
skyCloudBlur: 3.3
skyCloudScale: 1.5
skyCloudHeight: 0.5

skyStarsEnabled: true
skyStarsCount: 34
skyStarsOpacity: 0.9
skyStarsTwinkleEnabled: true

skyMoonEnabled: true
skyMoonX: 0.86
skyMoonY: 0.12
skyMoonSize: 14
skyMoonPhase: 0.72
skyMoonOpacity: 0.92

moonlightEnabled: true
moonlightColor: [178, 208, 255]
moonlightOpacity: 0.22
moonlightSpread: 0.60
moonlightWashOpacity: 0.08
moonShadowYawDeg: -45
moonShadowElevationDeg: 18
```
</details>

<details>
<summary>Sun Beams / Sun Ray Animation</summary><br>

```yaml
sunBeamStaticOpacity: 0.07
sunBeamStaticWidth: 1.6
sunBeamFlowEnabled: true
sunBeamFlowColor: "rgba(255,200,50,0.85)"
sunBeamFlowOpacity: 0.55
sunBeamFlowWidthScale: 0.6
sunBeamFlowDash: 8
sunBeamFlowGap: 50
sunBeamFlowDuration: 2.5
sunBeamFlowPhaseStep: 0.1
sunBeamDepthScaleBoost: 1.0
sunBeamDepthScaleMin: 0.55
sunBeamDepthScaleMax: 1.2
sunBeamRaySpacingPx: 40
sunBeamRayMinSepPx: 16
sunBeamSilhouetteMinRays: 3
sunBeamSilhouetteMaxRays: 7

sunRayAnimEnabled: true
sunRayAnimScaleMin: 0.5
sunRayAnimScaleMax: 0.75
sunRayAnimOpacityMin: 0.45
sunRayAnimOpacityMax: 0.85
sunRayAnimDurationMin: 1.8
sunRayAnimDurationMax: 3.0
sunRayAnimColorA: "rgb(255,240,110)"
sunRayAnimColorB: "rgb(255,175,35)"
```
</details>

<details>
<summary>Rotation / Performance</summary><br>

```yaml
autoRotateEnabledDefault: false
autoRotateSpeed: 10
autoRotateIntervalMs: 50
autoRotateTapDelayMs: 250
autoRotateStopOnFullTurn: true
autoRotateTurnCount: 1
autoRotateShowFps: true
autoRotateFpsWindowMs: 1000
autoRotateAdaptiveEnabled: true
autoRotateAdaptiveMaxIntervalMs: 1000
autoRotateAdaptiveStepMs: 10
autoRotateAdaptiveCheckMs: 1000
autoRotateAdaptiveFpsThreshold: 0.80
autoRotateCalibrateMs: 2000
autoRotateCalibrateFactor: 0.85

cssFpsDebugEnabled: false
cssFpsUiUpdateMs: 500
cssFpsWindowMs: 1000
cssFpsAutoLimitEnabled: true
cssFpsLimitThreshold: 20
cssFpsLimitFactor: 0.5
cssFpsLimitMin: 1
cssFpsLimitMax: 30
cssFpsRotationStartBoost: 2
cssFpsCalibrateMs: 2000
cssFpsLimitTextEnabled: true
```
</details>

<details>
<summary>Color tuning (walls/ceiling)</summary><br>

```yaml
faceColors:
  front: "#faf5f5ff"
  right: "#d8d2d2ff"
  top: "#13a057"
  back: "#d8d2d2ff"
  left: "#d8d2d2ff"
  bottom: "#d8d2d2ff"

wallBottomMix: 0.01
wallMidMix: 0.7
wallTopMix: 1.3
ceilingDarkMix: 0.1
ceilingLightMix: 1.40

vignetteEnabled: true
vignetteOpacity: 0.35
vignetteRadius: 0.65
vignetteInner: 0.85
vignetteColor: [0, 0, 0]
```
</details>

## Notes
- With `preferIntegrationSettings: true` (default), integration entities/options are the primary source for camera/orientation/power settings.
- In Force Sun Fallback mode, the card displays `SUN OVERRIDE ENABLED`.
- Legacy/reserved keys with no active visual effect are intentionally omitted.
