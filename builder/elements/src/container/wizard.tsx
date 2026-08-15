import type { FC, ReactElement } from 'react';
import { useState } from 'react';
import type { ElementNode } from '@niyi-builder/core';
import { buildFlexLayout, buildGridLayout } from './options.js';
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

interface ContainerWizardProps {
  node: ElementNode;
  onComplete: (attributes: Record<string, unknown>) => void;
  onCancel: () => void;
}

type LayoutType = 'flex' | 'grid';
type FlexDirection = 'row' | 'column';
type Distribution = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
type CrossAlign = 'start' | 'center' | 'end' | 'stretch';
type Gap = 'none' | 'sm' | 'md' | 'lg';

const JUSTIFY_OPTIONS: { value: Distribution; label: string }[] = [
  { value: 'start', label: 'Start' },
  { value: 'center', label: 'Center' },
  { value: 'end', label: 'End' },
  { value: 'between', label: 'Between' },
  { value: 'around', label: 'Around' },
  { value: 'evenly', label: 'Evenly' },
];

const ALIGN_OPTIONS: { value: CrossAlign; label: string }[] = [
  { value: 'start', label: 'Start' },
  { value: 'center', label: 'Center' },
  { value: 'end', label: 'End' },
  { value: 'stretch', label: 'Stretch' },
];

const GAP_OPTIONS: { value: Gap; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'sm', label: 'Small' },
  { value: 'md', label: 'Medium' },
  { value: 'lg', label: 'Large' },
];

const COLUMN_COUNTS = [1, 2, 3, 4, 5, 6] as const;
type GridRows = 'auto' | 1 | 2 | 3 | 4 | 5 | 6;
const ROW_COUNTS: GridRows[] = ['auto', 1, 2, 3, 4, 5, 6];

function TypeCard({
  title,
  description,
  icon,
  onClick,
}: {
  title: string;
  description: string;
  icon: ReactElement;
  onClick: () => void;
}): ReactElement {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full border rounded-lg p-3 text-left transition-colors hover:bg-gray-50"
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[#007cba] [&>svg]:w-5 [&>svg]:h-5">{icon}</span>
        <span className="font-semibold text-sm">{title}</span>
      </div>
      <div className="text-xs text-gray-500">{description}</div>
    </button>
  );
}

const FLEX_ICON = (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="3" width="7" height="14" rx="1.5" fill="currentColor" opacity="0.9" />
    <rect x="11" y="3" width="7" height="14" rx="1.5" fill="currentColor" opacity="0.45" />
  </svg>
);

const GRID_ICON = (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="7.5" height="7.5" rx="1.5" fill="currentColor" opacity="0.9" />
    <rect x="10.5" y="2" width="7.5" height="7.5" rx="1.5" fill="currentColor" opacity="0.45" />
    <rect x="2" y="10.5" width="7.5" height="7.5" rx="1.5" fill="currentColor" opacity="0.45" />
    <rect x="10.5" y="10.5" width="7.5" height="7.5" rx="1.5" fill="currentColor" opacity="0.45" />
  </svg>
);

export const ContainerWizard: FC<ContainerWizardProps> = ({ onComplete, onCancel }) => {
  const [type, setType] = useState<LayoutType | null>(null);

  const [flexDirection, setFlexDirection] = useState<FlexDirection>('row');
  const [flexColumns, setFlexColumns] = useState<number>(2);
  const [flexRows, setFlexRows] = useState<number>(2);
  const [flexJustify, setFlexJustify] = useState<Distribution>('start');
  const [flexAlign, setFlexAlign] = useState<CrossAlign>('start');
  const [flexGap, setFlexGap] = useState<Gap>('md');

  const [gridColumns, setGridColumns] = useState<number>(2);
  const [gridRows, setGridRows] = useState<GridRows>('auto');
  const [gridGap, setGridGap] = useState<Gap>('md');
  const [gridJustifyItems, setGridJustifyItems] = useState<CrossAlign>('stretch');
  const [gridAlignItems, setGridAlignItems] = useState<CrossAlign>('stretch');

  if (!type) {
    return (
      <div className="space-y-3">
        <TypeCard
          title="Flexbox"
          description="One-dimensional layout. Align items in a row or column with full control over distribution."
          icon={FLEX_ICON}
          onClick={() => setType('flex')}
        />
        <TypeCard
          title="Grid"
          description="Two-dimensional layout. Place items across columns and rows with equal cell sizing."
          icon={GRID_ICON}
          onClick={() => setType('grid')}
        />
        <div className="pt-2 flex justify-between">
          <button
            type="button"
            onClick={onCancel}
            className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  const handleCreate = () => {
    const layout =
      type === 'flex'
        ? buildFlexLayout({
            direction: flexDirection,
            columns: flexColumns,
            rows: flexRows,
            justify: flexJustify,
            align: flexAlign,
            gap: flexGap,
          })
        : buildGridLayout({
            columns: gridColumns,
            rows: gridRows,
            gap: gridGap,
            justifyItems: gridJustifyItems,
            alignItems: gridAlignItems,
          });
    onComplete({ layout });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setType(null)}
          className="text-xs text-gray-500 hover:text-gray-700 px-1 py-0.5 rounded"
          aria-label="Back"
        >
          &larr; Back
        </button>
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          {type === 'flex' ? 'Flexbox Options' : 'Grid Options'}
        </span>
      </div>

      {type === 'flex' ? (
        <>
          <OptionGroup
            label="Direction"
            value={flexDirection}
            onChange={(v) => setFlexDirection(v as FlexDirection)}
            options={[
              { value: 'row', label: 'Row', icon: directionRowIcon },
              { value: 'column', label: 'Column', icon: directionColumnIcon },
            ]}
          />
          <div>
            <div className="text-xs font-semibold mb-1">
              {flexDirection === 'row' ? 'Columns per row' : 'Rows per column'}
            </div>
            <OptionGroup
              label=""
              value={String(flexDirection === 'row' ? flexColumns : flexRows)}
              onChange={(v) =>
                flexDirection === 'row' ? setFlexColumns(Number(v)) : setFlexRows(Number(v))
              }
              options={[...COLUMN_COUNTS].map((n) => ({
                value: String(n),
                label: String(n),
                icon: countIcon(n),
              }))}
            />
          </div>
          <OptionGroup
            label="Justify Content"
            value={flexJustify}
            onChange={(v) => setFlexJustify(v as Distribution)}
            options={JUSTIFY_OPTIONS.map((o) => ({
              ...o,
              icon: justifyIcons[o.value],
            }))}
          />
          <OptionGroup
            label="Align Items"
            value={flexAlign}
            onChange={(v) => setFlexAlign(v as CrossAlign)}
            options={ALIGN_OPTIONS.map((o) => ({ ...o, icon: alignIcons[o.value] }))}
          />
        </>
      ) : (
        <>
          <NumberOption
            label="Columns"
            value={gridColumns}
            onChange={(v) => setGridColumns(Number(v))}
            options={[...COLUMN_COUNTS]}
          />
          <NumberOption
            label="Rows"
            value={gridRows}
            onChange={(v) => setGridRows(v === 'auto' ? 'auto' : (Number(v) as GridRows))}
            options={ROW_COUNTS}
          />
          <OptionGroup
            label="Justify Items"
            value={gridJustifyItems}
            onChange={(v) => setGridJustifyItems(v as CrossAlign)}
            options={ALIGN_OPTIONS.map((o) => ({ ...o, icon: alignIcons[o.value] }))}
          />
          <OptionGroup
            label="Align Items"
            value={gridAlignItems}
            onChange={(v) => setGridAlignItems(v as CrossAlign)}
            options={ALIGN_OPTIONS.map((o) => ({ ...o, icon: alignIcons[o.value] }))}
          />
        </>
      )}

      <OptionGroup
        label="Gap"
        value={type === 'flex' ? flexGap : gridGap}
        onChange={(v) => (type === 'flex' ? setFlexGap(v as Gap) : setGridGap(v as Gap))}
        options={GAP_OPTIONS.map((o) => ({ ...o, icon: gapIcons[o.value] }))}
      />

      <div className="pt-2 flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="text-xs text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded border border-[#c3c4c7]"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleCreate}
          className="text-xs font-medium text-white bg-[#007cba] hover:bg-[#006ba1] px-3 py-1.5 rounded"
        >
          Create Container
        </button>
      </div>
    </div>
  );
};
