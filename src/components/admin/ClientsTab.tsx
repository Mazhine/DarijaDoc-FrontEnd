/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Search, Edit2, Trash2, Calendar, UserPlus, X, Activity, Eye, FileText, Phone, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { logAuditActivity } from "@/src/lib/audit";

const CLIENTS_T: Record<string, any> = {
    en: {
        title: "Patients Directory",
        search: "Search by name or phone...",
        addBtn: "Add Patient",
        syncing: "Syncing patient profiles from Google Calendar...",
        table: ["Name & ID", "Contact", "Condition", "Next Appt", "Status", "Actions"],
        noPatients: "No patients synced yet. Add one or create a Calendar event.",
        active: "Active",
        inactive: "Inactive",
        viewAge: "Age:",
        notes: "Patient Notes",
        noNotes: "No notes recorded for this patient.",
        history: "Google Calendar Appointment History",
        noHistory: "No previous appointment history found.",
        editTitle: "Edit Patient",
        newTitle: "New Patient",
        editSub: "Update the patient's existing details.",
        newSub: "Enter the patient details to create a new profile.",
        fullName: "Full Name",
        phone: "Phone Number",
        age: "Age",
        status: "Status",
        nextAppt: "Next Appointment",
        cond: "Condition / Malade",
        cancel: "Cancel",
        save: "Save Changes",
        saveNew: "Save Patient",
        time: "Time",
        totalFee: "Total Offer (MAD)",
        amountPaid: "Amount Paid (MAD)"
    },
    fr: {
        title: "Annuaire des Patients",
        search: "Rechercher par nom ou téléphone...",
        addBtn: "Ajouter Patient",
        syncing: "Synchronisation des profils via Google Agenda...",
        table: ["Nom & ID", "Contact", "Condition", "Prochain RDV", "Statut", "Actions"],
        noPatients: "Aucun patient. Ajoutez-en un ou créez un événement.",
        active: "Actif",
        inactive: "Inactif",
        viewAge: "Âge :",
        notes: "Notes du Patient",
        noNotes: "Aucune note pour ce patient.",
        history: "Historique des Rendez-vous",
        noHistory: "Aucun historique trouvé.",
        editTitle: "Modifier Patient",
        newTitle: "Nouveau Patient",
        editSub: "Mettez à jour les détails du patient.",
        newSub: "Saisissez les détails pour créer un nouveau profil.",
        fullName: "Nom Complet",
        phone: "Téléphone",
        age: "Âge",
        status: "Statut",
        nextAppt: "Prochain RDV",
        cond: "Condition / Maladie",
        cancel: "Annuler",
        save: "Enregistrer",
        saveNew: "Enregistrer Patient",
        time: "Heure",
        totalFee: "Montant Total (MAD)",
        amountPaid: "Montant Payé (MAD)"
    },
    ar: {
        title: "??? ??????",
        search: "???? ?????? ?? ??????...",
        addBtn: "????? ????",
        syncing: "???? ???????? ?? ????? ????...",
        table: ["????? ???????", "???????", "??????", "?????? ??????", "???????", "???????"],
        noPatients: "?? ???? ???? ???. ??? ?????? ?? ???? ??????.",
        active: "???",
        inactive: "??? ???",
        viewAge: "?????:",
        notes: "??????? ??????",
        noNotes: "?? ???? ??????? ????? ???? ??????.",
        history: "??? ?????? ????? ????",
        noHistory: "?? ???? ??? ?????? ????.",
        editTitle: "????? ??????",
        newTitle: "???? ????",
        editSub: "????? ???????? ??????? ??????.",
        newSub: "???? ?????? ?????? ?????? ??? ????.",
        fullName: "????? ??????",
        phone: "??? ??????",
        age: "?????",
        status: "???????",
        nextAppt: "?????? ??????",
        cond: "?????? ??????",
        cancel: "?????",
        save: "??? ?????????",
        saveNew: "??? ??????",
        time: "?????",
        totalFee: "?????? ???????? (????)",
        amountPaid: "?????? ??????? (????)"
    }
};

export default function ClientsTab() {
  const pathname = usePathname();
  const currentLocale = pathname?.split('/')[1] || 'en';
  const t = CLIENTS_T[currentLocale] || CLIENTS_T['en'];
  const [clients, setClients] = useState<any[]>([]);
  const [allEvents, setAllEvents] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [viewingClient, setViewingClient] = useState<any | null>(null);

  // Form State
  const [formData, setFormData] = useState({ name: "", age: "", malade: "", date: "", time: "", phone: "", status: "Active", notes: "", totalFee: "", amountPaid: "" });

  const getAvailableTimeSlots = (dateStr: string) => {
      if (!dateStr) return [];
      const defaultTimeSlots = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];
      const eventsOnDate = allEvents.filter(e => e.date === dateStr);
      return defaultTimeSlots.filter(time => !eventsOnDate.some(e => e.time === time));
  };

  useEffect(() => {
    const fetchClients = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/calendar?range=all");
            const data = await res.json();
            
            if (data && data.events) {
                const fetchedEvents = data.events.filter((e: any) => e.type !== "Block");
                setAllEvents(data.events); // store raw events including blocks for accurate time filtering
                const clientsMap = new Map();
                
                // Sort descending to ensure history and recent dates are correct
                fetchedEvents.sort((a: any, b: any) => new Date(b.created || 0).getTime() - new Date(a.created || 0).getTime());

                fetchedEvents.forEach((e: any, index: number) => {
                    const cName = e.name.trim();
                    if (!clientsMap.has(cName)) {
                        clientsMap.set(cName, {
                            id: index + 1000, 
                            name: cName,
                            age: 0,
                            malade: e.type, 
                            phone: "-", 
                            status: "Active",
                            date: e.date || "Unknown",
                            notes: e.description ? "From Calendar: " + e.description : "",
                            history: []
                        });
                    }
                    
                    clientsMap.get(cName).history.push({
                        date: e.date || "Unknown",
                        desc: e.type
                    });
                });

                let derivedClients = Array.from(clientsMap.values());
                
                // Merge with localStorage to preserve offline edits like Phone/Age
                try {
                    const saved = localStorage.getItem('clinicPatients');
                    if (saved) {
                        const localClients = JSON.parse(saved);
                        derivedClients = derivedClients.map(dc => {
                            const localFound = localClients.find((lc: any) => lc.name.toLowerCase() === dc.name.toLowerCase());
                            if (localFound) {
                                return {
                                    ...dc,
                                    id: localFound.id,
                                    age: localFound.age,
                                    phone: localFound.phone,
                                    status: localFound.status,
                                    notes: localFound.notes || dc.notes,
                                };
                            }
                            return dc;
                        });
                        
                        // Add clients unique to local storage
                        localClients.forEach((lc: any) => {
                            if (!derivedClients.find(dc => dc.name.toLowerCase() === lc.name.toLowerCase())) {
                                derivedClients.push(lc);
                            }
                        });
                    }
                } catch(e) {}
                
                setClients(derivedClients);
                // Synchronize global patient count for Dashboard
                localStorage.setItem('clinicPatients', JSON.stringify(derivedClients));
            }
        } catch (err) { 
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    fetchClients();
  }, []);

  useEffect(() => {
    const handleOpenClient = () => {
        setEditingId(null);
        setFormData({ name: "", age: "", malade: "", date: "", time: "", phone: "", status: "Active", notes: "", totalFee: "", amountPaid: "" });
        setIsModalOpen(true);
    };
    window.addEventListener('openClientModal', handleOpenClient);
    return () => window.removeEventListener('openClientModal', handleOpenClient);
  }, []);

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm)
  );

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ name: "", age: "", malade: "", date: "", time: "", phone: "", status: "Active", notes: "", totalFee: "", amountPaid: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (client: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(client.id);
    setFormData({
      name: client.name,
      age: client.age.toString(),
      malade: client.malade,
      date: client.date === "None" ? "" : client.date,
      time: "", // reset time on edit by default
      phone: client.phone,
      status: client.status,
      notes: client.notes || "",
      totalFee: client.totalFee ? client.totalFee.toString() : "",
      amountPaid: client.amountPaid ? client.amountPaid.toString() : ""
    });
    setIsModalOpen(true);
  };

  const openViewModal = (client: any) => {
    setViewingClient(client);
  };

  const handletoggleStatus = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = clients.map(c => c.id === id ? { ...c, status: c.status === "Active" ? "Inactive" : "Active" } : c);
    setClients(updated);
    localStorage.setItem('clinicPatients', JSON.stringify(updated));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    let updatedList;
    if (editingId) {
      updatedList = clients.map(c => c.id === editingId ? {
        ...c,
        name: formData.name,
        age: parseInt(formData.age) || 0,
        malade: formData.malade || "N/A",
        date: formData.date || "None",
        phone: formData.phone || "-",
        status: formData.status,
        notes: formData.notes,
        totalFee: parseFloat(formData.totalFee) || 0,
        amountPaid: parseFloat(formData.amountPaid) || 0
      } : c);
      logAuditActivity("updatePatient", formData.name, "client");
    } else {
      const addedClient = {
        id: Date.now(),
        name: formData.name,
        age: parseInt(formData.age) || 0,
        malade: formData.malade || "N/A",
        phone: formData.phone || "-",
        status: formData.status,
        date: formData.date || "None",
        notes: formData.notes,
        totalFee: parseFloat(formData.totalFee) || 0,
        amountPaid: parseFloat(formData.amountPaid) || 0,
        history: []
      };
      updatedList = [addedClient, ...clients];
      logAuditActivity("regPatient", formData.name, "client");
    }

    setClients(updatedList);
    localStorage.setItem('clinicPatients', JSON.stringify(updatedList));
    setIsModalOpen(false);

    // Push to Calendar API if a date and time were selected
    if (formData.date && formData.date !== "None" && formData.time) {
        try {
            fetch("/api/calendar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    summary: formData.name,
                    description: `Type: Consultation (from Patients Tab)\nCondition: ${formData.malade || "N/A"}\nNotes: ${formData.notes}`,
                    startDateTime: `${formData.date}T${formData.time}:00`,
                    endDateTime: `${formData.date}T${String(parseInt(formData.time.split(':')[0]) + 1).padStart(2, '0')}:00:00`
                })
            });
            // Update local events to immediately block the time slot for next addition
            setAllEvents([...allEvents, { date: formData.date, time: formData.time, type: "Consultation" }]);
        } catch(e) {}
    }
  };

  const handleDelete = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const clientToDel = clients.find(c => c.id === id);
    if (clientToDel) logAuditActivity("deletePatient", clientToDel.name, "client");
    const filtered = clients.filter(c => c.id !== id);
    setClients(filtered);
    localStorage.setItem('clinicPatients', JSON.stringify(filtered));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t.title}</h2>

        <div className="flex w-full sm:w-auto items-center gap-3">
          <div className="relative w-full sm:w-80">
            <Search className={`absolute ${currentLocale === 'ar' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400`} />
            <input
              type="text"
              placeholder={t.search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full ${currentLocale === 'ar' ? 'pr-9 pl-4' : 'pl-9 pr-4'} py-2 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-white outline-none`}
            />
          </div>
          <button
            onClick={openAddModal}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white p-2 sm:px-4 sm:py-2 rounded-xl transition-colors font-medium text-sm shadow-sm cursor-pointer whitespace-nowrap"
          >
            <UserPlus className="w-5 h-5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">{t.addBtn}</span>
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          {loading ? (
             <div className="p-8 text-center text-gray-500">{t.syncing}</div>
          ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                <th className={`px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300 ${currentLocale === 'ar' ? 'text-right' : 'text-left'}`}>{t.table[0]}</th>
                <th className={`px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300 ${currentLocale === 'ar' ? 'text-right' : 'text-left'}`}>{t.table[1]}</th>
                <th className={`px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300 ${currentLocale === 'ar' ? 'text-right' : 'text-left'}`}>{t.table[2]}</th>
                <th className={`px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300 ${currentLocale === 'ar' ? 'text-right' : 'text-left'}`}>{t.table[3]}</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300 text-center">{t.table[4]}</th>
                <th className={`px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300 ${currentLocale === 'ar' ? 'text-left' : 'text-right'}`}>{t.table[5]}</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredClients.map((client, idx) => (
                  <motion.tr
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ delay: idx * 0.05 }}
                    key={client.id}
                    onClick={() => openViewModal(client)}
                    className="border-b border-gray-50 dark:border-gray-800 last:border-none hover:bg-blue-50 dark:hover:bg-gray-800/60 transition-colors group cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 dark:text-white flex flex-col">
                        <span>{client.name}</span>
                        <span className="text-xs text-gray-500 font-mono">ID: {client.id}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-400 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-gray-400" />
                        {client.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-400">{client.malade}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm font-medium text-blue-600 dark:text-blue-400">
                        <Calendar className="w-4 h-4 mr-2" />
                        {client.date}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={(e) => handletoggleStatus(client.id, e)}
                        title="Click to toggle status"
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-colors ${client.status === "Active"
                          ? "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                          }`}
                      >
                        {client.status === "Active" ? t.active : t.inactive}
                      </button>
                    </td>
                    <td className={`px-6 py-4 ${currentLocale === 'ar' ? 'text-left' : 'text-right'}`}>
                      <button
                        onClick={(e) => openEditModal(client, e)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 mr-2 cursor-pointer"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => handleDelete(client.id, e)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
              {filteredClients.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    {t.noPatients}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          )}
        </div>
      </div>

      {/* View Patient Modal */}
      <AnimatePresence>
        {viewingClient && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-800 relative flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-start bg-blue-50 dark:bg-blue-900/20">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                    {viewingClient.name}
                    <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${viewingClient.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-700"}`}>
                      {viewingClient.status === "Active" ? t.active : t.inactive}
                    </span>
                  </h3>
                  <div className="text-sm text-gray-500 mt-2 flex items-center gap-4">
                    <span className="flex items-center gap-1.5"><Phone className="w-4 h-4" /> {viewingClient.phone}</span>
                    <span className="flex items-center gap-1.5"><Activity className="w-4 h-4" /> {t.viewAge} {viewingClient.age}</span>
                    <span className="font-mono text-xs bg-white dark:bg-gray-800 px-2 py-1 rounded border border-gray-200 dark:border-gray-700">ID: {viewingClient.id}</span>
                  </div>
                  {(viewingClient.totalFee || viewingClient.amountPaid) ? (
                  <div className="text-sm font-medium mt-3 flex items-center gap-3">
                      <span className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-md">
                          {t.totalFee}: <span className="font-bold">{viewingClient.totalFee || 0} MAD</span>
                      </span>
                      <span className="px-2.5 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-md">
                          {t.amountPaid}: <span className="font-bold">{viewingClient.amountPaid || 0} MAD</span>
                      </span>
                  </div>
                  ) : null}
                </div>
                <button
                  onClick={() => setViewingClient(null)}
                  className="p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-700 rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-6">
                <div>
                  <h4 className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-gray-200 uppercase tracking-wider mb-3">
                    <FileText className="w-4 h-4 text-blue-500" /> {t.notes}
                  </h4>
                  <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/30 p-4 rounded-xl text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    {viewingClient.notes ? viewingClient.notes : <span className="text-gray-400 italic">{t.noNotes}</span>}
                  </div>
                </div>

                <div>
                  <h4 className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-gray-200 uppercase tracking-wider mb-3">
                    <Clock className="w-4 h-4 text-blue-500" /> {t.history}
                  </h4>
                  <div className="border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden">
                    {viewingClient.history && viewingClient.history.length > 0 ? (
                      <div className="divide-y divide-gray-100 dark:divide-gray-800">
                        {viewingClient.history.map((h: any, i: number) => (
                          <div key={i} className="p-4 bg-gray-50 dark:bg-gray-800/30 flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                            <span className="font-medium text-sm text-gray-900 dark:text-white">{h.desc}</span>
                            <span className="text-xs font-mono bg-white dark:bg-gray-900 px-2 py-1 border border-gray-200 dark:border-gray-700 rounded-md text-gray-500 flex items-center gap-1.5"><Calendar className="w-3 h-3" />{h.date}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 text-center text-sm text-gray-500">{t.noHistory}</div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Reusable Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-lg p-6 sm:p-8 shadow-xl border border-gray-100 dark:border-gray-800 relative max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 bg-gray-50 dark:bg-gray-800 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-2xl font-bold mb-1 text-gray-900 dark:text-white">
                {editingId ? t.editTitle : t.newTitle}
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                {editingId ? t.editSub : t.newSub}
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">{t.fullName} <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Youssef Fassi"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-950 dark:text-white outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">{t.phone}</label>
                    <input
                      type="tel"
                      placeholder="0612345678"
                      value={formData.phone}
                      onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                          setFormData({ ...formData, phone: val });
                      }}
                      maxLength={10}
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-950 dark:text-white outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">{t.age}</label>
                    <input
                      type="number"
                      placeholder="e.g. 35"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-950 dark:text-white outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-1.5">
                      <Activity className="w-4 h-4 text-blue-500" /> {t.status}
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-950 dark:text-white outline-none transition-all"
                    >
                      <option value="Active">{t.active}</option>
                      <option value="Inactive">{t.inactive}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">{t.nextAppt}</label>
                    <div className="flex gap-2">
                        <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value, time: "" })}
                        className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-950 dark:text-white outline-none transition-all [color-scheme:light] dark:[color-scheme:dark]"
                        />
                        <select
                            value={formData.time}
                            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                            disabled={!formData.date}
                            className={`w-full px-4 py-2.5 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-950 dark:text-white outline-none transition-all ${!formData.date ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                            <option value="" disabled>--:--</option>
                            {formData.date && getAvailableTimeSlots(formData.date).map(time => (
                                <option key={time} value={time}>{time}</option>
                            ))}
                        </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">{t.cond}</label>
                  <input
                    type="text"
                    placeholder="Main condition"
                    value={formData.malade}
                    onChange={(e) => setFormData({ ...formData, malade: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-950 dark:text-white outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">{t.totalFee}</label>
                    <input
                      type="number"
                      placeholder="e.g. 5000"
                      value={formData.totalFee}
                      onChange={(e) => setFormData({ ...formData, totalFee: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-950 dark:text-white outline-none transition-all font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">{t.amountPaid}</label>
                    <input
                      type="number"
                      placeholder="e.g. 2000"
                      value={formData.amountPaid}
                      onChange={(e) => setFormData({ ...formData, amountPaid: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-950 dark:text-white outline-none transition-all font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-amber-500" /> {t.notes}
                  </label>
                  <textarea
                    placeholder="Allergies, specific requests, internal notes..."
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-950 dark:text-white outline-none transition-all resize-none bg-yellow-50/30 dark:bg-yellow-900/10 focus:bg-white dark:focus:bg-gray-950"
                  />
                </div>

                <div className="flex gap-3 justify-end pt-4 border-t border-gray-100 dark:border-gray-800 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors font-semibold text-sm cursor-pointer"
                  >
                    {t.cancel}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors font-semibold text-sm shadow-md shadow-blue-500/20 cursor-pointer"
                  >
                    {editingId ? t.save : t.saveNew}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}


