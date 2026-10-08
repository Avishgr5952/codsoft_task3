'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  User,
  FileText,
  Search,
  Bookmark,
  Send,
  Bell,
  Settings,
  LogOut,
  X,
  Briefcase,
} from 'lucide-react';
import { UserSession } from '@/types';

interface CandidateSidebarProps {
  user: UserSession | null;
  isOpen?: boolean;
  onClose?: () => void;
}

export const CandidateSidebar: React.FC<CandidateSidebarProps> = ({ user, isOpen, onClose }) => {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { label: 'Dashboard', href: '/candidate/dashboard', icon: LayoutDashboard },
    { label: 'My Profile', href: '/candidate/profile', icon: User },
    { label: 'Resume', href: '/candidate/resumes', icon: FileText },
    { label: 'Find Jobs', href: '/jobs', icon: Search },
    { label: 'Saved Jobs', href: '/candidate/saved-jobs', icon: Bookmark },
    { label: 'My Applications', href: '/candidate/applications', icon: Send },
    { label: 'Notifications', href: '/candidate/notifications', icon: Bell },
    { label: 'Settings', href: '/candidate/settings', icon: Settings },
  ];

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (e) {
      router.push('/login');
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-200 lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between border-b border-slate-100 px-6">
          <a href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-200">
              <Briefcase className="h-5 w-5" />
            </div>
            <span className="font-bold text-slate-900 text-lg">
              Career<span className="text-indigo-600">Hub</span>
            </span>
          </a>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-600 hover:bg-slate-100 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User Card */}
        {user && (
          <div className="mx-4 mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shadow-sm">
              {user.name?.charAt(0) || 'C'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-800 truncate">{user.name}</p>
              <p className="text-[11px] text-indigo-600 font-medium">Candidate</p>
            </div>
          </div>
        )}

        {/* Nav Links */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-600'}`} />
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Logout Bottom */}
        <div className="border-t border-slate-100 p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};
