/* Contact validation helpers. All pure functions; never throw. */

import { toDate } from './date.js';

export function phoneDigits(v) {
  return String(v || '').replace(/\D/g, '');
}

/* Strips separators but keeps a leading + for international format. */
export function normalizePhone(v) {
  const s = String(v || '').trim().replace(/[\s\-().]/g, '');
  return s;
}

export function isValidPhone(v) {
  const d = phoneDigits(v);
  return d.length >= 7 && d.length <= 15;
}

export function isValidEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v || '').trim());
}

export function normalizeUrl(v) {
  const s = String(v || '').trim();
  if (!s) return '';
  return /^[a-z][a-z0-9+.-]*:\/\//i.test(s) ? s : `https://${s}`;
}

export function isValidUrl(v) {
  try {
    const u = new URL(normalizeUrl(v));
    return Boolean(u.hostname && u.hostname.includes('.'));
  } catch {
    return false;
  }
}

export function isValidName(v) {
  return String(v || '').trim().length > 0;
}

/* Full-form validation. Only validates fields the user provided. */
export function validateContact(data = {}) {
  const errors = {};

  const firstName = String(data.firstName || '').trim();
  const lastName = String(data.lastName || '').trim();
  if (!firstName && !lastName) errors.firstName = 'First name is required.';
  else if (firstName.length > 60) errors.firstName = 'First name is too long (max 60).';
  if (lastName.length > 60) errors.lastName = 'Last name is too long (max 60).';

  const phone = String(data.phone || '').trim();
  if (!phone) errors.phone = 'Phone number is required.';
  else if (!isValidPhone(phone)) errors.phone = 'Enter a valid phone number (7–15 digits).';

  const altPhone = String(data.altPhone || '').trim();
  if (altPhone && !isValidPhone(altPhone)) errors.altPhone = 'Enter a valid alternate phone, or leave empty.';

  const email = String(data.email || '').trim();
  if (email && !isValidEmail(email)) errors.email = 'Enter a valid email address.';

  const website = String(data.website || '').trim();
  if (website && !isValidUrl(website)) errors.website = 'Enter a valid website URL.';

  const birthday = String(data.birthday || '').trim();
  if (birthday) {
    const d = toDate(birthday);
    if (!d) errors.birthday = 'Enter a valid date.';
    else if (d.getTime() > Date.now()) errors.birthday = 'Birthday cannot be in the future.';
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

/* Interactive field-level check (used while typing). */
export function validateField(name, value) {
  switch (name) {
    case 'firstName':
      return isValidName(value) ? '' : 'First name is required.';
    case 'phone':
      if (!String(value || '').trim()) return 'Phone number is required.';
      return isValidPhone(value) ? '' : 'Enter a valid phone number (7–15 digits).';
    case 'altPhone':
      return !String(value || '').trim() || isValidPhone(value) ? '' : 'Enter a valid alternate phone.';
    case 'email':
      return !String(value || '').trim() || isValidEmail(value) ? '' : 'Enter a valid email address.';
    case 'website':
      return !String(value || '').trim() || isValidUrl(value) ? '' : 'Enter a valid website URL.';
    case 'birthday': {
      const v = String(value || '').trim();
      if (!v) return '';
      const d = toDate(v);
      if (!d) return 'Enter a valid date.';
      return d.getTime() > Date.now() ? 'Birthday cannot be in the future.' : '';
    }
    default:
      return '';
  }
}

/*
 * Duplicate detection: matches an existing contact when phone OR email
 * is identical. `ignoreId` excludes the contact being edited.
 */
export function findPotentialDuplicates(contacts, { phone, email } = {}, ignoreId = null) {
  const p = phoneDigits(phone);
  const e = String(email || '').trim().toLowerCase();
  if (!p && !e) return [];
  const list = Array.isArray(contacts) ? contacts : [];
  return list.filter((c) => {
    if (!c || typeof c !== 'object' || c.id === ignoreId) return false;
    const phoneMatch = p && (phoneDigits(c.phone) === p || phoneDigits(c.altPhone) === p);
    const emailMatch = e && String(c.email || '').trim().toLowerCase() === e;
    return Boolean(phoneMatch || emailMatch);
  });
}

export function duplicateReason(existing, { phone, email } = {}) {
  const p = phoneDigits(phone);
  const e = String(email || '').trim().toLowerCase();
  const parts = [];
  if (p && (phoneDigits(existing.phone) === p || phoneDigits(existing.altPhone) === p)) parts.push('phone number');
  if (e && String(existing.email || '').trim().toLowerCase() === e) parts.push('email address');
  return parts.join(' and ');
}
