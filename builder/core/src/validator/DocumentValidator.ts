import type { BuilderDocument, ElementNode } from '../types/index.js';

export interface DocumentValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateDocument(document: BuilderDocument): DocumentValidationResult {
  const errors: string[] = [];

  if (!document.id) {
    errors.push('id is required');
  }

  if (!document.title) {
    errors.push('title is required');
  }

  if (!Array.isArray(document.elements)) {
    errors.push('elements must be an array');
  } else {
    for (const element of document.elements) {
      const elementErrors = validateElementNode(element);
      if (!elementErrors.valid) {
        errors.push(...elementErrors.errors.map((e) => `Element ${element.id || 'unknown'}: ${e}`));
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateElementNode(node: ElementNode): DocumentValidationResult {
  const errors: string[] = [];

  if (!node.id) {
    errors.push('id is required');
  }

  if (!node.type) {
    errors.push('type is required');
  }

  if (!node.attributes) {
    errors.push('attributes is required');
  }

  if (!Array.isArray(node.children)) {
    errors.push('children must be an array');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
