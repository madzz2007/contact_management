/* Top bar — menu button, global search, theme toggle, notifications, quick add, avatar. */

import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useApp } from '../../context/AppContext.jsx';
import { Icon } from '../ui/Icon.jsx';
import { GlobalSearch } from './GlobalSearch.jsx';
import { NotificationPanel } from './NotificationPanel.jsx';
import { APP_NAME, DEMO_USER, NAV_ITEMS } from '../../constants.js';

const THEME_OPTIONS = [
  { id: 'light', label: 'Light', icon: 'sun' },
  { id: 'dark', label: 'Dark', icon: 'moon' },
  { id: 'system', label: 'System', icon: 'monitor' },
];

export function Topbar({ onMenu }) {
  const { settings, changeSettings, activity } = useApp();
  const [notifOpen, setNotifOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const unread = Array.isArray(activity) ? activity.filter((a) => !a.read).length : 0;
  const themeIcon = settings.theme === 'dark' ? 'moon' : settings.theme === 'light' ? 'sun' : 'monitor';

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <button type="button" className="btn-icon menu-btn" onClick={onMenu} aria-label="Open navigation menu">
          <Icon name="list" size={19} label="" />
        </button>

        <Link to="/dashboard" className="topbar-brand" aria-label={`${APP_NAME} home`}>
          <span className="brand-mark">
            <Icon name="logo" size={22} label="" />
          </span>
          <span className="brand-name">{APP_NAME}</span>
        </Link>

        <nav className="top-nav" aria-label="Primary navigation">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `top-nav-link${isActive ? ' active' : ''}`}
            >
              <Icon name={item.icon} size={15} label="" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <GlobalSearch />

        <div className="topbar-actions">
          <div className="topbar-group">
            <button
              type="button"
              className="btn-icon"
              aria-label="Change theme"
              aria-expanded={themeOpen}
              aria-haspopup="menu"
              onClick={() => setThemeOpen(!themeOpen)}
            >
              <Icon name={themeIcon} size={17} label="" />
            </button>
            {themeOpen ? (
              <div className="theme-menu" role="menu" aria-label="Theme">
                {THEME_OPTIONS.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    role="menuitemradio"
                    aria-checked={settings.theme === t.id}
                    className={`theme-option${settings.theme === t.id ? ' active' : ''}`}
                    onClick={() => {
                      changeSettings({ theme: t.id });
                      setThemeOpen(false);
                    }}
                  >
                    <Icon name={t.icon} size={15} label="" />
                    <span>{t.label}</span>
                    {settings.theme === t.id ? <Icon name="check" size={13} label="" /> : null}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="topbar-group">
            <button
              type="button"
              className="btn-icon"
              aria-label="Notifications"
              aria-expanded={notifOpen}
              aria-haspopup="dialog"
              onClick={() => setNotifOpen(!notifOpen)}
            >
              <Icon name="bell" size={17} label="" />
              {unread > 0 ? <span className="notif-badge">{Math.min(unread, 9)}</span> : null}
            </button>
            <NotificationPanel open={notifOpen} onClose={() => setNotifOpen(false)} />
          </div>

          <Link to="/contacts/add" className="btn btn-primary quick-add" aria-label="Add a new contact">
            <Icon name="plus" size={15} label="" />
            <span className="quick-add-label">Quick Add</span>
          </Link>

          <span className="avatar avatar-user avatar-sm" title={DEMO_USER.name} aria-label={DEMO_USER.name}>
            {DEMO_USER.initials}
          </span>
        </div>
      </div>
    </header>
  );
}