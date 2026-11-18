/* Contact CRUD. All reads are sanitized/defensive; persistence stays here. */

import { KEYS, readJSON, writeJSON, uid } from './storage.js';

/* Re-exported so the rest of the app can rely on one familiar API. */
export { searchContacts } from '../utils/search.js';

const asString = (v) => (typeof v === 'string' ? v : v == null ? '' : String(v));

const dedupe = (list) => [...new Set(list)];

export function sanitizeContact(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const tags = Array.isArray(raw.tags)
    ? dedupe(raw.tags.map((t) => asString(t).trim()).filter(Boolean))
    : [];
  const notes = Array.isArray(raw.notes)
    ? raw.notes
        .map((n) =>
          n && typeof n === 'object'
            ? { id: asString(n.id) || uid('nt'), text: asString(n.text), createdAt: asString(n.createdAt) || new Date().toISOString() }
            : null,
        )
        .filter((n) => n && n.text)
    : [];
  const nowIso = new Date().toISOString();
  return {
    id: asString(raw.id) || uid('ct'),
    firstName: asString(raw.firstName),
    lastName: asString(raw.lastName),
    phone: asString(raw.phone),
    altPhone: asString(raw.altPhone),
    email: asString(raw.email),
    company: asString(raw.company),
    jobTitle: asString(raw.jobTitle),
    address: asString(raw.address),
    city: asString(raw.city),
    state: asString(raw.state),
    country: asString(raw.country),
    website: asString(raw.website),
    birthday: asString(raw.birthday),
    tags,
    notes,
    favorite: Boolean(raw.favorite),
    photo: asString(raw.photo),
    createdAt: asString(raw.createdAt) || nowIso,
    updatedAt: asString(raw.updatedAt) || nowIso,
  };
}

export function getContacts() {
  const raw = readJSON(KEYS.contacts, []);
  const list = Array.isArray(raw) ? raw : [];
  return list.map(sanitizeContact).filter(Boolean);
}

export function getContactById(id) {
  if (!id) return null;
  for (const c of getContacts()) {
    if (c.id === id) return c;
  }
  return null;
}

function persist(list) {
  writeJSON(KEYS.contacts, list.map(sanitizeContact));
}

export function addContact(data = {}) {
  const list = getContacts();
  const nowIso = new Date().toISOString();
  const contact = sanitizeContact({
    ...data,
    id: data.id || uid('ct'),
    createdAt: data.createdAt || nowIso,
    updatedAt: nowIso,
  });
  if (!contact) return null;
  list.push(contact);
  persist(list);
  return contact;
}

/* Bulk add for CSV import. Returns the list of contacts actually added. */
export function addContacts(list = []) {
  const all = getContacts();
  const added = [];
  for (const data of list) {
    if (!data || typeof data !== 'object') continue;
    const nowIso = new Date().toISOString();
    const contact = sanitizeContact({
      ...data,
      id: data.id || uid('ct'),
      createdAt: data.createdAt || nowIso,
      updatedAt: nowIso,
    });
    if (!contact) continue;
    added.push(contact);
    all.push(contact);
  }
  if (added.length) persist(all);
  return added;
}

export function updateContact(id, patch = {}) {
  const list = getContacts();
  const idx = list.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  list[idx] = sanitizeContact({ ...list[idx], ...patch, id, updatedAt: new Date().toISOString() });
  persist(list);
  return list[idx];
}

export function deleteContact(id) {
  persist(getContacts().filter((c) => c.id !== id));
}

export function toggleFavorite(id) {
  const c = getContactById(id);
  if (!c) return null;
  return updateContact(id, { favorite: !c.favorite });
}