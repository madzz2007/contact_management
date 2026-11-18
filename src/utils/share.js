/* Builders for actionable contact links (tel:, sms:, mailto:, WhatsApp, Maps, Web). */

import { phoneDigits, normalizeUrl } from './validation.js';

export function telHref(phone) {
  const d = phoneDigits(phone);
  return d ? `tel:${d}` : '#';
}

export function smsHref(phone) {
  const d = phoneDigits(phone);
  return d ? `sms:${d}` : '#';
}

export function mailtoHref(email) {
  const s = String(email || '').trim();
  return s ? `mailto:${s}` : '#';
}

export function waHref(phone) {
  const d = phoneDigits(phone);
  return d ? `https://wa.me/${d}` : '';
}

export function mapsHref(contact) {
  if (!contact) return '';
  const query = [contact.address, contact.city, contact.state, contact.country]
    .map((v) => String(v || '').trim())
    .filter(Boolean)
    .join(', ');
  return query ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}` : '';
}

export function websiteHref(url) {
  const n = normalizeUrl(url);
  return n || '#';
}

export function fullAddress(contact) {
  return [contact?.address, contact?.city, contact?.state, contact?.country]
    .map((v) => String(v || '').trim())
    .filter(Boolean)
    .join(', ');
}

export function contactSummaryLines(c) {
  const lines = [];
  lines.push(`${String(c?.firstName || '')} ${String(c?.lastName || '')}`.trim());
  const role = [String(c?.jobTitle || '').trim(), String(c?.company || '').trim()].filter(Boolean).join(' · ');
  if (role) lines.push(role);
  if (String(c?.phone || '').trim()) lines.push(`Phone: ${c.phone}`);
  if (String(c?.email || '').trim()) lines.push(`Email: ${c.email}`);
  const location = fullAddress(c);
  if (location) lines.push(`Location: ${location}`);
  if (String(c?.website || '').trim()) lines.push(`Web: ${c.website}`);
  return lines;
}

export function contactSummaryText(c) {
  return contactSummaryLines(c).join('\n');
}

export function canWebShare() {
  return typeof navigator !== 'undefined' && typeof navigator.share === 'function';
}

/* Returns true when the OS share sheet opened successfully. */
export async function shareToDevice(c) {
  if (!canWebShare()) return false;
  try {
    await navigator.share({
      title: `${String(c?.firstName || '')} ${String(c?.lastName || '')}`.trim() || 'Contact',
      text: contactSummaryText(c),
      url: typeof window !== 'undefined' ? window.location.href : undefined,
    });
    return true;
  } catch {
    return false;
  }
}
