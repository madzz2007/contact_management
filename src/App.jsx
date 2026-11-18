import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import { AppLayout } from './components/layout/AppLayout.jsx';
import { Dashboard } from './pages/Dashboard.jsx';
import { ContactsPage } from './pages/Contacts.jsx';
import { AddContactPage } from './pages/AddContact.jsx';
import { ContactDetailsPage } from './pages/ContactDetails.jsx';
import { EditContactPage } from './pages/EditContact.jsx';
import { FavoritesPage } from './pages/Favorites.jsx';
import { PeoplePage } from './pages/People.jsx';
import { InteractionsPage } from './pages/Interactions.jsx';
import { EventsPage } from './pages/Events.jsx';
import { ContactSharingPage } from './pages/ContactSharing.jsx';
import { SettingsPage } from './pages/Settings.jsx';
import { HelpPage } from './pages/Help.jsx';
import { NotFoundPage } from './pages/NotFound.jsx';

function App() {
  return (
    <Router>
      <AppProvider>
        <ToastProvider>
          <AppLayout>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/contacts" element={<ContactsPage />} />
              <Route path="/contacts/add" element={<AddContactPage />} />
              <Route path="/contacts/:id" element={<ContactDetailsPage />} />
              <Route path="/contacts/:id/edit" element={<EditContactPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/people" element={<PeoplePage />} />
              <Route path="/interactions" element={<InteractionsPage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/contact-sharing" element={<ContactSharingPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/help" element={<HelpPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </AppLayout>
        </ToastProvider>
      </AppProvider>
    </Router>
  );
}

export default App;
