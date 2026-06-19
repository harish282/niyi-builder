import {
  createEmptyDocument,
  logger,
} from '@niyi-builder/core';
import { useEditorStore } from '@niyi-builder/editor';

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

export async function initializeEditorFromBootstrap(): Promise<void> {
  const config = getBootstrapConfig();
  
  if (!config || config.isDevShell) {
    const empty = createEmptyDocument();
    useEditorStore.getState().setDocument(empty);
    logger.info('Loaded empty builder document');
    return;
  }

  try {
    const content = (await fetchPostContentRaw(config)).trim();
    const document = createEmptyDocument();
    useEditorStore.getState().setDocument(document);
    logger.info('Loaded builder document', { contentLength: content.length });
  } catch (error) {
    logger.error('Failed to load content.', error);
    const empty = createEmptyDocument();
    useEditorStore.getState().setDocument(empty);
  }
}
