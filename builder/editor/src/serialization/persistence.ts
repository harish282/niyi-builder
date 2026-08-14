import type { BuilderDocument } from '@niyi-builder/core';
import { parseFromGutenberg, parseRawBlocks, serializeToGutenberg } from '@niyi-builder/serializer';
import { coreDocumentToEditorDocument, editorDocumentToCoreDocument } from './adapter.js';

/**
 * Runtime post context exposed by PHP via wp_localize_script
 * (see AdminAssetRegistrar::localizeBootstrapConfig).
 */
export interface CanvasStyleLink {
  id: string;
  href: string;
}

export interface CanvasStyles {
  links: CanvasStyleLink[];
  html: string;
}

export interface EditorRuntimeConfig {
  postId: number;
  postTitle: string;
  restPostUrl: string;
  nonce: string;
  content: string;
  exitUrl: string;
  isDevShell: boolean;
  canvasStyles?: CanvasStyles;
}

declare global {
  interface Window {
    niyiBuilderConfig?: EditorRuntimeConfig;
  }
}

export function getEditorRuntimeConfig(): EditorRuntimeConfig | undefined {
  return window.niyiBuilderConfig;
}

export function serializeEditorDocument(document: BuilderDocument): string {
  return serializeToGutenberg(editorDocumentToCoreDocument(document));
}

const DOCUMENT_ROOT_WRAPPER =
  '<!-- wp:group -->\n<div class="wp-block-group">\n%s\n</div>\n<!-- /wp:group -->';

/**
 * The serializer treats a single top-level group as the document root, so a
 * document with several top-level blocks that also contains a container group
 * would be re-nested on import. Wrap multi-block markup in a structural group
 * first so the container stays a sibling of the other top-level blocks.
 */
function wrapTopLevelBlocks(html: string): string {
  return DOCUMENT_ROOT_WRAPPER.replace('%s', html);
}

export function parseEditorDocument(html: string): BuilderDocument {
  const trimmed = html.trim();

  if (trimmed.length === 0) {
    return { id: 'document', title: 'Untitled', elements: [] };
  }

  const blocks = parseRawBlocks(trimmed);
  const hasLooseText = blocks.some(
    (block) => block.blockName === null && block.innerHTML.trim().length > 0,
  );
  const markup = !hasLooseText && blocks.length > 1 ? wrapTopLevelBlocks(trimmed) : trimmed;

  const document = parseFromGutenberg(markup);
  return coreDocumentToEditorDocument(document, { id: 'document', title: 'Untitled' });
}

export async function loadPostContent(config: EditorRuntimeConfig): Promise<string> {
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

  const body = (await response.json()) as { content?: { raw?: string } };
  const raw = body.content?.raw;

  return typeof raw === 'string' ? raw.trim() : '';
}

export async function savePostContent(config: EditorRuntimeConfig, html: string): Promise<void> {
  const response = await fetch(config.restPostUrl, {
    method: 'PUT',
    credentials: 'same-origin',
    headers: {
      'X-WP-Nonce': config.nonce,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content: html }),
  });

  if (!response.ok) {
    throw new Error(`Failed to save post content (${response.status})`);
  }
}

/**
 * Serialize the current document to Gutenberg markup, persist it to the post,
 * then open the default block editor. An empty document is not saved so an
 * existing post is never wiped by a no-op switch.
 */
export async function switchToGutenbergEditor(
  config: EditorRuntimeConfig,
  document: BuilderDocument,
): Promise<void> {
  const html = serializeEditorDocument(document);
  const canSave = !config.isDevShell && config.postId > 0 && config.restPostUrl.trim() !== '';
  const shouldSave = canSave && html.trim().length > 0;

  if (shouldSave) {
    await savePostContent(config, html);
  }

  if (config.exitUrl.trim() !== '') {
    window.location.assign(config.exitUrl);
  }
}
