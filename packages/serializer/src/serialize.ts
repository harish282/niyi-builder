import type { BlockNode, BuilderDocument, BlockType } from '@niyi-builder/core';
import { assertValidDocument, isBlockType, validateDocument } from '@niyi-builder/core';
import { encodeAttributes } from './attributes.js';
import { BLOCK_MARKUP_STRATEGIES } from './block-markup.js';
import { isSerializableBlockType, SERIALIZABLE_BLOCK_TYPES } from './block-registry.js';
import { SerializeError, UnsupportedBlockError } from './errors.js';

/** Gutenberg saves core blocks as `wp:paragraph`, not `wp:core/paragraph`. */
export function toBlockCommentName(blockType: BlockType): string {
  return blockType.startsWith('core/') ? blockType.slice('core/'.length) : blockType;
}

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

  const strategy = BLOCK_MARKUP_STRATEGIES[node.type];
  if (!strategy) {
    throw new UnsupportedBlockError(node.type, path);
  }

  const blockName = toBlockCommentName(node.type);
  const gutenbergAttrs = strategy.toGutenbergAttrs(node.attributes);
  const attrs = encodeAttributes(gutenbergAttrs);

  if (strategy.selfClosing) {
    return `<!-- wp:${blockName}${attrs} /-->`;
  }

  const innerBlocks = node.children
    .map((child, index) => serializeBlockNode(child, `${path}.children[${index}]`))
    .join('\n\n');

  const innerHtml = strategy.innerHtml?.(node.attributes);
  const hasInnerContent = (innerHtml?.length ?? 0) > 0 || innerBlocks.length > 0;

  if (!hasInnerContent) {
    return `<!-- wp:${blockName}${attrs} /-->`;
  }

  const body = [innerHtml, innerBlocks].filter((part) => part && part.length > 0).join('\n\n');

  return `<!-- wp:${blockName}${attrs} -->\n${body}\n<!-- /wp:${blockName} -->`;
}

/** @internal Exported for tests and future deserialize parity checks. */
export function assertSerializableDocument(document: BuilderDocument): void {
  assertValidDocument(document);
}

export { isSerializableBlockType, SERIALIZABLE_BLOCK_TYPES };
