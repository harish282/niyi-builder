import type { BlockNode, BuilderDocument } from '@niyi-builder/core';
import {
  assertValidDocument,
  isBlockType,
  isLeafBlockType,
  validateDocument,
} from '@niyi-builder/core';
import { encodeAttributes } from './attributes.js';
import { isSerializableBlockType, SERIALIZABLE_BLOCK_TYPES } from './block-registry.js';
import { SerializeError, UnsupportedBlockError } from './errors.js';

export interface SerializeOptions {
  /** Validate the document before serializing (default: true). */
  validate?: boolean;
}

export function serializeToGutenberg(
  document: BuilderDocument,
  options: SerializeOptions = {},
): string {
  const shouldValidate = options.validate ?? true;

  if (shouldValidate) {
    const result = validateDocument(document);
    if (!result.valid) {
      throw new SerializeError('Cannot serialize invalid builder document.', result.issues);
    }
  }

  return serializeBlockNode(document.root, 'root').trim();
}

export function serializeBlockNode(node: BlockNode, path = 'root'): string {
  if (!isBlockType(node.type)) {
    throw new UnsupportedBlockError(node.type, path);
  }

  if (!SERIALIZABLE_BLOCK_TYPES.has(node.type)) {
    throw new UnsupportedBlockError(node.type, path);
  }

  const blockName = node.type;
  const attrs = encodeAttributes(node.attributes);

  if (isLeafBlockType(blockName)) {
    return `<!-- wp:${blockName}${attrs} /-->`;
  }

  const inner = node.children
    .map((child, index) => serializeBlockNode(child, `${path}.children[${index}]`))
    .join('\n\n');

  if (inner.length === 0) {
    return `<!-- wp:${blockName}${attrs} /-->`;
  }

  return `<!-- wp:${blockName}${attrs} -->\n${inner}\n<!-- /wp:${blockName} -->`;
}

/** @internal Exported for tests and future deserialize parity checks. */
export function assertSerializableDocument(document: BuilderDocument): void {
  assertValidDocument(document);
}

export { isSerializableBlockType, SERIALIZABLE_BLOCK_TYPES };
