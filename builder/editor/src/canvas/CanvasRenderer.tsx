import { CanvasNode } from './CanvasNode.js';
// import { SelectionOverlay } from './SelectionOverlay.js';
import { useEditorStore } from '../store/EditorStore.js';
import type { FC } from 'react';

export const CanvasRenderer: FC = () => {
  const { document, selectElement } = useEditorStore();

  return (
    <div className="flex-1 overflow-auto p-4 min-h-screen">
      {document.elements.length === 0 ? (
        <div className="text-gray-400 text-center py-8">
          Drop elements here or click "Add Heading" in the panel
        </div>
      ) : (
        document.elements.map((node) => (
          <CanvasNode key={node.id} node={node} onSelect={() => selectElement(node.id)} selectElement={selectElement} />
        ))
      )}
      {/* <SelectionOverlay /> */}
    </div>
  );
};
