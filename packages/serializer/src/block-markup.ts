import type { BlockType } from '@niyi-builder/core';
import { mergeNativeAndNiyi, withNiyiAttrs } from './niyi-attrs.js';
import {
  nativeButtonToBuilder,
  nativeColumnToBuilder,
  nativeColumnsToBuilder,
  nativeEmbedToBuilder,
  nativeGroupToBuilder,
  nativeHeadingToBuilder,
  nativeHtmlToBuilder,
  nativeImageToBuilder,
  nativeParagraphToBuilder,
  nativeSpacerToBuilder,
  splitButtonAttrs,
  splitColumnAttrs,
  splitColumnsAttrs,
  splitEmbedAttrs,
  splitGroupAttrs,
  splitHeadingAttrs,
  splitHtmlAttrs,
  splitImageAttrs,
  splitParagraphAttrs,
  splitSpacerAttrs,
} from './native-attr-map.js';

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function pickDesktopString(value: unknown): string | undefined {
  if (typeof value === 'string' && value) {
    return value;
  }
  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    const responsive = value as { desktop?: string; tablet?: string; mobile?: string };
    return responsive.desktop ?? responsive.tablet ?? responsive.mobile;
  }
  return undefined;
}

function toGutenberg(
  split: (attrs: Record<string, unknown>) => {
    native: Record<string, unknown>;
    niyi: Record<string, unknown>;
  },
  attrs: Record<string, unknown>,
): Record<string, unknown> {
  const { native, niyi } = split(attrs);
  return withNiyiAttrs(native, niyi);
}

function fromGutenberg(
  gutenbergAttrs: Record<string, unknown>,
  innerHTML: string,
  nativeToBuilder: (attrs: Record<string, unknown>, innerHTML: string) => Record<string, unknown>,
): Record<string, unknown> {
  return mergeNativeAndNiyi(gutenbergAttrs, nativeToBuilder, innerHTML);
}

export function groupToGutenberg(attrs: Record<string, unknown>): Record<string, unknown> {
  return toGutenberg(splitGroupAttrs, attrs);
}

export function groupFromGutenberg(
  gutenbergAttrs: Record<string, unknown>,
  innerHTML: string,
): Record<string, unknown> {
  return fromGutenberg(gutenbergAttrs, innerHTML, nativeGroupToBuilder);
}

export function columnsToGutenberg(attrs: Record<string, unknown>): Record<string, unknown> {
  return toGutenberg(splitColumnsAttrs, attrs);
}

export function columnsFromGutenberg(
  gutenbergAttrs: Record<string, unknown>,
  innerHTML: string,
): Record<string, unknown> {
  return fromGutenberg(gutenbergAttrs, innerHTML, nativeColumnsToBuilder);
}

export function columnToGutenberg(attrs: Record<string, unknown>): Record<string, unknown> {
  return toGutenberg(splitColumnAttrs, attrs);
}

export function columnFromGutenberg(
  gutenbergAttrs: Record<string, unknown>,
  innerHTML: string,
): Record<string, unknown> {
  return fromGutenberg(gutenbergAttrs, innerHTML, nativeColumnToBuilder);
}

export function spacerToGutenberg(attrs: Record<string, unknown>): Record<string, unknown> {
  return toGutenberg(splitSpacerAttrs, attrs);
}

export function spacerFromGutenberg(
  gutenbergAttrs: Record<string, unknown>,
  innerHTML: string,
): Record<string, unknown> {
  return fromGutenberg(gutenbergAttrs, innerHTML, nativeSpacerToBuilder);
}

export function spacerInnerHtml(attrs: Record<string, unknown>): string {
  const height = pickDesktopString(attrs.height) ?? '100px';
  return `<div style="height:${escapeHtml(height)}" aria-hidden="true" class="wp-block-spacer"></div>`;
}

export function headingToGutenberg(attrs: Record<string, unknown>): Record<string, unknown> {
  return toGutenberg(splitHeadingAttrs, attrs);
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
  return fromGutenberg(gutenbergAttrs, innerHTML, nativeHeadingToBuilder);
}

export function paragraphToGutenberg(attrs: Record<string, unknown>): Record<string, unknown> {
  return toGutenberg(splitParagraphAttrs, attrs);
}

export function paragraphInnerHtml(attrs: Record<string, unknown>): string {
  const content = typeof attrs.content === 'string' ? attrs.content : '';
  return `<p>${escapeHtml(content)}</p>`;
}

export function paragraphFromGutenberg(
  gutenbergAttrs: Record<string, unknown>,
  innerHTML: string,
): Record<string, unknown> {
  return fromGutenberg(gutenbergAttrs, innerHTML, nativeParagraphToBuilder);
}

export function buttonToGutenberg(attrs: Record<string, unknown>): Record<string, unknown> {
  return toGutenberg(splitButtonAttrs, attrs);
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
  return fromGutenberg(gutenbergAttrs, innerHTML, nativeButtonToBuilder);
}

export function imageToGutenberg(attrs: Record<string, unknown>): Record<string, unknown> {
  return toGutenberg(splitImageAttrs, attrs);
}

export function imageFromGutenberg(
  gutenbergAttrs: Record<string, unknown>,
  innerHTML: string,
): Record<string, unknown> {
  return fromGutenberg(gutenbergAttrs, innerHTML, nativeImageToBuilder);
}

export function imageInnerHtml(attrs: Record<string, unknown>): string {
  const url = typeof attrs.url === 'string' ? attrs.url : '';
  const alt = typeof attrs.alt === 'string' ? attrs.alt : '';
  const attachmentId = typeof attrs.attachmentId === 'number' ? attrs.attachmentId : undefined;
  const src = url ? ` src="${escapeHtml(url)}"` : '';
  const imgClass = attachmentId !== undefined ? ` class="wp-image-${attachmentId}"` : '';
  return `<figure class="wp-block-image"><img${src} alt="${escapeHtml(alt)}"${imgClass}/></figure>`;
}

export function htmlToGutenberg(attrs: Record<string, unknown>): Record<string, unknown> {
  return toGutenberg(splitHtmlAttrs, attrs);
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
  return fromGutenberg(gutenbergAttrs, innerHTML, nativeHtmlToBuilder);
}

export function embedToGutenberg(attrs: Record<string, unknown>): Record<string, unknown> {
  return toGutenberg(splitEmbedAttrs, attrs);
}

export function embedFromGutenberg(
  gutenbergAttrs: Record<string, unknown>,
  innerHTML: string,
): Record<string, unknown> {
  return fromGutenberg(gutenbergAttrs, innerHTML, nativeEmbedToBuilder);
}

export function embedInnerHtml(attrs: Record<string, unknown>): string {
  const url = typeof attrs.url === 'string' ? attrs.url : '';
  const provider = typeof attrs.provider === 'string' ? attrs.provider : '';
  const typeClass =
    provider === 'youtube' || provider === 'vimeo' || provider === 'twitter' ? ' is-type-video' : '';
  const providerClass = provider ? ` is-provider-${provider} wp-block-embed-${provider}` : '';
  return `<figure class="wp-block-embed${typeClass}${providerClass}"><div class="wp-block-embed__wrapper">\n${escapeHtml(url)}\n</div></figure>`;
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
    innerHtml: spacerInnerHtml,
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
    innerHtml: imageInnerHtml,
  },
  'core/html': {
    toGutenbergAttrs: htmlToGutenberg,
    fromGutenbergAttrs: htmlFromGutenberg,
    innerHtml: htmlInnerHtml,
  },
  'core/embed': {
    toGutenbergAttrs: embedToGutenberg,
    fromGutenbergAttrs: embedFromGutenberg,
    innerHtml: embedInnerHtml,
  },
};
