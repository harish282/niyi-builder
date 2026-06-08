import { createBlockNode } from '@niyi-builder/blocks';
import { createEmptyDocument, type BlockType, type BuilderDocument } from '@niyi-builder/core';
import { create } from 'zustand';

import { insertChild, resolveInsertParentId } from './document-ops.js';
import { getBuilderSaveConfig } from './save-config.js';
import { saveBuilderDocument } from './save-document.js';

export type EditorDevice = 'desktop' | 'tablet' | 'mobile';
export type SaveStatus = 'saved' | 'error' | null;

interface SetDocumentOptions {
  /** Mark the document as matching persisted post content (default: false). */
  clean?: boolean;
}

export interface EditorState {
  document: BuilderDocument;
  device: EditorDevice;
  selectedBlockId: string | null;
  isInserterOpen: boolean;
  isDirty: boolean;
  isSaving: boolean;
  saveStatus: SaveStatus;
  saveError: string | null;
  setDocument: (document: BuilderDocument, options?: SetDocumentOptions) => void;
  setDevice: (device: EditorDevice) => void;
  selectBlock: (blockId: string | null) => void;
  toggleInserter: (open?: boolean) => void;
  insertBlock: (blockType: BlockType) => void;
  saveDocument: () => Promise<void>;
  clearSaveFeedback: () => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  document: createEmptyDocument(),
  device: 'desktop',
  selectedBlockId: null,
  isInserterOpen: false,
  isDirty: false,
  isSaving: false,
  saveStatus: null,
  saveError: null,
  setDocument: (document, options) =>
    set({
      document,
      selectedBlockId: null,
      isDirty: !(options?.clean ?? false),
      saveStatus: null,
      saveError: null,
    }),
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
      isDirty: true,
      saveStatus: null,
      saveError: null,
    });
  },
  saveDocument: async () => {
    const state = get();
    const saveConfig = getBuilderSaveConfig();

    if (!saveConfig || state.isSaving || !state.isDirty) {
      return;
    }

    set({ isSaving: true, saveStatus: null, saveError: null });

    try {
      await saveBuilderDocument(saveConfig, state.document);
      set({ isSaving: false, isDirty: false, saveStatus: 'saved' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Save failed.';

      set({
        isSaving: false,
        saveStatus: 'error',
        saveError: message,
      });
    }
  },
  clearSaveFeedback: () => set({ saveStatus: null, saveError: null }),
}));
