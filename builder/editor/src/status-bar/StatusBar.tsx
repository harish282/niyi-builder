import type { ReactElement } from 'react';

export function StatusBar(): ReactElement {
    return (
        <footer className="flex items-center justify-center flex-shrink-0 min-h-[32px] px-4 py-2 bg-white border-t border-[#c3c4c7] text-[13px] text-gray-600">
            NiyiBuilder v1.0.0 | Ready
        </footer>
    );
}