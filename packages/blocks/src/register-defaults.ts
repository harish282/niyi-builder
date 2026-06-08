import {
  BLOCK_TYPES,
  isLayoutBlockType,
  isLeafBlockType,
  type BlockType,
  type ContentBlockType,
  type LayoutBlockType,
} from '@niyi-builder/core';

import {
  ButtonPreview,
  ColumnPreview,
  ColumnsPreview,
  EmbedPreview,
  GroupPreview,
  HeadingPreview,
  HtmlPreview,
  ImagePreview,
  ParagraphPreview,
  SpacerPreview,
} from './previews.js';
import { registerBlock } from './registry.js';

const LAYOUT_LABELS: Record<LayoutBlockType, string> = {
  'core/group': 'Container',
  'core/columns': 'Columns',
  'core/column': 'Column',
  'core/spacer': 'Spacer',
};

const CONTENT_LABELS: Record<ContentBlockType, string> = {
  'core/heading': 'Heading',
  'core/paragraph': 'Text',
  'core/button': 'Button',
  'core/image': 'Image',
  'core/html': 'HTML',
  'core/embed': 'Video',
};

const PREVIEW_BY_TYPE = {
  'core/group': GroupPreview,
  'core/columns': ColumnsPreview,
  'core/column': ColumnPreview,
  'core/spacer': SpacerPreview,
  'core/heading': HeadingPreview,
  'core/paragraph': ParagraphPreview,
  'core/button': ButtonPreview,
  'core/image': ImagePreview,
  'core/html': HtmlPreview,
  'core/embed': EmbedPreview,
} as const;

let defaultsRegistered = false;

export function ensureDefaultBlocksRegistered(): void {
  if (defaultsRegistered) {
    return;
  }

  for (const type of BLOCK_TYPES) {
    registerBlockDefinition(type);
  }

  defaultsRegistered = true;
}

function registerBlockDefinition(type: BlockType): void {
  const Preview = PREVIEW_BY_TYPE[type];

  registerBlock({
    type,
    label: isLayoutBlockType(type) ? LAYOUT_LABELS[type] : CONTENT_LABELS[type],
    category: isLayoutBlockType(type) ? 'layout' : 'content',
    canHaveChildren: !isLeafBlockType(type),
    Preview,
  });
}
