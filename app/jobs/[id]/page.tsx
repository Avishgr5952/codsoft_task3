'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import {
  Briefcase,
  Building2,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  Bookmark,
  Share2,
  CheckCircle2,
  ArrowRight,
  FileText,
  AlertCircle,
  ExternalLink,
  ChevronLeft,
  Sparkles,
} from 'lucide-react';
import { JobItem, ResumeItem } from '@/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';

export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params?.id as string;
  const { showToast } = useToast();

  const [job, setJob] = useState<JobItem | null>(null);
  const [similarJobs, setSimilarJobs] = useState<JobItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Application Modal state
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [resumes, setResumes] = useState<ResumeItem[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string>('');
  const [coverLetter, setCoverLetter] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  useEffect(() => {
    if (!jobId) return;

    const fetchJob = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/jobs/${jobId}`);
        const data = await res.json();
        if (data.success) {
          setJob(data.data.job);
          setSimilarJobs(data.data.similarJobs || []);
        } else {
          showToast('error', data.error || 'Job not found');
        }
      } catch (err) {
        showToast('error', 'Error fetching job');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

  const openApplyModal = async () => {
    // Check if user is logged in as candidate and fetch their resumes
    try {
      const res = await fetch('/api/candidates/resumes');
      if (res.status === 401) {
        router.push(`/login?redirect=/jobs/${jobId}`);
        return;
      }
      const data = await res.json();
      if (data.success) {
        setResumes(data.data || []);
        const defaultRes = data.data?.find((r: ResumeItem) => r.isDefault) || data.data?.[0];
        if (defaultRes) setSelectedResumeId(defaultRes.id);
        setApplyModalOpen(true);
      } else {
        router.push(`/login?redirect=/jobs/${jobId}`);
      }
    } catch (e) {
      router.push(`/login?redirect=/jobs/${jobId}`);
    }
  };

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!job) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId: job.id,
          resumeId: selectedResumeId || undefined,
          coverLetter,
          additionalInfo,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setAppliedSuccess(true);
        setJob((prev) => (prev ? { ...prev, hasApplied: true } : null));
        showToast('success', 'Application submitted successfully!');
        setTimeout(() => {
          setApplyModalOpen(false);
        }, 1500);
      } else {
        showToast('error', data.error || 'Failed to submit application');
      }
    } catch (e) {
      showToast('error', 'Network error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleSave = async () => {
    if (!job) return;
    try {
      const res = await fetch(`/api/jobs/${job.id}/save`, { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.success) {
        setJob((prev) => (prev ? { ...prev, isSaved: data.data.isSaved } : null));
        showToast('success', data.message);
      } else if (res.status === 401) {
        router.push(`/login?redirect=/jobs/${job.id}`);
      }
    } catch (e) {
      showToast('error', 'Error saving job');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="mx-auto max-w-5xl px-4 py-16 flex-1 w-full animate-pulse space-y-6">
          <div className="h-44 bg-white rounded-3xl border border-slate-200" />
          <div className="h-96 bg-white rounded-3xl border border-slate-200" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="mx-auto max-w-md px-4 py-24 text-center space-y-4">
          <div className="h-16 w-16 mx-auto rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertCircle className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Job Posting Not Found</h2>
          <p className="text-xs text-slate-600">The position you are looking for may have been closed or removed.</p>
          <Button variant="primary" onClick={() => router.push('/jobs')}>
            Browse Other Jobs
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        {/* Back Link */}
        <a
          href="/jobs"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to all jobs
        </a>

        {/* HERO CARD */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-5">
            <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
              {job.company?.logoUrl ? (
                <img src={job.company.logoUrl} alt={job.company.name} className="h-full w-full object-cover" />
              ) : (
                <Building2 className="h-8 w-8 text-slate-600" />
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  {job.title}
                </h1>
                {job.featured && (
                  <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full bg-amber-100 text-amber-800">
                    Featured
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                <a
                  href={`/companies/${job.companyId}`}
                  className="font-bold text-indigo-600 hover:underline flex items-center gap-1"
                >
                  <Building2 className="h-3.5 w-3.5" />
                  {job.company?.name}
                </a>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-slate-600" />
                  {job.location}
                </span>
                <span>•</span>
                <span className="capitalize">{job.workMode.toLowerCase()}</span>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <Badge variant="primary" size="sm">
                  {job.jobType.replace('_', ' ')}
                </Badge>
                <Badge variant="secondary" size="sm">
                  {job.experienceLevel.replace('_', ' ')}
                </Badge>
                {job.category && (
                  <Badge variant="outline" size="sm">
                    {job.category.name}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex sm:flex-col items-center sm:items-end justify-between border-t md:border-t-0 pt-4 md:pt-0 border-slate-100 gap-3">
            <div className="text-left sm:text-right">
              <span className="text-lg sm:text-xl font-extrabold text-slate-900 block">
                {job.salaryMin && job.salaryMax
                  ? `$${(job.salaryMin / 1000).toFixed(0)}k - $${(job.salaryMax / 1000).toFixed(0)}k / yr`
                  : 'Competitive Salary'}
              </span>
              <span className="text-[11px] text-slate-600">
                Posted {new Date(job.createdAt).toLocaleDateString()}
              </span>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleToggleSave}
                className={`p-3 rounded-xl border transition-colors ${
                  job.isSaved
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-600'
                    : 'bg-white border-slate-200 text-slate-600 hover:text-indigo-600'
                }`}
                title={job.isSaved ? 'Saved' : 'Save Job'}
              >
                <Bookmark className={`h-5 w-5 ${job.isSaved ? 'fill-indigo-600' : ''}`} />
              </button>

              {job.hasApplied ? (
                <div className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                  <CheckCircle2 className="h-4 w-4" />
                  Application Submitted
                </div>
              ) : (
                <Button
                  variant="primary"
                  size="lg"
                  onClick={openApplyModal}
                  className="w-full sm:w-auto px-7"
                >
                  Apply Now
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* DETAILS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Cols: Description, Responsibilities, Requirements, Benefits */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                Job Overview
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                {job.description}
              </p>
            </div>

            {/* Responsibilities */}
            {job.responsibilities && (
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                  Key Responsibilities
                </h2>
                <div className="text-xs sm:text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                  {job.responsibilities}
                </div>
              </div>
            )}

            {/* Requirements */}
            {job.requirements && (
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                  Qualifications & Requirements
                </h2>
                <div className="text-xs sm:text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                  {job.requirements}
                </div>
              </div>
            )}

            {/* Benefits */}
            {job.benefits && (
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                  Perks & Benefits
                </h2>
                <div className="text-xs sm:text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                  {job.benefits}
                </div>
              </div>
            )}

            {/* Required Skills */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                Desired Skills & Tech Stack
              </h2>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-100 text-xs font-semibold text-indigo-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Col: Job Metadata & Company Card */}
          <div className="space-y-6">
            {/* Quick Details Box */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                Job Details Summary
              </h3>

              <div className="space-y-3 divide-y divide-slate-100 text-xs">
                <div className="pt-2 flex justify-between">
                  <span className="text-slate-600">Employment Type</span>
                  <span className="font-bold text-slate-800">{job.jobType.replace('_', ' ')}</span>
                </div>
                <div className="pt-2 flex justify-between">
                  <span className="text-slate-600">Work Mode</span>
                  <span className="font-bold text-slate-800 capitalize">{job.workMode.toLowerCase()}</span>
                </div>
                <div className="pt-2 flex justify-between">
                  <span className="text-slate-600">Experience Level</span>
                  <span className="font-bold text-slate-800">{job.experienceLevel.replace('_', ' ')}</span>
                </div>
                <div className="pt-2 flex justify-between">
                  <span className="text-slate-600">Location</span>
                  <span className="font-bold text-slate-800">{job.location}</span>
                </div>
                {job.deadline && (
                  <div className="pt-2 flex justify-between">
                    <span className="text-slate-600">Deadline</span>
                    <span className="font-bold text-rose-600">
                      {new Date(job.deadline).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>

              {!job.hasApplied && (
                <Button variant="primary" className="w-full mt-4" size="lg" onClick={openApplyModal}>
                  Apply for this position
                </Button>
              )}
            </div>

            {/* Company Box */}
            {job.company && (
              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                  About the Employer
                </h3>

                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                    {job.company.logoUrl ? (
                      <img src={job.company.logoUrl} alt={job.company.name} className="h-full w-full object-cover" />
                    ) : (
                      <Building2 className="h-6 w-6 text-slate-600" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{job.company.name}</h4>
                    <p className="text-[11px] text-slate-600">{job.company.industry}</p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-4">
                  {job.company.description}
                </p>

                <a
                  href={`/companies/${job.company.id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:underline"
                >
                  View company profile <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}
          </div>
        </div>

        {/* SIMILAR JOBS SECTION */}
        {similarJobs.length > 0 && (
          <div className="pt-8 border-t border-slate-200 space-y-6">
            <h3 className="text-xl font-bold text-slate-900">Similar Job Opportunities</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {similarJobs.map((simJob) => (
                <a
                  key={simJob.id}
                  href={`/jobs/${simJob.id}`}
                  className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all group block space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                      {simJob.company?.logoUrl ? (
                        <img src={simJob.company.logoUrl} alt={simJob.company.name} className="h-full w-full object-cover" />
                      ) : (
                        <Building2 className="h-5 w-5 text-slate-600" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-1">
                        {simJob.title}
                      </h4>
                      <p className="text-[10px] text-slate-600">{simJob.company?.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-600 pt-2 border-t border-slate-100">
                    <span>{simJob.location}</span>
                    <span className="font-bold text-slate-900">
                      {simJob.salaryMin ? `$${(simJob.salaryMin / 1000).toFixed(0)}k+` : 'Competitive'}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* APPLY MODAL */}
      <Modal
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        title={`Apply for ${job.title}`}
      >
        {appliedSuccess ? (
          <div className="py-8 text-center space-y-3">
            <div className="h-14 w-14 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Application Submitted!</h3>
            <p className="text-xs text-slate-600">
              The hiring team at {job.company?.name} has received your application. You can track progress in your Candidate Dashboard.
            </p>
          </div>
        ) : (
          <form onSubmit={handleApplySubmit} className="space-y-4">
            {/* Resume Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Select Resume *
              </label>
              {resumes.length === 0 ? (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800">
                  You haven’t uploaded a resume yet.{' '}
                  <a href="/candidate/resumes" className="font-bold underline">
                    Upload a resume
                  </a>{' '}
                  to complete your application.
                </div>
              ) : (
                <select
                  value={selectedResumeId}
                  onChange={(e) => setSelectedResumeId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none"
                  required
                >
                  {resumes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.fileName} {r.isDefault ? '(Default)' : ''}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Cover Letter */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Cover Letter
              </label>
              <textarea
                rows={4}
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Explain why you are an ideal fit for this role and what exciting impact you bring..."
                className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            {/* Additional info */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Additional Information (Optional)
              </label>
              <input
                type="text"
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                placeholder="Earliest start date, portfolio link, or sponsorship requirements..."
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setApplyModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={submitting}
                disabled={resumes.length === 0}
              >
                Submit Application
              </Button>
            </div>
          </form>
        )}
      </Modal>

      <Footer />
    </div>
  );
}
