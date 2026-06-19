import type { ElementDefinition, ElementNode } from '@niyi-builder/core';
import { HeadingCanvas } from './canvas.js';
import { HeadingProperties } from './properties.js';
import { headingDefaults } from './defaults.js';
import { generateId } from '@niyi-builder/core';

export const headingDefinition: ElementDefinition = {
  type: 'heading',
  title: 'Heading',
  category: 'content',
  version: '1.0.0',
  defaults: headingDefaults,
  Canvas: HeadingCanvas,
  Properties: HeadingProperties,
};

export function createHeadingNode(overrides?: Partial<ElementNode>): ElementNode {
  return {
    id: generateId(),
    type: 'heading',
    attributes: { ...headingDefaults, ...overrides?.attributes },
    children: [],
  };
}
