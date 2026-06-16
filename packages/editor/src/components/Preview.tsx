import React from 'react';
import type { BlockNode } from '@niyi-builder/core';
import { useEditorStore, type EditorDevice } from '../store.js';
import AlignHorizontalLeftIcon from '@mui/icons-material/AlignHorizontalLeft';
import TableChartIcon from '@mui/icons-material/TableChart';

interface ParagraphPreviewProps {
  node: BlockNode;
  device: EditorDevice;
  renderChildren: () => React.ReactNode;
}

/**
 * Renders the core/paragraph block on the canvas.
 */
export const ParagraphPreview: React.FC<ParagraphPreviewProps> = ({ node }) => {
  // In a real implementation, you'd render the paragraph content based on node.attributes
  // and apply device-specific styles.
  return (
    <p
      className="p-3 border border-gray-100 rounded text-gray-700 bg-white"
    >
      {node.attributes.content as string || 'This is a paragraph block.'}
    </p>
  );
};

/**
 * Renders the Container (core/group) block on the canvas with dynamic layout logic.
 * Provides an interactive "setup" state for choosing Grid or Flex.
 */
export const ContainerPreview: React.FC<{
  node: BlockNode;
  device: EditorDevice;
  renderChildren: () => React.ReactNode;
}> = ({ node, renderChildren }) => {
  const updateBlockAttributes = useEditorStore((state: any) => state.updateBlockAttributes);
  const setChildren = useEditorStore((state: any) => state.setChildren);

  const layoutType = node.attributes.layoutType as string;
  const direction = node.attributes.direction as string || 'row';
  const wrap = node.attributes.wrap ?? true;
  const columns = node.attributes.columns as number || 2;
  const gapSize = node.attributes.gapSize as string || 'medium';
  const alignItems = node.attributes.alignItems as string || 'stretch';
  const justifyContent = node.attributes.justifyContent as string || 'start';

  const selectLayout = (type: string) => {
    updateBlockAttributes(node.id, { layoutType: type });
  };

  const applyPreset = (type: 'flex' | 'grid', config: any, childCount: number = 0) => {
    updateBlockAttributes(node.id, { ...config, layoutType: type });

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

  // Render placeholder if layout hasn't been chosen yet
  if (!layoutType) {
    return (
      <div className="p-12 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/30 flex flex-col items-center justify-center gap-8">
        <div className="text-center">
          <h3 className="text-lg font-bold text-gray-800">Choose your layout</h3>
          <p className="text-sm text-gray-500 mt-1">Select a starting point for your section</p>
        </div>

        <div className="flex gap-6 w-full max-w-2xl">
          <button
            onClick={() => selectLayout('flex')}
            className="flex-1 group p-6 bg-white border border-gray-200 rounded-2xl hover:border-blue-500 hover:shadow-xl transition-all text-center"
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-blue-50 rounded-full flex items-center justify-center group-hover:bg-blue-100 transition-colors">
              <AlignHorizontalLeftIcon className="text-blue-600" fontSize="large" />
            </div>
            <h4 className="font-bold text-gray-900">Flex Layout</h4>
            <p className="text-[11px] text-gray-500 mt-2 leading-relaxed">Best for rows, columns, and sections.</p>
          </button>

          <button
            onClick={() => selectLayout('grid')}
            className="flex-1 group p-6 bg-white border border-gray-200 rounded-2xl hover:border-blue-500 hover:shadow-xl transition-all text-center"
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-orange-50 rounded-full flex items-center justify-center group-hover:bg-orange-100 transition-colors">
              <TableChartIcon className="text-orange-600" fontSize="large" />
            </div>
            <h4 className="font-bold text-gray-900">Grid Layout</h4>
            <p className="text-[11px] text-gray-500 mt-2 leading-relaxed">Best for advanced grids and galleries.</p>
          </button>
        </div>
      </div>
    );
  }

  // Render Presets if no specific configuration is set yet (Step 2)
  const isUnconfigured = layoutType === 'flex' ? !node.attributes.direction : !node.attributes.columns;
  if (isUnconfigured) {
    return (
      <div className="p-8 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/30">
        <div className="text-center mb-6">
          <h4 className="text-sm font-bold text-gray-600 uppercase tracking-widest">Select Preset</h4>
        </div>
        <div className="grid grid-cols-4 gap-4 max-w-xl mx-auto">
          {layoutType === 'flex' ? (
            <>
              <button onClick={() => applyPreset('flex', { direction: 'column' }, 1)} className="p-4 bg-white border rounded-lg hover:border-blue-500 transition-all flex flex-col gap-2 items-center">
                <div className="w-full h-8 bg-gray-100 rounded-sm" />
                <span className="text-[10px] font-bold text-gray-400">1 Column</span>
              </button>
              <button onClick={() => applyPreset('flex', { direction: 'row', columns: 2 }, 2)} className="p-4 bg-white border rounded-lg hover:border-blue-500 transition-all flex flex-col gap-2 items-center">
                <div className="w-full h-8 flex gap-1"><div className="flex-1 bg-gray-100" /><div className="flex-1 bg-gray-100" /></div>
                <span className="text-[10px] font-bold text-gray-400">2 Columns</span>
              </button>
              <button onClick={() => applyPreset('flex', { direction: 'row', columns: 3 }, 3)} className="p-4 bg-white border rounded-lg hover:border-blue-500 transition-all flex flex-col gap-2 items-center">
                <div className="w-full h-8 flex gap-1"><div className="flex-1 bg-gray-100" /><div className="flex-1 bg-gray-100" /><div className="flex-1 bg-gray-100" /></div>
                <span className="text-[10px] font-bold text-gray-400">3 Columns</span>
              </button>
              <button onClick={() => applyPreset('flex', { direction: 'row', columns: 4 }, 4)} className="p-4 bg-white border rounded-lg hover:border-blue-500 transition-all flex flex-col gap-2 items-center">
                <div className="w-full h-8 flex gap-1"><div className="flex-1 bg-gray-100" /><div className="flex-1 bg-gray-100" /><div className="flex-1 bg-gray-100" /><div className="flex-1 bg-gray-100" /></div>
                <span className="text-[10px] font-bold text-gray-400">4 Columns</span>
              </button>
            </>
          ) : (
            <>
              {[2, 3, 4, 12].map(c => (
                <button key={c} onClick={() => applyPreset('grid', { columns: c })} className="p-4 bg-white border rounded-lg hover:border-blue-500 transition-all flex flex-col gap-2 items-center">
                  <div className="w-full h-8 grid gap-0.5" style={{ gridTemplateColumns: `repeat(${Math.min(c, 6)}, 1fr)` }}>
                    {Array.from({ length: Math.min(c, 6) }).map((_, i) => <div key={i} className="bg-gray-100" />)}
                  </div>
                  <span className="text-[10px] font-bold text-gray-400">{c} Columns</span>
                </button>
              ))}
            </>
          )}
        </div>
        <div className="mt-6 text-center">
          <button onClick={() => updateBlockAttributes(node.id, { layoutType: undefined })} className="text-[10px] font-bold text-blue-600 uppercase hover:underline">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Tailwind Mapping
  const classes = [];

  // Tailwind Mapping Objects (Ensures JIT compiler finds the strings)
  const directions: Record<string, string> = { row: 'flex-row', column: 'flex-col' };
  const gridCols: Record<number, string> = { 1: 'grid-cols-1', 2: 'grid-cols-2', 3: 'grid-cols-3', 4: 'grid-cols-4', 6: 'grid-cols-6', 12: 'grid-cols-12' };
  const gaps: Record<string, string> = { small: 'gap-2', medium: 'gap-4', large: 'gap-8' };

  const alignMap: Record<string, string> = { start: 'items-start', center: 'items-center', end: 'items-end', stretch: 'items-stretch' };
  const justifyMap: Record<string, string> = {
    start: 'justify-start', center: 'justify-center', end: 'justify-end',
    between: 'justify-between', around: 'justify-around'
  };

  // Base layout classes
  if (layoutType === 'flex') {
    classes.push('flex');
    classes.push(directions[direction] || 'flex-row');
    if (wrap) classes.push('flex-wrap');
    else classes.push('flex-nowrap');
  } else if (layoutType === 'grid') {
    classes.push('grid');
    classes.push(gridCols[columns] || 'grid-cols-2');
  }

  classes.push(gaps[gapSize] || 'gap-4');

  // Alignment
  classes.push(alignMap[alignItems] || 'items-stretch');
  classes.push(justifyMap[justifyContent] || 'justify-start');

  return (
    <div
      className={`niyi-container-preview min-h-[40px] w-full ${classes.join(' ')}`}
    >
      {renderChildren()}
    </div>
  );
};