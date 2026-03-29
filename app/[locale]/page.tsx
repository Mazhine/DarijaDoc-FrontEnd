import { useTranslations } from 'next-intl';
import LanguageSwitcher from './components/LanguageSwitcher'; 

export default function HomePage({ params }: { params: { locale: string } }) {
  const tNav = useTranslations('Navbar');
  const tHero = useTranslations('Hero');
  const tFeat = useTranslations('Features');
  const tFooter = useTranslations('Footer');

  const isRTL = params.locale === 'ar';

  return (
    <div className={`min-h-screen bg-white font-sans ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* 🚀 Urgency Banner */}
      <div className="bg-blue-600 text-white text-center py-2 text-xs md:text-sm font-bold animate-pulse">
        {tHero('trust')}
      </div>

      {/* --- Navigation --- */}
      <header className="flex justify-between items-center px-6 py-5 border-b bg-white/90 backdrop-blur-md sticky top-0 z-50">
        <div className="text-2xl font-black text-blue-600 tracking-tighter shrink-0">
          DarijaDoc<span className="text-slate-300">AI</span>
        </div>
        
        <nav className="hidden md:flex gap-8 font-bold text-slate-600 uppercase text-xs tracking-widest">
          <a href="#" className="hover:text-blue-600 transition">{tNav('home')}</a>
          <a href="#features" className="hover:text-blue-600 transition">{tNav('features')}</a>
          <a href="/join" className="hover:text-blue-600 transition text-blue-500 underline">{tNav('join')}</a>
        </nav>

        <div className="flex items-center gap-4">
           <LanguageSwitcher />
           <button className="hidden sm:block bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl font-bold text-sm transition-all">
             {tHero('cta')}
           </button>
        </div>
      </header>

      {/* --- Hero Section --- */}
      <section className="py-20 px-6 text-center bg-gradient-to-b from-blue-50 to-white overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-7xl font-black text-slate-900 mb-8 leading-[1.15]">
            {tHero('title')}
          </h1>
          <p className="text-lg md:text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            {tHero('subtitle')}
          </p>

          <div className="flex flex-col items-center gap-4">
            <button className="bg-green-600 hover:bg-green-700 text-white text-xl md:text-2xl font-black py-6 px-14 rounded-[2rem] shadow-2xl transition-transform hover:scale-105 active:scale-95">
              🚀 {tHero('cta')}
            </button>
          </div>
        </div>
      </section>

      {/* --- Features Section --- */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Feature 1 */}
          <div className="p-10 bg-slate-50 rounded-[2.5rem] border border-transparent hover:border-blue-100 transition-all">
            <div className="text-5xl mb-6">📈</div>
            <h3 className="text-2xl font-black mb-4 text-slate-800">{tFeat('patients_title')}</h3>
            <p className="text-slate-500 leading-relaxed">{tFeat('patients_desc')}</p>
          </div>

          {/* Feature 2 */}
          <div className="p-10 bg-slate-50 rounded-[2.5rem] border border-transparent hover:border-blue-100 transition-all">
            <div className="text-5xl mb-6">📍</div>
            <h3 className="text-2xl font-black mb-4 text-slate-800">{tFeat('local_title')}</h3>
            <p className="text-slate-500 leading-relaxed">{tFeat('local_desc')}</p>
          </div>

          {/* Feature 3 */}
          <div className="p-10 bg-slate-50 rounded-[2.5rem] border border-transparent hover:border-blue-100 transition-all">
            <div className="text-5xl mb-6">🤖</div>
            <h3 className="text-2xl font-black mb-4 text-slate-800">{tFeat('ai_title')}</h3>
            <p className="text-slate-500 leading-relaxed">{tFeat('ai_desc')}</p>
          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="py-16 border-t bg-slate-50 text-center">
        <div className="text-xl font-black text-blue-600 mb-4">DarijaDoc AI</div>
        <p className="text-slate-400 text-sm">© 2026 DarijaDoc AI. {tFooter('rights')}</p>
      </footer>
    </div>
  );
}