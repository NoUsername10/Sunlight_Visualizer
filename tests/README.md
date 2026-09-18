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
