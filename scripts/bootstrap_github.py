#!/usr/bin/env python3
"""Create GitHub labels, milestones, and issues for niyi-builder."""

from __future__ import annotations

import json
import subprocess
import sys
import time
from dataclasses import dataclass

REPO = "harish282/niyi-builder"
T0 = "2026-06-02"

MILESTONES = [
    ("M1: Architecture Validated", "2026-06-16", "JSON ↔ Gutenberg round-trip with no data loss."),
    ("M2: Visual Editor Shell", "2026-07-14", "Canvas, selection, and Elementor-style drag-and-drop."),
    ("M3: MVP Block Library", "2026-08-11", "Layout + content blocks; build landing pages."),
    ("M4: Responsive Editing", "2026-08-25", "Desktop, tablet, mobile editing."),
    ("M5: Animation Engine", "2026-09-08", "Entrance animations with lightweight frontend."),
    ("M6: Form Builder", "2026-09-29", "Contact forms with email + database storage."),
    ("M7: Production Editing Workflow", "2026-10-20", "Undo, redo, copy, paste, duplicate."),
    ("M8: Template Library", "2026-11-03", "Import/export templates and starter pages."),
    ("M9: Full Gutenberg Compatibility", "2026-11-24", "Import, edit, and export native blocks."),
    ("M10: Public Beta (v1.0)", "2026-12-08", "Docs, CI, demo site, WP.org beta release."),
]

LABELS = [
    ("epic", "7057ff", "Large feature grouping"),
    ("phase-1", "ededed", "Phase 1 — Architecture validation"),
    ("phase-2", "ededed", "Phase 2 — Core editor"),
    ("phase-3", "ededed", "Phase 3 — Core blocks"),
    ("phase-4", "ededed", "Phase 4 — Responsive design"),
    ("phase-5", "ededed", "Phase 5 — Animations"),
    ("phase-6", "ededed", "Phase 6 — Forms"),
    ("phase-7", "ededed", "Phase 7 — Productivity"),
    ("phase-8", "ededed", "Phase 8 — Templates"),
    ("phase-9", "ededed", "Phase 9 — Gutenberg integration"),
    ("phase-10", "ededed", "Phase 10 — Public beta"),
    ("sprint-0", "c5def5", "Sprint 0"),
    ("sprint-1", "c5def5", "Sprint 1"),
    ("sprint-2", "c5def5", "Sprint 2"),
    ("sprint-3", "c5def5", "Sprint 3"),
    ("sprint-4", "c5def5", "Sprint 4"),
    ("sprint-5", "c5def5", "Sprint 5"),
    ("sprint-6", "c5def5", "Sprint 6"),
    ("sprint-7", "c5def5", "Sprint 7"),
    ("sprint-8", "c5def5", "Sprint 8"),
    ("sprint-9", "c5def5", "Sprint 9"),
    ("sprint-10", "c5def5", "Sprint 10"),
    ("sprint-11", "c5def5", "Sprint 11"),
    ("type:feature", "0e8a16", "New capability"),
    ("type:task", "fbca04", "Implementation work"),
    ("type:test", "1d76db", "Tests"),
    ("type:docs", "0075ca", "Documentation"),
    ("type:infra", "5319e7", "CI, tooling, repository"),
    ("package:serializer", "bfd4f2", "packages/serializer"),
    ("package:editor", "bfd4f2", "packages/editor"),
    ("package:blocks", "bfd4f2", "packages/blocks"),
    ("package:animations", "bfd4f2", "packages/animations"),
    ("package:forms", "bfd4f2", "packages/forms"),
    ("package:history", "bfd4f2", "packages/history"),
    ("package:core", "bfd4f2", "packages/core"),
    ("priority:P0", "b60205", "Blocker"),
    ("priority:P1", "d93f0b", "High priority"),
    ("priority:P2", "fef2c0", "Normal priority"),
    ("good first issue", "7057ff", "Good for newcomers"),
    ("blocked", "000000", "Waiting on a dependency"),
]


@dataclass
class IssueSpec:
    draft_id: int
    title: str
    milestone: int  # 1-10
    labels: list[str]
    depends: list[int]  # draft IDs
    body: str = ""


def default_body(draft_id: int, depends: list[int], issue_map: dict[int, int]) -> str:
    from issue_bodies import ISSUE_CONTENT, build_body

    if draft_id not in ISSUE_CONTENT:
        raise KeyError(f"No body content for draft_id={draft_id}")
    return build_body(draft_id, depends, issue_map)


ISSUES: list[IssueSpec] = [
    IssueSpec(1, "[Epic] Phase 1: Architecture validation", 1, ["epic", "phase-1", "sprint-0"], []),
    IssueSpec(2, "Scaffold monorepo and packages/* workspaces", 1, ["type:infra", "phase-1", "sprint-0", "priority:P0", "package:core"], []),
    IssueSpec(3, "Create WordPress plugin scaffold (plugin/php)", 1, ["type:feature", "phase-1", "sprint-0", "priority:P0"], [2]),
    IssueSpec(4, "Configure React + TypeScript + Vite for plugin admin", 1, ["type:infra", "phase-1", "sprint-0", "priority:P0"], [3]),
    IssueSpec(5, "Add ESLint, Prettier, and editor TS config", 1, ["type:infra", "phase-1", "sprint-0"], [4]),
    IssueSpec(6, "Define layout JSON schema v0", 1, ["type:docs", "package:serializer", "phase-1", "sprint-0", "priority:P0"], [2]),
    IssueSpec(7, "Implement JSON → Gutenberg block serialization", 1, ["type:feature", "package:serializer", "phase-1", "sprint-0", "priority:P0"], [6]),
    IssueSpec(8, "Implement Gutenberg → JSON deserialization", 1, ["type:feature", "package:serializer", "phase-1", "sprint-0", "priority:P0"], [6]),
    IssueSpec(9, "Add round-trip unit tests (flat block tree)", 1, ["type:test", "package:serializer", "phase-1", "sprint-0"], [7, 8]),
    IssueSpec(10, "Validate nested containers in round-trip tests", 1, ["type:test", "package:serializer", "phase-1", "sprint-0"], [9]),
    IssueSpec(11, "Validate nested content blocks in round-trip tests", 1, ["type:test", "package:serializer", "phase-1", "sprint-0"], [10]),
    IssueSpec(12, "[Epic] Phase 2: Core editor", 2, ["epic", "phase-2"], []),
    IssueSpec(13, "Build visual editor shell (layout, toolbar placeholders)", 2, ["type:feature", "package:editor", "phase-2", "sprint-1", "priority:P0"], [11]),
    IssueSpec(14, "Implement component registry for canvas blocks", 2, ["type:feature", "package:editor", "phase-2", "sprint-1"], [13]),
    IssueSpec(15, "Implement JSON tree rendering engine", 2, ["type:feature", "package:editor", "phase-2", "sprint-1"], [14]),
    IssueSpec(16, "Selection system (select, highlight, hierarchy)", 2, ["type:feature", "package:editor", "phase-2", "sprint-1"], [15]),
    IssueSpec(17, "Add element / block inserter (palette)", 2, ["type:feature", "package:editor", "phase-2", "sprint-1"], [16]),
    IssueSpec(18, "Wire save/load: canvas ↔ post content via serializer", 2, ["type:feature", "package:editor", "package:serializer", "phase-2", "sprint-1", "priority:P0"], [7, 17]),
    IssueSpec(19, "Integrate dnd-kit for canvas drag-and-drop", 2, ["type:feature", "package:editor", "phase-2", "sprint-2", "priority:P0"], [16]),
    IssueSpec(20, "Reorder elements within parent container", 2, ["type:feature", "package:editor", "phase-2", "sprint-2"], [19]),
    IssueSpec(21, "Support nesting via drag-and-drop", 2, ["type:feature", "package:editor", "phase-2", "sprint-2"], [20]),
    IssueSpec(22, "Drop zone indicators and drag preview UX", 2, ["type:feature", "package:editor", "phase-2", "sprint-2"], [19]),
    IssueSpec(23, "Keyboard/a11y baseline for drag-and-drop", 2, ["type:feature", "package:editor", "phase-2", "sprint-2", "priority:P2"], [19]),
    IssueSpec(24, "[Epic] Phase 3: Core blocks", 3, ["epic", "phase-3"], []),
    IssueSpec(25, "Container block — data model and Gutenberg serialization", 3, ["type:feature", "package:blocks", "phase-3", "sprint-3"], [23]),
    IssueSpec(26, "Container block — inspector controls", 3, ["type:feature", "package:blocks", "phase-3", "sprint-3"], [25]),
    IssueSpec(27, "Grid block — data model and serialization", 3, ["type:feature", "package:blocks", "phase-3", "sprint-3"], [25]),
    IssueSpec(28, "Grid block — inspector (columns, rows, gap)", 3, ["type:feature", "package:blocks", "phase-3", "sprint-3"], [27]),
    IssueSpec(29, "Spacer block", 3, ["type:feature", "package:blocks", "phase-3", "sprint-3"], [25]),
    IssueSpec(30, "Frontend PHP/block render for layout blocks", 3, ["type:feature", "package:blocks", "phase-3", "sprint-3"], [25, 27, 29]),
    IssueSpec(31, "Heading block with typography controls", 3, ["type:feature", "package:blocks", "phase-3", "sprint-4"], [24]),
    IssueSpec(32, "Rich text block", 3, ["type:feature", "package:blocks", "phase-3", "sprint-4"], [24]),
    IssueSpec(33, "Button block (link + styles)", 3, ["type:feature", "package:blocks", "phase-3", "sprint-4"], [24]),
    IssueSpec(34, "Image block with media library", 3, ["type:feature", "package:blocks", "phase-3", "sprint-4"], [24]),
    IssueSpec(35, "Icon block (SVG)", 3, ["type:feature", "package:blocks", "phase-3", "sprint-4"], [24]),
    IssueSpec(36, "Video block (YouTube, Vimeo, self-hosted)", 3, ["type:feature", "package:blocks", "phase-3", "sprint-4"], [24]),
    IssueSpec(37, "Example landing page in examples/", 3, ["type:docs", "phase-3", "sprint-4"], [36]),
    IssueSpec(38, "[Epic] Phase 4: Responsive design", 4, ["epic", "phase-4"], []),
    IssueSpec(39, "Breakpoint tokens and store (desktop/tablet/mobile)", 4, ["type:feature", "package:core", "phase-4", "sprint-5"], [37]),
    IssueSpec(40, "Device switcher in editor toolbar", 4, ["type:feature", "package:editor", "phase-4", "sprint-5"], [39]),
    IssueSpec(41, "Per-breakpoint attribute overrides in JSON schema", 4, ["type:feature", "package:core", "package:serializer", "phase-4", "sprint-5"], [39]),
    IssueSpec(42, "Responsive inspector controls", 4, ["type:feature", "package:editor", "phase-4", "sprint-5"], [40, 41]),
    IssueSpec(43, "Canvas preview mode per breakpoint", 4, ["type:feature", "package:editor", "phase-4", "sprint-5"], [40]),
    IssueSpec(44, "Serializer tests for responsive attributes", 4, ["type:test", "package:serializer", "phase-4", "sprint-5"], [41]),
    IssueSpec(45, "[Epic] Phase 5: Animations", 5, ["epic", "phase-5"], []),
    IssueSpec(46, "Create packages/animations engine", 5, ["type:feature", "package:animations", "phase-5", "sprint-6"], [44]),
    IssueSpec(47, "Block animation attributes (data-animation, etc.)", 5, ["type:feature", "package:blocks", "package:animations", "phase-5", "sprint-6"], [46]),
    IssueSpec(48, "Fade entrance animations", 5, ["type:feature", "package:animations", "phase-5", "sprint-6"], [46]),
    IssueSpec(49, "Zoom entrance animations", 5, ["type:feature", "package:animations", "phase-5", "sprint-6"], [46]),
    IssueSpec(50, "Inspector: duration, delay, offset", 5, ["type:feature", "package:editor", "phase-5", "sprint-6"], [47]),
    IssueSpec(51, "Frontend animation runtime + reduced motion", 5, ["type:feature", "package:animations", "phase-5", "sprint-6"], [48, 49]),
    IssueSpec(52, "Serializer round-trip for animation metadata", 5, ["type:test", "package:serializer", "phase-5", "sprint-6"], [47]),
    IssueSpec(53, "[Epic] Phase 6: Forms", 6, ["epic", "phase-6"], []),
    IssueSpec(54, "Form container block", 6, ["type:feature", "package:forms", "phase-6", "sprint-7"], [37]),
    IssueSpec(55, "Form field blocks (all MVP field types)", 6, ["type:feature", "package:forms", "phase-6", "sprint-7"], [54]),
    IssueSpec(56, "Client-side validation for form fields", 6, ["type:feature", "package:forms", "phase-6", "sprint-7"], [55]),
    IssueSpec(57, "REST submission endpoint with security", 6, ["type:feature", "package:forms", "phase-6", "sprint-7", "priority:P0"], [54]),
    IssueSpec(58, "Store submissions in database", 6, ["type:feature", "package:forms", "phase-6", "sprint-7"], [57]),
    IssueSpec(59, "Email notification on form submit", 6, ["type:feature", "package:forms", "phase-6", "sprint-7"], [57]),
    IssueSpec(60, "Form tree Gutenberg serialization", 6, ["type:feature", "package:serializer", "package:forms", "phase-6", "sprint-7"], [55]),
    IssueSpec(61, "[Epic] Phase 7: Productivity", 7, ["epic", "phase-7"], []),
    IssueSpec(62, "History package with command pattern", 7, ["type:feature", "package:history", "phase-7", "sprint-8"], [23]),
    IssueSpec(63, "Undo and redo", 7, ["type:feature", "package:history", "package:editor", "phase-7", "sprint-8"], [62]),
    IssueSpec(64, "Duplicate selected element", 7, ["type:feature", "package:editor", "phase-7", "sprint-8"], [63]),
    IssueSpec(65, "Copy and paste elements", 7, ["type:feature", "package:editor", "phase-7", "sprint-8"], [63]),
    IssueSpec(66, "Delete element action", 7, ["type:feature", "package:editor", "phase-7", "sprint-8"], [63]),
    IssueSpec(67, "[Epic] Phase 8: Templates", 8, ["epic", "phase-8"], []),
    IssueSpec(68, "Template export format and API", 8, ["type:feature", "package:core", "phase-8", "sprint-9"], [37]),
    IssueSpec(69, "Template import into canvas", 8, ["type:feature", "package:editor", "phase-8", "sprint-9"], [68]),
    IssueSpec(70, "In-editor template library UI", 8, ["type:feature", "package:editor", "phase-8", "sprint-9"], [69]),
    IssueSpec(71, "Starter templates: SaaS, Agency, Portfolio landings", 8, ["type:feature", "phase-8", "sprint-9"], [70]),
    IssueSpec(72, "Section templates: Hero, Features, Testimonials, Pricing, CTA, Contact", 8, ["type:feature", "phase-8", "sprint-9"], [70]),
    IssueSpec(73, "[Epic] Phase 9: Gutenberg integration", 9, ["epic", "phase-9"], []),
    IssueSpec(74, "Import existing Gutenberg pages into builder JSON", 9, ["type:feature", "package:serializer", "phase-9", "sprint-10", "priority:P0"], [37]),
    IssueSpec(75, "Open and edit posts created in block editor", 9, ["type:feature", "package:editor", "phase-9", "sprint-10"], [74]),
    IssueSpec(76, "Export saves valid native Gutenberg markup", 9, ["type:feature", "package:serializer", "phase-9", "sprint-10", "priority:P0"], [74]),
    IssueSpec(77, "Core block compatibility matrix + gaps doc", 9, ["type:docs", "phase-9", "sprint-10"], [74]),
    IssueSpec(78, "Integration test suite for Gutenberg interop", 9, ["type:test", "phase-9", "sprint-10"], [76]),
    IssueSpec(79, "[Epic] Phase 10: Public beta release", 10, ["epic", "phase-10"], []),
    IssueSpec(80, "End-user documentation", 10, ["type:docs", "phase-10", "sprint-11"], [78]),
    IssueSpec(81, "Project website and demo site", 10, ["type:docs", "phase-10", "sprint-11"], [78]),
    IssueSpec(82, "GitHub Actions: CI build, test, lint", 10, ["type:infra", "phase-10", "sprint-11"], []),
    IssueSpec(83, "Plugin release zip and versioning", 10, ["type:infra", "phase-10", "sprint-11"], [82]),
    IssueSpec(84, "WordPress.org submission checklist", 10, ["type:docs", "phase-10", "sprint-11"], [83]),
    IssueSpec(85, "Lighthouse performance audit (target >90)", 10, ["type:test", "phase-10", "sprint-11", "priority:P1"], [78]),
    IssueSpec(86, "Security pass: caps, sanitize, escape", 10, ["type:task", "phase-10", "sprint-11", "priority:P0"], [60, 78]),
]


def run(cmd: list[str], check: bool = True) -> subprocess.CompletedProcess:
    print("+", " ".join(cmd), flush=True)
    return subprocess.run(cmd, check=check, text=True, capture_output=True)


def gh_json(cmd: list[str]) -> dict | list:
    result = run(cmd)
    return json.loads(result.stdout)


def create_labels() -> None:
    for name, color, desc in LABELS:
        run(
            ["gh", "label", "create", name, "--repo", REPO, "--color", color, "--description", desc],
            check=False,
        )
        time.sleep(0.15)


def create_milestones() -> dict[int, str]:
    """Return map milestone_index (1-10) -> milestone title."""
    titles = {}
    for i, (title, due, desc) in enumerate(MILESTONES, start=1):
        body = json.dumps({"title": title, "description": desc, "due_on": f"{due}T23:59:59Z"})
        run(
            [
                "gh",
                "api",
                "-X",
                "POST",
                f"repos/{REPO}/milestones",
                "-f",
                f"title={title}",
                "-f",
                f"description={desc}",
                "-f",
                f"due_on={due}T23:59:59Z",
            ]
        )
        titles[i] = title
        time.sleep(0.2)
    return titles


def create_issues(milestone_titles: dict[int, str]) -> dict[int, int]:
    issue_map: dict[int, int] = {}
    for spec in ISSUES:
        body = spec.body or default_body(spec.draft_id, spec.depends, issue_map)
        label_args: list[str] = []
        for label in spec.labels:
            label_args.extend(["--label", label])

        cmd = [
            "gh",
            "issue",
            "create",
            "--repo",
            REPO,
            "--title",
            spec.title,
            "--body",
            body,
            "--milestone",
            milestone_titles[spec.milestone],
            *label_args,
        ]
        result = run(cmd)
        url = result.stdout.strip()
        number = int(url.rstrip("/").split("/")[-1])
        issue_map[spec.draft_id] = number
        print(f"  draft #{spec.draft_id} -> GitHub #{number}", flush=True)
        time.sleep(0.35)
    return issue_map


def main() -> int:
    print(f"Bootstrapping {REPO} (kickoff T0={T0})\n")

    print("=== Labels ===")
    create_labels()

    print("\n=== Milestones ===")
    milestone_titles = create_milestones()

    print("\n=== Issues ===")
    issue_map = create_issues(milestone_titles)

    mapping_path = "scripts/github-issue-map.json"
    with open(mapping_path, "w", encoding="utf-8") as f:
        json.dump(
            {
                "repo": REPO,
                "t0": T0,
                "milestones": {str(k): v for k, v in milestone_titles.items()},
                "draft_to_issue": {str(k): v for k, v in sorted(issue_map.items())},
            },
            f,
            indent=2,
        )
    print(f"\nWrote {mapping_path}")
    print(f"Created {len(issue_map)} issues.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
