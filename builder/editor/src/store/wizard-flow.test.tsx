// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { cleanup, render, fireEvent, screen } from '@testing-library/react';
import { afterEach } from 'vitest';
import { ElementRegistry } from '@niyi-builder/core';
import { containerDefinition } from '@niyi-builder/elements';
import { EditorProvider, useEditorStore } from './EditorStore.js';
import { ElementWizard } from '../panels/ElementWizard.js';
import { CanvasRenderer } from '../canvas/CanvasRenderer.js';

function setupRegistry(): void {
  const registry = new ElementRegistry();
  registry.registerElement(containerDefinition);
  window.__niyiRegistry = {
    registerElement: registry.registerElement.bind(registry),
    getElement: registry.getElement.bind(registry),
    getAllElements: registry.getAllElements.bind(registry),
  };
}

function Harness(): React.ReactElement {
  const { document, openWizard, selectElement } = useEditorStore();
  return (
    <div>
      <button type="button" onClick={() => openWizard('container')}>
        open wizard
      </button>
      <span data-testid="count">{document.elements.length}</span>
      <span data-testid="children">
        {document.elements.length > 0 ? document.elements[0].children.length : 'none'}
      </span>
      <span data-testid="layout">
        {document.elements.length > 0
          ? JSON.stringify((document.elements[0].attributes.layout as { type?: string })?.type)
          : 'none'}
      </span>
      <button type="button" onClick={() => selectElement(document.elements[0]?.id ?? null)}>
        select first
      </button>
      <CanvasRenderer />
      <ElementWizard />
    </div>
  );
}

function completeWizard(): void {
  fireEvent.click(screen.getByText('Flexbox'));
  fireEvent.click(screen.getByRole('button', { name: /create container/i }));
}

afterEach(() => {
  cleanup();
});

describe('container wizard add flow', () => {
  it('adds a container to the document when the wizard completes', () => {
    setupRegistry();
    render(
      <EditorProvider>
        <Harness />
      </EditorProvider>,
    );

    expect(screen.getByTestId('count').textContent).toBe('0');

    fireEvent.click(screen.getByRole('button', { name: /open wizard/i }));
    completeWizard();

    expect(screen.getByTestId('count').textContent).toBe('1');
  });

  it('generates child containers matching the selected layout', () => {
    setupRegistry();
    render(
      <EditorProvider>
        <Harness />
      </EditorProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: /open wizard/i }));
    fireEvent.click(screen.getByText('Flexbox'));
    fireEvent.click(screen.getByRole('button', { name: /3/i }));
    fireEvent.click(screen.getByRole('button', { name: /create container/i }));

    expect(screen.getByTestId('count').textContent).toBe('1');
    expect(screen.getByTestId('children').textContent).toBe('3');
    expect(screen.getByTestId('layout').textContent).toBe('"flex"');
  });

  it('renders the wizard-created container with its children on the canvas', () => {
    setupRegistry();
    render(
      <EditorProvider>
        <Harness />
      </EditorProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: /open wizard/i }));
    completeWizard();

    const iframe = document.querySelector('iframe');
    const frameDoc = iframe?.contentDocument;
    const containers = frameDoc?.querySelectorAll('.niyi-container');
    expect(containers?.length).toBe(3);
  });
});
