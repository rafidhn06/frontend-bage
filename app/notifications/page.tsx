'use client';

import React, { useEffect, useState } from 'react';

import { toast } from 'sonner';

import NavigationBar from '@/components/NavigationBar';
import NotificationItem from '@/components/NotificationItem';
import TopBar from '@/components/TopBar';
import { Spinner } from '@/components/ui/spinner';
import api from '@/lib/axios';
import { Notification } from '@/types';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/notifications');
      setNotifications(response.data.data || []);
    } catch (error) {
      toast.error('Gagal memuat notifikasi. Silakan coba lagi nanti.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner className="size-8" />
      </div>
    );
  }

  return (
    <>
      <TopBar className="w-full p-4 py-5 text-xl font-semibold tracking-tight">
        Notifikasi
      </TopBar>
      <main className="xs:pb-[78px] flex flex-col items-center pb-[81px]">
        <div className="divide-border w-full max-w-xl divide-y divide-solid">
          {notifications.length === 0 ? (
            <div className="text-muted-foreground flex h-[calc(100vh-150px)] items-center justify-center p-8 text-center">
              Belum ada notifikasi
            </div>
          ) : (
            notifications
              .filter((notification, index, self) => {
                if (
                  notification.type === 'follow' &&
                  notification.data.follower_id
                ) {
                  return (
                    index ===
                    self.findIndex(
                      (t) =>
                        t.type === 'follow' &&
                        t.data.follower_id === notification.data.follower_id
                    )
                  );
                }
                return true;
              })
              .map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onUpdate={fetchNotifications}
                />
              ))
          )}
        </div>
      </main>
      <NavigationBar />
    </>
  );
}
