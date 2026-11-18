/* CSV import/export for contacts (quote-aware parser, never throws). */

import { isValidEmail, isValidPhone, findPotentialDuplicates } from '../utils/validation.js';

const filled = (v) => String(v ?? '').trim();

export function escapeCsvCell(v) {
  const s = String(v ?? '');
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function toCsv(rows) {
  return rows.map((r) => r.map(escapeCsvCell).join(',')).join('\r\n') + '\r\n';
}

export function contactsToCsv(contacts) {
  const headers = [
    'FirstName', 'LastName', 'Phone', 'AltPhone', 'Email', 'Company', 'JobTitle',
    'Address', 'City', 'State', 'Country', 'Website', 'Birthday',
    'Tags', 'Notes', 'Favorite',
  ];
  const rows = (Array.isArray(contacts) ? contacts : []).map((c) => [
    filled(c.firstName), filled(c.lastName), filled(c.phone), filled(c.altPhone),
    filled(c.email), filled(c.company), filled(c.jobTitle),
    filled(c.address), filled(c.city), filled(c.state), filled(c.country),
    filled(c.website), filled(c.birthday),
    (Array.isArray(c.tags) ? c.tags : []).join('; '),
    (Array.isArray(c.notes) ? c.notes.map((n) => String(n?.text || '')).filter(Boolean).join(' | ') : ''),
    c.favorite ? 'yes' : 'no',
  ]);
  return toCsv([headers, ...rows]);
}

/* Quote-aware CSV parser. Returns array of rows (arrays of strings). */
export function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = '';
  let inQuotes = false;
  const chars = String(text || '');
  let i = 0;
  while (i < chars.length) {
    const ch = chars[i];
    if (inQuotes) {
      if (ch === '"') {
        if (chars[i + 1] === '"') {
          cell += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        cell += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      row.push(cell);
      cell = '';
    } else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && chars[i + 1] === '\n') i += 1;
      row.push(cell);
      cell = '';
      rows.push(row);
      row = [];
    } else {
      cell += ch;
    }
    i += 1;
  }
  if (cell !== '' || row.length) {
    row.push(cell);
    rows.push(row);
  }
  while (rows.length && rows[rows.length - 1].length === 1 && rows[rows.length - 1][0] === '') rows.pop();
  return rows;
}

const HEADER_MAP = {
  firstname: 'firstName', 'first name': 'firstName', first: 'firstName',
  lastname: 'lastName', 'last name': 'lastName', last: 'lastName',
  phone: 'phone', 'phone number': 'phone', mobile: 'phone', mobilephone: 'phone',
  altphone: 'altPhone', 'alternate phone': 'altPhone', 'secondary phone': 'altPhone', 'home phone': 'altPhone',
  email: 'email', 'e-mail': 'email', 'email address': 'email',
  company: 'company', organization: 'company', org: 'company',
  jobtitle: 'jobTitle', title: 'jobTitle', position: 'jobTitle', 'job title': 'jobTitle',
  address: 'address', street: 'address', streetaddress: 'address', 'street address': 'address',
  city: 'city', town: 'city',
  state: 'state', province: 'state',
  country: 'country', nation: 'country',
  website: 'website', url: 'website', site: 'website',
  birthday: 'birthday', dob: 'birthday', 'date of birth': 'birthday',
  tags: 'tags', tag: 'tags', categories: 'tags',
  notes: 'notes', note: 'notes', comments: 'notes',
  favorite: 'favorite', fav: 'favorite', starred: 'favorite', 'is favorite': 'favorite',
};

export function csvToContacts(text, existingContacts = []) {
  const rows = parseCsv(text);
  if (rows.length === 0) return { error: 'The file appears to be empty.' };
  const fields = rows[0].map((h) => HEADER_MAP[String(h || '').trim().toLowerCase()] || null);
  if (!fields.includes('firstName') && !fields.includes('lastName')) {
    return { error: 'No recognized header row. Expect columns such as FirstName / LastName / Phone / Email.' };
  }
  const cell = (row, field) => {
    const idx = fields.indexOf(field);
    return idx >= 0 ? filled(row[idx]) : '';
  };
  const existing = Array.isArray(existingContacts) ? existingContacts : [];
  const candidates = [...existing];
  const imported = [];
  const duplicates = [];
  const invalid = [];
  const nowIso = new Date().toISOString();

  for (let r = 1; r < rows.length; r += 1) {
    const rowNo = r + 1;
    const row = rows[r];
    if (!row.some((v) => String(v ?? '').trim())) continue;
    const draft = {
      firstName: cell(row, 'firstName'),
      lastName: cell(row, 'lastName'),
      phone: cell(row, 'phone'),
      altPhone: cell(row, 'altPhone'),
      email: cell(row, 'email'),
      company: cell(row, 'company'),
      jobTitle: cell(row, 'jobTitle'),
      address: cell(row, 'address'),
      city: cell(row, 'city'),
      state: cell(row, 'state'),
      country: cell(row, 'country'),
      website: cell(row, 'website'),
      birthday: cell(row, 'birthday'),
      tags: cell(row, 'tags') ? cell(row, 'tags').split(/[;,]/).map((t) => t.trim()).filter(Boolean) : [],
      notes: cell(row, 'notes') ? [{ id: `imp_${rowNo}`, text: cell(row, 'notes'), createdAt: nowIso }] : [],
      favorite: /^(true|yes|1|y)$/i.test(cell(row, 'favorite')),
    };
    if (!draft.firstName && !draft.lastName) {
      invalid.push({ row: rowNo, reason: 'Missing name' });
      continue;
    }
    if (!draft.phone || !isValidPhone(draft.phone)) {
      invalid.push({ row: rowNo, reason: draft.phone ? 'Invalid phone number' : 'Missing phone number' });
      continue;
    }
    if (draft.email && !isValidEmail(draft.email)) {
      invalid.push({ row: rowNo, reason: 'Invalid email address' });
      continue;
    }
    if (draft.birthday && !/^\d{4}-\d{2}-\d{2}$/.test(draft.birthday)) {
      invalid.push({ row: rowNo, reason: 'Invalid birthday (use YYYY-MM-DD)' });
      continue;
    }
    const dup = findPotentialDuplicates(candidates, draft);
    if (dup.length) {
      duplicates.push({ row: rowNo, draft, matched: dup[0] });
      continue;
    }
    imported.push(draft);
    candidates.push(draft);
  }
  return {
    error: null,
    detected: Math.max(0, rows.length - 1),
    imported,
    duplicates,
    invalid,
  };
}