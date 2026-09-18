import { closeSync, existsSync, openSync, readSync, statSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptPath = fileURLToPath(import.meta.url);
const scriptDir = dirname(scriptPath);
const defaultRepoRoot = resolve(scriptDir, "..");

function requireFile(path, label) {
  if (!existsSync(path) || !statSync(path).isFile()) {
    throw new Error(`Missing ${label}: ${path}`);
  }
}

export function validateGlbAsset(path) {
  requireFile(path, "bundled 3D model");
  const size = statSync(path).size;
  if (size < 12) {
    throw new Error(`Invalid GLB (file is too small): ${path}`);
  }

  const header = Buffer.alloc(12);
  const fd = openSync(path, "r");
  try {
    if (readSync(fd, header, 0, header.length, 0) !== header.length) {
      throw new Error(`Invalid GLB header: ${path}`);
    }
  } finally {
    closeSync(fd);
  }

  const magic = header.toString("ascii", 0, 4);
  const version = header.readUInt32LE(4);
  const declaredLength = header.readUInt32LE(8);
  if (magic !== "glTF" || version !== 2 || declaredLength !== size) {
    throw new Error(
      `Invalid GLB package asset: ${path} ` +
      `(magic=${JSON.stringify(magic)}, version=${version}, declared=${declaredLength}, actual=${size})`,
    );
  }
  return size;
}

export function validatePackage(repoRoot = defaultRepoRoot) {
  const wwwDir = resolve(repoRoot, "custom_components", "sunlight_visualizer", "www");
  const cardPath = resolve(wwwDir, "sunlight-visualizer-card.js");
  const modelPath = resolve(wwwDir, "models", "experimental-house.glb");
  requireFile(cardPath, "integration card bundle");
  const modelSize = validateGlbAsset(modelPath);
  console.log(`package OK: card + GLB (${modelSize} bytes)`);
}

if (process.argv[1] && resolve(process.argv[1]) === scriptPath) {
  validatePackage();
}
