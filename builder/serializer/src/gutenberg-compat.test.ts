import { describe, expect, it } from 'vitest';
import { parseFromGutenberg } from './parse.js';
import { serializeToGutenberg } from './serialize.js';
import { loadFixture } from './test-helpers.js';

describe('Gutenberg-compatible markup', () => {
  it('wraps buttons, emits spacer div, and nests layout blocks in wrapper divs', () => {
    const markup = serializeToGutenberg(loadFixture('flat-tree.json'));

    expect(markup).toContain('<!-- wp:buttons -->');
    expect(markup).toContain('<div class="wp-block-buttons">');
    expect(markup).toContain('<!-- wp:button');
    expect(markup).not.toMatch(/<!-- wp:button[^>]*\/-->/);

    expect(markup).toContain('<!-- wp:spacer');
    expect(markup).toContain('class="wp-block-spacer"');
    expect(markup).not.toMatch(/<!-- wp:spacer[^>]*\/-->/);

    expect(markup).toContain('<div class="wp-block-group">');
    expect(markup).toContain('<!-- wp:heading');
  });

  it('unwraps core/buttons when parsing Gutenberg markup', () => {
    const markup = `<!-- wp:buttons -->
<div class="wp-block-buttons">
<!-- wp:button {"url":"https://example.com","text":"Click me"} -->
<div class="wp-block-button"><a class="wp-block-button__link wp-element-button" href="https://example.com">Click me</a></div>
<!-- /wp:button -->
</div>
<!-- /wp:buttons -->`;

    const doc = parseFromGutenberg(markup);

    expect(doc.root.children).toHaveLength(1);
    expect(doc.root.children[0]?.type).toBe('core/button');
    expect(doc.root.children[0]?.attributes).toMatchObject({
      url: 'https://example.com',
      label: 'Click me',
    });
  });

  it('preserves image src and alt through parse and serialize', () => {
    const gutenbergMarkup = `<!-- wp:image {"id":123,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="https://example.com/wp-content/uploads/photo.jpg" alt="Photo" class="wp-image-123"/></figure>
<!-- /wp:image -->`;

    const exported = serializeToGutenberg(parseFromGutenberg(gutenbergMarkup));

    expect(exported).toContain('src="https://example.com/wp-content/uploads/photo.jpg"');
    expect(exported).toContain('alt="Photo"');
    expect(exported).toContain('"id":123');
    expect(exported).not.toContain('"url"');
    expect(exported).not.toContain('"alt"');
  });

  it('emits image and embed inner HTML instead of self-closing comments', () => {
    const markup = serializeToGutenberg(loadFixture('nested-layout-and-content.json'));

    expect(markup).toContain('<!-- wp:image');
    expect(markup).toContain('<figure class="wp-block-image">');
    expect(markup).not.toMatch(/<!-- wp:image[^>]*\/-->/);

    expect(markup).toContain('<!-- wp:embed');
    expect(markup).toContain('class="wp-block-embed');
    expect(markup).not.toMatch(/<!-- wp:embed[^>]*\/-->/);
  });

  it('emits empty layout blocks with wrapper divs, not self-closing comments', () => {
    const markup = serializeToGutenberg(loadFixture('nested-layout-and-content.json'));

    expect(markup).not.toMatch(/<!-- wp:column[^>]*\/-->/);
    expect(markup).toContain('<div class="wp-block-column">');
  });

  it('round-trips Gutenberg markup with buttons wrapper and layout divs', () => {
    const gutenbergMarkup = `<!-- wp:group {"layout":{"type":"constrained","contentSize":"1200px"}} -->
<div class="wp-block-group">
<!-- wp:paragraph -->
<p>Hello from Gutenberg</p>
<!-- /wp:paragraph -->

<!-- wp:buttons -->
<div class="wp-block-buttons">
<!-- wp:button {"url":"#","text":"Go"} -->
<div class="wp-block-button"><a class="wp-block-button__link wp-element-button" href="#">Go</a></div>
<!-- /wp:button -->
</div>
<!-- /wp:buttons -->
</div>
<!-- /wp:group -->`;

    const exported = serializeToGutenberg(parseFromGutenberg(gutenbergMarkup));

    expect(exported).toContain('<!-- wp:paragraph');
    expect(exported).toContain('<!-- wp:buttons -->');
    expect(exported).toContain('<div class="wp-block-group">');
    expect(exported).toContain('"contentSize":"1200px"');
  });
});
