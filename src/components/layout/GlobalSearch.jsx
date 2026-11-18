/* Global search in the top bar — Ctrl+K / "/" opens it, live results, Enter opens top hit. */

import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext.jsx';
import { searchContacts } from '../../utils/search.js';
import { Icon } from '../ui/Icon.jsx';
import { ContactAvatar } from '../contacts/ContactAvatar.jsx';

export function GlobalSearch() {
  const { contacts } = useApp();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const inputRef = useRef(null);

  const results = useMemo(() => searchContacts(contacts, query, 8), [contacts, query]);

  useEffect(() => {
    const onKey = (e) => {
      const el = e.target;
      const isTyping =
        el && typeof el.tagName === 'string' && ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName.toUpperCase());
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen(true);
        inputRef.current?.focus();
      } else if (!isTyping && e.key === '/' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        setOpen(true);
        inputRef.current?.focus();
      } else if (e.key === 'Escape' && document.activeElement === inputRef.current) {
        setOpen(false);
        inputRef.current?.blur();
        e.preventDefault();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const goTo = (id) => {
    setOpen(false);
    setQuery('');
    navigate(`/contacts/${id}`);
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && results.length > 0) {
      e.preventDefault();
      goTo(results[0].contact.id);
    } else if (e.key === 'ArrowDown' && results.length > 0) {
      e.preventDefault();
      document.getElementById(`global-result-${results[0].contact.id}`)?.focus();
    }
  };

  return (
    <div className="search-wrap">
      <span className="search-icon">
        <Icon name="search" size={16} label="" />
      </span>
      <label htmlFor="global-search" className="sr-only">
        Search contacts
      </label>
      <input
        id="global-search"
        ref={inputRef}
        className="search-input"
        role="combobox"
        aria-expanded={open}
        aria-controls="global-search-results"
        aria-autocomplete="list"
        placeholder="Search people, companies, tags…  (Ctrl K)"
        value={query}
        autoComplete="off"
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        onKeyDown={onKeyDown}
      />
      {query ? (
        <button type="button" className="search-clear" aria-label="Clear search" onClick={() => setQuery('')}>
          <Icon name="x" size={12} label="" />
        </button>
      ) : null}
      {open && (query || results.length) ? (
        <div id="global-search-results" className="search-pop" role="listbox">
          {query && results.length === 0 ? (
            <div className="search-empty">No matches for “{query}”</div>
          ) : null}
          {results.map(({ contact }) => (
            <button
              key={contact.id}
              id={`global-result-${contact.id}`}
              type="button"
              role="option"
              tabIndex={-1}
              className="search-result"
              onMouseDown={(e) => {
                e.preventDefault();
                goTo(contact.id);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  goTo(contact.id);
                }
              }}
            >
              <ContactAvatar contact={contact} size={26} />
              <span className="search-result-name">
                {contact.firstName} {contact.lastName}
              </span>
              <span className="search-result-meta muted">
                {contact.company || contact.relationship || contact.city}
              </span>
            </button>
          ))}
          {results.length > 0 ? (
            <div className="search-hint muted">Enter opens the top match · Esc to close</div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}