import { sanitizeAttributes } from './attributes.js';

/** Builder payload for attrs with no Gutenberg equivalent. */
export const NIYI_ATTR_KEY = 'niyi' as const;

export function withNiyiAttrs(
  nativeAttrs: Record<string, unknown>,
  niyiOnly: Record<string, unknown>,
): Record<string, unknown> {
  const niyi = sanitizeAttributes(niyiOnly);

  if (Object.keys(niyi).length === 0) {
    return nativeAttrs;
  }

  if (Object.keys(nativeAttrs).length === 0) {
    return { [NIYI_ATTR_KEY]: niyi };
  }

  return { ...nativeAttrs, [NIYI_ATTR_KEY]: niyi };
}

export function readNiyiAttrs(
  gutenbergAttrs: Record<string, unknown>,
): Record<string, unknown> | null {
  const niyi = gutenbergAttrs[NIYI_ATTR_KEY];

  if (niyi !== null && typeof niyi === 'object' && !Array.isArray(niyi)) {
    return { ...(niyi as Record<string, unknown>) };
  }

  return null;
}

/** Merge native Gutenberg fields with the niyi overflow bucket. */
export function mergeNativeAndNiyi(
  gutenbergAttrs: Record<string, unknown>,
  fromNative: (attrs: Record<string, unknown>, innerHTML: string) => Record<string, unknown>,
  innerHTML: string,
): Record<string, unknown> {
  const native = fromNative(gutenbergAttrs, innerHTML);
  const niyi = readNiyiAttrs(gutenbergAttrs);

  if (niyi === null) {
    return native;
  }

  return mergeBuilderWithNiyiOverflow(native, niyi);
}

const RESPONSIVE_MERGE_KEYS = new Set(['padding', 'margin', 'gap', 'height']);

function isResponsiveValue(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function mergeBuilderWithNiyiOverflow(
  native: Record<string, unknown>,
  niyi: Record<string, unknown>,
): Record<string, unknown> {
  const result = { ...native };

  for (const [key, value] of Object.entries(niyi)) {
    if (
      RESPONSIVE_MERGE_KEYS.has(key) &&
      isResponsiveValue(result[key]) &&
      isResponsiveValue(value)
    ) {
      const existing = result[key];
      result[key] = {
        ...(typeof existing === 'object' && existing !== null && !Array.isArray(existing)
          ? existing
          : {}),
        ...value,
      };
    } else {
      result[key] = value;
    }
  }

  return result;
}

/** Strip the niyi payload when inspecting raw Gutenberg attrs in tests. */
export function stripNiyiPayload(attrs: Record<string, unknown>): Record<string, unknown> {
  const { [NIYI_ATTR_KEY]: _niyi, ...rest } = attrs;
  return rest;
}
