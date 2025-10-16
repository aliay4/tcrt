"use client";

import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Error tracking service'e gönder (Sentry, LogRocket, etc.)
    if (typeof window !== 'undefined' && (window as any).toast) {
      (window as any).toast.error('Bir hata oluştu', 'Sayfa yüklenirken beklenmeyen bir hata oluştu');
    }
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return <FallbackComponent error={this.state.error} resetError={this.resetError} />;
    }

    return this.props.children;
  }
}

function DefaultErrorFallback({ error, resetError }: { error?: Error; resetError: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Bir Hata Oluştu</h1>
        <p className="text-gray-600 mb-6">
          Sayfa yüklenirken beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.
        </p>
        {process.env.NODE_ENV === 'development' && error && (
          <details className="mb-6 text-left">
            <summary className="cursor-pointer text-sm text-gray-500 mb-2">Hata Detayları</summary>
            <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto">
              {error.message}
              {error.stack}
            </pre>
          </details>
        )}
        <div className="space-y-3">
          <button
            onClick={resetError}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300"
          >
            Tekrar Dene
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors duration-300"
          >
            Ana Sayfaya Dön
          </button>
        </div>
      </div>
    </div>
  );
}

export function ErrorMessage({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm text-red-800">{message}</p>
        </div>
        {onRetry && (
          <div className="ml-3">
            <button
              onClick={onRetry}
              className="text-sm bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded-md transition-colors duration-200"
            >
              Tekrar Dene
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function NetworkError({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="text-center py-12">
      <div className="text-yellow-500 text-6xl mb-4">🌐</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Bağlantı Hatası</h3>
      <p className="text-gray-600 mb-6">
        İnternet bağlantınızı kontrol edin ve tekrar deneyin.
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300"
        >
          Tekrar Dene
        </button>
      )}
    </div>
  );
}
