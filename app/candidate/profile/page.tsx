'use client';

import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Plus,
  Trash2,
  CheckCircle2,
  Github,
  Linkedin,
  Globe,
  Sparkles,
} from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { CandidateProfileItem } from '@/types';

export default function CandidateProfilePage() {
  const { showToast } = useToast();

  const [profile, setProfile] = useState<(CandidateProfileItem & { completionPercentage: number }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingGeneral, setSavingGeneral] = useState(false);

  // General fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');

  // Skills
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillYears, setNewSkillYears] = useState('3');
  const [addingSkill, setAddingSkill] = useState(false);

  // Education Modal
  const [eduModalOpen, setEduModalOpen] = useState(false);
  const [eduInstitution, setEduInstitution] = useState('');
  const [eduDegree, setEduDegree] = useState('');
  const [eduField, setEduField] = useState('');
  const [eduStartDate, setEduStartDate] = useState('');
  const [eduEndDate, setEduEndDate] = useState('');
  const [eduGrade, setEduGrade] = useState('');
  const [savingEdu, setSavingEdu] = useState(false);

  // Experience Modal
  const [expModalOpen, setExpModalOpen] = useState(false);
  const [expCompany, setExpCompany] = useState('');
  const [expTitle, setExpTitle] = useState('');
  const [expLocation, setExpLocation] = useState('');
  const [expStartDate, setExpStartDate] = useState('');
  const [expEndDate, setExpEndDate] = useState('');
  const [expCurrent, setExpCurrent] = useState(false);
  const [expDescription, setExpDescription] = useState('');
  const [savingExp, setSavingExp] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/candidates/me');
      const data = await res.json();
      if (data.success) {
        const p = data.data;
        setProfile(p);
        setName(p.user?.name || '');
        setPhone(p.user?.phone || '');
        setHeadline(p.headline || '');
        setBio(p.bio || '');
        setLocation(p.location || '');
        setPhotoUrl(p.photoUrl || '');
        setLinkedinUrl(p.linkedinUrl || '');
        setGithubUrl(p.githubUrl || '');
        setPortfolioUrl(p.portfolioUrl || '');
      }
    } catch (e) {
      showToast('error', 'Failed to fetch candidate profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSaveGeneral = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingGeneral(true);
    try {
      const res = await fetch('/api/candidates/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          headline,
          bio,
          location,
          photoUrl,
          linkedinUrl,
          githubUrl,
          portfolioUrl,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('success', 'Profile information updated successfully');
        fetchProfile();
      } else {
        showToast('error', data.error || 'Failed to update profile');
      }
    } catch (e) {
      showToast('error', 'Network error');
    } finally {
      setSavingGeneral(false);
    }
  };

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    setAddingSkill(true);
    try {
      const res = await fetch('/api/candidates/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skillName: newSkillName.trim(),
          yearsOfExperience: newSkillYears,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('success', 'Skill added');
        setNewSkillName('');
        fetchProfile();
      } else {
        showToast('error', data.error || 'Failed to add skill');
      }
    } catch (e) {
      showToast('error', 'Error adding skill');
    } finally {
      setAddingSkill(false);
    }
  };

  const handleRemoveSkill = async (skillId: string) => {
    try {
      const res = await fetch(`/api/candidates/skills?skillId=${skillId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        showToast('success', 'Skill removed');
        fetchProfile();
      }
    } catch (e) {
      showToast('error', 'Error removing skill');
    }
  };

  const handleAddEducation = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingEdu(true);
    try {
      const res = await fetch('/api/candidates/education', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          institution: eduInstitution,
          degree: eduDegree,
          fieldOfStudy: eduField,
          startDate: eduStartDate,
          endDate: eduEndDate || undefined,
          grade: eduGrade,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('success', 'Education record added');
        setEduModalOpen(false);
        setEduInstitution('');
        setEduDegree('');
        setEduField('');
        setEduStartDate('');
        setEduEndDate('');
        setEduGrade('');
        fetchProfile();
      } else {
        showToast('error', data.error || 'Failed to add education');
      }
    } catch (e) {
      showToast('error', 'Network error');
    } finally {
      setSavingEdu(false);
    }
  };

  const handleRemoveEducation = async (id: string) => {
    try {
      const res = await fetch(`/api/candidates/education/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('success', 'Education deleted');
        fetchProfile();
      }
    } catch (e) {
      showToast('error', 'Error deleting education');
    }
  };

  const handleAddExperience = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingExp(true);
    try {
      const res = await fetch('/api/candidates/experience', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company: expCompany,
          title: expTitle,
          location: expLocation,
          startDate: expStartDate,
          endDate: expCurrent ? undefined : expEndDate,
          current: expCurrent,
          description: expDescription,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('success', 'Experience record added');
        setExpModalOpen(false);
        setExpCompany('');
        setExpTitle('');
        setExpLocation('');
        setExpStartDate('');
        setExpEndDate('');
        setExpCurrent(false);
        setExpDescription('');
        fetchProfile();
      } else {
        showToast('error', data.error || 'Failed to add experience');
      }
    } catch (e) {
      showToast('error', 'Network error');
    } finally {
      setSavingExp(false);
    }
  };

  const handleRemoveExperience = async (id: string) => {
    try {
      const res = await fetch(`/api/candidates/experience/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('success', 'Experience deleted');
        fetchProfile();
      }
    } catch (e) {
      showToast('error', 'Error deleting experience');
    }
  };

  if (loading) {
    return (
      <AppLayout allowedRole="CANDIDATE">
        <div className="space-y-6 animate-pulse">
          <div className="h-44 bg-white rounded-3xl border border-slate-200" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout allowedRole="CANDIDATE">
      <div className="space-y-8 max-w-5xl mx-auto">
        {/* Profile Completion Header */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xl">
              {profile?.completionPercentage || 65}%
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Candidate Profile</h1>
              <p className="text-xs text-slate-600 mt-0.5">
                A 100% complete profile increases interview invites by 3.5x.
              </p>
            </div>
          </div>

          <div className="w-full sm:w-60">
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${profile?.completionPercentage || 65}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-600 mt-1 block text-right font-medium">
              {profile?.completionPercentage}% Completed
            </span>
          </div>
        </div>

        {/* GENERAL INFORMATION FORM */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900">Personal & Professional Info</h2>
            <p className="text-xs text-slate-600">Your core credentials and contact information</p>
          </div>

          <form onSubmit={handleSaveGeneral} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name *"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <Input
                label="Email Address (Login)"
                type="email"
                value={profile?.user?.email || ''}
                disabled
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Phone Number"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
              />

              <Input
                label="Location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="San Francisco, CA or Remote"
              />
            </div>

            <Input
              label="Professional Headline *"
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Senior Full Stack Engineer | React, TypeScript & Node.js"
              required
            />

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                About / Professional Bio
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Summarize your background, core technical strengths, and what environments you thrive in..."
                className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            {/* Social / Portfolio Links */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
              <Input
                label="LinkedIn Profile"
                type="url"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/username"
              />

              <Input
                label="GitHub Profile"
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/username"
              />

              <Input
                label="Portfolio / Website"
                type="url"
                value={portfolioUrl}
                onChange={(e) => setPortfolioUrl(e.target.value)}
                placeholder="https://yourportfolio.dev"
              />
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" variant="primary" isLoading={savingGeneral}>
                Save Changes
              </Button>
            </div>
          </form>
        </div>

        {/* SKILLS SECTION */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Skills & Competencies</h2>
              <p className="text-xs text-slate-600">Highlight technologies and areas of expertise</p>
            </div>
          </div>

          {/* Add skill input */}
          <form onSubmit={handleAddSkill} className="flex flex-col sm:flex-row items-center gap-3">
            <input
              type="text"
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              placeholder="Add skill (e.g. Next.js, Python, AWS)..."
              className="flex-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none"
            />
            <input
              type="number"
              min="0"
              max="30"
              step="0.5"
              value={newSkillYears}
              onChange={(e) => setNewSkillYears(e.target.value)}
              placeholder="Yrs exp"
              className="w-full sm:w-28 rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none"
            />
            <Button type="submit" variant="secondary" size="md" isLoading={addingSkill} className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-1" /> Add Skill
            </Button>
          </form>

          {/* Skill tags */}
          <div className="flex flex-wrap gap-2 pt-2">
            {profile?.skills && profile.skills.length > 0 ? (
              profile.skills.map((item) => (
                <div
                  key={item.id}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-100 text-xs font-semibold text-indigo-700"
                >
                  <span>{item.skill.name}</span>
                  {item.yearsOfExperience && (
                    <span className="text-[10px] text-indigo-600">({item.yearsOfExperience}y)</span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(item.skillId)}
                    className="text-indigo-600 hover:text-rose-600"
                  >
                    ×
                  </button>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-600">No skills added yet.</p>
            )}
          </div>
        </div>

        {/* EXPERIENCE SECTION */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Work Experience</h2>
              <p className="text-xs text-slate-600">Add past roles, internships, and companies</p>
            </div>
            <Button variant="secondary" size="sm" onClick={() => setExpModalOpen(true)}>
              <Plus className="h-3.5 w-3.5 mr-1" /> Add Experience
            </Button>
          </div>

          <div className="space-y-4">
            {profile?.experiences && profile.experiences.length > 0 ? (
              profile.experiences.map((exp) => (
                <div
                  key={exp.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-4"
                >
                  <div className="space-y-1">
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900">{exp.title}</h3>
                    <p className="text-xs font-semibold text-indigo-600">{exp.company}</p>
                    <p className="text-[11px] text-slate-600">
                      {new Date(exp.startDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })} –{' '}
                      {exp.current ? 'Present' : exp.endDate ? new Date(exp.endDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : 'N/A'}
                      {exp.location ? ` • ${exp.location}` : ''}
                    </p>
                    {exp.description && (
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed whitespace-pre-line">
                        {exp.description}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveExperience(exp.id)}
                    className="p-1.5 text-slate-600 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-600">No work experience listed yet.</p>
            )}
          </div>
        </div>

        {/* EDUCATION SECTION */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Education</h2>
              <p className="text-xs text-slate-600">Academic institutions, degrees, and certifications</p>
            </div>
            <Button variant="secondary" size="sm" onClick={() => setEduModalOpen(true)}>
              <Plus className="h-3.5 w-3.5 mr-1" /> Add Education
            </Button>
          </div>

          <div className="space-y-4">
            {profile?.educations && profile.educations.length > 0 ? (
              profile.educations.map((edu) => (
                <div
                  key={edu.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-4"
                >
                  <div className="space-y-1">
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900">{edu.institution}</h3>
                    <p className="text-xs font-semibold text-slate-700">
                      {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}
                    </p>
                    <p className="text-[11px] text-slate-600">
                      {new Date(edu.startDate).getFullYear()} –{' '}
                      {edu.endDate ? new Date(edu.endDate).getFullYear() : 'Present'}
                      {edu.grade ? ` • Grade: ${edu.grade}` : ''}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveEducation(edu.id)}
                    className="p-1.5 text-slate-600 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-600">No education records listed yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Add Education Modal */}
      <Modal isOpen={eduModalOpen} onClose={() => setEduModalOpen(false)} title="Add Education Record">
        <form onSubmit={handleAddEducation} className="space-y-4">
          <Input
            label="Institution *"
            type="text"
            value={eduInstitution}
            onChange={(e) => setEduInstitution(e.target.value)}
            placeholder="e.g. Stanford University"
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Degree *"
              type="text"
              value={eduDegree}
              onChange={(e) => setEduDegree(e.target.value)}
              placeholder="e.g. Bachelor of Science"
              required
            />
            <Input
              label="Field of Study"
              type="text"
              value={eduField}
              onChange={(e) => setEduField(e.target.value)}
              placeholder="e.g. Computer Science"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Start Date *"
              type="date"
              value={eduStartDate}
              onChange={(e) => setEduStartDate(e.target.value)}
              required
            />
            <Input
              label="End Date (or expected)"
              type="date"
              value={eduEndDate}
              onChange={(e) => setEduEndDate(e.target.value)}
            />
          </div>

          <Input
            label="Grade / GPA"
            type="text"
            value={eduGrade}
            onChange={(e) => setEduGrade(e.target.value)}
            placeholder="e.g. 3.9 / 4.0"
          />

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={() => setEduModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={savingEdu}>
              Save Education
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add Experience Modal */}
      <Modal isOpen={expModalOpen} onClose={() => setExpModalOpen(false)} title="Add Experience Record">
        <form onSubmit={handleAddExperience} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Company *"
              type="text"
              value={expCompany}
              onChange={(e) => setExpCompany(e.target.value)}
              placeholder="e.g. Stripe"
              required
            />
            <Input
              label="Job Title *"
              type="text"
              value={expTitle}
              onChange={(e) => setExpTitle(e.target.value)}
              placeholder="e.g. Frontend Engineer"
              required
            />
          </div>

          <Input
            label="Location"
            type="text"
            value={expLocation}
            onChange={(e) => setExpLocation(e.target.value)}
            placeholder="e.g. San Francisco, CA or Remote"
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Start Date *"
              type="date"
              value={expStartDate}
              onChange={(e) => setExpStartDate(e.target.value)}
              required
            />
            {!expCurrent && (
              <Input
                label="End Date"
                type="date"
                value={expEndDate}
                onChange={(e) => setExpEndDate(e.target.value)}
              />
            )}
          </div>

          <label className="flex items-center gap-2 text-xs text-slate-700">
            <input
              type="checkbox"
              checked={expCurrent}
              onChange={(e) => setExpCurrent(e.target.checked)}
              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            I currently work here
          </label>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Description / Responsibilities
            </label>
            <textarea
              rows={3}
              value={expDescription}
              onChange={(e) => setExpDescription(e.target.value)}
              placeholder="Key deliverables, achievements, and impact..."
              className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={() => setExpModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={savingExp}>
              Save Experience
            </Button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
}
