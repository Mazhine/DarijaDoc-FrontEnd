/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  Activity,
  Clock,
  Lock,
  Mail,
  MoreHorizontal,
  Settings,
  Shield,
  Stethoscope,
  UserCog,
  UserPlus,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getSeededTeam, getVisibleTeamForUser, saveTeam, type TeamAccess, type TeamMember, type TeamRole } from '@/src/lib/team';

const TEAM_T: Record<string, any> = {
  en: {
    title: 'Role Management',
    subtitle: 'Doctors can follow their own team, while admin keeps global access.',
    newStaff: 'Add team member',
    doctorCta: 'Add secretary',
    onboarding: 'This account will be asked to choose a final email and password on first sign in.',
    viewActivity: 'View Activity',
    removeUser: 'Remove User',
    accountRole: 'Account Role',
    privileges: 'Privileges',
    createProfile: 'Create Team Profile',
    createSub: 'Create a new account and assign access securely.',
    fullName: 'Full Name',
    email: 'Email Address',
    tempPass: 'Temporary Password',
    cancel: 'Cancel',
    saveProfile: 'Save Profile',
    auditLog: 'Team Audit Log',
    activityTrace: 'Activity trace for',
    target: 'Target:',
    last24h: 'Showing the latest trace items for this team member.',
    noRecentActivity: 'No recent activity.',
    roles: { Admin: 'Admin', Doctor: 'Doctor', Secretary: 'Secretary' },
    accessTrans: {
      'Full Access': 'FULL ACCESS',
      'Calendar + Clients': 'CALENDAR + CLIENTS',
      'Calendar Only': 'CALENDAR ONLY',
    },
    actions: {
      loggedIn: 'Logged In',
      createAppt: 'Created Appointment',
      addNotes: 'Added Patient Notes',
      regPatient: 'Registered New Patient',
      markUnavail: 'Marked Unavailable',
      reschedule: 'Rescheduled Consultation',
      deleteAppt: 'Deleted Appointment',
      updatePatient: 'Updated Patient Profile',
      deletePatient: 'Deleted Patient',
    },
  },
  fr: {
    title: 'Gestion des roles',
    subtitle: 'Le medecin suit son equipe, et l admin garde une vue globale.',
    newStaff: 'Ajouter un membre',
    doctorCta: 'Ajouter une secretaire',
    onboarding: 'Ce compte devra choisir son e-mail et son mot de passe definitifs a la premiere connexion.',
    viewActivity: "Voir l'activite",
    removeUser: "Supprimer l'utilisateur",
    accountRole: 'Role du compte',
    privileges: 'Privileges',
    createProfile: "Creer un compte d'equipe",
    createSub: 'Creez un nouveau compte et attribuez les bons acces.',
    fullName: 'Nom complet',
    email: 'Adresse e-mail',
    tempPass: 'Mot de passe temporaire',
    cancel: 'Annuler',
    saveProfile: 'Enregistrer',
    auditLog: "Journal d'activite",
    activityTrace: "Trace d'activite pour",
    target: 'Cible :',
    last24h: 'Affichage des derniers evenements de ce membre.',
    noRecentActivity: 'Aucune activite recente.',
    roles: { Admin: 'Admin', Doctor: 'Medecin', Secretary: 'Secretaire' },
    accessTrans: {
      'Full Access': 'ACCES TOTAL',
      'Calendar + Clients': 'AGENDA + PATIENTS',
      'Calendar Only': 'AGENDA UNIQUEMENT',
    },
    actions: {
      loggedIn: 'Connecte',
      createAppt: 'Rendez-vous cree',
      addNotes: 'Notes ajoutees',
      regPatient: 'Nouveau patient enregistre',
      markUnavail: 'Indisponibilite marquee',
      reschedule: 'Consultation reprogrammee',
      deleteAppt: 'Rendez-vous supprime',
      updatePatient: 'Profil patient mis a jour',
      deletePatient: 'Patient supprime',
    },
  },
  ar: {
    title: 'إدارة الأدوار',
    subtitle: 'يستطيع الطبيب متابعة فريقه بينما يحتفظ الأدمن برؤية شاملة.',
    newStaff: 'إضافة عضو',
    doctorCta: 'إضافة سكرتارية',
    onboarding: 'سيُطلب من هذا الحساب اختيار بريد إلكتروني وكلمة مرور نهائيين عند أول دخول.',
    viewActivity: 'عرض النشاط',
    removeUser: 'حذف المستخدم',
    accountRole: 'دور الحساب',
    privileges: 'الصلاحيات',
    createProfile: 'إنشاء حساب للفريق',
    createSub: 'أنشئ حساباً جديداً وحدد صلاحياته بوضوح.',
    fullName: 'الاسم الكامل',
    email: 'البريد الإلكتروني',
    tempPass: 'كلمة مرور مؤقتة',
    cancel: 'إلغاء',
    saveProfile: 'حفظ',
    auditLog: 'سجل نشاط الفريق',
    activityTrace: 'سجل نشاط',
    target: 'الهدف:',
    last24h: 'يتم عرض آخر الأنشطة الخاصة بهذا العضو.',
    noRecentActivity: 'لا توجد أنشطة حديثة.',
    roles: { Admin: 'إدارة', Doctor: 'طبيب', Secretary: 'سكرتارية' },
    accessTrans: {
      'Full Access': 'وصول كامل',
      'Calendar + Clients': 'تقويم + مرضى',
      'Calendar Only': 'تقويم فقط',
    },
    actions: {
      loggedIn: 'سجّل الدخول',
      createAppt: 'أنشأ موعداً',
      addNotes: 'أضاف ملاحظات',
      regPatient: 'سجّل مريضاً جديداً',
      markUnavail: 'حدد وقتاً غير متاح',
      reschedule: 'أعاد جدولة الموعد',
      deleteAppt: 'حذف موعداً',
      updatePatient: 'حدّث ملف المريض',
      deletePatient: 'حذف مريضاً',
    },
  },
};

function addedRoleIsSecretary(isDoctor: boolean, role: TeamRole) {
  return isDoctor || role === 'Secretary';
}

export default function TeamTab() {
  const pathname = usePathname();
  const currentLocale = pathname?.split('/')[1] || 'en';
  const t = TEAM_T[currentLocale] || TEAM_T.en;
  const currentRole = typeof window !== 'undefined' ? sessionStorage.getItem('adminRole') || 'Admin' : 'Admin';
  const currentEmail = typeof window !== 'undefined' ? sessionStorage.getItem('adminEmail') || '' : '';
  const currentName = typeof window !== 'undefined' ? sessionStorage.getItem('adminName') || '' : '';
  const isAdmin = currentRole === 'Admin';
  const isDoctor = currentRole === 'Doctor';

  const [team, setTeam] = useState<TeamMember[]>(() => getSeededTeam());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activityModalOpen, setActivityModalOpen] = useState<number | null>(null);
  const [newUser, setNewUser] = useState<{
    name: string;
    email: string;
    password: string;
    role: TeamRole;
    access: TeamAccess;
  }>({ name: '', email: '', password: '', role: 'Secretary', access: 'Calendar + Clients' });
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  useEffect(() => {
    saveTeam(team);
  }, [team]);

  useEffect(() => {
    const fetchLogs = () => {
      try {
        const logs = JSON.parse(localStorage.getItem('clinicAuditLogs') || '[]');
        setAuditLogs(logs);
      } catch {}
    };

    fetchLogs();
    window.addEventListener('auditLogUpdated', fetchLogs);
    return () => window.removeEventListener('auditLogUpdated', fetchLogs);
  }, []);

  const visibleTeam = useMemo(() => getVisibleTeamForUser(team, currentRole, currentEmail), [currentEmail, currentRole, team]);

  const getMemberLogs = (member: TeamMember) => {
    return auditLogs.filter((log: any) => {
      if (currentRole === 'Admin') {
        return log.memberName === member.name;
      }

      return (
        log.ownerDoctorEmail?.toLowerCase() === currentEmail.toLowerCase() &&
        log.memberName === member.name
      );
    });
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email || !newUser.password) return;

    const ownerDoctorEmail = isDoctor ? currentEmail : newUser.role === 'Secretary' ? currentEmail : undefined;
    const ownerDoctorName = isDoctor ? currentName : newUser.role === 'Secretary' ? currentName : undefined;

    const addedMember: TeamMember = {
      id: Date.now(),
      name: newUser.name,
      email: newUser.email.trim().toLowerCase(),
      password: newUser.password,
      role: isDoctor ? 'Secretary' : newUser.role,
      access: addedRoleIsSecretary(isDoctor, newUser.role) ? 'Calendar + Clients' : newUser.access,
      ownerDoctorEmail,
      ownerDoctorName,
      mustResetCredentials: isDoctor,
      subscriptionStatus: newUser.role === 'Doctor' ? 'Trial' : 'Active',
    };

    const teamWithoutSameEmail = team.filter((member) => member.email.toLowerCase() !== addedMember.email.toLowerCase());
    setTeam([...teamWithoutSameEmail, addedMember]);
    setIsModalOpen(false);
    setNewUser({ name: '', email: '', password: '', role: 'Secretary', access: 'Calendar + Clients' });
  };

  const handleDelete = (id: number) => {
    setTeam(team.filter((member) => member.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-950 dark:text-white">{t.title}</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t.subtitle}</p>
        </div>

        {isAdmin || isDoctor ? (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-[#12695b] px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#0f5a4e]"
          >
            <UserPlus className="h-4 w-4" />
            {isDoctor ? t.doctorCta : t.newStaff}
          </button>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {visibleTeam.map((member, idx) => (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: idx * 0.05 }}
              key={`${member.id}-${member.email}`}
              onClick={() => setActivityModalOpen(member.id)}
              className={`group relative cursor-pointer overflow-hidden rounded-[28px] border bg-white p-6 shadow-[0_18px_40px_-32px_rgba(15,23,42,0.16)] transition-all hover:border-emerald-300 hover:shadow-md dark:bg-[#0d1726] dark:hover:border-emerald-700 ${
                member.role === 'Doctor' ? 'border-emerald-200 dark:border-emerald-800' : 'border-slate-200 dark:border-white/10'
              }`}
            >
              {(isAdmin || isDoctor) && member.role !== 'Admin' && member.email.toLowerCase() !== currentEmail.toLowerCase() ? (
                <div className="group/menu absolute right-4 top-4">
                  <button
                    type="button"
                    className="rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white"
                  >
                    <MoreHorizontal className="h-5 w-5" />
                  </button>
                  <div className="absolute right-0 top-full z-10 mt-1 hidden w-44 overflow-hidden rounded-lg border border-gray-100 bg-white shadow-xl group-hover/menu:block dark:border-gray-700 dark:bg-gray-800">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActivityModalOpen(member.id);
                      }}
                      className="flex w-full items-center gap-2 border-b border-gray-100 px-4 py-2.5 text-left text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700/50 dark:text-gray-200 dark:hover:bg-gray-700"
                    >
                      <Activity className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      {t.viewActivity}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(member.id);
                      }}
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                    >
                      <X className="h-4 w-4" />
                      {t.removeUser}
                    </button>
                  </div>
                </div>
              ) : null}

              <div className="mb-4 mt-[-1.5rem] flex items-center gap-4 pt-6">
                <div className={`flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold ${member.role === 'Doctor' ? 'bg-[#12695b] text-white shadow-lg shadow-emerald-900/20' : 'bg-[#eff8f5] text-[#12695b] dark:bg-gray-800 dark:text-gray-200'}`}>
                  {member.name.charAt(0)}
                </div>
                <div>
                  <h3 className="flex items-center gap-1.5 font-semibold text-gray-900 dark:text-white">
                    {member.name}
                    {member.role === 'Doctor' ? <Stethoscope className="h-3.5 w-3.5 text-[#12695b]" /> : null}
                    {member.role === 'Secretary' ? <UserCog className="h-3.5 w-3.5 text-gray-500" /> : null}
                  </h3>
                  <span className="mt-0.5 flex items-center gap-1 text-xs text-gray-500">
                    <Mail className="h-3 w-3" /> {member.email}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2 space-y-3 border-t border-gray-100 pt-4 dark:border-gray-800">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1.5 text-gray-500">
                    <Settings className="h-4 w-4 text-gray-400" /> {t.accountRole}
                  </span>
                  <span className={`font-bold ${member.role === 'Doctor' ? 'text-[#12695b] dark:text-emerald-400' : 'text-gray-700 dark:text-gray-300'}`}>
                    {t.roles[member.role] || member.role}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1.5 text-gray-500">
                    <Shield className="h-4 w-4 text-gray-400" /> {t.privileges}
                  </span>
                  <span className="rounded border border-green-200 bg-green-50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-green-700 shadow-sm dark:border-green-800 dark:bg-green-900/30 dark:text-green-400">
                    {t.accessTrans[member.access] || member.access}
                  </span>
                </div>

                {member.role === 'Secretary' && member.ownerDoctorName ? (
                  <div className="rounded-2xl bg-[#f6fbf8] px-3 py-2 text-xs text-slate-600 dark:bg-white/5 dark:text-slate-300">
                    {member.ownerDoctorName}
                  </div>
                ) : null}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isModalOpen ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex max-h-[88vh] w-full max-w-md flex-col overflow-hidden rounded-[30px] border border-slate-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-[#0d1726]"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t.createProfile}</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <p className="mb-3 text-sm text-gray-500">{t.createSub}</p>
              {isDoctor ? <p className="mb-6 rounded-2xl bg-[#eff8f5] px-4 py-3 text-sm text-[#12695b] dark:bg-[#9fe7d4]/12 dark:text-[#9fe7d4]">{t.onboarding}</p> : null}

              <form onSubmit={handleCreateUser} className="mb-6 space-y-4 overflow-y-auto pr-1">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">{t.fullName}</label>
                  <input
                    type="text"
                    required
                    placeholder={isDoctor ? 'Sara Benali' : 'Youssef Fassi'}
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2 outline-none transition-all focus:ring-2 focus:ring-[#12695b] dark:border-white/10 dark:bg-[#08111d] dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">{t.email}</label>
                  <input
                    type="email"
                    required
                    placeholder={isDoctor ? 'secretaire@cabinet.ma' : 'user@clinic.com'}
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2 outline-none transition-all focus:ring-2 focus:ring-[#12695b] dark:border-white/10 dark:bg-[#08111d] dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">{t.tempPass}</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={newUser.password}
                      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-4 outline-none transition-all focus:ring-2 focus:ring-[#12695b] dark:border-white/10 dark:bg-[#08111d] dark:text-white"
                    />
                  </div>
                </div>

                <div className={`grid gap-3 ${isDoctor ? 'grid-cols-1' : 'grid-cols-2'}`}>
                  {!isDoctor ? (
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">{t.accountRole}</label>
                      <select
                        value={newUser.role}
                        onChange={(e) => setNewUser({ ...newUser, role: e.target.value as TeamRole })}
                        className="w-full cursor-pointer appearance-none rounded-xl border border-slate-200 px-3 py-2 outline-none focus:ring-2 focus:ring-[#12695b] dark:border-white/10 dark:bg-[#08111d] dark:text-white"
                      >
                        <option value="Secretary">{t.roles.Secretary}</option>
                        <option value="Doctor">{t.roles.Doctor}</option>
                        <option value="Admin">{t.roles.Admin}</option>
                      </select>
                    </div>
                  ) : null}

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">{t.privileges}</label>
                    <select
                      value={newUser.access}
                      onChange={(e) => setNewUser({ ...newUser, access: e.target.value as TeamAccess })}
                      className="w-full cursor-pointer appearance-none rounded-xl border border-slate-200 px-3 py-2 outline-none focus:ring-2 focus:ring-[#12695b] dark:border-white/10 dark:bg-[#08111d] dark:text-white"
                      disabled={isDoctor || newUser.role === 'Secretary'}
                    >
                      <option value="Calendar + Clients">{t.accessTrans["Calendar + Clients"]}</option>
                      <option value="Full Access">{t.accessTrans["Full Access"]}</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4 flex justify-end gap-3 border-t border-gray-100 pt-4 dark:border-gray-800">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="rounded-xl px-4 py-2 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    {t.cancel}
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-[#12695b] px-4 py-2 text-sm font-semibold text-white shadow-md shadow-emerald-900/20 transition-colors hover:bg-[#0f5a4e]"
                  >
                    {t.saveProfile}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {activityModalOpen !== null ? (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            {visibleTeam
              .filter((m) => m.id === activityModalOpen)
              .map((member) => (
                <motion.div
                  key={`${member.id}-${member.email}-modal`}
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  className="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#0d1726]"
                >
                  <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-900">
                    <div>
                      <h3 className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
                        <Activity className="h-5 w-5 text-[#12695b]" /> {t.auditLog}
                      </h3>
                      <p className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                        {t.activityTrace} <span className="font-bold text-gray-700 dark:text-gray-300">{member.name}</span> ({t.roles[member.role] || member.role})
                      </p>
                    </div>
                    <button
                      onClick={() => setActivityModalOpen(null)}
                      className="rounded-full bg-white p-2 text-gray-400 shadow-sm transition-colors hover:text-gray-600 dark:bg-gray-800 dark:hover:text-white"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="overflow-y-auto bg-white p-6 dark:bg-gray-900">
                    <div className="relative ml-3 space-y-8 border-l-2 border-gray-100 dark:border-gray-800">
                      {getMemberLogs(member).length > 0 ? (
                        getMemberLogs(member).map((log: any) => (
                          <div key={log.id} className="relative pl-6">
                            <div
                              className={`absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 border-white dark:border-gray-900 ${
                                log.type === 'system' ? 'bg-amber-500' : log.type === 'calendar' ? 'bg-blue-500' : 'bg-emerald-500'
                              }`}
                            />

                            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                              <div>
                                <h4 className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white">
                                  {t.actions[log.action] || log.action}
                                </h4>
                                <p className="mt-1 text-sm text-gray-500">
                                  {t.target} <span className="font-medium text-gray-700 dark:text-gray-300">{log.target}</span>
                                </p>
                              </div>
                              <div className="flex items-center gap-1.5 rounded-md border border-gray-100 bg-gray-50 px-2 py-1 text-xs font-mono text-gray-400 dark:border-gray-700 dark:bg-gray-800">
                                <Clock className="h-3.5 w-3.5" />
                                {log.date} at {log.time}
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="py-4 pl-6 text-sm italic text-slate-500 dark:text-slate-400">{t.noRecentActivity}</div>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-gray-100 bg-gray-50 p-4 text-center text-xs text-gray-400 dark:border-gray-800 dark:bg-gray-900">
                    {t.last24h}
                  </div>
                </motion.div>
              ))}
          </div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
