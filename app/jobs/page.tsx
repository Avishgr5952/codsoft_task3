'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import {
  Search,
  MapPin,
  Briefcase,
  Building2,
  Filter,
  SlidersHorizontal,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowRight,
  X,
  Check,
} from 'lucide-react';
import { JobItem, JobCategoryItem } from '@/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toast';

export const dynamic = 'force-dynamic';

function JobsListContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [categories, setCategories] = useState<JobCategoryItem[]>([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filter States initialized from URL
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>(
    searchParams.get('jobType') ? [searchParams.get('jobType')!] : []
  );
  const [selectedWorkModes, setSelectedWorkModes] = useState<string[]>(
    searchParams.get('workMode') ? [searchParams.get('workMode')!] : []
  );
  const [selectedExpLevels, setSelectedExpLevels] = useState<string[]>(
    searchParams.get('experienceLevel') ? [searchParams.get('experienceLevel')!] : []
  );
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1', 10));

  // Fetch Categories once
  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setCategories(data.data);
      })
      .catch(() => {});
  }, []);

  // Fetch Jobs on filter/page change
  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (keyword) params.set('keyword', keyword);
      if (location) params.set('location', location);
      if (selectedCategory) params.set('category', selectedCategory);
      if (selectedJobTypes.length > 0) params.set('jobType', selectedJobTypes[0]);
      if (selectedWorkModes.length > 0) params.set('workMode', selectedWorkModes[0]);
      if (selectedExpLevels.length > 0) params.set('experienceLevel', selectedExpLevels[0]);
      if (sort) params.set('sort', sort);
      params.set('page', page.toString());
      params.set('limit', '10');

      const res = await fetch(`/api/jobs?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        setJobs(data.data.jobs || []);
        setPagination(data.data.pagination);
      }
    } catch (err) {
      showToast('error', 'Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [keyword, location, selectedCategory, selectedJobTypes, selectedWorkModes, selectedExpLevels, sort, page]);

  const toggleFilter = (item: string, currentList: string[], setList: (v: string[]) => void) => {
    if (currentList.includes(item)) {
      setList(currentList.filter((x) => x !== item));
    } else {
      setList([...currentList, item]);
    }
    setPage(1);
  };

  const clearAllFilters = () => {
    setKeyword('');
    setLocation('');
    setSelectedCategory('');
    setSelectedJobTypes([]);
    setSelectedWorkModes([]);
    setSelectedExpLevels([]);
    setSort('newest');
    setPage(1);
  };

  const handleToggleSaveJob = async (jobId: string, currentSaved?: boolean) => {
    try {
      const res = await fetch(`/api/jobs/${jobId}/save`, { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.success) {
        setJobs((prev) =>
          prev.map((j) => (j.id === jobId ? { ...j, isSaved: data.data.isSaved } : j))
        );
        showToast('success', data.message);
      } else {
        if (res.status === 401) {
          router.push('/login?redirect=/jobs');
        } else {
          showToast('error', data.error || 'Failed to update saved job');
        }
      }
    } catch (e) {
      showToast('error', 'Network error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      {/* Header Banner */}
      <div className="bg-white border-b border-slate-200 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Find Your Ideal Career
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Browse through {pagination.total} verified open positions
          </p>

          {/* Quick search inputs */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-6 relative">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-600" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => {
                  setKeyword(e.target.value);
                  setPage(1);
                }}
                placeholder="Search job title, skill, or keyword..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div className="md:col-span-4 relative">
              <MapPin className="absolute left-3.5 top-3 h-4 w-4 text-slate-600" />
              <input
                type="text"
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  setPage(1);
                }}
                placeholder="Location (city or Remote)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div className="md:col-span-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 shadow-sm"
              >
                <Filter className="h-4 w-4 text-indigo-600" />
                Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Jobs Listing & Filters Grid */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* DESKTOP FILTERS SIDEBAR */}
          <aside className="hidden lg:block lg:col-span-1 space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                  <SlidersHorizontal className="h-4 w-4 text-indigo-600" />
                  Filter Jobs
                </div>
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="text-xs text-indigo-600 hover:underline font-semibold"
                >
                  Clear all
                </button>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setPage(1);
                  }}
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none"
                >
                  <option value="">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Job Type */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Job Type
                </label>
                <div className="space-y-2">
                  {[
                    { label: 'Full-time', value: 'FULL_TIME' },
                    { label: 'Part-time', value: 'PART_TIME' },
                    { label: 'Internship', value: 'INTERNSHIP' },
                    { label: 'Contract', value: 'CONTRACT' },
                  ].map((type) => (
                    <label key={type.value} className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedJobTypes.includes(type.value)}
                        onChange={() => toggleFilter(type.value, selectedJobTypes, setSelectedJobTypes)}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                      />
                      {type.label}
                    </label>
                  ))}
                </div>
              </div>

              {/* Work Mode */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Work Mode
                </label>
                <div className="space-y-2">
                  {[
                    { label: 'Remote', value: 'REMOTE' },
                    { label: 'Hybrid', value: 'HYBRID' },
                    { label: 'On-site', value: 'ON_SITE' },
                  ].map((mode) => (
                    <label key={mode.value} className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedWorkModes.includes(mode.value)}
                        onChange={() => toggleFilter(mode.value, selectedWorkModes, setSelectedWorkModes)}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                      />
                      {mode.label}
                    </label>
                  ))}
                </div>
              </div>

              {/* Experience Level */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Experience Level
                </label>
                <div className="space-y-2">
                  {[
                    { label: 'Entry Level', value: 'ENTRY_LEVEL' },
                    { label: 'Mid Level', value: 'MID_LEVEL' },
                    { label: 'Senior Level', value: 'SENIOR_LEVEL' },
                    { label: 'Lead / Executive', value: 'LEAD_EXECUTIVE' },
                  ].map((exp) => (
                    <label key={exp.value} className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedExpLevels.includes(exp.value)}
                        onChange={() => toggleFilter(exp.value, selectedExpLevels, setSelectedExpLevels)}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                      />
                      {exp.label}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* JOBS CONTENT */}
          <div className="lg:col-span-3 space-y-4">
            {/* Sort & Count bar */}
            <div className="flex items-center justify-between bg-white px-5 py-3.5 rounded-xl border border-slate-200">
              <span className="text-xs font-semibold text-slate-600">
                Showing <strong className="text-slate-900">{jobs.length}</strong> of{' '}
                <strong className="text-slate-900">{pagination.total}</strong> positions
              </span>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-600">Sort by:</span>
                <select
                  value={sort}
                  onChange={(e) => {
                    setSort(e.target.value);
                    setPage(1);
                  }}
                  className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-800 focus:border-indigo-500 focus:outline-none"
                >
                  <option value="newest">Newest First</option>
                  <option value="salary_desc">Salary: High to Low</option>
                  <option value="salary_asc">Salary: Low to High</option>
                </select>
              </div>
            </div>

            {/* Jobs List */}
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-36 rounded-2xl bg-white border border-slate-200 animate-pulse p-6" />
                ))}
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-4">
                <div className="h-16 w-16 mx-auto rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <Search className="h-8 w-8" />
                </div>
                <h3 className="text-base font-bold text-slate-900">No matching jobs found</h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  Try adjusting your search keywords, clearing selected filters, or exploring related job categories.
                </p>
                <Button variant="outline" size="sm" onClick={clearAllFilters}>
                  Clear all filters
                </Button>
              </div>
            ) : (
              <div className="space-y-3.5">
                {jobs.map((job) => (
                  <div
                    key={job.id}
                    className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                  >
                    <div className="flex items-start gap-4 flex-1">
                      {/* Logo */}
                      <div className="h-12 w-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                        {job.company?.logoUrl ? (
                          <img
                            src={job.company.logoUrl}
                            alt={job.company.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Building2 className="h-6 w-6 text-slate-600" />
                        )}
                      </div>

                      {/* Info */}
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <a
                            href={`/jobs/${job.id}`}
                            className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors"
                          >
                            {job.title}
                          </a>
                          {job.featured && (
                            <span className="px-2 py-0.5 text-[9px] font-bold uppercase rounded-full bg-amber-100 text-amber-800">
                              Featured
                            </span>
                          )}
                          {job.hasApplied && (
                            <span className="px-2 py-0.5 text-[9px] font-bold uppercase rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                              <Check className="h-2.5 w-2.5" /> Applied
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                          <span className="font-semibold text-slate-800">{job.company?.name}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {job.location}
                          </span>
                          <span>•</span>
                          <span className="capitalize">{job.workMode.toLowerCase()}</span>
                        </div>

                        {/* Badges / skills */}
                        <div className="flex flex-wrap gap-1.5 pt-1.5">
                          <Badge variant="secondary" size="sm">
                            {job.jobType.replace('_', ' ')}
                          </Badge>
                          <Badge variant="outline" size="sm">
                            {job.experienceLevel.replace('_', ' ')}
                          </Badge>
                          {job.skills.slice(0, 3).map((s, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-md bg-slate-100 text-[10px] text-slate-600 font-medium"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right action & salary */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 gap-3">
                      <div className="text-left sm:text-right">
                        <div className="text-sm font-extrabold text-slate-900">
                          {job.salaryMin && job.salaryMax
                            ? `$${(job.salaryMin / 1000).toFixed(0)}k - $${(job.salaryMax / 1000).toFixed(0)}k`
                            : 'Competitive'}
                        </div>
                        <span className="text-[10px] text-slate-600 block">
                          Posted {new Date(job.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleToggleSaveJob(job.id, job.isSaved)}
                          className={`p-2 rounded-xl border transition-colors ${
                            job.isSaved
                              ? 'bg-indigo-50 border-indigo-200 text-indigo-600'
                              : 'bg-white border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-slate-300'
                          }`}
                          title={job.isSaved ? 'Remove from saved' : 'Save job'}
                        >
                          <Bookmark className={`h-4 w-4 ${job.isSaved ? 'fill-indigo-600' : ''}`} />
                        </button>

                        <a
                          href={`/jobs/${job.id}`}
                          className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-sm active:scale-[0.98]"
                        >
                          View Details
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between pt-6 border-t border-slate-200">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page <= 1}
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </button>

                <div className="text-xs font-medium text-slate-600">
                  Page {pagination.page} of {pagination.totalPages}
                </div>

                <button
                  onClick={() => setPage(Math.min(pagination.totalPages, page + 1))}
                  disabled={page >= pagination.totalPages}
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default function JobsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-xs text-slate-500">Loading jobs...</div>}>
      <JobsListContent />
    </Suspense>
  );
}
