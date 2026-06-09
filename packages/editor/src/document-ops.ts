import { isLeafBlockType, type BlockNode, type BuilderDocument } from '@niyi-builder/core';

export function findBlockById(node: BlockNode, blockId: string): BlockNode | null {
  if (node.id === blockId) {
    return node;
  }

  for (const child of node.children) {
    const found = findBlockById(child, blockId);

    if (found !== null) {
      return found;
    }
  }

  return null;
}

export function findParentBlock(root: BlockNode, blockId: string): BlockNode | null {
  for (const child of root.children) {
    if (child.id === blockId) {
      return root;
    }

    const found = findParentBlock(child, blockId);

    if (found !== null) {
      return found;
    }
  }

  return null;
}

/** Parent that should receive the next inserted block. */
export function resolveInsertParentId(root: BlockNode, selectedBlockId: string | null): string {
  if (selectedBlockId === null) {
    return root.id;
  }

  const selected = findBlockById(root, selectedBlockId);

  if (selected === null) {
    return root.id;
  }

  if (!isLeafBlockType(selected.type)) {
    return selected.id;
  }

  const parent = findParentBlock(root, selectedBlockId);

  return parent?.id ?? root.id;
}

export function insertChild(
  document: BuilderDocument,
  parentId: string,
  child: BlockNode,
): BuilderDocument {
  return {
    ...document,
    root: insertChildInNode(document.root, parentId, child),
  };
}

function insertChildInNode(node: BlockNode, parentId: string, child: BlockNode): BlockNode {
  if (node.id === parentId) {
    return {
      ...node,
      children: [...node.children, child],
    };
  }

  return {
    ...node,
    children: node.children.map((existing) => insertChildInNode(existing, parentId, child)),
  };
}

function replaceNodeChildren(
  node: BlockNode,
  targetId: string,
  children: BlockNode[],
): BlockNode {
  if (node.id === targetId) {
    return { ...node, children };
  }

  return {
    ...node,
    children: node.children.map((child) => replaceNodeChildren(child, targetId, children)),
  };
}

function moveArrayItem<T>(items: readonly T[], fromIndex: number, toIndex: number): T[] {
  const next = [...items];
  const [moved] = next.splice(fromIndex, 1);

  if (moved === undefined) {
    return next;
  }

  next.splice(toIndex, 0, moved);

  return next;
}

/** Reorder siblings that share the same parent (drag-and-drop within a container). */
export function reorderSiblings(
  document: BuilderDocument,
  activeId: string,
  overId: string,
): BuilderDocument | null {
  const parent = findParentBlock(document.root, activeId);

  if (parent === null) {
    return null;
  }

  const overParent = findParentBlock(document.root, overId);

  if (overParent?.id !== parent.id) {
    return null;
  }

  const oldIndex = parent.children.findIndex((child) => child.id === activeId);
  const newIndex = parent.children.findIndex((child) => child.id === overId);

  if (oldIndex < 0 || newIndex < 0 || oldIndex === newIndex) {
    return null;
  }

  const children = moveArrayItem(parent.children, oldIndex, newIndex);

  return {
    ...document,
    root: replaceNodeChildren(document.root, parent.id, children),
  };
}
