import type { ElementDefinition, ElementNode } from '@niyi-builder/core';
import { generateId } from '@niyi-builder/core';
import { IconCanvas } from './canvas.js';
import { IconProperties } from './properties.js';
import { iconDefaults } from './defaults.js';
import { IconIcon } from './icon.js';

export const iconDefinition: ElementDefinition = {
  type: 'icon',
  title: 'Icon',
  category: 'media',
  version: '1.0.0',
  icon: IconIcon(),
  defaults: iconDefaults,
  Canvas: IconCanvas,
  Properties: IconProperties,
};

export function createIconNode(overrides?: Partial<ElementNode>): ElementNode {
  return {
    id: generateId(),
    type: 'icon',
    attributes: { ...iconDefaults, ...overrides?.attributes },
    children: [],
  };
}
