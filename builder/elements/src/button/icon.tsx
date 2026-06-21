import type { ReactElement } from 'react';

export const ButtonIcon = (): ReactElement => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <rect x="2" y="3" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M6 7h4M6 9h2.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);
