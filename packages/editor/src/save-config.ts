export interface BuilderSaveConfig {
  postId: number;
  postType: string;
  restPostUrl: string;
  nonce: string;
  isDevShell: boolean;
}

interface WindowWithBuilderConfig extends Window {
  niyiBuilderConfig?: {
    postId?: number;
    postType?: string;
    restPostUrl?: string;
    nonce?: string;
    isDevShell?: boolean;
  };
}

export function getBuilderSaveConfig(): BuilderSaveConfig | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const config = (window as WindowWithBuilderConfig).niyiBuilderConfig;

  if (!config || config.isDevShell) {
    return null;
  }

  const postId = config.postId ?? 0;
  const restPostUrl = config.restPostUrl?.trim() ?? '';
  const nonce = config.nonce?.trim() ?? '';

  if (postId <= 0 || restPostUrl === '' || nonce === '') {
    return null;
  }

  return {
    postId,
    postType: config.postType ?? 'post',
    restPostUrl,
    nonce,
    isDevShell: false,
  };
}
