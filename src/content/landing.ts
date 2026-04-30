export const locales = ['fr', 'en', 'ar'] as const;

export type LocaleKey = (typeof locales)[number];

export function isLocale(value: string): value is LocaleKey {
  return locales.includes(value as LocaleKey);
}

type LandingContent = {
  nav: {
    workflow: string;
    access: string;
    faq: string;
    demo: string;
    signIn: string;
    cta: string;
  };
  hero: {
    badge: string;
    title: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
    points: string[];
  };
  highlights: {
    items: Array<{ title: string; description: string }>;
  };
  workflow: {
    eyebrow: string;
    title: string;
    steps: Array<{ id: string; title: string; description: string }>;
  };
  access: {
    eyebrow: string;
    title: string;
    cards: Array<{
      slug: 'doctor' | 'secretary' | 'admin';
      title: string;
      description: string;
      bullets: string[];
      cta: string;
    }>;
  };
  faq: {
    eyebrow: string;
    title: string;
    items: Array<{ question: string; answer: string }>;
  };
  demo: {
    eyebrow: string;
    title: string;
    description: string;
    labels: {
      fullName: string;
      specialty: string;
      city: string;
      phone: string;
      email: string;
      date: string;
      time: string;
    };
    placeholders: {
      fullName: string;
      specialty: string;
      city: string;
      phone: string;
      email: string;
    };
    helper: string;
    submit: string;
    success: string;
  };
  closing: {
    title: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
  };
  footer: {
    tagline: string;
    productTitle: string;
    productLinks: Array<{ label: string; href: string }>;
    companyTitle: string;
    companyLinks: Array<{ label: string; href: string }>;
    resourcesTitle: string;
    resourceLinks: Array<{ label: string; href: string }>;
  };
  chat: {
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
      workflow: 'Parcours',
      access: 'Accès',
      faq: 'Questions',
      demo: 'Demo',
      signIn: 'Connexion',
      cta: 'Planifier une démo',
    },
    hero: {
      badge: 'Assistant WhatsApp pour cabinets médicaux',
      title: 'Une prise de rendez-vous plus simple pour le patient et plus lisible pour le cabinet.',
      description:
        'DarijaDoc qualifie la demande, propose le bon créneau et garde une validation humaine quand il le faut.',
      primaryCta: 'Planifier une démo',
      secondaryCta: 'Se connecter',
      points: [
        'Parcours WhatsApp familier pour le patient',
        'Dashboard adapté selon le rôle',
        'Mise en place rapide sans tunnel complexe',
      ],
    },
    highlights: {
      items: [
        {
          title: "Moins d'allers-retours",
          description: 'Les demandes fréquentes sont cadrées dès le premier message.',
        },
        {
          title: 'Un ton plus médical',
          description: 'Le site et les interfaces parlent cabinet, pas startup IA.',
        },
        {
          title: 'Le cabinet garde la main',
          description: "Les confirmations sensibles restent validables par l'équipe.",
        },
      ],
    },
    workflow: {
      eyebrow: 'Le parcours',
      title: 'Trois étapes claires, sans friction inutile.',
      steps: [
        {
          id: '01',
          title: 'Le patient écrit',
          description: "La demande commence sur WhatsApp, sans application à installer.",
        },
        {
          id: '02',
          title: 'Le besoin est qualifié',
          description: 'Motif, praticien, disponibilité et contexte sont clarifiés rapidement.',
        },
        {
          id: '03',
          title: 'Le bon suivi part',
          description: 'Le patient reçoit un rendez-vous confirmé ou une reprise humaine.',
        },
      ],
    },
    access: {
      eyebrow: 'Accès',
      title: 'Un même produit, trois vues métier.',
      cards: [
        {
          slug: 'doctor',
          title: 'Docteur',
          description: "Vue agenda, patients du jour, notes et points à confirmer.",
          bullets: ['Journée clinique', 'Fiches patient', 'Suivi médical'],
          cta: 'Connexion',
        },
        {
          slug: 'secretary',
          title: 'Secrétaire',
          description: "Gestion des demandes, confirmations, rappels et ajustements d'agenda.",
          bullets: ['Messages entrants', 'Rappels', 'Créneaux'],
          cta: 'Connexion',
        },
      ],
    },
    faq: {
      eyebrow: 'Questions',
      title: "Les questions qu'un médecin pose avant d'essayer.",
      items: [
        {
          question: 'Est-ce que je garde la main sur les rendez-vous ?',
          answer: "Oui. DarijaDoc accélère le tri et la prise de rendez-vous, mais le cabinet garde la validation quand c'est nécessaire.",
        },
        {
          question: 'Est-ce que mes secrétaires peuvent continuer à travailler comme avant ?',
          answer: "Oui. L'outil structure les demandes et fait gagner du temps, sans casser les habitudes utiles du secrétariat.",
        },
        {
          question: 'Est-ce que ça marche seulement pour un seul médecin ?',
          answer: 'Non. Le produit peut être organisé par praticien, ville, spécialité ou mode de disponibilité.',
        },
        {
          question: 'Comment le patient réserve sa démo ou son rendez-vous ?',
          answer: 'Le parcours propose des créneaux disponibles avec une logique proche de Calendly, puis confirme le bon slot.',
        },
        {
          question: "Que voit un admin par rapport à un docteur ?",
          answer: "L'admin gère les utilisateurs et les accès. Le docteur voit son activité clinique, pas la gestion des comptes.",
        },
        {
          question: 'Est-ce que je peux connecter mon agenda ?',
          answer: 'Oui, la base Google Calendar est prévue pour synchroniser les disponibilités réelles.',
        },
        {
          question: 'Combien de temps pour être opérationnel ?',
          answer: 'En général quelques jours suffisent pour cadrer le parcours, les rôles et les créneaux.',
        },
        {
          question: 'Est-ce que le ton peut être adapté à ma spécialité ?',
          answer: 'Oui. Les messages, les questions fréquentes et le parcours peuvent être ajustés à votre contexte.',
        },
      ],
    },
    demo: {
      eyebrow: 'Planifier une démo',
      title: "Choisissez un créneau, on s'adapte à votre pratique.",
      description:
        'Remplissez quelques informations utiles, choisissez une date puis un horaire disponible.',
      labels: {
        fullName: 'Nom complet',
        specialty: 'Spécialité',
        city: 'Ville',
        phone: 'Téléphone',
        email: 'E-mail',
        date: 'Date',
        time: 'Horaire',
      },
      placeholders: {
        fullName: 'Dr Salma El Idrissi',
        specialty: 'Médecine générale',
        city: 'Rabat',
        phone: '+212 6 12 34 56 78',
        email: 'salma@cabinet.ma',
      },
      helper: "Les créneaux affichés simulent une réservation de démo type Calendly.",
      submit: 'Confirmer la démo',
      success: 'Demande enregistrée. Le créneau choisi est réservé pour la démo.',
    },
    closing: {
      title: "Une démo utile vaut mieux qu'une longue promesse.",
      description: 'Choisissez un créneau et voyez le parcours, les rôles et le dashboard qui correspondent à votre cabinet.',
      primaryCta: 'Planifier une démo',
      secondaryCta: 'Connexion',
    },
    footer: {
      tagline: 'DarijaDoc simplifie la relation patient sur WhatsApp sans perdre la logique du cabinet.',
      productTitle: 'Produit',
      productLinks: [
        { label: 'Parcours', href: '#workflow' },
        { label: 'Accès', href: '#access' },
        { label: 'Questions', href: '#faq' },
      ],
      companyTitle: 'Entreprise',
      companyLinks: [
        { label: 'Contact', href: '/fr/contact' },
        { label: 'Confidentialité', href: '/fr/privacy' },
        { label: 'Rejoindre', href: '/fr/join' },
      ],
      resourcesTitle: 'Ressources',
      resourceLinks: [
        { label: 'FAQ', href: '/fr/faq' },
        { label: 'Connexion', href: '/fr/auth' },
        { label: 'Démo', href: '#demo' },
      ],
    },
    chat: {
      secure: 'Conversation chiffrée et parcours guidé.',
      input: 'Votre message',
      online: 'En ligne',
      messages: [
        { id: 1, sender: 'them', text: 'Bonjour, vous souhaitez consulter quel praticien ?', time: '10:42' },
        { id: 2, sender: 'me', text: 'Un généraliste, plutôt en fin de journée.', time: '10:43' },
        { id: 3, sender: 'them', text: 'Le Dr Salma a un créneau jeudi à 18:00. Je vous le réserve ?', time: '10:44' },
        { id: 4, sender: 'me', text: 'Oui, je confirme.', time: '10:45' },
        { id: 5, sender: 'them', text: 'Parfait. Vous recevrez un rappel automatique avant le rendez-vous.', time: '10:46' },
      ],
    },
  },
  en: {
    nav: {
      workflow: 'Flow',
      access: 'Access',
      faq: 'Questions',
      demo: 'Demo',
      signIn: 'Sign In',
      cta: 'Schedule a demo',
    },
    hero: {
      badge: 'WhatsApp assistant for medical practices',
      title: 'A calmer booking flow for patients and a clearer workflow for the clinic.',
      description:
        'DarijaDoc qualifies the request, suggests the right slot, and keeps a human checkpoint when needed.',
      primaryCta: 'Schedule a demo',
      secondaryCta: 'Sign In',
      points: [
        'Familiar WhatsApp journey for patients',
        'Role-based dashboard after sign in',
        'Fast setup without a complicated funnel',
      ],
    },
    highlights: {
      items: [
        {
          title: 'Less back and forth',
          description: 'Frequent requests are framed from the first message.',
        },
        {
          title: 'More clinical tone',
          description: 'The product feels like a practice tool, not an AI landing page.',
        },
        {
          title: 'Human control remains',
          description: 'Sensitive confirmations can still be validated by staff.',
        },
      ],
    },
    workflow: {
      eyebrow: 'The flow',
      title: 'Three clear steps, with less friction.',
      steps: [
        {
          id: '01',
          title: 'Patient sends a message',
          description: 'The request starts on WhatsApp, with no extra app to install.',
        },
        {
          id: '02',
          title: 'The need is qualified',
          description: 'Reason, doctor, availability, and context are clarified quickly.',
        },
        {
          id: '03',
          title: 'The right follow-up goes out',
          description: 'The patient gets a confirmed appointment or a human handoff.',
        },
      ],
    },
    access: {
      eyebrow: 'Access',
      title: 'One product, three role-based views.',
      cards: [
        {
          slug: 'doctor',
          title: 'Doctor',
          description: 'Schedule, day list, notes, and the patients that need review.',
          bullets: ['Clinical day', 'Patient files', 'Medical follow-up'],
          cta: 'Sign In',
        },
        {
          slug: 'secretary',
          title: 'Secretary',
          description: 'Incoming requests, reminders, confirmations, and schedule changes.',
          bullets: ['Inbox', 'Reminders', 'Open slots'],
          cta: 'Sign In',
        },
      ],
    },
    faq: {
      eyebrow: 'Questions',
      title: 'The questions doctors usually ask first.',
      items: [
        {
          question: 'Do I still control appointments?',
          answer: 'Yes. DarijaDoc speeds up triage and booking, but the practice keeps validation when it matters.',
        },
        {
          question: 'Can my secretary keep working the same way?',
          answer: 'Yes. The tool structures requests and saves time without breaking useful habits.',
        },
        {
          question: 'Does it only work for one doctor?',
          answer: 'No. It can be organized by doctor, city, specialty, or availability model.',
        },
        {
          question: 'How does demo scheduling work?',
          answer: 'The flow offers available slots with a Calendly-like interaction, then confirms the selected time.',
        },
        {
          question: 'What does admin see compared to a doctor?',
          answer: 'Admin manages users and permissions. Doctors see clinical activity, not account management.',
        },
        {
          question: 'Can I connect my calendar?',
          answer: 'Yes. The Google Calendar integration is designed to sync real availability.',
        },
        {
          question: 'How long until we are live?',
          answer: 'Usually a few days are enough to shape the flow, roles, and available slots.',
        },
        {
          question: 'Can the tone be adapted to my specialty?',
          answer: 'Yes. Messages, common questions, and flow logic can be adjusted to your practice.',
        },
      ],
    },
    demo: {
      eyebrow: 'Schedule a demo',
      title: 'Pick a time that fits your practice.',
      description: 'Share a few useful details, choose a date, then select an available time slot.',
      labels: {
        fullName: 'Full name',
        specialty: 'Specialty',
        city: 'City',
        phone: 'Phone',
        email: 'Email',
        date: 'Date',
        time: 'Time',
      },
      placeholders: {
        fullName: 'Dr Sarah El Idrissi',
        specialty: 'General medicine',
        city: 'Rabat',
        phone: '+212 6 12 34 56 78',
        email: 'sarah@practice.ma',
      },
      helper: 'The visible slots simulate a Calendly-style demo booking flow.',
      submit: 'Confirm demo',
      success: 'Saved. The selected time slot is now reserved for the demo.',
    },
    closing: {
      title: 'A useful demo is better than a long promise.',
      description: 'Choose a time slot and see the patient flow, roles, and dashboard that fit your clinic.',
      primaryCta: 'Schedule a demo',
      secondaryCta: 'Sign In',
    },
    footer: {
      tagline: 'DarijaDoc simplifies patient communication on WhatsApp without losing the logic of the practice.',
      productTitle: 'Product',
      productLinks: [
        { label: 'Flow', href: '#workflow' },
        { label: 'Access', href: '#access' },
        { label: 'Questions', href: '#faq' },
      ],
      companyTitle: 'Company',
      companyLinks: [
        { label: 'Contact', href: '/en/contact' },
        { label: 'Privacy', href: '/en/privacy' },
        { label: 'Join', href: '/en/join' },
      ],
      resourcesTitle: 'Resources',
      resourceLinks: [
        { label: 'FAQ', href: '/en/faq' },
        { label: 'Sign In', href: '/en/auth' },
        { label: 'Demo', href: '#demo' },
      ],
    },
    chat: {
      secure: 'Encrypted conversation and guided flow.',
      input: 'Your message',
      online: 'Online',
      messages: [
        { id: 1, sender: 'them', text: 'Hello, which doctor would you like to see?', time: '10:42 AM' },
        { id: 2, sender: 'me', text: 'A general physician, ideally late afternoon.', time: '10:43 AM' },
        { id: 3, sender: 'them', text: 'Dr Sarah has an opening on Thursday at 6:00 PM. Should I reserve it?', time: '10:44 AM' },
        { id: 4, sender: 'me', text: 'Yes, please confirm it.', time: '10:45 AM' },
        { id: 5, sender: 'them', text: 'Perfect. You will receive an automatic reminder before the visit.', time: '10:46 AM' },
      ],
    },
  },
  ar: {
    nav: {
      workflow: 'المسار',
      access: 'الوصول',
      faq: 'الاسئلة',
      demo: 'الديمو',
      signIn: 'تسجيل الدخول',
      cta: 'احجز ديمو',
    },
    hero: {
      badge: 'مساعد واتساب للعيادات الطبية',
      title: 'حجز اوضح للمريض وتنظيم ابسط للعيادة.',
      description: 'DarijaDoc يفهم الطلب، يقترح الموعد المناسب، ويحافظ على تدخل بشري عند الحاجة.',
      primaryCta: 'احجز ديمو',
      secondaryCta: 'تسجيل الدخول',
      points: [
        'مسار واتساب مألوف للمريض',
        'لوحة مختلفة حسب الدور',
        'تشغيل سريع بدون تعقيد',
      ],
    },
    highlights: {
      items: [
        {
          title: 'رسائل اقل',
          description: 'يتم ضبط الطلبات المتكررة من اول محادثة.',
        },
        {
          title: 'طابع طبي اهدأ',
          description: 'الواجهة اقرب لاداة عيادة من صفحة تقنية مبالغ فيها.',
        },
        {
          title: 'العيادة ما زالت تتحكم',
          description: 'الحالات الحساسة يمكن تاكيدها من الفريق.',
        },
      ],
    },
    workflow: {
      eyebrow: 'المسار',
      title: 'ثلاث خطوات واضحة بدون ازدحام.',
      steps: [
        {
          id: '01',
          title: 'المريض يرسل رسالة',
          description: 'البداية تكون على واتساب بدون تطبيق اضافي.',
        },
        {
          id: '02',
          title: 'يتم فهم الطلب',
          description: 'السبب والطبيب والتوفر والسياق تتوضح بسرعة.',
        },
        {
          id: '03',
          title: 'يتم ارسال المتابعة المناسبة',
          description: 'يصل للمريض موعد مؤكد او تحويل لمتابعة بشرية.',
        },
      ],
    },
    access: {
      eyebrow: 'الوصول',
      title: 'منتج واحد بثلاث واجهات حسب الدور.',
      cards: [
        {
          slug: 'doctor',
          title: 'الطبيب',
          description: 'الجدول، المرضى، الملاحظات، والنقاط التي تحتاج مراجعة.',
          bullets: ['اليوم الطبي', 'ملفات المرضى', 'متابعة'],
          cta: 'تسجيل الدخول',
        },
        {
          slug: 'secretary',
          title: 'السكرتارية',
          description: 'الطلبات، التذكيرات، التاكيدات، وتعديلات المواعيد.',
          bullets: ['الرسائل', 'التذكيرات', 'المواعيد'],
          cta: 'تسجيل الدخول',
        },
      ],
    },
    faq: {
      eyebrow: 'الاسئلة',
      title: 'الاسئلة التي يطرحها الطبيب قبل التجربة.',
      items: [
        {
          question: 'هل ابقى متحكما في المواعيد؟',
          answer: 'نعم. DarijaDoc يسرع الفرز والحجز، لكن العيادة تحتفظ بالتأكيد عند الحاجة.',
        },
        {
          question: 'هل يمكن للسكرتارية الاستمرار بطريقتها المعتادة؟',
          answer: 'نعم. الاداة ترتب الطلبات وتوفر الوقت بدون كسر العادات المفيدة.',
        },
        {
          question: 'هل يصلح لطبيب واحد فقط؟',
          answer: 'لا. يمكن تنظيمه حسب الطبيب او المدينة او التخصص او التوفر.',
        },
        {
          question: 'كيف يتم حجز الديمو؟',
          answer: 'يتم عرض مواعيد متاحة بطريقة قريبة من Calendly ثم تاكيد الموعد المختار.',
        },
        {
          question: 'ماذا يرى الادمن مقارنة بالطبيب؟',
          answer: 'الادمن يدير المستخدمين والصلاحيات، بينما الطبيب يرى نشاطه السريري فقط.',
        },
        {
          question: 'هل يمكن ربط التقويم؟',
          answer: 'نعم. التكامل مع Google Calendar موجود لمزامنة التوفر الحقيقي.',
        },
        {
          question: 'كم يلزم من الوقت للتشغيل؟',
          answer: 'غالبا تكفي بضعة ايام لضبط المسار والادوار والمواعيد.',
        },
        {
          question: 'هل يمكن تعديل اسلوب الرسائل حسب التخصص؟',
          answer: 'نعم. يمكن تكييف الرسائل والاسئلة والمنطق مع طبيعة العيادة.',
        },
      ],
    },
    demo: {
      eyebrow: 'احجز ديمو',
      title: 'اختر موعدا يناسب عيادتك.',
      description: 'شارك بعض المعلومات المهمة ثم اختر التاريخ والساعة المناسبة.',
      labels: {
        fullName: 'الاسم الكامل',
        specialty: 'التخصص',
        city: 'المدينة',
        phone: 'الهاتف',
        email: 'البريد الالكتروني',
        date: 'التاريخ',
        time: 'الساعة',
      },
      placeholders: {
        fullName: 'د. سلمى الادريسي',
        specialty: 'طب عام',
        city: 'الرباط',
        phone: '+212 6 12 34 56 78',
        email: 'salma@cabinet.ma',
      },
      helper: 'المواعيد المعروضة تحاكي حجز ديمو بنمط قريب من Calendly.',
      submit: 'تأكيد الديمو',
      success: 'تم حفظ الطلب. الموعد المختار اصبح محجوزا للديمو.',
    },
    closing: {
      title: 'ديمو واضح افضل من وعد طويل.',
      description: 'اختر موعدا وشاهد المسار والادوار والواجهة المناسبة لعيادتك.',
      primaryCta: 'احجز ديمو',
      secondaryCta: 'تسجيل الدخول',
    },
    footer: {
      tagline: 'DarijaDoc يبسط تواصل المريض على واتساب بدون فقدان منطق العيادة.',
      productTitle: 'المنتج',
      productLinks: [
        { label: 'المسار', href: '#workflow' },
        { label: 'الوصول', href: '#access' },
        { label: 'الاسئلة', href: '#faq' },
      ],
      companyTitle: 'الشركة',
      companyLinks: [
        { label: 'اتصل بنا', href: '/ar/contact' },
        { label: 'الخصوصية', href: '/ar/privacy' },
        { label: 'انضم', href: '/ar/join' },
      ],
      resourcesTitle: 'الموارد',
      resourceLinks: [
        { label: 'الاسئلة', href: '/ar/faq' },
        { label: 'تسجيل الدخول', href: '/ar/auth' },
        { label: 'الديمو', href: '#demo' },
      ],
    },
    chat: {
      secure: 'محادثة مشفرة ومسار واضح.',
      input: 'رسالتك',
      online: 'متصل الان',
      messages: [
        { id: 1, sender: 'them', text: 'مرحبا، مع اي طبيب تود الحجز؟', time: '10:42' },
        { id: 2, sender: 'me', text: 'مع طبيب عام ويفضل اخر النهار.', time: '10:43' },
        { id: 3, sender: 'them', text: 'الدكتورة سلمى متاحة الخميس على 18:00. هل اؤكد الموعد؟', time: '10:44' },
        { id: 4, sender: 'me', text: 'نعم، اكد الموعد.', time: '10:45' },
        { id: 5, sender: 'them', text: 'ممتاز. ستصلك رسالة تذكير قبل الموعد.', time: '10:46' },
      ],
    },
  },
};

export function getLandingContent(locale: LocaleKey) {
  return landingContent[locale];
}
