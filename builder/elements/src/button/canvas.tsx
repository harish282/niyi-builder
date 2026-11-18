import type { FC } from 'react';
import type { Breakpoint, ElementNode } from '@niyi-builder/core';
import {
  extractBaseAttributes,
  attributesToInlineStyles,
  attributesToClassName,
} from '@niyi-builder/core';
import { buttonDefaults } from './defaults.js';

interface ButtonCanvasProps {
  node: ElementNode;
  onSelect: () => void;
  device?: Breakpoint;
}

export const ButtonCanvas: FC<ButtonCanvasProps> = ({ node, onSelect, device }) => {
  const text = (node.attributes.text as string) || buttonDefaults.text;
  const variant = (node.attributes.variant as string) || buttonDefaults.variant;
  const base = extractBaseAttributes(node.attributes);
  const style = attributesToInlineStyles(base, { device });
  const className = attributesToClassName(base);

  return (
    <div
      className={`wp-block-button cursor-pointer ${variant === 'secondary' ? 'is-style-outline' : ''}`}
      id={base.htmlId || undefined}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      <a
        className={`wp-block-button__link wp-element-button ${className}`}
        href="#"
        style={style}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        {text}
      </a>
    </div>
  );
};
