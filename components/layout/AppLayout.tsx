'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CandidateSidebar } from './CandidateSidebar';
import { RecruiterSidebar } from './RecruiterSidebar';
import { AdminSidebar } from './AdminSidebar';
import { Navbar } from './Navbar';
import { UserSession, Role } from '@/types';
import { Menu, Bell } from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
  allowedRole?: Role;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children, allowedRole }) => {
  const router = useRouter();
  const [user, setUser] = useState<UserSession | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) {
          router.push('/login');
          return;
        }
        const data = await res.json();
        if (data.success && data.data) {
          if (allowedRole && data.data.role !== allowedRole && data.data.role !== 'ADMIN') {
            if (data.data.role === 'CANDIDATE') router.push('/candidate/dashboard');
            else if (data.data.role === 'RECRUITER') router.push('/recruiter/dashboard');
            else router.push('/login');
            return;
          }
          setUser(data.data);
        } else {
          router.push('/login');
        }
      } catch (err) {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [allowedRole, router]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent shadow-md" />
          <p className="text-xs font-semibold text-slate-600 animate-pulse">Loading CareerHub...</p>
        </div>
      </div>
    );
  }

  const renderSidebar = () => {
    if (!user) return null;
    if (user.role === 'ADMIN') {
      return (
        <AdminSidebar
          user={user}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      );
    }
    if (user.role === 'RECRUITER') {
      return (
        <RecruiterSidebar
          user={user}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      );
    }
    return (
      <CandidateSidebar
        user={user}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
    );
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {renderSidebar()}

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 md:px-6 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <span className="text-sm font-semibold text-slate-700 hidden sm:inline">
              CareerHub Management Portal
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/jobs"
              className="hidden sm:inline-flex text-xs font-semibold text-indigo-600 hover:text-indigo-700 px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-100"
            >
              Browse Jobs
            </a>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <span className="text-xs font-semibold text-slate-800 hidden md:inline">
                {user?.name}
              </span>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
};
