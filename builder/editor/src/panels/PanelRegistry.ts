import type { PanelDefinition } from '../types/index.js';

export class PanelRegistry {
  private panels = new Map<string, PanelDefinition>();

  registerPanel(definition: PanelDefinition): void {
    if (this.panels.has(definition.id)) {
      throw new Error(`Panel with id "${definition.id}" is already registered`);
    }
    this.panels.set(definition.id, definition);
  }

  unregisterPanel(id: string): boolean {
    return this.panels.delete(id);
  }

  getPanel(id: string): PanelDefinition | undefined {
    return this.panels.get(id);
  }

  getAllPanels(): PanelDefinition[] {
    return Array.from(this.panels.values());
  }
}
