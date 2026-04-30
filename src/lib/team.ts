export type TeamRole = 'Admin' | 'Doctor' | 'Secretary';
export type TeamAccess = 'Full Access' | 'Calendar + Clients' | 'Calendar Only';

export type TeamMember = {
  id: number;
  name: string;
  email: string;
  password: string;
  role: TeamRole;
  access: TeamAccess;
  ownerDoctorEmail?: string;
  ownerDoctorName?: string;
  mustResetCredentials?: boolean;
  subscriptionStatus?: 'Active' | 'Trial' | 'Past Due';
};

export const defaultTeam: TeamMember[] = [
  {
    id: 1,
    name: 'Admin Cabinet',
    email: 'admin@darijadoc.com',
    password: '123',
    role: 'Admin',
    access: 'Full Access',
    subscriptionStatus: 'Active',
  },
  {
    id: 2,
    name: 'Dr. Amine Alami',
    email: 'amine@darijadoc.com',
    password: '123',
    role: 'Doctor',
    access: 'Full Access',
    ownerDoctorEmail: 'amine@darijadoc.com',
    ownerDoctorName: 'Dr. Amine Alami',
    subscriptionStatus: 'Trial',
  },
  {
    id: 3,
    name: 'Sara',
    email: 'sara@darijadoc.com',
    password: '123',
    role: 'Secretary',
    access: 'Calendar + Clients',
    ownerDoctorEmail: 'amine@darijadoc.com',
    ownerDoctorName: 'Dr. Amine Alami',
    subscriptionStatus: 'Active',
  },
  {
    id: 4,
    name: 'Khalid',
    email: 'khalid@darijadoc.com',
    password: '123',
    role: 'Secretary',
    access: 'Calendar + Clients',
    ownerDoctorEmail: 'amine@darijadoc.com',
    ownerDoctorName: 'Dr. Amine Alami',
    subscriptionStatus: 'Active',
  },
];

const TEAM_STORAGE_KEY = 'clinicTeam';

function dedupeTeam(rawTeam: TeamMember[]) {
  const byEmail = new Map<string, TeamMember>();
  const usedIds = new Set<number>();
  let nextId = 10;

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
      ownerDoctorEmail: member.ownerDoctorEmail,
      ownerDoctorName: member.ownerDoctorName,
      mustResetCredentials: Boolean(member.mustResetCredentials),
      subscriptionStatus: member.subscriptionStatus || (member.role === 'Doctor' ? 'Trial' : 'Active'),
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

export function saveTeam(team: TeamMember[]) {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(dedupeTeam(team)));
}

export function upsertTeamMember(member: TeamMember) {
  const team = getSeededTeam();
  const others = team.filter((existing) => existing.email.toLowerCase() !== member.email.toLowerCase());
  saveTeam([...others, member]);
}

export function updateTeamMemberCredentials(params: {
  currentEmail: string;
  nextEmail: string;
  nextPassword: string;
}) {
  const team = getSeededTeam();
  const updated = team.map((member) =>
    member.email.toLowerCase() === params.currentEmail.toLowerCase()
      ? {
          ...member,
          email: params.nextEmail.trim().toLowerCase(),
          password: params.nextPassword,
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
