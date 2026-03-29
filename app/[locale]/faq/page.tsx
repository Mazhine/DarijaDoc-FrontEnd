import { useTranslations } from 'next-intl';

export default function FAQ() {
  const t = useTranslations('FAQ');

  const faqs = [
    { q: t('q1'), a: t('a1') },
    { q: t('q2'), a: t('a2') },
    { q: t('q3'), a: t('a3') },
  ];

  return (
    <div className="min-h-screen py-20 px-6 max-w-3xl mx-auto">
      <h1 className="text-4xl font-extrabold text-center mb-12">{t('title')}</h1>
      <div className="space-y-4">
        {faqs.map((item, index) => (
          <div key={index} className="border rounded-xl p-6 bg-white shadow-sm hover:shadow-md transition">
            <h3 className="font-bold text-lg text-blue-600 mb-2">{item.q}</h3>
            <p className="text-slate-600 leading-relaxed">{item.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}