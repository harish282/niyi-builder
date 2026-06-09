import { createBlockNode } from '@niyi-builder/blocks';
import { createEmptyDocument, type BlockType, type BuilderDocument } from '@niyi-builder/core';
import { create } from 'zustand';

import { savePostToWordPress } from './api.js';
import { insertChild, reorderSiblings, resolveInsertParentId } from './document-ops.js';
import { getBuilderSaveConfig } from './save-config.js';

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
  reorderBlocks: (activeId: string, overId: string) => void;
  saveDocument: () => Promise<boolean>;
  saveBeforeEditorSwitch: () => Promise<boolean>;
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
  reorderBlocks: (activeId, overId) => {
    const state = get();
    const reordered = reorderSiblings(state.document, activeId, overId);

    if (reordered === null) {
      return;
    }

    set({
      document: reordered,
      selectedBlockId: activeId,
      isDirty: true,
      saveStatus: null,
      saveError: null,
    });
  },
  saveDocument: async () => {
    const state = get();
    const saveConfig = getBuilderSaveConfig();

    if (!saveConfig || state.isSaving) {
      return false;
    }

    set({ isSaving: true, saveStatus: null, saveError: null });

    try {
      const result = await savePostToWordPress(state.document, saveConfig);

      if (!result.success) {
        throw new Error(result.message);
      }

      set({ isSaving: false, isDirty: false, saveStatus: 'saved' });

      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Save failed.';

      set({
        isSaving: false,
        saveStatus: 'error',
        saveError: message,
      });

      return false;
    }
  },
  saveBeforeEditorSwitch: async () => {
    const state = get();

    if (!state.isDirty) {
      return true;
    }

    return get().saveDocument();
  },
  clearSaveFeedback: () => set({ saveStatus: null, saveError: null }),
}));
