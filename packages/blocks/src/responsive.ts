import type { ResponsiveValue } from '@niyi-builder/core';

export type PreviewDevice = 'desktop' | 'tablet' | 'mobile';

const DEVICE_CASCADE: PreviewDevice[] = ['desktop', 'tablet', 'mobile'];

function isResponsiveValue<T>(value: unknown): value is ResponsiveValue<T> {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  return 'desktop' in value || 'tablet' in value || 'mobile' in value;
}

/** Resolve a builder attribute for the active preview device (falls back to larger breakpoints). */
export function resolveResponsiveValue<T>(
  value: ResponsiveValue<T> | T | undefined,
  device: PreviewDevice,
): T | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (!isResponsiveValue<T>(value)) {
    return value;
  }

  const startIndex = DEVICE_CASCADE.indexOf(device);

  for (let index = startIndex; index >= 0; index -= 1) {
    const key = DEVICE_CASCADE[index];
    const candidate = value[key];

    if (candidate !== undefined) {
      return candidate;
    }
  }

  return undefined;
}
