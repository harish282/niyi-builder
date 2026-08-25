import type { FC, CSSProperties, ReactNode } from 'react';
import type { ElementNode } from '@niyi-builder/core';
import { useSortable } from '@dnd-kit/sortable';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ElementNavigator } from './ElementNavigator.js';
import { useEditorStore } from '../store/EditorStore.js';

interface CanvasNodeProps {
  node: ElementNode;
  path: ElementNode[];
  onSelect: () => void;
  selectElement?: (id: string) => void;
}

interface SortableNodeProps {
  node: ElementNode;
  path: ElementNode[];
  onSelect: () => void;
  selectElement?: (id: string) => void;
}

interface CanvasComponentProps {
  node: ElementNode;
  children?: ReactNode;
  onSelect: () => void;
  selectElement?: (id: string) => void;
  isSelected?: boolean;
}

function ChildrenSlot({ node, path, selectElement }: SortableNodeProps): ReactNode {
  if (node.children.length === 0) {
    return null;
  }

  return (
    <SortableContext items={node.children.map((c) => c.id)} strategy={rectSortingStrategy}>
      {node.children.map((child) => (
        <SortableNode
          key={child.id}
          node={child}
          path={[...path, child]}
          onSelect={() => selectElement?.(child.id)}
          selectElement={selectElement}
        />
      ))}
    </SortableContext>
  );
}

export const SortableNode: FC<SortableNodeProps> = ({ node, path, onSelect, selectElement }) => {
  const { selectedElementId, selectElement: storeSelectElement } = useEditorStore();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: node.id,
  });

  const isSelected = selectedElementId === node.id;

  const style: CSSProperties = {
    position: 'relative',
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    touchAction: 'none',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <CanvasNode node={node} path={path} onSelect={onSelect} selectElement={selectElement} />
      {isSelected && <ElementNavigator path={path} onSelect={(id) => storeSelectElement(id)} />}
    </div>
  );
};

export const CanvasNode: FC<CanvasNodeProps> = ({ node, path, onSelect, selectElement }) => {
  const { selectedElementId } = useEditorStore();
  const isSelected = selectedElementId === node.id;
  const registry = window.__niyiRegistry;
  const definition = registry?.getElement(node.type);

  const childrenSlot = (
    <ChildrenSlot node={node} path={path} onSelect={onSelect} selectElement={selectElement} />
  );

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
        {node.children.length > 0 && <div className="mt-2 space-y-2">{childrenSlot}</div>}
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
      {childrenSlot}
    </CanvasComponent>
  );
};
