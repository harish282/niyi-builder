import type { ValidationIssue } from '@niyi-builder/core';

export class SerializeError extends Error {
  readonly issues: ValidationIssue[];

  constructor(message: string, issues: ValidationIssue[] = []) {
    super(message);
    this.name = 'SerializeError';
    this.issues = issues;
  }
}

export class ParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ParseError';
  }
}

export class UnsupportedBlockError extends SerializeError {
  readonly blockType: string;

  constructor(blockType: string, path: string) {
    super(`Unsupported block type "${blockType}" at ${path}.`, [
      { path, message: `No serializer registered for block type "${blockType}".` },
    ]);
    this.name = 'UnsupportedBlockError';
    this.blockType = blockType;
  }
}

export class UnsupportedMarkupBlockError extends ParseError {
  readonly blockName: string;

  constructor(blockName: string) {
    super(`Unsupported Gutenberg block "${blockName}". Only niyi/* blocks are mapped in v0.`);
    this.name = 'UnsupportedMarkupBlockError';
    this.blockName = blockName;
  }
}
