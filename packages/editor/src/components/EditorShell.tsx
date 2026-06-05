import { Canvas } from './Canvas.js';
import { Toolbar } from './Toolbar.js';

export function EditorShell() {
  return (
    <div className="niyi-editor">
      <Toolbar />
      <Canvas />
    </div>
  );
}
