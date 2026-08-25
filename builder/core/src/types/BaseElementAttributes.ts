/**
 * Base element attributes common to all HTML elements.
 * All properties are optional — only set values are applied.
 */
export interface BaseElementAttributes {
  // Color
  textColor?: string;
  bgColor?: string;

  // Typography
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: string;
  lineHeight?: string;
  letterSpacing?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  textDecoration?: 'none' | 'underline' | 'overline' | 'line-through';
  textTransform?: 'none' | 'capitalize' | 'uppercase' | 'lowercase';

  // Spacing
  marginTop?: string;
  marginRight?: string;
  marginBottom?: string;
  marginLeft?: string;
  paddingTop?: string;
  paddingRight?: string;
  paddingBottom?: string;
  paddingLeft?: string;

  // Dimensions
  width?: string;
  height?: string;
  minWidth?: string;
  minHeight?: string;
  maxWidth?: string;
  maxHeight?: string;

  // Border
  borderWidth?: string;
  borderStyle?: 'none' | 'solid' | 'dashed' | 'dotted' | 'double';
  borderColor?: string;
  borderRadius?: string;

  // Effects
  opacity?: string;
  boxShadow?: string;

  // Advanced
  cssClass?: string;
  customCss?: string;
  htmlId?: string;
}

/** Keys of base attributes that map to CSS style properties */
export const BASE_ATTRIBUTE_KEYS: (keyof BaseElementAttributes)[] = [
  'textColor',
  'bgColor',
  'fontFamily',
  'fontSize',
  'fontWeight',
  'lineHeight',
  'letterSpacing',
  'textAlign',
  'textDecoration',
  'textTransform',
  'marginTop',
  'marginRight',
  'marginBottom',
  'marginLeft',
  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',
  'width',
  'height',
  'minWidth',
  'minHeight',
  'maxWidth',
  'maxHeight',
  'borderWidth',
  'borderStyle',
  'borderColor',
  'borderRadius',
  'opacity',
  'boxShadow',
  'cssClass',
  'customCss',
  'htmlId',
];
