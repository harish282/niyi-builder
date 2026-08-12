import type { FC } from 'react';
import type { ElementNode } from '@niyi-builder/core';
import { paragraphDefaults } from './defaults.js';

interface ParagraphCanvasProps {
  node: ElementNode;
  onSelect: () => void;
}

export const ParagraphCanvas: FC<ParagraphCanvasProps> = ({ node, onSelect }) => {
  const content = (node.attributes.content as string) || paragraphDefaults.content;

  return (
    <p
      className="wp-block-paragraph cursor-pointer hover:outline hover:outline-1 hover:outline-blue-500"
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      {content}
    </p>
  );
};
