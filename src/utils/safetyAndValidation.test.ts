import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateAge,
  isEligibleAdult,
  isStoryExpired,
  checkHarmfulContent,
  filterPostsForUser,
  matchesDiscoveryFilter,
  canAccessVipLounge,
  getMaxProfilePhotos,
  getSubscriptionBadge,
} from './safetyAndValidation.ts';
import type { Post, UserProfile } from '../types/index.ts';

test('calculateAge calculates correct age based on reference date', () => {
  const ref = new Date('2026-10-14T00:00:00Z');
  // Born 2004-10-13 -> 22 years old
  assert.equal(calculateAge('2004-10-13', ref), 22);
  // Born 2004-10-15 -> 21 years old (birthday hasn't occurred yet in reference year)
  assert.equal(calculateAge('2004-10-15', ref), 21);
  // Empty or invalid input
  assert.equal(calculateAge(''), 0);
  assert.equal(calculateAge('invalid-date'), 0);
});

test('isEligibleAdult requires age 18 or older', () => {
  // Assuming current year >= 2026
  assert.equal(isEligibleAdult('2000-01-01'), true);
  // Born recently -> under 18
  assert.equal(isEligibleAdult('2020-01-01'), false);
});

test('isStoryExpired enforces 24-hour expiration limit', () => {
  const baseTime = 1700000000000;
  const under24h = baseTime + 23 * 60 * 60 * 1000;
  const exactly24h = baseTime + 24 * 60 * 60 * 1000;
  const over24h = baseTime + 25 * 60 * 60 * 1000;

  assert.equal(isStoryExpired(baseTime, under24h), false);
  assert.equal(isStoryExpired(baseTime, exactly24h), true);
  assert.equal(isStoryExpired(baseTime, over24h), true);
});

test('checkHarmfulContent flags prohibited harassment or threat text', () => {
  const safe = checkHarmfulContent('¡Hola a todos! Me encanta el anime y los videojuegos retro.');
  assert.equal(safe.isFlagged, false);

  const harmful = checkHarmfulContent('te voy a matar si no respondes');
  assert.equal(harmful.isFlagged, true);
  assert.ok(harmful.reasons.length > 0);
});

test('filterPostsForUser filters out posts from blocked users and enforces connections_only', () => {
  const samplePosts: Post[] = [
    {
      id: 'p1',
      userId: 'u1',
      authorName: 'User 1',
      authorUsername: 'u1',
      authorAvatar: '',
      content: 'Public post',
      createdAt: '2026-10-10',
      likes: [],
      commentsCount: 0,
      visibility: 'public',
    },
    {
      id: 'p2',
      userId: 'bad_user',
      authorName: 'Bad User',
      authorUsername: 'bad',
      authorAvatar: '',
      content: 'Spam post',
      createdAt: '2026-10-10',
      likes: [],
      commentsCount: 0,
      visibility: 'public',
    },
    {
      id: 'p3',
      userId: 'friend_user',
      authorName: 'Friend',
      authorUsername: 'friend',
      authorAvatar: '',
      content: 'Friends only post',
      createdAt: '2026-10-10',
      likes: [],
      commentsCount: 0,
      visibility: 'connections_only',
    },
    {
      id: 'p4',
      userId: 'stranger_user',
      authorName: 'Stranger',
      authorUsername: 'stranger',
      authorAvatar: '',
      content: 'Stranger friends only',
      createdAt: '2026-10-10',
      likes: [],
      commentsCount: 0,
      visibility: 'connections_only',
    },
  ];

  const filtered = filterPostsForUser(
    samplePosts,
    ['bad_user'],
    'my_user_id',
    ['friend_user']
  );

  const ids = filtered.map((p) => p.id);
  assert.ok(ids.includes('p1'), 'Public post should be included');
  assert.ok(!ids.includes('p2'), 'Blocked user post should be removed');
  assert.ok(ids.includes('p3'), 'Connected friend post should be visible');
  assert.ok(!ids.includes('p4'), 'Stranger connection_only post should be excluded');
});

test('matchesDiscoveryFilter checks country, interest and connection type', () => {
  const user: UserProfile = {
    id: 'u10',
    name: 'Sofia Martinez',
    username: 'sofia_m',
    email: 'sofia@example.com',
    avatar: '',
    photos: [],
    birthDate: '2001-05-12',
    age: 25,
    country: 'México',
    city: 'Guadalajara',
    bio: 'Fanática de Studio Ghibli y café',
    languages: ['Español', 'Inglés'],
    interests: ['Anime', 'Fotografía'],
    hobbies: ['Cosplay'],
    favoriteMusic: ['Indie Rock'],
    favoriteMovies: ['Spirited Away'],
    favoriteAnime: ['Frieren'],
    favoriteGames: ['Zelda'],
    connectionType: 'Amistad',
    showOnlineStatus: true,
    isOnline: true,
    profileVisibility: 'public',
    allowMessagesFrom: 'all',
    emailVerified: true,
    identityVerified: false,
    isPlusSubscriber: false,
    role: 'user',
    createdAt: '2026-01-01',
  };

  assert.equal(matchesDiscoveryFilter(user, { country: 'México' }), true);
  assert.equal(matchesDiscoveryFilter(user, { country: 'España' }), false);
  assert.equal(matchesDiscoveryFilter(user, { connectionType: 'Amistad' }), true);
  assert.equal(matchesDiscoveryFilter(user, { connectionType: 'Relación romántica' }), false);
  assert.equal(matchesDiscoveryFilter(user, { interest: 'Anime' }), true);
  assert.equal(matchesDiscoveryFilter(user, { interest: 'Fútbol' }), false);
  assert.equal(matchesDiscoveryFilter(user, { query: 'Ghibli' }), true);
  assert.equal(matchesDiscoveryFilter(user, { query: 'Desconocido123' }), false);
});

test('canAccessVipLounge allows pass_99 and plus_199 but not free', () => {
  assert.equal(canAccessVipLounge('free'), false);
  assert.equal(canAccessVipLounge(undefined), false);
  assert.equal(canAccessVipLounge('pass_99'), true);
  assert.equal(canAccessVipLounge('plus_199'), true);
});

test('getMaxProfilePhotos scales with subscription tier', () => {
  assert.equal(getMaxProfilePhotos('free'), 3);
  assert.equal(getMaxProfilePhotos(undefined), 3);
  assert.equal(getMaxProfilePhotos('pass_99'), 5);
  assert.equal(getMaxProfilePhotos('plus_199'), 8);
});

test('getSubscriptionBadge returns correct metadata', () => {
  assert.equal(getSubscriptionBadge('free'), null);
  const pass = getSubscriptionBadge('pass_99');
  assert.equal(pass?.label, 'Nexia Pass');
  assert.equal(pass?.price, 'US$0.99/mes');
  const plus = getSubscriptionBadge('plus_199');
  assert.equal(plus?.label, 'Nexia Plus');
  assert.equal(plus?.price, 'US$1.99/mes');
});
