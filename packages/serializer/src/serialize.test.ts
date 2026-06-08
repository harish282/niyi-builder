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
  expect(blocks[0]?.blockName).not.toBeNull();

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
  it('serializes an empty document to empty post content for Gutenberg', () => {
    const markup = serializeToGutenberg(createEmptyDocument());
    expect(markup).toBe('');
  });

  it('serializes a flat fixture tree for parse_blocks()', () => {
    const doc = loadFixture('flat-tree.json');
    const markup = serializeToGutenberg(doc);

    expect(markup).toContain('<!-- wp:group');
    expect(markup).toContain('<!-- wp:heading');
    expect(markup).toContain('<!-- wp:paragraph');
    expect(markup).toContain('<!-- wp:button');
    expect(markup).toContain('<!-- wp:spacer');
    expect(markup).toContain('"contentSize":"1200px"');
    expect(markup).not.toContain('"maxWidth"');
    expectParsableMarkup(markup);

    const blocks = parse(markup);
    const group = blocks[0];
    expect(group?.innerBlocks).toHaveLength(4);
    expect(group?.innerBlocks[0]?.blockName).toBe('core/heading');
    expect(group?.innerBlocks[0]?.attrs).toMatchObject({ level: 1 });
    expect(group?.innerBlocks[0]?.innerHTML).toContain('Welcome');
  });

  it('serializes nested layout blocks', () => {
    const doc: BuilderDocument = {
      version: 0,
      root: {
        id: 'root',
        type: 'core/group',
        attributes: {},
        children: [
          {
            id: 'grid-1',
            type: 'core/columns',
            attributes: { gap: { desktop: '16px' } },
            children: [
              {
                id: 'col-1',
                type: 'core/column',
                attributes: {},
                children: [
                  {
                    id: 'cell-heading',
                    type: 'core/heading',
                    attributes: { level: 2, content: 'Cell' },
                    children: [],
                  },
                ],
              },
            ],
          },
        ],
      },
    };

    const markup = serializeToGutenberg(doc);
    expect(markup).toContain('<!-- wp:columns');
    expect(markup).toContain('<!-- /wp:columns -->');
    expectParsableMarkup(markup);

    const blocks = parse(markup);
    expect(blocks[0]?.blockName).toBe('core/columns');
    expect(blocks[0]?.innerBlocks[0]?.blockName).toBe('core/column');
    expect(blocks[0]?.innerBlocks[0]?.innerBlocks[0]?.blockName).toBe('core/heading');
  });

  it('throws SerializeError for invalid documents', () => {
    const invalid = {
      version: 0,
      root: {
        id: 'root',
        type: 'core/heading',
        attributes: {},
        children: [],
      },
    } as BuilderDocument;

    expect(() => serializeToGutenberg(invalid)).toThrow(SerializeError);
  });

  it('escapes dangerous characters in attribute JSON and inner HTML', () => {
    const doc: BuilderDocument = {
      version: 0,
      root: {
        id: 'root',
        type: 'core/group',
        attributes: {},
        children: [
          {
            id: 'text-1',
            type: 'core/paragraph',
            attributes: { content: '<script>alert(1)</script>' },
            children: [],
          },
        ],
      },
    };

    const markup = serializeToGutenberg(doc);
    expect(markup).not.toContain('<script>');
    expect(markup).toContain('&lt;script&gt;');
    expectParsableMarkup(markup);
  });
});
