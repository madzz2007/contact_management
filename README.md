# ConnectSphere — Smart Contact & Relationship Manager

A routing-based contact management system built with **React 19 + React Router 7 + Vite**.
People, interactions, important dates, sharing (vCard/QR), smart filters, global search,
duplicate detection, profile completeness, dark mode — all persisted in `localStorage`
behind a centralized service layer.

## Run it

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build → dist/
npm run preview   # serve the production build
npm run lint      # oxlint
node scripts/smoke.mjs   # 63 logic tests (validation, dates, csv, vcard…)
```

## Routes

| Route | Page |
| --- | --- |
| `/dashboard` | Overview: stats, quick actions, recent/upcoming, health |
| `/contacts` | **View All Contacts** — search, filters, sort, grid/list |
| `/contacts/add` | **Add Contact** — validation + duplicate detection |
| `/contacts/:id` | **Contact Details** — actions, timeline, notes, share |
| `/contacts/:id/edit` | **Edit Contact** (reuses ContactForm) |
| `/favorites` | Starred contacts |
| `/people` | Directory grouped by relationship |
| `/interactions` | Communication timeline |
| `/events` | Important dates (Today / This Week / Later / Past) |
| `/contact-sharing` | Share card, Web Share API, vCard, QR |
| `/settings` | Appearance, notifications, data management |
| `/help` | Guide, shortcuts, FAQ |

Global search lives in the top bar (`Ctrl/⌘ + K` or `/`).

## Architecture

```
src/
  main.jsx, App.jsx          # entry + all routes (AppLayout wraps every page)
  index.css                  # design tokens (light/dark) + base
  styles/                    # layout.css · components.css · pages.css
  constants.js               # relationships, groups, filters, vocabularies
  context/                   # AppContext (state + CRUD) · ToastContext
  hooks/useTheme.js          # light / dark / system
  services/                  # storage, contact/interaction/event/settings/activity
  data/demoData.js           # 15 fictional contacts + interactions + events
  utils/                     # date, validation, completeness, search, csv, vcard, share
  components/
    ui/                      # Icon (inline SVG), Modal, ConfirmDialog, EmptyState, ErrorBoundary, StatCard
    layout/                  # Sidebar, Topbar, GlobalSearch, NotificationPanel, AppLayout
    contacts/                # Avatar, Card, Filters, Form, NoteSection, badges, completeness
    interactions/ events/ share/
  pages/                     # one component per route
scripts/smoke.mjs            # pure-logic test suite
```

Data never touches `localStorage` directly from components — everything flows through
`services/*` (single storage gateway, sanitized reads, quota-safe writes). Recently-viewed
ids are purged automatically when a contact is deleted; bad records can never crash a page
(defensive sanitization + error boundary per route).

## Dependencies

`react`, `react-dom`, `react-router-dom`, `qrcode.react` (QR sharing — the only extra).
Everything else (icons, CSV, vCard, validation) is dependency-free code in `src/utils` and
`src/components/ui/Icon.jsx`.

## Notes / limitations

- Data is per-browser (localStorage); no backend, no sync.
- Birthday/anniversary *events* store the next occurrence at seed time — use “Restore Demo Data” in Settings to refresh them.
- The Web Share API needs a supporting browser; Copy/vCard/QR fallbacks always work.
- Deep links work on the Vite dev server and `vite preview` (SPA fallback). On a static host, enable history fallback.