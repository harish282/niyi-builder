import type { FC } from 'react';
import type { Breakpoint, ElementNode } from '@niyi-builder/core';
import {
  extractBaseAttributes,
  attributesToInlineStyles,
  attributesToClassName,
} from '@niyi-builder/core';
import { paragraphDefaults } from './defaults.js';
import { InlineEditor } from '../shared/InlineEditor.js';

interface ParagraphCanvasProps {
  node: ElementNode;
  onSelect: () => void;
  isSelected?: boolean;
  onUpdate?: (attributes: Record<string, unknown>) => void;
  device?: Breakpoint;
}

export const ParagraphCanvas: FC<ParagraphCanvasProps> = ({
  node,
  onSelect,
  isSelected,
  onUpdate,
  device,
}) => {
  const content = (node.attributes.content as string) || paragraphDefaults.content;
  const base = extractBaseAttributes(node.attributes);
  const style = attributesToInlineStyles(base, { device });
  const className = attributesToClassName(base);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isSelected) {
      onSelect();
    }
  };

  if (isSelected && onUpdate) {
    return (
      <p
        className={`wp-block-paragraph ${className}`}
        style={style}
        id={base.htmlId || undefined}
        onClick={handleClick}
      >
        <InlineEditor
          content={content}
          onUpdate={(html) => onUpdate({ content: html })}
          isSelected={isSelected}
          placeholder="Type something..."
        />
      </p>
    );
  }

  return (
    <p
      className={`wp-block-paragraph cursor-pointer hover:outline hover:outline-1 hover:outline-blue-500 ${className}`}
      style={style}
      id={base.htmlId || undefined}
      onClick={handleClick}
    >
      {content}
    </p>
  );
};
