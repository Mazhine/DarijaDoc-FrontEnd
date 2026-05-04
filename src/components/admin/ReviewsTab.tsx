'use client';

import React, { useState } from 'react';
import { Star, MessageSquare, Bot, User } from 'lucide-react';
import { usePathname } from 'next/navigation';

const REVIEWS_T: Record<string, any> = {
  en: { 
    title: 'Reviews & Feedback', subtitle: 'View what users and doctors are saying about the platform.',
    doctorReviews: 'Doctor Reviews', appReviews: 'App & Bot Feedback'
  },
  fr: { 
    title: 'Avis & Retours', subtitle: 'Découvrez ce que les utilisateurs et les médecins disent de la plateforme.',
    doctorReviews: 'Avis pour Docteur', appReviews: 'Avis pour App/Bot'
  },
  ar: { 
    title: 'التقييمات والآراء', subtitle: 'اطلع على آراء المستخدمين والأطباء حول المنصة.',
    doctorReviews: 'آراء حول الأطباء', appReviews: 'آراء حول التطبيق/البوت'
  },
};

const mockDoctorReviews = [
  { id: 2, author: 'Youssef Fassi', target: 'Dr. Amine Alami', role: 'Patient', rating: 4, date: '2026-04-28', text: 'Très pratique pour prendre rendez-vous rapidement. Le rappel sur WhatsApp est un vrai plus.' },
  { id: 4, author: 'Fatima Zahra', target: 'Dr. Karim Tazi', role: 'Patient', rating: 5, date: '2026-04-15', text: 'Excellent médecin, ponctuel et très à l\'écoute. La prise de RDV a été très fluide.' },
];

const mockAppReviews = [
  { id: 1, author: 'Dr. Amine Alami', role: 'Doctor', rating: 5, date: '2026-05-01', text: 'This platform has transformed how I manage my appointments. The WhatsApp integration is flawless.' },
  { id: 3, author: 'Sara (Secretary)', role: 'Secretary', rating: 5, date: '2026-04-20', text: 'Je gagne un temps fou tous les jours. L\'interface est claire et l\'agenda très lisible.' },
];

export default function ReviewsTab() {
  const pathname = usePathname();
  const currentLocale = pathname?.split('/')[1] || 'en';
  const t = REVIEWS_T[currentLocale] || REVIEWS_T.en;

  const [activeView, setActiveView] = useState<'doctors' | 'app'>('doctors');

  const renderReviews = (reviews: any[]) => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
      {reviews.map((review) => (
        <div key={review.id} className="premium-panel rounded-[28px] p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col h-full">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-950 dark:text-white">{review.author}</h3>
              <span className="text-xs font-medium text-slate-500">{review.role} • {review.date}</span>
              {review.target && (
                <div className="mt-1 text-xs font-semibold text-[#12695b] dark:text-[#9fe7d4]">
                  À propos de : {review.target}
                </div>
              )}
            </div>
            <div className="flex gap-1 text-amber-400 shrink-0">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`h-3.5 w-3.5 ${i < review.rating ? 'fill-current' : 'text-slate-200 dark:text-slate-700'}`} />
              ))}
            </div>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">"{review.text}"</p>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-950 dark:text-white">{t.title}</h2>
          <p className="mt-1 text-slate-500 dark:text-slate-400">{t.subtitle}</p>
        </div>
        <div className="flex bg-slate-100 dark:bg-slate-800/50 p-1 rounded-2xl w-fit">
          <button 
            onClick={() => setActiveView('doctors')}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all ${activeView === 'doctors' ? 'bg-white dark:bg-slate-700 text-[#12695b] dark:text-[#9fe7d4] shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            <User className="h-4 w-4" /> {t.doctorReviews}
          </button>
          <button 
            onClick={() => setActiveView('app')}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all ${activeView === 'app' ? 'bg-white dark:bg-slate-700 text-[#12695b] dark:text-[#9fe7d4] shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            <Bot className="h-4 w-4" /> {t.appReviews}
          </button>
        </div>
      </div>

      {activeView === 'doctors' ? renderReviews(mockDoctorReviews) : renderReviews(mockAppReviews)}
    </div>
  );
}
