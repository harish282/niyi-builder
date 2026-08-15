import type { ReactElement, ReactNode } from 'react';

export interface VisualOption {
  value: string;
  label: string;
  icon: ReactElement;
}

function PreviewFrame({ children }: { children: ReactNode }): ReactElement {
  return (
    <span className="w-8 h-6 rounded-[3px] bg-[#f6f7f7] border border-[#dcdcde] flex items-center justify-center overflow-hidden">
      {children}
    </span>
  );
}

function Dot({ className = '' }: { className?: string }): ReactElement {
  return <span className={`block w-[5px] h-[5px] rounded-[1px] bg-[#50575e] ${className}`} />;
}

export const directionRowIcon = (
  <PreviewFrame>
    <span className="flex items-center gap-[3px]">
      <Dot />
      <Dot />
      <Dot />
    </span>
  </PreviewFrame>
);

export const directionColumnIcon = (
  <PreviewFrame>
    <span className="flex flex-col items-center gap-[3px]">
      <Dot />
      <Dot />
      <Dot />
    </span>
  </PreviewFrame>
);

const JUSTIFY_PREVIEWS: Record<string, string> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  between: 'space-between',
  around: 'space-around',
  evenly: 'space-evenly',
};

export const justifyIcons: Record<string, ReactElement> = Object.fromEntries(
  Object.entries(JUSTIFY_PREVIEWS).map(([key, css]) => [
    key,
    <PreviewFrame key={key}>
      <span className="w-7 h-4 flex" style={{ justifyContent: css }}>
        <Dot />
        <Dot />
        <Dot />
      </span>
    </PreviewFrame>,
  ]),
);

export const alignIcons: Record<string, ReactElement> = {
  start: (
    <PreviewFrame>
      <span className="w-7 h-4 flex items-start gap-[3px]">
        <Dot />
        <Dot />
        <Dot />
      </span>
    </PreviewFrame>
  ),
  center: (
    <PreviewFrame>
      <span className="w-7 h-4 flex items-center gap-[3px]">
        <Dot />
        <Dot />
        <Dot />
      </span>
    </PreviewFrame>
  ),
  end: (
    <PreviewFrame>
      <span className="w-7 h-4 flex items-end gap-[3px]">
        <Dot />
        <Dot />
        <Dot />
      </span>
    </PreviewFrame>
  ),
  stretch: (
    <PreviewFrame>
      <span className="w-7 h-4 flex items-stretch gap-[3px]">
        <Dot className="h-auto" />
        <Dot className="h-auto" />
        <Dot className="h-auto" />
      </span>
    </PreviewFrame>
  ),
};

const GAP_SPACING: Record<string, string> = {
  none: '0px',
  sm: '2px',
  md: '6px',
  lg: '10px',
};

export const gapIcons: Record<string, ReactElement> = Object.fromEntries(
  Object.entries(GAP_SPACING).map(([key, spacing]) => [
    key,
    <PreviewFrame key={key}>
      <span className="w-7 h-4 flex items-center">
        <Dot />
        <Dot className="ml-auto" />
        <span className="block h-[3px] bg-[#c3c4c7]" style={{ width: spacing }} />
        <Dot />
      </span>
    </PreviewFrame>,
  ]),
);

export function countIcon(count: number | 'auto'): ReactElement {
  const n = count === 'auto' ? 3 : count;
  return (
    <PreviewFrame>
      <span
        className="w-7 h-4 grid gap-[2px]"
        style={{ gridTemplateColumns: `repeat(${Math.min(n, 3)}, 1fr)` }}
      >
        {Array.from({ length: Math.min(n, 6) }).map((_, i) => (
          <span key={i} className="rounded-[1px] bg-[#50575e]" />
        ))}
      </span>
    </PreviewFrame>
  );
}

export function OptionButton({
  option,
  selected,
  onClick,
}: {
  option: VisualOption;
  selected: boolean;
  onClick: () => void;
}): ReactElement {
  return (
    <button
      type="button"
      onClick={onClick}
      title={option.label}
      className={`flex flex-col items-center gap-1 rounded-md border p-1.5 transition-colors ${
        selected ? 'border-[#007cba] bg-blue-50' : 'border-[#c3c4c7] hover:bg-gray-50'
      }`}
    >
      {option.icon}
      <span
        className={`text-[10px] leading-tight ${selected ? 'text-[#007cba]' : 'text-gray-500'}`}
      >
        {option.label}
      </span>
    </button>
  );
}

export function OptionGroup({
  label,
  options,
  value,
  onChange,
  cols = 3,
}: {
  label: string;
  options: VisualOption[];
  value: string;
  onChange: (value: string) => void;
  cols?: number;
}): ReactElement {
  return (
    <div>
      <div className="block text-xs font-semibold mb-1">{label}</div>
      <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {options.map((option) => (
          <OptionButton
            key={option.value}
            option={option}
            selected={option.value === value}
            onClick={() => onChange(option.value)}
          />
        ))}
      </div>
    </div>
  );
}

export function NumberOption({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: number | 'auto';
  onChange: (value: number | 'auto') => void;
  options: (number | 'auto')[];
}): ReactElement {
  return (
    <OptionGroup
      label={label}
      value={String(value)}
      options={options.map((n) => ({
        value: String(n),
        label: n === 'auto' ? 'Auto' : String(n),
        icon: countIcon(n),
      }))}
      onChange={(v) => onChange(v === 'auto' ? 'auto' : Number(v))}
    />
  );
}
