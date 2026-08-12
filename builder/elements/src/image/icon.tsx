import type { ReactElement } from 'react';

export const ImageIcon = (): ReactElement => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="3" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="5.5" cy="6.5" r="1.25" fill="currentColor" />
    <path d="M3 12l3.5-3.5 2.5 2.5 2-2L14 11.5" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);
