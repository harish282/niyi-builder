import type { FC } from 'react';
import type { ElementNode } from '@niyi-builder/core';
import { buttonDefaults } from './defaults.js';

interface ButtonCanvasProps {
  node: ElementNode;
  onSelect: () => void;
}

/**
 * Renders the same markup as Gutenberg's core/button block so theme + block
 * library styles apply exactly like the native editor canvas.
 */
export const ButtonCanvas: FC<ButtonCanvasProps> = ({ node, onSelect }) => {
  const text = (node.attributes.text as string) || buttonDefaults.text;
  const variant = (node.attributes.variant as string) || buttonDefaults.variant;

  return (
    <div
      className={`wp-block-button cursor-pointer ${variant === 'secondary' ? 'is-style-outline' : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      <a
        className="wp-block-button__link wp-element-button"
        href="#"
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
