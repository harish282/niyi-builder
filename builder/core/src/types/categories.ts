/**
 * Canonical display order for element categories in the insert panel.
 * Unknown categories are appended after these, sorted alphabetically.
 */
export const ELEMENT_CATEGORY_ORDER: readonly string[] = [
  'layout',
  'content',
  'media',
  'form',
  'basic',
  'general',
];

export function categoryRank(category: string): number {
  const index = ELEMENT_CATEGORY_ORDER.indexOf(category.toLowerCase());
  return index === -1 ? ELEMENT_CATEGORY_ORDER.length : index;
}

export function compareCategories(a: string, b: string): number {
  const rankDiff = categoryRank(a) - categoryRank(b);
  if (rankDiff !== 0) return rankDiff;
  return a.localeCompare(b);
}

export function formatCategoryLabel(category: string): string {
  return category.charAt(0).toUpperCase() + category.slice(1);
}
