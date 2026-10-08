import React from 'react';
import { Briefcase, ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
      <div className="h-16 w-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6 shadow-sm">
        <Briefcase className="h-8 w-8" />
      </div>
      <span className="text-sm font-bold uppercase tracking-wider text-indigo-600">404 Error</span>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">Page Not Found</h1>
      <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-sm">
        The career opportunity, candidate profile, or page you were looking for doesn’t exist or has moved.
      </p>

      <div className="mt-6 flex items-center gap-3">
        <a
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md shadow-indigo-100"
        >
          <Home className="h-4 w-4" />
          Back to Homepage
        </a>
        <a
          href="/jobs"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all"
        >
          Explore Jobs
        </a>
      </div>
    </div>
  );
}
