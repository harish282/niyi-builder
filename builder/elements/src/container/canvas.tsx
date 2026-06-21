import type { FC, CSSProperties } from 'react';
import type { ElementNode } from '@niyi-builder/core';
import { containerDefaults } from './defaults.js';

interface ContainerCanvasProps {
  node: ElementNode;
  onSelect: () => void;
}

export const ContainerCanvas: FC<ContainerCanvasProps> = ({ node, onSelect }) => {
  const layout = (node.attributes.layout as Record<string, string>) || containerDefaults.layout;

  const containerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: layout.direction === 'column' ? 'column' : 'row',
    gap: layout.gap === 'none' ? '0px' : layout.gap === 'sm' ? '8px' : layout.gap === 'lg' ? '24px' : '16px',
    padding: '8px',
    border: '1px dashed #ccc',
    minHeight: '60px',
  };

  if (layout.justify) {
    const justifyMap: Record<string, string> = {
      start: 'flex-start',
      center: 'center',
      end: 'flex-end',
      between: 'space-between',
    };
    containerStyle.justifyContent = justifyMap[layout.justify] || 'flex-start';
  }

  if (layout.align) {
    const alignMap: Record<string, string> = {
      start: 'flex-start',
      center: 'center',
      end: 'flex-end',
    };
    containerStyle.alignItems = alignMap[layout.align] || 'flex-start';
  }

  return (
    <div
      className="niyi-container cursor-pointer"
      style={containerStyle}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    />
  );
};
