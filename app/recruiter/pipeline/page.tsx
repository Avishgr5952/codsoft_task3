'use client';

import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import {
  Kanban,
  Users,
  ChevronRight,
  MoveRight,
  CheckCircle2,
  XCircle,
  FileText,
  Building2,
  Calendar,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toast';
import { ApplicationItem, JobItem } from '@/types';

const STAGES = [
  { id: 'APPLIED', label: 'Applied', color: 'border-slate-300 bg-slate-50/70 text-slate-800' },
  { id: 'UNDER_REVIEW', label: 'Under Review', color: 'border-amber-300 bg-amber-50/70 text-amber-900' },
  { id: 'SHORTLISTED', label: 'Shortlisted', color: 'border-indigo-300 bg-indigo-50/70 text-indigo-900' },
  { id: 'INTERVIEW', label: 'Interview', color: 'border-purple-300 bg-purple-50/70 text-purple-900' },
  { id: 'SELECTED', label: 'Selected / Offer', color: 'border-emerald-300 bg-emerald-50/70 text-emerald-900' },
  { id: 'REJECTED', label: 'Rejected', color: 'border-rose-300 bg-rose-50/70 text-rose-900' },
];

export default function RecruitmentPipelinePage() {
  const { showToast } = useToast();
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);

  const fetchPipeline = async () => {
    try {
      const [appsRes, jobsRes] = await Promise.all([
        fetch('/api/applications').then((r) => r.json()),
        fetch('/api/jobs?recruiterOnly=true').then((r) => r.json()),
      ]);

      if (appsRes.success) setApplications(appsRes.data || []);
      if (jobsRes.success) setJobs(jobsRes.data.jobs || []);
    } catch (e) {
      showToast('error', 'Failed to load pipeline');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPipeline();
  }, []);

  const handleMoveStage = async (appId: string, targetStage: string) => {
    try {
      const res = await fetch(`/api/applications/${appId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: targetStage }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast('success', `Candidate moved to ${targetStage.replace('_', ' ')}`);
        setApplications((prev) =>
          prev.map((a) => (a.id === appId ? { ...a, status: targetStage as any } : a))
        );
      } else {
        showToast('error', data.error || 'Failed to move candidate');
      }
    } catch (e) {
      showToast('error', 'Network error');
    }
  };

  const filteredApps = applications.filter((app) => {
    if (selectedJobId === 'ALL') return true;
    return app.jobId === selectedJobId;
  });

  return (
    <AppLayout allowedRole="RECRUITER">
      <div className="space-y-6 max-w-full">
        {/* Header & Job Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Hiring Pipeline Board</h1>
            <p className="text-xs text-slate-600 mt-0.5">
              Visual Kanban workflow to track and progress candidates across recruitment stages
            </p>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-xs font-bold text-slate-700 whitespace-nowrap">Filter by Role:</label>
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white p-2 text-xs font-semibold text-slate-800 focus:border-indigo-500 focus:outline-none min-w-[200px]"
            >
              <option value="ALL">All Active Roles ({applications.length} candidates)</option>
              {jobs.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* KANBAN BOARD */}
        {loading ? (
          <div className="py-20 text-center text-xs text-slate-600">Loading pipeline board...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-start overflow-x-auto pb-4">
            {STAGES.map((stage) => {
              const stageApps = filteredApps.filter((a) => a.status === stage.id);

              return (
                <div
                  key={stage.id}
                  className="bg-slate-100/70 rounded-2xl p-3 border border-slate-200 flex flex-col min-h-[500px]"
                >
                  {/* Column Header */}
                  <div className={`p-2.5 rounded-xl border mb-3 flex items-center justify-between ${stage.color}`}>
                    <span className="text-xs font-extrabold">{stage.label}</span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white/80 shadow-xs">
                      {stageApps.length}
                    </span>
                  </div>

                  {/* Cards inside column */}
                  <div className="space-y-3 flex-1">
                    {stageApps.length === 0 ? (
                      <div className="p-4 text-center text-[11px] text-slate-600 italic">
                        No candidates
                      </div>
                    ) : (
                      stageApps.map((app) => (
                        <div
                          key={app.id}
                          className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all space-y-2.5"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="text-xs font-bold text-slate-900">
                                {app.candidateProfile?.user?.name}
                              </div>
                              <p className="text-[10px] text-slate-600 font-medium line-clamp-1">
                                {app.job?.title}
                              </p>
                            </div>

                            {app.resume && (
                              <a
                                href={app.resume.fileUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-slate-600 hover:text-indigo-600 p-0.5"
                                title="View Resume"
                              >
                                <FileText className="h-3.5 w-3.5" />
                              </a>
                            )}
                          </div>

                          {/* Skills chip */}
                          {app.candidateProfile?.skills && app.candidateProfile.skills.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {app.candidateProfile.skills.slice(0, 2).map((s) => (
                                <span
                                  key={s.id}
                                  className="px-1.5 py-0.5 text-[9px] font-medium bg-slate-50 text-slate-600 rounded"
                                >
                                  {s.skill.name}
                                </span>
                              ))}
                            </div>
                          )}

                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                            <span className="text-[10px] text-slate-600">
                              {new Date(app.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </span>

                            {/* Move dropdown */}
                            <select
                              value={app.status}
                              onChange={(e) => handleMoveStage(app.id, e.target.value)}
                              className="text-[10px] font-bold rounded-md bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 p-1 border-none focus:ring-0 cursor-pointer"
                            >
                              <option value="" disabled>
                                Move to...
                              </option>
                              {STAGES.map((s) => (
                                <option key={s.id} value={s.id}>
                                  {s.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
