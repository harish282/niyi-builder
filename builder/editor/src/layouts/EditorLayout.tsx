import type { ReactElement } from 'react';
import { Canvas } from '../canvas/Canvas.js';
import { ElementsPanel } from '../panels/ElementsPanel.js';
import { ElementWizard } from '../panels/ElementWizard.js';
import { PropertiesPanel } from '../panels/PropertiesPanel.js';
import { StatusBar } from '../status-bar/StatusBar.js';
import { TopBar } from '../toolbar/TopBar.js';
import { useEditorStore } from '../store/EditorStore.js';

export function EditorLayout(): ReactElement {
  const { pendingWizard, selectedElementId, showElements } = useEditorStore();

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#f0f0f1] text-[#1d2327] text-[13px] leading-relaxed">
      <TopBar />
      <div className="flex flex-row flex-1 overflow-hidden">
        {pendingWizard ? (
          <ElementWizard />
        ) : selectedElementId ? (
          <PropertiesPanel />
        ) : showElements ? (
          <ElementsPanel />
        ) : null}
        <Canvas />
      </div>
      <StatusBar />
    </div>
  );
}
