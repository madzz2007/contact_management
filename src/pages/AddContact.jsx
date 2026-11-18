/* Add Contact page — full form with validation + duplicate detection. */

import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { ContactForm } from '../components/contacts/ContactForm.jsx';
import { Icon } from '../components/ui/Icon.jsx';

export function AddContactPage() {
  const { addContact, pushNotification } = useApp();
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = (draft) => {
    const created = addContact(draft);
    if (!created) {
      toast.error('Could not save the contact.');
      return;
    }
    toast.success(`${`${created.firstName} ${created.lastName}`.trim()} was added to your contacts.`);
    pushNotification({
      type: 'contact',
      title: 'Contact added',
      body: `${`${created.firstName} ${created.lastName}`.trim()} joined your directory.`,
    });
    navigate(`/contacts/${created.id}`);
  };

  return (
    <section className="page add-contact-page">
      <div className="page-head">
        <div>
          <h1>Add a Contact</h1>
          <p className="page-sub muted">New relationships start with a single entry — add what you know now, enrich it later.</p>
        </div>
        <button type="button" className="btn btn-ghost" onClick={() => navigate('/contacts')}>
          <Icon name="chevronLeft" size={15} label="" /> Back to Contacts
        </button>
      </div>

      <ContactForm mode="add" submitLabel="Save Contact" onSubmit={handleSubmit} onCancel={() => navigate('/contacts')} />
    </section>
  );
}