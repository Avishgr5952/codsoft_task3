'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { Briefcase, Building2, MapPin, DollarSign, Calendar, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { JobCategoryItem } from '@/types';

export default function PostJobPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [categories, setCategories] = useState<JobCategoryItem[]>([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [jobType, setJobType] = useState('FULL_TIME');
  const [workMode, setWorkMode] = useState('HYBRID');
  const [experienceLevel, setExperienceLevel] = useState('MID_LEVEL');
  const [location, setLocation] = useState('');
  const [salaryMin, setSalaryMin] = useState('');
  const [salaryMax, setSalaryMax] = useState('');
  const [deadline, setDeadline] = useState('');
  const [skills, setSkills] = useState('');
  const [description, setDescription] = useState('');
  const [responsibilities, setResponsibilities] = useState('');
  const [requirements, setRequirements] = useState('');
  const [benefits, setBenefits] = useState('');

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCategories(data.data || []);
          if (data.data?.length > 0) setCategoryId(data.data[0].id);
        }
      })
      .finally(() => setLoadingCats(false));
  }, []);

  const handleSubmit = async (status: 'ACTIVE' | 'DRAFT') => {
    if (!title.trim() || !description.trim() || !location.trim() || !categoryId) {
      showToast('error', 'Please fill in Title, Location, Category, and Description');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          categoryId,
          jobType,
          workMode,
          experienceLevel,
          location,
          salaryMin: salaryMin ? parseFloat(salaryMin) : undefined,
          salaryMax: salaryMax ? parseFloat(salaryMax) : undefined,
          deadline: deadline || undefined,
          skills: skills ? skills.split(',').map((s) => s.trim()).filter(Boolean) : [],
          description,
          responsibilities,
          requirements,
          benefits,
          status,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast('success', status === 'ACTIVE' ? 'Job published successfully!' : 'Job saved as draft');
        router.push('/recruiter/jobs');
      } else {
        showToast('error', data.error || 'Failed to create job');
      }
    } catch (e) {
      showToast('error', 'Network error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppLayout allowedRole="RECRUITER">
      <div className="space-y-8 max-w-4xl mx-auto">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Post a New Job</h1>
          <p className="text-xs text-slate-600 mt-1">
            Publish your open position to connect with thousands of active candidates
          </p>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
          {/* Basic Info */}
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900">Job Specification</h2>
            <p className="text-xs text-slate-600">Essential role details and classifications</p>
          </div>

          <div className="space-y-4">
            <Input
              label="Job Title *"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Senior Full Stack Engineer (Next.js & TypeScript)"
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category *</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none"
                  required
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label="Location *"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. San Francisco, CA or Remote (US)"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Job Type</label>
                <select
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none"
                >
                  <option value="FULL_TIME">Full-time</option>
                  <option value="PART_TIME">Part-time</option>
                  <option value="INTERNSHIP">Internship</option>
                  <option value="CONTRACT">Contract</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Work Mode</label>
                <select
                  value={workMode}
                  onChange={(e) => setWorkMode(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none"
                >
                  <option value="REMOTE">Remote</option>
                  <option value="HYBRID">Hybrid</option>
                  <option value="ON_SITE">On-site</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Experience Level</label>
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none"
                >
                  <option value="ENTRY_LEVEL">Entry Level</option>
                  <option value="MID_LEVEL">Mid Level</option>
                  <option value="SENIOR_LEVEL">Senior Level</option>
                  <option value="LEAD_EXECUTIVE">Lead / Executive</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Salary Minimum ($)"
                type="number"
                value={salaryMin}
                onChange={(e) => setSalaryMin(e.target.value)}
                placeholder="120000"
              />

              <Input
                label="Salary Maximum ($)"
                type="number"
                value={salaryMax}
                onChange={(e) => setSalaryMax(e.target.value)}
                placeholder="160000"
              />

              <Input
                label="Application Deadline"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>

            <Input
              label="Required Skills (Comma separated)"
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="React, TypeScript, Next.js, Node.js, PostgreSQL"
            />
          </div>

          {/* Detailed Descriptions */}
          <div className="border-t border-slate-100 pt-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Job Overview & Description *
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the opportunity, mission, team size, and impact..."
                className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Key Responsibilities
              </label>
              <textarea
                rows={3}
                value={responsibilities}
                onChange={(e) => setResponsibilities(e.target.value)}
                placeholder="• Architect reliable web APIs&#10;• Collaborate with cross-functional product designers..."
                className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Qualifications & Requirements
              </label>
              <textarea
                rows={3}
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                placeholder="• 4+ years software development experience&#10;• Strong relational database fundamentals..."
                className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Perks & Benefits
              </label>
              <textarea
                rows={3}
                value={benefits}
                onChange={(e) => setBenefits(e.target.value)}
                placeholder="• 100% remote working flexibility&#10;• Comprehensive health, vision, and 401(k) matching..."
                className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              disabled={submitting}
              onClick={() => handleSubmit('DRAFT')}
            >
              Save as Draft
            </Button>
            <Button
              type="button"
              variant="primary"
              size="lg"
              isLoading={submitting}
              onClick={() => handleSubmit('ACTIVE')}
            >
              Publish Job Opening
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
