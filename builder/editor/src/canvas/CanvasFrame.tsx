import { useEffect, useRef, useState, type ReactElement, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { getEditorRuntimeConfig, type CanvasStyles } from '../serialization/persistence.js';

/**
 * Minimal base styles for the canvas document (mirrors Gutenberg's
 * editor-styles-wrapper so theme/block styles are applied on a clean body).
 */
const FRAME_RESET_STYLES = `
html {
  -webkit-text-size-adjust: 100%;
}
html,
body {
  margin: 0;
  padding: 0;
}
body {
  background: var(--wp--preset--color--base, #ffffff);
  color: var(--wp--preset--color--contrast, #1d2327);
  font-size: 16px;
  line-height: 1.6;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    'Helvetica Neue', Arial, sans-serif;
}
.is-root-container {
  width: 100%;
  max-width: none;
  min-height: 100vh;
  margin: 0 auto;
  padding: 2rem;
  box-sizing: border-box;
}
`;

interface CanvasFrameProps {
  children: ReactNode;
}

function injectFrameHead(document_: Document, canvasStyles?: CanvasStyles): void {
  const head = document_.head;

  head.innerHTML = '';

  const meta = document_.createElement('meta');
  meta.setAttribute('charset', 'utf-8');
  head.appendChild(meta);

  const viewport = document_.createElement('meta');
  viewport.setAttribute('name', 'viewport');
  viewport.setAttribute('content', 'width=device-width, initial-scale=1');
  head.appendChild(viewport);

  for (const link of canvasStyles?.links ?? []) {
    const element = document_.createElement('link');
    element.rel = 'stylesheet';
    element.id = link.id;
    element.href = link.href;
    head.appendChild(element);
  }

  if (canvasStyles?.html) {
    const wrapper = document_.createElement('template');
    wrapper.innerHTML = canvasStyles.html;
    head.appendChild(wrapper.content);
  }

  const reset = document_.createElement('style');
  reset.id = 'niyi-canvas-reset';
  reset.textContent = FRAME_RESET_STYLES;
  head.appendChild(reset);
}

/**
 * Renders the document tree inside a same-origin iframe (like the native
 * Gutenberg canvas) and injects block-library + theme + global styles into it,
 * so the preview matches the front-end instead of the admin UI.
 */
export function CanvasFrame({ children }: CanvasFrameProps): ReactElement {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [frameDocument, setFrameDocument] = useState<Document | null>(null);

  const config = getEditorRuntimeConfig();
  const canvasStyles = config?.canvasStyles;

  useEffect(() => {
    const frame = iframeRef.current;

    if (!frame) {
      return;
    }

    const document_ = frame.contentDocument;

    if (!document_) {
      return;
    }

    document_.open();
    document_.write(
      '<!DOCTYPE html><html><head></head><body class="editor-styles-wrapper"></body></html>',
    );
    document_.close();

    setFrameDocument(document_);
  }, []);

  useEffect(() => {
    if (frameDocument) {
      injectFrameHead(frameDocument, canvasStyles);
    }
  }, [frameDocument, canvasStyles]);

  return (
    <div className="flex-1 min-h-0 overflow-auto bg-white">
      <iframe
        ref={iframeRef}
        title="Niyi Builder canvas"
        sandbox="allow-same-origin"
        className="w-full h-full min-h-[400px] border-0 block"
      />
      {frameDocument !== null &&
        createPortal(<div className="is-root-container">{children}</div>, frameDocument.body)}
    </div>
  );
}
