import { KEYS, readJSON, writeJSON } from './storage.js';

export function getInteractions() {
  const interactions = readJSON(KEYS.interactions, []);
  return Array.isArray(interactions) ? interactions : [];
}

export function getLastInteractionForContact(contactId) {
  return getInteractions()
    .filter((interaction) => interaction.contactId === contactId)
    .sort((a, b) => `${b.date || ''}T${b.time || ''}`.localeCompare(`${a.date || ''}T${a.time || ''}`))[0] || null;
}

export function addInteraction(interaction) {
  const next = [...getInteractions(), interaction];
  writeJSON(KEYS.interactions, next);
  return interaction;
}
