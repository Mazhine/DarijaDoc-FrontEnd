'use client';

import { FormEvent, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CalendarDays, Check, ChevronDown, ShieldCheck, Stethoscope, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import WhatsAppChat from '../chat/WhatsAppChat';
import { getLandingContent, type LocaleKey } from '../../content/landing';

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.45 },
};

const localeMap: Record<LocaleKey, string> = {
  fr: 'fr-FR',
  en: 'en-US',
  ar: 'ar-MA',
};

type DemoForm = {
  fullName: string;
  specialty: string;
  city: string;
  phone: string;
  email: string;
};

const initialForm: DemoForm = {
  fullName: '',
  specialty: '',
  city: '',
  phone: '',
  email: '',
};

export default function LandingPage({ locale }: { locale: LocaleKey }) {
  const copy = getLandingContent(locale);
  const isArabic = locale === 'ar';
  const pricingCopy =
    locale === 'fr'
      ? {
          label: 'Abonnement',
          price: '400 DH / mois',
          description: 'Tarif simple pour un cabinet qui veut gagner du temps au secretariat, mieux remplir l agenda et garder un ton medical clair.',
          bullets: [
            'Rappels et qualification sur WhatsApp',
            'Agenda pense pour une consultation de 20 minutes',
            'Vue patients, equipe et calendrier dans le meme outil',
          ],
          simulator: 'Simulation cabinet',
          estimate: 'Estimation de gain mensuel',
          included: 'Abonnement inclus: 400 DH',
          patients: 'Patients / mois',
          visitPrice: 'Prix moyen visite',
          minutesSaved: 'Minutes gagnees / patient',
          revenue: 'CA potentiel traite',
          savedTime: 'Temps gagne',
          netGain: 'Gain net estime',
          workflowCta: 'Planifier une demo',
        }
      : locale === 'ar'
        ? {
            label: 'الاشتراك',
            price: '400 درهم / الشهر',
            description: 'سعر واضح لعيادة تريد ربح الوقت في السكرتارية وتحسين ملء المواعيد مع واجهة طبية متماسكة.',
            bullets: [
              'تذكيرات وتأهيل الطلبات عبر واتساب',
              'جدول مناسب لإيقاع العيادة',
              'المرضى والفريق والتقويم في نفس الأداة',
            ],
            simulator: 'محاكاة العيادة',
            estimate: 'تقدير الربح الشهري',
            included: 'الاشتراك مشمول: 400 درهم',
            patients: 'المرضى / الشهر',
            visitPrice: 'متوسط سعر الزيارة',
            minutesSaved: 'الدقائق المربوحة / مريض',
            revenue: 'رقم المعاملات المحتمل',
            savedTime: 'الوقت المربوح',
            netGain: 'الربح الصافي المتوقع',
            workflowCta: 'احجز ديمو',
          }
        : {
            label: 'Subscription',
            price: '400 MAD / month',
            description: 'A simple price for clinics that want to save secretary time, fill schedules better, and keep a clear medical tone.',
            bullets: [
              'WhatsApp reminders and request qualification',
              'A schedule shaped for clinic rhythm',
              'Patients, team, and calendar in one tool',
            ],
            simulator: 'Clinic simulation',
            estimate: 'Estimated monthly gain',
            included: 'Subscription included: 400 MAD',
            patients: 'Patients / month',
            visitPrice: 'Average visit price',
            minutesSaved: 'Minutes saved / patient',
            revenue: 'Potential handled revenue',
            savedTime: 'Time saved',
            netGain: 'Estimated net gain',
            workflowCta: 'Schedule a demo',
          };
  const [form, setForm] = useState<DemoForm>(initialForm);
  const [selectedDate, setSelectedDate] = useState(() => {
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + 1);
    return nextDate.toISOString().split('T')[0];
  });
  const [selectedTime, setSelectedTime] = useState('10:00');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [openQuestion, setOpenQuestion] = useState(0);
  const [monthlyPatients, setMonthlyPatients] = useState(140);
  const [visitPrice, setVisitPrice] = useState(250);
  const [minutesSaved, setMinutesSaved] = useState(6);

  const selectedDateLabel = useMemo(() => {
    const formatterDay = new Intl.DateTimeFormat(localeMap[locale], {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
    return formatterDay.format(new Date(selectedDate));
  }, [locale, selectedDate]);

  const subscriptionPrice = 400;
  const revenue = monthlyPatients * visitPrice;
  const savedHours = Math.round((monthlyPatients * minutesSaved) / 60);
  const netGain = Math.max(revenue - subscriptionPrice, 0);

  const fieldClass =
    'premium-input min-h-[48px] rounded-2xl px-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#12695b] focus:ring-4 focus:ring-[#12695b]/10 dark:placeholder:text-slate-500';

  const updateField = (name: keyof DemoForm, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="relative overflow-hidden bg-transparent text-slate-900 transition-colors dark:text-white" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[400px] bg-gradient-to-b from-slate-50/50 to-transparent dark:from-slate-900/50" />
      <section id="hero" className="relative px-5 pb-16 pt-28 md:px-6 md:pb-20 md:pt-32">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <motion.div {...reveal}>
            <div className="premium-chip inline-flex rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] shadow-[0_12px_28px_-20px_rgba(18,105,91,0.35)] backdrop-blur">
              {copy.hero.badge}
            </div>

            <h1 className="mt-6 max-w-2xl text-[clamp(2.3rem,5.4vw,4.5rem)] font-semibold leading-[1.02] text-slate-950 dark:text-white [font-family:var(--font-medical-display)]">
              {copy.hero.title}
            </h1>

            <p className="mt-5 max-w-xl text-[15px] leading-7 text-slate-600 dark:text-slate-300 md:text-base">
              {copy.hero.description}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#demo"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#12695b] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0f5a4e]"
              >
                {copy.hero.primaryCta}
                <ArrowRight className="h-4 w-4" />
              </a>
              <Link
                href={`/${locale}/auth`}
                className="premium-subtle inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-medium text-slate-700 transition hover:text-slate-950 dark:text-slate-200 dark:hover:text-white"
              >
                {copy.hero.secondaryCta}
              </Link>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {copy.hero.points.map((point) => (
                <div key={point} className="premium-surface rounded-3xl px-4 py-4 text-sm leading-6 text-slate-700 shadow-[0_22px_40px_-28px_rgba(15,23,42,0.2)] dark:text-slate-300">
                  {point}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div {...reveal} className="relative">
            <div className="absolute inset-x-8 top-10 h-32 rounded-full bg-[#d7efe8] opacity-30 blur-3xl dark:bg-[#12695b]/10" />
            <div className="absolute -bottom-4 start-8 h-24 w-24 rounded-full bg-[#f3d0bd] opacity-20 blur-2xl dark:bg-[#f3d0bd]/10" />
            <WhatsAppChat heroOnly />
          </motion.div>
        </div>
      </section>

      <section className="relative px-5 py-10 md:px-6 md:py-14">
        <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-3">
          {copy.highlights.items.map((item, index) => {
            const icons = [MessageEventIcon, Users, ShieldCheck];
            const Icon = icons[index] || Stethoscope;

            return (
              <div
                key={item.title}
                className="premium-surface rounded-[28px] p-6"
              >
                <div className="premium-chip flex h-11 w-11 items-center justify-center rounded-2xl">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="mt-4 text-xl font-semibold text-slate-950 dark:text-white [font-family:var(--font-medical-display)]">{item.title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{item.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section id="workflow" className="relative px-5 py-16 md:px-6">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[4%] top-12 h-28 w-28 rounded-full bg-[#dcefe8] blur-2xl dark:bg-[#12695b]/20" />
          <div className="absolute right-[8%] top-20 h-40 w-40 rounded-[32px] border border-[#d7e8e2] bg-white/40 rotate-12 dark:border-white/10 dark:bg-white/5" />
          <div className="absolute bottom-8 start-1/2 h-24 w-64 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(241,181,152,0.28),transparent_70%)]" />
        </div>
        <div className="mx-auto max-w-6xl">
          <motion.div {...reveal} className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#12695b] dark:text-[#9fe7d4]">{copy.workflow.eyebrow}</p>
            <h2 className="mt-3 text-[clamp(2rem,4vw,3.25rem)] font-semibold leading-[1.05] text-slate-950 dark:text-white [font-family:var(--font-medical-display)]">
              {copy.workflow.title}
            </h2>
          </motion.div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {copy.workflow.steps.map((step, index) => (
              <motion.div
                key={step.id}
                {...reveal}
                className="premium-surface relative rounded-[28px] p-6"
              >
                <div className="absolute end-0 top-0 h-24 w-24 rounded-full bg-[radial-gradient(circle,rgba(18,105,91,0.12),transparent_68%)]" />
                <div className="text-sm font-semibold text-[#12695b] dark:text-[#9fe7d4]">{step.id}</div>
                <h3 className="mt-3 text-xl font-semibold text-slate-950 dark:text-white [font-family:var(--font-medical-display)]">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{step.description}</p>
                {index === copy.workflow.steps.length - 1 ? (
                  <a href="#demo" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#12695b] dark:text-[#9fe7d4]">
                    {pricingCopy.workflowCta}
                    <ArrowRight className="h-4 w-4" />
                  </a>
                ) : null}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="px-5 py-4 md:px-6 md:py-10">
        <div className="mx-auto grid max-w-6xl gap-4 lg:grid-cols-[0.78fr_1.22fr]">
          <motion.div {...reveal} className="premium-surface rounded-[32px] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#12695b] dark:text-[#9fe7d4]">{pricingCopy.label}</p>
            <h2 className="mt-3 text-[clamp(2rem,4vw,3rem)] font-semibold text-slate-950 dark:text-white [font-family:var(--font-medical-display)]">{pricingCopy.price}</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
              {pricingCopy.description}
            </p>
            <div className="mt-6 grid gap-3">
              {pricingCopy.bullets.map((item) => (
                <div key={item} className="premium-subtle rounded-2xl px-4 py-3 text-sm text-slate-700 shadow-sm dark:text-slate-200">
                  {item}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div {...reveal} className="premium-surface rounded-[32px] p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#12695b] dark:text-[#9fe7d4]">{pricingCopy.simulator}</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white [font-family:var(--font-medical-display)]">{pricingCopy.estimate}</h2>
              </div>
              <div className="premium-chip rounded-full px-4 py-2 text-xs font-semibold">
                {pricingCopy.included}
              </div>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-3">
              <RangeField label={pricingCopy.patients} value={monthlyPatients} min={20} max={350} step={10} onChange={setMonthlyPatients} />
              <RangeField label={pricingCopy.visitPrice} value={visitPrice} min={80} max={600} step={10} suffix={locale === 'ar' ? ' درهم' : ' DH'} onChange={setVisitPrice} />
              <RangeField label={pricingCopy.minutesSaved} value={minutesSaved} min={2} max={12} step={1} suffix={locale === 'ar' ? ' د' : ' min'} onChange={setMinutesSaved} />
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <MetricCard label={pricingCopy.revenue} value={`${new Intl.NumberFormat(locale === 'en' ? 'en-MA' : locale === 'ar' ? 'ar-MA' : 'fr-MA').format(revenue)} ${locale === 'ar' ? 'درهم' : 'DH'}`} />
              <MetricCard label={pricingCopy.savedTime} value={locale === 'ar' ? `${savedHours} س / شهر` : `${savedHours} h / mois`} />
              <MetricCard label={pricingCopy.netGain} value={`${new Intl.NumberFormat(locale === 'en' ? 'en-MA' : locale === 'ar' ? 'ar-MA' : 'fr-MA').format(netGain)} ${locale === 'ar' ? 'درهم' : 'DH'}`} accent />
            </div>
          </motion.div>
        </div>
      </section>

      <section id="access" className="medical-pattern relative overflow-hidden border-y border-[#e5ece7] bg-[linear-gradient(180deg,#fdfcf8_0%,#eef6f1_56%,#edf4f2_100%)] px-5 py-16 dark:border-white/10 dark:bg-[linear-gradient(180deg,#0b1624_0%,#0a1421_56%,#07111f_100%)] md:px-6">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[6%] top-10 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(18,105,91,0.12),transparent_68%)]" />
          <div className="absolute right-[8%] bottom-12 h-36 w-36 rounded-[2rem] border border-[#d9e8e2] bg-white/35 rotate-12 dark:border-white/10 dark:bg-white/5" />
          <div className="absolute start-1/2 top-16 h-px w-[72%] -translate-x-1/2 bg-[linear-gradient(90deg,transparent,rgba(18,105,91,0.18),transparent)]" />
        </div>
        <div className="mx-auto max-w-6xl">
          <motion.div {...reveal} className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#12695b] dark:text-[#9fe7d4]">{copy.access.eyebrow}</p>
            <h2 className="mt-3 text-[clamp(2rem,4vw,3.25rem)] font-semibold leading-[1.05] text-slate-950 dark:text-white [font-family:var(--font-medical-display)]">
              {copy.access.title}
            </h2>
          </motion.div>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {copy.access.cards.map((item) => (
              <motion.div
                key={item.slug}
                {...reveal}
                className="premium-surface rounded-[28px] p-6"
              >
                <h3 className="text-xl font-semibold text-slate-950 dark:text-white [font-family:var(--font-medical-display)]">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{item.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {item.bullets.map((bullet) => (
                    <span key={bullet} className="premium-chip rounded-full px-3 py-1.5 text-xs font-medium">
                      {bullet}
                    </span>
                  ))}
                </div>
                <Link
                  href={`/${locale}/auth`}
                  className="premium-subtle mt-6 inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:text-slate-950 dark:text-slate-200 dark:hover:text-white"
                >
                  {item.cta}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="medical-pattern relative overflow-hidden px-5 py-16 md:px-6">
        <div className="pointer-events-none absolute inset-0 opacity-90">
          <div className="absolute left-[10%] top-14 h-28 w-28 rounded-full border border-[#d5e8e2] bg-white/35 dark:border-white/10 dark:bg-white/5" />
          <div className="absolute right-[12%] top-28 h-20 w-56 rounded-full bg-[radial-gradient(circle,rgba(241,181,152,0.18),transparent_70%)]" />
        </div>
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.82fr_1.18fr]">
          <motion.div {...reveal}>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#12695b] dark:text-[#9fe7d4]">{copy.faq.eyebrow}</p>
            <h2 className="mt-3 text-[clamp(2rem,4vw,3.25rem)] font-semibold leading-[1.05] text-slate-950 dark:text-white [font-family:var(--font-medical-display)]">
              {copy.faq.title}
            </h2>
          </motion.div>

          <div className="space-y-3">
            {copy.faq.items.map((item, index) => {
              const isOpen = openQuestion === index;

              return (
                <motion.button
                  type="button"
                  key={item.question}
                  {...reveal}
                  onClick={() => setOpenQuestion(index)}
                  className={`premium-surface w-full rounded-[26px] p-5 ${isArabic ? 'text-right' : 'text-left'}`}
                >
                  <div className={`flex items-center justify-between gap-4 ${isArabic ? 'text-right' : ''}`}>
                    <span className="text-base font-medium text-slate-950 dark:text-white">{item.question}</span>
                    <ChevronDown className={`h-5 w-5 shrink-0 text-slate-400 transition ${isOpen ? 'rotate-180' : ''}`} />
                  </div>
                  {isOpen ? <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{item.answer}</p> : null}
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      <section id="demo" className="medical-pattern relative overflow-hidden border-t border-[#e5ece7] bg-[linear-gradient(180deg,rgba(252,249,242,0.95),rgba(255,255,255,0.92))] px-5 py-16 dark:border-white/10 dark:bg-[linear-gradient(180deg,#08111d,#0a1421)] md:px-6">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute right-[8%] top-10 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(18,105,91,0.1),transparent_70%)]" />
          <div className="absolute left-[4%] bottom-10 h-36 w-36 rounded-[2rem] border border-[#e4d5ce] bg-white/25 -rotate-12 dark:border-white/10 dark:bg-white/5" />
        </div>
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.88fr_1.12fr]">
          <motion.div {...reveal}>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#12695b] dark:text-[#9fe7d4]">{copy.demo.eyebrow}</p>
            <h2 className="mt-3 text-[clamp(2rem,4vw,3.25rem)] font-semibold leading-[1.05] text-slate-950 dark:text-white [font-family:var(--font-medical-display)]">
              {copy.demo.title}
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-7 text-slate-600 dark:text-slate-300">{copy.demo.description}</p>
            <p className="premium-chip mt-5 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium">
              <CalendarDays className="h-4 w-4" />
              {copy.demo.helper}
            </p>
          </motion.div>

          <motion.div {...reveal} className="premium-surface rounded-[32px] p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  value={form.fullName}
                  onChange={(e) => updateField('fullName', e.target.value)}
                  className={fieldClass}
                  placeholder={copy.demo.placeholders.fullName}
                  aria-label={copy.demo.labels.fullName}
                  required
                />
                <input
                  value={form.specialty}
                  onChange={(e) => updateField('specialty', e.target.value)}
                  className={fieldClass}
                  placeholder={copy.demo.placeholders.specialty}
                  aria-label={copy.demo.labels.specialty}
                  required
                />
                <input
                  value={form.city}
                  onChange={(e) => updateField('city', e.target.value)}
                  className={fieldClass}
                  placeholder={copy.demo.placeholders.city}
                  aria-label={copy.demo.labels.city}
                  required
                />
                <input
                  value={form.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  className={fieldClass}
                  placeholder={copy.demo.placeholders.phone}
                  aria-label={copy.demo.labels.phone}
                  required
                />
                <input
                  value={form.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  className={`md:col-span-2 ${fieldClass}`}
                  placeholder={copy.demo.placeholders.email}
                  aria-label={copy.demo.labels.email}
                  type="email"
                  required
                />
              </div>

              <div>
                <div className="mb-3 text-sm font-medium text-slate-700 dark:text-slate-200">{copy.demo.labels.date}</div>
                <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
                  <input
                    type="date"
                    value={selectedDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className={fieldClass}
                    required
                  />
                  <div className="premium-subtle rounded-2xl px-4 py-3 text-sm font-medium text-[#12695b] dark:text-[#9fe7d4]">
                    {selectedDateLabel}
                  </div>
                </div>
              </div>

              <div>
                <div className="mb-3 text-sm font-medium text-slate-700 dark:text-slate-200">{copy.demo.labels.time}</div>
                  <input
                    type="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className={`md:col-span-3 ${fieldClass}`}
                    required
                  />
              </div>

              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full bg-[#12695b] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0f5a4e]"
              >
                {copy.demo.submit}
              </button>

              {isSubmitted ? (
                <div className="premium-chip rounded-3xl px-4 py-3 text-sm">
                  <div className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>
                      {copy.demo.success} {selectedDateLabel} - {selectedTime}
                    </span>
                  </div>
                </div>
              ) : null}
            </form>
          </motion.div>
        </div>
      </section>

      <section className="medical-pattern relative overflow-hidden px-5 py-16 md:px-6">
        <div className="mx-auto max-w-6xl rounded-[36px] bg-[linear-gradient(135deg,#12695b_0%,#19816f_46%,#e2a78d_140%)] px-6 py-10 text-white shadow-[0_28px_60px_-36px_rgba(18,105,91,0.55)] md:px-10">
          <h2 className="max-w-2xl text-[clamp(2rem,4vw,3rem)] font-semibold leading-[1.05] [font-family:var(--font-medical-display)]">
            {copy.closing.title}
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#d9f1ec]">{copy.closing.description}</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a
              href="#demo"
              className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#12695b]"
            >
              {copy.closing.primaryCta}
            </a>
            <Link
              href={`/${locale}/auth`}
              className="inline-flex items-center justify-center rounded-full border border-white/20 px-5 py-3 text-sm font-medium text-white"
            >
              {copy.closing.secondaryCta}
            </Link>
          </div>
        </div>
      </section>

      <footer className="medical-pattern border-t border-[#e5ece7] bg-white/88 px-5 py-10 backdrop-blur dark:border-white/10 dark:bg-[linear-gradient(180deg,#08111d,#091321)] md:px-6">
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
          <div>
            <div className="text-lg font-semibold text-slate-950 dark:text-white">DarijaDoc</div>
            <p className="mt-3 max-w-sm text-sm leading-7 text-slate-600 dark:text-slate-300">{copy.footer.tagline}</p>
          </div>

          <FooterColumn title={copy.footer.productTitle} links={copy.footer.productLinks} />
          <FooterColumn title={copy.footer.companyTitle} links={copy.footer.companyLinks} />
          <FooterColumn title={copy.footer.resourcesTitle} links={copy.footer.resourceLinks} />
        </div>
      </footer>
    </div>
  );
}

function RangeField({
  label,
  value,
  min,
  max,
  step,
  suffix = '',
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  suffix?: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="premium-surface block rounded-[24px] p-4">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{label}</span>
        <span className="premium-chip rounded-full px-3 py-1 text-xs font-semibold">
          {value}
          {suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-4 w-full accent-[#12695b]"
      />
    </label>
  );
}

function MetricCard({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`rounded-[24px] p-4 ${accent ? 'premium-chip' : 'premium-subtle'}`}>
      <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">{label}</div>
      <div className="mt-3 text-2xl font-semibold text-slate-950 dark:text-white [font-family:var(--font-medical-display)]">{value}</div>
    </div>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: Array<{ label: string; href: string }>;
}) {
  return (
    <div>
      <div className="text-sm font-semibold text-slate-950 dark:text-white">{title}</div>
      <div className="mt-3 flex flex-col gap-2">
        {links.map((link) => (
          <a key={`${title}-${link.label}`} href={link.href} className="text-sm text-slate-600 transition hover:text-slate-950 dark:text-slate-300 dark:hover:text-white">
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
}

function MessageEventIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M7 8.5h10M7 12h6m-6.5 7L4 21l.9-3.1A8 8 0 1 1 20 12a8 8 0 0 1-13.5 7Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
