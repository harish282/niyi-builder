import {
  getBlockDefinition,
  getInsertableBlockTypes,
  type BlockCategory,
} from '@niyi-builder/blocks';
import type { BlockType } from '@niyi-builder/core';
import { useMemo } from 'react';

import { findBlockById, resolveInsertParentId } from '../document-ops.js';
import { useEditorStore } from '../store.js';

const CATEGORY_ORDER: BlockCategory[] = ['layout', 'content'];
const CATEGORY_LABELS: Record<BlockCategory, string> = {
  layout: 'Layout',
  content: 'Content',
};

export function Inserter() {
  const document = useEditorStore((state) => state.document);
  const selectedBlockId = useEditorStore((state) => state.selectedBlockId);
  const isInserterOpen = useEditorStore((state) => state.isInserterOpen);
  const insertBlock = useEditorStore((state) => state.insertBlock);
  const toggleInserter = useEditorStore((state) => state.toggleInserter);

  const insertParentId = resolveInsertParentId(document.root, selectedBlockId);
  const insertParent = findBlockById(document.root, insertParentId);
  const insertParentLabel = insertParent
    ? (getBlockDefinition(insertParent.type)?.label ?? insertParent.type)
    : 'Page';

  const blocksByCategory = useMemo(() => {
    const parentType = insertParent?.type ?? document.root.type;
    const insertableTypes = getInsertableBlockTypes(parentType);

    const grouped = new Map<BlockCategory, BlockType[]>();

    for (const type of insertableTypes) {
      const definition = getBlockDefinition(type);

      if (!definition) {
        continue;
      }

      const list = grouped.get(definition.category) ?? [];
      list.push(type);
      grouped.set(definition.category, list);
    }

    return grouped;
  }, [document.root, insertParent?.type]);

  if (!isInserterOpen) {
    return null;
  }

  return (
    <div className="niyi-editor__inserter-backdrop" onClick={() => toggleInserter(false)}>
      <aside
        className="niyi-editor__inserter"
        role="dialog"
        aria-label="Add element"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="niyi-editor__inserter-header">
          <div>
            <h2 className="niyi-editor__inserter-title">Add element</h2>
            <p className="niyi-editor__inserter-target">
              Inserting into <strong>{insertParentLabel}</strong>
            </p>
          </div>
          <button
            type="button"
            className="niyi-editor__inserter-close"
            aria-label="Close"
            onClick={() => toggleInserter(false)}
          >
            ×
          </button>
        </header>

        <div className="niyi-editor__inserter-body">
          {CATEGORY_ORDER.map((category) => {
            const types = blocksByCategory.get(category);

            if (!types || types.length === 0) {
              return null;
            }

            return (
              <section key={category} className="niyi-editor__inserter-section">
                <h3 className="niyi-editor__inserter-section-title">{CATEGORY_LABELS[category]}</h3>
                <ul className="niyi-editor__inserter-list">
                  {types.map((type) => {
                    const definition = getBlockDefinition(type);

                    if (!definition) {
                      return null;
                    }

                    return (
                      <li key={type}>
                        <button
                          type="button"
                          className="niyi-editor__inserter-item"
                          onClick={() => insertBlock(type)}
                        >
                          <span className="niyi-editor__inserter-item-label">
                            {definition.label}
                          </span>
                          <span className="niyi-editor__inserter-item-type">{type}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}
        </div>
      </aside>
    </div>
  );
}
