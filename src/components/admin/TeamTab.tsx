/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { UserPlus, Shield, Settings, Mail, MoreHorizontal, X, Lock, Stethoscope, UserCog, Activity, Clock, CalendarDays, UserSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const initialTeam = [
    { id: 1, name: "Admin Cabinet", email: "admin@darijadoc.com", password: "123", role: "Admin", access: "Full Access" },
    { id: 2, name: "Dr. Amine Alami", email: "amine@darijadoc.com", password: "123", role: "Doctor", access: "Full Access" },
    { id: 3, name: "Sara", email: "sara@darijadoc.com", password: "123", role: "Secretary", access: "Calendar + Clients" },
    { id: 4, name: "Khalid", email: "khalid@darijadoc.com", password: "123", role: "Secretary", access: "Calendar Only" },
];

const TEAM_T: Record<string, any> = {
    en: {
        title: "Role Management",
        subtitle: "Manage doctors and secretaries, configure privileges and access levels.",
        newStaff: "New Staff Member",
        viewActivity: "View Activity",
        removeUser: "Remove User",
        accountRole: "Account Role",
        privileges: "Privileges",
        createProfile: "Create Staff Profile",
        createSub: "Create a new account and assign privileges securely.",
        fullName: "Full Name",
        email: "Email Address",
        tempPass: "Temporary Password",
        cancel: "Cancel",
        saveProfile: "Save Profile",
        auditLog: "Employee Audit Log",
        activityTrace: "Activity trace for",
        target: "Target:",
        last24h: "Displaying last 24 hours of employee trace records securely.",
        roles: { "Admin": "Admin", "Doctor": "Doctor", "Secretary": "Secretary" },
        accessTrans: {
            "Full Access": "FULL ACCESS",
            "Calendar + Clients": "CALENDAR + CLIENTS",
            "Calendar Only": "CALENDAR ONLY"
        },
        actions: {
            loggedIn: "Logged In",
            createAppt: "Created Appointment",
            addNotes: "Added Patient Notes",
            regPatient: "Registered New Patient",
            markUnavail: "Marked Unavailable",
            reschedule: "Rescheduled Consultation",
            deleteAppt: "Deleted Appointment",
            updatePatient: "Updated Patient Profile",
            deletePatient: "Deleted Patient"
        }
    },
    fr: {
        title: "Gestion des Rôles",
        subtitle: "Gérez les médecins et les secrétaires, configurez les privilèges et les accès.",
        newStaff: "Nouveau Membre",
        viewActivity: "Voir l'Activité",
        removeUser: "Supprimer l'Utilisateur",
        accountRole: "Rôle du Compte",
        privileges: "Privilèges",
        createProfile: "Créer un Profil Personnel",
        createSub: "Créez un nouveau compte et attribuez des privilèges en toute sécurité.",
        fullName: "Nom Complet",
        email: "Adresse E-mail",
        tempPass: "Mot de Passe Temporaire",
        cancel: "Annuler",
        saveProfile: "Enregistrer le Profil",
        auditLog: "Journal d'Audit des Employés",
        activityTrace: "Trace d'activité pour",
        target: "Cible :",
        last24h: "Affichage des dernières 24 heures de traces des employés.",
        roles: { "Admin": "Admin", "Doctor": "Médecin", "Secretary": "Secrétaire" },
        accessTrans: {
            "Full Access": "ACCÈS TOTAL",
            "Calendar + Clients": "AGENDA + PATIENTS",
            "Calendar Only": "AGENDA UNIQUEMENT"
        },
        actions: {
            loggedIn: "Connecté",
            createAppt: "Rendez-vous Créé",
            addNotes: "Notes de Patient Ajoutées",
            regPatient: "Nouveau Patient Enregistré",
            markUnavail: "Marqué Indisponible",
            reschedule: "Consultation Reprogrammée",
            deleteAppt: "Rendez-vous Supprimé",
            updatePatient: "Profil Patient Mis à Jour",
            deletePatient: "Patient Supprimé"
        }
    },
    ar: {
        title: "????? ???????",
        subtitle: "????? ??????? ???????????? ????? ?????????? ???????? ??????.",
        newStaff: "???? ????",
        viewActivity: "??? ??????",
        removeUser: "??? ????????",
        accountRole: "??? ??????",
        privileges: "??????????",
        createProfile: "????? ??? ????",
        createSub: "???? ?????? ?????? ????? ?????????? ?????.",
        fullName: "????? ??????",
        email: "?????? ??????????",
        tempPass: "???? ???? ?????",
        cancel: "?????",
        saveProfile: "??? ?????",
        auditLog: "??? ????? ??????",
        activityTrace: "??? ????",
        target: "?????:",
        last24h: "??? ??? 24 ???? ?? ????? ???? ???????? ?????.",
        roles: { "Admin": "?????", "Doctor": "????", "Secretary": "???????" },
        accessTrans: {
            "Full Access": "???? ????",
            "Calendar + Clients": "??????? + ??????",
            "Calendar Only": "??????? ???"
        },
        actions: {
            loggedIn: "?? ????? ??????",
            createAppt: "?? ????? ????",
            addNotes: "??? ????? ??????? ??????",
            regPatient: "?? ????? ???? ????",
            markUnavail: "?? ??????? ???? ????",
            reschedule: "??? ????? ????? ?????????",
            deleteAppt: "?? ??? ??????",
            updatePatient: "?? ????? ??? ??????",
            deletePatient: "?? ??? ??????"
        }
    }
};

export default function TeamTab() {
    const pathname = usePathname();
    const currentLocale = pathname?.split('/')[1] || 'en';
    const t = TEAM_T[currentLocale] || TEAM_T['en'];
    const [team, setTeam] = useState<any[]>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('clinicTeam');
            if (saved) return JSON.parse(saved);
        }
        return initialTeam;
    });

    useEffect(() => {
        localStorage.setItem('clinicTeam', JSON.stringify(team));
    }, [team]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activityModalOpen, setActivityModalOpen] = useState<number | null>(null);

    // New User Form State
    const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "Secretary", access: "Calendar + Clients" });
    const currentRole = typeof window !== 'undefined' ? sessionStorage.getItem('adminRole') || 'Admin' : 'Admin';
    const isAdmin = currentRole === 'Admin';

    const [auditLogs, setAuditLogs] = useState<any[]>([]);

    useEffect(() => {
        const fetchLogs = () => {
            try {
                const logs = JSON.parse(localStorage.getItem('clinicAuditLogs') || '[]');
                setAuditLogs(logs);
            } catch (err) {}
        };
        fetchLogs();
        window.addEventListener('auditLogUpdated', fetchLogs);
        return () => window.removeEventListener('auditLogUpdated', fetchLogs);
    }, []);

    const getMemberLogs = (memberName: string) => {
        return auditLogs.filter(log => log.memberName === memberName);
    };

    const handleCreateUser = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newUser.name || !newUser.email) return;

        const addedMember = {
            id: Date.now(),
            name: newUser.name,
            email: newUser.email,
            password: newUser.password,
            role: newUser.role,
            access: newUser.access
        };

        setTeam([...team, addedMember]);
        setIsModalOpen(false);
        setNewUser({ name: "", email: "", password: "", role: "Secretary", access: "Calendar + Clients" });
    };

    const handleDelete = (id: number) => {
        setTeam(team.filter((member: any) => member.id !== id));
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t.title}</h2>
                    <p className="text-sm text-gray-500 mt-1">{t.subtitle}</p>
                </div>

                {isAdmin ? (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-colors font-medium text-sm shadow-sm cursor-pointer"
                    >
                        <UserPlus className="w-4 h-4" />
                        {t.newStaff}
                    </button>
                ) : null}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                    {team.map((member, idx) => (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ delay: idx * 0.05 }}
                            key={member.id}
                            onClick={() => setActivityModalOpen(member.id)}
                            className={`bg-white dark:bg-gray-900 p-6 rounded-2xl border ${member.role === 'Doctor' ? 'border-blue-200 dark:border-blue-800' : 'border-gray-100 dark:border-gray-800'} shadow-sm relative overflow-hidden group cursor-pointer hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition-all`}
                        >
                            {isAdmin && member.role !== 'Admin' && (
                                <div className="absolute top-4 right-4 group/menu">
                                    <button className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors p-1 cursor-pointer rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                                        <MoreHorizontal className="w-5 h-5" />
                                    </button>
                                    <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 shadow-xl border border-gray-100 dark:border-gray-700 rounded-lg hidden group-hover/menu:block z-10 w-44 overflow-hidden">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setActivityModalOpen(member.id); }}
                                            className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 border-b border-gray-100 dark:border-gray-700/50"
                                        >
                                            <Activity className="w-4 h-4 text-gray-500 dark:text-gray-400" /> {t.viewActivity}
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleDelete(member.id); }}
                                            className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors flex items-center gap-2"
                                        >
                                            <X className="w-4 h-4" /> {t.removeUser}
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center gap-4 mb-4 mt-[-1.5rem] pt-6">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${member.role === 'Doctor' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200'}`}>
                                    {member.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
                                        {member.name}
                                        {member.role === 'Doctor' && <Stethoscope className="w-3.5 h-3.5 text-blue-500" />}
                                        {member.role === 'Secretary' && <UserCog className="w-3.5 h-3.5 text-gray-500" />}
                                    </h3>
                                    <span className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                        <Mail className="w-3 h-3" /> {member.email}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-2">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500 flex items-center gap-1.5">
                                        <Settings className="w-4 h-4 text-gray-400" /> {t.accountRole}
                                    </span>
                                    <span className={`font-bold ${member.role === 'Doctor' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}>{t.roles[member.role] || member.role}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500 flex items-center gap-1.5">
                                        <Shield className="w-4 h-4 text-gray-400" /> {t.privileges}
                                    </span>
                                    <span className="font-medium text-[10px] uppercase tracking-wider text-green-700 bg-green-50 border border-green-200 dark:text-green-400 dark:bg-green-900/30 dark:border-green-800 px-2 py-0.5 rounded shadow-sm">
                                        {t.accessTrans ? (t.accessTrans[member.access] || member.access) : member.access}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-md p-6 shadow-2xl border border-gray-100 dark:border-gray-800"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t.createProfile}</h3>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors cursor-pointer"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <p className="text-sm text-gray-500 mb-6">{t.createSub}</p>

                            <form onSubmit={handleCreateUser} className="space-y-4 mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.fullName}</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Youssef Fassi"
                                        value={newUser.name}
                                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-950 dark:text-white outline-none transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.email}</label>
                                    <input
                                        type="email"
                                        required
                                        placeholder="user@clinic.com"
                                        value={newUser.email}
                                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-950 dark:text-white outline-none transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.tempPass}</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="password"
                                            required
                                            placeholder="••••••••"
                                            value={newUser.password}
                                            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                            className="w-full pl-9 pr-4 py-2 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-950 dark:text-white outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.accountRole}</label>
                                        <select
                                            value={newUser.role}
                                            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-950 dark:text-white appearance-none outline-none cursor-pointer"
                                        >
                                            <option value="Secretary">{t.roles["Secretary"] || "Secretary"}</option>
                                            <option value="Doctor">{t.roles["Doctor"] || "Doctor"}</option>
                                            <option value="Admin">{t.roles["Admin"] || "Admin"}</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.privileges}</label>
                                        <select
                                            value={newUser.access}
                                            onChange={(e) => setNewUser({ ...newUser, access: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-950 dark:text-white appearance-none outline-none cursor-pointer"
                                        >
                                            <option value="Calendar + Clients">Calendar + Clients</option>
                                            <option value="Calendar Only">Calendar Only</option>
                                            <option value="Full Access">Full Access</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex gap-3 justify-end pt-4 border-t border-gray-100 dark:border-gray-800 mt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors font-semibold text-sm cursor-pointer"
                                    >
                                        {t.cancel}
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/30 transition-colors cursor-pointer"
                                    >
                                        {t.saveProfile}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Activity Log Modal */}
            <AnimatePresence>
                {activityModalOpen !== null && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        {team.filter((m: any) => m.id === activityModalOpen).map((member: any) => (
                            <motion.div
                                key={member.id}
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-800 flex flex-col max-h-[85vh]"
                            >
                                <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-900">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                            <Activity className="w-5 h-5 text-blue-500" /> {t.auditLog}
                                        </h3>
                                        <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                                            {t.activityTrace} <span className="font-bold text-gray-700 dark:text-gray-300">{member.name}</span> ({t.roles[member.role] || member.role})
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setActivityModalOpen(null)}
                                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors cursor-pointer bg-white dark:bg-gray-800 rounded-full shadow-sm"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="p-6 overflow-y-auto bg-white dark:bg-gray-900">
                                    <div className="relative border-l-2 border-gray-100 dark:border-gray-800 ml-3 space-y-8">
                                        {getMemberLogs(member.name).length > 0 ? getMemberLogs(member.name).map((log) => (
                                            <div key={log.id} className="relative pl-6">
                                                {/* Connecting dot */}
                                                <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white dark:border-gray-900 ${
                                                    log.type === "system" ? "bg-amber-500" :
                                                    log.type === "calendar" ? "bg-blue-500" : "bg-emerald-500"
                                                }`}></div>
                                                
                                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                                                    <div>
                                                        <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                                            {t.actions[log.action] || log.action}
                                                        </h4>
                                                        <p className="text-sm text-gray-500 mt-1">
                                                            {t.target} <span className="font-medium text-gray-700 dark:text-gray-300">{log.target}</span>
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-xs font-mono text-gray-400 bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded-md border border-gray-100 dark:border-gray-700">
                                                        <Clock className="w-3.5 h-3.5" />
                                                        {log.date} at {log.time}
                                                    </div>
                                                </div>
                                            </div>
                                        )) : (
                                            <div className="text-sm text-gray-500 italic pl-6 py-4">No recent activity.</div>
                                        )}
                                    </div>
                                </div>
                                <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-center text-xs text-gray-400">
                                    {t.last24h}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}


