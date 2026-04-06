import { useTranslations } from 'next-intl';
import LanguageSwitcher from '../../components/home/LanguageSwitcher';

export default function HomePage() {
  const nav = useTranslations('Navbar');
  const hero = useTranslations('Hero');
  const feat = useTranslations('Features');
  const stats = useTranslations('Stats');

  return (
    <div className="min-h-screen bg-white selection:bg-blue-100">
      {/* HEADER */}
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="text-2xl font-black text-blue-600 tracking-tighter">DarijaDoc<span className="text-slate-300">AI</span></div>
          <nav className="hidden md:flex gap-8 text-sm font-bold text-slate-600 uppercase tracking-widest">
            <a href="#" className="hover:text-blue-600 transition">{nav('home')}</a>
            <a href="#features" className="hover:text-blue-600 transition">{nav('features')}</a>
            <a href="/join" className="hover:text-blue-600 transition">{nav('join')}</a>
          </nav>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <button className="bg-blue-600 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200">
              {hero('cta')}
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="pt-40 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-sm font-bold mb-6 ring-1 ring-blue-100">
            ✨ أول مساعد طبي بالدارجة في المغرب
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 leading-[1.1]">
            {hero('title')}
          </h1>
          <p className="text-xl text-slate-500 mb-12 max-w-2xl mx-auto leading-relaxed">
            {hero('description')}
          </p>
          <button className="bg-green-500 hover:bg-green-600 text-white text-xl font-black py-6 px-12 rounded-3xl shadow-2xl transition-all hover:scale-105 active:scale-95">
            {hero('cta')} 💬
          </button>
        </div>
      </section>

      {/* STATS */}
      <section className="py-12 bg-slate-900">
        <div className="max-w-5xl mx-auto grid grid-cols-2 gap-8 text-center">
          <div>
            <div className="text-4xl font-black text-blue-400 mb-2">{stats('cities')}</div>
            <div className="text-slate-400 text-sm uppercase font-bold tracking-widest">التغطية</div>
          </div>
          <div>
            <div className="text-4xl font-black text-blue-400 mb-2">{stats('doctors')}</div>
            <div className="text-slate-400 text-sm uppercase font-bold tracking-widest">طبيب منخرط</div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-32 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { icon: "🗣️", title: feat('darija'), desc: "كنفهمو الهضرة ديالنا العادية، بلا ما تعذب راسك بالفرنسية." },
            { icon: "📍", title: feat('gps'), desc: "صيفط لوكاسيون، وحنا نوريك أقرب طبيب ليك بالكيلومتر." },
            { icon: "📅", title: feat('booking'), desc: "حجز موعدك أوتوماتيكياً بلا ما تبقى تسنى شكون يجاوبك." }
          ].map((f, i) => (
            <div key={i} className="group p-10 bg-white rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-3xl mb-8 group-hover:scale-110 transition-transform">{f.icon}</div>
              <h3 className="text-2xl font-black mb-4 text-slate-800">{f.title}</h3>
              <p className="text-slate-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-16 border-t bg-slate-50 text-center">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-xl font-black text-blue-600 mb-6">DarijaDoc AI</div>
          <div className="flex justify-center gap-10 text-sm font-bold text-slate-400 uppercase tracking-widest mb-10">
            <a href="/privacy" className="hover:text-blue-600 transition">Privacy</a>
            <a href="/faq" className="hover:text-blue-600 transition">FAQ</a>
            <a href="/join" className="hover:text-blue-600 transition">For Doctors</a>
          </div>
          <p className="text-slate-300 text-xs tracking-widest">© 2026 DARIJADOC AI. MADE IN MOROCCO 🇲🇦</p>
        </div>
      </footer>
    </div>
  );
}