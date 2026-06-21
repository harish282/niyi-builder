import type { BuilderDocument, ElementNode } from '../types/index.js';
import { EventManager } from '../events/EventManager.js';
import { generateId } from '../crypto.js';

const eventManager = new EventManager();

function findInTree(elements: ElementNode[], elementId: string): ElementNode | undefined {
  for (const el of elements) {
    if (el.id === elementId) return el;
    const found = findInTree(el.children, elementId);
    if (found) return found;
  }
  return undefined;
}

function removeFromTree(elements: ElementNode[], elementId: string): ElementNode[] {
  return elements
    .filter((el) => el.id !== elementId)
    .map((el) => ({
      ...el,
      children: removeFromTree(el.children, elementId),
    }));
}

function updateInTree(
  elements: ElementNode[],
  elementId: string,
  updates: Partial<ElementNode>,
): ElementNode[] {
  return elements.map((el) => {
    if (el.id === elementId) {
      const merged: ElementNode = { ...el, ...updates };
      if (updates.attributes) {
        merged.attributes = { ...el.attributes, ...updates.attributes };
      }
      return merged;
    }
    if (el.children.length > 0) {
      return { ...el, children: updateInTree(el.children, elementId, updates) };
    }
    return el;
  });
}

class DocumentManagerImpl implements BuilderDocument {
  id: string;
  title: string;
  elements: ElementNode[];

  constructor() {
    this.id = generateId();
    this.title = 'Untitled';
    this.elements = [];
  }

  addElement(element: ElementNode): void {
    this.elements.push(element);
    eventManager.emit('element.created', { element });
  }

  addChildElement(parentId: string, child: ElementNode): void {
    const parent = findInTree(this.elements, parentId);
    if (parent) {
      parent.children.push(child);
      eventManager.emit('element.addedToContainer', { parentId, child });
    }
  }

  removeElement(elementId: string): void {
    const removed = findInTree(this.elements, elementId);
    if (removed) {
      this.elements = removeFromTree(this.elements, elementId);
      eventManager.emit('element.removed', { elementId });
    }
  }

  removeChildElement(childId: string): void {
    this.elements = removeFromTree(this.elements, childId);
    eventManager.emit('element.removed', { elementId: childId });
  }

  updateElement(elementId: string, updates: Partial<ElementNode>): void {
    const element = findInTree(this.elements, elementId);
    if (element) {
      this.elements = updateInTree(this.elements, elementId, updates);
      eventManager.emit('element.updated', { elementId, updates });
    }
  }

  moveElement(elementId: string, newParentId: string): void {
    const element = findInTree(this.elements, elementId);
    const newParent = findInTree(this.elements, newParentId);
    if (element && newParent) {
      this.elements = removeFromTree(this.elements, elementId);
      newParent.children.push(element);
      eventManager.emit('element.moved', { elementId, newParentId });
    }
  }

  findElement(elementId: string): ElementNode | undefined {
    return findInTree(this.elements, elementId);
  }
}

export { DocumentManagerImpl };

export function createEmptyDocument(): BuilderDocument {
  return {
    id: generateId(),
    title: 'Untitled',
    elements: [],
  };
}
