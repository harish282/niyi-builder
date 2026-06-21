import type { FC } from 'react';
import type { ElementNode } from '@niyi-builder/core';

interface CanvasNodeProps {
  node: ElementNode;
  onSelect: () => void;
  selectElement: (id: string) => void;
}

export const CanvasNode: FC<CanvasNodeProps> = ({ node, onSelect, selectElement }) => {
  type CanvasComponentProps = { node: ElementNode; onSelect: () => void; selectElement: (id: string) => void };

  const registry = window.__niyiRegistry;
  const definition = registry?.getElement(node.type);

  if (!definition?.Canvas) {
    return (
      <div className="p-4 border border-gray-300 rounded cursor-pointer mb-2" onClick={onSelect}>
        {node.type}
      </div>
    );
  }

  const CanvasComponent = definition.Canvas as FC<CanvasComponentProps>;
  const canHaveChildren = (definition as { canHaveChildren?: boolean }).canHaveChildren === true;

  return (
    <>
      <CanvasComponent node={node} onSelect={onSelect} selectElement={selectElement} />
      {canHaveChildren &&
        node.children.map((child) => (
          <CanvasNode key={child.id} node={child} onSelect={() => selectElement(child.id)} selectElement={selectElement} />
        ))}
    </>
  );
};
