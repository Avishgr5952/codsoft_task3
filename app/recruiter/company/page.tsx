'use client';

import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Building2, Globe, MapPin, Users, Calendar, Upload, ExternalLink } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { CompanyItem } from '@/types';

export default function RecruiterCompanyProfilePage() {
  const { showToast } = useToast();
  const [company, setCompany] = useState<CompanyItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [website, setWebsite] = useState('');
  const [industry, setIndustry] = useState('');
  const [location, setLocation] = useState('');
  const [companySize, setCompanySize] = useState('');
  const [description, setDescription] = useState('');
  const [foundedYear, setFoundedYear] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [twitterUrl, setTwitterUrl] = useState('');

  const fetchCompany = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data.success && data.data.recruiterProfile?.company) {
        const compId = data.data.recruiterProfile.company.id;
        const compRes = await fetch(`/api/companies/${compId}`);
        const compData = await compRes.json();
        if (compData.success) {
          const c = compData.data;
          setCompany(c);
          setName(c.name || '');
          setLogoUrl(c.logoUrl || '');
          setWebsite(c.website || '');
          setIndustry(c.industry || '');
          setLocation(c.location || '');
          setCompanySize(c.companySize || '');
          setDescription(c.description || '');
          setFoundedYear(c.foundedYear ? c.foundedYear.toString() : '');
          setLinkedinUrl(c.linkedinUrl || '');
          setTwitterUrl(c.twitterUrl || '');
        }
      }
    } catch (e) {
      showToast('error', 'Failed to fetch company details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompany();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company) return;

    setSaving(true);
    try {
      const res = await fetch(`/api/companies/${company.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          logoUrl,
          website,
          industry,
          location,
          companySize,
          description,
          foundedYear,
          linkedinUrl,
          twitterUrl,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast('success', 'Company profile saved successfully!');
        fetchCompany();
      } else {
        showToast('error', data.error || 'Failed to update company');
      }
    } catch (e) {
      showToast('error', 'Network error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AppLayout allowedRole="RECRUITER">
        <div className="space-y-6 animate-pulse">
          <div className="h-44 bg-white rounded-3xl border border-slate-200" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout allowedRole="RECRUITER">
      <div className="space-y-8 max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Company Profile</h1>
            <p className="text-xs text-slate-600 mt-1">
              Manage how your company appears to prospective candidates across CareerHub
            </p>
          </div>

          {company && (
            <a
              href={`/companies/${company.id}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:text-indigo-600 shadow-sm"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Preview Public Page
            </a>
          )}
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Company Name *"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <Input
                label="Industry / Domain"
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="e.g. Cloud Infrastructure & Enterprise AI"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="HQ Location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. San Francisco, CA"
              />

              <Input
                label="Company Size"
                type="text"
                value={companySize}
                onChange={(e) => setCompanySize(e.target.value)}
                placeholder="e.g. 51-200 employees"
              />

              <Input
                label="Founded Year"
                type="number"
                value={foundedYear}
                onChange={(e) => setFoundedYear(e.target.value)}
                placeholder="2018"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Website URL"
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://company.com"
              />

              <Input
                label="Logo Image URL"
                type="url"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="https://... logo image link"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                About the Organization / Culture
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your mission, vision, team culture, and product impact..."
                className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
              <Input
                label="LinkedIn Profile"
                type="url"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/company/..."
              />

              <Input
                label="Twitter / X Profile"
                type="url"
                value={twitterUrl}
                onChange={(e) => setTwitterUrl(e.target.value)}
                placeholder="https://twitter.com/..."
              />
            </div>

            <div className="flex justify-end pt-3">
              <Button type="submit" variant="primary" size="lg" isLoading={saving}>
                Save Company Profile
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
