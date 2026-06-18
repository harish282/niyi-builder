import type { ReactElement } from 'react';

export function NavigatorPanel(): ReactElement {
    return (
        <div className="w-64 flex-shrink-0 border-r border-[#c3c4c7] bg-white p-4">
            <h3 className="text-[14px] font-semibold mb-3">Navigator</h3>
            <div className="text-gray-400 text-sm">
                Navigator content will appear here
            </div>
        </div>
    );
}