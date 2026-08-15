import type { ElementNode } from '@niyi-builder/core';
import { generateId } from '@niyi-builder/core';
import { flexDefaults, gridDefaults, containerDefaults } from './defaults.js';

export interface ContainerFlexOptions {
  direction: 'row' | 'column';
  columns: number;
  rows: number;
  justify: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  align: 'start' | 'center' | 'end' | 'stretch';
  gap: 'none' | 'sm' | 'md' | 'lg';
}

export interface ContainerGridOptions {
  columns: number;
  rows: 'auto' | 1 | 2 | 3 | 4 | 5 | 6;
  gap: 'none' | 'sm' | 'md' | 'lg';
  justifyItems: 'start' | 'center' | 'end' | 'stretch';
  alignItems: 'start' | 'center' | 'end' | 'stretch';
}

export function buildFlexLayout(options?: Partial<ContainerFlexOptions>): Record<string, unknown> {
  return { ...flexDefaults, ...options };
}

export function buildGridLayout(options?: Partial<ContainerGridOptions>): Record<string, unknown> {
  return { ...gridDefaults, ...options };
}

export function createContainerChildren(attributes: Record<string, unknown>): ElementNode[] {
  const layout = (attributes.layout ?? {}) as Record<string, unknown>;
  const count =
    layout.type === 'grid'
      ? ((layout.columns as number) ?? 2)
      : layout.direction === 'column'
        ? ((layout.rows as number) ?? 2)
        : ((layout.columns as number) ?? 2);
  return Array.from({ length: count }, () => ({
    id: generateId(),
    type: 'container',
    attributes: { ...containerDefaults },
    children: [],
  }));
}
