import type { ResponsiveValue } from './responsive.js';

/**
 * Base element attributes common to all HTML elements, modelled on the
 * option groups found in modern visual builders (content, design, advanced).
 *
 * Every value is optional and may be a responsive value keyed by breakpoint.
 * Only set values are applied.
 */
export interface BaseElementAttributes {
  // ----- Content -----------------------------------------------------------
  textColor?: ResponsiveValue<string>;
  linkColor?: ResponsiveValue<string>;
  linkHoverColor?: ResponsiveValue<string>;

  // ----- Background --------------------------------------------------------
  bgColor?: ResponsiveValue<string>;
  backgroundGradient?: ResponsiveValue<string>;
  backgroundImage?: ResponsiveValue<string>;
  backgroundSize?: ResponsiveValue<string>;
  backgroundPosition?: ResponsiveValue<string>;
  backgroundRepeat?: ResponsiveValue<string>;
  backgroundAttachment?: ResponsiveValue<string>;
  backgroundBlendMode?: ResponsiveValue<string>;
  backgroundOverlayColor?: ResponsiveValue<string>;
  backgroundOverlayOpacity?: ResponsiveValue<string>;

  // ----- Typography --------------------------------------------------------
  fontFamily?: ResponsiveValue<string>;
  fontSize?: ResponsiveValue<string>;
  fontWeight?: ResponsiveValue<string>;
  fontStyle?: ResponsiveValue<string>;
  lineHeight?: ResponsiveValue<string>;
  letterSpacing?: ResponsiveValue<string>;
  wordSpacing?: ResponsiveValue<string>;
  textAlign?: ResponsiveValue<'left' | 'center' | 'right' | 'justify'>;
  textDecoration?: ResponsiveValue<'none' | 'underline' | 'overline' | 'line-through'>;
  textTransform?: ResponsiveValue<'none' | 'capitalize' | 'uppercase' | 'lowercase'>;
  textIndent?: ResponsiveValue<string>;
  textShadow?: ResponsiveValue<string>;
  whiteSpace?: ResponsiveValue<string>;

  // ----- Spacing -----------------------------------------------------------
  marginTop?: ResponsiveValue<string>;
  marginRight?: ResponsiveValue<string>;
  marginBottom?: ResponsiveValue<string>;
  marginLeft?: ResponsiveValue<string>;
  paddingTop?: ResponsiveValue<string>;
  paddingRight?: ResponsiveValue<string>;
  paddingBottom?: ResponsiveValue<string>;
  paddingLeft?: ResponsiveValue<string>;

  // ----- Sizing ------------------------------------------------------------
  width?: ResponsiveValue<string>;
  height?: ResponsiveValue<string>;
  minWidth?: ResponsiveValue<string>;
  minHeight?: ResponsiveValue<string>;
  maxWidth?: ResponsiveValue<string>;
  maxHeight?: ResponsiveValue<string>;
  overflow?: ResponsiveValue<string>;

  // ----- Border ------------------------------------------------------------
  borderWidth?: ResponsiveValue<string>;
  borderStyle?: ResponsiveValue<string>;
  borderColor?: ResponsiveValue<string>;
  borderRadius?: ResponsiveValue<string>;
  borderTopLeftRadius?: ResponsiveValue<string>;
  borderTopRightRadius?: ResponsiveValue<string>;
  borderBottomRightRadius?: ResponsiveValue<string>;
  borderBottomLeftRadius?: ResponsiveValue<string>;

  // ----- Effects -----------------------------------------------------------
  opacity?: ResponsiveValue<string>;
  boxShadow?: ResponsiveValue<string>;
  filterBlur?: ResponsiveValue<string>;
  filterBrightness?: ResponsiveValue<string>;
  filterContrast?: ResponsiveValue<string>;
  filterSaturate?: ResponsiveValue<string>;
  filterHueRotate?: ResponsiveValue<string>;
  filterInvert?: ResponsiveValue<string>;
  filterSepia?: ResponsiveValue<string>;
  mixBlendMode?: ResponsiveValue<string>;

  // ----- Transform ---------------------------------------------------------
  transformTranslateX?: ResponsiveValue<string>;
  transformTranslateY?: ResponsiveValue<string>;
  transformScale?: ResponsiveValue<string>;
  transformRotate?: ResponsiveValue<string>;
  transformSkewX?: ResponsiveValue<string>;
  transformSkewY?: ResponsiveValue<string>;
  transformOrigin?: ResponsiveValue<string>;

  // ----- Transition --------------------------------------------------------
  transitionProperty?: ResponsiveValue<string>;
  transitionDuration?: ResponsiveValue<string>;
  transitionDelay?: ResponsiveValue<string>;
  transitionTimingFunction?: ResponsiveValue<string>;

  // ----- Position ----------------------------------------------------------
  position?: ResponsiveValue<'static' | 'relative' | 'absolute' | 'fixed' | 'sticky'>;
  positionTop?: ResponsiveValue<string>;
  positionRight?: ResponsiveValue<string>;
  positionBottom?: ResponsiveValue<string>;
  positionLeft?: ResponsiveValue<string>;
  zIndex?: ResponsiveValue<string>;

  // ----- Animation ---------------------------------------------------------
  animationName?: ResponsiveValue<string>;
  animationDuration?: ResponsiveValue<string>;
  animationDelay?: ResponsiveValue<string>;
  animationTimingFunction?: ResponsiveValue<string>;
  animationIterationCount?: ResponsiveValue<string>;

  // ----- Visibility (per breakpoint) --------------------------------------
  hideOnDesktop?: boolean;
  hideOnTablet?: boolean;
  hideOnMobile?: boolean;

  // ----- Sticky ------------------------------------------------------------
  sticky?: boolean;
  stickyOffset?: ResponsiveValue<string>;

  // ----- Link --------------------------------------------------------------
  linkUrl?: string;
  linkTarget?: '_self' | '_blank';
  linkRel?: string;
  linkAriaLabel?: string;

  // ----- Advanced ----------------------------------------------------------
  cssClass?: string;
  customCss?: string;
  htmlId?: string;
  htmlAttributes?: Record<string, string>;
}

/** Keys of base attributes that map to CSS style properties. */
export const BASE_ATTRIBUTE_KEYS: (keyof BaseElementAttributes)[] = [
  // Content
  'textColor',
  'linkColor',
  'linkHoverColor',

  // Background
  'bgColor',
  'backgroundGradient',
  'backgroundImage',
  'backgroundSize',
  'backgroundPosition',
  'backgroundRepeat',
  'backgroundAttachment',
  'backgroundBlendMode',
  'backgroundOverlayColor',
  'backgroundOverlayOpacity',

  // Typography
  'fontFamily',
  'fontSize',
  'fontWeight',
  'fontStyle',
  'lineHeight',
  'letterSpacing',
  'wordSpacing',
  'textAlign',
  'textDecoration',
  'textTransform',
  'textIndent',
  'textShadow',
  'whiteSpace',

  // Spacing
  'marginTop',
  'marginRight',
  'marginBottom',
  'marginLeft',
  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',

  // Sizing
  'width',
  'height',
  'minWidth',
  'minHeight',
  'maxWidth',
  'maxHeight',
  'overflow',

  // Border
  'borderWidth',
  'borderStyle',
  'borderColor',
  'borderRadius',
  'borderTopLeftRadius',
  'borderTopRightRadius',
  'borderBottomRightRadius',
  'borderBottomLeftRadius',

  // Effects
  'opacity',
  'boxShadow',
  'filterBlur',
  'filterBrightness',
  'filterContrast',
  'filterSaturate',
  'filterHueRotate',
  'filterInvert',
  'filterSepia',
  'mixBlendMode',

  // Transform
  'transformTranslateX',
  'transformTranslateY',
  'transformScale',
  'transformRotate',
  'transformSkewX',
  'transformSkewY',
  'transformOrigin',

  // Transition
  'transitionProperty',
  'transitionDuration',
  'transitionDelay',
  'transitionTimingFunction',

  // Position
  'position',
  'positionTop',
  'positionRight',
  'positionBottom',
  'positionLeft',
  'zIndex',

  // Animation
  'animationName',
  'animationDuration',
  'animationDelay',
  'animationTimingFunction',
  'animationIterationCount',

  // Sticky
  'stickyOffset',

  // Advanced
  'cssClass',
  'customCss',
  'htmlId',
];
