'use client';

import { FormEvent, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowRight,
  BadgeCheck,
  BellRing,
  BrainCircuit,
  Building2,
  CalendarRange,
  CheckCircle2,
  Clock3,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Stethoscope,
  UserRound,
} from 'lucide-react';
import WhatsAppChat from '../chat/WhatsAppChat';
import { getLandingContent, type LocaleKey } from '../../content/landing';

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
};

const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const card = {
  hidden: { opacity: 0, y: 26, scale: 0.985 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
  },
};

type FormState = {
  clinicName: string;
  doctorFullName: string;
  doctorPhone: string;
  officePhone: string;
  address: string;
  weekdayHours: string;
  fridayHours: string;
  saturdayHours: string;
};

const initialForm: FormState = {
  clinicName: '',
  doctorFullName: '',
  doctorPhone: '',
  officePhone: '',
  address: '',
  weekdayHours: '',
  fridayHours: '',
  saturdayHours: '',
};

function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <>
      <p className="section-eyebrow">{eyebrow}</p>
      <h2 className="section-title">{title}</h2>
      {description ? <p className="section-subtitle">{description}</p> : null}
    </>
  );
}

export default function LandingPage({ locale }: { locale: LocaleKey }) {
  const copy = getLandingContent(locale);
  const isArabic = locale === 'ar';
  const [form, setForm] = useState<FormState>(initialForm);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const fieldClasses =
    'min-h-[56px] rounded-[1.25rem] border border-white/12 bg-white/5 px-4 text-sm font-medium text-white outline-none transition placeholder:text-slate-500 focus:border-[#9fe7d4]/50 focus:bg-white/7';

  const updateField = (name: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="page-shell" dir={isArabic ? 'rtl' : 'ltr'}>
      <section id="hero" className="relative overflow-hidden px-5 pb-16 pt-28 md:px-6 md:pb-20 md:pt-32">
        <div className="hero-grid absolute inset-x-0 top-0 h-[72%] opacity-55" />
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
          <motion.div {...reveal} className="relative z-10">
            <div className="display-kicker">{copy.hero.badge}</div>
            <h1 className="display-font mt-7 max-w-4xl text-[clamp(3rem,7vw,6.4rem)] font-black leading-[0.92] text-white">
              {copy.hero.title[0]}
              <br />
              <span className="text-[#9fe7d4]">{copy.hero.title[1]}</span>
              <br />
              {copy.hero.title[2]}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 md:text-lg">
              {copy.hero.description}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#demo"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#9fe7d4] px-6 py-3 text-sm font-black text-slate-950 transition hover:scale-[1.01]"
              >
                {copy.hero.primaryCta}
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#pricing"
                className="inline-flex items-center justify-center rounded-full border border-white/12 bg-white/5 px-6 py-3 text-sm font-black text-white transition hover:border-[#9fe7d4]/45"
              >
                {copy.hero.secondaryCta}
              </a>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {copy.hero.stats.map(([value, label]) => (
                <div key={value} className="metric-chip rounded-full px-4 py-3">
                  <div className="text-sm font-black text-white">{value}</div>
                  <div className="text-xs font-medium text-slate-300">{label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div {...reveal} className="relative z-10">
            <div className="neo-panel scan-line rounded-[2rem] p-5 md:p-6">
              <div className="rounded-[1.75rem] border border-white/10 bg-[linear-gradient(135deg,#0e2237,#132c46)] p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-black uppercase tracking-[0.22em] text-[#9fe7d4]">
                      DarijaDoc
                    </div>
                    <div className="mt-2 display-font text-3xl font-black text-white md:text-4xl">
                      {copy.hero.proofTitle}
                    </div>
                  </div>
                  <div className="pulse-ring relative hidden h-14 w-14 items-center justify-center rounded-full bg-white/10 md:flex">
                    <MessageCircle className="h-6 w-6 text-[#9fe7d4]" />
                  </div>
                </div>

                <div className="mt-6 grid gap-4">
                  {copy.hero.proofList.map((item) => (
                    <div key={item} className="accent-outline rounded-[1.4rem] p-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#9fe7d4]" />
                        <p className="text-sm font-semibold leading-7 text-slate-100">{item}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 grid gap-4 lg:grid-cols-3">
                  {copy.hero.stats.map(([value, label], index) => (
                    <div
                      key={value}
                      className={`min-w-0 rounded-[1.5rem] p-5 ${
                        index === 0
                          ? 'bg-[#162942]'
                          : index === 1
                            ? 'bg-[#142336]'
                            : 'bg-[linear-gradient(135deg,#15273d,#21344d)]'
                      }`}
                    >
                      <div className="display-font text-[clamp(1.7rem,2.7vw,2.6rem)] font-black leading-[1.02] text-white [overflow-wrap:anywhere]">
                        {value}
                      </div>
                      <div className="mt-2 text-sm font-semibold leading-6 text-slate-300">{label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="hero-orb absolute -right-10 top-8 h-32 w-32 rounded-full bg-[#9fe7d4]/14 blur-3xl" />
              <div className="hero-orb absolute -left-10 bottom-4 h-36 w-36 rounded-full bg-[#ff9f80]/10 blur-3xl" />
            </div>
          </motion.div>
        </div>
      </section>

      <section id="demo" className="section-split py-8 md:py-10">
        <WhatsAppChat />
      </section>

      <section className="section-dark px-5 py-16 md:px-6 md:py-20">
        <div className="mx-auto max-w-7xl">
          <motion.div {...reveal}>
            <SectionHeader
              eyebrow={copy.impact.eyebrow}
              title={copy.impact.title}
              description={copy.impact.description}
            />
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            className="mt-10 grid gap-5 md:grid-cols-3"
          >
            {copy.impact.cards.map((item, index) => (
              <motion.div
                key={item.title}
                variants={card}
                className={`neo-card rounded-[2rem] p-6 ${
                  index === 0
                    ? 'bg-[linear-gradient(180deg,rgba(159,231,212,0.1),rgba(9,17,31,0.82))]'
                    : index === 1
                      ? 'bg-[linear-gradient(180deg,rgba(184,221,255,0.1),rgba(9,17,31,0.82))]'
                      : 'bg-[linear-gradient(180deg,rgba(255,159,128,0.1),rgba(9,17,31,0.82))]'
                }`}
              >
                <div className="display-font text-2xl font-black text-white">{item.title}</div>
                <p className="mt-4 text-sm leading-7 text-slate-300">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section id="features" className="section-cream px-5 py-16 md:px-6 md:py-20">
        <div className="mx-auto max-w-7xl">
          <motion.div {...reveal} className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <SectionHeader
                eyebrow={copy.system.eyebrow}
                title={copy.system.title}
                description={copy.system.description}
              />
            </div>

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.15 }}
              className="grid gap-4 md:grid-cols-2"
            >
              {copy.system.cards.map((item) => (
                <motion.div key={item.title} variants={card} className="neo-card rounded-[2rem] p-6">
                  <div className="inline-flex rounded-full bg-[#0f766e]/10 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-[#0f766e]">
                    {item.title}
                  </div>
                  <p className="mt-4 text-sm leading-7 text-slate-700">{item.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="section-dark px-5 py-16 md:px-6 md:py-20">
        <div className="mx-auto max-w-7xl">
          <motion.div {...reveal}>
            <SectionHeader
              eyebrow={copy.process.eyebrow}
              title={copy.process.title}
              description={copy.process.description}
            />
          </motion.div>

          <div className="mt-10 grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="neo-panel rounded-[2rem] p-5">
              <div className="grid gap-4 md:grid-cols-3">
                {copy.process.steps.map(([num, title, description]) => (
                  <div key={num} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                    <div className="display-font text-4xl font-black text-[#9fe7d4]">{num}</div>
                    <div className="mt-4 text-xl font-black text-white">{title}</div>
                    <p className="mt-3 text-sm leading-7 text-slate-300">{description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="neo-panel rounded-[2rem] p-6">
              <div className="grid gap-4">
                <div className="rounded-[1.75rem] bg-[linear-gradient(135deg,#0d253b,#143153)] p-6">
                  <MessageCircle className="h-6 w-6 text-[#9fe7d4]" />
                  <div className="mt-5 display-font text-3xl font-black text-white">{copy.process.asideTitle}</div>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  {[BrainCircuit, BellRing, BadgeCheck].map((Icon, index) => (
                    <div key={copy.process.asideLabels[index]} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                      <Icon className="h-5 w-5 text-[#b8ddff]" />
                      <div className="mt-4 text-sm font-extrabold uppercase tracking-[0.16em] text-slate-300">
                        {copy.process.asideLabels[index]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-split px-5 py-16 md:px-6 md:py-20">
        <div className="mx-auto max-w-7xl">
          <motion.div {...reveal}>
            <SectionHeader
              eyebrow={copy.workspace.eyebrow}
              title={copy.workspace.title}
              description={copy.workspace.description}
            />
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            className="mt-10 grid gap-4 xl:grid-cols-3"
          >
            {copy.workspace.cards.map((item, index) => (
              <motion.div
                key={item.slug}
                variants={card}
                className={`neo-card rounded-[2rem] p-6 ${
                  index === 0
                    ? 'bg-[linear-gradient(180deg,rgba(159,231,212,0.08),rgba(9,17,31,0.82))]'
                    : index === 1
                      ? 'bg-[linear-gradient(180deg,rgba(255,159,128,0.08),rgba(9,17,31,0.82))]'
                      : 'bg-[linear-gradient(180deg,rgba(184,221,255,0.08),rgba(9,17,31,0.82))]'
                }`}
              >
                <div className="display-font text-2xl font-black text-white">{item.title}</div>
                <p className="mt-4 text-sm leading-7 text-slate-300">{item.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {item.bullets.map((bullet) => (
                    <span key={bullet} className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-black uppercase tracking-[0.14em] text-slate-200">
                      {bullet}
                    </span>
                  ))}
                </div>
                <Link
                  href={`/${locale}/admin`}
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#9fe7d4] px-5 py-3 text-sm font-black text-slate-950"
                >
                  {item.cta}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="section-cream px-5 py-16 md:px-6 md:py-20">
        <div className="mx-auto max-w-7xl">
          <motion.div {...reveal}>
            <SectionHeader eyebrow={copy.testimonials.eyebrow} title={copy.testimonials.title} />
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            className="mt-10 grid gap-4 md:grid-cols-3"
          >
            {copy.testimonials.items.map(([value, label, description], index) => (
              <motion.div
                key={value}
                variants={card}
                className={`neo-card rounded-[2rem] p-6 ${index === 1 ? 'md:-translate-y-3' : ''}`}
              >
                <div className="display-font text-5xl font-black text-slate-950">{value}</div>
                <div className="mt-2 text-sm font-black uppercase tracking-[0.18em] text-[#0f766e]">{label}</div>
                <p className="mt-5 text-sm leading-7 text-slate-700">{description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section id="pricing" className="section-pricing px-5 py-16 md:px-6 md:py-20">
        <div className="mx-auto max-w-7xl">
          <motion.div {...reveal} className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <SectionHeader
                eyebrow={copy.pricing.eyebrow}
                title={copy.pricing.title}
                description={copy.pricing.description}
              />
            </div>

            <div className="neo-panel rounded-[2rem] p-6">
              <div className="grid gap-4 md:grid-cols-[1fr_0.9fr]">
                <div className="rounded-[1.75rem] bg-[linear-gradient(140deg,#dff8f0,#a9d4ff)] p-6 text-slate-950">
                  <div className="text-sm font-black uppercase tracking-[0.2em]">{copy.pricing.plan}</div>
                  <div className="display-font mt-4 text-5xl font-black">{copy.pricing.price}</div>
                  <div className="mt-2 text-base font-extrabold">{copy.pricing.period}</div>
                  <div className="mt-5 inline-flex rounded-full bg-slate-950 px-4 py-2 text-sm font-black text-white">
                    {copy.pricing.threshold}
                  </div>
                </div>

                <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
                  <div className="text-sm font-black uppercase tracking-[0.18em] text-[#9fe7d4]">
                    {copy.pricing.includedLabel}
                  </div>
                  <div className="mt-4 space-y-3">
                    {copy.pricing.features.map((feature) => (
                      <div key={feature} className="flex items-start gap-3">
                        <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#9fe7d4]" />
                        <span className="text-sm font-semibold text-slate-200">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="faq" className="section-faq px-5 py-16 md:px-6 md:py-20">
        <div className="mx-auto max-w-7xl">
          <motion.div {...reveal}>
            <SectionHeader eyebrow={copy.faq.eyebrow} title={copy.faq.title} />
          </motion.div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {copy.faq.items.map(([question, answer]) => (
              <div key={question} className="neo-card rounded-[2rem] p-6">
                <div className="text-lg font-black text-white">{question}</div>
                <p className="mt-4 text-sm leading-7 text-slate-300">{answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="section-contact px-5 pb-20 pt-16 md:px-6 md:pb-24 md:pt-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 lg:grid-cols-[0.88fr_1.12fr]">
            <div className="neo-panel rounded-[2rem] p-7 md:p-8">
              <div className="inline-flex rounded-full bg-[#0f766e]/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-[#9fe7d4]">
                {copy.contact.eyebrow}
              </div>
              <h2 className="section-title mt-5">{copy.contact.title}</h2>
              <p className="section-subtitle">{copy.contact.description}</p>

              <div className="mt-8 grid gap-4">
                <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                  <ShieldCheck className="h-5 w-5 text-[#9fe7d4]" />
                  <div className="mt-4 text-lg font-black text-white">{copy.contact.securityTitle}</div>
                  <div className="mt-4 space-y-3">
                    {copy.contact.securityPoints.map((point) => (
                      <div key={point} className="flex items-start gap-3">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#9fe7d4]" />
                        <p className="text-sm leading-6 text-slate-300">{point}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <a
                  href="tel:+212600000000"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/14 bg-white/6 px-6 py-3 text-sm font-black text-white transition hover:border-[#9fe7d4]/45"
                >
                  <Phone className="h-4 w-4" />
                  {copy.contact.secondaryContact}
                </a>
              </div>
            </div>

            <div className="neo-panel rounded-[2rem] p-6 md:p-8">
              <form className="grid gap-4" onSubmit={handleSubmit}>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="grid gap-2">
                    <span className="flex items-center gap-2 text-sm font-bold text-slate-200">
                      <Building2 className="h-4 w-4 text-[#9fe7d4]" />
                      {copy.contact.labels.clinicName}
                    </span>
                    <input
                      className={fieldClasses}
                      name="clinicName"
                      autoComplete="organization"
                      maxLength={120}
                      required
                      value={form.clinicName}
                      onChange={(event) => updateField('clinicName', event.target.value)}
                      placeholder={copy.contact.placeholders.clinicName}
                    />
                  </label>

                  <label className="grid gap-2">
                    <span className="flex items-center gap-2 text-sm font-bold text-slate-200">
                      <UserRound className="h-4 w-4 text-[#9fe7d4]" />
                      {copy.contact.labels.doctorFullName}
                    </span>
                    <input
                      className={fieldClasses}
                      name="doctorFullName"
                      autoComplete="name"
                      maxLength={120}
                      required
                      value={form.doctorFullName}
                      onChange={(event) => updateField('doctorFullName', event.target.value)}
                      placeholder={copy.contact.placeholders.doctorFullName}
                    />
                  </label>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="grid gap-2">
                    <span className="flex items-center gap-2 text-sm font-bold text-slate-200">
                      <Phone className="h-4 w-4 text-[#9fe7d4]" />
                      {copy.contact.labels.doctorPhone}
                    </span>
                    <input
                      className={fieldClasses}
                      type="tel"
                      name="doctorPhone"
                      autoComplete="tel"
                      inputMode="tel"
                      maxLength={30}
                      required
                      value={form.doctorPhone}
                      onChange={(event) => updateField('doctorPhone', event.target.value)}
                      placeholder={copy.contact.placeholders.doctorPhone}
                    />
                  </label>

                  <label className="grid gap-2">
                    <span className="flex items-center gap-2 text-sm font-bold text-slate-200">
                      <Stethoscope className="h-4 w-4 text-[#9fe7d4]" />
                      {copy.contact.labels.officePhone}
                    </span>
                    <input
                      className={fieldClasses}
                      type="tel"
                      name="officePhone"
                      autoComplete="tel"
                      inputMode="tel"
                      maxLength={30}
                      required
                      value={form.officePhone}
                      onChange={(event) => updateField('officePhone', event.target.value)}
                      placeholder={copy.contact.placeholders.officePhone}
                    />
                  </label>
                </div>

                <label className="grid gap-2">
                  <span className="flex items-center gap-2 text-sm font-bold text-slate-200">
                    <MapPin className="h-4 w-4 text-[#9fe7d4]" />
                    {copy.contact.labels.address}
                  </span>
                  <textarea
                    className={`${fieldClasses} min-h-[104px] resize-y py-4`}
                    name="address"
                    autoComplete="street-address"
                    maxLength={220}
                    required
                    value={form.address}
                    onChange={(event) => updateField('address', event.target.value)}
                    placeholder={copy.contact.placeholders.address}
                  />
                </label>

                <div className="grid gap-4">
                  <label className="grid gap-2">
                    <span className="flex items-center gap-2 text-sm font-bold text-slate-200">
                      <CalendarRange className="h-4 w-4 text-[#9fe7d4]" />
                      {copy.contact.labels.weekdayHours}
                    </span>
                    <input
                      className={fieldClasses}
                      name="weekdayHours"
                      maxLength={120}
                      required
                      value={form.weekdayHours}
                      onChange={(event) => updateField('weekdayHours', event.target.value)}
                      placeholder={copy.contact.placeholders.weekdayHours}
                    />
                  </label>

                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="grid gap-2">
                      <span className="flex items-center gap-2 text-sm font-bold text-slate-200">
                        <Clock3 className="h-4 w-4 text-[#9fe7d4]" />
                        {copy.contact.labels.fridayHours}
                      </span>
                      <input
                        className={fieldClasses}
                        name="fridayHours"
                        maxLength={120}
                        required
                        value={form.fridayHours}
                        onChange={(event) => updateField('fridayHours', event.target.value)}
                        placeholder={copy.contact.placeholders.fridayHours}
                      />
                    </label>

                    <label className="grid gap-2">
                      <span className="flex items-center gap-2 text-sm font-bold text-slate-200">
                        <Clock3 className="h-4 w-4 text-[#9fe7d4]" />
                        {copy.contact.labels.saturdayHours}
                      </span>
                      <input
                        className={fieldClasses}
                        name="saturdayHours"
                        maxLength={120}
                        required
                        value={form.saturdayHours}
                        onChange={(event) => updateField('saturdayHours', event.target.value)}
                        placeholder={copy.contact.placeholders.saturdayHours}
                      />
                    </label>
                  </div>
                </div>

                <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#9fe7d4] px-6 py-3 font-black text-slate-950 transition hover:scale-[1.01]"
                  >
                    {copy.contact.submit}
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  {isSubmitted ? <p className="text-sm font-semibold text-[#9fe7d4]">{copy.contact.submitSuccess}</p> : null}
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
