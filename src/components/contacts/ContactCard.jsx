/* Contact card — grid tile and list row share this component. */

import { Link } from 'react-router-dom';
import { Icon } from '../ui/Icon.jsx';
import { ContactAvatar } from './ContactAvatar.jsx';
import { RelationshipBadge } from './RelationshipBadge.jsx';
import { ContactActions } from './ContactActions.jsx';
import { computeCompleteness, healthBucket } from '../../utils/completeness.js';
import { fullAddress } from '../../utils/share.js';

export function ContactCard({ contact, view = 'grid', now, onToggleFavorite, showMeta = true }) {
  if (!contact) return null;
  const name = `${contact.firstName || ''} ${contact.lastName || ''}`.trim() || 'Unnamed contact';
  const role = [contact.jobTitle, contact.company].filter(Boolean).join(' · ');
  const location = fullAddress(contact);
  const { percent } = computeCompleteness(contact);
  const health = healthBucket(percent);
  const needsFollowUp = Boolean(
    contact.lastInteraction && contact.lastInteraction.daysAgo > 14,
  );

  return (
    <article className={`contact-card cc-${view}`}>
      <div className="cc-top">
        <Link to={`/contacts/${contact.id}`} className="cc-avatar-link" aria-label={`View ${name}`}>
          <ContactAvatar contact={contact} size={view === 'grid' ? 52 : 44} />
        </Link>
        <div className="cc-headline">
          <Link to={`/contacts/${contact.id}`} className="cc-name">
            {name}
          </Link>
          <div className="cc-meta muted">
            {role || location || contact.relationship || 'No details yet'}
          </div>
        </div>
        <button
          type="button"
          className={`cc-fav${contact.favorite ? ' active' : ''}`}
          aria-label={contact.favorite ? 'Remove from favorites' : 'Add to favorites'}
          aria-pressed={contact.favorite}
          title={contact.favorite ? 'Remove from favorites' : 'Add to favorites'}
          onClick={() => onToggleFavorite?.(contact.id)}
        >
          <Icon name={contact.favorite ? 'starred' : 'star'} size={18} label="" />
        </button>
      </div>

      <div className="cc-info">
        <RelationshipBadge relationship={contact.relationship} />
        {contact.tags && contact.tags.length ? (
          <span className="cc-tags muted">{contact.tags.slice(0, 3).join(' · ')}</span>
        ) : null}
      </div>

      {showMeta ? (
        <ul className="cc-contact-lines">
          {contact.phone ? (
            <li><Icon name="phone" size={14} label="" /><a href={`tel:${String(contact.phone).replace(/\s/g, '')}`}>{contact.phone}</a></li>
          ) : null}
          {contact.email ? (
            <li><Icon name="mail" size={14} label="" /><a href={`mailto:${contact.email}`}>{contact.email}</a></li>
          ) : null}
          {location ? (
            <li><Icon name="map" size={14} label="" /><span className="muted">{location}</span></li>
          ) : null}
        </ul>
      ) : null}

      <div className="cc-foot">
        <ContactActions contact={contact} />
        <Link to={`/contacts/${contact.id}`} className="cc-view muted">
          View profile <Icon name="chevronRight" size={13} label="" />
        </Link>
      </div>

      {now ? (
        <div className={`cc-health cc-health-${health.tone}`} title={`Profile ${percent}% complete`}>
          <span className="cc-health-dot" aria-hidden="true" />
          <span className="sr-only">{`Profile ${percent}% — ${health.label}`}</span>
          <span className="cc-health-label">{health.label}</span>
          {needsFollowUp ? <span className="cc-followup">· Needs follow-up</span> : null}
        </div>
      ) : null}
    </article>
  );
}