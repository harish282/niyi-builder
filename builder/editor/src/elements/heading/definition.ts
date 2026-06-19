import type { ElementDefinition, ElementNode } from '../../../../core/src/types/index.js';
import { HeadingCanvas } from './canvas.js';
import { HeadingProperties } from './properties.js';
import { headingDefaults } from './defaults.js';

export const headingDefinition: ElementDefinition = {
    type: 'heading',
    title: 'Heading',
    category: 'content',
    version: '1.0.0',
    defaults: headingDefaults,
    Canvas: HeadingCanvas as unknown as ElementDefinition['Canvas'],
    Properties: HeadingProperties as unknown as ElementDefinition['Properties'],
};

export function createHeadingNode(overrides?: Partial<ElementNode>): ElementNode {
    return {
        id: crypto.randomUUID(),
        type: 'heading',
        attributes: { ...headingDefaults, ...overrides?.attributes },
        children: [],
    };
}