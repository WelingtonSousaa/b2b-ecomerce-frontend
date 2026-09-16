'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, ArrowRight } from 'lucide-react';

export default function NoticiasPage() {
  const articles: { id: string; title: string; category: string; date: string; readTime: string; author: string; image: string; excerpt: string; }[] = [];

  return (
    <div className="bg-white min-h-screen pb-20 pt-8 font-sans">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-12 space-y-12">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-500 font-medium border-b border-gray-100 pb-4">
          <Link href="/" className="hover:text-[#2563eb]">Home</Link>
          <span>/</span>
          <span className="font-bold text-gray-900">Notícias & Blog B2B</span>
        </div>

        {/* Title Header */}
        <div className="space-y-3 border-b border-gray-100 pb-8">
          <span className="inline-block bg-blue-100 text-[#2563eb] text-xs font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider">
            Blog & Análises do Mercado B2B
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">
            Notícias, Gestão Fiscal & Tendências da Indústria
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 max-w-3xl">
            Acompanhe artigos exclusivos elaborados pelos especialistas em tributação, logística e produtos da OneSync Brasil.
          </p>
        </div>

        {articles.length === 0 ? (
          <div className="py-20 text-center space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Nenhum artigo encontrado.</h2>
            <p className="text-gray-500 text-sm">Em breve teremos novidades.</p>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
