export const GAP_SIZES = {
  none: '0px',
  sm: '8px',
  md: '16px',
  lg: '24px',
} as const;

export type ContainerGap = keyof typeof GAP_SIZES;

export const flexDefaults = {
  type: 'flex',
  direction: 'row',
  columns: 2,
  rows: 2,
  justify: 'start',
  align: 'start',
  gap: 'md',
} as const;

export const gridDefaults = {
  type: 'grid',
  columns: 2,
  rows: 'auto',
  gap: 'md',
  justifyItems: 'stretch',
  alignItems: 'stretch',
} as const;

export const containerDefaults = { layout: flexDefaults };
