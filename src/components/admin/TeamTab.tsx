'use client';

import { useEffect, useMemo, useState } from 'react';
import { Activity, Mail, MapPin, Shield, Stethoscope, UserCog, UserPlus, Users, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { createPasswordRecord, ensureTeamSecurity, getDoctorEmployees, getVisibleTeamForUser, saveTeam, type TeamAccess, type TeamMember, type TeamRole } from '@/src/lib/team';

const COPY = {
  en: {
    title: 'Users and access',
    subtitle: 'Sort by role, city, and subscription state. Each doctor can also open their employees.',
    add: 'Add team member',
    addSecretary: 'Add secretary',
    role: 'Role',
    city: 'City',
    subscription: 'Subscription',
    all: 'All',
    doctor: 'Doctor',
    secretary: 'Secretary',
    active: 'Active',
    trial: 'Trial',
    pastDue: 'Past due',
    cancelled: 'Cancelled',
    viewEmployees: 'View employees',
    hideEmployees: 'Hide employees',
    noEmployees: 'No employees linked to this doctor yet.',
    viewLog: 'Activity',
    archived: 'Archived',
    formTitle: 'Create user',
    save: 'Save user',
    cancel: 'Cancel',
    fullName: 'Full name',
    email: 'Email',
    tempPassword: 'Temporary password',
    specialty: 'Specialty',
    clearLogs: 'Clearer activity log',
    noLogs: 'No activity recorded for this member yet.',
  },
  fr: {
    title: 'Utilisateurs et acces',
    subtitle: 'Triez par role, ville et abonnement. Chaque medecin peut aussi ouvrir ses employes.',
    add: 'Ajouter un membre',
    addSecretary: 'Ajouter une secretaire',
    role: 'Role',
    city: 'Ville',
    subscription: 'Abonnement',
    all: 'Tous',
    doctor: 'Medecin',
    secretary: 'Secretaire',
    active: 'Actif',
    trial: 'Essai',
    pastDue: 'En retard',
    cancelled: 'Resilie',
    viewEmployees: 'Voir les employes',
    hideEmployees: 'Masquer les employes',
    noEmployees: 'Aucun employe rattache pour ce medecin.',
    viewLog: 'Activite',
    archived: 'Archive',
    formTitle: 'Creer un utilisateur',
    save: 'Enregistrer',
    cancel: 'Annuler',
    fullName: 'Nom complet',
    email: 'E-mail',
    tempPassword: 'Mot de passe temporaire',
    specialty: 'Specialite',
    clearLogs: 'Journal plus clair',
    noLogs: 'Aucune activite enregistree pour ce membre.',
  },
  ar: {
    title: 'المستخدمون والصلاحيات',
    subtitle: 'رتب حسب الدور والمدينة والاشتراك، وكل طبيب يمكنه فتح قائمة الموظفين الخاصة به.',
    add: 'إضافة عضو',
    addSecretary: 'إضافة سكرتيرة',
    role: 'الدور',
    city: 'المدينة',
    subscription: 'الاشتراك',
    all: 'الكل',
    doctor: 'طبيب',
    secretary: 'سكرتيرة',
    active: 'نشط',
    trial: 'تجريبي',
    pastDue: 'متأخر',
    cancelled: 'ملغى',
    viewEmployees: 'عرض الموظفين',
    hideEmployees: 'إخفاء الموظفين',
    noEmployees: 'لا يوجد موظفون مرتبطون بهذا الطبيب حاليا.',
    viewLog: 'النشاط',
    archived: 'مؤرشف',
    formTitle: 'إنشاء مستخدم',
    save: 'حفظ',
    cancel: 'إلغاء',
    fullName: 'الاسم الكامل',
    email: 'البريد الإلكتروني',
    tempPassword: 'كلمة مرور مؤقتة',
    specialty: 'التخصص',
    clearLogs: 'سجل نشاط أوضح',
    noLogs: 'لا توجد أنشطة مسجلة لهذا العضو.',
  },
} as const;

function readStoredFilters() {
  try {
    return JSON.parse(sessionStorage.getItem('adminFilters') || '{}') as Record<string, string>;
  } catch {
    return {};
  }
}

function formatLog(log: Record<string, string>, locale: string) {
  if (log.action === 'loggedIn') {
    return locale === 'fr'
      ? `${log.memberName} s est connecte`
      : locale === 'ar'
        ? `${log.memberName} سجل الدخول`
        : `${log.memberName} signed in`;
  }

  return locale === 'fr'
    ? `${log.memberName} a lance ${log.action} sur ${log.target}`
    : locale === 'ar'
      ? `${log.memberName} نفذ ${log.action} على ${log.target}`
      : `${log.memberName} ran ${log.action} on ${log.target}`;
}

export default function TeamTab() {
  const pathname = usePathname();
  const locale = (pathname?.split('/')[1] || 'en') as keyof typeof COPY;
  const copy = COPY[locale] || COPY.en;
  const currentRole = typeof window !== 'undefined' ? sessionStorage.getItem('adminRole') || 'Admin' : 'Admin';
  const currentEmail = typeof window !== 'undefined' ? sessionStorage.getItem('adminEmail') || '' : '';
  const currentName = typeof window !== 'undefined' ? sessionStorage.getItem('adminName') || '' : '';
  const isAdmin = currentRole === 'Admin';
  const isDoctor = currentRole === 'Doctor';

  const initialFilters = typeof window !== 'undefined' ? readStoredFilters() : {};
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [logs] = useState<Array<Record<string, string>>>(() => {
    try {
      return JSON.parse(localStorage.getItem('clinicAuditLogs') || '[]');
    } catch {
      return [];
    }
  });
  const [roleFilter, setRoleFilter] = useState(initialFilters.role || 'All');
  const [cityFilter, setCityFilter] = useState(initialFilters.city || 'All');
  const [subscriptionFilter, setSubscriptionFilter] = useState(initialFilters.status || 'All');
  const [expandedDoctorEmail, setExpandedDoctorEmail] = useState(initialFilters.doctorEmail || '');
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Secretary' as TeamRole,
    access: 'Calendar + Clients' as TeamAccess,
    city: '',
    specialty: '',
  });

  useEffect(() => {
    ensureTeamSecurity().then((members) => setTeam(members));

    const handleNavigate = (event: Event) => {
      const detail = (event as CustomEvent<{ filters?: Record<string, string> }>).detail;
      if (!detail?.filters) return;
      if (detail.filters.role) setRoleFilter(detail.filters.role);
      if (detail.filters.city) setCityFilter(detail.filters.city);
      if (detail.filters.status) setSubscriptionFilter(detail.filters.status);
      if (detail.filters.doctorEmail) setExpandedDoctorEmail(detail.filters.doctorEmail);
    };

    window.addEventListener('adminNavigate', handleNavigate);
    return () => window.removeEventListener('adminNavigate', handleNavigate);
  }, []);

  useEffect(() => {
    saveTeam(team);
  }, [team]);

  const visibleTeam = useMemo(() => getVisibleTeamForUser(team, currentRole, currentEmail), [currentEmail, currentRole, team]);
  const cities = useMemo(() => Array.from(new Set(visibleTeam.map((member) => member.city).filter(Boolean))).sort(), [visibleTeam]);

  const filteredTeam = useMemo(() => {
    return visibleTeam.filter((member) => {
      const roleOk = !isAdmin || roleFilter === 'All' || member.role === roleFilter;
      const cityOk = !isAdmin || cityFilter === 'All' || member.city === cityFilter;
      const subscriptionOk = !isAdmin || subscriptionFilter === 'All' || member.subscriptionStatus === subscriptionFilter;
      return roleOk && cityOk && subscriptionOk;
    });
  }, [cityFilter, isAdmin, roleFilter, subscriptionFilter, visibleTeam]);

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();

    const passwordRecord = await createPasswordRecord(form.password);
    const nextRole = isDoctor ? 'Secretary' : form.role;
    const ownerDoctorEmail = nextRole === 'Secretary' ? (isDoctor ? currentEmail : currentEmail) : undefined;
    const ownerDoctorName = nextRole === 'Secretary' ? (isDoctor ? currentName : currentName) : undefined;

    const nextMember: TeamMember = {
      id: Date.now(),
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      role: nextRole,
      access: nextRole === 'Secretary' ? 'Calendar + Clients' : form.access,
      city: form.city.trim() || 'Rabat',
      specialty: nextRole === 'Doctor' ? form.specialty.trim() || 'General Medicine' : '',
      ownerDoctorEmail,
      ownerDoctorName,
      mustResetCredentials: true,
      subscriptionStatus: nextRole === 'Doctor' ? 'Trial' : 'Active',
      subscriptionPlan: nextRole === 'Doctor' ? 'Growth' : 'Starter',
      tokenUsageMonthly: 0,
      tokenLimitMonthly: 5000000,
      ...passwordRecord,
    };

    setTeam((prev) => [...prev.filter((member) => member.email !== nextMember.email), nextMember]);
    setForm({ name: '', email: '', password: '', role: 'Secretary', access: 'Calendar + Clients', city: '', specialty: '' });
    setIsModalOpen(false);
  };

  const getMemberLogs = (member: TeamMember) => {
    return logs.filter((log) => log.memberEmail?.toLowerCase() === member.email.toLowerCase());
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-950 dark:text-white">{copy.title}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-500 dark:text-slate-400">{copy.subtitle}</p>
        </div>
        {(isAdmin || isDoctor) && (
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-2xl bg-[#12695b] px-4 py-3 text-sm font-bold text-white"
          >
            <UserPlus className="h-4 w-4" />
            {isDoctor ? copy.addSecretary : copy.add}
          </button>
        )}
      </div>

      {isAdmin ? (
        <div className="grid gap-3 md:grid-cols-3">
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="premium-subtle rounded-2xl px-4 py-3 text-sm text-slate-700 dark:text-slate-200">
            <option value="All">{copy.role}: {copy.all}</option>
            <option value="Doctor">{copy.doctor}</option>
            <option value="Secretary">{copy.secretary}</option>
          </select>
          <select value={cityFilter} onChange={(e) => setCityFilter(e.target.value)} className="premium-subtle rounded-2xl px-4 py-3 text-sm text-slate-700 dark:text-slate-200">
            <option value="All">{copy.city}: {copy.all}</option>
            {cities.map((city) => <option key={city} value={city}>{city}</option>)}
          </select>
          <select value={subscriptionFilter} onChange={(e) => setSubscriptionFilter(e.target.value)} className="premium-subtle rounded-2xl px-4 py-3 text-sm text-slate-700 dark:text-slate-200">
            <option value="All">{copy.subscription}: {copy.all}</option>
            <option value="Active">{copy.active}</option>
            <option value="Trial">{copy.trial}</option>
            <option value="Past Due">{copy.pastDue}</option>
            <option value="Cancelled">{copy.cancelled}</option>
          </select>
        </div>
      ) : null}

      <div className="grid gap-5 xl:grid-cols-2">
        {filteredTeam.map((member) => {
          const employees = member.role === 'Doctor' ? getDoctorEmployees(team, member.email) : [];
          const expanded = expandedDoctorEmail === member.email;

          return (
            <motion.div key={member.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="premium-panel rounded-[30px] p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xl font-black text-slate-950 dark:text-white">
                    {member.role === 'Doctor' ? <Stethoscope className="h-5 w-5 text-[#12695b]" /> : <UserCog className="h-5 w-5 text-[#12695b]" />}
                    {member.name}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-3 text-sm text-slate-500 dark:text-slate-400">
                    <span className="inline-flex items-center gap-1"><Mail className="h-4 w-4" /> {member.email}</span>
                    <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" /> {member.city || '-'}</span>
                    <span className="inline-flex items-center gap-1"><Shield className="h-4 w-4" /> {member.subscriptionStatus || '-'}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedMember(member)}
                  className="rounded-full bg-[#eff8f5] px-4 py-2 text-xs font-bold text-[#12695b] dark:bg-[#9fe7d4]/12 dark:text-[#9fe7d4]"
                >
                  {copy.viewLog}
                </button>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-[22px] border border-slate-200 px-4 py-4 dark:border-white/10">
                  <div className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">{copy.role}</div>
                  <div className="mt-2 text-sm font-semibold text-slate-950 dark:text-white">{member.role === 'Doctor' ? copy.doctor : copy.secretary}</div>
                </div>
                {isAdmin ? (
                  <div className="rounded-[22px] border border-slate-200 px-4 py-4 dark:border-white/10">
                    <div className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">{copy.subscription}</div>
                    <div className="mt-2 text-sm font-semibold text-slate-950 dark:text-white">{member.subscriptionStatus || '-'}</div>
                  </div>
                ) : (
                  <div className="rounded-[22px] border border-slate-200 px-4 py-4 dark:border-white/10">
                    <div className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">{copy.city}</div>
                    <div className="mt-2 text-sm font-semibold text-slate-950 dark:text-white">{member.city || '-'}</div>
                  </div>
                )}
              </div>

              {member.role === 'Doctor' ? (
                <div className="mt-5">
                  <button
                    type="button"
                    onClick={() => setExpandedDoctorEmail((prev) => (prev === member.email ? '' : member.email))}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 dark:border-white/10 dark:text-slate-200"
                  >
                    <Users className="h-4 w-4" />
                    {expanded ? copy.hideEmployees : copy.viewEmployees}
                  </button>

                  {expanded ? (
                    <div className="mt-4 space-y-3">
                      {employees.length ? employees.map((employee) => (
                        <div key={employee.id} className="rounded-[22px] bg-slate-50 px-4 py-4 text-sm dark:bg-white/5">
                          <div className="font-bold text-slate-950 dark:text-white">{employee.name}</div>
                          <div className="mt-1 text-slate-500 dark:text-slate-400">{employee.email}</div>
                        </div>
                      )) : <div className="text-sm text-slate-500 dark:text-slate-400">{copy.noEmployees}</div>}
                    </div>
                  ) : null}
                </div>
              ) : null}

              {member.isArchived ? (
                <div className="mt-5 rounded-[22px] border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200">
                  {copy.archived}: {member.archivedReason || '-'}
                </div>
              ) : null}
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {isModalOpen ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }} className="w-full max-w-lg rounded-[30px] bg-white p-6 shadow-2xl dark:bg-[#0d1726]">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black text-slate-950 dark:text-white">{copy.formTitle}</h3>
                <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-full p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleCreate} className="mt-6 space-y-4">
                <input value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} placeholder={copy.fullName} className="premium-input w-full rounded-2xl px-4 py-3" required />
                <input value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} placeholder={copy.email} type="email" className="premium-input w-full rounded-2xl px-4 py-3" required />
                <input value={form.password} onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))} placeholder={copy.tempPassword} type="password" className="premium-input w-full rounded-2xl px-4 py-3" required />
                <input value={form.city} onChange={(e) => setForm((prev) => ({ ...prev, city: e.target.value }))} placeholder={copy.city} className="premium-input w-full rounded-2xl px-4 py-3" required />
                {!isDoctor ? (
                  <select value={form.role} onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value as TeamRole }))} className="premium-input w-full rounded-2xl px-4 py-3">
                    <option value="Secretary">{copy.secretary}</option>
                    <option value="Doctor">{copy.doctor}</option>
                  </select>
                ) : null}
                {form.role === 'Doctor' && !isDoctor ? (
                  <input value={form.specialty} onChange={(e) => setForm((prev) => ({ ...prev, specialty: e.target.value }))} placeholder={copy.specialty} className="premium-input w-full rounded-2xl px-4 py-3" />
                ) : null}
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 font-bold text-slate-700 dark:border-white/10 dark:text-slate-200">
                    {copy.cancel}
                  </button>
                  <button type="submit" className="flex-1 rounded-2xl bg-[#12695b] px-4 py-3 font-bold text-white">
                    {copy.save}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {selectedMember ? (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }} className="w-full max-w-3xl rounded-[30px] bg-white p-6 shadow-2xl dark:bg-[#0d1726]">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-black text-slate-950 dark:text-white">{copy.clearLogs}</h3>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{selectedMember.name}</p>
                </div>
                <button type="button" onClick={() => setSelectedMember(null)} className="rounded-full p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-6 space-y-3">
                {getMemberLogs(selectedMember).length ? getMemberLogs(selectedMember).map((log) => (
                  <div key={log.id} className="rounded-[24px] border border-slate-200 px-4 py-4 dark:border-white/10">
                    <div className="flex items-start gap-3">
                      <Activity className="mt-0.5 h-4 w-4 text-[#12695b]" />
                      <div>
                        <div className="text-sm font-semibold text-slate-950 dark:text-white">{formatLog(log, locale)}</div>
                        <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{log.date} • {log.time}</div>
                      </div>
                    </div>
                  </div>
                )) : <div className="text-sm text-slate-500 dark:text-slate-400">{copy.noLogs}</div>}
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
