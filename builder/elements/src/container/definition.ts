import type { ElementDefinition, ElementNode } from '@niyi-builder/core';
import { ContainerCanvas } from './canvas.js';
import { ContainerProperties } from './properties.js';
import { containerDefaults } from './defaults.js';
import { generateId } from '@niyi-builder/core';
import { ContainerIcon } from './icon.js';
import { ContainerWizard } from './wizard.js';
import { createContainerChildren } from './options.js';

export interface ContainerLayout {
  type: 'flex' | 'grid';
  direction?: 'row' | 'column';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  align?: 'start' | 'center' | 'end' | 'stretch';
  gap?: 'none' | 'sm' | 'md' | 'lg';
  columns?: number;
  rows?: 'auto' | number;
  justifyItems?: 'start' | 'center' | 'end' | 'stretch';
  alignItems?: 'start' | 'center' | 'end' | 'stretch';
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
  Wizard: ContainerWizard,
  createChildren: createContainerChildren,
};

export function createContainerNode(overrides?: Partial<ElementNode>): ElementNode {
  return {
    id: generateId(),
    type: 'container',
    attributes: { ...containerDefaults, ...overrides?.attributes },
    children: [],
  };
}
