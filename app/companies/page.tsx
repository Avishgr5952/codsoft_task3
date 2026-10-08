'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Building2, MapPin, Search, ExternalLink, Briefcase, ArrowRight } from 'lucide-react';
import { CompanyItem } from '@/types';

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<CompanyItem[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/companies')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setCompanies(data.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredCompanies = companies.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.industry?.toLowerCase().includes(search.toLowerCase()) ||
    c.location?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <div className="bg-white border-b border-slate-200 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center max-w-2xl">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Top Hiring Companies
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Explore industry-leading organizations, discover their workplace cultures, and apply to their open vacancies.
          </p>

          <div className="mt-6 relative max-w-md mx-auto">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-600" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search companies by name, industry, or location..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-indigo-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-44 bg-white rounded-2xl border border-slate-200 animate-pulse" />
            ))}
          </div>
        ) : filteredCompanies.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-2xl border border-slate-200 p-8">
            <Building2 className="h-12 w-12 mx-auto text-slate-600 mb-3" />
            <h3 className="text-base font-bold text-slate-900">No companies found</h3>
            <p className="text-xs text-slate-600 mt-1">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map((company) => (
              <a
                key={company.id}
                href={`/companies/${company.id}`}
                className="group block p-6 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-14 w-14 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                      {company.logoUrl ? (
                        <img src={company.logoUrl} alt={company.name} className="h-full w-full object-cover" />
                      ) : (
                        <Building2 className="h-7 w-7 text-indigo-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {company.name}
                      </h3>
                      <p className="text-xs text-slate-600 font-medium">{company.industry}</p>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-[11px] font-bold text-indigo-700">
                    {company._count?.jobs || 0} jobs
                  </span>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {company.description || 'Pioneering technology and innovative solutions.'}
                </p>

                <div className="flex items-center justify-between text-xs text-slate-600 pt-3 border-t border-slate-100">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-slate-600" />
                    {company.location || 'Worldwide'}
                  </span>
                  <span className="font-semibold text-indigo-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                    View profile <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
