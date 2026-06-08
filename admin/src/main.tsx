import { ensureDefaultBlocksRegistered } from '@niyi-builder/blocks';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { initializeEditorFromBootstrap } from './bootstrap';

ensureDefaultBlocksRegistered();
initializeEditorFromBootstrap();

const rootElement = document.getElementById('niyi-builder-root');

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
