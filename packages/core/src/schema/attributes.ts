/**
 * Per-block attribute shapes (v0). Builder-friendly fields; serializer maps to core block attrs.
 */

export interface ResponsiveValue<T> {
  desktop?: T;
  tablet?: T;
  mobile?: T;
}

export interface GroupAttributes {
  maxWidth?: string;
  padding?: ResponsiveValue<string>;
  margin?: ResponsiveValue<string>;
  background?: string;
  borderRadius?: string;
  [key: string]: unknown;
}

export interface ColumnsAttributes {
  columns?: ResponsiveValue<number>;
  rows?: ResponsiveValue<number>;
  gap?: ResponsiveValue<string>;
  [key: string]: unknown;
}

export interface ColumnAttributes {
  width?: string;
  [key: string]: unknown;
}

export interface SpacerAttributes {
  height?: ResponsiveValue<string>;
  [key: string]: unknown;
}

export interface HeadingAttributes {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  content?: string;
  typography?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface ParagraphAttributes {
  content?: string;
  typography?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface ButtonAttributes {
  label?: string;
  url?: string;
  variant?: string;
  [key: string]: unknown;
}

export interface ImageAttributes {
  attachmentId?: number;
  url?: string;
  alt?: string;
  [key: string]: unknown;
}

/** Icon / custom markup stored via core/html. */
export interface HtmlAttributes {
  name?: string;
  svg?: string;
  html?: string;
  [key: string]: unknown;
}

export interface EmbedAttributes {
  provider?: 'youtube' | 'vimeo' | 'self';
  url?: string;
  [key: string]: unknown;
}

/** @deprecated Use GroupAttributes */
export type ContainerAttributes = GroupAttributes;

/** @deprecated Use ParagraphAttributes */
export type TextAttributes = ParagraphAttributes;

/** @deprecated Use HtmlAttributes */
export type IconAttributes = HtmlAttributes;

/** @deprecated Use EmbedAttributes */
export type VideoAttributes = EmbedAttributes;

/** @deprecated Use ColumnsAttributes */
export type GridAttributes = ColumnsAttributes;
