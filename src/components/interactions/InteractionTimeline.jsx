/* Interaction history rendered as a timeline, grouped by month. */

import { formatDate, formatTime, monthKey } from '../../utils/date.js';
import { INTERACTION_ICONS } from '../../constants.js';
import { Icon } from '../ui/Icon.jsx';
import { ContactAvatar } from '../contacts/ContactAvatar.jsx';

export function InteractionTimeline({ items, contactsById, onDelete, showContact = true }) {
  const list = Array.isArray(items) ? items.filter((i) => i && typeof i === 'object') : [];
  if (list.length === 0) {
    return <p className="timeline-empty muted">No interactions recorded yet.</p>;
  }

  const groups = [];
  const index = new Map();
  for (const item of list) {
    const key = monthKey(item.date) || 'Unknown';
    if (!index.has(key)) {
      index.set(key, groups.length);
      groups.push({ key, items: [] });
    }
    groups[index.get(key)].items.push(item);
  }

  return (
    <div className="timeline">
      {groups.map((group) => (
        <div key={group.key} className="tl-group">
          <div className="tl-month">{group.key}</div>
          <ul className="tl-list">
            {group.items.map((item) => (
              <li key={item.id} className="tl-item">
                <span className="tl-dot" aria-hidden="true" />
                <div className="tl-body">
                  <div className="tl-head">
                    <Icon name={INTERACTION_ICONS[item.type] || 'note'} size={15} label="" />
                    <strong>{item.type}</strong>
                    <time className="muted" dateTime={item.date}>
                      {formatDate(item.date)}
                      {item.time ? ` · ${formatTime(item.time)}` : ''}
                    </time>
                    {onDelete ? (
                      <button type="button" className="tl-delete" aria-label="Delete interaction" onClick={() => onDelete(item.id)}>
                        <Icon name="trash" size={13} label="" />
                      </button>
                    ) : null}
                  </div>
                  {item.note ? <p className="tl-note">“{item.note}”</p> : null}
                  {showContact && contactsById && contactsById[item.contactId] ? (
                    <span className="tl-contact">
                      with
                      <ContactAvatar contact={contactsById[item.contactId]} size={18} className="tl-avatar" />
                      {`${contactsById[item.contactId].firstName} ${contactsById[item.contactId].lastName}`.trim()}
                    </span>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}