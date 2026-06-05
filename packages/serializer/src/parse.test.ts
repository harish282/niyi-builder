import { describe, expect, it } from 'vitest';
import { createEmptyDocument } from '@niyi-builder/core';
import { ParseError, UnsupportedMarkupBlockError } from './errors.js';
import { parseFromGutenberg } from './parse.js';
import { serializeToGutenberg } from './serialize.js';
import { loadFixture } from './test-helpers.js';

describe('parseFromGutenberg', () => {
  it('parses an empty group block', () => {
    const doc = parseFromGutenberg('<!-- wp:group /-->');

    expect(doc.version).toBe(0);
    expect(doc.root.type).toBe('core/group');
    expect(doc.root.children).toEqual([]);
    expect(doc.root.attributes).toEqual({});
  });

  it('parses serialized flat fixture markup', () => {
    const original = loadFixture('flat-tree.json');
    const markup = serializeToGutenberg(original);
    const parsed = parseFromGutenberg(markup);

    expect(parsed.root.type).toBe('core/group');
    expect(parsed.root.attributes).toMatchObject({ maxWidth: '1200px' });
    expect(parsed.root.children).toHaveLength(4);
    expect(parsed.root.children[0]?.type).toBe('core/heading');
    expect(parsed.root.children[0]?.attributes).toMatchObject({
      level: 1,
      content: 'Welcome',
    });
    expect(parsed.root.children[3]?.type).toBe('core/spacer');
    expect(parsed.root.children[3]?.attributes).toMatchObject({
      height: { desktop: '32px' },
    });
  });

  it('round-trips serialize output for empty document', () => {
    const empty = createEmptyDocument();
    const parsed = parseFromGutenberg(serializeToGutenberg(empty));

    expect(parsed.root.type).toBe('core/group');
    expect(parsed.root.children).toEqual([]);
  });

  it('throws for empty markup', () => {
    expect(() => parseFromGutenberg('')).toThrow(ParseError);
  });

  it('throws for unsupported core blocks at document root', () => {
    const markup = `<!-- wp:quote -->
<blockquote class="wp-block-quote"><p>Hello</p></blockquote>
<!-- /wp:quote -->`;

    expect(() => parseFromGutenberg(markup)).toThrow(UnsupportedMarkupBlockError);
  });
});
