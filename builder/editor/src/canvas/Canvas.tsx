import type { ReactElement } from 'react';

export function Canvas(): ReactElement {
    return (
        <div className="flex-1 flex items-center justify-center bg-gray-50 overflow-auto">
            <div className="text-gray-400 text-lg">
                Drop elements here
            </div>
        </div>
    );
}