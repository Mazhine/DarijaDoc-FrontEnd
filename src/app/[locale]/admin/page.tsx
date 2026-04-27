/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  Calendar,
  CalendarDays,
  Globe,
  LayoutDashboard,
  LogOut,
  Moon,
  Plus,
  ShieldAlert,
  Sun,
  UserPlus,
  Users,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import DashboardTab from '@/src/components/admin/DashboardTab';
import ClientsTab from '@/src/components/admin/ClientsTab';
import CalendarTab from '@/src/components/admin/CalendarTab';
import TeamTab from '@/src/components/admin/TeamTab';
import { logAuditActivity } from '@/src/lib/audit';

const defaultTeam = [
  { id: 1, name: 'Admin Cabinet', email: 'admin@darijadoc.com', password: '123', role: 'Admin', access: 'Full Access' },
  { id: 2, name: 'Dr. Amine Alami', email: 'amine@darijadoc.com', password: '123', role: 'Doctor', access: 'Full Access' },
  { id: 3, name: 'Sara', email: 'sara@darijadoc.com', password: '123', role: 'Secretary', access: 'Calendar + Clients' },
  { id: 4, name: 'Khalid', email: 'khalid@darijadoc.com', password: '123', role: 'Secretary', access: 'Calendar Only' },
];

const UI = {
  en: {
    tabs: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'clients', label: 'Patients', icon: Users },
      { id: 'calendar', label: 'Calendar', icon: CalendarDays },
      { id: 'team', label: 'Team & Access', icon: ShieldAlert },
    ],
    login: {
      title: 'AdminHub Access',
      subtitle: 'Sign in to manage your clinic',
      email: 'Email / Account',
      password: 'Password',
      button: 'Connect',
    },
    sidebar: { theme: 'Theme', logout: 'Sign Out' },
    topbar: {
      addAppt: 'Add Appointment',
      addPatient: 'Add Patient',
      schedule: 'Manage Schedule',
    },
  },
  fr: {
    tabs: [
      { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
      { id: 'clients', label: 'Patients', icon: Users },
      { id: 'calendar', label: 'Calendrier', icon: CalendarDays },
      { id: 'team', label: 'Equipe & acces', icon: ShieldAlert },
    ],
    login: {
      title: 'Acces AdminHub',
      subtitle: 'Connectez-vous pour gerer votre clinique',
      email: 'E-mail / Compte',
      password: 'Mot de passe',
      button: 'Se connecter',
    },
    sidebar: { theme: 'Theme', logout: 'Deconnexion' },
    topbar: {
      addAppt: 'Nouveau RDV',
      addPatient: 'Nouveau patient',
      schedule: 'Gerer l agenda',
    },
  },
  ar: {
    tabs: [
      { id: 'dashboard', label: 'لوحة القيادة', icon: LayoutDashboard },
      { id: 'clients', label: 'المرضى', icon: Users },
      { id: 'calendar', label: 'التقويم', icon: CalendarDays },
      { id: 'team', label: 'الفريق والصلاحيات', icon: ShieldAlert },
    ],
    login: {
      title: 'دخول الإدارة',
      subtitle: 'سجل الدخول لإدارة العيادة',
      email: 'البريد الإلكتروني / الحساب',
      password: 'كلمة المرور',
      button: 'دخول',
    },
    sidebar: { theme: 'المظهر', logout: 'تسجيل خروج' },
    topbar: {
      addAppt: 'موعد جديد',
      addPatient: 'مريض جديد',
      schedule: 'إدارة الجدول',
    },
  },
} as const;

export default function AdminDashboard() {
  const pathname = usePathname();
  const locale = (pathname?.split('/')[1] || 'en') as keyof typeof UI;
  const copy = UI[locale] || UI.en;
  const isRtl = locale === 'ar';
  const isClient = typeof window !== 'undefined';
  const [isDark, setIsDark] = useState(true);
  const [activeTab, setActiveTab] = useState(() => (isClient ? sessionStorage.getItem('adminTab') || 'dashboard' : 'dashboard'));
  const [isAuthenticated, setIsAuthenticated] = useState(() => (isClient ? sessionStorage.getItem('adminAuth') === 'true' : false));
  const [email, setEmail] = useState(() => (isClient ? sessionStorage.getItem('adminEmail') || '' : ''));
  const [password, setPassword] = useState('');
  const [userRole, setUserRole] = useState(() => (isClient ? sessionStorage.getItem('adminRole') || 'Admin' : 'Admin'));
  const [userAccess, setUserAccess] = useState(() => (isClient ? sessionStorage.getItem('adminAccess') || 'Full Access' : 'Full Access'));

  useEffect(() => {
    document.documentElement.classList.add('dark');
    const existingTeam = localStorage.getItem('clinicTeam');
    if (!existingTeam) {
      localStorage.setItem('clinicTeam', JSON.stringify(defaultTeam));
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem('adminTab', activeTab);
  }, [activeTab]);

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
    setIsDark((prev) => !prev);
  };

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();

    const savedTeam = JSON.parse(localStorage.getItem('clinicTeam') || '[]');
    const user = savedTeam.find(
      (member: any) =>
        member.email?.toLowerCase() === email.toLowerCase() &&
        member.password === password
    );

    if (!user) {
      return;
    }

    const nextRole = user.role;
    const nextAccess = user.access;
    const nextName = user.name;
    let nextTab = 'dashboard';

    if (user.role === 'Secretary') {
      nextTab = 'calendar';
    } else if (user.role === 'Doctor' && user.access !== 'Full Access') {
      nextTab = 'clients';
    } else if (user.role === 'Doctor') {
      nextTab = 'dashboard';
    } else if (user.role === 'Admin') {
      nextTab = 'team';
    }

    setUserRole(nextRole);
    setUserAccess(nextAccess);
    setActiveTab(nextTab);
    setIsAuthenticated(true);

    sessionStorage.setItem('adminAuth', 'true');
    sessionStorage.setItem('adminEmail', email);
    sessionStorage.setItem('adminRole', nextRole);
    sessionStorage.setItem('adminAccess', nextAccess);
    sessionStorage.setItem('adminName', nextName);

    setTimeout(() => logAuditActivity('loggedIn', 'System', 'system'), 100);
  };

  const tabs =
    userRole === 'Admin'
      ? copy.tabs
      : userRole === 'Doctor'
        ? copy.tabs.filter((tab) => tab.id !== 'team')
        : userAccess === 'Calendar Only'
          ? copy.tabs.filter((tab) => tab.id === 'calendar')
          : copy.tabs.filter((tab) => tab.id === 'calendar' || tab.id === 'clients');

  const visibleActiveTab =
    userRole !== 'Admin' && activeTab === 'team'
      ? userRole === 'Secretary'
        ? 'calendar'
        : 'dashboard'
      : activeTab;

  const renderContent = () => {
    switch (visibleActiveTab) {
      case 'clients':
        return <ClientsTab />;
      case 'calendar':
        return <CalendarTab />;
      case 'team':
        return userRole === 'Admin' ? <TeamTab /> : <DashboardTab />;
      default:
        return <DashboardTab />;
    }
  };

  if (!isClient) {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <div className={`page-shell min-h-screen flex items-center justify-center p-4 ${isRtl ? 'text-right' : 'text-left'}`} dir={isRtl ? 'rtl' : 'ltr'}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="neo-panel w-full max-w-md rounded-[2rem] p-8"
        >
          <div className="mb-8 flex flex-col items-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#9fe7d4]/10 text-[#9fe7d4]">
              <LayoutDashboard className="h-8 w-8" />
            </div>
            <h1 className="text-2xl font-bold text-white">{copy.login.title}</h1>
            <p className="mt-2 text-sm text-slate-400">{copy.login.subtitle}</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">{copy.login.email}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-[#9fe7d4]/40"
                placeholder="admin@example.com"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">{copy.login.password}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-[#9fe7d4]/40"
                placeholder="••••••••"
              />
            </div>
            <button type="submit" className="w-full rounded-xl bg-[#9fe7d4] px-4 py-3 font-bold text-slate-950 transition hover:bg-[#7ee7cf]">
              {copy.login.button}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`page-shell flex min-h-screen w-full ${isRtl ? 'text-right' : 'text-left'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      <aside className={`hidden w-64 flex-col border-white/10 bg-[#08111d]/88 md:flex ${isRtl ? 'border-l' : 'border-r'}`}>
        <div className="border-b border-white/10 p-6">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 text-xl font-bold text-[#9fe7d4]">
              <LayoutDashboard className="h-6 w-6" />
              <span>AdminHub</span>
            </div>
            <div className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-400">{userRole}</div>
          </div>
        </div>

        <div className="flex-1 space-y-2 px-4 py-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 transition ${
                  isActive
                    ? 'bg-[#9fe7d4]/12 font-medium text-[#9fe7d4]'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="h-5 w-5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="space-y-2 border-t border-white/10 p-4">
          <div className="mb-2 flex gap-2">
            <button
              onClick={toggleTheme}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white/5 p-2.5 text-slate-300 transition hover:bg-white/10 hover:text-white"
              title={copy.sidebar.theme}
            >
              {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              <span className="text-xs font-semibold">{copy.sidebar.theme}</span>
            </button>
            <div className="relative flex flex-1 items-center rounded-xl bg-white/5 px-2">
              <Globe className="absolute left-2 h-4 w-4 text-slate-400" />
              <select
                value={locale}
                onChange={(e) => {
                  const nextLocale = e.target.value;
                  const nextPath = pathname ? pathname.replace(`/${locale}`, `/${nextLocale}`) : `/${nextLocale}/admin`;
                  window.location.href = nextPath;
                }}
                className="w-full appearance-none bg-transparent py-2.5 pl-6 pr-2 text-xs font-semibold text-slate-300 outline-none"
              >
                <option value="en">English</option>
                <option value="fr">Francais</option>
                <option value="ar">العربية</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => {
              setIsAuthenticated(false);
              sessionStorage.removeItem('adminAuth');
              sessionStorage.removeItem('adminRole');
              sessionStorage.removeItem('adminAccess');
            }}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-red-400 transition hover:bg-red-500/10"
          >
            <LogOut className="h-5 w-5" />
            {copy.sidebar.logout}
          </button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="hidden h-20 shrink-0 items-center justify-end gap-2 border-b border-white/10 px-4 sm:px-8 md:flex">
          <button
            onClick={() => {
              setActiveTab('calendar');
              setTimeout(() => window.dispatchEvent(new Event('openApptModal')), 100);
            }}
            className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#9fe7d4] px-4 py-2 text-sm font-semibold text-slate-950"
          >
            <Plus className="h-4 w-4" /> <span>{copy.topbar.addAppt}</span>
          </button>
          {userRole !== 'Secretary' ? (
            <button
              onClick={() => {
                setActiveTab('clients');
                setTimeout(() => window.dispatchEvent(new Event('openClientModal')), 100);
              }}
              className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200"
            >
              <UserPlus className="h-4 w-4" /> <span>{copy.topbar.addPatient}</span>
            </button>
          ) : null}
          <button
            onClick={() => setActiveTab('calendar')}
            className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200"
          >
            <Calendar className="h-4 w-4" /> <span>{copy.topbar.schedule}</span>
          </button>
        </div>

        <div className="border-b border-white/10 bg-[#08111d]/88 p-4 md:hidden">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 font-bold text-white">
              <LayoutDashboard className="h-5 w-5 text-[#9fe7d4]" /> AdminHub
            </div>
            <div className="flex items-center gap-2">
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                className="rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-xs font-semibold text-slate-200 outline-none"
              >
                {tabs.map((tab) => (
                  <option key={tab.id} value={tab.id}>
                    {tab.label}
                  </option>
                ))}
              </select>
              <button
                onClick={() => {
                  setActiveTab('calendar');
                  setTimeout(() => window.dispatchEvent(new Event('openApptModal')), 100);
                }}
                className="rounded-lg bg-[#9fe7d4] p-2 text-slate-950"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
