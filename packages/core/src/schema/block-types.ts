/**
 * MVP block types — WordPress core Gutenberg blocks only (`core/*`).
 * @see docs/LAYOUT_SCHEMA_V0.md
 */
export const BLOCK_NAMESPACE = 'core' as const;

/** Layout blocks — structural; most accept children. */
export const LAYOUT_BLOCK_TYPES = [
  'core/group',
  'core/columns',
  'core/column',
  'core/spacer',
] as const;

/** Content blocks — leaf nodes in v0. */
export const CONTENT_BLOCK_TYPES = [
  'core/heading',
  'core/paragraph',
  'core/button',
  'core/image',
  'core/html',
  'core/embed',
] as const;

export const BLOCK_TYPES = [...LAYOUT_BLOCK_TYPES, ...CONTENT_BLOCK_TYPES] as const;

export type LayoutBlockType = (typeof LAYOUT_BLOCK_TYPES)[number];
export type ContentBlockType = (typeof CONTENT_BLOCK_TYPES)[number];
export type BlockType = (typeof BLOCK_TYPES)[number];

export const DOCUMENT_VERSION = 0 as const;
export type DocumentVersion = typeof DOCUMENT_VERSION;

export const ROOT_BLOCK_TYPE = 'core/group' as const satisfies LayoutBlockType;

/** Leaf blocks — must not have children in v0. */
export const LEAF_BLOCK_TYPES: readonly BlockType[] = [
  'core/spacer',
  ...CONTENT_BLOCK_TYPES,
] as const;

export function isBlockType(value: string): value is BlockType {
  return (BLOCK_TYPES as readonly string[]).includes(value);
}

export function isLayoutBlockType(type: BlockType): type is LayoutBlockType {
  return (LAYOUT_BLOCK_TYPES as readonly string[]).includes(type);
}

export function isContentBlockType(type: BlockType): type is ContentBlockType {
  return (CONTENT_BLOCK_TYPES as readonly string[]).includes(type);
}

export function isLeafBlockType(type: BlockType): boolean {
  return (LEAF_BLOCK_TYPES as readonly string[]).includes(type);
}
