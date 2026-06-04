import type { BlockType, DocumentVersion } from './schema/block-types.js';

/**
 * v0 layout JSON node — see docs/LAYOUT_SCHEMA_V0.md and docs/schemas/layout-v0.schema.json
 */
export interface BlockNode {
  id: string;
  type: BlockType;
  attributes: Record<string, unknown>;
  children: BlockNode[];
}

export interface BuilderDocument {
  version: DocumentVersion;
  root: BlockNode;
}

/** @deprecated Use BlockType from schema */
export type BlockNodeType = BlockType;
