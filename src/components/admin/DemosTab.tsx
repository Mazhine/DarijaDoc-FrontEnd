'use client';

import React, { useState } from 'react';
import { CalendarDays, MapPin, Phone, Mail, Stethoscope, CheckCircle, XCircle } from 'lucide-react';
import { usePathname } from 'next/navigation';

type DemoLocaleText = {
  title: string;
  subtitle: string;
  upcoming: string;
  history: string;
  markDone: string;
  markAbandoned: string;
  statusDone: string;
  statusAbandoned: string;
  emptyUpcoming: string;
  emptyHistory: string;
};

const DEMOS_T: Record<string, DemoLocaleText> = {
  en: { 
    title: 'Booked Demos', subtitle: 'View all demo requests scheduled by potential clients.',
    upcoming: 'Upcoming', history: 'History',
    markDone: 'Mark as Done', markAbandoned: 'Mark as Abandoned',
    statusDone: 'Done', statusAbandoned: 'Abandoned',
    emptyUpcoming: 'No upcoming demos.', emptyHistory: 'No demo history yet.'
  },
  fr: { 
    title: 'Démos Réservées', subtitle: 'Consultez les demandes de démonstration planifiées par de potentiels clients.',
    upcoming: 'À venir', history: 'Historique',
    markDone: 'Effectué', markAbandoned: 'Abandonné',
    statusDone: 'Effectué', statusAbandoned: 'Abandonné',
    emptyUpcoming: 'Aucune démo à venir.', emptyHistory: 'Aucun historique pour le moment.'
  },
  ar: { 
    title: 'العروض المحجوزة', subtitle: 'عرض جميع طلبات العروض التوضيحية المجدولة.',
    upcoming: 'القادمة', history: 'السجل',
    markDone: 'مكتمل', markAbandoned: 'ملغى',
    statusDone: 'مكتمل', statusAbandoned: 'ملغى',
    emptyUpcoming: 'لا توجد عروض قادمة.', emptyHistory: 'لا يوجد سجل للعروض حتى الآن.'
  },
};

type DemoStatus = 'upcoming' | 'done' | 'abandoned';

type Demo = {
  id: number; fullName: string; specialty: string; city: string; phone: string; email: string; date: string; time: string; status: DemoStatus;
};

const initialDemos: Demo[] = [
  { id: 1, fullName: 'Dr. Karim Tazi', specialty: 'Cardiology', city: 'Casablanca', phone: '+212 600-112233', email: 'karim.tazi@example.com', date: '2026-05-10', time: '10:00', status: 'upcoming' },
  { id: 2, fullName: 'Nadia Bennis', specialty: 'Pediatrics', city: 'Rabat', phone: '+212 611-223344', email: 'nadia.pediatre@example.com', date: '2026-05-12', time: '14:30', status: 'upcoming' },
  { id: 3, fullName: 'Dr. Omar Fassi', specialty: 'General Practice', city: 'Marrakech', phone: '+212 622-334455', email: 'omar.fassi@example.com', date: '2026-05-15', time: '11:00', status: 'upcoming' },
];

export default function DemosTab() {
  const pathname = usePathname();
  const currentLocale = pathname?.split('/')[1] || 'en';
  const t = DEMOS_T[currentLocale] || DEMOS_T.en;

  const [demos, setDemos] = useState<Demo[]>(initialDemos);
  const [activeView, setActiveView] = useState<'upcoming' | 'history'>('upcoming');

  const upcomingDemos = demos.filter(d => d.status === 'upcoming');
  const historyDemos = demos.filter(d => d.status !== 'upcoming');

  const updateStatus = (id: number, newStatus: DemoStatus) => {
    setDemos(demos.map(d => d.id === id ? { ...d, status: newStatus } : d));
  };

  const renderDemos = (list: Demo[], emptyMsg: string) => {
    if (list.length === 0) return <div className="p-8 text-center text-slate-500 dark:text-slate-400">{emptyMsg}</div>;
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
        {list.map((demo) => (
          <div key={demo.id} className="premium-panel rounded-[28px] p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col h-full">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-950 dark:text-white">{demo.fullName}</h3>
                <span className="flex items-center gap-1 text-xs font-medium text-slate-500 mt-1">
                  <Stethoscope className="h-3 w-3" /> {demo.specialty}
                </span>
              </div>
              <div className="flex flex-col items-end gap-1 text-[#12695b] dark:text-[#9fe7d4]">
                <div className="flex items-center gap-1 font-bold">
                  <CalendarDays className="h-4 w-4" />
                  {demo.date}
                </div>
                <div className="text-sm font-semibold">{demo.time}</div>
              </div>
            </div>
            
            <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-4 mt-auto">
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <MapPin className="h-4 w-4 text-slate-400" /> {demo.city}
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <Phone className="h-4 w-4 text-slate-400" /> {demo.phone}
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 break-all">
                <Mail className="h-4 w-4 text-slate-400" /> {demo.email}
              </div>
            </div>

            {demo.status === 'upcoming' ? (
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-3">
                <button 
                  onClick={() => updateStatus(demo.id, 'done')}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-900/50 transition-colors text-xs font-semibold"
                >
                  <CheckCircle className="h-4 w-4" /> {t.markDone}
                </button>
                <button 
                  onClick={() => updateStatus(demo.id, 'abandoned')}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 transition-colors text-xs font-semibold"
                >
                  <XCircle className="h-4 w-4" /> {t.markAbandoned}
                </button>
              </div>
            ) : (
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${demo.status === 'done' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'}`}>
                  {demo.status === 'done' ? t.statusDone : t.statusAbandoned}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-950 dark:text-white">{t.title}</h2>
          <p className="mt-1 text-slate-500 dark:text-slate-400">{t.subtitle}</p>
        </div>
        <div className="flex bg-slate-100 dark:bg-slate-800/50 p-1 rounded-2xl w-fit">
          <button 
            onClick={() => setActiveView('upcoming')}
            className={`px-6 py-2 rounded-xl text-sm font-semibold transition-all ${activeView === 'upcoming' ? 'bg-white dark:bg-slate-700 text-[#12695b] dark:text-[#9fe7d4] shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            {t.upcoming} ({upcomingDemos.length})
          </button>
          <button 
            onClick={() => setActiveView('history')}
            className={`px-6 py-2 rounded-xl text-sm font-semibold transition-all ${activeView === 'history' ? 'bg-white dark:bg-slate-700 text-[#12695b] dark:text-[#9fe7d4] shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            {t.history} ({historyDemos.length})
          </button>
        </div>
      </div>

      {activeView === 'upcoming' ? renderDemos(upcomingDemos, t.emptyUpcoming) : renderDemos(historyDemos, t.emptyHistory)}
    </div>
  );
}
