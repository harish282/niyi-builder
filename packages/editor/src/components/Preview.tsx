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
export const ParagraphPreview: React.FC<ParagraphPreviewProps> = ({ node }) => {
  // In a real implementation, you'd render the paragraph content based on node.attributes
  // and apply device-specific styles.
  return (
    <p
      className="p-3 border border-gray-100 rounded text-gray-700 bg-white"
    >
      {node.attributes.content as string || 'This is a paragraph block.'}
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
  const layoutType = node.attributes.layoutType as string;
  const direction = node.attributes.direction as string || 'horizontal';
  const wrap = node.attributes.wrap ?? true;
  const columns = node.attributes.columns as number || 2;
  const gapSize = node.attributes.gapSize as string || 'medium';

  // Render placeholder if layout hasn't been chosen yet
  if (!layoutType) {
    return (
      <div className="p-8 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50/50 flex items-center justify-center">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Select layout in sidebar</p>
      </div>
    );
  }

  // Map structured attributes to internal Tailwind-compatible layout classes
  const classes = [];

  // Tailwind Mapping Objects (Ensures JIT compiler finds the strings)
  const directions: Record<string, string> = { horizontal: 'flex-row', vertical: 'flex-col' };
  const gridCols: Record<number, string> = { 1: 'grid-cols-1', 2: 'grid-cols-2', 3: 'grid-cols-3', 4: 'grid-cols-4', 6: 'grid-cols-6', 12: 'grid-cols-12' };
  const gaps: Record<string, string> = { small: 'gap-2', medium: 'gap-4', large: 'gap-8' };

  if (layoutType === 'flex') {
    classes.push('flex');
    classes.push(directions[direction] || 'flex-row');
    if (wrap) classes.push('flex-wrap');
    else classes.push('flex-nowrap');
  } else if (layoutType === 'grid') {
    classes.push('grid');
    classes.push(gridCols[columns] || 'grid-cols-2');
  }

  classes.push(gaps[gapSize] || 'gap-4');

  return (
    <div
      className={`niyi-container-preview min-h-[40px] w-full ${classes.join(' ')}`}
    >
      {renderChildren()}
    </div>
  );
};