export interface ElementDefinition {
  type: string;
  title: string;
  category: string;
  version: string;
  icon?: unknown;
  canHaveChildren?: boolean;
  defaults: Record<string, unknown>;
  Canvas?: unknown;
  Properties?: unknown;
  Wizard?: unknown;
}
