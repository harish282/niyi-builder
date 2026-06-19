import { createContext, useContext, type ReactNode } from 'react';
import type { LeftPanelId, RightPanelId, ThemeMode } from '../types/index.js';
import type { BuilderDocument, ElementNode } from '@niyi-builder/core';

const createEmptyDocument = (): BuilderDocument => ({
    id: crypto.randomUUID(),
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
    const state: EditorState = {
        activeLeftPanel: 'elements',
        activeRightPanel: 'properties',
        theme: 'light',
        isLoading: false,
        document: createEmptyDocument(),
        selectedElementId: null,
        
        setActiveLeftPanel(panel: LeftPanelId) {
            state.activeLeftPanel = panel;
        },
        
        setActiveRightPanel(panel: RightPanelId) {
            state.activeRightPanel = panel;
        },
        
        setTheme(theme: ThemeMode) {
            state.theme = theme;
        },
        
        setLoading(loading: boolean) {
            state.isLoading = loading;
        },
        
        setDocument(document: BuilderDocument) {
            state.document = document;
        },
        
        selectElement(elementId: string | null) {
            state.selectedElementId = elementId;
        },
        
        addElement(element: ElementNode) {
            state.document.elements.push(element);
        },
        
        updateElement(elementId: string, updates: Partial<ElementNode>) {
            const element = state.document.elements.find(e => e.id === elementId);
            if (element) {
                Object.assign(element, updates);
            }
        }
    };

    return (
        <EditorContext.Provider value={state}>
            {children}
        </EditorContext.Provider>
    );
}

export function useEditorStore(): EditorState {
    const context = useContext(EditorContext);
    if (!context) {
        throw new Error('useEditorStore must be used within EditorProvider');
    }
    return context;
}