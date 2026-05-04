export type TeamRole = 'Admin' | 'Doctor' | 'Secretary';
export type TeamAccess = 'Full Access' | 'Calendar + Clients';
export type SubscriptionStatus = 'Active' | 'Trial' | 'Past Due' | 'Cancelled';
export type SubscriptionPlan = 'Starter' | 'Growth' | 'Enterprise';

export type SubscriptionHistoryItem = {
  id: string;
  status: SubscriptionStatus;
  plan: SubscriptionPlan;
  amountMad: number;
  paidAt: string;
  periodStart: string;
  periodEnd: string;
  note: string;
};

export type TeamMember = {
  id: number;
  name: string;
  email: string;
  password?: string;
  passwordHash?: string;
  passwordSalt?: string;
  passwordVersion?: number;
  role: TeamRole;
  access: TeamAccess;
  city?: string;
  specialty?: string;
  ownerDoctorEmail?: string;
  ownerDoctorName?: string;
  mustResetCredentials?: boolean;
  isArchived?: boolean;
  archivedAt?: string;
  archivedReason?: string;
  subscriptionStatus?: SubscriptionStatus;
  subscriptionPlan?: SubscriptionPlan;
  tokenUsageMonthly?: number;
  tokenLimitMonthly?: number;
  subscriptionHistory?: SubscriptionHistoryItem[];
};

export const defaultTeam: TeamMember[] = [
  {
    id: 1,
    name: 'Admin Cabinet',
    email: 'admin@darijadoc.com',
    password: '123',
    role: 'Admin',
    access: 'Full Access',
    city: 'Casablanca',
    subscriptionStatus: 'Active',
    subscriptionPlan: 'Enterprise',
    tokenUsageMonthly: 220000,
    tokenLimitMonthly: 5000000,
    subscriptionHistory: [
      {
        id: 'sub-admin-2026-04',
        status: 'Active',
        plan: 'Enterprise',
        amountMad: 2200,
        paidAt: '2026-04-04',
        periodStart: '2026-04-04',
        periodEnd: '2026-05-03',
        note: 'Monthly admin platform billing',
      },
    ],
  },
  {
    id: 2,
    name: 'Dr. Amine Alami',
    email: 'amine@darijadoc.com',
    password: '123',
    role: 'Doctor',
    access: 'Full Access',
    city: 'Rabat',
    specialty: 'Dermatology',
    ownerDoctorEmail: 'amine@darijadoc.com',
    ownerDoctorName: 'Dr. Amine Alami',
    subscriptionStatus: 'Trial',
    subscriptionPlan: 'Growth',
    tokenUsageMonthly: 1320000,
    tokenLimitMonthly: 5000000,
    subscriptionHistory: [
      {
        id: 'sub-amine-2026-04',
        status: 'Trial',
        plan: 'Growth',
        amountMad: 0,
        paidAt: '2026-04-11',
        periodStart: '2026-04-11',
        periodEnd: '2026-05-11',
        note: 'Initial trial period',
      },
    ],
  },
  {
    id: 3,
    name: 'Sara Benali',
    email: 'sara@darijadoc.com',
    password: '123',
    role: 'Secretary',
    access: 'Calendar + Clients',
    city: 'Rabat',
    ownerDoctorEmail: 'amine@darijadoc.com',
    ownerDoctorName: 'Dr. Amine Alami',
    subscriptionStatus: 'Active',
    subscriptionPlan: 'Growth',
    tokenUsageMonthly: 180000,
    tokenLimitMonthly: 5000000,
  },
  {
    id: 4,
    name: 'Khalid Mansouri',
    email: 'khalid@darijadoc.com',
    password: '123',
    role: 'Secretary',
    access: 'Calendar + Clients',
    city: 'Rabat',
    ownerDoctorEmail: 'amine@darijadoc.com',
    ownerDoctorName: 'Dr. Amine Alami',
    subscriptionStatus: 'Active',
    subscriptionPlan: 'Growth',
    tokenUsageMonthly: 145000,
    tokenLimitMonthly: 5000000,
  },
  {
    id: 5,
    name: 'Dr. Salma Idrissi',
    email: 'salma@darijadoc.com',
    password: '123',
    role: 'Doctor',
    access: 'Full Access',
    city: 'Casablanca',
    specialty: 'Pediatrics',
    ownerDoctorEmail: 'salma@darijadoc.com',
    ownerDoctorName: 'Dr. Salma Idrissi',
    subscriptionStatus: 'Active',
    subscriptionPlan: 'Growth',
    tokenUsageMonthly: 2840000,
    tokenLimitMonthly: 5000000,
    subscriptionHistory: [
      {
        id: 'sub-salma-2026-03',
        status: 'Past Due',
        plan: 'Growth',
        amountMad: 400,
        paidAt: '2026-03-02',
        periodStart: '2026-03-02',
        periodEnd: '2026-04-01',
        note: 'Late payment settled on April 4',
      },
      {
        id: 'sub-salma-2026-04',
        status: 'Active',
        plan: 'Growth',
        amountMad: 400,
        paidAt: '2026-04-04',
        periodStart: '2026-04-04',
        periodEnd: '2026-05-03',
        note: 'Paid by bank transfer',
      },
    ],
  },
  {
    id: 6,
    name: 'Meryem Lahlou',
    email: 'meryem@darijadoc.com',
    password: '123',
    role: 'Secretary',
    access: 'Calendar + Clients',
    city: 'Casablanca',
    ownerDoctorEmail: 'salma@darijadoc.com',
    ownerDoctorName: 'Dr. Salma Idrissi',
    subscriptionStatus: 'Active',
    subscriptionPlan: 'Growth',
    tokenUsageMonthly: 260000,
    tokenLimitMonthly: 5000000,
  },
  {
    id: 7,
    name: 'Dr. Youssef Fassi',
    email: 'youssef@darijadoc.com',
    password: '123',
    role: 'Doctor',
    access: 'Full Access',
    city: 'Marrakech',
    specialty: 'General Medicine',
    ownerDoctorEmail: 'youssef@darijadoc.com',
    ownerDoctorName: 'Dr. Youssef Fassi',
    subscriptionStatus: 'Past Due',
    subscriptionPlan: 'Starter',
    tokenUsageMonthly: 970000,
    tokenLimitMonthly: 5000000,
    subscriptionHistory: [
      {
        id: 'sub-youssef-2026-02',
        status: 'Cancelled',
        plan: 'Starter',
        amountMad: 400,
        paidAt: '2026-02-08',
        periodStart: '2026-02-08',
        periodEnd: '2026-03-07',
        note: 'Cancelled by clinic after inactivity',
      },
      {
        id: 'sub-youssef-2026-04',
        status: 'Past Due',
        plan: 'Starter',
        amountMad: 400,
        paidAt: '2026-04-01',
        periodStart: '2026-04-01',
        periodEnd: '2026-04-30',
        note: 'Invoice overdue',
      },
    ],
  },
  {
    id: 8,
    name: 'Imane Sekkat',
    email: 'imane@darijadoc.com',
    password: '123',
    role: 'Secretary',
    access: 'Calendar + Clients',
    city: 'Marrakech',
    ownerDoctorEmail: 'youssef@darijadoc.com',
    ownerDoctorName: 'Dr. Youssef Fassi',
    subscriptionStatus: 'Past Due',
    subscriptionPlan: 'Starter',
    tokenUsageMonthly: 90000,
    tokenLimitMonthly: 5000000,
    isArchived: true,
    archivedAt: '2026-04-29',
    archivedReason: 'Doctor subscription overdue for 15 days',
  },
];

const TEAM_STORAGE_KEY = 'clinicTeamV3';
const HASH_ITERATIONS = 120000;

function getDefaultSubscriptionHistory(member: TeamMember): SubscriptionHistoryItem[] {
  return member.subscriptionHistory || [];
}

function dedupeTeam(rawTeam: TeamMember[]) {
  const byEmail = new Map<string, TeamMember>();
  const usedIds = new Set<number>();
  let nextId = 20;

  for (const fallback of defaultTeam) {
    byEmail.set(fallback.email.toLowerCase(), { ...fallback });
  }

  for (const member of rawTeam) {
    if (!member?.email) {
      continue;
    }

    const normalized: TeamMember = {
      ...member,
      id: typeof member.id === 'number' ? member.id : nextId++,
      access: member.access || 'Calendar + Clients',
      role: member.role || 'Secretary',
      city: member.city || 'Rabat',
      specialty: member.specialty || (member.role === 'Doctor' ? 'General Medicine' : ''),
      ownerDoctorEmail: member.ownerDoctorEmail,
      ownerDoctorName: member.ownerDoctorName,
      mustResetCredentials: Boolean(member.mustResetCredentials),
      isArchived: Boolean(member.isArchived),
      subscriptionStatus: member.subscriptionStatus || (member.role === 'Doctor' ? 'Trial' : 'Active'),
      subscriptionPlan: member.subscriptionPlan || (member.role === 'Doctor' ? 'Growth' : 'Starter'),
      tokenUsageMonthly: member.tokenUsageMonthly ?? 0,
      tokenLimitMonthly: member.tokenLimitMonthly ?? 5000000,
      subscriptionHistory: getDefaultSubscriptionHistory(member),
      passwordVersion: member.passwordVersion || (member.passwordHash ? 1 : 0),
    };

    const key = normalized.email.toLowerCase();
    const existing = byEmail.get(key);

    if (existing) {
      byEmail.set(key, {
        ...existing,
        ...normalized,
        id: existing.id ?? normalized.id,
        ownerDoctorEmail: normalized.ownerDoctorEmail || existing.ownerDoctorEmail,
        ownerDoctorName: normalized.ownerDoctorName || existing.ownerDoctorName,
        subscriptionHistory: normalized.subscriptionHistory?.length
          ? normalized.subscriptionHistory
          : existing.subscriptionHistory,
      });
    } else {
      byEmail.set(key, normalized);
    }
  }

  return Array.from(byEmail.values()).map((member) => {
    let safeId = member.id;
    while (usedIds.has(safeId)) {
      safeId = nextId++;
    }
    usedIds.add(safeId);
    return { ...member, id: safeId };
  });
}

function canUseCrypto() {
  return typeof window !== 'undefined' && typeof window.crypto !== 'undefined' && !!window.crypto.subtle;
}

function bytesToBase64(bytes: Uint8Array) {
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

function base64ToBytes(value: string) {
  const binary = atob(value);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

async function derivePasswordHash(password: string, salt: Uint8Array) {
  const encoder = new TextEncoder();
  const key = await window.crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  const normalizedSalt = salt.slice() as Uint8Array<ArrayBuffer>;
  const bits = await window.crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: normalizedSalt,
      iterations: HASH_ITERATIONS,
      hash: 'SHA-256',
    },
    key,
    256
  );

  return bytesToBase64(new Uint8Array(bits));
}

export async function createPasswordRecord(password: string) {
  if (!canUseCrypto()) {
    return {
      passwordHash: password,
      passwordSalt: '',
      passwordVersion: 0,
    };
  }

  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const passwordHash = await derivePasswordHash(password, salt);
  return {
    passwordHash,
    passwordSalt: bytesToBase64(salt),
    passwordVersion: 1,
  };
}

export async function verifyPassword(member: TeamMember, password: string) {
  if (member.passwordHash && member.passwordSalt && member.passwordVersion === 1 && canUseCrypto()) {
    const candidateHash = await derivePasswordHash(password, base64ToBytes(member.passwordSalt));
    return candidateHash === member.passwordHash;
  }

  return member.password === password;
}

export function getSeededTeam(): TeamMember[] {
  if (typeof window === 'undefined') {
    return defaultTeam;
  }

  const saved = localStorage.getItem(TEAM_STORAGE_KEY);
  const parsed = saved ? (JSON.parse(saved) as TeamMember[]) : [];
  const normalized = dedupeTeam(parsed);
  localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(normalized));
  return normalized;
}

export async function ensureTeamSecurity() {
  if (typeof window === 'undefined') {
    return defaultTeam;
  }

  const team = getSeededTeam();
  let didChange = false;
  const secured: TeamMember[] = [];

  for (const member of team) {
    if (!member.passwordHash && member.password) {
      const passwordRecord = await createPasswordRecord(member.password);
      secured.push({
        ...member,
        ...passwordRecord,
        password: undefined,
      });
      didChange = true;
      continue;
    }

    secured.push(member);
  }

  if (didChange) {
    localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(dedupeTeam(secured)));
  }

  return didChange ? secured : team;
}

export function saveTeam(team: TeamMember[]) {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(dedupeTeam(team)));
}

export async function upsertTeamMember(member: TeamMember) {
  const team = await ensureTeamSecurity();
  const others = team.filter((existing) => existing.email.toLowerCase() !== member.email.toLowerCase());
  saveTeam([...others, member]);
}

export async function updateTeamMemberCredentials(params: {
  currentEmail: string;
  nextEmail: string;
  nextPassword: string;
}) {
  const team = await ensureTeamSecurity();
  const passwordRecord = await createPasswordRecord(params.nextPassword);

  const updated = team.map((member) =>
    member.email.toLowerCase() === params.currentEmail.toLowerCase()
      ? {
          ...member,
          email: params.nextEmail.trim().toLowerCase(),
          ...passwordRecord,
          password: undefined,
          mustResetCredentials: false,
        }
      : member
  );

  saveTeam(updated);
  return updated.find((member) => member.email.toLowerCase() === params.nextEmail.trim().toLowerCase()) || null;
}

export function getVisibleTeamForUser(team: TeamMember[], role: string, email: string) {
  if (role === 'Admin') {
    return team;
  }

  if (role === 'Doctor') {
    return team.filter(
      (member) =>
        member.email.toLowerCase() === email.toLowerCase() ||
        member.ownerDoctorEmail?.toLowerCase() === email.toLowerCase()
    );
  }

  return [];
}

export function getDoctorEmployees(team: TeamMember[], doctorEmail: string) {
  return team.filter((member) => member.role === 'Secretary' && member.ownerDoctorEmail?.toLowerCase() === doctorEmail.toLowerCase());
}

export function getDoctors(team: TeamMember[]) {
  return team.filter((member) => member.role === 'Doctor');
}

export function getSecretaries(team: TeamMember[]) {
  return team.filter((member) => member.role === 'Secretary');
}
