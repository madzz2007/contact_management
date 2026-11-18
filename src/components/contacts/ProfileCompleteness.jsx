/* Profile completeness — an SVG progress ring + health label + missing fields. */

import { computeCompleteness, healthBucket } from '../../utils/completeness.js';

export function ProfileCompleteness({ contact, size = 'md', showMissing = true }) {
  const { percent, missing } = computeCompleteness(contact);
  const health = healthBucket(percent);
  const r = size === 'lg' ? 30 : 20;
  const stroke = size === 'lg' ? 5 : 4;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (circumference * percent) / 100;
  const box = 2 * r + stroke * 2;

  return (
    <div className={`profile-completeness pc-${size}`}>
      <div
        className="pc-ringwrap"
        role="img"
        aria-label={`Profile ${percent}% complete`}
        style={{ width: box, height: box }}
      >
        <svg width={box} height={box} viewBox={`0 0 ${box} ${box}`} aria-hidden="true">
          <circle cx={box / 2} cy={box / 2} r={r} fill="none" stroke="var(--line)" strokeWidth={stroke} />
          <circle
            cx={box / 2}
            cy={box / 2}
            r={r}
            fill="none"
            stroke="var(--accent)"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={offset}
            transform={`rotate(-90 ${box / 2} ${box / 2})`}
          />
        </svg>
        <span className="pc-percent">{percent}%</span>
      </div>
      <div className="pc-info">
        <strong>Profile Completeness</strong>
        <span className={`pc-health pc-health-${health.tone}`}>{health.label}</span>
        {missing.length === 0 ? (
          <p className="pc-done">{'Complete profile — nice work!'}</p>
        ) : (
          showMissing && size !== 'sm' ? <p className="pc-missing muted">Missing: {missing.join(', ')}</p> : null
        )}
      </div>
    </div>
  );
}