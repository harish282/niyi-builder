import type { BlockNode, BuilderDocument, BlockType } from '@niyi-builder/core';
import { assertValidDocument, isBlockType, validateDocument } from '@niyi-builder/core';
import { encodeAttributes } from './attributes.js';
import { BLOCK_MARKUP_STRATEGIES } from './block-markup.js';
import { isSerializableBlockType, SERIALIZABLE_BLOCK_TYPES } from './block-registry.js';
import { SerializeError, UnsupportedBlockError } from './errors.js';
import { shouldUnwrapDocumentRoot } from './gutenberg-export.js';

/** Layout blocks whose inner blocks must live inside a wrapper div for Gutenberg validation. */
const INNER_BLOCKS_WRAPPER_CLASS: Partial<Record<BlockType, string>> = {
  'core/group': 'wp-block-group',
  'core/columns': 'wp-block-columns',
  'core/column': 'wp-block-column',
};

function wrapInnerBlocks(className: string, innerBlocks: string): string {
  return `<div class="${className}">\n${innerBlocks}\n</div>`;
}

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

  if (shouldUnwrapDocumentRoot(document)) {
    if (document.root.children.length === 0) {
      return '';
    }

    return document.root.children
      .map((child, index) => serializeBlockNode(child, `root.children[${index}]`))
      .join('\n\n')
      .trim();
  }

  return serializeBlockNode(document.root, 'root').trim();
}

export function serializeBlockNode(node: BlockNode, path = 'root'): string {
  const markup = serializeBlockMarkup(node, path);

  // Gutenberg requires core/button inside core/buttons — wrap on export only.
  if (node.type === 'core/button') {
    return `<!-- wp:buttons -->\n<div class="wp-block-buttons">\n${markup}\n</div>\n<!-- /wp:buttons -->`;
  }

  return markup;
}

function serializeBlockMarkup(node: BlockNode, path = 'root'): string {
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
  const wrapperClass = INNER_BLOCKS_WRAPPER_CLASS[node.type];
  const hasInnerContent = (innerHtml?.length ?? 0) > 0 || innerBlocks.length > 0;

  if (!hasInnerContent) {
    // Layout blocks always need a wrapper div — Gutenberg rejects self-closing column/group markup.
    if (wrapperClass) {
      return `<!-- wp:${blockName}${attrs} -->\n<div class="${wrapperClass}"></div>\n<!-- /wp:${blockName} -->`;
    }
    return `<!-- wp:${blockName}${attrs} /-->`;
  }

  let body: string;
  if (wrapperClass && innerBlocks.length > 0) {
    body = wrapInnerBlocks(wrapperClass, innerBlocks);
  } else {
    body = [innerHtml, innerBlocks].filter((part) => part && part.length > 0).join('\n\n');
  }

  return `<!-- wp:${blockName}${attrs} -->\n${body}\n<!-- /wp:${blockName} -->`;
}

/** @internal Exported for tests and future deserialize parity checks. */
export function assertSerializableDocument(document: BuilderDocument): void {
  assertValidDocument(document);
}

export { isSerializableBlockType, SERIALIZABLE_BLOCK_TYPES };
