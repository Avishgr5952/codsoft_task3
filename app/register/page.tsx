'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Briefcase, User, Building2, CheckCircle2, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function RegisterPage() {
  const router = useRouter();

  const [role, setRole] = useState<'CANDIDATE' | 'RECRUITER'>('CANDIDATE');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Recruiter fields
  const [companyName, setCompanyName] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [companyDescription, setCompanyDescription] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (role === 'RECRUITER' && !companyName) {
      setError('Company name is required for recruiter registration');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          password,
          confirmPassword,
          role,
          companyName: role === 'RECRUITER' ? companyName : undefined,
          companyWebsite: role === 'RECRUITER' ? companyWebsite : undefined,
          companyDescription: role === 'RECRUITER' ? companyDescription : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Failed to create account');
        setLoading(false);
        return;
      }

      if (role === 'RECRUITER') {
        router.push('/recruiter/dashboard');
      } else {
        router.push('/candidate/dashboard');
      }

      router.refresh();
    } catch (err: any) {
      setError('An error occurred during registration. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
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
          Create your account
        </h2>
        <p className="mt-1 text-xs text-slate-600">
          Join CareerHub as a candidate or company hiring manager
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl px-4">
        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-200/50 rounded-2xl border border-slate-200 sm:px-10">
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
              {error}
            </div>
          )}

          {/* Role selector cards */}
          <div className="mb-6">
            <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
              I want to:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('CANDIDATE')}
                className={`p-4 rounded-xl border text-left transition-all ${
                  role === 'CANDIDATE'
                    ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <User className={`h-5 w-5 ${role === 'CANDIDATE' ? 'text-indigo-600' : 'text-slate-600'}`} />
                  {role === 'CANDIDATE' && <CheckCircle2 className="h-4 w-4 text-indigo-600" />}
                </div>
                <div className="text-sm font-bold text-slate-900">Find a Job</div>
                <div className="text-[11px] text-slate-600">Apply to top companies</div>
              </button>

              <button
                type="button"
                onClick={() => setRole('RECRUITER')}
                className={`p-4 rounded-xl border text-left transition-all ${
                  role === 'RECRUITER'
                    ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <Building2 className={`h-5 w-5 ${role === 'RECRUITER' ? 'text-indigo-600' : 'text-slate-600'}`} />
                  {role === 'RECRUITER' && <CheckCircle2 className="h-4 w-4 text-indigo-600" />}
                </div>
                <div className="text-sm font-bold text-slate-900">Hire Talent</div>
                <div className="text-[11px] text-slate-600">Post jobs & recruit</div>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                required
              />

              <Input
                label="Phone Number"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
              />
            </div>

            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />

              <Input
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            {/* Recruiter extra fields */}
            {role === 'RECRUITER' && (
              <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Company Details
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Company Name"
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Acme Innovations"
                    required
                  />

                  <Input
                    label="Company Website"
                    type="url"
                    value={companyWebsite}
                    onChange={(e) => setCompanyWebsite(e.target.value)}
                    placeholder="https://acme.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Company Description
                  </label>
                  <textarea
                    rows={2}
                    value={companyDescription}
                    onChange={(e) => setCompanyDescription(e.target.value)}
                    placeholder="Tell candidates about your mission and workplace culture..."
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-4"
              size="lg"
              isLoading={loading}
            >
              Complete Registration
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-600">
            Already have an account?{' '}
            <a href="/login" className="font-bold text-indigo-600 hover:text-indigo-500">
              Sign In
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
