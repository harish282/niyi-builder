/**
 * Responsive value primitives shared by elements, editor and serializer.
 *
 * A responsive value is either a plain value (applies to every breakpoint) or
 * an object keyed by breakpoint. Larger breakpoints cascade down: a tablet
 * value overrides desktop, and a mobile value overrides tablet.
 */

export const BREAKPOINTS = ['desktop', 'tablet', 'mobile'] as const;

export type Breakpoint = (typeof BREAKPOINTS)[number];

export type ResponsiveValue<T> = T | Partial<Record<Breakpoint, T>>;

export function isBreakpoint(value: unknown): value is Breakpoint {
  return typeof value === 'string' && (BREAKPOINTS as readonly string[]).includes(value);
}

/**
 * True when `value` is an object whose keys are breakpoints. Plain objects
 * (e.g. layout settings) are intentionally excluded.
 */
export function isResponsiveObject<T>(value: unknown): value is Partial<Record<Breakpoint, T>> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }

  const keys = Object.keys(value);
  if (keys.length === 0) {
    return false;
  }

  return keys.every((key) => isBreakpoint(key));
}

/**
 * Read the value for a single breakpoint without cascading. A plain value is
 * returned for any breakpoint.
 */
export function readResponsiveValue<T>(
  value: ResponsiveValue<T> | undefined,
  device: Breakpoint,
): T | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (!isResponsiveObject<T>(value)) {
    return value;
  }

  return value[device];
}

/**
 * Resolve the effective value for a breakpoint, cascading tablet → desktop and
 * mobile → tablet → desktop.
 */
export function resolveResponsiveValue<T>(
  value: ResponsiveValue<T> | undefined,
  device: Breakpoint = 'desktop',
): T | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (!isResponsiveObject<T>(value)) {
    return value;
  }

  const order: Breakpoint[] =
    device === 'mobile'
      ? ['mobile', 'tablet', 'desktop']
      : device === 'tablet'
        ? ['tablet', 'desktop']
        : ['desktop'];

  for (const breakpoint of order) {
    const candidate = value[breakpoint];
    if (candidate !== undefined) {
      return candidate;
    }
  }

  return undefined;
}

/**
 * Return a new responsive value with `device` set to `value`. Setting a
 * desktop value on a plain value keeps it plain (backwards compatible).
 */
export function setResponsiveValue<T>(
  current: ResponsiveValue<T> | undefined,
  device: Breakpoint,
  value: T | undefined,
): ResponsiveValue<T> | undefined {
  if (value === undefined) {
    return clearResponsiveValue(current, device);
  }

  if (device === 'desktop' && !isResponsiveObject<T>(current)) {
    return value;
  }

  const next: Partial<Record<Breakpoint, T>> = isResponsiveObject<T>(current)
    ? { ...current }
    : current !== undefined
      ? { desktop: current }
      : {};

  next[device] = value;

  return next;
}

/** Remove a single breakpoint from a responsive value. */
export function clearResponsiveValue<T>(
  current: ResponsiveValue<T> | undefined,
  device: Breakpoint,
): ResponsiveValue<T> | undefined {
  if (!isResponsiveObject<T>(current)) {
    return device === 'desktop' ? undefined : current;
  }

  const next = { ...current };
  delete next[device];

  const remaining = Object.values(next).filter((entry) => entry !== undefined);
  if (remaining.length === 0) {
    return undefined;
  }

  if (remaining.length === 1 && next.desktop !== undefined) {
    return next.desktop;
  }

  return next;
}

/** Whether a responsive value contains a value for the given breakpoint. */
export function hasBreakpointValue<T>(
  value: ResponsiveValue<T> | undefined,
  device: Breakpoint,
): boolean {
  if (value === undefined) {
    return false;
  }

  if (!isResponsiveObject<T>(value)) {
    return device === 'desktop';
  }

  return value[device] !== undefined;
}
