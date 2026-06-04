import { describe, expect, it } from 'vitest';
import { createEmptyDocument } from '../document.js';
import type { BlockNode, BuilderDocument } from '../types.js';
import { validateDocument } from './validate.js';

function node(partial: BlockNode): BlockNode {
  return partial;
}

describe('validateDocument', () => {
  it('accepts an empty document', () => {
    const result = validateDocument(createEmptyDocument());
    expect(result.valid).toBe(true);
    expect(result.issues).toHaveLength(0);
  });

  it('accepts a nested layout with content leaves', () => {
    const doc: BuilderDocument = {
      version: 0,
      root: node({
        id: 'root',
        type: 'niyi/container',
        attributes: {},
        children: [
          node({
            id: 'grid-1',
            type: 'niyi/grid',
            attributes: {},
            children: [
              node({
                id: 'h1',
                type: 'niyi/heading',
                attributes: { level: 1 },
                children: [],
              }),
            ],
          }),
        ],
      }),
    };

    expect(validateDocument(doc).valid).toBe(true);
  });

  it('rejects non-container root', () => {
    const doc: BuilderDocument = {
      version: 0,
      root: node({
        id: 'root',
        type: 'niyi/grid',
        attributes: {},
        children: [],
      }),
    };

    const result = validateDocument(doc);
    expect(result.valid).toBe(false);
    expect(result.issues.some((i) => i.path === 'root.type')).toBe(true);
  });

  it('rejects leaf blocks with children', () => {
    const doc: BuilderDocument = {
      version: 0,
      root: node({
        id: 'root',
        type: 'niyi/container',
        attributes: {},
        children: [
          node({
            id: 'spacer-1',
            type: 'niyi/spacer',
            attributes: {},
            children: [
              node({
                id: 'nested',
                type: 'niyi/text',
                attributes: {},
                children: [],
              }),
            ],
          }),
        ],
      }),
    };

    const result = validateDocument(doc);
    expect(result.valid).toBe(false);
    expect(result.issues.some((i) => i.message.includes('cannot have children'))).toBe(true);
  });

  it('rejects content block as parent', () => {
    const doc: BuilderDocument = {
      version: 0,
      root: node({
        id: 'root',
        type: 'niyi/container',
        attributes: {},
        children: [
          node({
            id: 'text-1',
            type: 'niyi/text',
            attributes: {},
            children: [
              node({
                id: 'btn-1',
                type: 'niyi/button',
                attributes: {},
                children: [],
              }),
            ],
          }),
        ],
      }),
    };

    const result = validateDocument(doc);
    expect(result.valid).toBe(false);
    expect(
      result.issues.some(
        (i) =>
          i.message.includes('cannot have children') || i.message.includes('not allowed inside'),
      ),
    ).toBe(true);
  });

  it('rejects duplicate block ids', () => {
    const doc: BuilderDocument = {
      version: 0,
      root: node({
        id: 'root',
        type: 'niyi/container',
        attributes: {},
        children: [
          node({ id: 'dup', type: 'niyi/spacer', attributes: {}, children: [] }),
          node({ id: 'dup', type: 'niyi/spacer', attributes: {}, children: [] }),
        ],
      }),
    };

    const result = validateDocument(doc);
    expect(result.valid).toBe(false);
    expect(result.issues.some((i) => i.message.includes('Duplicate'))).toBe(true);
  });

  it('rejects unknown block types', () => {
    const doc = {
      version: 0,
      root: {
        id: 'root',
        type: 'niyi/unknown',
        attributes: {},
        children: [],
      },
    };

    const result = validateDocument(doc);
    expect(result.valid).toBe(false);
    expect(result.issues.some((i) => i.path === 'root.type')).toBe(true);
  });
});
