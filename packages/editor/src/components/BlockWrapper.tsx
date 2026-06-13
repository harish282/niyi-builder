import type { BlockNode } from '@niyi-builder/core';
import type { HTMLAttributes, MouseEvent, ReactNode } from 'react';
import { getBlockDefinition } from '@niyi-builder/blocks';

import { useEditorStore } from '../store.js';

interface BlockWrapperProps {
  node: BlockNode;
  dragHandleProps?: HTMLAttributes<HTMLButtonElement>;
  isDragging?: boolean;
  children: ReactNode; // The actual block's Preview component
}

/**
 * A wrapper component that provides common functionality and styling for all blocks.
 * This acts as a "base element" for block components.
 */
export function BlockWrapper({
  node,
  dragHandleProps,
  isDragging,
  children,
}: BlockWrapperProps): ReactNode {
  const selectedBlockId = useEditorStore((state) => state.selectedBlockId);
  const selectBlock = useEditorStore((state) => state.selectBlock);
  const definition = getBlockDefinition(node.type);
  const isPro = (definition as any)?.isPro ?? false;
  const isSelected = selectedBlockId === node.id;

  const shellClassName = (definition as any)?.isContentBlock
    ? 'wp-block niyi-block-shell'
    : 'niyi-block-shell niyi-block-shell--layout';

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    selectBlock(node.id);
  };

  return (
    <div
      className={shellClassName}
      data-block-id={node.id}
      data-block-type={node.type}
      data-selected={isSelected || undefined}
      data-dragging={isDragging || undefined}
      data-pro={isPro || undefined}
      onClick={handleClick}
    >
      {dragHandleProps && (
        <button
          type="button"
          className="niyi-block-shell__drag-handle"
          aria-label="Drag to reorder"
          {...dragHandleProps}
          onClick={(event) => event.stopPropagation()}
        />
      )}
      {children}
    </div>
  );
}