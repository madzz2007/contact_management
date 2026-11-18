/* QR code generation for a contact (vCard payload). */

import { QRCodeSVG } from 'qrcode.react';
import { buildVCard } from '../../utils/vcard.js';

export function QRCodeBlock({ contact, size = 220 }) {
  if (!contact) return null;
  const payload = buildVCard(contact) || `${contact.firstName || ''} ${contact.lastName || ''}`.trim();
  const name = `${contact.firstName || ''} ${contact.lastName || ''}`.trim() || 'contact';
  return (
    <div className="qr-block">
      <div className="qr-box" role="img" aria-label={`QR code for ${name}`}>
        <QRCodeSVG
          value={payload}
          size={size}
          level="M"
          bgColor="transparent"
          fgColor={typeof document !== 'undefined' && document.documentElement.dataset.theme === 'dark' ? '#e9f0ed' : '#16221f'}
          marginSize={2}
        />
      </div>
      <p className="muted small">Point a phone camera at this QR code to save {name} as a new contact (vCard).</p>
    </div>
  );
}