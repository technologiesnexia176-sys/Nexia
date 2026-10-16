import type { Post, UserProfile } from '../types/index.ts';

/**
 * Calculates user age based on YYYY-MM-DD birthdate.
 */
export function calculateAge(birthDateString: string, referenceDate: Date = new Date()): number {
  if (!birthDateString) return 0;
  const birth = new Date(birthDateString);
  if (isNaN(birth.getTime())) return 0;

  let age = referenceDate.getFullYear() - birth.getFullYear();
  const m = referenceDate.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && referenceDate.getDate() < birth.getDate())) {
    age--;
  }
  return age >= 0 ? age : 0;
}

/**
 * Checks if the user is an eligible adult (18+ required by Nexia terms).
 */
export function isEligibleAdult(birthDateString: string, minAge: number = 18): boolean {
  const age = calculateAge(birthDateString);
  return age >= minAge;
}

/**
 * Validates if a 24-hour story has expired.
 */
export function isStoryExpired(createdAtMs: number, currentMs: number = Date.now()): boolean {
  const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;
  return currentMs - createdAtMs >= TWENTY_FOUR_HOURS_MS;
}

/**
 * Detects prohibited content according to community guidelines.
 * Filters harassment, threats, and illegal/abusive material.
 */
export function checkHarmfulContent(text: string): { isFlagged: boolean; reasons: string[] } {
  if (!text || typeof text !== 'string') return { isFlagged: false, reasons: [] };

  const lower = text.toLowerCase();
  const reasons: string[] = [];

  const harassmentTriggers = ['morite', 'te voy a matar', 'amenaza de muerte', 'suicidate'];
  const hateSpeechTriggers = ['odio racial', 'supremacismo', 'ataque discriminatorio'];
  const scamTriggers = ['gana dinero facil en 24h', 'transferencia cripto estafa', 'hackeo cuentas'];

  for (const trigger of harassmentTriggers) {
    if (lower.includes(trigger)) {
      reasons.push('Violación de normas contra amenazas o acoso');
      break;
    }
  }

  for (const trigger of hateSpeechTriggers) {
    if (lower.includes(trigger)) {
      reasons.push('Incitación al odio o discriminación');
      break;
    }
  }

  for (const trigger of scamTriggers) {
    if (lower.includes(trigger)) {
      reasons.push('Spam o actividad fraudulenta');
      break;
    }
  }

  return {
    isFlagged: reasons.length > 0,
    reasons,
  };
}

/**
 * Filters posts for a user, respecting block lists and privacy settings.
 */
export function filterPostsForUser(
  posts: Post[],
  blockedUserIds: string[],
  currentUserId?: string,
  userConnectionIds: string[] = []
): Post[] {
  const blockedSet = new Set(blockedUserIds);
  const connectionSet = new Set(userConnectionIds);

  return posts.filter((post) => {
    // Exclude posts from blocked users
    if (blockedSet.has(post.userId)) return false;

    // Check post visibility
    if (post.visibility === 'connections_only') {
      const isAuthor = currentUserId && post.userId === currentUserId;
      const isConnected = currentUserId && connectionSet.has(post.userId);
      if (!isAuthor && !isConnected) return false;
    }

    return true;
  });
}

/**
 * Evaluates whether a profile matches given discovery filters.
 */
export function matchesDiscoveryFilter(
  user: UserProfile,
  filters: {
    country?: string;
    language?: string;
    connectionType?: string;
    interest?: string;
    query?: string;
  }
): boolean {
  if (user.isSuspended) return false;

  if (filters.country && filters.country !== 'all') {
    if (!user.country || user.country.toLowerCase() !== filters.country.toLowerCase()) {
      return false;
    }
  }

  if (filters.language && filters.language !== 'all') {
    if (!user.languages || !user.languages.some((l) => l.toLowerCase() === filters.language!.toLowerCase())) {
      return false;
    }
  }

  if (filters.connectionType && filters.connectionType !== 'all') {
    if (user.connectionType !== filters.connectionType) {
      return false;
    }
  }

  if (filters.interest && filters.interest !== 'all') {
    const allTags = [...(user.interests || []), ...(user.hobbies || []), ...(user.favoriteGames || []), ...(user.favoriteAnime || [])];
    const hasTag = allTags.some((tag) => tag.toLowerCase() === filters.interest!.toLowerCase());
    if (!hasTag) return false;
  }

  if (filters.query && filters.query.trim() !== '') {
    const q = filters.query.toLowerCase().trim();
    const inName = user.name.toLowerCase().includes(q);
    const inUser = user.username.toLowerCase().includes(q);
    const inBio = user.bio ? user.bio.toLowerCase().includes(q) : false;
    const inInterests = (user.interests || []).some((i) => i.toLowerCase().includes(q));
    if (!inName && !inUser && !inBio && !inInterests) {
      return false;
    }
  }

  return true;
}

/**
 * Validates if a user tier has access to VIP premium features.
 * Both the $0.99/mo (pass_99) and $1.99/mo (plus_199) have VIP lounge access.
 */
export function canAccessVipLounge(tier?: 'free' | 'pass_99' | 'plus_199'): boolean {
  return tier === 'pass_99' || tier === 'plus_199';
}

/**
 * Returns allowed photo count limit according to subscription tier.
 */
export function getMaxProfilePhotos(tier?: 'free' | 'pass_99' | 'plus_199'): number {
  if (tier === 'plus_199') return 8;
  if (tier === 'pass_99') return 5;
  return 3;
}

/**
 * Returns metadata for the user's subscription tier.
 */
export function getSubscriptionBadge(tier?: 'free' | 'pass_99' | 'plus_199'): { label: string; color: string; price: string } | null {
  if (tier === 'plus_199') {
    return { label: 'Nexia Plus', color: 'from-amber-400 to-amber-600', price: 'US$1.99/mes' };
  }
  if (tier === 'pass_99') {
    return { label: 'Nexia Pass', color: 'from-violet-500 to-purple-600', price: 'US$0.99/mes' };
  }
  return null;
}
