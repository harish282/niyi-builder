import type { BuilderDocument } from '../types.js';
import {
  BLOCK_TYPES,
  DOCUMENT_VERSION,
  isBlockType,
  isLeafBlockType,
  ROOT_BLOCK_TYPE,
  type BlockType,
} from './block-types.js';
import { canNest } from './nesting.js';

export interface ValidationIssue {
  path: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  issues: ValidationIssue[];
}

export function validateDocument(document: unknown): ValidationResult {
  const issues: ValidationIssue[] = [];

  if (typeof document !== 'object' || document === null) {
    return { valid: false, issues: [{ path: '', message: 'Document must be an object.' }] };
  }

  const doc = document as Record<string, unknown>;

  if (doc.version !== DOCUMENT_VERSION) {
    issues.push({
      path: 'version',
      message: `Expected version ${DOCUMENT_VERSION}.`,
    });
  }

  if (typeof doc.root !== 'object' || doc.root === null) {
    issues.push({ path: 'root', message: 'Root block is required.' });
  } else {
    validateNode(doc.root, 'root', issues, new Set<string>());
    const rootType = readBlockType(doc.root);
    if (rootType !== null && rootType !== ROOT_BLOCK_TYPE) {
      issues.push({
        path: 'root.type',
        message: `Document root must be ${ROOT_BLOCK_TYPE}.`,
      });
    }
  }

  return { valid: issues.length === 0, issues };
}

function validateNode(
  node: unknown,
  path: string,
  issues: ValidationIssue[],
  seenIds: Set<string>,
): void {
  if (typeof node !== 'object' || node === null) {
    issues.push({ path, message: 'Block node must be an object.' });
    return;
  }

  const block = node as Record<string, unknown>;

  if (typeof block.id !== 'string' || block.id.trim() === '') {
    issues.push({ path: `${path}.id`, message: 'Block id must be a non-empty string.' });
  } else if (seenIds.has(block.id)) {
    issues.push({ path: `${path}.id`, message: `Duplicate block id "${block.id}".` });
  } else {
    seenIds.add(block.id);
  }

  if (typeof block.type !== 'string') {
    issues.push({ path: `${path}.type`, message: 'Block type must be a string.' });
    return;
  }

  if (!isBlockType(block.type)) {
    issues.push({
      path: `${path}.type`,
      message: `Unknown block type "${block.type}". Allowed: ${BLOCK_TYPES.join(', ')}.`,
    });
    return;
  }

  const blockType = block.type;

  if (block.attributes !== undefined) {
    if (
      typeof block.attributes !== 'object' ||
      block.attributes === null ||
      Array.isArray(block.attributes)
    ) {
      issues.push({ path: `${path}.attributes`, message: 'Attributes must be an object.' });
    }
  }

  const children = block.children;

  if (children === undefined) {
    issues.push({
      path: `${path}.children`,
      message: 'Children must be an array (use [] for leaf blocks).',
    });
    return;
  }

  if (!Array.isArray(children)) {
    issues.push({ path: `${path}.children`, message: 'Children must be an array.' });
    return;
  }

  if (isLeafBlockType(blockType) && children.length > 0) {
    issues.push({
      path: `${path}.children`,
      message: `Block type "${blockType}" cannot have children.`,
    });
    return;
  }

  for (let i = 0; i < children.length; i++) {
    const child: unknown = children[i];
    const childPath = `${path}.children[${i}]`;
    const childType = readBlockType(child);

    if (childType !== null && !canNest(blockType, childType)) {
      issues.push({
        path: `${childPath}.type`,
        message: `Block "${childType}" is not allowed inside "${blockType}".`,
      });
    }

    validateNode(child, childPath, issues, seenIds);
  }
}

function readBlockType(node: unknown): BlockType | null {
  if (typeof node !== 'object' || node === null) {
    return null;
  }

  const type = (node as Record<string, unknown>).type;

  return typeof type === 'string' && isBlockType(type) ? type : null;
}

export function assertValidDocument(document: BuilderDocument): void {
  const result = validateDocument(document);
  if (!result.valid) {
    const summary = result.issues.map((i) => `${i.path}: ${i.message}`).join('; ');
    throw new Error(`Invalid builder document: ${summary}`);
  }
}
