import React from 'react';
import { NavLink } from 'react-router-dom';
import { Icon } from '../ui/Icon.jsx';
import styles from './NavigationSidebar.module.css';

const items = [
  { to: '/contacts', label: 'All Contacts', icon: 'contacts' },
  { to: '/favorites', label: 'Favorites', icon: 'star' },
  { to: '/groups', label: 'Groups', icon: 'folder' },
  { to: '/settings', label: 'Settings', icon: 'settings' },
];

export function NavigationSidebar({ onNavigate }) {
  return (
    <aside className={styles.sidebar} aria-label="Contact navigation">
      <nav className={styles.nav}>
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `${styles.link}${isActive ? ` ${styles.active}` : ''}`}
            onClick={onNavigate}
          >
            <Icon name={item.icon} size={18} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
