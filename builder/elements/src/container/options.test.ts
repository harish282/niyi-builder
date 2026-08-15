import { describe, expect, it } from 'vitest';
import { buildFlexLayout, buildGridLayout, createContainerChildren } from './options.js';
import { containerDefaults, flexDefaults, gridDefaults } from './defaults.js';
import { createContainerNode } from './definition.js';

describe('container options', () => {
  it('builds a flex layout from defaults when no options given', () => {
    expect(buildFlexLayout()).toEqual({ ...flexDefaults });
  });

  it('merges flex options over defaults', () => {
    expect(
      buildFlexLayout({ direction: 'column', columns: 3, justify: 'between', gap: 'lg' }),
    ).toEqual({
      type: 'flex',
      direction: 'column',
      columns: 3,
      rows: 2,
      justify: 'between',
      align: 'start',
      gap: 'lg',
    });
  });

  it('builds a grid layout from defaults when no options given', () => {
    expect(buildGridLayout()).toEqual({ ...gridDefaults });
  });

  it('merges grid options over defaults', () => {
    expect(buildGridLayout({ columns: 3, rows: 2, alignItems: 'center' })).toEqual({
      type: 'grid',
      columns: 3,
      rows: 2,
      gap: 'md',
      justifyItems: 'stretch',
      alignItems: 'center',
    });
  });

  it('keeps container defaults as the flex layout', () => {
    expect(containerDefaults.layout).toEqual({ ...flexDefaults });
  });
});

describe('createContainerNode', () => {
  it('creates a container with a grid layout via attributes', () => {
    const node = createContainerNode({
      attributes: { layout: buildGridLayout({ columns: 4 }) },
    });
    expect(node.type).toBe('container');
    expect(node.attributes.layout).toEqual({
      type: 'grid',
      columns: 4,
      rows: 'auto',
      gap: 'md',
      justifyItems: 'stretch',
      alignItems: 'stretch',
    });
  });

  it('creates a flex container with a column count via attributes', () => {
    const node = createContainerNode({
      attributes: { layout: buildFlexLayout({ direction: 'row', columns: 4 }) },
    });
    expect(node.type).toBe('container');
    expect(node.attributes.layout).toEqual({
      type: 'flex',
      direction: 'row',
      columns: 4,
      rows: 2,
      justify: 'start',
      align: 'start',
      gap: 'md',
    });
  });
});

describe('createContainerChildren', () => {
  it('creates one child per column for a flex row layout', () => {
    const children = createContainerChildren({ layout: buildFlexLayout({ columns: 3 }) });
    expect(children).toHaveLength(3);
    for (const child of children) {
      expect(child.type).toBe('container');
      expect((child.attributes.layout as { type?: string }).type).toBe('flex');
      expect(child.children).toHaveLength(0);
    }
  });

  it('creates one child per row for a flex column layout', () => {
    const children = createContainerChildren({
      layout: buildFlexLayout({ direction: 'column', rows: 2 }),
    });
    expect(children).toHaveLength(2);
  });

  it('creates children from a grid layout columns', () => {
    const children = createContainerChildren({ layout: buildGridLayout({ columns: 4 }) });
    expect(children).toHaveLength(4);
  });

  it('generates ids for every child', () => {
    const children = createContainerChildren({ layout: buildFlexLayout({ columns: 2 }) });
    expect(children[0].id).toBeTruthy();
    expect(children[1].id).toBeTruthy();
    expect(children[0].id).not.toBe(children[1].id);
  });
});
