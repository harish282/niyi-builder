import type { ReactElement } from 'react';
import { EditorLayout } from './layouts/EditorLayout.js';
import { ThemeProvider } from './theme/ThemeProvider.js';
import { EditorProvider, useEditorStore } from './store/EditorStore.js';

export function App(): ReactElement {
    return (
        <EditorProvider>
            <ThemeProvider>
                <EditorLayout />
            </ThemeProvider>
        </EditorProvider>
    );
}

export { useEditorStore };