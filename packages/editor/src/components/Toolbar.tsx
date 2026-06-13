import { useEffect, type ReactNode } from 'react';
import DesktopIcon from '@mui/icons-material/DesktopWindows';
import TabletIcon from '@mui/icons-material/TabletAndroid';
import MobileIcon from '@mui/icons-material/Smartphone';

import logoIcon from '../../../../assets/images/icon-1.svg';
import { getBuilderSaveConfig } from '../save-config.js';
import { printSavePayload } from '../save-document.js';
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

const DEVICES: { id: EditorDevice; label: string; icon: ReactNode }[] = [
  {
    id: 'desktop',
    label: 'Desktop',
    icon: <DesktopIcon fontSize="small" />,
  },
  {
    id: 'tablet',
    label: 'Tablet',
    icon: <TabletIcon fontSize="small" />,
  },
  {
    id: 'mobile',
    label: 'Mobile',
    icon: <MobileIcon fontSize="small" />,
  },
];

export function Toolbar() {
  const device = useEditorStore((state) => state.device);
  const setDevice = useEditorStore((state) => state.setDevice);
  const isInserterOpen = useEditorStore((state) => state.isInserterOpen);
  const toggleInserter = useEditorStore((state) => state.toggleInserter);
  const isDirty = useEditorStore((state) => state.isDirty);
  const isSaving = useEditorStore((state) => state.isSaving);
  const saveStatus = useEditorStore((state) => state.saveStatus);
  const saveError = useEditorStore((state) => state.saveError);
  const document = useEditorStore((state) => state.document);
  const saveDocument = useEditorStore((state) => state.saveDocument);
  const saveBeforeEditorSwitch = useEditorStore((state) => state.saveBeforeEditorSwitch);
  const clearSaveFeedback = useEditorStore((state) => state.clearSaveFeedback);
  const bootstrap = getToolbarBootstrap();
  const postTitle = bootstrap.postTitle?.trim();
  const canSave = getBuilderSaveConfig() !== null;

  useEffect(() => {
    if (saveStatus !== 'saved') {
      return;
    }

    const timer = window.setTimeout(() => {
      clearSaveFeedback();
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [saveStatus, clearSaveFeedback]);

  const saveLabel = isSaving ? 'Saving…' : saveStatus === 'saved' ? 'Saved' : 'Save';

  return (
    <header className="niyi-editor__toolbar" aria-label="Builder toolbar">
      <div className="niyi-editor__toolbar-start">
        <span><img src={logoIcon} alt="Niyi Builder" className="h-8 w-auto" /></span>
        {postTitle ? <span className="niyi-editor__post-title">{postTitle}</span> : null}
        {bootstrap.exitUrl ? (
          <a
            className="niyi-editor__exit-link"
            href={bootstrap.exitUrl}
            onClick={(event) => {
              if (isSaving) {
                event.preventDefault();
                return;
              }
              if (!isDirty) {
                return;
              }

              event.preventDefault();
              void (async () => {
                const saved = await saveBeforeEditorSwitch();

                if (saved) {
                  window.location.assign(bootstrap.exitUrl as string);
                } else {
                  alert('Failed to save changes. Please try again before leaving.');
                }
              })();
            }}
          >
            Default Editor
          </a>
        ) : null}
        {isDirty ? <span className="niyi-editor__dirty-indicator">Unsaved changes</span> : null}
      </div>

      <div className="niyi-editor__toolbar-center">
        <div
          className="niyi-editor__device-switcher"
          role="group"
          aria-label="Responsive preview (coming soon)"
        >
          {DEVICES.map(({ id, label, icon }) => (
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
              {icon}
            </button>
          ))}
        </div>
      </div>

      <div className="niyi-editor__toolbar-end">
        {saveError ? (
          <span className="niyi-editor__save-error" role="alert">
            {saveError}
          </span>
        ) : null}
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
          className="niyi-editor__btn"
          disabled={isSaving}
          title="Print Gutenberg markup to the browser console"
          onClick={() => printSavePayload(document)}
        >
          Print Save
        </button>
        <button
          type="button"
          className={
            saveStatus === 'saved'
              ? 'niyi-editor__btn niyi-editor__btn--primary is-saved'
              : 'niyi-editor__btn niyi-editor__btn--primary'
          }
          disabled={!canSave || isSaving}
          title={
            !canSave ? 'Save is available when editing a post or page' : 'Save to WordPress'
          }
          onClick={() => void saveDocument()}
        >
          {saveLabel}
        </button>
      </div>
    </header>
  );
}
