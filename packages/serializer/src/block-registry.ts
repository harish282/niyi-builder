import { BLOCK_TYPES, isBlockType, type BlockType } from '@niyi-builder/core';

/** Block types supported for serialize / deserialize in v0. */
export const SERIALIZABLE_BLOCK_TYPES = new Set<string>(BLOCK_TYPES);

export function isSerializableBlockType(type: string): type is BlockType {
  return isBlockType(type) && SERIALIZABLE_BLOCK_TYPES.has(type);
}

export function isNiyiBlockName(blockName: string | null): blockName is BlockType {
  return blockName !== null && isSerializableBlockType(blockName);
}
