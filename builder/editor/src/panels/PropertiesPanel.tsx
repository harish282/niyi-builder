import type { ReactElement, FC } from 'react';
import type { ElementNode, BaseElementAttributes } from '@niyi-builder/core';
import { useEditorStore } from '../store/EditorStore.js';
import {
  CollapsibleSection,
  TypographySection,
  ColorsSection,
  SpacingSection,
  DimensionsSection,
  BorderSection,
  EffectsSection,
  AdvancedSection,
} from './styles/index.js';

type PropertiesProps = { node: ElementNode; onUpdate: (attrs: Record<string, unknown>) => void };

const BASE_KEYS: (keyof BaseElementAttributes)[] = [
  'textColor', 'bgColor',
  'fontFamily', 'fontSize', 'fontWeight', 'lineHeight', 'letterSpacing',
  'textAlign', 'textDecoration', 'textTransform',
  'marginTop', 'marginRight', 'marginBottom', 'marginLeft',
  'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
  'width', 'height', 'minWidth', 'minHeight', 'maxWidth', 'maxHeight',
  'borderWidth', 'borderStyle', 'borderColor', 'borderRadius',
  'opacity', 'boxShadow',
  'cssClass', 'customCss', 'htmlId',
];

function extractBaseAttributes(attributes: Record<string, unknown>): BaseElementAttributes {
  const base: Record<string, unknown> = {};
  for (const key of BASE_KEYS) {
    if (attributes[key] !== undefined) {
      base[key] = attributes[key];
    }
  }
  return base as BaseElementAttributes;
}

export function PropertiesPanel(): ReactElement {
  const { selectedElementId, updateElement, findElement } = useEditorStore();

  const selectedElement = selectedElementId ? findElement(selectedElementId) : null;

  if (!selectedElement) {
    return (
      <div className="w-64 flex-shrink-0 border-r border-[#c3c4c7] bg-white overflow-y-auto">
        <h3 className="text-[14px] font-semibold px-4 py-3 border-b border-[#e0e0e0]">Properties</h3>
        <div className="p-4 text-gray-400 text-sm">Select an element to edit its properties</div>
      </div>
    );
  }

  const registry = window.__niyiRegistry;
  const definition = registry?.getElement(selectedElement.type);

  const updateAttributes = (attributes: Record<string, unknown>) => {
    updateElement(selectedElementId!, { attributes });
  };

  const updateBaseAttributes = (baseAttrs: Partial<BaseElementAttributes>) => {
    updateAttributes({ ...selectedElement.attributes, ...baseAttrs });
  };

  const baseAttributes = extractBaseAttributes(selectedElement.attributes);
  const PropsComp = definition?.Properties as FC<PropertiesProps> | undefined;

  return (
    <div className="w-64 flex-shrink-0 border-r border-[#c3c4c7] bg-white overflow-y-auto">
      <h3 className="text-[14px] font-semibold px-4 py-3 border-b border-[#e0e0e0]">
        {selectedElement.type}
      </h3>

      {/* Element-specific controls */}
      {PropsComp && (
        <CollapsibleSection title="Settings" defaultOpen>
          <div className="-mx-1">
            <PropsComp node={selectedElement} onUpdate={updateAttributes} />
          </div>
        </CollapsibleSection>
      )}

      {/* Base style sections */}
      <TypographySection attributes={baseAttributes} onUpdate={updateBaseAttributes} />
      <ColorsSection attributes={baseAttributes} onUpdate={updateBaseAttributes} />
      <SpacingSection attributes={baseAttributes} onUpdate={updateBaseAttributes} />
      <DimensionsSection attributes={baseAttributes} onUpdate={updateBaseAttributes} />
      <BorderSection attributes={baseAttributes} onUpdate={updateBaseAttributes} />
      <EffectsSection attributes={baseAttributes} onUpdate={updateBaseAttributes} />
      <AdvancedSection attributes={baseAttributes} onUpdate={updateBaseAttributes} />
    </div>
  );
}
