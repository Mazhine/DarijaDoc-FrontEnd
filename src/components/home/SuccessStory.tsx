'use client';
import { useTranslations } from 'next-intl';

export default function SuccessStory() {
  const t = useTranslations('HomePage.Success');

  return (
    <section className="py-24 bg-slate-50 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto text-right">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0077b6]/10 text-[#0077b6] text-sm font-black mb-8 border border-[#0077b6]/20">
          {t('tag')}
        </div>

        <h2 className="text-4xl md:text-7xl font-black text-slate-900 mb-8 leading-tight tracking-tighter">
          {t('stat')}
        </h2>

        <p className="text-xl md:text-2xl text-slate-600 font-medium leading-relaxed italic border-r-4 border-[#0077b6] pr-6 mb-12">
          "{t('quote')}"
        </p>

        <div className="flex flex-col items-end">
          <div className="text-slate-900 font-black text-lg">{t('doctorName')}</div>
          <div className="text-[#0077b6] font-bold text-sm">{t('doctorSpecialty')}</div>
        </div>
      </div>
    </section>
  );
}