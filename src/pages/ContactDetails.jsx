/* Contact Details — profile, smart actions, completeness, communication
 * history, linked events and notes. The heart of the application. */

import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { ContactAvatar } from '../components/contacts/ContactAvatar.jsx';
import { RelationshipBadge } from '../components/contacts/RelationshipBadge.jsx';
import { TagBadge } from '../components/contacts/TagBadge.jsx';
import { ContactActions } from '../components/contacts/ContactActions.jsx';
import { ProfileCompleteness } from '../components/contacts/ProfileCompleteness.jsx';
import { NoteSection } from '../components/contacts/NoteSection.jsx';
import { InteractionTimeline } from '../components/interactions/InteractionTimeline.jsx';
import { InteractionForm } from '../components/interactions/InteractionForm.jsx';
import { EventCard } from '../components/events/EventCard.jsx';
import { ShareContactModal } from '../components/share/ShareContactModal.jsx';
import { ConfirmDialog } from '../components/ui/ConfirmDialog.jsx';
import { EmptyState } from '../components/ui/EmptyState.jsx';
import { Icon } from '../components/ui/Icon.jsx';
import { fullName, roleLine } from '../utils/format.js';
import { fullAddress, telHref, mailtoHref, waHref, mapsHref, websiteHref } from '../utils/share.js';
import { daysUntilNext, formatDate, timeAgo, diffInDays, toDate } from '../utils/date.js';
import { FOLLOW_UP_DAYS } from '../constants.js';

export function ContactDetailsPage() {
  const { id } = useParams();
  const {
    getContactById, toggleFavorite, deleteContact, pushRecentView, pushNotification,
    now, getInteractionsFor, removeInteraction, events, removeEvent, getLastInteractionForContact,
  } = useApp();
  const toast = useToast();
  const navigate = useNavigate();
  const [shareOpen, setShareOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const contact = getContactById(id);
  const interactions = id ? getInteractionsFor(id) : [];
  const contactEvents = events.filter((e) => e.contactId === id);

  useEffect(() => {
    if (id) pushRecentView(id);
  }, [id, pushRecentView]);

  if (!contact) {
    return (
      <section className="page contact-details">
        <EmptyState
          icon="search"
          title="Contact not found"
          subtitle="It may have been deleted, or the link might be outdated."
        >
          <Link to="/contacts" className="btn btn-primary">Back to Contacts</Link>
        </EmptyState>
      </section>
    );
  }

  const name = fullName(contact);
  const display = contact.firstName || name;
  const location = fullAddress(contact);
  const last = getLastInteractionForContact(contact.id);
  const lastIso = last ? `${last.date || ''}T${last.time || '00:00'}` : null;
  const lastDays = last ? diffInDays(toDate(last.date) || now, now) : null;
  const needsFollowUp = lastDays != null && lastDays > FOLLOW_UP_DAYS;
  const nextBday = contact.birthday ? daysUntilNext(contact.birthday, now) : null;
  const role = roleLine(contact);

  const handleDelete = () => {
    setDeleteOpen(false);
    deleteContact(contact.id);
    navigate('/contacts');
    toast.info(`${name} was removed from your contacts.`);
    pushNotification({ type: 'warning', title: 'Contact deleted', body: `${name} was removed.` });
  };

  return (
    <section className="page contact-details">
      <div className="page-head">
        <div className="breadcrumb">
          <Link to="/contacts">Contacts</Link>
          <Icon name="chevronRight" size={12} label="" />
          <span>{name}</span>
        </div>
        <div className="head-actions">
          <button type="button" className="btn btn-ghost" onClick={() => setDeleteOpen(true)}>
            <Icon name="trash" size={15} label="" /> Delete
          </button>
          <Link to={`/contacts/${contact.id}/edit`} className="btn btn-ghost">
            <Icon name="pencil" size={15} label="" /> Edit
          </Link>
          <button type="button" className="btn btn-primary" onClick={() => setShareOpen(true)}>
            <Icon name="share" size={15} label="" /> Share
          </button>
        </div>
      </div>

      <div className="cd-hero card">
        <ContactAvatar contact={contact} size={96} />
        <div className="cd-hero-info">
          <div className="cd-name-line">
            <h1>{name}</h1>
            <button
              type="button"
              className={`cd-fav${contact.favorite ? ' active' : ''}`}
              aria-label={contact.favorite ? 'Remove from favorites' : 'Add to favorites'}
              aria-pressed={contact.favorite}
              onClick={() => toggleFavorite(contact.id)}
              title={contact.favorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Icon name={contact.favorite ? 'starred' : 'star'} size={22} label="" />
            </button>
          </div>
          {role ? <p className="muted cd-role">{role}</p> : null}
          <div className="cd-chips">
            <RelationshipBadge relationship={contact.relationship} />
            {contact.tags.map((t) => <TagBadge key={t} tag={t} />)}
          </div>
        </div>
        <div className="cd-actions">
          <ContactActions
            contact={contact}
            onEdit={() => navigate(`/contacts/${contact.id}/edit`)}
            onShare={() => setShareOpen(true)}
          />
          {lastIso ? (
            <p className={`cd-last ${needsFollowUp ? 'cd-followup' : 'muted'}`}>
              {needsFollowUp
                ? `Needs follow-up — last contact ${timeAgo(lastIso, now)}`
                : `Last contacted ${timeAgo(lastIso, now)}`}
            </p>
          ) : (
            <p className="cd-last muted">No interactions recorded yet.</p>
          )}
        </div>
      </div>

      <div className="cd-grid">
        <aside className="cd-aside" aria-label="Contact information">
          <ProfileCompleteness contact={contact} size="lg" />

          <div className="cd-block">
            <h3>Contact</h3>
            <dl className="cd-defs">
              {contact.phone ? <dt>Phone</dt> : null}
              {contact.phone ? <dd><a href={telHref(contact.phone)}>{contact.phone}</a></dd> : null}
              {contact.altPhone ? <dt>Alternate</dt> : null}
              {contact.altPhone ? <dd><a href={telHref(contact.altPhone)}>{contact.altPhone}</a></dd> : null}
              {contact.email ? <dt>Email</dt> : null}
              {contact.email ? <dd><a href={mailtoHref(contact.email)}>{contact.email}</a></dd> : null}
              {contact.website ? <dt>Website</dt> : null}
              {contact.website ? <dd><a href={websiteHref(contact.website)} target="_blank" rel="noreferrer">{contact.website}</a></dd> : null}
            </dl>
            <div className="mini-actions">
              {contact.phone ? <a className="btn btn-ghost btn-sm" href={telHref(contact.phone)}><Icon name="phone" size={14} label="" /> Call</a> : null}
              {contact.phone ? <a className="btn btn-ghost btn-sm" href={waHref(contact.phone)} target="_blank" rel="noreferrer"><Icon name="whatsapp" size={14} label="" /> WhatsApp</a> : null}
              {contact.email ? <a className="btn btn-ghost btn-sm" href={mailtoHref(contact.email)}><Icon name="mail" size={14} label="" /> Email</a> : null}
            </div>
          </div>

          {role ? (
            <div className="cd-block">
              <h3>Work</h3>
              <p className="muted">{role}</p>
            </div>
          ) : null}

          {location ? (
            <div className="cd-block">
              <h3>Address</h3>
              <p className="muted">{location}</p>
              <a className="btn btn-ghost btn-sm" href={mapsHref(contact)} target="_blank" rel="noreferrer">
                <Icon name="map" size={14} label="" /> Open in Maps
              </a>
            </div>
          ) : null}

          <div className="cd-block">
            <h3>Personal</h3>
            <dl className="cd-defs">
              {contact.birthday ? <dt>Birthday</dt> : null}
              {contact.birthday ? (
                <dd>
                  {formatDate(contact.birthday)}
                  {nextBday != null ? ` · ${nextBday === 0 ? 'today!' : `in ${nextBday} days`}` : ''}
                </dd>
              ) : null}
              <dt>Added</dt>
              <dd className="muted">{formatDate(contact.createdAt)}</dd>
              {last ? <dt>Last contact</dt> : null}
              {last ? <dd className="muted">{formatDate(last.date)}</dd> : null}
            </dl>
          </div>
        </aside>

        <div className="cd-main">
          <section className="cd-section">
            <h2>Communication history</h2>
            <InteractionForm contacts={[contact]} defaultContactId={contact.id} />
            <InteractionTimeline
              items={interactions}
              contactsById={{}}
              now={now}
              onDelete={(iid) => removeInteraction(iid)}
              showContact={false}
            />
          </section>

          <section className="cd-section">
            <h2>Important dates</h2>
            {contactEvents.length ? (
              <div className="ev-list">
                {contactEvents.map((ev) => (
                  <EventCard key={ev.id} event={ev} contact={contact} now={now} onDelete={(eid) => removeEvent(eid)} />
                ))}
              </div>
            ) : (
              <p className="muted">No linked dates yet — events and birthdays for {display} show here.</p>
            )}
          </section>

          <section className="cd-section">
            <h2>Notes</h2>
            <NoteSection contact={contact} />
          </section>
        </div>
      </div>

      <ShareContactModal contact={contact} open={shareOpen} onClose={() => setShareOpen(false)} />
      <ConfirmDialog
        open={deleteOpen}
        title={`Delete ${name}?`}
        message={`This removes ${display} from your contacts along with their interactions, dates and notes. This cannot be undone.`}
        confirmLabel="Delete contact"
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
      />
    </section>
  );
}