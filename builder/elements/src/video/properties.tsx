import type { ChangeEvent, FC } from 'react';
import type { ElementNode } from '@niyi-builder/core';
import { videoDefaults } from './defaults.js';

interface VideoPropertiesProps {
  node: ElementNode;
  onUpdate: (attributes: Record<string, unknown>) => void;
}

export const VideoProperties: FC<VideoPropertiesProps> = ({ node, onUpdate }) => {
  const url = (node.attributes.url as string) || videoDefaults.url;
  const provider = (node.attributes.provider as string) || videoDefaults.provider;
  const caption = (node.attributes.caption as string) || '';

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold mb-1">Video URL</label>
        <input
          type="text"
          value={url}
          placeholder="https://www.youtube.com/watch?v=..."
          onChange={(e: ChangeEvent<HTMLInputElement>) => onUpdate({ url: e.currentTarget.value })}
          className="w-full border rounded px-2 py-1 text-sm"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold mb-1">Provider</label>
        <select
          value={provider}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            onUpdate({ provider: e.currentTarget.value })
          }
          className="w-full border rounded px-2 py-1 text-sm"
        >
          <option value="youtube">YouTube</option>
          <option value="vimeo">Vimeo</option>
          <option value="self">Self-hosted</option>
        </select>
      </div>
      <div>
        <label className="block text-xs font-semibold mb-1">Caption</label>
        <input
          type="text"
          value={caption}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onUpdate({ caption: e.currentTarget.value })
          }
          className="w-full border rounded px-2 py-1 text-sm"
        />
      </div>
    </div>
  );
};
