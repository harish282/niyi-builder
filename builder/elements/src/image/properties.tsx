import type { FC, ChangeEvent } from 'react';
import type { ElementNode } from '@niyi-builder/core';
import { imageDefaults } from './defaults.js';

interface ImagePropertiesProps {
  node: ElementNode;
  onUpdate: (attributes: Record<string, unknown>) => void;
}

export const ImageProperties: FC<ImagePropertiesProps> = ({ node, onUpdate }) => {
  const url = (node.attributes.url as string) || imageDefaults.url;
  const alt = (node.attributes.alt as string) || imageDefaults.alt;

  const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    onUpdate({ url: e.currentTarget.value });
  };

  const handleAltChange = (e: ChangeEvent<HTMLInputElement>) => {
    onUpdate({ alt: e.currentTarget.value });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold mb-1">Image URL</label>
        <input
          type="text"
          value={url}
          onChange={handleUrlChange}
          className="w-full border rounded px-2 py-1 text-sm"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold mb-1">Alt text</label>
        <input
          type="text"
          value={alt}
          onChange={handleAltChange}
          className="w-full border rounded px-2 py-1 text-sm"
        />
      </div>
    </div>
  );
};
