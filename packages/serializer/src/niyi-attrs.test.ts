import { describe, expect, it } from 'vitest';
import { NIYI_ATTR_KEY, readNiyiAttrs, withNiyiAttrs } from './niyi-attrs.js';

describe('niyi attribute payload', () => {
  it('embeds builder attrs under the niyi key', () => {
    const result = withNiyiAttrs(
      { maxWidth: '1200px', padding: { desktop: '24px' } },
      { level: 1 },
    );

    expect(result.level).toBe(1);
    expect(readNiyiAttrs(result)).toEqual({
      maxWidth: '1200px',
      padding: { desktop: '24px' },
    });
  });

  it('stores only niyi when no native attrs are needed', () => {
    const result = withNiyiAttrs({ maxWidth: '960px' });

    expect(Object.keys(result)).toEqual([NIYI_ATTR_KEY]);
    expect(readNiyiAttrs(result)).toEqual({ maxWidth: '960px' });
  });
});
