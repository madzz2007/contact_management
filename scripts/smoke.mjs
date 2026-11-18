/*
 * Smoke tests for the pure logic modules (no DOM/localStorage needed).
 * Run with:  node scripts/smoke.mjs
 */

import {
  isValidPhone, isValidEmail, validateContact, findPotentialDuplicates, phoneDigits,
} from '../src/utils/validation.js';
import {
  toDate, toISODate, daysUntilNext, eventBucket, timeAgo, formatTime, nextOccurrence, monthKey,
} from '../src/utils/date.js';
import {
  computeCompleteness, contactHealthOverview, healthBucket,
} from '../src/utils/completeness.js';
import { contactsToCsv, parseCsv, csvToContacts } from '../src/utils/csv.js';
import { buildVCard, vCardFilename } from '../src/utils/vcard.js';
import { searchContacts } from '../src/utils/search.js';
import { telHref, mailtoHref, waHref, mapsHref, websiteHref } from '../src/utils/share.js';
import { formatBytes } from '../src/services/storage.js';

let pass = 0;
let fail = 0;
const t = (name, cond) => {
  if (cond) {
    pass += 1;
  } else {
    fail += 1;
    console.log('FAIL:', name);
  }
};

/* ------------------------------ validation ------------------------------ */
t('valid phone', isValidPhone('+91 98450 12345'));
t('invalid short phone', !isValidPhone('123'));
t('valid email', isValidEmail('a.b@example.com'));
t('invalid email', !isValidEmail('no-at-sign'));
t('contact requires name+phone', !validateContact({}).valid);
t('valid contact passes', validateContact({ firstName: 'Aarav', phone: '+91 98450 12345', email: 'a@b.co' }).valid);
t('bad email caught', validateContact({ firstName: 'A', phone: '+91 98450 12345', email: 'bad' }).errors.email !== undefined);
t('future birthday caught', validateContact({ firstName: 'A', phone: '12345678', birthday: '2999-01-01' }).errors.birthday !== undefined);
t('future birthday message', validateContact({ firstName: 'A', phone: '12345678', birthday: '2999-01-01' }).errors.birthday === 'Birthday cannot be in the future.');
t('bad website caught', validateContact({ firstName: 'A', phone: '12345678', website: 'http://' }).errors.website !== undefined);
const dupes = findPotentialDuplicates([{ id: '1', phone: '+91 98450 12345', email: 'x@y.co' }], { phone: '+919845012345' });
t('duplicate by digits', dupes.length === 1);
t('duplicate by email', findPotentialDuplicates([{ id: '1', email: 'X@Y.co' }], { email: 'x@y.co' }).length === 1);
t('no self-duplicate when editing', findPotentialDuplicates([{ id: '1', phone: '12345678' }], { phone: '12345678' }, '1').length === 0);
t('digits stripped', phoneDigits('+91 98450-12345') === '919845012345');

/* -------------------------------- dates --------------------------------- */
const d = toDate('2026-09-20');
t('iso parse', Boolean(d) && d.getFullYear() === 2026 && d.getMonth() === 8 && d.getDate() === 20);
t('toISODate', toISODate(new Date(2026, 8, 11)) === '2026-09-11');
t('invalid date null', toDate('not-a-date') === null);
t('empty date null', toDate('') === null);
const now = new Date(2026, 8, 11); /* 11 Sep 2026 */
t('days until birthday', daysUntilNext('1998-09-20', now) === 9);
t('past birthday wraps to next year', daysUntilNext('1990-01-25', now) > 100);
t('bucket today', eventBucket('2026-09-11', now) === 'today');
t('bucket week', eventBucket('2026-09-15', now) === 'week');
t('bucket later', eventBucket('2026-10-15', now) === 'later');
t('bucket past', eventBucket('2026-08-01', now) === 'past');
t('timeAgo days', timeAgo('2026-09-09', now) === '2 days ago');
t('timeAgo weeks', timeAgo('2026-08-28', now) === '2 weeks ago');
t('formatTime pm', formatTime('14:05') === '2:05 PM');
t('formatTime am', formatTime('00:30') === '12:30 AM');
t('nextOccurrence returns date', nextOccurrence('1998-09-20', now) instanceof Date);
t('monthKey', monthKey('2026-09-11') === '2026-09');

/* ----------------------------- completeness ----------------------------- */
const full = {
  firstName: 'A', phone: '12345678', altPhone: '12345679', lastName: 'B',
  email: 'a@b.co', company: 'C', jobTitle: 'D', relationship: 'Friend',
  address: 'X', city: 'Y', website: 'e.com', birthday: '1990-01-01',
  tags: ['t'], notes: [{ text: 'n' }], photo: 'data:x',
};
const minimal = { firstName: 'A', phone: '99999999' };
t('complete profile = 100%', computeCompleteness(full).percent === 100);
t('minimal profile below 50%', computeCompleteness(minimal).percent < 50);
t('missing list correct', computeCompleteness(minimal).missing.includes('Email') && computeCompleteness(minimal).missing.includes('Birthday'));
const overview = contactHealthOverview([full, minimal]);
t('health overview buckets', overview.complete === 1 && overview.needsInfo === 1);
t('health buckets', healthBucket(85).id === 'complete' && healthBucket(60).id === 'mostly' && healthBucket(30).id === 'needs-info');
t('null contact safe', computeCompleteness(null).percent === 0);

/* --------------------------------- csv ----------------------------------- */
const csv = contactsToCsv([full]);
t('csv header', csv.startsWith('FirstName,LastName'));
const rows = parseCsv(csv);
t('csv rows parsed', rows.length === 2 && rows[0][0] === 'FirstName');
const quoted = parseCsv('a,"b,1","c""x""",\n1,2,3');
t('csv quotes + commas', quoted[0][1] === 'b,1' && quoted[0][2] === 'c"x"');
const importOk = csvToContacts(csv, []);
t('import valid rows', importOk.imported.length === 1 && importOk.error === null);
const dupImport = csvToContacts(csv, [full]);
t('import duplicate skipped', dupImport.imported.length === 0 && dupImport.duplicates.length === 1);
const badImport = csvToContacts('FirstName,LastName,Phone,Email\n\nJane,,jane@x.co\nJohn,Doe,abc,not-an-email\n', []);
t('import invalid rows reported', badImport.invalid.length === 2 && badImport.imported.length === 0);
t('import empty file errors', Boolean(csvToContacts('', []).error));
t('import unknown header errors', Boolean(csvToContacts('Foo,Bar\n1,2', []).error));

/* -------------------------------- vcard ---------------------------------- */
const vcf = buildVCard(full);
t('vcard begin/end', vcf.startsWith('BEGIN:VCARD') && vcf.includes('END:VCARD'));
t('vcard FN', vcf.includes('FN:A B'));
t('vcard TEL', vcf.includes('TEL;TYPE=CELL:12345678'));
t('vcard escaping', buildVCard({ firstName: 'A;B', lastName: 'C', phone: '1' }).includes('A\\;B'));
t('vcard birthday', vcf.includes('BDAY:1990-01-01'));
t('vcard filename', vCardFilename(full) === 'a-b.vcf');

/* -------------------------------- search --------------------------------- */
const people = [full, minimal];
t('search by name', searchContacts(people, 'a').length >= 1);
t('search by phone', searchContacts(people, '12345678').length === 1);
t('search by company', searchContacts(people, 'C').length === 1);
t('search blank is empty', searchContacts(people, '   ').length === 0);
t('search null-safe', searchContacts([null, undefined], 'a').length === 0);

/* ------------------------------ share links ------------------------------ */
t('tel href', telHref('+91 98450 12345') === 'tel:919845012345');
t('empty tel safe', telHref('') === '#');
t('mailto', mailtoHref('a@b.co') === 'mailto:a@b.co');
t('whatsapp link', waHref('+44 7700 900123') === 'https://wa.me/447700900123');
t('maps link', mapsHref(full).startsWith('https://www.google.com/maps/search/?api=1&query='));
t('website normalized', websiteHref('example.com') === 'https://example.com');

/* ------------------------------- storage fs ------------------------------ */
t('formatBytes KB', formatBytes(2048) === '2 KB');
t('formatBytes zero', formatBytes(0) === '0 KB');

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);