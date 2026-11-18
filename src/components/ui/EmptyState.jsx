/* Professional empty states so no section ever looks broken or bare. */

import { Icon } from './Icon.jsx';

export function EmptyState({ icon = 'contacts', title, subtitle, actionLabel, onAction, children }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        <Icon name={icon} size={34} label="" />
      </div>
      <h3>{title}</h3>
      {subtitle ? <p>{subtitle}</p> : null}
      {actionLabel && onAction ? (
        <button type="button" className="btn btn-primary" onClick={onAction}>
          {actionLabel}
        </button>
      ) : null}
      {children}
    </div>
  );
}