'use client';

import { useLocale } from 'next-intl';

const content = {
  fr: {
    title: 'Politique de confidentialite',
    body1:
      "Cette page est en cours de formalisation juridique. DarijaDoc protege les donnees des patients et des cabinets avec des controles d'acces stricts, une journalisation des actions et des mesures de securite adaptees.",
    body2:
      "Pour recevoir la version complete de la politique de confidentialite et du traitement des donnees, contactez l'equipe a l'adresse suivante:",
  },
  en: {
    title: 'Privacy Policy',
    body1:
      'This page is being finalized from a legal standpoint. DarijaDoc protects patient and clinic data with strict access controls, action logging, and adapted security measures.',
    body2:
      'To receive the full privacy policy and data processing terms, contact the team at the address below:',
  },
  ar: {
    title: 'سياسة الخصوصية',
    body1:
      'هذه الصفحة قيد الإعداد القانوني. DarijaDoc تحمي بيانات المرضى والعيادات من خلال صلاحيات صارمة، وتسجيل للعمليات، وإجراءات أمنية مناسبة.',
    body2:
      'للحصول على النسخة الكاملة من سياسة الخصوصية ومعالجة البيانات، تواصل مع الفريق على العنوان التالي:',
  },
} as const;

export default function PrivacyPage() {
  const locale = useLocale();
  const copy = content[locale as keyof typeof content] || content.en;

  return (
    <section className="min-h-screen bg-slate-950 px-6 py-28 text-slate-100">
      <div className="mx-auto max-w-4xl rounded-2xl border border-slate-800 bg-slate-900/70 p-8 md:p-12">
        <h1 className="text-3xl font-semibold md:text-4xl">{copy.title}</h1>
        <p className="mt-6 text-slate-300">{copy.body1}</p>
        <p className="mt-4 text-slate-300">
          {copy.body2}
          <a className="ml-2 text-cyan-200 underline" href="mailto:hello@darijadoc.ma">
            hello@darijadoc.ma
          </a>
        </p>
      </div>
    </section>
  );
}
