export const fetchStats = async () => {
    const res = await fetch('/api/stats');
    return res.json();
};

export const fetchLogs = async () => {
    const res = await fetch('/api/logs');
    return res.json();
};

export const fetchPending = async () => {
    const res = await fetch('/api/pending');
    return res.json();
};

export const approveAxe = async (containerId) => {
    const res = await fetch(`/api/approve/${containerId}`, {
        method: 'POST',
    });
    return res.json();
};

export const fetchResources = async () => {
    const res = await fetch('/api/resources');
    return res.json();
};

export const rejectAxe = async (containerId) => {
    const res = await fetch(`/api/reject/${containerId}`, {
        method: 'POST',
    });
    return res.json();
};