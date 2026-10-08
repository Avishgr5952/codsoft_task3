'use client';

import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Bookmark, Building2, MapPin, Trash2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';

export default function SavedJobsPage() {
  const { showToast } = useToast();
  const [savedJobs, setSavedJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSavedJobs = async () => {
    try {
      const res = await fetch('/api/saved-jobs');
      const data = await res.json();
      if (data.success) {
        setSavedJobs(data.data || []);
      }
    } catch (e) {
      showToast('error', 'Failed to fetch saved jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const handleRemove = async (jobId: string) => {
    try {
      const res = await fetch(`/api/jobs/${jobId}/save`, { method: 'DELETE' });
      if (res.ok) {
        showToast('success', 'Job removed from saved list');
        setSavedJobs((prev) => prev.filter((item) => item.job?.id !== jobId));
      }
    } catch (e) {
      showToast('error', 'Error removing job');
    }
  };

  return (
    <AppLayout allowedRole="CANDIDATE">
      <div className="space-y-8 max-w-5xl mx-auto">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Saved Jobs</h1>
          <p className="text-xs text-slate-600 mt-1">
            Keep track of interesting opportunities and apply whenever you’re ready
          </p>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-slate-600">Loading saved jobs...</div>
        ) : savedJobs.length === 0 ? (
          <div className="p-16 text-center bg-white rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <Bookmark className="h-12 w-12 mx-auto text-slate-600" />
            <h3 className="text-base font-bold text-slate-900">No saved jobs yet</h3>
            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              Browse through our open listings and click the bookmark icon to save roles for later review.
            </p>
            <Button variant="primary" size="sm" onClick={() => (window.location.href = '/jobs')}>
              Discover Jobs
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedJobs.map((item) => (
              <div
                key={item.id}
                className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                        {item.job?.company?.logoUrl ? (
                          <img src={item.job.company.logoUrl} alt={item.job.company.name} className="h-full w-full object-cover" />
                        ) : (
                          <Building2 className="h-6 w-6 text-slate-600" />
                        )}
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-slate-600">{item.job?.company?.name}</span>
                        <a
                          href={`/jobs/${item.job?.id}`}
                          className="text-sm font-bold text-slate-900 hover:text-indigo-600 transition-colors block line-clamp-1"
                        >
                          {item.job?.title}
                        </a>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemove(item.job?.id)}
                      className="p-2 text-slate-600 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Remove from saved"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-600 mt-3">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-slate-600" />
                      {item.job?.location}
                    </span>
                    <span>•</span>
                    <span className="capitalize">{item.job?.workMode?.toLowerCase()}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      {item.job?.salaryMin && item.job?.salaryMax
                        ? `$${(item.job.salaryMin / 1000).toFixed(0)}k - $${(item.job.salaryMax / 1000).toFixed(0)}k`
                        : 'Competitive'}
                    </span>
                    <span className="text-[10px] text-slate-600">
                      Saved {new Date(item.savedAt).toLocaleDateString()}
                    </span>
                  </div>

                  <a
                    href={`/jobs/${item.job?.id}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors"
                  >
                    Apply Now <ArrowRight className="h-3 w-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
