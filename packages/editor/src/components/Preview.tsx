import React from 'react';
import type { BlockNode } from '@niyi-builder/core';
import { type EditorDevice } from '../store.js';

interface ParagraphPreviewProps {
  node: BlockNode;
  device: EditorDevice;
  renderChildren: () => React.ReactNode;
}

/**
 * Renders the core/paragraph block on the canvas.
 */
export const ParagraphPreview: React.FC<ParagraphPreviewProps> = ({ node, device }) => {
  // In a real implementation, you'd render the paragraph content based on node.attributes
  // and apply device-specific styles.
  return (
    <p style={{ padding: '10px', border: '1px solid #ccc' }}>
      {node.attributes.content as string || 'This is a paragraph block.'} (Device: {device})
    </p>
  );
};

/**
 * Renders the Container (core/group) block on the canvas with dynamic layout logic.
 * Provides an interactive "setup" state for choosing Grid or Flex.
 */
export const ContainerPreview: React.FC<{
  node: BlockNode;
  device: EditorDevice;
  renderChildren: () => React.ReactNode;
}> = ({ node, renderChildren }) => {
  const display = node.attributes.display as string;
  const direction = node.attributes.direction as string || 'row';
  const justify = node.attributes.justify as string || 'start';
  const align = node.attributes.align as string || 'stretch';
  const gap = node.attributes.gap as number || 0;
  const columns = node.attributes.columns as number || 3;

  // Render setup view if layout hasn't been chosen yet
  if (!display) {
    return (
      <div className="p-8 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50/50 flex items-center justify-center">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Select layout in settings</p>
      </div>
    );
  }

  // Apply Tailwind-equivalent dynamic styles
  const containerStyles: React.CSSProperties = {
    display: display === 'grid' ? 'grid' : 'flex',
    gap: `${gap}px`,
    minHeight: '40px',
    width: '100%',
  };

  if (display === 'flex') {
    containerStyles.flexDirection = direction as any;
    containerStyles.justifyContent = justify === 'between' ? 'space-between' : justify === 'around' ? 'space-around' : justify;
    containerStyles.alignItems = align;
    containerStyles.flexWrap = 'wrap';
  } else {
    containerStyles.gridTemplateColumns = `repeat(${columns}, minmax(0, 1fr))`;
  }

  return (
    <div
      style={containerStyles}
      className="niyi-container-preview"
    >
      {renderChildren()}
    </div>
  );
};