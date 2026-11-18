/* 404 — friendly fallback for unknown routes. */

import { Link } from 'react-router-dom';
import { Icon } from '../components/ui/Icon.jsx';
import { APP_NAME } from '../constants.js';

export function NotFoundPage() {
  return (
    <section className="page not-found">
      <div className="nf-card">
        <Icon name="search" size={40} label="" />
        <h2>Page not found</h2>
        <p className="muted">
          That address does not exist in {APP_NAME}, or the contact may have moved.
        </p>
        <Link to="/dashboard" className="btn btn-primary">Back to Dashboard</Link>
        <Link to="/contacts" className="btn btn-ghost">All Contacts</Link>
      </div>
    </section>
  );
}