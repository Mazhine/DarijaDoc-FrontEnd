'use client';
import { useState } from 'react';
import { useLocale } from 'next-intl';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const content = {
    fr: {
        title: "Questions",
        titleAccent: "fréquentes",
        desc: "Vous n'avez pas trouvé ce que vous cherchez ? ",
        link1: "Voir toutes les FAQ",
        or: " ou ",
        link2: "contactez-nous",
        desc2: ", nous serons ravis de vous aider.",
        faqs: [
            {
                question: "Qu'est-ce que DarijaDoc AI ?",
                answer: "DarijaDoc AI est un assistant vocal intelligent capable de comprendre la darija marocaine et de gérer automatiquement les appels entrants pour la prise de rendez-vous."
            },
            {
                question: "Comment DarijaDoc AI s'intègre-t-il à mes systèmes existants ?",
                answer: "Il s'intègre facilement avec la plupart des CRM et calendriers médicaux via notre API sans avoir besoin de modifier votre équipement."
            },
            {
                question: "Quels sont les avantages de DarijaDoc AI ?",
                answer: "Gagnez du temps, évitez les appels manqués, réduisez le stress administratif et offrez à vos patients une disponibilité 24/7."
            },
            {
                question: "DarijaDoc AI est-il adapté à mon secteur ?",
                answer: "Absolument. Il est initialement conçu pour les cabinets médicaux, cliniques médicales, et dentistes qui gèrent un grand volume d'appels téléphoniques pour les rendez-vous."
            }
        ]
    },
    ar: {
        title: "الأسئلة",
        titleAccent: "الشائعة",
        desc: "مالقيتيش داكشي لي كتقلب عليه؟ ",
        link1: "شوف ݣاع الأسئلة",
        or: " ولا ",
        link2: "تواصل معانا",
        desc2: "، حنا هنا باش نعاونوك.",
        faqs: [
            {
                question: "شنو هو DarijaDoc AI؟",
                answer: "DarijaDoc AI هو مساعد صوتي ذكي كيفهم الدارجة المغربية وكيقدر يجاوب على الأبيلاّت باش يشد المواعيد أوتوماتيكياً."
            },
            {
                question: "كيفاش يقدر DarijaDoc AI يخدم مع النظام لي عندي دابا؟",
                answer: "كيخدم بسهولة مع أغلب برامج تسيير العيادات والأجندة ديالتك بلا ما تحتاج تبدل حتى شي حاجة فالماتيريال ديالك."
            },
            {
                question: "شنو هما الفوائد دياله؟",
                answer: "كتربح الوقت، مكيضيعوش ليك المكالمات، كينقصلك الضغط على السكرتاريا، وكيعطي للمرضى ديالك إمكانية ياخدو موعد 24/7."
            },
            {
                question: "واش كيصلح للتخصص ديالي؟",
                answer: "تماماً، هو مديور خصوصاً للأطباء بجميع التخصصات، العيادات، وطب الأسنان لي كتجيهم مكالمات بزاف يومياً."
            }
        ]
    },
    en: {
        title: "Frequently Asked",
        titleAccent: "Questions",
        desc: "Couldn't find what you are looking for? ",
        link1: "See all FAQ",
        or: " or ",
        link2: "contact us",
        desc2: ", we will be happy to help.",
        faqs: [
            {
                question: "What is DarijaDoc AI?",
                answer: "DarijaDoc AI is an intelligent voice assistant capable of understanding Moroccan Darija and automatically handling incoming calls for appointment booking."
            },
            {
                question: "How does DarijaDoc AI integrate with my existing systems?",
                answer: "It easily integrates with most CRMs and medical calendars via our API without needing to modify your equipment."
            },
            {
                question: "What are the benefits of DarijaDoc AI?",
                answer: "Save time, avoid missed calls, reduce administrative stress, and offer your patients 24/7 availability."
            },
            {
                question: "Is DarijaDoc AI suited to my sector?",
                answer: "Absolutely. It is primarily designed for medical practices, clinics, and dentists who manage a large volume of phone calls for appointments."
            }
        ]
    }
};


export const FAQSection = () => {
    const [openIndex, setOpenIndex] = useState(0);
    const locale = useLocale();
    const t = content[locale as keyof typeof content] || content.en;
    const isArabic = locale === 'ar';

    return (
        <section className="py-24 bg-white px-6 border-t border-gray-50" dir={isArabic ? 'rtl' : 'ltr'}>
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-16 md:gap-24">

                {/* Left Side: Title */}
                <div className="flex-1 md:max-w-xs">
                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight mb-4">
                        {t.title} <span className="text-[#00b4d8]">{t.titleAccent}</span>
                    </h2>
                    <p className="text-gray-500 font-medium leading-relaxed">
                        {t.desc} <a href="/faq" className="underline hover:text-[#0077b6] transition-colors font-semibold">{t.link1}</a>{t.or}<a href="/contact" className="underline hover:text-[#0077b6] transition-colors font-semibold">{t.link2}</a>{t.desc2}
                    </p>
                </div>

                {/* Right Side: Accordion */}
                <div className="flex-[2] flex flex-col">
                    {t.faqs.map((faq, index) => {
                        const isOpen = openIndex === index;
                        return (
                            <div key={index} className="border-b border-gray-100 last:border-none">
                                <button
                                    className="w-full flex items-center justify-between py-6 group"
                                    onClick={() => setOpenIndex(isOpen ? -1 : index)}
                                >
                                    <span className={`text-[17px] font-bold ${isArabic ? 'pl-8' : 'pr-8'} text-right transition-colors ${isOpen ? 'text-[#0077b6]' : 'text-gray-900 group-hover:text-gray-600'}`} style={{ textAlign: isArabic ? 'right' : 'left' }}>
                                        {faq.question}
                                    </span>
                                    <ChevronDown className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#00b4d8]' : ''}`} />
                                </button>
                                <AnimatePresence>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                            className="overflow-hidden"
                                        >
                                            <div className="pb-6 text-gray-500 leading-relaxed font-medium" style={{ textAlign: isArabic ? 'right' : 'left' }}>
                                                {faq.answer}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
};
