import React from 'react';
import ContaSidebar from '@/components/layout/ContaSidebar';

export default function ContaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex bg-[#f8fafc] min-h-[calc(100vh-80px)] font-sans">
      <ContaSidebar />
      <main className="flex-1 w-full max-w-[1440px] mx-auto overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
