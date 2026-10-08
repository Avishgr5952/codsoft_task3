'use client';

import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { BarChart3, TrendingUp, Users, Shield, Award } from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
} from 'recharts';

export default function AdminAnalyticsPage() {
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

  const userDistribution = data?.userDistribution || [];

  return (
    <AppLayout allowedRole="ADMIN">
      <div className="space-y-8 max-w-6xl mx-auto">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Platform Analytics</h1>
          <p className="text-xs text-slate-600 mt-1">
            Global CareerHub metrics, account distribution, and ecosystem throughput
          </p>
        </div>

        {/* Top Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-600">Total Registered Users</span>
            <div className="text-3xl font-extrabold text-slate-900 mt-1">{stats.totalUsers}</div>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-indigo-600">Candidate Pool</span>
            <div className="text-3xl font-extrabold text-indigo-700 mt-1">{stats.totalCandidates}</div>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-blue-600">Employer Accounts</span>
            <div className="text-3xl font-extrabold text-blue-700 mt-1">{stats.totalRecruiters}</div>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-rose-600">Total Submissions</span>
            <div className="text-3xl font-extrabold text-rose-700 mt-1">{stats.totalApplications}</div>
          </div>
        </div>

        {/* User Distribution Pie Chart */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 max-w-xl">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              User Role Distribution
            </h2>
            <p className="text-[11px] text-slate-600">Ratio of job seekers to corporate recruiters</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={userDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                >
                  {userDistribution.map((entry: any, index: number) => (
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
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
