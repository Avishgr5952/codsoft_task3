'use client';

import React, { useState, useEffect, useRef } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import {
  FileText,
  Upload,
  Download,
  Eye,
  Trash2,
  CheckCircle2,
  Star,
  AlertCircle,
  FileUp,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { useToast } from '@/components/ui/Toast';
import { ResumeItem } from '@/types';

export default function ResumeManagementPage() {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [resumes, setResumes] = useState<ResumeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchResumes = async () => {
    try {
      const res = await fetch('/api/candidates/resumes');
      const data = await res.json();
      if (data.success) {
        setResumes(data.data || []);
      }
    } catch (e) {
      showToast('error', 'Failed to fetch resumes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate format
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!['pdf', 'doc', 'docx'].includes(ext || '')) {
      showToast('error', 'Accepted formats: PDF, DOC, DOCX');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showToast('error', 'File size exceeds maximum 10MB limit');
      return;
    }

    setUploading(true);

    try {
      // 1. Upload file to storage abstraction
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'resumes');

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const uploadData = await uploadRes.json();
      if (!uploadRes.ok || !uploadData.success) {
        showToast('error', uploadData.error || 'Upload failed');
        setUploading(false);
        return;
      }

      // 2. Register resume record in DB
      const dbRes = await fetch('/api/candidates/resumes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: uploadData.data.fileName,
          fileUrl: uploadData.data.url,
          fileSize: uploadData.data.fileSize,
          fileType: uploadData.data.fileType,
          isDefault: resumes.length === 0,
        }),
      });

      const dbData = await dbRes.json();
      if (dbRes.ok && dbData.success) {
        showToast('success', 'Resume uploaded successfully!');
        fetchResumes();
      } else {
        showToast('error', dbData.error || 'Failed to save resume');
      }
    } catch (err: any) {
      showToast('error', 'Upload error occurred');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      const res = await fetch(`/api/candidates/resumes/${id}/default`, {
        method: 'PUT',
      });
      if (res.ok) {
        showToast('success', 'Default resume set');
        fetchResumes();
      }
    } catch (e) {
      showToast('error', 'Error updating default resume');
    }
  };

  const handleDeleteResume = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/candidates/resumes/${deleteId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        showToast('success', 'Resume removed');
        setDeleteId(null);
        fetchResumes();
      } else {
        showToast('error', 'Failed to delete resume');
      }
    } catch (e) {
      showToast('error', 'Network error');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return 'Unknown size';
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  return (
    <AppLayout allowedRole="CANDIDATE">
      <div className="space-y-8 max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Resume Management</h1>
            <p className="text-xs text-slate-600 mt-1">
              Upload and manage versions of your resume for tailored applications
            </p>
          </div>

          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".pdf,.doc,.docx"
              className="hidden"
            />
            <Button
              variant="primary"
              size="md"
              isLoading={uploading}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload New Resume
            </Button>
          </div>
        </div>

        {/* Drag/Drop Uploader Card */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-indigo-200 hover:border-indigo-400 bg-indigo-50/30 hover:bg-indigo-50/60 p-8 rounded-3xl text-center cursor-pointer transition-all space-y-3"
        >
          <div className="h-14 w-14 mx-auto rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
            <FileUp className="h-7 w-7" />
          </div>
          <div>
            <span className="text-sm font-bold text-slate-900">
              Click to browse and upload your resume
            </span>
            <p className="text-xs text-slate-600 mt-1">
              Supports PDF, DOC, and DOCX (Up to 10MB)
            </p>
          </div>
        </div>

        {/* Resumes List */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">Uploaded Documents ({resumes.length})</h2>
          </div>

          {loading ? (
            <div className="py-8 text-center text-xs text-slate-600">Loading documents...</div>
          ) : resumes.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-600 space-y-2">
              <FileText className="h-10 w-10 mx-auto text-slate-600" />
              <p className="font-semibold text-slate-700">No resumes uploaded yet</p>
              <p>Upload a resume to start applying with 1-click convenience.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {resumes.map((resume) => (
                <div
                  key={resume.id}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                      <FileText className="h-6 w-6" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">{resume.fileName}</span>
                        {resume.isDefault && (
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-indigo-100 text-indigo-700">
                            Primary
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-600">
                        <span>{formatFileSize(resume.fileSize)}</span>
                        <span>•</span>
                        <span>Uploaded {new Date(resume.uploadedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {!resume.isDefault && (
                      <button
                        type="button"
                        onClick={() => handleSetDefault(resume.id)}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        Set as Default
                      </button>
                    )}

                    <a
                      href={resume.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:text-indigo-600 hover:bg-slate-50 transition-colors"
                      title="View Resume"
                    >
                      <Eye className="h-4 w-4" />
                    </a>

                    <a
                      href={resume.fileUrl}
                      download={resume.fileName}
                      className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:text-indigo-600 hover:bg-slate-50 transition-colors"
                      title="Download Resume"
                    >
                      <Download className="h-4 w-4" />
                    </a>

                    <button
                      type="button"
                      onClick={() => setDeleteId(resume.id)}
                      className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete Resume"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteResume}
        title="Delete Resume Document"
        message="Are you sure you want to delete this resume? Future job applications won't be able to reference this file."
        confirmText="Delete Resume"
        variant="danger"
      />
    </AppLayout>
  );
}
