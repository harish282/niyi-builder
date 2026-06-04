import type { BlockType } from './block-types.js';
import { CONTENT_BLOCK_TYPES, FORM_BLOCK_TYPES, LAYOUT_BLOCK_TYPES } from './block-types.js';

const layoutAndContent: readonly BlockType[] = [...LAYOUT_BLOCK_TYPES, ...CONTENT_BLOCK_TYPES];

const formFieldTypes: readonly BlockType[] = FORM_BLOCK_TYPES.filter((t) => t !== 'niyi/form');

/**
 * Allowed child block types per parent type (v0).
 * Missing parent keys imply no children allowed.
 */
export const ALLOWED_CHILDREN: Partial<Record<BlockType, readonly BlockType[]>> = {
  'niyi/container': layoutAndContent,
  'niyi/grid': layoutAndContent,
  'niyi/form': formFieldTypes,
};

export function getAllowedChildTypes(parentType: BlockType): readonly BlockType[] {
  return ALLOWED_CHILDREN[parentType] ?? [];
}

export function canNest(parentType: BlockType, childType: BlockType): boolean {
  const allowed = getAllowedChildTypes(parentType);
  return allowed.includes(childType);
}
