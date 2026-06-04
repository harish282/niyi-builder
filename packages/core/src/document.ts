import type { BuilderDocument, BlockNode } from './types.js';
import { ROOT_BLOCK_TYPE } from './schema/block-types.js';

const ROOT_ID = 'root';

export function createEmptyDocument(): BuilderDocument {
  const root: BlockNode = {
    id: ROOT_ID,
    type: ROOT_BLOCK_TYPE,
    attributes: {},
    children: [],
  };

  return { version: 0, root };
}
