import type { BlockNode } from '@niyi-builder/core';

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

  return (
    <main className="niyi-editor__canvas-wrap" aria-label="Builder canvas">
      <div className="niyi-editor__canvas" data-device={device}>
        <div className="niyi-editor__canvas-inner" onClick={() => selectBlock(null)}>
          {blockCount === 0 ? (
            <p className="niyi-editor__canvas-empty">
              Empty page — use <strong>Add element</strong> (coming next) to insert blocks.
            </p>
          ) : null}

          <BlockRenderer node={document.root} />

          {selectedBlockId ? (
            <p className="niyi-editor__selection-hint" aria-live="polite">
              Selected block: <code>{selectedBlockId}</code>
            </p>
          ) : null}
        </div>
      </div>
    </main>
  );
}
