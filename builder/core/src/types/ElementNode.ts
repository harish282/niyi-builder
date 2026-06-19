export interface ElementNode {
  id: string;
  type: string;
  attributes: Record<string, unknown>;
  children: ElementNode[];
}
