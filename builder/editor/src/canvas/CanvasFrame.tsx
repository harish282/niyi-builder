import { useEffect, useRef, type ReactElement, type ReactNode } from 'react';
import { getEditorRuntimeConfig, type CanvasStyles } from '../serialization/persistence.js';

/**
 * Minimal base styles for the canvas (mirrors Gutenberg's editor-styles-wrapper
 * so theme/block styles are applied on a clean surface). Rendered as a scoped
 * `<style>` tag so admin styles don't leak in.
 */
const CANVAS_RESET_STYLES = `
.niyi-canvas-editor {
  background: var(--wp--preset--color--base, #ffffff);
  color: var(--wp--preset--color--contrast, #1d2327);
  font-size: 16px;
  line-height: 1.6;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    'Helvetica Neue', Arial, sans-serif;
}
.niyi-canvas-editor .is-root-container {
  width: 100%;
  max-width: var(--wp--style--global--content-size, 840px);
  min-height: 100vh;
  margin: 0 auto;
  padding: 2rem;
  box-sizing: border-box;
}
`;

interface CanvasFrameProps {
  children: ReactNode;
}

/**
 * Injects theme stylesheet links + global-styles HTML into the main document
 * `<head>` (once) so the canvas preview matches the front-end. Cleanup removes
 * the injected elements on unmount.
 */
function useCanvasStyles(canvasStyles?: CanvasStyles): void {
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!canvasStyles) return;

    const head = document.head;
    const added: Element[] = [];

    for (const link of canvasStyles.links ?? []) {
      const existing = head.querySelector(`#${CSS.escape(link.id)}`);
      if (existing) continue;

      const el = document.createElement('link');
      el.rel = 'stylesheet';
      el.id = link.id;
      el.href = link.href;
      head.appendChild(el);
      added.push(el);
    }

    if (canvasStyles.html) {
      const marker = document.createElement('meta');
      marker.id = 'niyi-canvas-global-styles';
      marker.setAttribute('data-niyi', '');
      const template = document.createElement('template');
      template.innerHTML = canvasStyles.html;
      const frag = template.content.cloneNode(true);
      marker.appendChild(frag);
      head.appendChild(marker);
      added.push(marker);
    }

    cleanupRef.current = () => {
      for (const el of added) el.remove();
    };

    return () => {
      cleanupRef.current?.();
      cleanupRef.current = null;
    };
  }, [canvasStyles]);
}

/**
 * Renders the document tree inside a styled `<div>` (not an iframe) so that
 * native DOM events — including those used by dnd-kit — bubble through the
 * same document. Theme + block styles are injected into `<head>` and a scoped
 * reset isolates the canvas from WordPress admin styles.
 */
export function CanvasFrame({ children }: CanvasFrameProps): ReactElement {
  const config = getEditorRuntimeConfig();
  const canvasStyles = config?.canvasStyles;

  useCanvasStyles(canvasStyles);

  return (
    <div className="flex-1 min-h-0 overflow-auto bg-white">
      <style dangerouslySetInnerHTML={{ __html: CANVAS_RESET_STYLES }} />
      <div className="niyi-canvas-editor editor-styles-wrapper">
        <div className="is-root-container">{children}</div>
      </div>
    </div>
  );
}
