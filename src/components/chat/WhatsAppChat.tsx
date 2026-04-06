'use client';

import { useEffect, useRef, useState } from 'react';
import { useLocale } from 'next-intl';

const content = {
    fr: {
        tag: "Expérience Interactive",
        title: "Le premier assistant médical sur WhatsApp.",
        subtitle: "Laissez l'IA gérer vos rendez-vous aussi naturellement qu'un humain. Plus de temps perdu, plus d'appels manqués. Regardez la démonstration ci-contre.",
        secure: "Les messages et les appels sont chiffrés de bout en bout.",
        input: "Message",
        online: "en ligne",
        messages: [
            { id: 1, sender: "them", text: "Bienvenue ! Vous cherchez à automatiser les rendez-vous de votre clinique ?", time: "10:42" },
            { id: 2, sender: "me", text: "Oui ! Mais je veux que ça soit très naturel en Darija.", time: "10:45" },
            { id: 3, sender: "them", text: "Nous gérons la planification automatiquement 24/7.", time: "10:46" },
            { id: 4, sender: "me", text: "Génial. Est-ce que ça s'intègre à mon calendrier existant ?", time: "10:52" },
            { id: 5, sender: "them", text: "Absolument. Aucune migration logicielle, prêt à l'emploi.", time: "10:55" },
            { id: 6, sender: "me", text: "Ça a l'air de faire gagner un temps fou à mon équipe !", time: "10:58" }
        ]
    },
    ar: {
        tag: "تجربة تفاعلية",
        title: "أول مساعد طبي على الواتساب.",
        subtitle: "خلي الذكاء الاصطناعي يتكلف بالمواعيد ديالك بحال شي إنسان. متبقاش تضيع الوقت والمكالمات. شوف الديمو هنا.",
        secure: "الرسائل والمكالمات مشفرة من طرف إلى طرف لحمايتك.",
        input: "رسالة",
        online: "متصل الآن",
        messages: [
            { id: 1, sender: "them", text: "مرحباً بيك! واش بغيتي تنظم المواعيد ديال العيادة ديالك أوتوماتيكياً؟", time: "10:42" },
            { id: 2, sender: "me", text: "أه! ولكن بغيت ديك الهضرة تكون طبيعية بالدارجة.", time: "10:45" },
            { id: 3, sender: "them", text: "حنا كنتكلفو بالمواعيد أوتوماتيكيا 24/7 بلا ما تبرزط.", time: "10:46" },
            { id: 4, sender: "me", text: "مزيان بزاف. واش كيتلصق مع الأجندة لي خدام بيها دابا؟", time: "10:52" },
            { id: 5, sender: "them", text: "تماما. ماكاين لا تبدال برامج لا والو، كولشي واجد للاستعمال.", time: "10:55" },
            { id: 6, sender: "me", text: "هادشي غيوفر بزاف دالوقت للفريق ديالي!", time: "10:58" }
        ]
    },
    en: {
        tag: "Interactive Experience",
        title: "The first medical assistant on WhatsApp.",
        subtitle: "Let AI handle your appointments as naturally as a human. No more wasted time, no more missed calls. See the demo below.",
        secure: "Messages and calls are end-to-end encrypted.",
        input: "Message",
        online: "online",
        messages: [
            { id: 1, sender: "them", text: "Welcome! Are you looking to automate your clinic's appointments?", time: "10:42 AM" },
            { id: 2, sender: "me", text: "Yes! But I want it to sound perfectly natural in Darija.", time: "10:45 AM" },
            { id: 3, sender: "them", text: "We handle scheduling and triage automatically 24/7.", time: "10:46 AM" },
            { id: 4, sender: "me", text: "Amazing. Does it integrate with my existing calendar?", time: "10:52 AM" },
            { id: 5, sender: "them", text: "Seamlessly. No migrating software, just plug and play.", time: "10:55 AM" },
            { id: 6, sender: "me", text: "This sounds like it will save my team countless hours.", time: "10:58 AM" }
        ]
    }
};

function WhatsAppBubble({ message, index, startAnimation, isArabic }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (startAnimation) {
            const timeout = setTimeout(() => {
                setIsVisible(true);
            }, index * 800 + 400);
            return () => clearTimeout(timeout);
        }
    }, [startAnimation, index]);

    const isSender = message.sender === 'me';

    return (
        <div
            className={`flex w-full mb-3 relative transition-all duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] transform ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-95'
                } ${isSender ? 'justify-end' : 'justify-start'}`}
            dir={isArabic ? 'rtl' : 'ltr'}
        >
            <div className={`relative max-w-[85%] flex flex-col ${isSender ? 'items-end' : 'items-start'}`}>
                <div
                    className={`px-3 pt-2 pb-1.5 rounded-[12px] shadow-sm flex flex-col gap-1 ${isSender
                        ? 'bg-[#0077b6] text-white rounded-tr-[2px]'
                        : 'bg-[#202c33] text-[#e9edef] rounded-tl-[2px]'
                        } ${isSender ? 'items-end' : 'items-start'}`}
                >
                    <span className="text-[14.5px] leading-[21px] font-medium tracking-wide" style={{ wordBreak: 'break-word', textAlign: isArabic ? 'right' : 'left' }}>
                        {message.text}
                    </span>
                    <div className="flex items-center gap-1 mt-0.5 opacity-80" style={{ direction: 'ltr' }}>
                        <span className="text-[10px] text-gray-300 font-semibold">{message.time}</span>
                        {isSender && (
                            <svg viewBox="0 0 16 15" width="14" height="13" className="text-[#90e0ef] ml-1">
                                <path fill="currentColor" d="M15.01 3.316l-.478-.372a.365.365 0 00-.51.063L8.666 9.88a1.32 1.32 0 01-1.923.115l-1.096-1.072a.372.372 0 00-.52 0l-.382.378a.366.366 0 00-.007.514l1.833 1.884c.594.61 1.554.605 2.14-.01l6.236-8.006a.364.364 0 00-.053-.51L15.01 3.316z" />
                                <path fill="currentColor" d="M10.154 3.316l-.477-.372a.365.365 0 00-.51.063L3.81 9.88a1.32 1.32 0 01-1.925.115L.79 8.922a.372.372 0 00-.521 0l-.38.378a.366.366 0 00-.006.514l1.832 1.884c.594.61 1.553.605 2.14-.01l6.237-8.006a.364.364 0 00-.053-.51l-.409-.327z" />
                            </svg>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function WhatsAppChat() {
    const locale = useLocale();
    const t = content[locale as keyof typeof content] || content.en;
    const isArabic = locale === 'ar';

    const [startPhoneAnim, setStartPhoneAnim] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setStartPhoneAnim(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.3 }
        );
        if (containerRef.current) observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <section
            ref={containerRef}
            className={`relative w-full min-h-screen pt-32 pb-24 flex flex-col lg:flex-row items-center justify-center gap-16 px-6 bg-white overflow-hidden ${isArabic ? 'lg:flex-row-reverse' : ''}`}
            dir={isArabic ? 'rtl' : 'ltr'}
        >
            {/* Light Blue Background Accents */}
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#00b4d8]/10 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#90e0ef]/20 rounded-full blur-[100px] pointer-events-none"></div>

            {/* Text Details Area */}
            <div className="relative z-20 flex-1 text-center lg:text-left max-w-xl" style={{ textAlign: isArabic ? 'right' : 'inherit' }}>
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00b4d8]/10 border border-[#00b4d8]/20 text-[#0077b6] text-sm font-bold tracking-widest uppercase backdrop-blur-md mb-8 transition-all duration-1000 transform ${startPhoneAnim ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    {t.tag}
                </div>
                <h1 className={`text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-[1.1] mb-6 transition-all duration-1000 delay-200 transform ${startPhoneAnim ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    {t.title}
                </h1>
                <p className={`text-lg md:text-xl text-gray-500 font-medium leading-relaxed transition-all duration-1000 delay-300 transform ${startPhoneAnim ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    {t.subtitle}
                </p>
            </div>

            {/* Phone Mockup Area */}
            <div className="flex-1 w-full max-w-[360px] perspective-[1000px] z-20" dir="ltr">
                <div
                    className={`relative mx-auto w-full h-[720px] rounded-[50px] p-[8px] border border-gray-800 transform transition-all duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[0_30px_60px_-15px_rgba(0,119,182,0.2)] ${startPhoneAnim ? 'opacity-100 translate-y-0 rotate-y-[-10deg] rotate-x-[5deg] scale-100' : 'opacity-0 translate-y-32 rotate-y-[0deg] scale-90'
                        } hover:rotate-0 hover:rotate-x-0 transition-transform`}
                    style={{
                        background: 'linear-gradient(145deg, #1a1a1a, #000000)',
                        boxShadow: 'inset 0 0 4px rgba(255,255,255,0.1), 0 50px 100px -20px rgba(0,119,182,0.2), -20px 0 50px rgba(0,119,182,0.1)',
                    }}
                >
                    {/* Hardware Notches */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-3xl z-40 flex items-center justify-center border-b border-gray-800">
                        <div className="w-12 h-1.5 bg-gray-800 rounded-full mt-1"></div>
                    </div>

                    {/* WhatsApp UI Screen inside Phone (Light Mode) */}
                    <div className="relative w-full h-full bg-[#efeae2] rounded-[42px] overflow-hidden flex flex-col shadow-inner border border-gray-200">

                        {/* WhatsApp Background Texture (Light) */}
                        <div
                            className="absolute inset-0 z-0 opacity-[0.2] pointer-events-none"
                            style={{
                                backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")',
                                backgroundRepeat: 'repeat',
                                backgroundSize: '300px'
                            }}
                        />

                        {/* WhatsApp Header (Light Mode) */}
                        <div className="relative z-20 w-full h-[65px] bg-[#0077b6] flex items-center px-4 shadow-md pt-4" dir={isArabic ? 'rtl' : 'ltr'}>
                            <div className={`flex items-center gap-3 flex-1 ${isArabic ? 'mr-2' : 'ml-2'}`}>
                                <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#0077b6] font-black text-sm shadow-sm">
                                    DA
                                </div>
                                <div className="flex-1">
                                    <h1 className="text-[15px] font-semibold text-white leading-tight">DarijaDoc AI</h1>
                                    <span className="text-[11px] text-[#90e0ef] font-medium">{t.online}</span>
                                </div>
                            </div>
                        </div>

                        {/* Chat Flow Scroll Area */}
                        <div className="relative z-10 flex-1 w-full flex flex-col px-4 py-4 overflow-y-auto hide-scrollbar">

                            {/* Security Tag (Light Mode) */}
                            <div className="flex justify-center mb-6 mt-2">
                                <div className="bg-[#fefce8] px-3 py-1.5 rounded-[10px] text-center shadow-sm max-w-[90%]">
                                    <p className="text-[11px] text-yellow-600 font-medium leading-tight">
                                        {t.secure}
                                    </p>
                                </div>
                            </div>

                            {t.messages.map((msg, index) => (
                                <WhatsAppBubble key={msg.id} message={msg} index={index} startAnimation={startPhoneAnim} isArabic={isArabic} />
                            ))}

                        </div>

                        {/* WhatsApp Input Footer (Light Mode) */}
                        <div className="relative z-20 w-full bg-[#f0f2f5] p-2 flex items-center gap-2 pb-4" dir={isArabic ? 'rtl' : 'ltr'}>
                            <div className="flex-1 bg-white rounded-full min-h-[40px] px-4 flex items-center shadow-sm border border-gray-200">
                                <span className="text-gray-400 text-[14px]">{t.input}</span>
                            </div>
                            <div className="w-[40px] h-[40px] bg-[#0077b6] rounded-full flex items-center justify-center shadow-md shrink-0">
                                <svg viewBox="0 0 24 24" width="20" height="20" className="text-white">
                                    <path fill="currentColor" d="M11.999 14.942c2.001 0 3.531-1.53 3.531-3.531V4.35c0-2.001-1.53-3.531-3.531-3.531S8.469 2.35 8.469 4.35v7.061c0 2.001 1.53 3.531 3.53 3.531zm6.238-3.53c0 3.531-2.942 6.002-6.237 6.002s-6.237-2.471-6.237-6.002H3.761c0 4.001 3.178 7.297 7.061 7.885v3.884h2.354v-3.884c3.884-.588 7.061-3.884 7.061-7.885h-2.002z"></path>
                                </svg>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

        </section>
    );
}
