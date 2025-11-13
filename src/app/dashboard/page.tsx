// src/app/dashboard/page.tsx
'use client';

import { useUser } from '@/firebase/auth/use-user';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Dashboard } from '@/components/dashboard/dashboard';
import { Header } from '@/components/header';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const { user, isLoading, isSignedOut } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isSignedOut) {
      router.push('/login');
    }
  }, [isLoading, isSignedOut, router]);

  if (isLoading || isSignedOut) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {/* Skeleton loader */}
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="flex flex-col gap-6 lg:col-span-2">
              <div className="grid gap-6 md:grid-cols-2">
                <Skeleton className="h-64" />
                <Skeleton className="h-64" />
              </div>
              <Skeleton className="h-96" />
              <Skeleton className="h-96" />
            </div>
            <div className="flex flex-col gap-6 lg:col-span-1">
              <Skeleton className="h-96" />
              <Skeleton className="h-80" />
              <Skeleton className="h-80" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <Dashboard />
      </main>
    </div>
  );
}
