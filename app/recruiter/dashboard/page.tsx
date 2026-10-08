'use client';

import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import {
  Briefcase,
  Users,
  CheckCircle2,
  Calendar,
  PlusCircle,
  Kanban,
  BarChart3,
  ArrowRight,
  Building2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ApplicationItem } from '@/types';

export default function RecruiterDashboardPage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [recentApps, setRecentApps] = useState<ApplicationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [analyticsRes, appsRes] = await Promise.all([
          fetch('/api/recruiter/analytics').then((r) => r.json()),
          fetch('/api/applications').then((r) => r.json()),
        ]);

        if (analyticsRes.success) setAnalytics(analyticsRes.data);
        if (appsRes.success) setRecentApps(appsRes.data || []);
      } catch (e) {
        console.error('Error loading recruiter dashboard:', e);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPLIED':
        return <Badge variant="secondary">Applied</Badge>;
      case 'UNDER_REVIEW':
        return <Badge variant="warning">Under Review</Badge>;
      case 'SHORTLISTED':
        return <Badge variant="primary">Shortlisted</Badge>;
      case 'INTERVIEW':
        return <Badge variant="info">Interview</Badge>;
      case 'SELECTED':
        return <Badge variant="success">Selected</Badge>;
      case 'REJECTED':
        return <Badge variant="danger">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const summary = analytics?.summary || {
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    shortlistedCount: 0,
    interviewCount: 0,
    selectedCount: 0,
  };

  if (loading) {
    return (
      <AppLayout allowedRole="RECRUITER">
        <div className="space-y-6 animate-pulse">
          <div className="h-32 bg-white rounded-3xl border border-slate-200" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-white rounded-2xl border border-slate-200" />
            ))}
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout allowedRole="RECRUITER">
      <div className="space-y-8">
        {/* WELCOME & ACTION BAR */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-tr from-slate-900 via-indigo-950 to-indigo-900 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold backdrop-blur-sm border border-indigo-500/30">
              <Sparkles className="h-3.5 w-3.5" />
              Recruiter Command Center
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Talent Acquisition Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Monitor active roles, track pipeline throughput, and shortlist qualified candidates.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="/recruiter/pipeline"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all"
            >
              <Kanban className="h-4 w-4" />
              Visual Pipeline
            </a>
            <a
              href="/recruiter/jobs/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition-all"
            >
              <PlusCircle className="h-4 w-4" />
              Post New Job
            </a>
          </div>
        </div>

        {/* METRICS ROW */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
            Hiring Operations Overview
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="text-xs font-semibold text-slate-600">Total Jobs</div>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">{summary.totalJobs}</div>
              <div className="text-[10px] text-slate-600 mt-0.5">Created to date</div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="text-xs font-semibold text-emerald-600">Active Openings</div>
              <div className="text-2xl font-extrabold text-emerald-700 mt-1">{summary.activeJobs}</div>
              <div className="text-[10px] text-slate-600 mt-0.5">Currently published</div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="text-xs font-semibold text-indigo-600">Total Applicants</div>
              <div className="text-2xl font-extrabold text-indigo-700 mt-1">{summary.totalApplications}</div>
              <div className="text-[10px] text-slate-600 mt-0.5">Candidates in system</div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="text-xs font-semibold text-blue-600">Shortlisted</div>
              <div className="text-2xl font-extrabold text-blue-700 mt-1">{summary.shortlistedCount}</div>
              <div className="text-[10px] text-slate-600 mt-0.5">Ready for review</div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="text-xs font-semibold text-purple-600">Interviews</div>
              <div className="text-2xl font-extrabold text-purple-700 mt-1">{summary.interviewCount}</div>
              <div className="text-[10px] text-slate-600 mt-0.5">Scheduled rounds</div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="text-xs font-semibold text-teal-600">Hires / Offers</div>
              <div className="text-2xl font-extrabold text-teal-700 mt-1">{summary.selectedCount}</div>
              <div className="text-[10px] text-slate-600 mt-0.5">Accepted candidates</div>
            </div>
          </div>
        </div>

        {/* TWO-COLUMN SECTION: RECENT CANDIDATE APPLICATIONS & QUICK PIPELINE SUMMARY */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Applications (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Recent Candidate Applications</h2>
              <a
                href="/recruiter/applications"
                className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
              >
                View all ({recentApps.length}) <ArrowRight className="h-3 w-3" />
              </a>
            </div>

            {recentApps.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
                <Users className="h-10 w-10 mx-auto text-slate-600" />
                <h3 className="text-sm font-bold text-slate-800">No applications received yet</h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  Once candidates discover your open job postings and submit resumes, they will appear here.
                </p>
                <Button variant="primary" size="sm" onClick={() => (window.location.href = '/recruiter/jobs/new')}>
                  Post a Job Opening
                </Button>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
                {recentApps.slice(0, 6).map((app) => (
                  <div key={app.id} className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3.5">
                      <div className="h-11 w-11 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0 text-sm">
                        {app.candidateProfile?.user?.name?.charAt(0) || 'C'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs sm:text-sm font-bold text-slate-900">
                            {app.candidateProfile?.user?.name}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600">
                          Applied for <strong className="text-slate-800">{app.job?.title}</strong> • {new Date(app.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {getStatusBadge(app.status)}
                      <a
                        href="/recruiter/applications"
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-indigo-300 text-xs font-bold text-slate-700 hover:text-indigo-600 transition-colors bg-white"
                      >
                        Review
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions & Status Breakdown (1 col) */}
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2">
                Hiring Funnel Status
              </h3>

              <div className="space-y-3 text-xs">
                {analytics?.statusDistribution?.map((item: any) => (
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
                  href="/recruiter/pipeline"
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-bold transition-colors"
                >
                  <Kanban className="h-4 w-4" />
                  Open Pipeline Board
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2">
                Quick Shortcuts
              </h3>
              <ul className="space-y-2 text-xs font-semibold">
                <li>
                  <a href="/recruiter/jobs/new" className="text-indigo-600 hover:underline flex items-center gap-1.5">
                    <PlusCircle className="h-3.5 w-3.5" /> Publish New Job
                  </a>
                </li>
                <li>
                  <a href="/recruiter/company" className="text-indigo-600 hover:underline flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5" /> Edit Company Branding
                  </a>
                </li>
                <li>
                  <a href="/recruiter/analytics" className="text-indigo-600 hover:underline flex items-center gap-1.5">
                    <BarChart3 className="h-3.5 w-3.5" /> View Detailed Metrics
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
