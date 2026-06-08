# Niyi Builder

WordPress plugin — open-source **visual page builder** that outputs **native Gutenberg blocks** (no shortcode lock-in).

## Plugin layout

```
niyi-builder/                 # Dev repo — deploy copy to wp-content/plugins/ via release:dev
├── niyi-builder.php          # Plugin bootstrap
├── config/plugin.php         # Plugin settings (app env, logging, …)
├── bootstrap/                # Constants
├── includes/                 # PHP (`NiyiBuilder\` namespace)
├── resources/views/          # Admin PHP templates
├── admin/                    # Visual editor (React) — Gutenberg-oriented UI
├── assets/                   # Static CSS/images
├── build/                    # Compiled admin bundle (Vite)
├── blocks/                   # Gutenberg block definitions (`block.json`, renderers)
├── languages/                # Translations
└── packages/                 # TypeScript monorepo (editor, serializer, blocks, …)
```

## WordPress

Deploy a runtime copy into WordPress with `npm run release:dev` (builds first, then copies to `wp-content/plugins/niyi-builder`).

- **Editor:** Edit a post/page → **Edit with Niyi Builder** (list row or block editor header)
- **Dev shell:** WP Admin → **Niyi Builder (Dev)** (no post context)
- **Config:** `config/plugin.php` (see `config/plugin.sample.php`)
- **Architecture:** [docs/EDITOR_INTEGRATION.md](docs/EDITOR_INTEGRATION.md) — other editors reference + how Niyi loads
- **Requires:** WordPress 6.4+, PHP 8.1+

## Development

Requires Node 20+.

```bash
npm install
npm run build        # packages + admin bundle → build/
npm test
npm run lint         # TypeScript + ESLint + Prettier check
npm run format       # Prettier write
npm run release      # build + production zip in build/
npm run release:dev  # build + deploy copy to wp-content/plugins/niyi-builder
```

Editor settings: `.editorconfig` and `.vscode/settings.json` (format on save + ESLint fix).

WordPress always loads the compiled bundle from `build/` (same as production). After code changes, run `npm run release:dev` and refresh wp-admin.

### TypeScript packages (`packages/`)

| Package                    | Role in Gutenberg builder                                       |
| -------------------------- | --------------------------------------------------------------- |
| `@niyi-builder/core`       | Document types, schema v0, `validateDocument()`                 |
| `@niyi-builder/serializer` | JSON ↔ Gutenberg (`serializeToGutenberg`, `parseFromGutenberg`) |
| `@niyi-builder/editor`     | Visual canvas & editing UI                                      |
| `@niyi-builder/blocks`     | Block schemas, controls, render helpers                         |
| `@niyi-builder/animations` | Entrance animations                                             |
| `@niyi-builder/forms`      | Form builder                                                    |
| `@niyi-builder/history`    | Undo/redo                                                       |

## Schema

- [Layout JSON v0](docs/LAYOUT_SCHEMA_V0.md) — block tree contract
- [JSON Schema](docs/schemas/layout-v0.schema.json)

## Planning

- [Execution plan](docs/EXECUTION_PLAN.md)
- [GitHub Issues](https://github.com/harish282/niyi-builder/issues)
- [Milestones](https://github.com/harish282/niyi-builder/milestones)
