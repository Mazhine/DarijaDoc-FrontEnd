export const locales = ['fr', 'en', 'ar'] as const;

export type LocaleKey = (typeof locales)[number];

export function isLocale(value: string): value is LocaleKey {
  return locales.includes(value as LocaleKey);
}

type SectionCard = {
  title: string;
  description: string;
};

type LandingContent = {
  nav: {
    features: string;
    pricing: string;
    faq: string;
    contact: string;
    cta: string;
  };
  hero: {
    badge: string;
    title: [string, string, string];
    description: string;
    primaryCta: string;
    secondaryCta: string;
    stats: [string, string][];
    proofTitle: string;
    proofList: string[];
  };
  impact: {
    eyebrow: string;
    title: string;
    description: string;
    cards: SectionCard[];
  };
  system: {
    eyebrow: string;
    title: string;
    description: string;
    cards: SectionCard[];
  };
  process: {
    eyebrow: string;
    title: string;
    description: string;
    steps: [string, string, string][];
    asideTitle: string;
    asideLabels: string[];
  };
  workspace: {
    eyebrow: string;
    title: string;
    description: string;
    cards: Array<{
      slug: 'doctor' | 'secretary' | 'admin';
      title: string;
      description: string;
      cta: string;
      bullets: string[];
    }>;
  };
  testimonials: {
    eyebrow: string;
    title: string;
    items: [string, string, string][];
  };
  pricing: {
    eyebrow: string;
    title: string;
    description: string;
    plan: string;
    price: string;
    period: string;
    threshold: string;
    includedLabel: string;
    features: string[];
  };
  faq: {
    eyebrow: string;
    title: string;
    items: [string, string][];
  };
  contact: {
    eyebrow: string;
    title: string;
    description: string;
    labels: {
      clinicName: string;
      doctorFullName: string;
      doctorPhone: string;
      officePhone: string;
      address: string;
      weekdayHours: string;
      fridayHours: string;
      saturdayHours: string;
    };
    placeholders: {
      clinicName: string;
      doctorFullName: string;
      doctorPhone: string;
      officePhone: string;
      address: string;
      weekdayHours: string;
      fridayHours: string;
      saturdayHours: string;
    };
    securityTitle: string;
    securityPoints: string[];
    submit: string;
    submitSuccess: string;
    secondaryContact: string;
  };
  chat: {
    tag: string;
    title: string;
    subtitle: string;
    secure: string;
    input: string;
    online: string;
    messages: Array<{
      id: number;
      sender: 'them' | 'me';
      text: string;
      time: string;
    }>;
  };
};

export const landingContent: Record<LocaleKey, LandingContent> = {
  fr: {
    nav: {
      features: 'Fonctionnement',
      pricing: 'Offre',
      faq: 'FAQ',
      contact: 'Démo',
      cta: 'Demander une démo',
    },
    hero: {
      badge: 'Automatisation WhatsApp pensée pour les cabinets médicaux',
      title: ['Une expérience patient', 'plus claire,', 'dès le premier message.'],
      description:
        'DarijaDoc transforme les demandes WhatsApp en rendez-vous confirmés avec un parcours plus fluide, plus crédible et plus rassurant pour le patient comme pour le cabinet.',
      primaryCta: 'Voir la démo',
      secondaryCta: "Voir l'offre complète",
      stats: [
        ['100% WhatsApp', 'Sans tunnel compliqué ni application à installer'],
        ['3 à 7 jours', 'Pour lancer un parcours propre et opérationnel'],
        ['Contrôle cabinet', 'Validation humaine sur les points sensibles'],
      ],
      proofTitle: 'Ce que le patient perçoit immédiatement',
      proofList: [
        'Une prise en charge rapide et lisible',
        'Un cabinet plus organisé et plus rassurant',
        'Un rendez-vous confirmé sans flottement',
      ],
    },
    impact: {
      eyebrow: 'Pourquoi ça fonctionne',
      title: 'Une home plus crédible, plus cadrée, moins démonstrative.',
      description:
        "Le site doit inspirer confiance avant de chercher à impressionner. La structure, le ton et le rythme rendent la promesse plus sérieuse.",
      cards: [
        {
          title: 'Réponse immédiate',
          description:
            'Le patient comprend dès le départ que le cabinet répond vite et avec méthode.',
        },
        {
          title: 'Orientation claire',
          description:
            'Le bon praticien ou le bon créneau apparaît sans ambiguïté inutile.',
        },
        {
          title: 'Suivi rassurant',
          description:
            'La conversation continue avec des confirmations et des relances cohérentes.',
        },
      ],
    },
    system: {
      eyebrow: 'Structure produit',
      title: 'Une présentation construite comme un service professionnel.',
      description:
        "Chaque section répond à une question précise: ce que c'est, ce que le patient ressent, comment le cabinet garde la main et comment la mise en place se déroule.",
      cards: [
        {
          title: 'Promesse claire',
          description:
            'Le message principal est plus court, mieux priorisé et lisible sur mobile.',
        },
        {
          title: 'Preuves utiles',
          description:
            'Les signaux de confiance restent visibles sans créer un effet marketing appuyé.',
        },
        {
          title: 'Hiérarchie nette',
          description:
            "Les blocs secondaires ont été simplifiés pour garder l'attention sur l'essentiel.",
        },
        {
          title: 'Parcours cohérent',
          description:
            "Le CTA, la démo et la demande d'onboarding suivent la même logique.",
        },
      ],
    },
    process: {
      eyebrow: 'Le parcours',
      title: 'Un flux simple pour le patient, contrôlable pour le cabinet.',
      description:
        "Le visiteur doit comprendre très vite comment le message arrive, comment l'orientation se fait et à quel moment la confirmation est sécurisée.",
      steps: [
        ['01', 'Le patient écrit sur WhatsApp', "Le point d'entrée reste familier et sans friction."],
        ['02', 'La demande est qualifiée', 'Le besoin, la zone ou le praticien sont cadrés en quelques messages.'],
        ['03', 'Le rendez-vous est confirmé', 'Le patient repart avec une information claire et traçable.'],
      ],
      asideTitle: 'Un rendu plus professionnel sert aussi la confiance.',
      asideLabels: ['Qualification', 'Relance', 'Validation'],
    },
    workspace: {
      eyebrow: 'Espaces métier',
      title: 'Des interfaces distinctes selon le rôle, sans casser la cohérence du produit.',
      description:
        "Chaque espace garde la même base visuelle, mais adapte sa densité, ses priorités et ses actions au quotidien réel du cabinet.",
      cards: [
        {
          slug: 'doctor',
          title: 'Espace docteur',
          description:
            'Agenda, file patient, notes de consultation et relances utiles dans une interface plus calme et focalisée.',
          cta: "Voir l'espace docteur",
          bullets: ['Vue journée', 'Patients à confirmer', 'Actions cliniques'],
        },
        {
          slug: 'secretary',
          title: 'Espace secrétaire',
          description:
            "Inbox WhatsApp, confirmations, rappels et arbitrages d'agenda pensés pour l'exécution rapide.",
          cta: "Voir l'espace secrétaire",
          bullets: ['Messages entrants', 'Créneaux à ajuster', 'Rappels en attente'],
        },
        {
          slug: 'admin',
          title: 'Espace admin',
          description:
            'Pilotage des comptes, des rôles, des performances et des garde-fous opérationnels dans une vue plus analytique.',
          cta: "Voir l'espace admin",
          bullets: ['Comptes & rôles', 'Performance', 'Sécurité'],
        },
      ],
    },
    testimonials: {
      eyebrow: 'Signaux de confiance',
      title: 'Des indicateurs visibles sans surcharger la page.',
      items: [
        ['+41%', 'Messages convertis', 'Le parcours réduit les hésitations entre la première demande et la confirmation.'],
        ['-28%', "Erreurs d'orientation", 'Le cabinet paraît plus structuré parce que le tri est plus net.'],
        ['Semaine 1', 'Impact perceptible', 'Le ton, la clarté et la cadence changent rapidement la perception.'],
      ],
    },
    pricing: {
      eyebrow: 'Offre',
      title: 'Une offre lisible dès la première lecture.',
      description:
        'Le bloc tarifaire doit rester simple: ce qui est inclus, ce qui change après le lancement et ce que le cabinet reçoit concrètement.',
      plan: 'Lancement',
      price: '400 Dh',
      period: '/ mois au démarrage',
      threshold: '600 Dh au-delà de 30 patients / mois',
      includedLabel: 'Inclus',
      features: [
        'Prise de rendez-vous complète sur WhatsApp',
        'Orientation selon le besoin, les symptômes et le contexte',
        'Scénarios dédiés par praticien ou spécialité',
        'Onboarding, réglages et optimisation au lancement',
      ],
    },
    faq: {
      eyebrow: 'Questions fréquentes',
      title: 'Les objections principales sont traitées sans détour.',
      items: [
        ['Le produit est-il déjà vocal ?', 'Non. La valeur actuelle repose sur la vitesse, la clarté et la qualité du parcours WhatsApp.'],
        ['Le secrétariat garde-t-il la main ?', 'Oui. DarijaDoc aide à structurer et accélérer, mais le cabinet conserve la validation.'],
        ['Combien de temps faut-il pour lancer ?', 'Comptez généralement entre 3 et 7 jours pour un déploiement propre.'],
      ],
    },
    contact: {
      eyebrow: 'Demander une démo',
      title: 'Préparer le cadrage du cabinet avant la démo.',
      description:
        "Renseignez les informations essentielles pour que la démonstration soit alignée sur votre organisation réelle.",
      labels: {
        clinicName: 'Nom du cabinet',
        doctorFullName: 'Nom et prénom du docteur',
        doctorPhone: 'Numéro de téléphone du docteur',
        officePhone: 'Numéro fixe du cabinet ou du secrétariat',
        address: 'Adresse du cabinet',
        weekdayHours: 'Disponibilité du lundi au jeudi',
        fridayHours: 'Disponibilité du vendredi',
        saturdayHours: 'Disponibilité du samedi',
      },
      placeholders: {
        clinicName: 'Cabinet Dr El Idrissi',
        doctorFullName: 'Dr Salma El Idrissi',
        doctorPhone: '+212 6 12 34 56 78',
        officePhone: '+212 5 22 00 00 00',
        address: 'Hay Riad, Rabat',
        weekdayHours: '09:00 - 13:00 / 15:00 - 19:00',
        fridayHours: '09:00 - 12:30 / 15:30 - 18:30',
        saturdayHours: '09:00 - 13:00',
      },
      securityTitle: 'Base plus propre, plus robuste, plus senior.',
      securityPoints: [
        "Hiérarchie de contenu simplifiée pour éviter l'effet AI slop.",
        'Composants plus lisibles, sections mieux séparées et CTA cohérents.',
        'Base plus autonome hors réseau et comportement par défaut mieux cadré.',
      ],
      submit: 'Envoyer la demande',
      submitSuccess: 'Demande bien enregistrée. La démo peut maintenant être préparée sur une base claire.',
      secondaryContact: 'Appeler maintenant',
    },
    chat: {
      tag: 'Démo WhatsApp',
      title: 'Un échange plus net entre le patient et le cabinet.',
      subtitle:
        'La demande est comprise, orientée puis confirmée sans détour. La démonstration montre surtout de la clarté, pas des effets.',
      secure: 'Messages chiffrés et parcours cadré.',
      input: 'Votre message',
      online: 'en ligne',
      messages: [
        { id: 1, sender: 'them', text: 'Bonjour, pouvez-vous préciser vos symptômes et votre quartier ?', time: '10:42' },
        { id: 2, sender: 'me', text: 'Fièvre, mal de gorge, je suis à Hay Riad.', time: '10:44' },
        { id: 3, sender: 'them', text: "Le Dr Yassine est disponible aujourd'hui à 17 h 30. Souhaitez-vous confirmer ?", time: '10:45' },
        { id: 4, sender: 'me', text: 'Oui, je confirme le rendez-vous.', time: '10:46' },
        { id: 5, sender: 'them', text: 'Parfait. Vous recevrez aussi un rappel automatique avant la consultation.', time: '10:47' },
      ],
    },
  },
  en: {
    nav: {
      features: 'Flow',
      pricing: 'Offer',
      faq: 'FAQ',
      contact: 'Demo',
      cta: 'Request a demo',
    },
    hero: {
      badge: 'WhatsApp automation designed for medical practices',
      title: ['A sharper patient experience,', 'clearer', 'from the very first message.'],
      description:
        'DarijaDoc turns WhatsApp requests into confirmed appointments with a smoother, more credible, and more reassuring flow for both patients and clinics.',
      primaryCta: 'Watch the demo',
      secondaryCta: 'See the full offer',
      stats: [
        ['100% WhatsApp', 'No heavy funnel and no app to install'],
        ['3 to 7 days', 'To launch a clean and operational flow'],
        ['Clinic control', 'Human validation on sensitive cases'],
      ],
      proofTitle: 'What the patient notices immediately',
      proofList: [
        'Faster and clearer handling',
        'A more organized and reassuring clinic image',
        'A confirmed appointment without uncertainty',
      ],
    },
    impact: {
      eyebrow: 'Why it works',
      title: 'A stronger, calmer, more credible homepage.',
      description:
        'The site should inspire confidence before trying to impress. Structure, tone, and rhythm make the promise feel more serious.',
      cards: [
        {
          title: 'Immediate response',
          description:
            'Patients quickly feel that the clinic is reachable and well organized.',
        },
        {
          title: 'Clear routing',
          description:
            'The right practitioner or time slot appears without unnecessary ambiguity.',
        },
        {
          title: 'Reassuring follow-through',
          description:
            'Messages continue with coherent confirmations and reminders.',
        },
      ],
    },
    system: {
      eyebrow: 'Product structure',
      title: 'A presentation built like a professional service.',
      description:
        'Each section answers a precise question: what it is, what the patient feels, how the clinic stays in control, and how setup works.',
      cards: [
        {
          title: 'Clear promise',
          description:
            'The main message is shorter, better prioritized, and easier to read on mobile.',
        },
        {
          title: 'Useful proof',
          description:
            'Trust signals stay visible without feeling overly promotional.',
        },
        {
          title: 'Sharper hierarchy',
          description:
            'Secondary blocks were simplified to keep attention on what matters.',
        },
        {
          title: 'Coherent flow',
          description:
            'The CTA, demo, and onboarding request now follow the same logic.',
        },
      ],
    },
    process: {
      eyebrow: 'The flow',
      title: 'Simple for patients, controllable for clinics.',
      description:
        'Visitors should understand very quickly how a message arrives, how routing happens, and when the confirmation is secured.',
      steps: [
        ['01', 'Patient sends a WhatsApp message', 'The entry point stays familiar and low-friction.'],
        ['02', 'The request gets qualified', 'Need, area, or practitioner is framed in a few messages.'],
        ['03', 'The appointment gets confirmed', 'The patient leaves with clear and traceable information.'],
      ],
      asideTitle: 'A more professional interface also strengthens trust.',
      asideLabels: ['Qualification', 'Follow-up', 'Validation'],
    },
    workspace: {
      eyebrow: 'Role workspaces',
      title: 'Distinct interfaces by role, without breaking product consistency.',
      description:
        'Each workspace keeps the same visual foundation while shifting density, priorities, and actions to match the actual job.',
      cards: [
        {
          slug: 'doctor',
          title: 'Doctor workspace',
          description:
            'Schedule, patient queue, consultation notes, and useful follow-ups in a calmer, more focused interface.',
          cta: 'Open doctor workspace',
          bullets: ['Daily schedule', 'Patients to confirm', 'Clinical actions'],
        },
        {
          slug: 'secretary',
          title: 'Secretary workspace',
          description:
            'WhatsApp inbox, confirmations, reminders, and calendar arbitration designed for fast execution.',
          cta: 'Open secretary workspace',
          bullets: ['Incoming messages', 'Slots to adjust', 'Pending reminders'],
        },
        {
          slug: 'admin',
          title: 'Admin workspace',
          description:
            'Accounts, roles, performance, and operational safeguards in a more analytical control view.',
          cta: 'Open admin workspace',
          bullets: ['Accounts & roles', 'Performance', 'Security'],
        },
      ],
    },
    testimonials: {
      eyebrow: 'Trust signals',
      title: 'Visible indicators without overloading the page.',
      items: [
        ['+41%', 'Messages converted', 'The flow reduces hesitation between first request and confirmation.'],
        ['-28%', 'Routing mistakes', 'The clinic feels more structured because the triage is cleaner.'],
        ['Week 1', 'Visible impact', 'Tone, clarity, and pace shift perception quickly.'],
      ],
    },
    pricing: {
      eyebrow: 'Offer',
      title: 'An offer that reads clearly at first glance.',
      description:
        'The pricing block should stay simple: what is included, what changes after launch, and what the clinic gets in practice.',
      plan: 'Launch',
      price: '400 MAD',
      period: '/ month at start',
      threshold: '600 MAD beyond 30 patients / month',
      includedLabel: 'Included',
      features: [
        'Full WhatsApp appointment booking flow',
        'Routing by need, symptoms, and context',
        'Dedicated scenarios by practitioner or specialty',
        'Onboarding, setup, and launch optimization',
      ],
    },
    faq: {
      eyebrow: 'FAQ',
      title: 'Main objections are handled directly.',
      items: [
        ['Is the product already voice-based?', 'No. The current value is speed, clarity, and quality inside the WhatsApp journey.'],
        ['Does the front desk keep control?', 'Yes. DarijaDoc helps structure and accelerate, while the clinic keeps final validation.'],
        ['How long does launch take?', 'Usually between 3 and 7 days for a clean rollout.'],
      ],
    },
    contact: {
      eyebrow: 'Request a demo',
      title: 'Prepare the clinic setup before the demo.',
      description:
        'Share the essential information so the demonstration matches your real operating model.',
      labels: {
        clinicName: 'Clinic name',
        doctorFullName: 'Doctor full name',
        doctorPhone: 'Doctor phone number',
        officePhone: 'Clinic or secretary landline',
        address: 'Clinic address',
        weekdayHours: 'Availability from Monday to Thursday',
        fridayHours: 'Availability on Friday',
        saturdayHours: 'Availability on Saturday',
      },
      placeholders: {
        clinicName: 'Dr El Idrissi Clinic',
        doctorFullName: 'Dr Salma El Idrissi',
        doctorPhone: '+212 6 12 34 56 78',
        officePhone: '+212 5 22 00 00 00',
        address: 'Hay Riad, Rabat',
        weekdayHours: '09:00 - 13:00 / 15:00 - 19:00',
        fridayHours: '09:00 - 12:30 / 15:30 - 18:30',
        saturdayHours: '09:00 - 13:00',
      },
      securityTitle: 'Cleaner base, stronger structure, more senior execution.',
      securityPoints: [
        'Simplified content hierarchy to remove the AI-slop feel.',
        'Clearer components, better section separation, and consistent CTA logic.',
        'A more self-contained base that behaves better in local and restricted environments.',
      ],
      submit: 'Send request',
      submitSuccess: 'Request recorded successfully. The demo can now be prepared on a clear basis.',
      secondaryContact: 'Call now',
    },
    chat: {
      tag: 'WhatsApp demo',
      title: 'A clearer exchange between patient and clinic.',
      subtitle:
        'The request is understood, routed, and confirmed without friction. The demo focuses on clarity rather than visual noise.',
      secure: 'Encrypted messages and controlled flow.',
      input: 'Your message',
      online: 'online',
      messages: [
        { id: 1, sender: 'them', text: 'Hello, could you describe your symptoms and your area?', time: '10:42 AM' },
        { id: 2, sender: 'me', text: 'Fever and a sore throat. I am in Hay Riad.', time: '10:44 AM' },
        { id: 3, sender: 'them', text: 'Dr Yassine is available today at 5:30 PM. Would you like to confirm?', time: '10:45 AM' },
        { id: 4, sender: 'me', text: 'Yes, I confirm the appointment.', time: '10:46 AM' },
        { id: 5, sender: 'them', text: 'Perfect. You will also receive an automatic reminder before the consultation.', time: '10:47 AM' },
      ],
    },
  },
  ar: {
    nav: {
      features: 'طريقة العمل',
      pricing: 'العرض',
      faq: 'الأسئلة',
      contact: 'الديمو',
      cta: 'اطلب عرضًا تجريبيًا',
    },
    hero: {
      badge: 'أتمتة واتساب مصممة للعيادات الطبية',
      title: ['تجربة المريض', 'أوضح،', 'من أول رسالة.'],
      description:
        'DarijaDoc يحول طلبات واتساب إلى مواعيد مؤكدة عبر مسار أكثر سلاسة ومصداقية وطمأنينة للمريض وللعيادة معًا.',
      primaryCta: 'شاهد الديمو',
      secondaryCta: 'شاهد العرض الكامل',
      stats: [
        ['100% WhatsApp', 'من دون مسار معقد أو تطبيق إضافي'],
        ['3 إلى 7 أيام', 'لإطلاق مسار واضح وجاهز للعمل'],
        ['تحكم العيادة', 'اعتماد بشري في الحالات الحساسة'],
      ],
      proofTitle: 'ما الذي يلاحظه المريض مباشرة',
      proofList: [
        'استجابة أسرع وأكثر وضوحًا',
        'صورة عيادة أكثر تنظيمًا وطمأنينة',
        'موعد مؤكد من دون ارتباك',
      ],
    },
    impact: {
      eyebrow: 'لماذا ينجح',
      title: 'واجهة أكثر مهنية وهدوءًا وأقرب إلى الثقة.',
      description:
        'يجب أن يمنح الموقع إحساسًا بالثقة قبل أن يحاول إبهار الزائر. البنية والنبرة والإيقاع تجعل الوعد أكثر جدية.',
      cards: [
        {
          title: 'استجابة فورية',
          description:
            'يشعر المريض سريعًا بأن العيادة متاحة ومنظمة وقادرة على المتابعة.',
        },
        {
          title: 'توجيه واضح',
          description:
            'يظهر الطبيب المناسب أو الموعد المناسب من دون غموض غير لازم.',
        },
        {
          title: 'متابعة مطمئنة',
          description:
            'تستمر المحادثة برسائل تأكيد وتذكير منسجمة وواضحة.',
        },
      ],
    },
    system: {
      eyebrow: 'هيكلة المنتج',
      title: 'عرض مبني كخدمة مهنية، لا كصفحة دعائية.',
      description:
        'كل قسم يجيب عن سؤال واضح: ما هو المنتج، ماذا يشعر المريض، كيف تبقى العيادة ممسكة بالخيط، وكيف يتم الإعداد.',
      cards: [
        {
          title: 'وعد واضح',
          description:
            'الرسالة الرئيسية أصبحت أقصر وأوضح وأسهل قراءة على الهاتف.',
        },
        {
          title: 'أدلة مفيدة',
          description:
            'إشارات الثقة ظاهرة من دون مبالغة تسويقية.',
        },
        {
          title: 'هرمية أنظف',
          description:
            'تم تبسيط الكتل الثانوية للحفاظ على التركيز على المهم.',
        },
        {
          title: 'مسار منسجم',
          description:
            'زر الإجراء والديمو وطلب الإعداد كلها تتحرك ضمن منطق واحد.',
        },
      ],
    },
    process: {
      eyebrow: 'المسار',
      title: 'بسيط للمريض وقابل للتحكم بالنسبة للعيادة.',
      description:
        'يجب أن يفهم الزائر بسرعة كيف تصل الرسالة، وكيف يتم التوجيه، ومتى يتم تأكيد الموعد بشكل آمن.',
      steps: [
        ['01', 'المريض يرسل رسالة على واتساب', 'نقطة الدخول تبقى مألوفة ومن دون احتكاك.'],
        ['02', 'يتم فهم الطلب وتوجيهه', 'الحاجة أو المنطقة أو الطبيب يتم تحديدها في بضع رسائل.'],
        ['03', 'يتم تأكيد الموعد', 'يخرج المريض بمعلومة واضحة ويمكن الرجوع إليها.'],
      ],
      asideTitle: 'واجهة أكثر مهنية تعزز الثقة أيضًا.',
      asideLabels: ['تأهيل', 'متابعة', 'اعتماد'],
    },
    workspace: {
      eyebrow: 'مساحات العمل',
      title: 'واجهات مختلفة حسب الدور من دون كسر هوية المنتج.',
      description:
        'كل مساحة تحافظ على نفس الأساس البصري، لكنها تغيّر كثافة المعلومات والأولويات بما يناسب العمل اليومي الحقيقي.',
      cards: [
        {
          slug: 'doctor',
          title: 'مساحة الطبيب',
          description:
            'الجدول، قائمة المرضى، ملاحظات الاستشارة والمتابعات المهمة داخل واجهة أكثر هدوءًا وتركيزًا.',
          cta: 'فتح مساحة الطبيب',
          bullets: ['جدول اليوم', 'مرضى بانتظار التأكيد', 'إجراءات سريرية'],
        },
        {
          slug: 'secretary',
          title: 'مساحة السكرتارية',
          description:
            'صندوق واتساب، التأكيدات، التذكيرات وتعديل المواعيد في واجهة سريعة التنفيذ.',
          cta: 'فتح مساحة السكرتارية',
          bullets: ['رسائل واردة', 'مواعيد تحتاج تعديلًا', 'تذكيرات معلقة'],
        },
        {
          slug: 'admin',
          title: 'مساحة الإدارة',
          description:
            'إدارة الحسابات والأدوار والأداء والحواجز التشغيلية داخل لوحة أكثر تحليلية.',
          cta: 'فتح مساحة الإدارة',
          bullets: ['الحسابات والأدوار', 'الأداء', 'الأمان'],
        },
      ],
    },
    testimonials: {
      eyebrow: 'إشارات الثقة',
      title: 'مؤشرات واضحة من دون تحميل الصفحة أكثر من اللازم.',
      items: [
        ['+41%', 'رسائل تحولت إلى مواعيد', 'المسار يقلل التردد بين أول طلب وتأكيد الموعد.'],
        ['-28%', 'أخطاء في التوجيه', 'العيادة تبدو أكثر تنظيمًا لأن الفرز أصبح أوضح.'],
        ['الأسبوع الأول', 'أثر ملموس', 'النبرة والوضوح والسرعة تغير الانطباع بسرعة.'],
      ],
    },
    pricing: {
      eyebrow: 'العرض',
      title: 'عرض واضح من أول قراءة.',
      description:
        'قسم التسعير يجب أن يبقى بسيطًا: ما الذي يدخل في الباقة، ما الذي يتغير بعد الإطلاق، وما الذي تستلمه العيادة فعليًا.',
      plan: 'الانطلاق',
      price: '400 درهم',
      period: '/ شهر في البداية',
      threshold: '600 درهم بعد 30 مريضًا / شهر',
      includedLabel: 'يشمل',
      features: [
        'مسار كامل لحجز المواعيد عبر واتساب',
        'توجيه حسب الحاجة والأعراض والسياق',
        'سيناريوهات مخصصة حسب الطبيب أو التخصص',
        'إعداد وتشغيل وتحسين عند الانطلاق',
      ],
    },
    faq: {
      eyebrow: 'الأسئلة الشائعة',
      title: 'أهم الاعتراضات يتم التعامل معها مباشرة.',
      items: [
        ['هل المنتج صوتي الآن؟', 'لا. القيمة الحالية مبنية على السرعة والوضوح وجودة تجربة واتساب.'],
        ['هل يبقى السكرتاريا متحكمًا؟', 'نعم. DarijaDoc يساعد على التنظيم والتسريع، لكن الاعتماد النهائي يبقى للعيادة.'],
        ['كم يلزم للإطلاق؟', 'غالبًا بين 3 و7 أيام لإطلاق نظيف ومنظم.'],
      ],
    },
    contact: {
      eyebrow: 'اطلب ديمو',
      title: 'هيئ إطار العيادة قبل العرض.',
      description:
        'شارك المعلومات الأساسية لكي تكون التجربة معروضة بطريقة مطابقة لتنظيمك الحقيقي.',
      labels: {
        clinicName: 'اسم العيادة',
        doctorFullName: 'اسم الطبيب الكامل',
        doctorPhone: 'رقم هاتف الطبيب',
        officePhone: 'رقم العيادة أو السكرتارية',
        address: 'عنوان العيادة',
        weekdayHours: 'التوفر من الاثنين إلى الخميس',
        fridayHours: 'التوفر يوم الجمعة',
        saturdayHours: 'التوفر يوم السبت',
      },
      placeholders: {
        clinicName: 'عيادة الدكتور الإدريسي',
        doctorFullName: 'د. سلمى الإدريسي',
        doctorPhone: '+212 6 12 34 56 78',
        officePhone: '+212 5 22 00 00 00',
        address: 'حي الرياض، الرباط',
        weekdayHours: '09:00 - 13:00 / 15:00 - 19:00',
        fridayHours: '09:00 - 12:30 / 15:30 - 18:30',
        saturdayHours: '09:00 - 13:00',
      },
      securityTitle: 'قاعدة أنظف وأصلب وأكثر نضجًا.',
      securityPoints: [
        'هرمية المحتوى أصبحت أبسط لتفادي الإحساس المصطنع أو المبالغ فيه.',
        'المكونات أوضح، والأقسام مفصولة بشكل أفضل، ونداءات الإجراء منسجمة.',
        'القاعدة أصبحت أكثر استقلالية وتعمل بشكل أفضل في البيئات المقيدة محليًا.',
      ],
      submit: 'إرسال الطلب',
      submitSuccess: 'تم تسجيل الطلب بنجاح. يمكن الآن تحضير الديمو على أساس واضح.',
      secondaryContact: 'اتصل الآن',
    },
    chat: {
      tag: 'عرض واتساب',
      title: 'محادثة أوضح بين المريض والعيادة.',
      subtitle:
        'يتم فهم الطلب وتوجيهه ثم تأكيده من دون تعقيد. الفكرة هنا هي الوضوح قبل أي شيء آخر.',
      secure: 'رسائل مشفرة ومسار مضبوط.',
      input: 'رسالتك',
      online: 'متصل الآن',
      messages: [
        { id: 1, sender: 'them', text: 'مرحبًا، هل يمكن توضيح الأعراض والحي الذي تتواجد فيه؟', time: '10:42' },
        { id: 2, sender: 'me', text: 'حمى وألم في الحلق، وأنا في حي الرياض.', time: '10:44' },
        { id: 3, sender: 'them', text: 'الدكتور ياسين متاح اليوم على الساعة 17:30. هل تريد تأكيد الموعد؟', time: '10:45' },
        { id: 4, sender: 'me', text: 'نعم، أؤكد الموعد.', time: '10:46' },
        { id: 5, sender: 'them', text: 'ممتاز. ستصلك أيضًا رسالة تذكير تلقائية قبل الزيارة.', time: '10:47' },
      ],
    },
  },
};

export function getLandingContent(locale: LocaleKey) {
  return landingContent[locale];
}
