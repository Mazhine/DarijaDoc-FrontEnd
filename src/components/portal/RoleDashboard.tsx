'use client';

import { Activity, CalendarDays, ChevronRight, ClipboardList, Shield, Users } from 'lucide-react';
import { getWorkspaceContent, type RoleKey } from '../../content/workspace';
import type { LocaleKey } from '../../content/landing';

const roleAccent: Record<RoleKey, string> = {
  doctor: 'from-[#9fe7d4]/25 to-[#8ec5ff]/12',
  secretary: 'from-[#ff9f80]/20 to-[#9fe7d4]/10',
  admin: 'from-[#8ec5ff]/18 to-[#b7a1ff]/12',
};

const roleIcon: Record<RoleKey, typeof Activity> = {
  doctor: ClipboardList,
  secretary: CalendarDays,
  admin: Shield,
};

export default function RoleDashboard({
  locale,
  role,
}: {
  locale: LocaleKey;
  role: RoleKey;
}) {
  const isArabic = locale === 'ar';
  const copy = getWorkspaceContent(locale, role);
  const Icon = roleIcon[role];

  return (
    <div className="page-shell min-h-screen px-5 pb-16 pt-28 md:px-6 md:pt-32" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="neo-panel rounded-[2rem] p-7 md:p-8">
            <div className="display-kicker">{copy.badge}</div>
            <div className="mt-6 flex items-start justify-between gap-4">
              <div>
                <h1 className="display-font text-[clamp(2.4rem,5vw,4.8rem)] font-black leading-[0.95] text-white">
                  {copy.title}
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300 md:text-lg">
                  {copy.subtitle}
                </p>
              </div>
              <div className={`hidden h-16 w-16 items-center justify-center rounded-[1.5rem] bg-gradient-to-br ${roleAccent[role]} md:flex`}>
                <Icon className="h-7 w-7 text-white" />
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button className="inline-flex items-center justify-center gap-2 rounded-full bg-[#9fe7d4] px-6 py-3 text-sm font-black text-slate-950">
                {copy.primaryAction}
                <ChevronRight className="h-4 w-4" />
              </button>
              <button className="inline-flex items-center justify-center rounded-full border border-white/12 bg-white/5 px-6 py-3 text-sm font-black text-white">
                {copy.secondaryAction}
              </button>
            </div>

            <div className="mt-8 grid gap-4 xl:grid-cols-3">
              {copy.stats.map((stat) => (
                <div key={stat.label} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                  <div className="display-font text-3xl font-black text-white">{stat.value}</div>
                  <div className="mt-2 text-sm font-bold text-slate-100">{stat.label}</div>
                  <div className="mt-2 text-sm leading-6 text-slate-400">{stat.note}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="neo-panel rounded-[2rem] p-6 md:p-7">
            <div className="text-sm font-black uppercase tracking-[0.18em] text-[#9fe7d4]">
              {copy.metricsPanel.title}
            </div>
            <div className="mt-5 grid gap-4">
              {copy.metricsPanel.items.map((item) => (
                <div key={item.label} className="rounded-[1.4rem] border border-white/10 bg-white/5 p-5">
                  <div className="text-xs font-extrabold uppercase tracking-[0.16em] text-slate-400">{item.label}</div>
                  <div className="mt-2 display-font text-3xl font-black text-white">{item.value}</div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.12fr_0.88fr]">
          <section className="neo-panel rounded-[2rem] p-6 md:p-7">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-[#9fe7d4]" />
              <h2 className="text-lg font-black text-white">{copy.mainPanel.title}</h2>
            </div>
            <div className="mt-5 grid gap-4">
              {copy.mainPanel.items.map((item) => (
                <div key={item.title} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="text-base font-black text-white">{item.title}</div>
                    <div className="rounded-full border border-[#9fe7d4]/22 bg-[#9fe7d4]/10 px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-[#9fe7d4]">
                      {item.status}
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate-300">{item.meta}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="neo-panel rounded-[2rem] p-6 md:p-7">
            <div className="flex items-center gap-3">
              <Activity className="h-5 w-5 text-[#9fe7d4]" />
              <h2 className="text-lg font-black text-white">{copy.sidePanel.title}</h2>
            </div>
            <div className="mt-5 space-y-3">
              {copy.sidePanel.items.map((item) => (
                <div key={item} className="rounded-[1.35rem] border border-white/10 bg-white/5 px-4 py-4 text-sm font-semibold text-slate-200">
                  {item}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
