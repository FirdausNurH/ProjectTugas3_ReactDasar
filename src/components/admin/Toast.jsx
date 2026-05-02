import { useState, useEffect, useCallback } from 'react';

// Context-style global toast
let addToastGlobal = null;
const listeners = [];

function notifyListeners(toasts) {
  listeners.forEach(fn => fn(toasts));
}

export function showToast({ type = 'success', title, desc, duration = 3500 }) {
  if (addToastGlobal) {
    addToastGlobal({ type, title, desc, duration });
  }
}

export default function Toast() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    listeners.push(setToasts);
    return () => {
      const idx = listeners.indexOf(setToasts);
      if (idx > -1) listeners.splice(idx, 1);
    };
  }, []);

  const addToast = useCallback((toast) => {
    const id = Date.now() + Math.random();
    const newToast = { ...toast, id, exiting: false };
    setToasts(prev => [...prev, newToast]);

    setTimeout(() => {
      setToasts(prev =>
        prev.map(t => (t.id === id ? { ...t, exiting: true } : t))
      );
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 300);
    }, toast.duration);
  }, []);

  useEffect(() => {
    addToastGlobal = addToast;
  }, [addToast]);

  const removeToast = (id) => {
    setToasts(prev =>
      prev.map(t => (t.id === id ? { ...t, exiting: true } : t))
    );
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 300);
  };

  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
  };

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast toast-${toast.type} ${toast.exiting ? 'toast-exit' : ''}`}
        >
          <div className="toast-icon">{icons[toast.type]}</div>
          <div className="toast-message">
            <div className="toast-title">{toast.title}</div>
            {toast.desc && <div className="toast-desc">{toast.desc}</div>}
          </div>
          <button className="toast-close" onClick={() => removeToast(toast.id)}>
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}