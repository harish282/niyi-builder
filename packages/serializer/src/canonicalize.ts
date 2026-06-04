import type { BlockNode, BuilderDocument } from '@niyi-builder/core';
import { DOCUMENT_VERSION } from '@niyi-builder/core';

/**
 * Normalizes a document for round-trip comparison (deterministic ids, sorted attribute keys).
 */
export function canonicalizeDocument(document: BuilderDocument): BuilderDocument {
  let index = 0;

  const visit = (node: BlockNode): BlockNode => {
    const id = `canonical-${index++}`;

    return {
      id,
      type: node.type,
      attributes: sortValue(node.attributes) as Record<string, unknown>,
      children: node.children.map(visit),
    };
  };

  return {
    version: DOCUMENT_VERSION,
    root: visit(document.root),
  };
}

function sortValue(value: unknown): unknown {
  if (value === null || typeof value !== 'object') {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(sortValue);
  }

  const record = value as Record<string, unknown>;
  const sorted: Record<string, unknown> = {};

  for (const key of Object.keys(record).sort()) {
    sorted[key] = sortValue(record[key]);
  }

  return sorted;
}
