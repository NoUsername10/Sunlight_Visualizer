"""Protect the draft-only release gate and HACS ZIP format."""

from __future__ import annotations

import json
from pathlib import Path
import subprocess
import tempfile
import unittest
from zipfile import ZipFile

from scripts.prepare_release import build_release, verify_tag_on_main


def _git(repository: Path, *args: str) -> None:
    subprocess.run(["git", *args], cwd=repository, check=True, capture_output=True)


class ReleaseWorkflowTests(unittest.TestCase):
    def setUp(self) -> None:
        self._temporary = tempfile.TemporaryDirectory()
        self.addCleanup(self._temporary.cleanup)
        self.repository = Path(self._temporary.name)
        integration = self.repository / "custom_components/sunlight_visualizer"
        (integration / "www/models").mkdir(parents=True)
        (integration / "__init__.py").write_text("", encoding="utf-8")
        (integration / "manifest.json").write_text('{"version":"0.5.8"}', encoding="utf-8")
        (integration / "www/sunlight-visualizer-card.js").write_text("// card\n", encoding="utf-8")
        (integration / "www/models/experimental-house.glb").write_bytes(b"model")
        (integration / ".DS_Store").write_bytes(b"local metadata")
        (self.repository / "hacs.json").write_text(
            '{"zip_release":true,"filename":"sunlight_visualizer.zip"}', encoding="utf-8"
        )
        (self.repository / "CHANGELOG.md").write_text(
            "## [Unreleased]\n\n### Planned\n- Later\n\n"
            "## [0.5.8] - 2026-11-05\n\n### Added\n- Local GHI\n\n"
            "### Fixed\n- Stale values\n\n## [0.5.7] - 2026-11-03\n",
            encoding="utf-8",
        )
        (self.repository / "coverage.json").write_text(
            json.dumps({"totals": {"percent_covered": 42.37}}), encoding="utf-8"
        )

    def test_hacs_asset_and_notes_use_only_the_selected_version(self) -> None:
        archive, notes = build_release(
            self.repository, "0.5.8", self.repository / "coverage.json", self.repository / "dist"
        )
        with ZipFile(archive) as zipped:
            self.assertEqual(
                set(zipped.namelist()),
                {
                    "__init__.py", "manifest.json", "www/sunlight-visualizer-card.js",
                    "www/models/experimental-house.glb",
                },
            )
        body = notes.read_text(encoding="utf-8")
        self.assertIn("## Changed / Added\n\n- Local GHI", body)
        self.assertIn("## Fixed\n\n- Stale values", body)
        self.assertIn("42.37%", body)
        self.assertTrue(body.endswith("## Help received this release:\n"))
        self.assertNotIn("- Later", body)

    def test_tag_must_equal_main_head_and_metadata(self) -> None:
        _git(self.repository, "init", "-b", "main")
        _git(self.repository, "config", "user.name", "Release Test")
        _git(self.repository, "config", "user.email", "release-test@example.invalid")
        _git(self.repository, "add", ".")
        _git(self.repository, "commit", "-m", "Release content")
        _git(self.repository, "tag", "0.5.8")
        self.assertEqual(
            verify_tag_on_main(self.repository, "0.5.8", "refs/heads/main"),
            subprocess.check_output(["git", "rev-parse", "HEAD"], cwd=self.repository, text=True).strip(),
        )
        (self.repository / "later.txt").write_text("new main commit", encoding="utf-8")
        _git(self.repository, "add", "later.txt")
        _git(self.repository, "commit", "-m", "Move main")
        with self.assertRaisesRegex(ValueError, "must point to main HEAD"):
            verify_tag_on_main(self.repository, "0.5.8", "refs/heads/main")
        with self.assertRaisesRegex(ValueError, "Use a version tag"):
            verify_tag_on_main(self.repository, "not-a-tag", "refs/heads/main")


if __name__ == "__main__":
    unittest.main()
