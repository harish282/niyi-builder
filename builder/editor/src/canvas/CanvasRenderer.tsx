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

const PREVIEW_WIDTHS = {
  desktop: '100%',
  tablet: '768px',
  mobile: '390px',
} as const;

export const CanvasRenderer: FC = () => {
  const { document, selectElement, moveElementTo, activeBreakpoint } = useEditorStore();

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
        <div
          className="min-h-screen mx-auto transition-[max-width] duration-200"
          style={{
            maxWidth: PREVIEW_WIDTHS[activeBreakpoint],
            boxShadow:
              activeBreakpoint === 'desktop'
                ? 'none'
                : '0 0 0 1px #dcdcde, 0 4px 16px rgba(0,0,0,0.08)',
          }}
          onClick={handleBackgroundClick}
        >
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
