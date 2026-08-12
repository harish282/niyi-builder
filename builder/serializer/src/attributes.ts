/**
 * Prepare block attributes for Gutenberg block comment JSON (matches WP escaping rules).
 */
export function sanitizeAttributes(attributes: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(attributes)) {
    const sanitized = sanitizeValue(value);
    if (sanitized !== undefined) {
      result[key] = sanitized;
    }
  }

  return result;
}

function sanitizeValue(value: unknown): unknown {
  if (value === undefined || typeof value === 'function') {
    return undefined;
  }

  if (
    value === null ||
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  ) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeValue(item)).filter((item) => item !== undefined);
  }

  if (typeof value === 'object') {
    const record = value as Record<string, unknown>;
    const nested: Record<string, unknown> = {};

    for (const [key, nestedValue] of Object.entries(record)) {
      const sanitized = sanitizeValue(nestedValue);
      if (sanitized !== undefined) {
        nested[key] = sanitized;
      }
    }

    return nested;
  }

  return undefined;
}

export function encodeAttributes(attributes: Record<string, unknown>): string {
  const sanitized = sanitizeAttributes(attributes);

  if (Object.keys(sanitized).length === 0) {
    return '';
  }

  return (
    ' ' +
    JSON.stringify(sanitized)
      .replace(/</g, '\\u003c')
      .replace(/>/g, '\\u003e')
      .replace(/&/g, '\\u0026')
  );
}
