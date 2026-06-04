/**
 * Per-block attribute shapes (v0). All blocks also allow unknown keys for forward compatibility.
 */

export interface ResponsiveValue<T> {
  desktop?: T;
  tablet?: T;
  mobile?: T;
}

export interface ContainerAttributes {
  width?: string;
  maxWidth?: string;
  padding?: ResponsiveValue<string>;
  margin?: ResponsiveValue<string>;
  background?: string;
  borderRadius?: string;
  [key: string]: unknown;
}

export interface GridAttributes {
  columns?: ResponsiveValue<number>;
  rows?: ResponsiveValue<number>;
  gap?: ResponsiveValue<string>;
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

export interface TextAttributes {
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

export interface IconAttributes {
  svg?: string;
  name?: string;
  [key: string]: unknown;
}

export interface VideoAttributes {
  provider?: 'youtube' | 'vimeo' | 'self';
  url?: string;
  attachmentId?: number;
  [key: string]: unknown;
}

export interface FormAttributes {
  name?: string;
  notificationEmail?: string;
  storeInDatabase?: boolean;
  [key: string]: unknown;
}

export type FormFieldAttributes = {
  label?: string;
  name?: string;
  required?: boolean;
  placeholder?: string;
  [key: string]: unknown;
};
