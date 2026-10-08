'use client';

import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { ShieldCheck, Lock, Bell, User, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';

export default function CandidateSettingsPage() {
  const { showToast } = useToast();
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [jobRecommendations, setJobRecommendations] = useState(true);

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('success', 'Notification preferences updated');
  };

  return (
    <AppLayout allowedRole="CANDIDATE">
      <div className="space-y-8 max-w-4xl mx-auto">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Account Settings</h1>
          <p className="text-xs text-slate-600 mt-1">Manage notifications, privacy, and account security</p>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900">Notification Preferences</h2>
            <p className="text-xs text-slate-600">Choose what updates you want to receive</p>
          </div>

          <form onSubmit={handleSavePreferences} className="space-y-4">
            <label className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer">
              <div>
                <p className="text-xs font-bold text-slate-900">Application Status Alerts</p>
                <p className="text-[11px] text-slate-600">Get notified when a recruiter updates your status</p>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
              />
            </label>

            <label className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer">
              <div>
                <p className="text-xs font-bold text-slate-900">Personalized Job Matches</p>
                <p className="text-[11px] text-slate-600">Weekly digest of roles matching your preferred skills</p>
              </div>
              <input
                type="checkbox"
                checked={jobRecommendations}
                onChange={(e) => setJobRecommendations(e.target.checked)}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
              />
            </label>

            <div className="flex justify-end pt-2">
              <Button type="submit" variant="primary">
                Save Preferences
              </Button>
            </div>
          </form>
        </div>

        {/* Security Info */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900">Security & Authentication</h2>
            <p className="text-xs text-slate-600">Password and session information</p>
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div>
              <p className="text-xs font-bold text-slate-900">Account Password</p>
              <p className="text-[11px] text-slate-600">Password is securely encrypted with bcrypt</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4" /> Protected
            </span>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
