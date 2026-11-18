/* Dashboard — overview: statistics, quick actions, recent activity,
 * upcoming dates, relationship overview, recently viewed, contact health. */

import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { StatCard } from '../components/ui/StatCard.jsx';
import { EmptyState } from '../components/ui/EmptyState.jsx';
import { ContactAvatar } from '../components/contacts/ContactAvatar.jsx';
import { Icon } from '../components/ui/Icon.jsx';
import { computeCompleteness, contactHealthOverview } from '../utils/completeness.js';
import { monthKey, toDate, diffInDays, nextOccurrence, formatMonthDay, timeAgo } from '../utils/date.js';
import { PEOPLE_GROUPS, DEMO_USER } from '../constants.js';
import { getLastInteractionForContact } from '../services/interactionService.js';
import { fullName } from '../utils/format.js';

function MiniContact({ contact, subtitle }) {
  if (!contact) return null;
  return (
    <Link to={`/contacts/${contact.id}`} className="mini-contact">
      <ContactAvatar contact={contact} size={30} />
      <span className="mc-text">
        <strong>{fullName(contact)}</strong>
        <em className="muted">{subtitle}</em>
      </span>
      <Icon name="chevronRight" size={13} label="" />
    </Link>
  );
}

export function Dashboard() {
  const {
    contacts = [],
    interactions = [],
    events = [],
    now = new Date(),
    recent = [],
    getContactById,
  } = useApp();

  const total = contacts.length;
  const favorites = contacts.filter((c) => c.favorite).length;
  const addedThisMonth = contacts.filter((c) => monthKey(c.createdAt) === monthKey(now)).length;
  const interacted = new Set(interactions.map((i) => i.contactId)).size;
  const upcomingEvents = events.filter((e) => {
    const d = toDate(e.date);
    if (!d) return false;
    const days = diffInDays(now, d);
    return days >= 0 && days <= 30;
  }).length;
  const incomplete = contacts.filter((c) => computeCompleteness(c).percent < 50).length;

  const lastMap = useMemo(() => {
    const map = {};
    for (const c of contacts) map[c.id] = getLastInteractionForContact(c.id);
    return map;
  }, [contacts]);

  const recentContacts = [...contacts].sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || ''))).slice(0, 5);

  const recentlyContacted = contacts
    .map((c) => ({ contact: c, last: lastMap[c.id] }))
    .filter((x) => x.last)
    .sort((a, b) => String(b.last.date || '').localeCompare(String(a.last.date || '')))
    .slice(0, 5);

  const upcomingDates = useMemo(() => {
    const merged = [];
    for (const e of events) {
      const d = toDate(e.date);
      if (!d) continue;
      const days = diffInDays(now, d);
      if (days < 0 || days > 45) continue;
      merged.push({
        id: `e-${e.id}`,
        kind: 'event',
        label: e.name,
        date: d,
        days,
        link: e.contactId ? `/contacts/${e.contactId}` : '/events',
      });
    }
    for (const c of contacts) {
      if (!c.birthday) continue;
      const next = nextOccurrence(c.birthday, now);
      if (!next) continue;
      const days = diffInDays(now, next);
      if (days < 0 || days > 45) continue;
      merged.push({
        id: `b-${c.id}`,
        kind: 'birthday',
        label: `${fullName(c)}${`'s birthday`}`,
        date: next,
        days,
        link: `/contacts/${c.id}`,
      });
    }
    merged.sort((a, b) => a.days - b.days);
    return merged.slice(0, 6);
  }, [events, contacts, now]);

  const health = contactHealthOverview(contacts);
  const recentItems = (Array.isArray(recent) ? recent : []).map((id) => getContactById(id)).filter(Boolean).slice(0, 8);
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const todayLabel = now.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' });
  const relCounts = PEOPLE_GROUPS.map((g) => ({ group: g, count: contacts.filter((c) => g.relationships.includes(c.relationship)).length }));

  return (
    <section className="page dashboard">
      <div className="page-head">
        <div>
          <h1>{`${greeting}, ${DEMO_USER.name.split(' ')[0]}`}</h1>
          <p className="page-sub muted">{todayLabel} — here is what is happening in your circle.</p>
        </div>
        <Link to="/contacts/add" className="btn btn-primary">
          <Icon name="plus" size={15} label="" /> Add Contact
        </Link>
      </div>

      <div className="stat-grid">
        <StatCard icon="contacts" label="Total Contacts" value={total} sub="in your directory" />
        <StatCard icon="star" label="Favorites" value={favorites} tone="warn" />
        <StatCard icon="calendar" label="Added This Month" value={addedThisMonth} tone="info" />
        <StatCard icon="users" label="People You Reached" value={interacted} sub="with logged interactions" tone="ok" />
        <StatCard icon="bell" label="Upcoming Events" value={upcomingEvents} sub="in the next 30 days" tone="warn" />
        <StatCard icon="alert" label="Incomplete Profiles" value={incomplete} sub="below 50% complete" tone="danger" />
      </div>

      <h2 className="section-title">Quick actions</h2>
      <div className="quick-grid">
        <Link to="/contacts/add" className="quick-card">
          <Icon name="plus" size={20} label="" />
          <span><strong>Add Contact</strong><em className="muted">Start a new entry</em></span>
        </Link>
        <Link to="/contacts" className="quick-card">
          <Icon name="search" size={20} label="" />
          <span><strong>Find Contact</strong><em className="muted">Search or browse the directory</em></span>
        </Link>
        <Link to="/contact-sharing" className="quick-card">
          <Icon name="share" size={20} label="" />
          <span><strong>Share Contact</strong><em className="muted">vCard, QR or device share</em></span>
        </Link>
        <Link to="/settings" className="quick-card">
          <Icon name="upload" size={20} label="" />
          <span><strong>Import Contacts</strong><em className="muted">Bring a CSV into the vault</em></span>
        </Link>
      </div>

      <div className="dash-columns">
        <div className="dash-col dash-col-main">
          <h2 className="section-title">Recent contacts</h2>
          <div className="card card-pad">
            {recentContacts.length ? (
              <ul className="mini-list">
                {recentContacts.map((c) => (
                  <li key={c.id}><MiniContact contact={c} subtitle={c.createdAt ? `added ${timeAgo(c.createdAt, now)}` : ''} /></li>
                ))}
              </ul>
            ) : <p className="muted">Add your first contact to see it here.</p>}
          </div>

          <h2 className="section-title">Recently contacted</h2>
          <div className="card card-pad">
            {recentlyContacted.length ? (
              <ul className="mini-list">
                {recentlyContacted.map(({ contact: c, last }) => (
                  <li key={c.id}><MiniContact contact={c} subtitle={`last ${timeAgo(`${last.date}T${last.time || '00:00'}`, now)}`} /></li>
                ))}
              </ul>
            ) : <p className="muted">Logged interactions appear here.</p>}
          </div>

          <h2 className="section-title">Upcoming important dates</h2>
          <div className="card card-pad">
            {upcomingDates.length ? (
              <ul className="upcoming-list">
                {upcomingDates.map((u) => (
                  <li key={u.id}>
                    <Link to={u.link} className="upcoming-item">
                      <span className="up-icon" aria-hidden="true">{u.kind === 'birthday' ? '🎂' : '📅'}</span>
                      <span className="up-copy">
                        <strong>{u.label}</strong>
                        <em className="muted">{formatMonthDay(u.date)}</em>
                      </span>
                      <span className={`up-badge${u.days === 0 ? ' up-today' : ''}`}>
                        {u.days === 0 ? 'Today' : `in ${u.days} day${u.days === 1 ? '' : 's'}`}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : <p className="muted">No upcoming dates — check the Events page.</p>}
          </div>
        </div>

        <div className="dash-col dash-col-side">
          <h2 className="section-title">Relationship overview</h2>
          <div className="card card-pad">
            {relCounts.some((r) => r.count > 0) ? (
              <div className="rel-bars">
                {relCounts.filter((r) => r.count > 0).map(({ group, count }) => (
                  <div key={group.id} className="rel-bar">
                    <span className="rel-bar-label">{group.label}</span>
                    <span className="rel-bar-track"><span className="rel-bar-fill" style={{ width: `${Math.max(4, (count / Math.max(1, total)) * 100)}%` }} /></span>
                    <span className="rel-bar-count">{count}</span>
                  </div>
                ))}
              </div>
            ) : <p className="muted">Assign relationships in your contacts to see the breakdown.</p>}
          </div>

          <h2 className="section-title">Contact health</h2>
          <div className="card card-pad">
            <div className="health-stack" role="img" aria-label={`${health.complete} complete, ${health.mostly} mostly complete, ${health.needsInfo} need information`}>
              <span className="health-seg health-ok" style={{ width: `${total ? (health.complete / total) * 100 : 0}%` }} />
              <span className="health-seg health-warn" style={{ width: `${total ? (health.mostly / total) * 100 : 0}%` }} />
              <span className="health-seg health-danger" style={{ width: `${total ? (health.needsInfo / total) * 100 : 0}%` }} />
            </div>
            <ul className="health-legend">
              <li><span className="legend-dot legend-ok" /> {health.complete} Complete</li>
              <li><span className="legend-dot legend-warn" /> {health.mostly} Mostly Complete</li>
              <li><span className="legend-dot legend-danger" /> {health.needsInfo} Needs Information</li>
            </ul>
          </div>

          <h2 className="section-title">Recently viewed</h2>
          <div className="card card-pad">
            {recentItems.length ? (
              <ul className="recent-avatars">
                {recentItems.map((c) => (
                  <li key={c.id}>
                    <Link to={`/contacts/${c.id}`} className="recent-avatar-link" aria-label={fullName(c)} title={fullName(c)}>
                      <ContactAvatar contact={c} size={40} />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : <p className="muted">Contacts you open will appear here.</p>}
          </div>
        </div>
      </div>

      {contacts.length === 0 ? (
        <EmptyState
          icon="contacts"
          title="Your directory is waiting"
          subtitle="Add a few contacts and this dashboard will light up with insights."
        >
          <Link to="/contacts/add" className="btn btn-primary">Add your first contact</Link>
        </EmptyState>
      ) : null}
    </section>
  );
}