'use client';

import { useLocale } from 'next-intl';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Phone, Star, Clock, HeartPulse, MessageCircle } from 'lucide-react';

const content = {
  fr: {
    tabs: [
      {
        id: 0,
        title: "Via WhatsApp",
        value: "100%",
        subtitle: "rendez-vous facilités",
        icon: <MessageCircle className="w-6 h-6" />,
        content: {
          heading: "Prise de rendez-vous directe sur WhatsApp",
          description: "Plus besoin d'applications compliquées ou de sites web lourds. Vos patients ouvrent simplement WhatsApp, discutent avec l'IA en Darija et réservent leur créneau en quelques secondes.",
          imageSrc: "https://images.unsplash.com/photo-1576091160550-2173ff9e5ee5?q=80&w=2000&auto=format&fit=crop",
          tags: ["Canal favori", "Zéro installation"],
        }
      },
      {
        id: 1,
        title: "Recommandations",
        value: "24/7",
        subtitle: "assistance médicale",
        icon: <HeartPulse className="w-6 h-6" />,
        content: {
          heading: "Recommandations et suivi intelligents",
          description: "L'IA ne fait pas que prendre les rendez-vous. Elle écoute les symptômes de base en Darija, dirige vers la bonne spécialité, et prodigue des recommandations générales selon vos directives avant la consultation.",
          imageSrc: "https://images.unsplash.com/photo-1582750433449-648ed127d098?q=80&w=2000&auto=format&fit=crop",
          tags: ["Orientation intelligente", "Conseils avant visite"],
        }
      },
      {
        id: 2,
        title: "Support Patient",
        value: "90%",
        subtitle: "questions gérées",
        icon: <Phone className="w-6 h-6" />,
        content: {
          heading: "Réduisez la charge téléphonique de votre secrétaire",
          description: "Laissez l'IA gérer sur WhatsApp les questions fréquentes : horaires, documents nécessaires pour une première visite ou tarifs. Votre équipe se concentre sur les urgences.",
          imageSrc: "https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=2000&auto=format&fit=crop",
          tags: ["Réduction du stress", "Gain de 3h/jour"],
        }
      },
      {
        id: 3,
        title: "Satisfaction",
        value: "4.8/5",
        subtitle: "des patients",
        icon: <Star className="w-6 h-6" />,
        content: {
          heading: "Une expérience fluide en Darija",
          description: "Fini de patienter au téléphone. Vos patients obtiennent des réponses instantanées dans leur langue maternelle via WhatsApp, renforçant leur attachement à votre cabinet.",
          imageSrc: "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?q=80&w=2000&auto=format&fit=crop",
          tags: ["Réponse en Darija", "Sans attente"],
        }
      },
      {
        id: 4,
        title: "Efficacité",
        value: "2x",
        subtitle: "patients gérés",
        icon: <Clock className="w-6 h-6" />,
        content: {
          heading: "Optimisez l'agenda de votre clinique",
          description: "En automatisant les recommandations et la prise de rendez-vous sur WhatsApp, l'IA remplit les créneaux vides instantanément et réduit les absences non justifiées.",
          imageSrc: "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?q=80&w=2000&auto=format&fit=crop",
          tags: ["Productivité doublée", "Zéro oubli"],
        }
      }
    ]
  },
  ar: {
    tabs: [
      {
        id: 0,
        title: "واتساب",
        value: "100%",
        subtitle: "سهولة المواعيد",
        icon: <MessageCircle className="w-6 h-6" />,
        content: {
          heading: "شدو المواعيد ديريكت من الواتساب",
          description: "المرضى ديالك مغايحتاجوش تطبيقات صعيبة، كيدخلو غير للواتساب وكيهضرو مع الذكاء الاصطناعي بالدارجة وكيشدو الموعد ديالهم فثواني.",
          imageSrc: "https://images.unsplash.com/photo-1576091160550-2173ff9e5ee5?q=80&w=2000&auto=format&fit=crop",
          tags: ["أسهل طريقة", "بلا تطبيقات"],
        }
      },
      {
        id: 1,
        title: "النصائح",
        value: "24/7",
        subtitle: "متابعة واستشارة",
        icon: <HeartPulse className="w-6 h-6" />,
        content: {
          heading: "توجيه ذكي ونصائح قبل الزيارة",
          description: "الذكاء الاصطناعي ماشي غير كيشد المواعيد، كيقدر يسول على الأعراض بالدارجة ويوجه المريض ويعطيه نصائح وإرشادات قبل ما يوصل للعيادة.",
          imageSrc: "https://images.unsplash.com/photo-1582750433449-648ed127d098?q=80&w=2000&auto=format&fit=crop",
          tags: ["توجيه دقيق", "عناية مستمرة"],
        }
      },
      {
        id: 2,
        title: "مساعدة",
        value: "90%",
        subtitle: "إجابات فورية",
        icon: <Phone className="w-6 h-6" />,
        content: {
          heading: "نقصو الضغط على السكرتاريا",
          description: "الذكاء الاصطناعي كيتكلف عبر الواتساب بالأسئلة المتكررة بحال أوقات العمل والوثائق المطلوبة، باش الفريق ديالك يركز على الحالات المستعجلة.",
          imageSrc: "https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=2000&auto=format&fit=crop",
          tags: ["راحة بال", "وقت كافي"],
        }
      },
      {
        id: 3,
        title: "الرضى",
        value: "4.8/5",
        subtitle: "من عند المرضى",
        icon: <Star className="w-6 h-6" />,
        content: {
          heading: "تجربة ساهلة وبالدارجة",
          description: "وداعا للانتظار فالتليفون. المرضى ديالك كيلقاو الأجوبة ديالهم فنفس اللحظة بالدارجة عبر الواتساب، وهادشي كيزيد ثقتهم فالعيادة.",
          imageSrc: "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?q=80&w=2000&auto=format&fit=crop",
          tags: ["خدمة سريعة", "بالدارجة"],
        }
      },
      {
        id: 4,
        title: "الفعالية",
        value: "2x",
        subtitle: "عدد المرضى",
        icon: <Clock className="w-6 h-6" />,
        content: {
          heading: "تنظيم الأجندة ديال العيادة",
          description: "منين الذكاء الاصطناعي كيأكد المواعيد وكيوجه المرضى فالواتساب، الأجندة كتعمر مزيان وكينقصو الناس لي مكيحضروش للموعد ديالهوم.",
          imageSrc: "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?q=80&w=2000&auto=format&fit=crop",
          tags: ["مضاعفة العمل", "تنظيم ممتاز"],
        }
      }
    ]
  },
  en: {
    tabs: [
      {
        id: 0,
        title: "Via WhatsApp",
        value: "100%",
        subtitle: "easy booking",
        icon: <MessageCircle className="w-6 h-6" />,
        content: {
          heading: "Direct Appointment Booking on WhatsApp",
          description: "No need for complicated apps. Your patients simply open WhatsApp, chat with the AI in Darija, and book their slot in seconds.",
          imageSrc: "https://images.unsplash.com/photo-1576091160550-2173ff9e5ee5?q=80&w=2000&auto=format&fit=crop",
          tags: ["Favorite App", "Zero Config"],
        }
      },
      {
        id: 1,
        title: "Advice",
        value: "24/7",
        subtitle: "medical triage",
        icon: <HeartPulse className="w-6 h-6" />,
        content: {
          heading: "Smart Recommendations & Triage",
          description: "The AI goes beyond booking. It listens to symptoms in Darija, directs to the right specialty, and provides necessary pre-consultation medical recommendations.",
          imageSrc: "https://images.unsplash.com/photo-1582750433449-648ed127d098?q=80&w=2000&auto=format&fit=crop",
          tags: ["Smart Triage", "Pre-advice"],
        }
      },
      {
        id: 2,
        title: "Support",
        value: "90%",
        subtitle: "queries handled",
        icon: <Phone className="w-6 h-6" />,
        content: {
          heading: "Reduce Phone Stress for your Staff",
          description: "Let the AI handle repetitive questions on WhatsApp like working hours or required documents, allowing your secretary to focus on human care.",
          imageSrc: "https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=2000&auto=format&fit=crop",
          tags: ["Less Stress", "Save 3h/day"],
        }
      },
      {
        id: 3,
        title: "Satisfaction",
        value: "4.8/5",
        subtitle: "patient ratings",
        icon: <Star className="w-6 h-6" />,
        content: {
          heading: "A Seamless Experience in Darija",
          description: "No more waiting on hold. Your patients get instant answers in their native language over WhatsApp, boosting your clinic's reputation.",
          imageSrc: "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?q=80&w=2000&auto=format&fit=crop",
          tags: ["Darija Native", "Zero Wait"],
        }
      },
      {
        id: 4,
        title: "Efficiency",
        value: "2x",
        subtitle: "patients managed",
        icon: <Clock className="w-6 h-6" />,
        content: {
          heading: "Optimize your Clinic's Schedule",
          description: "By automating booking and recommendations on WhatsApp, the AI fills empty slots instantly and reduces no-shows significantly.",
          imageSrc: "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?q=80&w=2000&auto=format&fit=crop",
          tags: ["Double Productivity", "No Empty Slots"],
        }
      }
    ]
  }
};

export const Stats = () => {
  const locale = useLocale();
  const t = content[locale as keyof typeof content] || content.en;
  const isArabic = locale === 'ar';

  const [activeTab, setActiveTab] = useState(0);

  return (
    <section className="py-24 bg-white" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-6">

        {/* Tab Switcher */}
        <div className="flex flex-nowrap overflow-x-auto hide-scrollbar border-b border-gray-100 justify-between items-end mb-16 pb-2" style={{ flexDirection: isArabic ? 'row-reverse' : 'row' }}>
          {t.tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group relative flex-1 text-center pb-6 px-4 transition-all duration-300 min-w-[180px] shrink-0 ${isActive ? 'opacity-100' : 'opacity-50 hover:opacity-100 hover:bg-slate-50'
                  }`}
              >
                <div className={`text-sm font-semibold mb-2 transition-colors duration-300 ${isActive ? 'text-[#0077b6]' : 'text-gray-500 group-hover:text-gray-900'}`}>
                  {tab.title}
                </div>
                <div className={`text-4xl md:text-5xl font-black mb-2 ${isActive ? 'text-[#00b4d8]' : 'text-gray-900'}`}>
                  {tab.value}
                </div>
                <div className="text-sm text-gray-400 font-medium">
                  {tab.subtitle}
                </div>

                {/* Active Indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-[#0077b6]"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="min-h-[500px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="grid md:grid-cols-2 gap-12 items-center"
            >
              <div className="space-y-6" style={{ textAlign: isArabic ? 'right' : 'left' }}>
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
                  {t.tabs[activeTab].content.heading}
                </h2>
                <p className="text-xl text-gray-500 leading-relaxed">
                  {t.tabs[activeTab].content.description}
                </p>
                <div className="pt-6">
                  <div className={`flex items-center gap-4 text-2xl font-bold text-[#0077b6] ${isArabic ? 'flex-row-reverse justify-end' : ''}`}>
                    {t.tabs[activeTab].value} <span className="text-lg text-gray-400 font-medium">{t.tabs[activeTab].subtitle}</span>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="relative rounded-[2rem] overflow-hidden aspect-[4/3] shadow-[0_20px_50px_rgba(0,119,182,0.15)] bg-gray-100">
                  <img
                    src={t.tabs[activeTab].content.imageSrc}
                    alt={t.tabs[activeTab].content.heading}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>

                  <div className={`absolute bottom-6 flex flex-col gap-3 ${isArabic ? 'right-6' : 'left-6'} items-${isArabic ? 'end' : 'start'}`}>
                    <motion.div
                      initial={{ opacity: 0, x: isArabic ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="bg-[#0077b6]/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 w-fit shadow-lg"
                      dir={isArabic ? 'rtl' : 'ltr'}
                    >
                      <MessageCircle className="w-4 h-4" />
                      {t.tabs[activeTab].content.tags[0]}
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: isArabic ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                      className="bg-white/90 backdrop-blur-sm text-[#0077b6] px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 w-fit shadow-lg"
                      dir={isArabic ? 'rtl' : 'ltr'}
                    >
                      <HeartPulse className="w-4 h-4" />
                      {t.tabs[activeTab].content.tags[1]}
                    </motion.div>
                  </div>
                </div>
                <div className={`absolute -z-10 top-1/2 -translate-y-1/2 w-64 h-64 bg-[#90e0ef] rounded-full blur-[80px] opacity-40 ${isArabic ? 'left-0 -translate-x-1/3' : 'right-0 translate-x-1/3'}`}></div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
};