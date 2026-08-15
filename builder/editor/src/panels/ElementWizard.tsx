import type { ReactElement, FC } from 'react';
import type { ElementNode } from '@niyi-builder/core';
import { generateId } from '@niyi-builder/core';
import { useEditorStore } from '../store/EditorStore.js';
import type { ElementWizardProps } from '../types/index.js';

export function ElementWizard(): ReactElement | null {
  const { pendingWizard, selectedElementId, closeWizard, addElement, findElement } =
    useEditorStore();

  if (!pendingWizard) return null;

  const registry = window.__niyiRegistry;
  const definition = registry?.getElement(pendingWizard);

  if (!definition?.Wizard) {
    return (
      <div className="w-64 flex-shrink-0 border-r border-[#c3c4c7] bg-white p-4">
        <h3 className="text-[14px] font-semibold mb-3">New {definition?.title ?? pendingWizard}</h3>
        <div className="text-gray-400 text-sm">No wizard registered for this element type</div>
      </div>
    );
  }

  const selectedNode: ElementNode | undefined = selectedElementId
    ? findElement(selectedElementId)
    : undefined;

  const node: ElementNode = {
    id: generateId(),
    type: pendingWizard,
    attributes: definition.defaults,
    children: [],
  };

  const handleComplete = (attributes: Record<string, unknown>) => {
    const children = definition.createChildren
      ? definition.createChildren(attributes)
      : [];
    addElement({
      id: generateId(),
      type: pendingWizard,
      attributes: { ...definition.defaults, ...attributes },
      children,
    });
    closeWizard();
  };

  const WizardComponent = definition.Wizard as FC<ElementWizardProps>;

  return (
    <div className="w-64 flex-shrink-0 border-r border-[#c3c4c7] bg-white p-4 overflow-y-auto">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[14px] font-semibold">New {definition.title}</h3>
        <button
          type="button"
          onClick={closeWizard}
          className="text-gray-400 hover:text-gray-600 text-lg leading-none"
          aria-label="Close wizard"
        >
          &times;
        </button>
      </div>
      {selectedNode ? (
        <div className="mb-3 text-xs text-gray-500">
          Will be added inside <span className="font-medium">{selectedNode.type}</span>
        </div>
      ) : null}
      <WizardComponent node={node} onComplete={handleComplete} onCancel={closeWizard} />
    </div>
  );
}
