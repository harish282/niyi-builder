import type { FC } from 'react';
import type { ElementNode } from '@niyi-builder/core';
import { containerDefaults, flexDefaults, gridDefaults } from './defaults.js';
import type { ContainerLayout } from './definition.js';
import {
  OptionGroup,
  NumberOption,
  countIcon,
  directionRowIcon,
  directionColumnIcon,
  justifyIcons,
  alignIcons,
  gapIcons,
} from './controls.js';

interface ContainerPropertiesProps {
  node: ElementNode;
  onUpdate: (attributes: Record<string, unknown>) => void;
}

type LayoutType = 'flex' | 'grid';

const JUSTIFY_OPTIONS = [
  { value: 'start', label: 'Start' },
  { value: 'center', label: 'Center' },
  { value: 'end', label: 'End' },
  { value: 'between', label: 'Between' },
  { value: 'around', label: 'Around' },
  { value: 'evenly', label: 'Evenly' },
];

const ALIGN_OPTIONS = [
  { value: 'start', label: 'Start' },
  { value: 'center', label: 'Center' },
  { value: 'end', label: 'End' },
  { value: 'stretch', label: 'Stretch' },
];

const GAP_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'sm', label: 'Small' },
  { value: 'md', label: 'Medium' },
  { value: 'lg', label: 'Large' },
];

const COUNTS = [1, 2, 3, 4, 5, 6] as const;

export const ContainerProperties: FC<ContainerPropertiesProps> = ({ node, onUpdate }) => {
  const layout = (node.attributes.layout as ContainerLayout) || containerDefaults.layout;
  const type: LayoutType = layout.type === 'grid' ? 'grid' : 'flex';

  const updateLayout = (partial: Partial<ContainerLayout>) => {
    onUpdate({ layout: { ...layout, ...partial } });
  };

  const flexCount = layout.direction === 'column' ? layout.rows : layout.columns;

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold mb-1">Layout Type</label>
        <select
          value={type}
          onChange={(e) => {
            const nextType = e.currentTarget.value as LayoutType;
            onUpdate({
              layout:
                nextType === 'grid'
                  ? { ...gridDefaults }
                  : {
                      ...flexDefaults,
                      direction: layout.direction === 'column' ? 'column' : 'row',
                    },
            });
          }}
          className="w-full border rounded px-2 py-1 text-sm"
        >
          <option value="flex">Flex</option>
          <option value="grid">Grid</option>
        </select>
      </div>

      {type === 'flex' ? (
        <>
          <OptionGroup
            label="Direction"
            value={layout.direction ?? 'row'}
            onChange={(v) => updateLayout({ direction: v as 'row' | 'column' })}
            options={[
              { value: 'row', label: 'Row', icon: directionRowIcon },
              { value: 'column', label: 'Column', icon: directionColumnIcon },
            ]}
          />
          <OptionGroup
            label={layout.direction === 'column' ? 'Rows per column' : 'Columns per row'}
            value={String(flexCount ?? 2)}
            onChange={(v) =>
              layout.direction === 'column'
                ? updateLayout({ rows: Number(v) })
                : updateLayout({ columns: Number(v) })
            }
            options={[...COUNTS].map((n) => ({
              value: String(n),
              label: String(n),
              icon: countIcon(n),
            }))}
          />
          <OptionGroup
            label="Justify Content"
            value={layout.justify ?? 'start'}
            onChange={(v) => updateLayout({ justify: v as ContainerLayout['justify'] })}
            options={JUSTIFY_OPTIONS.map((o) => ({ ...o, icon: justifyIcons[o.value] }))}
          />
          <OptionGroup
            label="Align Items"
            value={layout.align ?? 'start'}
            onChange={(v) => updateLayout({ align: v as ContainerLayout['align'] })}
            options={ALIGN_OPTIONS.map((o) => ({ ...o, icon: alignIcons[o.value] }))}
          />
        </>
      ) : (
        <>
          <NumberOption
            label="Columns"
            value={layout.columns ?? 2}
            onChange={(v) => updateLayout({ columns: Number(v) })}
            options={[...COUNTS]}
          />
          <NumberOption
            label="Rows"
            value={layout.rows ?? 'auto'}
            onChange={(v) => updateLayout({ rows: v })}
            options={['auto', ...COUNTS]}
          />
          <OptionGroup
            label="Justify Items"
            value={layout.justifyItems ?? 'stretch'}
            onChange={(v) => updateLayout({ justifyItems: v as ContainerLayout['justifyItems'] })}
            options={ALIGN_OPTIONS.map((o) => ({ ...o, icon: alignIcons[o.value] }))}
          />
          <OptionGroup
            label="Align Items"
            value={layout.alignItems ?? 'stretch'}
            onChange={(v) => updateLayout({ alignItems: v as ContainerLayout['alignItems'] })}
            options={ALIGN_OPTIONS.map((o) => ({ ...o, icon: alignIcons[o.value] }))}
          />
        </>
      )}

      <OptionGroup
        label="Gap"
        value={layout.gap ?? 'md'}
        onChange={(v) => updateLayout({ gap: v as ContainerLayout['gap'] })}
        options={GAP_OPTIONS.map((o) => ({ ...o, icon: gapIcons[o.value] }))}
      />
    </div>
  );
};
