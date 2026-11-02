import test from 'node:test';
import assert from 'node:assert/strict';

import { getMaxNotesForPlan, canCreateNote } from '../util/abonnement-limit.js';

test('le plan gratuit autorise jusqu\'à 10 notes', () => {
    assert.equal(getMaxNotesForPlan('gratuit'), 10);
    assert.equal(canCreateNote('gratuit', 9), true);
    assert.equal(canCreateNote('gratuit', 10), false);
});

test('le plan premium autorise un nombre illimité de notes', () => {
    assert.equal(getMaxNotesForPlan('premium'), Number.POSITIVE_INFINITY);
    assert.equal(canCreateNote('premium', 100), true);
});
