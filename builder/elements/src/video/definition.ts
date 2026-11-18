import type { ElementDefinition, ElementNode } from '@niyi-builder/core';
import { generateId } from '@niyi-builder/core';
import { VideoCanvas } from './canvas.js';
import { VideoProperties } from './properties.js';
import { videoDefaults } from './defaults.js';
import { VideoIcon } from './icon.js';

export const videoDefinition: ElementDefinition = {
  type: 'video',
  title: 'Video',
  category: 'media',
  version: '1.0.0',
  icon: VideoIcon(),
  defaults: videoDefaults,
  Canvas: VideoCanvas,
  Properties: VideoProperties,
};

export function createVideoNode(overrides?: Partial<ElementNode>): ElementNode {
  return {
    id: generateId(),
    type: 'video',
    attributes: { ...videoDefaults, ...overrides?.attributes },
    children: [],
  };
}
