/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import {
  AlertOctagon,
  Calendar as CalendarIcon,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Palmtree,
  Settings,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { logAuditActivity } from "@/src/lib/audit";
import {
  APPOINTMENT_COMMENT_MAX,
  addMinutes,
  buildSlotsForDay,
  clampComment,
  formatDateKey,
  getPatients,
  getScheduleSettings,
  isFutureOrToday,
  isValidName,
  savePatients,
  saveScheduleSettings,
  sanitizeName,
  type ScheduleSettings,
} from "@/src/lib/clinic";

const CALENDAR_T: Record<string, any> = {
  en: {
    title: "Calendar",
    subtitle: "Manage a realistic clinic schedule with 30-minute appointments.",
    vacation: "Vacation",
    unavailable: "Unavailable",
    today: "Today",
    newAppt: "+ New Appt",
    loading: "Loading appointments for",
    events: "...",
    allDay: "All day:",
    time: "Time",
    appointments: "Appointments",
    fullDayBlocked: "This day is blocked.",
    addBooking: "+ Add booking",
    newConsultation: "New Appointment",
    patientName: "Patient Name",
    hour: "Hour",
    type: "Visit type",
    cancel: "Cancel",
    save: "Save",
    scheduleSettings: "Schedule Settings",
    openingTime: "Opening time",
    closingTime: "Closing time",
    breakStart: "Break start",
    breakEnd: "Break end",
    slotDuration: "Slot duration",
    offDays: "Days off",
    halfDays: "Half-days",
    saveClose: "Save & Close",
    newBlock: "New Block / Vacation",
    reason: "Reason",
    startDate: "Start date",
    endDate: "End date",
    blockSchedule: "Block Schedule",
    vacationReason: "Vacation / Leave",
    unavailReason: "Unavailable",
    deleteConfirm: "Delete this appointment?",
    comment: "Comment",
    commentHint: `Max ${APPOINTMENT_COMMENT_MAX} chars`,
    slot: "30 min slot",
    settingsSaved: "Schedule settings saved.",
    noPast: "Past dates are not allowed here.",
    googleWarning: "Google Calendar credentials are missing. The schedule remains usable locally.",
    dateJump: "Jump to date",
    overview: "Today overview",
    week: "1 week",
    twoWeeks: "2 weeks",
    threeWeeks: "3 weeks",
    month: "1 month",
    booked: "booked",
    available: "available",
    blocked: "blocked",
    confirmed: "Appointment confirmed",
    confirmedHint: "The booking was added to the calendar and patient history.",
    noSlots: "No slot available on this day with current settings.",
    slotTaken: "This slot is already booked.",
    utilization: "utilization",
  },
  fr: {
    title: "Calendrier",
    subtitle: "Gerez un agenda de cabinet realiste avec des rendez-vous de 30 minutes.",
    vacation: "Vacances",
    unavailable: "Indisponible",
    today: "Auj.",
    newAppt: "+ Nouv. RDV",
    loading: "Chargement des rendez-vous du",
    events: "...",
    allDay: "Journee entiere :",
    time: "Heure",
    appointments: "Rendez-vous",
    fullDayBlocked: "Cette journee est bloquee.",
    addBooking: "+ Ajouter",
    newConsultation: "Nouveau rendez-vous",
    patientName: "Nom du patient",
    hour: "Heure",
    type: "Type de visite",
    cancel: "Annuler",
    save: "Enregistrer",
    scheduleSettings: "Parametres horaires",
    openingTime: "Heure d ouverture",
    closingTime: "Heure de fermeture",
    breakStart: "Debut de pause",
    breakEnd: "Fin de pause",
    slotDuration: "Duree du creneau",
    offDays: "Jours off",
    halfDays: "Demi-journees",
    saveClose: "Enregistrer & fermer",
    newBlock: "Nouveau blocage / vacances",
    reason: "Raison",
    startDate: "Date de debut",
    endDate: "Date de fin",
    blockSchedule: "Bloquer",
    vacationReason: "Vacances / Conge",
    unavailReason: "Indisponible",
    deleteConfirm: "Supprimer ce rendez-vous ?",
    comment: "Commentaire",
    commentHint: `Max ${APPOINTMENT_COMMENT_MAX} caracteres`,
    slot: "Creneau de 30 min",
    settingsSaved: "Parametres horaires enregistres.",
    noPast: "Les dates passees ne sont pas autorisees ici.",
    googleWarning: "Les identifiants Google Calendar sont absents. Le calendrier reste utilisable en local.",
    dateJump: "Aller a une date",
    overview: "Vue du jour",
    week: "1 semaine",
    twoWeeks: "2 semaines",
    threeWeeks: "3 semaines",
    month: "1 mois",
    booked: "reserves",
    available: "disponibles",
    blocked: "bloques",
    confirmed: "Rendez-vous confirme",
    confirmedHint: "Le rendez-vous a bien ete ajoute au calendrier et a l historique patient.",
    noSlots: "Aucun creneau disponible ce jour avec les parametres actuels.",
    slotTaken: "Ce creneau est deja reserve.",
    utilization: "occupation",
  },
  ar: {
    title: "التقويم",
    subtitle: "تدبير مرن لمواعيد العيادة حسب التوفر والعطل.",
    vacation: "عطلة",
    unavailable: "غير متاح",
    today: "اليوم",
    newAppt: "+ موعد جديد",
    loading: "جار تحميل مواعيد",
    events: "...",
    allDay: "اليوم كامل:",
    time: "الوقت",
    appointments: "المواعيد",
    fullDayBlocked: "هذا اليوم محجوب.",
    addBooking: "+ إضافة موعد",
    newConsultation: "موعد جديد",
    patientName: "اسم المريض",
    hour: "الساعة",
    type: "نوع الزيارة",
    cancel: "إلغاء",
    save: "حفظ",
    scheduleSettings: "إعدادات الجدول",
    openingTime: "وقت البداية",
    closingTime: "وقت النهاية",
    breakStart: "بداية الاستراحة",
    breakEnd: "نهاية الاستراحة",
    slotDuration: "مدة الموعد",
    offDays: "أيام العطلة",
    halfDays: "أنصاف الأيام",
    saveClose: "حفظ وإغلاق",
    newBlock: "حجب جديد / عطلة",
    reason: "السبب",
    startDate: "تاريخ البداية",
    endDate: "تاريخ النهاية",
    blockSchedule: "حجب الجدول",
    vacationReason: "عطلة / إجازة",
    unavailReason: "غير متاح",
    deleteConfirm: "حذف هذا الموعد؟",
    comment: "تعليق",
    commentHint: `الحد ${APPOINTMENT_COMMENT_MAX} حرفا`,
    slot: "موعد 30 دقيقة",
    settingsSaved: "تم حفظ إعدادات الجدول.",
    noPast: "التواريخ الماضية غير مسموح بها هنا.",
    googleWarning: "بيانات Google Calendar غير متوفرة. يبقى الجدول شغالاً محليا.",
    dateJump: "الانتقال إلى تاريخ",
    overview: "نظرة اليوم",
    week: "أسبوع",
    twoWeeks: "أسبوعان",
    threeWeeks: "3 أسابيع",
    month: "شهر",
    booked: "محجوز",
    available: "متاح",
    blocked: "محجوب",
    confirmed: "تم تأكيد الموعد",
    confirmedHint: "تمت إضافة الموعد إلى التقويم وملف المريض.",
    noSlots: "لا يوجد موعد متاح بهذا اليوم حسب الإعدادات الحالية.",
    slotTaken: "هذا الموعد محجوز بالفعل.",
    utilization: "نسبة الإشغال",
  },
};

const visitTypes = ["Consultation", "Controle", "Urgence", "Resultats"];
const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
type RangeView = "day" | "week" | "2weeks" | "3weeks" | "month";

type CalendarEvent = {
  id: string;
  name: string;
  time: string;
  type: string;
  duration: number;
  date: string;
  description?: string;
};

const rangeOptions: Array<{ id: RangeView; labelKey: string }> = [
  { id: "day", labelKey: "overview" },
  { id: "week", labelKey: "week" },
  { id: "2weeks", labelKey: "twoWeeks" },
  { id: "3weeks", labelKey: "threeWeeks" },
  { id: "month", labelKey: "month" },
];

const localeMap: Record<string, string> = {
  en: "en-US",
  fr: "fr-FR",
  ar: "ar-MA",
};

function addDays(base: Date, days: number) {
  const next = new Date(base);
  next.setDate(next.getDate() + days);
  return next;
}

function getRangeLength(view: RangeView) {
  if (view === "week") return 7;
  if (view === "2weeks") return 14;
  if (view === "3weeks") return 21;
  if (view === "month") return 30;
  return 1;
}

function getOccupiedTimes(date: string) {
  return new Set(
    getPatients()
      .flatMap((patient) => patient.history || [])
      .filter((item) => item.date === date && item.time !== "All Day")
      .map((item) => item.time)
  );
}

export default function CalendarTab() {
  const pathname = usePathname();
  const currentLocale = pathname?.split("/")[1] || "en";
  const t = CALENDAR_T[currentLocale] || CALENDAR_T.en;
  const currentLocaleTag = localeMap[currentLocale] || localeMap.en;
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [appointments, setAppointments] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [settings, setSettings] = useState<ScheduleSettings>(getScheduleSettings());
  const [infoMessage, setInfoMessage] = useState("");
  const [confirmationBanner, setConfirmationBanner] = useState("");
  const [rangeView, setRangeView] = useState<RangeView>("day");
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const [isApptModalOpen, setIsApptModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);

  const [blockReason, setBlockReason] = useState("Vacation/Leave");
  const [blockStartDate, setBlockStartDate] = useState(formatDateKey(new Date()));
  const [blockEndDate, setBlockEndDate] = useState(formatDateKey(new Date()));

  const [newEventName, setNewEventName] = useState("");
  const [newEventTime, setNewEventTime] = useState("");
  const [newEventType, setNewEventType] = useState("Consultation");
  const [newEventComment, setNewEventComment] = useState("");

  useEffect(() => {
    const handleOpenAppt = () => {
      const dateKey = formatDateKey(selectedDate);
      const firstSlot = buildSlotsForDay(dateKey, settings).find((slot) => !getOccupiedTimes(dateKey).has(slot)) || "";
      setNewEventTime(firstSlot);
      setIsApptModalOpen(true);
    };
    window.addEventListener("openApptModal", handleOpenAppt);
    return () => window.removeEventListener("openApptModal", handleOpenAppt);
  }, [selectedDate, settings]);

  useEffect(() => {
    if (!confirmationBanner) return;
    const timer = window.setTimeout(() => setConfirmationBanner(""), 2800);
    return () => window.clearTimeout(timer);
  }, [confirmationBanner]);

  const selectedDateKey = formatDateKey(selectedDate);
  const timeSlots = useMemo(() => buildSlotsForDay(selectedDateKey, settings), [selectedDateKey, settings]);
  const occupiedTimes = useMemo(() => getOccupiedTimes(selectedDateKey), [selectedDateKey, appointments]);
  const availableBookingSlots = useMemo(() => timeSlots.filter((slot) => !occupiedTimes.has(slot)), [occupiedTimes, timeSlots]);

  const hydrateFromLocalPatients = () => {
    const localEvents = getPatients()
      .flatMap((patient) =>
        (patient.history || []).map((item) => ({
          id: item.id,
          name: patient.name,
          time: item.time,
          type: item.type,
          duration: settings.slotDurationMinutes,
          date: item.date,
          description: item.comment || "",
        }))
      )
      .filter((event) => event.date === selectedDateKey);

    setAppointments(localEvents);
  };

  const fetchEvents = async () => {
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch(`/api/calendar?date=${selectedDateKey}`);
      const data = await res.json();
      if (!res.ok || data?.error) {
        throw new Error(data?.error || "Calendar unavailable");
      }
      setAppointments(data.events || []);
      setInfoMessage("");
    } catch (error: any) {
      hydrateFromLocalPatients();
      setErrorMsg(t.googleWarning);
      setInfoMessage(error?.message || "");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [selectedDateKey]);

  const isPastSelectedDate = selectedDateKey < formatDateKey(new Date());

  const openBlockModal = (reason: string) => {
    const today = formatDateKey(new Date());
    const safeDate = selectedDateKey < today ? today : selectedDateKey;
    setBlockReason(reason);
    setBlockStartDate(safeDate);
    setBlockEndDate(safeDate);
    setIsBlockModalOpen(true);
  };

  const changeDate = (daysCount: number) => {
    setSelectedDate((prev) => addDays(prev, daysCount));
  };

  const syncAppointmentIntoPatients = (event: CalendarEvent) => {
    const patients = getPatients();
    const nextPatients = patients.map((patient) => {
      if (patient.name.toLowerCase() !== event.name.trim().toLowerCase()) {
        return patient;
      }

      const history = [
        {
          id: event.id,
          date: event.date,
          time: event.time,
          type: event.type,
          comment: event.description || "",
          source: "manual" as const,
        },
        ...(patient.history || []).filter((item) => item.id !== event.id),
      ].sort((a, b) => `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`));

      return {
        ...patient,
        history,
        date: history.find((item) => isFutureOrToday(item.date))?.date || "",
        status: (history.some((item) => isFutureOrToday(item.date)) ? "follow-up" : "inactive") as "follow-up" | "inactive",
      };
    });

    savePatients(nextPatients);
  };

  const handleCreateLocalAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isPastSelectedDate) {
      setErrorMsg(t.noPast);
      return;
    }
    if (!isValidName(newEventName)) {
      setErrorMsg(
        currentLocale === "fr"
          ? "Le nom du patient ne doit contenir que des lettres."
          : currentLocale === "ar"
            ? "Patient name must contain letters only."
            : "Patient name must contain letters only."
      );
      return;
    }
    if (!newEventTime || occupiedTimes.has(newEventTime)) {
      setErrorMsg(t.slotTaken);
      return;
    }

    const comment = clampComment(newEventComment);
    const newAppt: CalendarEvent = {
      id: Math.random().toString(36).slice(2),
      name: sanitizeName(newEventName.trim()),
      time: newEventTime,
      type: newEventType,
      duration: settings.slotDurationMinutes,
      date: selectedDateKey,
      description: comment,
    };

    setAppointments((prev) => [...prev, newAppt].sort((a, b) => a.time.localeCompare(b.time)));
    syncAppointmentIntoPatients(newAppt);
    logAuditActivity("createAppt", newEventName, "calendar");

    try {
      const res = await fetch("/api/calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newAppt.name,
          type: newAppt.type,
          date: newAppt.date,
          time: newAppt.time,
          durationMinutes: settings.slotDurationMinutes,
          description: `Comment: ${comment || "-"}\nCreated from calendar`,
        }),
      });
      const data = await res.json();
      if (!res.ok || data?.error) {
        setErrorMsg(t.googleWarning);
      } else {
        setAppointments((prev) => prev.map((item) => (item.id === newAppt.id ? { ...item, id: data.event?.id || item.id } : item)));
      }
    } catch {
      setErrorMsg(t.googleWarning);
    }

    setConfirmationBanner(t.confirmed);
    setIsApptModalOpen(false);
    setNewEventName("");
    setNewEventComment("");
  };

  const handleCreateBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFutureOrToday(blockStartDate) || !isFutureOrToday(blockEndDate)) {
      setErrorMsg(t.noPast);
      return;
    }

    const blockedDates = [...settings.blockedDates];
    let cursor = new Date(`${blockStartDate}T09:00:00`);
    const end = new Date(`${blockEndDate}T09:00:00`);
    while (cursor <= end) {
      const dateKey = formatDateKey(cursor);
      if (!blockedDates.some((item) => item.date === dateKey)) {
        blockedDates.push({ date: dateKey, reason: blockReason });
      }
      cursor = addDays(cursor, 1);
    }

    const nextSettings = { ...settings, blockedDates };
    setSettings(nextSettings);
    saveScheduleSettings(nextSettings);

    const newBlock: CalendarEvent = {
      id: Math.random().toString(36).slice(2),
      name: blockReason,
      time: "All Day",
      type: "Block",
      duration: 1440,
      date: blockStartDate,
      description: "",
    };

    if (blockStartDate === selectedDateKey) {
      setAppointments((prev) => [...prev, newBlock]);
    }
    logAuditActivity("markUnavail", blockReason, "calendar");

    try {
      const res = await fetch("/api/calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: blockReason,
          type: "Block",
          time: "All Day",
          date: blockStartDate,
          startDate: blockStartDate,
          endDate: blockEndDate,
        }),
      });
      const data = await res.json();
      if (!res.ok || data?.error) {
        setErrorMsg(t.googleWarning);
      }
    } catch {
      setErrorMsg(t.googleWarning);
    }

    setInfoMessage(t.settingsSaved);
    setIsBlockModalOpen(false);
  };

  const handleDeleteEvent = async (eventId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(t.deleteConfirm)) return;

    const deleted = appointments.find((item) => item.id === eventId);
    if (deleted) {
      logAuditActivity("deleteAppt", deleted.name, "calendar");
    }

    setAppointments((prev) => prev.filter((item) => item.id !== eventId));

    try {
      await fetch(`/api/calendar?id=${eventId}`, { method: "DELETE" });
    } catch {
      setErrorMsg(t.googleWarning);
    }
  };

  const displayDateStr = selectedDate.toLocaleDateString(currentLocaleTag, {
    weekday: "short",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const isFullDayBlocked =
    appointments.some((item) => item.time === "All Day") ||
    settings.blockedDates.some((item) => item.date === selectedDateKey);
  const firstOpenSlot = availableBookingSlots[0] || "";

  const toggleOffDay = (day: number) => {
    setSettings((prev) => ({
      ...prev,
      offDays: prev.offDays.includes(day) ? prev.offDays.filter((item) => item !== day) : [...prev.offDays, day],
    }));
  };

  const toggleHalfDay = (day: number) => {
    setSettings((prev) => {
      const existing = prev.halfDays.find((item) => item.day === day);
      return {
        ...prev,
        halfDays: existing ? prev.halfDays.filter((item) => item.day !== day) : [...prev.halfDays, { day, closingTime: "13:00" }],
      };
    });
  };

  const saveSettings = () => {
    saveScheduleSettings(settings);
    setInfoMessage(t.settingsSaved);
    setIsSettingsModalOpen(false);
  };

  const rangeDays = useMemo(() => {
    const length = getRangeLength(rangeView);
    return Array.from({ length }, (_, index) => {
      const date = addDays(selectedDate, index);
      const dateKey = formatDateKey(date);
      const slots = buildSlotsForDay(dateKey, settings);
      const dayAppointments = getPatients()
        .flatMap((patient) => (patient.history || []).map((item) => ({ ...item, patientName: patient.name })))
        .filter((item) => item.date === dateKey);

      return {
        date,
        dateKey,
        slotsCount: slots.length,
        bookedCount: dayAppointments.filter((item) => item.time !== "All Day").length,
        blocked: settings.blockedDates.some((item) => item.date === dateKey) || dayAppointments.some((item) => item.time === "All Day"),
        preview: dayAppointments.slice(0, 3),
      };
    });
  }, [rangeView, selectedDate, settings]);

  const rangeStats = useMemo(() => {
    return rangeDays.reduce(
      (acc, day) => {
        acc.booked += day.bookedCount;
        acc.available += Math.max(day.slotsCount - day.bookedCount, 0);
        if (day.blocked) acc.blocked += 1;
        return acc;
      },
      { booked: 0, available: 0, blocked: 0 }
    );
  }, [rangeDays]);

  return (
    <div className="relative space-y-6">
      <AnimatePresence>
        {confirmationBanner ? (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="premium-panel sticky top-4 z-40 rounded-[24px] border-emerald-200 bg-emerald-50 px-5 py-4 shadow-lg dark:border-emerald-800/40 dark:bg-emerald-900/30"
          >
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600 dark:text-emerald-300" />
              <div>
                <div className="font-bold text-emerald-800 dark:text-emerald-200">{confirmationBanner}</div>
                <div className="mt-1 text-sm text-emerald-700 dark:text-emerald-300/90">{t.confirmedHint}</div>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {isApptModalOpen ? (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.96, opacity: 0 }} className="relative z-[101] w-full max-w-md overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-900">
              <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-900">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t.newConsultation}</h3>
                <button onClick={() => setIsApptModalOpen(false)} className="text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleCreateLocalAppointment} className="space-y-5 p-6">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">{t.patientName}</label>
                  <input required value={newEventName} inputMode="text" onChange={(e) => setNewEventName(sanitizeName(e.target.value))} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-[#12695b] dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">{t.hour}</label>
                    <div className="max-h-48 overflow-y-auto rounded-2xl border border-gray-200 bg-gray-50 p-2 dark:border-gray-700 dark:bg-gray-800">
                      <div className="grid grid-cols-2 gap-2">
                        {availableBookingSlots.map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setNewEventTime(slot)}
                            className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
                              (newEventTime || firstOpenSlot) === slot
                                ? "bg-[#12695b] text-white"
                                : "bg-white text-slate-700 hover:bg-[#eff8f5] hover:text-[#12695b] dark:bg-[#0d1726] dark:text-slate-200 dark:hover:bg-[#9fe7d4]/12 dark:hover:text-[#9fe7d4]"
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">{t.type}</label>
                    <select value={newEventType} onChange={(e) => setNewEventType(e.target.value)} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-[#12695b] dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                      {visitTypes.map((item) => (
                        <option key={item} value={item}>{item}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">{t.comment}</label>
                  <textarea rows={3} maxLength={APPOINTMENT_COMMENT_MAX} value={newEventComment} onChange={(e) => setNewEventComment(e.target.value)} className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-[#12695b] dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
                  <div className="mt-1 text-right text-xs text-gray-500">{newEventComment.length}/{APPOINTMENT_COMMENT_MAX}</div>
                </div>
                <div className="rounded-2xl bg-[#eff8f5] px-4 py-3 text-sm text-[#12695b] dark:bg-emerald-900/20 dark:text-emerald-300">{t.slot}</div>
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setIsApptModalOpen(false)} className="flex-1 rounded-xl bg-gray-100 px-4 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">{t.cancel}</button>
                  <button type="submit" className="flex-1 rounded-xl bg-[#12695b] px-4 py-3 font-bold text-white shadow-lg shadow-emerald-900/20 transition-colors hover:bg-[#0f5a4e]">{t.save}</button>
                </div>
              </form>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {isSettingsModalOpen ? (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.96, opacity: 0 }} className="relative z-[101] flex max-h-[88vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-900">
              <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-900">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t.scheduleSettings}</h3>
                <button onClick={() => setIsSettingsModalOpen(false)} className="text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-white"><X className="h-5 w-5" /></button>
              </div>
              <div className="space-y-5 overflow-y-auto p-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FieldSelect label={t.openingTime} value={settings.openingTime} onChange={(value) => setSettings({ ...settings, openingTime: value })} />
                  <FieldSelect label={t.closingTime} value={settings.closingTime} onChange={(value) => setSettings({ ...settings, closingTime: value })} />
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FieldSelect label={t.breakStart} value={settings.breakStart} onChange={(value) => setSettings({ ...settings, breakStart: value })} />
                  <FieldSelect label={t.breakEnd} value={settings.breakEnd} onChange={(value) => setSettings({ ...settings, breakEnd: value })} />
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <DurationSelect
                    label={t.slotDuration}
                    value={settings.slotDurationMinutes}
                    onChange={(value) => setSettings({ ...settings, slotDurationMinutes: value })}
                  />
                  <div className="rounded-2xl bg-[#eff8f5] px-4 py-3 text-sm text-[#12695b] dark:bg-emerald-900/20 dark:text-emerald-300">{t.slot}</div>
                </div>
                <div>
                  <div className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">{t.offDays}</div>
                  <div className="flex flex-wrap gap-2">
                    {dayLabels.map((label, index) => (
                      <button key={label} type="button" onClick={() => toggleOffDay(index)} className={`rounded-full px-3 py-2 text-sm ${settings.offDays.includes(index) ? "bg-[#12695b] text-white" : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"}`}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">{t.halfDays}</div>
                  <div className="space-y-2">
                    {dayLabels.map((label, index) => {
                      const halfDay = settings.halfDays.find((item) => item.day === index);
                      return (
                        <div key={label} className="flex flex-col gap-3 rounded-2xl bg-gray-50 px-3 py-3 dark:bg-gray-800/50 sm:flex-row sm:items-center">
                          <button type="button" onClick={() => toggleHalfDay(index)} className={`rounded-full px-3 py-2 text-sm ${halfDay ? "bg-[#12695b] text-white" : "bg-white text-gray-700 dark:bg-gray-900 dark:text-gray-300"}`}>
                            {label}
                          </button>
                          {halfDay ? (
                            <FieldSelect
                              label=""
                              value={halfDay.closingTime}
                              onChange={(value) => setSettings({ ...settings, halfDays: settings.halfDays.map((item) => (item.day === index ? { ...item, closingTime: value } : item)) })}
                              compact
                            />
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <div className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {currentLocale === "fr" ? "Dates bloquees specifiques" : currentLocale === "ar" ? "Specific blocked dates" : "Specific blocked dates"}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {settings.blockedDates.length ? settings.blockedDates.map((item) => (
                      <button
                        key={`${item.date}-${item.reason}`}
                        type="button"
                        onClick={() => setSettings((prev) => ({ ...prev, blockedDates: prev.blockedDates.filter((entry) => entry.date !== item.date) }))}
                        className="rounded-full border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700 dark:border-amber-800/50 dark:bg-amber-900/20 dark:text-amber-300"
                      >
                        {item.date} • {item.reason}
                      </button>
                    )) : (
                      <div className="rounded-2xl bg-gray-50 px-4 py-3 text-sm text-gray-500 dark:bg-gray-800/50 dark:text-gray-400">
                        {currentLocale === "fr" ? "Aucune date bloquee specifique." : currentLocale === "ar" ? "No specific blocked dates yet." : "No specific blocked dates yet."}
                      </div>
                    )}
                  </div>
                </div>
                <button onClick={saveSettings} className="w-full rounded-xl bg-[#12695b] px-4 py-3 font-bold text-white transition-colors hover:bg-[#0f5a4e]">{t.saveClose}</button>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {isBlockModalOpen ? (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.96, opacity: 0 }} className="relative z-[101] w-full max-w-md overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-900">
              <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-900">
                <h3 className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white"><AlertOctagon className="h-5 w-5 text-amber-600" /> {t.newBlock}</h3>
                <button onClick={() => setIsBlockModalOpen(false)} className="text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-white"><X className="h-5 w-5" /></button>
              </div>
              <form onSubmit={handleCreateBlock} className="space-y-5 p-6">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">{t.reason}</label>
                  <select value={blockReason} onChange={(e) => setBlockReason(e.target.value)} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-[#12695b] dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                    <option value="Vacation/Leave">{t.vacationReason}</option>
                    <option value="Unavailable">{t.unavailReason}</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">{t.startDate}</label>
                    <input type="date" min={formatDateKey(new Date())} value={blockStartDate} onChange={(e) => setBlockStartDate(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-[#12695b] dark:border-white/10 dark:bg-[#08111d] dark:text-white" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">{t.endDate}</label>
                    <input type="date" min={blockStartDate} value={blockEndDate} onChange={(e) => setBlockEndDate(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-[#12695b] dark:border-white/10 dark:bg-[#08111d] dark:text-white" />
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setIsBlockModalOpen(false)} className="flex-1 rounded-xl bg-gray-100 px-4 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">{t.cancel}</button>
                  <button type="submit" className="flex-1 rounded-xl bg-amber-600 px-4 py-3 font-bold text-white transition-colors hover:bg-amber-700">{t.blockSchedule}</button>
                </div>
              </form>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-950 dark:text-white">{t.title}</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t.subtitle}</p>
          {errorMsg ? <p className="mt-1 text-sm text-amber-600 dark:text-amber-400">{errorMsg}</p> : null}
          {!errorMsg && infoMessage ? <p className="mt-1 text-sm text-[#12695b] dark:text-emerald-400">{infoMessage}</p> : null}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button onClick={() => openBlockModal("Vacation/Leave")} className="flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-100 dark:border-emerald-800/50 dark:bg-emerald-900/20 dark:text-emerald-400">
            <Palmtree className="h-4 w-4" /> {t.vacation}
          </button>
          <button onClick={() => openBlockModal("Unavailable")} className="flex items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-700 transition-colors hover:bg-amber-100 dark:border-amber-800/50 dark:bg-amber-900/20 dark:text-amber-400">
            <AlertOctagon className="h-4 w-4" /> {t.unavailable}
          </button>
          <div className="mx-1 flex items-center overflow-visible rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <button onClick={() => changeDate(-1)} className="p-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"><ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" /></button>
            <div className="relative">
              <button onClick={() => setIsDatePickerOpen((prev) => !prev)} className="flex items-center gap-1.5 border-x border-gray-200 px-4 py-2 text-sm font-medium text-gray-900 dark:border-gray-800 dark:text-white">
                <CalendarIcon className="h-4 w-4" /> {displayDateStr}
              </button>
              <AnimatePresence>
                {isDatePickerOpen ? (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="absolute start-0 top-full z-30 mt-2 rounded-[20px] border border-slate-200 bg-white p-3 shadow-xl dark:border-white/10 dark:bg-[#0d1726]">
                    <div className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-400">{t.dateJump}</div>
                    <input
                      type="date"
                      value={selectedDateKey}
                      onChange={(e) => {
                        setSelectedDate(new Date(`${e.target.value}T09:00:00`));
                        setIsDatePickerOpen(false);
                      }}
                      className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-[#12695b] dark:border-white/10 dark:bg-[#08111d] dark:text-white"
                    />
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
            <button onClick={() => changeDate(1)} className="p-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"><ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-400" /></button>
            <button onClick={() => { setSelectedDate(new Date()); setRangeView("day"); }} className="border-l border-gray-200 px-4 py-2 text-sm font-bold text-[#12695b] transition-colors hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800">{t.today}</button>
          </div>
          <button onClick={() => setIsSettingsModalOpen(true)} className="rounded-xl border border-emerald-200 bg-[#eff8f5] p-2 text-[#12695b] transition-colors hover:bg-[#dff4ee] dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400">
            <Settings className="h-5 w-5" />
          </button>
          <button onClick={() => { setNewEventTime(firstOpenSlot); setIsApptModalOpen(true); }} disabled={!availableBookingSlots.length || isPastSelectedDate} className="rounded-xl bg-[#12695b] px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#0f5a4e] disabled:cursor-not-allowed disabled:opacity-50">
            {t.newAppt}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {rangeOptions.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => setRangeView(option.id)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              rangeView === option.id
                ? "bg-[#12695b] text-white"
                : "bg-white text-slate-600 hover:bg-[#eff8f5] hover:text-[#12695b] dark:bg-[#0d1726] dark:text-slate-300 dark:hover:bg-[#9fe7d4]/12 dark:hover:text-[#9fe7d4]"
            }`}
          >
            {t[option.labelKey]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="premium-panel rounded-[24px] p-5">
          <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.15em] text-slate-400"><Sparkles className="h-4 w-4 text-[#12695b]" /> {t.overview}</div>
          <div className="mt-3 text-3xl font-black text-slate-950 dark:text-white">{rangeStats.booked}</div>
          <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t.booked}</div>
        </div>
        <div className="premium-panel rounded-[24px] p-5">
          <div className="text-sm font-bold uppercase tracking-[0.15em] text-slate-400">{t.available}</div>
          <div className="mt-3 text-3xl font-black text-slate-950 dark:text-white">{rangeStats.available}</div>
          <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">{currentLocale === "fr" ? "creneaux" : currentLocale === "ar" ? "slots" : "slots"}</div>
        </div>
        <div className="premium-panel rounded-[24px] p-5">
          <div className="text-sm font-bold uppercase tracking-[0.15em] text-slate-400">{t.blocked}</div>
          <div className="mt-3 text-3xl font-black text-slate-950 dark:text-white">{rangeStats.blocked}</div>
          <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {rangeStats.booked + rangeStats.available > 0 ? `${Math.round((rangeStats.booked / (rangeStats.booked + rangeStats.available)) * 100)}% ${t.utilization}` : `0% ${t.utilization}`}
          </div>
        </div>
      </div>

      {rangeView !== "day" ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-3">
          {rangeDays.map((day) => (
            <div key={day.dateKey} className="premium-panel rounded-[24px] p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-base font-bold text-slate-950 dark:text-white">
                    {day.date.toLocaleDateString(currentLocaleTag, { weekday: "short", month: "short", day: "numeric" })}
                  </div>
                  <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">{day.bookedCount} {t.booked}</div>
                </div>
                <button onClick={() => { setSelectedDate(day.date); setRangeView("day"); }} className="rounded-full border border-[#12695b]/12 bg-[#eff8f5] px-3 py-1 text-xs font-bold text-[#12695b] dark:bg-[#9fe7d4]/12 dark:text-[#9fe7d4]">
                  {currentLocale === "fr" ? "Ouvrir" : currentLocale === "ar" ? "Open" : "Open day"}
                </button>
              </div>
              <div className="mt-4 flex gap-2 text-xs">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700 dark:bg-white/5 dark:text-slate-300">
                  {day.slotsCount} {currentLocale === "fr" ? "creneaux" : currentLocale === "ar" ? "slots" : "slots"}
                </span>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300">{Math.max(day.slotsCount - day.bookedCount, 0)} {t.available}</span>
                {day.blocked ? <span className="rounded-full bg-amber-100 px-3 py-1 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300">{t.blocked}</span> : null}
              </div>
              <div className="mt-4 space-y-2">
                {day.preview.length ? day.preview.map((item) => (
                  <div key={item.id} className="rounded-2xl bg-slate-50 px-3 py-3 text-sm dark:bg-white/5">
                    <div className="font-semibold text-slate-900 dark:text-white">{(item as any).patientName}</div>
                    <div className="mt-1 text-slate-500 dark:text-slate-400">{item.time} • {item.type}</div>
                  </div>
                )) : (
                  <div className="rounded-2xl border border-dashed border-slate-200 px-3 py-5 text-sm text-slate-500 dark:border-white/10 dark:text-slate-400">
                    {day.blocked ? t.fullDayBlocked : t.noSlots}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : null}

      <div className="premium-panel calendar-mesh overflow-hidden rounded-[28px]">
        {loading ? <div className="bg-gray-50 py-2 text-center text-sm text-gray-500 dark:bg-gray-800">{t.loading} {displayDateStr} {t.events}</div> : null}

        {appointments.filter((item) => item.time === "All Day").map((item) => (
          <div key={item.id} className="group flex items-center justify-between border-b border-amber-100 bg-amber-50 p-4 text-amber-800 dark:border-amber-900/50 dark:bg-amber-900/20 dark:text-amber-200">
            <div className="flex items-center gap-2 font-bold"><AlertOctagon className="h-5 w-5" /> {t.allDay} {item.name}</div>
            <button onClick={(e) => handleDeleteEvent(item.id, e)} className="rounded-lg p-1.5 text-red-500 transition-all hover:bg-red-50 dark:hover:bg-red-900/40"><Trash2 className="h-4 w-4" /></button>
          </div>
        ))}

        <div className="flex border-b border-gray-100 bg-gray-50 dark:border-gray-800 dark:bg-gray-800/50">
          <div className="w-24 p-4 text-center text-sm font-medium text-gray-500">{t.time}</div>
          <div className="flex-1 p-4 text-sm font-medium text-gray-900 dark:text-white">{t.appointments}</div>
        </div>

        <div className="grid grid-cols-1 gap-3 p-3 xl:grid-cols-2">
          {isFullDayBlocked ? (
            <div className="col-span-full p-12 text-center font-medium text-gray-500 dark:text-gray-400">
              <AlertOctagon className="mx-auto mb-3 h-12 w-12 opacity-20" />
              {t.fullDayBlocked}
            </div>
          ) : !timeSlots.length ? (
            <div className="col-span-full p-12 text-center font-medium text-gray-500 dark:text-gray-400">
              <CalendarIcon className="mx-auto mb-3 h-12 w-12 opacity-20" />
              {t.noSlots}
            </div>
          ) : (
            timeSlots.map((time, index) => {
              const hasAppointment = appointments.find((item) => item.time === time);
              return (
                <motion.div key={`${time}-${selectedDateKey}`} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.03 }} className="group min-h-[96px] rounded-2xl border border-white/60 bg-white/75 backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:shadow-lg dark:border-white/8 dark:bg-[#091321]/70">
                  <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-gray-800">
                    <div className="flex items-center gap-1 text-sm font-semibold text-gray-500"><Clock className="h-3 w-3" /> {time}</div>
                    <div className="text-xs text-gray-400">{addMinutes(time, settings.slotDurationMinutes)}</div>
                  </div>
                  <div className="p-3">
                    {hasAppointment ? (
                      <div className="h-full rounded-xl border border-emerald-100 bg-[linear-gradient(135deg,#eff8f5_0%,#f8fffc_100%)] p-3 transition-all hover:shadow-md dark:border-emerald-900/30 dark:bg-[linear-gradient(135deg,rgba(6,78,59,0.38),rgba(16,185,129,0.12))]">
                        <div className="mb-1 flex items-start justify-between gap-3">
                          <div>
                            <strong className="text-sm text-[#0f3f37] dark:text-emerald-100">{hasAppointment.name}</strong>
                            <div className="mt-1 text-xs text-[#12695b]/80 dark:text-emerald-300/80">
                              {hasAppointment.time} - {addMinutes(hasAppointment.time, settings.slotDurationMinutes)}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="rounded-full border border-[#12695b]/10 bg-white px-2 py-0.5 text-xs font-medium text-[#12695b] shadow-sm dark:border-white/10 dark:bg-gray-950 dark:text-emerald-300">
                              {hasAppointment.type}
                            </span>
                            <button onClick={(e) => handleDeleteEvent(hasAppointment.id, e)} className="rounded-lg p-1.5 text-red-500 transition-all hover:bg-red-50 dark:hover:bg-red-900/40">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <div className="line-clamp-2 text-xs text-slate-600 dark:text-slate-300">{hasAppointment.description || "-"}</div>
                      </div>
                    ) : (
                      <div onClick={() => { setNewEventTime(time); setIsApptModalOpen(true); }} className="flex h-full min-h-[48px] w-full cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-white/60 text-sm font-medium text-gray-400 transition-all hover:border-[#12695b] hover:bg-[#eff8f5] hover:text-[#12695b] dark:border-gray-700 dark:bg-[#07111f]/40 dark:hover:border-emerald-700 dark:hover:bg-emerald-900/10 dark:hover:text-emerald-300">
                        {t.addBooking}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

function FieldSelect({
  label,
  value,
  onChange,
  compact = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  compact?: boolean;
}) {
  const times = ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00"];
  return (
    <div className={compact ? "min-w-[130px]" : ""}>
      {label ? <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label> : null}
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-[#12695b] dark:border-gray-700 dark:bg-gray-800 dark:text-white">
        {times.map((time) => (
          <option key={time} value={time}>{time}</option>
        ))}
      </select>
    </div>
  );
}

function DurationSelect({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  const options = [15, 20, 30, 45, 60];
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      <select value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-[#12695b] dark:border-gray-700 dark:bg-gray-800 dark:text-white">
        {options.map((option) => (
          <option key={option} value={option}>{option} min</option>
        ))}
      </select>
    </div>
  );
}
