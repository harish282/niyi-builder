import type { BuilderDocument, ElementNode } from '../types/index.js';
import { EventManager } from '../events/EventManager.js';
import { generateId } from '@niyi-builder/utils';

const eventManager = new EventManager();

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

  removeElement(elementId: string): void {
    const index = this.elements.findIndex((e) => e.id === elementId);
    if (index !== -1) {
      this.elements.splice(index, 1);
    }
  }

  updateElement(elementId: string, updates: Partial<ElementNode>): void {
    const element = this.findElement(elementId);
    if (element) {
      Object.assign(element, updates);
      eventManager.emit('element.updated', { elementId, updates });
    }
  }

  findElement(elementId: string): ElementNode | undefined {
    return this.elements.find((e) => e.id === elementId);
  }
}

export { DocumentManagerImpl };
