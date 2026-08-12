import type { ElementNode, BuilderDocument } from '@niyi-builder/core';
import {
  DOCUMENT_VERSION,
  type BlockNode,
  type BlockType,
  type BuilderDocument as CoreDocument,
} from '@niyi-builder/serializer';

/**
 * Bridges the editor document model ({ id, title, elements } with the niyi
 * element types container/button/heading) and the serializer model
 * ({ version, root } with core/* block types).
 *
 * Element attributes are passed through as-is; the serializer maps native
 * Gutenberg fields and stashes anything else under `niyi` so both directions
 * round-trip through real post_content. The only intentional rewrites are the
 * content fields Gutenberg renders from inner HTML (heading/button text).
 */

const EDITOR_TYPE_TO_BLOCK_TYPE: Record<string, BlockType> = {
  container: 'core/group',
  button: 'core/button',
  heading: 'core/heading',
  paragraph: 'core/paragraph',
  image: 'core/image',
};

const BLOCK_TYPE_TO_EDITOR_TYPE: Record<string, string> = {
  'core/group': 'container',
  'core/button': 'button',
  'core/heading': 'heading',
  'core/paragraph': 'paragraph',
  'core/image': 'image',
};

const ROOT_ID = 'root';

export function elementToBlockNode(node: ElementNode): BlockNode {
  return {
    id: node.id,
    type: EDITOR_TYPE_TO_BLOCK_TYPE[node.type] ?? (node.type as BlockType),
    attributes: elementAttributesToBlock(node.type, node.attributes),
    children: node.children.map(elementToBlockNode),
  };
}

export function blockNodeToElement(node: BlockNode): ElementNode {
  return {
    id: node.id,
    type: BLOCK_TYPE_TO_EDITOR_TYPE[node.type] ?? node.type,
    attributes: blockAttributesToElement(node.type, node.attributes),
    children: node.children.map(blockNodeToElement),
  };
}

export function editorDocumentToCoreDocument(document: BuilderDocument): CoreDocument {
  return {
    version: DOCUMENT_VERSION,
    root: {
      id: ROOT_ID,
      type: 'core/group',
      attributes: {},
      children: document.elements.map(elementToBlockNode),
    },
  };
}

export interface EditorDocumentMeta {
  id: string;
  title: string;
}

export function coreDocumentToEditorDocument(
  document: CoreDocument,
  meta: EditorDocumentMeta,
): BuilderDocument {
  const root = document.root;
  const isStructuralRoot = root.type === 'core/group' && Object.keys(root.attributes).length === 0;

  return {
    id: meta.id,
    title: meta.title,
    elements: isStructuralRoot ? root.children.map(blockNodeToElement) : [blockNodeToElement(root)],
  };
}

function elementAttributesToBlock(
  elementType: string,
  attributes: Record<string, unknown>,
): Record<string, unknown> {
  if (elementType === 'heading' && typeof attributes.text === 'string') {
    const { text: _text, ...rest } = attributes;
    return { ...rest, content: _text };
  }

  if (elementType === 'button' && typeof attributes.text === 'string') {
    const { text: _text, ...rest } = attributes;
    return { ...rest, label: _text };
  }

  return attributes;
}

function blockAttributesToElement(
  blockType: BlockType,
  attributes: Record<string, unknown>,
): Record<string, unknown> {
  if (blockType === 'core/heading' && typeof attributes.content === 'string') {
    const { content: _content, ...rest } = attributes;
    return { ...rest, text: _content };
  }

  if (blockType === 'core/button' && typeof attributes.label === 'string') {
    const { label: _label, ...rest } = attributes;
    return { ...rest, text: _label };
  }

  return attributes;
}
