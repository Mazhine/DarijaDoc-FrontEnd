'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { createBrowserClient } from '@supabase/ssr';

const content = {
  fr: {
    title: "Rejoignez DarijaDoc AI",
    subtitle: "Inscrivez-vous sur notre liste d'attente pour être parmi les premiers médecins à bénéficier de notre assistant IA.",
    name: "Nom complet du Docteur",
    phone: "Numéro de téléphone",
    call_date: "Date souhaitée pour l'appel",
    speciality: "Spécialité (ex: Dentiste, Généraliste...)",
    city: "Ville",
    maps: "Lien Google Maps de la clinique (Optionnel)",
    submit: "S'inscrire à la liste d'attente",
    benefits_title: "Pourquoi nous rejoindre ?",
    b1: "Automatisation 24/7 de vos rendez-vous",
    b2: "Dialecte Darija naturel et rassurant",
    b3: "Aucune installation logicielle complexe",
    success_title: "Merci Docteur !",
    success_desc: "Vos informations ont été enregistrées avec succès. Notre équipe vous contactera très prochainement.",
    success_btn: "Inscrire un autre médecin"
  },
  ar: {
    title: "سجل معانا في DarijaDoc AI",
    subtitle: "قيد سميتك فاللائحة باش تكون من الأطباء اللولين لي غيستافدو من المساعد ديالنا.",
    name: "الاسم الكامل للدكتور",
    phone: "رقم الهاتف",
    call_date: "النهار لي بغيتي نعيطو ليك فيه",
    speciality: "التخصص (مثال: طبيب أسنان، عام...)",
    city: "المدينة",
    maps: "رابط العيادة فـ خرائط جوجل (اختياري)",
    submit: "تسجيل فـ لائحة الانتظار",
    benefits_title: "علاش تسجل معانا؟",
    b1: "تنظيم المواعيد ديالك 24/7 أوتوماتيكيا",
    b2: "تواصل طبيعي ومريح بالدارجة المغربية",
    b3: "ماكاين لا تعقيدات لا برامج صعيبة",
    success_title: "شكراً دكتور!",
    success_desc: "تم تسجيل معلوماتك بنجاح. الفريق ديالنا غادي يتواصل معاك فـ أقرب وقت.",
    success_btn: "تسجيل طبيب آخر"
  },
  en: {
    title: "Join DarijaDoc AI",
    subtitle: "Join our waitlist to be among the first doctors to benefit from our AI assistant.",
    name: "Doctor's Full Name",
    phone: "Phone Number",
    call_date: "Preferred call date",
    speciality: "Specialty (e.g., Dentist, General...)",
    city: "City",
    maps: "Google Maps Link of the clinic (Optional)",
    submit: "Join the Waitlist",
    benefits_title: "Why join us?",
    b1: "24/7 appointment automation",
    b2: "Natural, reassuring Darija dialect",
    b3: "Zero complex software installation",
    success_title: "Thank you, Doctor!",
    success_desc: "Your information was successfully recorded. Our team will contact you shortly.",
    success_btn: "Register another doctor"
  }
};

export default function JoinDoctor() {
  const locale = useLocale();
  const t = content[locale as keyof typeof content] || content.en;
  const isArabic = locale === 'ar';

  const [supabase] = useState(() =>
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  );

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    call_date: '',
    speciality: '',
    city: '',
    maps: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from('doctors')
      .insert([
        {
          name: formData.name,
          phone: formData.phone,
          call_date: formData.call_date,
          specialty: formData.speciality,
          city: formData.city,
          google_maps_link: formData.maps
        }
      ]);

    setLoading(false);

    if (error) {
      console.error("Supabase Error:", error);
      alert("Error: " + error.message);
    } else {
      setSuccess(true);
      setFormData({ name: '', phone: '', call_date: '', speciality: '', city: '', maps: '' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-24 px-6" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-[#0077b6]/10 text-[#0077b6] text-sm font-black mb-6 border border-[#0077b6]/20">
            Nous Rejoindre
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">{t.title}</h1>
          <p className="text-lg text-gray-500 font-medium max-w-2xl mx-auto">{t.subtitle}</p>
        </div>

        <div className={`grid md:grid-cols-2 gap-16 items-center ${isArabic ? '' : ''}`}>

          {/* Benefits */}
          <div className="space-y-8 order-2 md:order-1">
            <h2 className="text-2xl font-bold text-gray-900">{t.benefits_title}</h2>
            <ul className="space-y-5">
              <li className="flex items-center gap-4 text-gray-700 font-medium bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="w-10 h-10 rounded-full bg-[#00b4d8]/10 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-[#0077b6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <span>{t.b1}</span>
              </li>
              <li className="flex items-center gap-4 text-gray-700 font-medium bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="w-10 h-10 rounded-full bg-[#00b4d8]/10 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-[#0077b6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <span>{t.b2}</span>
              </li>
              <li className="flex items-center gap-4 text-gray-700 font-medium bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="w-10 h-10 rounded-full bg-[#00b4d8]/10 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-[#0077b6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <span>{t.b3}</span>
              </li>
            </ul>
          </div>

          {/* Form */}
          <div className="order-1 md:order-2">
            {success ? (
              <div className="bg-[#f0fdfa] p-10 rounded-3xl border border-teal-200 text-center shadow-lg">
                <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h2 className="text-3xl font-bold text-teal-800 mb-4">{t.success_title}</h2>
                <p className="text-teal-700 font-medium mb-8 leading-relaxed">{t.success_desc}</p>
                <button onClick={() => setSuccess(false)} className="text-[#0077b6] underline font-bold hover:text-[#00b4d8] transition-colors">
                  {t.success_btn}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white p-8 md:p-10 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 space-y-6 relative overflow-hidden">

                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#0077b6] to-[#90e0ef]"></div>

                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-700">{t.name}</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-4 bg-slate-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent outline-none text-gray-900 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-700">{t.phone}</label>
                  <input
                    required
                    type="tel"
                    dir="ltr"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={`w-full p-4 bg-slate-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent outline-none text-gray-900 transition-all ${isArabic ? 'text-right' : ''}`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-700">{t.call_date}</label>
                  <input
                    required
                    type="datetime-local"
                    dir="ltr"
                    value={formData.call_date}
                    onChange={(e) => setFormData({ ...formData, call_date: e.target.value })}
                    className={`w-full p-4 bg-slate-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent outline-none text-gray-900 transition-all ${isArabic ? 'text-right' : ''}`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-700">{t.speciality}</label>
                  <input
                    required
                    type="text"
                    value={formData.speciality}
                    onChange={(e) => setFormData({ ...formData, speciality: e.target.value })}
                    className="w-full p-4 bg-slate-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent outline-none text-gray-900 transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-bold mb-2 text-gray-700">{t.city}</label>
                    <input
                      required
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full p-4 bg-slate-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent outline-none text-gray-900 transition-all"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-bold mb-2 text-gray-700">{t.maps}</label>
                    <input
                      type="url"
                      placeholder="https://goo.gl/maps/..."
                      value={formData.maps}
                      onChange={(e) => setFormData({ ...formData, maps: e.target.value })}
                      className="w-full p-4 bg-slate-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent outline-none text-gray-900 transition-all"
                    />
                  </div>
                </div>

                <button
                  disabled={loading}
                  type="submit"
                  className="w-full bg-[#0077b6] text-white py-4 mt-4 rounded-xl font-bold text-lg hover:bg-[#00b4d8] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed shadow-md shadow-[#0077b6]/20"
                >
                  {loading ? "..." : t.submit}
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}