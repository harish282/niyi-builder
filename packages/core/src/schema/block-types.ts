/**
 * MVP block type identifiers (Gutenberg namespaced blocks: `niyi/*`).
 * @see docs/LAYOUT_SCHEMA_V0.md
 */
export const BLOCK_NAMESPACE = 'niyi' as const;

/** Layout blocks — structural; most accept children. */
export const LAYOUT_BLOCK_TYPES = ['niyi/container', 'niyi/grid', 'niyi/spacer'] as const;

/** Content blocks — leaf nodes in v0. */
export const CONTENT_BLOCK_TYPES = [
  'niyi/heading',
  'niyi/text',
  'niyi/button',
  'niyi/image',
  'niyi/icon',
  'niyi/video',
] as const;

/** Form blocks — reserved for Phase 6; included in schema for forward compatibility. */
export const FORM_BLOCK_TYPES = [
  'niyi/form',
  'niyi/form-field-name',
  'niyi/form-field-text',
  'niyi/form-field-email',
  'niyi/form-field-phone',
  'niyi/form-field-number',
  'niyi/form-field-textarea',
  'niyi/form-field-select',
  'niyi/form-field-checkbox',
  'niyi/form-field-radio',
  'niyi/form-field-submit',
] as const;

export const BLOCK_TYPES = [
  ...LAYOUT_BLOCK_TYPES,
  ...CONTENT_BLOCK_TYPES,
  ...FORM_BLOCK_TYPES,
] as const;

export type LayoutBlockType = (typeof LAYOUT_BLOCK_TYPES)[number];
export type ContentBlockType = (typeof CONTENT_BLOCK_TYPES)[number];
export type FormBlockType = (typeof FORM_BLOCK_TYPES)[number];
export type BlockType = (typeof BLOCK_TYPES)[number];

export const DOCUMENT_VERSION = 0 as const;
export type DocumentVersion = typeof DOCUMENT_VERSION;

export const ROOT_BLOCK_TYPE = 'niyi/container' as const satisfies LayoutBlockType;

/** Leaf blocks — must not have children in v0. */
export const LEAF_BLOCK_TYPES: readonly BlockType[] = [
  'niyi/spacer',
  ...CONTENT_BLOCK_TYPES,
  'niyi/form-field-name',
  'niyi/form-field-text',
  'niyi/form-field-email',
  'niyi/form-field-phone',
  'niyi/form-field-number',
  'niyi/form-field-textarea',
  'niyi/form-field-select',
  'niyi/form-field-checkbox',
  'niyi/form-field-radio',
  'niyi/form-field-submit',
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
