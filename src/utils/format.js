/* Tiny shared formatters (kept separate from date/validation). */

export function fullName(contact) {
  return `${String(contact?.firstName || '')} ${String(contact?.lastName || '')}`.trim() || 'Unnamed contact';
}

export function roleLine(contact) {
  return [String(contact?.jobTitle || ''), String(contact?.company || '')].filter(Boolean).join(' · ');
}

export function findAllTags(contacts) {
  const set = new Set();
  for (const c of Array.isArray(contacts) ? contacts : []) {
    for (const t of Array.isArray(c?.tags) ? c.tags : []) {
      if (t) set.add(String(t));
    }
  }
  return [...set].sort((a, b) => a.localeCompare(b));
}

export function contactByIdMap(contacts) {
  return Object.fromEntries((Array.isArray(contacts) ? contacts : []).filter((contact) => contact?.id).map((contact) => [contact.id, contact]));
}