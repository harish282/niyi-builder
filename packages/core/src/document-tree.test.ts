import { describe, expect, it } from 'vitest';

import { createEmptyDocument } from './document.js';
import { summarizeDocument } from './document-tree.js';

describe('summarizeDocument', () => {
  it('summarizes the document root tree', () => {
    const document = createEmptyDocument();

    expect(summarizeDocument(document)).toEqual({
      id: 'root',
      type: 'core/group',
      childCount: 0,
      children: [],
    });
  });
});
