const FREE_PLAN_LIMIT = 10;

export const getMaxNotesForPlan = (plan = 'gratuit') => {
    const normalizedPlan = String(plan ?? 'gratuit').trim().toLowerCase();

    if (normalizedPlan === 'premium') {
        return Number.POSITIVE_INFINITY;
    }

    return FREE_PLAN_LIMIT;
};

export const canCreateNote = (plan, currentNotesCount = 0) => {
    const maxNotes = getMaxNotesForPlan(plan);

    if (!Number.isFinite(maxNotes)) {
        return true;
    }

    return currentNotesCount < maxNotes;
};
