import { Profile, INITIAL_PROFILES, UserRole, Goal, INITIAL_GOALS, GoalCheckin, INITIAL_CHECKINS, VerificationRequest, INITIAL_VERIFICATION_REQUESTS } from './store';

const STORAGE_KEYS = {
  USER: 'egna_current_user',
  ROLE: 'user_role',
  GOALS: 'egna_user_goals',
  CHECKINS: 'egna_user_checkins',
  VERIFICATIONS: 'egna_verifications_queue',
};

// Default standard member (Samuel Alemu)
export const DEFAULT_MEMBER: Profile = INITIAL_PROFILES[2];

/**
 * Resolves the currently authenticated user profile
 */
export function getCurrentUser(): Profile {
  if (typeof window === 'undefined') return DEFAULT_MEMBER;

  try {
    const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
    if (storedUser) {
      return JSON.parse(storedUser);
    }

    const storedRole = localStorage.getItem(STORAGE_KEYS.ROLE);
    if (storedRole === 'ceo_founder') return INITIAL_PROFILES[0];
    if (storedRole === 'moderator') return INITIAL_PROFILES[1];
    if (storedRole === 'admin') {
      return { ...INITIAL_PROFILES[1], role: 'admin', display_name: 'Platform Administrator' };
    }
  } catch (err) {
    console.warn('Error reading stored user session:', err);
  }

  return DEFAULT_MEMBER;
}

/**
 * Saves and broadcasts user profile updates across the whole platform
 */
export function setCurrentUser(user: Profile): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    localStorage.setItem(STORAGE_KEYS.ROLE, user.role);
    window.dispatchEvent(new Event('storage'));
  } catch (err) {
    console.error('Failed to save user session:', err);
  }
}

/**
 * Updates role and maps to standard mock profiles or updates current
 */
export function setUserRole(role: UserRole): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.ROLE, role);
    let mappedUser: Profile;
    if (role === 'ceo_founder') mappedUser = INITIAL_PROFILES[0];
    else if (role === 'moderator') mappedUser = INITIAL_PROFILES[1];
    else if (role === 'admin') mappedUser = { ...INITIAL_PROFILES[1], role: 'admin', display_name: 'Platform Administrator' };
    else mappedUser = INITIAL_PROFILES[2];

    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(mappedUser));
    window.dispatchEvent(new Event('storage'));
  } catch (err) {
    console.error('Failed to set user role:', err);
  }
}

/**
 * Complete sign-out helper
 */
export function logoutUser(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.ROLE);
    window.dispatchEvent(new Event('storage'));
  } catch (err) {
    console.error('Failed to clear user session:', err);
  }
}

/**
 * Get dynamic goals with persistent user-created additions
 */
export function getStoredGoals(): Goal[] {
  if (typeof window === 'undefined') return INITIAL_GOALS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.GOALS);
    if (raw) {
      const userGoals: Goal[] = JSON.parse(raw);
      return [...userGoals, ...INITIAL_GOALS.filter(g => !userGoals.some(ug => ug.id === g.id))];
    }
  } catch (err) {
    console.warn('Error reading stored goals:', err);
  }
  return INITIAL_GOALS;
}

/**
 * Save new user-created goal
 */
export function saveGoal(goal: Goal): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getStoredGoals();
    const updated = [goal, ...current.filter(g => g.id !== goal.id)];
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
  } catch (err) {
    console.error('Error saving goal:', err);
  }
}

/**
 * Get dynamic check-ins with persistent additions
 */
export function getStoredCheckins(): GoalCheckin[] {
  if (typeof window === 'undefined') return INITIAL_CHECKINS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CHECKINS);
    if (raw) {
      const userCheckins: GoalCheckin[] = JSON.parse(raw);
      return [...userCheckins, ...INITIAL_CHECKINS.filter(c => !userCheckins.some(uc => uc.id === c.id))];
    }
  } catch (err) {
    console.warn('Error reading stored check-ins:', err);
  }
  return INITIAL_CHECKINS;
}

/**
 * Save a new check-in
 */
export function saveCheckin(checkin: GoalCheckin): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getStoredCheckins();
    const updated = [checkin, ...current.filter(c => c.id !== checkin.id)];
    localStorage.setItem(STORAGE_KEYS.CHECKINS, JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
  } catch (err) {
    console.error('Error saving checkin:', err);
  }
}

/**
 * Get verification requests review queue
 */
export function getVerificationRequests(): VerificationRequest[] {
  if (typeof window === 'undefined') return INITIAL_VERIFICATION_REQUESTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.VERIFICATIONS);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Error reading verification requests:', err);
  }
  return INITIAL_VERIFICATION_REQUESTS;
}

/**
 * Save or submit a new verification request
 */
export function submitVerificationRequest(req: VerificationRequest): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getVerificationRequests();
    const updated = [req, ...current.filter(r => r.id !== req.id)];
    localStorage.setItem(STORAGE_KEYS.VERIFICATIONS, JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
  } catch (err) {
    console.error('Error submitting verification request:', err);
  }
}

/**
 * Update verification request status
 */
export function updateVerificationRequestStatus(id: string, status: 'approved' | 'rejected', reviewer: string): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getVerificationRequests();
    const updated = current.map(r => r.id === id ? {
      ...r,
      status,
      reviewed_at: 'Just now',
      reviewed_by: reviewer,
    } : r);
    localStorage.setItem(STORAGE_KEYS.VERIFICATIONS, JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
  } catch (err) {
    console.error('Error updating verification status:', err);
  }
}
