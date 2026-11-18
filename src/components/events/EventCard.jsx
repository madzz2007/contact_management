/* Event card — date block, emoji, name, linked contact, notes, delete. */

import { formatMonthDay, diffInDays, toDate } from '../../utils/date.js';
import { EVENT_EMOJI } from '../../constants.js';
import { Icon } from '../ui/Icon.jsx';
import { ContactAvatar } from '../contacts/ContactAvatar.jsx';

export function EventCard({ event, contact, now, onDelete }) {
  if (!event) return null;
  const emoji = EVENT_EMOJI[event.type] || '⭐';
  const name = event.name || 'Important date';
  const d = toDate(event.date);
  const days = d && now ? diffInDays(now, d) : null;
  const dayLabel = d ? formatMonthDay(event.date) : '';
  const contactName = contact ? `${contact.firstName} ${contact.lastName}`.trim() : null;

  return (
    <article className="event-card">
      <div className="ev-date" aria-hidden="true">
        {d ? <><strong>{d.getDate()}</strong><span>{['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][d.getMonth()].slice(0, 3)}</span></> : <span>—</span>}
      </div>
      <div className="ev-body">
        <div className="ev-title">
          <span className="ev-emoji" aria-hidden="true">{emoji}</span>
          <strong>{name}</strong>
          <span className="ev-type muted">{event.type}</span>
          {days !== null ? (
            days === 0 ? <span className="ev-badge ev-badge-today">Today</span>
            : days < 0 ? <span className="ev-badge ev-badge-past">Past</span>
            : <span className="ev-badge">{`in ${days} day${days === 1 ? '' : 's'}`}</span>
          ) : null}
        </div>
        {event.notes ? <p className="ev-notes muted">{event.notes}</p> : null}
        {contactName || contact ? (
          <span className="ev-contact">
            <ContactAvatar contact={contact} size={18} className="tl-avatar" />
            {dayLabel ? <span className="muted">{dayLabel} · </span> : null}
            {contactName || 'Contact'}
          </span>
        ) : null}
      </div>
      {onDelete ? (
        <button type="button" className="ev-delete" aria-label={`Delete event ${name}`} onClick={() => onDelete(event.id)}>
          <Icon name="trash" size={14} label="" />
        </button>
      ) : null}
    </article>
  );
}