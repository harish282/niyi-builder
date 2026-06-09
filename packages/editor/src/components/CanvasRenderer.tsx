import React from 'react';
import { BlockNode } from '@niyi-builder/core';
import { getBlockDefinition } from '@niyi-builder/blocks';
import { useEditorStore } from '../store.js';

interface CanvasRendererProps {
  node: BlockNode;
}

/**
 * Recursive renderer for the Builder JSON tree.
 * Maps JSON nodes to React components via the Block Registry.
 */
export const CanvasRenderer: React.FC<CanvasRendererProps> = ({ node }) => {
  const definition = getBlockDefinition(node.type);
  const selectedBlockId = useEditorStore((state) => state.selectedBlockId);
  const device = useEditorStore((state) => state.device);
  const selectBlock = useEditorStore((state) => state.selectBlock);

  if (!definition) {
    return (
      <div style={{ padding: '20px', border: '2px dashed #f56e28', color: '#d94f1a', margin: '10px 0' }}>
        Unknown block type: {node.type}
      </div>
    );
  }

  const isSelected = selectedBlockId === node.id;
  const Preview = definition.Preview;

  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectBlock(node.id);
  };

  return (
    <div
      onClick={handleSelect}
      className={`niyi-canvas-node ${isSelected ? 'is-selected' : ''}`}
      style={{
        outline: isSelected ? '2px solid #2271b1' : 'none',
        outlineOffset: '-2px',
        cursor: 'default',
      }}
    >
      <Preview
        node={node}
        device={device}
        renderChildren={() => node.children.map((child) => (
          <CanvasRenderer key={child.id} node={child} />
        ))}
      />
    </div>
  );
};