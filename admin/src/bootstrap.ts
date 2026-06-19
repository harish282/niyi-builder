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
  // Logger is configured and document initialized via EditorProvider
}
