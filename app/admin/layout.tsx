'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const check = async () => {
      await useAuthStore.getState().checkAuth();
      setReady(true);
    };
    check();
  }, []);

  useEffect(() => {
    if (ready && !useAuthStore.getState().isAuthenticated) {
      router.push('/login');
    }
  }, [ready, router]);

  if (!ready || !useAuthStore.getState().isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0A0806] flex items-center justify-center">
        <div className="text-[#C9A04E] animate-breathe text-lg">✦ 加载中 ...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#0A0806]">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
}