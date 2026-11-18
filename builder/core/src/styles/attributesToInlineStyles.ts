import type { CSSProperties } from 'react';
import type { BaseElementAttributes } from '../types/BaseElementAttributes.js';
import { BASE_ATTRIBUTE_KEYS } from '../types/BaseElementAttributes.js';
import type { Breakpoint, ResponsiveValue } from '../types/responsive.js';
import { resolveResponsiveValue } from '../types/responsive.js';

export interface StyleResolutionOptions {
  /** Breakpoint to resolve responsive values for. Defaults to `desktop`. */
  device?: Breakpoint;
}

/**
 * Extracts only the base attribute keys from a full attributes record.
 */
export function extractBaseAttributes(attributes: Record<string, unknown>): BaseElementAttributes {
  const base: Record<string, unknown> = {};
  for (const key of BASE_ATTRIBUTE_KEYS) {
    if (attributes[key] !== undefined) {
      base[key] = attributes[key];
    }
  }
  return base;
}

type Resolver = <T>(value: ResponsiveValue<T> | undefined) => T | undefined;

function createResolver(device: Breakpoint): Resolver {
  return <T>(value: ResponsiveValue<T> | undefined): T | undefined =>
    resolveResponsiveValue<T>(value, device);
}

function normalizeColor(value: string): string {
  const trimmed = value.trim();

  if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(trimmed)) {
    const hex = trimmed.slice(1);
    const full =
      hex.length === 3
        ? hex
            .split('')
            .map((char) => char + char)
            .join('')
        : hex;

    return `#${full}`;
  }

  return trimmed;
}

/** Convert a hex color + opacity to an rgba() color. Falls back to the input. */
function hexToRgba(color: string, opacity?: string): string {
  const normalized = normalizeColor(color);
  const match = /^#([0-9a-f]{6})$/i.exec(normalized);

  if (!match) {
    return color;
  }

  const int = parseInt(match[1], 16);
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;
  const parsed = opacity !== undefined ? Number.parseFloat(opacity) : 1;
  const alpha = Number.isNaN(parsed) ? 1 : Math.min(Math.max(parsed, 0), 1);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function buildBackgroundImage(
  image: string | undefined,
  gradient: string | undefined,
  overlayColor: string | undefined,
  overlayOpacity: string | undefined,
): string | undefined {
  const layers: string[] = [];

  if (overlayColor) {
    const overlay = hexToRgba(overlayColor, overlayOpacity);
    layers.push(`linear-gradient(${overlay}, ${overlay})`);
  }

  if (gradient) {
    layers.push(gradient);
  }

  if (image) {
    layers.push(`url("${image}")`);
  }

  return layers.length > 0 ? layers.join(', ') : undefined;
}

function buildFilter(resolve: Resolver, attrs: BaseElementAttributes): string | undefined {
  const filters: string[] = [];

  const push = (name: string, value: string | undefined): void => {
    if (value) {
      filters.push(`${name}(${value})`);
    }
  };

  push('blur', resolve(attrs.filterBlur));
  push('brightness', resolve(attrs.filterBrightness));
  push('contrast', resolve(attrs.filterContrast));
  push('saturate', resolve(attrs.filterSaturate));
  push('hue-rotate', resolve(attrs.filterHueRotate));
  push('invert', resolve(attrs.filterInvert));
  push('sepia', resolve(attrs.filterSepia));

  return filters.length > 0 ? filters.join(' ') : undefined;
}

function buildTransform(resolve: Resolver, attrs: BaseElementAttributes): string | undefined {
  const transforms: string[] = [];

  const x = resolve(attrs.transformTranslateX);
  const y = resolve(attrs.transformTranslateY);
  if (x || y) {
    transforms.push(`translate(${x ?? '0'}, ${y ?? '0'})`);
  }

  const scale = resolve(attrs.transformScale);
  if (scale) {
    transforms.push(`scale(${scale})`);
  }

  const rotate = resolve(attrs.transformRotate);
  if (rotate) {
    transforms.push(`rotate(${rotate})`);
  }

  const skewX = resolve(attrs.transformSkewX);
  const skewY = resolve(attrs.transformSkewY);
  if (skewX || skewY) {
    transforms.push(`skew(${skewX ?? '0'}, ${skewY ?? '0'})`);
  }

  return transforms.length > 0 ? transforms.join(' ') : undefined;
}

/**
 * Converts BaseElementAttributes to a React CSSProperties object.
 * Only includes properties that are actually set (non-undefined).
 * Responsive values are resolved for the requested device (desktop default).
 */
export function attributesToInlineStyles(
  attrs: BaseElementAttributes,
  options: StyleResolutionOptions = {},
): CSSProperties {
  const device = options.device ?? 'desktop';
  const resolve = createResolver(device);
  const style: CSSProperties = {};

  // Content
  const textColor = resolve(attrs.textColor);
  if (textColor) style.color = textColor;

  // Background
  const bgColor = resolve(attrs.bgColor);
  if (bgColor) style.backgroundColor = bgColor;

  const backgroundImage = buildBackgroundImage(
    resolve(attrs.backgroundImage),
    resolve(attrs.backgroundGradient),
    resolve(attrs.backgroundOverlayColor),
    resolve(attrs.backgroundOverlayOpacity),
  );
  if (backgroundImage) style.backgroundImage = backgroundImage;

  const backgroundSize = resolve(attrs.backgroundSize);
  if (backgroundSize) style.backgroundSize = backgroundSize;

  const backgroundPosition = resolve(attrs.backgroundPosition);
  if (backgroundPosition) style.backgroundPosition = backgroundPosition;

  const backgroundRepeat = resolve(attrs.backgroundRepeat);
  if (backgroundRepeat) style.backgroundRepeat = backgroundRepeat;

  const backgroundAttachment = resolve(attrs.backgroundAttachment);
  if (backgroundAttachment) {
    style.backgroundAttachment = backgroundAttachment;
  }

  const backgroundBlendMode = resolve(attrs.backgroundBlendMode);
  if (backgroundBlendMode) {
    style.backgroundBlendMode = backgroundBlendMode;
  }

  // Typography
  const fontFamily = resolve(attrs.fontFamily);
  if (fontFamily) style.fontFamily = fontFamily;

  const fontSize = resolve(attrs.fontSize);
  if (fontSize) style.fontSize = fontSize;

  const fontWeight = resolve(attrs.fontWeight);
  if (fontWeight) style.fontWeight = fontWeight;

  const fontStyle = resolve(attrs.fontStyle);
  if (fontStyle) style.fontStyle = fontStyle;

  const lineHeight = resolve(attrs.lineHeight);
  if (lineHeight) style.lineHeight = lineHeight;

  const letterSpacing = resolve(attrs.letterSpacing);
  if (letterSpacing) style.letterSpacing = letterSpacing;

  const wordSpacing = resolve(attrs.wordSpacing);
  if (wordSpacing) style.wordSpacing = wordSpacing;

  const textAlign = resolve(attrs.textAlign);
  if (textAlign) style.textAlign = textAlign;

  const textDecoration = resolve(attrs.textDecoration);
  if (textDecoration) style.textDecoration = textDecoration;

  const textTransform = resolve(attrs.textTransform);
  if (textTransform) style.textTransform = textTransform;

  const textIndent = resolve(attrs.textIndent);
  if (textIndent) style.textIndent = textIndent;

  const textShadow = resolve(attrs.textShadow);
  if (textShadow) style.textShadow = textShadow;

  const whiteSpace = resolve(attrs.whiteSpace);
  if (whiteSpace) style.whiteSpace = whiteSpace;

  // Spacing
  const marginTop = resolve(attrs.marginTop);
  if (marginTop) style.marginTop = marginTop;
  const marginRight = resolve(attrs.marginRight);
  if (marginRight) style.marginRight = marginRight;
  const marginBottom = resolve(attrs.marginBottom);
  if (marginBottom) style.marginBottom = marginBottom;
  const marginLeft = resolve(attrs.marginLeft);
  if (marginLeft) style.marginLeft = marginLeft;
  const paddingTop = resolve(attrs.paddingTop);
  if (paddingTop) style.paddingTop = paddingTop;
  const paddingRight = resolve(attrs.paddingRight);
  if (paddingRight) style.paddingRight = paddingRight;
  const paddingBottom = resolve(attrs.paddingBottom);
  if (paddingBottom) style.paddingBottom = paddingBottom;
  const paddingLeft = resolve(attrs.paddingLeft);
  if (paddingLeft) style.paddingLeft = paddingLeft;

  // Dimensions
  const width = resolve(attrs.width);
  if (width) style.width = width;
  const height = resolve(attrs.height);
  if (height) style.height = height;
  const minWidth = resolve(attrs.minWidth);
  if (minWidth) style.minWidth = minWidth;
  const minHeight = resolve(attrs.minHeight);
  if (minHeight) style.minHeight = minHeight;
  const maxWidth = resolve(attrs.maxWidth);
  if (maxWidth) style.maxWidth = maxWidth;
  const maxHeight = resolve(attrs.maxHeight);
  if (maxHeight) style.maxHeight = maxHeight;

  const overflow = resolve(attrs.overflow);
  if (overflow) style.overflow = overflow;

  // Border
  const borderWidth = resolve(attrs.borderWidth);
  if (borderWidth) style.borderWidth = borderWidth;
  const borderStyle = resolve(attrs.borderStyle);
  if (borderStyle) style.borderStyle = borderStyle;
  const borderColor = resolve(attrs.borderColor);
  if (borderColor) style.borderColor = borderColor;
  const borderRadius = resolve(attrs.borderRadius);
  if (borderRadius) style.borderRadius = borderRadius;

  const borderTopLeftRadius = resolve(attrs.borderTopLeftRadius);
  if (borderTopLeftRadius) style.borderTopLeftRadius = borderTopLeftRadius;
  const borderTopRightRadius = resolve(attrs.borderTopRightRadius);
  if (borderTopRightRadius) style.borderTopRightRadius = borderTopRightRadius;
  const borderBottomRightRadius = resolve(attrs.borderBottomRightRadius);
  if (borderBottomRightRadius) style.borderBottomRightRadius = borderBottomRightRadius;
  const borderBottomLeftRadius = resolve(attrs.borderBottomLeftRadius);
  if (borderBottomLeftRadius) style.borderBottomLeftRadius = borderBottomLeftRadius;

  // Effects
  const opacity = resolve(attrs.opacity);
  if (opacity) style.opacity = opacity;
  const boxShadow = resolve(attrs.boxShadow);
  if (boxShadow) style.boxShadow = boxShadow;

  const filter = buildFilter(resolve, attrs);
  if (filter) style.filter = filter;

  const mixBlendMode = resolve(attrs.mixBlendMode);
  if (mixBlendMode) style.mixBlendMode = mixBlendMode as CSSProperties['mixBlendMode'];

  // Transform
  const transform = buildTransform(resolve, attrs);
  if (transform) style.transform = transform;

  const transformOrigin = resolve(attrs.transformOrigin);
  if (transformOrigin) style.transformOrigin = transformOrigin;

  // Transition
  const transitionProperty = resolve(attrs.transitionProperty);
  if (transitionProperty) style.transitionProperty = transitionProperty;
  const transitionDuration = resolve(attrs.transitionDuration);
  if (transitionDuration) style.transitionDuration = transitionDuration;
  const transitionDelay = resolve(attrs.transitionDelay);
  if (transitionDelay) style.transitionDelay = transitionDelay;
  const transitionTimingFunction = resolve(attrs.transitionTimingFunction);
  if (transitionTimingFunction) style.transitionTimingFunction = transitionTimingFunction;

  // Position
  const position = resolve(attrs.position);
  if (position) style.position = position;
  const positionTop = resolve(attrs.positionTop);
  if (positionTop) style.top = positionTop;
  const positionRight = resolve(attrs.positionRight);
  if (positionRight) style.right = positionRight;
  const positionBottom = resolve(attrs.positionBottom);
  if (positionBottom) style.bottom = positionBottom;
  const positionLeft = resolve(attrs.positionLeft);
  if (positionLeft) style.left = positionLeft;
  const zIndex = resolve(attrs.zIndex);
  if (zIndex) style.zIndex = zIndex;

  // Animation
  const animationName = resolve(attrs.animationName);
  if (animationName) style.animationName = animationName;
  const animationDuration = resolve(attrs.animationDuration);
  if (animationDuration) style.animationDuration = animationDuration;
  const animationDelay = resolve(attrs.animationDelay);
  if (animationDelay) style.animationDelay = animationDelay;
  const animationTimingFunction = resolve(attrs.animationTimingFunction);
  if (animationTimingFunction) style.animationTimingFunction = animationTimingFunction;
  const animationIterationCount = resolve(attrs.animationIterationCount);
  if (animationIterationCount) style.animationIterationCount = animationIterationCount;

  // Sticky
  if (attrs.sticky) {
    style.position = 'sticky';
    style.top = resolve(attrs.stickyOffset) ?? '0px';
  }

  return style;
}

/**
 * Extracts className from base attributes (cssClass field).
 */
export function attributesToClassName(attrs: BaseElementAttributes): string {
  return attrs.cssClass || '';
}

/** Whether the element is hidden at the given breakpoint. */
export function isHiddenAtBreakpoint(
  attrs: BaseElementAttributes,
  device: Breakpoint = 'desktop',
): boolean {
  if (device === 'mobile') return Boolean(attrs.hideOnMobile);
  if (device === 'tablet') return Boolean(attrs.hideOnTablet);
  return Boolean(attrs.hideOnDesktop);
}

/** Sanitized custom HTML attributes (excluding id/class, which have dedicated fields). */
export function attributesToHtmlAttributes(attrs: BaseElementAttributes): Record<string, string> {
  const result: Record<string, string> = {};

  if (attrs.htmlAttributes) {
    for (const [key, value] of Object.entries(attrs.htmlAttributes)) {
      if (typeof value !== 'string' || value === '') continue;
      if (/^[a-z_:][a-z0-9_:.-]*$/i.test(key)) {
        result[key] = value;
      }
    }
  }

  return result;
}

/** Link props derived from the element's link options. */
export function attributesToLinkProps(attrs: BaseElementAttributes): {
  href?: string;
  target?: string;
  rel?: string;
  ariaLabel?: string;
} {
  const url = attrs.linkUrl;
  if (!url) {
    return {};
  }

  return {
    href: url,
    target: attrs.linkTarget,
    rel: attrs.linkRel,
    ariaLabel: attrs.linkAriaLabel,
  };
}
