import React from 'react';
import type { BlockNode } from '@niyi-builder/core';
import type { EditorDevice } from '../store.js';

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