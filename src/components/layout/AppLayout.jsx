/* Application shell — sidebar on desktop, hamburger drawer on mobile. */

import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar.jsx';
import { useApp } from '../../context/AppContext.jsx';
import styles from './AppLayout.module.css';
import { Topbar } from './Topbar.jsx';
import { ErrorBoundary } from '../ui/ErrorBoundary.jsx';

export function AppLayout({ children }) {
  const location = useLocation();
  const [openAt, setOpenAt] = useState(null);
  const drawerOpen = openAt === location.pathname;
  const { settings } = useApp();

  useEffect(() => {
    let theme = settings.theme;
    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      theme = prefersDark ? 'dark' : 'light';
    }
    document.documentElement.setAttribute('data-theme', theme);
  }, [settings.theme]);

  const closeDrawer = () => {
    if (openAt !== null) setOpenAt(null);
  };

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <div className={styles['app-shell']}>
        <Sidebar />

        {/* Mobile drawer */}
        <div
          className={`${styles.drawer}${drawerOpen ? ` ${styles['drawer-open']}` : ''}`}
          inert={drawerOpen ? undefined : true}
          aria-hidden={!drawerOpen}
        >
          <Sidebar onNavigate={() => setOpenAt(null)} labelled={false} />
        </div>
        {drawerOpen ? (
          <div className={styles['drawer-backdrop']} onClick={closeDrawer} aria-hidden="true" />
        ) : null}

        {/* Main shell */}
        <div className={styles['shell-main']}>
          <Topbar onMenu={() => setOpenAt(location.pathname)} />
          <main id="main-content" className={styles.content} tabIndex={-1}>
            <ErrorBoundary key={location.pathname}>{children}</ErrorBoundary>
          </main>
        </div>
      </div>
    </>
  );
}