export const AUTH_COOKIE = 'darijadoc_session';

export type SessionUser = {
  email: string;
  role: string;
  access: string;
  name: string;
  ownerDoctorEmail: string;
  ownerDoctorName: string;
};

export function setClientSession(user: SessionUser) {
  if (typeof window === 'undefined') {
    return;
  }

  sessionStorage.setItem('adminAuth', 'true');
  sessionStorage.setItem('adminEmail', user.email);
  sessionStorage.setItem('adminRole', user.role);
  sessionStorage.setItem('adminAccess', user.access);
  sessionStorage.setItem('adminName', user.name);
  sessionStorage.setItem('adminOwnerDoctorEmail', user.ownerDoctorEmail);
  sessionStorage.setItem('adminOwnerDoctorName', user.ownerDoctorName);

  const encoded = encodeURIComponent(
    JSON.stringify({
      email: user.email,
      role: user.role,
      access: user.access,
      at: Date.now(),
    })
  );

  document.cookie = `${AUTH_COOKIE}=${encoded}; path=/; max-age=${60 * 60 * 12}; samesite=lax`;
}

export function clearClientSession() {
  if (typeof window === 'undefined') {
    return;
  }

  sessionStorage.removeItem('adminAuth');
  sessionStorage.removeItem('adminEmail');
  sessionStorage.removeItem('adminRole');
  sessionStorage.removeItem('adminAccess');
  sessionStorage.removeItem('adminName');
  sessionStorage.removeItem('adminOwnerDoctorEmail');
  sessionStorage.removeItem('adminOwnerDoctorName');
  document.cookie = `${AUTH_COOKIE}=; path=/; max-age=0; samesite=lax`;
}

export function hasClientSession() {
  if (typeof window === 'undefined') {
    return false;
  }

  return sessionStorage.getItem('adminAuth') === 'true';
}
