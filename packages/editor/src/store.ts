import { createEmptyDocument, type BuilderDocument } from '@niyi-builder/core';
import { create } from 'zustand';

export type EditorDevice = 'desktop' | 'tablet' | 'mobile';

export interface EditorState {
  document: BuilderDocument;
  device: EditorDevice;
  selectedBlockId: string | null;
  setDocument: (document: BuilderDocument) => void;
  setDevice: (device: EditorDevice) => void;
  selectBlock: (blockId: string | null) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  document: createEmptyDocument(),
  device: 'desktop',
  selectedBlockId: null,
  setDocument: (document) => set({ document, selectedBlockId: null }),
  setDevice: (device) => set({ device }),
  selectBlock: (blockId) => set({ selectedBlockId: blockId }),
}));
