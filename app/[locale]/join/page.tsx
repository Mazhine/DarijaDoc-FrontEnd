import { useTranslations } from 'next-intl';

export default function JoinDoctor() {
  const t = useTranslations('Join');

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-700 mb-2">{t('title')}</h1>
        <p className="text-slate-600 mb-10">{t('subtitle')}</p>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Form */}
          <form className="bg-white p-8 rounded-2xl shadow-sm border space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">{t('name')}</label>
              <input type="text" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t('speciality')}</label>
              <input type="text" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t('city')}</label>
              <input type="text" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t('maps')}</label>
              <input type="url" placeholder="https://goo.gl/maps/..." className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition">
              {t('submit')}
            </button>
          </form>

          {/* Benefits */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold">{t('benefits_title')}</h2>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">✅ <span>{t('b1')}</span></li>
              <li className="flex items-center gap-3">✅ <span>{t('b2')}</span></li>
              <li className="flex items-center gap-3">✅ <span>{t('b3')}</span></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}