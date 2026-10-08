'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/navigation';
import { useRouter, usePathname } from 'next/navigation';
import {
  Briefcase,
  Search,
  Building2,
  Info,
  LogOut,
  User,
  Bell,
  Menu,
  X,
  ChevronDown,
  LayoutDashboard,
  Bookmark,
  FileText,
  PlusCircle,
  Shield,
} from 'lucide-react';
import { UserSession, NotificationItem } from '@/types';
import { Badge } from '@/components/ui/Badge';

interface NavbarProps {
  initialUser?: UserSession | null;
}

export const Navbar: React.FC<NavbarProps> = ({ initialUser }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<UserSession | null>(initialUser || null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Fetch active session if not passed
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setUser(data.data);
            setUnreadCount(data.data.unreadNotificationsCount || 0);
          }
        }
      } catch (e) {
        // Not logged in
      }
    };

    fetchUser();
  }, [pathname]);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications');
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setNotifications(data.data.notifications || []);
          setUnreadCount(data.data.unreadCount || 0);
        }
      }
    } catch (e) {}
  };

  const handleToggleNotifications = () => {
    if (!notificationsOpen) {
      fetchNotifications();
    }
    setNotificationsOpen(!notificationsOpen);
    setUserDropdownOpen(false);
  };

  const handleMarkAllRead = async () => {
    try {
      await fetch('/api/notifications', { method: 'PUT' });
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (e) {}
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      router.push('/login');
      router.refresh();
    } catch (e) {
      router.push('/login');
    }
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'ADMIN') return '/admin/dashboard';
    if (user.role === 'RECRUITER') return '/recruiter/dashboard';
    return '/candidate/dashboard';
  };

  const getRoleBadgeVariant = (role?: string) => {
    switch (role) {
      case 'ADMIN':
        return 'danger';
      case 'RECRUITER':
        return 'warning';
      case 'CANDIDATE':
        return 'primary';
      default:
        return 'secondary';
    }
  };

  return (
    <nav className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-md transition-all">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <a href="/" className="flex items-center gap-2.5 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-700 via-indigo-600 to-blue-500 text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
                <Briefcase className="h-5 w-5" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                  Career<span className="text-indigo-600">Hub</span>
                </span>
                <span className="hidden sm:block text-[10px] font-medium uppercase tracking-wider text-slate-600 -mt-1">
                  Job Portal
                </span>
              </div>
            </a>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-1">
              <a
                href="/"
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  pathname === '/'
                    ? 'text-indigo-600 bg-indigo-50/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                Home
              </a>
              <a
                href="/jobs"
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  pathname.startsWith('/jobs')
                    ? 'text-indigo-600 bg-indigo-50/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                Find Jobs
              </a>
              <a
                href="/companies"
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  pathname.startsWith('/companies')
                    ? 'text-indigo-600 bg-indigo-50/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                Companies
              </a>
              <a
                href="/about"
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  pathname === '/about'
                    ? 'text-indigo-600 bg-indigo-50/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                About
              </a>
            </div>
          </div>

          {/* Right Section: User / Auth Controls */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                {/* Post Job shortcut for recruiters */}
                {user.role === 'RECRUITER' && (
                  <a
                    href="/recruiter/jobs/new"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition-colors"
                  >
                    <PlusCircle className="h-4 w-4" />
                    Post Job
                  </a>
                )}

                {/* Notifications Button */}
                <div className="relative">
                  <button
                    onClick={handleToggleNotifications}
                    className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Notifications"
                  >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-bold text-white shadow-sm">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notifications Popover */}
                  {notificationsOpen && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-slate-200 bg-white p-3 shadow-xl z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                        <span className="text-sm font-semibold text-slate-900">Notifications</span>
                        {unreadCount > 0 && (
                          <button
                            onClick={handleMarkAllRead}
                            className="text-xs text-indigo-600 hover:underline font-medium"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>
                      <div className="max-h-72 overflow-y-auto divide-y divide-slate-50 py-1">
                        {notifications.length === 0 ? (
                          <div className="py-6 text-center text-xs text-slate-600">
                            No notifications yet
                          </div>
                        ) : (
                          notifications.slice(0, 8).map((notif) => (
                            <div
                              key={notif.id}
                              className={`p-2.5 rounded-lg text-xs transition-colors ${
                                notif.read ? 'bg-white' : 'bg-indigo-50/50 font-medium'
                              }`}
                            >
                              <div className="font-semibold text-slate-800">{notif.title}</div>
                              <p className="text-slate-600 mt-0.5">{notif.message}</p>
                              <span className="text-[10px] text-slate-600 mt-1 block">
                                {new Date(notif.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setUserDropdownOpen(!userDropdownOpen);
                      setNotificationsOpen(false);
                    }}
                    className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-600 to-indigo-800 text-white font-bold text-xs shadow-sm">
                      {user.name?.charAt(0) || 'U'}
                    </div>
                    <div className="text-left text-xs hidden lg:block">
                      <div className="font-semibold text-slate-800 leading-tight">{user.name}</div>
                      <div className="text-[10px] text-slate-600 capitalize">{user.role.toLowerCase()}</div>
                    </div>
                    <ChevronDown className="h-3.5 w-3.5 text-slate-600" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white py-1.5 shadow-xl z-50 animate-in fade-in">
                      <div className="px-3 py-2 border-b border-slate-100">
                        <p className="text-xs font-semibold text-slate-900">{user.name}</p>
                        <p className="text-[11px] text-slate-600 truncate">{user.email}</p>
                        <Badge variant={getRoleBadgeVariant(user.role)} size="sm" className="mt-1">
                          {user.role}
                        </Badge>
                      </div>

                      <a
                        href={getDashboardLink()}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <LayoutDashboard className="h-4 w-4 text-indigo-600" />
                        My Dashboard
                      </a>

                      {user.role === 'CANDIDATE' && (
                        <>
                          <a
                            href="/candidate/profile"
                            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                            onClick={() => setUserDropdownOpen(false)}
                          >
                            <User className="h-4 w-4 text-slate-600" />
                            My Profile
                          </a>
                          <a
                            href="/candidate/applications"
                            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                            onClick={() => setUserDropdownOpen(false)}
                          >
                            <FileText className="h-4 w-4 text-slate-600" />
                            My Applications
                          </a>
                          <a
                            href="/candidate/saved-jobs"
                            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                            onClick={() => setUserDropdownOpen(false)}
                          >
                            <Bookmark className="h-4 w-4 text-slate-600" />
                            Saved Jobs
                          </a>
                        </>
                      )}

                      {user.role === 'RECRUITER' && (
                        <>
                          <a
                            href="/recruiter/jobs"
                            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                            onClick={() => setUserDropdownOpen(false)}
                          >
                            <Briefcase className="h-4 w-4 text-slate-600" />
                            Manage Jobs
                          </a>
                          <a
                            href="/recruiter/pipeline"
                            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                            onClick={() => setUserDropdownOpen(false)}
                          >
                            <LayoutDashboard className="h-4 w-4 text-slate-600" />
                            Hiring Pipeline
                          </a>
                        </>
                      )}

                      {user.role === 'ADMIN' && (
                        <a
                          href="/admin/users"
                          className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                          onClick={() => setUserDropdownOpen(false)}
                        >
                          <Shield className="h-4 w-4 text-slate-600" />
                          User Management
                        </a>
                      )}

                      <div className="border-t border-slate-100 my-1"></div>

                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <a
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-indigo-600 transition-colors"
                >
                  Sign In
                </a>
                <a
                  href="/register"
                  className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-[0.98]"
                >
                  Create Account
                </a>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center gap-2">
            {user && (
              <a
                href={getDashboardLink()}
                className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg"
                title="Dashboard"
              >
                <LayoutDashboard className="h-5 w-5" />
              </a>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1">
          <a
            href="/"
            className="block rounded-lg px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50"
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </a>
          <a
            href="/jobs"
            className="block rounded-lg px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50"
            onClick={() => setMobileMenuOpen(false)}
          >
            Find Jobs
          </a>
          <a
            href="/companies"
            className="block rounded-lg px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50"
            onClick={() => setMobileMenuOpen(false)}
          >
            Companies
          </a>
          <a
            href="/about"
            className="block rounded-lg px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50"
            onClick={() => setMobileMenuOpen(false)}
          >
            About
          </a>

          <div className="border-t border-slate-100 pt-3">
            {user ? (
              <div className="space-y-2">
                <div className="px-3 py-1">
                  <div className="font-semibold text-slate-900">{user.name}</div>
                  <div className="text-xs text-slate-600">{user.email}</div>
                </div>
                <a
                  href={getDashboardLink()}
                  className="block rounded-lg bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Go to Dashboard
                </a>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <a
                  href="/login"
                  className="flex items-center justify-center rounded-lg border border-slate-300 py-2 text-center text-sm font-medium text-slate-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </a>
                <a
                  href="/register"
                  className="flex items-center justify-center rounded-lg bg-indigo-600 py-2 text-center text-sm font-semibold text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
