'use client';

import { Link, usePathname } from '@/i18n/routing'; 
import { useTranslations, useLocale } from 'next-intl';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const t = useTranslations('Navbar');
  const pathname = usePathname();
  const locale = useLocale();
  const [isScrolled, setIsScrolled] = useState(false);

  // Effect باش نحسو بالـ Scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm py-3' : 'bg-white py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-extrabold text-blue-600 tracking-tight">
            DARIJA<span className="text-slate-800">DOC</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-slate-600 hover:text-blue-600 font-medium transition text-sm">
            {t('home') || 'الرئيسية'}
          </Link>
          
          {/* Language Switcher */}
          <div className="flex items-center gap-2 border-l pl-4 ml-4">
            {['ar', 'en', 'fr'].map((l) => (
              <Link
                key={l}
                href={pathname}
                locale={l as any}
                className={`text-xs uppercase px-2 py-1 rounded ${
                  locale === l ? 'bg-blue-100 text-blue-600 font-bold' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {l}
              </Link>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <div className="flex items-center gap-4">
          <Link 
            href="/join" 
            className="bg-[#1d63ff] text-white px-6 py-2.5 rounded-full font-bold hover:bg-blue-700 transition-all transform hover:scale-105 shadow-md text-sm"
          >
            {t('joinButton')}
          </Link>
        </div>
      </div>
    </nav>
  );
}