export const logAuditActivity = (actionKey: string, target: string, type: 'system' | 'calendar' | 'client') => {
    if (typeof window === 'undefined') return;
    
    try {
        const adminName = sessionStorage.getItem('adminName') || 'System';
        const logs = JSON.parse(localStorage.getItem('clinicAuditLogs') || '[]');
        
        const today = new Date();
        const newLog = {
            id: Date.now().toString(),
            memberName: adminName,
            action: actionKey,
            target,
            type,
            time: today.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            date: today.toLocaleDateString()
        };
        
        logs.unshift(newLog);
        
        // Keep only the last 100 logs
        localStorage.setItem('clinicAuditLogs', JSON.stringify(logs.slice(0, 100)));
        
        // Dispatch an event so TeamTab can re-render if it's open
        window.dispatchEvent(new Event('auditLogUpdated'));
    } catch (err) {
        console.error("Failed to write audit log", err);
    }
};

