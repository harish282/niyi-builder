import { describe, expect, it } from 'vitest';
import type { BuilderDocument } from '@niyi-builder/core';
import { parseEditorDocument, serializeEditorDocument } from './index.js';
import {
  blockNodeToElement,
  coreDocumentToEditorDocument,
  editorDocumentToCoreDocument,
  elementToBlockNode,
} from './adapter.js';

function makeDocument(elements: BuilderDocument['elements']): BuilderDocument {
  return { id: 'doc-1', title: 'Test', elements };
}

describe('serialization adapter', () => {
  it('maps a container to core/group', () => {
    const node = elementToBlockNode({
      id: 'c1',
      type: 'container',
      attributes: { layout: { type: 'flex', gap: 'md' } },
      children: [],
    });

    expect(node.type).toBe('core/group');
    expect(node.id).toBe('c1');
    expect(node.attributes).toEqual({ layout: { type: 'flex', gap: 'md' } });
  });

  it('maps core blocks back to editor element types', () => {
    expect(
      blockNodeToElement({ id: 'a', type: 'core/group', attributes: {}, children: [] }).type,
    ).toBe('container');
    expect(
      blockNodeToElement({ id: 'b', type: 'core/button', attributes: { label: 'X' }, children: [] })
        .type,
    ).toBe('button');
    expect(
      blockNodeToElement({
        id: 'c',
        type: 'core/heading',
        attributes: { content: 'Y' },
        children: [],
      }).type,
    ).toBe('heading');
    expect(
      blockNodeToElement({
        id: 'd',
        type: 'core/paragraph',
        attributes: { content: 'Hi' },
        children: [],
      }).type,
    ).toBe('paragraph');
    expect(
      blockNodeToElement({
        id: 'e',
        type: 'core/image',
        attributes: { url: 'x.jpg', alt: 'X' },
        children: [],
      }).type,
    ).toBe('image');
  });

  it('keeps unknown core block types as pass-through elements', () => {
    const element = blockNodeToElement({
      id: 'h1',
      type: 'core/html',
      attributes: { html: '<div>x</div>' },
      children: [],
    });

    expect(element.type).toBe('core/html');
    expect(element.attributes.html).toBe('<div>x</div>');
  });

  it('wraps elements in a structural core/group root', () => {
    const core = editorDocumentToCoreDocument(
      makeDocument([{ id: 'h1', type: 'heading', attributes: { text: 'Hi' }, children: [] }]),
    );

    expect(core.version).toBe(0);
    expect(core.root.type).toBe('core/group');
    expect(core.root.attributes).toEqual({});
    expect(core.root.children[0].type).toBe('core/heading');
  });

  it('unwraps a structural root into top-level elements', () => {
    const document = coreDocumentToEditorDocument(
      {
        version: 0,
        root: {
          id: 'root',
          type: 'core/group',
          attributes: {},
          children: [
            { id: 'a', type: 'core/heading', attributes: { content: 'Hi' }, children: [] },
            { id: 'b', type: 'core/paragraph', attributes: {}, children: [] },
          ],
        },
      },
      { id: 'doc-1', title: 'Test' },
    );

    expect(document.elements).toHaveLength(2);
    expect(document.elements[0].type).toBe('heading');
    expect(document.elements[0].attributes.text).toBe('Hi');
  });
});

describe('editor document <-> Gutenberg markup round-trip', () => {
  it('round-trips a single container with heading and button children', () => {
    const doc = makeDocument([
      {
        id: 'container-1',
        type: 'container',
        attributes: {
          layout: { type: 'flex', direction: 'row', justify: 'center', align: 'center', gap: 'md' },
        },
        children: [
          { id: 'heading-1', type: 'heading', attributes: { text: 'Hello' }, children: [] },
          {
            id: 'button-1',
            type: 'button',
            attributes: { text: 'Go', variant: 'primary' },
            children: [],
          },
        ],
      },
    ]);

    const html = serializeEditorDocument(doc);
    const restored = parseEditorDocument(html);

    expect(restored.elements).toHaveLength(1);
    const container = restored.elements[0];
    expect(container.type).toBe('container');
    expect(container.attributes.layout).toEqual(doc.elements[0].attributes.layout);
    expect(container.children).toHaveLength(2);

    const heading = container.children[0];
    expect(heading.type).toBe('heading');
    expect(heading.attributes.text).toBe('Hello');

    const button = container.children[1];
    expect(button.type).toBe('button');
    expect(button.attributes.text).toBe('Go');
    expect(button.attributes.variant).toBe('primary');
  });

  it('keeps a container as a sibling when other top-level blocks exist', () => {
    const doc = makeDocument([
      {
        id: 'container-1',
        type: 'container',
        attributes: { layout: { type: 'flex', gap: 'sm' } },
        children: [
          { id: 'heading-1', type: 'heading', attributes: { text: 'Inside' }, children: [] },
        ],
      },
      { id: 'heading-2', type: 'heading', attributes: { text: 'Footer', level: 3 }, children: [] },
    ]);

    const html = serializeEditorDocument(doc);
    const restored = parseEditorDocument(html);

    expect(restored.elements).toHaveLength(2);
    expect(restored.elements[0].type).toBe('container');
    expect(restored.elements[0].children[0].attributes.text).toBe('Inside');
    expect(restored.elements[1].type).toBe('heading');
    expect(restored.elements[1].attributes).toEqual({ text: 'Footer', level: 3 });
  });

  it('preserves plain top-level content blocks from Gutenberg', () => {
    const html =
      '<!-- wp:heading --><h2 class="wp-block-heading">First</h2><!-- /wp:heading -->\n\n' +
      '<!-- wp:heading {"level":4} --><h4 class="wp-block-heading">Second</h4><!-- /wp:heading -->';

    const restored = parseEditorDocument(html);

    expect(restored.elements).toHaveLength(2);
    expect(restored.elements[0].attributes.text).toBe('First');
    expect(restored.elements[1].attributes).toEqual({ text: 'Second', level: 4 });
  });

  it('maps Gutenberg paragraph and image blocks to editor elements', () => {
    const html =
      '<!-- wp:paragraph --><p>Hello world</p><!-- /wp:paragraph -->\n\n' +
      '<!-- wp:image {"id":42} --><figure class="wp-block-image">' +
      '<img src="http://site.test/photo.jpg" alt="A photo" class="wp-image-42"/></figure>' +
      '<!-- /wp:image -->';

    const restored = parseEditorDocument(html);

    expect(restored.elements).toHaveLength(2);
    const paragraph = restored.elements[0];
    expect(paragraph.type).toBe('paragraph');
    expect(paragraph.attributes.content).toBe('Hello world');

    const image = restored.elements[1];
    expect(image.type).toBe('image');
    expect(image.attributes.url).toBe('http://site.test/photo.jpg');
    expect(image.attributes.alt).toBe('A photo');
    expect(image.attributes.attachmentId).toBe(42);
  });

  it('round-trips paragraph and image elements through Gutenberg markup', () => {
    const doc = makeDocument([
      { id: 'p1', type: 'paragraph', attributes: { content: 'A paragraph' }, children: [] },
      {
        id: 'i1',
        type: 'image',
        attributes: { url: 'http://site.test/pic.jpg', alt: 'Pic', attachmentId: 7 },
        children: [],
      },
    ]);

    const html = serializeEditorDocument(doc);
    const restored = parseEditorDocument(html);

    expect(restored.elements).toHaveLength(2);
    expect(restored.elements[0].type).toBe('paragraph');
    expect(restored.elements[0].attributes.content).toBe('A paragraph');
    expect(restored.elements[1].type).toBe('image');
    expect(restored.elements[1].attributes).toEqual({
      url: 'http://site.test/pic.jpg',
      alt: 'Pic',
      attachmentId: 7,
    });
  });

  it('produces empty markup for an empty document', () => {
    expect(serializeEditorDocument(makeDocument([]))).toBe('');
    expect(parseEditorDocument('')).toEqual({ id: 'document', title: 'Untitled', elements: [] });
  });
});
