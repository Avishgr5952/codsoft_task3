'use client';

import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Bell, CheckCheck, Sparkles, Calendar, FileText, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { NotificationItem } from '@/types';

export default function CandidateNotificationsPage() {
  const { showToast } = useToast();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifs = async () => {
    try {
      const res = await fetch('/api/notifications');
      const data = await res.json();
      if (data.success) {
        setNotifications(data.data.notifications || []);
      }
    } catch (e) {
      showToast('error', 'Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifs();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await fetch('/api/notifications', { method: 'PUT' });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      showToast('success', 'All notifications marked as read');
    } catch (e) {
      showToast('error', 'Error updating notifications');
    }
  };

  const handleMarkOneRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: 'PUT' });
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    } catch (e) {}
  };

  return (
    <AppLayout allowedRole="CANDIDATE">
      <div className="space-y-8 max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Notifications</h1>
            <p className="text-xs text-slate-600 mt-1">
              Stay informed on status updates, interview schedules, and announcements
            </p>
          </div>

          {notifications.some((n) => !n.read) && (
            <Button variant="secondary" size="sm" onClick={handleMarkAllRead}>
              <CheckCheck className="h-4 w-4 mr-1.5" />
              Mark all as read
            </Button>
          )}
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-xs text-slate-600">Loading notifications...</div>
          ) : notifications.length === 0 ? (
            <div className="p-16 text-center space-y-3">
              <Bell className="h-12 w-12 mx-auto text-slate-600" />
              <h3 className="text-base font-bold text-slate-900">No notifications</h3>
              <p className="text-xs text-slate-600">You are completely up to date.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => !notif.read && handleMarkOneRead(notif.id)}
                  className={`p-5 flex items-start justify-between gap-4 transition-colors ${
                    notif.read ? 'bg-white' : 'bg-indigo-50/40'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div className="h-10 w-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                      <Bell className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">{notif.title}</h4>
                      <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{notif.message}</p>
                      <span className="text-[10px] text-slate-600 block mt-2">
                        {new Date(notif.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {notif.link && (
                    <a
                      href={notif.link}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-indigo-600 hover:bg-white shadow-sm shrink-0"
                    >
                      View
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
