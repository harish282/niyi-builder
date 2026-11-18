import type { ChangeEvent, ReactNode } from 'react';
import type { BaseElementAttributes, Breakpoint, ResponsiveValue } from '@niyi-builder/core';
import {
  hasBreakpointValue,
  readResponsiveValue,
  resolveResponsiveValue,
  setResponsiveValue,
} from '@niyi-builder/core';

export interface StyleSectionProps {
  attributes: BaseElementAttributes;
  device: Breakpoint;
  onUpdate: (attrs: Record<string, unknown>) => void;
}

interface FieldProps {
  label: string;
  value?: string;
  onChange: (value: string) => void;
  type?: 'text' | 'select' | 'color' | 'textarea';
  options?: { value: string; label: string }[];
  placeholder?: string;
  rows?: number;
  overridden?: boolean;
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

const FONT_STYLES = [
  { value: '', label: 'Default' },
  { value: 'normal', label: 'Normal' },
  { value: 'italic', label: 'Italic' },
  { value: 'oblique', label: 'Oblique' },
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

const BACKGROUND_SIZE_OPTIONS = [
  { value: '', label: 'Default' },
  { value: 'auto', label: 'Auto' },
  { value: 'cover', label: 'Cover' },
  { value: 'contain', label: 'Contain' },
  { value: '100% 100%', label: 'Stretch' },
];

const BACKGROUND_POSITION_OPTIONS = [
  { value: '', label: 'Default' },
  { value: 'center center', label: 'Center' },
  { value: 'top center', label: 'Top' },
  { value: 'bottom center', label: 'Bottom' },
  { value: 'center left', label: 'Left' },
  { value: 'center right', label: 'Right' },
];

const BACKGROUND_REPEAT_OPTIONS = [
  { value: '', label: 'Default' },
  { value: 'no-repeat', label: 'No Repeat' },
  { value: 'repeat', label: 'Repeat' },
  { value: 'repeat-x', label: 'Repeat X' },
  { value: 'repeat-y', label: 'Repeat Y' },
];

const BACKGROUND_ATTACHMENT_OPTIONS = [
  { value: '', label: 'Default' },
  { value: 'scroll', label: 'Scroll' },
  { value: 'fixed', label: 'Fixed' },
];

const BORDER_STYLE_OPTIONS = [
  { value: '', label: 'None' },
  { value: 'solid', label: 'Solid' },
  { value: 'dashed', label: 'Dashed' },
  { value: 'dotted', label: 'Dotted' },
  { value: 'double', label: 'Double' },
  { value: 'groove', label: 'Groove' },
  { value: 'ridge', label: 'Ridge' },
];

const OVERFLOW_OPTIONS = [
  { value: '', label: 'Default' },
  { value: 'visible', label: 'Visible' },
  { value: 'hidden', label: 'Hidden' },
  { value: 'scroll', label: 'Scroll' },
  { value: 'auto', label: 'Auto' },
];

const POSITION_OPTIONS = [
  { value: '', label: 'Default' },
  { value: 'static', label: 'Static' },
  { value: 'relative', label: 'Relative' },
  { value: 'absolute', label: 'Absolute' },
  { value: 'fixed', label: 'Fixed' },
  { value: 'sticky', label: 'Sticky' },
];

const TIMING_OPTIONS = [
  { value: '', label: 'Default' },
  { value: 'linear', label: 'Linear' },
  { value: 'ease', label: 'Ease' },
  { value: 'ease-in', label: 'Ease In' },
  { value: 'ease-out', label: 'Ease Out' },
  { value: 'ease-in-out', label: 'Ease In Out' },
];

const ANIMATION_OPTIONS = [
  { value: '', label: 'None' },
  { value: 'niyi-fade-in', label: 'Fade In' },
  { value: 'niyi-fade-up', label: 'Fade Up' },
  { value: 'niyi-fade-down', label: 'Fade Down' },
  { value: 'niyi-fade-left', label: 'Fade Left' },
  { value: 'niyi-fade-right', label: 'Fade Right' },
  { value: 'niyi-zoom-in', label: 'Zoom In' },
  { value: 'niyi-zoom-out', label: 'Zoom Out' },
];

function Field({
  label,
  value,
  onChange,
  type = 'text',
  options,
  placeholder,
  rows = 3,
  overridden,
}: FieldProps) {
  const labelNode = (
    <label className="text-[11px] text-gray-500 w-16 shrink-0 flex items-center gap-1">
      <span>{label}</span>
      {overridden ? (
        <span
          className="inline-block w-1.5 h-1.5 rounded-full bg-[#2271b1]"
          title="Overridden for this breakpoint"
        />
      ) : null}
    </label>
  );

  if (type === 'select' && options) {
    return (
      <div className="flex items-center gap-2">
        {labelNode}
        <select
          value={value || ''}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)}
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
    const colorValue = value && /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value) ? value : '#000000';

    return (
      <div className="flex items-center gap-2">
        {labelNode}
        <div className="flex items-center gap-1 flex-1">
          <input
            type="color"
            value={colorValue}
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

  if (type === 'textarea') {
    return (
      <div className="flex items-start gap-2">
        {labelNode}
        <textarea
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className="flex-1 border border-[#c3c4c7] rounded px-2 py-1 text-[12px] font-mono resize-y"
        />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {labelNode}
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

interface ResponsiveFieldProps extends Omit<FieldProps, 'value' | 'onChange' | 'overridden'> {
  attribute: keyof BaseElementAttributes;
  attributes: BaseElementAttributes;
  device: Breakpoint;
  onUpdate: (attrs: Record<string, unknown>) => void;
}

/**
 * Reads the value for the active breakpoint (no cascade for the input value),
 * shows the inherited value as a placeholder, and writes a responsive value.
 */
function ResponsiveField({
  attribute,
  attributes,
  device,
  onUpdate,
  ...fieldProps
}: ResponsiveFieldProps) {
  const raw = attributes[attribute] as ResponsiveValue<string> | undefined;
  const direct = readResponsiveValue<string>(raw, device) ?? '';
  const resolved = resolveResponsiveValue<string>(raw, device);
  const overridden = device !== 'desktop' && hasBreakpointValue(raw, device);
  const placeholder =
    fieldProps.placeholder ?? (resolved && resolved !== direct ? `Inherited: ${resolved}` : 'auto');

  const handleChange = (value: string) => {
    const next = setResponsiveValue<string>(raw, device, value === '' ? undefined : value);
    onUpdate({ [attribute]: next });
  };

  return (
    <Field
      {...fieldProps}
      value={direct}
      onChange={handleChange}
      placeholder={placeholder}
      overridden={overridden}
    />
  );
}

export function CollapsibleSection({
  title,
  defaultOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
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

export function TypographySection({ attributes, device, onUpdate }: StyleSectionProps) {
  return (
    <CollapsibleSection title="Typography" defaultOpen>
      <ResponsiveField
        label="Font"
        attribute="fontFamily"
        attributes={attributes}
        device={device}
        onUpdate={onUpdate}
        options={FONT_FAMILIES}
        type="select"
      />
      <ResponsiveField
        label="Size"
        attribute="fontSize"
        attributes={attributes}
        device={device}
        onUpdate={onUpdate}
        options={FONT_SIZES}
        type="select"
      />
      <ResponsiveField
        label="Weight"
        attribute="fontWeight"
        attributes={attributes}
        device={device}
        onUpdate={onUpdate}
        options={FONT_WEIGHTS}
        type="select"
      />
      <ResponsiveField
        label="Style"
        attribute="fontStyle"
        attributes={attributes}
        device={device}
        onUpdate={onUpdate}
        options={FONT_STYLES}
        type="select"
      />
      <ResponsiveField
        label="Align"
        attribute="textAlign"
        attributes={attributes}
        device={device}
        onUpdate={onUpdate}
        options={TEXT_ALIGN_OPTIONS}
        type="select"
      />
      <ResponsiveField
        label="Line H."
        attribute="lineHeight"
        attributes={attributes}
        device={device}
        onUpdate={onUpdate}
        placeholder="e.g. 1.5"
      />
      <ResponsiveField
        label="Spacing"
        attribute="letterSpacing"
        attributes={attributes}
        device={device}
        onUpdate={onUpdate}
        placeholder="e.g. 0.5px"
      />
      <ResponsiveField
        label="Word Sp."
        attribute="wordSpacing"
        attributes={attributes}
        device={device}
        onUpdate={onUpdate}
        placeholder="e.g. 2px"
      />
      <ResponsiveField
        label="Indent"
        attribute="textIndent"
        attributes={attributes}
        device={device}
        onUpdate={onUpdate}
        placeholder="e.g. 2em"
      />
      <ResponsiveField
        label="Decor."
        attribute="textDecoration"
        attributes={attributes}
        device={device}
        onUpdate={onUpdate}
        options={TEXT_DECORATION_OPTIONS}
        type="select"
      />
      <ResponsiveField
        label="Transform"
        attribute="textTransform"
        attributes={attributes}
        device={device}
        onUpdate={onUpdate}
        options={TEXT_TRANSFORM_OPTIONS}
        type="select"
      />
      <ResponsiveField
        label="Shadow"
        attribute="textShadow"
        attributes={attributes}
        device={device}
        onUpdate={onUpdate}
        placeholder="0 1px 2px rgba(0,0,0,.2)"
      />
    </CollapsibleSection>
  );
}

export function ColorsSection({ attributes, device, onUpdate }: StyleSectionProps) {
  return (
    <CollapsibleSection title="Content Colors">
      <ResponsiveField
        label="Text"
        attribute="textColor"
        attributes={attributes}
        device={device}
        onUpdate={onUpdate}
        type="color"
        placeholder="#000000"
      />
      <ResponsiveField
        label="Link"
        attribute="linkColor"
        attributes={attributes}
        device={device}
        onUpdate={onUpdate}
        type="color"
        placeholder="#2271b1"
      />
      <ResponsiveField
        label="Link Hover"
        attribute="linkHoverColor"
        attributes={attributes}
        device={device}
        onUpdate={onUpdate}
        type="color"
        placeholder="#135e96"
      />
    </CollapsibleSection>
  );
}

export function BackgroundSection({ attributes, device, onUpdate }: StyleSectionProps) {
  return (
    <CollapsibleSection title="Background">
      <ResponsiveField
        label="Color"
        attribute="bgColor"
        attributes={attributes}
        device={device}
        onUpdate={onUpdate}
        type="color"
        placeholder="transparent"
      />
      <ResponsiveField
        label="Gradient"
        attribute="backgroundGradient"
        attributes={attributes}
        device={device}
        onUpdate={onUpdate}
        placeholder="linear-gradient(…)"
      />
      <ResponsiveField
        label="Image URL"
        attribute="backgroundImage"
        attributes={attributes}
        device={device}
        onUpdate={onUpdate}
        placeholder="https://…"
      />
      <ResponsiveField
        label="Size"
        attribute="backgroundSize"
        attributes={attributes}
        device={device}
        onUpdate={onUpdate}
        options={BACKGROUND_SIZE_OPTIONS}
        type="select"
      />
      <ResponsiveField
        label="Position"
        attribute="backgroundPosition"
        attributes={attributes}
        device={device}
        onUpdate={onUpdate}
        options={BACKGROUND_POSITION_OPTIONS}
        type="select"
      />
      <ResponsiveField
        label="Repeat"
        attribute="backgroundRepeat"
        attributes={attributes}
        device={device}
        onUpdate={onUpdate}
        options={BACKGROUND_REPEAT_OPTIONS}
        type="select"
      />
      <ResponsiveField
        label="Attachment"
        attribute="backgroundAttachment"
        attributes={attributes}
        device={device}
        onUpdate={onUpdate}
        options={BACKGROUND_ATTACHMENT_OPTIONS}
        type="select"
      />
      <ResponsiveField
        label="Overlay"
        attribute="backgroundOverlayColor"
        attributes={attributes}
        device={device}
        onUpdate={onUpdate}
        type="color"
        placeholder="#000000"
      />
      <ResponsiveField
        label="Overlay Op."
        attribute="backgroundOverlayOpacity"
        attributes={attributes}
        device={device}
        onUpdate={onUpdate}
        placeholder="0.5"
      />
    </CollapsibleSection>
  );
}

export function SpacingSection({ attributes, device, onUpdate }: StyleSectionProps) {
  return (
    <CollapsibleSection title="Spacing">
      <div className="space-y-1">
        <div className="text-[10px] text-gray-400 uppercase tracking-wide">Margin</div>
        <div className="grid grid-cols-2 gap-1">
          <ResponsiveField
            label="Top"
            attribute="marginTop"
            attributes={attributes}
            device={device}
            onUpdate={onUpdate}
            placeholder="0"
          />
          <ResponsiveField
            label="Right"
            attribute="marginRight"
            attributes={attributes}
            device={device}
            onUpdate={onUpdate}
            placeholder="0"
          />
          <ResponsiveField
            label="Bottom"
            attribute="marginBottom"
            attributes={attributes}
            device={device}
            onUpdate={onUpdate}
            placeholder="0"
          />
          <ResponsiveField
            label="Left"
            attribute="marginLeft"
            attributes={attributes}
            device={device}
            onUpdate={onUpdate}
            placeholder="0"
          />
        </div>
      </div>
      <div className="space-y-1">
        <div className="text-[10px] text-gray-400 uppercase tracking-wide">Padding</div>
        <div className="grid grid-cols-2 gap-1">
          <ResponsiveField
            label="Top"
            attribute="paddingTop"
            attributes={attributes}
            device={device}
            onUpdate={onUpdate}
            placeholder="0"
          />
          <ResponsiveField
            label="Right"
            attribute="paddingRight"
            attributes={attributes}
            device={device}
            onUpdate={onUpdate}
            placeholder="0"
          />
          <ResponsiveField
            label="Bottom"
            attribute="paddingBottom"
            attributes={attributes}
            device={device}
            onUpdate={onUpdate}
            placeholder="0"
          />
          <ResponsiveField
            label="Left"
            attribute="paddingLeft"
            attributes={attributes}
            device={device}
            onUpdate={onUpdate}
            placeholder="0"
          />
        </div>
      </div>
    </CollapsibleSection>
  );
}

export function DimensionsSection({ attributes, device, onUpdate }: StyleSectionProps) {
  return (
    <CollapsibleSection title="Dimensions">
      <ResponsiveField
        label="Width"
        attribute="width"
        attributes={attributes}
        device={device}
        onUpdate={onUpdate}
        placeholder="auto"
      />
      <ResponsiveField
        label="Height"
        attribute="height"
        attributes={attributes}
        device={device}
        onUpdate={onUpdate}
        placeholder="auto"
      />
      <ResponsiveField
        label="Min W"
        attribute="minWidth"
        attributes={attributes}
        device={device}
        onUpdate={onUpdate}
        placeholder="auto"
      />
      <ResponsiveField
        label="Min H"
        attribute="minHeight"
        attributes={attributes}
        device={device}
        onUpdate={onUpdate}
        placeholder="auto"
      />
      <ResponsiveField
        label="Max W"
        attribute="maxWidth"
        attributes={attributes}
        device={device}
        onUpdate={onUpdate}
        placeholder="auto"
      />
      <ResponsiveField
        label="Max H"
        attribute="maxHeight"
        attributes={attributes}
        device={device}
        onUpdate={onUpdate}
        placeholder="auto"
      />
      <ResponsiveField
        label="Overflow"
        attribute="overflow"
        attributes={attributes}
        device={device}
        onUpdate={onUpdate}
        options={OVERFLOW_OPTIONS}
        type="select"
      />
    </CollapsibleSection>
  );
}

export function BorderSection({ attributes, device, onUpdate }: StyleSectionProps) {
  return (
    <CollapsibleSection title="Border">
      <ResponsiveField
        label="Style"
        attribute="borderStyle"
        attributes={attributes}
        device={device}
        onUpdate={onUpdate}
        options={BORDER_STYLE_OPTIONS}
        type="select"
      />
      <ResponsiveField
        label="Width"
        attribute="borderWidth"
        attributes={attributes}
        device={device}
        onUpdate={onUpdate}
        placeholder="1px"
      />
      <ResponsiveField
        label="Color"
        attribute="borderColor"
        attributes={attributes}
        device={device}
        onUpdate={onUpdate}
        type="color"
        placeholder="#000000"
      />
      <ResponsiveField
        label="Radius"
        attribute="borderRadius"
        attributes={attributes}
        device={device}
        onUpdate={onUpdate}
        placeholder="0"
      />
      <div className="text-[10px] text-gray-400 uppercase tracking-wide pt-1">Corner Radius</div>
      <div className="grid grid-cols-2 gap-1">
        <ResponsiveField
          label="TL"
          attribute="borderTopLeftRadius"
          attributes={attributes}
          device={device}
          onUpdate={onUpdate}
          placeholder="0"
        />
        <ResponsiveField
          label="TR"
          attribute="borderTopRightRadius"
          attributes={attributes}
          device={device}
          onUpdate={onUpdate}
          placeholder="0"
        />
        <ResponsiveField
          label="BR"
          attribute="borderBottomRightRadius"
          attributes={attributes}
          device={device}
          onUpdate={onUpdate}
          placeholder="0"
        />
        <ResponsiveField
          label="BL"
          attribute="borderBottomLeftRadius"
          attributes={attributes}
          device={device}
          onUpdate={onUpdate}
          placeholder="0"
        />
      </div>
    </CollapsibleSection>
  );
}

export function EffectsSection({ attributes, device, onUpdate }: StyleSectionProps) {
  return (
    <CollapsibleSection title="Effects">
      <ResponsiveField
        label="Opacity"
        attribute="opacity"
        attributes={attributes}
        device={device}
        onUpdate={onUpdate}
        placeholder="1"
      />
      <ResponsiveField
        label="Shadow"
        attribute="boxShadow"
        attributes={attributes}
        device={device}
        onUpdate={onUpdate}
        placeholder="0 2px 4px rgba(0,0,0,0.1)"
      />
      <ResponsiveField
        label="Blend"
        attribute="mixBlendMode"
        attributes={attributes}
        device={device}
        onUpdate={onUpdate}
        placeholder="normal"
      />
      <div className="text-[10px] text-gray-400 uppercase tracking-wide pt-1">Filters</div>
      <div className="grid grid-cols-2 gap-1">
        <ResponsiveField
          label="Blur"
          attribute="filterBlur"
          attributes={attributes}
          device={device}
          onUpdate={onUpdate}
          placeholder="0"
        />
        <ResponsiveField
          label="Bright"
          attribute="filterBrightness"
          attributes={attributes}
          device={device}
          onUpdate={onUpdate}
          placeholder="100%"
        />
        <ResponsiveField
          label="Contrast"
          attribute="filterContrast"
          attributes={attributes}
          device={device}
          onUpdate={onUpdate}
          placeholder="100%"
        />
        <ResponsiveField
          label="Saturate"
          attribute="filterSaturate"
          attributes={attributes}
          device={device}
          onUpdate={onUpdate}
          placeholder="100%"
        />
        <ResponsiveField
          label="Hue"
          attribute="filterHueRotate"
          attributes={attributes}
          device={device}
          onUpdate={onUpdate}
          placeholder="0deg"
        />
        <ResponsiveField
          label="Invert"
          attribute="filterInvert"
          attributes={attributes}
          device={device}
          onUpdate={onUpdate}
          placeholder="0%"
        />
        <ResponsiveField
          label="Sepia"
          attribute="filterSepia"
          attributes={attributes}
          device={device}
          onUpdate={onUpdate}
          placeholder="0%"
        />
      </div>
    </CollapsibleSection>
  );
}

export function TransformSection({ attributes, device, onUpdate }: StyleSectionProps) {
  return (
    <CollapsibleSection title="Transform">
      <div className="grid grid-cols-2 gap-1">
        <ResponsiveField
          label="Move X"
          attribute="transformTranslateX"
          attributes={attributes}
          device={device}
          onUpdate={onUpdate}
          placeholder="0px"
        />
        <ResponsiveField
          label="Move Y"
          attribute="transformTranslateY"
          attributes={attributes}
          device={device}
          onUpdate={onUpdate}
          placeholder="0px"
        />
        <ResponsiveField
          label="Scale"
          attribute="transformScale"
          attributes={attributes}
          device={device}
          onUpdate={onUpdate}
          placeholder="1"
        />
        <ResponsiveField
          label="Rotate"
          attribute="transformRotate"
          attributes={attributes}
          device={device}
          onUpdate={onUpdate}
          placeholder="0deg"
        />
        <ResponsiveField
          label="Skew X"
          attribute="transformSkewX"
          attributes={attributes}
          device={device}
          onUpdate={onUpdate}
          placeholder="0deg"
        />
        <ResponsiveField
          label="Skew Y"
          attribute="transformSkewY"
          attributes={attributes}
          device={device}
          onUpdate={onUpdate}
          placeholder="0deg"
        />
      </div>
      <ResponsiveField
        label="Origin"
        attribute="transformOrigin"
        attributes={attributes}
        device={device}
        onUpdate={onUpdate}
        placeholder="center center"
      />
    </CollapsibleSection>
  );
}

export function TransitionSection({ attributes, device, onUpdate }: StyleSectionProps) {
  return (
    <CollapsibleSection title="Transition">
      <ResponsiveField
        label="Property"
        attribute="transitionProperty"
        attributes={attributes}
        device={device}
        onUpdate={onUpdate}
        placeholder="all"
      />
      <ResponsiveField
        label="Duration"
        attribute="transitionDuration"
        attributes={attributes}
        device={device}
        onUpdate={onUpdate}
        placeholder="0.3s"
      />
      <ResponsiveField
        label="Delay"
        attribute="transitionDelay"
        attributes={attributes}
        device={device}
        onUpdate={onUpdate}
        placeholder="0s"
      />
      <ResponsiveField
        label="Timing"
        attribute="transitionTimingFunction"
        attributes={attributes}
        device={device}
        onUpdate={onUpdate}
        options={TIMING_OPTIONS}
        type="select"
      />
    </CollapsibleSection>
  );
}

export function PositionSection({ attributes, device, onUpdate }: StyleSectionProps) {
  return (
    <CollapsibleSection title="Position">
      <ResponsiveField
        label="Position"
        attribute="position"
        attributes={attributes}
        device={device}
        onUpdate={onUpdate}
        options={POSITION_OPTIONS}
        type="select"
      />
      <div className="grid grid-cols-2 gap-1">
        <ResponsiveField
          label="Top"
          attribute="positionTop"
          attributes={attributes}
          device={device}
          onUpdate={onUpdate}
          placeholder="auto"
        />
        <ResponsiveField
          label="Right"
          attribute="positionRight"
          attributes={attributes}
          device={device}
          onUpdate={onUpdate}
          placeholder="auto"
        />
        <ResponsiveField
          label="Bottom"
          attribute="positionBottom"
          attributes={attributes}
          device={device}
          onUpdate={onUpdate}
          placeholder="auto"
        />
        <ResponsiveField
          label="Left"
          attribute="positionLeft"
          attributes={attributes}
          device={device}
          onUpdate={onUpdate}
          placeholder="auto"
        />
      </div>
      <ResponsiveField
        label="Z-Index"
        attribute="zIndex"
        attributes={attributes}
        device={device}
        onUpdate={onUpdate}
        placeholder="auto"
      />
    </CollapsibleSection>
  );
}

export function AnimationSection({ attributes, device, onUpdate }: StyleSectionProps) {
  return (
    <CollapsibleSection title="Animation">
      <ResponsiveField
        label="Effect"
        attribute="animationName"
        attributes={attributes}
        device={device}
        onUpdate={onUpdate}
        options={ANIMATION_OPTIONS}
        type="select"
      />
      <div className="grid grid-cols-2 gap-1">
        <ResponsiveField
          label="Duration"
          attribute="animationDuration"
          attributes={attributes}
          device={device}
          onUpdate={onUpdate}
          placeholder="0.6s"
        />
        <ResponsiveField
          label="Delay"
          attribute="animationDelay"
          attributes={attributes}
          device={device}
          onUpdate={onUpdate}
          placeholder="0s"
        />
      </div>
      <ResponsiveField
        label="Timing"
        attribute="animationTimingFunction"
        attributes={attributes}
        device={device}
        onUpdate={onUpdate}
        options={TIMING_OPTIONS}
        type="select"
      />
      <ResponsiveField
        label="Repeat"
        attribute="animationIterationCount"
        attributes={attributes}
        device={device}
        onUpdate={onUpdate}
        placeholder="1"
      />
    </CollapsibleSection>
  );
}

export function LinkSection({ attributes, device, onUpdate }: StyleSectionProps) {
  return (
    <CollapsibleSection title="Link">
      <Field
        label="URL"
        value={attributes.linkUrl}
        onChange={(v) => onUpdate({ linkUrl: v || undefined })}
        placeholder="https://…"
      />
      <div className="flex items-center gap-2">
        <label className="text-[11px] text-gray-500 w-16 shrink-0">Target</label>
        <select
          value={attributes.linkTarget || '_self'}
          onChange={(e) => onUpdate({ linkTarget: e.target.value })}
          className="flex-1 border border-[#c3c4c7] rounded px-2 py-1 text-[12px] bg-white"
        >
          <option value="_self">Same tab</option>
          <option value="_blank">New tab</option>
        </select>
      </div>
      <Field
        label="Rel"
        value={attributes.linkRel}
        onChange={(v) => onUpdate({ linkRel: v || undefined })}
        placeholder="noopener"
      />
      <Field
        label="Aria"
        value={attributes.linkAriaLabel}
        onChange={(v) => onUpdate({ linkAriaLabel: v || undefined })}
        placeholder="Describe link"
      />
      <div className="text-[10px] text-gray-400">
        Applies to the element wrapper when it supports a link.
      </div>
      <span className="hidden">{device}</span>
    </CollapsibleSection>
  );
}

export function VisibilitySection({ attributes, device, onUpdate }: StyleSectionProps) {
  return (
    <CollapsibleSection title="Visibility">
      <label className="flex items-center gap-2 text-[12px] text-gray-600">
        <input
          type="checkbox"
          checked={Boolean(attributes.hideOnDesktop)}
          onChange={(e) => onUpdate({ hideOnDesktop: e.target.checked || undefined })}
        />
        Hide on desktop
      </label>
      <label className="flex items-center gap-2 text-[12px] text-gray-600">
        <input
          type="checkbox"
          checked={Boolean(attributes.hideOnTablet)}
          onChange={(e) => onUpdate({ hideOnTablet: e.target.checked || undefined })}
        />
        Hide on tablet
      </label>
      <label className="flex items-center gap-2 text-[12px] text-gray-600">
        <input
          type="checkbox"
          checked={Boolean(attributes.hideOnMobile)}
          onChange={(e) => onUpdate({ hideOnMobile: e.target.checked || undefined })}
        />
        Hide on mobile
      </label>
      <label className="flex items-center gap-2 text-[12px] text-gray-600">
        <input
          type="checkbox"
          checked={Boolean(attributes.sticky)}
          onChange={(e) => onUpdate({ sticky: e.target.checked || undefined })}
        />
        Sticky on scroll
      </label>
      <ResponsiveField
        label="Sticky Off."
        attribute="stickyOffset"
        attributes={attributes}
        device={device}
        onUpdate={onUpdate}
        placeholder="0px"
      />
    </CollapsibleSection>
  );
}

export function AdvancedSection({ attributes, device, onUpdate }: StyleSectionProps) {
  const serializedAttributes = Object.entries(attributes.htmlAttributes ?? {})
    .map(([key, value]) => `${key}="${value}"`)
    .join('\n');

  const handleAttributesChange = (value: string) => {
    const parsed: Record<string, string> = {};
    for (const line of value.split('\n')) {
      const match = /^\s*([a-z_:][a-z0-9_:.-]*)\s*=\s*"?([^"]*)"?\s*$/i.exec(line);
      if (match) {
        parsed[match[1]] = match[2];
      }
    }
    onUpdate({ htmlAttributes: Object.keys(parsed).length > 0 ? parsed : undefined });
  };

  return (
    <CollapsibleSection title="Advanced">
      <Field
        label="CSS Class"
        value={attributes.cssClass}
        onChange={(v) => onUpdate({ cssClass: v || undefined })}
        placeholder="my-class"
      />
      <Field
        label="HTML ID"
        value={attributes.htmlId}
        onChange={(v) => onUpdate({ htmlId: v || undefined })}
        placeholder="my-id"
      />
      <Field
        label="Attributes"
        type="textarea"
        value={serializedAttributes}
        onChange={handleAttributesChange}
        placeholder={'data-foo="bar"'}
        rows={3}
      />
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
      <span className="hidden">{device}</span>
    </CollapsibleSection>
  );
}
