import type { ElementDefinition } from '../types/ElementDefinition.js';
import { validateElementDefinition } from '../validator/ElementValidator.js';

export class ElementRegistry {
  private elements = new Map<string, ElementDefinition>();

  registerElement(definition: ElementDefinition): void {
    const validation = validateElementDefinition(definition);

    if (!validation.valid) {
      throw new Error(`Invalid element definition: ${validation.errors.join(', ')}`);
    }

    if (this.elements.has(definition.type)) {
      throw new Error(`Element type "${definition.type}" is already registered`);
    }

    this.elements.set(definition.type, definition);
  }

  registerElements(definitions: ElementDefinition[]): void {
    for (const definition of definitions) {
      this.registerElement(definition);
    }
  }

  unregisterElement(type: string): boolean {
    return this.elements.delete(type);
  }

  getElement(type: string): ElementDefinition | undefined {
    return this.elements.get(type);
  }

  getAllElements(): ElementDefinition[] {
    return Array.from(this.elements.values());
  }

  hasElement(type: string): boolean {
    return this.elements.has(type);
  }
}
