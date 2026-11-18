/* Form for adding an important date (birthday, anniversary, meeting, custom). */

import { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { EVENT_TYPES } from '../../constants.js';
import { todayISO, toISODate, toDate } from '../../utils/date.js';

export function EventForm({ contacts, defaultContactId = '', onDone }) {
  const { addEvent, pushNotification } = useApp();
  const toast = useToast();
  const [data, setData] = useState({
    contactId: defaultContactId,
    name: '',
    type: 'Birthday',
    date: todayISO(),
    notes: '',
  });
  const [error, setError] = useState('');

  const set = (key, value) => setData((prev) => ({ ...prev, [key]: value }));

  const submit = (e) => {
    e.preventDefault();
    const dateStr = toISODate(toDate(data.date));
    if (!dateStr) {
      setError('Pick a valid date.');
      return;
    }
    let name = String(data.name || '').trim();
    const contact = (Array.isArray(contacts) ? contacts : []).find((c) => c.id === data.contactId);
    if (!name && contact) name = `${contact.firstName} ${contact.lastName}`.trim();
    if (!name && !contact) {
      setError('Give the event a name (or link a contact).');
      return;
    }
    const item = addEvent({ ...data, name, date: dateStr });
    if (!item) {
      setError('Could not save that date.');
      return;
    }
    toast.success('Event saved.');
    pushNotification({ type: 'event', title: name, body: `Added to your calendar · ${dateStr}` });
    setError('');
    if (onDone) onDone();
    else setData({ contactId: defaultContactId, name: '', type: 'Birthday', date: todayISO(), notes: '' });
  };

  return (
    <form className="event-form" onSubmit={submit}>
      <div className="evf-row">
        <label className="sr-only" htmlFor="ef-contact">Linked contact</label>
        <select id="ef-contact" value={data.contactId} onChange={(e) => set('contactId', e.target.value)}>
          <option value="">No contact</option>
          {(Array.isArray(contacts) ? contacts : []).map((c) => (
            <option key={c.id} value={c.id}>{`${c.firstName} ${c.lastName}`.trim() || 'Unnamed'}</option>
          ))}
        </select>

        <label className="sr-only" htmlFor="ef-name">Event name</label>
        <input id="ef-name" placeholder="Event name (e.g. Priya’s Birthday)" value={data.name} onChange={(e) => set('name', e.target.value)} />

        <label className="sr-only" htmlFor="ef-type">Event type</label>
        <select id="ef-type" value={data.type} onChange={(e) => set('type', e.target.value)}>
          {EVENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>

        <label className="sr-only" htmlFor="ef-date">Date</label>
        <input id="ef-date" type="date" value={data.date} onChange={(e) => set('date', e.target.value)} />

        <label className="sr-only" htmlFor="ef-notes">Notes</label>
        <input id="ef-notes" placeholder="Optional notes…" value={data.notes} onChange={(e) => set('notes', e.target.value)} />

        <button type="submit" className="btn btn-primary btn-sm">Add</button>
      </div>
      {error ? <p className="if-error" role="alert">{error}</p> : null}
    </form>
  );
}