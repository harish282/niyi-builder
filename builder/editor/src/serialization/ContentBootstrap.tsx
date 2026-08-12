import { useEffect } from 'react';
import { useEditorStore } from '../store/EditorStore.js';
import { getEditorRuntimeConfig, loadPostContent, parseEditorDocument } from './index.js';

/**
 * Hydrates the editor document from the post's Gutenberg content once on mount,
 * so returning from the block editor round-trips through the serializer.
 */
export function ContentBootstrap(): null {
  const { setDocument } = useEditorStore();

  useEffect(() => {
    const config = getEditorRuntimeConfig();

    if (!config) {
      return;
    }

    let cancelled = false;

    void (async () => {
      try {
        const html = await loadPostContent(config);

        if (!cancelled && html.trim().length > 0) {
          setDocument(parseEditorDocument(html));
        }
      } catch (error) {
        console.error('[niyi-builder] Failed to load post content:', error);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [setDocument]);

  return null;
}
