import type { BlockNode } from '@niyi-builder/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { ReactNode } from 'react';

import { SortableBlockRenderer } from './SortableBlockRenderer.js';

interface BlockListProps {
  parentId: string;
  blocks: BlockNode[];
}

export function BlockList({ parentId, blocks }: BlockListProps): ReactNode {
  if (blocks.length === 0) {
    return null;
  }

  const itemIds = blocks.map((block) => block.id);

  return (
    <SortableContext id={parentId} items={itemIds} strategy={verticalListSortingStrategy}>
      {blocks.map((block) => (
        <SortableBlockRenderer key={block.id} node={block} />
      ))}
    </SortableContext>
  );
}
