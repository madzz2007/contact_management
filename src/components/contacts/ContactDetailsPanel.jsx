import React from 'react';
import { Icon } from '../ui/Icon.jsx';
import styles from './ContactDetailsPanel.module.css';

export function ContactDetailsPanel({ contact, onClose }) {
  if (!contact) return null;
  const name = `${contact.firstName || ''} ${contact.lastName || ''}`.trim() || 'Unnamed';
  return (
    <aside className={styles.panel} aria-label="Contact details">
      <header className={styles.header}>
        <h2 className={styles.title}>{name}</h2>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
          <Icon name="x" size={16} />
        </button>
      </header>
      <div className={styles.content}>
        {contact.email && (
          <p><strong>Email:</strong> <a href={`mailto:${contact.email}`}>{contact.email}</a></p>
        )}
        {contact.phone && (
          <p><strong>Phone:</strong> <a href={`tel:${contact.phone}`}>{contact.phone}</a></p>
        )}
        {/* Additional fields can be added here */}
      </div>
    </aside>
  );
}
