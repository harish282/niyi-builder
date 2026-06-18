import type { ReactElement } from 'react';

export function PropertiesPanel(): ReactElement {
    return (
        <div className="w-64 flex-shrink-0 border-l border-[#c3c4c7] bg-white p-4">
            <h3 className="text-[14px] font-semibold mb-3">Properties</h3>
            <div className="text-gray-400 text-sm">
                Property controls will appear here
            </div>
        </div>
    );
}