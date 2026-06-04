import { describe, it } from 'vitest';
import { createEmptyDocument } from '@niyi-builder/core';
import { expectRoundTrip, loadFixture } from './test-helpers.js';

describe('JSON → Gutenberg → JSON round-trip (flat)', () => {
  it('preserves canonical form for empty document', () => {
    expectRoundTrip(createEmptyDocument());
  });

  it('preserves canonical form for flat-tree fixture', () => {
    expectRoundTrip(loadFixture('flat-tree.json'));
  });
});
