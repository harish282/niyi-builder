import type { ElementDefinition, ElementNode } from '@niyi-builder/core';
import { ButtonCanvas } from './canvas.js';
import { ButtonProperties } from './properties.js';
import { buttonDefaults } from './defaults.js';
import { generateId } from '@niyi-builder/core';
import { ButtonIcon } from './icon.js';

export const buttonDefinition: ElementDefinition = {
  type: 'button',
  title: 'Button',
  category: 'content',
  version: '1.0.0',
  icon: ButtonIcon(),
  defaults: buttonDefaults,
  Canvas: ButtonCanvas,
  Properties: ButtonProperties,
};

export function createButtonNode(overrides?: Partial<ElementNode>): ElementNode {
  return {
    id: generateId(),
    type: 'button',
    attributes: { ...buttonDefaults, ...overrides?.attributes },
    children: [],
  };
}
