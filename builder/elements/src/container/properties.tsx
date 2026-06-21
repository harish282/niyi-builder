import type { FC, ChangeEvent } from 'react';
import type { ElementNode } from '@niyi-builder/core';
import { containerDefaults } from './defaults.js';

interface ContainerPropertiesProps {
  node: ElementNode;
  onUpdate: (attributes: Record<string, unknown>) => void;
}

export const ContainerProperties: FC<ContainerPropertiesProps> = ({ node, onUpdate }) => {
  const layout = (node.attributes.layout as Record<string, string>) || containerDefaults.layout;

  const handleTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onUpdate({ layout: { ...layout, type: e.currentTarget.value } });
  };

  const handleDirectionChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onUpdate({ layout: { ...layout, direction: e.currentTarget.value } });
  };

  const handleGapChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onUpdate({ layout: { ...layout, gap: e.currentTarget.value } });
  };

  const handleJustifyChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onUpdate({ layout: { ...layout, justify: e.currentTarget.value } });
  };

  const handleAlignChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onUpdate({ layout: { ...layout, align: e.currentTarget.value } });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold mb-1">Layout Type</label>
        <select
          value={layout.type}
          onChange={handleTypeChange}
          className="w-full border rounded px-2 py-1 text-sm"
        >
          <option value="flex">Flex</option>
          <option value="grid">Grid</option>
        </select>
      </div>
      {layout.type === 'flex' && (
        <div>
          <label className="block text-xs font-semibold mb-1">Direction</label>
          <select
            value={layout.direction}
            onChange={handleDirectionChange}
            className="w-full border rounded px-2 py-1 text-sm"
          >
            <option value="row">Row</option>
            <option value="column">Column</option>
          </select>
        </div>
      )}
      <div>
        <label className="block text-xs font-semibold mb-1">Gap</label>
        <select
          value={layout.gap}
          onChange={handleGapChange}
          className="w-full border rounded px-2 py-1 text-sm"
        >
          <option value="none">None</option>
          <option value="sm">Small</option>
          <option value="md">Medium</option>
          <option value="lg">Large</option>
        </select>
      </div>
      {layout.type === 'flex' && (
        <>
          <div>
            <label className="block text-xs font-semibold mb-1">Justify</label>
            <select
              value={layout.justify}
              onChange={handleJustifyChange}
              className="w-full border rounded px-2 py-1 text-sm"
            >
              <option value="start">Start</option>
              <option value="center">Center</option>
              <option value="end">End</option>
              <option value="between">Between</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Align</label>
            <select
              value={layout.align}
              onChange={handleAlignChange}
              className="w-full border rounded px-2 py-1 text-sm"
            >
              <option value="start">Start</option>
              <option value="center">Center</option>
              <option value="end">End</option>
            </select>
          </div>
        </>
      )}
    </div>
  );
};
