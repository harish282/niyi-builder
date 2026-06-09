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

  return (
    <main className="niyi-editor__canvas-wrap" aria-label="Builder canvas">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className="niyi-editor__canvas" data-device={device}>
          <div
            className="niyi-editor__canvas-inner editor-styles-wrapper"
            onClick={() => selectBlock(null)}
          >
            <div className="is-root-container wp-block-post-content block-editor-block-list__layout">
              {blockCount === 0 ? (
                <p className="niyi-editor__canvas-empty">
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
                <p className="niyi-editor__selection-hint" aria-live="polite">
                  Selected block: <code>{selectedBlockId}</code>
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
