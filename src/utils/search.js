/* Pure contact search with weighted multi-field scoring. */

const FIELD_WEIGHTS = [
  { get: (c) => [c.firstName, c.lastName, [c.firstName, c.lastName].filter(Boolean).join(' ')], w: 5 },
  { get: (c) => [c.phone, c.altPhone], w: 4.5 },
  { get: (c) => [c.email], w: 4 },
  { get: (c) => c.tags, w: 3.5 },
  { get: (c) => [c.company, c.jobTitle], w: 3 },
  { get: (c) => [c.city, c.address, c.state, c.country], w: 2 },
];

export function matchScore(contact, query) {
  const q = String(query || '').trim().toLowerCase();
  if (!q || !contact) return 0;
  let score = 0;
  for (const { get, w } of FIELD_WEIGHTS) {
    for (const value of get(contact) || []) {
      if (!value) continue;
      const s = String(value).toLowerCase();
      if (s === q) score += w * 2;
      else if (s.startsWith(q)) score += w * 1.6;
      else if (s.includes(q)) score += w;
    }
  }
  return score;
}

export function searchContacts(contacts, query, limit = 50) {
  const q = String(query || '').trim();
  if (!q) return [];
  const hits = [];
  for (const c of Array.isArray(contacts) ? contacts : []) {
    if (!c) continue;
    const score = matchScore(c, q);
    if (score > 0) hits.push({ contact: c, score });
  }
  hits.sort((a, b) => b.score - a.score);
  return limit > 0 ? hits.slice(0, limit) : hits;
}