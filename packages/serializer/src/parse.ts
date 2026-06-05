import { parse } from '@wordpress/block-serialization-default-parser';
import type { BlockNode, BuilderDocument } from '@niyi-builder/core';
import { DOCUMENT_VERSION, ROOT_BLOCK_TYPE, validateDocument } from '@niyi-builder/core';
import { BLOCK_MARKUP_STRATEGIES } from './block-markup.js';
import { isCoreBlockName, isSerializableBlockType } from './block-registry.js';
import { ParseError, UnsupportedMarkupBlockError } from './errors.js';

export interface ParsedBlock {
  blockName: string | null;
  attrs: Record<string, unknown> | null;
  innerBlocks: ParsedBlock[];
  innerHTML: string;
}

export interface ParseOptions {
  /** Validate the parsed document against schema v0 (default: true). */
  validate?: boolean;
}

let idCounter = 0;

export function parseFromGutenberg(markup: string, options: ParseOptions = {}): BuilderDocument {
  const trimmed = markup.trim();

  if (trimmed.length === 0) {
    throw new ParseError('Cannot parse empty Gutenberg markup.');
  }

  idCounter = 0;
  const blocks = parse(trimmed) as ParsedBlock[];
  const rootBlock = extractRootBlock(blocks);
  const root = parsedBlockToNode(rootBlock, 'root');

  if (root.type !== ROOT_BLOCK_TYPE) {
    throw new ParseError(`Document root must be ${ROOT_BLOCK_TYPE}, received "${root.type}".`);
  }

  const document: BuilderDocument = {
    version: DOCUMENT_VERSION,
    root,
  };

  const shouldValidate = options.validate ?? true;
  if (shouldValidate) {
    const result = validateDocument(document);
    if (!result.valid) {
      throw new ParseError(
        `Parsed markup does not match layout schema v0: ${result.issues
          .map((issue) => `${issue.path}: ${issue.message}`)
          .join('; ')}`,
      );
    }
  }

  return document;
}

function extractRootBlock(blocks: ParsedBlock[]): ParsedBlock {
  const meaningful = blocks.filter(
    (block) => block.blockName !== null || block.innerHTML.trim().length > 0,
  );

  for (const block of meaningful) {
    if (block.blockName !== null && !isCoreBlockName(block.blockName)) {
      throw new UnsupportedMarkupBlockError(block.blockName);
    }
  }

  const coreBlocks = meaningful.filter((block) => isCoreBlockName(block.blockName));

  if (coreBlocks.length === 0) {
    throw new ParseError('No supported core blocks found in markup.');
  }

  if (coreBlocks.length > 1) {
    throw new ParseError(
      `Expected a single root ${ROOT_BLOCK_TYPE} block; found multiple top-level core blocks.`,
    );
  }

  return coreBlocks[0];
}

function parsedBlockToNode(block: ParsedBlock, path: string): BlockNode {
  const blockName = block.blockName;

  if (blockName === null || !isSerializableBlockType(blockName)) {
    throw new UnsupportedMarkupBlockError(blockName ?? '(empty block)');
  }

  const strategy = BLOCK_MARKUP_STRATEGIES[blockName];
  const rawAttrs = normalizeAttributes(block.attrs);
  let attributes = strategy ? strategy.fromGutenbergAttrs(rawAttrs, block.innerHTML) : rawAttrs;

  const children = block.innerBlocks.map((child, index) =>
    parsedBlockToNode(child, `${path}.children[${index}]`),
  );

  if (blockName === 'core/columns' && children.length > 0 && attributes.columns === undefined) {
    attributes = {
      ...attributes,
      columns: { desktop: children.length },
    };
  }

  return {
    id: createBlockId(path),
    type: blockName,
    attributes,
    children,
  };
}

function normalizeAttributes(attrs: Record<string, unknown> | null): Record<string, unknown> {
  if (attrs === null || typeof attrs !== 'object' || Array.isArray(attrs)) {
    return {};
  }

  return { ...attrs };
}

function createBlockId(path: string): string {
  idCounter += 1;
  const slug = path.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '');
  return slug.length > 0 ? `${slug}-${idCounter}` : `block-${idCounter}`;
}
