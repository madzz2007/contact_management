/* Contact Sharing — build a share card, then Share / Copy / vCard / QR. */

import { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { ContactAvatar } from '../components/contacts/ContactAvatar.jsx';
import { RelationshipBadge } from '../components/contacts/RelationshipBadge.jsx';
import { QRCodeBlock } from '../components/share/QRCodeModal.jsx';
import { EmptyState } from '../components/ui/EmptyState.jsx';
import { Icon } from '../components/ui/Icon.jsx';
import { downloadVCard, vCardFilename } from '../utils/vcard.js';
import { contactSummaryText, shareToDevice, canWebShare, fullAddress } from '../utils/share.js';
import { fullName } from '../utils/format.js';

export function ContactSharingPage() {
  const { contacts } = useApp();
  const toast = useToast();
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState('');
  const [showQr, setShowQr] = useState(false);

  const selected = contacts.find((c) => c.id === selectedId) || null;

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return contacts
      .filter((c) => `${c.firstName} ${c.lastName} ${c.company || ''} ${c.email || ''} ${c.jobTitle || ''}`.toLowerCase().includes(q))
      .slice(0, 8);
  }, [contacts, query]);

  const copy = async () => {
    if (!selected) return;
    try {
      await navigator.clipboard.writeText(contactSummaryText(selected));
      toast.success('Contact details copied to clipboard.');
    } catch {
      toast.error('Copy failed — please select the text manually.');
    }
  };

  const share = async () => {
    if (!selected) return;
    const shared = await shareToDevice(selected);
    if (shared) toast.info('Opened your device share sheet.');
    else {
      await copy();
      toast.info(canWebShare() ? 'Sharing declined — copied to clipboard instead.' : 'Web Share is unavailable here — copied to clipboard.');
    }
  };

  const exportVcf = () => {
    if (!selected) return;
    if (downloadVCard(selected)) toast.success(`Downloading ${vCardFilename(selected)}`);
    else toast.error('Could not build the vCard.');
  };

  return (
    <section className="page sharing-page">
      <div className="page-head">
        <div>
          <h1>Contact Sharing</h1>
          <p className="page-sub muted">Prepare a contact card, then share it anywhere — or export it as a vCard or QR code.</p>
        </div>
      </div>

      <div className="sharing-layout">
        <div className="sharing-picker card card-pad">
          <h3>Choose a contact</h3>
          <label className="sr-only" htmlFor="share-pick">Search contacts</label>
          <input
            id="share-pick"
            className="ct-search-input"
            type="search"
            placeholder="Search by name, company or email…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="share-results" role="listbox" aria-label="Matching contacts">
            {(query.trim() ? results : contacts.slice(0, 10)).map((c) => (
              <button
                key={c.id}
                type="button"
                role="option"
                className={`share-result${c.id === selectedId ? ' active' : ''}`}
                onClick={() => {
                  setSelectedId(c.id);
                  setShowQr(false);
                }}
              >
                <ContactAvatar contact={c} size={30} />
                <span>{fullName(c)}</span>
                <span className="muted">{c.company || c.relationship || ''}</span>
              </button>
            ))}
            {query.trim() && results.length === 0 ? <p className="muted small">No matches.</p> : null}
          </div>
        </div>

        <div className="sharing-preview">
          {!selected ? (
            <EmptyState icon="share" title="Pick a contact to share" subtitle="Select someone from the list to build their share card." />
          ) : showQr ? (
            <div className="share-card card card-pad">
              <QRCodeBlock contact={selected} size={200} />
              <button type="button" className="btn btn-ghost" onClick={() => setShowQr(false)}>
                <Icon name="chevronLeft" size={15} label="" /> Back to card
              </button>
            </div>
          ) : (
            <div className="share-card card card-pad">
              <div className="share-card-top">
                <ContactAvatar contact={selected} size={64} />
                <div>
                  <h3>{fullName(selected)}</h3>
                  <RelationshipBadge relationship={selected.relationship} />
                  <p className="muted">{[selected.jobTitle, selected.company].filter(Boolean).join(' · ')}</p>
                </div>
              </div>
              <dl className="cd-defs">
                {selected.phone ? <dt>Phone</dt> : null}
                {selected.phone ? <dd>{selected.phone}</dd> : null}
                {selected.email ? <dt>Email</dt> : null}
                {selected.email ? <dd>{selected.email}</dd> : null}
                {selected.website ? <dt>Website</dt> : null}
                {selected.website ? <dd>{selected.website}</dd> : null}
                {fullAddress(selected) ? <dt>Location</dt> : null}
                {fullAddress(selected) ? <dd>{fullAddress(selected)}</dd> : null}
              </dl>
              <p className="muted small">
                {canWebShare() ? 'Web Share will open your device share sheet.' : 'This browser lacks Web Share — Copy, vCard and QR always work.'}
              </p>
              <div className="share-actions">
                <button type="button" className="btn btn-ghost" onClick={copy}><Icon name="copy" size={15} label="" /> Copy</button>
                <button type="button" className="btn btn-ghost" onClick={exportVcf}><Icon name="download" size={15} label="" /> Download vCard</button>
                <button type="button" className={`btn ${showQr ? 'btn-ghost' : 'btn-primary'}`} onClick={() => setShowQr(!showQr)}><Icon name="qr" size={15} label="" /> QR Code</button>
                <button type="button" className="btn btn-primary" onClick={share}><Icon name="share" size={15} label="" /> Share Contact</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}