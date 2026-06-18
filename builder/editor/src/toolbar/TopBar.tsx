import type { ReactElement } from 'react';

export function TopBar(): ReactElement {
    return (
        <header className="flex items-center justify-between flex-shrink-0 min-h-[48px] px-4 py-2 bg-white border-b border-[#c3c4c7]">
            <div className="flex items-center gap-2">
                <button 
                    type="button"
                    className="px-3 py-1.5 border border-[#c3c4c7] rounded bg-[#f6f7f7] text-[#50575e] text-[13px] hover:bg-gray-100"
                >
                    Undo
                </button>
                <button 
                    type="button"
                    className="px-3 py-1.5 border border-[#c3c4c7] rounded bg-[#f6f7f7] text-[#50575e] text-[13px] hover:bg-gray-100"
                >
                    Redo
                </button>
            </div>
            <div className="flex items-center gap-2">
                <button 
                    type="button"
                    className="px-3 py-1.5 border border-[#c3c4c7] rounded bg-[#f6f7f7] text-[#50575e] text-[13px] hover:bg-gray-100"
                >
                    Save
                </button>
                <button 
                    type="button"
                    className="px-3 py-1.5 border border-[#c3c4c7] rounded bg-[#f6f7f7] text-[#50575e] text-[13px] hover:bg-gray-100"
                >
                    Preview
                </button>
                <button 
                    type="button"
                    className="px-3 py-1.5 border border-[#2271b1] rounded bg-[#2271b1] text-white text-[13px] hover:bg-[#135e96]"
                >
                    Publish
                </button>
            </div>
        </header>
    );
}