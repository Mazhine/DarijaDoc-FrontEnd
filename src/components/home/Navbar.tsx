'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Globe, Menu, X } from 'lucide-react';
import { useLocale } from 'next-intl';
import { useState } from 'react';
import { getLandingContent, type LocaleKey } from '../../content/landing';
import { usePathname, useRouter } from '@/src/i18n/routing';

export const Navbar = () => {
  const locale = useLocale() as LocaleKey;
  const copy = getLandingContent(locale);
  const isArabic = locale === 'ar';
  const pathname = usePathname();
  const router = useRouter();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const languages = [
    { code: 'fr', label: 'Français' },
    { code: 'ar', label: 'العربية' },
    { code: 'en', label: 'English' },
  ] as const;

  const navLinks = [
    { href: '#features', label: copy.nav.features },
    { href: '#pricing', label: copy.nav.pricing },
    { href: '#faq', label: copy.nav.faq },
    { href: '#contact', label: copy.nav.contact },
  ];

  const switchLocale = (nextLocale: string) => {
    router.replace(pathname, { locale: nextLocale });
  };

  if (pathname.includes('/admin')) {
    return null;
  }

  return (
    <nav
      className="pointer-events-none fixed left-0 right-0 top-3 z-50 flex justify-center px-3 md:px-4"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <div className="pointer-events-auto flex w-full max-w-6xl items-center justify-between rounded-[1.75rem] border border-white/10 bg-[#08111d]/82 px-4 py-3 shadow-[0_24px_60px_-32px_rgba(0,0,0,0.7)] backdrop-blur-xl md:px-6">
        <a href={`/${locale}#hero`} className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-white/10 bg-white/6 text-sm font-black text-[#9fe7d4]">
            DD
          </span>
          <div className="hidden sm:block">
            <div className="text-sm font-black tracking-tight text-white">DarijaDoc</div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              WhatsApp care flow
            </div>
          </div>
        </a>

        <div className="hidden flex-1 items-center justify-center gap-7 md:flex">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="text-sm font-semibold text-slate-200 transition hover:text-[#9fe7d4]">
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href={`/${locale}/admin`}
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-black text-slate-200 transition hover:border-[#9fe7d4]/45 hover:text-white"
          >
            Admin
          </a>
          <div
            className="relative"
            onMouseEnter={() => setIsLangOpen(true)}
            onMouseLeave={() => setIsLangOpen(false)}
          >
            <button
              type="button"
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:text-[#9fe7d4]"
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
                  className={`absolute top-full mt-2 w-36 overflow-hidden rounded-2xl border border-white/12 bg-[#08111d]/96 py-1 shadow-xl backdrop-blur-md ${
                    isArabic ? 'left-0' : 'right-0'
                  }`}
                >
                  {languages.map((language) => (
                    <button
                      key={language.code}
                      type="button"
                      onClick={() => switchLocale(language.code)}
                      className={`w-full px-4 py-2 text-sm transition-colors ${
                        locale === language.code
                          ? 'bg-white/8 font-bold text-[#9fe7d4]'
                          : 'text-slate-200 hover:bg-white/6 hover:text-white'
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
            href="#contact"
            className="rounded-full bg-[#9fe7d4] px-5 py-2.5 text-sm font-black text-slate-950 transition hover:scale-[1.02]"
          >
            {copy.nav.cta}
          </a>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 p-2 text-[#9fe7d4] md:hidden"
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
            className="absolute left-3 right-3 top-[76px] rounded-[1.75rem] border border-white/12 bg-[#08111d]/96 p-4 shadow-2xl backdrop-blur md:hidden"
          >
            <div className="flex flex-col gap-3 text-sm font-semibold text-slate-100">
              {navLinks.map((link) => (
                <a key={link.href} href={link.href} onClick={() => setIsMobileOpen(false)}>
                  {link.label}
                </a>
              ))}
            </div>

            <div className="mt-4 grid gap-2 border-t border-white/8 pt-4">
              {languages.map((language) => (
                <button
                  key={language.code}
                  type="button"
                  onClick={() => {
                    setIsMobileOpen(false);
                    switchLocale(language.code);
                  }}
                  className={`rounded-2xl px-3 py-2 text-sm font-semibold ${
                    locale === language.code ? 'bg-white/8 text-[#9fe7d4]' : 'bg-white/4 text-slate-200'
                  }`}
                >
                  {language.label}
                </button>
              ))}
              <a
                href={`/${locale}/admin`}
                onClick={() => setIsMobileOpen(false)}
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm font-black text-slate-100"
              >
                Admin
              </a>
              <a
                href="#contact"
                onClick={() => setIsMobileOpen(false)}
                className="mt-2 inline-flex items-center justify-center rounded-full bg-[#9fe7d4] px-4 py-3 text-sm font-black text-slate-950"
              >
                {copy.nav.cta}
              </a>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </nav>
  );
};
