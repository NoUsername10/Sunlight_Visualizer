"""Verify release metadata, build the HACS ZIP, and seed draft notes."""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path
import re
import subprocess
from zipfile import ZIP_DEFLATED, ZipFile, ZipInfo


ROOT = Path(__file__).resolve().parents[1]
INTEGRATION = Path("custom_components/sunlight_visualizer")
ASSET_NAME = "sunlight_visualizer.zip"
TAG_PATTERN = re.compile(r"[0-9]+\.[0-9]+\.[0-9]+")
ALLOWED_SUFFIXES = {".py", ".json", ".yaml", ".js", ".glb", ".svg", ".png", ".jpg", ".jpeg", ".webp"}


def changelog_sections(text: str, tag: str) -> dict[str, list[str]]:
    """Read only the exact dated version entry, never Unreleased or older entries."""
    lines = text.splitlines()
    heading = re.compile(rf"^## \[{re.escape(tag)}\] - \d{{4}}-\d{{2}}-\d{{2}}$")
    starts = [index for index, line in enumerate(lines) if heading.fullmatch(line)]
    if len(starts) != 1:
        raise ValueError(f"CHANGELOG.md needs exactly one dated [{tag}] entry")
    start = starts[0]
    end = next((i for i in range(start + 1, len(lines)) if lines[i].startswith("## [")), len(lines))
    sections: dict[str, list[str]] = {}
    current: str | None = None
    for line in lines[start + 1 : end]:
        if line.startswith("### "):
            current = line[4:].strip()
            sections.setdefault(current, [])
        elif line.startswith("- ") and current:
            sections[current].append(line)
    if not any(sections.values()):
        raise ValueError(f"CHANGELOG.md entry [{tag}] has no release items")
    return sections


def verify_metadata(repository: Path, tag: str) -> dict[str, list[str]]:
    """Require the tag, integration, HACS asset and changelog to agree."""
    if not TAG_PATTERN.fullmatch(tag):
        raise ValueError("Use a version tag such as 0.5.8")
    manifest = json.loads((repository / INTEGRATION / "manifest.json").read_text(encoding="utf-8"))
    if manifest.get("version") != tag:
        raise ValueError(f"Manifest version {manifest.get('version')} does not match tag {tag}")
    hacs = json.loads((repository / "hacs.json").read_text(encoding="utf-8"))
    if hacs.get("zip_release") is not True or hacs.get("filename") != ASSET_NAME:
        raise ValueError(f"hacs.json must select the {ASSET_NAME} release asset")
    return changelog_sections((repository / "CHANGELOG.md").read_text(encoding="utf-8"), tag)


def _git(repository: Path, *args: str) -> str:
    return subprocess.run(
        ["git", *args], cwd=repository, check=True, capture_output=True, text=True
    ).stdout.strip()


def verify_tag_on_main(repository: Path, tag: str, main_ref: str = "refs/remotes/origin/main") -> str:
    """Reject an absent, moved, or non-HEAD release tag."""
    verify_metadata(repository, tag)
    tag_sha = _git(repository, "rev-parse", "--verify", f"refs/tags/{tag}^{{commit}}")
    main_sha = _git(repository, "rev-parse", "--verify", f"{main_ref}^{{commit}}")
    if tag_sha != main_sha:
        raise ValueError(f"Tag {tag} ({tag_sha}) must point to main HEAD ({main_sha})")
    if _git(repository, "rev-parse", "HEAD") != tag_sha:
        raise ValueError("The checked-out release content differs from the tag")
    return tag_sha


def coverage_percent(path: Path) -> float:
    report = json.loads(path.read_text(encoding="utf-8"))
    value = float(report["totals"]["percent_covered"])
    if not math.isfinite(value) or not 0 <= value <= 100:
        raise ValueError("Coverage percentage is invalid")
    return value


def _integration_files(repository: Path) -> list[Path]:
    root = repository / INTEGRATION
    paths = sorted(path for path in root.rglob("*") if path.is_file() and not path.is_symlink())
    selected = [path for path in paths if path.suffix.lower() in ALLOWED_SUFFIXES]
    for required in ("__init__.py", "manifest.json", "www/sunlight-visualizer-card.js", "www/models/experimental-house.glb"):
        if root / required not in selected:
            raise ValueError(f"Release ZIP is missing {required}")
    if any(path.is_symlink() for path in root.rglob("*")):
        raise ValueError("Release integration contains a symlink")
    return selected


def build_release(repository: Path, tag: str, coverage_file: Path, output_dir: Path) -> tuple[Path, Path]:
    sections = verify_metadata(repository, tag)
    coverage = coverage_percent(coverage_file)
    files = _integration_files(repository)
    output_dir.mkdir(parents=True, exist_ok=True)
    archive_path = output_dir / ASSET_NAME
    with ZipFile(archive_path, "w", compression=ZIP_DEFLATED, compresslevel=9) as archive:
        for path in files:
            name = path.relative_to(repository / INTEGRATION).as_posix()
            info = ZipInfo(name, (2026, 1, 1, 0, 0, 0))
            info.compress_type = ZIP_DEFLATED
            info.external_attr = 0o100644 << 16
            archive.writestr(info, path.read_bytes())
    with ZipFile(archive_path) as archive:
        expected = {path.relative_to(repository / INTEGRATION).as_posix(): path for path in files}
        if archive.testzip() is not None or set(archive.namelist()) != set(expected):
            raise ValueError("Release ZIP failed integrity or file inventory validation")
        for name, path in expected.items():
            if archive.read(name) != path.read_bytes():
                raise ValueError(f"Release ZIP differs from source: {name}")

    added_changed = sections.get("Added", []) + sections.get("Changed", [])
    fixed = sections.get("Fixed", [])
    notes = (
        f"# Sunlight Visualizer {tag}\n\n"
        "## Changed / Added\n\n"
        + ("\n".join(added_changed) if added_changed else "No changes listed.")
        + "\n\n## Fixed\n\n"
        + ("\n".join(fixed) if fixed else "No fixes listed.")
        + "\n\n## ✨ Highlights\n\n"
        "- 🏡 **3D house experience** — a bundled house model with sunlight, shadows, solar panels and night lighting.\n"
        "- 👆 **Touch and mouse controls** — drag to rotate, pinch or scroll to zoom in 3D, and save your favourite camera view.\n"
        "- 🌦️ **Optional animated weather** — Open-Meteo-powered clouds, rain, snow, fog, wind gusts and lightning, with temperature, wind and weather details.\n"
        "- 🌍 **26-language interface** — translated integration setup, options, card editor, controls, graphs and weather details.\n"
        "- 🪶 **Choose your renderer** — Automatic, lightweight 2.5D or full 3D, with fallback when 3D is unavailable.\n\n"
        "## Updating\n\n"
        "Restart Home Assistant after updating, then reload the dashboard in your browser or companion app.\n\n"
        "Weather visuals are optional. Prefer the previous appearance? Select **2.5D** in the card editor.\n\n"
        f"## Validation\n\nMeasured backend coverage: **{coverage:.2f}%**.\n\n"
        "## Help received this release:\n"
    )
    notes_path = output_dir / "release-notes.md"
    notes_path.write_text(notes, encoding="utf-8")
    digest = hashlib.sha256(archive_path.read_bytes()).hexdigest()
    (output_dir / "SHA256SUMS").write_text(f"{digest}  {ASSET_NAME}\n", encoding="utf-8")
    print(f"Verified {archive_path}: {len(files)} integration files, SHA-256 {digest}")
    return archive_path, notes_path


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--tag", required=True)
    parser.add_argument("--coverage", type=Path, required=True)
    parser.add_argument("--output-dir", type=Path, required=True)
    args = parser.parse_args()
    build_release(ROOT, args.tag, args.coverage, args.output_dir)


if __name__ == "__main__":
    main()
