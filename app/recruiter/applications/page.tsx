'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import {
  Users,
  Search,
  Filter,
  FileText,
  CheckCircle2,
  XCircle,
  Video,
  Clock,
  Eye,
  Star,
  ChevronDown,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { ApplicationItem } from '@/types';

export const dynamic = 'force-dynamic';

function RecruiterApplicationsContent() {
  const searchParams = useSearchParams();
  const initialJobId = searchParams.get('jobId') || '';
  const { showToast } = useToast();

  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchCandidate, setSearchCandidate] = useState('');
  const [filterJobId, setFilterJobId] = useState(initialJobId);
  const [filterStatus, setFilterStatus] = useState('ALL');

  // Candidate detail / review modal
  const [reviewApp, setReviewApp] = useState<ApplicationItem | null>(null);

  // Schedule Interview modal
  const [interviewModalOpen, setInterviewModalOpen] = useState(false);
  const [interviewAppId, setInterviewAppId] = useState<string | null>(null);
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewType, setInterviewType] = useState('Technical Interview');
  const [interviewLink, setInterviewLink] = useState('https://meet.google.com/demo-hub-meet');
  const [interviewNotes, setInterviewNotes] = useState('');
  const [scheduling, setScheduling] = useState(false);

  const fetchApps = async () => {
    try {
      const res = await fetch('/api/applications');
      const data = await res.json();
      if (data.success) {
        setApplications(data.data || []);
      }
    } catch (e) {
      showToast('error', 'Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const handleUpdateStatus = async (appId: string, newStatus: string, extraData: any = {}) => {
    try {
      const res = await fetch(`/api/applications/${appId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          ...extraData,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast('success', `Candidate moved to ${newStatus.replace('_', ' ')}`);
        fetchApps();
        if (reviewApp?.id === appId) {
          setReviewApp((prev) => (prev ? { ...prev, status: newStatus as any } : null));
        }
      } else {
        showToast('error', data.error || 'Failed to update status');
      }
    } catch (e) {
      showToast('error', 'Network error');
    }
  };

  const handleScheduleInterviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!interviewAppId || !interviewDate) return;

    setScheduling(true);
    await handleUpdateStatus(interviewAppId, 'INTERVIEW', {
      interviewDate,
      interviewType,
      interviewLink,
      notes: interviewNotes,
    });
    setScheduling(false);
    setInterviewModalOpen(false);
    setInterviewAppId(null);
  };

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

  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      !searchCandidate ||
      app.candidateProfile?.user?.name.toLowerCase().includes(searchCandidate.toLowerCase()) ||
      app.job?.title.toLowerCase().includes(searchCandidate.toLowerCase());

    const matchesJob = !filterJobId || app.jobId === filterJobId;
    const matchesStatus = filterStatus === 'ALL' || app.status === filterStatus;

    return matchesSearch && matchesJob && matchesStatus;
  });

  return (
    <AppLayout allowedRole="RECRUITER">
      <div className="space-y-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Candidate Applications</h1>
            <p className="text-xs text-slate-600 mt-1">
              Review, screen, and progress candidate applications across your jobs
            </p>
          </div>

          <a
            href="/recruiter/pipeline"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:border-indigo-300 text-xs font-bold text-slate-700 hover:text-indigo-600 transition-colors shadow-sm self-start sm:self-auto"
          >
            Switch to Visual Kanban Board →
          </a>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-600" />
            <input
              type="text"
              value={searchCandidate}
              onChange={(e) => setSearchCandidate(e.target.value)}
              placeholder="Search by candidate name or job title..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white p-2 text-xs font-semibold text-slate-800 focus:border-indigo-500 focus:outline-none"
            >
              <option value="ALL">All Stages</option>
              <option value="APPLIED">Applied</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="SHORTLISTED">Shortlisted</option>
              <option value="INTERVIEW">Interview</option>
              <option value="SELECTED">Selected</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>

        {/* Applications Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-xs text-slate-600">Loading candidate applications...</div>
          ) : filteredApps.length === 0 ? (
            <div className="p-16 text-center space-y-3">
              <Users className="h-12 w-12 mx-auto text-slate-600" />
              <h3 className="text-base font-bold text-slate-900">No applications found</h3>
              <p className="text-xs text-slate-600">Try adjusting your filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                    <th className="py-4 px-6">Candidate</th>
                    <th className="py-4 px-4">Applied Role</th>
                    <th className="py-4 px-4">Applied Date</th>
                    <th className="py-4 px-4">Resume</th>
                    <th className="py-4 px-4">Stage</th>
                    <th className="py-4 px-6 text-right">Pipeline Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredApps.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Candidate */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0 text-xs">
                            {app.candidateProfile?.user?.name.charAt(0) || 'C'}
                          </div>
                          <div>
                            <button
                              type="button"
                              onClick={() => setReviewApp(app)}
                              className="font-bold text-slate-900 hover:text-indigo-600 transition-colors text-left"
                            >
                              {app.candidateProfile?.user?.name}
                            </button>
                            <p className="text-[11px] text-slate-600 truncate max-w-xs">
                              {app.candidateProfile?.headline || app.candidateProfile?.user?.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Job */}
                      <td className="py-4 px-4">
                        <span className="font-semibold text-slate-800">{app.job?.title}</span>
                        <p className="text-[10px] text-slate-600">{app.job?.location}</p>
                      </td>

                      {/* Applied Date */}
                      <td className="py-4 px-4 text-slate-600">
                        {new Date(app.createdAt).toLocaleDateString()}
                      </td>

                      {/* Resume link */}
                      <td className="py-4 px-4">
                        {app.resume ? (
                          <a
                            href={app.resume.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 font-bold text-indigo-600 hover:underline"
                          >
                            <FileText className="h-3.5 w-3.5" />
                            PDF
                          </a>
                        ) : (
                          <span className="text-slate-600">No file</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">{getStatusBadge(app.status)}</td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {app.status === 'APPLIED' && (
                            <button
                              onClick={() => handleUpdateStatus(app.id, 'UNDER_REVIEW')}
                              className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100"
                              title="Move to Under Review"
                            >
                              Review
                            </button>
                          )}

                          {app.status !== 'SHORTLISTED' && (
                            <button
                              onClick={() => handleUpdateStatus(app.id, 'SHORTLISTED')}
                              className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                              title="Shortlist Candidate"
                            >
                              Shortlist
                            </button>
                          )}

                          {app.status !== 'INTERVIEW' && (
                            <button
                              onClick={() => {
                                setInterviewAppId(app.id);
                                setInterviewModalOpen(true);
                              }}
                              className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100"
                              title="Schedule Interview"
                            >
                              Interview
                            </button>
                          )}

                          {app.status !== 'SELECTED' && (
                            <button
                              onClick={() => handleUpdateStatus(app.id, 'SELECTED')}
                              className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                              title="Select / Offer"
                            >
                              Select
                            </button>
                          )}

                          {app.status !== 'REJECTED' && (
                            <button
                              onClick={() => handleUpdateStatus(app.id, 'REJECTED')}
                              className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100"
                              title="Reject Candidate"
                            >
                              Reject
                            </button>
                          )}

                          <button
                            onClick={() => setReviewApp(app)}
                            className="p-1 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
                            title="Inspect Profile"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Review Candidate Modal */}
      {reviewApp && (
        <Modal
          isOpen={!!reviewApp}
          onClose={() => setReviewApp(null)}
          title={`Candidate Profile - ${reviewApp.candidateProfile?.user?.name}`}
        >
          <div className="space-y-6">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">{reviewApp.candidateProfile?.user?.name}</h3>
                <p className="text-xs text-slate-600">{reviewApp.candidateProfile?.headline}</p>
                <p className="text-[11px] text-slate-600 mt-1">
                  {reviewApp.candidateProfile?.user?.email} • {reviewApp.candidateProfile?.user?.phone || 'No phone'}
                </p>
              </div>
              <div>{getStatusBadge(reviewApp.status)}</div>
            </div>

            {/* Resume button */}
            {reviewApp.resume && (
              <a
                href={reviewApp.resume.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-50 text-indigo-700 font-bold text-xs hover:bg-indigo-100 transition-colors"
              >
                <FileText className="h-4 w-4" /> Open Candidate Resume Document
              </a>
            )}

            {/* Skills */}
            {reviewApp.candidateProfile?.skills && reviewApp.candidateProfile.skills.length > 0 && (
              <div>
                <span className="text-xs font-bold text-slate-700 block mb-1.5">Candidate Skills</span>
                <div className="flex flex-wrap gap-1.5">
                  {reviewApp.candidateProfile.skills.map((s) => (
                    <span
                      key={s.id}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 text-[11px] font-semibold text-slate-700"
                    >
                      {s.skill.name} {s.yearsOfExperience ? `(${s.yearsOfExperience}y)` : ''}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Cover letter */}
            {reviewApp.coverLetter && (
              <div>
                <span className="text-xs font-bold text-slate-700 block mb-1">Cover Letter</span>
                <p className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 whitespace-pre-line leading-relaxed">
                  {reviewApp.coverLetter}
                </p>
              </div>
            )}

            {/* Change Status Buttons inside Modal */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <span className="text-xs font-bold text-slate-700 block">Update Pipeline Stage:</span>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleUpdateStatus(reviewApp.id, 'SHORTLISTED')}
                >
                  Move to Shortlist
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    setInterviewAppId(reviewApp.id);
                    setInterviewModalOpen(true);
                  }}
                >
                  Schedule Interview
                </Button>
                <Button
                  size="sm"
                  variant="success"
                  onClick={() => handleUpdateStatus(reviewApp.id, 'SELECTED')}
                >
                  Mark Selected
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleUpdateStatus(reviewApp.id, 'REJECTED')}
                >
                  Reject
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Schedule Interview Modal */}
      <Modal
        isOpen={interviewModalOpen}
        onClose={() => setInterviewModalOpen(false)}
        title="Schedule Interview Round"
      >
        <form onSubmit={handleScheduleInterviewSubmit} className="space-y-4">
          <Input
            label="Interview Round Type *"
            type="text"
            value={interviewType}
            onChange={(e) => setInterviewType(e.target.value)}
            placeholder="e.g. Technical & Architecture Round"
            required
          />

          <Input
            label="Scheduled Date & Time *"
            type="datetime-local"
            value={interviewDate}
            onChange={(e) => setInterviewDate(e.target.value)}
            required
          />

          <Input
            label="Video Link or Office Location"
            type="text"
            value={interviewLink}
            onChange={(e) => setInterviewLink(e.target.value)}
            placeholder="https://meet.google.com/xyz or Office Room 302"
          />

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Internal Interview Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={interviewNotes}
              onChange={(e) => setInterviewNotes(e.target.value)}
              placeholder="Candidate preparation topics or panel members..."
              className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={() => setInterviewModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={scheduling}>
              Confirm Interview & Notify Candidate
            </Button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
}

export default function RecruiterApplicationsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-xs text-slate-500">Loading applications...</div>}>
      <RecruiterApplicationsContent />
    </Suspense>
  );
}
