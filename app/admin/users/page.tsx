'use client';

import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Trash2,
  Shield,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { useToast } from '@/components/ui/Toast';

export default function AdminUsersPage() {
  const { showToast } = useToast();
  const [users, setUsers] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 15, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  // Delete modal
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (role) params.set('role', role);
      if (status) params.set('status', status);
      params.set('page', page.toString());
      params.set('limit', '15');

      const res = await fetch(`/api/admin/users?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setUsers(data.data.users || []);
        setPagination(data.data.pagination);
      }
    } catch (e) {
      showToast('error', 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search, role, status, page]);

  const handleToggleStatus = async (userId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('success', `User status changed to ${nextStatus.toLowerCase()}`);
        fetchUsers();
      } else {
        showToast('error', data.error || 'Failed to update user status');
      }
    } catch (e) {
      showToast('error', 'Network error');
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/admin/users/${deleteId}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('success', 'User account permanently deleted');
        setDeleteId(null);
        fetchUsers();
      } else {
        showToast('error', data.error || 'Failed to delete user');
      }
    } catch (e) {
      showToast('error', 'Network error');
    }
  };

  return (
    <AppLayout allowedRole="ADMIN">
      <div className="space-y-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">User Management</h1>
            <p className="text-xs text-slate-600 mt-1">
              Search, moderate, and manage candidate and recruiter platform accounts
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-600" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by user name or email..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:border-rose-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                setPage(1);
              }}
              className="rounded-xl border border-slate-200 bg-white p-2 text-xs font-semibold text-slate-800 focus:border-rose-500 focus:outline-none"
            >
              <option value="">All Roles</option>
              <option value="CANDIDATE">Candidates</option>
              <option value="RECRUITER">Recruiters</option>
              <option value="ADMIN">Admins</option>
            </select>

            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="rounded-xl border border-slate-200 bg-white p-2 text-xs font-semibold text-slate-800 focus:border-rose-500 focus:outline-none"
            >
              <option value="">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-xs text-slate-600">Loading accounts...</div>
          ) : users.length === 0 ? (
            <div className="p-16 text-center space-y-3">
              <Users className="h-12 w-12 mx-auto text-slate-600" />
              <h3 className="text-base font-bold text-slate-900">No users found</h3>
              <p className="text-xs text-slate-600">Try modifying search or filter options.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                    <th className="py-4 px-6">User</th>
                    <th className="py-4 px-4">Role</th>
                    <th className="py-4 px-4">Organization / Headline</th>
                    <th className="py-4 px-4">Status</th>
                    <th className="py-4 px-4">Registered Date</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center shrink-0 text-xs">
                            {u.name?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block">{u.name}</span>
                            <span className="text-[11px] text-slate-600">{u.email}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <Badge
                          variant={u.role === 'ADMIN' ? 'danger' : u.role === 'RECRUITER' ? 'warning' : 'primary'}
                          size="sm"
                        >
                          {u.role}
                        </Badge>
                      </td>

                      <td className="py-4 px-4 text-slate-600 max-w-xs truncate">
                        {u.role === 'RECRUITER'
                          ? u.recruiterProfile?.company?.name || 'Company Pending'
                          : u.candidateProfile?.headline || 'Candidate'}
                      </td>

                      <td className="py-4 px-4">
                        <Badge variant={u.status === 'ACTIVE' ? 'success' : 'danger'} size="sm">
                          {u.status}
                        </Badge>
                      </td>

                      <td className="py-4 px-4 text-slate-600">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(u.id, u.status)}
                            className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors ${
                              u.status === 'ACTIVE'
                                ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            }`}
                          >
                            {u.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                          </button>

                          {u.role !== 'ADMIN' && (
                            <button
                              type="button"
                              onClick={() => setDeleteId(u.id)}
                              className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Delete Account"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-slate-100">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page <= 1}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold disabled:opacity-40"
              >
                <ChevronLeft className="h-3.5 w-3.5" /> Previous
              </button>
              <span className="text-xs text-slate-600">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                onClick={() => setPage(Math.min(pagination.totalPages, page + 1))}
                disabled={page >= pagination.totalPages}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold disabled:opacity-40"
              >
                Next <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteUser}
        title="Permanently Delete User Account"
        message="Are you sure you want to delete this user? All their profile data, applications, and postings will be removed."
        confirmText="Delete User"
        variant="danger"
      />
    </AppLayout>
  );
}
