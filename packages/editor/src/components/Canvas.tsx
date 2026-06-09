import type { BlockNode } from '@niyi-builder/core';
import { isStructuralDocumentRoot } from '@niyi-builder/serializer';

import { useEditorStore } from '../store.js';
import { BlockRenderer } from './BlockRenderer.js';

function countBlocks(node: BlockNode): number {
  return node.children.reduce((total, child) => total + 1 + countBlocks(child), 0);
}

export function Canvas() {
  const document = useEditorStore((state) => state.document);
  const device = useEditorStore((state) => state.device);
  const selectedBlockId = useEditorStore((state) => state.selectedBlockId);
  const selectBlock = useEditorStore((state) => state.selectBlock);
  const blockCount = countBlocks(document.root);
  const structuralRoot = isStructuralDocumentRoot(document.root);

  return (
    <main className="niyi-editor__canvas-wrap" aria-label="Builder canvas">
      <div className="niyi-editor__canvas" data-device={device}>
        <div
          className="niyi-editor__canvas-inner editor-styles-wrapper"
          onClick={() => selectBlock(null)}
        >
          <div className="is-root-container wp-block-post-content block-editor-block-list__layout">
            {blockCount === 0 ? (
              <p className="niyi-editor__canvas-empty">
                Empty page — click <strong>Add element</strong> in the toolbar to insert your first
                block.
              </p>
            ) : null}

            {structuralRoot
              ? document.root.children.map((child) => (
                  <BlockRenderer key={child.id} node={child} />
                ))
              : (
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
    </main>
  );
}
