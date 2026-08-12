import { useState, type ReactElement } from 'react';
import { useEditorStore } from '../store/EditorStore.js';
import { getEditorRuntimeConfig, switchToGutenbergEditor } from '../serialization/index.js';

export function TopBar(): ReactElement {
  const { document } = useEditorStore();
  const [isSwitching, setIsSwitching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSwitchToGutenberg = async (): Promise<void> => {
    const config = getEditorRuntimeConfig();

    if (!config) {
      return;
    }

    setIsSwitching(true);
    setError(null);

    try {
      await switchToGutenbergEditor(config, document);
    } catch (switchError) {
      setError(switchError instanceof Error ? switchError.message : 'Failed to switch editor.');
      setIsSwitching(false);
    }
  };

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
        {error && (
          <span className="text-[12px] text-red-600" role="alert">
            {error}
          </span>
        )}
        <button
          type="button"
          onClick={() => void handleSwitchToGutenberg()}
          disabled={isSwitching}
          className="px-3 py-1.5 border border-[#c3c4c7] rounded bg-[#f6f7f7] text-[#50575e] text-[13px] hover:bg-gray-100 disabled:opacity-50"
        >
          {isSwitching ? 'Saving…' : 'Switch to Gutenberg'}
        </button>
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
