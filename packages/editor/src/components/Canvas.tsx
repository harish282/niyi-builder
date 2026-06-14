import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  type DragEndEvent,
  type DragStartEvent,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { BlockNode } from '@niyi-builder/core';
import { isStructuralDocumentRoot } from '@niyi-builder/serializer';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useState } from 'react';

import { findBlockById } from '../document-ops.js';
import { useEditorStore } from '../store.js';
import { BlockList } from './BlockList.js';
import { BlockRenderer } from './BlockRenderer.js';

function countBlocks(node: BlockNode): number {
  return node.children.reduce((total, child) => total + 1 + countBlocks(child), 0);
}

export function Canvas() {
  const document = useEditorStore((state) => state.document);
  const device = useEditorStore((state) => state.device);
  const selectedBlockId = useEditorStore((state) => state.selectedBlockId);
  const selectBlock = useEditorStore((state) => state.selectBlock);
  const reorderBlocks = useEditorStore((state) => state.reorderBlocks);
  const [activeId, setActiveId] = useState<string | null>(null);
  const blockCount = countBlocks(document.root);
  const structuralRoot = isStructuralDocumentRoot(document.root);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id));
    selectBlock(String(event.active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || active.id === over.id) {
      return;
    }

    reorderBlocks(String(active.id), String(over.id));
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const activeNode =
    activeId !== null ? findBlockById(document.root, activeId) : null;

  // Responsive widths for preview mode
  const containerMaxWidth = device === 'tablet' ? '768px' : device === 'mobile' ? '375px' : 'none';

  return (
    <main className="flex-1 overflow-y-auto p-8 bg-white" aria-label="Builder canvas">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className="flex flex-1 justify-stretch min-h-0">
          <div
            className="flex-1 w-full min-h-full bg-transparent editor-styles-wrapper"
            onClick={() => selectBlock(null)}
          >
            <div
              className="wp-block-post-content block-editor-block-list__layout"
              style={{
                maxWidth: containerMaxWidth,
                marginInline: 'auto',
                minHeight: 'calc(100vh - 48px)',
                padding: '2rem'
              }}
            >
              {blockCount === 0 ? (
                <p className="mb-4 font-semibold text-[#646970]">
                  Empty page — click <strong>Add element</strong> in the toolbar to insert your
                  first block.
                </p>
              ) : null}

              {structuralRoot ? (
                <BlockList parentId={document.root.id} blocks={document.root.children} />
              ) : (
                <BlockRenderer node={document.root} />
              )}

              {selectedBlockId ? (
                <p className="mt-6 p-2 border border-dashed border-gray-300 rounded bg-gray-50 text-[12px] text-gray-600" aria-live="polite">
                  Selected block: <code className="font-mono">{selectedBlockId}</code>
                </p>
              ) : null}
            </div>
          </div>
        </div>

        <DragOverlay dropAnimation={null}>
          {activeNode ? (
            <div className="niyi-sortable-block is-overlay">
              <BlockRenderer node={activeNode} isDragging />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </main>
  );
}
