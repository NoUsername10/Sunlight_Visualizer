"""Fail a draft-release run unless its existing tag is the current main commit."""

from __future__ import annotations

import argparse

from prepare_release import ROOT, verify_tag_on_main


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--tag", required=True)
    args = parser.parse_args()
    print(f"Verified {args.tag} at main HEAD {verify_tag_on_main(ROOT, args.tag)}")


if __name__ == "__main__":
    main()
