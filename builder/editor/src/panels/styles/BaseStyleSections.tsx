import type { BaseElementAttributes } from '@niyi-builder/core';

interface StyleSectionProps {
  attributes: BaseElementAttributes;
  onUpdate: (attrs: Partial<BaseElementAttributes>) => void;
}

interface FieldProps {
  label: string;
  value?: string;
  onChange: (value: string) => void;
  type?: 'text' | 'select' | 'color';
  options?: { value: string; label: string }[];
  placeholder?: string;
}

const FONT_FAMILIES = [
  { value: '', label: 'Default' },
  { value: 'Arial, sans-serif', label: 'Arial' },
  { value: "'Helvetica Neue', sans-serif", label: 'Helvetica' },
  { value: 'Georgia, serif', label: 'Georgia' },
  { value: "'Times New Roman', serif", label: 'Times New Roman' },
  { value: "'Courier New', monospace", label: 'Courier New' },
  { value: 'Verdana, sans-serif', label: 'Verdana' },
  { value: 'Tahoma, sans-serif', label: 'Tahoma' },
  { value: 'system-ui, sans-serif', label: 'System UI' },
  { value: "'Inter', sans-serif", label: 'Inter' },
  { value: "'Poppins', sans-serif", label: 'Poppins' },
];

const FONT_SIZES = [
  { value: '', label: 'Default' },
  { value: '12px', label: '12px' },
  { value: '14px', label: '14px' },
  { value: '16px', label: '16px' },
  { value: '18px', label: '18px' },
  { value: '20px', label: '20px' },
  { value: '24px', label: '24px' },
  { value: '30px', label: '30px' },
  { value: '36px', label: '36px' },
  { value: '48px', label: '48px' },
  { value: '60px', label: '60px' },
  { value: '72px', label: '72px' },
];

const FONT_WEIGHTS = [
  { value: '', label: 'Default' },
  { value: '100', label: 'Thin (100)' },
  { value: '200', label: 'Extra Light (200)' },
  { value: '300', label: 'Light (300)' },
  { value: '400', label: 'Normal (400)' },
  { value: '500', label: 'Medium (500)' },
  { value: '600', label: 'Semi Bold (600)' },
  { value: '700', label: 'Bold (700)' },
  { value: '800', label: 'Extra Bold (800)' },
  { value: '900', label: 'Black (900)' },
];

const TEXT_ALIGN_OPTIONS = [
  { value: '', label: 'Default' },
  { value: 'left', label: 'Left' },
  { value: 'center', label: 'Center' },
  { value: 'right', label: 'Right' },
  { value: 'justify', label: 'Justify' },
];

const TEXT_DECORATION_OPTIONS = [
  { value: '', label: 'Default' },
  { value: 'none', label: 'None' },
  { value: 'underline', label: 'Underline' },
  { value: 'overline', label: 'Overline' },
  { value: 'line-through', label: 'Line Through' },
];

const TEXT_TRANSFORM_OPTIONS = [
  { value: '', label: 'Default' },
  { value: 'none', label: 'None' },
  { value: 'capitalize', label: 'Capitalize' },
  { value: 'uppercase', label: 'Uppercase' },
  { value: 'lowercase', label: 'Lowercase' },
];

function Field({ label, value, onChange, type = 'select', options, placeholder }: FieldProps) {
  if (type === 'select' && options) {
    return (
      <div className="flex items-center gap-2">
        <label className="text-[11px] text-gray-500 w-16 shrink-0">{label}</label>
        <select
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 border border-[#c3c4c7] rounded px-2 py-1 text-[12px] bg-white"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (type === 'color') {
    return (
      <div className="flex items-center gap-2">
        <label className="text-[11px] text-gray-500 w-16 shrink-0">{label}</label>
        <div className="flex items-center gap-1 flex-1">
          <input
            type="color"
            value={value || '#000000'}
            onChange={(e) => onChange(e.target.value)}
            className="w-6 h-6 border border-[#c3c4c7] rounded cursor-pointer p-0"
          />
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || 'auto'}
            className="flex-1 border border-[#c3c4c7] rounded px-2 py-1 text-[12px]"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <label className="text-[11px] text-gray-500 w-16 shrink-0">{label}</label>
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || 'auto'}
        className="flex-1 border border-[#c3c4c7] rounded px-2 py-1 text-[12px]"
      />
    </div>
  );
}

export function CollapsibleSection({
  title,
  defaultOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  return (
    <details open={defaultOpen} className="border-b border-[#e0e0e0]">
      <summary className="px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-gray-500 cursor-pointer select-none hover:bg-gray-50">
        {title}
      </summary>
      <div className="px-4 pb-3 space-y-2">{children}</div>
    </details>
  );
}

export function TypographySection({ attributes, onUpdate }: StyleSectionProps) {
  return (
    <CollapsibleSection title="Typography" defaultOpen>
      <Field
        label="Font"
        value={attributes.fontFamily}
        onChange={(v) => onUpdate({ fontFamily: v || undefined })}
        options={FONT_FAMILIES}
      />
      <Field
        label="Size"
        value={attributes.fontSize}
        onChange={(v) => onUpdate({ fontSize: v || undefined })}
        options={FONT_SIZES}
      />
      <Field
        label="Weight"
        value={attributes.fontWeight}
        onChange={(v) => onUpdate({ fontWeight: v || undefined })}
        options={FONT_WEIGHTS}
      />
      <Field
        label="Align"
        value={attributes.textAlign}
        onChange={(v) => onUpdate({ textAlign: v as BaseElementAttributes['textAlign'] || undefined })}
        options={TEXT_ALIGN_OPTIONS}
      />
      <Field
        label="Line H."
        value={attributes.lineHeight}
        onChange={(v) => onUpdate({ lineHeight: v || undefined })}
        placeholder="e.g. 1.5"
      />
      <Field
        label="Spacing"
        value={attributes.letterSpacing}
        onChange={(v) => onUpdate({ letterSpacing: v || undefined })}
        placeholder="e.g. 0.5px"
      />
      <Field
        label="Decor."
        value={attributes.textDecoration}
        onChange={(v) => onUpdate({ textDecoration: v as BaseElementAttributes['textDecoration'] || undefined })}
        options={TEXT_DECORATION_OPTIONS}
      />
      <Field
        label="Transform"
        value={attributes.textTransform}
        onChange={(v) => onUpdate({ textTransform: v as BaseElementAttributes['textTransform'] || undefined })}
        options={TEXT_TRANSFORM_OPTIONS}
      />
    </CollapsibleSection>
  );
}

export function ColorsSection({ attributes, onUpdate }: StyleSectionProps) {
  return (
    <CollapsibleSection title="Colors">
      <Field
        label="Text"
        value={attributes.textColor}
        onChange={(v) => onUpdate({ textColor: v || undefined })}
        type="color"
        placeholder="#000000"
      />
      <Field
        label="Background"
        value={attributes.bgColor}
        onChange={(v) => onUpdate({ bgColor: v || undefined })}
        type="color"
        placeholder="transparent"
      />
    </CollapsibleSection>
  );
}

export function SpacingSection({ attributes, onUpdate }: StyleSectionProps) {
  return (
    <CollapsibleSection title="Spacing">
      <div className="space-y-1">
        <div className="text-[10px] text-gray-400 uppercase tracking-wide">Margin</div>
        <div className="grid grid-cols-2 gap-1">
          <Field label="Top" value={attributes.marginTop} onChange={(v) => onUpdate({ marginTop: v || undefined })} placeholder="0" />
          <Field label="Right" value={attributes.marginRight} onChange={(v) => onUpdate({ marginRight: v || undefined })} placeholder="0" />
          <Field label="Bottom" value={attributes.marginBottom} onChange={(v) => onUpdate({ marginBottom: v || undefined })} placeholder="0" />
          <Field label="Left" value={attributes.marginLeft} onChange={(v) => onUpdate({ marginLeft: v || undefined })} placeholder="0" />
        </div>
      </div>
      <div className="space-y-1">
        <div className="text-[10px] text-gray-400 uppercase tracking-wide">Padding</div>
        <div className="grid grid-cols-2 gap-1">
          <Field label="Top" value={attributes.paddingTop} onChange={(v) => onUpdate({ paddingTop: v || undefined })} placeholder="0" />
          <Field label="Right" value={attributes.paddingRight} onChange={(v) => onUpdate({ paddingRight: v || undefined })} placeholder="0" />
          <Field label="Bottom" value={attributes.paddingBottom} onChange={(v) => onUpdate({ paddingBottom: v || undefined })} placeholder="0" />
          <Field label="Left" value={attributes.paddingLeft} onChange={(v) => onUpdate({ paddingLeft: v || undefined })} placeholder="0" />
        </div>
      </div>
    </CollapsibleSection>
  );
}

export function DimensionsSection({ attributes, onUpdate }: StyleSectionProps) {
  return (
    <CollapsibleSection title="Dimensions">
      <Field label="Width" value={attributes.width} onChange={(v) => onUpdate({ width: v || undefined })} placeholder="auto" />
      <Field label="Height" value={attributes.height} onChange={(v) => onUpdate({ height: v || undefined })} placeholder="auto" />
      <Field label="Min W" value={attributes.minWidth} onChange={(v) => onUpdate({ minWidth: v || undefined })} placeholder="auto" />
      <Field label="Min H" value={attributes.minHeight} onChange={(v) => onUpdate({ minHeight: v || undefined })} placeholder="auto" />
      <Field label="Max W" value={attributes.maxWidth} onChange={(v) => onUpdate({ maxWidth: v || undefined })} placeholder="auto" />
      <Field label="Max H" value={attributes.maxHeight} onChange={(v) => onUpdate({ maxHeight: v || undefined })} placeholder="auto" />
    </CollapsibleSection>
  );
}

export function BorderSection({ attributes, onUpdate }: StyleSectionProps) {
  return (
    <CollapsibleSection title="Border">
      <Field
        label="Style"
        value={attributes.borderStyle}
        onChange={(v) => onUpdate({ borderStyle: v as BaseElementAttributes['borderStyle'] || undefined })}
        options={[
          { value: '', label: 'None' },
          { value: 'solid', label: 'Solid' },
          { value: 'dashed', label: 'Dashed' },
          { value: 'dotted', label: 'Dotted' },
          { value: 'double', label: 'Double' },
        ]}
      />
      <Field label="Width" value={attributes.borderWidth} onChange={(v) => onUpdate({ borderWidth: v || undefined })} placeholder="1px" />
      <Field
        label="Color"
        value={attributes.borderColor}
        onChange={(v) => onUpdate({ borderColor: v || undefined })}
        type="color"
        placeholder="#000000"
      />
      <Field label="Radius" value={attributes.borderRadius} onChange={(v) => onUpdate({ borderRadius: v || undefined })} placeholder="0" />
    </CollapsibleSection>
  );
}

export function EffectsSection({ attributes, onUpdate }: StyleSectionProps) {
  return (
    <CollapsibleSection title="Effects">
      <Field label="Opacity" value={attributes.opacity} onChange={(v) => onUpdate({ opacity: v || undefined })} placeholder="1" />
      <Field label="Shadow" value={attributes.boxShadow} onChange={(v) => onUpdate({ boxShadow: v || undefined })} placeholder="0 2px 4px rgba(0,0,0,0.1)" />
    </CollapsibleSection>
  );
}

export function AdvancedSection({ attributes, onUpdate }: StyleSectionProps) {
  return (
    <CollapsibleSection title="Advanced">
      <Field label="CSS Class" value={attributes.cssClass} onChange={(v) => onUpdate({ cssClass: v || undefined })} placeholder="my-class" />
      <Field label="HTML ID" value={attributes.htmlId} onChange={(v) => onUpdate({ htmlId: v || undefined })} placeholder="my-id" />
      <div>
        <label className="text-[11px] text-gray-500 block mb-1">Custom CSS</label>
        <textarea
          value={attributes.customCss || ''}
          onChange={(e) => onUpdate({ customCss: e.target.value || undefined })}
          placeholder=".my-class { color: red; }"
          rows={3}
          className="w-full border border-[#c3c4c7] rounded px-2 py-1 text-[12px] font-mono resize-y"
        />
      </div>
    </CollapsibleSection>
  );
}
