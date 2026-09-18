#!/bin/sh
set -eu

ROOT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)

for IMAGE in \
  ghcr.io/home-assistant/home-assistant:2026.1.0 \
  ghcr.io/home-assistant/home-assistant:stable
do
  echo ""
  echo "Backend smoke tests: $IMAGE"
  docker run --rm --pull=always \
    -e PYTHONDONTWRITEBYTECODE=1 \
    -v "$ROOT_DIR:/app" \
    -w /app \
    "$IMAGE" \
    sh -c 'python -c "from homeassistant.const import __version__; print(f\"Home Assistant {__version__}\")" && python -m unittest discover -s tests -v'
done
