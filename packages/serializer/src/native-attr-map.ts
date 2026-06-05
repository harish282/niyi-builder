/**
 * Maps builder attributes to native Gutenberg block attrs where they exist.
 * Unmapped keys are stored under `niyi` (see niyi-attrs.ts).
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/core-blocks/
 */

type ResponsiveValue<T> = { desktop?: T; tablet?: T; mobile?: T };

export interface SplitAttrs {
  native: Record<string, unknown>;
  niyi: Record<string, unknown>;
}

function isResponsiveValue<T>(value: unknown): value is ResponsiveValue<T> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function pickDesktopString(value: unknown): string | undefined {
  if (typeof value === 'string' && value) {
    return value;
  }
  if (isResponsiveValue<string>(value)) {
    return value.desktop ?? value.tablet ?? value.mobile;
  }
  return undefined;
}

/** If responsive has breakpoints beyond desktop, keep tablet/mobile in niyi. */
function responsiveOverflow(value: unknown): ResponsiveValue<string> | undefined {
  if (!isResponsiveValue<string>(value)) {
    return undefined;
  }
  const { tablet, mobile } = value;
  if (tablet === undefined && mobile === undefined) {
    return undefined;
  }
  const overflow: ResponsiveValue<string> = {};
  if (tablet !== undefined) {
    overflow.tablet = tablet;
  }
  if (mobile !== undefined) {
    overflow.mobile = mobile;
  }
  return overflow;
}

function omitKeys(source: Record<string, unknown>, keys: string[]): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(source)) {
    if (!keys.includes(key)) {
      result[key] = value;
    }
  }
  return result;
}

function mergeStyle(
  base: Record<string, unknown>,
  patch: Record<string, unknown>,
): Record<string, unknown> {
  const style: Record<string, unknown> = {
    ...(typeof base.style === 'object' && base.style !== null && !Array.isArray(base.style)
      ? (base.style as Record<string, unknown>)
      : {}),
  };

  for (const [key, value] of Object.entries(patch)) {
    if (key === 'spacing' || key === 'color' || key === 'border') {
      const current =
        typeof style[key] === 'object' && style[key] !== null && !Array.isArray(style[key])
          ? (style[key] as Record<string, unknown>)
          : {};
      style[key] = { ...current, ...(value as Record<string, unknown>) };
    } else {
      style[key] = value;
    }
  }

  return { ...base, style };
}

function readStyle(gutenbergAttrs: Record<string, unknown>): Record<string, unknown> {
  const style = gutenbergAttrs.style;
  return style !== null && typeof style === 'object' && !Array.isArray(style)
    ? (style as Record<string, unknown>)
    : {};
}

function readLayout(gutenbergAttrs: Record<string, unknown>): Record<string, unknown> {
  const layout = gutenbergAttrs.layout;
  return layout !== null && typeof layout === 'object' && !Array.isArray(layout)
    ? (layout as Record<string, unknown>)
    : {};
}

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, '').trim();
}

export function splitGroupAttrs(attrs: Record<string, unknown>): SplitAttrs {
  const niyi: Record<string, unknown> = {};
  let native: Record<string, unknown> = {};
  const consumed: string[] = [];

  if (typeof attrs.maxWidth === 'string' && attrs.maxWidth) {
    native.layout = { type: 'constrained', contentSize: attrs.maxWidth };
    consumed.push('maxWidth');
  }

  if (typeof attrs.background === 'string') {
    native = mergeStyle(native, { color: { background: attrs.background } });
    consumed.push('background');
  }

  if (typeof attrs.borderRadius === 'string') {
    native = mergeStyle(native, { border: { radius: attrs.borderRadius } });
    consumed.push('borderRadius');
  }

  const paddingDesktop = pickDesktopString(attrs.padding);
  if (paddingDesktop) {
    native = mergeStyle(native, { spacing: { padding: paddingDesktop } });
    consumed.push('padding');
    const overflow = responsiveOverflow(attrs.padding);
    if (overflow !== undefined) {
      niyi.padding = overflow;
    }
  }

  const marginDesktop = pickDesktopString(attrs.margin);
  if (marginDesktop) {
    native = mergeStyle(native, { spacing: { margin: marginDesktop } });
    consumed.push('margin');
    const overflow = responsiveOverflow(attrs.margin);
    if (overflow !== undefined) {
      niyi.margin = overflow;
    }
  }

  Object.assign(niyi, omitKeys(attrs, consumed));

  return { native, niyi };
}

export function nativeGroupToBuilder(
  gutenbergAttrs: Record<string, unknown>,
  _innerHTML: string,
): Record<string, unknown> {
  const builder: Record<string, unknown> = {};
  const layout = readLayout(gutenbergAttrs);
  if (typeof layout.contentSize === 'string') {
    builder.maxWidth = layout.contentSize;
  }

  const style = readStyle(gutenbergAttrs);
  const color = style.color as Record<string, unknown> | undefined;
  if (typeof color?.background === 'string') {
    builder.background = color.background;
  }
  const border = style.border as Record<string, unknown> | undefined;
  if (typeof border?.radius === 'string') {
    builder.borderRadius = border.radius;
  }
  const spacing = style.spacing as Record<string, unknown> | undefined;
  if (typeof spacing?.padding === 'string') {
    builder.padding = { desktop: spacing.padding };
  }
  if (typeof spacing?.margin === 'string') {
    builder.margin = { desktop: spacing.margin };
  }

  return builder;
}

export function splitColumnsAttrs(attrs: Record<string, unknown>): SplitAttrs {
  const niyi: Record<string, unknown> = {};
  let native: Record<string, unknown> = {};
  const consumed: string[] = [];

  const gapDesktop = pickDesktopString(attrs.gap);
  if (gapDesktop) {
    native = mergeStyle(native, { spacing: { blockGap: gapDesktop } });
    consumed.push('gap');
    const overflow = responsiveOverflow(attrs.gap);
    if (overflow !== undefined) {
      niyi.gap = overflow;
    }
  }

  // core/columns has no columns/rows attrs — child count defines layout.
  if (attrs.columns !== undefined) {
    consumed.push('columns');
    niyi.columns = attrs.columns;
  }
  if (attrs.rows !== undefined) {
    consumed.push('rows');
    niyi.rows = attrs.rows;
  }

  Object.assign(niyi, omitKeys(attrs, consumed));

  return { native, niyi };
}

export function nativeColumnsToBuilder(
  gutenbergAttrs: Record<string, unknown>,
  _innerHTML: string,
): Record<string, unknown> {
  const builder: Record<string, unknown> = {};
  const spacing = readStyle(gutenbergAttrs).spacing as Record<string, unknown> | undefined;
  if (typeof spacing?.blockGap === 'string') {
    builder.gap = { desktop: spacing.blockGap };
  }
  return builder;
}

export function splitColumnAttrs(attrs: Record<string, unknown>): SplitAttrs {
  const native: Record<string, unknown> = {};
  const consumed: string[] = [];

  if (typeof attrs.width === 'string' && attrs.width) {
    native.width = attrs.width;
    consumed.push('width');
  }

  return { native, niyi: omitKeys(attrs, consumed) };
}

export function nativeColumnToBuilder(
  gutenbergAttrs: Record<string, unknown>,
  _innerHTML: string,
): Record<string, unknown> {
  const builder: Record<string, unknown> = {};
  if (typeof gutenbergAttrs.width === 'string') {
    builder.width = gutenbergAttrs.width;
  }
  return builder;
}

export function splitSpacerAttrs(attrs: Record<string, unknown>): SplitAttrs {
  const niyi: Record<string, unknown> = {};
  const native: Record<string, unknown> = {};
  const consumed: string[] = [];

  const heightDesktop = pickDesktopString(attrs.height);
  if (heightDesktop) {
    native.height = heightDesktop;
    consumed.push('height');
    const overflow = responsiveOverflow(attrs.height);
    if (overflow !== undefined) {
      niyi.height = overflow;
    }
  }

  Object.assign(niyi, omitKeys(attrs, consumed));
  return { native, niyi };
}

export function nativeSpacerToBuilder(
  gutenbergAttrs: Record<string, unknown>,
  _innerHTML: string,
): Record<string, unknown> {
  if (typeof gutenbergAttrs.height === 'string') {
    return { height: { desktop: gutenbergAttrs.height } };
  }
  return {};
}

export function splitHeadingAttrs(attrs: Record<string, unknown>): SplitAttrs {
  const native: Record<string, unknown> = {};
  const niyi = omitKeys(attrs, ['level', 'content']);

  if (typeof attrs.level === 'number') {
    native.level = attrs.level;
  }

  // content is carried in innerHTML, not block JSON attrs.
  if (attrs.content !== undefined) {
    delete niyi.content;
  }

  return { native, niyi };
}

export function nativeHeadingToBuilder(
  gutenbergAttrs: Record<string, unknown>,
  innerHTML: string,
): Record<string, unknown> {
  const builder: Record<string, unknown> = {};
  if (typeof gutenbergAttrs.level === 'number') {
    builder.level = gutenbergAttrs.level;
  }
  const content = stripTags(innerHTML);
  if (content) {
    builder.content = content;
  }
  return builder;
}

export function splitParagraphAttrs(attrs: Record<string, unknown>): SplitAttrs {
  return {
    native: {},
    niyi: omitKeys(attrs, ['content']),
  };
}

export function nativeParagraphToBuilder(
  _gutenbergAttrs: Record<string, unknown>,
  innerHTML: string,
): Record<string, unknown> {
  const content = stripTags(innerHTML);
  return content ? { content } : {};
}

export function splitButtonAttrs(attrs: Record<string, unknown>): SplitAttrs {
  const native: Record<string, unknown> = {};
  const niyi = omitKeys(attrs, ['url', 'label']);

  if (typeof attrs.url === 'string' && attrs.url) {
    native.url = attrs.url;
  }
  if (typeof attrs.label === 'string' && attrs.label) {
    native.text = attrs.label;
  }

  return { native, niyi };
}

export function nativeButtonToBuilder(
  gutenbergAttrs: Record<string, unknown>,
  innerHTML: string,
): Record<string, unknown> {
  const builder: Record<string, unknown> = {};
  if (typeof gutenbergAttrs.url === 'string') {
    builder.url = gutenbergAttrs.url;
  }
  if (typeof gutenbergAttrs.text === 'string') {
    builder.label = gutenbergAttrs.text;
  } else {
    const label = stripTags(innerHTML);
    if (label) {
      builder.label = label;
    }
  }
  return builder;
}

export function splitImageAttrs(attrs: Record<string, unknown>): SplitAttrs {
  const native: Record<string, unknown> = {};
  const niyi = omitKeys(attrs, ['url', 'alt', 'attachmentId']);

  if (typeof attrs.url === 'string') {
    native.url = attrs.url;
  }
  if (typeof attrs.alt === 'string') {
    native.alt = attrs.alt;
  }
  if (typeof attrs.attachmentId === 'number') {
    native.id = attrs.attachmentId;
  }

  return { native, niyi };
}

export function nativeImageToBuilder(
  gutenbergAttrs: Record<string, unknown>,
  _innerHTML: string,
): Record<string, unknown> {
  const builder: Record<string, unknown> = {};
  if (typeof gutenbergAttrs.url === 'string') {
    builder.url = gutenbergAttrs.url;
  }
  if (typeof gutenbergAttrs.alt === 'string') {
    builder.alt = gutenbergAttrs.alt;
  }
  if (typeof gutenbergAttrs.id === 'number') {
    builder.attachmentId = gutenbergAttrs.id;
  }
  return builder;
}

export function splitHtmlAttrs(attrs: Record<string, unknown>): SplitAttrs {
  return { native: {}, niyi: omitKeys(attrs, ['html', 'svg', 'name']) };
}

export function nativeHtmlToBuilder(
  _gutenbergAttrs: Record<string, unknown>,
  innerHTML: string,
): Record<string, unknown> {
  const trimmed = innerHTML.trim();
  const nameMatch = /data-niyi-icon="([^"]*)"/.exec(trimmed);
  if (nameMatch?.[1]) {
    return { name: nameMatch[1] };
  }
  if (trimmed.startsWith('<svg')) {
    return { svg: trimmed, html: trimmed };
  }
  return trimmed ? { html: trimmed } : {};
}

export function splitEmbedAttrs(attrs: Record<string, unknown>): SplitAttrs {
  const native: Record<string, unknown> = {};
  const consumed: string[] = [];

  if (typeof attrs.url === 'string' && attrs.url) {
    native.url = attrs.url;
    consumed.push('url');
  }

  if (typeof attrs.provider === 'string' && attrs.provider && attrs.provider !== 'self') {
    native.providerNameSlug = attrs.provider;
    consumed.push('provider');
  }

  return { native, niyi: omitKeys(attrs, consumed) };
}

export function nativeEmbedToBuilder(
  gutenbergAttrs: Record<string, unknown>,
  _innerHTML: string,
): Record<string, unknown> {
  const builder: Record<string, unknown> = {};
  if (typeof gutenbergAttrs.url === 'string') {
    builder.url = gutenbergAttrs.url;
  }
  if (typeof gutenbergAttrs.providerNameSlug === 'string') {
    builder.provider = gutenbergAttrs.providerNameSlug;
  }
  return builder;
}
