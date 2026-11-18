/* Contacts toolbar — search, smart filters, relationship/tag/sort selects, view toggle. */

import { RELATIONSHIPS, SMART_FILTERS, SORT_OPTIONS } from '../../constants.js';
import { Icon } from '../ui/Icon.jsx';
import { TagBadge } from './TagBadge.jsx';

export function ContactFilters({
  query, onQuery, filter, onFilter, relationship, onRelationship, tag, onTag, clearTag,
  sort, onSort, view, onView, allTags, total, shown,
}) {
  return (
    <div className="contact-toolbar">
      <div className="ct-search">
        <span className="search-icon">
          <Icon name="search" size={15} label="" />
        </span>
        <label htmlFor="contact-directory-search" className="sr-only">
          Search contacts
        </label>
        <input
          id="contact-directory-search"
          className="ct-search-input"
          type="search"
          placeholder="Search by name, phone, email, company, tag, location…"
          value={query}
          onChange={(e) => onQuery(e.target.value)}
        />
        {query ? (
          <button type="button" className="search-clear" aria-label="Clear search" onClick={() => onQuery('')}>
            <Icon name="x" size={12} label="" />
          </button>
        ) : null}
      </div>

      <div className="ct-chips" role="group" aria-label="Smart filters">
        {SMART_FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            className={`chip${filter === f.id ? ' active' : ''}`}
            aria-pressed={filter === f.id}
            onClick={() => onFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="ct-controls">
        <label className="sr-only" htmlFor="ct-rel">Filter by relationship</label>
        <select id="ct-rel" className="ct-select" value={relationship} onChange={(e) => onRelationship(e.target.value)}>
          <option value="">Any relationship</option>
          {RELATIONSHIPS.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>

        {allTags && allTags.length ? (
          <label className="sr-only" htmlFor="ct-tag">Filter by tag</label>
        ) : null}
        {allTags && allTags.length ? (
          <select id="ct-tag" className="ct-select" value={tag} onChange={(e) => onTag(e.target.value)}>
            <option value="">Any tag</option>
            {allTags.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        ) : null}

        <label className="sr-only" htmlFor="ct-sort">Sort contacts</label>
        <select id="ct-sort" className="ct-select" value={sort} onChange={(e) => onSort(e.target.value)}>
          {SORT_OPTIONS.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
        </select>

        <div className="segmented" role="group" aria-label="Contact view">
          <button
            type="button"
            className={`seg-btn${view === 'grid' ? ' active' : ''}`}
            aria-pressed={view === 'grid'}
            aria-label="Grid view"
            onClick={() => onView('grid')}
          >
            <Icon name="grid" size={15} label="" />
          </button>
          <button
            type="button"
            className={`seg-btn${view === 'list' ? ' active' : ''}`}
            aria-pressed={view === 'list'}
            aria-label="List view"
            onClick={() => onView('list')}
          >
            <Icon name="list" size={15} label="" />
          </button>
        </div>
        <span className="ct-count muted">{shown} of {total}</span>
      </div>

      {tag ? (
        <p className="ct-active-tag">
          <span className="muted">Active tag:</span>
          <TagBadge tag={tag} onRemove={clearTag} />
        </p>
      ) : null}
    </div>
  );
}