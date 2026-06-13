import React from 'react';
import { getRegisteredBlocks, type BlockDefinition } from '@niyi-builder/blocks';
import { useEditorStore } from '../store.js';
import type { BlockType } from '@niyi-builder/core';
import TextIcon from '@mui/icons-material/TextFields';
import HeadingIcon from '@mui/icons-material/Title';
import ButtonIcon from '@mui/icons-material/SmartButton';
import ImageIcon from '@mui/icons-material/Image';
import GridIcon from '@mui/icons-material/ViewQuilt';
import ContainerIcon from '@mui/icons-material/CropFree';
import SpacerIcon from '@mui/icons-material/ViewDay';

/**
 * Maps block types to their respective Material Icons.
 */
const ICON_MAP: Record<string, React.ReactNode> = {
  'core/paragraph': <TextIcon fontSize="small" />,
  'core/heading': <HeadingIcon fontSize="small" />,
  'core/button': <ButtonIcon fontSize="small" />,
  'core/image': <ImageIcon fontSize="small" />,
  'core/group': <ContainerIcon fontSize="small" />,
  'core/columns': <GridIcon fontSize="small" />,
  'core/spacer': <SpacerIcon fontSize="small" />,
};

const CATEGORY_LABELS: Record<string, string> = {
  layout: 'Layout',
  content: 'Basic',
};

export function Inserter() {
  const blocks = getRegisteredBlocks();
  const insertBlock = useEditorStore((state) => state.insertBlock);
  const isInserterOpen = useEditorStore((state) => state.isInserterOpen);

  if (!isInserterOpen) return null;

  // Group blocks by category
  const groupedBlocks = blocks.reduce((acc, block) => {
    const category = block.category || 'other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(block);
    return acc;
  }, {} as Record<string, BlockDefinition[]>);

  return (
    <aside className="niyi-editor__inserter" aria-label="Elements Palette">
      {Object.entries(groupedBlocks).map(([category, categoryBlocks]) => (
        <div key={category} className="niyi-editor__inserter-section">
          <h4 className="niyi-editor__inserter-category-title">
            {CATEGORY_LABELS[category] || category}
          </h4>
          <div className="niyi-editor__inserter-grid">
            {categoryBlocks.map((block) => (
              <button
                key={block.type}
                type="button"
                className="niyi-editor__inserter-item relative"
                onClick={() => insertBlock(block.type as BlockType)}
                title={block.label}
              >
                {(block as any).isPro && (
                  <span className="absolute top-1 right-1 bg-amber-500 text-white text-[8px] font-bold px-1 rounded-sm uppercase tracking-tighter shadow-sm">
                    Pro
                  </span>
                )}
                <div className="niyi-editor__inserter-icon">
                  {ICON_MAP[block.type] || <TextIcon fontSize="small" />}
                </div>
                <span className="niyi-editor__inserter-label">{block.label}</span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </aside>
  );
}