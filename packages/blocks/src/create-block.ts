import { canNest, getAllowedChildTypes, type BlockNode, type BlockType } from '@niyi-builder/core';

function createBlockId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `block-${crypto.randomUUID()}`;
  }

  return `block-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/** Default attributes for newly inserted blocks (editing stubs). */
function defaultAttributes(type: BlockType): Record<string, unknown> {
  switch (type) {
    case 'core/columns':
      return {
        columns: { desktop: 2 },
        gap: { desktop: '16px' },
      };
    case 'core/spacer':
      return { height: { desktop: '48px' } };
    case 'core/heading':
      return { level: 2, content: 'Heading' };
    case 'core/paragraph':
      return { content: 'Start writing…' };
    case 'core/button':
      return { label: 'Button', url: '#' };
    case 'core/html':
      return { name: 'HTML' };
    case 'core/embed':
      return { provider: 'youtube', url: '' };
    default:
      return {};
  }
}

function createColumnNode(): BlockNode {
  return {
    id: createBlockId(),
    type: 'core/column',
    attributes: {},
    children: [],
  };
}

export function createBlockNode(type: BlockType): BlockNode {
  const children = type === 'core/columns' ? [createColumnNode(), createColumnNode()] : [];

  return {
    id: createBlockId(),
    type,
    attributes: defaultAttributes(type),
    children,
  };
}

export function getInsertableBlockTypes(parentType: BlockType): BlockType[] {
  return getAllowedChildTypes(parentType).filter((childType) => canNest(parentType, childType));
}
