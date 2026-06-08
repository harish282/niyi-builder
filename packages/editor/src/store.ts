import { createBlockNode } from '@niyi-builder/blocks';
import { createEmptyDocument, type BlockType, type BuilderDocument } from '@niyi-builder/core';
import { create } from 'zustand';

import { insertChild, resolveInsertParentId } from './document-ops.js';

export type EditorDevice = 'desktop' | 'tablet' | 'mobile';

export interface EditorState {
  document: BuilderDocument;
  device: EditorDevice;
  selectedBlockId: string | null;
  isInserterOpen: boolean;
  setDocument: (document: BuilderDocument) => void;
  setDevice: (device: EditorDevice) => void;
  selectBlock: (blockId: string | null) => void;
  toggleInserter: (open?: boolean) => void;
  insertBlock: (blockType: BlockType) => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  document: createEmptyDocument(),
  device: 'desktop',
  selectedBlockId: null,
  isInserterOpen: false,
  setDocument: (document) => set({ document, selectedBlockId: null }),
  setDevice: (device) => set({ device }),
  selectBlock: (blockId) => set({ selectedBlockId: blockId }),
  toggleInserter: (open) =>
    set((state) => ({
      isInserterOpen: typeof open === 'boolean' ? open : !state.isInserterOpen,
    })),
  insertBlock: (blockType) => {
    const state = get();
    const parentId = resolveInsertParentId(state.document.root, state.selectedBlockId);
    const newBlock = createBlockNode(blockType);

    set({
      document: insertChild(state.document, parentId, newBlock),
      selectedBlockId: newBlock.id,
      isInserterOpen: false,
    });
  },
}));
