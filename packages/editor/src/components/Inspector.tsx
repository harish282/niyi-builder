import React from 'react';
import type { BlockNode } from '@niyi-builder/core';
import { getBlockDefinition } from '@niyi-builder/blocks';
import { useEditorStore } from '../store.js';
import GridViewIcon from '@mui/icons-material/GridView';
import AlignHorizontalLeftIcon from '@mui/icons-material/AlignHorizontalLeft';
import AlignVerticalTopIcon from '@mui/icons-material/AlignVerticalTop';

/**
 * Custom hook to access attribute updates from the store.
 * Assuming updateBlockAttributes exists in the store implementation.
 */
const useUpdateAttributes = () => useEditorStore((state: any) => state.updateBlockAttributes);

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

  const selectedBlock = selectedBlockId ? findBlockById(document.root, selectedBlockId) : null;
  const definition = selectedBlock ? getBlockDefinition(selectedBlock.type) : null;
  const InspectorComponent = (definition as any)?.Inspector;

  return (
    <aside className="niyi-editor__inspector w-80 flex-shrink-0 border-l border-gray-200 bg-white overflow-y-auto" aria-label="Block settings">
      {!selectedBlockId ? (
        <div className="p-8 text-center">
          <p className="text-gray-400 text-xs italic">Select an element to edit its properties.</p>
        </div>
      ) : (
        <>
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
        </>
      )}
    </aside>
  );
}

/**
 * Advanced inspector controls for the Container (core/group) block.
 * Follows Elementor layout patterns and Tailwind CSS properties.
 */
export const ContainerInspector: React.FC<{ node: BlockNode }> = ({ node }) => {
  const [activeTab, setActiveTab] = React.useState('layout');
  const updateBlockAttributes = useUpdateAttributes();

  const attributes = node.attributes || {};
  const display = (attributes.display as string) || 'flex';
  const direction = (attributes.direction as string) || 'row';
  const justify = (attributes.justify as string) || 'start';
  const align = (attributes.align as string) || 'stretch';
  const gap = (attributes.gap as number) || 0;
  const columns = (attributes.columns as number) || 3;

  const setAttr = (key: string, value: any) => {
    updateBlockAttributes?.(node.id, { [key]: value });
  };

  // 1. If layout hasn't been chosen yet, ask Grid or Flex in the right side settings
  if (!display) {
    return (
      <div className="p-6 space-y-6 bg-white h-full">
        <div className="text-center space-y-2">
          <h4 className="text-sm font-bold text-gray-800">Layout Required</h4>
          <p className="text-xs text-gray-400">Choose a layout structure to begin.</p>
        </div>
        <div className="grid grid-cols-1 gap-3">
          <button
            onClick={() => setAttr('display', 'flex')}
            className="flex items-center justify-between px-4 py-4 border-2 border-gray-100 rounded-xl hover:border-blue-500 hover:bg-blue-50/30 transition-all text-left group"
          >
            <div>
              <div className="text-xs font-bold">Flexbox</div>
              <div className="text-[10px] text-gray-400">Align items in rows or columns</div>
            </div>
            <AlignHorizontalLeftIcon className="text-gray-300" />
          </button>
          <button
            onClick={() => setAttr('display', 'grid')}
            className="flex items-center justify-between px-4 py-4 border-2 border-gray-100 rounded-xl hover:border-blue-500 hover:bg-blue-50/30 transition-all text-left group"
          >
            <div>
              <div className="text-xs font-bold">Grid</div>
              <div className="text-[10px] text-gray-400">Create complex multi-column layouts</div>
            </div>
            <GridViewIcon className="text-gray-300" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="niyi-block-inspector">
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setAttr('display', '')}
          className="px-3 text-gray-400 hover:text-red-500 transition-colors border-r border-gray-100"
          title="Reset Layout"
        >
          <GridViewIcon sx={{ fontSize: 14 }} />
        </button>
        {['layout', 'style'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider transition-colors ${
              activeTab === tab ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="p-4 space-y-6">
        {activeTab === 'layout' && (
          <>
            {/* Display Mode Toggle */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Container Type</label>
              <div className="grid grid-cols-2 gap-1 bg-gray-100 p-1 rounded-md">
                <button
                  onClick={() => setAttr('display', 'flex')}
                  className={`flex items-center justify-center gap-2 py-1.5 text-xs rounded shadow-sm transition-all ${display === 'flex' ? 'bg-white text-blue-600 font-bold' : 'text-gray-500'}`}
                >
                  <AlignHorizontalLeftIcon sx={{ fontSize: 14 }} /> Flex
                </button>
                <button
                  onClick={() => setAttr('display', 'grid')}
                  className={`flex items-center justify-center gap-2 py-1.5 text-xs rounded shadow-sm transition-all ${display === 'grid' ? 'bg-white text-blue-600 font-bold' : 'text-gray-500'}`}
                >
                  <GridViewIcon sx={{ fontSize: 14 }} /> Grid
                </button>
              </div>
            </div>

            {display === 'flex' ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Flex Direction</label>
                  <div className="flex gap-2">
                    <button onClick={() => setAttr('direction', 'row')} className={`flex-1 p-2 border rounded ${direction === 'row' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'}`}><AlignHorizontalLeftIcon /></button>
                    <button onClick={() => setAttr('direction', 'col')} className={`flex-1 p-2 border rounded ${direction === 'col' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'}`}><AlignVerticalTopIcon /></button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Row Alignment (Justify)</label>
                  <select
                    value={justify}
                    onChange={(e) => setAttr('justify', e.target.value)}
                    className="w-full text-sm border-gray-300 rounded-md"
                  >
                    <option value="start">Start</option>
                    <option value="center">Center</option>
                    <option value="end">End</option>
                    <option value="between">Space Between</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Col Alignment (Align)</label>
                  <select
                    value={align}
                    onChange={(e) => setAttr('align', e.target.value)}
                    className="w-full text-sm border-gray-300 rounded-md"
                  >
                    <option value="stretch">Stretch</option>
                    <option value="start">Start</option>
                    <option value="center">Center</option>
                    <option value="end">End</option>
                    <option value="baseline">Baseline</option>
                  </select>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Grid Columns</label>
                  <input
                    type="range" min="1" max="12"
                    value={columns}
                    onChange={(e) => setAttr('columns', parseInt(e.target.value))}
                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="text-right text-[10px] font-mono text-gray-500">{columns} Columns</div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Gap (px)</label>
              <input
                type="number"
                value={gap}
                onChange={(e) => setAttr('gap', parseInt(e.target.value))}
                className="w-full text-sm border-gray-300 rounded-md"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

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