/* View All Contacts — the contact directory with search, smart filters,
 * relationship/tag filters, sorting and grid/list toggle. */

import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { ContactFilters } from '../components/contacts/ContactFilters.jsx';
import { ContactCard } from '../components/contacts/ContactCard.jsx';
import { EmptyState } from '../components/ui/EmptyState.jsx';
import { computeCompleteness } from '../utils/completeness.js';
import { matchScore } from '../utils/search.js';
import { diffInDays, toDate, isoDaysAgo } from '../utils/date.js';
import { RECENT_DAYS, FOLLOW_UP_DAYS } from '../constants.js';
import { getLastInteractionForContact } from '../services/interactionService.js';
import { Icon } from '../components/ui/Icon.jsx';
import { findAllTags } from '../utils/format.js';

export function ContactsPage() {
  const { contacts, toggleFavorite, now, settings } = useApp();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [relationship, setRelationship] = useState('');
  const [tag, setTag] = useState('');
  const [sort, setSort] = useState('recently-added');
  const [view, setView] = useState(settings.defaultView === 'list' ? 'list' : 'grid');

  const allTags = useMemo(() => findAllTags(contacts), [contacts]);

  const lastMap = useMemo(() => {
    const map = {};
    for (const c of Array.isArray(contacts) ? contacts : []) {
      map[c.id] = getLastInteractionForContact(c.id);
    }
    return map;
  }, [contacts]);

  const nameOf = (c) => `${String(c.firstName || '')} ${String(c.lastName || '')}`.trim().toLowerCase();

  const list = useMemo(() => {
    let items = Array.isArray(contacts) ? contacts : [];
    const cutoff = isoDaysAgo(RECENT_DAYS, now);
    const old = isoDaysAgo(FOLLOW_UP_DAYS, now);

    switch (filter) {
      case 'favorites':
        items = items.filter((c) => c.favorite);
        break;
      case 'recently-added':
        items = items.filter((c) => {
          const d = toDate(c.createdAt);
          return d && diffInDays(now, d) <= RECENT_DAYS;
        });
        break;
      case 'recently-contacted':
        items = items.filter((c) => {
          const last = lastMap[c.id];
          return last && last.date >= cutoff;
        });
        break;
      case 'needs-followup':
        items = items.filter((c) => {
          const last = lastMap[c.id];
          return last && last.date < old;
        });
        break;
      case 'incomplete':
        items = items.filter((c) => computeCompleteness(c).percent < 50);
        break;
      case 'has-birthday':
        items = items.filter((c) => Boolean(String(c.birthday || '').trim()));
        break;
      case 'has-email':
        items = items.filter((c) => Boolean(String(c.email || '').trim()));
        break;
      case 'has-phone':
        items = items.filter((c) => Boolean(String(c.phone || '').trim()));
        break;
      default:
        break;
    }

    if (relationship) items = items.filter((c) => c.relationship === relationship);
    if (tag) items = items.filter((c) => Array.isArray(c.tags) && c.tags.includes(tag));
    if (String(query || '').trim()) items = items.filter((c) => matchScore(c, query) > 0);

    const q = String(query || '').trim().toLowerCase();
    switch (sort) {
      case 'name-asc':
        items.sort((a, b) => nameOf(a).localeCompare(nameOf(b)));
        break;
      case 'name-desc':
        items.sort((a, b) => nameOf(b).localeCompare(nameOf(a)));
        break;
      case 'recently-contacted': {
        items.sort((a, b) => {
          const da = lastMap[a.id]?.date || '';
          const db = lastMap[b.id]?.date || '';
          return db.localeCompare(da);
        });
        break;
      }
      default: {
        items.sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')));
        break;
      }
    }
    void q;
    return items;
  }, [contacts, query, filter, relationship, tag, sort, lastMap, now]);

  return (
    <section className="page contacts-page">
      <div className="page-head">
        <div>
          <h1>All Contacts</h1>
          <p className="page-sub muted">{contacts.length} people in your directory</p>
        </div>
        <Link to="/contacts/add" className="btn btn-primary">
          <Icon name="plus" size={15} label="" /> Add Contact
        </Link>
      </div>

      <ContactFilters
        query={query}
        onQuery={setQuery}
        filter={filter}
        onFilter={setFilter}
        relationship={relationship}
        onRelationship={setRelationship}
        tag={tag}
        onTag={setTag}
        clearTag={() => setTag('')}
        sort={sort}
        onSort={setSort}
        view={view}
        onView={setView}
        allTags={allTags}
        total={contacts.length}
        shown={list.length}
      />

      {list.length === 0 ? (
        <EmptyState
          icon={filter === 'all' && !query ? 'contacts' : 'search'}
          title={filter === 'all' && !query ? 'No contacts yet' : 'No contacts match'}
          subtitle={
            filter === 'all' && !query
              ? 'Your contact directory is waiting for its first connection.'
              : 'Try clearing a filter or changing your search terms.'
          }
          actionLabel={filter === 'all' && !query ? 'Add Contact' : undefined}
          onAction={filter === 'all' && !query ? () => undefined : undefined}
        >
          {filter === 'all' && !query ? <Link to="/contacts/add" className="btn btn-primary">Add Contact</Link> : null}
        </EmptyState>
      ) : (
        <div className={`contact-grid cc-view-${view}`}>
          {list.map((c) => (
            <ContactCard key={c.id} contact={c} view={view} now={now} onToggleFavorite={toggleFavorite} />
          ))}
        </div>
      )}
    </section>
  );
}