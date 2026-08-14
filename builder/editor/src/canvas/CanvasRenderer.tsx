import { CanvasFrame } from './CanvasFrame.js';
import { CanvasNode } from './CanvasNode.js';
// import { SelectionOverlay } from './SelectionOverlay.js';
import { useEditorStore } from '../store/EditorStore.js';
import type { FC } from 'react';

export const CanvasRenderer: FC = () => {
  const { document, selectElement, selectedElementId } = useEditorStore();

  const handleBackgroundClick = () => {
    selectElement(null);
  };

  return (
    <CanvasFrame>
      <div className="min-h-screen" onClick={handleBackgroundClick}>
        {document.elements.length === 0 ? (
          <div className="text-gray-400 text-center py-8">
            Drop elements here or click "Add Heading" in the panel
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {document.elements.map((node) => (
              <CanvasNode
                key={node.id}
                node={node}
                onSelect={() => selectElement(node.id)}
                selectElement={selectElement}
                isSelected={selectedElementId === node.id}
              />
            ))}
          </div>
        )}
      </div>
    </CanvasFrame>
  );
};
