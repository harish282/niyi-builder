import { getBlockDefinition } from '@niyi-builder/blocks';
import type { BlockNode } from '@niyi-builder/core';
import type { HTMLAttributes, ReactNode } from 'react';

import { useEditorStore } from '../store.js';
import { BlockList } from './BlockList.js';
import { BlockWrapper } from './BlockWrapper.js';

interface BlockRendererProps {
  node: BlockNode;
  dragHandleProps?: HTMLAttributes<HTMLButtonElement>;
  isDragging?: boolean;
}

export function BlockRenderer({
  node,
  dragHandleProps,
  isDragging,
}: BlockRendererProps): ReactNode {
  const device = useEditorStore((state) => state.device); // Still needed for Preview component
  const definition = getBlockDefinition(node.type);

  const renderChildren = () => <BlockList parentId={node.id} blocks={node.children} />;


  if (!definition) {
    return (
      <div
        className="niyi-block-shell niyi-block-shell--layout is-unknown"
        data-block-id={node.id}
        data-block-type={node.type}
      >
        <div className="niyi-preview__placeholder">Unsupported block: {node.type}</div>
      </div>
    );
  }

  return (
    <BlockWrapper node={node} dragHandleProps={dragHandleProps} isDragging={isDragging}>
      {/* The drag handle is now rendered by BlockWrapper */}
      {/* {dragHandleProps ? (
        <button
          type="button"
          className="niyi-block-shell__drag-handle"
          aria-label="Drag to reorder"
          {...dragHandleProps}
          onClick={(event) => event.stopPropagation()}
        />
      ) : null}
      */}
      <definition.Preview node={node} device={device} renderChildren={renderChildren} />
    </BlockWrapper>
  );
}
