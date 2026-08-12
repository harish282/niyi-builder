import { describe, expect, it } from 'vitest';
import { NIYI_ATTR_KEY, readNiyiAttrs, withNiyiAttrs } from './niyi-attrs.js';
import { splitGroupAttrs } from './native-attr-map.js';

describe('niyi attribute payload', () => {
  it('stores unmapped builder attrs under niyi while native attrs stay top-level', () => {
    const { native, niyi } = splitGroupAttrs({
      maxWidth: '1200px',
      padding: { desktop: '24px' },
      customFlag: true,
    });

    const result = withNiyiAttrs(native, niyi);

    expect(result.layout).toMatchObject({ contentSize: '1200px' });
    expect(readNiyiAttrs(result)).toEqual({ customFlag: true });
    expect(readNiyiAttrs(result)?.maxWidth).toBeUndefined();
  });

  it('omits niyi when every field maps to Gutenberg', () => {
    const { native, niyi } = splitGroupAttrs({
      maxWidth: '960px',
    });

    const result = withNiyiAttrs(native, niyi);

    expect(result.layout).toMatchObject({ contentSize: '960px' });
    expect(result[NIYI_ATTR_KEY]).toBeUndefined();
    expect(readNiyiAttrs(result)).toBeNull();
  });

  it('keeps responsive overflow in niyi when native only stores desktop', () => {
    const { native, niyi } = splitGroupAttrs({
      padding: { desktop: '24px', mobile: '12px' },
    });

    expect(native.style).toMatchObject({ spacing: { padding: '24px' } });
    expect(niyi.padding).toEqual({ mobile: '12px' });
  });
});
