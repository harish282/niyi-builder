import type {
  ButtonAttributes,
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
  const hasContentSize = Boolean(attrs.maxWidth);
  const style: CSSProperties = {
    padding: resolveResponsiveValue(attrs.padding, device),
    margin: resolveResponsiveValue(attrs.margin, device),
    background: attrs.background,
    borderRadius: attrs.borderRadius,
    minHeight: node.children.length === 0 ? '3rem' : undefined,
    ...(attrs.maxWidth
      ? ({ '--wp--style--global--content-size': attrs.maxWidth } as CSSProperties)
      : {}),
  };

  const className = hasContentSize
    ? 'wp-block-group is-layout-constrained'
    : 'wp-block-group';

  return (
    <div className={className} style={style}>
      {renderChildrenOrPlaceholder(node.children, renderChildren, 'Empty container')}
    </div>
  );
}

export function ColumnsPreview({ node, renderChildren }: BlockPreviewProps): ReactNode {
  return (
    <div
      className="wp-block-columns"
      style={{ minHeight: node.children.length === 0 ? '3rem' : undefined }}
    >
      {renderChildrenOrPlaceholder(node.children, renderChildren, 'Add columns')}
    </div>
  );
}

export function ColumnPreview({ node, renderChildren }: BlockPreviewProps): ReactNode {
  return (
    <div
      className="wp-block-column"
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
      className="wp-block-spacer"
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
  const headingProps = { className: 'wp-block-heading', children: content };

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

  return <p>{content}</p>;
}

export function ButtonPreview({ node }: BlockPreviewProps): ReactNode {
  const attrs = node.attributes as ButtonAttributes;
  const label = attrs.label?.trim() || 'Button';
  const url = attrs.url?.trim() || '#';

  return (
    <div className="wp-block-buttons">
      <div className="wp-block-button">
        <a
          className="wp-block-button__link wp-element-button"
          href={url}
          onClick={(event) => event.preventDefault()}
        >
          {label}
        </a>
      </div>
    </div>
  );
}

export function ImagePreview({ node }: BlockPreviewProps): ReactNode {
  const attrs = node.attributes as ImageAttributes;
  const url = attrs.url?.trim();

  if (!url) {
    return <div className="niyi-preview-image niyi-preview-image--empty">Image</div>;
  }

  const imgClass =
    typeof attrs.attachmentId === 'number' ? `wp-image-${attrs.attachmentId}` : undefined;

  return (
    <figure className="wp-block-image">
      <img src={url} alt={attrs.alt ?? ''} className={imgClass} loading="lazy" />
    </figure>
  );
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
    <figure className={`wp-block-embed is-provider-${provider}`}>
      <div className="wp-block-embed__wrapper">
        {url ? url : <span className="niyi-preview-embed__empty">{provider}</span>}
      </div>
    </figure>
  );
}
