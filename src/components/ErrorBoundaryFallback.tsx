import React from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

export function ErrorBoundaryFallback({ error, resetErrorBoundary }: any) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-6">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl border border-red-100 dark:border-red-900/30 text-center">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-3">
          ¡Ups! Algo salió mal
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Tuvimos un problema técnico inesperado. Por favor, intenta recargar la página.
        </p>
        <button
          onClick={resetErrorBoundary}
          className="flex items-center justify-center gap-2 w-full py-3 px-6 bg-[#0277ab] text-white rounded-xl font-bold hover:bg-[#02628c] transition-colors"
        >
          <RefreshCcw className="w-5 h-5" />
          Recargar Página
        </button>
      </div>
    </div>
  );
}
