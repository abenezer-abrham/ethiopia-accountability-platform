import { Profile, INITIAL_PROFILES, UserRole, Goal, INITIAL_GOALS, GoalCheckin, INITIAL_CHECKINS, VerificationRequest, INITIAL_VERIFICATION_REQUESTS, AdminRecord } from './store';

export type { AdminRecord };
export const ROOT_ADMIN_EMAIL = 'abenezerabrham61@gmail.com';

const STORAGE_KEYS = {
  USER: 'egna_current_user',
  ROLE: 'user_role',
  GOALS: 'egna_user_goals',
  CHECKINS: 'egna_user_checkins',
  VERIFICATIONS: 'egna_verifications_queue',
  ADMIN_REGISTRY: 'egna_admin_registry',
  VERIFIED_EMAILS: 'egna_verified_emails',
};

// Initial system admin registry with Abenezer Abrham as the sole Root CEO & Admin
export const INITIAL_ADMIN_REGISTRY: AdminRecord[] = [
  {
    email: ROOT_ADMIN_EMAIL,
    role: 'ceo_founder',
    name: 'Abenezer Abrham',
    added_by: 'system_root',
    added_at: '2026-08-01',
    is_root: true,
  },
  {
    email: 'meron.tadesse@egna.et',
    role: 'moderator',
    name: 'Meron Tadesse',
    added_by: ROOT_ADMIN_EMAIL,
    added_at: '2026-08-10',
    is_root: false,
  }
];

// Default standard member
export const DEFAULT_MEMBER: Profile = INITIAL_PROFILES[2];

/**
 * Get all registered administrators from persistent storage
 */
export function getAdminRegistry(): AdminRecord[] {
  if (typeof window === 'undefined') return INITIAL_ADMIN_REGISTRY;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ADMIN_REGISTRY);
    if (raw) {
      const parsed: AdminRecord[] = JSON.parse(raw);
      // Ensure root admin is always present and never removed
      if (!parsed.some(a => a.email.toLowerCase() === ROOT_ADMIN_EMAIL.toLowerCase())) {
        parsed.unshift(INITIAL_ADMIN_REGISTRY[0]);
      }
      return parsed;
    }
  } catch (err) {
    console.warn('Error reading admin registry:', err);
  }
  return INITIAL_ADMIN_REGISTRY;
}

/**
 * Check if an email is registered as an admin or moderator
 */
export function isEmailAdmin(email: string): AdminRecord | null {
  if (!email) return null;
  const normalized = email.trim().toLowerCase();
  const registry = getAdminRegistry();
  return registry.find(a => a.email.toLowerCase() === normalized) || null;
}

/**
 * Add or invite a new admin/moderator to the database registry
 */
export function addAdminEmail(email: string, role: UserRole, name: string, addedBy: string = ROOT_ADMIN_EMAIL): boolean {
  if (typeof window === 'undefined' || !email) return false;
  try {
    const registry = getAdminRegistry();
    const normalized = email.trim().toLowerCase();
    const updated = [
      ...registry.filter(a => a.email.toLowerCase() !== normalized),
      {
        email: normalized,
        role,
        name: name.trim() || 'Administrator',
        added_by: addedBy,
        added_at: new Date().toISOString().split('T')[0],
        is_root: normalized === ROOT_ADMIN_EMAIL.toLowerCase(),
      }
    ];
    localStorage.setItem(STORAGE_KEYS.ADMIN_REGISTRY, JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
    return true;
  } catch (err) {
    console.error('Failed to add admin record:', err);
    return false;
  }
}

/**
 * Remove an admin (root admin cannot be removed)
 */
export function removeAdminEmail(email: string): boolean {
  if (typeof window === 'undefined' || !email) return false;
  const normalized = email.trim().toLowerCase();
  if (normalized === ROOT_ADMIN_EMAIL.toLowerCase()) {
    console.warn('Cannot remove root CEO admin');
    return false;
  }
  try {
    const registry = getAdminRegistry();
    const updated = registry.filter(a => a.email.toLowerCase() !== normalized);
    localStorage.setItem(STORAGE_KEYS.ADMIN_REGISTRY, JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
    return true;
  } catch (err) {
    console.error('Failed to remove admin record:', err);
    return false;
  }
}

/**
 * Authenticate session via email cross-reference
 */
export function loginWithEmailCrossReference(email: string, customName?: string): Profile {
  const normalized = email.trim().toLowerCase();
  const adminRecord = isEmailAdmin(normalized);

  if (normalized === ROOT_ADMIN_EMAIL.toLowerCase() || adminRecord?.role === 'ceo_founder') {
    const ceoProfile = INITIAL_PROFILES[0];
    setCurrentUser(ceoProfile);
    return ceoProfile;
  }

  if (adminRecord) {
    const adminProfile: Profile = {
      id: `admin-${Date.now()}`,
      username: normalized.split('@')[0],
      display_name: adminRecord.name || customName || 'Platform Administrator',
      email: normalized,
      email_verified: true,
      bio: `${adminRecord.role === 'moderator' ? 'Community Moderator' : 'System Admin'} at Egna.`,
      avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(adminRecord.name)}`,
      location_region: 'Addis Ababa',
      trust_tier: 'tier_3_leader',
      verification_badge: adminRecord.role === 'moderator' ? 'verified_admin' : 'verified_admin',
      role: adminRecord.role,
      reputation_score: 1000,
      created_at: new Date().toISOString(),
    };
    setCurrentUser(adminProfile);
    return adminProfile;
  }

  // Standard user session
  const userProfile: Profile = {
    id: `usr-${Date.now()}`,
    username: normalized.split('@')[0],
    display_name: customName || normalized.split('@')[0],
    email: normalized,
    email_verified: isEmailVerified(normalized),
    bio: 'Member practicing accountability on Egna.',
    avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(normalized)}`,
    location_region: 'Addis Ababa',
    trust_tier: 'tier_1_new',
    verification_badge: 'none',
    role: 'user',
    reputation_score: 50,
    created_at: new Date().toISOString(),
  };
  setCurrentUser(userProfile);
  return userProfile;
}

/**
 * Check if an email is marked as verified
 */
export function isEmailVerified(email: string): boolean {
  if (!email) return false;
  if (email.trim().toLowerCase() === ROOT_ADMIN_EMAIL.toLowerCase()) return true;
  if (typeof window === 'undefined') return false;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.VERIFIED_EMAILS);
    if (raw) {
      const list: string[] = JSON.parse(raw);
      return list.includes(email.trim().toLowerCase());
    }
  } catch (err) {
    console.warn('Error reading verified emails:', err);
  }
  return false;
}

/**
 * Mark email as verified
 */
export function markEmailVerified(email: string): void {
  if (typeof window === 'undefined' || !email) return;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.VERIFIED_EMAILS);
    const list: string[] = raw ? JSON.parse(raw) : [];
    const normalized = email.trim().toLowerCase();
    if (!list.includes(normalized)) {
      list.push(normalized);
      localStorage.setItem(STORAGE_KEYS.VERIFIED_EMAILS, JSON.stringify(list));
    }
    const current = getCurrentUser();
    if (current.email?.toLowerCase() === normalized) {
      setCurrentUser({ ...current, email_verified: true });
    }
  } catch (err) {
    console.error('Failed to mark email verified:', err);
  }
}

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
