/* vCard 3.0 generation + client-side file downloads. Pure (except download). */

function vEsc(s) {
  return String(s || '')
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

function filled(v) {
  return String(v || '').trim();
}

export function buildVCard(c) {
  if (!c || typeof c !== 'object') return '';
  const first = filled(c.firstName);
  const last = filled(c.lastName);
  const full = `${first} ${last}`.trim() || 'Contact';
  const tags = Array.isArray(c.tags) && c.tags.length ? c.tags.join(',') : '';
  const notes = Array.isArray(c.notes)
    ? c.notes.map((n) => (n && typeof n === 'object' ? String(n.text || '') : '')).filter(Boolean).join(' — ')
    : '';

  const b = ['BEGIN:VCARD', 'VERSION:3.0', `N:${vEsc(last)};${vEsc(first)};;;`, `FN:${vEsc(full)}`];
  if (filled(c.phone)) b.push(`TEL;TYPE=CELL:${vEsc(c.phone)}`);
  if (filled(c.altPhone)) b.push(`TEL;TYPE=HOME:${vEsc(c.altPhone)}`);
  if (filled(c.email)) b.push(`EMAIL;TYPE=INTERNET:${vEsc(c.email)}`);
  if (filled(c.company)) b.push(`ORG:${vEsc(c.company)}`);
  if (filled(c.jobTitle)) b.push(`TITLE:${vEsc(c.jobTitle)}`);

  const street = filled(c.address);
  const city = filled(c.city);
  const region = filled(c.state);
  const country = filled(c.country);
  if (street || city || region || country) {
    b.push(`ADR;TYPE=HOME:;;${vEsc(street)};${vEsc(city)};${vEsc(region)};;${vEsc(country)}`);
  }
  if (filled(c.website)) b.push(`URL:${vEsc(c.website)}`);
  if (filled(c.birthday)) b.push(`BDAY:${filled(c.birthday)}`);
  if (tags) b.push(`CATEGORIES:${vEsc(tags)}`);
  if (notes) b.push(`NOTE:${vEsc(notes)}`);
  b.push('END:VCARD');
  return b.join('\r\n') + '\r\n';
}

export function vCardFilename(c) {
  const base = `${String(c?.firstName || '')}-${String(c?.lastName || '')}`.trim().replace(/\s+/g, '-').toLowerCase();
  return `${base || 'contact'}.vcf`;
}

export function downloadTextFile({ filename, content, mime = 'text/plain' }) {
  const blob = new Blob([content], { type: `${mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

export function downloadVCard(c) {
  const vcf = buildVCard(c);
  if (!vcf) return false;
  downloadTextFile({
    filename: vCardFilename(c),
    content: vcf,
    mime: 'text/vcard',
  });
  return true;
}