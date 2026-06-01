'use client';

import { useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  CreditCard,
  Download,
  FileText,
  Filter,
  Search,
  TrendingUp,
} from 'lucide-react';

const COPY = {
  en: {
    title: 'Finances and billing',
    subtitle: 'Track payments, pending balances, and revenue flow in one place.',
    periods: ['Today', 'This week', 'This month', 'This year'],
    export: 'Export',
    revenue: 'Revenue',
    pending: 'Pending / unpaid',
    cardPayments: 'Card payments',
    expenses: 'Expenses',
    recent: 'Recent transactions',
    search: 'Search patient...',
    createInvoice: 'Create invoice',
    invoiceHint: 'Generate a PDF invoice or a quote for a patient.',
    performance: 'Performance',
    monthlyGoal: 'Monthly goal',
    paid: 'Paid',
    waiting: 'Pending',
    unpaid: 'Unpaid',
  },
  fr: {
    title: 'Finances et facturation',
    subtitle: 'Suivez les paiements, les restes a payer et le flux de revenus du cabinet.',
    periods: ['Aujourd\'hui', 'Cette semaine', 'Ce mois', 'Cette année'],
    export: 'Exporter',
    revenue: 'CA',
    pending: 'En attente / impayes',
    cardPayments: 'Paiements carte',
    expenses: 'Depenses',
    recent: 'Transactions recentes',
    search: 'Rechercher patient...',
    createInvoice: 'Creer une facture',
    invoiceHint: 'Generez rapidement une facture PDF ou un devis pour un patient.',
    performance: 'Performance',
    monthlyGoal: 'Objectif mensuel',
    paid: 'Paye',
    waiting: 'En attente',
    unpaid: 'Impayé',
  },
  ar: {
    title: 'المالية والفوترة',
    subtitle: 'تابع المدفوعات والباقي والمداخيل من مكان واحد.',
    periods: ['اليوم', 'هذا الأسبوع', 'هذا الشهر', 'هذه السنة'],
    export: 'تصدير',
    revenue: 'المداخيل',
    pending: 'معلق / غير مدفوع',
    cardPayments: 'مدفوعات البطاقة',
    expenses: 'المصاريف',
    recent: 'آخر العمليات',
    search: 'ابحث عن مريض...',
    createInvoice: 'إنشاء فاتورة',
    invoiceHint: 'أنشئ بسرعة فاتورة PDF أو عرض سعر للمريض.',
    performance: 'الأداء',
    monthlyGoal: 'الهدف الشهري',
    paid: 'مدفوع',
    waiting: 'قيد الانتظار',
    unpaid: 'غير مدفوع',
  },
} as const;

const recentTransactions = [
  { id: 1, patient: 'Fatima Yassine', amount: 300, type: 'Consultation', status: 'paid', date: 'Today', method: 'Cash' },
  { id: 2, patient: 'Karim Benali', amount: 250, type: 'Follow-up', status: 'paid', date: 'Today', method: 'Card' },
  { id: 3, patient: 'Youssef T.', amount: 500, type: 'Consultation + Act', status: 'pending', date: 'Yesterday', method: '-' },
  { id: 4, patient: 'Nadia S.', amount: 300, type: 'Consultation', status: 'paid', date: 'Yesterday', method: 'Check' },
  { id: 5, patient: 'Ahmed M.', amount: 450, type: 'Procedure', status: 'unpaid', date: '3 days ago', method: '-' },
];

export default function FinancesTab() {
  const pathname = usePathname();
  const locale = (pathname?.split('/')[1] || 'en') as keyof typeof COPY;
  const copy = COPY[locale] || COPY.en;
  const [period, setPeriod] = useState<string>(copy.periods[2]);

  const stats = useMemo(
    () => ({
      revenue: 45200,
      pending: 3450,
      cardPayments: 28500,
      expenses: 4200,
    }),
    []
  );

  return (
    <div className="space-y-8 pb-10" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">{copy.title}</h2>
          <p className="mt-2 max-w-3xl text-sm text-slate-500 dark:text-slate-400">{copy.subtitle}</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={period}
            onChange={(event) => setPeriod(event.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 outline-none transition-all focus:border-[#12695b] dark:border-white/10 dark:bg-[#0a0f18] dark:text-slate-300"
          >
            {copy.periods.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
          <button className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200">
            <Download className="h-4 w-4" />
            {copy.export}
          </button>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard title={`${copy.revenue} (${period})`} value={`${stats.revenue.toLocaleString()} MAD`} delta="+12.5% vs last month" icon={ArrowUpRight} tone="emerald" />
        <MetricCard title={copy.pending} value={`${stats.pending.toLocaleString()} MAD`} delta="8 dossiers" icon={Clock} tone="amber" />
        <MetricCard title={copy.cardPayments} value={`${stats.cardPayments.toLocaleString()} MAD`} delta="63% du volume" icon={CreditCard} tone="blue" />
        <MetricCard title={copy.expenses} value={`${stats.expenses.toLocaleString()} MAD`} delta="-2.4% vs last month" icon={ArrowDownRight} tone="rose" />
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <div className="rounded-3xl border border-slate-200/60 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-[#0a0f18]">
          <div className="mb-6 flex items-center justify-between gap-3">
            <h3 className="flex items-center gap-2 text-xl font-black text-slate-900 dark:text-white">
              <FileText className="h-5 w-5 text-[#12695b]" />
              {copy.recent}
            </h3>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder={copy.search}
                  className="w-48 rounded-lg border border-slate-200 bg-slate-50 py-1.5 ps-9 pe-3 text-sm text-slate-900 outline-none transition-all focus:border-[#12695b] dark:border-white/5 dark:bg-white/[0.02] dark:text-white dark:focus:border-emerald-500"
                />
              </div>
              <button className="rounded-lg border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-50 dark:border-white/10 dark:text-slate-400 dark:hover:bg-white/5">
                <Filter className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
              <thead className="border-b border-slate-100 text-xs uppercase text-slate-400 dark:border-white/5">
                <tr>
                  <th className="pb-3 font-bold">Patient</th>
                  <th className="pb-3 font-bold">Type</th>
                  <th className="pb-3 font-bold">Date</th>
                  <th className="pb-3 font-bold">Method</th>
                  <th className="pb-3 font-bold text-right">Amount</th>
                  <th className="pb-3 font-bold text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {recentTransactions.map((transaction) => (
                  <tr key={transaction.id} className="transition-colors hover:bg-slate-50/50 dark:hover:bg-white/[0.02]">
                    <td className="py-4 font-bold text-slate-900 dark:text-white">{transaction.patient}</td>
                    <td className="py-4">{transaction.type}</td>
                    <td className="py-4 text-xs">{transaction.date}</td>
                    <td className="py-4 font-medium">{transaction.method}</td>
                    <td className="py-4 text-right font-black text-slate-900 dark:text-white">{transaction.amount} MAD</td>
                    <td className="py-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                          transaction.status === 'paid'
                            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
                            : transaction.status === 'pending'
                              ? 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400'
                              : 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400'
                        }`}
                      >
                        {transaction.status === 'paid' ? <CheckCircle2 className="h-3 w-3" /> : transaction.status === 'pending' ? <Clock className="h-3 w-3" /> : null}
                        {transaction.status === 'paid' ? copy.paid : transaction.status === 'pending' ? copy.waiting : copy.unpaid}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="relative overflow-hidden rounded-3xl border border-slate-200/60 bg-gradient-to-br from-[#12695b] to-emerald-700 p-6 text-white shadow-sm dark:border-white/5">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
            <h3 className="relative z-10 mb-2 text-xl font-black">{copy.createInvoice}</h3>
            <p className="relative z-10 mb-6 text-sm text-emerald-50">{copy.invoiceHint}</p>
            <button className="relative z-10 w-full rounded-xl bg-white px-4 py-3 text-sm font-black text-[#12695b] shadow-lg transition-transform hover:scale-[1.02]">
              + {copy.createInvoice}
            </button>
          </div>

          <div className="rounded-3xl border border-slate-200/60 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-[#0a0f18]">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-black text-slate-900 dark:text-white">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              {copy.performance}
            </h3>
            <div className="space-y-4">
              <div>
                <div className="mb-1 flex justify-between text-sm font-bold text-slate-600 dark:text-slate-300">
                  <span>{copy.monthlyGoal}</span>
                  <span>75%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/5">
                  <div className="h-full w-[75%] rounded-full bg-blue-500" />
                </div>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Encore 14,800 MAD pour atteindre l&apos;objectif de ce mois.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  title,
  value,
  delta,
  icon: Icon,
  tone,
}: {
  title: string;
  value: string;
  delta: string;
  icon: React.ElementType;
  tone: 'emerald' | 'amber' | 'blue' | 'rose';
}) {
  const toneClasses = {
    emerald: 'bg-emerald-500/10 text-emerald-500',
    amber: 'bg-amber-500/10 text-amber-500',
    blue: 'bg-blue-500/10 text-blue-500',
    rose: 'bg-rose-500/10 text-rose-500',
  } as const;

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-slate-200/50 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-[#0a0f18]/50">
      <div className={`absolute -right-6 -top-6 rounded-full p-8 transition-transform group-hover:scale-110 ${toneClasses[tone]}`}>
        <Icon className="h-8 w-8" />
      </div>
      <div className="text-sm font-bold text-slate-500 dark:text-slate-400">{title}</div>
      <div className="mt-4 text-3xl font-black text-slate-900 dark:text-white">{value}</div>
      <div className="mt-2 flex items-center gap-1 text-xs font-bold text-slate-400">{delta}</div>
    </div>
  );
}
