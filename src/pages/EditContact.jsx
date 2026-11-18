/* Edit Contact — reuses ContactForm with the contact's current values. */

import { Link, useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { ContactForm } from '../components/contacts/ContactForm.jsx';
import { EmptyState } from '../components/ui/EmptyState.jsx';
import { Icon } from '../components/ui/Icon.jsx';
import { fullName } from '../utils/format.js';

export function EditContactPage() {
  const { id } = useParams();
  const { getContactById, updateContact, pushNotification } = useApp();
  const toast = useToast();
  const navigate = useNavigate();

  const contact = getContactById(id);

  if (!contact) {
    return (
      <section className="page edit-contact-page">
        <EmptyState icon="search" title="Contact not found" subtitle="This profile may have been deleted already.">
          <Link to="/contacts" className="btn btn-primary">Back to Contacts</Link>
        </EmptyState>
      </section>
    );
  }

  const handleSubmit = (draft) => {
    const updated = updateContact(id, draft);
    if (!updated) {
      toast.error('Could not save your changes.');
      return;
    }
    toast.success('Changes saved.');
    pushNotification({ type: 'info', title: 'Contact updated', body: `${fullName(updated)}'s profile was updated.` });
    navigate(`/contacts/${id}`);
  };

  return (
    <section className="page edit-contact-page">
      <div className="page-head">
        <div>
          <h1>Edit Contact</h1>
          <p className="page-sub muted">Update {fullName(contact)} — changes are reflected everywhere instantly.</p>
        </div>
        <button type="button" className="btn btn-ghost" onClick={() => navigate(`/contacts/${id}`)}>
          <Icon name="chevronLeft" size={15} label="" /> Back to profile
        </button>
      </div>

      <ContactForm
        mode="edit"
        initial={contact}
        submitLabel="Save Changes"
        onSubmit={handleSubmit}
        onCancel={() => navigate(`/contacts/${id}`)}
      />
    </section>
  );
}