/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight, Clock, Trash2, Settings, AlertOctagon, Palmtree, X, Calendar as CalendarIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { logAuditActivity } from "@/src/lib/audit";

const CALENDAR_T: Record<string, any> = {
    en: {
        title: "Calendar",
        subtitle: "Manage client appointments and schedule.",
        vacation: "Vacation",
        unavailable: "Unavailable",
        today: "Today",
        newAppt: "+ New Appt",
        loading: "Loading",
        events: "events...",
        allDay: "All Day:",
        time: "Time",
        appointments: "Appointments",
        fullDayBlocked: "This entire day has been marked as Unavailable / Vacation.",
        lunchBreak: "LUNCH BREAK",
        addBooking: "+ Add Booking",
        newConsultation: "New Consultation",
        patientName: "Patient Name",
        hour: "Hour",
        type: "Type",
        cancel: "Cancel",
        save: "Save",
        scheduleSettings: "Schedule Settings",
        openingTime: "Opening Time",
        closingTime: "Closing Time",
        breakStart: "Break Start",
        breakEnd: "Break End",
        saveClose: "Save & Close",
        newBlock: "New Block/Vacation",
        reason: "Reason",
        startDate: "Start Date",
        endDate: "End Date",
        blockSchedule: "Block Schedule",
        vacationReason: "Vacation/Leave",
        unavailReason: "Unavailable",
        deleteConfirm: "Delete this appointment?"
    },
    fr: {
        title: "Calendrier",
        subtitle: "Gérez les rendez-vous et l'emploi du temps.",
        vacation: "Vacances",
        unavailable: "Indisponible",
        today: "Auj.",
        newAppt: "+ Nouv. RDV",
        loading: "Chargement des événements de",
        events: "...",
        allDay: "Toute la journée :",
        time: "Heure",
        appointments: "Rendez-vous",
        fullDayBlocked: "Toute cette journée a été marquée comme Indisponible / Vacances.",
        lunchBreak: "PAUSE DÉJEUNER",
        addBooking: "+ Ajouter",
        newConsultation: "Nouvelle Consultation",
        patientName: "Nom du Patient",
        hour: "Heure",
        type: "Type",
        cancel: "Annuler",
        save: "Enregistrer",
        scheduleSettings: "Paramètres Horaires",
        openingTime: "Heure d'ouverture",
        closingTime: "Heure de fermeture",
        breakStart: "Début de la pause",
        breakEnd: "Fin de la pause",
        saveClose: "Enregistrer & Fermer",
        newBlock: "Nouveau Blocage/Vacances",
        reason: "Raison",
        startDate: "Date de début",
        endDate: "Date de fin",
        blockSchedule: "Bloquer",
        vacationReason: "Vacances/Congé",
        unavailReason: "Indisponible",
        deleteConfirm: "Supprimer ce rendez-vous ?"
    },
    ar: {
        title: "???????",
        subtitle: "????? ???????? ??????? ??????.",
        vacation: "????",
        unavailable: "??? ????",
        today: "?????",
        newAppt: "+ ???? ????",
        loading: "???? ????? ?????",
        events: "...",
        allDay: "???? ?????:",
        time: "?????",
        appointments: "????????",
        fullDayBlocked: "?? ????? ??? ????? ?????? ???? ???? / ????.",
        lunchBreak: "??????? ??????",
        addBooking: "+ ????? ???",
        newConsultation: "??????? ?????",
        patientName: "??? ??????",
        hour: "??????",
        type: "?????",
        cancel: "?????",
        save: "???",
        scheduleSettings: "??????? ??????",
        openingTime: "??? ?????",
        closingTime: "??? ???????",
        breakStart: "????? ?????????",
        breakEnd: "????? ?????????",
        saveClose: "??? ??????",
        newBlock: "??? ????/????",
        reason: "?????",
        startDate: "????? ?????",
        endDate: "????? ????????",
        blockSchedule: "??? ??????",
        vacationReason: "????/?????",
        unavailReason: "??? ????",
        deleteConfirm: "?? ???? ??? ??? ???????"
    }
};

export default function CalendarTab() {
    const pathname = usePathname();
    const currentLocale = pathname?.split('/')[1] || 'en';
    const t = CALENDAR_T[currentLocale] || CALENDAR_T['en'];
    const defaultTimeSlots = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];

    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [appointments, setAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // Settings State
    const [openingTime, setOpeningTime] = useState("09:00");
    const [closingTime, setClosingTime] = useState("18:00");
    const [breakStart, setBreakStart] = useState("13:00");
    const [breakEnd, setBreakEnd] = useState("14:00");

    // Modal states
    const [isApptModalOpen, setIsApptModalOpen] = useState(false);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
    const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);

    useEffect(() => {
        const handleOpenAppt = () => setIsApptModalOpen(true);
        window.addEventListener('openApptModal', handleOpenAppt);
        return () => window.removeEventListener('openApptModal', handleOpenAppt);
    }, []);

    // New Block State
    const [blockReason, setBlockReason] = useState("Vacation/Leave");
    const [blockStartDate, setBlockStartDate] = useState("");
    const [blockEndDate, setBlockEndDate] = useState("");

    // New Appt State
    const [newEventName, setNewEventName] = useState("");
    const [newEventTime, setNewEventTime] = useState("09:00");
    const [newEventType, setNewEventType] = useState("Consultation");

    // Filter timeSlots based on opening, closing and break
    const filteredTimeSlots = defaultTimeSlots.filter(t => {
        const hour = parseInt(t.split(":")[0]);
        const open = parseInt(openingTime.split(":")[0]);
        const close = parseInt(closingTime.split(":")[0]);
        const bStart = parseInt(breakStart.split(":")[0]);
        const bEnd = parseInt(breakEnd.split(":")[0]);

        if (hour < open || hour >= close) return false;
        if (hour >= bStart && hour < bEnd) return false; // Exclude entirely or mark as Break
        return true;
    });

    // We explicitly keep break slots but visually mark them differently
    const timeSlots = defaultTimeSlots.filter(t => {
        const hour = parseInt(t.split(":")[0]);
        const open = parseInt(openingTime.split(":")[0]);
        const close = parseInt(closingTime.split(":")[0]);
        return hour >= open && hour < close;
    });

    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            try {
                // Fetch strictly for exactly the selectedDate
                const dateStr = selectedDate.getFullYear() + "-" +
                    String(selectedDate.getMonth() + 1).padStart(2, '0') + "-" +
                    String(selectedDate.getDate()).padStart(2, '0');

                const res = await fetch(`/api/calendar?date=${dateStr}`);
                const text = await res.text();

                let data: any = {};
                try {
                    data = JSON.parse(text);
                } catch (err) {
                    console.warn("Backend sent non-JSON response:", text);
                    return; // Stop processing gracefully to prevent crash
                }

                if (res.ok && data.events) {
                    setAppointments(data.events);
                } else if (data.error) {
                    setErrorMsg("Note: Google Calendar API missing proper config. Please fix JSON key sharing.");
                    setAppointments([]);
                }
            } catch (error) {
                console.error("Failed to fetch calendar", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [selectedDate]);

    const changeDate = (daysCount: number) => {
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() + daysCount);
        setSelectedDate(newDate);
    };

    const handleCreateLocalAppointment = async (e: React.FormEvent) => {
        e.preventDefault();

        const dateStr = selectedDate.getFullYear() + "-" +
            String(selectedDate.getMonth() + 1).padStart(2, '0') + "-" +
            String(selectedDate.getDate()).padStart(2, '0');

        const newAppt = {
            id: Math.random().toString(36).substring(7),
            name: newEventName,
            time: newEventTime,
            type: newEventType,
            duration: 1,
            date: dateStr
        };

        // Instantly add to dashboard visually
        setAppointments(prev => [...prev, newAppt]);
        logAuditActivity("createAppt", newEventName, "calendar");

        // Fully automatic robust backend push
        try {
            const res = await fetch("/api/calendar", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newAppt)
            });
            const data = await res.json();
            if (data.error) {
                alert("Erreur Google API: " + data.error);
                console.error("Backend error:", data.error);
            } else {
                // Refresh cleanly to get the real Google ID for deleting later
                setAppointments(prev => prev.map(a => a.id === newAppt.id ? { ...a, id: data.event.id } : a));
            }
        } catch (err) {
            console.error("Failed background sync", err);
        }

        setIsApptModalOpen(false);
        setNewEventName("");
    };

    const handleCreateBlock = async (e: React.FormEvent) => {
        e.preventDefault();

        const newAppt = {
            id: Math.random().toString(36).substring(7),
            name: blockReason,
            time: "All Day",
            type: "Block",
            duration: 24,
            date: blockStartDate,
            startDate: blockStartDate,
            endDate: blockEndDate || blockStartDate
        };

        if (blockStartDate === (selectedDate.getFullYear() + "-" + String(selectedDate.getMonth() + 1).padStart(2, '0') + "-" + String(selectedDate.getDate()).padStart(2, '0'))) {
            setAppointments(prev => [...prev, newAppt]);
        }
        logAuditActivity("markUnavail", blockReason, "calendar");

        try {
            const res = await fetch("/api/calendar", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newAppt)
            });
            const data = await res.json();
            if (data.error) {
                console.error("Backend error:", data.error);
            } else {
                setAppointments(prev => prev.map(a => a.id === newAppt.id ? { ...a, id: data.event.id } : a));
            }
        } catch (err) {
            console.error("Failed background sync", err);
        }

        setIsBlockModalOpen(false);
    };

    const openBlockModal = (reason: string) => {
         const dateStr = selectedDate.getFullYear() + "-" +
            String(selectedDate.getMonth() + 1).padStart(2, '0') + "-" +
            String(selectedDate.getDate()).padStart(2, '0');
         setBlockReason(reason);
         setBlockStartDate(dateStr);
         setBlockEndDate(dateStr);
         setIsBlockModalOpen(true);
    };

    const handleDeleteEvent = async (eventId: string, e: React.MouseEvent) => {
        e.stopPropagation(); // prevent clicking the background
        if (!confirm(t.deleteConfirm)) return;

        const apptToDelete = appointments.find(a => a.id === eventId);
        if (apptToDelete) {
            logAuditActivity("deleteAppt", apptToDelete.name, "calendar");
        }

        // Visually remove instantly
        setAppointments(prev => prev.filter(app => app.id !== eventId));

        try {
            await fetch(`/api/calendar?id=${eventId}`, {
                method: "DELETE"
            });
        } catch (err) {
            console.error("Delete failed", err);
        }
    };

    const displayDateStr = selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' });

    const isFullDayBlocked = appointments.some(a => a.time === "All Day" && (a.name === "Vacation/Leave" || a.name === "Unavailable"));

    return (
        <div className="space-y-6 relative">
            {/* New Appt Modal */}
            <AnimatePresence>
                {isApptModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 w-full max-w-md overflow-hidden relative z-[101]"
                        >
                            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-900">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t.newConsultation}</h3>
                                <button onClick={() => setIsApptModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors cursor-pointer text-xl">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <form onSubmit={handleCreateLocalAppointment} className="p-6 space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t.patientName}</label>
                                    <input
                                        type="text"
                                        required
                                        value={newEventName}
                                        onChange={(e) => setNewEventName(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none text-gray-900 dark:text-white"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t.hour}</label>
                                        <select
                                            value={newEventTime}
                                            onChange={(e) => setNewEventTime(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none"
                                        >
                                            {filteredTimeSlots.map(t_slot => <option key={t_slot} value={t_slot}>{t_slot}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t.type}</label>
                                        <select
                                            value={newEventType}
                                            onChange={(e) => setNewEventType(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none"
                                        >
                                            <option value="Consultation">Consultation</option>
                                            <option value="Follow-up">Follow-up</option>
                                            <option value="Urgent">Urgent</option>
                                            <option value="Devis">Devis</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="pt-4 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsApptModalOpen(false)}
                                        className="flex-1 px-4 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium transition-colors cursor-pointer"
                                    >
                                        {t.cancel}
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors cursor-pointer shadow-lg shadow-blue-600/30"
                                    >
                                        {t.save}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Settings Modal */}
            <AnimatePresence>
                {isSettingsModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 w-full max-w-md overflow-hidden relative z-[101]"
                        >
                            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-900">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2"><Settings className="w-5 h-5 text-blue-600" /> {t.scheduleSettings}</h3>
                                <button onClick={() => setIsSettingsModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors cursor-pointer text-xl">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="p-6 space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t.openingTime}</label>
                                        <select
                                            value={openingTime}
                                            onChange={(e) => setOpeningTime(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none"
                                        >
                                            {defaultTimeSlots.map(t_slot => <option key={t_slot} value={t_slot}>{t_slot}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t.closingTime}</label>
                                        <select
                                            value={closingTime}
                                            onChange={(e) => setClosingTime(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none"
                                        >
                                            {defaultTimeSlots.map(t_slot => <option key={t_slot} value={t_slot}>{t_slot}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 border-t border-gray-100 dark:border-gray-800 pt-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t.breakStart}</label>
                                        <select
                                            value={breakStart}
                                            onChange={(e) => setBreakStart(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none"
                                        >
                                            {defaultTimeSlots.map(t_slot => <option key={t_slot} value={t_slot}>{t_slot}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t.breakEnd}</label>
                                        <select
                                            value={breakEnd}
                                            onChange={(e) => setBreakEnd(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none"
                                        >
                                            {defaultTimeSlots.map(t_slot => <option key={t_slot} value={t_slot}>{t_slot}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="pt-4 flex gap-3">
                                    <button
                                        onClick={() => setIsSettingsModalOpen(false)}
                                        className="w-full px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors cursor-pointer shadow-lg shadow-blue-600/30"
                                    >
                                        {t.saveClose}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Block Modal */}
            <AnimatePresence>
                {isBlockModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 w-full max-w-md overflow-hidden relative z-[101]"
                        >
                            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-900">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2"><AlertOctagon className="w-5 h-5 text-amber-600" /> {t.newBlock}</h3>
                                <button onClick={() => setIsBlockModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors cursor-pointer text-xl">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <form onSubmit={handleCreateBlock} className="p-6 space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t.reason}</label>
                                    <select
                                        value={blockReason}
                                        onChange={(e) => setBlockReason(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none"
                                    >
                                        <option value="Vacation/Leave">{t.vacationReason}</option>
                                        <option value="Unavailable">{t.unavailReason}</option>
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t.startDate}</label>
                                        <input
                                            type="date"
                                            required
                                            value={blockStartDate}
                                            onChange={(e) => setBlockStartDate(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none text-gray-900 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t.endDate}</label>
                                        <input
                                            type="date"
                                            required
                                            value={blockEndDate}
                                            onChange={(e) => setBlockEndDate(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none text-gray-900 dark:text-white"
                                        />
                                    </div>
                                </div>
                                <div className="pt-4 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsBlockModalOpen(false)}
                                        className="flex-1 px-4 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium transition-colors cursor-pointer"
                                    >
                                        {t.cancel}
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold transition-colors cursor-pointer shadow-lg shadow-amber-600/30"
                                    >
                                        {t.blockSchedule}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t.title}</h2>
                    <p className="text-sm text-gray-500 mt-1">{t.subtitle}</p>
                    {errorMsg && <p className="text-sm text-yellow-600 dark:text-yellow-500 mt-1">{errorMsg}</p>}
                </div>

                <div className="flex items-center flex-wrap gap-3">
                    <button
                        onClick={() => openBlockModal("Vacation/Leave")}
                        className="px-3 py-2 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 rounded-xl hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors flex items-center gap-1.5 text-sm font-medium border border-emerald-200 dark:border-emerald-800/50"
                    >
                        <Palmtree className="w-4 h-4" /> <span className="hidden sm:inline">{t.vacation}</span>
                    </button>
                    <button
                        onClick={() => openBlockModal("Unavailable")}
                        className="px-3 py-2 bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 rounded-xl hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors flex items-center gap-1.5 text-sm font-medium border border-amber-200 dark:border-amber-800/50"
                    >
                        <AlertOctagon className="w-4 h-4" /> <span className="hidden sm:inline">{t.unavailable}</span>
                    </button>

                    <div className="flex items-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm mx-1">
                        <button onClick={() => changeDate(-1)} className="p-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </button>
                        <div className="px-4 py-2 font-medium text-sm text-gray-900 dark:text-white border-x border-gray-200 dark:border-gray-800 flex items-center gap-1.5">
                            <CalendarIcon className="w-4 h-4" />
                            {displayDateStr}
                        </div>
                        <button onClick={() => changeDate(1)} className="p-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                            <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </button>
                        <button onClick={() => setSelectedDate(new Date())} className={`p-2 px-4 hover:bg-gray-50 dark:hover:bg-gray-800 ${currentLocale === 'ar' ? 'border-r' : 'border-l'} border-gray-200 dark:border-gray-800 transition-colors cursor-pointer text-sm font-bold text-blue-600 hidden sm:block`}>
                            {t.today}
                        </button>
                    </div>

                    <button
                        onClick={() => setIsSettingsModalOpen(true)}
                        className="p-2 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors hidden sm:block shadow-sm"
                        title={t.scheduleSettings}
                    >
                        <Settings className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => setIsApptModalOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-colors font-medium text-sm shadow-sm hidden sm:block cursor-pointer text-center"
                    >
                        {t.newAppt}
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                {loading && (
                    <div className="w-full text-center py-2 bg-gray-50 dark:bg-gray-800 text-sm text-gray-500">
                        {t.loading} {displayDateStr} {t.events}
                    </div>
                )}

                {/* All day block events (Vacation/Unavailable) display on top */}
                {appointments.filter(a => a.time === "All Day").map(a => (
                    <div key={a.id} className="p-4 bg-amber-50 dark:bg-amber-900/20 border-b border-amber-100 dark:border-amber-900/50 flex justify-between items-center text-amber-800 dark:text-amber-200 group">
                        <div className="flex items-center gap-2 font-bold">
                            <AlertOctagon className="w-5 h-5" /> {t.allDay} {a.name}
                        </div>
                        <button onClick={(e) => handleDeleteEvent(a.id, e)} className="opacity-0 group-hover:opacity-100 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/40 p-1.5 rounded-lg transition-all cursor-pointer">
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                ))}

                <div className="flex bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                    <div className={`w-24 ${currentLocale === 'ar' ? 'border-l' : 'border-r'} border-gray-100 dark:border-gray-800 p-4 text-center font-medium text-sm text-gray-500`}>
                        {t.time}
                    </div>
                    <div className="flex-1 p-4 font-medium text-sm text-gray-900 dark:text-white">
                        {t.appointments}
                    </div>
                </div>

                <div className="divide-y divide-gray-50 dark:divide-gray-800/50">
                    {isFullDayBlocked ? (
                        <div className="p-12 text-center text-gray-500 dark:text-gray-400 font-medium">
                            <AlertOctagon className="w-12 h-12 mx-auto mb-3 opacity-20" />
                            {t.fullDayBlocked}
                        </div>
                    ) : timeSlots.map((time, idx) => {
                        const hasAppointment = appointments.find((a) => a.time === "All Day" ? false : a.time === time);
                        const isBreak = (() => {
                            const hour = parseInt(time.split(":")[0]);
                            const bStart = parseInt(breakStart.split(":")[0]);
                            const bEnd = parseInt(breakEnd.split(":")[0]);
                            return hour >= bStart && hour < bEnd;
                        })();

                        return (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                key={time + displayDateStr}
                                className={`flex relative group min-h-[80px] ${isBreak ? 'bg-gray-50 dark:bg-gray-800/30' : ''}`}
                            >
                                <div className={`w-24 ${currentLocale === 'ar' ? 'border-l' : 'border-r'} border-gray-50 dark:border-gray-800/50 p-4 text-center text-sm font-medium text-gray-400 flex items-start justify-center`}>
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-3 h-3 hidden sm:block" /> {time}
                                    </div>
                                </div>
                                <div className="flex-1 p-3">
                                    {isBreak ? (
                                        <div className="h-full w-full rounded-xl flex items-center justify-center text-gray-400 dark:text-gray-500 font-bold tracking-wider italic">
                                            {t.lunchBreak}
                                        </div>
                                    ) : hasAppointment ? (
                                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 rounded-xl p-3 h-full hover:shadow-md transition-all relative group/item">
                                            <div className="flex justify-between items-start mb-1">
                                                <strong className="text-blue-900 dark:text-blue-100 text-sm">{hasAppointment.name}</strong>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-950 px-2 py-0.5 rounded-full shadow-sm">
                                                        {hasAppointment.type}
                                                    </span>
                                                    <button onClick={(e) => handleDeleteEvent(hasAppointment.id, e)} className="opacity-0 group-hover/item:opacity-100 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/40 p-1.5 rounded-lg transition-all cursor-pointer">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="text-xs text-blue-700/80 dark:text-blue-300/80">
                                                {hasAppointment.time} ({hasAppointment.duration ? hasAppointment.duration : "1"}h)
                                            </div>
                                        </div>
                                    ) : (
                                        <div onClick={() => { setNewEventTime(time); setIsApptModalOpen(true); }} className="h-full w-full border-2 border-dashed border-transparent hover:border-gray-200 dark:hover:border-gray-800 rounded-xl flex items-center justify-center opacity-0 hover:opacity-100 transition-all cursor-pointer">
                                            <span className="text-sm text-gray-400 font-medium">{t.addBooking}</span>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}


