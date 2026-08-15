import type { ReactElement } from 'react';
import type { ElementNode } from '@niyi-builder/core';

export type ThemeMode = 'light' | 'dark';

export interface PanelDefinition {
  id: string;
  title: string;
  component: () => ReactElement | null;
}

export type LeftPanelId = 'elements' | 'navigator';
export type RightPanelId = 'properties' | 'settings';

export interface ElementWizardProps {
  node: ElementNode;
  onComplete: (attributes: Record<string, unknown>) => void;
  onCancel: () => void;
}
