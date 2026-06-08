import type { BlockNode, BuilderDocument } from './types.js';

export interface BlockTreeSummary {
  id: string;
  type: string;
  childCount: number;
  children: BlockTreeSummary[];
}

export function summarizeBlockTree(node: BlockNode): BlockTreeSummary {
  return {
    id: node.id,
    type: node.type,
    childCount: node.children.length,
    children: node.children.map(summarizeBlockTree),
  };
}

export function summarizeDocument(document: BuilderDocument): BlockTreeSummary {
  return summarizeBlockTree(document.root);
}
