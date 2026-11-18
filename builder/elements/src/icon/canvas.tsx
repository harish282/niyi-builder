import type { FC } from 'react';
import type { Breakpoint, ElementNode } from '@niyi-builder/core';
import {
  attributesToClassName,
  attributesToInlineStyles,
  extractBaseAttributes,
} from '@niyi-builder/core';
import { iconDefaults } from './defaults.js';
import { ICON_LIBRARY } from './icons.js';

interface IconCanvasProps {
  node: ElementNode;
  onSelect: () => void;
  isSelected?: boolean;
  device?: Breakpoint;
}

export const IconCanvas: FC<IconCanvasProps> = ({ node, onSelect, isSelected, device }) => {
  const base = extractBaseAttributes(node.attributes);
  const className = attributesToClassName(base);
  const name = (node.attributes.name as string) || iconDefaults.name;
  const svg =
    (node.attributes.svg as string) || ICON_LIBRARY[name] || ICON_LIBRARY[iconDefaults.name];

  return (
    <div
      className={`niyi-icon cursor-pointer inline-flex items-center justify-center ${className}`}
      style={{
        ...attributesToInlineStyles(base, { device }),
        fontSize: '1.5em',
        outline: isSelected ? '1px dashed #2271b1' : undefined,
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
};
