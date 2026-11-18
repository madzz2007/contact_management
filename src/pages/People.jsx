/* People — explore the directory grouped by relationship type. */

import { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { PEOPLE_GROUPS } from '../constants.js';
import { ContactCard } from '../components/contacts/ContactCard.jsx';
import { ContactAvatar } from '../components/contacts/ContactAvatar.jsx';
import { Icon } from '../components/ui/Icon.jsx';

const GROUP_ICONS = { family: 'home', friends: 'star', college: 'cap', professional: 'briefcase', others: 'users' };

export function PeoplePage() {
  const { contacts, toggleFavorite, now } = useApp();
  const [activeId, setActiveId] = useState(null);
  const [query, setQuery] = useState('');

  const normalizedQuery = query.trim().toLowerCase();
  const matchesQuery = (contact) => {
    if (!normalizedQuery) return true;
    return [contact.firstName, contact.lastName, contact.company, contact.jobTitle, contact.relationship]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
      .includes(normalizedQuery);
  };
  const membersOf = (group) => contacts.filter((c) => group.relationships.includes(c.relationship) && matchesQuery(c));
  const active = activeId ? PEOPLE_GROUPS.find((g) => g.id === activeId) : null;
  const members = active ? membersOf(active) : contacts.filter(matchesQuery);
  const favoriteCount = contacts.filter((contact) => contact.favorite).length;
  const connectedCount = contacts.filter((contact) => contact.phone || contact.email).length;
  const visibleLabel = active ? active.label : normalizedQuery ? 'Search results' : 'All people';

  const summary = useMemo(() => [
    { label: 'People', value: contacts.length, icon: 'users' },
    { label: 'Favorites', value: favoriteCount, icon: 'star' },
    { label: 'Reachable', value: connectedCount, icon: 'message' },
  ], [contacts.length, favoriteCount, connectedCount]);

  return (
    <section className="page people-page">
      <div className="page-head">
        <div>
          <h1>People</h1>
          <p className="page-sub muted">Your network, grouped by how you know each other.</p>
        </div>
      </div>

      <div className="people-tools">
        <div className="people-search">
          <Icon name="search" size={16} label="" />
          <label className="sr-only" htmlFor="people-search">Search people</label>
          <input
            id="people-search"
            type="search"
            placeholder="Search people, roles or companies"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          {query ? <button type="button" aria-label="Clear people search" onClick={() => setQuery('')}>×</button> : null}
        </div>
        <div className="people-summary" aria-label="People summary">
          {summary.map((item) => (
            <span key={item.label} className="people-stat">
              <Icon name={item.icon} size={15} label="" />
              <strong>{item.value}</strong>
              <span className="muted">{item.label}</span>
            </span>
          ))}
        </div>
      </div>

      <div className="group-grid">
        {PEOPLE_GROUPS.map((group) => {
          const groupMembers = membersOf(group);
          return (
            <button
              key={group.id}
              type="button"
              className={`group-card${activeId === group.id ? ' active' : ''}`}
              aria-pressed={activeId === group.id}
              onClick={() => setActiveId(activeId === group.id ? null : group.id)}
            >
              <span className="group-icon">
                <Icon name={GROUP_ICONS[group.id] || 'users'} size={22} label="" />
              </span>
              <strong>{group.label}</strong>
              <span className="muted">{groupMembers.length} {groupMembers.length === 1 ? 'person' : 'people'}</span>
              <span className="group-avatars" aria-hidden="true">
                {groupMembers.slice(0, 5).map((c) => <ContactAvatar key={c.id} contact={c} size={22} className="stacked-avatar" />)}
              </span>
            </button>
          );
        })}
        <button
          type="button"
          className={`group-card group-card-all${!activeId ? ' active' : ''}`}
          aria-pressed={!activeId}
          onClick={() => setActiveId(null)}
        >
          <span className="group-icon"><Icon name="grid" size={22} label="" /></span>
          <strong>All people</strong>
          <span className="muted">{contacts.length} {contacts.length === 1 ? 'person' : 'people'}</span>
          <span className="group-avatars" aria-hidden="true">
            {contacts.slice(0, 5).map((c) => <ContactAvatar key={c.id} contact={c} size={22} className="stacked-avatar" />)}
          </span>
        </button>
      </div>

      {members.length || normalizedQuery || !active ? (
        <div className="group-members">
          <div className="group-members-head">
            <div>
              <h2>{visibleLabel}</h2>
              <p className="muted small">{members.length} {members.length === 1 ? 'person' : 'people'} shown</p>
            </div>
          </div>
          {members.length ? (
            <div className="contact-grid cc-view-grid">
              {members.map((c) => (
                <ContactCard key={c.id} contact={c} view="grid" now={now} onToggleFavorite={toggleFavorite} />
              ))}
            </div>
          ) : (
            <p className="muted">No people match this search.</p>
          )}
        </div>
      ) : (
        <p className="group-hint muted">Select a group above or search the directory to see people.</p>
      )}
    </section>
  );
}