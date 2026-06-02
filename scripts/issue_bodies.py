"""Full GitHub issue bodies (summary, details, acceptance criteria)."""

from __future__ import annotations

# Each entry: summary, details (optional list), acceptance (list), phase deliverable (epics only)
ISSUE_CONTENT: dict[int, dict] = {
    1: {
        "summary": "Validate that the builder’s internal JSON document model can round-trip to native Gutenberg block markup without data loss.",
        "details": [
            "Phase 1 duration: ~2 weeks (Sprint 0).",
            "Child work: monorepo setup, plugin scaffold, serializer, and round-trip tests (#2–#11).",
        ],
        "acceptance": [
            "JSON → Gutenberg → JSON produces identical canonical JSON for supported block trees.",
            "Nested containers and nested content blocks are covered by automated tests.",
            "Phase 1 deliverable: working `packages/serializer` with passing test suite.",
        ],
        "milestone_goal": "M1: Architecture Validated",
    },
    2: {
        "summary": "Set up the monorepo root and empty workspace packages for the builder codebase.",
        "details": [
            "Create `packages/` with placeholders: `core`, `serializer`, `editor`, `blocks`, `animations`, `forms`, `history`.",
            "Configure workspace tooling (npm or pnpm workspaces).",
            "Shared TypeScript config that packages extend.",
            "`packages/core` exports shared types (minimal placeholders OK for now).",
        ],
        "acceptance": [
            "Root `package.json` defines workspaces and shared scripts (`build`, `test`, `lint`).",
            "Each package has `package.json` + `tsconfig.json` extending root.",
            "`packages/core` builds and exports base types used by serializer stub.",
        ],
    },
    3: {
        "summary": "Create the WordPress plugin scaffold that loads the builder in wp-admin.",
        "details": [
            "Main plugin file with header (name, version, text domain).",
            "Activation/deactivation hooks.",
            "PSR-4 or simple autoload for `plugin/php/`.",
            "Register admin menu entry point for the visual builder (can be minimal stub).",
        ],
        "acceptance": [
            "Plugin activates without errors on a local WP install.",
            "Admin page loads (placeholder UI acceptable).",
            "Follows WordPress coding standards for PHP bootstrap.",
        ],
    },
    4: {
        "summary": "Configure React, TypeScript, and Vite for the plugin admin/build bundle.",
        "details": [
            "Vite config outputs to `plugin/build/`.",
            "Dev server with HMR for local development.",
            "Enqueue built assets on the builder admin screen only.",
            "TypeScript strict mode aligned with monorepo root config.",
        ],
        "acceptance": [
            "`npm run dev` (or equivalent) serves the admin app with HMR.",
            "`npm run build` produces production assets in `plugin/build/`.",
            "Built script loads on the builder admin page without console errors.",
        ],
    },
    5: {
        "summary": "Add ESLint, Prettier, and TypeScript editor settings for consistent code style across packages.",
        "details": [
            "Root ESLint config for TypeScript/React.",
            "Prettier integration (format on lint or separate script).",
            "Optional CI lint job stub (can run locally only until Phase 10).",
        ],
        "acceptance": [
            "`npm run lint` passes on scaffolded packages.",
            "`npm run format` (or `lint --fix`) applies consistent formatting.",
            "EditorConfig or VS Code settings documented if needed.",
        ],
    },
    6: {
        "summary": "Define the v0 layout JSON schema that describes the builder’s block tree.",
        "details": [
            "Document node shape: `id`, `type`, `attributes`, `children`.",
            "List MVP block types and allowed nesting rules.",
            "Store schema in `packages/serializer` or `docs/` with TypeScript types in `packages/core`.",
            "Schema is the contract for serializer and editor.",
        ],
        "acceptance": [
            "JSON Schema or TypeScript types published in repo.",
            "Example valid/invalid trees documented.",
            "Serializer package imports types from `core`.",
        ],
    },
    7: {
        "summary": "Implement conversion from internal JSON layout to native Gutenberg block serialization (save format).",
        "details": [
            "Live in `packages/serializer`.",
            "Output valid Gutenberg block comments + attributes for MVP block types.",
            "Map container/layout attributes to appropriate core or namespaced blocks (e.g. `niyi/container`).",
        ],
        "acceptance": [
            "Given a fixture JSON tree, output parses in `parse_blocks()` without errors.",
            "Round-trip test (with #8) passes for flat trees.",
            "Unsupported nodes fail with clear errors (no silent drop).",
        ],
    },
    8: {
        "summary": "Implement parsing of existing Gutenberg block markup into the internal JSON layout model.",
        "details": [
            "Use WordPress `parse_blocks()` semantics or port equivalent for tests.",
            "Deserialize attributes and inner blocks into JSON tree.",
            "Handle nested innerBlocks structure.",
        ],
        "acceptance": [
            "Given Gutenberg markup fixture, produces JSON matching schema (#6).",
            "Pairs with #7 for round-trip tests.",
            "Documents any core blocks not yet mapped.",
        ],
    },
    9: {
        "summary": "Add automated round-trip unit tests for a flat (non-nested) block tree.",
        "details": [
            "Test: JSON → Gutenberg → JSON equality on canonical form.",
            "Run in CI-friendly test runner (Vitest/Jest).",
            "Use fixtures checked into `packages/serializer/__tests__/`.",
        ],
        "acceptance": [
            "At least one flat tree fixture passes round-trip.",
            "Tests run via `npm test` in serializer package.",
            "Failures print diff of JSON trees.",
        ],
    },
    10: {
        "summary": "Extend round-trip tests to multi-level nested container/layout trees.",
        "details": [
            "Containers inside containers; grid inside container, etc.",
            "Verify child order and attributes preserved.",
        ],
        "acceptance": [
            "Multiple nested layout fixtures pass round-trip.",
            "No data loss on depth ≥ 3 levels.",
        ],
    },
    11: {
        "summary": "Extend round-trip tests to content blocks nested inside layout blocks.",
        "details": [
            "e.g. heading + text + button inside container/grid.",
            "Completes Phase 1 success criteria for M1.",
        ],
        "acceptance": [
            "Fixtures with layout + content children pass round-trip.",
            "M1 milestone can be closed when #2–#11 are done.",
        ],
    },
    12: {
        "summary": "Build the visual editor shell: canvas, selection, and Elementor-style drag-and-drop.",
        "details": [
            "Phase 2 duration: ~4 weeks (Sprint 1–2).",
            "Depends on M1 serializer foundation.",
            "Child issues: #13–#23.",
        ],
        "acceptance": [
            "User can add, select, reorder, and nest elements on canvas.",
            "Save/load persists via serializer to post content.",
            "Deliverable: Elementor-style DnD editing experience.",
        ],
        "milestone_goal": "M2: Visual Editor Shell",
    },
    13: {
        "summary": "Build the visual editor shell UI with canvas area and toolbar placeholders.",
        "details": [
            "Full-screen or dedicated admin layout for the builder.",
            "Canvas region for live preview (iframe or in-DOM).",
            "Toolbar slots: device switcher (later), save, add element.",
            "Use React + Zustand for editor state scaffold.",
        ],
        "acceptance": [
            "Editor route renders canvas + empty toolbar.",
            "Layout responsive within wp-admin.",
            "No regressions to WP admin menu integration.",
        ],
    },
    14: {
        "summary": "Implement a component registry that maps block types to canvas React components.",
        "details": [
            "Register block `type` → renderer + default attributes.",
            "Extensible API for future blocks package.",
            "Stub renderers OK for blocks not yet implemented.",
        ],
        "acceptance": [
            "Registry API documented in code.",
            "At least one stub block renders on canvas.",
            "Unknown types show fallback UI with type name.",
        ],
    },
    15: {
        "summary": "Implement the rendering engine that turns the JSON block tree into React canvas preview.",
        "details": [
            "Recursive render of `children`.",
            "Pass selection props to child components.",
            "Read from Zustand/editor store.",
        ],
        "acceptance": [
            "Fixture JSON tree renders matching structure in canvas.",
            "Updates when store tree changes.",
            "Performance acceptable for ~50 nodes.",
        ],
    },
    16: {
        "summary": "Implement selection: click to select, visual highlight, and hierarchy breadcrumb.",
        "details": [
            "Single selection (multi-select out of scope unless trivial).",
            "Highlight ring/outline on selected node.",
            "Breadcrumb or tree path shows parent chain.",
        ],
        "acceptance": [
            "Clicking canvas element updates selected id in store.",
            "Only one selected element at a time.",
            "Breadcrumb navigates/selects parent on click.",
        ],
    },
    17: {
        "summary": "Add element flow: block palette / inserter to add new blocks to the tree.",
        "details": [
            "Palette lists available block types from registry.",
            "Insert at root or as child of selected container (basic rules).",
            "Stub blocks acceptable for not-yet-built block types.",
        ],
        "acceptance": [
            "User can add a block from palette to canvas.",
            "New block appears in JSON tree and re-renders.",
            "Insert respects nesting rules from schema.",
        ],
    },
    18: {
        "summary": "Wire save and load between the canvas JSON tree and WordPress post content via the serializer.",
        "details": [
            "Load: fetch post content → deserialize (#8) → editor store.",
            "Save: store → serialize (#7) → REST API or `wp.data` save.",
            "Respect user capabilities and nonces.",
        ],
        "acceptance": [
            "Save writes valid Gutenberg markup to post.",
            "Reloading page restores canvas from post content.",
            "Errors surfaced in UI (toast or notice).",
        ],
    },
    19: {
        "summary": "Integrate dnd-kit for drag-and-drop on the editor canvas.",
        "details": [
            "Drag handles on selectable elements.",
            "Sensors for pointer + keyboard where supported.",
            "Integrate with existing selection store.",
        ],
        "acceptance": [
            "User can start drag from canvas element.",
            "Drag state does not break selection.",
            "Cancel drag restores original position.",
        ],
    },
    20: {
        "summary": "Support reordering sibling elements within the same parent via drag-and-drop.",
        "details": [
            "Update `children` array order in JSON tree on drop.",
            "Persist order through save/load.",
        ],
        "acceptance": [
            "Drag sibling A above/below sibling B updates order.",
            "Order survives save/reload.",
        ],
    },
    21: {
        "summary": "Support dropping elements into containers/grids to change nesting.",
        "details": [
            "Drop targets on container/grid blocks.",
            "Move node from old parent to new parent on valid drop.",
            "Prevent invalid nesting per schema.",
        ],
        "acceptance": [
            "Block dragged into container becomes child of that container.",
            "Invalid drops rejected with visual feedback.",
            "Nesting reflected in serializer output.",
        ],
    },
    22: {
        "summary": "Add drop zone indicators and drag preview UX (lines, insertion markers).",
        "details": [
            "Show line or gap indicator for insert position.",
            "Ghost/preview of dragged element optional.",
            "Match Elementor-style affordances where practical.",
        ],
        "acceptance": [
            "User sees clear drop target while dragging.",
            "Indicators differ for reorder vs nest.",
        ],
    },
    23: {
        "summary": "Keyboard and accessibility baseline for drag-and-drop interactions.",
        "details": [
            "Escape cancels active drag.",
            "Reasonable focus order for palette and canvas.",
            "Document known a11y limitations.",
        ],
        "acceptance": [
            "Escape key cancels drag operation.",
            "Focusable controls in toolbar and palette.",
            "No keyboard traps in editor shell.",
        ],
    },
    24: {
        "summary": "Implement MVP layout and content blocks so users can build complete landing pages.",
        "details": [
            "Phase 3 duration: ~4 weeks (Sprint 3–4).",
            "Layout: container, grid, spacer (#25–#30).",
            "Content: heading, text, button, image, icon, video (#31–#36).",
            "Demo: #37.",
        ],
        "acceptance": [
            "All MVP blocks registered with serializer + canvas + frontend render.",
            "Example landing page built entirely in builder.",
        ],
        "milestone_goal": "M3: MVP Block Library",
    },
    25: {
        "summary": "Container block — define data model and Gutenberg serialization.",
        "details": [
            "Attributes: width, max-width, padding, margin, background, border-radius.",
            "Maps to namespaced block e.g. `niyi/container`.",
            "Inner blocks allowed.",
        ],
        "acceptance": [
            "Container serializes/deserializes via round-trip tests.",
            "Default attributes applied on insert.",
        ],
    },
    26: {
        "summary": "Container block — inspector controls for layout and style attributes.",
        "details": [
            "Sidebar controls: width, max-width, padding, margin, background, border-radius.",
            "Updates canvas preview and JSON attributes live.",
        ],
        "acceptance": [
            "All listed attributes editable in inspector.",
            "Changes persist on save/reload.",
        ],
    },
    27: {
        "summary": "Grid block — data model and Gutenberg serialization.",
        "details": [
            "Attributes: columns, rows, gap.",
            "Supports children blocks in cells.",
        ],
        "acceptance": [
            "Grid round-trips through serializer.",
            "Children render in correct grid structure on frontend.",
        ],
    },
    28: {
        "summary": "Grid block — inspector for columns, rows, gap; hooks for responsive overrides (Phase 4).",
        "details": [
            "Inspector fields for columns, rows, gap.",
            "Attribute structure compatible with per-breakpoint overrides later.",
        ],
        "acceptance": [
            "Inspector updates grid layout on canvas.",
            "Attribute shape documented for responsive layer.",
        ],
    },
    29: {
        "summary": "Spacer block with adjustable height control.",
        "details": [
            "Single primary attribute: height (px/rem).",
            "Minimal frontend markup/CSS.",
        ],
        "acceptance": [
            "Height adjustable in inspector.",
            "Renders correct spacing on frontend.",
        ],
    },
    30: {
        "summary": "Frontend render for layout blocks (PHP dynamic blocks or block.json + lightweight CSS).",
        "details": [
            "Container, grid, spacer public output.",
            "Avoid heavy CSS; no builder bundle required on frontend.",
            "Semantic HTML where possible.",
        ],
        "acceptance": [
            "Published page renders layout blocks without admin JS.",
            "CSS payload documented and minimal.",
        ],
    },
    31: {
        "summary": "Heading block with H1–H6 level and typography controls.",
        "details": [
            "Level selector and font size/weight/line-height as needed for MVP.",
            "Rich text limited to plain text or inline bold/italic per product decision.",
        ],
        "acceptance": [
            "Heading level and typography editable.",
            "Serializes to valid heading block markup.",
        ],
    },
    32: {
        "summary": "Rich text block for body copy editing.",
        "details": [
            "Use block editor rich text component or controlled contenteditable.",
            "Support basic formatting (bold, italic, links) for MVP.",
        ],
        "acceptance": [
            "User can edit paragraph content on canvas.",
            "Formatting survives save/reload.",
        ],
    },
    33: {
        "summary": "Button block with label text, link URL, and style variants.",
        "details": [
            "Link: URL, open in new tab, rel attributes.",
            "Styles: primary/secondary/outline (minimal set).",
        ],
        "acceptance": [
            "Button renders on canvas and frontend with correct link.",
            "Style variant persists in attributes.",
        ],
    },
    34: {
        "summary": "Image block integrated with the WordPress media library.",
        "details": [
            "Media modal picker; attachment id + alt + size.",
            "Responsive image src/srcset on frontend.",
        ],
        "acceptance": [
            "User can pick image from media library.",
            "Image displays on canvas and frontend with alt text.",
        ],
    },
    35: {
        "summary": "Icon block with SVG support (picker or upload).",
        "details": [
            "Inline SVG or sprite approach; sanitize SVG on save.",
            "Size and color controls for MVP.",
        ],
        "acceptance": [
            "SVG icon renders on frontend safely (sanitized).",
            "Size/color adjustable in inspector.",
        ],
    },
    36: {
        "summary": "Video block supporting YouTube, Vimeo, and self-hosted video.",
        "details": [
            "oEmbed or iframe for YouTube/Vimeo URLs.",
            "Self-hosted: attachment video or URL field.",
            "Poster image optional.",
        ],
        "acceptance": [
            "Each source type plays on frontend.",
            "Invalid URLs show editor warning.",
        ],
    },
    37: {
        "summary": "Create an end-to-end example landing page under `examples/`.",
        "details": [
            "Demonstrates layout + content blocks together.",
            "Export JSON template + screenshots for README.",
            "Used for manual QA and future template library.",
        ],
        "acceptance": [
            "`examples/` contains importable page JSON and brief README.",
            "Page builds in editor without errors.",
        ],
    },
    38: {
        "summary": "Responsive design: edit layout and styles per desktop, tablet, and mobile breakpoints.",
        "details": [
            "Phase 4 duration: ~2 weeks (Sprint 5).",
            "Issues #39–#44.",
        ],
        "acceptance": [
            "Device switcher changes which attribute values are edited.",
            "Overrides persist through serializer.",
        ],
        "milestone_goal": "M4: Responsive Editing",
    },
    39: {
        "summary": "Breakpoint system with desktop, tablet, and mobile tokens in shared store.",
        "details": [
            "Define pixel widths or WP-aligned breakpoints.",
            "Store active breakpoint in Zustand/editor state.",
            "Types in `packages/core`.",
        ],
        "acceptance": [
            "Three breakpoints defined and documented.",
            "Active breakpoint readable by inspector and canvas.",
        ],
    },
    40: {
        "summary": "Device switcher control in the editor toolbar.",
        "details": [
            "Icons/buttons for desktop, tablet, mobile.",
            "Updates active breakpoint in store (#39).",
        ],
        "acceptance": [
            "Clicking switcher changes active device.",
            "UI indicates current device clearly.",
        ],
    },
    41: {
        "summary": "Per-breakpoint attribute overrides in the JSON schema and serializer.",
        "details": [
            "e.g. `attributes.padding` vs `attributes.responsive.tablet.padding`.",
            "Merge/fallback rules: mobile → tablet → desktop.",
            "Update schema doc from Phase 1.",
        ],
        "acceptance": [
            "Schema supports per-breakpoint values.",
            "Serializer round-trips responsive attributes (#44).",
        ],
    },
    42: {
        "summary": "Responsive inspector controls for width, margin, padding, typography, and visibility.",
        "details": [
            "Inspector reads/writes values for active breakpoint only.",
            "Show inherited value hint when override empty.",
        ],
        "acceptance": [
            "Listed properties editable per device.",
            "Canvas preview reflects active breakpoint overrides.",
        ],
    },
    43: {
        "summary": "Canvas preview mode with constrained width per breakpoint.",
        "details": [
            "Canvas max-width matches device breakpoint.",
            "Optional frame/chrome for tablet/mobile.",
        ],
        "acceptance": [
            "Switching device resizes canvas preview.",
            "WYSIWYG alignment with frontend CSS breakpoints.",
        ],
    },
    44: {
        "summary": "Automated serializer tests for responsive attribute round-trip.",
        "details": [
            "Fixtures with different values per breakpoint.",
            "Assert Gutenberg output contains responsive data (classes or attributes).",
        ],
        "acceptance": [
            "Tests pass for at least container + one content block.",
            "No cross-breakpoint bleed on round-trip.",
        ],
    },
    45: {
        "summary": "Animation engine for lightweight entrance animations on the frontend.",
        "details": [
            "Phase 5 duration: ~2 weeks (Sprint 6).",
            "Issues #46–#52.",
        ],
        "acceptance": [
            "Entrance animations work on published pages with minimal JS.",
            "`prefers-reduced-motion` respected.",
        ],
        "milestone_goal": "M5: Animation Engine",
    },
    46: {
        "summary": "Create `packages/animations` with shared animation types and runtime helpers.",
        "details": [
            "Define animation names enum and default duration/delay.",
            "Separate editor metadata from frontend runtime.",
        ],
        "acceptance": [
            "Package builds and exports public API.",
            "Documented list of supported animation types.",
        ],
    },
    47: {
        "summary": "Block animation attributes: data-animation, data-duration, data-delay, offset.",
        "details": [
            "Store in block JSON; output as `data-*` attributes on frontend HTML.",
            "Inspector wiring in #50.",
        ],
        "acceptance": [
            "Blocks can store animation settings.",
            "Serialized HTML includes correct data attributes.",
        ],
    },
    48: {
        "summary": "Fade entrance animations: in, up, down, left, right.",
        "details": [
            "CSS or lightweight JS transitions triggered on enter viewport.",
            "Implemented in animations package runtime.",
        ],
        "acceptance": [
            "All five fade variants work on demo block.",
            "No layout shift after animation completes.",
        ],
    },
    49: {
        "summary": "Zoom entrance animations: zoom in and zoom out.",
        "details": [
            "Combine with intersection observer from #51.",
        ],
        "acceptance": [
            "Zoom in/out play once when element enters viewport.",
        ],
    },
    50: {
        "summary": "Editor inspector controls for animation duration, delay, and offset.",
        "details": [
            "Dropdown or select for animation type.",
            "Numeric inputs for duration (ms), delay (ms), offset (px).",
        ],
        "acceptance": [
            "Inspector updates block animation attributes live.",
            "Preview hint on canvas optional; frontend is source of truth.",
        ],
    },
    51: {
        "summary": "Frontend animation runtime using Intersection Observer; honor prefers-reduced-motion.",
        "details": [
            "Small enqueue script on pages using animated blocks only.",
            "Skip animations when `prefers-reduced-motion: reduce`.",
        ],
        "acceptance": [
            "Animations fire on scroll into view.",
            "Reduced motion disables animations.",
            "Script size documented (target: minimal).",
        ],
    },
    52: {
        "summary": "Serializer round-trip tests for animation metadata.",
        "details": [
            "Fixture blocks with animation attrs survive JSON ↔ Gutenberg.",
        ],
        "acceptance": [
            "Automated tests pass for animated container + heading.",
        ],
    },
    53: {
        "summary": "Form builder: contact forms with fields, validation, email, and database storage.",
        "details": [
            "Phase 6 duration: ~3 weeks (Sprint 7).",
            "Issues #54–#60.",
        ],
        "acceptance": [
            "User can build and publish a working contact form.",
            "Submissions stored and email sent.",
        ],
        "milestone_goal": "M6: Form Builder",
    },
    54: {
        "summary": "Form container block that accepts field blocks as children.",
        "details": [
            "Drop targets for field blocks in editor.",
            "Form-level settings: recipient email, success message (basics).",
        ],
        "acceptance": [
            "Form block accepts field children in canvas.",
            "Serializes as structured block tree.",
        ],
    },
    55: {
        "summary": "Form field blocks for all MVP types: name, text, email, phone, number, textarea, select, checkbox, radio.",
        "details": [
            "Each field: label, name, required flag, placeholder where relevant.",
            "Select/radio: options list in attributes.",
        ],
        "acceptance": [
            "All field types insertable and render on frontend.",
            "Field names unique within form validation.",
        ],
    },
    56: {
        "summary": "Client-side validation for required fields and email format.",
        "details": [
            "HTML5 validation + custom messages.",
            "Prevent submit until valid.",
        ],
        "acceptance": [
            "Required fields block submit with visible errors.",
            "Invalid email shows inline error.",
        ],
    },
    57: {
        "summary": "REST API endpoint for form submission with nonce and capability checks.",
        "details": [
            "POST endpoint receives form id + field payload.",
            "Sanitize all inputs; rate limit consideration documented.",
        ],
        "acceptance": [
            "Valid submission returns success JSON.",
            "Invalid nonce or spam rejected with 4xx.",
        ],
    },
    58: {
        "summary": "Persist form submissions to the database (custom table or CPT).",
        "details": [
            "Store timestamp, form id, field values (JSON).",
            "Admin list table or menu to view entries (minimal).",
        ],
        "acceptance": [
            "Submission creates retrievable DB record.",
            "GDPR note: export/delete scope documented.",
        ],
    },
    59: {
        "summary": "Send email notification on successful form submit via wp_mail.",
        "details": [
            "Configurable recipient (form setting or filter).",
            "Plain-text or simple HTML body with field values.",
        ],
        "acceptance": [
            "Email sent on successful submit in local/staging test.",
            "Failure logged; user still sees success only if both DB+email succeed (define policy).",
        ],
    },
    60: {
        "summary": "Gutenberg serialization for the complete form block tree.",
        "details": [
            "Form + fields round-trip without losing field config.",
        ],
        "acceptance": [
            "Form with 3+ field types passes serializer round-trip tests.",
        ],
    },
    61: {
        "summary": "Productivity features: undo, redo, duplicate, copy, paste, delete.",
        "details": [
            "Phase 7 duration: ~3 weeks (Sprint 8).",
            "Issues #62–#66; Zustand integration across editor.",
        ],
        "acceptance": [
            "Editor supports standard editing shortcuts workflow.",
        ],
        "milestone_goal": "M7: Production Editing Workflow",
    },
    62: {
        "summary": "History package (`packages/history`) using the command pattern for undoable actions.",
        "details": [
            "Commands: insert, delete, move, update attributes.",
            "Undo stack + redo stack with max depth configurable.",
        ],
        "acceptance": [
            "Package exports `execute`, `undo`, `redo` API.",
            "Unit tests for command merge where applicable.",
        ],
    },
    63: {
        "summary": "Undo and redo integrated with editor keyboard shortcuts.",
        "details": [
            "Ctrl/Cmd+Z undo, Ctrl/Cmd+Shift+Z redo.",
            "Toolbar buttons optional.",
        ],
        "acceptance": [
            "Last 20+ actions undoable/redoable.",
            "Canvas and store stay in sync after undo.",
        ],
    },
    64: {
        "summary": "Duplicate selected element including subtree.",
        "details": [
            "Generate new unique ids for cloned nodes.",
            "Insert duplicate after original or as sibling.",
        ],
        "acceptance": [
            "Duplicate creates deep copy with new ids.",
            "Duplicated subtree renders correctly.",
        ],
    },
    65: {
        "summary": "Copy and paste elements within the page (define cross-page scope).",
        "details": [
            "Clipboard in memory for MVP; document limitation vs cross-tab.",
            "Paste respects target container nesting rules.",
        ],
        "acceptance": [
            "Copy/paste works within same editor session.",
            "Scope documented in user docs.",
        ],
    },
    66: {
        "summary": "Delete selected element with optional confirmation for large subtrees.",
        "details": [
            "Delete key removes selection from tree.",
            "Confirm dialog if subtree > N nodes (e.g. 5) — configurable.",
        ],
        "acceptance": [
            "Delete removes node and children from store.",
            "Undo restores deleted subtree (#63).",
        ],
    },
    67: {
        "summary": "Template library: export, import, and starter pages/sections.",
        "details": [
            "Phase 8 duration: ~2 weeks (Sprint 9).",
            "Issues #68–#72.",
        ],
        "acceptance": [
            "User can insert starter landing/section from library.",
        ],
        "milestone_goal": "M8: Template Library",
    },
    68: {
        "summary": "Template export format (JSON + assets manifest).",
        "details": [
            "Export page or section subtree as `.json` template file.",
            "Manifest lists media attachment ids/URLs to bundle or re-map on import.",
        ],
        "acceptance": [
            "Export produces valid file importable by #69.",
            "Format version field for future migrations.",
        ],
    },
    69: {
        "summary": "Template import into canvas (replace or append section).",
        "details": [
            "Import remaps ids; optional media sideload.",
            "Modes: replace page content vs insert section at selection.",
        ],
        "acceptance": [
            "Imported template renders on canvas.",
            "Media references resolved or placeholder shown.",
        ],
    },
    70: {
        "summary": "In-editor template library UI with categories (landing pages, sections).",
        "details": [
            "Modal or panel browsing bundled templates.",
            "Preview thumbnail + insert button.",
        ],
        "acceptance": [
            "Library lists templates from `examples/` or packaged assets.",
            "Insert triggers #69 flow.",
        ],
    },
    71: {
        "summary": "Starter landing page templates: SaaS, Agency, and Portfolio.",
        "details": [
            "Three full-page JSON templates using MVP blocks.",
            "Ship with demo copy and images (placeholders OK).",
        ],
        "acceptance": [
            "Each template inserts and renders without errors.",
            "Listed in template library under Landing category.",
        ],
    },
    72: {
        "summary": "Section templates: Hero, Features, Testimonials, Pricing, CTA, Contact.",
        "details": [
            "Reusable section JSON files.",
            "Consistent spacing and responsive attrs.",
        ],
        "acceptance": [
            "Six section types available in library.",
            "Each section inserts into selected container or page root.",
        ],
    },
    73: {
        "summary": "Full Gutenberg interoperability: import, edit, and export native block content.",
        "details": [
            "Phase 9 duration: ~3 weeks (Sprint 10).",
            "Issues #74–#78.",
        ],
        "acceptance": [
            "Pages created in block editor open and save correctly in visual builder.",
        ],
        "milestone_goal": "M9: Full Gutenberg Compatibility",
    },
    74: {
        "summary": "Import existing Gutenberg pages by parsing core blocks into builder JSON.",
        "details": [
            "Map core/group, columns, paragraph, heading, image, etc.",
            "Unknown blocks → fallback or skip with user warning list.",
        ],
        "acceptance": [
            "Sample core blocks page imports to editable JSON.",
            "Compatibility gaps listed in #77.",
        ],
    },
    75: {
        "summary": "Open posts created in the block editor directly in the visual builder.",
        "details": [
            "Entry point: post list row action or editor switch.",
            "Load via #74 import path.",
        ],
        "acceptance": [
            "User can open existing post in builder from wp-admin.",
            "Content matches block editor preview within supported blocks.",
        ],
    },
    76: {
        "summary": "Export/save produces valid native Gutenberg markup editable in the block editor.",
        "details": [
            "Deactivate builder → content still editable with core editor.",
            "No proprietary shortcodes.",
        ],
        "acceptance": [
            "Saved post opens in block editor without validation errors.",
            "No niyi-only markup required on frontend.",
        ],
    },
    77: {
        "summary": "Document core block compatibility matrix and known gaps.",
        "details": [
            "Table: core block → import support → export support.",
            "List workarounds for unsupported blocks.",
        ],
        "acceptance": [
            "`docs/gutenberg-compatibility.md` published.",
            "Matrix covers all blocks targeted for v1.0.",
        ],
    },
    78: {
        "summary": "Integration test suite for Gutenberg import/export interop.",
        "details": [
            "Fixtures: core blocks pages round-trip through builder save.",
            "Run in CI.",
        ],
        "acceptance": [
            "CI job runs interop tests.",
            "Failures block release branch merges (when CI enforced).",
        ],
    },
    79: {
        "summary": "Public beta release: documentation, website, demo, CI, packaging, WP.org prep.",
        "details": [
            "Phase 10 duration: ~2 weeks (Sprint 11).",
            "Issues #80–#86.",
            "Target tag: `v1.0.0-beta.1` → `v1.0.0`.",
        ],
        "acceptance": [
            "Public beta installable via zip or WP.org.",
            "Lighthouse > 90 on demo pages (#85).",
        ],
        "milestone_goal": "M10: Public Beta (v1.0)",
    },
    80: {
        "summary": "End-user documentation for install, blocks, forms, and templates.",
        "details": [
            "Sections: getting started, each block type, responsive editing, forms, templates.",
            "Host in `docs/` and link from README + website.",
        ],
        "acceptance": [
            "New user can install plugin and build a landing page following docs only.",
            "Docs linked from plugin admin help tab or readme.",
        ],
    },
    81: {
        "summary": "Project marketing website and hosted demo site.",
        "details": [
            "`website/` static site (GitHub Pages OK).",
            "Demo WP instance with sample pages (staging URL).",
        ],
        "acceptance": [
            "Website live with features list + link to demo.",
            "Demo showcases SaaS/agency templates.",
        ],
    },
    82: {
        "summary": "GitHub Actions workflow: build, test, lint on push/PR.",
        "details": [
            "Matrix or single job: PHP lint (optional), JS test, typecheck, build.",
            "Cache node_modules.",
        ],
        "acceptance": [
            "CI passes on `main`.",
            "PRs show required checks.",
        ],
    },
    83: {
        "summary": "Plugin release zip artifact and semantic versioning.",
        "details": [
            "Build script produces `niyi-builder-x.y.z.zip` with vendor deps excluded as appropriate.",
            "Attach to GitHub Release.",
        ],
        "acceptance": [
            "Release workflow produces installable zip.",
            "Version in plugin header matches tag.",
        ],
    },
    84: {
        "summary": "WordPress.org submission checklist and assets.",
        "details": [
            "readme.txt, banner, icons, GPLv2 compatibility.",
            "Review guidelines checklist in docs.",
        ],
        "acceptance": [
            "Checklist completed; submission ready or submitted.",
            "No trademark/GPL violations in assets.",
        ],
    },
    85: {
        "summary": "Lighthouse performance audit on demo pages (target score > 90).",
        "details": [
            "Run against example landing + form page.",
            "Compare page weight to comparable Elementor page (document baseline).",
        ],
        "acceptance": [
            "Performance score ≥ 90 on documented URLs.",
            "Regression notes filed for scores 85–89.",
        ],
    },
    86: {
        "summary": "Security review: capabilities, sanitization, and escaping across plugin and REST endpoints.",
        "details": [
            "Audit form endpoint (#57), admin screens, saved markup output.",
            "Verify nonces, `current_user_can`, `esc_*`, `wp_kses` usage.",
        ],
        "acceptance": [
            "No unauthenticated sensitive data exposure.",
            "Security findings documented and P0 issues filed or fixed.",
        ],
    },
}


def build_body(draft_id: int, depends: list[int], issue_map: dict[int, int]) -> str:
    content = ISSUE_CONTENT[draft_id]
    lines: list[str] = []

    lines.append("## Summary")
    lines.append(content["summary"])
    lines.append("")

    if content.get("milestone_goal"):
        lines.append(f"**Milestone goal:** {content['milestone_goal']}")
        lines.append("")

    details = content.get("details", [])
    if details:
        lines.append("## Details")
        for item in details:
            lines.append(f"- {item}")
        lines.append("")

    if depends:
        refs = ", ".join(f"#{issue_map[d]}" for d in depends if d in issue_map)
        if refs:
            lines.append(f"**Depends on:** {refs}")
            lines.append("")

    lines.append("## Acceptance criteria")
    for item in content["acceptance"]:
        lines.append(f"- [ ] {item}")

    return "\n".join(lines)
