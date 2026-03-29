import { useTranslations } from 'next-intl';

export default function HomePage() {
  // كنعيطو على الأقسام اللي ف ملف JSON
  const nav = useTranslations('Navbar');
  const hero = useTranslations('Hero');
  const feat = useTranslations('Features');

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* --- Navigation --- */}
      <header className="flex justify-between items-center p-6 border-b bg-white sticky top-0 z-50">
        <div className="text-2xl font-black text-blue-600">DarijaDoc AI</div>
        <nav className="hidden md:flex gap-8 font-bold text-slate-600">
          <a href="#" className="hover:text-blue-600 transition">{nav('home')}</a>
          <a href="#features" className="hover:text-blue-600 transition">{nav('features')}</a>
          <a href="/join" className="hover:text-blue-600 transition text-blue-500 underline">{nav('join')}</a>
        </nav>
        <div className="flex gap-2">
           {/* هنا تقدر تزيد LanguageSwitcher من بعد */}
           <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm">
             {hero('cta')}
           </button>
        </div>
      </header>

      {/* --- Hero Section --- */}
      <section className="py-24 px-6 text-center bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 leading-tight">
            {hero('title')}
          </h1>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
            {hero('subtitle')}
          </p>
          <button className="bg-green-500 hover:bg-green-600 text-white text-xl font-black py-5 px-12 rounded-2xl shadow-2xl transition-transform hover:scale-105">
            {hero('cta')} 💬
          </button>
        </div>
      </section>

      {/* --- Features Section --- */}
      <section id="features" className="py-20 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 bg-white border rounded-3xl shadow-sm hover:shadow-md transition">
            <div className="text-4xl mb-4">🗣️</div>
            <h3 className="text-2xl font-bold mb-2">{feat('darija')}</h3>
            <p className="text-slate-500">الـ AI ديالنا كيفهم الدارجة المغربية بكل لهجاتها.</p>
          </div>
          <div className="p-8 bg-white border rounded-3xl shadow-sm hover:shadow-md transition">
            <div className="text-4xl mb-4">📍</div>
            <h3 className="text-2xl font-bold mb-2">{feat('gps')}</h3>
            <p className="text-slate-500">تحديد موقع المرضى وتوجيههم لأقرب عيادة ليك.</p>
          </div>
          <div className="p-8 bg-white border rounded-3xl shadow-sm hover:shadow-md transition">
            <div className="text-4xl mb-4">📅</div>
            <h3 className="text-2xl font-bold mb-2">{feat('booking')}</h3>
            <p className="text-slate-500">تنظيم المواعيد أوتوماتيكياً بلا ما تضيع وقتك في الهاتف.</p>
          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="py-10 border-t text-center text-slate-400 text-sm">
        <p>© 2026 DarijaDoc AI. All rights reserved.</p>
      </footer>
    </div>
  );
}