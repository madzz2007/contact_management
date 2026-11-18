/*
 * Central application state for ContactVault. Components never touch
 * localStorage directly — every mutation flows through these methods,
 * which persist via services/.
 */
/* oxlint-disable react/only-export-components */

import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { AppContext } from './appContextData.js';
import { KEYS, readJSON, writeJSON } from '../services/storage.js';
import {
  getContacts as svcGetContacts, getContactById, addContact as svcAddContact,
  addContacts as svcAddContacts, updateContact as svcUpdateContact,
  deleteContact as svcDeleteContact, toggleFavorite as svcToggleFavorite,
} from '../services/contactService.js';
import { getSettings as svcGetSettings, updateSettings as svcUpdateSettings } from '../services/settingsService.js';
import { applyTheme, watchSystemTheme, unwatchSystemTheme } from '../hooks/useTheme.js';
import { buildDemoContacts } from '../data/demoData.js';

/* ---- interaction helpers ---- */
function readInteractions() {
  const raw = readJSON(KEYS.interactions, []);
  return Array.isArray(raw) ? raw : [];
}
function writeInteractions(list) { writeJSON(KEYS.interactions, list); }

/* ---- event helpers ---- */
function readEvents() {
  const raw = readJSON(KEYS.events, []);
  return Array.isArray(raw) ? raw : [];
}
function writeEvents(list) { writeJSON(KEYS.events, list); }

function readActivity() {
  const raw = readJSON(KEYS.activity, []);
  return Array.isArray(raw) ? raw : [];
}

/* ---- recently-viewed helpers ---- */
const MAX_RECENT = 10;
function readRecent() {
  const raw = readJSON(KEYS.recent, []);
  return Array.isArray(raw) ? raw : [];
}
function pushRecent(id) {
  const prev = readRecent().filter((x) => x !== id);
  const next = [id, ...prev].slice(0, MAX_RECENT);
  writeJSON(KEYS.recent, next);
  return next;
}

export function AppProvider({ children }) {
  const [contacts, setContacts] = useState([]);
  const [interactions, setInteractions] = useState([]);
  const [events, setEvents] = useState([]);
  const [recent, setRecent] = useState([]);
  const [activity, setActivity] = useState([]);
  const [settings, setSettings] = useState(svcGetSettings());
  const [now, setNow] = useState(() => new Date());
  const seededRef = useRef(false);

  /* Seed demo data + hydrate the store exactly once. */
  useEffect(() => {
    if (seededRef.current) return;
    seededRef.current = true;
    if (readJSON(KEYS.contacts, null) === null) {
      writeJSON(KEYS.contacts, buildDemoContacts(new Date()));
      writeJSON(KEYS.seeded, new Date().toISOString());
    }
    setContacts(svcGetContacts());
    setSettings(svcGetSettings());
    setInteractions(readInteractions());
    setEvents(readEvents());
    setRecent(readRecent());
    setActivity(readActivity());
  }, []);

  /* Refresh the `now` stamp every 30s so relative dates stay current. */
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  /* Theme handling. */
  useEffect(() => {
    applyTheme(settings.theme);
    if (settings.theme !== 'system') return undefined;
    const watched = watchSystemTheme(() => applyTheme('system'));
    return () => unwatchSystemTheme(watched);
  }, [settings.theme]);

  /* ------------------------------- contacts ------------------------------- */

  const addContact = useCallback((data) => {
    const created = svcAddContact(data);
    if (created) setContacts(svcGetContacts());
    return created;
  }, []);

  const addManyContacts = useCallback((list) => {
    const added = svcAddContacts(list);
    if (added.length) setContacts(svcGetContacts());
    return added;
  }, []);

  const updateContact = useCallback((id, patch) => {
    const updated = svcUpdateContact(id, patch);
    if (updated) setContacts(svcGetContacts());
    return updated;
  }, []);

  const deleteContact = useCallback((id) => {
    svcDeleteContact(id);
    setContacts(svcGetContacts());
  }, []);

  const toggleFavorite = useCallback((id) => {
    const updated = svcToggleFavorite(id);
    if (updated) setContacts(svcGetContacts());
    return updated;
  }, []);

  /* Track a recently-viewed contact */
  const viewContact = useCallback((id) => {
    setRecent(pushRecent(id));
  }, []);

  /* ------------------------------- interactions ---------------------------- */

  const addInteraction = useCallback((interaction) => {
    const next = [...readInteractions(), interaction];
    writeInteractions(next);
    setInteractions(next);
    return interaction;
  }, []);

  const deleteInteraction = useCallback((id) => {
    const next = readInteractions().filter((i) => i.id !== id);
    writeInteractions(next);
    setInteractions(next);
  }, []);

  const getInteractionsFor = useCallback((contactId) => (
    interactions
      .filter((interaction) => interaction.contactId === contactId)
      .sort((a, b) => `${b.date || ''}T${b.time || ''}`.localeCompare(`${a.date || ''}T${a.time || ''}`))
  ), [interactions]);

  const getLastInteractionForContact = useCallback((contactId) => getInteractionsFor(contactId)[0] || null, [getInteractionsFor]);

  /* --------------------------------- events -------------------------------- */

  const addEvent = useCallback((event) => {
    const next = [...readEvents(), event];
    writeEvents(next);
    setEvents(next);
    return event;
  }, []);

  const deleteEvent = useCallback((id) => {
    const next = readEvents().filter((e) => e.id !== id);
    writeEvents(next);
    setEvents(next);
  }, []);

  const pushNotification = useCallback((notification) => {
    const next = [{
      id: `activity_${Date.now()}`,
      createdAt: new Date().toISOString(),
      read: false,
      ...notification,
    }, ...readActivity()].slice(0, 40);
    writeJSON(KEYS.activity, next);
    setActivity(next);
  }, []);

  const markAllRead = useCallback(() => {
    const next = readActivity().map((item) => ({ ...item, read: true }));
    writeJSON(KEYS.activity, next);
    setActivity(next);
  }, []);

  const clearAllNotifications = useCallback(() => {
    writeJSON(KEYS.activity, []);
    setActivity([]);
  }, []);

  /* ------------------------------- settings ------------------------------- */

  const changeSettings = useCallback((patch) => {
    const next = svcUpdateSettings(patch);
    setSettings(next);
    return next;
  }, []);

  const value = {
    contacts,
    interactions,
    events,
    recent,
    activity,
    settings,
    now,
    addContact,
    addManyContacts,
    updateContact,
    deleteContact,
    toggleFavorite,
    getContactById,
    viewContact,
    pushRecentView: viewContact,
    addInteraction,
    deleteInteraction,
    getInteractionsFor,
    getLastInteractionForContact,
    removeInteraction: deleteInteraction,
    addEvent,
    deleteEvent,
    removeEvent: deleteEvent,
    pushNotification,
    markAllRead,
    clearAllNotifications,
    changeSettings,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  return useContext(AppContext);
}