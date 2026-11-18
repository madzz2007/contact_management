/* Small dashboard statistic card. */

import { Icon } from '../ui/Icon.jsx';

export function StatCard({ icon, label, value, sub, tone = 'accent' }) {
  return (
    <div className="stat-card">
      <span className={`stat-icon stat-tone-${tone}`}>
        <Icon name={icon} size={20} label="" />
      </span>
      <div className="stat-copy">
        <span className="stat-value">{value}</span>
        <span className="stat-label">{label}</span>
        {sub ? <span className="stat-sub muted">{sub}</span> : null}
      </div>
    </div>
  );
}