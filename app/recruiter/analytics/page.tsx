'use client';

import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import {
  BarChart3,
  TrendingUp,
  Users,
  Briefcase,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

export default function RecruiterAnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/recruiter/analytics')
      .then((res) => res.json())
      .then((d) => {
        if (d.success) setData(d.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const summary = data?.summary || {
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    shortlistedCount: 0,
    interviewCount: 0,
    selectedCount: 0,
  };

  const statusDistribution = data?.statusDistribution || [];
  const applicationsPerJob = data?.applicationsPerJob || [];

  return (
    <AppLayout allowedRole="RECRUITER">
      <div className="space-y-8 max-w-6xl mx-auto">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Recruiter Analytics</h1>
          <p className="text-xs text-slate-600 mt-1">
            Data insights, applicant volume distribution, and hiring conversion velocity
          </p>
        </div>

        {/* Top KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-600">Total Applicants</span>
            <div className="text-3xl font-extrabold text-indigo-600 mt-1">{summary.totalApplications}</div>
            <span className="text-[10px] text-slate-600 mt-0.5 block">Across all posted openings</span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-600">Interview Rate</span>
            <div className="text-3xl font-extrabold text-purple-600 mt-1">
              {summary.totalApplications > 0
                ? Math.round((summary.interviewCount / summary.totalApplications) * 100)
                : 0}
              %
            </div>
            <span className="text-[10px] text-slate-600 mt-0.5 block">Screening to interview conversion</span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-600">Offers Extended</span>
            <div className="text-3xl font-extrabold text-emerald-600 mt-1">{summary.selectedCount}</div>
            <span className="text-[10px] text-slate-600 mt-0.5 block">Successful candidate selections</span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-600">Active Roles</span>
            <div className="text-3xl font-extrabold text-blue-600 mt-1">{summary.activeJobs}</div>
            <span className="text-[10px] text-slate-600 mt-0.5 block">Accepting candidate resumes</span>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bar Chart: Applications per Job */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                Applicants per Job Opening
              </h2>
              <p className="text-[11px] text-slate-600">Top job postings with highest inbound application volume</p>
            </div>

            <div className="h-64 w-full">
              {applicationsPerJob.length === 0 ? (
                <div className="flex h-full items-center justify-center text-xs text-slate-600">
                  No application data yet
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={applicationsPerJob} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <XAxis
                      dataKey="title"
                      tick={{ fontSize: 10, fill: '#64748b' }}
                      interval={0}
                      angle={-15}
                      textAnchor="end"
                    />
                    <YAxis tick={{ fontSize: 10, fill: '#64748b' }} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey="applications" fill="#6366f1" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Pie Chart: Status Distribution */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                Candidate Pipeline Distribution
              </h2>
              <p className="text-[11px] text-slate-600">Breakdown of candidates across hiring funnel stages</p>
            </div>

            <div className="h-64 w-full">
              {summary.totalApplications === 0 ? (
                <div className="flex h-full items-center justify-center text-xs text-slate-600">
                  No applicants in pipeline yet
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusDistribution}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={4}
                    >
                      {statusDistribution.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0',
                        fontSize: '12px',
                      }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
