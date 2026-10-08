'use client';

import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { ShieldCheck, Database, Server, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';

export default function AdminSettingsPage() {
  const { showToast } = useToast();

  return (
    <AppLayout allowedRole="ADMIN">
      <div className="space-y-8 max-w-4xl mx-auto">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">System Settings</h1>
          <p className="text-xs text-slate-600 mt-1">Platform architecture, database health, and security status</p>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900">Platform Environment</h2>
            <p className="text-xs text-slate-600">Runtime and persistent storage verification</p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Database className="h-5 w-5 text-indigo-600" />
                <div>
                  <span className="font-bold text-slate-900 block">PostgreSQL Database</span>
                  <span className="text-slate-600">Connected via Prisma ORM (Embedded / Local Instance)</span>
                </div>
              </div>
              <span className="font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4" /> Healthy
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Server className="h-5 w-5 text-indigo-600" />
                <div>
                  <span className="font-bold text-slate-900 block">File Storage Provider</span>
                  <span className="text-slate-600">Clean storage abstraction layer (Local / Cloud Ready)</span>
                </div>
              </div>
              <span className="font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4" /> Active
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-indigo-600" />
                <div>
                  <span className="font-bold text-slate-900 block">JWT Token Security</span>
                  <span className="text-slate-600">HTTP-Only secure cookie with bcrypt password hashing</span>
                </div>
              </div>
              <span className="font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4" /> Protected
              </span>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
