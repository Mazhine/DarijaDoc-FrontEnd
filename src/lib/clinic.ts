export type PatientStatus = 'follow-up' | 'inactive';

export type AppointmentHistoryItem = {
  id: string;
  date: string;
  time: string;
  type: string;
  comment?: string;
  source?: 'calendar' | 'manual';
};

export type PatientRecord = {
  id: number;
  name: string;
  age: number;
  gender?: string;
  malade: string;
  phone: string;
  status: PatientStatus;
  date: string;
  notes: string;
  totalFee: number;
  amountPaid: number;
  bloodGroup?: string;
  insurance?: string;
  chronicDiseases?: string[];
  allergies?: string[];
  history: AppointmentHistoryItem[];
};

export type ScheduleSettings = {
  openingTime: string;
  closingTime: string;
  slotDurationMinutes: number;
  breakStart: string;
  breakEnd: string;
  offDays: number[];
  halfDays: Array<{ day: number; closingTime: string }>;
  blockedDates: Array<{ date: string; reason: string }>;
};

export const PATIENTS_STORAGE_KEY = 'clinicPatients';
export const SCHEDULE_STORAGE_KEY = 'clinicScheduleSettings';
export const APPOINTMENT_COMMENT_MAX = 120;
export const DEFAULT_SLOT_DURATION = 30;

export const defaultScheduleSettings: ScheduleSettings = {
  openingTime: '09:00',
  closingTime: '18:00',
  slotDurationMinutes: DEFAULT_SLOT_DURATION,
  breakStart: '13:00',
  breakEnd: '14:00',
  offDays: [0],
  halfDays: [{ day: 6, closingTime: '13:00' }],
  blockedDates: [],
};

export function sanitizePhone(value: string) {
  return value.replace(/\D/g, '').slice(0, 10);
}

export function isValidPhone(value: string) {
  return /^\d{10}$/.test(value);
}

export function sanitizeName(value: string) {
  return value.replace(/[0-9]/g, "").replace(/\s{2,}/g, " ").trimStart();
}

export function isValidName(value: string) {
  return /^[A-Za-zÀ-ÿ' -]{2,}$/.test(value.trim());
}

export function isValidAge(value: number) {
  return Number.isInteger(value) && value >= 0 && value <= 120;
}

export function clampComment(value: string) {
  return value.trim().slice(0, APPOINTMENT_COMMENT_MAX);
}

export function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function todayKey() {
  return formatDateKey(new Date());
}

export function isFutureOrToday(date: string) {
  return date >= todayKey();
}

export function timeToMinutes(value: string) {
  const [hour, minute] = value.split(':').map((part) => parseInt(part, 10));
  return hour * 60 + minute;
}

export function minutesToTime(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

export function addMinutes(time: string, delta: number) {
  return minutesToTime(timeToMinutes(time) + delta);
}

export function getScheduleSettings() {
  if (typeof window === 'undefined') {
    return defaultScheduleSettings;
  }

  try {
    const saved = localStorage.getItem(SCHEDULE_STORAGE_KEY);
    if (!saved) {
      localStorage.setItem(SCHEDULE_STORAGE_KEY, JSON.stringify(defaultScheduleSettings));
      return defaultScheduleSettings;
    }

    return {
      ...defaultScheduleSettings,
      ...JSON.parse(saved),
    } as ScheduleSettings;
  } catch {
    return defaultScheduleSettings;
  }
}

export function saveScheduleSettings(settings: ScheduleSettings) {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.setItem(SCHEDULE_STORAGE_KEY, JSON.stringify(settings));
}

export function getPatients() {
  if (typeof window === 'undefined') {
    return [] as PatientRecord[];
  }

  try {
    return JSON.parse(localStorage.getItem(PATIENTS_STORAGE_KEY) || '[]') as PatientRecord[];
  } catch {
    return [];
  }
}

export function savePatients(patients: PatientRecord[]) {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.setItem(PATIENTS_STORAGE_KEY, JSON.stringify(patients));
}

export function buildSlotsForDay(date: string, settings: ScheduleSettings) {
  const parsed = new Date(`${date}T09:00:00`);
  const weekday = parsed.getDay();
  const isBlockedDate = settings.blockedDates.some((item) => item.date === date);

  if (settings.offDays.includes(weekday) || isBlockedDate) {
    return [] as string[];
  }

  const open = timeToMinutes(settings.openingTime);
  const halfDay = settings.halfDays.find((item) => item.day === weekday);
  const close = timeToMinutes(halfDay?.closingTime || settings.closingTime);
  const pauseStart = timeToMinutes(settings.breakStart);
  const pauseEnd = timeToMinutes(settings.breakEnd);

  const slots: string[] = [];
  for (let cursor = open; cursor + settings.slotDurationMinutes <= close; cursor += settings.slotDurationMinutes) {
    const isBreakSlot = cursor >= pauseStart && cursor < pauseEnd;
    if (!isBreakSlot) {
      slots.push(minutesToTime(cursor));
    }
  }

  return slots;
}

export function normalizePatientStatus(nextAppointmentDate?: string): PatientStatus {
  return nextAppointmentDate && isFutureOrToday(nextAppointmentDate) ? 'follow-up' : 'inactive';
}
