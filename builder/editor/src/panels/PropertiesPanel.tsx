import type { ReactElement } from 'react';
import { useEditorStore } from '../store/EditorStore.js';
import type { ElementNode } from '../../../../core/src/types/index.js';

export function PropertiesPanel(): ReactElement {
    const { document, selectedElementId } = useEditorStore();

    const selectedElement = selectedElementId 
        ? (document as any).findElement(selectedElementId) 
        : null;

    if (!selectedElement) {
        return (
            <div className="w-64 flex-shrink-0 border-l border-[#c3c4c7] bg-white p-4">
                <h3 className="text-[14px] font-semibold mb-3">Properties</h3>
                <div className="text-gray-400 text-sm">
                    Select an element to edit its properties
                </div>
            </div>
        );
    }

    const updateAttributes = (attributes: Record<string, unknown>) => {
        (document as any).updateElement(selectedElementId!, { attributes });
    };

    // Load Properties component dynamically based on element type
    let PropertiesComponent: React.ComponentType<any> | null = null;
    
    if (selectedElement.type === 'heading') {
        const { HeadingProperties } = require('../elements/heading/properties.js');
        PropertiesComponent = HeadingProperties;
    }

    if (PropertiesComponent) {
        return (
            <div className="w-64 flex-shrink-0 border-l border-[#c3c4c7] bg-white p-4">
                <h3 className="text-[14px] font-semibold mb-3">Properties: {selectedElement.type}</h3>
                <PropertiesComponent node={selectedElement} onUpdate={updateAttributes} />
            </div>
        );
    }

    return (
        <div className="w-64 flex-shrink-0 border-l border-[#c3c4c7] bg-white p-4">
            <h3 className="text-[14px] font-semibold mb-3">Properties</h3>
            <div className="text-gray-400 text-sm">
                No property controls for this element type
            </div>
        </div>
    );
}