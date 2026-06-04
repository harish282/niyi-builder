import { describe, expect, it } from 'vitest';
import { canonicalizeDocument } from './canonicalize.js';
import { expectRoundTrip, getBlockTreeDepth, loadFixture, roundTrip } from './test-helpers.js';

describe('JSON → Gutenberg → JSON round-trip (content in layout)', () => {
  it('preserves nested-layout-and-content fixture', () => {
    const original = loadFixture('nested-layout-and-content.json');
    expect(getBlockTreeDepth(original.root)).toBeGreaterThanOrEqual(3);
    expectRoundTrip(original);
  });

  it('preserves flat-tree fixture (content siblings under root container)', () => {
    expectRoundTrip(loadFixture('flat-tree.json'));
  });

  it('preserves content block types and order inside grid', () => {
    const original = loadFixture('nested-layout-and-content.json');
    const restored = roundTrip(original);

    expect(canonicalizeDocument(restored)).toEqual(canonicalizeDocument(original));

    const heroGrid = restored.root.children[0]?.children[0];
    expect(heroGrid?.type).toBe('niyi/grid');
    expect(heroGrid?.children.map((child) => child.type)).toEqual([
      'niyi/heading',
      'niyi/text',
      'niyi/button',
    ]);
    expect(heroGrid?.children[0]?.attributes).toMatchObject({
      level: 1,
      content: 'Ship faster with Gutenberg',
    });
    expect(heroGrid?.children[2]?.attributes).toMatchObject({
      label: 'Start building',
      url: '/builder',
      variant: 'primary',
    });
  });

  it('preserves mixed content blocks inside nested container', () => {
    const restored = roundTrip(loadFixture('nested-layout-and-content.json'));
    const featureCard = restored.root.children[1]?.children[0];

    expect(featureCard?.type).toBe('niyi/container');
    expect(featureCard?.children.map((child) => child.type)).toEqual([
      'niyi/icon',
      'niyi/heading',
      'niyi/text',
      'niyi/image',
      'niyi/video',
    ]);
    expect(featureCard?.children[4]?.attributes).toMatchObject({
      provider: 'youtube',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    });
  });
});
