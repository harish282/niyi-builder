import type { FC } from 'react';
import { useEditorStore } from '../../store/EditorStore.js';

export const SelectionOverlay: FC = () => {
    const { selectedElementId } = useEditorStore();

    if (!selectedElementId) {
        return null;
    }

    return (
        <div 
            className="absolute pointer-events-none border-2 border-blue-500"
            style={{ 
                top: '100px', 
                left: '100px', 
                right: '100px',
                height: '100px' 
            }}
        />
    );
};