import { describe, expect, it } from 'vitest';
import { createEmptyDocument, parseFromGutenberg, serializeToGutenberg } from './index.js';

describe('@niyi-builder/serializer', () => {
  it('round-trips an empty document via public API', () => {
    const empty = createEmptyDocument();
    const markup = serializeToGutenberg(empty);
    const parsed = parseFromGutenberg(markup);

    expect(markup).toBe('');
    expect(parsed.version).toBe(empty.version);
    expect(parsed.root.type).toBe(empty.root.type);
    expect(parsed.root.children).toEqual([]);
  });
});
