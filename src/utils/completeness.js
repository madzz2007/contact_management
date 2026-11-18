const FIELDS = [
  ['phone', 'Phone'],
  ['email', 'Email'],
  ['company', 'Company'],
  ['jobTitle', 'Job title'],
  ['address', 'Address'],
  ['birthday', 'Birthday'],
];

export function computeCompleteness(contact) {
  const present = FIELDS.filter(([field]) => String(contact?.[field] || '').trim()).length;
  const percent = Math.round((present / FIELDS.length) * 100);
  return { percent, missing: FIELDS.filter(([field]) => !String(contact?.[field] || '').trim()).map(([, label]) => label) };
}

export function healthBucket(percent) {
  if (percent >= 80) return { id: 'complete', label: 'Complete', tone: 'ok' };
  if (percent >= 50) return { id: 'mostly', label: 'Mostly complete', tone: 'warn' };
  return { id: 'needs-info', label: 'Needs information', tone: 'danger' };
}

export function contactHealthOverview(contacts) {
  const overview = { complete: 0, mostly: 0, needsInfo: 0 };
  (Array.isArray(contacts) ? contacts : []).forEach((contact) => {
    const id = healthBucket(computeCompleteness(contact).percent).id;
    overview[id === 'needs-info' ? 'needsInfo' : id] += 1;
  });
  return overview;
}
