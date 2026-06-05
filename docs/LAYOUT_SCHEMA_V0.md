# Layout JSON schema v0

The visual builder stores pages as a **JSON block tree** that serializes to **WordPress core Gutenberg blocks**. This document is the contract for `packages/core`, `packages/serializer`, and `packages/editor`.

- **JSON Schema:** [schemas/layout-v0.schema.json](./schemas/layout-v0.schema.json)
- **TypeScript:** `packages/core` (`BlockNode`, `BuilderDocument`, `validateDocument`)
- **Gutenberg output:** core blocks (`group`, `columns`, `heading`, …) — no custom `niyi/*` namespace

## Document shape

```json
{
  "version": 0,
  "root": {
    "id": "root",
    "type": "core/group",
    "attributes": {},
    "children": []
  }
}
```

| Field     | Type        | Rules                                 |
| --------- | ----------- | ------------------------------------- |
| `version` | `0`         | Required; constant for v0             |
| `root`    | `BlockNode` | Required; `type` must be `core/group` |

## Block node

| Field        | Type          | Rules                                 |
| ------------ | ------------- | ------------------------------------- |
| `id`         | string        | Non-empty; unique across the document |
| `type`       | string        | One of the MVP block types below      |
| `attributes` | object        | Block-specific; may be `{}`           |
| `children`   | `BlockNode[]` | Required array; `[]` for leaf blocks  |

## MVP block types (maps to Gutenberg)

### Layout

| JSON type      | Gutenberg block | Children           | Notes                |
| -------------- | --------------- | ------------------ | -------------------- |
| `core/group`   | `core/group`    | layout + content   | Container / sections |
| `core/columns` | `core/columns`  | `core/column` only | Row of columns       |
| `core/column`  | `core/column`   | layout + content   | Single column        |
| `core/spacer`  | `core/spacer`   | **none** (leaf)    | Height               |

### Content (all leaves in v0)

| JSON type        | Gutenberg block  |
| ---------------- | ---------------- | --------------------- |
| `core/heading`   | `core/heading`   |
| `core/paragraph` | `core/paragraph` |
| `core/button`    | `core/button`    |
| `core/image`     | `core/image`     |
| `core/html`      | `core/html`      | Icons / custom markup |
| `core/embed`     | `core/embed`     | YouTube, Vimeo, etc.  |

## Nesting rules (v0)

| Parent          | Allowed child types                                         |
| --------------- | ----------------------------------------------------------- |
| Document `root` | `core/group`, `core/columns`, `core/spacer`, content blocks |
| `core/group`    | Same as root children                                       |
| `core/columns`  | `core/column` only                                          |
| `core/column`   | `core/group`, `core/columns`, `core/spacer`, content blocks |
| Leaf blocks     | _(none)_                                                    |

Enforced in code: `validateDocument()` in `@niyi-builder/core`.

## Example: valid tree

```json
{
  "version": 0,
  "root": {
    "id": "root",
    "type": "core/group",
    "attributes": { "maxWidth": "1200px" },
    "children": [
      {
        "id": "hero-columns",
        "type": "core/columns",
        "attributes": { "columns": { "desktop": 2 }, "gap": { "desktop": "16px" } },
        "children": [
          {
            "id": "col-title",
            "type": "core/column",
            "attributes": {},
            "children": [
              {
                "id": "hero-title",
                "type": "core/heading",
                "attributes": { "level": 1, "content": "Hello" },
                "children": []
              }
            ]
          },
          {
            "id": "col-cta",
            "type": "core/column",
            "attributes": {},
            "children": [
              {
                "id": "hero-cta",
                "type": "core/button",
                "attributes": { "label": "Get started", "url": "#" },
                "children": []
              }
            ]
          }
        ]
      }
    ]
  }
}
```

## Validation (TypeScript)

```ts
import { validateDocument, createEmptyDocument } from '@niyi-builder/core';

const result = validateDocument(createEmptyDocument());
// { valid: true, issues: [] }
```

## Serialization

Builder attributes are stored on core blocks under a **`niyi`** object in the block comment JSON. Native Gutenberg attrs are kept minimal so content stays editable without the plugin.

```ts
import { serializeToGutenberg, parseFromGutenberg } from '@niyi-builder/serializer';

const markup = serializeToGutenberg(doc);
// <!-- wp:group {"niyi":{"maxWidth":"1200px"}} --> ...

const restored = parseFromGutenberg(markup);
```

Example attrs on a group block:

```json
{
  "niyi": {
    "maxWidth": "1200px",
    "padding": { "desktop": "24px", "mobile": "16px" }
  }
}
```

Block comments use the Gutenberg short name (`wp:group`, `wp:paragraph`). The parser normalizes them to `core/*` types in JSON.
