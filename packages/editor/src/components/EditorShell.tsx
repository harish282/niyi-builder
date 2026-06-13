import { Canvas } from './Canvas.js';
import { Inserter } from './Inserter.js';
import { Inspector } from './Inspector.js';
import { Toolbar } from './Toolbar.js';

export function EditorShell() {
  return (
    <div className="niyi-editor">
      <Toolbar />
      <div className="niyi-editor__main-area">
        <Canvas />
        <Inspector />
        <Inserter />
      </div>
    </div>
  );
}
