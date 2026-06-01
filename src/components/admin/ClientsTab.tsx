/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { Search, Edit2, Trash2, UserPlus, X, Upload, FileSpreadsheet } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import { logAuditActivity } from "@/src/lib/audit";
import PatientProfileView from "@/src/components/admin/PatientProfileView";
import {
  buildSlotsForDay,
  getPatients,
  getScheduleSettings,
  isFutureOrToday,
  isValidPhone,
  normalizePatientStatus,
  savePatients,
  sanitizeName,
  sanitizePhone,
  type AppointmentHistoryItem,
  type PatientRecord,
  type PatientStatus,
} from "@/src/lib/clinic";

const CLIENTS_T: Record<string, any> = {
  en: {
    title: "Patients Directory",
    search: "Search by name or phone...",
    addBtn: "Add Patient",
    syncing: "Loading patients...",
    table: ["Name & ID", "Contact", "Condition", "Next Appt", "Follow-up", "Actions"],
    noPatients: "No patients yet. Add a patient or create an appointment.",
    followUp: "Follow-up planned",
    inactive: "No future booking",
    viewAge: "Age:",
    notes: "Patient Notes",
    noNotes: "No notes recorded for this patient.",
    history: "Appointment History",
    noHistory: "No appointment history yet.",
    editTitle: "Edit Patient",
    newTitle: "New Patient",
    editSub: "Update the patient details and next booking.",
    newSub: "Create a usable patient profile with a valid future appointment if needed.",
    fullName: "Full Name",
    phone: "Phone Number",
    age: "Age",
    nextAppt: "Next Appointment",
    cond: "Condition / Motive",
    cancel: "Cancel",
    save: "Save Changes",
    saveNew: "Save Patient",
    time: "Time",
    totalFee: "Visit Fee (MAD)",
    amountPaid: "Amount Paid (MAD)",
    noteHint: "Internal note",
    visitType: "Visit Type",
    comment: "Appointment comment",
    errorName: "Please enter the patient name.",
    errorNameFormat: "Name must contain letters only.",
    errorAge: "Age must be between 0 and 120.",
    errorPhone: "Phone number must contain exactly 10 digits.",
    errorDate: "Next appointment cannot be in the past.",
    errorMoney: "Amount paid cannot be greater than the visit fee.",
    errorSlot: "هذا الموعد محجوز بالفعل.",
    deleteVisit: "Delete this appointment",
    apiWarning: "Google Calendar is not configured. The patient is saved locally only.",
  },
  fr: {
    title: "Annuaire des Patients",
    search: "Rechercher par nom ou telephone...",
    addBtn: "Ajouter Patient",
    syncing: "Chargement des patients...",
    table: ["Nom & ID", "Contact", "Motif", "Prochain RDV", "Suivi", "Actions"],
    noPatients: "Aucun patient pour le moment. Ajoutez un patient ou creez un rendez-vous.",
    followUp: "RDV programme",
    inactive: "Aucun RDV futur",
    viewAge: "Age :",
    notes: "Notes du Patient",
    noNotes: "Aucune note pour ce patient.",
    history: "Historique des rendez-vous",
    noHistory: "Aucun rendez-vous enregistre.",
    editTitle: "Modifier Patient",
    newTitle: "Nouveau Patient",
    editSub: "Mettez a jour les informations du patient et son prochain rendez-vous.",
    newSub: "Creez une fiche patient logique et directement exploitable.",
    fullName: "Nom Complet",
    phone: "Telephone",
    age: "Age",
    nextAppt: "Prochain RDV",
    cond: "Motif / Pathologie",
    cancel: "Annuler",
    save: "Enregistrer",
    saveNew: "Enregistrer Patient",
    time: "Heure",
    totalFee: "Prix de visite (MAD)",
    amountPaid: "Montant Paye (MAD)",
    noteHint: "Note interne",
    visitType: "Type de visite",
    comment: "Commentaire du RDV",
    errorName: "Veuillez saisir le nom du patient.",
    errorNameFormat: "Le nom ne doit contenir que des lettres.",
    errorAge: "L age doit etre compris entre 0 et 120 ans.",
    errorPhone: "Le numero doit contenir exactement 10 chiffres.",
    errorDate: "Le prochain rendez-vous ne peut pas etre dans le passe.",
    errorMoney: "Le montant paye ne peut pas depasser le prix de visite.",
    errorSlot: "Ce creneau est deja reserve.",
    deleteVisit: "Supprimer ce rendez-vous",
    apiWarning: "Google Calendar n est pas configure. Le patient est enregistre seulement en local.",
  },
  ar: {
    title: "دليل المرضى",
    search: "ابحث بالاسم او الهاتف...",
    addBtn: "إضافة مريض",
    syncing: "جار تحميل المرضى...",
    table: ["الاسم", "التواصل", "السبب", "الموعد القادم", "المتابعة", "الإجراءات"],
    noPatients: "لا يوجد مرضى حاليا.",
    followUp: "موعد قادم",
    inactive: "بدون موعد مستقبلي",
    viewAge: "العمر:",
    notes: "ملاحظات المريض",
    noNotes: "لا توجد ملاحظات.",
    history: "سجل المواعيد",
    noHistory: "لا يوجد سجل مواعيد.",
    editTitle: "تعديل المريض",
    newTitle: "مريض جديد",
    editSub: "حدّث المعلومات والموعد القادم.",
    newSub: "أنشئ ملفا منطقيا وقابلا للاستعمال.",
    fullName: "الاسم الكامل",
    phone: "الهاتف",
    age: "العمر",
    nextAppt: "الموعد القادم",
    cond: "السبب / الحالة",
    cancel: "إلغاء",
    save: "حفظ",
    saveNew: "حفظ المريض",
    time: "الوقت",
    totalFee: "سعر الزيارة",
    amountPaid: "المبلغ المدفوع",
    noteHint: "ملاحظة داخلية",
    visitType: "نوع الزيارة",
    comment: "تعليق الموعد",
    errorName: "يرجى إدخال اسم المريض.",
    errorAge: "العمر يجب أن يكون بين 0 و120.",
    errorPhone: "رقم الهاتف يجب أن يحتوي 10 أرقام.",
    errorDate: "الموعد القادم لا يمكن أن يكون في الماضي.",
    errorMoney: "المبلغ المدفوع لا يمكن أن يتجاوز سعر الزيارة.",
    errorSlot: "هذا الموعد محجوز بالفعل.",
    deleteVisit: "حذف هذا الموعد",
    apiWarning: "Google Calendar غير مضبوط. تم الحفظ محليا فقط.",
  },
};

type FormState = {
  name: string;
  age: string;
  malade: string;
  date: string;
  time: string;
  phone: string;
  notes: string;
  totalFee: string;
  amountPaid: string;
  visitType: string;
  comment: string;
};

const initialForm: FormState = {
  name: "",
  age: "",
  malade: "",
  date: "",
  time: "",
  phone: "",
  notes: "",
  totalFee: "",
  amountPaid: "",
  visitType: "Consultation",
  comment: "",
};

function toStatusLabel(status: PatientStatus, t: any) {
  return status === "follow-up" ? t.followUp : t.inactive;
}

function uniqueHistory(items: AppointmentHistoryItem[]) {
  const map = new Map<string, AppointmentHistoryItem>();
  items.forEach((item) => {
    map.set(item.id || `${item.date}-${item.time}-${item.type}`, item);
  });
  return Array.from(map.values()).sort((a, b) => `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`));
}

function getOccupiedTimesForClients(clients: PatientRecord[], date: string, excludedPatientId?: number) {
  return new Set(
    clients
      .filter((client) => client.id !== excludedPatientId)
      .flatMap((client) => client.history || [])
      .filter((item) => item.date === date && item.time !== "All Day")
      .map((item) => item.time)
  );
}

export default function ClientsTab() {
  const pathname = usePathname();
  const currentLocale = pathname?.split("/")[1] || "en";
  const t = CLIENTS_T[currentLocale] || CLIENTS_T.en;
  const [clients, setClients] = useState<PatientRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [viewingClient, setViewingClient] = useState<PatientRecord | null>(null);
  const [formData, setFormData] = useState<FormState>(initialForm);
  const [formError, setFormError] = useState("");

  const loadClients = useCallback(async () => {
    setLoading(true);
    setNotice("");

    const localPatients = getPatients();

    try {
      const res = await fetch("/api/calendar?range=all");
      const data = await res.json();
      if (!res.ok || !data?.events) {
        throw new Error(data?.error || "Calendar unavailable");
      }

      const grouped = new Map<string, PatientRecord>();
      data.events
        .filter((event: any) => event.type !== "Block")
        .forEach((event: any, index: number) => {
          const key = event.name.trim().toLowerCase();
          const existing = grouped.get(key);
          const historyItem: AppointmentHistoryItem = {
            id: event.id || `${event.date}-${event.time}-${index}`,
            date: event.date,
            time: event.time,
            type: event.type || "Consultation",
            comment: event.description || "",
            source: "calendar",
          };

          if (!existing) {
            grouped.set(key, {
              id: Date.now() + index,
              name: event.name.trim(),
              age: 0,
              malade: event.type || "",
              phone: "",
              status: normalizePatientStatus(event.date),
              date: event.date || "",
              notes: "",
              totalFee: 0,
              amountPaid: 0,
              history: [historyItem],
            });
            return;
          }

          existing.history = uniqueHistory([...existing.history, historyItem]);
          const nextFuture = existing.history.find((item) => isFutureOrToday(item.date));
          existing.date = nextFuture?.date || existing.date;
          existing.malade = existing.malade || event.type || "";
          existing.status = normalizePatientStatus(existing.date);
        });

      const merged = Array.from(grouped.values()).map((fromCalendar) => {
        const local = localPatients.find((item) => item.name.toLowerCase() === fromCalendar.name.toLowerCase());
        if (!local) {
          return { ...fromCalendar, history: uniqueHistory(fromCalendar.history) };
        }

        const mergedHistory = uniqueHistory([...(local.history || []), ...fromCalendar.history]);
        const nextFuture = mergedHistory.find((item) => isFutureOrToday(item.date));
        return {
          ...local,
          malade: local.malade || fromCalendar.malade,
          date: nextFuture?.date || "",
          history: mergedHistory,
          status: normalizePatientStatus(nextFuture?.date),
        };
      });

      const localOnly = localPatients.filter(
        (item) => !merged.find((mergedItem) => mergedItem.name.toLowerCase() === item.name.toLowerCase())
      );

      const nextList = [...merged, ...localOnly]
        .map((client) => {
          const nextFuture = uniqueHistory(client.history || []).find((item) => isFutureOrToday(item.date));
          return {
            ...client,
            phone: sanitizePhone(client.phone || ""),
            history: uniqueHistory(client.history || []),
            date: nextFuture?.date || "",
            status: normalizePatientStatus(nextFuture?.date),
          };
        })
        .sort((a, b) => a.name.localeCompare(b.name));

      setClients(nextList);
      savePatients(nextList);
    } catch {
      setClients(localPatients);
      setNotice(t.apiWarning);
    } finally {
      setLoading(false);
    }
  }, [t.apiWarning]);

  useEffect(() => {
    loadClients();
  }, [loadClients]);

  useEffect(() => {
    const handleOpenClient = () => openAddModal();
    window.addEventListener("openClientModal", handleOpenClient);
    return () => window.removeEventListener("openClientModal", handleOpenClient);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsModalOpen(false);
        setIsImportModalOpen(false);
        setViewingClient(null);
      }
    };

    if (isModalOpen || isImportModalOpen || viewingClient) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isImportModalOpen, isModalOpen, viewingClient]);

  const filteredClients = useMemo(
    () =>
      clients.filter((client) => {
        const term = searchTerm.toLowerCase();
        return client.name.toLowerCase().includes(term) || client.phone.includes(searchTerm);
      }),
    [clients, searchTerm]
  );

  const openAddModal = () => {
    setEditingId(null);
    setFormData(initialForm);
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (client: PatientRecord, event: React.MouseEvent) => {
    event.stopPropagation();
    const nextVisit = (client.history || []).find((item) => isFutureOrToday(item.date));
    setEditingId(client.id);
    setFormData({
      name: client.name,
      age: client.age ? String(client.age) : "",
      malade: client.malade || "",
      date: nextVisit?.date || "",
      time: nextVisit?.time && nextVisit.time !== "All Day" ? nextVisit.time : "",
      phone: sanitizePhone(client.phone || ""),
      notes: client.notes || "",
      totalFee: client.totalFee ? String(client.totalFee) : "",
      amountPaid: client.amountPaid ? String(client.amountPaid) : "",
      visitType: nextVisit?.type || "Consultation",
      comment: nextVisit?.comment || "",
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const validateForm = () => {
    const schema = z.object({
      name: z.string().trim().min(1, t.errorName).regex(/^[A-Za-zÀ-ÿ\u0600-\u06FF\s'-]+$/, t.errorNameFormat || t.errorName),
      age: z.coerce.number().int().min(0, t.errorAge).max(120, t.errorAge),
      phone: z.string().optional().refine((value) => !value || isValidPhone(value), t.errorPhone),
      date: z.string().optional().refine((value) => !value || isFutureOrToday(value), t.errorDate),
    });

    const parsed = schema.safeParse({
      name: formData.name,
      age: formData.age || 0,
      phone: formData.phone,
      date: formData.date,
    });

    if (!parsed.success) {
      return parsed.error.issues[0]?.message || t.errorName;
    }

    if ((Number(formData.amountPaid) || 0) > (Number(formData.totalFee) || 0)) return t.errorMoney;
    if (formData.date && formData.time && getOccupiedTimesForClients(clients, formData.date, editingId ?? undefined).has(formData.time)) return t.errorSlot;
    return "";
  };

  const persistClient = async (payload: PatientRecord, nextVisit?: AppointmentHistoryItem) => {
    const updatedList =
      editingId === null ? [payload, ...clients.filter((item) => item.id !== payload.id)] : clients.map((item) => (item.id === editingId ? payload : item));
    setClients(updatedList);
    savePatients(updatedList);

    if (!nextVisit) {
      setNotice("");
      return;
    }

    try {
      const response = await fetch("/api/calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: payload.name,
          type: nextVisit.type,
          date: nextVisit.date,
          time: nextVisit.time,
          durationMinutes: getScheduleSettings().slotDurationMinutes,
          description: `Patient: ${payload.name}\nCondition: ${payload.malade || "N/A"}\nComment: ${nextVisit.comment || "-"}\nSource: Patients Tab`,
        }),
      });

      const data = await response.json();
      if (!response.ok || data?.error) {
        setNotice(t.apiWarning);
        return;
      }

      const syncedHistory = payload.history.map((item) => (item.id === nextVisit.id ? { ...item, id: data.event?.id || item.id } : item));
      const syncedPatient = { ...payload, history: syncedHistory };
      const syncedList = updatedList.map((item) => (item.id === syncedPatient.id ? syncedPatient : item));
      setClients(syncedList);
      savePatients(syncedList);
      setNotice("");
    } catch {
      setNotice(t.apiWarning);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      setFormError(error);
      return;
    }

    const baseHistory = editingId !== null ? clients.find((item) => item.id === editingId)?.history || [] : [];
    const nextVisit =
      formData.date && formData.time
        ? {
            id: `${Date.now()}`,
            date: formData.date,
            time: formData.time,
            type: formData.visitType,
            comment: formData.comment.trim().slice(0, 120),
            source: "manual" as const,
          }
        : undefined;

    const history = nextVisit ? uniqueHistory([nextVisit, ...baseHistory.filter((item) => !(item.date === nextVisit.date && item.time === nextVisit.time))]) : uniqueHistory(baseHistory);
    const futureVisit = history.find((item) => isFutureOrToday(item.date));
    const patient: PatientRecord = {
      id: editingId ?? Date.now(),
      name: sanitizeName(formData.name.trim()),
      age: Number(formData.age || 0),
      malade: formData.malade.trim(),
      phone: sanitizePhone(formData.phone),
      notes: formData.notes.trim(),
      totalFee: Number(formData.totalFee || 0),
      amountPaid: Number(formData.amountPaid || 0),
      history,
      date: futureVisit?.date || "",
      status: normalizePatientStatus(futureVisit?.date),
    };

    await persistClient(patient, nextVisit);
    logAuditActivity(editingId ? "updatePatient" : "regPatient", patient.name, "client");
    setIsModalOpen(false);
    setViewingClient(patient);
  };

  const handleDelete = (id: number, event: React.MouseEvent) => {
    event.stopPropagation();
    const patient = clients.find((item) => item.id === id);
    if (patient) logAuditActivity("deletePatient", patient.name, "client");
    const next = clients.filter((item) => item.id !== id);
    setClients(next);
    savePatients(next);
    if (viewingClient?.id === id) setViewingClient(null);
  };

  const availableTimes = useMemo(() => {
    if (!formData.date) return [];
    const scheduleSlots = buildSlotsForDay(formData.date, getScheduleSettings());
    const occupied = getOccupiedTimesForClients(clients, formData.date, editingId ?? undefined);
    return scheduleSlots.filter((slot) => !occupied.has(slot));
  }, [clients, editingId, formData.date]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-950 dark:text-white">{t.title}</h2>
          {notice ? <p className="mt-1 text-sm text-amber-600 dark:text-amber-400">{notice}</p> : null}
        </div>

        <div className="flex w-full items-center gap-3 sm:w-auto">
          <div className="relative w-full sm:w-80">
            <Search className={`absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400`} />
            <input
              type="text"
              placeholder={t.search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full rounded-xl border border-slate-200 py-2 outline-none focus:ring-2 focus:ring-[#12695b] dark:border-white/10 dark:bg-[#0d1726] dark:text-white ps-9 pe-4`}
            />
          </div>
          <button onClick={() => setIsImportModalOpen(true)} className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50 dark:border-white/10 dark:bg-white/[0.02] dark:text-slate-300 dark:hover:bg-white/5 sm:flex">
            <FileSpreadsheet className="h-4 w-4" />
            Import
          </button>
          <button onClick={openAddModal} className="flex items-center gap-2 rounded-xl bg-[#12695b] px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#0f5a4e]">
            <UserPlus className="h-4 w-4" />
            {t.addBtn}
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_40px_-32px_rgba(15,23,42,0.16)] dark:border-white/10 dark:bg-[#0d1726]">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-gray-500">{t.syncing}</div>
          ) : (
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-sm text-gray-600 dark:border-gray-800 dark:bg-gray-800/50 dark:text-gray-300">
                  {t.table.map((item: string) => (
                    <th key={item} className="px-6 py-4 font-semibold">
                      {item}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredClients.map((client, index) => (
                    <motion.tr
                      key={client.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: index * 0.03 }}
                      onClick={() => setViewingClient(client)}
                      className="cursor-pointer border-b border-gray-50 transition-colors hover:bg-[#eff8f5] dark:border-gray-800/70 dark:hover:bg-gray-800/60"
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900 dark:text-white">{client.name}</div>
                        <div className="text-xs font-mono text-gray-500">ID: {client.id}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{client.phone || "-"}</td>
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{client.malade || "-"}</td>
                      <td className="px-6 py-4 text-sm text-[#12695b] dark:text-emerald-400">{client.date || "-"}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${client.status === "follow-up" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"}`}>
                          {toStatusLabel(client.status, t)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={(e) => openEditModal(client, e)} className="me-2 rounded-lg p-2 text-gray-400 transition-colors hover:bg-[#eff8f5] hover:text-[#12695b] dark:hover:bg-emerald-900/30">
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button onClick={(e) => handleDelete(client.id, e)} className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
                {filteredClients.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      {t.noPatients}
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <AnimatePresence>
        {viewingClient ? (
          <div className="fixed inset-0 z-[60] overflow-y-auto bg-black/50 p-4 backdrop-blur-sm">
            <div className="mx-auto flex min-h-full max-w-6xl items-center">
              <PatientProfileView client={viewingClient} onClose={() => setViewingClient(null)} />
            </div>
          </div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {isImportModalOpen ? (
          <div className="fixed inset-0 z-[65] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} className="w-full max-w-md overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#0d1726]">
              <div className="flex items-start justify-between border-b border-slate-100 p-6 dark:border-slate-800">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{currentLocale === 'fr' ? 'Importer des patients' : currentLocale === 'ar' ? 'استيراد المرضى' : 'Import patients'}</h3>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{currentLocale === 'fr' ? 'Importez depuis un fichier Excel ou CSV.' : currentLocale === 'ar' ? 'استورد من ملف Excel أو CSV.' : 'Upload an Excel or CSV file.'}</p>
                </div>
                <button onClick={() => setIsImportModalOpen(false)} className="rounded-full bg-slate-50 p-2 text-slate-500 transition-colors hover:text-slate-900 dark:bg-slate-800/50 dark:hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-6">
                <div className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-emerald-500/30 bg-emerald-50/50 py-10 transition-all hover:bg-emerald-50 dark:border-emerald-500/20 dark:bg-emerald-500/5 dark:hover:bg-emerald-500/10">
                  <div className="mb-4 rounded-full bg-emerald-100 p-4 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                    <Upload className="h-8 w-8" />
                  </div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{currentLocale === 'fr' ? 'Cliquez pour importer ou glissez le fichier ici' : currentLocale === 'ar' ? 'انقر للاستيراد أو اسحب الملف هنا' : 'Click to import or drop a file here'}</p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">CSV, XLSX, XLS</p>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button onClick={() => setIsImportModalOpen(false)} className="rounded-xl px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5">
                    {currentLocale === 'fr' ? 'Annuler' : currentLocale === 'ar' ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button onClick={() => { setIsImportModalOpen(false); alert(currentLocale === 'fr' ? 'Traitement en cours...' : currentLocale === 'ar' ? 'جارٍ المعالجة...' : 'Processing file...'); }} className="rounded-xl bg-[#12695b] px-4 py-2 text-sm font-bold text-white shadow-md shadow-emerald-900/20 transition-colors hover:bg-[#0f5a4e]">
                    {currentLocale === 'fr' ? 'Traiter le fichier' : currentLocale === 'ar' ? 'معالجة الملف' : 'Process file'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {isModalOpen ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} className="relative max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-[30px] border border-slate-200 bg-white p-6 shadow-xl dark:border-white/10 dark:bg-[#0d1726] sm:p-8">
              <button onClick={() => setIsModalOpen(false)} className="absolute end-4 top-4 rounded-full bg-gray-50 p-2 text-gray-400 transition-colors hover:text-gray-700 dark:bg-gray-800 dark:hover:text-gray-200">
                <X className="h-5 w-5" />
              </button>

              <h3 className="mb-1 text-2xl font-bold text-gray-900 dark:text-white">{editingId ? t.editTitle : t.newTitle}</h3>
              <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">{editingId ? t.editSub : t.newSub}</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300">{t.fullName}</label>
                  <input value={formData.name} inputMode="text" onChange={(e) => setFormData({ ...formData, name: sanitizeName(e.target.value) })} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#12695b] dark:border-white/10 dark:bg-[#08111d] dark:text-white" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300">{t.phone}</label>
                    <input value={formData.phone} inputMode="numeric" pattern="[0-9]{10}" onChange={(e) => setFormData({ ...formData, phone: sanitizePhone(e.target.value) })} maxLength={10} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#12695b] dark:border-white/10 dark:bg-[#08111d] dark:text-white" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300">{t.age}</label>
                    <input type="number" min={0} max={120} value={formData.age} onChange={(e) => setFormData({ ...formData, age: e.target.value })} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#12695b] dark:border-white/10 dark:bg-[#08111d] dark:text-white" />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300">{t.cond}</label>
                  <input value={formData.malade} onChange={(e) => setFormData({ ...formData, malade: e.target.value })} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#12695b] dark:border-white/10 dark:bg-[#08111d] dark:text-white" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300">{t.nextAppt}</label>
                    <input type="date" min={new Date().toISOString().split("T")[0]} value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value, time: "" })} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#12695b] dark:border-white/10 dark:bg-[#08111d] dark:text-white" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300">{t.time}</label>
                    <select value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} disabled={!formData.date} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#12695b] disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-[#08111d] dark:text-white">
                      <option value="">--:--</option>
                      {availableTimes.map((slot) => (
                        <option key={slot} value={slot}>{slot}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300">{t.visitType}</label>
                    <select value={formData.visitType} onChange={(e) => setFormData({ ...formData, visitType: e.target.value })} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#12695b] dark:border-white/10 dark:bg-[#08111d] dark:text-white">
                      <option value="Consultation">Consultation</option>
                      <option value="Controle">Controle</option>
                      <option value="Urgence">Urgence</option>
                      <option value="Resultats">Resultats</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300">{t.comment}</label>
                    <input value={formData.comment} maxLength={120} onChange={(e) => setFormData({ ...formData, comment: e.target.value })} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#12695b] dark:border-white/10 dark:bg-[#08111d] dark:text-white" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300">{t.totalFee}</label>
                    <input type="number" min={0} value={formData.totalFee} onChange={(e) => setFormData({ ...formData, totalFee: e.target.value })} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#12695b] dark:border-white/10 dark:bg-[#08111d] dark:text-white" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300">{t.amountPaid}</label>
                    <input type="number" min={0} value={formData.amountPaid} onChange={(e) => setFormData({ ...formData, amountPaid: e.target.value })} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#12695b] dark:border-white/10 dark:bg-[#08111d] dark:text-white" />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300">{t.noteHint}</label>
                  <textarea rows={3} value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="w-full resize-none rounded-xl border border-slate-200 bg-yellow-50/30 px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#12695b] dark:border-white/10 dark:bg-yellow-900/10 dark:text-white" />
                </div>

                {formError ? <p className="text-sm font-semibold text-[#c95f3b] dark:text-[#ffb39b]">{formError}</p> : null}

                <div className="mt-6 flex justify-end gap-3 border-t border-gray-100 pt-4 dark:border-gray-800">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-xl px-5 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">
                    {t.cancel}
                  </button>
                  <button type="submit" className="rounded-xl bg-[#12695b] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-900/20 transition-colors hover:bg-[#0f5a4e]">
                    {editingId ? t.save : t.saveNew}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
