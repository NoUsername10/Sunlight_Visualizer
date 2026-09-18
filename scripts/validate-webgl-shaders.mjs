import { spawn } from "node:child_process";
import {
  accessSync,
  constants,
  createReadStream,
  existsSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(scriptDir, "..");
const bundlePath = resolve(repoRoot, "custom_components", "sunlight_visualizer", "www", "sunlight-visualizer-card.js");
const modelPath = process.env.SV_MODEL_PATH
  ? resolve(process.env.SV_MODEL_PATH)
  : resolve(
    repoRoot,
    "custom_components",
    "sunlight_visualizer",
    "www",
    "models",
    "experimental-house.glb",
  );
const expectBakedNightLighting = process.env.SV_EXPECT_BAKED_NIGHT_LIGHTING === "1";

const REQUIRED_PROGRAM_KEYS = [
  "sv-glb-static-color-depth-v1",
  "sv-weather-cloud-deck-v7",
  "sv-weather-rain-instanced-v11",
  "sv-weather-rain-splashes-v9",
  "sv-weather-rain-splash-droplets-v2",
  "sv-weather-snow-gpu-v1",
  "sv-weather-leaf-gust-v4",
  "sv-weather-fog-soft-depth-v5",
  "sv-weather-lightning-core-v2",
  "sv-weather-lightning-glow-v2",
  "sv-solar-panel-pulse-v3-cells",
  "sv-solar-panel-pulse-v3-glass",
];

const CRITICAL_WEBGL_PATTERN = /WebGLProgram|Shader Error|VALIDATE_STATUS|INVALID_OPERATION|texImage3D|Unable to create an active WebGL|WebGL context lost/i;

function sleep(milliseconds) {
  return new Promise((resolveSleep) => setTimeout(resolveSleep, milliseconds));
}

function browserCandidates() {
  const explicit = [
    process.env.SV_BROWSER_PATH,
    process.env.CHROME_PATH,
    process.env.GOOGLE_CHROME_BIN,
  ].filter(Boolean);
  if (process.platform === "darwin") {
    return [
      ...explicit,
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
      "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser",
      "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
      "/Applications/Chromium.app/Contents/MacOS/Chromium",
    ];
  }
  if (process.platform === "win32") {
    const programFiles = [process.env.PROGRAMFILES, process.env["PROGRAMFILES(X86)"]].filter(Boolean);
    const localAppData = process.env.LOCALAPPDATA;
    return [
      ...explicit,
      ...programFiles.map((base) => join(base, "Google", "Chrome", "Application", "chrome.exe")),
      ...programFiles.map((base) => join(base, "Microsoft", "Edge", "Application", "msedge.exe")),
      ...(localAppData ? [join(localAppData, "Google", "Chrome", "Application", "chrome.exe")] : []),
    ];
  }
  return [
    ...explicit,
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
    "/usr/bin/microsoft-edge",
  ];
}

function findBrowser() {
  for (const candidate of browserCandidates()) {
    try {
      accessSync(candidate, constants.X_OK);
      return candidate;
    } catch {
      // Continue through known Chromium-family browser locations.
    }
  }
  throw new Error(
    "No Chromium-family browser found for real WebGL shader validation. "
      + "Install Chrome/Chromium/Brave/Edge or set SV_BROWSER_PATH.",
  );
}

function smokePage() {
  const sunState = expectBakedNightLighting ? "below_horizon" : "above_horizon";
  const sunElevation = expectBakedNightLighting ? -18 : 45;
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <style>body{margin:0}sunlight-visualizer-card{display:block;width:450px;height:450px}</style>
  <script>
    // Reconnection must not rely on a ResizeObserver callback. HA can detach
    // and reattach a card at the same size while saving its editor config.
    window.ResizeObserver = class {
      observe() {}
      disconnect() {}
    };
    window.__svErrors = [];
    const stringify = (value) => {
      try { return typeof value === "string" ? value : JSON.stringify(value); }
      catch { return String(value); }
    };
    for (const level of ["error", "warn"]) {
      const original = console[level].bind(console);
      console[level] = (...args) => {
        window.__svErrors.push(args.map(stringify).join(" "));
        original(...args);
      };
    }
    addEventListener("error", (event) => window.__svErrors.push(String(event.error || event.message)));
    addEventListener("unhandledrejection", (event) => window.__svErrors.push(String(event.reason)));
  </script>
  <script type="module" src="/sunlight_visualizer/sunlight-visualizer-card.js"></script>
</head>
<body data-smoke="pending">
  <script type="module">
    const required = ${JSON.stringify(REQUIRED_PROGRAM_KEYS)};
    const criticalPattern = ${CRITICAL_WEBGL_PATTERN};
    const finish = (status, detail) => {
      document.body.dataset.smoke = status;
      document.body.dataset.detail = String(detail || "").slice(0, 6000);
    };
    try {
      await customElements.whenDefined("sunlight-visualizer-card");
      const hass = {
        states: {
          "sun.sun": {
            state: ${JSON.stringify(sunState)},
            attributes: {
              azimuth: 135,
              elevation: ${sunElevation},
              next_rising: "2026-09-08T06:00:00+00:00",
              next_setting: "2026-09-07T18:00:00+00:00",
            },
          },
          "sensor.roof_power": {
            state: "1200",
            attributes: { device_class: "power", unit_of_measurement: "W" },
          },
        },
        config: { time_zone: "UTC" },
        locale: { language: "en" },
        services: {},
        callService: async () => {},
        callWS: async () => ({}),
        callApi: async () => ({}),
      };

      const editor = document.createElement("sunlight-visualizer-card-editor");
      editor.setConfig({ rendererMode: "three_d" });
      let editorConfigChanges = 0;
      editor.addEventListener("config-changed", () => { editorConfigChanges += 1; });
      editor._setRendererMode({ detail: { value: "" } });
      if (editorConfigChanges !== 0 || editor._config.rendererMode !== "three_d") {
        throw new Error("Transient empty renderer selector event changed the saved mode");
      }

      const svgCard = document.createElement("sunlight-visualizer-card");
      svgCard.setConfig({
        rendererMode: "two_point_five_d",
        cardWidth: 450,
        cardHeight: 450,
        autoScaleWidth: false,
      });
      svgCard.hass = hass;
      document.body.append(svgCard);
      await svgCard.updateComplete;
      if (!svgCard.shadowRoot?.querySelector("svg.sv-scene")) {
        throw new Error("2.5D renderer did not produce its SVG scene");
      }
      if (svgCard.shadowRoot?.querySelector("canvas") || svgCard._threeHouseRenderer) {
        throw new Error("2.5D renderer created a Three.js canvas or renderer");
      }
      const rotationBefore = Number(svgCard._autoRotateOffsetDeg || 0);
      const pointerTarget = {
        setPointerCapture() {},
        hasPointerCapture() { return false; },
        releasePointerCapture() {},
      };
      const pointerEvent = (clientX, clientY) => ({
        button: 0,
        pointerType: "mouse",
        pointerId: 17,
        clientX,
        clientY,
        currentTarget: pointerTarget,
        preventDefault() {},
        stopPropagation() {},
      });
      svgCard._handleTwoPointFiveDPointerDown(pointerEvent(100, 100));
      svgCard._handleTwoPointFiveDPointerMove(pointerEvent(135, 112));
      svgCard._handleTwoPointFiveDPointerEnd(pointerEvent(135, 112));
      if (Number(svgCard._autoRotateOffsetDeg || 0) === rotationBefore) {
        throw new Error("2.5D drag control did not update camera rotation");
      }
      svgCard.remove();

      const card = document.createElement("sunlight-visualizer-card");
      card.setConfig({
        rendererMode: "three_d",
        cardWidth: 450,
        cardHeight: 450,
        autoScaleWidth: false,
        weatherVisuals: "strong",
        weatherTestEnabled: true,
        weatherTestCloudCover: 100,
        weatherTestRain: 10,
        weatherTestSnowfall: 5,
        weatherTestFog: 100,
        weatherTestWindSpeed: 30,
        weatherTestWindDirection: 90,
        weatherTestThunder: true,
        useSunEntity: true,
        sunEntityId: "sun.sun",
        roofPowerEnabled: true,
        roofPowerEntity: "sensor.roof_power",
      });
      card.hass = hass;
      document.body.append(card);

      const started = Date.now();
      let lightningCompiled = false;
      let reconnectStartedAt = 0;
      let rendererBeforeReconnect = null;
      let canvasBeforeReconnect = null;
      let configSaveApplied = false;
      let reconnectAnimationStartedAt = 0;
      let reconnectWeatherTime = 0;
      let visibilityValidated = false;
      let gestureValidated = false;
      let colorParityValidated = false;
      const colorParityResults = [];
      let fogBudgetResult = "";
      const validateViewportPause = async () => {
        if (typeof IntersectionObserver !== "function") throw new Error("Native IntersectionObserver required for visibility test");
        const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
        const waitFor = async (predicate, label) => {
          const deadline = Date.now() + 4000;
          while (!predicate()) {
            if (Date.now() > deadline) throw new Error(label);
            await sleep(40);
          }
        };
        const renderer = card._threeHouseRenderer;
        const model = card._threeHouseModel;
        const cache = card._threeHouseRenderCache;
        const originalRender = cache.render;
        const originalConfig = { ...card._config };
        let frames = 0;
        cache.render = function (...args) {
          frames += 1;
          return originalRender.apply(this, args);
        };
        const spacer = document.createElement("div");
        spacer.style.height = (innerHeight * 3) + "px";
        document.body.append(spacer);
        const assertPaused = async (label) => {
          await waitFor(() => !card._threeHouseInViewport, label + ": observer did not pause");
          await card.updateComplete;
          const pausedFrames = frames;
          const weatherTime = card._threeHouseWeatherVisuals.rainUniforms.time.value;
          const rotation = card._autoRotateOffsetDeg;
          card.hass = { ...hass };
          card.setConfig({ ...card._config });
          await card.updateComplete;
          card._scheduleThreeHouseVisualLoop(true);
          card._scheduleThreeHouseVisualLoop(false, 20);
          card._renderThreeHouseScene();
          await sleep(250);
          if (frames !== pausedFrames || card._threeHouseWeatherVisuals.rainUniforms.time.value !== weatherTime) {
            throw new Error(label + ": hidden scene continued rendering/animating");
          }
          if (card._threeHouseVisualFrame !== null || card._threeHouseVisualWakeTimer !== null
            || card._threeHouseUfoPassiveTimer !== null || card._autoRotateTimer
            || card._cssFpsRaf || card._cssFpsCalibRaf || card._cssGlobalTickTimer) {
            throw new Error(label + ": hidden scene retained an animation scheduler");
          }
          if (card._autoRotateOffsetDeg !== rotation) throw new Error(label + ": hidden camera kept rotating");
        };
        const assertResumed = async (label) => {
          const pausedFrames = frames;
          const weatherTime = card._threeHouseWeatherVisuals.rainUniforms.time.value;
          await waitFor(() => card._threeHouseInViewport && frames > pausedFrames
            && card._threeHouseWeatherVisuals.rainUniforms.time.value > weatherTime, label + ": animation did not resume");
          if (card._threeHouseRenderer !== renderer || card._threeHouseModel !== model) {
            throw new Error(label + ": visibility change recreated the renderer/model");
          }
          if (!card._autoRotateEnabled || !card._autoRotateTimer) throw new Error(label + ": automatic rotation did not resume");
        };
        try {
          card._autoRotateStartFn();
          await card.updateComplete;
          await waitFor(() => frames > 0 && card._autoRotateTimer, "Visible scene was not animating");
          window.scrollTo(0, card.offsetTop + card.offsetHeight + 50);
          await assertPaused("Scrolled fully outside viewport");
          window.scrollTo(0, card.offsetTop + card.offsetHeight - 50);
          await assertResumed("Partially visible card");
          const rect = card.getBoundingClientRect();
          if (!(rect.top < 0 && rect.bottom > 0 && rect.bottom < innerHeight)) {
            throw new Error("Scroll test did not leave the card partially visible");
          }
          card.style.display = "none";
          await assertPaused("Retained card hidden by dashboard");
          card.style.display = "block";
          window.scrollTo(0, 0);
          await assertResumed("Dashboard shown again");
        } finally {
          cache.render = originalRender;
          card.style.display = "block";
          card._autoRotateStop();
          card.setConfig(originalConfig);
          spacer.remove();
          window.scrollTo(0, 0);
          await card.updateComplete;
        }
      };
      const validateFogBudget = () => {
        const renderer = card._threeHouseRenderer;
        const cache = card._threeHouseRenderCache;
        const fog = card._threeHouseWeatherVisuals.fog;
        const wasVisible = fog.mesh.visible;
        const autoReset = renderer.info.autoReset;
        const options = { width: 450, height: 450, pixelRatio: 1,
          staticSignature: 987654, shadowDirty: false, lightningFlash: 0, directCameraRender: true };
        const draw = (settings) => {
          renderer.info.reset();
          const result = cache.render(card._threeHouseScene, card._threeHouseCamera, settings);
          return { ...renderer.info.render, ...result };
        };
        try {
          renderer.info.autoReset = false;
          fog.mesh.visible = false;
          const noFog = draw(options);
          fog.mesh.visible = true;
          const withFog = draw(options);
          const movingTarget = cache.interactionTarget;
          const stationaryTarget = cache.target;
          if (!movingTarget || movingTarget.samples !== 0
            || fog.uniforms.sceneDepth.value !== movingTarget.depthTexture) {
            throw new Error("Moving fog did not receive current non-MSAA scene depth");
          }
          if (withFog.triangles > noFog.triangles + 52 || withFog.calls > noFog.calls + 3) {
            throw new Error("Fog redrew geometry or exceeded its 24-puff plus composite budget: "
              + JSON.stringify({ noFog, withFog }));
          }
          draw({ ...options, staticSignature: options.staticSignature + 1 });
          if (cache.interactionTarget !== movingTarget || cache.target !== stationaryTarget) {
            throw new Error("Fog reallocated a render target during camera movement");
          }
          const resting = { ...options, directCameraRender: false };
          draw(resting);
          const reuse = draw(resting);
          if (reuse.staticRebuilt || fog.uniforms.sceneDepth.value !== stationaryTarget.depthTexture) {
            throw new Error("Stationary fog did not reuse cached geometry/depth");
          }
          draw({ ...options, width: 451, height: 449, pixelRatio: 1.25 });
          const gl = renderer.getContext();
          if (fog.uniforms.depthSize.value.x !== gl.drawingBufferWidth
            || fog.uniforms.depthSize.value.y !== gl.drawingBufferHeight) {
            throw new Error("Soft fog depth sampling is misaligned at fractional pixel ratios");
          }
          fogBudgetResult = 'fog motion overhead: ' + (withFog.triangles - noFog.triangles)
            + ' triangles, ' + (withFog.calls - noFog.calls) + ' draws; idle cache reused';
        } finally {
          fog.mesh.visible = wasVisible;
          renderer.info.autoReset = autoReset;
          cache.invalidateStatic();
        }
      };
      const validateColorParity = () => {
        // Render the same frozen scene, camera, resolution and shadow maps.
        // Read the actual canvas synchronously before its buffer is discarded.
        const renderer = card._threeHouseRenderer;
        const cache = card._threeHouseRenderCache;
        const gl = renderer.getContext();
        const originalExposure = renderer.toneMappingExposure;
        // Keep the complete scene, including window glass, transparent labels
        // and weather. Excluding those materials would miss blending errors.
        const readPixels = () => {
          const pixels = new Uint8Array(gl.drawingBufferWidth * gl.drawingBufferHeight * 4);
          gl.readPixels(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight,
            gl.RGBA, gl.UNSIGNED_BYTE, pixels);
          if (gl.getError() !== gl.NO_ERROR) throw new Error("Color parity pixel read failed");
          return pixels;
        };
        try {
          for (const exposure of [0.65, 1.05, 1.8]) {
            renderer.toneMappingExposure = exposure;
            const options = { width: 450, height: 450, pixelRatio: 1,
              staticSignature: exposure, shadowDirty: false, lightningFlash: 0 };
            cache.render(card._threeHouseScene, card._threeHouseCamera,
              { ...options, directCameraRender: true });
            const direct = readPixels();
            cache.render(card._threeHouseScene, card._threeHouseCamera, options);
            const cached = readPixels();
            let difference = 0;
            let changed = 0;
            let signal = 0;
            const count = direct.length / 4 * 3;
            for (let i = 0; i < direct.length; i += 4) {
              for (let c = 0; c < 3; c++) {
                const delta = Math.abs(direct[i + c] - cached[i + c]);
                difference += delta;
                if (delta > 12) changed++;
                signal += direct[i + c];
              }
            }
            const mean = difference / count;
            const changedFraction = changed / count;
            const detail = 'exposure=' + exposure + ', mean=' + mean.toFixed(3)
              + ', changed=' + (changedFraction * 100).toFixed(2) + '%';
            colorParityResults.push(detail);
            // Allow edge/MSAA differences, not a
            // scene-wide brightness or color shift. Reject blank test frames.
            if (signal / count < 2 || mean > 2 || changedFraction > 0.025) {
              const image = (pixels) => {
                const canvas = document.createElement("canvas");
                canvas.width = gl.drawingBufferWidth;
                canvas.height = gl.drawingBufferHeight;
                const context = canvas.getContext("2d");
                const data = context.createImageData(canvas.width, canvas.height);
                for (let y = 0; y < canvas.height; y++) {
                  data.data.set(pixels.subarray(y * canvas.width * 4, (y + 1) * canvas.width * 4),
                    (canvas.height - 1 - y) * canvas.width * 4);
                }
                context.putImageData(data, 0, 0);
                return canvas.toDataURL("image/png").split(",")[1];
              };
              window.__svColorFailure = { direct: image(direct), cached: image(cached) };
              throw new Error('Direct/cached color mismatch: ' + detail);
            }
          }
        } finally {
          renderer.toneMappingExposure = originalExposure;
          cache.invalidateStatic();
        }
      };
      const poll = async () => {
        const shaderErrors = window.__svErrors.filter((message) => criticalPattern.test(message));
        if (shaderErrors.length) {
          finish("failed", shaderErrors.join("\\n"));
          return;
        }

        if (
          card._threeHouseLoadPhase === "ready"
          && !lightningCompiled
          && card._threeHouseWeatherVisuals
        ) {
          lightningCompiled = true;
          const visuals = card._threeHouseWeatherVisuals;
          const origin = card._threeHouseCamera.position.clone().set(0, 5, 0);
          visuals.buildLightningBolt(origin, -1, card._threeHouseCamera);
          visuals.lightningCore.visible = true;
          visuals.lightningGlow.visible = true;
          card._threeHouseRenderer.compile(card._threeHouseScene, card._threeHouseCamera);
        }

        const keys = (card._threeHouseRenderer?.info?.programs || [])
          .map((program) => String(program.cacheKey || ""));
        const missing = required.filter((token) => !keys.some((key) => key.includes(token)));
        if (card._threeHouseLoadPhase === "ready" && !missing.length) {
          if (${expectBakedNightLighting}) {
            // Inspect actual exported emission, independently of the runtime's
            // metadata collection: a parent Group can carry the night marker.
            const authoredEmissiveMaterials = new Set();
            card._threeHouseModel.traverse((object) => {
              if (!object.isMesh) return;
              const materials = Array.isArray(object.material) ? object.material : [object.material];
              for (const material of materials) {
                if (material.emissive && material.emissive.getHex() !== 0) {
                  authoredEmissiveMaterials.add(material);
                }
              }
            });
            const controlled = new Set(card._threeHouseBakedNightMaterials.map((entry) => entry.material));
            if (!authoredEmissiveMaterials.size
              || [...authoredEmissiveMaterials].some((material) => !controlled.has(material))) {
              finish("failed", "Exported baked emission is missing from day/night control");
              return;
            }
            card._updateThreeHouseNightInteriorLights(false, 0);
            if ([...authoredEmissiveMaterials].some((material) => material.emissiveIntensity !== 0)) {
              finish("failed", "Baked surfaces or lamp glass still emit during daylight");
              return;
            }
            card._updateThreeHouseNightInteriorLights(true, 1);
            if (!card._threeHouseUsesBakedNightLighting) {
              finish("failed", "Baked night-light metadata was not detected");
              return;
            }
            if (card._threeHouseInteriorLights.length !== 0) {
              finish("failed", "Baked model retained real-time authored point lights");
              return;
            }
            if (!card._threeHouseBakedNightMaterials.length
              || card._threeHouseBakedNightMaterials.some((entry) => !(entry.material.emissiveIntensity > 0))) {
              finish("failed", "Baked night emission did not activate below the horizon");
              return;
            }
            const activePointLights = [];
            card._threeHouseModel.traverse((object) => {
              if (object.isPointLight && (object.visible || object.castShadow || object.intensity > 0)) {
                activePointLights.push(object.name || object.uuid);
              }
            });
            if (activePointLights.length) {
              finish("failed", "Baked model left active point lights: " + activePointLights.join(", "));
              return;
            }
          }
          if (card.shadowRoot?.querySelector("svg.sv-scene") || card.shadowRoot?.querySelector(".scene")) {
            finish("failed", "3D renderer also constructed the 2.5D scene");
            return;
          }
          if (!card.shadowRoot?.querySelector("canvas.three-house-scene")) {
            finish("failed", "3D renderer canvas is missing");
            return;
          }
          const zoomBefore = card._threeHouseZoom;
          card._changeThreeHouseZoom(0.25);
          if (!(card._threeHouseZoom > zoomBefore)) {
            finish("failed", "3D zoom control did not update camera zoom");
            return;
          }
          if (!colorParityValidated) {
            try {
              validateColorParity();
              validateFogBudget();
              colorParityValidated = true;
            } catch (error) {
              finish("failed", error?.stack || error);
              return;
            }
          }
          if (!gestureValidated) {
            await card.updateComplete;
            const renderCache = card._threeHouseRenderCache;
            const originalRender = renderCache?.render;
            if (!renderCache || typeof originalRender !== "function") {
              finish("failed", "3D render cache is unavailable for gesture validation");
              return;
            }
            let directRenderSeen = false;
            let cachedRebuildAfterGesture = false;
            let gestureEnded = false;
            renderCache.render = function (...args) {
              const options = args[2] || {};
              const result = originalRender.apply(this, args);
              if (options.directCameraRender) directRenderSeen = true;
              if (gestureEnded && !options.directCameraRender && result.staticRebuilt) {
                cachedRebuildAfterGesture = true;
              }
              return result;
            };
            const rotationBeforeGesture = Number(card._autoRotateOffsetDeg || 0);
            card._handleThreeHousePointerDown(pointerEvent(110, 110));
            card._handleThreeHousePointerMove(pointerEvent(150, 126));
            await new Promise((resolveGestureFrame) => setTimeout(resolveGestureFrame, 80));
            if (!card._threeHouseCameraGestureActive || !directRenderSeen) {
              renderCache.render = originalRender;
              finish("failed", "3D camera gesture did not use the direct RAF render path");
              return;
            }
            gestureEnded = true;
            card._handleThreeHousePointerEnd(pointerEvent(150, 126));
            await card.updateComplete;
            await new Promise((resolveCacheFrame) => setTimeout(resolveCacheFrame, 80));
            renderCache.render = originalRender;
            if (card._threeHouseCameraGestureActive) {
              finish("failed", "3D camera gesture remained active after pointer release");
              return;
            }
            if (Number(card._autoRotateOffsetDeg || 0) === rotationBeforeGesture) {
              finish("failed", "3D direct gesture did not update camera rotation");
              return;
            }
            if (!cachedRebuildAfterGesture) {
              finish("failed", "3D cache was not rebuilt after direct camera rendering ended");
              return;
            }
            gestureValidated = true;
            setTimeout(poll, 50);
            return;
          }
          if (!visibilityValidated) {
            try {
              await validateViewportPause();
              visibilityValidated = true;
            } catch (error) {
              finish("failed", error?.stack || error);
              return;
            }
            setTimeout(poll, 50);
            return;
          }
          if (!configSaveApplied) {
            const rendererBeforeSave = card._threeHouseRenderer;
            card.setConfig({ ...card._config, weatherVisuals: "normal" });
            await card.updateComplete;
            if (card._threeHouseRenderer !== rendererBeforeSave) {
              finish("failed", "Same-mode config save unnecessarily replaced the 3D renderer");
              return;
            }
            const rendererBeforeMove = card._threeHouseRenderer;
            const canvasBeforeMove = card.shadowRoot?.querySelector("canvas.three-house-scene");
            card.remove();
            document.body.append(card);
            await card.updateComplete;
            await Promise.resolve();
            if (card._threeHouseRenderer !== rendererBeforeMove) {
              finish("failed", "Same-task Home Assistant DOM move unnecessarily replaced the 3D renderer");
              return;
            }
            if (card.shadowRoot?.querySelector("canvas.three-house-scene") !== canvasBeforeMove) {
              finish("failed", "Same-task Home Assistant DOM move unnecessarily replaced the 3D canvas");
              return;
            }
            configSaveApplied = true;
            setTimeout(poll, 50);
            return;
          }
          if (!reconnectStartedAt) {
            reconnectStartedAt = Date.now();
            rendererBeforeReconnect = card._threeHouseRenderer;
            canvasBeforeReconnect = card.shadowRoot?.querySelector("canvas.three-house-scene");
            card.remove();
            await new Promise((resolveReconnect) => setTimeout(resolveReconnect, 50));
            document.body.append(card);
            await card.updateComplete;
            lightningCompiled = false;
            setTimeout(poll, 50);
            return;
          }
          if (card._threeHouseRenderer === rendererBeforeReconnect) {
            finish("failed", "3D renderer was not recreated after card reconnection");
            return;
          }
          if (card.shadowRoot?.querySelector("canvas.three-house-scene") === canvasBeforeReconnect) {
            finish("failed", "3D canvas was not replaced after card reconnection");
            return;
          }
          if (!reconnectAnimationStartedAt) {
            reconnectAnimationStartedAt = Date.now();
            reconnectWeatherTime = Number(card._threeHouseWeatherVisuals?.rainUniforms?.time?.value ?? 0);
            setTimeout(poll, 180);
            return;
          }
          if (Date.now() - reconnectAnimationStartedAt < 150) {
            setTimeout(poll, 40);
            return;
          }
          const currentWeatherTime = Number(card._threeHouseWeatherVisuals?.rainUniforms?.time?.value ?? 0);
          if (!(currentWeatherTime > reconnectWeatherTime)) {
            finish("failed", "3D weather animation did not resume after card reconnection");
            return;
          }
          finish(
            "passed",
            "validated strict 2.5D/3D behavior, native viewport scroll/hide pause, partial visibility resume, hidden HA updates, save/move/reconnect animation recovery, and compiled "
              + required.length
              + " required Three.js programs; color parity: " + colorParityResults.join("; ") + "; " + fogBudgetResult,
          );
          return;
        }
        // Large lightmapped GLBs can take longer than the compact release model
        // to decode again after the deliberate disconnect/reconnect cycle.
        if (reconnectStartedAt && Date.now() - reconnectStartedAt > 15000) {
          finish(
            "failed",
            "3D renderer did not recover after card reconnection; phase="
              + card._threeHouseLoadPhase
              + "; renderer=" + Boolean(card._threeHouseRenderer)
              + "; missing=" + missing.join(", "),
          );
          return;
        }
        if (Date.now() - started > 40000) {
          finish(
            "failed",
            "timeout phase=" + card._threeHouseLoadPhase
              + "; missing=" + missing.join(", ")
              + "; errors=" + window.__svErrors.join(" | "),
          );
          return;
        }
        setTimeout(poll, 50);
      };
      poll();
    } catch (error) {
      finish("failed", error?.stack || error);
    }
  </script>
</body>
</html>`;
}

function sendFile(response, path, contentType) {
  const size = statSync(path).size;
  response.writeHead(200, {
    "cache-control": "no-store",
    "content-length": size,
    "content-type": contentType,
  });
  createReadStream(path).pipe(response);
}

async function closeServer(server) {
  if (!server.listening) return;
  await new Promise((resolveClose) => server.close(resolveClose));
}

async function waitForExit(child, timeoutMs = 2000) {
  if (child.exitCode !== null) return;
  await Promise.race([
    new Promise((resolveExit) => child.once("close", resolveExit)),
    sleep(timeoutMs),
  ]);
}

if (!existsSync(bundlePath)) {
  throw new Error(`Packaged card bundle is missing: ${bundlePath}. Upload the compiled integration bundle.`);
}
if (!existsSync(modelPath)) {
  throw new Error(`Bundled GLB model is missing: ${modelPath}.`);
}

const browser = findBrowser();
const page = smokePage();
const server = createServer((request, response) => {
  const url = new URL(request.url ?? "/", "http://127.0.0.1");
  if (url.pathname === "/") {
    response.writeHead(200, {
      "cache-control": "no-store",
      "content-type": "text/html; charset=utf-8",
    });
    response.end(page);
    return;
  }
  if (url.pathname === "/sunlight_visualizer/sunlight-visualizer-card.js") {
    sendFile(response, bundlePath, "text/javascript; charset=utf-8");
    return;
  }
  if (url.pathname === "/sunlight_visualizer/models/experimental-house.glb") {
    sendFile(response, modelPath, "model/gltf-binary");
    return;
  }
  response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
  response.end("not found");
});

let child = null;
let profilePath = null;
const browserDiagnostics = [];
try {
  await new Promise((resolveListen, rejectListen) => {
    server.once("error", rejectListen);
    server.listen(0, "127.0.0.1", resolveListen);
  });
  const address = server.address();
  if (!address || typeof address === "string") {
    throw new Error("WebGL smoke server did not receive a local TCP port");
  }

  profilePath = mkdtempSync(join(tmpdir(), "sv-webgl-smoke-"));
  const browserArgs = [
    "--headless=new",
    "--use-angle=swiftshader",
    "--enable-unsafe-swiftshader",
    "--enable-webgl",
    "--ignore-gpu-blocklist",
    "--disable-gpu-sandbox",
    "--disable-dev-shm-usage",
    "--no-first-run",
    "--no-default-browser-check",
    "--remote-debugging-pipe",
    `--user-data-dir=${profilePath}`,
    "about:blank",
  ];
  if (process.platform === "linux" && typeof process.getuid === "function" && process.getuid() === 0) {
    browserArgs.unshift("--no-sandbox");
  }
  child = spawn(browser, browserArgs, {
    stdio: ["ignore", "ignore", "pipe", "pipe", "pipe"],
  });

  let stderr = "";
  child.stderr.setEncoding("utf8");
  child.stderr.on("data", (chunk) => {
    stderr += chunk;
    if (stderr.length > 12000) stderr = stderr.slice(-12000);
  });

  let commandId = 0;
  const pending = new Map();
  let resolvePageLoaded;
  const pageLoaded = new Promise((resolveLoaded) => {
    resolvePageLoaded = resolveLoaded;
  });
  let cdpBuffer = "";
  child.stdio[4].setEncoding("utf8");
  child.stdio[4].on("data", (chunk) => {
    cdpBuffer += chunk;
    let boundary = cdpBuffer.indexOf("\0");
    while (boundary >= 0) {
      const rawMessage = cdpBuffer.slice(0, boundary);
      cdpBuffer = cdpBuffer.slice(boundary + 1);
      boundary = cdpBuffer.indexOf("\0");
      if (!rawMessage) continue;

      const message = JSON.parse(rawMessage);
      if (message.id) {
        const waiter = pending.get(message.id);
        if (!waiter) continue;
        pending.delete(message.id);
        clearTimeout(waiter.timer);
        if (message.error) waiter.reject(new Error(message.error.message));
        else waiter.resolve(message.result);
        continue;
      }

      if (message.method === "Page.loadEventFired") {
        resolvePageLoaded();
      } else if (message.method === "Log.entryAdded") {
        browserDiagnostics.push(String(message.params?.entry?.text ?? ""));
      } else if (message.method === "Runtime.exceptionThrown") {
        browserDiagnostics.push(String(message.params?.exceptionDetails?.text ?? "Runtime exception"));
      } else if (
        message.method === "Runtime.consoleAPICalled"
        && ["error", "warning"].includes(message.params?.type)
      ) {
        browserDiagnostics.push(
          (message.params?.args ?? [])
            .map((arg) => String(arg.value ?? arg.description ?? ""))
            .join(" "),
        );
      }
    }
  });

  const send = (method, params = {}, sessionId = null) => new Promise((resolveCommand, rejectCommand) => {
    if (!child || child.exitCode !== null) {
      rejectCommand(new Error(`Browser exited before ${method}. ${stderr.slice(-1200)}`));
      return;
    }
    const id = ++commandId;
    const timer = setTimeout(() => {
      pending.delete(id);
      rejectCommand(new Error(`Browser command timed out: ${method}`));
    }, 15000);
    pending.set(id, { resolve: resolveCommand, reject: rejectCommand, timer });
    child.stdio[3].write(`${JSON.stringify({
      id,
      method,
      params,
      ...(sessionId ? { sessionId } : {}),
    })}\0`);
  });

  const created = await send("Target.createTarget", {
    url: "about:blank",
  });
  const attached = await send("Target.attachToTarget", {
    targetId: created.targetId,
    flatten: true,
  });
  const sessionId = attached.sessionId;
  await send("Runtime.enable", {}, sessionId);
  await send("Log.enable", {}, sessionId);
  await send("Page.enable", {}, sessionId);
  await send(
    "Page.navigate",
    { url: `http://127.0.0.1:${address.port}/` },
    sessionId,
  );
  await Promise.race([
    pageLoaded,
    sleep(15000).then(() => {
      throw new Error("WebGL smoke page did not finish loading");
    }),
  ]);

  let result = { status: "pending", detail: "" };
  const deadline = Date.now() + 45000;
  while (Date.now() < deadline) {
    const response = await send(
      "Runtime.evaluate",
      {
        expression: "({status:document.body?.dataset?.smoke||'pending',detail:document.body?.dataset?.detail||''})",
        returnByValue: true,
      },
      sessionId,
    );
    result = response?.result?.value ?? result;
    if (result.status !== "pending") break;
    await sleep(100);
  }

  await sleep(250);
  const criticalDiagnostics = browserDiagnostics.filter((message) => CRITICAL_WEBGL_PATTERN.test(message));
  if (result.status !== "passed" || criticalDiagnostics.length) {
    if (process.env.SV_COLOR_DEBUG_DIR) {
      const frames = await send("Runtime.evaluate", {
        expression: "window.__svColorFailure", returnByValue: true,
      }, sessionId);
      for (const [name, data] of Object.entries(frames?.result?.value || {})) {
        writeFileSync(join(process.env.SV_COLOR_DEBUG_DIR, name + ".png"), Buffer.from(data, "base64"));
      }
    }
    throw new Error(
      `WebGL shader compile smoke failed: ${result.detail || result.status}`
        + (criticalDiagnostics.length ? `\n${criticalDiagnostics.join("\n")}` : "")
        + (stderr ? `\nBrowser stderr:\n${stderr.slice(-1800)}` : ""),
    );
  }

  console.log(`WebGL shader compile smoke OK: ${result.detail}`);
} finally {
  if (child && child.exitCode === null) child.kill("SIGTERM");
  if (child) await waitForExit(child);
  await closeServer(server);
  if (profilePath) rmSync(profilePath, { recursive: true, force: true });
}
