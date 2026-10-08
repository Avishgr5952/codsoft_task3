'use client';

import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import {
  Briefcase,
  Search,
  Building2,
  Trash2,
  Eye,
  CheckCircle2,
  XCircle,
  ExternalLink,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { useToast } from '@/components/ui/Toast';
import { JobItem } from '@/types';

export default function AdminJobsPage() {
  const { showToast } = useToast();
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/jobs?limit=50&status=ALL');
      const data = await res.json();
      if (data.success) {
        setJobs(data.data.jobs || []);
      }
    } catch (e) {
      showToast('error', 'Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleToggleStatus = async (job: JobItem) => {
    const nextStatus = job.status === 'ACTIVE' ? 'CLOSED' : 'ACTIVE';
    try {
      const res = await fetch(`/api/jobs/${job.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        showToast('success', `Job marked as ${nextStatus.toLowerCase()}`);
        fetchJobs();
      }
    } catch (e) {
      showToast('error', 'Error updating status');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/jobs/${deleteId}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('success', 'Job posting removed');
        setDeleteId(null);
        fetchJobs();
      }
    } catch (e) {
      showToast('error', 'Network error');
    }
  };

  const filtered = jobs.filter(
    (j) =>
      !search ||
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.company?.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout allowedRole="ADMIN">
      <div className="space-y-8 max-w-7xl mx-auto">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Job Listings Moderation</h1>
          <p className="text-xs text-slate-600 mt-1">
            Review and moderate all employer job postings published on the portal
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-600" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by job title or employer organization..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:border-rose-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-xs text-slate-600">Loading postings...</div>
          ) : filtered.length === 0 ? (
            <div className="p-16 text-center text-xs text-slate-600">No job listings found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                    <th className="py-4 px-6">Position</th>
                    <th className="py-4 px-4">Company</th>
                    <th className="py-4 px-4">Status</th>
                    <th className="py-4 px-4">Applicants</th>
                    <th className="py-4 px-4">Posted Date</th>
                    <th className="py-4 px-6 text-right">Moderation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filtered.map((job) => (
                    <tr key={job.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-6">
                        <a
                          href={`/jobs/${job.id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="font-bold text-slate-900 hover:text-rose-600 inline-flex items-center gap-1.5"
                        >
                          {job.title}
                          <ExternalLink className="h-3 w-3 text-slate-600" />
                        </a>
                        <p className="text-[11px] text-slate-600">{job.location} • {job.jobType}</p>
                      </td>

                      <td className="py-4 px-4 font-semibold text-slate-800">
                        {job.company?.name}
                      </td>

                      <td className="py-4 px-4">
                        <Badge variant={job.status === 'ACTIVE' ? 'success' : 'danger'} size="sm">
                          {job.status}
                        </Badge>
                      </td>

                      <td className="py-4 px-4 font-bold text-slate-800">
                        {job._count?.applications || 0}
                      </td>

                      <td className="py-4 px-4 text-slate-600">
                        {new Date(job.createdAt).toLocaleDateString()}
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(job)}
                            className={`px-2.5 py-1 text-[11px] font-bold rounded-lg ${
                              job.status === 'ACTIVE'
                                ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            }`}
                          >
                            {job.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeleteId(job.id)}
                            className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                            title="Delete Inappropriate Job"
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

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Job Posting"
        message="Are you sure you want to delete this job posting from the platform? This cannot be undone."
        confirmText="Delete Job"
        variant="danger"
      />
    </AppLayout>
  );
}
