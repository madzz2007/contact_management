/* Avatar: initials on a deterministic color, or the contact photo when set. */

const PALETTE = ['#0b8477', '#3b7fd4', '#7c5cd4', '#d4547c', '#c97a2b', '#3d9a5f', '#4f63d8', '#8f6c3f'];

const initialsFor = (contact) => {
  const first = String(contact?.firstName || '').trim();
  const last = String(contact?.lastName || '').trim();
  const f = first ? first.charAt(0) : '';
  const l = last ? last.charAt(0) : '';
  return (f + l).toUpperCase() || '?';
};

const avatarColor = (contact) => {
  if (!contact) return PALETTE[0];
  const seed = String(contact.id || `${contact.firstName || ''}${contact.lastName || ''}`)
    .split('')
    .reduce((sum, ch) => sum + (ch.charCodeAt(0) || 0), 0);
  return PALETTE[seed % PALETTE.length];
};

export function ContactAvatar({ contact, size = 40, className = '' }) {
  const photo = String(contact?.photo || '');
  if (photo) {
    return (
      <img
        className={`avatar av-img ${className}`}
        style={{ width: size, height: size }}
        src={photo}
        alt=""
      />
    );
  }
  return (
    <span
      className={`avatar ${className}`}
      style={{
        width: size,
        height: size,
        backgroundColor: avatarColor(contact),
        color: '#ffffff',
        fontSize: Math.max(11, Math.round(size * 0.38)),
        lineHeight: `${size}px`,
      }}
      aria-hidden="true"
    >
      {initialsFor(contact)}
    </span>
  );
}