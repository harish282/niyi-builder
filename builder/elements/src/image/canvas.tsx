import type { FC } from 'react';
import type { ElementNode } from '@niyi-builder/core';
import { imageDefaults } from './defaults.js';

interface ImageCanvasProps {
  node: ElementNode;
  onSelect: () => void;
}

/**
 * Renders the same markup as Gutenberg's core/image block (<figure> wrapper)
 * so theme + block library styles apply exactly like the native editor canvas.
 */
export const ImageCanvas: FC<ImageCanvasProps> = ({ node, onSelect }) => {
  const url = (node.attributes.url as string) || imageDefaults.url;
  const alt = (node.attributes.alt as string) || imageDefaults.alt;

  return (
    <figure
      className="wp-block-image cursor-pointer"
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      {url ? (
        <img src={url} alt={alt} />
      ) : (
        <div className="flex items-center justify-center min-h-24 bg-gray-100 border border-dashed border-gray-300 text-gray-400 text-sm">
          Image
        </div>
      )}
    </figure>
  );
};
