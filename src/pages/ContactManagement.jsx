import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { ContactCard } from '../contacts/ContactCard.jsx';
import { ContactDetailsPanel } from '../contacts/ContactDetailsPanel.jsx';
import { AddContactModal } from '../contacts/AddContactModal.jsx';
import { Icon } from '../ui/Icon.jsx';
import styles from './ContactManagement.module.css';

export function ContactManagementPage() {
  const { contacts } = useApp();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [showAdd, setShowAdd] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return contacts;
    return contacts.filter((c) => {
      const name = `${c.firstName || ''} ${c.lastName || ''}`.toLowerCase();
      return name.includes(q) || (c.email && c.email.toLowerCase().includes(q)) || (c.phone && c.phone.includes(q));
    });
  }, [contacts, search]);

  return (
    <div className={styles.container}>
      <section className={styles.mainSection}>
        <header className={styles.header}>
          <h1 className={styles.title}>Contacts</h1>
          <div className={styles.actions}>
            <div className={styles.searchWrapper}>
              <Icon name="search" size={14} className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search contacts…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={styles.searchInput}
                aria-label="Search contacts"
              />
            </div>
            {/* Placeholder filter button – future filter UI */}
            <button className={styles.filterBtn} aria-label="Filter contacts">
              <Icon name="filter" size={16} />
            </button>
            <button className={styles.addBtn} onClick={() => setShowAdd(true)} aria-label="Add new contact">
              <Icon name="plus" size={16} /> Add Contact
            </button>
          </div>
        </header>
        <div className={styles.grid}>
          {filtered.map((c) => (
            <ContactCard key={c.id} contact={c} onSelect={() => setSelected(c)} />
          ))}
        </div>
      </section>
      {selected && <ContactDetailsPanel contact={selected} onClose={() => setSelected(null)} />}
      {showAdd && <AddContactModal onClose={() => setShowAdd(false)} />}
    </div>
  );
}
