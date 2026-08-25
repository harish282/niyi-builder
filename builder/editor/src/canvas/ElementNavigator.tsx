import type { ReactElement } from 'react';
import type { ElementNode } from '@niyi-builder/core';

interface ElementNavigatorProps {
  path: ElementNode[];
  onSelect: (id: string) => void;
}

export function ElementNavigator({ path, onSelect }: ElementNavigatorProps): ReactElement {
  return (
    <div
      className="relative z-10 flex items-center gap-1.5 bg-[#1d2327] text-white text-[11px] leading-none px-2 py-1 rounded-b -mt-px"
      onClick={(e) => e.stopPropagation()}
    >
      <span className="opacity-50 select-none cursor-grab" title="Drag to move">
        &#8942;&#8942;
      </span>
      <ol className="flex items-center gap-1 min-w-0">
        {path.map((el, i) => {
          const isLast = i === path.length - 1;
          return (
            <li key={el.id} className="flex items-center gap-1 min-w-0">
              {i > 0 && <span className="opacity-40">&#8250;</span>}
              <button
                type="button"
                title={isLast ? 'Selected element' : `Select ${el.type}`}
                onClick={() => onSelect(el.id)}
                className={`truncate max-w-[110px] rounded px-1 py-0.5 hover:bg-white/20 ${
                  isLast ? 'font-semibold text-white' : 'text-white/80'
                }`}
              >
                {el.type}
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
