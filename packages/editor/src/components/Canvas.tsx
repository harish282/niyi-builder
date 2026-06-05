import { useEditorStore } from '../store.js';

export function Canvas() {
  const document = useEditorStore((state) => state.document);
  const device = useEditorStore((state) => state.device);

  return (
    <main className="niyi-editor__canvas-wrap" aria-label="Builder canvas">
      <div className="niyi-editor__canvas" data-device={device}>
        <div className="niyi-editor__canvas-inner">
          <p className="niyi-editor__canvas-empty">
            Canvas ready — block rendering arrives in the next sprint.
          </p>
          <dl className="niyi-editor__canvas-meta">
            <div>
              <dt>Document version</dt>
              <dd>{document.version}</dd>
            </div>
            <div>
              <dt>Root block</dt>
              <dd>{document.root.type}</dd>
            </div>
            <div>
              <dt>Preview device</dt>
              <dd>{device}</dd>
            </div>
          </dl>
        </div>
      </div>
    </main>
  );
}
