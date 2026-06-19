import type { ReactElement } from 'react';
import { EditorLayout } from './layouts/EditorLayout.js';
import { ThemeProvider } from './theme/ThemeProvider.js';
import { EditorProvider } from './store/EditorStore.js';
import { ElementRegistry } from '@niyi-builder/core';
import type { ElementDefinition } from '@niyi-builder/core';
import { headingDefinition } from './elements/heading/index.js';

const registry = new ElementRegistry();

// Auto-register all element definitions
// New elements: add their definition here and they'll be registered automatically
const elementDefinitions: ElementDefinition[] = [headingDefinition];

for (const def of elementDefinitions) {
  registry.registerElement(def);
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
