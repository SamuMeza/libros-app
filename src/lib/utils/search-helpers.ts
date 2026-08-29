export function buildFTSQuery(searchTerm: string): string {
  const normalized = searchTerm
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

  const words = normalized.split(/\s+/).filter(Boolean);
  return words.join(' & ');
}

export function buildSearchFilter(searchTerm: string): string {
  const tsQuery = buildFTSQuery(searchTerm);
  return `to_tsvector('spanish', title || ' ' || author || ' ' || COALESCE(description, '')) @@ plainto_tsquery('spanish', '${tsQuery.replace(/'/g, "''")}')`;
}

export function sanitizeSearchInput(input: string): string {
  return input
    .replace(/[<>'";]/g, '')
    .trim()
    .slice(0, 200);
}
