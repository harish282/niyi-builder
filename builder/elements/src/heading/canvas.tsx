import type { FC, HTMLAttributes } from 'react';
import type { ElementNode } from '@niyi-builder/core';
import { headingDefaults } from './defaults.js';

interface HeadingCanvasProps {
  node: ElementNode;
  onSelect: () => void;
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

export const HeadingCanvas: FC<HeadingCanvasProps> = ({ node, onSelect }) => {
  const text = (node.attributes.text as string) || headingDefaults.text;
  const level = (node.attributes.level as number) || 2;

  const Tag = headingTags[level] || H2;

  return (
    <Tag
      className="wp-block-heading cursor-pointer hover:outline hover:outline-1 hover:outline-blue-500"
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      {text}
    </Tag>
  );
};
