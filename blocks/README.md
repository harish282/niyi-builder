# Gutenberg blocks

Native WordPress blocks for Niyi Builder (`niyi/*` block namespace).

Each block will include:

- `block.json` — block metadata and attributes
- PHP render callback (dynamic blocks)
- Optional frontend assets

The visual editor (`admin/`) edits a JSON tree that serializes to these blocks via `packages/serializer`.
