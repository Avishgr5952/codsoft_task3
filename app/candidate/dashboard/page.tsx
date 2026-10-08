'use client';

import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import {
  Send,
  FileCheck,
  Bookmark,
  Calendar,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Briefcase,
  Building2,
  CheckCircle2,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ApplicationItem, JobItem, CandidateProfileItem } from '@/types';

export default function CandidateDashboardPage() {
  const [profile, setProfile] = useState<CandidateProfileItem & { completionPercentage: number } | null>(null);
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [savedJobs, setSavedJobs] = useState<any[]>([]);
  const [recommendedJobs, setRecommendedJobs] = useState<JobItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        const [profileRes, appsRes, savedRes, recJobsRes] = await Promise.all([
          fetch('/api/candidates/me').then((r) => r.json()),
          fetch('/api/applications').then((r) => r.json()),
          fetch('/api/saved-jobs').then((r) => r.json()),
          fetch('/api/jobs?limit=3&featured=true').then((r) => r.json()),
        ]);

        if (profileRes.success) setProfile(profileRes.data);
        if (appsRes.success) setApplications(appsRes.data || []);
        if (savedRes.success) setSavedJobs(savedRes.data || []);
        if (recJobsRes.success) setRecommendedJobs(recJobsRes.data.jobs || []);
      } catch (err) {
        console.error('Error loading candidate dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
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
        return <Badge variant="info">Interview Scheduled</Badge>;
      case 'SELECTED':
        return <Badge variant="success">Selected / Offer</Badge>;
      case 'REJECTED':
        return <Badge variant="danger">Not Selected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // Status counters
  const totalApps = applications.length;
  const underReviewCount = applications.filter((a) => a.status === 'UNDER_REVIEW').length;
  const shortlistedCount = applications.filter((a) => a.status === 'SHORTLISTED').length;
  const interviewCount = applications.filter((a) => a.status === 'INTERVIEW').length;
  const selectedCount = applications.filter((a) => a.status === 'SELECTED').length;

  if (loading) {
    return (
      <AppLayout allowedRole="CANDIDATE">
        <div className="space-y-6 animate-pulse">
          <div className="h-36 bg-white rounded-3xl border border-slate-200" />
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
    <AppLayout allowedRole="CANDIDATE">
      <div className="space-y-8">
        {/* WELCOME BANNER */}
        <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-tr from-indigo-700 via-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-100">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-sm">
                <Sparkles className="h-3.5 w-3.5" />
                Candidate Hub
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Welcome back, {profile?.user?.name || 'Candidate'}! 👋
              </h1>
              <p className="text-xs sm:text-sm text-indigo-100 max-w-xl">
                {profile?.headline || 'Ready to discover exciting career opportunities and track your job progress.'}
              </p>
            </div>

            {/* Profile Completion Indicator */}
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center min-w-[190px]">
              <div className="text-xs font-semibold text-indigo-100 mb-1">Profile Strength</div>
              <div className="text-3xl font-extrabold">{profile?.completionPercentage || 65}%</div>
              <div className="w-full bg-white/20 rounded-full h-2 mt-2 overflow-hidden">
                <div
                  className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${profile?.completionPercentage || 65}%` }}
                />
              </div>
              <a
                href="/candidate/profile"
                className="mt-3 block text-[11px] font-bold text-white hover:underline"
              >
                Complete Profile →
              </a>
            </div>
          </div>
        </div>

        {/* APPLICATION STATUS SUMMARY METRICS */}
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-3">
            Application Pipeline Summary
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="text-xs font-semibold text-slate-600">Total Applied</div>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">{totalApps}</div>
              <div className="text-[10px] text-slate-600 mt-0.5">Across all companies</div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="text-xs font-semibold text-amber-600">Under Review</div>
              <div className="text-2xl font-extrabold text-amber-700 mt-1">{underReviewCount}</div>
              <div className="text-[10px] text-slate-600 mt-0.5">Screening queue</div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="text-xs font-semibold text-indigo-600">Shortlisted</div>
              <div className="text-2xl font-extrabold text-indigo-700 mt-1">{shortlistedCount}</div>
              <div className="text-[10px] text-slate-600 mt-0.5">Hiring manager review</div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="text-xs font-semibold text-purple-600">Interviews</div>
              <div className="text-2xl font-extrabold text-purple-700 mt-1">{interviewCount}</div>
              <div className="text-[10px] text-slate-600 mt-0.5">Live interview rounds</div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm col-span-2 sm:col-span-1">
              <div className="text-xs font-semibold text-emerald-600">Offers / Selected</div>
              <div className="text-2xl font-extrabold text-emerald-700 mt-1">{selectedCount}</div>
              <div className="text-[10px] text-slate-600 mt-0.5">Successful matches</div>
            </div>
          </div>
        </div>

        {/* TWO-COLUMN LAYOUT: RECENT APPLICATIONS & SAVED JOBS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Applications (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Recent Applications</h2>
              <a
                href="/candidate/applications"
                className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
              >
                View all ({totalApps}) <ArrowRight className="h-3 w-3" />
              </a>
            </div>

            {applications.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
                <Send className="h-10 w-10 mx-auto text-slate-600" />
                <h3 className="text-sm font-bold text-slate-800">No applications yet</h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  Start applying to open positions to track your progress and interview pipeline here.
                </p>
                <Button variant="primary" size="sm" onClick={() => (window.location.href = '/jobs')}>
                  Find Jobs Now
                </Button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
                {applications.slice(0, 5).map((app) => (
                  <div key={app.id} className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3.5">
                      <div className="h-11 w-11 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                        {app.job?.company?.logoUrl ? (
                          <img src={app.job.company.logoUrl} alt={app.job.company.name} className="h-full w-full object-cover" />
                        ) : (
                          <Building2 className="h-5 w-5 text-slate-600" />
                        )}
                      </div>
                      <div>
                        <a href={`/jobs/${app.jobId}`} className="text-xs sm:text-sm font-bold text-slate-900 hover:text-indigo-600 transition-colors">
                          {app.job?.title}
                        </a>
                        <div className="text-[11px] text-slate-600 flex items-center gap-2 mt-0.5">
                          <span>{app.job?.company?.name}</span>
                          <span>•</span>
                          <span>Applied {new Date(app.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {getStatusBadge(app.status)}
                      <a
                        href="/candidate/applications"
                        className="p-1.5 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Saved Jobs (1 col) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Saved Jobs</h2>
              <a
                href="/candidate/saved-jobs"
                className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
              >
                View all ({savedJobs.length}) <ArrowRight className="h-3 w-3" />
              </a>
            </div>

            {savedJobs.length === 0 ? (
              <div className="p-6 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-2">
                <Bookmark className="h-8 w-8 mx-auto text-slate-600" />
                <p>No saved jobs yet. Click the bookmark icon on any job to save it for later.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {savedJobs.slice(0, 3).map((item) => (
                  <div key={item.id} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <a href={`/jobs/${item.job?.id}`} className="text-xs font-bold text-slate-900 hover:text-indigo-600 line-clamp-1">
                          {item.job?.title}
                        </a>
                        <p className="text-[11px] text-slate-600">{item.job?.company?.name} • {item.job?.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                      <span className="text-[11px] font-bold text-slate-800">
                        {item.job?.salaryMin ? `$${(item.job.salaryMin / 1000).toFixed(0)}k+` : 'Competitive'}
                      </span>
                      <a
                        href={`/jobs/${item.job?.id}`}
                        className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-[11px] font-bold hover:bg-indigo-600 hover:text-white transition-colors"
                      >
                        Apply
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RECOMMENDED JOBS ROW */}
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Recommended for You</h2>
            <a href="/jobs" className="text-xs font-bold text-indigo-600 hover:underline">
              Explore More Jobs →
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendedJobs.map((job) => (
              <div key={job.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                      {job.company?.logoUrl ? (
                        <img src={job.company.logoUrl} alt={job.company.name} className="h-full w-full object-cover" />
                      ) : (
                        <Building2 className="h-5 w-5 text-slate-600" />
                      )}
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-slate-600">{job.company?.name}</span>
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1">{job.title}</h3>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2">{job.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-900">
                    {job.salaryMin ? `$${(job.salaryMin / 1000).toFixed(0)}k+` : 'Competitive'}
                  </span>
                  <a
                    href={`/jobs/${job.id}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:underline"
                  >
                    View Role <ArrowRight className="h-3 w-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
