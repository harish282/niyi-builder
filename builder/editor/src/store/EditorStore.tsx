import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { LeftPanelId, RightPanelId, ThemeMode } from '../types/index.js';
import type { BuilderDocument, ElementNode } from '@niyi-builder/core';
import { EventManager, generateId } from '@niyi-builder/core';

const eventManager = new EventManager();

const createEmptyDocument = (): BuilderDocument => ({
  id: generateId(),
  title: 'Untitled',
  elements: [],
});

interface EditorState {
  activeLeftPanel: LeftPanelId;
  activeRightPanel: RightPanelId;
  theme: ThemeMode;
  isLoading: boolean;
  document: BuilderDocument;
  selectedElementId: string | null;

  setActiveLeftPanel: (panel: LeftPanelId) => void;
  setActiveRightPanel: (panel: RightPanelId) => void;
  setTheme: (theme: ThemeMode) => void;
  setLoading: (loading: boolean) => void;
  setDocument: (document: BuilderDocument) => void;
  selectElement: (elementId: string | null) => void;
  addElement: (element: ElementNode) => void;
  updateElement: (elementId: string, updates: Partial<ElementNode>) => void;
}

const EditorContext = createContext<EditorState | null>(null);

export function EditorProvider({ children }: { children: ReactNode }) {
  const [document, setDocumentState] = useState<BuilderDocument>(createEmptyDocument);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [activeLeftPanel, setActiveLeftPanel] = useState<LeftPanelId>('elements');
  const [activeRightPanel, setActiveRightPanel] = useState<RightPanelId>('properties');
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [isLoading, setLoading] = useState(false);

  const selectElement = useCallback((elementId: string | null) => {
    setSelectedElementId(elementId);
    eventManager.emit('element.selected', { elementId });
  }, []);

  const addElement = useCallback((element: ElementNode) => {
    setDocumentState((prev) => ({
      ...prev,
      elements: [...prev.elements, element],
    }));
    eventManager.emit('element.created', { element });
  }, []);

  const updateElement = useCallback((elementId: string, updates: Partial<ElementNode>) => {
    setDocumentState((prev) => ({
      ...prev,
      elements: prev.elements.map((e) =>
        e.id === elementId ? { ...e, ...updates } : e
      ),
    }));
    eventManager.emit('element.updated', { elementId, updates });
  }, []);

  const setDocument = useCallback((doc: BuilderDocument) => {
    setDocumentState(doc);
  }, []);

  const state: EditorState = {
    activeLeftPanel,
    activeRightPanel,
    theme,
    isLoading,
    document,
    selectedElementId,
    setActiveLeftPanel,
    setActiveRightPanel,
    setTheme,
    setLoading,
    setDocument,
    selectElement,
    addElement,
    updateElement,
  };

  return <EditorContext.Provider value={state}>{children}</EditorContext.Provider>;
}

export function useEditorStore(): EditorState {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditorStore must be used within EditorProvider');
  }
  return context;
}
