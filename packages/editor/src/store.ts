import { createEmptyDocument, type BuilderDocument } from '@niyi-builder/core';
import { create } from 'zustand';

export type EditorDevice = 'desktop' | 'tablet' | 'mobile';

export interface EditorState {
  document: BuilderDocument;
  device: EditorDevice;
  setDocument: (document: BuilderDocument) => void;
  setDevice: (device: EditorDevice) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  document: createEmptyDocument(),
  device: 'desktop',
  setDocument: (document) => set({ document }),
  setDevice: (device) => set({ device }),
}));
