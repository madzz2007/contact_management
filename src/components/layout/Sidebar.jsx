/* Left sidebar — brand, primary navigation, user profile, version. */

import { Link, NavLink } from 'react-router-dom';
import { Icon } from '../ui/Icon.jsx';
import { APP_NAME, APP_VERSION, DEMO_USER, NAV_ITEMS } from '../../constants.js';

export function Sidebar({ onNavigate, labelled = true }) {
  return (
    <aside className="sidebar" aria-label={labelled ? 'Primary navigation' : undefined}>
      <Link to="/dashboard" className="sidebar-brand" aria-label={`${APP_NAME} home`} onClick={onNavigate}>
        <span className="brand-mark">
          <Icon name="logo" size={26} label="" />
        </span>
        <span className="brand-name">{APP_NAME}</span>
      </Link>

      <nav className="side-nav" aria-label="Sections">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `side-link${isActive ? ' active' : ''}`}
            onClick={onNavigate}
          >
            <Icon name={item.icon} size={17} label="" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="side-footer">
        <div className="side-user">
          <span className="avatar avatar-user">{DEMO_USER.initials}</span>
          <span className="side-user-info">
            <strong>{DEMO_USER.name}</strong>
            <span className="muted small">{DEMO_USER.role}</span>
          </span>
        </div>
        <span className="side-version muted">v{APP_VERSION}</span>
      </div>
    </aside>
  );
}