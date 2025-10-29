// Mock User and Unsubscribe types to avoid Firebase dependency
// These are simplified versions of the Firebase types.
export interface User {
  uid: string;
  isAnonymous: boolean;
}
export type Unsubscribe = () => void;


// --- Mock Authentication and Database Service ---
// This service mimics the Firebase service using localStorage for offline functionality.

const LOCAL_STORAGE_XP_KEY = 'eco-maths-xp';
const LOCAL_STORAGE_UID_KEY = 'eco-maths-uid';

let totalXp = 0;
let mockUser: User | null = null;
const xpListeners: Set<(xp: number) => void> = new Set();

// Helper to get a consistent UID for the anonymous user
function getMockUid(): string {
    let uid = localStorage.getItem(LOCAL_STORAGE_UID_KEY);
    if (!uid) {
        uid = `anonymous-${Date.now()}-${Math.random().toString(36).substring(2)}`;
        localStorage.setItem(LOCAL_STORAGE_UID_KEY, uid);
    }
    return uid;
}

// Load initial XP from localStorage on startup
try {
    const storedXp = localStorage.getItem(LOCAL_STORAGE_XP_KEY);
    if (storedXp) {
        totalXp = parseInt(storedXp, 10) || 0;
    }
} catch (e) {
    console.error("Could not load XP from localStorage", e);
    totalXp = 0;
}


/**
 * Notifies all active listeners about the current XP total.
 */
function notifyListeners(): void {
  xpListeners.forEach(callback => callback(totalXp));
}

/**
 * Simulates watching for an authenticated user.
 * Creates and returns a mock anonymous user.
 * @param callback - A function that is called with the mock user object.
 * @returns An unsubscribe function (no-op).
 */
export function watchUser(callback: (user: User | null) => void): Unsubscribe {
  if (!mockUser) {
      mockUser = {
          uid: getMockUid(),
          isAnonymous: true,
      };
  }
  // Call the callback asynchronously to mimic real-world behavior
  setTimeout(() => callback(mockUser), 0);
  
  // Return a no-op unsubscribe function as the user state is static
  return () => {};
}

/**
 * Adds the earned XP to the local total and persists to localStorage.
 * @param uid The user's unique ID (ignored in this mock).
 * @param earned The amount of XP earned.
 */
export async function addXp(uid: string, earned: number): Promise<void> {
  if (earned <= 0) return;
  
  totalXp += earned;
  
  try {
      localStorage.setItem(LOCAL_STORAGE_XP_KEY, String(totalXp));
  } catch(e) {
      console.error("Could not save XP to localStorage", e);
  }
  
  notifyListeners();
}

/**
 * Watches the local XP total for changes.
 * @param uid The user's unique ID (ignored in this mock).
 * @param callback A function to call with the new total XP.
 * @returns An unsubscribe function for the listener.
 */
export function watchTotalXp(uid: string, callback: (xp: number) => void): Unsubscribe {
  xpListeners.add(callback);
  
  // Immediately provide the current value
  callback(totalXp);
  
  // Return a function to remove the listener
  return () => {
    xpListeners.delete(callback);
  };
}
