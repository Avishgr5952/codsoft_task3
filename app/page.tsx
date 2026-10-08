import React from 'react';
import { prisma } from '@/lib/prisma';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import {
  Search,
  MapPin,
  Briefcase,
  Building2,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Users,
  Compass,
  FileCheck,
  Zap,
} from 'lucide-react';
import { JobStatus } from '@prisma/client';

export const revalidate = 0;

export default async function LandingPage() {
  // Fetch real data from database
  const [featuredJobs, categories, companies, totalJobsCount, totalCompaniesCount, totalCandidatesCount] =
    await Promise.all([
      prisma.job.findMany({
        where: { status: JobStatus.ACTIVE },
        include: {
          company: true,
          category: true,
        },
        orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
        take: 6,
      }),
      prisma.jobCategory.findMany({
        include: {
          _count: { select: { jobs: { where: { status: JobStatus.ACTIVE } } } },
        },
        take: 6,
      }),
      prisma.company.findMany({
        include: {
          _count: { select: { jobs: { where: { status: JobStatus.ACTIVE } } } },
        },
        take: 6,
      }),
      prisma.job.count({ where: { status: JobStatus.ACTIVE } }),
      prisma.company.count(),
      prisma.user.count({ where: { role: 'CANDIDATE' } }),
    ]);

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50/70 via-white to-white py-20 lg:py-28 border-b border-slate-100">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.100),white)] opacity-60" />

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-100/80 px-4 py-1.5 text-xs font-semibold text-indigo-800 shadow-sm mb-6 animate-pulse">
              <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
              <span>Connect Talent with Opportunity</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto leading-tight">
              Find Your Next <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">Career Opportunity</span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Discover verified jobs, connect directly with fast-growing companies, and take the confident next step in your professional journey.
            </p>

            {/* Job Search Bar */}
            <div className="mt-10 max-w-4xl mx-auto">
              <form
                action="/jobs"
                method="GET"
                className="bg-white p-3 rounded-2xl shadow-xl shadow-indigo-100/60 border border-slate-200/80 flex flex-col md:flex-row items-center gap-3"
              >
                {/* Keyword input */}
                <div className="flex-1 flex items-center gap-3 w-full px-4 py-2 bg-slate-50 md:bg-transparent rounded-xl border md:border-none border-slate-200">
                  <Search className="h-5 w-5 text-indigo-500 shrink-0" />
                  <input
                    type="text"
                    name="keyword"
                    placeholder="Job title, keyword, or company..."
                    className="w-full bg-transparent text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none"
                  />
                </div>

                <div className="hidden md:block h-8 w-px bg-slate-200" />

                {/* Location input */}
                <div className="flex-1 flex items-center gap-3 w-full px-4 py-2 bg-slate-50 md:bg-transparent rounded-xl border md:border-none border-slate-200">
                  <MapPin className="h-5 w-5 text-indigo-500 shrink-0" />
                  <input
                    type="text"
                    name="location"
                    placeholder="City, state, or 'Remote'..."
                    className="w-full bg-transparent text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-8 py-3.5 text-sm font-bold text-white shadow-md shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-[0.98]"
                >
                  <Search className="h-4 w-4" />
                  Find Jobs
                </button>
              </form>

              {/* Popular quick searches */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-600">
                <span className="font-semibold text-slate-700">Popular searches:</span>
                <a href="/jobs?keyword=Next.js" className="hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 px-2.5 py-1 rounded-full transition-colors">
                  Next.js
                </a>
                <a href="/jobs?keyword=React" className="hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 px-2.5 py-1 rounded-full transition-colors">
                  React
                </a>
                <a href="/jobs?keyword=Python" className="hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 px-2.5 py-1 rounded-full transition-colors">
                  Python
                </a>
                <a href="/jobs?workMode=REMOTE" className="hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 px-2.5 py-1 rounded-full transition-colors">
                  Remote Roles
                </a>
                <a href="/jobs?jobType=INTERNSHIP" className="hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 px-2.5 py-1 rounded-full transition-colors">
                  Internships
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* STATISTICS SECTION */}
        <section className="py-12 bg-white border-b border-slate-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="p-6 rounded-2xl bg-indigo-50/40 border border-indigo-100/60">
                <div className="text-3xl sm:text-4xl font-extrabold text-indigo-600">{totalJobsCount || 16}+</div>
                <div className="text-xs sm:text-sm font-semibold text-slate-600 mt-1">Live Job Openings</div>
              </div>
              <div className="p-6 rounded-2xl bg-blue-50/40 border border-blue-100/60">
                <div className="text-3xl sm:text-4xl font-extrabold text-blue-600">{totalCompaniesCount || 6}+</div>
                <div className="text-xs sm:text-sm font-semibold text-slate-600 mt-1">Hiring Companies</div>
              </div>
              <div className="p-6 rounded-2xl bg-emerald-50/40 border border-emerald-100/60">
                <div className="text-3xl sm:text-4xl font-extrabold text-emerald-600">{totalCandidatesCount || 10}+</div>
                <div className="text-xs sm:text-sm font-semibold text-slate-600 mt-1">Active Candidates</div>
              </div>
              <div className="p-6 rounded-2xl bg-purple-50/40 border border-purple-100/60">
                <div className="text-3xl sm:text-4xl font-extrabold text-purple-600">95%</div>
                <div className="text-xs sm:text-sm font-semibold text-slate-600 mt-1">Interview Match Rate</div>
              </div>
            </div>
          </div>
        </section>

        {/* POPULAR CATEGORIES */}
        <section className="py-16 md:py-20 bg-slate-50/60">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Browse by Industry</span>
                <h2 className="text-3xl font-extrabold text-slate-900 mt-1">Popular Job Categories</h2>
              </div>
              <a
                href="/jobs"
                className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600 hover:text-indigo-700 group"
              >
                <span>View all fields</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((cat) => (
                <a
                  key={cat.id}
                  href={`/jobs?category=${cat.slug}`}
                  className="group block p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="h-12 w-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <Briefcase className="h-6 w-6" />
                    </div>
                    <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full group-hover:bg-indigo-50 group-hover:text-indigo-700 transition-colors">
                      {cat._count.jobs} jobs
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mt-4 group-hover:text-indigo-600 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                    {cat.description || 'Explore positions across high-growth companies.'}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURED JOBS SECTION */}
        <section className="py-16 md:py-24 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Handpicked Roles</span>
                <h2 className="text-3xl font-extrabold text-slate-900 mt-1">Featured Job Openings</h2>
              </div>
              <a
                href="/jobs"
                className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600 hover:text-indigo-700 group"
              >
                <span>Browse all {totalJobsCount} jobs</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredJobs.map((job) => (
                <div
                  key={job.id}
                  className="flex flex-col justify-between p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-lg hover:border-indigo-300 transition-all group"
                >
                  <div>
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center text-slate-600 font-bold">
                          {job.company.logoUrl ? (
                            <img src={job.company.logoUrl} alt={job.company.name} className="h-full w-full object-cover" />
                          ) : (
                            <Building2 className="h-6 w-6 text-slate-600" />
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-600">{job.company.name}</p>
                          <span className="inline-block mt-0.5 text-[11px] font-medium text-slate-600">
                            {job.location}
                          </span>
                        </div>
                      </div>

                      {job.featured && (
                        <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-amber-100 text-amber-800">
                          Featured
                        </span>
                      )}
                    </div>

                    <a href={`/jobs/${job.id}`}>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                        {job.title}
                      </h3>
                    </a>

                    <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                      {job.description}
                    </p>

                    {/* Skill tags */}
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {job.skills.slice(0, 3).map((skill: string, i: number) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 text-[11px] font-medium rounded-md bg-slate-100 text-slate-600"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-900">
                        {job.salaryMin && job.salaryMax
                          ? `$${(job.salaryMin / 1000).toFixed(0)}k - $${(job.salaryMax / 1000).toFixed(0)}k`
                          : 'Competitive'}
                      </span>
                      <span className="text-[10px] text-slate-600 block capitalize">
                        {job.jobType.replace('_', ' ').toLowerCase()} • {job.workMode.toLowerCase()}
                      </span>
                    </div>

                    <a
                      href={`/jobs/${job.id}`}
                      className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-600 hover:bg-indigo-600 hover:text-white transition-colors"
                    >
                      Apply
                      <ArrowRight className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW CAREERHUB WORKS */}
        <section className="py-20 bg-slate-50 border-y border-slate-200/80">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Streamlined Process</span>
              <h2 className="text-3xl font-extrabold text-slate-900 mt-1">How CareerHub Works</h2>
              <p className="text-sm text-slate-600 mt-3">
                Whether you are stepping into a new career or building an elite team, our platform simplifies every milestone.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Candidate Flow */}
              <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold">
                  <Users className="h-3.5 w-3.5" />
                  For Job Seekers
                </div>
                <h3 className="text-xl font-bold text-slate-900">Your Fast Track to Your Dream Role</h3>

                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="h-8 w-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">1</div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Create & Verify Your Profile</h4>
                      <p className="text-xs text-slate-600 mt-0.5">Showcase your skills, education, past impact, and upload multiple tailored resumes.</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="h-8 w-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">2</div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">One-Click Applications</h4>
                      <p className="text-xs text-slate-600 mt-0.5">Apply with your preferred resume and personalized cover letter with real-time status tracking.</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="h-8 w-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">3</div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Interview & Get Hired</h4>
                      <p className="text-xs text-slate-600 mt-0.5">Receive instant alerts when shortlisted, join interviews, and receive formal offer letters.</p>
                    </div>
                  </div>
                </div>

                <a
                  href="/register"
                  className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-700"
                >
                  Create candidate account <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>

              {/* Recruiter Flow */}
              <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
                  <Building2 className="h-3.5 w-3.5" />
                  For Employers & Recruiters
                </div>
                <h3 className="text-xl font-bold text-slate-900">Precision Hiring Made Effortless</h3>

                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="h-8 w-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">1</div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Publish Targeted Job Posts</h4>
                      <p className="text-xs text-slate-600 mt-0.5">Detail responsibilities, salary ranges, and technical skills to attract top-tier talent.</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="h-8 w-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">2</div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Interactive Hiring Pipeline</h4>
                      <p className="text-xs text-slate-600 mt-0.5">Move candidates through Under Review, Shortlisted, Interview, and Offer stages in seconds.</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="h-8 w-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">3</div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Data-Driven Analytics</h4>
                      <p className="text-xs text-slate-600 mt-0.5">Analyze application volume, conversion velocity, and team performance metrics.</p>
                    </div>
                  </div>
                </div>

                <a
                  href="/register"
                  className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-700"
                >
                  Post a job opening <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURED COMPANIES */}
        <section className="py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Industry Leaders</span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-1">Top Companies Hiring on CareerHub</h2>

            <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {companies.map((company) => (
                <a
                  key={company.id}
                  href={`/companies/${company.id}`}
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-indigo-300 hover:shadow-md transition-all flex flex-col items-center justify-center group"
                >
                  <div className="h-14 w-14 rounded-xl bg-white border border-slate-200 flex items-center justify-center overflow-hidden mb-3">
                    {company.logoUrl ? (
                      <img src={company.logoUrl} alt={company.name} className="h-full w-full object-cover" />
                    ) : (
                      <Building2 className="h-7 w-7 text-indigo-600" />
                    )}
                  </div>
                  <span className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors text-center line-clamp-1">
                    {company.name}
                  </span>
                  <span className="text-[10px] text-slate-600 mt-0.5">
                    {company._count.jobs} open jobs
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* CALL TO ACTION */}
        <section className="py-20 bg-gradient-to-tr from-indigo-900 via-indigo-800 to-blue-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent pointer-events-none" />

          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to Accelerate Your Career or Hiring?
            </h2>
            <p className="mt-4 text-base sm:text-lg text-indigo-200 max-w-2xl mx-auto">
              Join thousands of professionals and forward-thinking companies already connecting on CareerHub.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/jobs"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white text-indigo-900 text-sm font-bold shadow-lg hover:bg-indigo-50 transition-all active:scale-[0.98]"
              >
                Explore Open Jobs
              </a>
              <a
                href="/register"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-indigo-700/80 hover:bg-indigo-700 text-white text-sm font-bold border border-indigo-500/50 transition-all active:scale-[0.98]"
              >
                Register as Recruiter
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
