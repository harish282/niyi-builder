import type { BlockType, DocumentVersion } from './block-types.js';
import { DOCUMENT_VERSION, ROOT_BLOCK_TYPE } from './block-types.js';

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

const ROOT_ID = 'root';

export function createEmptyDocument(): BuilderDocument {
  const root: BlockNode = {
    id: ROOT_ID,
    type: ROOT_BLOCK_TYPE,
    attributes: {},
    children: [],
  };

  return { version: DOCUMENT_VERSION, root };
}
