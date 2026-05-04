'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  CreditCard,
  Globe,
  LayoutDashboard,
  LogOut,
  Moon,
  Plus,
  ShieldAlert,
  Star,
  Sun,
  Users,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import DashboardTab from '@/src/components/admin/DashboardTab';
import ClientsTab from '@/src/components/admin/ClientsTab';
import CalendarTab from '@/src/components/admin/CalendarTab';
import TeamTab from '@/src/components/admin/TeamTab';
import ReviewsTab from '@/src/components/admin/ReviewsTab';
import DemosTab from '@/src/components/admin/DemosTab';
import SubscriptionsTab from '@/src/components/admin/SubscriptionsTab';
import LogsTab from '@/src/components/admin/LogsTab';
import { logAuditActivity } from '@/src/lib/audit';
import { clearClientSession, hasClientSession, setClientSession } from '@/src/lib/auth';
import { ensureTeamSecurity, getSeededTeam, type TeamMember, updateTeamMemberCredentials, verifyPassword } from '@/src/lib/team';

const UI = {
  en: {
    tabs: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'clients', label: 'Patients', icon: Users },
      { id: 'calendar', label: 'Calendar', icon: CalendarDays },
      { id: 'demos', label: 'Demos', icon: CalendarDays },
      { id: 'team', label: 'Team & Access', icon: ShieldAlert },
      { id: 'subscriptions', label: 'Subscriptions', icon: CreditCard },
      { id: 'logs', label: 'Logs', icon: CheckCircle2 },
      { id: 'reviews', label: 'Reviews & Feedback', icon: Star },
    ],
    login: {
      title: 'DarijaDoc Access',
      subtitle: 'Sign in to manage your clinic workspace',
      email: 'Email',
      password: 'Password',
      emailPlaceholder: 'Enter your email',
      passwordPlaceholder: 'Enter your password',
      button: 'Connect',
    },
    sidebar: { theme: 'Theme', logout: 'Sign Out', language: 'Language' },
    reset: {
      title: 'Complete your account setup',
      subtitle: 'Choose the final email and password this secretary account will use from now on.',
      email: 'New email',
      password: 'New password',
      button: 'Save and continue',
    },
  },
  fr: {
    tabs: [
      { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
      { id: 'clients', label: 'Patients', icon: Users },
      { id: 'calendar', label: 'Calendrier', icon: CalendarDays },
      { id: 'demos', label: 'Demos', icon: CalendarDays },
      { id: 'team', label: 'Equipe & acces', icon: ShieldAlert },
      { id: 'subscriptions', label: 'Abonnements', icon: CreditCard },
      { id: 'logs', label: 'Logs', icon: CheckCircle2 },
      { id: 'reviews', label: 'Avis & Retours', icon: Star },
    ],
    login: {
      title: 'Acces DarijaDoc',
      subtitle: 'Connectez-vous pour gerer votre espace clinique',
      email: 'E-mail',
      password: 'Mot de passe',
      emailPlaceholder: 'Inserez votre email',
      passwordPlaceholder: 'Inserez votre mot de passe',
      button: 'Se connecter',
    },
    sidebar: { theme: 'Theme', logout: 'Deconnexion', language: 'Langue' },
    reset: {
      title: 'Finaliser le compte',
      subtitle: 'Choisissez l email et le mot de passe definitifs de cette secretaire.',
      email: 'Nouvel e-mail',
      password: 'Nouveau mot de passe',
      button: 'Enregistrer et continuer',
    },
  },
  ar: {
    tabs: [
      { id: 'dashboard', label: 'لوحة القيادة', icon: LayoutDashboard },
      { id: 'clients', label: 'المرضى', icon: Users },
      { id: 'calendar', label: 'التقويم', icon: CalendarDays },
      { id: 'demos', label: 'العروض', icon: CalendarDays },
      { id: 'team', label: 'الفريق والصلاحيات', icon: ShieldAlert },
      { id: 'reviews', label: 'التقييمات والآراء', icon: Star },
    ],
    login: {
      title: 'دخول DarijaDoc',
      subtitle: 'سجل الدخول لإدارة مساحة العيادة',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      emailPlaceholder: 'أدخل بريدك الإلكتروني',
      passwordPlaceholder: 'أدخل كلمة المرور',
      button: 'دخول',
    },
    sidebar: { theme: 'المظهر', logout: 'تسجيل خروج', language: 'اللغة' },
    reset: {
      title: 'إكمال إعداد الحساب',
      subtitle: 'اختر البريد الإلكتروني وكلمة المرور النهائيين لهذا الحساب.',
      email: 'البريد الجديد',
      password: 'كلمة المرور الجديدة',
      button: 'حفظ ومتابعة',
    },
  },
} as const;

const languages = [
  { code: 'fr', label: 'Francais' },
  { code: 'ar', label: 'العربية' },
  { code: 'en', label: 'English' },
] as const;

function LocaleMenu({
  locale,
  label,
  pathname,
  compact = false,
}: {
  locale: string;
  label: string;
  pathname: string | null;
  compact?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`relative ${compact ? '' : 'flex-1'}`}
      onMouseEnter={() => !compact && setIsOpen(true)}
      onMouseLeave={() => !compact && setIsOpen(false)}
    >
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex w-full items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:text-white ${
          compact ? 'min-w-[132px] max-w-full' : ''
        }`}
      >
        <span className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-slate-400" />
          <span>{label}</span>
        </span>
        <span className="flex items-center gap-1 uppercase">
          {locale}
          <ChevronDown className={`h-4 w-4 transition ${isOpen ? 'rotate-180' : ''}`} />
        </span>
      </button>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className={`absolute top-full z-30 mt-2 overflow-hidden rounded-[1.35rem] border border-slate-200 bg-white p-1 shadow-xl dark:border-white/10 dark:bg-[#0d1726] ${
              compact ? 'left-0 right-auto w-full min-w-[132px] max-w-[min(16rem,calc(100vw-2rem))]' : 'right-0 min-w-full'
            }`}
          >
            <div>
              {languages.map((language) => (
                <button
                  key={language.code}
                  type="button"
                  onClick={() => {
                    const nextPath = pathname ? pathname.replace(/^\/(fr|en|ar)/, `/${language.code}`) : `/${language.code}/auth`;
                    window.location.assign(nextPath);
                  }}
                  className={`block w-full rounded-2xl px-3 py-2 text-left text-sm transition ${
                    locale === language.code
                      ? 'bg-[#eff8f5] font-semibold text-[#12695b] dark:bg-[#9fe7d4]/12 dark:text-[#9fe7d4]'
                      : 'text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-white/6'
                  }`}
                >
                  {language.label}
                </button>
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export default function AdminDashboard() {
  const pathname = usePathname();
  const router = useRouter();
  const locale = (pathname?.split('/')[1] || 'en') as keyof typeof UI;
  const copy = UI[locale] || UI.en;
  const isRtl = locale === 'ar';
  const backToSiteLabel = locale === 'fr' ? 'Retour au site' : locale === 'ar' ? 'العودة إلى الموقع' : 'Back to site';
  const credentialsLabel = locale === 'fr' ? 'Mes identifiants' : locale === 'ar' ? 'بيانات الدخول' : 'My credentials';
  const credentialsTitle = locale === 'fr' ? 'Modifier les identifiants' : locale === 'ar' ? 'تحديث بيانات الدخول' : 'Update sign-in details';
  const credentialsSubtitle =
    locale === 'fr'
      ? 'Choisissez l e-mail et le mot de passe utilises pour vos prochaines connexions.'
      : locale === 'ar'
        ? 'اختر البريد وكلمة المرور اللذين ستستخدمهما لاحقا.'
        : 'Choose the email and password you want to use from now on.';
  const hasWindow = typeof window !== 'undefined';
  const [isHydrated, setIsHydrated] = useState(false);
  const [isDark, setIsDark] = useState(() => (hasWindow ? localStorage.getItem('darijadoc-theme') === 'dark' : false));
  const [activeTab, setActiveTab] = useState(() => (hasWindow ? sessionStorage.getItem('adminTab') || 'dashboard' : 'dashboard'));
  const [isAuthenticated, setIsAuthenticated] = useState(() => (hasWindow ? hasClientSession() : false));
  const [email, setEmail] = useState(() => (hasWindow ? sessionStorage.getItem('adminEmail') || '' : ''));
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [userRole, setUserRole] = useState(() => (hasWindow ? sessionStorage.getItem('adminRole') || 'Admin' : 'Admin'));
  const [userAccess, setUserAccess] = useState(() => (hasWindow ? sessionStorage.getItem('adminAccess') || 'Full Access' : 'Full Access'));
  const [pendingResetUser, setPendingResetUser] = useState<TeamMember | null>(null);
  const [resetEmail, setResetEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [resetPassword, setResetPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetError, setResetError] = useState('');
  const [isCredentialsModalOpen, setIsCredentialsModalOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('darijadoc-theme');
    if (!savedTheme) {
      localStorage.setItem('darijadoc-theme', 'light');
    }

    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    ensureTeamSecurity();

    const frame = window.requestAnimationFrame(() => {
      setIsHydrated(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    sessionStorage.setItem('adminTab', activeTab);
  }, [activeTab, isHydrated]);

  useEffect(() => {
    if (isHydrated && isAuthenticated && pathname?.includes('/auth')) {
      router.replace(`/${locale}/admin`);
    }
  }, [isAuthenticated, isHydrated, locale, pathname, router]);

  useEffect(() => {
    const handleNavigate = (event: Event) => {
      const detail = (event as CustomEvent<{ tab?: string }>).detail;
      if (!detail?.tab) {
        return;
      }

      setActiveTab(detail.tab);
    };

    window.addEventListener('adminNavigate', handleNavigate);
    return () => window.removeEventListener('adminNavigate', handleNavigate);
  }, []);

  const toggleTheme = () => {
    const nextIsDark = !isDark;
    document.documentElement.classList.toggle('dark', nextIsDark);
    localStorage.setItem('darijadoc-theme', nextIsDark ? 'dark' : 'light');
    setIsDark(nextIsDark);
  };

  const completeAuthentication = (user: TeamMember, nextTab?: string) => {
    const ownerDoctorEmail = user.role === 'Secretary' ? user.ownerDoctorEmail || '' : user.email;
    const ownerDoctorName = user.role === 'Secretary' ? user.ownerDoctorName || user.name : user.name;
    const resolvedTab =
      nextTab ||
      (user.role === 'Secretary'
        ? 'calendar'
        : 'dashboard');

    setUserRole(user.role);
    setUserAccess(user.access);
    setActiveTab(resolvedTab);
    setIsAuthenticated(true);
    setEmail(user.email);

    setClientSession({
      email: user.email,
      role: user.role,
      access: user.access,
      name: user.name,
      ownerDoctorEmail,
      ownerDoctorName,
    });
    if (pathname?.includes('/auth')) {
      router.replace(`/${locale}/admin`);
    }

    setTimeout(() => logAuditActivity('loggedIn', 'System', 'system'), 100);
  };

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    const securedTeam = await ensureTeamSecurity();
    const user = securedTeam.find((member) => member.email?.toLowerCase() === email.toLowerCase());

    if (!user || !(await verifyPassword(user, password))) {
      setLoginError(locale === 'fr' ? 'Identifiants invalides.' : locale === 'ar' ? 'بيانات الدخول غير صحيحة.' : 'Invalid credentials.');
      return;
    }

    setLoginError('');

    if (user.mustResetCredentials) {
      setPendingResetUser(user);
      setResetEmail(user.email);
      setCurrentPassword('');
      setResetPassword('');
      setConfirmPassword('');
      return;
    }

    completeAuthentication(user);
  };

  const handleResetCredentials = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!pendingResetUser) {
      return;
    }

    const existing = getSeededTeam().find(
      (member) =>
        member.email.toLowerCase() === resetEmail.trim().toLowerCase() &&
        member.id !== pendingResetUser.id
    );

    if (existing) {
      setResetError(locale === 'fr' ? 'Cet e-mail est deja utilise.' : locale === 'ar' ? 'هذا البريد مستخدم بالفعل.' : 'This email is already in use.');
      return;
    }

    const updatedUser = await updateTeamMemberCredentials({
      currentEmail: pendingResetUser.email,
      nextEmail: resetEmail,
      nextPassword: resetPassword,
    });

    if (!updatedUser) {
      setResetError(locale === 'fr' ? 'Impossible de mettre a jour le compte.' : locale === 'ar' ? 'تعذر تحديث الحساب.' : 'Could not update account.');
      return;
    }

    setPendingResetUser(null);
    setResetError('');
    completeAuthentication(updatedUser);
  };

  const handleUpdateOwnCredentials = async (event: React.FormEvent) => {
    event.preventDefault();

    const currentEmail = sessionStorage.getItem('adminEmail') || email;
    const nextEmail = resetEmail.trim().toLowerCase();
    const oldPassword = currentPassword.trim();
    const nextPassword = resetPassword.trim();
    const nextPasswordConfirm = confirmPassword.trim();

    if (!nextEmail || !oldPassword || !nextPassword || !nextPasswordConfirm) {
      setResetError(locale === 'fr' ? 'Veuillez remplir tous les champs.' : locale === 'ar' ? 'يرجى ملء جميع الحقول.' : 'Please fill in all fields.');
      return;
    }

    const currentUser = getSeededTeam().find((member) => member.email.toLowerCase() === currentEmail.toLowerCase());
    if (!currentUser || !(await verifyPassword(currentUser, oldPassword))) {
      setResetError(locale === 'fr' ? 'Ancien mot de passe incorrect.' : locale === 'ar' ? 'كلمة المرور الحالية غير صحيحة.' : 'Current password is incorrect.');
      return;
    }

    if (nextPassword !== nextPasswordConfirm) {
      setResetError(locale === 'fr' ? 'La confirmation du mot de passe ne correspond pas.' : locale === 'ar' ? 'تأكيد كلمة المرور غير مطابق.' : 'Password confirmation does not match.');
      return;
    }

    const existing = getSeededTeam().find((member) => member.email.toLowerCase() === nextEmail && member.email.toLowerCase() !== currentEmail.toLowerCase());
    if (existing) {
      setResetError(locale === 'fr' ? 'Cet e-mail est deja utilise.' : locale === 'ar' ? 'هذا البريد مستخدم بالفعل.' : 'This email is already in use.');
      return;
    }

    const updatedUser = await updateTeamMemberCredentials({
      currentEmail,
      nextEmail,
      nextPassword,
    });

    if (!updatedUser) {
      setResetError(locale === 'fr' ? 'Impossible de mettre a jour le compte.' : locale === 'ar' ? 'تعذر تحديث الحساب.' : 'Could not update account.');
      return;
    }

    setResetError('');
    setIsCredentialsModalOpen(false);
    setCurrentPassword('');
    setResetPassword('');
    setConfirmPassword('');
    completeAuthentication(updatedUser, activeTab);
  };

  const tabs = useMemo(() => {
    const fallbackSubscriptionsTab = {
      id: 'subscriptions',
      label: locale === 'fr' ? 'Abonnements' : locale === 'ar' ? 'الاشتراكات' : 'Subscriptions',
      icon: CreditCard,
    };
    const sourceTabs = copy.tabs.some((tab) => tab.id === 'subscriptions') ? copy.tabs : [...copy.tabs, fallbackSubscriptionsTab];
    const doctorTeamLabel = locale === 'fr' ? 'Mon equipe' : locale === 'ar' ? 'فريقي' : 'My team';

    if (userRole === 'Admin') {
      return sourceTabs.filter((tab) => tab.id === 'dashboard' || tab.id === 'team' || tab.id === 'subscriptions' || tab.id === 'logs' || tab.id === 'reviews' || tab.id === 'demos');
    }
    if (userRole === 'Doctor') {
      return sourceTabs
        .filter((tab) => tab.id === 'dashboard' || tab.id === 'calendar' || tab.id === 'clients' || tab.id === 'team')
        .map((tab) => (tab.id === 'team' ? { ...tab, label: doctorTeamLabel } : tab));
    }

    return sourceTabs.filter((tab) => tab.id === 'calendar' || tab.id === 'clients');
  }, [copy.tabs, locale, userRole]);

  const visibleActiveTab = userRole === 'Secretary' && activeTab === 'team' ? 'calendar' : activeTab;

  const renderContent = () => {
    switch (visibleActiveTab) {
      case 'clients':
        return <ClientsTab />;
      case 'calendar':
        return <CalendarTab />;
      case 'team':
        return userRole === 'Admin' || userRole === 'Doctor' ? <TeamTab /> : <DashboardTab />;
      case 'subscriptions':
        return userRole === 'Admin' ? <SubscriptionsTab /> : <DashboardTab />;
      case 'logs':
        return userRole === 'Admin' ? <LogsTab /> : <DashboardTab />;
      case 'reviews':
        return <ReviewsTab />;
      case 'demos':
        return <DemosTab />;
      default:
        return <DashboardTab />;
    }
  };

  if (!isHydrated) {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <div
        className={`relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(25,163,137,0.14),transparent_28%),radial-gradient(circle_at_90%_10%,rgba(255,162,125,0.16),transparent_22%),linear-gradient(180deg,#f8f5ef_0%,#f2f7f4_45%,#eef6f1_100%)] p-4 text-slate-900 transition-colors dark:bg-[radial-gradient(circle_at_top_left,rgba(37,164,138,0.18),transparent_28%),radial-gradient(circle_at_90%_10%,rgba(255,145,110,0.14),transparent_22%),linear-gradient(180deg,#0b1624_0%,#0d1726_55%,#07111f_100%)] dark:text-white ${isRtl ? 'text-right' : 'text-left'}`}
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        <div className="absolute inset-x-0 top-0 h-56 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.6),transparent_72%)] dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_72%)]" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mx-auto flex min-h-[calc(100vh-2rem)] max-w-5xl items-center justify-center"
        >
          <div className="grid w-full overflow-visible rounded-[2.2rem] border border-white/60 bg-white/90 shadow-[0_30px_90px_-44px_rgba(15,23,42,0.35)] backdrop-blur md:grid-cols-[0.9fr_1.1fr] dark:border-white/10 dark:bg-[#08111d]/92">
            <div className="hidden flex-col justify-between bg-[linear-gradient(160deg,#12695b_0%,#1a8773_45%,#f0b39a_180%)] p-10 text-white md:flex">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-white/14 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em]">
                  DarijaDoc
                </div>
                <h2 className="mt-6 max-w-sm text-4xl font-semibold leading-[1.02] [font-family:var(--font-medical-display)]">
                  Un espace clinique plus clair pour chaque role.
                </h2>
                <p className="mt-4 max-w-sm text-sm leading-7 text-white/85">
                  Admin, medecin et secretariat gardent chacun une vue utile, avec une interface plus calme, plus lisible et plus mature.
                </p>
              </div>
              <div className="rounded-[1.75rem] border border-white/15 bg-white/10 px-5 py-5 text-sm leading-7 text-white/82">
                Connexion securisee pour le cabinet, avec acces adaptes au role de chacun.
              </div>
            </div>

            <div className="relative overflow-visible p-7 sm:p-10">
              <div className="mb-8 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-[1.4rem] bg-[#eff8f5] text-[#12695b] shadow-inner dark:bg-[#9fe7d4]/10 dark:text-[#9fe7d4]">
                    <LayoutDashboard className="h-7 w-7" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-semibold text-slate-950 dark:text-white [font-family:var(--font-medical-display)]">{copy.login.title}</h1>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{copy.login.subtitle}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-700 transition hover:border-slate-300 hover:text-slate-950 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
                >
                  {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </button>
              </div>

              <div className="mb-4 flex items-center justify-end text-xs text-slate-500 dark:text-slate-400">
                <a href={`/${locale}`} className="transition hover:text-[#12695b] dark:hover:text-[#9fe7d4]">
                  {backToSiteLabel}
                </a>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">{copy.login.email}</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded-[1.25rem] border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-[#12695b] focus:ring-4 focus:ring-[#12695b]/10 dark:border-white/10 dark:bg-white/5 dark:text-white"
                    placeholder={copy.login.emailPlaceholder}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">{copy.login.password}</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full rounded-[1.25rem] border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-[#12695b] focus:ring-4 focus:ring-[#12695b]/10 dark:border-white/10 dark:bg-white/5 dark:text-white"
                    placeholder={copy.login.passwordPlaceholder}
                  />
                </div>

                <div className="flex items-center gap-3">
                  <LocaleMenu locale={locale} label={copy.sidebar.language} pathname={pathname} compact />
                  <button
                    type="submit"
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-[1.25rem] bg-[#12695b] px-4 py-3 font-semibold text-white transition hover:bg-[#0f5a4e]"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    {copy.login.button}
                  </button>
                </div>

                {loginError ? <p className="text-sm font-semibold text-[#c95f3b] dark:text-[#ffb39b]">{loginError}</p> : null}
              </form>
            </div>
          </div>
        </motion.div>

        <AnimatePresence>
          {pendingResetUser ? (
            <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.96 }}
                className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-7 shadow-2xl dark:border-white/10 dark:bg-[#0d1726]"
              >
                <h3 className="text-2xl font-semibold text-slate-950 dark:text-white [font-family:var(--font-medical-display)]">{copy.reset.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{copy.reset.subtitle}</p>

                <form onSubmit={handleResetCredentials} className="mt-6 space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">{copy.reset.email}</label>
                    <input
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      required
                      className="w-full rounded-[1.15rem] border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-[#12695b] focus:ring-4 focus:ring-[#12695b]/10 dark:border-white/10 dark:bg-white/5 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">{copy.reset.password}</label>
                    <input
                      type="password"
                      value={resetPassword}
                      onChange={(e) => setResetPassword(e.target.value)}
                      minLength={3}
                      required
                      className="w-full rounded-[1.15rem] border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-[#12695b] focus:ring-4 focus:ring-[#12695b]/10 dark:border-white/10 dark:bg-white/5 dark:text-white"
                    />
                  </div>
                  {resetError ? <p className="text-sm font-semibold text-[#c95f3b] dark:text-[#ffb39b]">{resetError}</p> : null}
                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center rounded-[1.15rem] bg-[#12695b] px-4 py-3 font-semibold text-white transition hover:bg-[#0f5a4e]"
                  >
                    {copy.reset.button}
                  </button>
                </form>
              </motion.div>
            </div>
          ) : null}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className={`flex min-h-screen w-full bg-[#f6f8f7] text-slate-900 transition-colors dark:bg-[#07111f] dark:text-white ${isRtl ? 'text-right' : 'text-left'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      <aside className={`hidden w-72 flex-col border-slate-200 bg-white md:flex dark:border-white/10 dark:bg-[#08111d]/88 ${isRtl ? 'border-l' : 'border-r'}`}>
        <div className="border-b border-slate-200 p-6 dark:border-white/10">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 text-xl font-semibold text-[#12695b] dark:text-[#9fe7d4] [font-family:var(--font-medical-display)]">
              <LayoutDashboard className="h-6 w-6" />
              <span>DarijaDoc</span>
            </div>
            <div className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-400">{userRole}</div>
            <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{userAccess}</div>
          </div>
        </div>

        <div className="border-b border-slate-200 p-4 dark:border-white/10">
          <div className="flex gap-2">
            <button
              onClick={toggleTheme}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-slate-50 p-2.5 text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
              title={copy.sidebar.theme}
            >
              {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              <span className="text-xs font-semibold">{copy.sidebar.theme}</span>
            </button>
            <LocaleMenu locale={locale} label={copy.sidebar.language} pathname={pathname} />
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
                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 transition ${
                  isActive
                    ? 'bg-[#eff8f5] font-medium text-[#12695b] dark:bg-[#9fe7d4]/12 dark:text-[#9fe7d4]'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white'
                }`}
              >
                <Icon className="h-5 w-5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="space-y-2 border-t border-slate-200 p-4 dark:border-white/10">
          <button
            onClick={() => {
              setResetEmail(sessionStorage.getItem('adminEmail') || email);
              setCurrentPassword('');
              setResetPassword('');
              setConfirmPassword('');
              setResetError('');
              setIsCredentialsModalOpen(true);
            }}
            className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-slate-600 transition hover:bg-slate-50 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white"
          >
            <CheckCircle2 className="h-5 w-5" />
            {credentialsLabel}
          </button>
          <button
            onClick={() => {
              setIsAuthenticated(false);
              clearClientSession();
            }}
            className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-red-500 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
          >
            <LogOut className="h-5 w-5" />
            {copy.sidebar.logout}
          </button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="border-b border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-[#08111d]/88 md:hidden">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 font-semibold text-slate-950 dark:text-white [font-family:var(--font-medical-display)]">
              <LayoutDashboard className="h-5 w-5 text-[#12695b] dark:text-[#9fe7d4]" />
              DarijaDoc
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setResetEmail(sessionStorage.getItem('adminEmail') || email);
                  setCurrentPassword('');
                  setResetPassword('');
                  setConfirmPassword('');
                  setResetError('');
                  setIsCredentialsModalOpen(true);
                }}
                className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
              >
                {credentialsLabel}
              </button>
              <LocaleMenu locale={locale} label={copy.sidebar.language} pathname={pathname} compact />
              <button
                onClick={() => {
                  setActiveTab('calendar');
                  setTimeout(() => window.dispatchEvent(new Event('openApptModal')), 100);
                }}
                className="rounded-2xl bg-[#12695b] p-2.5 text-white"
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

      <AnimatePresence>
        {isCredentialsModalOpen ? (
          <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-7 shadow-2xl dark:border-white/10 dark:bg-[#0d1726]"
            >
              <h3 className="text-2xl font-semibold text-slate-950 dark:text-white [font-family:var(--font-medical-display)]">{credentialsTitle}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{credentialsSubtitle}</p>

              <form onSubmit={handleUpdateOwnCredentials} className="mt-6 space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">{copy.reset.email}</label>
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                    className="w-full rounded-[1.15rem] border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-[#12695b] focus:ring-4 focus:ring-[#12695b]/10 dark:border-white/10 dark:bg-white/5 dark:text-white"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    {locale === 'fr' ? 'Mot de passe actuel' : locale === 'ar' ? 'كلمة المرور الحالية' : 'Current password'}
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    minLength={3}
                    required
                    className="w-full rounded-[1.15rem] border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-[#12695b] focus:ring-4 focus:ring-[#12695b]/10 dark:border-white/10 dark:bg-white/5 dark:text-white"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">{copy.reset.password}</label>
                  <input
                    type="password"
                    value={resetPassword}
                    onChange={(e) => setResetPassword(e.target.value)}
                    minLength={3}
                    required
                    className="w-full rounded-[1.15rem] border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-[#12695b] focus:ring-4 focus:ring-[#12695b]/10 dark:border-white/10 dark:bg-white/5 dark:text-white"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    {locale === 'fr' ? 'Confirmer le nouveau mot de passe' : locale === 'ar' ? 'تأكيد كلمة المرور الجديدة' : 'Confirm new password'}
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    minLength={3}
                    required
                    className="w-full rounded-[1.15rem] border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-[#12695b] focus:ring-4 focus:ring-[#12695b]/10 dark:border-white/10 dark:bg-white/5 dark:text-white"
                  />
                </div>
                {resetError ? <p className="text-sm font-semibold text-[#c95f3b] dark:text-[#ffb39b]">{resetError}</p> : null}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsCredentialsModalOpen(false)}
                    className="inline-flex flex-1 items-center justify-center rounded-[1.15rem] border border-slate-200 px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/5"
                  >
                    {locale === 'fr' ? 'Annuler' : locale === 'ar' ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="inline-flex flex-1 items-center justify-center rounded-[1.15rem] bg-[#12695b] px-4 py-3 font-semibold text-white transition hover:bg-[#0f5a4e]"
                  >
                    {locale === 'fr' ? 'Enregistrer' : locale === 'ar' ? 'حفظ' : 'Save'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
