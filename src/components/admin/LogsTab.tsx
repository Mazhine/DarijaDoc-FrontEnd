'use client';

import { useMemo, useState } from 'react';
import { ActivitySquare, Clock3, ShieldCheck, UserRound } from 'lucide-react';
import { usePathname } from 'next/navigation';

type AuditLog = {
  id: string;
  memberName: string;
  memberEmail: string;
  memberRole: string;
  ownerDoctorEmail: string;
  ownerDoctorName: string;
  action: string;
  target: string;
  type: 'system' | 'calendar' | 'client';
  time: string;
  date: string;
};

const COPY = {
  en: {
    title: 'Logs',
    subtitle: 'One place to review type, time, actor, action, target, and doctor attribution.',
    all: 'All',
    system: 'System',
    calendar: 'Calendar',
    client: 'Patients',
    type: 'Type',
    when: 'When',
    who: 'Who',
    what: 'What',
    target: 'Target',
    doctor: 'Doctor',
    noLogs: 'No logs available yet.',
  },
  fr: {
    title: 'Logs',
    subtitle: 'Un seul espace pour voir le type, le moment, qui a agit, quoi, la cible et le medecin rattache.',
    all: 'Tous',
    system: 'Systeme',
    calendar: 'Calendrier',
    client: 'Patients',
    type: 'Type',
    when: 'Quand',
    who: 'Qui',
    what: 'Quoi',
    target: 'Cible',
    doctor: 'Medecin',
    noLogs: 'Aucun log disponible pour le moment.',
  },
  ar: {
    title: 'السجلات',
    subtitle: 'مكان واحد لمراجعة النوع والوقت والفاعل وما الذي حدث وعلى من وإلى أي طبيب يتبع.',
    all: 'الكل',
    system: 'النظام',
    calendar: 'التقويم',
    client: 'المرضى',
    type: 'النوع',
    when: 'متى',
    who: 'من',
    what: 'ماذا',
    target: 'على من',
    doctor: 'الطبيب',
    noLogs: 'لا توجد سجلات حاليا.',
  },
} as const;

function labelAction(action: string, locale: string) {
  const map: Record<string, Record<string, string>> = {
    loggedIn: { en: 'Logged in', fr: 'Connexion', ar: 'تسجيل دخول' },
    createAppt: { en: 'Created appointment', fr: 'Creation rendez-vous', ar: 'إنشاء موعد' },
    updatePatient: { en: 'Updated patient', fr: 'Mise a jour patient', ar: 'تحديث مريض' },
    regPatient: { en: 'Registered patient', fr: 'Ajout patient', ar: 'إضافة مريض' },
    deletePatient: { en: 'Deleted patient', fr: 'Suppression patient', ar: 'حذف مريض' },
    markUnavail: { en: 'Blocked schedule', fr: 'Blocage agenda', ar: 'حجب الجدول' },
    deleteAppt: { en: 'Deleted appointment', fr: 'Suppression rendez-vous', ar: 'حذف موعد' },
  };

  return map[action]?.[locale] || action;
}

export default function LogsTab() {
  const pathname = usePathname();
  const locale = (pathname?.split('/')[1] || 'en') as keyof typeof COPY;
  const copy = COPY[locale] || COPY.en;
  const [typeFilter, setTypeFilter] = useState<'all' | 'system' | 'calendar' | 'client'>('all');
  const [logs] = useState<AuditLog[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('clinicAuditLogs') || '[]');
    } catch {
      return [];
    }
  });

  const filteredLogs = useMemo(
    () => logs.filter((log) => typeFilter === 'all' || log.type === typeFilter),
    [logs, typeFilter]
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-black text-slate-950 dark:text-white">{copy.title}</h2>
        <p className="mt-2 max-w-4xl text-sm leading-7 text-slate-500 dark:text-slate-400">{copy.subtitle}</p>
      </div>

      <div className="flex flex-wrap gap-3">
        {[
          { key: 'all', label: copy.all },
          { key: 'system', label: copy.system },
          { key: 'calendar', label: copy.calendar },
          { key: 'client', label: copy.client },
        ].map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setTypeFilter(item.key as typeof typeFilter)}
            className={`rounded-full px-4 py-2 text-sm font-bold ${
              typeFilter === item.key ? 'bg-[#12695b] text-white' : 'bg-white text-slate-700 dark:bg-[#0d1726] dark:text-slate-200'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="premium-panel overflow-hidden rounded-[30px]">
        <div className="grid grid-cols-[0.9fr_1fr_1.2fr_1.3fr_1fr_1.2fr] gap-4 border-b border-slate-200 px-6 py-4 text-xs font-black uppercase tracking-[0.16em] text-slate-400 dark:border-white/10">
          <div>{copy.type}</div>
          <div>{copy.when}</div>
          <div>{copy.who}</div>
          <div>{copy.what}</div>
          <div>{copy.target}</div>
          <div>{copy.doctor}</div>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-white/5">
          {filteredLogs.map((log) => (
            <div key={log.id} className="grid grid-cols-[0.9fr_1fr_1.2fr_1.3fr_1fr_1.2fr] gap-4 px-6 py-5 text-sm">
              <div className="inline-flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-200">
                <ActivitySquare className="h-4 w-4 text-[#12695b]" />
                {copy[log.type]}
              </div>
              <div className="text-slate-500 dark:text-slate-400">
                <div className="inline-flex items-center gap-2">
                  <Clock3 className="h-4 w-4" />
                  {log.date} {log.time}
                </div>
              </div>
              <div className="text-slate-700 dark:text-slate-200">
                <div className="inline-flex items-center gap-2 font-semibold">
                  <UserRound className="h-4 w-4" />
                  {log.memberName}
                </div>
                <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{log.memberRole}</div>
              </div>
              <div className="font-semibold text-slate-900 dark:text-white">{labelAction(log.action, locale)}</div>
              <div className="text-slate-700 dark:text-slate-200">{log.target || '-'}</div>
              <div className="text-slate-700 dark:text-slate-200">
                <div className="inline-flex items-center gap-2 font-semibold">
                  <ShieldCheck className="h-4 w-4 text-[#12695b]" />
                  {log.ownerDoctorName || '-'}
                </div>
                {log.memberName !== log.ownerDoctorName ? (
                  <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {locale === 'fr' ? `Action faite par ${log.memberName}` : locale === 'ar' ? `تم الإجراء بواسطة ${log.memberName}` : `Action done by ${log.memberName}`}
                  </div>
                ) : null}
              </div>
            </div>
          ))}
          {filteredLogs.length === 0 ? <div className="px-6 py-10 text-sm text-slate-500 dark:text-slate-400">{copy.noLogs}</div> : null}
        </div>
      </div>
    </div>
  );
}
