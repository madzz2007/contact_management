/* Help page — quick start, features, keyboard shortcuts, FAQ. */

import { Icon } from '../components/ui/Icon.jsx';
import { APP_NAME, APP_VERSION } from '../constants.js';

export function HelpPage() {
  const steps = [
    { icon: 'plus', title: 'Add your first contact', body: 'Use “Add Contact” or the top-bar “Quick Add”. Phone and name are all you strictly need.' },
    { icon: 'star', title: 'Star the people that matter', body: 'Marking a contact as favorite puts it one click away on the Favorites page.' },
    { icon: 'message', title: 'Log interactions', body: 'Every call, email or meeting goes on the interaction timeline so you always know when you last connected.' },
    { icon: 'calendar', title: 'Track important dates', body: 'Birthdays, anniversaries and meetings appear on the Events page and on the dashboard before they arrive.' },
    { icon: 'share', title: 'Share or export', body: 'Share a contact card, download a vCard (.vcf), or generate a QR code your phone can scan.' },
    { icon: 'tag', title: 'Tag and filter', body: 'Apply tags and relationship types, then slice the directory with smart filters and sorting.' },
  ];
  const shortcuts = [
    ['Ctrl / ⌘ + K', 'Focus the global search'],
    ['/  (anywhere)', 'Focus the global search'],
    ['Enter (in search)', 'Open the top match'],
    ['Esc', 'Close dialogs, menus and search'],
  ];
  const faqs = [
    { q: 'Where is my data stored?', a: 'Everything lives in your browser’s localStorage under the “connectsphere.v1” keys. Nothing is uploaded anywhere, so you stay in full control.' },
    { q: 'Can I move my contacts to another app?', a: 'Yes — use Settings → Data Management → Export All Contacts to download a CSV, or export individual vCard files from any profile.' },
    { q: 'How does duplicate detection work?', a: 'When the phone number or email you enter matches an existing contact, you are asked to confirm before saving — nothing is created silently.' },
    { q: 'What does “Needs follow-up” mean?', a: 'A contact with no interaction for more than 14 days is flagged so that relationships don’t quietly go cold.' },
  ];

  return (
    <section className="page help-page">
      <div className="page-head">
        <h1>Help &amp; Guide</h1>
        <p className="page-sub muted">Everything you need to get the most out of {APP_NAME}.</p>
      </div>

      <div className="help-card card card-pad">
        <h3>Get started in five minutes</h3>
        <ol className="help-steps">
          {steps.map((s) => (
            <li key={s.title} className="help-step">
              <span className="help-step-icon"><Icon name={s.icon} size={20} label="" /></span>
              <div><strong>{s.title}</strong><p className="muted">{s.body}</p></div>
            </li>
          ))}
        </ol>
      </div>

      <div className="help-grid">
        <div className="help-card card card-pad">
          <h3>Keyboard shortcuts</h3>
          <table className="help-keys">
            <tbody>
              {shortcuts.map(([key, action]) => (
                <tr key={key}>
                  <td><kbd>{key.split('  ')[0]}</kbd></td>
                  <td>{action}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="muted small">Tab cycles through controls everywhere, and all icon buttons have accessible labels.</p>
        </div>
        <div className="help-card card card-pad">
          <h3>Frequently asked questions</h3>
          <div className="help-faq">
            {faqs.map((f) => (
              <details key={f.q} className="help-faq-item">
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>

      <p className="help-about muted">
        v{APP_VERSION} · React + React Router + localStorage · Built for the classroom, polished for real life.
      </p>
    </section>
  );
}