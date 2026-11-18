/* Settings — appearance, default view, notification preferences, data management. */

import { useRef, useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { ConfirmDialog } from '../components/ui/ConfirmDialog.jsx';
import { Icon } from '../components/ui/Icon.jsx';
import { contactsToCsv, csvToContacts } from '../utils/csv.js';
import { downloadTextFile } from '../utils/vcard.js';
import { storageUsage, formatBytes } from '../services/storage.js';
import { APP_NAME, APP_VERSION } from '../constants.js';

const THEME_OPTIONS = [
  { id: 'light', label: 'Light', icon: 'sun', desc: 'Bright and airy' },
  { id: 'dark', label: 'Dark', icon: 'moon', desc: 'Easy on the eyes' },
  { id: 'system', label: 'System', icon: 'monitor', desc: 'Follow your OS' },
];

const NOTIFY_OPTIONS = [
  { id: 'birthdays', label: 'Upcoming birthdays' },
  { id: 'events', label: 'Upcoming events' },
  { id: 'followUps', label: 'Follow-up reminders' },
  { id: 'incomplete', label: 'Incomplete profiles' },
];

export function SettingsPage() {
  const { settings, changeSettings, contacts, addManyContacts, restoreDemoData, clearAllData, pushNotification } = useApp();
  const toast = useToast();
  const fileRef = useRef(null);
  const [importResult, setImportResult] = useState(null);
  const [confirmRestore, setConfirmRestore] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  const exportAll = () => {
    downloadTextFile({
      filename: 'connectsphere-contacts.csv',
      content: contactsToCsv(contacts),
      mime: 'text/csv',
    });
    toast.success('Your contacts are being exported as CSV.');
    pushNotification({ type: 'info', title: 'Export', body: 'All contacts exported as a CSV file.' });
  };

  const onFile = (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImportResult(csvToContacts(reader.result, contacts));
    reader.onerror = () => toast.error('Could not read that file.');
    reader.readAsText(file);
  };

  const doImport = () => {
    if (!importResult || !importResult.imported.length) return;
    const added = addManyContacts(importResult.imported);
    toast.success(`${added.length} contact${added.length === 1 ? '' : 's'} imported.`);
    pushNotification({ type: 'success', title: 'Import complete', body: `${added.length} contacts added.` });
    setImportResult(null);
  };

  const doRestore = () => {
    setConfirmRestore(false);
    restoreDemoData();
    toast.info('Demo data restored.');
  };

  const doClear = () => {
    setConfirmClear(false);
    clearAllData();
    toast.info('All data cleared.');
  };

  return (
    <section className="page settings-page">
      <div className="page-head">
        <div>
          <h1>Settings</h1>
          <p className="page-sub muted">Tune {APP_NAME} to the way you work.</p>
        </div>
      </div>

      <div className="settings-stack">
        <section className="card card-pad settings-section">
          <h3>Appearance</h3>
          <div className="theme-grid" role="radiogroup" aria-label="Theme">
            {THEME_OPTIONS.map((t) => (
              <button
                key={t.id}
                type="button"
                role="radio"
                aria-checked={settings.theme === t.id}
                className={`theme-pick${settings.theme === t.id ? ' active' : ''}`}
                onClick={() => changeSettings({ theme: t.id })}
              >
                <Icon name={t.icon} size={22} label="" />
                <strong>{t.label}</strong>
                <span className="muted small">{t.desc}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="card card-pad settings-section">
          <h3>Default contact view</h3>
          <div className="segmented" role="group" aria-label="Default contact view">
            <button
              type="button"
              className={`seg-btn${settings.defaultView === 'grid' ? ' active' : ''}`}
              aria-pressed={settings.defaultView === 'grid'}
              onClick={() => changeSettings({ defaultView: 'grid' })}
            >
              <Icon name="grid" size={15} label="" /> Grid
            </button>
            <button
              type="button"
              className={`seg-btn${settings.defaultView === 'list' ? ' active' : ''}`}
              aria-pressed={settings.defaultView === 'list'}
              onClick={() => changeSettings({ defaultView: 'list' })}
            >
              <Icon name="list" size={15} label="" /> List
            </button>
          </div>
        </section>

        <section className="card card-pad settings-section">
          <h3>Notification preferences</h3>
          <div className="toggle-list">
            {NOTIFY_OPTIONS.map((n) => (
              <label key={n.id} className="checkbox-field">
                <input
                  type="checkbox"
                  checked={settings.notify[n.id]}
                  onChange={(e) => changeSettings({ notify: { ...settings.notify, [n.id]: e.target.checked } })}
                />
                <span>{n.label}</span>
              </label>
            ))}
          </div>
          <p className="muted small">These feed the bell panel and dashboard reminders — no push notifications are used.</p>
        </section>

        <section className="card card-pad settings-section">
          <h3>Data management</h3>
          <div className="dm-actions">
            <button type="button" className="btn btn-ghost" onClick={exportAll}>
              <Icon name="download" size={15} label="" /> Export All Contacts (CSV)
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => fileRef.current?.click()}>
              <Icon name="upload" size={15} label="" /> Import Contacts (CSV)
            </button>
            <input ref={fileRef} type="file" accept=".csv,text/csv" className="sr-only" aria-label="Import contacts from a CSV file" onChange={onFile} />
            <button type="button" className="btn btn-ghost" onClick={() => setConfirmRestore(true)}>
              <Icon name="refresh" size={15} label="" /> Restore Demo Data
            </button>
            <button type="button" className="btn btn-danger" onClick={() => setConfirmClear(true)}>
              <Icon name="trash" size={15} label="" /> Clear All Data
            </button>
          </div>

          {importResult ? (
            <div className="import-report">
              {importResult.error ? (
                <p className="muted" role="alert">{importResult.error}</p>
              ) : (
                <>
                  <h4>Import preview</h4>
                  <p>
                    {importResult.imported.length} ready to import · {importResult.duplicates.length} duplicates skipped · {importResult.invalid.length} invalid rows
                  </p>
                  {importResult.invalid.length ? (
                    <ul className="import-invalid">
                      {importResult.invalid.slice(0, 6).map((r) => (
                        <li key={r.row} className="muted">Row {r.row}: {r.reason}</li>
                      ))}
                    </ul>
                  ) : null}
                  <div className="form-actions">
                    <button type="button" className="btn btn-primary" disabled={!importResult.imported.length} onClick={doImport}>
                      Import {importResult.imported.length || ''} now
                    </button>
                    <button type="button" className="btn btn-ghost" onClick={() => setImportResult(null)}>Discard</button>
                  </div>
                </>
              )}
            </div>
          ) : null}

          <p className="muted small">Storage used: {formatBytes(storageUsage())} · everything stays in this browser.</p>
        </section>

        <section className="card card-pad settings-section">
          <h3>About</h3>
          <p><strong>{APP_NAME}</strong> <span className="muted">v{APP_VERSION}</span></p>
          <p className="muted">Smart Contact &amp; Relationship Manager · React + React Router · data in your browser’s localStorage.</p>
        </section>
      </div>

      <ConfirmDialog
        open={confirmRestore}
        title="Restore demo data?"
        message="This replaces your current contacts, interactions and events with the original demo set. Your changes will be lost."
        confirmLabel="Restore demo"
        onConfirm={doRestore}
        onCancel={() => setConfirmRestore(false)}
      />
      <ConfirmDialog
        open={confirmClear}
        title="Clear all data?"
        message="This permanently deletes every contact, interaction, event, note and setting stored in this browser. There is no undo."
        confirmLabel="Clear everything"
        onConfirm={doClear}
        onCancel={() => setConfirmClear(false)}
      />
    </section>
  );
}