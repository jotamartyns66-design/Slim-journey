src/page/app/tsx// src/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseClientProvider } from '@/firebase/client-provider';

export const metadata: Metadata = {
  title: 'Slim Journey',
  description: 'Your personal companion for a healthier lifestyle and weight loss journey.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-gradient-to-br from-blue-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-950">
        <FirebaseClientProvider>
            {children}
        </FirebaseClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
