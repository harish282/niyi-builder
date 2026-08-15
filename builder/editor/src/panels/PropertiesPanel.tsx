import type { ReactElement, FC } from 'react';
import type { ElementNode } from '@niyi-builder/core';
import { useEditorStore } from '../store/EditorStore.js';

export function PropertiesPanel(): ReactElement {
  const { selectedElementId, updateElement, findElement } = useEditorStore();

  const selectedElement = selectedElementId ? findElement(selectedElementId) : null;

  if (!selectedElement) {
    return (
      <div className="w-64 flex-shrink-0 border-r border-[#c3c4c7] bg-white p-4">
        <h3 className="text-[14px] font-semibold mb-3">Properties</h3>
        <div className="text-gray-400 text-sm">Select an element to edit its properties</div>
      </div>
    );
  }

  type PropertiesProps = { node: ElementNode; onUpdate: (attrs: Record<string, unknown>) => void };

  const updateAttributes = (attributes: Record<string, unknown>) => {
    updateElement(selectedElementId!, { attributes });
  };

  const registry = window.__niyiRegistry;
  const definition = registry?.getElement(selectedElement.type);

  if (!definition?.Properties) {
    return (
      <div className="w-64 flex-shrink-0 border-r border-[#c3c4c7] bg-white p-4">
        <h3 className="text-[14px] font-semibold mb-3">Properties</h3>
        <div className="text-gray-400 text-sm">No property controls for this element type</div>
      </div>
    );
  }

  const PropertiesComponent = definition.Properties as FC<PropertiesProps>;
  return (
    <div className="w-64 flex-shrink-0 border-r border-[#c3c4c7] bg-white p-4">
      <h3 className="text-[14px] font-semibold mb-3">Properties: {selectedElement.type}</h3>
      <PropertiesComponent node={selectedElement} onUpdate={updateAttributes} />
    </div>
  );
}
