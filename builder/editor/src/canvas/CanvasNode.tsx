import type { FC } from 'react';
import type { ElementNode } from '@niyi-builder/core';

interface CanvasNodeProps {
  node: ElementNode;
  onSelect: () => void;
  selectElement?: (id: string) => void;
  isSelected?: boolean;
}

interface CanvasComponentProps {
  node: ElementNode;
  children?: React.ReactNode;
  onSelect: () => void;
  selectElement?: (id: string) => void;
  isSelected?: boolean;
}

export const CanvasNode: FC<CanvasNodeProps> = ({ node, onSelect, selectElement, isSelected }) => {
  const registry = window.__niyiRegistry;
  const definition = registry?.getElement(node.type);

  if (!definition?.Canvas) {
    return (
      <div
        className="p-4 border border-gray-300 rounded cursor-pointer mb-2"
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
      >
        {node.type}
        {node.children.length > 0 && (
          <div className="mt-2 space-y-2">
            {node.children.map((child) => (
              <CanvasNode
                key={child.id}
                node={child}
                onSelect={() => selectElement?.(child.id)}
                selectElement={selectElement}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  const CanvasComponent = definition.Canvas as FC<CanvasComponentProps>;

  return (
    <CanvasComponent
      node={node}
      onSelect={onSelect}
      selectElement={selectElement}
      isSelected={isSelected}
    >
      {node.children.length > 0 && (
        <div className="space-y-2">
          {node.children.map((child) => (
            <CanvasNode
              key={child.id}
              node={child}
              onSelect={() => selectElement?.(child.id)}
              selectElement={selectElement}
            />
          ))}
        </div>
      )}
    </CanvasComponent>
  );
};
