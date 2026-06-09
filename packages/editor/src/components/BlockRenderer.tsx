import { getBlockDefinition } from '@niyi-builder/blocks';
import { isContentBlockType, type BlockNode } from '@niyi-builder/core';
import type { MouseEvent, ReactNode } from 'react';

import { useEditorStore } from '../store.js';

interface BlockRendererProps {
  node: BlockNode;
}

export function BlockRenderer({ node }: BlockRendererProps): ReactNode {
  const device = useEditorStore((state) => state.device);
  const selectedBlockId = useEditorStore((state) => state.selectedBlockId);
  const selectBlock = useEditorStore((state) => state.selectBlock);
  const definition = getBlockDefinition(node.type);
  const isSelected = selectedBlockId === node.id;
  const shellClassName = isContentBlockType(node.type)
    ? 'wp-block niyi-block-shell'
    : 'niyi-block-shell niyi-block-shell--layout';

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    selectBlock(node.id);
  };

  if (!definition) {
    return (
      <div
        className="niyi-block-shell niyi-block-shell--layout is-unknown"
        data-block-id={node.id}
        data-block-type={node.type}
        data-selected={isSelected || undefined}
        onClick={handleClick}
      >
        <div className="niyi-preview__placeholder">Unsupported block: {node.type}</div>
      </div>
    );
  }

  const renderChildren = () =>
    node.children.map((child) => <BlockRenderer key={child.id} node={child} />);

  return (
    <div
      className={shellClassName}
      data-block-id={node.id}
      data-block-type={node.type}
      data-selected={isSelected || undefined}
      onClick={handleClick}
    >
      <definition.Preview node={node} device={device} renderChildren={renderChildren} />
    </div>
  );
}
