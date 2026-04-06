'use client';
import { useLocale } from 'next-intl';
import { Link, usePathname, useRouter } from '@/src/i18n/routing';
import { ChevronDown, Menu, Command, HelpCircle, Mail, UserPlus, Globe } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const content = {
  fr: {
    resources: "Ressources",
    faq: "FAQ",
    faqDesc: "Réponses aux questions",
    contact: "Contact",
    contactDesc: "Parlez avec notre équipe",
    join: "Nous Rejoindre",
    joinDesc: "Faites partie de l'équipe",
    login: "Se connecter",
    btn: "Rejoindre"
  },
  ar: {
    resources: "الموارد",
    faq: "الأسئلة الشائعة",
    faqDesc: "أجوبة على أسئلتكم",
    contact: "تواصل معنا",
    contactDesc: "هضر مع الفريق ديالنا",
    join: "انضم إلينا",
    joinDesc: "كون جزء من الفريق",
    login: "تسجيل الدخول",
    btn: "سجل دابا"
  },
  en: {
    resources: "Resources",
    faq: "FAQ",
    faqDesc: "Answers to common questions",
    contact: "Contact Us",
    contactDesc: "Talk to our team",
    join: "Join Us",
    joinDesc: "Become a part of the team",
    login: "Sign In",
    btn: "Join me"
  }
}

export const Navbar = () => {
  const locale = useLocale();
  const t = content[locale as keyof typeof content] || content.en;
  const isArabic = locale === 'ar';
  const pathname = usePathname();
  const router = useRouter();

  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);

  const languages = [
    { code: 'fr', label: 'Français' },
    { code: 'ar', label: 'العربية' },
    { code: 'en', label: 'English' }
  ];

  return (
    <nav className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-[0_8px_30px_rgba(0,119,182,0.12)] border border-gray-100 flex items-center justify-between px-6 py-3 w-full max-w-5xl pointer-events-auto transition-all">

        {/* Logo */}
        <Link href="/" className={`flex items-center gap-2 group ${isArabic ? 'ml-8' : 'mr-8'}`}>
          <Command className="w-7 h-7 text-[#0077b6] group-hover:rotate-12 transition-transform" />
          <span className="text-xl font-black text-gray-900 tracking-tight hidden sm:block">
            DarijaDoc<span className="text-[#00b4d8]">.</span>
          </span>
        </Link>

        {/* Centered Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 flex-1">

          {/* Ressources Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setIsResourcesOpen(true)}
            onMouseLeave={() => setIsResourcesOpen(false)}
          >
            <div className="flex items-center gap-1.5 text-[15px] text-gray-600 hover:text-[#0077b6] font-semibold transition-colors cursor-pointer py-2">
              {t.resources} <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isResourcesOpen ? 'rotate-180' : ''}`} />
            </div>

            <AnimatePresence>
              {isResourcesOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className={`absolute top-full ${isArabic ? 'right-0' : 'left-0'} mt-2 w-64 bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-[#90e0ef]/30 p-2 flex flex-col z-50`}
                >
                  <Link href="/faq" className="flex items-start gap-3 p-3 rounded-xl hover:bg-[#90e0ef]/10 transition-colors">
                    <HelpCircle className="w-5 h-5 text-[#00b4d8] mt-0.5" />
                    <div>
                      <div className="font-bold text-gray-900 text-sm">{t.faq}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{t.faqDesc}</div>
                    </div>
                  </Link>
                  <Link href="/join" className="flex items-start gap-3 p-3 rounded-xl hover:bg-[#90e0ef]/10 transition-colors">
                    <UserPlus className="w-5 h-5 text-[#00b4d8] mt-0.5" />
                    <div>
                      <div className="font-bold text-gray-900 text-sm">{t.join}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{t.joinDesc}</div>
                    </div>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

        {/* Right CTA & Language */}
        <div className="hidden md:flex items-center gap-4">

          {/* Language Selector Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setIsLangOpen(true)}
            onMouseLeave={() => setIsLangOpen(false)}
          >
            <button className="flex items-center gap-1.5 text-gray-600 hover:text-[#0077b6] font-semibold p-2 rounded-lg transition-colors">
              <Globe className="w-4 h-4" />
              <span className="text-sm uppercase">{locale}</span>
            </button>
            <AnimatePresence>
              {isLangOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className={`absolute top-full ${isArabic ? 'left-0' : 'right-0'} mt-2 w-32 bg-[#0077b6]/95 backdrop-blur-md rounded-xl shadow-xl overflow-hidden py-1 z-50 border border-white/10`}
                >
                  {languages.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => router.replace(pathname, { locale: lang.code })}
                      className={`w-full text-${isArabic ? 'right' : 'left'} px-4 py-2 text-sm transition-colors ${locale === lang.code ? 'text-[#90e0ef] bg-white/10 font-bold' : 'text-gray-200 hover:bg-white/5 hover:text-white'}`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link href="/join" className="bg-[#0077b6] text-white px-5 py-2.5 rounded-full font-bold text-sm hover:bg-[#00b4d8] transition-colors shadow-md shadow-[#0077b6]/20">
            {t.btn}
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <div className="md:hidden flex items-center">
          <button className="text-[#0077b6] p-2">
            <Menu className="w-6 h-6" />
          </button>
        </div>

      </div>
    </nav>
  );
};