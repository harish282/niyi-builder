import type { FC } from 'react';
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  type DragEndEvent,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CanvasFrame } from './CanvasFrame.js';
import { SortableNode } from './CanvasNode.js';
import { useEditorStore } from '../store/EditorStore.js';

export const CanvasRenderer: FC = () => {
  const { document, selectElement, moveElementTo } = useEditorStore();

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleBackgroundClick = () => {
    selectElement(null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    moveElementTo(String(active.id), String(over.id));
  };

  return (
    <CanvasFrame>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="min-h-screen" onClick={handleBackgroundClick}>
          {document.elements.length === 0 ? (
            <div className="text-gray-400 text-center py-8">
              Drop elements here or click "Add Heading" in the panel
            </div>
          ) : (
            <SortableContext
              items={document.elements.map((n) => n.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="flex flex-col gap-4">
                {document.elements.map((node) => (
                  <SortableNode
                    key={node.id}
                    node={node}
                    path={[node]}
                    onSelect={() => selectElement(node.id)}
                    selectElement={selectElement}
                  />
                ))}
              </div>
            </SortableContext>
          )}
        </div>
      </DndContext>
    </CanvasFrame>
  );
};
