import { ensureDefaultBlocksRegistered } from '@niyi-builder/blocks';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { initializeEditorFromBootstrap } from './bootstrap';
import { setupLogger } from './setup-logger';

async function boot(): Promise<void> {
  setupLogger();
  ensureDefaultBlocksRegistered();
  await initializeEditorFromBootstrap();

  const rootElement = document.getElementById('niyi-builder-root');

  if (rootElement) {
    createRoot(rootElement).render(
      <StrictMode>
        <App />
      </StrictMode>,
    );
  }
}

void boot();
