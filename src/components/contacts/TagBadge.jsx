/* Tag chip with optional remove button. */

import { Icon } from '../ui/Icon.jsx';

export function TagBadge({ tag, onRemove }) {
  if (!tag) return null;
  if (!onRemove) return <span className="tag-chip">{tag}</span>;
  return (
    <span className="tag-chip tag-chip-removable">
      {tag}
      <button type="button" className="tag-remove" aria-label={`Remove tag ${tag}`} onClick={onRemove}>
        <Icon name="x" size={11} label="" />
      </button>
    </span>
  );
}