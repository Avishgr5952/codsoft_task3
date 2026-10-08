'use client';

import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import {
  Send,
  Building2,
  Calendar,
  Eye,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  FileText,
  Video,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { ApplicationItem } from '@/types';

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [selectedApp, setSelectedApp] = useState<ApplicationItem | null>(null);

  useEffect(() => {
    fetch('/api/applications')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setApplications(data.data || []);
      })
      .finally(() => setLoading(false));
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
        return <Badge variant="success">Selected / Offer Extended</Badge>;
      case 'REJECTED':
        return <Badge variant="danger">Not Selected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const filteredApps = applications.filter((app) => {
    if (filterStatus === 'ALL') return true;
    return app.status === filterStatus;
  });

  return (
    <AppLayout allowedRole="CANDIDATE">
      <div className="space-y-8 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">My Applications</h1>
            <p className="text-xs text-slate-600 mt-1">
              Track real-time hiring progress across all your job submissions
            </p>
          </div>

          {/* Status Filter Pill Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200">
            {['ALL', 'APPLIED', 'UNDER_REVIEW', 'SHORTLISTED', 'INTERVIEW', 'SELECTED'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filterStatus === st
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {st.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Applications List Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-xs text-slate-600">Loading your applications...</div>
          ) : filteredApps.length === 0 ? (
            <div className="p-16 text-center space-y-3">
              <Send className="h-12 w-12 mx-auto text-slate-600" />
              <h3 className="text-base font-bold text-slate-900">No applications found</h3>
              <p className="text-xs text-slate-600">
                You haven't submitted any applications under this filter.
              </p>
              <Button variant="primary" size="sm" onClick={() => (window.location.href = '/jobs')}>
                Search Jobs
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                    <th className="py-4 px-6">Job Role & Company</th>
                    <th className="py-4 px-4">Applied Date</th>
                    <th className="py-4 px-4">Status</th>
                    <th className="py-4 px-4">Last Activity</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredApps.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Job & Company */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                            {app.job?.company?.logoUrl ? (
                              <img src={app.job.company.logoUrl} alt={app.job.company.name} className="h-full w-full object-cover" />
                            ) : (
                              <Building2 className="h-5 w-5 text-slate-600" />
                            )}
                          </div>
                          <div>
                            <a
                              href={`/jobs/${app.jobId}`}
                              className="font-bold text-slate-900 hover:text-indigo-600 transition-colors"
                            >
                              {app.job?.title}
                            </a>
                            <p className="text-[11px] text-slate-600">
                              {app.job?.company?.name} • {app.job?.location}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Applied Date */}
                      <td className="py-4 px-4 text-slate-600">
                        {new Date(app.createdAt).toLocaleDateString()}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">{getStatusBadge(app.status)}</td>

                      {/* Last updated */}
                      <td className="py-4 px-4 text-slate-600">
                        {new Date(app.statusUpdatedAt || app.updatedAt).toLocaleDateString()}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedApp(app)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-indigo-300 text-xs font-semibold text-slate-700 hover:text-indigo-600 transition-colors bg-white"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Application Details Modal */}
      {selectedApp && (
        <Modal
          isOpen={!!selectedApp}
          onClose={() => setSelectedApp(null)}
          title={`Application Details - ${selectedApp.job?.title}`}
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h4 className="text-sm font-bold text-slate-900">{selectedApp.job?.company?.name}</h4>
                <p className="text-xs text-slate-600">{selectedApp.job?.location}</p>
              </div>
              <div>{getStatusBadge(selectedApp.status)}</div>
            </div>

            {/* Application Timeline Stages */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-3">
                Hiring Journey Timeline
              </span>
              <div className="grid grid-cols-5 gap-2 text-center text-[10px]">
                {['APPLIED', 'UNDER_REVIEW', 'SHORTLISTED', 'INTERVIEW', 'SELECTED'].map((stage, i) => {
                  const stageIndex = ['APPLIED', 'UNDER_REVIEW', 'SHORTLISTED', 'INTERVIEW', 'SELECTED'].indexOf(selectedApp.status);
                  const isCurrent = selectedApp.status === stage;
                  const isPassed = stageIndex >= i;

                  return (
                    <div
                      key={stage}
                      className={`p-2 rounded-xl border font-bold ${
                        isCurrent
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-500/20'
                          : isPassed
                          ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                          : 'border-slate-100 bg-slate-50 text-slate-600'
                      }`}
                    >
                      {stage.replace('_', ' ')}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Interviews info if present */}
            {selectedApp.interviews && selectedApp.interviews.length > 0 && (
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-900">
                  <Video className="h-4 w-4 text-indigo-600" />
                  Scheduled Interview
                </div>
                {selectedApp.interviews.map((iv) => (
                  <div key={iv.id} className="text-xs text-indigo-800 space-y-1">
                    <p className="font-semibold">{iv.interviewType}</p>
                    <p className="text-[11px]">
                      Date & Time: {new Date(iv.scheduledAt).toLocaleString()}
                    </p>
                    {iv.locationOrLink && (
                      <p className="text-[11px] underline">Link/Location: {iv.locationOrLink}</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Resume used */}
            {selectedApp.resume && (
              <div>
                <span className="text-xs font-bold text-slate-700 block mb-1">Attached Resume</span>
                <a
                  href={selectedApp.resume.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-indigo-600 hover:bg-slate-50"
                >
                  <FileText className="h-4 w-4" />
                  {selectedApp.resume.fileName}
                </a>
              </div>
            )}

            {/* Cover letter */}
            {selectedApp.coverLetter && (
              <div>
                <span className="text-xs font-bold text-slate-700 block mb-1">Submitted Cover Letter</span>
                <p className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 whitespace-pre-line leading-relaxed">
                  {selectedApp.coverLetter}
                </p>
              </div>
            )}

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <Button variant="secondary" size="sm" onClick={() => setSelectedApp(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </AppLayout>
  );
}
