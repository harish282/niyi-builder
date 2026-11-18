import type { ChangeEvent, FC } from 'react';
import type { ElementNode } from '@niyi-builder/core';
import { iconDefaults } from './defaults.js';
import { ICON_LIBRARY, ICON_NAMES } from './icons.js';

interface IconPropertiesProps {
  node: ElementNode;
  onUpdate: (attributes: Record<string, unknown>) => void;
}

export const IconProperties: FC<IconPropertiesProps> = ({ node, onUpdate }) => {
  const name = (node.attributes.name as string) || iconDefaults.name;
  const svg = (node.attributes.svg as string) || ICON_LIBRARY[name] || '';

  const handleNameChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const nextName = e.currentTarget.value;
    onUpdate({ name: nextName, svg: ICON_LIBRARY[nextName] ?? svg });
  };

  const handleSvgChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate({ svg: e.currentTarget.value });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold mb-1">Icon</label>
        <select
          value={name}
          onChange={handleNameChange}
          className="w-full border rounded px-2 py-1 text-sm"
        >
          {ICON_NAMES.map((iconName) => (
            <option key={iconName} value={iconName}>
              {iconName}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-xs font-semibold mb-1">SVG markup</label>
        <textarea
          value={svg}
          onChange={handleSvgChange}
          rows={5}
          className="w-full border rounded px-2 py-1 text-xs font-mono"
        />
      </div>
    </div>
  );
};
