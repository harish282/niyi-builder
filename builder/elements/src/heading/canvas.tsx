import type { FC, HTMLAttributes } from 'react';
import type { ElementNode } from '@niyi-builder/core';
import { extractBaseAttributes, attributesToInlineStyles, attributesToClassName } from '@niyi-builder/core';
import { InlineEditor } from '../shared/InlineEditor.js';

interface HeadingCanvasProps {
  node: ElementNode;
  onSelect: () => void;
  isSelected?: boolean;
  onUpdate?: (attributes: Record<string, unknown>) => void;
}

type HeadingTagProps = HTMLAttributes<HTMLHeadingElement>;

const H1: FC<HeadingTagProps> = (props) => <h1 {...props} />;
const H2: FC<HeadingTagProps> = (props) => <h2 {...props} />;
const H3: FC<HeadingTagProps> = (props) => <h3 {...props} />;
const H4: FC<HeadingTagProps> = (props) => <h4 {...props} />;
const H5: FC<HeadingTagProps> = (props) => <h5 {...props} />;
const H6: FC<HeadingTagProps> = (props) => <h6 {...props} />;

const headingTags: Record<number, FC<HeadingTagProps>> = {
  1: H1,
  2: H2,
  3: H3,
  4: H4,
  5: H5,
  6: H6,
};

export const HeadingCanvas: FC<HeadingCanvasProps> = ({ node, onSelect, isSelected, onUpdate }) => {
  const text = (node.attributes.text as string) || 'Heading';
  const level = (node.attributes.level as number) || 2;

  const Tag = headingTags[level] || H2;
  const base = extractBaseAttributes(node.attributes);
  const style = attributesToInlineStyles(base);
  const className = attributesToClassName(base);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isSelected) {
      onSelect();
    }
  };

  if (isSelected && onUpdate) {
    return (
      <Tag
        className={`wp-block-heading ${className}`}
        style={style}
        id={base.htmlId || undefined}
        onClick={handleClick}
      >
        <InlineEditor
          content={text}
          onUpdate={(html) => onUpdate({ text: html })}
          isSelected={isSelected}
          placeholder="Heading..."
        />
      </Tag>
    );
  }

  return (
    <Tag
      className={`wp-block-heading cursor-pointer hover:outline hover:outline-1 hover:outline-blue-500 ${className}`}
      style={style}
      id={base.htmlId || undefined}
      onClick={handleClick}
    >
      {text}
    </Tag>
  );
};
