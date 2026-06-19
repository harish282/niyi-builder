// Import global styles (includes Tailwind and LESS)
import '../../styles/main.less';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { initializeEditorFromBootstrap } from './bootstrap';
import { setupLogger } from './setup-logger';

async function boot(): Promise<void> {
  setupLogger();
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
