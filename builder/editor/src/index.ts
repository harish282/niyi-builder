// Standalone store for Sprint 2 verification
import type { ThemeMode, LeftPanelId, RightPanelId } from './types/index.js';

const editorState = {
    activeLeftPanel: 'elements' as LeftPanelId,
    activeRightPanel: 'properties' as RightPanelId,
    theme: 'light' as ThemeMode
};

export function setActiveLeftPanel(panel: LeftPanelId): void {
    editorState.activeLeftPanel = panel;
}

export function setActiveRightPanel(panel: RightPanelId): void {
    editorState.activeRightPanel = panel;
}

export function toggleTheme(): void {
    editorState.theme = editorState.theme === 'light' ? 'dark' : 'light';
}

export { App } from './App.js';
export { EditorLayout } from './layouts/EditorLayout.js';
export { TopBar } from './toolbar/TopBar.js';
export { Canvas } from './canvas/Canvas.js';
export { StatusBar } from './status-bar/StatusBar.js';
export { ElementsPanel } from './panels/ElementsPanel.js';
export { PropertiesPanel } from './panels/PropertiesPanel.js';
export { NavigatorPanel } from './panels/NavigatorPanel.js';
export { SettingsPanel } from './panels/SettingsPanel.js';
export { ThemeProvider, useTheme } from './theme/ThemeProvider.js';
export { useEditorStore, EditorProvider } from './store/EditorStore.js';
export { PanelRegistry } from './panels/PanelRegistry.js';
export type { PanelDefinition } from './types/index.js';
export type { ThemeMode } from './types/index.js';
export type { LeftPanelId } from './types/index.js';
export type { RightPanelId } from './types/index.js';