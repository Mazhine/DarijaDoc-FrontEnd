'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale } from 'next-intl';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const content = {
    fr: {
        slides: [
            {
                id: 1,
                title: "L'Avenir de la Clinique Marocaine",
                subtitle: "Automatisez vos prises de rendez-vous avec une Intelligence Artificielle conçue sur mesure pour les médecins.",
                image: "https://images.unsplash.com/photo-1638202993928-7267aad84c31?q=80&w=2000&auto=format&fit=crop",
                cta: "Découvrir DarijaDoc"
            },
            {
                id: 2,
                title: "Disponibilité 24/7 Sans Faille",
                subtitle: "Ne ratez plus aucune urgence. Notre assistant virtuel répond au téléphone de jour comme de nuit.",
                image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=2000&auto=format&fit=crop",
                cta: "Voir les fonctionnalités"
            },
            {
                id: 3,
                title: "Une Expérience Patient 100% Darija",
                subtitle: "Vos patients échangent naturellement avec notre IA dans leur langue maternelle via WhatsApp ou par téléphone.",
                image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2000&auto=format&fit=crop",
                cta: "Essayer maintenant"
            }
        ]
    },
    ar: {
        slides: [
            {
                id: 1,
                title: "مستقبل العيادات في المغرب",
                subtitle: "نظم المواعيد ديالك أوتوماتيكيا مع ذكاء اصطناعي مصايب خصيصا للأطباء المغاربة.",
                image: "https://images.unsplash.com/photo-1638202993928-7267aad84c31?q=80&w=2000&auto=format&fit=crop",
                cta: "اكتشف DarijaDoc"
            },
            {
                id: 2,
                title: "مساعد خدام 24/7",
                subtitle: "ماتزݣل حتى شي حالة. المساعد ديالنا كيجاوب على التليفون بالليل وبالنهار.",
                image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=2000&auto=format&fit=crop",
                cta: "شوف كيفاش كيخدم"
            },
            {
                id: 3,
                title: "تجربة مريحة بالدارجة",
                subtitle: "المرضى ديالك كيتواصلو بكل راحة مع الذكاء الاصطناعي ديالنا بالدارجة المغربية.",
                image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2000&auto=format&fit=crop",
                cta: "جرب دابا"
            }
        ]
    },
    en: {
        slides: [
            {
                id: 1,
                title: "The Future of Moroccan Clinics",
                subtitle: "Automate your appointments with Artificial Intelligence tailored specifically for medical professionals.",
                image: "https://images.unsplash.com/photo-1638202993928-7267aad84c31?q=80&w=2000&auto=format&fit=crop",
                cta: "Discover DarijaDoc"
            },
            {
                id: 2,
                title: "Flawless 24/7 Availability",
                subtitle: "Never miss an emergency again. Our virtual assistant answers the phone day and night.",
                image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=2000&auto=format&fit=crop",
                cta: "See Features"
            },
            {
                id: 3,
                title: "A 100% Darija Experience",
                subtitle: "Your patients communicate naturally with our AI in their native language via WhatsApp or phone.",
                image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2000&auto=format&fit=crop",
                cta: "Try it Now"
            }
        ]
    }
};

export const HeroCarousel = () => {
    const locale = useLocale();
    const t = content[locale as keyof typeof content] || content.en;
    const isArabic = locale === 'ar';

    const [currentSlide, setCurrentSlide] = useState(0);

    // Auto-play interval
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev === t.slides.length - 1 ? 0 : prev + 1));
        }, 5000);
        return () => clearInterval(timer);
    }, [t.slides.length]);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev === t.slides.length - 1 ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev === 0 ? t.slides.length - 1 : prev - 1));
    };

    return (
        <div className="relative w-full h-[85vh] lg:h-[95vh] overflow-hidden bg-[#031525]" dir={isArabic ? 'rtl' : 'ltr'}>
            <AnimatePresence initial={false}>
                <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.8 } }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="absolute inset-0 w-full h-full"
                >
                    {/* Background Image */}
                    <div className="absolute inset-0">
                        <img
                            src={t.slides[currentSlide].image}
                            alt={t.slides[currentSlide].title}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Overlays */}
                    <div className="absolute inset-0 bg-black/40"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0077b6]/80 via-transparent to-black/30 mix-blend-multiply"></div>

                    {/* Text Content */}
                    <div className="absolute inset-0 flex items-center justify-center px-6 pt-20">
                        <div className="max-w-4xl w-full text-center">
                            <motion.div
                                initial={{ y: 30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3, duration: 0.6 }}
                            >
                                <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 tracking-tight drop-shadow-md">
                                    {t.slides[currentSlide].title}
                                </h1>
                            </motion.div>
                            <motion.div
                                initial={{ y: 30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.5, duration: 0.6 }}
                            >
                                <p className="text-lg md:text-2xl text-gray-100 font-medium leading-relaxed mb-10 max-w-3xl mx-auto drop-shadow-lg">
                                    {t.slides[currentSlide].subtitle}
                                </p>
                            </motion.div>
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.7, duration: 0.6 }}
                            >
                                <button className="bg-white text-[#0077b6] px-8 py-4 rounded-full font-bold text-lg hover:bg-[#90e0ef] transition-colors shadow-xl shadow-black/20 hover:scale-105 transform duration-300">
                                    {t.slides[currentSlide].cta}
                                </button>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation Controls */}
            <div className="absolute z-30 bottom-10 left-0 right-0 flex justify-center items-center gap-6 px-6">
                {/* Prev Button */}
                <button onClick={prevSlide} className={`w-12 h-12 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white/20 transition-all backdrop-blur-md ${isArabic ? 'rotate-180' : ''}`}>
                    <ChevronLeft className="w-6 h-6" />
                </button>

                {/* Indicators */}
                <div className="flex items-center gap-3">
                    {t.slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`h-2 rounded-full transition-all duration-300 ${currentSlide === index ? 'w-10 bg-[#00b4d8]' : 'w-2 bg-white/40'}`}
                        />
                    ))}
                </div>

                {/* Next Button */}
                <button onClick={nextSlide} className={`w-12 h-12 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white/20 transition-all backdrop-blur-md ${isArabic ? 'rotate-180' : ''}`}>
                    <ChevronRight className="w-6 h-6" />
                </button>
            </div>

        </div>
    );
};
