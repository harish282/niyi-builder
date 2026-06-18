import type { ReactElement } from 'react';

export function ElementsPanel(): ReactElement {
    return (
        <div className="w-64 flex-shrink-0 border-r border-[#c3c4c7] bg-white p-4">
            <h3 className="text-[14px] font-semibold mb-3">Elements</h3>
            <div className="text-gray-400 text-sm">
                Element components will appear here
            </div>
        </div>
    );
}