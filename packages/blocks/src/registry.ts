import type { BlockNode, BlockType } from '@niyi-builder/core';
import type { ReactNode } from 'react';

import type { PreviewDevice } from './responsive.js';

export type BlockCategory = 'layout' | 'content';

export interface BlockPreviewProps {
  node: BlockNode;
  device: PreviewDevice;
  renderChildren: () => ReactNode;
}

export type BlockPreviewComponent = (props: BlockPreviewProps) => ReactNode;

export interface BlockDefinition {
  type: BlockType;
  label: string;
  category: BlockCategory;
  canHaveChildren: boolean;
  Preview: BlockPreviewComponent;
}

const registry = new Map<BlockType, BlockDefinition>();

export function registerBlock(definition: BlockDefinition): void {
  registry.set(definition.type, definition);
}

export function getBlockDefinition(type: BlockType): BlockDefinition | undefined {
  return registry.get(type);
}

export function getRegisteredBlocks(): BlockDefinition[] {
  return [...registry.values()];
}

export function getRegisteredBlockTypes(): BlockType[] {
  return [...registry.keys()];
}

export function isBlockRegistered(type: BlockType): boolean {
  return registry.has(type);
}
