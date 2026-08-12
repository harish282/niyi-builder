import { describe, expect, it } from 'vitest';
import { canonicalizeDocument } from './canonicalize.js';
import { expectRoundTrip, getBlockTreeDepth, loadFixture, roundTrip } from './test-helpers.js';

describe('JSON → Gutenberg → JSON round-trip (content in layout)', () => {
  it('preserves nested-layout-and-content fixture', () => {
    const original = loadFixture('nested-layout-and-content.json');
    expect(getBlockTreeDepth(original.root)).toBeGreaterThanOrEqual(3);
    expectRoundTrip(original);
  });

  it('preserves flat-tree fixture (content siblings under root group)', () => {
    expectRoundTrip(loadFixture('flat-tree.json'));
  });

  it('preserves content block types and order inside columns', () => {
    const original = loadFixture('nested-layout-and-content.json');
    const restored = roundTrip(original);

    expect(canonicalizeDocument(restored)).toEqual(canonicalizeDocument(original));

    const heroColumns = restored.root.children[0]?.children[0];
    expect(heroColumns?.type).toBe('core/columns');
    expect(heroColumns?.children.map((child) => child.type)).toEqual([
      'core/column',
      'core/column',
      'core/column',
    ]);
    expect(heroColumns?.children[0]?.children[0]?.type).toBe('core/heading');
    expect(heroColumns?.children[0]?.children[0]?.attributes).toMatchObject({
      level: 1,
      content: 'Ship faster with Gutenberg',
    });
    expect(heroColumns?.children[2]?.children[0]?.type).toBe('core/button');
    expect(heroColumns?.children[2]?.children[0]?.attributes).toMatchObject({
      label: 'Start building',
      url: '/builder',
    });
  });

  it('preserves mixed content blocks inside nested group', () => {
    const restored = roundTrip(loadFixture('nested-layout-and-content.json'));
    const featureCard = restored.root.children[1]?.children[0]?.children[0];

    expect(featureCard?.type).toBe('core/group');
    expect(featureCard?.children.map((child) => child.type)).toEqual([
      'core/html',
      'core/heading',
      'core/paragraph',
      'core/image',
      'core/embed',
    ]);
    expect(featureCard?.children[3]?.attributes).toMatchObject({
      url: 'https://example.com/feature.png',
      alt: 'Feature',
    });
    expect(featureCard?.children[4]?.attributes).toMatchObject({
      provider: 'youtube',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    });
  });
});
