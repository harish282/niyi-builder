import { createContext, useContext, type ReactNode } from 'react';
import type { LeftPanelId, RightPanelId, ThemeMode } from '../types/index.js';

interface EditorState {
    activeLeftPanel: LeftPanelId;
    activeRightPanel: RightPanelId;
    theme: ThemeMode;
    isLoading: boolean;
    
    setActiveLeftPanel: (panel: LeftPanelId) => void;
    setActiveRightPanel: (panel: RightPanelId) => void;
    toggleTheme: () => void;
    setLoading: (loading: boolean) => void;
}

const EditorContext = createContext<EditorState | null>(null);

export function EditorProvider({ children }: { children: ReactNode }) {
    const state: EditorState = {
        activeLeftPanel: 'elements',
        activeRightPanel: 'properties',
        theme: 'light',
        isLoading: false,
        
        setActiveLeftPanel(panel: LeftPanelId) {
            state.activeLeftPanel = panel;
        },
        
        setActiveRightPanel(panel: RightPanelId) {
            state.activeRightPanel = panel;
        },
        
        toggleTheme() {
            state.theme = state.theme === 'light' ? 'dark' : 'light';
        },
        
        setLoading(loading: boolean) {
            state.isLoading = loading;
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