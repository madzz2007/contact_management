/* Smart notes for a contact — add, edit, delete with timestamps. */

import { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { timeAgo } from '../../utils/date.js';
import { uid } from '../../services/storage.js';
import { Icon } from '../ui/Icon.jsx';

export function NoteSection({ contact }) {
  const { updateContact, pushNotification, now } = useApp();
  const toast = useToast();
  const [draft, setDraft] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  const notes = Array.isArray(contact?.notes) ? contact.notes : [];
  const firstName = String(contact?.firstName || '').trim() || 'this contact';

  const syncNotes = (next) => {
    updateContact(contact.id, { notes: next });
  };

  const addNote = () => {
    const text = draft.trim();
    if (!text) return;
    syncNotes([...notes, { id: uid('nt'), text, createdAt: new Date().toISOString() }]);
    setDraft('');
    toast.success('Note added.');
    pushNotification({ type: 'info', title: 'Note added', body: `Added a note to ${firstName}'s profile.` });
  };

  const startEdit = (note) => {
    setEditingId(note.id);
    setEditText(note.text);
  };

  const saveEdit = (id) => {
    const text = editText.trim();
    if (!text) {
      syncNotes(notes.filter((n) => n.id !== id));
      setEditingId(null);
      toast.info('Note deleted (was empty).');
      return;
    }
    syncNotes(notes.map((n) => (n.id === id ? { ...n, text } : n)));
    setEditingId(null);
    toast.info('Note updated.');
  };

  const cancelEdit = () => setEditingId(null);

  const deleteNote = (id) => {
    syncNotes(notes.filter((n) => n.id !== id));
    toast.info('Note deleted.');
  };

  return (
    <section className="note-section">
      <div className="note-compose">
        <label htmlFor="note-draft" className="sr-only">New note</label>
        <textarea
          id="note-draft"
          rows={2}
          placeholder={`Add a note about ${firstName}…`}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
              e.preventDefault();
              addNote();
            }
          }}
        />
        <button type="button" className="btn btn-primary btn-sm" onClick={addNote} disabled={!draft.trim()}>
          <Icon name="plus" size={14} label="" /> Add Note
        </button>
      </div>

      {notes.length ? (
        <ul className="note-list">
          {notes.map((note) => (
            <li key={note.id} className="note-item">
              {editingId === note.id ? (
                <div className="note-edit">
                  <textarea className="note-edit-input" rows={2} value={editText} autoFocus onChange={(e) => setEditText(e.target.value)} />
                  <div className="note-edit-actions">
                    <button type="button" className="btn btn-primary btn-sm" onClick={() => saveEdit(note.id)}>Save</button>
                    <button type="button" className="btn btn-ghost btn-sm" onClick={cancelEdit}>Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="note-text">{note.text}</p>
                  <div className="note-meta">
                    <time className="muted" dateTime={note.createdAt}>{timeAgo(note.createdAt, now)}</time>
                    <button type="button" className="btn-link" onClick={() => startEdit(note)}>Edit</button>
                    <button type="button" className="btn-link btn-link-danger" onClick={() => deleteNote(note.id)}>Delete</button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="note-empty muted">No notes yet — capture context while it is fresh.</p>
      )}
    </section>
  );
}