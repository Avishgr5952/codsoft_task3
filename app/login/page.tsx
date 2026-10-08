'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Briefcase, Lock, Mail, ArrowRight, ShieldCheck, UserCheck, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export const dynamic = 'force-dynamic';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e?: React.FormEvent, customEmail?: string, customPassword?: string) => {
    if (e) e.preventDefault();
    setError(null);
    setLoading(true);

    const submitEmail = customEmail || email;
    const submitPassword = customPassword || password;

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: submitEmail, password: submitPassword }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Invalid email or password');
        setLoading(false);
        return;
      }

      // Check role redirection
      const user = data.data.user;
      if (redirectPath) {
        router.push(redirectPath);
      } else if (user.role === 'ADMIN') {
        router.push('/admin/dashboard');
      } else if (user.role === 'RECRUITER') {
        router.push('/recruiter/dashboard');
      } else {
        router.push('/candidate/dashboard');
      }

      router.refresh();
    } catch (err: any) {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  const fillDemoAccount = (roleEmail: string) => {
    setEmail(roleEmail);
    setPassword('CareerHub@123');
    handleSubmit(undefined, roleEmail, 'CareerHub@123');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Brand header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <a href="/" className="inline-flex items-center gap-2.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-200">
            <Briefcase className="h-6 w-6" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-slate-900">
            Career<span className="text-indigo-600">Hub</span>
          </span>
        </a>
        <h2 className="mt-4 text-2xl font-extrabold text-slate-900 tracking-tight">
          Welcome back
        </h2>
        <p className="mt-1 text-xs text-slate-600">
          Sign in to your candidate or employer account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-200/50 rounded-2xl border border-slate-200 sm:px-10">
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="email"
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-slate-600">
                <input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                Remember me
              </label>
              <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-2"
              size="lg"
              isLoading={loading}
            >
              Sign In to CareerHub
            </Button>
          </form>

          {/* Quick Demo Access Bar */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Quick Demo Access
              </span>
              <span className="text-[10px] bg-indigo-50 text-indigo-700 font-semibold px-2 py-0.5 rounded-full">
                One-Click
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => fillDemoAccount('candidate@careerhub.com')}
                disabled={loading}
                className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-indigo-200 bg-indigo-50/50 hover:bg-indigo-100/70 transition-all text-center"
              >
                <UserCheck className="h-4 w-4 text-indigo-600 mb-1" />
                <span className="text-[11px] font-bold text-slate-800">Candidate</span>
                <span className="text-[9px] text-slate-600">Job Seeker</span>
              </button>

              <button
                type="button"
                onClick={() => fillDemoAccount('recruiter@careerhub.com')}
                disabled={loading}
                className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-blue-200 bg-blue-50/50 hover:bg-blue-100/70 transition-all text-center"
              >
                <Briefcase className="h-4 w-4 text-blue-600 mb-1" />
                <span className="text-[11px] font-bold text-slate-800">Recruiter</span>
                <span className="text-[9px] text-slate-600">TechNova</span>
              </button>

              <button
                type="button"
                onClick={() => fillDemoAccount('admin@careerhub.com')}
                disabled={loading}
                className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-rose-200 bg-rose-50/50 hover:bg-rose-100/70 transition-all text-center"
              >
                <ShieldCheck className="h-4 w-4 text-rose-600 mb-1" />
                <span className="text-[11px] font-bold text-slate-800">Admin</span>
                <span className="text-[9px] text-slate-600">System</span>
              </button>
            </div>
            <p className="mt-2 text-[10px] text-center text-slate-600">
              Demo accounts use password: <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">CareerHub@123</code>
            </p>
          </div>

          <div className="mt-6 text-center text-xs text-slate-600">
            Don’t have an account?{' '}
            <a href="/register" className="font-bold text-indigo-600 hover:text-indigo-500">
              Create an account
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-xs text-slate-500">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
