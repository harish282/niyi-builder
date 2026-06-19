import type { FC } from 'react';
import { useEditorStore } from '../store/EditorStore.js';

export const SelectionOverlay: FC = () => {
  const { document, selectedElementId } = useEditorStore();

  if (!selectedElementId) {
    return null;
  }

  const selectedElement = document.elements.find((e) => e.id === selectedElementId);
  if (!selectedElement) {
    return null;
  }

  return (
    <div
      className="absolute pointer-events-none border-2 border-blue-500"
      style={{
        top: 'calc(var(--element-top, 100px) - 4px)',
        left: 'calc(var(--element-left, 100px) - 4px)',
        width: 'var(--element-width, 200px)',
        height: 'var(--element-height, 100px)',
      }}
    />
  );
};
