import {
  createEmptyDocument,
  logger,
  summarizeDocument,
  type BuilderDocument,
} from '@niyi-builder/core';
import { useEditorStore } from '@niyi-builder/editor';
import { ensureDefaultBlocksRegistered } from '@niyi-builder/blocks';
import { parseFromGutenberg } from '@niyi-builder/serializer';

import { fetchPostContentRaw } from './load-content.js';

export interface NiyiBuilderConfig {
  postId: number;
  postType: string;
  postTitle: string;
  restUrl: string;
  restPostUrl: string;
  nonce: string;
  content: string;
  exitUrl: string;
  isDevShell: boolean;
  loggingEnabled: boolean;
}

declare global {
  interface Window {
    niyiBuilderConfig?: NiyiBuilderConfig;
  }
}

export function getBootstrapConfig(): NiyiBuilderConfig | undefined {
  return window.niyiBuilderConfig;
}

function logLoadedDocument(
  document: BuilderDocument,
  meta: {
    postId: number;
    postType: string;
    source: 'inline' | 'rest';
    markupLength: number;
  },
): void {
  logger.info('Loaded builder document', {
    postId: meta.postId,
    postType: meta.postType,
    source: meta.source,
    markupLength: meta.markupLength,
    version: document.version,
    rootType: document.root.type,
    topLevelBlockCount: document.root.children.length,
  });
  logger.debug('Loaded content tree', summarizeDocument(document));
}

export async function initializeEditorFromBootstrap(): Promise<void> {
  // Ensure the block registry is populated before we try to render or parse.
  ensureDefaultBlocksRegistered();

  const config = getBootstrapConfig();
  let content = config?.content?.trim() ?? '';
  let source: 'inline' | 'rest' = 'inline';

  if (config && !config.isDevShell) {
    try {
      content = (await fetchPostContentRaw(config)).trim();
      source = 'rest';
    } catch (error) {
      logger.warn('REST content load failed; using inline bootstrap.', error);
    }
  }

  if (!content) {
    const empty = createEmptyDocument();
    useEditorStore.getState().setDocument(empty, { clean: true });
    logger.info('Loaded empty builder document', {
      postId: config?.postId ?? 0,
      postType: config?.postType ?? '',
      reason: 'no post content',
    });
    logger.debug('Loaded content tree', summarizeDocument(empty));

    return;
  }

  try {
    const document = parseFromGutenberg(content);
    useEditorStore.getState().setDocument(document, { clean: true });
    logLoadedDocument(document, {
      postId: config?.postId ?? 0,
      postType: config?.postType ?? '',
      source,
      markupLength: content.length,
    });
  } catch (error) {
    logger.error('Failed to parse Gutenberg markup.', error);
    const empty = createEmptyDocument();
    useEditorStore.getState().setDocument(empty, { clean: true });
    logger.debug('Loaded content tree', summarizeDocument(empty));
  }
}
