import React from 'react';
import type { BlockNode, BlockType } from '@niyi-builder/core';
import { getBlockDefinition } from '@niyi-builder/blocks';
import { useEditorStore } from '../store.js';
import AlignHorizontalLeftIcon from '@mui/icons-material/AlignHorizontalLeft';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import ViewStreamIcon from '@mui/icons-material/ViewStream';
import WrapTextIcon from '@mui/icons-material/WrapText';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TableChartIcon from '@mui/icons-material/TableChart';
import VerticalAlignTopIcon from '@mui/icons-material/VerticalAlignTop';
import VerticalAlignCenterIcon from '@mui/icons-material/VerticalAlignCenter';
import VerticalAlignBottomIcon from '@mui/icons-material/VerticalAlignBottom';

/**
 * Custom hook to access attribute updates from the store.
 * Assuming updateBlockAttributes exists in the store implementation.
 */
const useUpdateAttributes = () => useEditorStore((state: any) => state.updateBlockAttributes || state.updateAttributes);

/**
 * Recursively finds a block node by its ID within a document tree.
 */
function findBlockById(node: BlockNode, id: string): BlockNode | null {
  if (!node) return null;
  if (node.id === id) return node;
  if (!node.children) return null;
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

  // Fallback mapping to ensure specialized inspectors render even if registry linking is delayed
  let InspectorComponent = (definition as any)?.Inspector;

  if (!InspectorComponent && selectedBlock) {
    if (selectedBlock.type === 'core/group') {
      InspectorComponent = ContainerInspector;
    } else if (selectedBlock.type === 'core/paragraph') {
      InspectorComponent = ParagraphInspector;
    }
  }

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
  const updateBlockAttributes = useUpdateAttributes();
  const setChildren = useEditorStore((state: any) => state.setChildren);
  const attributes = node.attributes || {};
  const layoutType = attributes.layoutType as string;

  const setAttr = (key: string, value: any) => {
    updateBlockAttributes?.(node.id, { [key]: value });
  };

  const resetLayout = () => {
    updateBlockAttributes?.(node.id, {
      layoutType: undefined,
      direction: undefined,
      preset: undefined,
      wrap: undefined,
      columns: undefined,
      gapSize: undefined
    });
  };

  // Step 1: Layout Selection
  if (!layoutType) {
    return (
      <div className="p-6 space-y-6 bg-white h-full">
        <div className="text-center space-y-2">
          <h4 className="text-sm font-bold text-gray-800">Select Layout Type</h4>
          <p className="text-xs text-gray-400">Choose how you want to organize elements.</p>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <button
            type="button"
            onClick={() => setAttr('layoutType', 'flex')}
            className="flex flex-col items-center justify-center p-8 border-2 border-gray-100 rounded-2xl hover:border-blue-500 hover:bg-blue-50/30 transition-all text-center group shadow-sm hover:shadow-md"
          >
            <AlignHorizontalLeftIcon sx={{ fontSize: 48 }} className="text-gray-300 group-hover:text-blue-500 mb-4 transition-colors" />
            <div>
              <div className="text-sm font-bold text-gray-800">Flex Layout</div>
              <div className="text-[11px] text-gray-400 mt-1">Fluid rows or columns. Best for headers and simple lists.</div>
            </div>
          </button>
          <button
            type="button"
            onClick={() => setAttr('layoutType', 'grid')}
            className="flex flex-col items-center justify-center p-8 border-2 border-gray-100 rounded-2xl hover:border-blue-500 hover:bg-blue-50/30 transition-all text-center group shadow-sm hover:shadow-md"
          >
            <TableChartIcon sx={{ fontSize: 48 }} className="text-gray-300 group-hover:text-blue-500 mb-4 transition-colors" />
            <div>
              <div className="text-sm font-bold text-gray-800">Grid Layout</div>
              <div className="text-[11px] text-gray-400 mt-1">Structured columns and rows. Best for page sections and galleries.</div>
            </div>
          </button>
        </div>
      </div>
    );
  }

  const isUnconfigured = layoutType === 'flex' ? !attributes.direction : !attributes.columns;

  const applyPreset = (config: any, childCount: number = 0) => {
    updateBlockAttributes?.(node.id, { ...config, layoutType });

    if (childCount > 0 && setChildren) {
      const newChildren: BlockNode[] = Array.from({ length: childCount }).map((_, i) => ({
        id: `${node.id}-child-${Date.now()}-${i}`,
        type: 'core/group',
        attributes: { layoutType: 'flex', direction: 'column' },
        children: []
      }));
      setChildren(node.id, newChildren);
    }
  };

  // Step 2: Column / Structure Selection
  if (isUnconfigured) {
    return (
      <div className="p-4 space-y-6">
        <button
          type="button"
          onClick={resetLayout}
          className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-blue-600 font-bold uppercase tracking-wider"
        >
          <ArrowBackIcon sx={{ fontSize: 12 }} /> Back to Selection
        </button>

        <div className="text-center space-y-1">
          <h4 className="text-sm font-bold text-gray-800 uppercase tracking-tight">Select Structure</h4>
          <p className="text-[11px] text-gray-400 italic">Choose how many columns to start with.</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {layoutType === 'flex' ? (
            <>
              <button
                onClick={() => applyPreset({ direction: 'column' }, 1)}
                className="flex flex-col items-center gap-2 p-4 border rounded-xl hover:border-blue-500 hover:bg-blue-50/50 transition-all group"
              >
                <div className="w-full h-8 bg-gray-100 rounded group-hover:bg-blue-100" />
                <span className="text-[10px] font-bold text-gray-500">1 Column</span>
              </button>
              <button
                onClick={() => applyPreset({ direction: 'row', columns: 2 }, 2)}
                className="flex flex-col items-center gap-2 p-4 border rounded-xl hover:border-blue-500 hover:bg-blue-50/50 transition-all group"
              >
                <div className="w-full h-8 flex gap-1">
                  <div className="flex-1 bg-gray-100 rounded group-hover:bg-blue-100" />
                  <div className="flex-1 bg-gray-100 rounded group-hover:bg-blue-100" />
                </div>
                <span className="text-[10px] font-bold text-gray-500">2 Columns</span>
              </button>
              <button
                onClick={() => applyPreset({ direction: 'row', columns: 3 }, 3)}
                className="flex flex-col items-center gap-2 p-4 border rounded-xl hover:border-blue-500 hover:bg-blue-50/50 transition-all group"
              >
                <div className="w-full h-8 flex gap-1">
                  <div className="flex-1 bg-gray-100 rounded group-hover:bg-blue-100" />
                  <div className="flex-1 bg-gray-100 rounded group-hover:bg-blue-100" />
                  <div className="flex-1 bg-gray-100 rounded group-hover:bg-blue-100" />
                </div>
                <span className="text-[10px] font-bold text-gray-500">3 Columns</span>
              </button>
              <button
                onClick={() => applyPreset({ direction: 'row', columns: 4 }, 4)}
                className="flex flex-col items-center gap-2 p-4 border rounded-xl hover:border-blue-500 hover:bg-blue-50/50 transition-all group"
              >
                <div className="w-full h-8 flex gap-1">
                  <div className="flex-1 bg-gray-100 rounded group-hover:bg-blue-100" />
                  <div className="flex-1 bg-gray-100 rounded group-hover:bg-blue-100" />
                  <div className="flex-1 bg-gray-100 rounded group-hover:bg-blue-100" />
                  <div className="flex-1 bg-gray-100 rounded group-hover:bg-blue-100" />
                </div>
                <span className="text-[10px] font-bold text-gray-500">4 Columns</span>
              </button>
            </>
          ) : (
            <>
              {[2, 3, 4, 12].map(c => (
                <button
                  key={c}
                  onClick={() => applyPreset({ columns: c })}
                  className="flex flex-col items-center gap-2 p-4 border rounded-xl hover:border-blue-500 hover:bg-blue-50/50 transition-all group"
                >
                  <div className="w-full h-8 grid gap-0.5" style={{ gridTemplateColumns: `repeat(${Math.min(c, 6)}, 1fr)` }}>
                    {Array.from({ length: Math.min(c, 6) }).map((_, i) => (
                      <div key={i} className="bg-gray-100 rounded-sm group-hover:bg-blue-100" />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold text-gray-500">{c} Columns</span>
                </button>
              ))}
            </>
          )}
        </div>
      </div>
    );
  }

  // Step 3: Detailed Property Controls
  if (layoutType === 'flex') {
    const direction = attributes.direction || 'row';
    const wrap = attributes.wrap ?? true;
    const gapSize = attributes.gapSize || 'medium';
    const alignItems = attributes.alignItems || 'stretch';
    const justifyContent = attributes.justifyContent || 'start';

    return (
      <div className="p-4 space-y-8">
        <button
          type="button"
          onClick={resetLayout}
          className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-blue-600 font-bold uppercase tracking-wider"
        >
          <ArrowBackIcon sx={{ fontSize: 12 }} /> Back to Selection
        </button>

        <div className="space-y-3">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Orientation</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setAttr('direction', 'row')}
              className={`p-3 border-2 rounded-lg flex flex-col items-center gap-2 transition-all ${direction === 'row' ? 'border-blue-600 bg-blue-50' : 'border-gray-100 hover:border-gray-200'}`}
            >
              <ViewColumnIcon className={direction === 'row' ? 'text-blue-600' : 'text-gray-300'} />
              <span className={`text-[10px] font-bold ${direction === 'row' ? 'text-blue-600' : 'text-gray-500'}`}>Horizontal</span>
            </button>
            <button
              type="button"
              onClick={() => setAttr('direction', 'column')}
              className={`p-3 border-2 rounded-lg flex flex-col items-center gap-2 transition-all ${direction === 'column' ? 'border-blue-600 bg-blue-50' : 'border-gray-100 hover:border-gray-200'}`}
            >
              <ViewStreamIcon className={direction === 'column' ? 'text-blue-600' : 'text-gray-300'} />
              <span className={`text-[10px] font-bold ${direction === 'column' ? 'text-blue-600' : 'text-gray-500'}`}>Vertical</span>
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Alignment</label>
          <div className="flex bg-gray-50 p-1 rounded-lg">
            {[
              { id: 'start', icon: <VerticalAlignTopIcon fontSize="small" /> },
              { id: 'center', icon: <VerticalAlignCenterIcon fontSize="small" /> },
              { id: 'end', icon: <VerticalAlignBottomIcon fontSize="small" /> },
              { id: 'stretch', icon: <WrapTextIcon fontSize="small" className="rotate-90" /> }
            ].map(opt => (
              <button
                key={opt.id}
                onClick={() => setAttr('alignItems', opt.id)}
                className={`flex-1 flex justify-center py-1.5 rounded transition-all ${alignItems === opt.id ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400'}`}
              >
                {opt.icon}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Justification</label>
          <div className="flex bg-gray-50 p-1 rounded-lg">
            {[
              { id: 'start', icon: <AlignHorizontalLeftIcon fontSize="small" /> },
              { id: 'center', icon: <VerticalAlignCenterIcon fontSize="small" className="rotate-90" /> },
              { id: 'between', icon: <AlignHorizontalLeftIcon fontSize="small" className="rotate-180" /> }
            ].map(opt => (
              <button
                key={opt.id}
                onClick={() => setAttr('justifyContent', opt.id)}
                className={`flex-1 flex justify-center py-1.5 rounded transition-all ${justifyContent === opt.id ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400'}`}
              >
                {opt.icon}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Gap Spacing</label>
          <div className="grid grid-cols-3 gap-1 bg-gray-50 p-1 rounded-lg">
            {(['small', 'medium', 'large'] as const).map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setAttr('gapSize', size)}
                className={`py-1.5 text-[9px] font-bold uppercase tracking-tight rounded transition-all ${gapSize === size ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
          <div className="flex items-center gap-2">
            <WrapTextIcon sx={{ fontSize: 16 }} className="text-gray-400" />
            <span className="text-xs font-bold text-gray-700">Allow Wrap</span>
          </div>
          <button
            type="button"
            onClick={() => setAttr('wrap', !wrap)}
            className={`w-10 h-5 rounded-full relative transition-colors ${wrap ? 'bg-blue-600' : 'bg-gray-200'}`}
          >
            <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${wrap ? 'left-6' : 'left-1'}`} />
          </button>
        </div>
      </div>
    );
  }

  // Step 3: Grid Wizard
  if (layoutType === 'grid') {
    const cols = attributes.columns || 2;
    const gapSize = attributes.gapSize || 'medium';

    return (
      <div className="p-4 space-y-8">
        <button
          type="button"
          onClick={resetLayout}
          className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-blue-600 font-bold uppercase tracking-wider"
        >
          <ArrowBackIcon sx={{ fontSize: 12 }} /> Back to Selection
        </button>

        <div className="space-y-3">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Grid Columns</label>
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3, 4, 6, 12].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setAttr('columns', num)}
                className={`p-3 border-2 rounded-lg flex flex-col items-center gap-1 transition-all ${cols === num ? 'border-blue-600 bg-blue-50' : 'border-gray-100 hover:border-gray-200'}`}
              >
                <div className="grid gap-0.5 w-full h-4" style={{ gridTemplateColumns: `repeat(${Math.min(num, 6)}, 1fr)` }}>
                  {Array.from({ length: Math.min(num, 6) }).map((_, i) => <div key={i} className={`bg-current opacity-40 rounded-sm ${cols === num ? 'text-blue-600' : 'text-gray-300'}`} />)}
                </div>
                <span className={`text-[10px] font-bold ${cols === num ? 'text-blue-600' : 'text-gray-500'}`}>{num} Col</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Gap Spacing</label>
          <div className="flex p-1 bg-gray-100 rounded-lg">
            {(['small', 'medium', 'large'] as const).map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setAttr('gapSize', size)}
                className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-tight rounded-md transition-all ${gapSize === size ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 text-center">
      <p className="text-xs text-gray-400 italic">Please select an element.</p>
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
  const updateBlockAttributes = useUpdateAttributes();
  const content = (node.attributes.content as string) || '';

  const setAttr = (key: string, value: any) => {
    updateBlockAttributes?.(node.id, { [key]: value });
  };

  return (
    <div className="p-4 space-y-6">
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          Paragraph Text
        </label>
        <textarea
          value={content}
          onChange={(e) => setAttr('content', e.target.value)}
          rows={4}
          className="w-full text-sm border-gray-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 p-3 bg-gray-50 transition-all"
          placeholder="Enter paragraph text..."
        />
      </div>

      <p className="text-[10px] text-gray-400 italic leading-relaxed">
        Note: Style settings (typography, colors) will be available in the next sprint.
      </p>
    </div>
  );
};