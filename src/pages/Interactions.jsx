/* Interactions — log and browse the full communication history as a timeline. */

import { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { InteractionForm } from '../components/interactions/InteractionForm.jsx';
import { InteractionTimeline } from '../components/interactions/InteractionTimeline.jsx';
import { contactByIdMap } from '../utils/format.js';
import { INTERACTION_TYPES } from '../constants.js';
import { monthKey, toDate, diffInDays } from '../utils/date.js';

export function InteractionsPage() {
  const { interactions, contacts, removeInteraction, now } = useApp();
  const [type, setType] = useState('');
  const [contactId, setContactId] = useState('');
  const [query, setQuery] = useState('');
  const [range, setRange] = useState('all');

  const byId = useMemo(() => contactByIdMap(contacts), [contacts]);

  const list = useMemo(
    () => {
      const search = query.trim().toLowerCase();
      return interactions
        .filter((i) => {
          const contact = contacts.find((c) => c.id === i.contactId);
          const contactName = contact ? `${contact.firstName} ${contact.lastName}` : '';
          const matchesSearch = !search || `${contactName} ${i.type} ${i.note || ''}`.toLowerCase().includes(search);
          const age = toDate(i.date) ? diffInDays(toDate(i.date), now) : null;
          const matchesRange = range === 'all' || (range === 'month' && monthKey(i.date) === monthKey(now)) || (range === 'recent' && age != null && age >= 0 && age <= 30);
          return matchesSearch && (!type || i.type === type) && (!contactId || i.contactId === contactId) && matchesRange;
        })
        .sort((a, b) => `${b.date || ''}T${b.time || ''}`.localeCompare(`${a.date || ''}T${a.time || ''}`));
    },
    [interactions, contacts, type, contactId, query, range, now],
  );

  const thisMonth = interactions.filter((i) => monthKey(i.date) === monthKey(now)).length;
  const contactsTouched = new Set(interactions.map((i) => i.contactId)).size;

  return (
    <section className="page interactions-page">
      <div className="page-head">
        <div>
          <h1>Interactions</h1>
          <p className="page-sub muted">{thisMonth} logged this month · {contactsTouched} people reached</p>
        </div>
      </div>

      <div className="interaction-compose card card-pad">
        <h3>Log an interaction</h3>
        <InteractionForm contacts={contacts} compact={false} />
      </div>

      <div className="interaction-controls">
        <label className="sr-only" htmlFor="ix-search">Search interactions</label>
        <input id="ix-search" className="ct-search-input ix-search" type="search" placeholder="Search notes or people…" value={query} onChange={(e) => setQuery(e.target.value)} />
        <label className="sr-only" htmlFor="ix-range">Interaction date range</label>
        <select id="ix-range" className="ct-select" value={range} onChange={(e) => setRange(e.target.value)}>
          <option value="all">All time</option>
          <option value="month">This month</option>
          <option value="recent">Last 30 days</option>
        </select>
        <label className="sr-only" htmlFor="ix-type">Filter by type</label>
        <select id="ix-type" className="ct-select" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">All types</option>
          {INTERACTION_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <label className="sr-only" htmlFor="ix-contact">Filter by contact</label>
        <select id="ix-contact" className="ct-select" value={contactId} onChange={(e) => setContactId(e.target.value)}>
          <option value="">Everyone</option>
          {contacts.map((c) => <option key={c.id} value={c.id}>{`${c.firstName} ${c.lastName}`.trim() || 'Unnamed'}</option>)}
        </select>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => { setQuery(''); setRange('all'); setType(''); setContactId(''); }}>Reset</button>
        <span className="ct-count muted">{list.length} shown · {thisMonth} this month</span>
      </div>

      <InteractionTimeline items={list} contactsById={byId} now={now} onDelete={(iid) => removeInteraction(iid)} />
    </section>
  );
}