import type { ReactElement } from 'react';
import { useEditorStore } from '../store/EditorStore.js';
import { createHeadingNode } from '../elements/heading/index.js';

export function ElementsPanel(): ReactElement {
  const { addElement } = useEditorStore();

  const handleAddHeading = () => {
    const headingNode = createHeadingNode();
    addElement(headingNode);
  };

  return (
    <div className="w-64 flex-shrink-0 border-r border-[#c3c4c7] bg-white p-4">
      <h3 className="text-[14px] font-semibold mb-3">Elements</h3>
      <button
        type="button"
        onClick={handleAddHeading}
        className="w-full px-3 py-2 text-sm border border-[#c3c4c7] rounded hover:bg-gray-50"
      >
        Add Heading
      </button>
    </div>
  );
}
