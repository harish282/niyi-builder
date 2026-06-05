# Gutenberg blocks

Niyi Builder does **not** register custom block types. Saved content uses **WordPress core blocks** only (`core/group`, `core/columns`, `core/heading`, etc.).

The visual editor (`admin/`) edits a JSON tree that serializes to native Gutenberg markup via `packages/serializer`. No `block.json` or PHP render callbacks live in this folder unless we add optional frontend assets later.
