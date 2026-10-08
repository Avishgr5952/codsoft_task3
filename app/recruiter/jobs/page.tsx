'use client';

import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import {
  Briefcase,
  PlusCircle,
  Eye,
  Users,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  MoreVertical,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { JobItem } from '@/types';

export default function ManageJobsPage() {
  const { showToast } = useToast();
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Status or delete modals
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Edit job modal
  const [editingJob, setEditingJob] = useState<JobItem | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editStatus, setEditStatus] = useState<string>('ACTIVE');
  const [editSalaryMin, setEditSalaryMin] = useState('');
  const [editSalaryMax, setEditSalaryMax] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);

  const fetchRecruiterJobs = async () => {
    try {
      const res = await fetch('/api/jobs?recruiterOnly=true&limit=50');
      const data = await res.json();
      if (data.success) {
        setJobs(data.data.jobs || []);
      }
    } catch (e) {
      showToast('error', 'Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecruiterJobs();
  }, []);

  const handleOpenEdit = (job: JobItem) => {
    setEditingJob(job);
    setEditTitle(job.title);
    setEditLocation(job.location);
    setEditStatus(job.status);
    setEditSalaryMin(job.salaryMin ? job.salaryMin.toString() : '');
    setEditSalaryMax(job.salaryMax ? job.salaryMax.toString() : '');
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingJob) return;

    setSavingEdit(true);
    try {
      const res = await fetch(`/api/jobs/${editingJob.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editTitle,
          location: editLocation,
          status: editStatus,
          salaryMin: editSalaryMin ? parseFloat(editSalaryMin) : null,
          salaryMax: editSalaryMax ? parseFloat(editSalaryMax) : null,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast('success', 'Job updated successfully');
        setEditingJob(null);
        fetchRecruiterJobs();
      } else {
        showToast('error', data.error || 'Failed to update job');
      }
    } catch (e) {
      showToast('error', 'Network error');
    } finally {
      setSavingEdit(false);
    }
  };

  const handleToggleJobStatus = async (job: JobItem, newStatus: 'ACTIVE' | 'CLOSED') => {
    try {
      const res = await fetch(`/api/jobs/${job.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        showToast('success', `Job marked as ${newStatus.toLowerCase()}`);
        fetchRecruiterJobs();
      }
    } catch (e) {
      showToast('error', 'Error updating status');
    }
  };

  const handleDeleteJob = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/jobs/${deleteId}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('success', 'Job deleted successfully');
        setDeleteId(null);
        fetchRecruiterJobs();
      } else {
        showToast('error', 'Failed to delete job');
      }
    } catch (e) {
      showToast('error', 'Network error');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge variant="success">Active</Badge>;
      case 'DRAFT':
        return <Badge variant="secondary">Draft</Badge>;
      case 'CLOSED':
        return <Badge variant="danger">Closed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <AppLayout allowedRole="RECRUITER">
      <div className="space-y-8 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Manage Job Postings</h1>
            <p className="text-xs text-slate-600 mt-1">
              Review published roles, monitor application flow, or archive filled openings
            </p>
          </div>

          <a
            href="/recruiter/jobs/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-100 transition-all self-start sm:self-auto"
          >
            <PlusCircle className="h-4 w-4" /> Post New Job
          </a>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-xs text-slate-600">Loading jobs...</div>
          ) : jobs.length === 0 ? (
            <div className="p-16 text-center space-y-3">
              <Briefcase className="h-12 w-12 mx-auto text-slate-600" />
              <h3 className="text-base font-bold text-slate-900">No jobs posted yet</h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                Get started by creating your first job opening to reach active job seekers.
              </p>
              <Button variant="primary" size="sm" onClick={() => (window.location.href = '/recruiter/jobs/new')}>
                Create Job
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                    <th className="py-4 px-6">Job Position</th>
                    <th className="py-4 px-4">Status</th>
                    <th className="py-4 px-4">Applicants</th>
                    <th className="py-4 px-4">Views</th>
                    <th className="py-4 px-4">Posted Date</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {jobs.map((job) => (
                    <tr key={job.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-6">
                        <a href={`/jobs/${job.id}`} className="font-bold text-slate-900 hover:text-indigo-600 block line-clamp-1">
                          {job.title}
                        </a>
                        <p className="text-[11px] text-slate-600 mt-0.5">
                          {job.location} • {job.jobType.replace('_', ' ')}
                        </p>
                      </td>

                      <td className="py-4 px-4">{getStatusBadge(job.status)}</td>

                      <td className="py-4 px-4">
                        <a
                          href={`/recruiter/applications?jobId=${job.id}`}
                          className="inline-flex items-center gap-1 font-bold text-indigo-600 hover:underline"
                        >
                          <Users className="h-3.5 w-3.5" />
                          {job._count?.applications || 0}
                        </a>
                      </td>

                      <td className="py-4 px-4 text-slate-600">{job.viewsCount || 0}</td>

                      <td className="py-4 px-4 text-slate-600">
                        {new Date(job.createdAt).toLocaleDateString()}
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {job.status === 'ACTIVE' ? (
                            <button
                              type="button"
                              onClick={() => handleToggleJobStatus(job, 'CLOSED')}
                              className="px-2.5 py-1 text-[11px] rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 font-semibold"
                              title="Close Job"
                            >
                              Close
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleToggleJobStatus(job, 'ACTIVE')}
                              className="px-2.5 py-1 text-[11px] rounded-lg border border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 font-semibold"
                              title="Publish Job"
                            >
                              Publish
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleOpenEdit(job)}
                            className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg"
                            title="Edit Job"
                          >
                            <Edit className="h-4 w-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeleteId(job.id)}
                            className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                            title="Delete Job"
                          >
                            <Trash2 className="h-4 w-4" />
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

      {/* Edit Job Modal */}
      {editingJob && (
        <Modal
          isOpen={!!editingJob}
          onClose={() => setEditingJob(null)}
          title={`Edit Job - ${editingJob.title}`}
        >
          <form onSubmit={handleSaveEdit} className="space-y-4">
            <Input
              label="Job Title"
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              required
            />

            <Input
              label="Location"
              type="text"
              value={editLocation}
              onChange={(e) => setEditLocation(e.target.value)}
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Salary Min ($)"
                type="number"
                value={editSalaryMin}
                onChange={(e) => setEditSalaryMin(e.target.value)}
              />
              <Input
                label="Salary Max ($)"
                type="number"
                value={editSalaryMax}
                onChange={(e) => setEditSalaryMax(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none"
              >
                <option value="ACTIVE">Active (Accepting applications)</option>
                <option value="DRAFT">Draft</option>
                <option value="CLOSED">Closed (Archived)</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <Button type="button" variant="ghost" onClick={() => setEditingJob(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" isLoading={savingEdit}>
                Save Changes
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteJob}
        title="Delete Job Listing"
        message="Are you sure you want to delete this job posting? All candidate applications associated with this job will also be removed."
        confirmText="Delete Job"
        variant="danger"
      />
    </AppLayout>
  );
}
