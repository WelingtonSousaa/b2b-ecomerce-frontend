'use client';

import React, { createContext, useContext, useState } from 'react';
import { CheckCircle2, AlertCircle, Info, X, ShieldAlert } from 'lucide-react';

export type ToastType = 'success' | 'info' | 'warning' | 'error';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = React.useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const showToast = React.useCallback((message: string, type: ToastType = 'success') => {
    const id = `toast-${Math.floor(Number(new Date()))}-${Math.floor(1000 + (typeof performance !== 'undefined' ? performance.now() : 0))}`;
    setToasts(prev => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Toast Container Render */}
      <div className="fixed bottom-6 right-6 z-50 space-y-3 pointer-events-none font-sans">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-2xl shadow-xl border text-xs font-bold transition-all animate-in slide-in-from-bottom duration-200 max-w-sm ${
              toast.type === 'success' ? 'bg-[#004e38] text-white border-emerald-700' :
              toast.type === 'info' ? 'bg-blue-900 text-white border-blue-700' :
              toast.type === 'warning' ? 'bg-amber-500 text-white border-amber-600' :
              'bg-red-700 text-white border-red-800'
            }`}
          >
            <div className="flex items-center gap-2">
              {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />}
              {toast.type === 'info' && <Info className="w-4 h-4 text-blue-200 shrink-0" />}
              {toast.type === 'warning' && <AlertCircle className="w-4 h-4 text-amber-200 shrink-0" />}
              {toast.type === 'error' && <ShieldAlert className="w-4 h-4 text-red-200 shrink-0" />}
              <span>{toast.message}</span>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="p-0.5 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}
