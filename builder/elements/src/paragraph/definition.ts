import type { ElementDefinition, ElementNode } from '@niyi-builder/core';
import { ParagraphCanvas } from './canvas.js';
import { ParagraphProperties } from './properties.js';
import { paragraphDefaults } from './defaults.js';
import { generateId } from '@niyi-builder/core';
import { ParagraphIcon } from './icon.js';

export const paragraphDefinition: ElementDefinition = {
  type: 'paragraph',
  title: 'Paragraph',
  category: 'content',
  version: '1.0.0',
  icon: ParagraphIcon(),
  defaults: paragraphDefaults,
  Canvas: ParagraphCanvas,
  Properties: ParagraphProperties,
};

export function createParagraphNode(overrides?: Partial<ElementNode>): ElementNode {
  return {
    id: generateId(),
    type: 'paragraph',
    attributes: { ...paragraphDefaults, ...overrides?.attributes },
    children: [],
  };
}
