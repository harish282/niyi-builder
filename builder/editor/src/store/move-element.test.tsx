// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { cleanup, render, fireEvent, screen } from '@testing-library/react';
import { afterEach } from 'vitest';
import { ElementRegistry, generateId } from '@niyi-builder/core';
import { containerDefinition } from '@niyi-builder/elements';
import type { BuilderDocument, ElementNode } from '@niyi-builder/core';
import { EditorProvider, useEditorStore } from './EditorStore.js';

function setupRegistry(): void {
  const registry = new ElementRegistry();
  registry.registerElement(containerDefinition);
  window.__niyiRegistry = {
    registerElement: registry.registerElement.bind(registry),
    getElement: registry.getElement.bind(registry),
    getAllElements: registry.getAllElements.bind(registry),
  };
}

function container(id: string, children: ElementNode[] = []): ElementNode {
  return { id, type: 'container', attributes: {}, children };
}

function heading(id: string): ElementNode {
  return { id, type: 'heading', attributes: {}, children: [] };
}

function simplify(children: ElementNode[]): unknown[] {
  return children.map((el) => ({
    id: el.id,
    type: el.type,
    children: simplify(el.children),
  }));
}

interface SimplifiedNode {
  id: string;
  type: string;
  children: SimplifiedNode[];
}

function parseTree(): SimplifiedNode[] {
  return JSON.parse(screen.getByTestId('tree').textContent ?? '[]') as SimplifiedNode[];
}

function makeDocument(): BuilderDocument {
  return {
    id: generateId(),
    title: 'Untitled',
    elements: [container('c1', [heading('h1'), heading('h2')]), container('c2')],
  };
}

function Harness(): React.ReactElement {
  const {
    document,
    setDocument,
    moveElementTo,
    selectElement,
    addElement,
    toggleElements,
    showElements,
  } = useEditorStore();
  return (
    <div>
      <button type="button" onClick={() => setDocument(makeDocument())}>
        load tree
      </button>
      <button type="button" onClick={() => moveElementTo('h2', 'h1')}>
        move h2 over h1
      </button>
      <button type="button" onClick={() => moveElementTo('h1', 'c2')}>
        move h1 into c2
      </button>
      <button type="button" onClick={() => moveElementTo('c1', 'h1')}>
        move c1 over h1
      </button>
      <button type="button" onClick={() => selectElement('c1')}>
        select c1
      </button>
      <button type="button" onClick={toggleElements}>
        toggle elements
      </button>
      <button type="button" onClick={() => addElement(heading('nh'))}>
        add heading
      </button>
      <pre data-testid="tree">{JSON.stringify(simplify(document.elements))}</pre>
      <span data-testid="showElements">{String(showElements)}</span>
    </div>
  );
}

afterEach(() => {
  cleanup();
});

describe('moveElementTo', () => {
  it('reorders within the same parent (drop before target)', () => {
    setupRegistry();
    render(
      <EditorProvider>
        <Harness />
      </EditorProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: /load tree/i }));
    fireEvent.click(screen.getByRole('button', { name: /move h2 over h1/i }));

    const tree = parseTree();
    expect(tree[0].children.map((c) => c.id)).toEqual(['h2', 'h1']);
    expect(tree[1].children).toEqual([]);
  });

  it('nests an element into a container at the end', () => {
    setupRegistry();
    render(
      <EditorProvider>
        <Harness />
      </EditorProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: /load tree/i }));
    fireEvent.click(screen.getByRole('button', { name: /move h1 into c2/i }));

    const tree = parseTree();
    expect(tree[0].children.map((c) => c.id)).toEqual(['h2']);
    expect(tree[1].children.map((c) => c.id)).toEqual(['h1']);
  });

  it('refuses to move a container into its own descendant', () => {
    setupRegistry();
    render(
      <EditorProvider>
        <Harness />
      </EditorProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: /load tree/i }));
    fireEvent.click(screen.getByRole('button', { name: /move c1 over h1/i }));

    const tree = parseTree();
    expect(tree[0].children.map((c) => c.id)).toEqual(['h1', 'h2']);
  });
});

describe('elements panel stays open', () => {
  it('closes the elements panel when an element is selected', () => {
    setupRegistry();
    render(
      <EditorProvider>
        <Harness />
      </EditorProvider>,
    );

    expect(screen.getByTestId('showElements').textContent).toBe('true');
    fireEvent.click(screen.getByRole('button', { name: /select c1/i }));
    expect(screen.getByTestId('showElements').textContent).toBe('false');
  });

  it('keeps the elements panel open when adding elements into the selection', () => {
    setupRegistry();
    render(
      <EditorProvider>
        <Harness />
      </EditorProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: /load tree/i }));
    fireEvent.click(screen.getByRole('button', { name: /select c1/i }));
    expect(screen.getByTestId('showElements').textContent).toBe('false');
    fireEvent.click(screen.getByRole('button', { name: /toggle elements/i }));
    expect(screen.getByTestId('showElements').textContent).toBe('true');

    fireEvent.click(screen.getByRole('button', { name: /add heading/i }));

    expect(screen.getByTestId('showElements').textContent).toBe('true');
    const tree = parseTree();
    expect(tree[0].children.map((c) => c.id)).toEqual(['h1', 'h2', 'nh']);
  });
});
