/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Users, Calendar, TrendingUp, Activity, CheckCircle2, Clock, Phone, Shield, BarChart2 } from "lucide-react";
import { motion } from "framer-motion";

const DASHBOARD_T: Record<string, any> = {
    en: {
        title: "Dashboard Overview",
        subtitle: "Live metrics dynamically synced with Google Calendar.",
        totalPat: "Total Patients",
        appMonth: "Appointments This Month",
        whatsapp: "WhatsApp Bookings",
        sec: "Secretary Bookings",
        today: "today",
        analysis: "Live Busy Days Analysis",
        insight: "Insight:",
        insightTxt1: "currently holds the heaviest traffic this month according to real Google Calendar data. Consider unlocking extra time slots for",
        insightTxt2: "s.",
        latest: "Latest Calendar Updates",
        by: "By:",
        revenue: "Revenue (This Month)",
        bookings: "Total Bookings",
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
        analysis: "Analyse des Jours Chargés",
        insight: "Aperçu :",
        insightTxt1: "est le jour le plus chargé ce mois-ci selon les données Google Agenda. Envisagez d'ouvrir des créneaux pour les",
        insightTxt2: "s.",
        latest: "Dernières Mises à Jour du Calendrier",
        by: "Par :",
        revenue: "Revenus (Ce Mois)",
        bookings: "Total Réservations",
        days: { "Monday": "Lundi", "Tuesday": "Mardi", "Wednesday": "Mercredi", "Thursday": "Jeudi", "Friday": "Vendredi", "Saturday": "Samedi" }
    },
    ar: {
        title: "???? ???? ??? ???? ???????",
        subtitle: "???????? ?????? ??????? ?? ????? ????.",
        totalPat: "?????? ??????",
        appMonth: "?????? ??? ?????",
        whatsapp: "?????? ??????",
        sec: "?????? ??????????",
        today: "?????",
        analysis: "????? ?????? ????????",
        insight: "????:",
        insightTxt1: "????? ?????? ??? ???? ??? ?? ???????? ??? ?????. ??? ?? ??? ????? ????? ?????? ?????",
        insightTxt2: ".",
        latest: "???? ??????? ???????",
        by: "??????:",
        revenue: "????????? (??? ?????)",
        bookings: "?????? ????????",
        days: { "Monday": "???????", "Tuesday": "????????", "Wednesday": "????????", "Thursday": "??????", "Friday": "??????", "Saturday": "?????" }
    }
};

const StatCard = ({ stat, delay }: { stat: any, delay: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
    >
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <span className={`text-sm font-semibold px-2 py-1 rounded-full ${stat.change.startsWith('-') ? 'text-red-600 bg-red-50 dark:bg-red-900/30' : 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30'}`}>
                {stat.change}
            </span>
        </div>
        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</h3>
        <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
        
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
                        if (e.description && e.description.includes("AdminHub")) {
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
                                color: "text-blue-500"
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
        { id: 1, label: t.totalPat, value: `${statsData.patients}`, change: "+12%", icon: Users, color: "text-blue-600", bg: "bg-blue-100 dark:bg-blue-900/30", chartColor: "bg-blue-200 dark:bg-blue-800", sparkline: [40, 50, 45, 60, 75, 80, 100] },
        { id: 2, label: t.appMonth, value: `${statsData.appointmentsMonth}`, change: `+${statsData.appointmentsToday} ${t.today}`, icon: Calendar, color: "text-purple-600", bg: "bg-purple-100 dark:bg-purple-900/30", chartColor: "bg-purple-200 dark:bg-purple-800", sparkline: [20, 40, 35, 50, 45, 70, 85] },
        { id: 3, label: t.bookings || "Total Bookings", value: `${statsData.whatsapp + statsData.secretary}`, change: "+5%", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-100 dark:bg-emerald-900/30", chartColor: "bg-emerald-200 dark:bg-emerald-800", sparkline: [60, 55, 65, 80, 70, 90, 100] },
    ];

    const recentPatients = [
        { name: "Youssef Fassi", id: "PT-2041", priority: "High", date: "2026-04-26" },
        { name: "Sara Alami", id: "PT-2042", priority: "Medium", date: "2026-04-26" },
        { name: "Amine Tazi", id: "PT-2043", priority: "Low", date: "2026-04-25" },
        { name: "Nadia Bennis", id: "PT-2044", priority: "High", date: "2026-04-24" },
    ];

    const calendarDays = Array.from({length: 30}, (_, i) => i + 1);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t.title}</h2>
                    <p className="text-gray-500 mt-1">{t.subtitle}</p>
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
                    className="bg-gradient-to-br from-emerald-500 to-green-600 border border-green-400 rounded-2xl p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-white relative overflow-hidden flex flex-col h-full"
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
                <div className="lg:col-span-2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-fit">
                    <div className="flex items-center gap-2 mb-6">
                        <Users className="w-6 h-6 text-blue-600" />
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Patients</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-100 dark:border-gray-800 text-gray-500 dark:text-gray-400 text-sm">
                                    <th className="pb-3 font-medium">Name</th>
                                    <th className="pb-3 font-medium">Ward/ID</th>
                                    <th className="pb-3 font-medium">Priority</th>
                                    <th className="pb-3 font-medium">Start Date</th>
                                    <th className="pb-3 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentPatients.map((p, i) => (
                                    <tr key={i} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors last:border-0">
                                        <td className="py-4 font-semibold text-gray-900 dark:text-white">{p.name}</td>
                                        <td className="py-4 text-gray-500">{p.id}</td>
                                        <td className="py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${p.priority === 'High' ? 'bg-red-100 text-red-600 dark:bg-red-900/30' : p.priority === 'Medium' ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30' : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30'}`}>
                                                {p.priority}
                                            </span>
                                        </td>
                                        <td className="py-4 text-gray-500">{p.date}</td>
                                        <td className="py-4 text-right">
                                            <button className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors cursor-pointer">View</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Middle Right: Compact Calendar & Audit */}
                <div className="lg:col-span-1 flex flex-col gap-8">
                    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Calendar</h3>
                            <span className="text-sm font-semibold text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">April 2026</span>
                        </div>
                        <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-gray-400 mb-2">
                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <div key={i}>{d}</div>)}
                        </div>
                        <div className="grid grid-cols-7 gap-1">
                            {[0, 0, 0].map((_, i) => <div key={`empty-${i}`}></div>)}
                            {calendarDays.map(d => (
                                <div key={d} className={`aspect-square flex items-center justify-center rounded-lg text-sm font-medium cursor-pointer transition-colors ${d === 26 ? 'bg-blue-600 text-white shadow-md' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                                    {d}
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex-1">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{t.latest}</h3>
                        <div className="overflow-y-auto pr-2 space-y-4 max-h-[250px]">
                            {auditLog.map((log, i) => (
                                <div key={i} className="flex gap-3 pb-4 border-b border-gray-50 dark:border-gray-800/50 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/30 p-2 rounded-lg transition-colors">
                                    <div className="mt-0.5">
                                        <log.icon className={`w-4 h-4 ${log.color}`} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <p className="text-sm font-bold text-gray-900 dark:text-white">{log.action}</p>
                                        </div>
                                        <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mt-1">{log.details}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Section: Full Width Revenue Analysis */}
            <div className="mt-12 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2">
                        <BarChart2 className="w-6 h-6 text-blue-600" />
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Revenue & Performance Analysis</h3>
                    </div>
                    <span className="text-sm font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1 rounded-full">+24% vs Last Week</span>
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


