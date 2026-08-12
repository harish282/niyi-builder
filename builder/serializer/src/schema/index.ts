export {
  BLOCK_NAMESPACE,
  BLOCK_TYPES,
  CONTENT_BLOCK_TYPES,
  DOCUMENT_VERSION,
  LAYOUT_BLOCK_TYPES,
  LEAF_BLOCK_TYPES,
  ROOT_BLOCK_TYPE,
  isBlockType,
  isContentBlockType,
  isLayoutBlockType,
  isLeafBlockType,
} from './block-types.js';
export type {
  BlockType,
  ContentBlockType,
  DocumentVersion,
  LayoutBlockType,
} from './block-types.js';

export { ALLOWED_CHILDREN, canNest, getAllowedChildTypes } from './nesting.js';

export { createEmptyDocument } from './document.js';
export type { BlockNode, BuilderDocument } from './document.js';

export { assertValidDocument, validateDocument } from './validate.js';
export type { ValidationIssue, ValidationResult } from './validate.js';
