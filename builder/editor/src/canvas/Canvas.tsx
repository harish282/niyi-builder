import type { ReactElement } from 'react';
import { CanvasRenderer } from './CanvasRenderer.js';

export function Canvas(): ReactElement {
    return <CanvasRenderer nodes={[]} />;
}