import type { BlockType } from './block-types.js';
import { CONTENT_BLOCK_TYPES, LAYOUT_BLOCK_TYPES } from './block-types.js';

const groupChildren: readonly BlockType[] = [
  'core/group',
  'core/columns',
  'core/spacer',
  ...CONTENT_BLOCK_TYPES,
];

const columnChildren: readonly BlockType[] = [
  'core/group',
  'core/columns',
  'core/spacer',
  ...CONTENT_BLOCK_TYPES,
];

/**
 * Allowed child block types per parent type (v0).
 * Missing parent keys imply no children allowed.
 */
export const ALLOWED_CHILDREN: Partial<Record<BlockType, readonly BlockType[]>> = {
  'core/group': groupChildren,
  'core/columns': ['core/column'],
  'core/column': columnChildren,
};

export function getAllowedChildTypes(parentType: BlockType): readonly BlockType[] {
  return ALLOWED_CHILDREN[parentType] ?? [];
}

export function canNest(parentType: BlockType, childType: BlockType): boolean {
  const allowed = getAllowedChildTypes(parentType);
  return allowed.includes(childType);
}

/** @deprecated Use ALLOWED_CHILDREN — kept for schema index re-exports. */
export { LAYOUT_BLOCK_TYPES, CONTENT_BLOCK_TYPES };
