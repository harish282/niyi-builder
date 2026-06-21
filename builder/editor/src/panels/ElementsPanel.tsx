import type { ReactElement } from 'react';
import type { ElementDefinition, ElementNode } from '@niyi-builder/core';
import { useEditorStore } from '../store/EditorStore.js';
import { generateId, logger } from '@niyi-builder/core';

const DEFAULT_ICON = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M5 8H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

function ElementEntry({ definition }: { definition: ElementDefinition }): ReactElement {
  const { addElement } = useEditorStore();

  const handleAdd = () => {
    const node: ElementNode = {
      id: generateId(),
      type: definition.type,
      attributes: definition.defaults,
      children: [],
    };
    addElement(node);
  };

  return (
    <button
      type="button"
      onClick={handleAdd}
      className="flex items-center gap-2 w-full px-3 py-2 text-sm border border-[#c3c4c7] rounded hover:bg-gray-50"
    >
      <span className="text-gray-500 flex-shrink-0">
        {definition.icon ? (
          <span className="[&>svg]:w-4 [&>svg]:h-4">{definition.icon as ReactElement}</span>
        ) : (
          DEFAULT_ICON
        )}
      </span>
      <span className="truncate">{definition.title}</span>
    </button>
  );
}

export function ElementsPanel(): ReactElement {
  const registry = window.__niyiRegistry;
  const elements = registry?.getAllElements() ?? [];

  logger.info('Elements Panel', [window.__niyiRegistry]);

  const grouped = elements.reduce<Map<string, ElementDefinition[]>>((acc, el) => {
    const group = el.category || 'general';
    if (!acc.has(group)) {
      acc.set(group, []);
    }
    acc.get(group)!.push(el);
    return acc;
  }, new Map());

  const groups = Array.from(grouped.entries()).sort(([a], [b]) => a.localeCompare(b));

  return (
    <div className="w-64 flex-shrink-0 border-r border-[#c3c4c7] bg-white p-4">
      <h3 className="text-[14px] font-semibold mb-3">Elements</h3>
      {groups.map(([group, items]) => (
        <div key={group} className="mb-4 last:mb-0">
          <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
            {group}
          </h4>
          <div className="space-y-2">
            {items.map((def) => (
              <ElementEntry key={def.type} definition={def} />
            ))}
          </div>
        </div>
      ))}
      {elements.length === 0 && <div className="text-sm text-gray-400">No elements registered</div>}
    </div>
  );
}
