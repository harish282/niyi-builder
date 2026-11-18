import type { FC } from 'react';
import type { Breakpoint, ElementNode } from '@niyi-builder/core';
import {
  attributesToClassName,
  attributesToInlineStyles,
  extractBaseAttributes,
} from '@niyi-builder/core';
import { videoDefaults } from './defaults.js';

interface VideoCanvasProps {
  node: ElementNode;
  onSelect: () => void;
  isSelected?: boolean;
  device?: Breakpoint;
}

export function getEmbedUrl(url: string, provider: string): string {
  if (!url) return '';

  if (provider === 'youtube') {
    const id = /(?:youtu\.be\/|v=|embed\/)([\w-]{6,})/.exec(url)?.[1];
    return id ? `https://www.youtube.com/embed/${id}` : url;
  }

  if (provider === 'vimeo') {
    const id = /vimeo\.com\/(?:video\/)?(\d+)/.exec(url)?.[1];
    return id ? `https://player.vimeo.com/video/${id}` : url;
  }

  return url;
}

export const VideoCanvas: FC<VideoCanvasProps> = ({ node, onSelect, isSelected, device }) => {
  const base = extractBaseAttributes(node.attributes);
  const className = attributesToClassName(base);
  const url = (node.attributes.url as string) || videoDefaults.url;
  const provider = (node.attributes.provider as string) || videoDefaults.provider;
  const caption = (node.attributes.caption as string) || '';

  return (
    <figure
      className={`wp-block-embed niyi-video cursor-pointer m-0 ${className}`}
      style={{
        ...attributesToInlineStyles(base, { device }),
        outline: isSelected ? '1px dashed #2271b1' : undefined,
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      {url ? (
        provider === 'self' ? (
          <video src={url} controls style={{ width: '100%', display: 'block' }} />
        ) : (
          <div className="relative w-full" style={{ aspectRatio: '16 / 9' }}>
            <iframe
              src={getEmbedUrl(url, provider)}
              title={caption || 'Embedded video'}
              className="absolute inset-0 h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )
      ) : (
        <div className="flex aspect-video items-center justify-center rounded border border-dashed border-gray-300 bg-gray-100 text-sm text-gray-400">
          Video
        </div>
      )}
      {caption && (
        <figcaption className="mt-1 text-center text-xs text-gray-500">{caption}</figcaption>
      )}
    </figure>
  );
};
