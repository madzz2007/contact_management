/* Central place for app-wide constants, vocabularies and small mappers. */

export const APP_NAME = 'ContactVault';
export const APP_TAGLINE = 'A modern digital address book';
export const APP_VERSION = '1.0';

/* Alphabet used by the directory index (signature feature). */
export const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

/* Contact list filters. */
export const CONTACT_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'favorites', label: 'Favorites' },
  { id: 'has-phone', label: 'With Phone' },
  { id: 'has-email', label: 'With Email' },
];

/* Contact list sorting. */
export const CONTACT_SORTS = [
  { id: 'name-asc', label: 'A-Z' },
  { id: 'name-desc', label: 'Z-A' },
  { id: 'recently-added', label: 'Recently Added' },
];

/* Tag suggestions shown while typing in the form. */
export const TAG_SUGGESTIONS = ['College', 'Friend', 'Work', 'Client', 'Important', 'Family', 'Design', 'VIP'];

export const RELATIONSHIPS = ['Family', 'Friend', 'Classmate', 'Teacher', 'Colleague', 'Client', 'Mentor', 'Neighbor', 'Professional', 'Other'];
export const RELATIONSHIP_COLORS = {
  Family: '#d4547c', Friend: '#0b8477', Classmate: '#3b7fd4', Teacher: '#7c5cd4',
  Colleague: '#4f63d8', Client: '#c97a2b', Mentor: '#3d9a5f', Neighbor: '#8f6c3f',
  Professional: '#5c7080', Other: '#7a8a86',
};
export const PEOPLE_GROUPS = [
  { id: 'family', label: 'Family', relationships: ['Family'] },
  { id: 'friends', label: 'Friends', relationships: ['Friend'] },
  { id: 'college', label: 'College', relationships: ['Classmate', 'Teacher'] },
  { id: 'professional', label: 'Professional', relationships: ['Colleague', 'Client', 'Mentor', 'Professional'] },
  { id: 'others', label: 'Others', relationships: ['Neighbor', 'Other'] },
];
export const SORT_OPTIONS = [
  { id: 'name-asc', label: 'Name (A-Z)' }, { id: 'name-desc', label: 'Name (Z-A)' },
  { id: 'recently-added', label: 'Recently added' }, { id: 'recently-contacted', label: 'Recently contacted' },
];
export const SMART_FILTERS = [
  { id: 'all', label: 'All Contacts' }, { id: 'recently-added', label: 'Recently Added' },
  { id: 'recently-contacted', label: 'Recently Contacted' }, { id: 'needs-followup', label: 'Needs Follow-up' },
  { id: 'incomplete', label: 'Incomplete Profiles' }, { id: 'favorites', label: 'Favorites' },
  { id: 'has-birthday', label: 'Has Birthday' }, { id: 'has-email', label: 'Has Email' }, { id: 'has-phone', label: 'Has Phone' },
];
export const INTERACTION_TYPES = ['Phone Call', 'Message', 'Email', 'Meeting', 'Video Call', 'Other'];
export const INTERACTION_ICONS = { 'Phone Call': 'phone', Message: 'message', Email: 'mail', Meeting: 'users', 'Video Call': 'video', Other: 'note' };
export const EVENT_TYPES = ['Birthday', 'Anniversary', 'Meeting', 'Custom Event'];
export const EVENT_EMOJI = { Birthday: '🎂', Anniversary: '💕', Meeting: '📅', 'Custom Event': '⭐' };
export const NAV_ITEMS = [
  { to: '/dashboard', icon: 'dashboard', label: 'Dashboard' }, { to: '/contacts', icon: 'contacts', label: 'Contacts' },
  { to: '/favorites', icon: 'star', label: 'Favorites' }, { to: '/events', icon: 'calendar', label: 'Events' },
  { to: '/interactions', icon: 'message', label: 'Interactions' },
  { to: '/contact-sharing', icon: 'share', label: 'Contact Sharing' },
];
export const DEMO_USER = { name: 'Alex Morgan', role: 'Personal workspace', initials: 'AM' };
export const FOLLOW_UP_DAYS = 14;
export const SOON_DAYS = 7;
export const RECENT_DAYS = 7;