import type { ChangeEvent, FC } from 'react';
import type { ElementNode, ResponsiveValue } from '@niyi-builder/core';
import { readResponsiveValue } from '@niyi-builder/core';
import { spacerDefaults } from './defaults.js';

interface SpacerPropertiesProps {
  node: ElementNode;
  onUpdate: (attributes: Record<string, unknown>) => void;
}

export const SpacerProperties: FC<SpacerPropertiesProps> = ({ node, onUpdate }) => {
  const height =
    readResponsiveValue(node.attributes.height as ResponsiveValue<string> | undefined, 'desktop') ||
    spacerDefaults.height;

  const handleHeightChange = (e: ChangeEvent<HTMLInputElement>) => {
    onUpdate({ height: e.currentTarget.value });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold mb-1">Height</label>
        <input
          type="text"
          value={height}
          placeholder="80px"
          onChange={handleHeightChange}
          className="w-full border rounded px-2 py-1 text-sm"
        />
      </div>
    </div>
  );
};
