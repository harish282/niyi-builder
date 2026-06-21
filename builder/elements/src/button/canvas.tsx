import type { FC } from 'react';
import type { ElementNode } from '@niyi-builder/core';
import { buttonDefaults } from './defaults.js';

interface ButtonCanvasProps {
  node: ElementNode;
  onSelect: () => void;
}

const variantClasses: Record<string, string> = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700',
  secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
};

export const ButtonCanvas: FC<ButtonCanvasProps> = ({ node, onSelect }) => {
  const text = (node.attributes.text as string) || buttonDefaults.text;
  const variant = (node.attributes.variant as string) || buttonDefaults.variant;
  const className = variantClasses[variant] || variantClasses.primary;

  return (
    <button
      type="button"
      className={`niyi-button px-4 py-2 rounded text-sm font-medium cursor-pointer ${className}`}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      {text}
    </button>
  );
};
