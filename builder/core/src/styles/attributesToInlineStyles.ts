import type { CSSProperties } from 'react';
import type { BaseElementAttributes } from '../types/BaseElementAttributes.js';
import { BASE_ATTRIBUTE_KEYS } from '../types/BaseElementAttributes.js';

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
  return base as BaseElementAttributes;
}

/**
 * Converts BaseElementAttributes to a React CSSProperties object.
 * Only includes properties that are actually set (non-undefined).
 */
export function attributesToInlineStyles(attrs: BaseElementAttributes): CSSProperties {
  const style: CSSProperties = {};

  // Color
  if (attrs.textColor) style.color = attrs.textColor;
  if (attrs.bgColor) style.backgroundColor = attrs.bgColor;

  // Typography
  if (attrs.fontFamily) style.fontFamily = attrs.fontFamily;
  if (attrs.fontSize) style.fontSize = attrs.fontSize;
  if (attrs.fontWeight) style.fontWeight = attrs.fontWeight as CSSProperties['fontWeight'];
  if (attrs.lineHeight) style.lineHeight = attrs.lineHeight;
  if (attrs.letterSpacing) style.letterSpacing = attrs.letterSpacing;
  if (attrs.textAlign) style.textAlign = attrs.textAlign;
  if (attrs.textDecoration) style.textDecoration = attrs.textDecoration;
  if (attrs.textTransform) style.textTransform = attrs.textTransform;

  // Spacing
  if (attrs.marginTop) style.marginTop = attrs.marginTop;
  if (attrs.marginRight) style.marginRight = attrs.marginRight;
  if (attrs.marginBottom) style.marginBottom = attrs.marginBottom;
  if (attrs.marginLeft) style.marginLeft = attrs.marginLeft;
  if (attrs.paddingTop) style.paddingTop = attrs.paddingTop;
  if (attrs.paddingRight) style.paddingRight = attrs.paddingRight;
  if (attrs.paddingBottom) style.paddingBottom = attrs.paddingBottom;
  if (attrs.paddingLeft) style.paddingLeft = attrs.paddingLeft;

  // Dimensions
  if (attrs.width) style.width = attrs.width;
  if (attrs.height) style.height = attrs.height;
  if (attrs.minWidth) style.minWidth = attrs.minWidth;
  if (attrs.minHeight) style.minHeight = attrs.minHeight;
  if (attrs.maxWidth) style.maxWidth = attrs.maxWidth;
  if (attrs.maxHeight) style.maxHeight = attrs.maxHeight;

  // Border
  if (attrs.borderWidth) style.borderWidth = attrs.borderWidth;
  if (attrs.borderStyle) style.borderStyle = attrs.borderStyle;
  if (attrs.borderColor) style.borderColor = attrs.borderColor;
  if (attrs.borderRadius) style.borderRadius = attrs.borderRadius;

  // Effects
  if (attrs.opacity) style.opacity = attrs.opacity;
  if (attrs.boxShadow) style.boxShadow = attrs.boxShadow;

  return style;
}

/**
 * Extracts className from base attributes (cssClass field).
 */
export function attributesToClassName(attrs: BaseElementAttributes): string {
  return attrs.cssClass || '';
}
