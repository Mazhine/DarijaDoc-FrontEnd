'use client';

import { useMemo, useState } from 'react';
import { Activity, CalendarDays, CreditCard, ShieldCheck, Sparkles, UserCog, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { getDoctorEmployees, getDoctors, getSeededTeam, getSecretaries, type TeamMember } from '@/src/lib/team';
import { getPatients } from '@/src/lib/clinic';

type NavTarget = {
  tab: string;
  filters?: Record<string, string>;
};

const COPY = {
  en: {
    admin: {
      title: 'Admin control center',
      subtitle: 'A clear global view of the platform, subscriptions, teams, and activity.',
      doctors: 'Doctors',
      secretaries: 'Secretaries',
      activeSubscriptions: 'Active subscriptions',
      tokenCap: 'Monthly token cap',
      topUsage: 'Top token usage',
      openRole: 'Open role view',
      openSubscriptions: 'Open subscriptions',
      openTokens: 'Open token ranking',
      openLog: 'Open logs',
      monthlyCapNote: 'Shared platform ceiling',
      logTitle: 'Recent activity',
      logEmpty: 'No activity recorded yet.',
      employees: 'employees',
    },
    doctor: {
      title: 'Doctor workspace',
      subtitle: 'Focus on your patients, your employees, and what still needs attention in your clinic.',
      patients: 'Patients',
      employees: 'Employees',
      followUps: 'Follow-ups',
      activity: 'Recent team activity',
      openPatients: 'Open patients',
      openCalendar: 'Open calendar',
      openTeam: 'Open my team',
      noLogs: 'No recent activity for your clinic yet.',
    },
    secretary: {
      title: 'Secretary workspace',
      subtitle: 'A practical execution view for agenda, patients, and current operational load.',
      patients: 'Patients',
      schedule: 'Schedule',
      reminders: 'Reminders',
      openPatients: 'Open patients',
      openCalendar: 'Open calendar',
      loadTitle: 'Today focus',
      loadEmpty: 'No pending operational activity yet.',
    },
  },
  fr: {
    admin: {
      title: 'Centre de pilotage admin',
      subtitle: 'Une vue globale claire de la plateforme, des abonnements, des equipes et de l activite.',
      doctors: 'Medecins',
      secretaries: 'Secretaires',
      activeSubscriptions: 'Abonnements actifs',
      tokenCap: 'Plafond tokens mensuel',
      topUsage: 'Top usage tokens',
      openRole: 'Ouvrir la vue',
      openSubscriptions: 'Ouvrir les abonnements',
      openTokens: 'Ouvrir le classement tokens',
      openLog: 'Ouvrir les logs',
      monthlyCapNote: 'Plafond partage plateforme',
      logTitle: 'Activite recente',
      logEmpty: 'Aucune activite enregistree pour le moment.',
      employees: 'employes',
    },
    doctor: {
      title: 'Espace medecin',
      subtitle: 'Concentrez-vous sur vos patients, vos employes et ce qui demande encore une action dans votre cabinet.',
      patients: 'Patients',
      employees: 'Employes',
      followUps: 'Suivis',
      activity: 'Activite recente equipe',
      openPatients: 'Ouvrir les patients',
      openCalendar: 'Ouvrir le calendrier',
      openTeam: 'Ouvrir mon equipe',
      noLogs: 'Aucune activite recente pour votre cabinet.',
    },
    secretary: {
      title: 'Espace secretaire',
      subtitle: 'Une vue d execution pratique pour l agenda, les patients et la charge du moment.',
      patients: 'Patients',
      schedule: 'Agenda',
      reminders: 'Rappels',
      openPatients: 'Ouvrir les patients',
      openCalendar: 'Ouvrir le calendrier',
      loadTitle: 'Priorites du jour',
      loadEmpty: 'Aucune charge operationnelle en attente.',
    },
  },
  ar: {
    admin: {
      title: 'مركز تحكم الإدارة',
      subtitle: 'رؤية عامة واضحة للمنصة والاشتراكات والفرق والنشاط.',
      doctors: 'الأطباء',
      secretaries: 'السكرتيرات',
      activeSubscriptions: 'الاشتراكات النشطة',
      tokenCap: 'حد التوكنز الشهري',
      topUsage: 'أعلى استهلاك للتوكنز',
      openRole: 'فتح العرض',
      openSubscriptions: 'فتح الاشتراكات',
      openTokens: 'فتح ترتيب التوكنز',
      openLog: 'فتح السجلات',
      monthlyCapNote: 'سقف المنصة الشهري',
      logTitle: 'النشاط الأخير',
      logEmpty: 'لا يوجد نشاط مسجل حاليا.',
      employees: 'موظفون',
    },
    doctor: {
      title: 'مساحة الطبيب',
      subtitle: 'ركز على مرضاك وموظفيك وما يحتاج متابعة داخل عيادتك.',
      patients: 'المرضى',
      employees: 'الموظفون',
      followUps: 'المتابعات',
      activity: 'نشاط الفريق الأخير',
      openPatients: 'فتح المرضى',
      openCalendar: 'فتح التقويم',
      openTeam: 'فتح فريقي',
      noLogs: 'لا يوجد نشاط حديث لعيادتك حاليا.',
    },
    secretary: {
      title: 'مساحة السكرتيرة',
      subtitle: 'واجهة تنفيذ عملية للمواعيد والمرضى والمهام الحالية.',
      patients: 'المرضى',
      schedule: 'الجدول',
      reminders: 'التذكيرات',
      openPatients: 'فتح المرضى',
      openCalendar: 'فتح التقويم',
      loadTitle: 'أولوية اليوم',
      loadEmpty: 'لا توجد مهام تشغيلية معلقة حاليا.',
    },
  },
} as const;

function navigateTo(target: NavTarget) {
  sessionStorage.setItem('adminTab', target.tab);
  if (target.filters) {
    sessionStorage.setItem('adminFilters', JSON.stringify(target.filters));
  }
  window.dispatchEvent(new CustomEvent('adminNavigate', { detail: target }));
}

function MetricCard({
  label,
  value,
  note,
  icon: Icon,
  onClick,
}: {
  label: string;
  value: string;
  note: string;
  icon: typeof Users;
  onClick: () => void;
}) {
  return (
    <button type="button" onClick={onClick} className="premium-panel w-full rounded-[28px] p-6 text-left transition hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">{label}</div>
          <div className="mt-3 text-3xl font-black text-slate-950 dark:text-white">{value}</div>
          <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">{note}</div>
        </div>
        <div className="premium-chip flex h-12 w-12 items-center justify-center rounded-2xl">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </button>
  );
}

export default function DashboardTab() {
  const pathname = usePathname();
  const locale = (pathname?.split('/')[1] || 'en') as keyof typeof COPY;
  const role = (typeof window !== 'undefined' ? sessionStorage.getItem('adminRole') : 'Admin') || 'Admin';
  const currentEmail = (typeof window !== 'undefined' ? sessionStorage.getItem('adminEmail') : '') || '';
  const baseCopy = COPY[locale] || COPY.en;
  const [team] = useState<TeamMember[]>(() => getSeededTeam());
  const [logs] = useState<Array<Record<string, string>>>(() => {
    try {
      return JSON.parse(localStorage.getItem('clinicAuditLogs') || '[]');
    } catch {
      return [];
    }
  });
  const [patients] = useState(() => getPatients());

  const doctors = useMemo(() => getDoctors(team), [team]);
  const secretaries = useMemo(() => getSecretaries(team), [team]);
  const activeDoctors = useMemo(() => doctors.filter((member) => member.subscriptionStatus === 'Active'), [doctors]);
  const topDoctors = useMemo(() => [...doctors].sort((a, b) => (b.tokenUsageMonthly || 0) - (a.tokenUsageMonthly || 0)).slice(0, 5), [doctors]);
  const ownEmployees = useMemo(() => getDoctorEmployees(team, currentEmail), [currentEmail, team]);
  const ownClinicLogs = useMemo(
    () => logs.filter((log) => log.ownerDoctorEmail?.toLowerCase() === currentEmail.toLowerCase()).slice(0, 8),
    [currentEmail, logs]
  );

  if (role === 'Doctor') {
    const copy = baseCopy.doctor;
    const followUps = patients.filter((patient) => patient.status === 'follow-up').length;

    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-black text-slate-950 dark:text-white">{copy.title}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-500 dark:text-slate-400">{copy.subtitle}</p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <MetricCard label={copy.patients} value={String(patients.length)} note={copy.openPatients} icon={Users} onClick={() => navigateTo({ tab: 'clients' })} />
          <MetricCard label={copy.employees} value={String(ownEmployees.length)} note={copy.openTeam} icon={UserCog} onClick={() => navigateTo({ tab: 'team' })} />
          <MetricCard label={copy.followUps} value={String(followUps)} note={copy.openCalendar} icon={CalendarDays} onClick={() => navigateTo({ tab: 'calendar' })} />
        </div>

        <div className="premium-panel rounded-[30px] p-6">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-[#12695b]" />
            <h3 className="text-xl font-black text-slate-950 dark:text-white">{copy.activity}</h3>
          </div>
          <div className="mt-5 space-y-3">
            {ownClinicLogs.map((log) => (
              <div key={log.id} className="rounded-[22px] border border-slate-200 px-4 py-4 dark:border-white/10">
                <div className="text-sm font-semibold text-slate-950 dark:text-white">{log.memberName} - {log.action}</div>
                <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {log.target} • {log.date} • {log.time}
                </div>
              </div>
            ))}
            {ownClinicLogs.length === 0 ? <div className="text-sm text-slate-500 dark:text-slate-400">{copy.noLogs}</div> : null}
          </div>
        </div>
      </div>
    );
  }

  if (role === 'Secretary') {
    const copy = baseCopy.secretary;
    const followUps = patients.filter((patient) => patient.status === 'follow-up').length;

    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-black text-slate-950 dark:text-white">{copy.title}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-500 dark:text-slate-400">{copy.subtitle}</p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <MetricCard label={copy.patients} value={String(patients.length)} note={copy.openPatients} icon={Users} onClick={() => navigateTo({ tab: 'clients' })} />
          <MetricCard label={copy.schedule} value={String(followUps)} note={copy.openCalendar} icon={CalendarDays} onClick={() => navigateTo({ tab: 'calendar' })} />
          <MetricCard label={copy.reminders} value={String(ownClinicLogs.length)} note={copy.openCalendar} icon={Activity} onClick={() => navigateTo({ tab: 'calendar' })} />
        </div>

        <div className="premium-panel rounded-[30px] p-6">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#12695b]" />
            <h3 className="text-xl font-black text-slate-950 dark:text-white">{copy.loadTitle}</h3>
          </div>
          <div className="mt-5 space-y-3">
            {ownClinicLogs.map((log) => (
              <div key={log.id} className="rounded-[22px] border border-slate-200 px-4 py-4 dark:border-white/10">
                <div className="text-sm font-semibold text-slate-950 dark:text-white">{log.action}</div>
                <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{log.target} • {log.date} • {log.time}</div>
              </div>
            ))}
            {ownClinicLogs.length === 0 ? <div className="text-sm text-slate-500 dark:text-slate-400">{copy.loadEmpty}</div> : null}
          </div>
        </div>
      </div>
    );
  }

  const copy = baseCopy.admin;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-950 dark:text-white">{copy.title}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-500 dark:text-slate-400">{copy.subtitle}</p>
        </div>
        <div className="premium-chip inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.16em]">
          <Sparkles className="h-4 w-4" />
          {copy.monthlyCapNote}
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label={copy.doctors} value={String(doctors.length)} note={copy.openRole} icon={Users} onClick={() => navigateTo({ tab: 'team', filters: { role: 'Doctor' } })} />
        <MetricCard label={copy.secretaries} value={String(secretaries.length)} note={copy.openRole} icon={UserCog} onClick={() => navigateTo({ tab: 'team', filters: { role: 'Secretary' } })} />
        <MetricCard label={copy.activeSubscriptions} value={String(activeDoctors.length)} note={copy.openSubscriptions} icon={CreditCard} onClick={() => navigateTo({ tab: 'subscriptions', filters: { status: 'Active' } })} />
        <MetricCard label={copy.tokenCap} value="5,000,000" note={copy.openTokens} icon={ShieldCheck} onClick={() => navigateTo({ tab: 'subscriptions', filters: { ranking: 'tokens' } })} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="premium-panel rounded-[30px] p-6">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-xl font-black text-slate-950 dark:text-white">{copy.topUsage}</h3>
            <button type="button" onClick={() => navigateTo({ tab: 'subscriptions', filters: { ranking: 'tokens' } })} className="rounded-full bg-[#eff8f5] px-4 py-2 text-xs font-bold text-[#12695b] dark:bg-[#9fe7d4]/12 dark:text-[#9fe7d4]">
              {copy.openTokens}
            </button>
          </div>

          <div className="mt-5 space-y-3">
            {topDoctors.map((doctor, index) => {
              const employees = getDoctorEmployees(team, doctor.email);
              const percentage = Math.min(Math.round(((doctor.tokenUsageMonthly || 0) / (doctor.tokenLimitMonthly || 5000000)) * 100), 100);

              return (
                <motion.div key={doctor.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="rounded-[24px] border border-slate-200 bg-white/70 p-5 dark:border-white/10 dark:bg-white/5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-base font-black text-slate-950 dark:text-white">{doctor.name}</div>
                      <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">{doctor.city || '-'} • {employees.length} {copy.employees}</div>
                    </div>
                    <button type="button" onClick={() => navigateTo({ tab: 'team', filters: { role: 'Doctor', doctorEmail: doctor.email } })} className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 dark:border-white/10 dark:text-slate-200">
                      {copy.openRole}
                    </button>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                    <span>{new Intl.NumberFormat().format(doctor.tokenUsageMonthly || 0)}</span>
                    <span>{percentage}%</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-slate-100 dark:bg-white/10">
                    <div className="h-2 rounded-full bg-[#12695b]" style={{ width: `${percentage}%` }} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="premium-panel rounded-[30px] p-6">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-xl font-black text-slate-950 dark:text-white">{copy.logTitle}</h3>
            <button type="button" onClick={() => navigateTo({ tab: 'logs' })} className="rounded-full bg-[#eff8f5] px-4 py-2 text-xs font-bold text-[#12695b] dark:bg-[#9fe7d4]/12 dark:text-[#9fe7d4]">
              {copy.openLog}
            </button>
          </div>

          <div className="mt-5 space-y-3">
            {logs.slice(0, 8).map((log) => (
              <div key={log.id} className="rounded-[22px] border border-slate-200 px-4 py-4 dark:border-white/10">
                <div className="flex items-start gap-3">
                  <Activity className="mt-0.5 h-4 w-4 text-[#12695b]" />
                  <div>
                    <div className="text-sm font-semibold text-slate-950 dark:text-white">{log.memberName} - {log.action}</div>
                    <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{log.target} • {log.date} • {log.time}</div>
                  </div>
                </div>
              </div>
            ))}
            {logs.length === 0 ? <div className="text-sm text-slate-500 dark:text-slate-400">{copy.logEmpty}</div> : null}
          </div>
        </div>
      </div>
    </div>
  );
}
