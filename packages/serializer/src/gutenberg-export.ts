import { ROOT_BLOCK_TYPE, type BlockNode, type BuilderDocument } from '@niyi-builder/core';

/**
 * Builder documents always use a root `core/group`. When that group has no layout
 * attributes it is only a parse-time wrapper — export top-level blocks the way
 * Gutenberg stores them so both editors stay interchangeable.
 */
export function isStructuralDocumentRoot(root: BlockNode): boolean {
  if (root.type !== ROOT_BLOCK_TYPE) {
    return false;
  }

  return Object.keys(root.attributes).length === 0;
}

export function shouldUnwrapDocumentRoot(document: BuilderDocument): boolean {
  return isStructuralDocumentRoot(document.root);
}
