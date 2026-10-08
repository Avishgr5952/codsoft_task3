'use client';

import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import {
  Users,
  Briefcase,
  Building2,
  FileText,
  Shield,
  ArrowRight,
  UserCheck,
  AlertCircle,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((res) => res.json())
      .then((d) => {
        if (d.success) setData(d.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const stats = data?.stats || {
    totalUsers: 0,
    totalCandidates: 0,
    totalRecruiters: 0,
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    totalCompanies: 0,
  };

  const recentUsers = data?.recentUsers || [];

  if (loading) {
    return (
      <AppLayout allowedRole="ADMIN">
        <div className="space-y-6 animate-pulse">
          <div className="h-32 bg-white rounded-3xl border border-slate-200" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout allowedRole="ADMIN">
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-tr from-rose-900 via-rose-800 to-indigo-900 text-white shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-200 text-xs font-semibold backdrop-blur-sm border border-rose-500/30">
              <Shield className="h-3.5 w-3.5" />
              Platform Administration
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              CareerHub Admin Console
            </h1>
            <p className="text-xs sm:text-sm text-rose-100 max-w-xl">
              System governance, user account management, and recruitment listings moderation
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/admin/users"
              className="px-4 py-2.5 rounded-xl bg-white text-rose-900 text-xs font-bold hover:bg-rose-50 transition-colors shadow-sm"
            >
              Manage Users
            </a>
            <a
              href="/admin/jobs"
              className="px-4 py-2.5 rounded-xl bg-rose-700/80 hover:bg-rose-700 text-white text-xs font-bold border border-rose-500/40 transition-colors"
            >
              Moderate Jobs
            </a>
          </div>
        </div>

        {/* METRICS GRID */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
            System Metrics Summary
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <span className="text-xs font-semibold text-slate-600">Total Users</span>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">{stats.totalUsers}</div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <span className="text-xs font-semibold text-indigo-600">Candidates</span>
              <div className="text-2xl font-extrabold text-indigo-700 mt-1">{stats.totalCandidates}</div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <span className="text-xs font-semibold text-blue-600">Recruiters</span>
              <div className="text-2xl font-extrabold text-blue-700 mt-1">{stats.totalRecruiters}</div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <span className="text-xs font-semibold text-emerald-600">Companies</span>
              <div className="text-2xl font-extrabold text-emerald-700 mt-1">{stats.totalCompanies}</div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <span className="text-xs font-semibold text-slate-600">Total Jobs</span>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">{stats.totalJobs}</div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <span className="text-xs font-semibold text-teal-600">Active Jobs</span>
              <div className="text-2xl font-extrabold text-teal-700 mt-1">{stats.activeJobs}</div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm col-span-2 sm:col-span-1">
              <span className="text-xs font-semibold text-purple-600">Applications</span>
              <div className="text-2xl font-extrabold text-purple-700 mt-1">{stats.totalApplications}</div>
            </div>
          </div>
        </div>

        {/* TWO-COLUMN: RECENT REGISTRATIONS & ROLE DISTRIBUTION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Recent User Registrations</h2>
              <a href="/admin/users" className="text-xs font-bold text-rose-600 hover:underline">
                View All Users →
              </a>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
              {recentUsers.map((u: any) => (
                <div key={u.id} className="p-4 sm:p-5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center shrink-0 text-xs">
                      {u.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <span className="text-xs sm:text-sm font-bold text-slate-900 block">{u.name}</span>
                      <span className="text-[11px] text-slate-600">{u.email}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant={u.role === 'ADMIN' ? 'danger' : u.role === 'RECRUITER' ? 'warning' : 'primary'} size="sm">
                      {u.role}
                    </Badge>
                    <Badge variant={u.status === 'ACTIVE' ? 'success' : 'danger'} size="sm">
                      {u.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2">
                Platform Breakdown
              </h3>

              <div className="space-y-3 text-xs">
                {data?.userDistribution?.map((item: any) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-slate-600">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      {item.name}
                    </span>
                    <span className="font-extrabold text-slate-900">{item.value}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-100">
                <a
                  href="/admin/users"
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-bold transition-colors"
                >
                  <Users className="h-4 w-4" />
                  Inspect All Accounts
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
