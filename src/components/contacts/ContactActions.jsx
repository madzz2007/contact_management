/* Smart quick actions: tel:, mailto:, WhatsApp, Maps, plus optional edit/share. */

import { telHref, mailtoHref, waHref, mapsHref } from '../../utils/share.js';
import { Icon } from '../ui/Icon.jsx';

export function ContactActions({ contact, onShare, onEdit, className = '' }) {
  if (!contact) return null;
  const display = `${contact.firstName || 'this'} ${contact.lastName || ''}`.trim() || 'this contact';
  const actions = [
    { id: 'call', label: `Call ${display}`, href: telHref(contact.phone), icon: 'phone', show: Boolean(contact.phone) },
    { id: 'message', label: `Message ${display}`, href: waHref(contact.phone), icon: 'message', show: Boolean(contact.phone) },
    { id: 'email', label: `Email ${display}`, href: mailtoHref(contact.email), icon: 'mail', show: Boolean(contact.email) },
    { id: 'whatsapp', label: `WhatsApp ${display}`, href: waHref(contact.phone), icon: 'whatsapp', show: Boolean(contact.phone) },
    { id: 'map', label: `Open ${display} in Maps`, href: mapsHref(contact), icon: 'map', show: Boolean(mapsHref(contact)), external: true },
  ];
  return (
    <div className={`contact-actions ${className}`}>
      {actions.map((a) =>
        a.show
          ? <a key={a.id} className="act-btn" href={a.href} title={a.label} aria-label={a.label} target={a.external ? '_blank' : undefined} rel={a.external ? 'noreferrer' : undefined}><Icon name={a.icon} size={16} label="" /></a>
          : null,
      )}
      {onShare ? (
        <button type="button" className="act-btn" onClick={onShare} aria-label={`Share ${display}`} title={`Share ${display}`}>
          <Icon name="share" size={16} label="" />
        </button>
      ) : null}
      {onEdit ? (
        <button type="button" className="act-btn" onClick={onEdit} aria-label={`Edit ${display}`} title={`Edit ${display}`}>
          <Icon name="pencil" size={16} label="" />
        </button>
      ) : null}
    </div>
  );
}