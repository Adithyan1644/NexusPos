import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const ICONS = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
  warn: AlertTriangle
};

export default function ToastContainer() {
  const { toasts, dismissToast } = useApp();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((t) => {
        const Icon = ICONS[t.type] || Info;
        return (
          <div key={t.id} className={`toast ${t.type}`}>
            <div className="ic">
              <Icon size={18} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="tt">{t.title}</div>
              <div className="ms">{t.message}</div>
            </div>
            <button
              onClick={() => dismissToast(t.id)}
              style={{
                color: 'var(--text-3)',
                padding: '2px',
                borderRadius: '4px',
                lineHeight: 1
              }}
              title="Dismiss"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
