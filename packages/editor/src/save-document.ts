import type { BuilderDocument } from '@niyi-builder/core';
import { serializeToGutenberg } from '@niyi-builder/serializer';

import type { BuilderSaveConfig } from './save-config.js';

interface WpRestErrorBody {
  message?: string;
  code?: string;
}

export function documentToGutenbergMarkup(document: BuilderDocument): string {
  return serializeToGutenberg(document);
}

export async function persistPostContent(
  config: BuilderSaveConfig,
  content: string,
): Promise<void> {
  const response = await fetch(config.restPostUrl, {
    method: 'PUT',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      'X-WP-Nonce': config.nonce,
    },
    body: JSON.stringify({ content }),
  });

  if (response.ok) {
    return;
  }

  let message = `Save failed (${response.status})`;

  try {
    const body = (await response.json()) as WpRestErrorBody;

    if (typeof body.message === 'string' && body.message.trim() !== '') {
      message = body.message;
    }
  } catch {
    // Keep generic message when the response is not JSON.
  }

  throw new Error(message);
}

export async function saveBuilderDocument(
  config: BuilderSaveConfig,
  document: BuilderDocument,
): Promise<string> {
  const markup = documentToGutenbergMarkup(document);
  await persistPostContent(config, markup);

  return markup;
}
