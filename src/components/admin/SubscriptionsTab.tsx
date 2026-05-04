'use client';

import { useEffect, useMemo, useState } from 'react';
import { BarChart3, History, ReceiptText, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { getDoctors, getSeededTeam, type TeamMember } from '@/src/lib/team';

const COPY = {
  en: {
    title: 'Subscriptions and billing',
    subtitle: 'See who paid, when they paid, who lost access, and which doctors consume the most tokens.',
    history: 'Subscription history',
    ranking: 'Token ranking',
    status: 'Status',
    plan: 'Plan',
    city: 'City',
    paidAt: 'Paid at',
    amount: 'Amount',
    current: 'Current doctors',
    archived: 'Archived users',
  },
  fr: {
    title: 'Abonnements et facturation',
    subtitle: 'Voyez qui a paye, quand, qui a perdu son acces et quels medecins consomment le plus de tokens.',
    history: 'Historique des abonnements',
    ranking: 'Classement tokens',
    status: 'Statut',
    plan: 'Plan',
    city: 'Ville',
    paidAt: 'Paye le',
    amount: 'Montant',
    current: 'Medecins actuels',
    archived: 'Utilisateurs archives',
  },
  ar: {
    title: 'الاشتراكات والفوترة',
    subtitle: 'اعرف من دفع ومتى، ومن فقد اشتراكه، وما ترتيب الأطباء حسب استهلاك التوكنز.',
    history: 'سجل الاشتراكات',
    ranking: 'ترتيب التوكنز',
    status: 'الحالة',
    plan: 'الخطة',
    city: 'المدينة',
    paidAt: 'تاريخ الدفع',
    amount: 'المبلغ',
    current: 'الأطباء الحاليون',
    archived: 'المستخدمون المؤرشفون',
  },
} as const;

function readFilters() {
  try {
    return JSON.parse(sessionStorage.getItem('adminFilters') || '{}') as Record<string, string>;
  } catch {
    return {};
  }
}

export default function SubscriptionsTab() {
  const pathname = usePathname();
  const locale = (pathname?.split('/')[1] || 'en') as keyof typeof COPY;
  const copy = COPY[locale] || COPY.en;
  const [team] = useState<TeamMember[]>(() => getSeededTeam());
  const [statusFilter, setStatusFilter] = useState(() => readFilters().status || 'All');
  const [rankingMode, setRankingMode] = useState(() => readFilters().ranking || 'subscriptions');

  useEffect(() => {
    const handleNavigate = (event: Event) => {
      const detail = (event as CustomEvent<{ filters?: Record<string, string> }>).detail;
      if (detail?.filters?.status) setStatusFilter(detail.filters.status);
      if (detail?.filters?.ranking) setRankingMode(detail.filters.ranking);
    };

    window.addEventListener('adminNavigate', handleNavigate);
    return () => window.removeEventListener('adminNavigate', handleNavigate);
  }, []);

  const doctors = useMemo(() => getDoctors(team), [team]);
  const filteredDoctors = useMemo(
    () => doctors.filter((doctor) => statusFilter === 'All' || doctor.subscriptionStatus === statusFilter),
    [doctors, statusFilter]
  );
  const archivedMembers = useMemo(() => team.filter((member) => member.isArchived), [team]);
  const rankedDoctors = useMemo(
    () => [...doctors].sort((a, b) => (b.tokenUsageMonthly || 0) - (a.tokenUsageMonthly || 0)),
    [doctors]
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-black text-slate-950 dark:text-white">{copy.title}</h2>
        <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-500 dark:text-slate-400">{copy.subtitle}</p>
      </div>

      <div className="flex flex-wrap gap-3">
        {['All', 'Active', 'Trial', 'Past Due', 'Cancelled'].map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setStatusFilter(status)}
            className={`rounded-full px-4 py-2 text-sm font-bold ${
              statusFilter === status
                ? 'bg-[#12695b] text-white'
                : 'bg-white text-slate-700 dark:bg-[#0d1726] dark:text-slate-200'
            }`}
          >
            {status}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setRankingMode('tokens')}
          className={`rounded-full px-4 py-2 text-sm font-bold ${
            rankingMode === 'tokens'
              ? 'bg-[#12695b] text-white'
              : 'bg-white text-slate-700 dark:bg-[#0d1726] dark:text-slate-200'
          }`}
        >
          {copy.ranking}
        </button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="premium-panel rounded-[30px] p-6">
          <div className="flex items-center gap-2">
            <ReceiptText className="h-5 w-5 text-[#12695b]" />
            <h3 className="text-xl font-black text-slate-950 dark:text-white">{copy.current}</h3>
          </div>

          <div className="mt-5 space-y-4">
            {filteredDoctors.map((doctor) => (
              <div key={doctor.id} className="rounded-[24px] border border-slate-200 px-5 py-5 dark:border-white/10">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="text-lg font-black text-slate-950 dark:text-white">{doctor.name}</div>
                    <div className="mt-2 flex flex-wrap gap-3 text-sm text-slate-500 dark:text-slate-400">
                      <span>{copy.city}: {doctor.city || '-'}</span>
                      <span>{copy.plan}: {doctor.subscriptionPlan || '-'}</span>
                      <span>{copy.status}: {doctor.subscriptionStatus || '-'}</span>
                    </div>
                  </div>
                  <div className="rounded-[20px] bg-[#eff8f5] px-4 py-3 text-sm font-bold text-[#12695b] dark:bg-[#9fe7d4]/12 dark:text-[#9fe7d4]">
                    {new Intl.NumberFormat().format(doctor.tokenUsageMonthly || 0)} / 5,000,000
                  </div>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {(doctor.subscriptionHistory || []).map((item) => (
                    <div key={item.id} className="rounded-[22px] bg-slate-50 px-4 py-4 text-sm dark:bg-white/5">
                      <div className="font-bold text-slate-950 dark:text-white">{item.status} • {item.plan}</div>
                      <div className="mt-1 text-slate-500 dark:text-slate-400">{copy.paidAt}: {item.paidAt}</div>
                      <div className="mt-1 text-slate-500 dark:text-slate-400">{copy.amount}: {item.amountMad} MAD</div>
                      <div className="mt-1 text-slate-500 dark:text-slate-400">{item.note}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="premium-panel rounded-[30px] p-6">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-[#12695b]" />
              <h3 className="text-xl font-black text-slate-950 dark:text-white">{copy.ranking}</h3>
            </div>

            <div className="mt-5 space-y-3">
              {rankedDoctors.map((doctor, index) => {
                const percent = Math.min(Math.round(((doctor.tokenUsageMonthly || 0) / 5000000) * 100), 100);
                return (
                  <motion.div key={doctor.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }} className="rounded-[24px] border border-slate-200 px-4 py-4 dark:border-white/10">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="font-bold text-slate-950 dark:text-white">{doctor.name}</div>
                        <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{doctor.city || '-'}</div>
                      </div>
                      <div className="text-sm font-bold text-[#12695b] dark:text-[#9fe7d4]">
                        {new Intl.NumberFormat().format(doctor.tokenUsageMonthly || 0)}
                      </div>
                    </div>
                    <div className="mt-3 h-2 rounded-full bg-slate-100 dark:bg-white/10">
                      <div className="h-2 rounded-full bg-[#12695b]" style={{ width: `${percent}%` }} />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="premium-panel rounded-[30px] p-6">
            <div className="flex items-center gap-2">
              <History className="h-5 w-5 text-[#12695b]" />
              <h3 className="text-xl font-black text-slate-950 dark:text-white">{copy.archived}</h3>
            </div>

            <div className="mt-5 space-y-3">
              {archivedMembers.map((member) => (
                <div key={member.id} className="rounded-[24px] border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200">
                  <div className="flex items-center gap-2 font-bold">
                    <Users className="h-4 w-4" />
                    {member.name}
                  </div>
                  <div className="mt-1">{member.archivedAt || '-'}</div>
                  <div className="mt-1">{member.archivedReason || '-'}</div>
                </div>
              ))}
              {!archivedMembers.length ? (
                <div className="rounded-[24px] border border-slate-200 px-4 py-4 text-sm text-slate-500 dark:border-white/10 dark:text-slate-400">
                  No archived members yet.
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
