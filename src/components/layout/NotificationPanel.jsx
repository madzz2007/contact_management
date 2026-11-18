/* Notification panel — data-driven alerts (birthdays, events, follow-ups,
 * incomplete profiles) merged with the stored activity feed. */

import { useMemo } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { computeCompleteness } from '../../utils/completeness.js';
import { getLastInteractionForContact } from '../../services/interactionService.js';
import { daysUntilNext, diffInDays, toDate, formatMonthDay, timeAgo } from '../../utils/date.js';
import { FOLLOW_UP_DAYS, SOON_DAYS } from '../../constants.js';
import { Icon } from '../ui/Icon.jsx';

const ALERT_ICONS = { birthday: 'star', event: 'calendar', followup: 'message', incomplete: 'alert' };
const ACTIVITY_ICONS = { success: 'check', contact: 'plus', event: 'calendar', warning: 'alert', info: 'info' };

function buildAlerts({ contacts, events, now, settings }) {
  const alerts = [];
  const notify = settings?.notify || {};
  const contactList = Array.isArray(contacts) ? contacts : [];
  const eventList = Array.isArray(events) ? events : [];
  if (notify.birthdays) {
    for (const c of contactList) {
      if (!c.birthday) continue;
      const days = daysUntilNext(c.birthday, now);
      if (days === null || days > SOON_DAYS) continue;
      alerts.push({
        kind: 'birthday',
        title: `Birthday — ${c.firstName} ${c.lastName}`,
        body: days === 0 ? 'Today!' : `In ${days} day${days === 1 ? '' : 's'}`,
      });
    }
  }
  if (notify.events) {
    for (const e of eventList) {
      const d = toDate(e.date);
      if (!d) continue;
      const days = diffInDays(now, d);
      if (days < 0 || days > SOON_DAYS) continue;
      alerts.push({
        kind: 'event',
        title: e.name,
        body: days === 0 ? 'Today' : `${formatMonthDay(e.date)} · in ${days} day${days === 1 ? '' : 's'}`,
      });
    }
  }
  if (notify.followUps) {
    for (const c of contactList) {
      const last = getLastInteractionForContact(c.id);
      if (!last) continue;
      const when = toDate(last.date);
      if (!when) continue;
      const days = diffInDays(when, now);
      if (days < FOLLOW_UP_DAYS) continue;
      alerts.push({
        kind: 'followup',
        title: `Follow up with ${c.firstName || 'this contact'}`,
        body: `Last contacted ${days} day${days === 1 ? '' : 's'} ago`,
      });
    }
  }
  if (notify.incomplete) {
    for (const c of contactList) {
      if (computeCompleteness(c).percent < 50) {
        alerts.push({
          kind: 'incomplete',
          title: 'Incomplete profile',
          body: `${c.firstName || 'A contact'} is missing a few details.`,
        });
      }
    }
  }
  return alerts.slice(0, 8);
}

export function NotificationPanel({ open, onClose: _onClose }) {
  const { contacts, events, now, settings, activity, markAllRead, clearAllNotifications } = useApp();
  const activityList = Array.isArray(activity) ? activity : [];

  const alerts = useMemo(
    () => buildAlerts({ contacts, events, now, settings }),
    [contacts, events, now, settings],
  );

  if (!open) return null;
  return (
    <div className="notif-panel" role="dialog" aria-label="Notifications">
      <div className="notif-head">
        <h4>Notifications</h4>
        <div className="notif-actions">
          <button type="button" className="btn-link" onClick={markAllRead}>
            Mark all read
          </button>
          <button type="button" className="btn-link btn-link-danger" onClick={clearAllNotifications}>
            Clear
          </button>
        </div>
      </div>

      {alerts.length ? (
        <>
          <div className="notif-section-title">Reminders</div>
          <ul className="notif-list">
            {alerts.map((a) => (
              <li key={`a-${alerts.indexOf(a)}`} className="notif-item">
                <Icon name={ALERT_ICONS[a.kind]} size={15} label="" />
                <span>
                  <strong>{a.title}</strong>
                  <em>{a.body}</em>
                </span>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="notif-empty">You are all caught up 🎉 No pending reminders.</p>
      )}

      <div className="notif-section-title">Activity</div>
      {activityList.length ? (
        <ul className="notif-list">
          {activityList.slice(0, 12).map((a) => (
            <li key={a.id} className={`notif-item${a.read ? '' : ' unread'}`}>
              <Icon name={ACTIVITY_ICONS[a.type] || 'info'} size={15} label="" />
              <span>
                <strong>{a.title}</strong>
                {a.body ? <em>{a.body}</em> : null}
                <time>{timeAgo(a.createdAt, now)}</time>
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="notif-empty">Actions you take will appear here.</p>
      )}
    </div>
  );
}