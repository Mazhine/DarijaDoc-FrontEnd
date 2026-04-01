'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function HomePage() {
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-white text-slate-900" dir="rtl">
      
      {/* 1. Introduction: تريف بالمنصة */}
      <section className="relative pt-24 pb-20 px-6 bg-gradient-to-b from-blue-50 to-white overflow-hidden">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-bold mb-8 animate-bounce">
            <span>{t('Hero.trust')}</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-8 leading-[1.1] tracking-tight text-slate-900">
            {t('Hero.title')}
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            {t('Hero.subtitle')}
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link 
              href="/join" 
              className="bg-blue-600 text-white px-10 py-5 rounded-full font-black text-xl hover:bg-blue-700 transition-all shadow-2xl hover:scale-105 active:scale-95"
            >
              {t('Hero.cta')}
            </Link>
          </div>
        </div>
        {/* Background Decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
      </section>

      {/* 2. الامتيازات: شنو كنقدمو */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="group p-10 rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:bg-blue-50 hover:border-blue-200 transition-all duration-300">
              <div className="text-5xl mb-6 group-hover:scale-110 transition-transform">📈</div>
              <h3 className="text-2xl font-black mb-4 text-slate-800">{t('Features.patients_title')}</h3>
              <p className="text-slate-600 text-lg leading-relaxed">{t('Features.patients_desc')}</p>
            </div>
            <div className="group p-10 rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:bg-blue-50 hover:border-blue-200 transition-all duration-300 text-center scale-105 shadow-xl z-10 bg-white">
              <div className="text-5xl mb-6 group-hover:scale-110 transition-transform">📍</div>
              <h3 className="text-2xl font-black mb-4 text-slate-800">{t('Features.local_title')}</h3>
              <p className="text-slate-600 text-lg leading-relaxed">{t('Features.local_desc')}</p>
            </div>
            <div className="group p-10 rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:bg-blue-50 hover:border-blue-200 transition-all duration-300 text-left">
              <div className="text-5xl mb-6 group-hover:scale-110 transition-transform text-right">🤖</div>
              <h3 className="text-2xl font-black mb-4 text-slate-800 text-right">{t('Features.ai_title')}</h3>
              <p className="text-slate-600 text-lg leading-relaxed text-right">{t('Features.ai_desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. الإحصائيات: الثقة بالأرقام */}
      <section className="py-20 bg-slate-900 text-white relative">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          <div className="space-y-2">
            <div className="text-5xl font-black text-blue-400">+200</div>
            <div className="text-slate-400 font-bold uppercase tracking-widest text-xs">طبيب شريك</div>
          </div>
          <div className="space-y-2">
            <div className="text-5xl font-black text-blue-400">+5k</div>
            <div className="text-slate-400 font-bold uppercase tracking-widest text-xs">بحث شهري</div>
          </div>
          <div className="space-y-2">
            <div className="text-5xl font-black text-blue-400">100%</div>
            <div className="text-slate-400 font-bold uppercase tracking-widest text-xs">مغربي 🇲🇦</div>
          </div>
          <div className="space-y-2">
            <div className="text-5xl font-black text-blue-400">24/7</div>
            <div className="text-slate-400 font-bold uppercase tracking-widest text-xs">دعم فني</div>
          </div>
        </div>
      </section>

      {/* 4. بلاصة الفيديو */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-black mb-12 text-slate-900">شوف كيفاش كنسهلو المأمورية</h2>
          <div className="relative group cursor-pointer aspect-video rounded-[3rem] overflow-hidden shadow-2xl border-[12px] border-white">
            <div className="absolute inset-0 bg-blue-900/20 group-hover:bg-blue-900/10 transition-all z-10"></div>
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="w-24 h-24 bg-white/90 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                <div className="w-0 h-0 border-t-[15px] border-t-transparent border-l-[25px] border-l-blue-600 border-b-[15px] border-b-transparent translate-x-1"></div>
              </div>
            </div>
            <img 
              src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=2070" 
              alt="Medical AI" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </div>
        </div>
      </section>

      {/* 5. زر التسجيل النهائي */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto bg-blue-600 rounded-[4rem] p-16 text-center text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight">واجد تولي طبيب عصري؟</h2>
            <p className="text-xl text-blue-100 mb-12 max-w-xl mx-auto italic">
              "انضم لأكبر شبكة ديال الأطباء فالمغرب اللي كيستعملو الذكاء الاصطناعي."
            </p>
            <Link 
              href="/join" 
              className="bg-white text-blue-600 px-12 py-5 rounded-full font-black text-2xl hover:bg-slate-100 transition-all shadow-xl inline-block"
            >
              {t('Navbar.joinButton')}
            </Link>
          </div>
          {/* Decorative Circles */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500 rounded-full opacity-50"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-700 rounded-full opacity-50"></div>
        </div>
      </section>

    </div>

    
  );
}