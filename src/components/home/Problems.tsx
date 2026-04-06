'use client';
import { useLocale } from 'next-intl';

const content = {
  fr: {
    mainTitle: "Les cabinets médicaux marocains perdent jusqu'à 30% de leurs appels quotidiens.",
    items: [
      {
        title: "Le secrétariat saturé ☎️",
        desc: "Lignes constamment occupées, appelants sur liste d'attente. Vos secrétaires sont interrompues sans cesse. Désormais, vos patients prennent rendez-vous par un simple message WhatsApp.",
        icon: "📞",
        color: "border-t-[#0077b6]", bg: "bg-[#0077b6]/10"
      },
      {
        title: "Absence de Triage Intelligent 📊",
        desc: "Les patients arrivent souvent sans savoir ce qu'ils doivent préparer. Notre IA WhatsApp les écoute, identifie leurs symptômes, et leur donne des recommandations de préparation avant la consultation.",
        icon: "🩺",
        color: "border-t-[#00b4d8]", bg: "bg-[#00b4d8]/10"
      },
      {
        title: "Les urgences de nuit 🌙",
        desc: "La clinique est fermée et un patient nécessite assistance ? L'assistant WhatsApp reste virtuellement ouvert 24/7 pour rassurer le patient ou transférer l'urgence.",
        icon: "🌙",
        color: "border-t-[#90e0ef]", bg: "bg-[#90e0ef]/20"
      }
    ]
  },
  ar: {
    mainTitle: "العيادات فالمغرب كتضيع حتى ل 30% من المكالمات كل نهار.",
    items: [
      {
        title: "السكرتاريا ديما مشغولة ☎️",
        desc: "الخط ديما مشغول، والمرضى كيتسناو بزاف. السكرتيرة كتقطع خدمتها باش تجاوب. دابا المرضى يقدروا يشدوا موعد غير بميساج فالواتساب بلا صداع.",
        icon: "📞",
        color: "border-t-[#0077b6]", bg: "bg-[#0077b6]/10"
      },
      {
        title: "غياب التوجيه الطبي 📊",
        desc: "المرضى غالبا كيجيو بلا مايعرفو شنو يوجدو للزيارة. الذكاء الاصطناعي ديالنا فالواتساب كيسمع للأعراض ديالهم، وكيعطيهم توجيهات ونصائح قبل ما يشوفو الطبيب.",
        icon: "🩺",
        color: "border-t-[#00b4d8]", bg: "bg-[#00b4d8]/10"
      },
      {
        title: "حالات الطوارئ بالليل 🌙",
        desc: "العيادة سادة وكاين مريض محتاج مساعدة؟ المساعد ديال الواتساب كيبقى خدام 24/7 باش يطمن المريض و يوجه الحالات المستعجلة ليكم.",
        icon: "🌙",
        color: "border-t-[#90e0ef]", bg: "bg-[#90e0ef]/20"
      }
    ]
  },
  en: {
    mainTitle: "Moroccan clinics lose up to 30% of their daily patient calls.",
    items: [
      {
        title: "Overwhelmed secretaries ☎️",
        desc: "Constantly busy lines. Your secretaries are interrupted while managing the clinic. Now, your patients can book appointments with a simple WhatsApp message.",
        icon: "📞",
        color: "border-t-[#0077b6]", bg: "bg-[#0077b6]/10"
      },
      {
        title: "No Intelligent Triage 📊",
        desc: "Patients often arrive unprepared. Our WhatsApp AI listens to their symptoms, identifies priorities, and gives them medical recommendations before the visit.",
        icon: "🩺",
        color: "border-t-[#00b4d8]", bg: "bg-[#00b4d8]/10"
      },
      {
        title: "Nighttime emergencies 🌙",
        desc: "The clinic is closed but a patient needs help? The WhatsApp assistant stays open 24/7 to reassure the patient or transfer real emergencies.",
        icon: "🌙",
        color: "border-t-[#90e0ef]", bg: "bg-[#90e0ef]/20"
      }
    ]
  }
};

export const Problems = () => {
  const locale = useLocale();
  const t = content[locale as keyof typeof content] || content.en;
  const isArabic = locale === 'ar';

  return (
    <section className="py-24 bg-white px-6 w-full" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="max-w-6xl mx-auto text-center font-sans">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-20 leading-tight tracking-tighter">
          {t.mainTitle}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left" style={{ textAlign: isArabic ? 'right' : 'left' }}>
          {t.items.map((item, i) => (
            <div key={i} className={`bg-white p-10 rounded-[2.5rem] border-t-8 ${item.color} shadow-[0_15px_40px_rgba(0,119,182,0.1)] hover:shadow-[0_20px_50px_rgba(0,119,182,0.15)] hover:-translate-y-1 transition-all duration-300 flex flex-col items-${isArabic ? 'end' : 'start'}`}>
              <div className={`w-14 h-14 ${item.bg} rounded-2xl flex items-center justify-center mb-8 text-3xl shadow-inner`}>{item.icon}</div>
              <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tighter w-full" style={{ textAlign: isArabic ? 'right' : 'left' }}>{item.title}</h3>
              <p className="text-slate-500 font-medium leading-relaxed" style={{ textAlign: isArabic ? 'right' : 'left' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};