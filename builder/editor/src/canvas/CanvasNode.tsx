import type { FC } from 'react';
import type { ElementNode } from '@niyi-builder/core';

interface CanvasNodeProps {
  node: ElementNode;
  onSelect: () => void;
}

export const CanvasNode: FC<CanvasNodeProps> = ({ node, onSelect }) => {
  type CanvasComponentProps = { node: ElementNode; onSelect: () => void };

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
  return <CanvasComponent node={node} onSelect={onSelect} />;
};
