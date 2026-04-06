'use client';
import { useLocale } from 'next-intl';

const content = {
  fr: {
    title: "Foire Aux Questions",
    faqs: [
      { q: "Comment fonctionne l'IA ?", a: "Notre IA répond automatiquement à vos appels et messages WhatsApp 24/7, comprend les besoins des patients et prend rendez-vous dans votre calendrier sans intervention humaine." },
      { q: "Est-ce sécurisé ?", a: "Oui, totalement. Les données des patients sont cryptées et nous respectons strictement la confidentialité médicale." },
      { q: "L'IA comprend-elle vraiment la Darija ?", a: "Absolument ! L'IA a été spécialement entraînée pour comprendre les dialectes marocains, le français, et même le mélange des deux dans une même phrase." },
      { q: "Dois-je installer une application ?", a: "Aucune installation n'est requise. L'IA s'intègre directement à votre numéro WhatsApp professionnel et à votre calendrier existant (Google Calendar, etc.)." },
      { q: "Que se passe-t-il si un patient annule un rendez-vous ?", a: "L'IA libère instantanément le créneau dans votre agenda et peut proposer cette plage à d'autres patients en attente." },
      { q: "Comment l'IA gère-t-elle les urgences ?", a: "Elle est capable de repérer des mots ou des situations d'urgence et de transférer immédiatement l'appel ou de donner une consigne prioritaire selon vos instructions." },
      { q: "Puis-je l'essayer gratuitement ?", a: "Contactez notre équipe pour organiser une démonstration gratuite adaptée à votre clinique." },
    ]
  },
  ar: {
    title: "أسئلة شائعة",
    faqs: [
      { q: "كيفاش كيخدم هاد الذكاء الاصطناعي؟", a: "الذكاء الاصطناعي ديالنا كيجاوب على المكالمات و الواتساب ديالك 24/7، كيفهم شنو بغا المريض وكيدخلو الموعد نيشان فالأجندة ديالك." },
      { q: "واش هادشي آمن ومكيشوفوش الناس معلومات المرضى؟", a: "أه، مية فالمية 🔒. المعلومات ديال المرضى مشفرة وكنحتارمو السرية الطبية بشكل كامل." },
      { q: "واش كيتكلم بالدارجة مزيان؟", a: "طبعا! الذكاء الاصطناعي مدرب مزيان باش يفهم الدارجة المغربية، الفرنسية، وحتى يلا خلطهم المريض فجملة وحدة." },
      { q: "واش خصني نالي شي تطبيق معقد؟", a: "مكتحتاج تانستالي والو. النظام كيتربط نيشان مع الواتساب ديالك والأجندة باش كتخدم (بحال Google Calendar)." },
      { q: "شنو كيوقع يلا المريض لغى الموعد ديالو؟", a: "الذكاء الاصطناعي كيمسح الموعد من الأجندة ديك الساعة وتقدر يعمر ديك البلاصة بمريض آخر عندو موعد من بعد." },
      { q: "كيفاش كتعامل التكنولوجيا مع الحالات المستعجلة؟", a: "لأنظمة ديالنا مبرمجة باش تفهم الكلمات ديال الحالات المستعجلة، و غتحول المكالمة مباشرة للعيادة أو توجه المريض للمستعجلات." },
      { q: "واش نقدر نجربو فابور؟", a: "تواصل مع الفريق ديالنا باش نديرو ليك ديمو فابور ونقادوه على حساب العيادة ديالك." },
    ]
  },
  en: {
    title: "Frequently Asked Questions",
    faqs: [
      { q: "How does the AI work?", a: "Our AI automatically answers calls and WhatsApp messages 24/7, understands patient needs, and books appointments directly into your calendar without human intervention." },
      { q: "Is it secure?", a: "Yes, absolutely. Patient data is encrypted and we strictly adhere to medical confidentiality standards." },
      { q: "Does the AI truly understand Darija?", a: "Yes! The AI has been specifically trained to understand Moroccan dialects, French, and even a mix of both in the same sentence." },
      { q: "Do I need to install any complex software?", a: "No installation required. The system integrates directly with your business WhatsApp and your existing calendar." },
      { q: "What happens if a patient cancels their appointment?", a: "The AI instantly frees up that time slot in your calendar and can offer it to other patients on your waitlist." },
      { q: "How does the AI handle medical emergencies?", a: "It is programmed to recognize keywords associated with emergencies and can instantly transfer the call or provide specific guidance based on your instructions." },
      { q: "Can I try it for free?", a: "Contact our team to set up a free demonstration customized for your clinic." },
    ]
  }
};

export default function FAQ() {
  const locale = useLocale();
  const t = content[locale as keyof typeof content] || content.en;
  const isArabic = locale === 'ar';

  return (
    <div className="min-h-screen bg-white" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="pt-32 pb-24 px-6 max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className={`inline-flex items-center justify-center px-4 py-2 rounded-full bg-[#0077b6]/10 text-[#0077b6] text-sm font-black mb-6 border border-[#0077b6]/20`}>
            FAQ
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">{t.title}</h1>
        </div>

        <div className="space-y-6">
          {t.faqs.map((item, index) => (
            <div key={index} className="border border-gray-100 rounded-2xl p-6 md:p-8 bg-slate-50 shadow-sm hover:shadow-md hover:border-[#00b4d8]/30 transition-all duration-300">
              <h3 className="font-bold text-xl text-gray-900 mb-3">{item.q}</h3>
              <p className="text-gray-500 font-medium leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}