import { Canvas } from './Canvas.js';
import { Inserter } from './Inserter.js';
import { Inspector } from './Inspector.js';
import { Toolbar } from './Toolbar.js';

export function EditorShell() {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#f0f0f1] text-[#1d2327] text-[13px] leading-relaxed">
      <Toolbar />
      <div className="flex flex-row flex-1 overflow-hidden bg-gray-100">
        <Inserter />
        <Canvas />
        <Inspector />
      </div>
    </div>
  );
}
