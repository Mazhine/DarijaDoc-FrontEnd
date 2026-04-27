import type { LocaleKey } from './landing';

type RoleKey = 'doctor' | 'secretary' | 'admin';

type RoleWorkspaceContent = {
  title: string;
  subtitle: string;
  badge: string;
  primaryAction: string;
  secondaryAction: string;
  stats: Array<{ label: string; value: string; note: string }>;
  mainPanel: {
    title: string;
    items: Array<{ title: string; meta: string; status: string }>;
  };
  sidePanel: {
    title: string;
    items: string[];
  };
  metricsPanel: {
    title: string;
    items: Array<{ label: string; value: string }>;
  };
};

type WorkspaceContent = Record<RoleKey, RoleWorkspaceContent>;

const content: Record<LocaleKey, WorkspaceContent> = {
  fr: {
    doctor: {
      title: 'Espace docteur',
      subtitle:
        'Une vue plus posée sur la journée clinique: ce qui doit être vu, confirmé ou repris sans bruit inutile.',
      badge: 'Rôle docteur',
      primaryAction: 'Ouvrir les consultations',
      secondaryAction: 'Voir les confirmations',
      stats: [
        { label: "Patients aujourd'hui", value: '18', note: '3 nouveaux dossiers' },
        { label: 'Confirmations en attente', value: '4', note: '2 urgences légères triées' },
        { label: 'Temps moyen par consultation', value: '17 min', note: 'Cadence stable' },
      ],
      mainPanel: {
        title: 'File patient du jour',
        items: [
          { title: '10:30 · Amal Bennis', meta: 'Suivi dermatologie · WhatsApp confirmé', status: 'À recevoir' },
          { title: '11:10 · Nabil Chraibi', meta: 'Douleur thoracique légère · triage validé', status: 'Priorité' },
          { title: '12:00 · Salma Idrissi', meta: 'Contrôle post-consultation · rappel envoyé', status: 'Confirmé' },
        ],
      },
      sidePanel: {
        title: 'Actions utiles',
        items: ['Valider une demande sensible', 'Envoyer un rappel manuel', 'Ajouter une note au dossier'],
      },
      metricsPanel: {
        title: 'Lecture rapide',
        items: [
          { label: 'No-show prévus', value: '1' },
          { label: 'Messages non lus', value: '6' },
          { label: 'Patients orientés', value: '9' },
        ],
      },
    },
    secretary: {
      title: 'Espace secrétaire',
      subtitle:
        "Une interface plus dense, pensée pour l'exécution: absorber les messages, sécuriser les créneaux et garder le rythme.",
      badge: 'Rôle secrétaire',
      primaryAction: "Traiter l'inbox",
      secondaryAction: "Voir l'agenda",
      stats: [
        { label: 'Messages entrants', value: '27', note: '8 non traités' },
        { label: 'Créneaux ajustés', value: '12', note: '4 reports demandés' },
        { label: 'Rappels envoyés', value: '31', note: '2 confirmations manquantes' },
      ],
      mainPanel: {
        title: 'Inbox opérationnelle',
        items: [
          { title: 'Patient · demande de rendez-vous', meta: 'Fièvre + quartier Agdal', status: 'À qualifier' },
          { title: 'Patient · déplacement de créneau', meta: 'Report vendredi 15:30', status: 'À replanifier' },
          { title: 'Patient · confirmation reçue', meta: 'Consultation pédiatrie 17:00', status: 'Terminé' },
        ],
      },
      sidePanel: {
        title: 'Raccourcis',
        items: ['Créer un rendez-vous', 'Basculer vers un docteur', "Lancer les rappels de l'après-midi"],
      },
      metricsPanel: {
        title: 'Charge du jour',
        items: [
          { label: 'Temps moyen de réponse', value: '2 min' },
          { label: 'Conversations actives', value: '11' },
          { label: 'Créneaux restants', value: '7' },
        ],
      },
    },
    admin: {
      title: 'Espace admin',
      subtitle:
        'Une vue de pilotage plus analytique sur les accès, la performance et les points de contrôle du cabinet.',
      badge: 'Rôle admin',
      primaryAction: 'Gérer les accès',
      secondaryAction: 'Voir les performances',
      stats: [
        { label: 'Comptes actifs', value: '14', note: '3 médecins · 7 secrétaires' },
        { label: 'Rendez-vous confirmés', value: '142', note: '+18% cette semaine' },
        { label: 'Alertes sécurité', value: '0', note: 'Aucun incident ouvert' },
      ],
      mainPanel: {
        title: 'Pilotage opérationnel',
        items: [
          { title: 'Permissions rôle secrétaire', meta: '2 comptes attendent validation', status: 'À revoir' },
          { title: 'Performance WhatsApp', meta: 'Taux de conversion stable sur 7 jours', status: 'Normal' },
          { title: 'Journal des actions', meta: 'Dernière exportation à 09:12', status: 'Traçable' },
        ],
      },
      sidePanel: {
        title: 'Contrôles',
        items: ['Créer un compte', 'Modifier un rôle', 'Exporter les indicateurs'],
      },
      metricsPanel: {
        title: 'Vue synthèse',
        items: [
          { label: 'Temps moyen de confirmation', value: '11 min' },
          { label: 'Taux de conversion', value: '63%' },
          { label: 'Alertes ouvertes', value: '0' },
        ],
      },
    },
  },
  en: {
    doctor: {
      title: 'Doctor workspace',
      subtitle:
        'A calmer view over the clinical day: what needs attention, confirmation, or follow-up without unnecessary noise.',
      badge: 'Doctor role',
      primaryAction: 'Open consultations',
      secondaryAction: 'View confirmations',
      stats: [
        { label: 'Patients today', value: '18', note: '3 new records' },
        { label: 'Pending confirmations', value: '4', note: '2 mild urgencies triaged' },
        { label: 'Average consultation time', value: '17 min', note: 'Stable pace' },
      ],
      mainPanel: {
        title: 'Today’s patient queue',
        items: [
          { title: '10:30 · Amal Bennis', meta: 'Dermatology follow-up · confirmed on WhatsApp', status: 'Upcoming' },
          { title: '11:10 · Nabil Chraibi', meta: 'Mild chest pain · triage validated', status: 'Priority' },
          { title: '12:00 · Salma Idrissi', meta: 'Post-visit check · reminder sent', status: 'Confirmed' },
        ],
      },
      sidePanel: {
        title: 'Useful actions',
        items: ['Validate a sensitive request', 'Send a manual reminder', 'Add a note to a record'],
      },
      metricsPanel: {
        title: 'Quick read',
        items: [
          { label: 'Expected no-shows', value: '1' },
          { label: 'Unread messages', value: '6' },
          { label: 'Patients routed', value: '9' },
        ],
      },
    },
    secretary: {
      title: 'Secretary workspace',
      subtitle:
        'A denser execution-oriented interface to absorb incoming messages, secure time slots, and keep the day moving.',
      badge: 'Secretary role',
      primaryAction: 'Process inbox',
      secondaryAction: 'Open schedule',
      stats: [
        { label: 'Incoming messages', value: '27', note: '8 still pending' },
        { label: 'Adjusted slots', value: '12', note: '4 reschedule requests' },
        { label: 'Reminders sent', value: '31', note: '2 missing confirmations' },
      ],
      mainPanel: {
        title: 'Operational inbox',
        items: [
          { title: 'Patient · appointment request', meta: 'Fever + Agdal area', status: 'To qualify' },
          { title: 'Patient · slot change', meta: 'Move to Friday 3:30 PM', status: 'To reschedule' },
          { title: 'Patient · confirmation received', meta: 'Pediatrics consultation 5:00 PM', status: 'Done' },
        ],
      },
      sidePanel: {
        title: 'Shortcuts',
        items: ['Create an appointment', 'Escalate to a doctor', 'Run afternoon reminders'],
      },
      metricsPanel: {
        title: 'Today’s load',
        items: [
          { label: 'Average response time', value: '2 min' },
          { label: 'Active conversations', value: '11' },
          { label: 'Remaining slots', value: '7' },
        ],
      },
    },
    admin: {
      title: 'Admin workspace',
      subtitle:
        'A more analytical control view over access, performance, and operational safeguards across the clinic.',
      badge: 'Admin role',
      primaryAction: 'Manage access',
      secondaryAction: 'View performance',
      stats: [
        { label: 'Active accounts', value: '14', note: '3 doctors · 7 secretaries' },
        { label: 'Confirmed appointments', value: '142', note: '+18% this week' },
        { label: 'Security alerts', value: '0', note: 'No open incidents' },
      ],
      mainPanel: {
        title: 'Operational control',
        items: [
          { title: 'Secretary permissions', meta: '2 accounts waiting for approval', status: 'Review' },
          { title: 'WhatsApp performance', meta: 'Conversion rate stable over 7 days', status: 'Normal' },
          { title: 'Action log', meta: 'Last export at 09:12', status: 'Traceable' },
        ],
      },
      sidePanel: {
        title: 'Controls',
        items: ['Create an account', 'Edit a role', 'Export metrics'],
      },
      metricsPanel: {
        title: 'Snapshot',
        items: [
          { label: 'Avg. confirmation time', value: '11 min' },
          { label: 'Conversion rate', value: '63%' },
          { label: 'Open alerts', value: '0' },
        ],
      },
    },
  },
  ar: {
    doctor: {
      title: 'مساحة الطبيب',
      subtitle:
        'رؤية أكثر هدوءًا لليوم السريري: ما الذي يجب مراجعته أو تأكيده أو متابعته من دون ضجيج.',
      badge: 'دور الطبيب',
      primaryAction: 'فتح الاستشارات',
      secondaryAction: 'عرض التأكيدات',
      stats: [
        { label: 'مرضى اليوم', value: '18', note: '3 ملفات جديدة' },
        { label: 'تأكيدات معلقة', value: '4', note: 'حالَتان عاجلتان خفيفتان تم فرزهما' },
        { label: 'متوسط مدة الاستشارة', value: '17 د', note: 'إيقاع مستقر' },
      ],
      mainPanel: {
        title: 'قائمة مرضى اليوم',
        items: [
          { title: '10:30 · أمل بنيس', meta: 'متابعة جلدية · تم التأكيد عبر واتساب', status: 'قادم' },
          { title: '11:10 · نبيل شرايبي', meta: 'ألم صدري خفيف · تم اعتماد الفرز', status: 'أولوية' },
          { title: '12:00 · سلمى الإدريسي', meta: 'مراجعة بعد الاستشارة · تم إرسال تذكير', status: 'مؤكد' },
        ],
      },
      sidePanel: {
        title: 'إجراءات مفيدة',
        items: ['اعتماد طلب حساس', 'إرسال تذكير يدوي', 'إضافة ملاحظة إلى الملف'],
      },
      metricsPanel: {
        title: 'قراءة سريعة',
        items: [
          { label: 'غيابات متوقعة', value: '1' },
          { label: 'رسائل غير مقروءة', value: '6' },
          { label: 'مرضى تم توجيههم', value: '9' },
        ],
      },
    },
    secretary: {
      title: 'مساحة السكرتارية',
      subtitle:
        'واجهة أكثر كثافة وموجهة للتنفيذ السريع: استيعاب الرسائل، تأمين المواعيد، والحفاظ على الإيقاع اليومي.',
      badge: 'دور السكرتارية',
      primaryAction: 'معالجة الرسائل',
      secondaryAction: 'فتح الجدول',
      stats: [
        { label: 'رسائل واردة', value: '27', note: '8 لم تعالج بعد' },
        { label: 'مواعيد عُدلت', value: '12', note: '4 طلبات تغيير' },
        { label: 'تذكيرات مرسلة', value: '31', note: 'تأكيدان مفقودان' },
      ],
      mainPanel: {
        title: 'صندوق العمليات',
        items: [
          { title: 'مريض · طلب موعد', meta: 'حمى + حي أكدال', status: 'بحاجة إلى تأهيل' },
          { title: 'مريض · تغيير موعد', meta: 'تأجيل إلى الجمعة 15:30', status: 'إعادة جدولة' },
          { title: 'مريض · تم التأكيد', meta: 'استشارة أطفال 17:00', status: 'مكتمل' },
        ],
      },
      sidePanel: {
        title: 'اختصارات',
        items: ['إنشاء موعد', 'التصعيد إلى طبيب', 'إطلاق تذكيرات بعد الظهر'],
      },
      metricsPanel: {
        title: 'حمولة اليوم',
        items: [
          { label: 'متوسط زمن الرد', value: '2 د' },
          { label: 'محادثات نشطة', value: '11' },
          { label: 'المواعيد المتبقية', value: '7' },
        ],
      },
    },
    admin: {
      title: 'مساحة الإدارة',
      subtitle:
        'واجهة تحكم أكثر تحليلية للوصول والأداء والحواجز التشغيلية على مستوى العيادة.',
      badge: 'دور الإدارة',
      primaryAction: 'إدارة الوصول',
      secondaryAction: 'عرض الأداء',
      stats: [
        { label: 'حسابات نشطة', value: '14', note: '3 أطباء · 7 سكرتارية' },
        { label: 'مواعيد مؤكدة', value: '142', note: '+18% هذا الأسبوع' },
        { label: 'تنبيهات أمنية', value: '0', note: 'لا توجد حوادث مفتوحة' },
      ],
      mainPanel: {
        title: 'التحكم التشغيلي',
        items: [
          { title: 'صلاحيات السكرتارية', meta: 'حسابان بانتظار الاعتماد', status: 'للمراجعة' },
          { title: 'أداء واتساب', meta: 'معدل التحويل مستقر خلال 7 أيام', status: 'طبيعي' },
          { title: 'سجل الإجراءات', meta: 'آخر تصدير عند 09:12', status: 'قابل للتتبع' },
        ],
      },
      sidePanel: {
        title: 'ضوابط',
        items: ['إنشاء حساب', 'تعديل دور', 'تصدير المؤشرات'],
      },
      metricsPanel: {
        title: 'ملخص سريع',
        items: [
          { label: 'متوسط زمن التأكيد', value: '11 د' },
          { label: 'معدل التحويل', value: '63%' },
          { label: 'تنبيهات مفتوحة', value: '0' },
        ],
      },
    },
  },
};

export function getWorkspaceContent(locale: LocaleKey, role: RoleKey) {
  return content[locale][role];
}

export type { RoleKey };
