'use client';
import { useLocale } from 'next-intl';

const content = {
    fr: {
        title: "Contactez-nous",
        subtitle: "Une question ou besoin d'une démonstration ? Notre équipe est à votre disposition.",
        name: "Nom complet",
        phoneField: "Numéro de téléphone",
        call_date: "Date et heure souhaitées pour l'appel",
        email: "Adresse e-mail",
        message: "Votre message",
        submit: "Envoyer le message",
        info_title: "Nos coordonnées",
        info_desc: "Nous sommes toujours prêts à discuter de la manière dont DarijaDoc peut transformer votre clinique.",
        address: "Casablanca, Maroc",
        phone: "+212 6 00 00 00 00",
        mail: "contact@darijadoc.ai",
        success_title: "Message Envoyé !",
        success_desc: "Merci pour votre message. Nous vous répondrons dans les plus brefs délais.",
        success_btn: "Envoyer un autre message"
    },
    ar: {
        title: "تواصل معانا",
        subtitle: "عندك شي سؤال ولا بغيتي تشوف ديمو؟ الفريق ديالنا موجود باش يجاوبك.",
        name: "الاسم الكامل",
        phoneField: "رقم الهاتف",
        call_date: "النهار لي بغيتي نعيطو ليك فيه",
        email: "البريد الإلكتروني",
        message: "الرسالة ديالك",
        submit: "صيفط الرسالة",
        info_title: "معلومات التواصل",
        info_desc: "حنا ديما مستعدين نتناقشو معاك كيفاش DarijaDoc يقدر يطور العيادة ديالك.",
        address: "الدار البيضاء، المغرب",
        phone: "+212 6 00 00 00 00",
        mail: "contact@darijadoc.ai",
        success_title: "تم الإرسال!",
        success_desc: "شكراً على رسالتك. غادي نجاوبوك فـ أقرب وقت ممكن.",
        success_btn: "صيفط رسالة أخرى"
    },
    en: {
        title: "Contact Us",
        subtitle: "Have a question or need a demo? Our team is available to help.",
        name: "Full Name",
        phoneField: "Phone Number",
        call_date: "Preferred date and time for a call",
        email: "Email Address",
        message: "Your Message",
        submit: "Send Message",
        info_title: "Contact Info",
        info_desc: "We are always ready to discuss how DarijaDoc can transform your clinic.",
        address: "Casablanca, Morocco",
        phone: "+212 6 00 00 00 00",
        mail: "contact@darijadoc.ai",
        success_title: "Message Sent!",
        success_desc: "Thank you for your message. We will reply to you as soon as possible.",
        success_btn: "Send another message"
    }
};

export default function Contact() {
    const locale = useLocale();
    const t = content[locale as keyof typeof content] || content.en;
    const isArabic = locale === 'ar';

    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-24 px-6" dir={isArabic ? 'rtl' : 'ltr'}>
            <div className="max-w-5xl mx-auto">

                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-[#0077b6]/10 text-[#0077b6] text-sm font-black mb-6 border border-[#0077b6]/20">
                        Contact
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">{t.title}</h1>
                    <p className="text-lg text-gray-500 font-medium max-w-2xl mx-auto">{t.subtitle}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-16 items-start">

                    {/* Contact Info */}
                    <div className="space-y-8 order-2 md:order-1">
                        <h2 className="text-2xl font-bold text-gray-900">{t.info_title}</h2>
                        <p className="text-gray-600 leading-relaxed font-medium">{t.info_desc}</p>

                        <div className="space-y-6 pt-4">
                            <div className="flex items-center gap-4 text-gray-900 font-medium">
                                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center shrink-0">
                                    <svg className="w-5 h-5 text-[#0077b6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                </div>
                                <span>{t.address}</span>
                            </div>
                            <div className="flex items-center gap-4 text-gray-900 font-medium">
                                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center shrink-0">
                                    <svg className="w-5 h-5 text-[#0077b6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                </div>
                                <span dir="ltr">{t.phone}</span>
                            </div>
                            <div className="flex items-center gap-4 text-gray-900 font-medium">
                                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center shrink-0">
                                    <svg className="w-5 h-5 text-[#0077b6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                </div>
                                <span>{t.mail}</span>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="order-1 md:order-2">
                        <form className="bg-white p-8 md:p-10 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 space-y-5 relative overflow-hidden" onSubmit={(e) => { e.preventDefault(); alert(t.success_title); }}>
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#00b4d8] to-[#0077b6]"></div>

                            <div>
                                <label className="block text-sm font-bold mb-2 text-gray-700">{t.name}</label>
                                <input required type="text" className="w-full p-4 bg-slate-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent outline-none text-gray-900 transition-all box-border" />
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-2 text-gray-700">{t.phoneField}</label>
                                <input required type="tel" dir="ltr" className={`w-full p-4 bg-slate-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent outline-none text-gray-900 transition-all box-border ${isArabic ? 'text-right' : ''}`} />
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-2 text-gray-700">{t.email}</label>
                                <input required type="email" dir="ltr" className={`w-full p-4 bg-slate-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent outline-none text-gray-900 transition-all box-border ${isArabic ? 'text-right' : ''}`} />
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-2 text-gray-700">{t.call_date}</label>
                                <input required type="datetime-local" dir="ltr" className={`w-full p-4 bg-slate-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent outline-none text-gray-900 transition-all box-border ${isArabic ? 'text-right' : ''}`} />
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-2 text-gray-700">{t.message}</label>
                                <textarea required rows={4} className="w-full p-4 bg-slate-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent outline-none text-gray-900 transition-all box-border resize-none"></textarea>
                            </div>

                            <button type="submit" className="w-full bg-[#0077b6] text-white py-4 mt-2 rounded-xl font-bold text-lg hover:bg-[#00b4d8] transition-colors shadow-md shadow-[#0077b6]/20">
                                {t.submit}
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
}
