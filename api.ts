import { serializeToGutenberg } from '@niyi-builder/serializer';
import { type BuilderDocument } from '@niyi-builder/core';

interface SaveResponse {
  success: boolean;
  message?: string;
}

export async function savePostToWordPress(
  document: BuilderDocument,
  config: {
    restUrl: string;
    postId: number;
    postType: string;
    nonce: string;
  }
): Promise<SaveResponse> {
  const content = serializeToGutenberg(document);

  // Map postType to the correct REST base (e.g., 'page' -> 'pages')
  const restBase = config.postType === 'page' ? 'pages' : 'posts';
  const endpoint = `${config.restUrl}wp/v2/${restBase}/${config.postId}`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-WP-Nonce': config.nonce,
      },
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to save post');
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}