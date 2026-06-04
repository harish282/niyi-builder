import { describe, expect, it } from 'vitest';
import { parse } from '@wordpress/block-serialization-default-parser';
import type { BuilderDocument } from '@niyi-builder/core';
import { createEmptyDocument } from '@niyi-builder/core';
import { SerializeError } from './errors.js';
import { serializeToGutenberg } from './serialize.js';
import { loadFixture } from './test-helpers.js';

function expectParsableMarkup(markup: string): void {
  expect(markup.length).toBeGreaterThan(0);
  const blocks = parse(markup);
  expect(blocks.length).toBeGreaterThan(0);
  expect(blocks[0]?.blockName).toBe('niyi/container');

  const walk = (nodes: ReturnType<typeof parse>): void => {
    for (const node of nodes) {
      if (node.blockName === null && node.innerHTML.trim() === '') {
        continue;
      }
      expect(node.blockName).not.toBeNull();
      if (node.innerBlocks.length > 0) {
        walk(node.innerBlocks);
      }
    }
  };

  walk(blocks);
}

describe('serializeToGutenberg', () => {
  it('serializes an empty document to a root container block', () => {
    const markup = serializeToGutenberg(createEmptyDocument());
    expect(markup).toBe('<!-- wp:niyi/container /-->');
    expectParsableMarkup(markup);
  });

  it('serializes a flat fixture tree for parse_blocks()', () => {
    const doc = loadFixture('flat-tree.json');
    const markup = serializeToGutenberg(doc);

    expect(markup).toContain('<!-- wp:niyi/container');
    expect(markup).toContain('<!-- wp:niyi/heading');
    expect(markup).toContain('<!-- wp:niyi/text');
    expect(markup).toContain('<!-- wp:niyi/button');
    expect(markup).toContain('<!-- wp:niyi/spacer');
    expect(markup).toContain('"maxWidth":"1200px"');
    expect(markup).toContain('"content":"Welcome"');
    expectParsableMarkup(markup);

    const blocks = parse(markup);
    const container = blocks[0];
    expect(container?.innerBlocks).toHaveLength(4);
    expect(container?.innerBlocks[0]?.blockName).toBe('niyi/heading');
    expect(container?.innerBlocks[0]?.attrs).toMatchObject({ level: 1, content: 'Welcome' });
  });

  it('serializes nested layout blocks', () => {
    const doc: BuilderDocument = {
      version: 0,
      root: {
        id: 'root',
        type: 'niyi/container',
        attributes: {},
        children: [
          {
            id: 'grid-1',
            type: 'niyi/grid',
            attributes: { columns: { desktop: 2 } },
            children: [
              {
                id: 'cell-heading',
                type: 'niyi/heading',
                attributes: { level: 2, content: 'Cell' },
                children: [],
              },
            ],
          },
        ],
      },
    };

    const markup = serializeToGutenberg(doc);
    expect(markup).toContain('<!-- wp:niyi/grid');
    expect(markup).toContain('<!-- /wp:niyi/grid -->');
    expectParsableMarkup(markup);

    const blocks = parse(markup);
    expect(blocks[0]?.innerBlocks[0]?.blockName).toBe('niyi/grid');
    expect(blocks[0]?.innerBlocks[0]?.innerBlocks[0]?.blockName).toBe('niyi/heading');
  });

  it('throws SerializeError for invalid documents', () => {
    const invalid = {
      version: 0,
      root: {
        id: 'root',
        type: 'niyi/heading',
        attributes: {},
        children: [],
      },
    } as BuilderDocument;

    expect(() => serializeToGutenberg(invalid)).toThrow(SerializeError);
  });

  it('escapes dangerous characters in attribute JSON', () => {
    const doc: BuilderDocument = {
      version: 0,
      root: {
        id: 'root',
        type: 'niyi/container',
        attributes: {},
        children: [
          {
            id: 'text-1',
            type: 'niyi/text',
            attributes: { content: '<script>alert(1)</script>' },
            children: [],
          },
        ],
      },
    };

    const markup = serializeToGutenberg(doc);
    expect(markup).not.toContain('<script>');
    expect(markup).toContain('\\u003c');
    expectParsableMarkup(markup);
  });
});
