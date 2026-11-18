import type { CSSProperties, FC } from 'react';
import type { Breakpoint, ElementNode, ResponsiveValue } from '@niyi-builder/core';
import {
  attributesToClassName,
  attributesToInlineStyles,
  extractBaseAttributes,
  resolveResponsiveValue,
} from '@niyi-builder/core';
import { spacerDefaults } from './defaults.js';

interface SpacerCanvasProps {
  node: ElementNode;
  onSelect: () => void;
  isSelected?: boolean;
  device?: Breakpoint;
}

export const SpacerCanvas: FC<SpacerCanvasProps> = ({ node, onSelect, isSelected, device }) => {
  const base = extractBaseAttributes(node.attributes);
  const className = attributesToClassName(base);
  const height =
    resolveResponsiveValue(node.attributes.height as ResponsiveValue<string> | undefined, device) ||
    spacerDefaults.height;

  const style: CSSProperties = {
    ...attributesToInlineStyles(base, { device }),
    height,
    backgroundColor: isSelected ? 'rgba(34, 113, 177, 0.08)' : 'transparent',
    border: isSelected ? '1px dashed #2271b1' : '1px dashed #dcdcde',
  };

  return (
    <div
      className={`wp-block-spacer cursor-pointer ${className}`}
      style={style}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    />
  );
};
