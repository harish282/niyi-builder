import type {
  ButtonAttributes,
  ColumnsAttributes,
  EmbedAttributes,
  GroupAttributes,
  HeadingAttributes,
  HtmlAttributes,
  ImageAttributes,
  ParagraphAttributes,
  SpacerAttributes,
} from '@niyi-builder/core';
import type { CSSProperties, ReactNode } from 'react';

import type { BlockPreviewProps } from './registry.js';
import { resolveResponsiveValue } from './responsive.js';

function renderChildrenOrPlaceholder(
  children: BlockPreviewProps['node']['children'],
  renderChildren: () => ReactNode,
  label: string,
): ReactNode {
  if (children.length === 0) {
    return <span className="niyi-preview__placeholder">{label}</span>;
  }

  return renderChildren();
}

export function GroupPreview({ node, device, renderChildren }: BlockPreviewProps): ReactNode {
  const attrs = node.attributes as GroupAttributes;
  const style: CSSProperties = {
    maxWidth: attrs.maxWidth,
    padding: resolveResponsiveValue(attrs.padding, device),
    margin: resolveResponsiveValue(attrs.margin, device),
    background: attrs.background,
    borderRadius: attrs.borderRadius,
    minHeight: node.children.length === 0 ? '3rem' : undefined,
  };

  return (
    <div className="niyi-preview-group" style={style}>
      {renderChildrenOrPlaceholder(node.children, renderChildren, 'Empty container')}
    </div>
  );
}

export function ColumnsPreview({ node, device, renderChildren }: BlockPreviewProps): ReactNode {
  const attrs = node.attributes as ColumnsAttributes;
  const columns = resolveResponsiveValue(attrs.columns, device) ?? 1;
  const gap = resolveResponsiveValue(attrs.gap, device) ?? '16px';
  const style: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `repeat(${Math.max(1, columns)}, minmax(0, 1fr))`,
    gap,
    minHeight: node.children.length === 0 ? '3rem' : undefined,
  };

  return (
    <div className="niyi-preview-columns" style={style}>
      {renderChildrenOrPlaceholder(node.children, renderChildren, 'Add columns')}
    </div>
  );
}

export function ColumnPreview({ node, renderChildren }: BlockPreviewProps): ReactNode {
  return (
    <div
      className="niyi-preview-column"
      style={{ minHeight: node.children.length === 0 ? '2rem' : undefined }}
    >
      {renderChildrenOrPlaceholder(node.children, renderChildren, 'Empty column')}
    </div>
  );
}

export function SpacerPreview({ node, device }: BlockPreviewProps): ReactNode {
  const attrs = node.attributes as SpacerAttributes;
  const height = resolveResponsiveValue(attrs.height, device) ?? '48px';

  return (
    <div
      className="niyi-preview-spacer"
      style={{ height }}
      aria-hidden="true"
      title={`Spacer (${height})`}
    />
  );
}

export function HeadingPreview({ node }: BlockPreviewProps): ReactNode {
  const attrs = node.attributes as HeadingAttributes;
  const level = attrs.level ?? 2;
  const content = attrs.content?.trim() || 'Heading';
  const headingProps = { className: 'niyi-preview-heading', children: content };

  switch (level) {
    case 1:
      return <h1 {...headingProps} />;
    case 3:
      return <h3 {...headingProps} />;
    case 4:
      return <h4 {...headingProps} />;
    case 5:
      return <h5 {...headingProps} />;
    case 6:
      return <h6 {...headingProps} />;
    case 2:
    default:
      return <h2 {...headingProps} />;
  }
}

export function ParagraphPreview({ node }: BlockPreviewProps): ReactNode {
  const attrs = node.attributes as ParagraphAttributes;
  const content = attrs.content?.trim() || 'Start writing…';

  return <p className="niyi-preview-paragraph">{content}</p>;
}

export function ButtonPreview({ node }: BlockPreviewProps): ReactNode {
  const attrs = node.attributes as ButtonAttributes;
  const label = attrs.label?.trim() || 'Button';
  const url = attrs.url?.trim() || '#';

  return (
    <a className="niyi-preview-button" href={url} onClick={(event) => event.preventDefault()}>
      {label}
    </a>
  );
}

export function ImagePreview({ node }: BlockPreviewProps): ReactNode {
  const attrs = node.attributes as ImageAttributes;
  const url = attrs.url?.trim();

  if (!url) {
    return <div className="niyi-preview-image niyi-preview-image--empty">Image</div>;
  }

  return <img className="niyi-preview-image" src={url} alt={attrs.alt ?? ''} loading="lazy" />;
}

export function HtmlPreview({ node }: BlockPreviewProps): ReactNode {
  const attrs = node.attributes as HtmlAttributes;
  const label = attrs.name?.trim() || 'Custom HTML';

  if (attrs.html) {
    return <div className="niyi-preview-html" dangerouslySetInnerHTML={{ __html: attrs.html }} />;
  }

  if (attrs.svg) {
    return <div className="niyi-preview-html" dangerouslySetInnerHTML={{ __html: attrs.svg }} />;
  }

  return <div className="niyi-preview-html niyi-preview-html--empty">{label}</div>;
}

export function EmbedPreview({ node }: BlockPreviewProps): ReactNode {
  const attrs = node.attributes as EmbedAttributes;
  const provider = attrs.provider ?? 'embed';
  const url = attrs.url?.trim();

  return (
    <div className="niyi-preview-embed">
      <span className="niyi-preview-embed__label">{provider}</span>
      {url ? <span className="niyi-preview-embed__url">{url}</span> : null}
    </div>
  );
}
