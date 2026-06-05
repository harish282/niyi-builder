import { describe, expect, it } from 'vitest';
import {
  nativeGroupToBuilder,
  splitButtonAttrs,
  splitGroupAttrs,
  splitHeadingAttrs,
} from './native-attr-map.js';
import { mergeNativeAndNiyi, withNiyiAttrs } from './niyi-attrs.js';

describe('native attribute mapping', () => {
  it('maps group maxWidth to layout.contentSize', () => {
    const { native, niyi } = splitGroupAttrs({ maxWidth: '1140px' });
    expect(native.layout).toEqual({ type: 'constrained', contentSize: '1140px' });
    expect(niyi).toEqual({});
  });

  it('maps heading level natively and typography to niyi', () => {
    const { native, niyi } = splitHeadingAttrs({
      level: 2,
      content: 'Title',
      typography: { fontWeight: '700' },
    });
    expect(native).toEqual({ level: 2 });
    expect(niyi).toEqual({ typography: { fontWeight: '700' } });
  });

  it('maps button url and text natively; variant stays in niyi', () => {
    const { native, niyi } = splitButtonAttrs({
      label: 'Go',
      url: '/go',
      variant: 'primary',
    });
    expect(native).toEqual({ url: '/go', text: 'Go' });
    expect(niyi).toEqual({ variant: 'primary' });
  });

  it('merges native extraction with niyi overflow on parse', () => {
    const gutenbergAttrs = withNiyiAttrs(
      { layout: { type: 'constrained', contentSize: '1200px' } },
      { padding: { mobile: '12px' } },
    );

    const builder = mergeNativeAndNiyi(gutenbergAttrs, nativeGroupToBuilder, '');

    expect(builder.maxWidth).toBe('1200px');
    expect(builder.padding).toEqual({ mobile: '12px' });
  });
});
