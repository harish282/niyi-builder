import { describe, expect, it } from 'vitest';
import { createEmptyDocument } from '@niyi-builder/core';
import { ParseError } from './errors.js';
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

  it('wraps multiple top-level Gutenberg blocks in a root group', () => {
    const markup = `<!-- wp:paragraph -->
<p>Hello world</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":2} -->
<h2 class="wp-block-heading">Title</h2>
<!-- /wp:heading -->`;

    const doc = parseFromGutenberg(markup);

    expect(doc.root.type).toBe('core/group');
    expect(doc.root.children).toHaveLength(2);
    expect(doc.root.children[0]?.type).toBe('core/paragraph');
    expect(doc.root.children[0]?.attributes).toMatchObject({ content: 'Hello world' });
    expect(doc.root.children[1]?.type).toBe('core/heading');
    expect(doc.root.children[1]?.attributes).toMatchObject({ level: 2, content: 'Title' });
  });

  it('parses empty markup as an empty builder document', () => {
    const doc = parseFromGutenberg('');

    expect(doc.root.type).toBe('core/group');
    expect(doc.root.children).toEqual([]);
  });

  it('round-trips flat Gutenberg blocks without a wrapper group', () => {
    const markup = `<!-- wp:paragraph -->
<p>Hello world</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":2} -->
<h2 class="wp-block-heading">Title</h2>
<!-- /wp:heading -->`;

    const exported = serializeToGutenberg(parseFromGutenberg(markup));

    expect(exported).toContain('<!-- wp:paragraph');
    expect(exported).toContain('<!-- wp:heading');
    expect(exported).not.toContain('<!-- wp:group');
  });

  it('throws when markup has no supported blocks', () => {
    const markup = `<!-- wp:quote -->
<blockquote class="wp-block-quote"><p>Hello</p></blockquote>
<!-- /wp:quote -->`;

    expect(() => parseFromGutenberg(markup)).toThrow(ParseError);
  });
});
