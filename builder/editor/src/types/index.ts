import type { ReactElement } from 'react';

export type ThemeMode = 'light' | 'dark';

export interface PanelDefinition {
    id: string;
    title: string;
    component: () => ReactElement | null;
}

export type LeftPanelId = 'elements' | 'navigator';
export type RightPanelId = 'properties' | 'settings';