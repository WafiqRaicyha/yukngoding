import { AlertTriangle, Award, CheckCircle2, Info, X } from 'lucide-react';
import { ToastMessage } from '../types';

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-[calc(100vw-2rem)] pointer-events-none"
    >
      {toasts.map((toast) => {
        const styles = {
          success: {
            border: 'border-emerald-200',
            icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" aria-hidden="true" />,
          },
          gamify: {
            border: 'border-violet-200',
            icon: <Award className="w-5 h-5 text-[#7C3AED] shrink-0" aria-hidden="true" />,
          },
          warning: {
            border: 'border-amber-200',
            icon: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" aria-hidden="true" />,
          },
          info: {
            border: 'border-blue-200',
            icon: <Info className="w-5 h-5 text-[#2563EB] shrink-0" aria-hidden="true" />,
          },
        }[toast.variant];

        return (
          <div
            key={toast.id}
            role="status"
            className={`pointer-events-auto bg-white border ${styles.border} rounded-xl shadow-lg p-3.5 flex items-start gap-3 transition-opacity duration-200`}
          >
            <div className="mt-0.5">{styles.icon}</div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-900">{toast.title}</p>
              {toast.description && (
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{toast.description}</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              aria-label="Tutup notifikasi"
              className="p-1 text-slate-400 hover:text-slate-700 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
