import { serializeToGutenberg } from '@niyi-builder/serializer';
import { type BuilderDocument } from '@niyi-builder/core';
import { type BuilderSaveConfig } from './save-config.js';

interface SaveResponse {
  success: boolean;
  message?: string;
}

export async function savePostToWordPress(
  document: BuilderDocument,
  config: BuilderSaveConfig
): Promise<SaveResponse> {
  const content = serializeToGutenberg(document);

  const endpoint = config.restPostUrl;

  try {
    const response = await fetch(endpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-WP-Nonce': config.nonce,
      },
      body: JSON.stringify({
        content: {
          raw: content,
        },
      }),
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