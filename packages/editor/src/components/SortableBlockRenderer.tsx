import type { BlockNode } from '@niyi-builder/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { ReactNode } from 'react';

import { BlockRenderer } from './BlockRenderer.js';

interface SortableBlockRendererProps {
  node: BlockNode;
}

export function SortableBlockRenderer({ node }: SortableBlockRendererProps): ReactNode {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: node.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={isDragging ? 'niyi-sortable-block is-dragging' : 'niyi-sortable-block'}
    >
      <BlockRenderer
        node={node}
        isDragging={isDragging}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
}
