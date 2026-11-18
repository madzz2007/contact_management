/* Compact form for logging an interaction (reused on several pages). */

import { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { INTERACTION_TYPES } from '../../constants.js';
import { todayISO } from '../../utils/date.js';

export function InteractionForm({ contacts, defaultContactId = '', defaultNote = '', onDone, compact = true }) {
  const { addInteraction, pushNotification } = useApp();
  const toast = useToast();
  const [data, setData] = useState({
    contactId: defaultContactId,
    type: 'Phone Call',
    date: todayISO(),
    time: '12:00',
    note: defaultNote,
  });
  const [error, setError] = useState('');

  const set = (key, value) => setData((prev) => ({ ...prev, [key]: value }));

  const submit = (e) => {
    e.preventDefault();
    if (!data.contactId) {
      setError('Choose a contact.');
      return;
    }
    if (!data.date) {
      setError('Pick a date.');
      return;
    }
    const item = addInteraction(data);
    if (!item) {
      setError('Could not save that interaction.');
      return;
    }
    toast.success('Interaction logged.');
    const contact = (Array.isArray(contacts) ? contacts : []).find((c) => c.id === data.contactId);
    pushNotification({
      type: 'info',
      title: 'Interaction recorded',
      body: `${contact ? `${contact.firstName} ${contact.lastName}`.trim() : 'Contact'} · ${data.type}`,
    });
    setError('');
    if (onDone) {
      onDone();
    } else {
      setData({ ...data, note: '', time: '' });
    }
  };

  return (
    <form className={`interaction-form${compact ? '' : ' wide'}`} onSubmit={submit}>
      <>
        <label className="sr-only" htmlFor="if-contact">Contact</label>
        <select id="if-contact" value={data.contactId} onChange={(e) => set('contactId', e.target.value)}>
          <option value="">Choose a contact…</option>
          {(Array.isArray(contacts) ? contacts : []).map((c) => (
            <option key={c.id} value={c.id}>{`${c.firstName} ${c.lastName}`.trim() || 'Unnamed'}</option>
          ))}
        </select>

        <label className="sr-only" htmlFor="if-type">Interaction type</label>
        <select id="if-type" value={data.type} onChange={(e) => set('type', e.target.value)}>
          {INTERACTION_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>

        <label className="sr-only" htmlFor="if-date">Date</label>
        <input id="if-date" type="date" value={data.date} onChange={(e) => set('date', e.target.value)} />

        <label className="sr-only" htmlFor="if-time">Time</label>
        <input id="if-time" type="time" value={data.time} onChange={(e) => set('time', e.target.value)} />

        <label className="sr-only" htmlFor="if-note">Short description</label>
        <input
          id="if-note"
          className="if-note-input"
          placeholder="Short description…"
          value={data.note}
          onChange={(e) => set('note', e.target.value)}
        />
        <button type="submit" className="btn btn-primary btn-sm">Log</button>
      </>
      {error ? <p className="if-error" role="alert">{error}</p> : null}
    </form>
  );
}