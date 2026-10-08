'use client';

import React from 'react';
import { AlertCircle, RotateCcw, Home } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
      <div className="h-16 w-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-6 shadow-sm">
        <AlertCircle className="h-8 w-8" />
      </div>
      <span className="text-sm font-bold uppercase tracking-wider text-rose-600">500 Server Error</span>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">Something went wrong</h1>
      <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-sm">
        We encountered an unexpected error while processing your request. Please try again or return to safety.
      </p>

      <div className="mt-6 flex items-center gap-3">
        <Button variant="primary" size="md" onClick={() => reset()}>
          <RotateCcw className="h-4 w-4 mr-1.5" />
          Try Again
        </Button>
        <a
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all"
        >
          <Home className="h-4 w-4" />
          Home
        </a>
      </div>
    </div>
  );
}
