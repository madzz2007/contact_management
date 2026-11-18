/*
 * Full contact form shared by Add and Edit.
 * Validates live, runs duplicate detection on save, and resizes profile
 * photos to a compact data-URL before storing.
 */

import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { RELATIONSHIPS, TAG_SUGGESTIONS } from '../../constants.js';
import { validateContact, validateField, findPotentialDuplicates, duplicateReason } from '../../utils/validation.js';
import { uid } from '../../services/storage.js';
import { Icon } from '../ui/Icon.jsx';
import { ContactAvatar } from './ContactAvatar.jsx';
import { TagBadge } from './TagBadge.jsx';

const BLANK = {
  firstName: '', lastName: '', phone: '', altPhone: '', email: '', company: '',
  jobTitle: '', relationship: '', address: '', city: '', state: '', country: '',
  website: '', birthday: '', tags: [], notesText: '', photo: '', favorite: false,
};

const FIELDS = Object.keys(BLANK);

export function ContactForm({ initial, submitLabel, onSubmit, onCancel, onReset, mode = 'add' }) {
  const { contacts } = useApp();
  const toast = useToast();

  const [data, setData] = useState(() => ({ ...BLANK, tags: [], ...(initial || {}) }));
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [duplicates, setDuplicates] = useState([]);
  const [tagDraft, setTagDraft] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const photoInputRef = useRef(null);

  const set = (key, value) => setData((prev) => ({ ...prev, [key]: value }));

  const handleChange = (e) => {
    set(e.target.name, e.target.type === 'checkbox' ? e.target.checked : e.target.value);
    if (e.target.name === 'relationship' && e.target.value) {
      const inline = validateField('relationship', 'x');
      if (inline) setErrors((prev) => ({ ...prev, relationship: '' }));
    }
  };

  const handleBlur = (e) => {
    const err = validateField(e.target.name, e.target.value);
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
    if (err) setErrors((prev) => ({ ...prev, [e.target.name]: err }));
  };

  /* --------------------------------- tags --------------------------------- */

  const addTag = (value) => {
    const v = String(value || '').trim().replace(/,+$/, '');
    if (!v) return;
    if (!data.tags.includes(v)) set('tags', [...data.tags, v]);
    setTagDraft('');
    setShowSuggestions(false);
  };

  const removeTag = (t) => set('tags', data.tags.filter((x) => x !== t));

  const tagSuggestions = TAG_SUGGESTIONS.filter((t) => !data.tags.includes(t) && t.toLowerCase().includes(tagDraft.trim().toLowerCase()));

  /* -------------------------------- photo ---------------------------------- */

  const handlePhotoFile = (file) => {
    if (!file) return;
    if (!file.type || !file.type.startsWith('image/')) {
      toast.error('Please choose an image file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image is too large — 5 MB maximum.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        const max = 256;
        const scale = Math.min(1, max / Math.max(image.width, image.height));
        const canvas = document.getElementById('contact-photo-canvas');
        if (!canvas) return;
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));
        const ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        try {
          set('photo', canvas.toDataURL('image/jpeg', 0.85));
        } catch {
          toast.error('Could not process this image.');
        }
      };
      image.src = reader.result;
    };
    reader.onerror = () => toast.error('Could not read that file.');
    reader.readAsDataURL(file);
  };

  /* -------------------------------- notes ---------------------------------- */

  const buildNotes = (text) => {
    const value = String(text || '').trim();
    const existing = Array.isArray(initial?.notes) ? [...initial.notes] : [];
    if (!value) return existing;
    const last = existing.length ? String(existing[existing.length - 1].text || '') : '';
    if (last === value) return existing;
    return [...existing, { id: uid('nt'), text: value, createdAt: new Date().toISOString() }];
  };

  /* ------------------------------- submit ----------------------------------- */

  const runSubmit = (overrideDuplicate) => {
    const { valid, errors: errs } = validateContact(data);
    setErrors(errs);
    setTouched(FIELDS.reduce((acc, f) => ({ ...acc, [f]: true }), {}));
    if (!valid) {
      toast.error('Please fix the highlighted fields.');
      return;
    }
    if (!overrideDuplicate) {
      const dups = findPotentialDuplicates(contacts, data, initial?.id);
      if (dups.length > 0) {
        setDuplicates(dups);
        return;
      }
    }
    setDuplicates([]);
    onSubmit({
      ...data,
      tags: [...data.tags],
      notes: buildNotes(data.notesText),
      notesText: undefined,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    runSubmit(false);
  };

  const continueAnyway = () => {
    setDuplicates([]);
    runSubmit(true);
  };

  const reset = () => {
    if (onReset) {
      onReset();
    } else {
      setData({ ...BLANK, tags: [], relationship: '' });
      setErrors({});
      setTouched({});
      setDuplicates([]);
    }
  };

  const fieldError = (name) => (touched[name] && errors[name] ? (
    <span className="field-error" role="alert">{errors[name]}</span>
  ) : null);

  return (
    <form className="contact-form" noValidate onSubmit={handleSubmit}>
      <canvas id="contact-photo-canvas" width="1" height="1" style={{ display: 'none' }} />

      {duplicates.length > 0 ? (
        <div className="dup-banner" role="alert">
          <h4><Icon name="alert" size={18} label="" /> Possible duplicate contact</h4>
          <p className="muted">
            The details below match {duplicates.length === 1 ? 'an existing contact' : 'existing contacts'}.
          </p>
          <ul className="dup-list">
            {duplicates.map((dup) => (
              <li key={dup.id} className="dup-item">
                <ContactAvatar contact={dup} size={34} />
                <div className="dup-meta">
                  <strong>{`${dup.firstName} ${dup.lastName}`.trim()}</strong>
                  <span className="muted">
                    {duplicateReason(dup, data)} · {dup.company || dup.relationship || '—'}
                  </span>
                </div>
                <Link to={`/contacts/${dup.id}`} className="btn btn-ghost btn-sm">View existing</Link>
              </li>
            ))}
          </ul>
          <div className="dup-actions">
            <button type="button" className="btn btn-ghost" onClick={() => setDuplicates([])}>
              Cancel
            </button>
            <button type="button" className="btn btn-danger" onClick={continueAnyway}>
              Continue anyway
            </button>
          </div>
        </div>
      ) : null}

      <fieldset className="form-section">
        <legend>Basic information</legend>
        <div className="form-grid">
          <div className="field">
            <label htmlFor="cf-firstName">First name <abbr title="required">*</abbr></label>
            <input id="cf-firstName" name="firstName" value={data.firstName} autoFocus placeholder="Aarav" autoComplete="given-name" onChange={handleChange} onBlur={handleBlur} aria-invalid={Boolean(touched.firstName && errors.firstName)} />
            {fieldError('firstName')}
          </div>
          <div className="field">
            <label htmlFor="cf-lastName">Last name</label>
            <input id="cf-lastName" name="lastName" value={data.lastName} placeholder="Sharma" autoComplete="family-name" onChange={handleChange} onBlur={handleBlur} aria-invalid={Boolean(touched.lastName && errors.lastName)} />
            {fieldError('lastName')}
          </div>
          <div className="field">
            <label htmlFor="cf-phone">Phone <abbr title="required">*</abbr></label>
            <input id="cf-phone" name="phone" type="tel" value={data.phone} placeholder="+91 98450 12345" autoComplete="tel" onChange={handleChange} onBlur={handleBlur} aria-invalid={Boolean(touched.phone && errors.phone)} />
            {fieldError('phone')}
          </div>
          <div className="field">
            <label htmlFor="cf-altPhone">Alternate phone</label>
            <input id="cf-altPhone" name="altPhone" type="tel" value={data.altPhone} placeholder="+91 …" autoComplete="tel" onChange={handleChange} onBlur={handleBlur} aria-invalid={Boolean(touched.altPhone && errors.altPhone)} />
            {fieldError('altPhone')}
          </div>
        </div>
      </fieldset>

      <fieldset className="form-section">
        <legend>Address</legend>
        <div className="form-grid">
          <div className="field field-wide">
            <label htmlFor="cf-address">Street address</label>
            <input id="cf-address" name="address" value={data.address} placeholder="4th Cross, Indiranagar" autoComplete="street-address" onChange={handleChange} onBlur={handleBlur} />
          </div>
          <div className="field">
            <label htmlFor="cf-city">City</label>
            <input id="cf-city" name="city" value={data.city} placeholder="Bengaluru" autoComplete="address-level2" onChange={handleChange} onBlur={handleBlur} />
          </div>
          <div className="field">
            <label htmlFor="cf-state">State / Province</label>
            <input id="cf-state" name="state" value={data.state} placeholder="Karnataka" autoComplete="address-level1" onChange={handleChange} onBlur={handleBlur} />
          </div>
          <div className="field field-wide">
            <label htmlFor="cf-country">Country</label>
            <input id="cf-country" name="country" value={data.country} placeholder="India" autoComplete="country-name" onChange={handleChange} onBlur={handleBlur} />
          </div>
        </div>
      </fieldset>

      <fieldset className="form-section">
        <legend>Relationship</legend>
        <div className="form-grid">
          <div className="field">
            <label htmlFor="cf-relationship">Relationship</label>
            <select id="cf-relationship" name="relationship" value={data.relationship} onChange={handleChange} onBlur={handleBlur}>
              <option value="">Select a relationship…</option>
              {RELATIONSHIPS.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="cf-birthday">Birthday</label>
            <input id="cf-birthday" name="birthday" type="date" value={data.birthday} onChange={handleChange} onBlur={handleBlur} aria-invalid={Boolean(touched.birthday && errors.birthday)} />
            {fieldError('birthday')}
          </div>
          <label className="checkbox-field">
            <input type="checkbox" name="favorite" checked={data.favorite} onChange={handleChange} />
            <span>Mark as <strong>favorite</strong> — pinned for quick access</span>
          </label>
        </div>
      </fieldset>

      <fieldset className="form-section">
        <legend>Tags</legend>
        <div className="tags-field">
          <div className="tag-chips" aria-label="Selected tags">
            {data.tags.map((t) => <TagBadge key={t} tag={t} onRemove={() => removeTag(t)} />)}
            {data.tags.length === 0 ? <span className="muted small">No tags yet.</span> : null}
          </div>
          <div className="tag-input-wrap">
            <label className="sr-only" htmlFor="cf-tags">Add a tag</label>
            <input
              id="cf-tags"
              value={tagDraft}
              placeholder="Add a tag (Important, College, Work, VIP…) and press Enter"
              onChange={(e) => { setTagDraft(e.target.value); setShowSuggestions(true); }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ',') {
                  e.preventDefault();
                  addTag(tagDraft);
                } else if (e.key === 'Backspace' && !tagDraft && data.tags.length) {
                  removeTag(data.tags[data.tags.length - 1]);
                }
              }}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 140)}
            />
            {showSuggestions && tagDraft.trim() ? (
              <div className="tag-suggestions" role="listbox">
                {tagSuggestions.map((t) => (
                  <button key={t} type="button" role="option" onClick={() => addTag(t)}>{t}</button>
                ))}
                {tagSuggestions.length === 0 ? <span className="muted small">{`Press Enter to add “${tagDraft.trim()}”`}</span> : null}
              </div>
            ) : null}
          </div>
        </div>
      </fieldset>
<fieldset className="form-section">
        <legend>Contact details</legend>
        <div className="form-grid">
          <div className="field">
            <label htmlFor="cf-email">Email</label>
            <input id="cf-email" name="email" type="email" value={data.email} placeholder="aarav@example.com" autoComplete="email" onChange={handleChange} onBlur={handleBlur} aria-invalid={Boolean(touched.email && errors.email)} />
            {fieldError('email')}
          </div>
          <div className="field">
            <label htmlFor="cf-company">Company</label>
            <input id="cf-company" name="company" value={data.company} placeholder="Nimbus Labs" autoComplete="organization" onChange={handleChange} onBlur={handleBlur} />
          </div>
          <div className="field">
            <label htmlFor="cf-jobTitle">Job title</label>
            <input id="cf-jobTitle" name="jobTitle" value={data.jobTitle} placeholder="Product Designer" autoComplete="organization-title" onChange={handleChange} onBlur={handleBlur} />
          </div>
          <div className="field">
            <label htmlFor="cf-website">Website</label>
            <input id="cf-website" name="website" value={data.website} placeholder="example.com" inputMode="url" onChange={handleChange} onBlur={handleBlur} aria-invalid={Boolean(touched.website && errors.website)} />
            {fieldError('website')}
          </div>
        </div>
      </fieldset>

      <fieldset className="form-section">
        <legend>Notes</legend>
        <div className="field field-wide">
          <label htmlFor="cf-notesText">Notes {mode === 'edit' ? <span className="muted">— saving adds a new note</span> : null}</label>
          <textarea
            id="cf-notesText"
            name="notesText"
            rows={4}
            value={data.notesText}
            placeholder="e.g. Met during the college hackathon. Interested in working together…"
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </div>
      </fieldset>

      <fieldset className="form-section">
        <legend>Profile photo</legend>
        <div className="photo-field">
          <span className="photo-preview">
            {data.photo
              ? <img src={data.photo} alt="Contact photo preview" className="photo-preview-img" />
              : <ContactAvatar contact={data} size={72} />}
          </span>
          <div className="photo-actions">
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => photoInputRef.current?.click()}>
              <Icon name="upload" size={15} label="" /> Choose photo
            </button>
            <input ref={photoInputRef} type="file" accept="image/*" className="sr-only" aria-label="Upload a profile photo" onChange={(e) => { handlePhotoFile(e.target.files?.[0]); e.target.value = ''; }} />
            {data.photo ? (
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => set('photo', '')}>
                <Icon name="trash" size={15} label="" /> Remove
              </button>
            ) : null}
            <span className="muted small">Optional · resized to 256px · stored locally</span>
          </div>
        </div>
      </fieldset>

      <div className="form-actions">
        {onCancel ? (
          <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button>
        ) : null}
        <button type="button" className="btn btn-ghost" onClick={reset}>
          <Icon name="refresh" size={15} label="" /> {mode === 'edit' ? 'Discard changes' : 'Reset'}
        </button>
        <button type="submit" className="btn btn-primary">{submitLabel || 'Save Contact'}</button>
      </div>
    </form>
  );
}