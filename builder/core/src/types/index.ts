export type { ElementNode } from './ElementNode.js';
export type { ElementDefinition } from './ElementDefinition.js';
export type { BaseElementAttributes } from './BaseElementAttributes.js';
export { BASE_ATTRIBUTE_KEYS } from './BaseElementAttributes.js';

export interface BuilderDocument {
  id: string;
  title: string;
  elements: import('./ElementNode.js').ElementNode[];
}
