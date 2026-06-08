import { createEmptyDocument } from '@niyi-builder/core';
import { useEditorStore } from '@niyi-builder/editor';
import { parseFromGutenberg } from '@niyi-builder/serializer';

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
}

declare global {
  interface Window {
    niyiBuilderConfig?: NiyiBuilderConfig;
  }
}

export function getBootstrapConfig(): NiyiBuilderConfig | undefined {
  return window.niyiBuilderConfig;
}

export function initializeEditorFromBootstrap(): void {
  const config = getBootstrapConfig();
  const content = config?.content?.trim() ?? '';

  if (!content) {
    useEditorStore.getState().setDocument(createEmptyDocument(), { clean: true });

    return;
  }

  try {
    useEditorStore.getState().setDocument(parseFromGutenberg(content), { clean: true });
  } catch {
    useEditorStore.getState().setDocument(createEmptyDocument(), { clean: true });
  }
}
