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
  const isDirty = useEditorStore((state) => state.isDirty);
  const isSaving = useEditorStore((state) => state.isSaving);
  const saveStatus = useEditorStore((state) => state.saveStatus);
  const isInserterOpen = useEditorStore((state) => state.isInserterOpen);
  const toggleInserter = useEditorStore((state) => state.toggleInserter);
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
    <header className="flex items-center gap-4 flex-shrink-0 min-h-[48px] px-4 py-2 bg-white border-b border-[#c3c4c7]" aria-label="Builder toolbar">
      <div className="flex items-center gap-2 flex-1">
        <span><img src={logoIcon} alt="Niyi Builder" className="h-8 w-auto" /></span>
        {postTitle ? <span className="text-[#50575e] text-[13px] max-w-[280px] truncate">{postTitle}</span> : null}
        <button
          type="button"
          className={`ml-4 px-3 py-1.5 border rounded text-[13px] transition-all ${isInserterOpen ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-[#c3c4c7] bg-[#f6f7f7] text-[#50575e] hover:bg-gray-100'}`}
          aria-pressed={isInserterOpen}
          onClick={() => toggleInserter()}
        >
          Add element
        </button>
        {bootstrap.exitUrl ? (
          <a
            className="text-[#2271b1] text-[13px] no-underline hover:underline hover:text-[#135e96]"
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
        {isDirty ? <span className="text-[12px] text-[#b32d2e]">Unsaved changes</span> : null}
      </div>

      <div className="flex justify-center">
        <div
          className="inline-flex border border-[#c3c4c7] rounded overflow-hidden"
          role="group"
          aria-label="Responsive preview (coming soon)"
        >
          {DEVICES.map(({ id, label, icon }) => (
            <button
              key={id}
              type="button"
              className={
                `px-3 py-1.5 text-[12px] border-r border-[#c3c4c7] last:border-r-0 transition-colors ${device === id ? 'bg-[#2271b1] text-white' : 'bg-[#f6f7f7] text-[#50575e] hover:bg-gray-100'}`
              }
              aria-pressed={device === id}
              aria-label={label}
              title={`${label} preview`}
              onClick={() => setDevice(id)}
            >
              {icon}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 flex-1 justify-end">
        {saveError ? (
          <span className="max-w-[220px] text-[12px] text-[#b32d2e] text-right" role="alert">
            {saveError}
          </span>
        ) : null}
        <button
          type="button"
          className="px-3 py-1.5 border border-[#c3c4c7] rounded bg-[#f6f7f7] text-[#50575e] text-[13px] hover:bg-gray-100"
          disabled={isSaving}
          title="Print Gutenberg markup to the browser console"
          onClick={() => printSavePayload(document)}
        >
          Print Save
        </button>
        <button
          type="button"
          className={
            `px-3 py-1.5 border rounded text-[13px] transition-colors disabled:opacity-60 ${saveStatus === 'saved' ? 'border-[#00a32a] bg-[#00a32a] text-white' : 'border-[#2271b1] bg-[#2271b1] text-white hover:bg-[#135e96]'}`
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
