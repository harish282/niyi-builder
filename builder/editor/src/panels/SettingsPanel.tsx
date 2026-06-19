import type { ReactElement } from 'react';

export function SettingsPanel(): ReactElement {
  return (
    <div className="w-64 flex-shrink-0 border-l border-[#c3c4c7] bg-white p-4">
      <h3 className="text-[14px] font-semibold mb-3">Settings</h3>
      <div className="text-gray-400 text-sm">Settings content will appear here</div>
    </div>
  );
}
