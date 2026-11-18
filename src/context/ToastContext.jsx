/* Toast notifications — non-intrusive feedback in the bottom-right corner. */
/* oxlint-disable react/only-export-components */

import { useContext, useRef, useState } from 'react';
import { ToastContext } from './toastContextData.js';
import { Icon } from '../components/ui/Icon.jsx';

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Map());
  const seq = useRef(0);

  const dismiss = (id) => {
    const timer = timers.current.get(id);
    if (timer) clearTimeout(timer);
    timers.current.delete(id);
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const show = (type, message) => {
    seq.current += 1;
    const id = seq.current;
    setToasts((prev) => [...prev.slice(-3), { id, type, message }]);
    const timer = setTimeout(() => dismiss(id), 4200);
    timers.current.set(id, timer);
  };

  const toast = {
    show,
    success: (msg) => show('success', msg),
    error: (msg) => show('error', msg),
    info: (msg) => show('info', msg),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="toast-stack" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.type}`} role="status">
            <Icon
              name={t.type === 'success' ? 'check' : t.type === 'error' ? 'alert' : 'info'}
              size={16}
              label=""
            />
            <span className="toast-msg">{t.message}</span>
            <button
              type="button"
              className="toast-dismiss"
              aria-label="Dismiss notification"
              onClick={() => dismiss(t.id)}
            >
              <Icon name="x" size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}