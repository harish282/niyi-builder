import type { FC, ChangeEvent } from 'react';
import type { ElementNode } from '@niyi-builder/core';
import { buttonDefaults } from './defaults.js';

interface ButtonPropertiesProps {
  node: ElementNode;
  onUpdate: (attributes: Record<string, unknown>) => void;
}

export const ButtonProperties: FC<ButtonPropertiesProps> = ({ node, onUpdate }) => {
  const text = (node.attributes.text as string) || buttonDefaults.text;
  const variant = (node.attributes.variant as string) || buttonDefaults.variant;

  const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    onUpdate({ text: e.currentTarget.value });
  };

  const handleVariantChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onUpdate({ variant: e.currentTarget.value });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold mb-1">Text</label>
        <input
          type="text"
          value={text}
          onChange={handleTextChange}
          className="w-full border rounded px-2 py-1 text-sm"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold mb-1">Variant</label>
        <select
          value={variant}
          onChange={handleVariantChange}
          className="w-full border rounded px-2 py-1 text-sm"
        >
          <option value="primary">Primary</option>
          <option value="secondary">Secondary</option>
        </select>
      </div>
    </div>
  );
};
