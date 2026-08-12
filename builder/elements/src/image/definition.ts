import type { ElementDefinition, ElementNode } from '@niyi-builder/core';
import { ImageCanvas } from './canvas.js';
import { ImageProperties } from './properties.js';
import { imageDefaults } from './defaults.js';
import { generateId } from '@niyi-builder/core';
import { ImageIcon } from './icon.js';

export const imageDefinition: ElementDefinition = {
  type: 'image',
  title: 'Image',
  category: 'content',
  version: '1.0.0',
  icon: ImageIcon(),
  defaults: imageDefaults,
  Canvas: ImageCanvas,
  Properties: ImageProperties,
};

export function createImageNode(overrides?: Partial<ElementNode>): ElementNode {
  return {
    id: generateId(),
    type: 'image',
    attributes: { ...imageDefaults, ...overrides?.attributes },
    children: [],
  };
}
