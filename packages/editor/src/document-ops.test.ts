import { createEmptyDocument, type BlockNode } from '@niyi-builder/core';
import { describe, expect, it } from 'vitest';

import { insertChild, reorderSiblings } from './document-ops.js';

function block(id: string, children: BlockNode[] = []): BlockNode {
  return {
    id,
    type: 'core/group',
    attributes: {},
    children,
  };
}

describe('reorderSiblings', () => {
  it('reorders children within the same parent', () => {
    const document = insertChild(
      insertChild(
        insertChild(createEmptyDocument(), 'root', block('a')),
        'root',
        block('b'),
      ),
      'root',
      block('c'),
    );

    const reordered = reorderSiblings(document, 'c', 'a');

    expect(reordered?.root.children.map((child) => child.id)).toEqual(['c', 'a', 'b']);
  });

  it('returns null when blocks are not siblings', () => {
    const document = insertChild(
      insertChild(createEmptyDocument(), 'root', block('parent', [block('child')])),
      'root',
      block('sibling'),
    );

    expect(reorderSiblings(document, 'child', 'sibling')).toBeNull();
  });
});
