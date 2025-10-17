"use client";

import { useCallback } from 'react';

export interface ToastData {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

export const useToast = () => {
  const showToast = useCallback((toast: ToastData) => {
    if (typeof window !== 'undefined' && (window as any).toast) {
      const toastFunction = (window as any).toast[toast.type];
      if (typeof toastFunction === 'function') {
        toastFunction(toast.title, toast.message, toast.duration);
      } else {
        // Fallback - console log for development
        console.log(`Toast [${toast.type.toUpperCase()}]: ${toast.title}`, toast.message);
      }
    } else {
      // Fallback - console log for development
      console.log(`Toast [${toast.type.toUpperCase()}]: ${toast.title}`, toast.message);
    }
  }, []);

  const showSuccess = useCallback((title: string, message?: string, duration?: number) => {
    showToast({ type: 'success', title, message, duration });
  }, [showToast]);

  const showError = useCallback((title: string, message?: string, duration?: number) => {
    showToast({ type: 'error', title, message, duration });
  }, [showToast]);

  const showWarning = useCallback((title: string, message?: string, duration?: number) => {
    showToast({ type: 'warning', title, message, duration });
  }, [showToast]);

  const showInfo = useCallback((title: string, message?: string, duration?: number) => {
    showToast({ type: 'info', title, message, duration });
  }, [showToast]);

  return {
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };
};
