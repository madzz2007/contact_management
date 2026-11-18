/* Share a contact: Web Share API when available, plus copy / vCard / QR fallbacks. */

import { useState } from 'react';
import { useToast } from '../../context/ToastContext.jsx';
import { Modal } from '../ui/Modal.jsx';
import { Icon } from '../ui/Icon.jsx';
import { ContactAvatar } from '../contacts/ContactAvatar.jsx';
import { QRCodeBlock } from './QRCodeModal.jsx';
import { downloadVCard, vCardFilename } from '../../utils/vcard.js';
import { contactSummaryText, shareToDevice, canWebShare } from '../../utils/share.js';
import { fullAddress } from '../../utils/share.js';

export function ShareContactModal({ contact, open, onClose }) {
  const toast = useToast();
  const [showQr, setShowQr] = useState(false);
  if (!contact) return null;
  const name = `${contact.firstName || ''} ${contact.lastName || ''}`.trim() || 'Contact';
  const role = [contact.jobTitle, contact.company].filter(Boolean).join(' · ');

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(contactSummaryText(contact));
      toast.success('Contact details copied to clipboard.');
    } catch {
      toast.error('Copy failed — please select the text manually.');
    }
  };

  const share = async () => {
    const shared = await shareToDevice(contact);
    if (shared) {
      toast.info('Opened your device share sheet.');
    } else if (canWebShare()) {
      await copy();
      toast.info('Sharing was declined — copied to clipboard instead.');
    } else {
      await copy();
      toast.info('Web Share is not supported here — copied to clipboard.');
    }
    onClose?.();
  };

  const exportVcf = () => {
    if (downloadVCard(contact)) toast.success(`Downloading ${vCardFilename(contact)}`);
    else toast.error('Could not build the vCard.');
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Share ${name}`}
      size="md"
      footer={
        <>
          <button type="button" className="btn btn-ghost" onClick={copy}>
            <Icon name="copy" size={15} label="" /> Copy
          </button>
          <button type="button" className="btn btn-ghost" onClick={exportVcf}>
            <Icon name="download" size={15} label="" /> vCard
          </button>
          <button
            type="button"
            className={`btn ${showQr ? 'btn-ghost' : 'btn-primary'}`}
            onClick={() => setShowQr(!showQr)}
          >
            <Icon name="qr" size={15} label="" /> {showQr ? 'Hide QR' : 'QR Code'}
          </button>
          <button type="button" className="btn btn-primary" onClick={share}>
            <Icon name="share" size={15} label="" /> Share Contact
          </button>
        </>
      }
    >
      {showQr ? (
        <QRCodeBlock contact={contact} size={200} />
      ) : (
        <div className="share-preview">
          <div className="share-card">
            <ContactAvatar contact={contact} size={64} />
            <h4>{name}</h4>
            {role ? <p className="muted">{role}</p> : null}
            {contact.phone ? <p><a href={`tel:${String(contact.phone).replace(/\s/g, '')}`}>{contact.phone}</a></p> : null}
            {contact.email ? <p><a href={`mailto:${contact.email}`}>{contact.email}</a></p> : null}
            {contact.website ? <p className="muted">{contact.website}</p> : null}
            {fullAddress(contact) ? <p className="muted">{fullAddress(contact)}</p> : null}
          </div>
          <p className="muted small">
            {canWebShare() ? 'Your device share sheet will open — pick any app.' : 'Web Share is unavailable in this browser — use Copy, vCard or QR instead.'}
          </p>
        </div>
      )}
    </Modal>
  );
}