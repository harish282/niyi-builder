import type { NiyiBuilderConfig } from './bootstrap.js';

interface WpRestPostContent {
  content?: {
    raw?: string;
  };
}

/** Load raw post_content via REST (avoids wp_localize_script size/escaping limits). */
export async function fetchPostContentRaw(config: NiyiBuilderConfig): Promise<string> {
  if (config.isDevShell || config.postId <= 0 || config.restPostUrl.trim() === '') {
    return config.content?.trim() ?? '';
  }

  const url = new URL(config.restPostUrl, window.location.origin);
  url.searchParams.set('context', 'edit');

  const response = await fetch(url.toString(), {
    credentials: 'same-origin',
    headers: {
      'X-WP-Nonce': config.nonce,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to load post content (${response.status})`);
  }

  const body = (await response.json()) as WpRestPostContent;
  const raw = body.content?.raw;

  if (typeof raw !== 'string') {
    return config.content?.trim() ?? '';
  }

  return raw;
}
