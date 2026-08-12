import type { FC, ChangeEvent } from 'react';
import type { ElementNode } from '@niyi-builder/core';
import { paragraphDefaults } from './defaults.js';

interface ParagraphPropertiesProps {
  node: ElementNode;
  onUpdate: (attributes: Record<string, unknown>) => void;
}

export const ParagraphProperties: FC<ParagraphPropertiesProps> = ({ node, onUpdate }) => {
  const content = (node.attributes.content as string) || paragraphDefaults.content;

  const handleContentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate({ content: e.currentTarget.value });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold mb-1">Content</label>
        <textarea
          value={content}
          onChange={handleContentChange}
          rows={4}
          className="w-full border rounded px-2 py-1 text-sm"
        />
      </div>
    </div>
  );
};
