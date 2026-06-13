import React from 'react';
import type { BlockNode } from '@niyi-builder/core';
import { getBlockDefinition } from '@niyi-builder/blocks';
import { useEditorStore } from '../store.js';

/**
 * Recursively finds a block node by its ID within a document tree.
 */
function findBlockById(node: BlockNode, id: string): BlockNode | null {
  if (node.id === id) return node;
  for (const child of node.children) {
    const found = findBlockById(child, id);
    if (found) return found;
  }
  return null;
}

/**
 * The main inspector panel for editing block properties.
 * This component manages the specific inspector controls for the currently selected block.
 */
export function Inspector() {
  const selectedBlockId = useEditorStore((state) => state.selectedBlockId);
  const document = useEditorStore((state) => state.document);

  if (!selectedBlockId) {
    return <div className="niyi-editor__inspector p-4 text-gray-500 italic text-sm">No block selected.</div>;
  }

  const selectedBlock = findBlockById(document.root, selectedBlockId);

  const definition = selectedBlock ? getBlockDefinition(selectedBlock.type) : null;
  const InspectorComponent = (definition as any)?.Inspector;

  return (
    <aside className="niyi-editor__inspector w-80 border-l border-gray-200 bg-white overflow-y-auto" aria-label="Block settings">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-sm font-bold truncate">Settings for {definition?.label ?? 'Unknown'}</h3>
      </div>
      <div className="niyi-editor__inspector-body">
        {InspectorComponent && selectedBlock ? (
          <InspectorComponent node={selectedBlock} />
        ) : (
          <p className="p-4 text-xs text-gray-500 italic">No inspector controls for this block type.</p>
        )}
      </div>
    </aside>
  );
}

interface ParagraphInspectorProps {
  node: BlockNode;
}

/**
 * Provides inspector controls for the core/paragraph block.
 * This is where you'd implement tabs like "Content", "Style", "Advanced".
 */
export const ParagraphInspector: React.FC<ParagraphInspectorProps> = ({ node }) => {
  // Example of a simple tab system
  const [activeTab, setActiveTab] = React.useState('content');

  return (
    <div className="niyi-block-inspector">
      <div className="niyi-block-inspector__tabs">
        <button onClick={() => setActiveTab('content')} className={activeTab === 'content' ? 'is-active' : ''}>Content</button>
        <button onClick={() => setActiveTab('style')} className={activeTab === 'style' ? 'is-active' : ''}>Style</button>
      </div>
      <div className="niyi-block-inspector__tab-content">
        {activeTab === 'content' && (
          <label>Content: <input type="text" value={node.attributes.content as string || ''} onChange={() => { /* Update store */ }} /></label>
        )}
        {activeTab === 'style' && <p>Paragraph style settings...</p>}
      </div>
    </div>
  );
};