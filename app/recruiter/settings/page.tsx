'use client';

import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { ShieldCheck, Bell, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';

export default function RecruiterSettingsPage() {
  const { showToast } = useToast();
  const [inboundAppNotify, setInboundAppNotify] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('success', 'Recruiter preferences saved successfully');
  };

  return (
    <AppLayout allowedRole="RECRUITER">
      <div className="space-y-8 max-w-4xl mx-auto">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Recruiter Settings</h1>
          <p className="text-xs text-slate-600 mt-1">Configure notifications, team preferences, and account security</p>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900">Application Alerts</h2>
            <p className="text-xs text-slate-600">Control when you receive notifications about candidate activities</p>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <label className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer">
              <div>
                <p className="text-xs font-bold text-slate-900">Instant Inbound Notifications</p>
                <p className="text-[11px] text-slate-600">Notify me immediately when a candidate submits an application</p>
              </div>
              <input
                type="checkbox"
                checked={inboundAppNotify}
                onChange={(e) => setInboundAppNotify(e.target.checked)}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
              />
            </label>

            <label className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer">
              <div>
                <p className="text-xs font-bold text-slate-900">Weekly Talent Pipeline Digest</p>
                <p className="text-[11px] text-slate-600">Summary of active applicants and interview conversions</p>
              </div>
              <input
                type="checkbox"
                checked={weeklyReport}
                onChange={(e) => setWeeklyReport(e.target.checked)}
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
      </div>
    </AppLayout>
  );
}
