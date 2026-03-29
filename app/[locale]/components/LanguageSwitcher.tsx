"use client";
import { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from "@/i18n/routing";
import { useLocale } from "next-intl";

export default function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // تعريف اللغات مع الأعلام (Flags) بصيغة SVG لضمان الجودة
  const languages = [
    { 
      code: 'ar', 
      label: 'العربية', 
      flag: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-5 h-5 shadow-sm rounded-sm">
          <path fill="#c1272d" d="M0 0h512v512H0z"/><path fill="#006233" d="M256 166.4l24.4 75.1h78.9l-63.9 46.4 24.4 75.1-63.8-46.4-63.8 46.4 24.4-75.1-63.9-46.4h78.9z"/>
        </svg>
      )
    },
    { 
      code: 'fr', 
      label: 'Français', 
      flag: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-5 h-5 shadow-sm rounded-sm">
          <path fill="#fff" d="M0 0h512v512H0z"/><path fill="#002395" d="M0 0h170.7v512H0z"/><path fill="#ed2939" d="M341.3 0H512v512H341.3z"/>
        </svg>
      )
    },
    { 
      code: 'en', 
      label: 'English', 
      flag: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-5 h-5 shadow-sm rounded-sm">
          <path fill="#bd3d44" d="M0 0h512v27.5H0zm0 55h512v27.5H0zm0 54.9h512v27.5H0zm0 55h512v27.5H0zm0 54.9h512v27.5H0zm0 55h512v27.5H0zm0 54.9h512v27.5H0z"/><path fill="#fff" d="M0 27.5h512v27.5H0zm0 55h512v27.5H0zm0 54.9h512v27.5H0zm0 55h512v27.5H0zm0 54.9h512v27.5H0zm0 55h512v27.5H0z"/><path fill="#192f5d" d="M0 0h256v192.5H0z"/><path fill="#fff" d="M32 18.5l6.5 20h21l-17 12.4 6.5 20-17-12.4-17 12.4 6.5-20-17-12.4h21zM96 18.5l6.5 20h21l-17 12.4 6.5 20-17-12.4-17 12.4 6.5-20-17-12.4h21zM160 18.5l6.5 20h21l-17 12.4 6.5 20-17-12.4-17 12.4 6.5-20-17-12.4h21zM224 18.5l6.5 20h21l-17 12.4 6.5 20-17-12.4-17 12.4 6.5-20-17-12.4h21zM64 50.8l6.5 20h21l-17 12.4 6.5 20-17-12.4-17 12.4 6.5-20-17-12.4h21zm64 0l6.5 20h21l-17 12.4 6.5 20-17-12.4-17 12.4 6.5-20-17-12.4h21zm64 0l6.5 20h21l-17 12.4 6.5 20-17-12.4-17 12.4 6.5-20-17-12.4h21z"/>
        </svg>
      )
    }
  ];

  const currentLang = languages.find(l => l.code === locale) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLanguageChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* الزر الرئيسي باللغو الحقيقي */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 bg-white border border-slate-200 px-4 py-2.5 rounded-2xl shadow-sm hover:bg-slate-50 transition-all font-bold text-sm text-slate-700"
      >
        <div className="flex shrink-0">{currentLang.flag}</div>
        <span className="hidden sm:inline uppercase tracking-tight">{currentLang.code}</span>
        <svg className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown القائمة المنسدلة */}
      {isOpen && (
        <div className="absolute top-full mt-2 right-0 w-48 bg-white border border-slate-100 rounded-3xl shadow-2xl z-[100] py-2 animate-in fade-in zoom-in duration-150">
          <div className="px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 mb-1">
            اختر اللغة / Select Language
          </div>
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full flex items-center gap-4 px-4 py-3 text-sm font-bold transition-all hover:bg-blue-50 ${
                locale === lang.code ? "text-blue-600 bg-blue-50/40" : "text-slate-600"
              }`}
            >
              <div className="flex shrink-0">{lang.flag}</div>
              <span className="flex-1 text-right">{lang.label}</span>
              {locale === lang.code && <div className="w-2 h-2 rounded-full bg-blue-500" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}