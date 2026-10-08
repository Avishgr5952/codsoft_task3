'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import {
  Building2,
  MapPin,
  Globe,
  Users,
  Calendar,
  Briefcase,
  ExternalLink,
  ChevronLeft,
  ArrowRight,
  Bookmark,
} from 'lucide-react';
import { CompanyItem, JobItem } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export default function CompanyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const companyId = params?.id as string;

  const [company, setCompany] = useState<(CompanyItem & { jobs: JobItem[] }) | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!companyId) return;

    fetch(`/api/companies/${companyId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setCompany(data.data);
      })
      .finally(() => setLoading(false));
  }, [companyId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="mx-auto max-w-5xl px-4 py-16 flex-1 w-full animate-pulse space-y-6">
          <div className="h-44 bg-white rounded-3xl border border-slate-200" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="mx-auto max-w-md px-4 py-24 text-center space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Company Not Found</h2>
          <Button variant="primary" onClick={() => router.push('/companies')}>
            Back to Companies
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
        <a
          href="/companies"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to all companies
        </a>

        {/* Company Header Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-5">
            <div className="h-20 w-20 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
              {company.logoUrl ? (
                <img src={company.logoUrl} alt={company.name} className="h-full w-full object-cover" />
              ) : (
                <Building2 className="h-10 w-10 text-indigo-600" />
              )}
            </div>

            <div className="space-y-1.5">
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {company.name}
              </h1>
              <p className="text-xs font-semibold text-indigo-600">{company.industry}</p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1">
                {company.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {company.location}
                  </span>
                )}
                {company.companySize && (
                  <span className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />
                    {company.companySize}
                  </span>
                )}
                {company.foundedYear && (
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    Founded {company.foundedYear}
                  </span>
                )}
              </div>
            </div>
          </div>

          {company.website && (
            <div>
              <a
                href={company.website}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:border-indigo-300 text-xs font-bold text-slate-700 hover:text-indigo-600 transition-colors bg-white shadow-sm"
              >
                <Globe className="h-4 w-4 text-indigo-600" />
                Visit Website
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          )}
        </div>

        {/* Company Description & Open Positions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2">
                About the Organization
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                {company.description || 'No description provided yet.'}
              </p>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between pb-2">
              <h2 className="text-lg font-bold text-slate-900">
                Open Positions at {company.name} ({company.jobs?.length || 0})
              </h2>
            </div>

            {company.jobs && company.jobs.length > 0 ? (
              <div className="space-y-3">
                {company.jobs.map((job) => (
                  <div
                    key={job.id}
                    className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                  >
                    <div>
                      <a href={`/jobs/${job.id}`}>
                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {job.title}
                        </h4>
                      </a>
                      <div className="flex items-center gap-2 text-xs text-slate-600 mt-1">
                        <span>{job.location}</span>
                        <span>•</span>
                        <span className="capitalize">{job.workMode.toLowerCase()}</span>
                        <span>•</span>
                        <span>{job.jobType.replace('_', ' ')}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-slate-900">
                        {job.salaryMin && job.salaryMax
                          ? `$${(job.salaryMin / 1000).toFixed(0)}k - $${(job.salaryMax / 1000).toFixed(0)}k`
                          : 'Competitive'}
                      </span>
                      <a
                        href={`/jobs/${job.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-700 text-xs font-bold transition-colors"
                      >
                        Apply <ArrowRight className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-600">
                No active openings at this time. Check back soon!
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
