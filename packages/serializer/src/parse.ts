import { parse } from '@wordpress/block-serialization-default-parser';
import type { BlockNode, BuilderDocument } from '@niyi-builder/core';
import {
  createEmptyDocument,
  DOCUMENT_VERSION,
  ROOT_BLOCK_TYPE,
  validateDocument,
} from '@niyi-builder/core';
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
    return createEmptyDocument();
  }

  idCounter = 0;
  const blocks = normalizeTopLevelBlocks(parse(trimmed) as ParsedBlock[]);
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

  const coreBlocks = meaningful.filter((block) => isCoreBlockName(block.blockName));

  if (coreBlocks.length === 0) {
    throw new ParseError('No supported core blocks found in markup.');
  }

  const rootGroup = coreBlocks.find((block) => block.blockName === ROOT_BLOCK_TYPE);

  // Native builder save: one top-level group is the document root.
  if (coreBlocks.length === 1 && rootGroup !== undefined) {
    return rootGroup;
  }

  // Gutenberg default: multiple top-level blocks (or a single non-group block) without a wrapper.
  return {
    blockName: ROOT_BLOCK_TYPE,
    attrs: rootGroup?.attrs ?? null,
    innerBlocks:
      rootGroup !== undefined
        ? [...rootGroup.innerBlocks, ...topLevelBlocksExcept(coreBlocks, rootGroup)]
        : coreBlocks,
    innerHTML: rootGroup?.innerHTML ?? '',
  };
}

function topLevelBlocksExcept(blocks: ParsedBlock[], skip: ParsedBlock): ParsedBlock[] {
  return blocks.filter((block) => block !== skip);
}

/** Promote `core/button` children when Gutenberg wraps them in `core/buttons` at the post root. */
function normalizeTopLevelBlocks(blocks: ParsedBlock[]): ParsedBlock[] {
  const normalized: ParsedBlock[] = [];

  for (const block of blocks) {
    if (block.blockName === 'core/buttons') {
      for (const child of block.innerBlocks) {
        if (child.blockName === 'core/button') {
          normalized.push(child);
        }
      }
      continue;
    }

    normalized.push(block);
  }

  return normalized;
}

/** Gutenberg stores buttons inside `core/buttons`; the builder edits `core/button` directly. */
function flattenParsedChildren(blocks: ParsedBlock[]): ParsedBlock[] {
  const flattened: ParsedBlock[] = [];

  for (const block of blocks) {
    if (block.blockName === 'core/buttons') {
      for (const child of block.innerBlocks) {
        if (child.blockName === 'core/button') {
          flattened.push(child);
        }
      }
      continue;
    }

    flattened.push(block);
  }

  return flattened;
}

function parsedBlockToNode(block: ParsedBlock, path: string): BlockNode {
  const blockName = block.blockName;

  if (blockName === null || !isSerializableBlockType(blockName)) {
    throw new UnsupportedMarkupBlockError(blockName ?? '(empty block)');
  }

  const strategy = BLOCK_MARKUP_STRATEGIES[blockName];
  const rawAttrs = normalizeAttributes(block.attrs);
  let attributes = strategy ? strategy.fromGutenbergAttrs(rawAttrs, block.innerHTML) : rawAttrs;

  const children = flattenParsedChildren(block.innerBlocks).map((child, index) =>
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
