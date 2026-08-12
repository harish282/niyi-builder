import type { EditorRuntimeConfig } from '@niyi-builder/editor';

export type NiyiBuilderConfig = EditorRuntimeConfig;

export function getBootstrapConfig(): NiyiBuilderConfig | undefined {
  return window.niyiBuilderConfig;
}

export async function initializeEditorFromBootstrap(): Promise<void> {
  // Logger is configured and document initialized via EditorProvider
}
