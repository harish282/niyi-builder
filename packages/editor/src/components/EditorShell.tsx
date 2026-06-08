import { Canvas } from './Canvas.js';
import { Inserter } from './Inserter.js';
import { Toolbar } from './Toolbar.js';

export function EditorShell() {
  return (
    <div className="niyi-editor">
      <Toolbar />
      <Canvas />
      <Inserter />
    </div>
  );
}
