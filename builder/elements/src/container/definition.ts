import type { ElementDefinition, ElementNode } from '@niyi-builder/core';
import { ContainerCanvas } from './canvas.js';
import { ContainerProperties } from './properties.js';
import { containerDefaults } from './defaults.js';
import { generateId } from '@niyi-builder/core';
import { ContainerIcon } from './icon.js';

export interface ContainerLayout {
  type: 'flex' | 'grid';
  direction: 'row' | 'column';
  justify: 'start' | 'center' | 'end' | 'between';
  align: 'start' | 'center' | 'end';
  gap: 'none' | 'sm' | 'md' | 'lg';
}

export const containerDefinition: ElementDefinition = {
  type: 'container',
  title: 'Container',
  category: 'Layout',
  version: '1.0.0',
  icon: ContainerIcon(),
  canHaveChildren: true,
  defaults: containerDefaults,
  Canvas: ContainerCanvas,
  Properties: ContainerProperties,
};

export function createContainerNode(overrides?: Partial<ElementNode>): ElementNode {
  return {
    id: generateId(),
    type: 'container',
    attributes: { ...containerDefaults, ...overrides?.attributes },
    children: [],
  };
}
