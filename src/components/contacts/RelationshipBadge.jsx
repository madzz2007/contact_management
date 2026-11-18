/* Relationship chip — soft tinted background with strong colored text (WCAG-safe). */

import { RELATIONSHIP_COLORS } from '../../constants.js';

export function RelationshipBadge({ relationship }) {
  const rel = relationship || 'Other';
  const color = RELATIONSHIP_COLORS[rel] || '#7a8a86';
  return (
    <span className="rel-badge" style={{ backgroundColor: `${color}20`, color }}>
      {rel}
    </span>
  );
}