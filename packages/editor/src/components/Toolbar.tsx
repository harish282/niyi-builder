import { useEditorStore, type EditorDevice } from '../store.js';

interface ToolbarBootstrap {
  postTitle?: string;
  exitUrl?: string;
  isDevShell?: boolean;
}

function getToolbarBootstrap(): ToolbarBootstrap {
  if (typeof window === 'undefined') {
    return {};
  }

  const config = (window as Window & { niyiBuilderConfig?: ToolbarBootstrap }).niyiBuilderConfig;

  return config ?? {};
}

const DEVICES: { id: EditorDevice; label: string }[] = [
  { id: 'desktop', label: 'Desktop' },
  { id: 'tablet', label: 'Tablet' },
  { id: 'mobile', label: 'Mobile' },
];

export function Toolbar() {
  const device = useEditorStore((state) => state.device);
  const setDevice = useEditorStore((state) => state.setDevice);
  const isInserterOpen = useEditorStore((state) => state.isInserterOpen);
  const toggleInserter = useEditorStore((state) => state.toggleInserter);
  const bootstrap = getToolbarBootstrap();
  const postTitle = bootstrap.postTitle?.trim();

  return (
    <header className="niyi-editor__toolbar" aria-label="Builder toolbar">
      <div className="niyi-editor__toolbar-start">
        <span className="niyi-editor__brand">Niyi Builder</span>
        {postTitle ? <span className="niyi-editor__post-title">{postTitle}</span> : null}
        {bootstrap.exitUrl ? (
          <a className="niyi-editor__exit-link" href={bootstrap.exitUrl}>
            Default Editor
          </a>
        ) : null}
      </div>

      <div className="niyi-editor__toolbar-center">
        <div
          className="niyi-editor__device-switcher"
          role="group"
          aria-label="Responsive preview (coming soon)"
        >
          {DEVICES.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              className={
                device === id ? 'niyi-editor__device-btn is-active' : 'niyi-editor__device-btn'
              }
              aria-pressed={device === id}
              aria-label={label}
              title={`${label} preview (coming soon)`}
              disabled
              onClick={() => setDevice(id)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="niyi-editor__toolbar-end">
        <button
          type="button"
          className={isInserterOpen ? 'niyi-editor__btn is-active' : 'niyi-editor__btn'}
          aria-expanded={isInserterOpen}
          aria-haspopup="dialog"
          onClick={() => toggleInserter()}
        >
          Add element
        </button>
        <button
          type="button"
          className="niyi-editor__btn niyi-editor__btn--primary"
          disabled
          title="Coming soon"
        >
          Save
        </button>
      </div>
    </header>
  );
}
