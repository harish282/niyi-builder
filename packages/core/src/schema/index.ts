export {
  BLOCK_NAMESPACE,
  BLOCK_TYPES,
  CONTENT_BLOCK_TYPES,
  DOCUMENT_VERSION,
  FORM_BLOCK_TYPES,
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
  FormBlockType,
  LayoutBlockType,
} from './block-types.js';

export { ALLOWED_CHILDREN, canNest, getAllowedChildTypes } from './nesting.js';

export type {
  ButtonAttributes,
  ContainerAttributes,
  FormAttributes,
  FormFieldAttributes,
  GridAttributes,
  HeadingAttributes,
  IconAttributes,
  ImageAttributes,
  ResponsiveValue,
  SpacerAttributes,
  TextAttributes,
  VideoAttributes,
} from './attributes.js';

export { assertValidDocument, validateDocument } from './validate.js';
export type { ValidationIssue, ValidationResult } from './validate.js';
