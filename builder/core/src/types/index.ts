export type { ElementNode } from './ElementNode.js';
export type { ElementDefinition } from './ElementDefinition.js';

export interface BuilderDocument {
  id: string;
  title: string;
  elements: import('./ElementNode.js').ElementNode[];
}
