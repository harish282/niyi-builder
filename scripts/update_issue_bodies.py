#!/usr/bin/env python3
"""Update GitHub issue bodies with full task descriptions."""

from __future__ import annotations

import json
import subprocess
import sys
import tempfile
import time
from pathlib import Path

REPO = "harish282/niyi-builder"

# Import from same directory
sys.path.insert(0, str(Path(__file__).resolve().parent))
from bootstrap_github import ISSUES  # noqa: E402
from issue_bodies import ISSUE_CONTENT, build_body  # noqa: E402


def main() -> int:
    map_path = Path(__file__).parent / "github-issue-map.json"
    if map_path.exists():
        data = json.loads(map_path.read_text())
        issue_map = {int(k): int(v) for k, v in data["draft_to_issue"].items()}
    else:
        issue_map = {spec.draft_id: spec.draft_id for spec in ISSUES}

    missing = [s.draft_id for s in ISSUES if s.draft_id not in ISSUE_CONTENT]
    if missing:
        print(f"Missing bodies for draft IDs: {missing}", file=sys.stderr)
        return 1

    for spec in ISSUES:
        num = issue_map.get(spec.draft_id, spec.draft_id)
        body = build_body(spec.draft_id, spec.depends, issue_map)

        with tempfile.NamedTemporaryFile("w", suffix=".md", delete=False, encoding="utf-8") as f:
            f.write(body)
            body_path = f.name

        try:
            subprocess.run(
                ["gh", "issue", "edit", str(num), "--repo", REPO, "--body-file", body_path],
                check=True,
                capture_output=True,
                text=True,
            )
            print(f"Updated #{num}: {spec.title[:60]}...")
        finally:
            Path(body_path).unlink(missing_ok=True)

        time.sleep(0.4)

    print(f"\nUpdated {len(ISSUES)} issues on {REPO}.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
