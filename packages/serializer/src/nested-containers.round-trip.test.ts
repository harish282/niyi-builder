import { describe, expect, it } from 'vitest';
import { canonicalizeDocument } from './canonicalize.js';
import { expectRoundTrip, getBlockTreeDepth, loadFixture, roundTrip } from './test-helpers.js';

describe('JSON → Gutenberg → JSON round-trip (nested containers)', () => {
  it('preserves nested-containers-deep fixture (depth ≥ 4)', () => {
    const original = loadFixture('nested-containers-deep.json');
    expect(getBlockTreeDepth(original.root)).toBeGreaterThanOrEqual(4);
    expectRoundTrip(original);
  });

  it('preserves nested-grid-in-container fixture with sibling columns', () => {
    const original = loadFixture('nested-grid-in-container.json');
    expect(getBlockTreeDepth(original.root)).toBeGreaterThanOrEqual(4);
    expectRoundTrip(original);
  });

  it('preserves child order and attributes at each nesting level', () => {
    const original = loadFixture('nested-containers-deep.json');
    const restored = roundTrip(original);

    expect(canonicalizeDocument(restored)).toEqual(canonicalizeDocument(original));

    const level1 = restored.root.children[0];
    expect(level1?.type).toBe('core/group');
    expect(level1?.attributes).toMatchObject({ background: '#f5f5f5' });

    const level2 = level1?.children[0];
    expect(level2?.type).toBe('core/columns');
    expect(level2?.attributes.gap).toMatchObject({ desktop: '24px' });
    expect(level2?.attributes.columns).toMatchObject({ desktop: 1 });

    const level3 = level2?.children[0];
    expect(level3?.type).toBe('core/column');

    const level4 = level3?.children[0];
    expect(level4?.type).toBe('core/group');

    const level5 = level4?.children[0];
    expect(level5?.type).toBe('core/spacer');
    expect(level5?.attributes.height).toMatchObject({ desktop: '64px' });
  });
});
