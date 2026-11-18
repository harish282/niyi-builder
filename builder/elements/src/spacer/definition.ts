import type { ElementDefinition, ElementNode } from '@niyi-builder/core';
import { generateId } from '@niyi-builder/core';
import { SpacerCanvas } from './canvas.js';
import { SpacerProperties } from './properties.js';
import { spacerDefaults } from './defaults.js';
import { SpacerIcon } from './icon.js';

export const spacerDefinition: ElementDefinition = {
  type: 'spacer',
  title: 'Spacer',
  category: 'layout',
  version: '1.0.0',
  icon: SpacerIcon(),
  defaults: spacerDefaults,
  Canvas: SpacerCanvas,
  Properties: SpacerProperties,
};

export function createSpacerNode(overrides?: Partial<ElementNode>): ElementNode {
  return {
    id: generateId(),
    type: 'spacer',
    attributes: { ...spacerDefaults, ...overrides?.attributes },
    children: [],
  };
}
