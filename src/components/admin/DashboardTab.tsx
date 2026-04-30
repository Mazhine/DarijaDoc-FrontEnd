/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import { Users, Calendar, TrendingUp, Activity, CheckCircle2, Clock, Phone, Shield, BarChart2, Stethoscope, KeyRound, CreditCard } from "lucide-react";
import { motion } from "framer-motion";
import { getSeededTeam, type TeamMember } from "@/src/lib/team";

const DASHBOARD_T: Record<string, any> = {
    en: {
        title: "Dashboard Overview",
        subtitle: "Live metrics dynamically synced with Google Calendar.",
        totalPat: "Total Patients",
        appMonth: "Appointments This Month",
        whatsapp: "WhatsApp Bookings",
        sec: "Secretary Bookings",
        today: "today",
        latest: "Latest Calendar Updates",
        revenue: "Revenue (This Month)",
        bookings: "Total Bookings",
        recentPatients: "Recent Patients",
        calendarTitle: "Calendar Snapshot",
        performanceTitle: "Revenue & Performance Analysis",
        noActivity: "No recent calendar activity yet.",
        days: { "Monday": "Monday", "Tuesday": "Tuesday", "Wednesday": "Wednesday", "Thursday": "Thursday", "Friday": "Friday", "Saturday": "Saturday" }
    },
    fr: {
        title: "Aperçu du Tableau de Bord",
        subtitle: "Métriques en direct synchronisées avec Google Agenda.",
        totalPat: "Total des Patients",
        appMonth: "Rendez-vous ce Mois",
        whatsapp: "Réservations WhatsApp",
        sec: "Réservations Secrétariat",
        today: "ajd",
        latest: "Dernières Mises à Jour du Calendrier",
        revenue: "Revenus (Ce Mois)",
        bookings: "Total Réservations",
        recentPatients: "Patients récents",
        calendarTitle: "Aperçu du calendrier",
        performanceTitle: "Analyse revenus & activité",
        noActivity: "Aucune activité récente du calendrier.",
        days: { "Monday": "Lundi", "Tuesday": "Mardi", "Wednesday": "Mercredi", "Thursday": "Jeudi", "Friday": "Vendredi", "Saturday": "Samedi" }
    },
    ar: {
        title: "نظرة عامة على لوحة التحكم",
        subtitle: "مؤشرات مباشرة مرتبطة بتقويم Google الخاص بالعيادة.",
        totalPat: "إجمالي المرضى",
        appMonth: "مواعيد هذا الشهر",
        whatsapp: "حجوزات واتساب",
        sec: "حجوزات السكرتارية",
        today: "اليوم",
        latest: "آخر تحديثات التقويم",
        revenue: "المداخيل هذا الشهر",
        bookings: "إجمالي الحجوزات",
        recentPatients: "المرضى الجدد",
        calendarTitle: "ملخص التقويم",
        performanceTitle: "تحليل الأداء والمداخيل",
        noActivity: "لا توجد تحديثات حديثة في التقويم.",
        days: { "Monday": "الاثنين", "Tuesday": "الثلاثاء", "Wednesday": "الأربعاء", "Thursday": "الخميس", "Friday": "الجمعة", "Saturday": "السبت" }
    }
};

const StatCard = ({ stat, delay }: { stat: any, delay: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        className="premium-panel flex h-full flex-col rounded-[28px] p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <span className={`text-sm font-semibold px-2 py-1 rounded-full ${stat.change.startsWith('-') ? 'text-red-600 bg-red-50 dark:bg-red-900/30' : 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30'}`}>
                {stat.change}
            </span>
        </div>
        <h3 className="mb-1 text-3xl font-bold text-slate-950 dark:text-white">{stat.value}</h3>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
        
        {/* Sparkline Chart */}
        <div className="mt-auto pt-6 h-12 flex items-end gap-1 opacity-80">
            {stat.sparkline.map((h: number, idx: number) => (
                <div key={idx} className={`flex-1 rounded-t-sm transition-all duration-500 hover:opacity-80 ${stat.change.startsWith('-') ? 'bg-red-200 dark:bg-red-900' : stat.chartColor}`} style={{ height: `${h}%` }}></div>
            ))}
        </div>
    </motion.div>
);

export default function DashboardTab() {
    const pathname = usePathname();
    const currentLocale = pathname?.split('/')[1] || 'en';
    const t = DASHBOARD_T[currentLocale] || DASHBOARD_T['en'];
    const isArabic = currentLocale === 'ar';
    const currentRole = typeof window !== 'undefined' ? sessionStorage.getItem('adminRole') || 'Admin' : 'Admin';
    const adminCopy = {
        title: currentLocale === 'fr' ? 'Centre de pilotage admin' : isArabic ? 'مركز تحكم الادمن' : 'Admin Control Center',
        subtitle: currentLocale === 'fr' ? 'Vue globale des medecins, des secretaires, des acces et des abonnements.' : isArabic ? 'رؤية شاملة للاطباء والسكرتيرات والصلاحيات والاشتراكات.' : 'Global view of doctors, secretaries, access levels, and subscriptions.',
        doctors: currentLocale === 'fr' ? 'Medecins' : isArabic ? 'الاطباء' : 'Doctors',
        secretaries: currentLocale === 'fr' ? 'Secretaires' : isArabic ? 'السكرتيرات' : 'Secretaries',
        activeSubscriptions: currentLocale === 'fr' ? 'Abonnements actifs' : isArabic ? 'الاشتراكات النشطة' : 'Active subscriptions',
        credentialsReady: currentLocale === 'fr' ? 'Identifiants prets' : isArabic ? 'الحسابات الجاهزة' : 'Credentials ready',
        doctorsAndSecretaries: currentLocale === 'fr' ? 'Medecins et secretaires' : isArabic ? 'الاطباء والسكرتيرات' : 'Doctors & secretaries',
        attachedSecretaries: currentLocale === 'fr' ? 'secretaire(s) rattachee(s)' : isArabic ? 'سكرتيرات مرتبطات' : 'attached secretaries',
        credentials: currentLocale === 'fr' ? 'Identifiants' : isArabic ? 'بيانات الدخول' : 'Credentials',
        noSecretary: currentLocale === 'fr' ? 'Aucune secretaire rattachee pour l instant.' : isArabic ? 'لا توجد سكرتيرة مرتبطة حاليا.' : 'No attached secretary for now.',
        subscriptionHealth: currentLocale === 'fr' ? 'Etat des abonnements' : isArabic ? 'حالة الاشتراكات' : 'Subscription health',
        adminNotes: currentLocale === 'fr' ? 'Notes admin' : isArabic ? 'ملاحظات الادمن' : 'Admin notes',
        note1: currentLocale === 'fr' ? 'Le bouton deconnexion reste dans la barre laterale pour garder la logique du projet.' : isArabic ? 'زر تسجيل الخروج بقي في الشريط الجانبي حتى تظل منطقية المشروع واضحة.' : 'The sign-out button stays in the sidebar to match the project structure.',
        note2: currentLocale === 'fr' ? 'Toutes les secretaires ont maintenant acces au calendrier et aux clients.' : isArabic ? 'كل السكرتيرات لديهن الآن وصول للتقويم والعملاء.' : 'All secretaries now have access to the calendar and clients.',
        note3: currentLocale === 'fr' ? 'Les identifiants sont visibles ici uniquement pour la demo admin.' : isArabic ? 'بيانات الدخول ظاهرة هنا فقط داخل نسخة العرض الخاصة بالادمن.' : 'Credentials are shown here only for the admin demo.',
        name: currentLocale === 'fr' ? 'Nom' : isArabic ? 'الاسم' : 'Name',
        wardId: currentLocale === 'fr' ? 'Ref/ID' : isArabic ? 'المرجع/المعرف' : 'Ward/ID',
        priority: currentLocale === 'fr' ? 'Priorite' : isArabic ? 'الاولوية' : 'Priority',
        startDate: currentLocale === 'fr' ? 'Date' : isArabic ? 'التاريخ' : 'Start Date',
        actions: currentLocale === 'fr' ? 'Actions' : isArabic ? 'الإجراءات' : 'Actions',
        view: currentLocale === 'fr' ? 'Voir' : isArabic ? 'عرض' : 'View',
    };
    const priorityLabels: Record<string, string> = {
        High: currentLocale === 'fr' ? 'Haute' : isArabic ? 'مرتفعة' : 'High',
        Medium: currentLocale === 'fr' ? 'Moyenne' : isArabic ? 'متوسطة' : 'Medium',
        Low: currentLocale === 'fr' ? 'Faible' : isArabic ? 'منخفضة' : 'Low',
    };
    const subscriptionLabels: Record<string, string> = {
        Active: currentLocale === 'fr' ? 'Actif' : isArabic ? 'نشط' : 'Active',
        Trial: currentLocale === 'fr' ? 'Essai' : isArabic ? 'تجريبي' : 'Trial',
        'Past Due': currentLocale === 'fr' ? 'En retard' : isArabic ? 'متاخر' : 'Past Due',
    };
    const [statsData, setStatsData] = useState({
        patients: 1253,
        appointmentsMonth: 20,
        appointmentsToday: 0,
        whatsapp: 14,
        secretary: 8,
        totalRevenue: 0
    });
    
    const initialLogs = [
        { action: "Appointment Created", user: "Sara (Secretary)", details: "Consultation set for Ali", time: "10 mins ago", icon: CheckCircle2, color: "text-emerald-500" },
        { action: "Patient Record Deleted", user: "Dr. Amine (Doctor)", details: "ID #20349 removed", time: "1 hour ago", icon: Activity, color: "text-red-500" },
        { action: "Schedule Updated", user: "Sara (Secretary)", details: "Marked 3PM-4PM unavailable", time: "3 hours ago", icon: Clock, color: "text-amber-500" }
    ];

    const [auditLog, setAuditLog] = useState<any[]>(initialLogs);
    
    const defaultBusyDays = [
        { day: "Monday", count: 24, percentage: 90 },
        { day: "Tuesday", count: 18, percentage: 70 },
        { day: "Wednesday", count: 15, percentage: 60 },
        { day: "Thursday", count: 21, percentage: 85 },
        { day: "Friday", count: 25, percentage: 95 },
        { day: "Saturday", count: 10, percentage: 40 },
    ];
    
    const [busyDays, setBusyDays] = useState(defaultBusyDays);
    const [mostBusyDay, setMostBusyDay] = useState("Monday");
    const [team, setTeam] = useState<TeamMember[]>([]);

    useEffect(() => {
        setTeam(getSeededTeam());
    }, []);

    useEffect(() => {
        let pCount = 1253;
        let calculatedRevenue = 0;
        const dateToRevenue: Record<string, number> = {};
        try {
            const saved = localStorage.getItem('clinicPatients');
            if (saved) {
                const patients = JSON.parse(saved);
                pCount = Math.max(pCount, patients.length);
                
                patients.forEach((p: any) => {
                    if (p.amountPaid) {
                        calculatedRevenue += Number(p.amountPaid) || 0;
                    }
                    if (p.date && p.amountPaid) {
                        const d = new Date(p.date).toLocaleDateString('en-US', { weekday: 'long' });
                        dateToRevenue[d] = (dateToRevenue[d] || 0) + (Number(p.amountPaid) || 0);
                    }
                });
            }
        } catch(e) {}

        const fetchStats = async () => {
            try {
                // Fetch all-time data to derive total patients and cross-month metrics
                const res = await fetch("/api/calendar?range=all");
                const data = await res.json();
                
                if (data && data.events) {
                    const allEvents = data.events.filter((e: any) => e.type !== "Block");
                    
                    // Filter for current month's events
                    const currentMonth = new Date().toISOString().substring(0, 7); // YYYY-MM
                    const events = allEvents.filter((e: any) => e.date?.startsWith(currentMonth));
                    
                    const appointmentsThisMonth = events.length;
                    
                    const todayStr = new Date().toISOString().split('T')[0];
                    const appointmentsToday = events.filter((e: any) => e.date === todayStr).length;

                    let whatsappCount = 0;
                    let secretaryCount = 0;
                    events.forEach((e: any) => {
                        if (e.description && /AdminHub|DarijaDoc|Patients Tab/i.test(e.description)) {
                            secretaryCount++;
                        } else {
                            whatsappCount++;
                        }
                    });

                    const uniquePatients = new Set(allEvents.map((e: any) => e.name.trim().toLowerCase()));

                    setStatsData({
                        patients: uniquePatients.size > 0 ? uniquePatients.size : pCount,
                        appointmentsMonth: appointmentsThisMonth,
                        appointmentsToday: appointmentsToday,
                        whatsapp: whatsappCount,
                        secretary: secretaryCount,
                        totalRevenue: calculatedRevenue
                    });

                    // Build real busy days
                    const daysCount: Record<string, number> = { "Monday": 0, "Tuesday": 0, "Wednesday": 0, "Thursday": 0, "Friday": 0, "Saturday": 0 };
                    events.forEach((e: any) => {
                        if (e.date) {
                            const d = new Date(e.date).toLocaleDateString('en-US', { weekday: 'long' });
                            if (daysCount[d] !== undefined) daysCount[d]++;
                        }
                    });

                    const daysData = Object.entries(daysCount).map(([day, count]) => {
                        const rev = dateToRevenue[day] || 0;
                        return { day, count, revenue: rev };
                    });

                    const maxRevenue = Math.max(...daysData.map(d => d.revenue));
                    
                    if (maxRevenue >= 0) {
                        const busyDaysFormatted = daysData.map(({ day, count, revenue }) => ({
                            day,
                            count,
                            revenue,
                            percentage: maxRevenue > 0 ? Math.round((revenue / maxRevenue) * 100) : 0
                        }));
                        setBusyDays(busyDaysFormatted);
                        
                        const loadedMax = Math.max(...busyDaysFormatted.map(b => b.revenue));
                        const busyStr = busyDaysFormatted.find(b => b.revenue === loadedMax)?.day || "Monday";
                        setMostBusyDay(busyStr);
                    }

                    // Build simple audit log from true API creations
                    const recentEvents = [...events]
                        .filter(e => e.created)
                        .sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime())
                        .slice(0, 5);
                        
                    if (recentEvents.length > 0) {
                        const realLog = recentEvents.map(e => {
                            const tAgo = Math.round((new Date().getTime() - new Date(e.created).getTime()) / (1000 * 60 * 60 * 24));
                            const timeStr = tAgo === 0 ? "Today" : `${tAgo} day${tAgo > 1 ? 's' : ''} ago`;
                            
                            return {
                                action: "Google Calendar Sync",
                                user: "System / User",
                                details: `${e.type}: ${e.name.substring(0, 20)}`,
                                time: timeStr,
                                icon: Calendar,
                                color: "text-[#12695b]"
                            };
                        });
                        setAuditLog(prev => [...realLog]);
                    }
                }
            } catch (err) { }
        };
        fetchStats();
    }, []);

    const stats = [
        { id: 1, label: t.totalPat, value: `${statsData.patients}`, change: "+12%", icon: Users, color: "text-[#12695b]", bg: "bg-[#eff8f5] dark:bg-emerald-900/30", chartColor: "bg-[#cdeae2] dark:bg-emerald-800", sparkline: [40, 50, 45, 60, 75, 80, 100] },
        { id: 2, label: t.appMonth, value: `${statsData.appointmentsMonth}`, change: `+${statsData.appointmentsToday} ${t.today}`, icon: Calendar, color: "text-[#3c7a70]", bg: "bg-[#eef3f7] dark:bg-cyan-900/30", chartColor: "bg-[#d7e7ef] dark:bg-cyan-800", sparkline: [20, 40, 35, 50, 45, 70, 85] },
        { id: 3, label: t.bookings || "Total Bookings", value: `${statsData.whatsapp + statsData.secretary}`, change: "+5%", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-100 dark:bg-emerald-900/30", chartColor: "bg-emerald-200 dark:bg-emerald-800", sparkline: [60, 55, 65, 80, 70, 90, 100] },
    ];

    const recentPatients = [
        { name: "Youssef Fassi", id: "PT-2041", priority: "High", date: "2026-04-26" },
        { name: "Sara Alami", id: "PT-2042", priority: "Medium", date: "2026-04-26" },
        { name: "Amine Tazi", id: "PT-2043", priority: "Low", date: "2026-04-25" },
        { name: "Nadia Bennis", id: "PT-2044", priority: "High", date: "2026-04-24" },
    ];

    const calendarDays = Array.from({length: 30}, (_, i) => i + 1);

    const adminDoctors = useMemo(() => team.filter((member) => member.role === 'Doctor'), [team]);
    const adminSecretaries = useMemo(() => team.filter((member) => member.role === 'Secretary'), [team]);

    if (currentRole === 'Admin') {
        return (
            <div className="space-y-6">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-950 dark:text-white">{adminCopy.title}</h2>
                        <p className="mt-1 text-slate-500 dark:text-slate-400">
                            {adminCopy.subtitle}
                        </p>
                    </div>
                    <div className="premium-panel inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                        <Shield className="h-4 w-4 text-[#12695b]" />
                        {adminDoctors.length} {adminCopy.doctors.toLowerCase()} • {adminSecretaries.length} {adminCopy.secretaries.toLowerCase()}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
                    <StatCard stat={{ id: 1, label: adminCopy.doctors, value: `${adminDoctors.length}`, change: "+0%", icon: Stethoscope, color: "text-[#12695b]", bg: "bg-[#eff8f5]", chartColor: "bg-[#cdeae2]", sparkline: [50, 60, 65, 60, 75, 75, 80] }} delay={0} />
                    <StatCard stat={{ id: 2, label: adminCopy.secretaries, value: `${adminSecretaries.length}`, change: "+0%", icon: Users, color: "text-[#3c7a70]", bg: "bg-[#eef3f7]", chartColor: "bg-[#d7e7ef]", sparkline: [20, 35, 50, 45, 65, 75, 85] }} delay={0.1} />
                    <StatCard stat={{ id: 3, label: adminCopy.activeSubscriptions, value: `${adminDoctors.filter((member) => member.subscriptionStatus !== 'Past Due').length}`, change: "+0%", icon: CreditCard, color: "text-emerald-600", bg: "bg-emerald-100", chartColor: "bg-emerald-200", sparkline: [80, 75, 85, 85, 90, 90, 100] }} delay={0.2} />
                    <StatCard stat={{ id: 4, label: adminCopy.credentialsReady, value: `${team.filter((member) => !member.mustResetCredentials).length}`, change: "+0%", icon: KeyRound, color: "text-amber-600", bg: "bg-amber-100", chartColor: "bg-amber-200", sparkline: [45, 55, 60, 72, 74, 78, 88] }} delay={0.3} />
                </div>

                <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1.4fr_0.6fr]">
                    <div className="premium-panel rounded-[28px] p-6">
                        <div className="mb-6 flex items-center gap-2">
                            <Stethoscope className="h-5 w-5 text-[#12695b]" />
                            <h3 className="text-lg font-bold text-slate-950 dark:text-white">{adminCopy.doctorsAndSecretaries}</h3>
                        </div>
                        <div className="space-y-4">
                            {adminDoctors.map((doctor) => {
                                const doctorSecretaries = adminSecretaries.filter((member) => member.ownerDoctorEmail?.toLowerCase() === doctor.email.toLowerCase());
                                return (
                                    <div key={doctor.id} className="rounded-[24px] border border-slate-200 bg-[linear-gradient(135deg,rgba(248,250,252,0.95),rgba(239,248,245,0.85))] p-5 dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(255,255,255,0.04),rgba(159,231,212,0.05))]">
                                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h4 className="text-lg font-bold text-slate-950 dark:text-white">{doctor.name}</h4>
                                                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                                                        doctor.subscriptionStatus === 'Past Due'
                                                            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                                                            : doctor.subscriptionStatus === 'Trial'
                                                                ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                                                                : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                                                    }`}>
                                                        {subscriptionLabels[doctor.subscriptionStatus || 'Trial']}
                                                    </span>
                                                </div>
                                                <div className="mt-2 flex flex-wrap gap-3 text-sm text-slate-500 dark:text-slate-400">
                                                    <span className="inline-flex items-center gap-1"><Phone className="h-4 w-4" /> {doctor.email}</span>
                                                    <span className="inline-flex items-center gap-1"><Shield className="h-4 w-4" /> {doctor.access}</span>
                                                    <span className="inline-flex items-center gap-1"><KeyRound className="h-4 w-4" /> {doctor.password}</span>
                                                </div>
                                            </div>
                                            <div className="rounded-2xl border border-white/60 bg-white/80 px-4 py-3 text-sm text-slate-700 shadow-sm dark:border-white/10 dark:bg-[#08111d] dark:text-slate-300">
                                                {doctorSecretaries.length} {adminCopy.attachedSecretaries}
                                            </div>
                                        </div>
                                        <div className="mt-4 grid gap-3 md:grid-cols-2">
                                            {doctorSecretaries.map((secretary) => (
                                                <div key={secretary.id} className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm dark:border-white/10 dark:bg-[#08111d]">
                                                    <div className="flex items-center justify-between gap-3">
                                                        <div>
                                                            <div className="font-semibold text-slate-950 dark:text-white">{secretary.name}</div>
                                                            <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">{secretary.email}</div>
                                                        </div>
                                                        <span className="rounded-full bg-[#eff8f5] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[#12695b] dark:bg-[#9fe7d4]/12 dark:text-[#9fe7d4]">
                                                            {secretary.access}
                                                        </span>
                                                    </div>
                                                    <div className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                                                        {adminCopy.credentials}: {secretary.password}
                                                    </div>
                                                </div>
                                            ))}
                                            {doctorSecretaries.length === 0 ? (
                                                <div className="rounded-2xl border border-dashed border-slate-300 p-4 text-sm text-slate-500 dark:border-white/10 dark:text-slate-400">
                                                    {adminCopy.noSecretary}
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="premium-panel rounded-[28px] p-6">
                            <h3 className="text-lg font-bold text-slate-950 dark:text-white">{adminCopy.subscriptionHealth}</h3>
                            <div className="mt-4 space-y-3">
                                {['Active', 'Trial', 'Past Due'].map((status) => (
                                    <div key={status} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 dark:bg-white/5">
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{subscriptionLabels[status]}</span>
                                        <span className="text-sm font-bold text-slate-950 dark:text-white">
                                            {adminDoctors.filter((member) => (member.subscriptionStatus || 'Trial') === status).length}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="premium-panel rounded-[28px] p-6">
                            <h3 className="text-lg font-bold text-slate-950 dark:text-white">{adminCopy.adminNotes}</h3>
                            <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
                                <div className="rounded-2xl bg-[#eff8f5] px-4 py-3 dark:bg-[#9fe7d4]/12">{adminCopy.note1}</div>
                                <div className="rounded-2xl bg-slate-50 px-4 py-3 dark:bg-white/5">{adminCopy.note2}</div>
                                <div className="rounded-2xl bg-slate-50 px-4 py-3 dark:bg-white/5">{adminCopy.note3}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-slate-950 dark:text-white">{t.title}</h2>
                    <p className="mt-1 text-slate-500 dark:text-slate-400">{t.subtitle}</p>
                </div>
            </div>

            {/* Top Row: 4 Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <StatCard key={stat.id} stat={stat} delay={i * 0.1} />
                ))}

                {/* Revenue Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="relative flex h-full flex-col overflow-hidden rounded-[28px] border border-emerald-400/60 bg-[linear-gradient(135deg,#12806d_0%,#0f5a4e_48%,#0c3d35_100%)] p-6 text-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                    <div className="relative z-10 flex flex-col h-full">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm text-white">
                                <TrendingUp className="w-6 h-6" />
                            </div>
                            <span className="text-sm font-bold text-white bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                                +15%
                            </span>
                        </div>
                        <h3 className="text-3xl font-bold mb-1">
                            {new Intl.NumberFormat(currentLocale === 'ar' ? 'ar-MA' : currentLocale === 'fr' ? 'fr-MA' : 'en-MA', { style: 'currency', currency: 'MAD', maximumFractionDigits: 0 }).format(statsData.totalRevenue)}
                        </h3>
                        <p className="text-green-50 text-sm font-medium">{t.revenue}</p>
                        
                        {/* Sparkline Mock */}
                        <div className="mt-auto pt-6 h-12 flex items-end gap-1 opacity-90">
                            {[30, 45, 40, 60, 50, 85, 75, 100].map((h, i) => (
                                <div key={i} className="flex-1 bg-white rounded-t-sm transition-all duration-500 hover:opacity-80" style={{ height: `${h}%` }}></div>
                            ))}
                        </div>
                    </div>
                    {/* Decorative background blur */}
                    <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-3xl"></div>
                </motion.div>
            </div>

            {/* Middle Section: Bento Grid (Table & Calendar) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
                {/* Middle Left: Patient Table */}
                <div className="premium-panel lg:col-span-2 h-fit rounded-[28px] p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <div className="flex items-center gap-2 mb-6">
                        <Users className="w-6 h-6 text-[#12695b]" />
                        <h3 className="text-lg font-bold text-slate-950 dark:text-white">{t.recentPatients}</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-100 dark:border-gray-800 text-gray-500 dark:text-gray-400 text-sm">
                                    <th className="pb-3 font-medium">{adminCopy.name}</th>
                                    <th className="pb-3 font-medium">{adminCopy.wardId}</th>
                                    <th className="pb-3 font-medium">{adminCopy.priority}</th>
                                    <th className="pb-3 font-medium">{adminCopy.startDate}</th>
                                    <th className="pb-3 font-medium text-right">{adminCopy.actions}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentPatients.map((p, i) => (
                                    <tr key={i} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors last:border-0">
                                        <td className="py-4 font-semibold text-gray-900 dark:text-white">{p.name}</td>
                                        <td className="py-4 text-gray-500">{p.id}</td>
                                        <td className="py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${p.priority === 'High' ? 'bg-red-100 text-red-600 dark:bg-red-900/30' : p.priority === 'Medium' ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30' : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30'}`}>
                                                {priorityLabels[p.priority]}
                                            </span>
                                        </td>
                                        <td className="py-4 text-gray-500">{p.date}</td>
                                        <td className="py-4 text-right">
                                            <button className="text-[#12695b] hover:text-[#0f5a4e] font-medium text-sm transition-colors cursor-pointer">{adminCopy.view}</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Middle Right: Compact Calendar & Audit */}
                <div className="lg:col-span-1 flex flex-col gap-8">
                    <div className="premium-panel rounded-[28px] p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-slate-950 dark:text-white">{t.calendarTitle}</h3>
                            <span className="text-sm font-semibold text-[#12695b] bg-[#eff8f5] dark:bg-emerald-900/30 px-3 py-1 rounded-full">April 2026</span>
                        </div>
                        <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-gray-400 mb-2">
                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <div key={i}>{d}</div>)}
                        </div>
                        <div className="grid grid-cols-7 gap-1">
                            {[0, 0, 0].map((_, i) => <div key={`empty-${i}`}></div>)}
                            {calendarDays.map(d => (
                                <div key={d} className={`aspect-square flex items-center justify-center rounded-lg text-sm font-medium cursor-pointer transition-colors ${d === 26 ? 'bg-[#12695b] text-white shadow-md' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                                    {d}
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="premium-panel flex-1 rounded-[28px] p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{t.latest}</h3>
                        <div className="overflow-y-auto pr-2 space-y-4 max-h-[250px]">
                            {auditLog.map((log, i) => (
                                <div key={i} className="flex gap-3 pb-4 border-b border-gray-50 dark:border-gray-800/50 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/30 p-2 rounded-lg transition-colors">
                                    <div className="mt-0.5">
                                        <log.icon className={`w-4 h-4 ${log.color}`} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <p className="text-sm font-bold text-slate-950 dark:text-white">{log.action}</p>
                                        </div>
                                        <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mt-1">{log.details}</p>
                                    </div>
                                </div>
                            ))}
                            {auditLog.length === 0 ? <p className="text-sm text-slate-500 dark:text-slate-400">{t.noActivity}</p> : null}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Section: Full Width Revenue Analysis */}
            <div className="premium-panel mt-12 rounded-[28px] p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2">
                        <BarChart2 className="w-6 h-6 text-[#12695b]" />
                        <h3 className="text-lg font-bold text-slate-950 dark:text-white">{t.performanceTitle}</h3>
                    </div>
                    <span className="text-sm font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1 rounded-full">{mostBusyDay}</span>
                </div>
                <div className="space-y-6">
                    {busyDays.map((stat, i) => (
                        <div key={i} className="flex items-center gap-4">
                            <span className="w-24 text-sm font-medium text-gray-700 dark:text-gray-300">{t.days[stat.day] || stat.day}</span>
                            <div className="flex-1 h-4 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${stat.percentage}%` }}
                                    transition={{ duration: 1, delay: i * 0.1 }}
                                    className={`h-full rounded-full ${stat.percentage >= 80 ? 'bg-red-500' : stat.percentage >= 50 ? 'bg-orange-500' : 'bg-emerald-500'}`}
                                ></motion.div>
                            </div>
                            <span className="w-24 text-right text-sm font-bold text-gray-900 dark:text-white">{new Intl.NumberFormat(currentLocale === 'ar' ? 'ar-MA' : currentLocale === 'fr' ? 'fr-MA' : 'en-MA', { style: 'currency', currency: 'MAD', maximumFractionDigits: 0 }).format((stat as any).revenue || 0)}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}


