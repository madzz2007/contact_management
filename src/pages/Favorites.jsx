/* Favorites — starred contacts with quick actions. */

import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { ContactCard } from '../components/contacts/ContactCard.jsx';
import { EmptyState } from '../components/ui/EmptyState.jsx';
import { Icon } from '../components/ui/Icon.jsx';

export function FavoritesPage() {
  const { contacts, toggleFavorite, now } = useApp();
  const favorites = contacts.filter((c) => c.favorite);
  const sortKey = (c) => String(c.updatedAt || '');

  return (
    <section className="page favorites-page">
      <div className="page-head">
        <div>
          <h1>Favorites</h1>
          <p className="page-sub muted">Starred people, always one click away.</p>
        </div>
        <Link to="/contacts" className="btn btn-ghost">
          <Icon name="contacts" size={15} label="" /> Browse all contacts
        </Link>
      </div>

      {favorites.length ? (
        <div className="contact-grid cc-view-grid">
          {[...favorites].sort((a, b) => sortKey(b).localeCompare(sortKey(a))).map((c) => (
            <ContactCard key={c.id} contact={c} view="grid" now={now} onToggleFavorite={toggleFavorite} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon="star"
          title="No favorite contacts"
          subtitle="Star important people for quick access — they will cluster here."
        >
          <Link to="/contacts" className="btn btn-primary">Find someone to star</Link>
        </EmptyState>
      )}
    </section>
  );
}