# Backend Smoke Tests

The backend smoke suite uses Python's built-in `unittest` runner and real Home Assistant runtimes. It does not require pytest or install packages into the host system.

Run the release compatibility matrix from the repository root:

```bash
sh tests/run_backend_smoke_matrix.sh
```

The matrix uses Home Assistant `2026.1.0` as the supported baseline and `stable` as the latest release check. The script prints the resolved Home Assistant version before each run so the moving `stable` tag is visible in release logs.

The suite verifies:

- core sun-position fallback and surface-alignment calculations;
- shading-status boundaries;
- a real `DataUpdateCoordinator` refresh with deterministic forced-sun data;
- coordinator cache reuse;
- config-entry setup orchestration;
- clean-install registration of the bundled card and GLB model.

The `tests/` folder must also be uploaded to GitHub for Release checks. The workflow checks for the local smoke suite before starting Docker and discovers tests using the absolute `/app/tests` path. This prevents a missing upload from resolving to an unrelated dependency's `tests` package inside the Home Assistant image.

## Packaged card tests

The browser runner tests the shipped JavaScript and GLB directly. It requires Node.js and a Chromium-family browser, with no npm install, `frontend/` source, or `dist/` folder:

```bash
node scripts/validate-package.mjs
SV_EXPECT_BAKED_NIGHT_LIGHTING=0 node scripts/validate-webgl-shaders.mjs
SV_EXPECT_BAKED_NIGHT_LIGHTING=1 node scripts/validate-webgl-shaders.mjs
```

Coverage includes shader compilation, 2.5D/3D separation, day/night model lighting, tone-mapping parity, fog rendering cost, camera gestures, offscreen pause/resume, configuration changes and card reconnection. These validate the packaged runtime; TypeScript and source-level checks run only in the local development workspace.
