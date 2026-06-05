import { describe, expect, it } from 'vitest';
import { createEmptyDocument } from './document.js';

describe('createEmptyDocument', () => {
  it('returns a v0 document with an empty group root', () => {
    const doc = createEmptyDocument();
    expect(doc.version).toBe(0);
    expect(doc.root.type).toBe('core/group');
    expect(doc.root.children).toEqual([]);
  });
});
