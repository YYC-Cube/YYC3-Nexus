export interface SearchResult {
  id: string;
  label: string;
  title: string;
  category: string;
  path: string;
  description?: string;
}

export function searchSettings(_query: string): SearchResult[] {
  return [];
}
