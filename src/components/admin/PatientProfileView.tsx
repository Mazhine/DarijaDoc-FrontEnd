'use client';

import { useMemo, useState, type ElementType } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Activity,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  Download,
  FileOutput,
  FileSymlink,
  FileText,
  HeartPulse,
  Phone,
  Shield,
  Stethoscope,
  UserCircle2,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { type PatientRecord } from '@/src/lib/clinic';

type ProfileTab = 'overview' | 'consultations' | 'prescriptions' | 'documents' | 'finance';

const COPY = {
  en: {
    back: 'Back',
    options: 'Options',
    newAppointment: 'New appointment',
    overview: "Overview",
    consultations: 'Consultations',
    prescriptions: 'Prescriptions',
    documents: 'Documents',
    finance: 'Finance',
    medicalRecord: 'Medical record',
    bloodGroup: 'Blood group',
    insurance: 'Insurance',
    alerts: 'Alerts and history',
    chronic: 'Chronic diseases',
    allergies: 'Allergies',
    noChronic: 'No chronic disease reported',
    noAllergy: 'No known allergy',
    privateNotes: 'Private notes',
    noNotes: 'Add private notes for this patient here...',
    recentVisits: 'Recent visits',
    viewAll: 'View all',
    noVisits: 'No visit recorded yet.',
    todayConsultation: 'Today consultation',
    importTemplate: 'Import template',
    motive: 'Reason for visit',
    vitals: 'Vitals (BP, weight...)',
    clinical: 'Symptoms and clinical exam',
    diagnosis: 'Diagnosis',
    saveDraft: 'Save draft',
    finish: 'Finish consultation',
    createRx: 'Create prescription',
    downloadPdf: 'Download PDF',
    balance: 'Remaining balance',
    paid: 'Paid',
    unpaid: 'Unpaid',
    invoices: 'Invoices and history',
    export: 'PDF',
    addedOn: 'Added on',
    status: 'Status',
    documentsTitle: 'Patient documents',
    upload: 'Upload document',
    browse: 'Browse',
    current: 'Current',
    confirm: 'Confirm',
  },
  fr: {
    back: 'Retour',
    options: 'Options',
    newAppointment: 'Nouveau RDV',
    overview: "Vue d'ensemble",
    consultations: 'Consultations',
    prescriptions: 'Ordonnances',
    documents: 'Documents',
    finance: 'Finances',
    medicalRecord: 'Dossier medical',
    bloodGroup: 'Groupe sanguin',
    insurance: 'Mutuelle',
    alerts: 'Alertes et antecedents',
    chronic: 'Maladies chroniques',
    allergies: 'Allergies',
    noChronic: 'Aucune maladie signalee',
    noAllergy: 'Aucune allergie connue',
    privateNotes: 'Notes confidentielles',
    noNotes: 'Ajoutez des notes privees sur ce patient ici...',
    recentVisits: 'Dernieres visites',
    viewAll: 'Voir tout',
    noVisits: 'Aucune visite enregistree.',
    todayConsultation: 'Consultation du jour',
    importTemplate: 'Importer modele',
    motive: 'Motif de la visite',
    vitals: 'Constantes (tension, poids...)',
    clinical: 'Symptomes et examen clinique',
    diagnosis: 'Diagnostic',
    saveDraft: 'Sauvegarder brouillon',
    finish: 'Terminer consultation',
    createRx: 'Creer ordonnance',
    downloadPdf: 'Telecharger PDF',
    balance: 'Reste a payer',
    paid: 'Paye',
    unpaid: 'Impayé',
    invoices: 'Historique et factures',
    export: 'PDF',
    addedOn: 'Ajoute le',
    status: 'Statut',
    documentsTitle: 'Documents du patient',
    upload: 'Importer un document',
    browse: 'Parcourir',
    current: 'Actuelle',
    confirm: 'Confirmer',
  },
  ar: {
    back: 'رجوع',
    options: 'الخيارات',
    newAppointment: 'موعد جديد',
    overview: 'نظرة عامة',
    consultations: 'الاستشارات',
    prescriptions: 'الوصفات',
    documents: 'الملفات',
    finance: 'المالية',
    medicalRecord: 'الملف الطبي',
    bloodGroup: 'فصيلة الدم',
    insurance: 'التأمين',
    alerts: 'التنبيهات والسوابق',
    chronic: 'الأمراض المزمنة',
    allergies: 'الحساسيات',
    noChronic: 'لا توجد أمراض مزمنة مسجلة',
    noAllergy: 'لا توجد حساسية معروفة',
    privateNotes: 'ملاحظات سرية',
    noNotes: 'أضف ملاحظات خاصة لهذا المريض هنا...',
    recentVisits: 'آخر الزيارات',
    viewAll: 'عرض الكل',
    noVisits: 'لا توجد زيارات مسجلة بعد.',
    todayConsultation: 'استشارة اليوم',
    importTemplate: 'استيراد نموذج',
    motive: 'سبب الزيارة',
    vitals: 'العلامات الحيوية',
    clinical: 'الأعراض والفحص السريري',
    diagnosis: 'التشخيص',
    saveDraft: 'حفظ المسودة',
    finish: 'إنهاء الاستشارة',
    createRx: 'إنشاء وصفة',
    downloadPdf: 'تحميل PDF',
    balance: 'الباقي للدفع',
    paid: 'مدفوع',
    unpaid: 'غير مدفوع',
    invoices: 'السجل والفواتير',
    export: 'PDF',
    addedOn: 'أضيف في',
    status: 'الحالة',
    documentsTitle: 'ملفات المريض',
    upload: 'رفع ملف',
    browse: 'تصفح',
    current: 'الحالية',
    confirm: 'تأكيد',
  },
} as const;

export default function PatientProfileView({
  client,
  onClose,
}: {
  client: PatientRecord;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const locale = (pathname?.split('/')[1] || 'en') as keyof typeof COPY;
  const copy = COPY[locale] || COPY.en;
  const [activeTab, setActiveTab] = useState<ProfileTab>('overview');

  const tabs = useMemo(
    () => [
      { id: 'overview', label: copy.overview, icon: HeartPulse },
      { id: 'consultations', label: copy.consultations, icon: Stethoscope },
      { id: 'prescriptions', label: copy.prescriptions, icon: FileSymlink },
      { id: 'documents', label: copy.documents, icon: FileOutput },
      { id: 'finance', label: copy.finance, icon: CreditCard },
    ],
    [copy]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="flex flex-col gap-6"
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="flex flex-col gap-6 rounded-[28px] border border-slate-200/60 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-[#0a0f18] sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-5">
          <button
            type="button"
            onClick={onClose}
            className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <div className="flex items-start gap-5">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-white bg-gradient-to-br from-emerald-100 to-teal-100 text-3xl font-black text-emerald-700 shadow-inner dark:border-white/5 dark:from-emerald-900/40 dark:to-teal-900/20 dark:text-emerald-400">
              {client.name.charAt(0).toUpperCase()}
            </div>

            <div className="pt-1">
              <h1 className="flex items-center gap-3 text-3xl font-black text-slate-950 dark:text-white">
                {client.name}
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                    client.status === 'follow-up'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400'
                      : 'bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-400'
                  }`}
                >
                  {client.status === 'follow-up' ? 'En suivi' : 'Inactif'}
                </span>
              </h1>

              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm font-semibold text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Phone className="h-4 w-4 text-slate-400" />
                  {client.phone || 'N/A'}
                </span>
                <span className="flex items-center gap-1.5">
                  <UserCircle2 className="h-4 w-4 text-slate-400" />
                  {client.age} ans {client.gender ? `• ${client.gender}` : ''}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  {copy.addedOn} {client.history[client.history.length - 1]?.date || 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50 dark:border-white/10 dark:bg-transparent dark:text-slate-300 dark:hover:bg-white/5">
            {copy.options}
          </button>
          <button className="flex items-center gap-2 rounded-xl bg-[#12695b] px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-emerald-900/20 transition-colors hover:bg-[#0f5a4e]">
            <Calendar className="h-4 w-4" />
            {copy.newAppointment}
          </button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as ProfileTab)}
              className={`flex shrink-0 items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold transition-all ${
                isActive
                  ? 'border-transparent bg-[#12695b] text-white shadow-md'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-white/5 dark:bg-[#0a0f18] dark:text-slate-400 dark:hover:bg-white/5'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'overview' ? (
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-1">
                  <div className="rounded-[24px] border border-slate-200/60 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-[#0a0f18]">
                    <h3 className="mb-5 flex items-center gap-2 text-lg font-black text-slate-900 dark:text-white">
                      <HeartPulse className="h-5 w-5 text-rose-500" />
                      {copy.medicalRecord}
                    </h3>

                    <div className="space-y-4">
                      <InfoRow label={copy.bloodGroup} value={client.bloodGroup || 'N/A'} icon={Shield} />
                      <InfoRow label={copy.insurance} value={client.insurance || 'N/A'} icon={CreditCard} />
                    </div>
                  </div>

                  <div className="rounded-[24px] border border-slate-200/60 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-[#0a0f18]">
                    <h3 className="mb-5 flex items-center gap-2 text-lg font-black text-slate-900 dark:text-white">
                      <Clock className="h-5 w-5 text-amber-500" />
                      {copy.alerts}
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <div className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">{copy.chronic}</div>
                        {client.chronicDiseases?.length ? (
                          <div className="flex flex-wrap gap-2">
                            {client.chronicDiseases.map((item) => (
                              <span key={item} className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400">
                                {item}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <div className="text-sm italic text-slate-400">{copy.noChronic}</div>
                        )}
                      </div>

                      <div>
                        <div className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">{copy.allergies}</div>
                        {client.allergies?.length ? (
                          <div className="flex flex-wrap gap-2">
                            {client.allergies.map((item) => (
                              <span key={item} className="rounded-lg border border-red-200 bg-red-50 px-3 py-1 text-xs font-bold text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
                                {item}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <div className="text-sm italic text-slate-400">{copy.noAllergy}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 lg:col-span-2">
                  <div className="rounded-[24px] border border-amber-200/60 bg-gradient-to-br from-amber-50 to-orange-50/30 p-6 shadow-sm dark:border-amber-500/20 dark:from-amber-950/20 dark:to-[#0a0f18]">
                    <h3 className="mb-4 flex items-center gap-2 text-lg font-black text-amber-900 dark:text-amber-500">
                      <FileText className="h-5 w-5 text-amber-600 dark:text-amber-500" />
                      {copy.privateNotes}
                    </h3>
                    <div className="whitespace-pre-wrap text-sm leading-relaxed text-amber-800/80 dark:text-amber-200/60">
                      {client.notes || copy.noNotes}
                    </div>
                  </div>

                  <div className="rounded-[24px] border border-slate-200/60 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-[#0a0f18]">
                    <div className="mb-6 flex items-center justify-between">
                      <h3 className="flex items-center gap-2 text-lg font-black text-slate-900 dark:text-white">
                        <Activity className="h-5 w-5 text-[#12695b]" />
                        {copy.recentVisits}
                      </h3>
                      <button type="button" onClick={() => setActiveTab('consultations')} className="text-sm font-bold text-[#12695b] hover:underline dark:text-emerald-400">
                        {copy.viewAll}
                      </button>
                    </div>

                    <div className="space-y-4">
                      {client.history.slice(0, 3).map((item) => (
                        <div
                          key={item.id}
                          className="group flex items-start gap-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-4 transition-all hover:border-slate-200 hover:shadow-sm dark:border-white/5 dark:bg-white/[0.02] dark:hover:border-white/10"
                        >
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-sm dark:bg-[#0d1726] dark:border dark:border-white/5">
                            <Stethoscope className="h-4 w-4 text-[#12695b] dark:text-emerald-400" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div className="font-bold text-slate-900 dark:text-white">{item.type}</div>
                              <div className="text-xs font-bold text-slate-400">{item.date} • {item.time}</div>
                            </div>
                            <div className="mt-1 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
                              {item.comment || '—'}
                            </div>
                          </div>
                        </div>
                      ))}
                      {client.history.length === 0 ? <div className="py-6 text-center text-sm text-slate-400">{copy.noVisits}</div> : null}
                    </div>
                  </div>
                </div>
              </div>
            ) : activeTab === 'consultations' ? (
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="rounded-[24px] border border-slate-200/60 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-[#0a0f18] lg:col-span-1">
                  <h3 className="mb-5 flex items-center gap-2 text-lg font-black text-slate-900 dark:text-white">
                    <Clock className="h-5 w-5 text-[#12695b]" />
                    {copy.recentVisits}
                  </h3>
                  <div className="space-y-4">
                    {client.history.map((item) => (
                      <button key={item.id} className="w-full rounded-2xl border border-slate-100 bg-slate-50 p-4 text-start transition-all hover:bg-slate-100 dark:border-white/5 dark:bg-white/[0.02] dark:hover:bg-white/[0.05]">
                        <div className="mb-1 flex items-center justify-between">
                          <span className="font-bold text-slate-700 dark:text-slate-300">{item.type}</span>
                          <span className="text-xs font-bold text-slate-400">{item.date}</span>
                        </div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">{item.time}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-6 lg:col-span-2">
                  <div className="rounded-[24px] border border-slate-200/60 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-[#0a0f18]">
                    <div className="mb-6 flex items-center justify-between">
                      <h3 className="flex items-center gap-2 text-xl font-black text-slate-900 dark:text-white">
                        <Stethoscope className="h-6 w-6 text-[#12695b]" />
                        {copy.todayConsultation}
                      </h3>
                      <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50 dark:border-white/10 dark:bg-transparent dark:text-slate-300 dark:hover:bg-white/5">
                        <FileSymlink className="h-4 w-4" />
                        {copy.importTemplate}
                      </button>
                    </div>

                    <div className="space-y-6">
                      <div className="grid gap-6 sm:grid-cols-2">
                        <SimpleField label={copy.motive} placeholder="Ex: Douleur abdominale..." />
                        <SimpleField label={copy.vitals} placeholder="Ex: TA 12/8, 75kg..." />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold uppercase tracking-wide text-slate-700 dark:text-slate-300">{copy.clinical}</label>
                        <textarea rows={4} placeholder="Décrivez l'examen clinique..." className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-[#12695b] dark:border-white/10 dark:bg-[#0d1726] dark:text-white" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold uppercase tracking-wide text-rose-700 dark:text-rose-400">{copy.diagnosis}</label>
                        <textarea rows={2} placeholder="Diagnostic final..." className="w-full resize-none rounded-xl border border-rose-200 bg-rose-50/50 px-4 py-3 outline-none focus:ring-2 focus:ring-rose-500 dark:border-rose-900/30 dark:bg-rose-900/10 dark:text-white" />
                      </div>
                    </div>

                    <div className="mt-8 flex flex-wrap items-center justify-end gap-3 border-t border-slate-100 pt-6 dark:border-white/5">
                      <button className="rounded-xl bg-slate-100 px-5 py-2.5 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-200 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10">
                        {copy.saveDraft}
                      </button>
                      <button className="flex items-center gap-2 rounded-xl bg-[#12695b] px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-emerald-900/20 transition-colors hover:bg-[#0f5a4e]">
                        <CheckCircle2 className="h-4 w-4" />
                        {copy.finish}
                      </button>
                      <button className="flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white shadow-md transition-colors hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200">
                        <FileSymlink className="h-4 w-4" />
                        {copy.createRx}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : activeTab === 'prescriptions' ? (
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-[24px] border border-slate-200/60 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-[#0a0f18]">
                  <h3 className="mb-6 flex items-center gap-2 text-xl font-black text-slate-900 dark:text-white">
                    <FileSymlink className="h-6 w-6 text-[#12695b]" />
                    {copy.createRx}
                  </h3>

                  <div className="space-y-4">
                    <SimpleField label="Médicament" placeholder="Ex: Paracétamol 1000mg" />
                    <SimpleField label="Posologie" placeholder="Ex: 1 comprimé matin et soir pendant 5 jours" />
                    <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-emerald-300 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700 transition-colors hover:bg-emerald-100 dark:border-emerald-900/50 dark:bg-emerald-900/10 dark:text-emerald-400 dark:hover:bg-emerald-900/30">
                      + Ajouter un autre médicament
                    </button>
                  </div>

                  <div className="mt-8 flex gap-3 border-t border-slate-100 pt-6 dark:border-white/5">
                    <button className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white shadow-md transition-colors hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200">
                      <Download className="h-4 w-4" />
                      {copy.downloadPdf}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-center rounded-[24px] border border-slate-200/60 bg-slate-50 p-6 dark:border-white/5 dark:bg-[#0d1726]">
                  <div className="relative aspect-[1/1.4] w-full max-w-sm rounded-md bg-white p-8 shadow-xl dark:bg-[#e2e8f0]">
                    <div className="mb-6 border-b-2 border-slate-800 pb-4 text-center">
                      <h4 className="font-serif text-2xl font-black text-slate-900">Dr. DarijaDoc</h4>
                      <p className="mt-1 text-xs text-slate-600">
                        Spécialiste en Médecine Générale
                        <br />
                        Casablanca, Maroc
                      </p>
                    </div>
                    <div className="mb-8 flex items-end justify-between text-sm text-slate-800">
                      <div>
                        <strong>Patient:</strong> {client.name}
                      </div>
                      <div className="text-right">
                        <strong>Le:</strong> {new Date().toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                    <div className="absolute left-8 top-[40%] select-none text-4xl font-serif font-bold text-slate-300">Rx</div>
                    <div className="relative z-10 space-y-6 ps-12">
                      <div>
                        <div className="font-bold text-slate-900">1. Paracétamol 1000mg</div>
                        <div className="mt-1 text-sm text-slate-700">1 comprimé matin et soir pendant 5 jours.</div>
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">2. Vitamine C 500mg</div>
                        <div className="mt-1 text-sm text-slate-700">1 gélule le matin avec un grand verre d&apos;eau.</div>
                      </div>
                    </div>
                    <div className="absolute bottom-8 right-8 w-32 border-t border-slate-400 pt-2 text-center text-xs font-serif italic text-slate-500">
                      Signature
                    </div>
                  </div>
                </div>
              </div>
            ) : activeTab === 'documents' ? (
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-1">
                  <div className="rounded-[24px] border border-dashed border-emerald-300 bg-emerald-50/50 p-8 text-center transition-colors hover:bg-emerald-50 dark:border-emerald-900/50 dark:bg-emerald-900/10 dark:hover:bg-emerald-900/20">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40">
                      <Download className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h4 className="mt-4 text-lg font-bold text-emerald-900 dark:text-emerald-300">{copy.upload}</h4>
                    <p className="mt-2 text-sm text-emerald-700/80 dark:text-emerald-400/70">
                      Glissez-déposez vos fichiers PDF, images, ou résultats d&apos;analyse ici.
                    </p>
                    <button className="mt-6 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white shadow-md transition-colors hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600">
                      {copy.browse}
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-2">
                  <div className="h-full rounded-[24px] border border-slate-200/60 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-[#0a0f18]">
                    <div className="mb-6 flex items-center justify-between">
                      <h3 className="flex items-center gap-2 text-xl font-black text-slate-900 dark:text-white">
                        <FileOutput className="h-6 w-6 text-[#12695b]" />
                        {copy.documentsTitle}
                      </h3>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <DocumentCard title="Résultats Bilan Sanguin.pdf" subtitle="Ajouté il y a 2 jours • 1.2 MB" tone="rose" />
                      <DocumentCard title="Radiographie Thorax.jpg" subtitle="Il y a 1 mois • 4.5 MB" tone="blue" />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-1">
                  <div className="rounded-[24px] border border-slate-200/60 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-[#0a0f18]">
                    <h3 className="mb-5 flex items-center gap-2 text-lg font-black text-slate-900 dark:text-white">
                      <CreditCard className="h-5 w-5 text-[#12695b]" />
                      {copy.finance}
                    </h3>
                    <div className="space-y-4">
                      <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 dark:border-emerald-900/30 dark:bg-emerald-900/10">
                        <div className="text-sm font-bold text-emerald-700 dark:text-emerald-400">{copy.paid}</div>
                        <div className="mt-1 text-2xl font-black text-emerald-800 dark:text-emerald-300">{client.amountPaid} MAD</div>
                      </div>
                      <div className="rounded-2xl border border-rose-100 bg-rose-50 p-4 dark:border-rose-900/30 dark:bg-rose-900/10">
                        <div className="text-sm font-bold text-rose-700 dark:text-rose-400">{copy.balance}</div>
                        <div className="mt-1 text-2xl font-black text-rose-800 dark:text-rose-300">{Math.max(0, client.totalFee - client.amountPaid)} MAD</div>
                      </div>
                    </div>
                    <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white shadow-md transition-colors hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200">
                      {copy.confirm}
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-2">
                  <div className="h-full rounded-[24px] border border-slate-200/60 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-[#0a0f18]">
                    <h3 className="mb-6 flex items-center gap-2 text-xl font-black text-slate-900 dark:text-white">
                      <FileText className="h-6 w-6 text-[#12695b]" />
                      {copy.invoices}
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead>
                          <tr className="border-b border-slate-100 text-slate-500 dark:border-white/5 dark:text-slate-400">
                            <th className="py-3 font-bold">Date</th>
                            <th className="py-3 font-bold">Motif</th>
                            <th className="py-3 font-bold">Montant</th>
                            <th className="py-3 font-bold">{copy.status}</th>
                            <th className="py-3 font-bold text-right">{copy.export}</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-slate-50 transition-colors hover:bg-slate-50/50 dark:border-white/[0.02] dark:hover:bg-white/[0.02]">
                            <td className="py-4 font-bold text-slate-900 dark:text-white">{client.date}</td>
                            <td className="py-4 text-slate-600 dark:text-slate-300">Consultation Générale</td>
                            <td className="py-4 font-bold text-slate-900 dark:text-white">{client.totalFee} MAD</td>
                            <td className="py-4">
                              {client.amountPaid >= client.totalFee ? (
                                <span className="rounded-md bg-emerald-100 px-2 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                                  {copy.paid}
                                </span>
                              ) : (
                                <span className="rounded-md bg-rose-100 px-2 py-1 text-xs font-bold text-rose-700 dark:bg-rose-900/30 dark:text-rose-400">
                                  {copy.unpaid}
                                </span>
                              )}
                            </td>
                            <td className="py-4 text-right">
                              <button className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5">
                                <Download className="h-3 w-3" />
                                PDF
                              </button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function InfoRow({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: ElementType;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3 dark:bg-white/[0.02]">
      <div className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-400">
        <Icon className="h-4 w-4 text-[#12695b]" />
        {label}
      </div>
      <div className="text-sm font-black text-slate-900 dark:text-white">{value}</div>
    </div>
  );
}

function SimpleField({
  label,
  placeholder,
}: {
  label: string;
  placeholder: string;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-bold uppercase tracking-wide text-slate-700 dark:text-slate-300">{label}</label>
      <input
        type="text"
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-[#12695b] dark:border-white/10 dark:bg-[#0d1726] dark:text-white"
      />
    </div>
  );
}

function DocumentCard({
  title,
  subtitle,
  tone,
}: {
  title: string;
  subtitle: string;
  tone: 'rose' | 'blue';
}) {
  return (
    <div className="group flex items-start gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 transition-all hover:border-emerald-200 hover:shadow-sm dark:border-white/5 dark:bg-white/[0.02] dark:hover:border-emerald-900/50">
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
          tone === 'rose'
            ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400'
            : 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400'
        }`}
      >
        <FileText className="h-6 w-6" />
      </div>
      <div className="flex-1">
        <h4 className="line-clamp-1 font-bold text-slate-900 dark:text-white">{title}</h4>
        <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{subtitle}</div>
      </div>
    </div>
  );
}
