import type { ReactElement, FC } from 'react';
import type { ElementNode } from '@niyi-builder/core';
import { BREAKPOINTS, extractBaseAttributes } from '@niyi-builder/core';
import { useEditorStore } from '../store/EditorStore.js';
import {
  CollapsibleSection,
  TypographySection,
  ColorsSection,
  BackgroundSection,
  SpacingSection,
  DimensionsSection,
  BorderSection,
  EffectsSection,
  TransformSection,
  TransitionSection,
  PositionSection,
  AnimationSection,
  LinkSection,
  VisibilitySection,
  AdvancedSection,
} from './styles/index.js';

type PropertiesProps = { node: ElementNode; onUpdate: (attrs: Record<string, unknown>) => void };

const DEVICE_LABELS: Record<(typeof BREAKPOINTS)[number], string> = {
  desktop: 'Desktop',
  tablet: 'Tablet',
  mobile: 'Mobile',
};

export function PropertiesPanel(): ReactElement {
  const { selectedElementId, updateElement, findElement, activeBreakpoint, setActiveBreakpoint } =
    useEditorStore();

  const selectedElement = selectedElementId ? findElement(selectedElementId) : null;

  if (!selectedElement) {
    return (
      <div className="w-64 flex-shrink-0 border-r border-[#c3c4c7] bg-white overflow-y-auto">
        <h3 className="text-[14px] font-semibold px-4 py-3 border-b border-[#e0e0e0]">
          Properties
        </h3>
        <div className="p-4 text-gray-400 text-sm">Select an element to edit its properties</div>
      </div>
    );
  }

  const registry = window.__niyiRegistry;
  const definition = registry?.getElement(selectedElement.type);

  const updateAttributes = (attributes: Record<string, unknown>) => {
    updateElement(selectedElementId!, { attributes });
  };

  const updateBaseAttributes = (baseAttrs: Record<string, unknown>) => {
    updateAttributes(baseAttrs);
  };

  const baseAttributes = extractBaseAttributes(selectedElement.attributes);
  const PropsComp = definition?.Properties as FC<PropertiesProps> | undefined;
  const sectionProps = {
    attributes: baseAttributes,
    device: activeBreakpoint,
    onUpdate: updateBaseAttributes,
  };

  return (
    <div className="w-64 flex-shrink-0 border-r border-[#c3c4c7] bg-white overflow-y-auto">
      <h3 className="text-[14px] font-semibold px-4 py-3 border-b border-[#e0e0e0]">
        {definition?.title ?? selectedElement.type}
      </h3>

      <div className="flex items-center gap-1 px-4 py-2 border-b border-[#e0e0e0] bg-[#f6f7f7]">
        {BREAKPOINTS.map((breakpoint) => (
          <button
            key={breakpoint}
            type="button"
            onClick={() => setActiveBreakpoint(breakpoint)}
            className={`flex-1 px-2 py-1 rounded text-[11px] border ${
              activeBreakpoint === breakpoint
                ? 'border-[#2271b1] bg-white text-[#2271b1] font-semibold'
                : 'border-transparent text-gray-500 hover:bg-white'
            }`}
          >
            {DEVICE_LABELS[breakpoint]}
          </button>
        ))}
      </div>

      {/* Element-specific controls */}
      {PropsComp && (
        <CollapsibleSection title="Settings" defaultOpen>
          <div className="-mx-1">
            <PropsComp node={selectedElement} onUpdate={updateAttributes} />
          </div>
        </CollapsibleSection>
      )}

      {/* Base style sections */}
      <TypographySection {...sectionProps} />
      <ColorsSection {...sectionProps} />
      <BackgroundSection {...sectionProps} />
      <SpacingSection {...sectionProps} />
      <DimensionsSection {...sectionProps} />
      <BorderSection {...sectionProps} />
      <EffectsSection {...sectionProps} />
      <TransformSection {...sectionProps} />
      <TransitionSection {...sectionProps} />
      <PositionSection {...sectionProps} />
      <AnimationSection {...sectionProps} />
      <LinkSection {...sectionProps} />
      <VisibilitySection {...sectionProps} />
      <AdvancedSection {...sectionProps} />
    </div>
  );
}
