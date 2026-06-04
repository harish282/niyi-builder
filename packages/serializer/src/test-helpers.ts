import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { expect } from 'vitest';
import type { BlockNode, BuilderDocument } from '@niyi-builder/core';
import { canonicalizeDocument } from './canonicalize.js';
import { parseFromGutenberg } from './parse.js';
import { serializeToGutenberg } from './serialize.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
export const fixturesDir = join(__dirname, '../__tests__/fixtures');

export function loadFixture(name: string): BuilderDocument {
  const raw = readFileSync(join(fixturesDir, name), 'utf8');
  return JSON.parse(raw) as BuilderDocument;
}

export function roundTrip(document: BuilderDocument): BuilderDocument {
  return parseFromGutenberg(serializeToGutenberg(document));
}

/** Assert JSON → Gutenberg → JSON preserves canonical form; Vitest prints a diff on failure. */
export function expectRoundTrip(original: BuilderDocument): void {
  const restored = roundTrip(original);
  expect(canonicalizeDocument(restored)).toEqual(canonicalizeDocument(original));
}

/** Maximum nesting depth of the block tree (root = 1). */
export function getBlockTreeDepth(node: BlockNode): number {
  if (node.children.length === 0) {
    return 1;
  }

  return 1 + Math.max(...node.children.map((child) => getBlockTreeDepth(child)));
}
