import { AlertTriangle, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface ResetModalProps {
  open: boolean;
  profileAlias: string;
  onClose: () => void;
  onConfirmReset: () => void;
}

export function ResetModal({ open, profileAlias, onClose, onConfirmReset }: ResetModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [confirmText, setConfirmText] = useState('');
  const primaryButtonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) {
      setStep(1);
      setConfirmText('');
      return;
    }
    if (step === 1) {
      primaryButtonRef.current?.focus();
    } else {
      inputRef.current?.focus();
    }
  }, [open, step]);

  useEffect(() => {
    if (!open) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const canFinalConfirm = confirmText.trim().toUpperCase() === 'RESET';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-[2px]"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="reset-modal-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h2 id="reset-modal-title" className="text-lg font-bold text-slate-900">
                Reset Progres Pembelajaran
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Langkah {step} dari 2 · Akun {profileAlias}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup dialog"
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {step === 1 ? (
          <div className="mt-4">
            <p className="text-sm text-slate-600 leading-relaxed">
              Tindakan ini akan menghapus seluruh <strong>Poin, XP, Level, materi selesai, badge, simulasi, dan riwayat Daily Challenge</strong> khusus untuk akun <strong>{profileAlias}</strong> dan mengembalikan Byte ke Level 1 (Spark Byte). Akun lain di perangkat ini tidak terpengaruh.
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
              >
                Batal
              </button>
              <button
                ref={primaryButtonRef}
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2"
              >
                Lanjut Konfirmasi
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-4">
            <p className="text-sm text-slate-600 leading-relaxed">
              Konfirmasi kedua: ketik kata <code className="px-1.5 py-0.5 bg-slate-100 text-red-700 rounded font-semibold">RESET</code> di bawah ini untuk menghapus progres akun <strong>{profileAlias}</strong> secara permanen.
            </p>
            <div className="mt-4">
              <label htmlFor="reset-confirm-input" className="block text-xs font-medium text-slate-700 mb-1.5">
                Ketik RESET untuk konfirmasi
              </label>
              <input
                ref={inputRef}
                id="reset-confirm-input"
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="RESET"
                autoComplete="off"
                className="w-full px-3.5 py-2.5 text-sm font-mono border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
              >
                Kembali
              </button>
              <button
                type="button"
                disabled={!canFinalConfirm}
                onClick={() => {
                  onConfirmReset();
                  onClose();
                }}
                className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 disabled:opacity-40 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2"
              >
                Hapus Progres Sekarang
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
