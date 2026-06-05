import type { BlockType } from '@niyi-builder/core';
import { fromNiyiAttrs, withNiyiAttrs } from './niyi-attrs.js';

type ResponsiveValue<T> = { desktop?: T; tablet?: T; mobile?: T };

function isResponsiveString(value: unknown): value is ResponsiveValue<string> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readResponsiveString(value: unknown): ResponsiveValue<string> | undefined {
  if (typeof value === 'string' && value) {
    return { desktop: value };
  }
  if (isResponsiveString(value)) {
    return value;
  }
  return undefined;
}

function pickDesktop(value: ResponsiveValue<string> | undefined): string | undefined {
  return value?.desktop ?? value?.tablet ?? value?.mobile;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, '').trim();
}

function wrapWithNiyi(
  builderAttrs: Record<string, unknown>,
  nativeAttrs: Record<string, unknown> = {},
): Record<string, unknown> {
  return withNiyiAttrs(builderAttrs, nativeAttrs);
}

function unwrapNiyi(
  gutenbergAttrs: Record<string, unknown>,
  innerHTML: string,
  legacyFallback: (attrs: Record<string, unknown>, innerHTML: string) => Record<string, unknown>,
): Record<string, unknown> {
  return fromNiyiAttrs(gutenbergAttrs, innerHTML, legacyFallback);
}

/** Minimal native attrs so core blocks remain usable in the block editor without Niyi. */
function nativeGroupAttrs(_attrs: Record<string, unknown>): Record<string, unknown> {
  return {};
}

function nativeColumnsAttrs(_attrs: Record<string, unknown>): Record<string, unknown> {
  return {};
}

function nativeSpacerAttrs(attrs: Record<string, unknown>): Record<string, unknown> {
  const height = pickDesktop(readResponsiveString(attrs.height));
  return height ? { height } : {};
}

function nativeHeadingAttrs(attrs: Record<string, unknown>): Record<string, unknown> {
  const level = typeof attrs.level === 'number' ? attrs.level : 2;
  return { level };
}

function nativeButtonAttrs(attrs: Record<string, unknown>): Record<string, unknown> {
  if (typeof attrs.url === 'string' && attrs.url) {
    return { url: attrs.url };
  }
  return {};
}

function nativeImageAttrs(attrs: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  if (typeof attrs.url === 'string') {
    result.url = attrs.url;
  }
  if (typeof attrs.alt === 'string') {
    result.alt = attrs.alt;
  }
  if (typeof attrs.attachmentId === 'number') {
    result.id = attrs.attachmentId;
  }
  return result;
}

function nativeEmbedAttrs(attrs: Record<string, unknown>): Record<string, unknown> {
  if (typeof attrs.url === 'string' && attrs.url) {
    return { url: attrs.url };
  }
  return {};
}

export function groupToGutenberg(attrs: Record<string, unknown>): Record<string, unknown> {
  return wrapWithNiyi(attrs, nativeGroupAttrs(attrs));
}

export function groupFromGutenberg(
  gutenbergAttrs: Record<string, unknown>,
  innerHTML: string,
): Record<string, unknown> {
  return unwrapNiyi(gutenbergAttrs, innerHTML, legacyGroupFromGutenberg);
}

function legacyGroupFromGutenberg(attrs: Record<string, unknown>): Record<string, unknown> {
  const layout = attrs.layout as Record<string, unknown> | undefined;
  if (typeof layout?.contentSize === 'string') {
    return { maxWidth: layout.contentSize };
  }
  return {};
}

export function columnsToGutenberg(attrs: Record<string, unknown>): Record<string, unknown> {
  return wrapWithNiyi(attrs, nativeColumnsAttrs(attrs));
}

export function columnsFromGutenberg(
  gutenbergAttrs: Record<string, unknown>,
  innerHTML: string,
): Record<string, unknown> {
  return unwrapNiyi(gutenbergAttrs, innerHTML, legacyColumnsFromGutenberg);
}

function legacyColumnsFromGutenberg(attrs: Record<string, unknown>): Record<string, unknown> {
  const style = attrs.style as Record<string, unknown> | undefined;
  const spacing = style?.spacing as Record<string, unknown> | undefined;
  if (typeof spacing?.blockGap === 'string') {
    return { gap: { desktop: spacing.blockGap } };
  }
  return {};
}

export function columnToGutenberg(attrs: Record<string, unknown>): Record<string, unknown> {
  return wrapWithNiyi(attrs);
}

export function columnFromGutenberg(
  gutenbergAttrs: Record<string, unknown>,
  innerHTML: string,
): Record<string, unknown> {
  return unwrapNiyi(gutenbergAttrs, innerHTML, () => ({}));
}

export function spacerToGutenberg(attrs: Record<string, unknown>): Record<string, unknown> {
  return wrapWithNiyi(attrs, nativeSpacerAttrs(attrs));
}

export function spacerFromGutenberg(
  gutenbergAttrs: Record<string, unknown>,
  innerHTML: string,
): Record<string, unknown> {
  return unwrapNiyi(gutenbergAttrs, innerHTML, legacySpacerFromGutenberg);
}

function legacySpacerFromGutenberg(attrs: Record<string, unknown>): Record<string, unknown> {
  if (typeof attrs.height === 'string') {
    return { height: { desktop: attrs.height } };
  }
  return {};
}

export function headingToGutenberg(attrs: Record<string, unknown>): Record<string, unknown> {
  return wrapWithNiyi(attrs, nativeHeadingAttrs(attrs));
}

export function headingInnerHtml(attrs: Record<string, unknown>): string {
  const level = typeof attrs.level === 'number' ? attrs.level : 2;
  const content = typeof attrs.content === 'string' ? attrs.content : '';
  return `<h${level} class="wp-block-heading">${escapeHtml(content)}</h${level}>`;
}

export function headingFromGutenberg(
  gutenbergAttrs: Record<string, unknown>,
  innerHTML: string,
): Record<string, unknown> {
  return unwrapNiyi(gutenbergAttrs, innerHTML, legacyHeadingFromGutenberg);
}

function legacyHeadingFromGutenberg(
  attrs: Record<string, unknown>,
  innerHTML: string,
): Record<string, unknown> {
  const level = typeof attrs.level === 'number' ? attrs.level : 2;
  return { level, content: stripTags(innerHTML) };
}

export function paragraphToGutenberg(attrs: Record<string, unknown>): Record<string, unknown> {
  return wrapWithNiyi(attrs);
}

export function paragraphInnerHtml(attrs: Record<string, unknown>): string {
  const content = typeof attrs.content === 'string' ? attrs.content : '';
  return `<p>${escapeHtml(content)}</p>`;
}

export function paragraphFromGutenberg(
  gutenbergAttrs: Record<string, unknown>,
  innerHTML: string,
): Record<string, unknown> {
  return unwrapNiyi(gutenbergAttrs, innerHTML, (_attrs, html) => ({ content: stripTags(html) }));
}

export function buttonToGutenberg(attrs: Record<string, unknown>): Record<string, unknown> {
  return wrapWithNiyi(attrs, nativeButtonAttrs(attrs));
}

export function buttonInnerHtml(attrs: Record<string, unknown>): string {
  const url = typeof attrs.url === 'string' ? attrs.url : '';
  const label = typeof attrs.label === 'string' ? attrs.label : '';
  const href = url ? ` href="${escapeHtml(url)}"` : '';
  return `<div class="wp-block-button"><a class="wp-block-button__link wp-element-button"${href}>${escapeHtml(label)}</a></div>`;
}

export function buttonFromGutenberg(
  gutenbergAttrs: Record<string, unknown>,
  innerHTML: string,
): Record<string, unknown> {
  return unwrapNiyi(gutenbergAttrs, innerHTML, legacyButtonFromGutenberg);
}

function legacyButtonFromGutenberg(
  attrs: Record<string, unknown>,
  innerHTML: string,
): Record<string, unknown> {
  const hrefMatch = /href="([^"]*)"/.exec(innerHTML);
  return {
    url: typeof attrs.url === 'string' ? attrs.url : hrefMatch?.[1] || '',
    label: stripTags(innerHTML),
  };
}

export function imageToGutenberg(attrs: Record<string, unknown>): Record<string, unknown> {
  return wrapWithNiyi(attrs, nativeImageAttrs(attrs));
}

export function imageFromGutenberg(
  gutenbergAttrs: Record<string, unknown>,
  innerHTML: string,
): Record<string, unknown> {
  return unwrapNiyi(gutenbergAttrs, innerHTML, legacyImageFromGutenberg);
}

function legacyImageFromGutenberg(attrs: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  if (typeof attrs.url === 'string') {
    result.url = attrs.url;
  }
  if (typeof attrs.alt === 'string') {
    result.alt = attrs.alt;
  }
  if (typeof attrs.id === 'number') {
    result.attachmentId = attrs.id;
  }
  return result;
}

export function htmlToGutenberg(attrs: Record<string, unknown>): Record<string, unknown> {
  return wrapWithNiyi(attrs);
}

export function htmlInnerHtml(attrs: Record<string, unknown>): string {
  if (typeof attrs.html === 'string' && attrs.html) {
    return attrs.html;
  }
  const name = typeof attrs.name === 'string' ? attrs.name : '';
  const svg = typeof attrs.svg === 'string' ? attrs.svg : '';
  if (svg) {
    return svg;
  }
  return `<div data-niyi-icon="${escapeHtml(name)}"></div>`;
}

export function htmlFromGutenberg(
  gutenbergAttrs: Record<string, unknown>,
  innerHTML: string,
): Record<string, unknown> {
  return unwrapNiyi(gutenbergAttrs, innerHTML, (_attrs, html) => {
    const trimmed = html.trim();
    const nameMatch = /data-niyi-icon="([^"]*)"/.exec(trimmed);
    if (nameMatch?.[1]) {
      return { name: nameMatch[1] };
    }
    if (trimmed.startsWith('<svg')) {
      return { svg: trimmed, html: trimmed };
    }
    return { html: trimmed };
  });
}

export function embedToGutenberg(attrs: Record<string, unknown>): Record<string, unknown> {
  return wrapWithNiyi(attrs, nativeEmbedAttrs(attrs));
}

export function embedFromGutenberg(
  gutenbergAttrs: Record<string, unknown>,
  innerHTML: string,
): Record<string, unknown> {
  return unwrapNiyi(gutenbergAttrs, innerHTML, legacyEmbedFromGutenberg);
}

function legacyEmbedFromGutenberg(attrs: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  if (typeof attrs.url === 'string') {
    result.url = attrs.url;
  }
  return result;
}

export interface BlockMarkupStrategy {
  toGutenbergAttrs: (attrs: Record<string, unknown>) => Record<string, unknown>;
  fromGutenbergAttrs: (
    attrs: Record<string, unknown>,
    innerHTML: string,
  ) => Record<string, unknown>;
  innerHtml?: (attrs: Record<string, unknown>) => string;
  selfClosing?: boolean;
}

export const BLOCK_MARKUP_STRATEGIES: Partial<Record<BlockType, BlockMarkupStrategy>> = {
  'core/group': {
    toGutenbergAttrs: groupToGutenberg,
    fromGutenbergAttrs: groupFromGutenberg,
  },
  'core/columns': {
    toGutenbergAttrs: columnsToGutenberg,
    fromGutenbergAttrs: columnsFromGutenberg,
  },
  'core/column': {
    toGutenbergAttrs: columnToGutenberg,
    fromGutenbergAttrs: columnFromGutenberg,
  },
  'core/spacer': {
    toGutenbergAttrs: spacerToGutenberg,
    fromGutenbergAttrs: spacerFromGutenberg,
    selfClosing: true,
  },
  'core/heading': {
    toGutenbergAttrs: headingToGutenberg,
    fromGutenbergAttrs: headingFromGutenberg,
    innerHtml: headingInnerHtml,
  },
  'core/paragraph': {
    toGutenbergAttrs: paragraphToGutenberg,
    fromGutenbergAttrs: paragraphFromGutenberg,
    innerHtml: paragraphInnerHtml,
  },
  'core/button': {
    toGutenbergAttrs: buttonToGutenberg,
    fromGutenbergAttrs: buttonFromGutenberg,
    innerHtml: buttonInnerHtml,
  },
  'core/image': {
    toGutenbergAttrs: imageToGutenberg,
    fromGutenbergAttrs: imageFromGutenberg,
    selfClosing: true,
  },
  'core/html': {
    toGutenbergAttrs: htmlToGutenberg,
    fromGutenbergAttrs: htmlFromGutenberg,
    innerHtml: htmlInnerHtml,
  },
  'core/embed': {
    toGutenbergAttrs: embedToGutenberg,
    fromGutenbergAttrs: embedFromGutenberg,
    selfClosing: true,
  },
};
