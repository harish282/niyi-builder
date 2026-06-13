import type { BlockDefinition } from '@niyi-builder/blocks';
import { ParagraphInspector } from './Inspector.js';
import { ParagraphPreview } from './Preview.js';

export const coreParagraphBlock: BlockDefinition = {
  type: 'core/paragraph',
  label: 'Paragraph',
  category: 'content',
  isContentBlock: true,
  isPro: false,
  Preview: ParagraphPreview,
  Inspector: ParagraphInspector,
} as any;