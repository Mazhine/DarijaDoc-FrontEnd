'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Globe, Menu, Moon, Stethoscope, Sun, X } from 'lucide-react';
import { useLocale } from 'next-intl';
import { useEffect, useState } from 'react';
import { getLandingContent, type LocaleKey } from '../../content/landing';
import { usePathname } from '@/src/i18n/routing';

export const Navbar = () => {
  const locale = useLocale() as LocaleKey;
  const copy = getLandingContent(locale);
  const isArabic = locale === 'ar';
  const pathname = usePathname();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const languages = [
    { code: 'fr', label: 'Francais' },
    { code: 'ar', label: 'العربية' },
    { code: 'en', label: 'English' },
  ] as const;

  const navLinks = [
    { href: '#workflow', label: copy.nav.workflow },
    { href: '#access', label: copy.nav.access },
    { href: '#faq', label: copy.nav.faq },
    { href: '#demo', label: copy.nav.demo },
  ];

  const switchLocale = (nextLocale: string) => {
    const safePath = pathname && pathname !== '/' ? pathname.replace(/^\/(fr|en|ar)/, `/${nextLocale}`) : `/${nextLocale}`;
    window.location.assign(safePath);
  };

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const savedTheme = localStorage.getItem('darijadoc-theme') || 'light';
      const nextIsDark = savedTheme === 'dark';
      document.documentElement.classList.toggle('dark', nextIsDark);
      setIsDark(nextIsDark);
      setIsReady(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  const toggleTheme = () => {
    const nextIsDark = !isDark;
    setIsDark(nextIsDark);
    document.documentElement.classList.toggle('dark', nextIsDark);
    localStorage.setItem('darijadoc-theme', nextIsDark ? 'dark' : 'light');
  };

  if (pathname.includes('/admin') || pathname.includes('/auth')) {
    return null;
  }

  return (
    <header
      className={`fixed inset-x-0 top-6 z-50 px-4 transition-all duration-300 ${
        isReady ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
      }`}
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between overflow-visible rounded-full border border-slate-200/80 bg-white/80 px-4 py-3 backdrop-blur-xl shadow-sm transition-colors dark:border-white/10 dark:bg-[#07111f]/80 md:px-6">
        <a href={`/${locale}`} className="flex items-center gap-3">
          <span className="premium-chip inline-flex h-10 w-10 items-center justify-center rounded-full">
            <Stethoscope className="h-5 w-5" />
          </span>
          <div>
            <div className="text-sm font-semibold text-slate-950 dark:text-white">DarijaDoc</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {locale === 'fr'
                ? 'Organisation WhatsApp pour cabinets'
                : locale === 'ar'
                  ? 'تنظيم واتساب للعيادات'
                  : 'WhatsApp scheduling for clinics'}
            </div>
          </div>
        </a>

        <div className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="text-sm font-medium text-slate-600 transition hover:text-slate-950 dark:text-slate-300 dark:hover:text-white">
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <button
            type="button"
            onClick={toggleTheme}
            disabled={!isReady}
            className="premium-subtle flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-slate-700 transition hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            <span>{isDark ? 'Light' : 'Dark'}</span>
          </button>
          <a
            href={`/${locale}/auth`}
            className="premium-subtle rounded-full px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-950 dark:text-slate-200 dark:hover:text-white"
          >
            {copy.nav.signIn}
          </a>
          <div
            className="relative isolate mb-[-0.75rem] flex-none pb-3"
            onMouseEnter={() => setIsLangOpen(true)}
            onMouseLeave={() => setIsLangOpen(false)}
          >
            <button
              type="button"
              aria-expanded={isLangOpen}
              className="premium-subtle flex h-[42px] w-[88px] items-center justify-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-slate-700 transition hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
            >
              <Globe className="h-4 w-4" />
              <span className="uppercase">{locale}</span>
            </button>

            <AnimatePresence>
              {isLangOpen ? (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="premium-surface absolute end-0 top-full z-50 w-40 overflow-hidden rounded-3xl py-1 shadow-xl"
                >
                  {languages.map((language) => (
                    <button
                      key={language.code}
                      type="button"
                      onClick={() => switchLocale(language.code)}
                      className={`block w-full px-4 py-2 text-sm transition-colors ${
                        locale === language.code
                          ? 'bg-[#eff8f5] font-semibold text-[#12695b] dark:bg-white/8 dark:text-[#9fe7d4]'
                          : 'text-slate-700 hover:bg-slate-50 hover:text-slate-950 dark:text-slate-200 dark:hover:bg-white/6 dark:hover:text-white'
                      } ${isArabic ? 'text-right' : 'text-left'}`}
                    >
                      {language.label}
                    </button>
                  ))}
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>

          <a
            href="#demo"
            className="rounded-full bg-[#12695b] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0f5a4e]"
          >
            {copy.nav.cta}
          </a>
        </div>

        <button
          type="button"
          className="premium-subtle inline-flex items-center justify-center rounded-full p-2 text-slate-700 md:hidden dark:text-slate-200"
          onClick={() => setIsMobileOpen((prev) => !prev)}
          aria-expanded={isMobileOpen}
          aria-label="Toggle navigation menu"
        >
          {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {isMobileOpen ? (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="premium-surface absolute inset-x-4 top-[84px] rounded-[1.75rem] p-4 shadow-2xl md:hidden"
          >
            <div className="flex flex-col gap-3 text-sm font-medium text-slate-700 dark:text-slate-200">
              {navLinks.map((link) => (
                <a key={link.href} href={link.href} onClick={() => setIsMobileOpen(false)}>
                  {link.label}
                </a>
              ))}
            </div>

            <div className="mt-4 grid gap-2 border-t border-slate-100 pt-4 dark:border-white/8">
              <button
                type="button"
                onClick={toggleTheme}
                disabled={!isReady}
                className="premium-subtle inline-flex items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                <span>{isDark ? 'Light' : 'Dark'}</span>
              </button>
              {languages.map((language) => (
                <button
                  key={language.code}
                  type="button"
                  onClick={() => {
                    setIsMobileOpen(false);
                    switchLocale(language.code);
                  }}
                  className={`rounded-2xl px-3 py-2 text-sm font-medium ${
                    locale === language.code ? 'premium-chip' : 'premium-subtle text-slate-700 dark:text-slate-200'
                  }`}
                >
                  {language.label}
                </button>
              ))}
              <a
                href={`/${locale}/auth`}
                onClick={() => setIsMobileOpen(false)}
                className="premium-subtle inline-flex items-center justify-center rounded-full px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                {copy.nav.signIn}
              </a>
              <a
                href="#demo"
                onClick={() => setIsMobileOpen(false)}
                className="inline-flex items-center justify-center rounded-full bg-[#12695b] px-4 py-3 text-sm font-semibold text-white"
              >
                {copy.nav.cta}
              </a>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
};
