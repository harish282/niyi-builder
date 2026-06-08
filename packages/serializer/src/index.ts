import type { BuilderDocument } from '@niyi-builder/core';
import { createEmptyDocument, validateDocument, type ValidationResult } from '@niyi-builder/core';

export {
  SERIALIZABLE_BLOCK_TYPES,
  isCoreBlockName,
  isNiyiBlockName,
  isSerializableBlockType,
} from './block-registry.js';
export { canonicalizeDocument } from './canonicalize.js';
export { isStructuralDocumentRoot, shouldUnwrapDocumentRoot } from './gutenberg-export.js';
export {
  SerializeError,
  ParseError,
  UnsupportedBlockError,
  UnsupportedMarkupBlockError,
} from './errors.js';
export { encodeAttributes, sanitizeAttributes } from './attributes.js';
export { NIYI_ATTR_KEY, readNiyiAttrs, withNiyiAttrs } from './niyi-attrs.js';
export { parseFromGutenberg } from './parse.js';
export type { ParseOptions, ParsedBlock } from './parse.js';
export {
  assertSerializableDocument,
  serializeBlockNode,
  serializeToGutenberg,
} from './serialize.js';
export type { SerializeOptions } from './serialize.js';

export { createEmptyDocument, validateDocument };
export type { BuilderDocument, ValidationResult };
