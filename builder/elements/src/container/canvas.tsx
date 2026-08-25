import type { FC, CSSProperties, ReactNode } from 'react';
import type { ElementNode } from '@niyi-builder/core';
import { extractBaseAttributes, attributesToInlineStyles, attributesToClassName } from '@niyi-builder/core';
import { GAP_SIZES, containerDefaults } from './defaults.js';
import type { ContainerLayout } from './definition.js';

interface ContainerCanvasProps {
  node: ElementNode;
  children?: ReactNode;
  onSelect: () => void;
  isSelected?: boolean;
}

const FLEX_ROW_ROW_HEIGHT = 64;

export const ContainerCanvas: FC<ContainerCanvasProps> = ({
  node,
  children,
  onSelect,
  isSelected,
}) => {
  const layout = (node.attributes.layout as ContainerLayout) || containerDefaults.layout;
  const gap = GAP_SIZES[layout.gap || 'md'];
  const selector = `[data-niyi-c="${node.id}"]`;

  const base = extractBaseAttributes(node.attributes);
  const baseStyle = attributesToInlineStyles(base);
  const className = attributesToClassName(base);

  const containerStyle: CSSProperties = {
    ...baseStyle,
    border: isSelected ? '2px solid #007cba' : '1px dashed #ccc',
    minHeight: '60px',
  };

  let childStyle = '';

  if (layout.type === 'grid') {
    containerStyle.display = 'grid';
    containerStyle.gridTemplateColumns = `repeat(${layout.columns || 2}, minmax(0, 1fr))`;
    if (layout.rows && layout.rows !== 'auto') {
      containerStyle.gridTemplateRows = `repeat(${layout.rows}, minmax(0, auto))`;
    } else {
      containerStyle.gridAutoRows = 'minmax(0, auto)';
    }
    containerStyle.gap = gap;
    if (layout.justifyItems) {
      containerStyle.justifyItems = layout.justifyItems;
    }
    if (layout.alignItems) {
      containerStyle.alignItems = layout.alignItems;
    }
  } else {
    containerStyle.display = 'flex';
    containerStyle.flexDirection = layout.direction === 'column' ? 'column' : 'row';
    containerStyle.gap = gap;

    if (layout.justify) {
      const justifyMap: Record<string, string> = {
        start: 'flex-start',
        center: 'center',
        end: 'flex-end',
        between: 'space-between',
        around: 'space-around',
        evenly: 'space-evenly',
      };
      containerStyle.justifyContent = justifyMap[layout.justify] || 'flex-start';
    }

    if (layout.align) {
      const alignMap: Record<string, string> = {
        start: 'flex-start',
        center: 'center',
        end: 'flex-end',
        stretch: 'stretch',
      };
      containerStyle.alignItems = alignMap[layout.align] || 'flex-start';
    }

    if (layout.direction === 'row' && typeof layout.columns === 'number' && layout.columns >= 1) {
      containerStyle.flexWrap = 'wrap';
      childStyle = `${selector} > * { flex: 0 0 calc((100% - ${
        (layout.columns - 1) * parseInt(gap, 10)
      }px) / ${layout.columns}); }`;
    } else if (
      layout.direction === 'column' &&
      typeof layout.rows === 'number' &&
      layout.rows >= 1
    ) {
      containerStyle.flexWrap = 'wrap';
      containerStyle.height = `calc(${layout.rows * FLEX_ROW_ROW_HEIGHT}px + ${
        (layout.rows - 1) * parseInt(gap, 10)
      }px)`;
      childStyle = `${selector} > * { flex: 0 0 100%; height: calc((100% - ${
        (layout.rows - 1) * parseInt(gap, 10)
      }px) / ${layout.rows}); }`;
    }
  }

  return (
    <div
      className={`wp-block-group niyi-container cursor-pointer ${className}`}
      data-niyi-c={node.id}
      id={base.htmlId || undefined}
      style={containerStyle}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      {childStyle ? <style dangerouslySetInnerHTML={{ __html: childStyle }} /> : null}
      {children}
    </div>
  );
};
