/* Events — important dates bucketed into Today / This Week / Later / Past. */

import { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { EventForm } from '../components/events/EventForm.jsx';
import { EventCard } from '../components/events/EventCard.jsx';
import { EmptyState } from '../components/ui/EmptyState.jsx';
import { contactByIdMap } from '../utils/format.js';
import { eventBucket, diffInDays, toDate } from '../utils/date.js';
import { EVENT_TYPES } from '../constants.js';

const SECTIONS = [
  { bucket: 'today', label: 'Today', emoji: '✨' },
  { bucket: 'week', label: 'This Week', emoji: '🗓️' },
  { bucket: 'later', label: 'Later', emoji: '🌅' },
  { bucket: 'past', label: 'Past', emoji: '🕰️' },
];

export function EventsPage() {
  const { events, contacts, removeEvent, now } = useApp();
  const [type, setType] = useState('');
  const [query, setQuery] = useState('');
  const [scope, setScope] = useState('all');

  const byId = useMemo(() => contactByIdMap(contacts), [contacts]);
  const list = useMemo(() => {
    const search = query.trim().toLowerCase();
    return events
      .filter((event) => {
        const contact = byId[event.contactId];
        const contactName = contact ? `${contact.firstName} ${contact.lastName}` : '';
        const days = toDate(event.date) ? diffInDays(now, toDate(event.date)) : null;
        const matchesSearch = !search || `${event.name} ${event.notes || ''} ${contactName}`.toLowerCase().includes(search);
        const matchesScope = scope === 'all' || (scope === 'upcoming' && days != null && days >= 0) || (scope === 'past' && days != null && days < 0);
        return matchesSearch && (!type || event.type === type) && matchesScope;
      })
      .sort((a, b) => String(a.date || '').localeCompare(String(b.date || '')));
  }, [events, byId, type, query, scope, now]);
  const todayCount = events.filter((event) => toDate(event.date) && diffInDays(now, toDate(event.date)) === 0).length;
  const weekCount = events.filter((event) => {
    const days = toDate(event.date) ? diffInDays(now, toDate(event.date)) : null;
    return days != null && days >= 0 && days <= 7;
  }).length;
  const pastCount = events.filter((event) => toDate(event.date) && diffInDays(now, toDate(event.date)) < 0).length;

  return (
    <section className="page events-page">
      <div className="page-head">
        <div>
          <h1>Important Dates</h1>
          <p className="page-sub muted">Birthdays, anniversaries and meetings — nothing slips past again.</p>
        </div>
      </div>

      <div className="event-tools">
        <label className="sr-only" htmlFor="ev-search">Search important dates</label>
        <input id="ev-search" className="ct-search-input" type="search" placeholder="Search events, notes or people…" value={query} onChange={(e) => setQuery(e.target.value)} />
        <label className="sr-only" htmlFor="ev-scope">Event date scope</label>
        <select id="ev-scope" className="ct-select" value={scope} onChange={(e) => setScope(e.target.value)}>
          <option value="all">All dates</option>
          <option value="upcoming">Upcoming</option>
          <option value="past">Past</option>
        </select>
        <label className="sr-only" htmlFor="ev-type">Filter events by type</label>
        <select id="ev-type" className="ct-select" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">All types</option>
          {EVENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => { setQuery(''); setScope('all'); setType(''); }}>Reset</button>
      </div>
      <div className="event-summary" aria-label="Event summary">
        <span><strong>{todayCount}</strong> today</span>
        <span><strong>{weekCount}</strong> next 7 days</span>
        <span><strong>{pastCount}</strong> past</span>
        <span className="muted">{list.length} shown</span>
      </div>

      <div className="interaction-compose card card-pad">
        <h3>Add an important date</h3>
        <EventForm contacts={contacts} />
      </div>

      {list.length === 0 ? (
        <EmptyState
          icon="calendar"
          title="No important dates yet"
          subtitle="Add birthdays, anniversaries or meetings above and they will count down for you."
        />
      ) : (
        SECTIONS.map(({ bucket, label, emoji }) => {
          const items = list.filter((e) => eventBucket(e.date, now) === bucket);
          if (!items.length) return null;
          return (
            <section key={bucket} className={`ev-section ev-section-${bucket}`}>
              <h2><span aria-hidden="true">{emoji}</span> {label} <span className="muted">({items.length})</span></h2>
              <div className="ev-list">
                {items.map((e) => (
                  <EventCard key={e.id} event={e} contact={byId[e.contactId]} now={now} onDelete={(eid) => removeEvent(eid)} />
                ))}
              </div>
            </section>
          );
        })
      )}
    </section>
  );
}