# Layout JSON schema v0

The visual builder stores pages as a **JSON block tree** that serializes to native Gutenberg markup. This document is the contract for `packages/core`, `packages/serializer`, and `packages/editor`.

- **JSON Schema:** [schemas/layout-v0.schema.json](./schemas/layout-v0.schema.json)
- **TypeScript:** `packages/core` (`BlockNode`, `BuilderDocument`, `validateDocument`)
- **Gutenberg namespace:** `niyi/*`

## Document shape

```json
{
  "version": 0,
  "root": {
    "id": "root",
    "type": "niyi/container",
    "attributes": {},
    "children": []
  }
}
```

| Field     | Type        | Rules                                     |
| --------- | ----------- | ----------------------------------------- |
| `version` | `0`         | Required; constant for v0                 |
| `root`    | `BlockNode` | Required; `type` must be `niyi/container` |

## Block node

| Field        | Type          | Rules                                 |
| ------------ | ------------- | ------------------------------------- |
| `id`         | string        | Non-empty; unique across the document |
| `type`       | string        | One of the MVP block types below      |
| `attributes` | object        | Block-specific; may be `{}`           |
| `children`   | `BlockNode[]` | Required array; `[]` for leaf blocks  |

## MVP block types

### Layout

| Type             | Children         | Notes                              |
| ---------------- | ---------------- | ---------------------------------- |
| `niyi/container` | layout + content | Width, padding, margin, background |
| `niyi/grid`      | layout + content | Columns, rows, gap (responsive)    |
| `niyi/spacer`    | **none** (leaf)  | Height                             |

### Content (all leaves in v0)

| Type           |
| -------------- |
| `niyi/heading` |
| `niyi/text`    |
| `niyi/button`  |
| `niyi/image`   |
| `niyi/icon`    |
| `niyi/video`   |

### Form (reserved — Phase 6)

| Type                | Children                   |
| ------------------- | -------------------------- |
| `niyi/form`         | form field blocks + submit |
| `niyi/form-field-*` | none (leaf)                |

## Nesting rules (v0)

| Parent           | Allowed child types                                          |
| ---------------- | ------------------------------------------------------------ |
| Document `root`  | `niyi/container`, `niyi/grid`, `niyi/spacer`, content blocks |
| `niyi/container` | Same as root children                                        |
| `niyi/grid`      | Same as root children                                        |
| `niyi/spacer`    | _(none)_                                                     |
| Content blocks   | _(none)_                                                     |
| `niyi/form`      | `niyi/form-field-*`, `niyi/form-field-submit`                |

Enforced in code: `validateDocument()` in `@niyi-builder/core`.

## Example: valid tree

```json
{
  "version": 0,
  "root": {
    "id": "root",
    "type": "niyi/container",
    "attributes": { "maxWidth": "1200px" },
    "children": [
      {
        "id": "hero-grid",
        "type": "niyi/grid",
        "attributes": { "columns": { "desktop": 2 } },
        "children": [
          {
            "id": "hero-title",
            "type": "niyi/heading",
            "attributes": { "level": 1, "content": "Hello" },
            "children": []
          },
          {
            "id": "hero-cta",
            "type": "niyi/button",
            "attributes": { "label": "Get started", "url": "#" },
            "children": []
          }
        ]
      },
      {
        "id": "gap",
        "type": "niyi/spacer",
        "attributes": { "height": { "desktop": "48px" } },
        "children": []
      }
    ]
  }
}
```

## Example: invalid trees

**Wrong root type**

```json
{
  "version": 0,
  "root": {
    "id": "root",
    "type": "niyi/heading",
    "attributes": {},
    "children": []
  }
}
```

→ `root.type` must be `niyi/container`.

**Leaf with children**

```json
{
  "id": "bad-spacer",
  "type": "niyi/spacer",
  "attributes": {},
  "children": [
    {
      "id": "nested",
      "type": "niyi/text",
      "attributes": {},
      "children": []
    }
  ]
}
```

→ `niyi/spacer` cannot have children.

**Disallowed nesting**

```json
{
  "id": "text-parent",
  "type": "niyi/text",
  "attributes": {},
  "children": [
    {
      "id": "child",
      "type": "niyi/button",
      "attributes": {},
      "children": []
    }
  ]
}
```

→ Content blocks cannot contain children in v0.

## Validation (TypeScript)

```ts
import { validateDocument, createEmptyDocument } from '@niyi-builder/core';

const result = validateDocument(createEmptyDocument());
// { valid: true, issues: [] }
```
