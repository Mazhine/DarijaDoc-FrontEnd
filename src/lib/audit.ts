export const logAuditActivity = (actionKey: string, target: string, type: 'system' | 'calendar' | 'client') => {
  if (typeof window === 'undefined') return;

  try {
    const adminName = sessionStorage.getItem('adminName') || 'System';
    const adminEmail = sessionStorage.getItem('adminEmail') || '';
    const adminRole = sessionStorage.getItem('adminRole') || 'Admin';
    const ownerDoctorEmail = sessionStorage.getItem('adminOwnerDoctorEmail') || adminEmail;
    const ownerDoctorName = sessionStorage.getItem('adminOwnerDoctorName') || adminName;
    const logs = JSON.parse(localStorage.getItem('clinicAuditLogs') || '[]');

    const today = new Date();
    const newLog = {
      id: Date.now().toString(),
      memberName: adminName,
      memberEmail: adminEmail,
      memberRole: adminRole,
      ownerDoctorEmail,
      ownerDoctorName,
      action: actionKey,
      target,
      type,
      time: today.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: today.toLocaleDateString(),
    };

    logs.unshift(newLog);
    localStorage.setItem('clinicAuditLogs', JSON.stringify(logs.slice(0, 100)));
    window.dispatchEvent(new Event('auditLogUpdated'));
  } catch (err) {
    console.error('Failed to write audit log', err);
  }
};
