import type { ReactElement } from 'react';
import { EditorLayout } from './layouts/EditorLayout.js';
import { ThemeProvider } from './theme/ThemeProvider.js';
import { EditorProvider } from './store/EditorStore.js';
import { ElementRegistry } from '@niyi-builder/core';
import type { ElementDefinition } from '@niyi-builder/core';

const registry = new ElementRegistry();

// Vite's import.meta.glob discovers element modules at build time
const elementModules = import.meta.glob('./elements/*/index.ts', { eager: true });

for (const mod of Object.values(elementModules)) {
  const exports = mod as Record<string, unknown>;
  for (const value of Object.values(exports)) {
    if (
      value &&
      typeof value === 'object' &&
      'type' in value &&
      typeof (value as Record<string, unknown>).type === 'string'
    ) {
      registry.registerElement(value as ElementDefinition);
    }
  }
}

declare global {
  interface Window {
    __niyiRegistry: {
      registerElement: (def: ElementDefinition) => void;
      getElement: (type: string) => ElementDefinition | undefined;
      getAllElements: () => ElementDefinition[];
    };
  }
}

export { registry };

export function App(): ReactElement {
  window.__niyiRegistry = {
    registerElement: registry.registerElement.bind(registry),
    getElement: registry.getElement.bind(registry),
    getAllElements: registry.getAllElements.bind(registry),
  };

  return (
    <EditorProvider>
      <ThemeProvider>
        <EditorLayout />
      </ThemeProvider>
    </EditorProvider>
  );
}

export { useEditorStore } from './store/EditorStore.js';
