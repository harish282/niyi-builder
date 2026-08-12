import type { FC } from 'react';
import type { ElementNode } from '@niyi-builder/core';
import { imageDefaults } from './defaults.js';

interface ImageCanvasProps {
  node: ElementNode;
  onSelect: () => void;
}

export const ImageCanvas: FC<ImageCanvasProps> = ({ node, onSelect }) => {
  const url = (node.attributes.url as string) || imageDefaults.url;
  const alt = (node.attributes.alt as string) || imageDefaults.alt;

  return (
    <div
      className="wp-block-image cursor-pointer hover:outline hover:outline-1 hover:outline-blue-500"
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      {url ? (
        <img src={url} alt={alt} className="max-w-full h-auto" />
      ) : (
        <div className="flex items-center justify-center h-24 bg-gray-100 border border-dashed border-gray-300 text-gray-400 text-sm">
          Image
        </div>
      )}
    </div>
  );
};
