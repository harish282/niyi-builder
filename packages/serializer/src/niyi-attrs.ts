import { sanitizeAttributes } from './attributes.js';

/** Builder payload stored on core Gutenberg blocks (survives round-trip). */
export const NIYI_ATTR_KEY = 'niyi' as const;

export function withNiyiAttrs(
  builderAttrs: Record<string, unknown>,
  nativeAttrs: Record<string, unknown> = {},
): Record<string, unknown> {
  const niyi = sanitizeAttributes(builderAttrs);

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

export function fromNiyiAttrs(
  gutenbergAttrs: Record<string, unknown>,
  innerHTML: string,
  legacyFallback: (attrs: Record<string, unknown>, innerHTML: string) => Record<string, unknown>,
): Record<string, unknown> {
  const niyi = readNiyiAttrs(gutenbergAttrs);

  if (niyi !== null) {
    return niyi;
  }

  return legacyFallback(gutenbergAttrs, innerHTML);
}

/** Strip the niyi payload when inspecting raw Gutenberg attrs in tests. */
export function stripNiyiPayload(attrs: Record<string, unknown>): Record<string, unknown> {
  const { [NIYI_ATTR_KEY]: _niyi, ...rest } = attrs;
  return rest;
}
