export type ConnectionType = 
  | 'Amistad'
  | 'Conversación'
  | 'Comunidad'
  | 'Relación romántica'
  | 'Intereses similares';

export type UserRole = 'user' | 'admin' | 'moderator';

export interface UserProfile {
  id: string;
  name: string;
  username: string; // unique handle @username
  email: string;
  avatar: string;
  photos: string[];
  birthDate: string; // YYYY-MM-DD
  age: number;
  country?: string;
  city?: string;
  bio: string;
  languages: string[];
  interests: string[];
  hobbies: string[];
  favoriteMusic: string[];
  favoriteMovies: string[];
  favoriteAnime: string[];
  favoriteGames: string[];
  connectionType: ConnectionType;
  showOnlineStatus: boolean;
  isOnline: boolean;
  profileVisibility: 'public' | 'connections_only';
  allowMessagesFrom: 'all' | 'connections_only';
  emailVerified: boolean;
  identityVerified: boolean;
  isPlusSubscriber: boolean;
  subscriptionTier?: 'free' | 'pass_99' | 'plus_199';
  role: UserRole;
  isSuspended?: boolean;
  createdAt: string;
}

export interface Story {
  id: string;
  userId: string;
  authorName: string;
  authorUsername: string;
  authorAvatar: string;
  imageUrl?: string;
  text?: string;
  backgroundColor?: string;
  caption?: string;
  createdAt: number; // timestamp in ms
  expiresAt: number; // createdAt + 24 * 60 * 60 * 1000
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  createdAt: string;
}

export interface Post {
  id: string;
  userId: string;
  authorName: string;
  authorUsername: string;
  authorAvatar: string;
  content: string;
  imageUrl?: string;
  categoryTag?: string; // e.g., 'Anime', 'Videojuegos', 'Música', 'Amistad'
  communityId?: string;
  communityName?: string;
  createdAt: string;
  likes: string[]; // array of user IDs
  commentsCount: number;
  visibility: 'public' | 'connections_only';
  isReported?: boolean;
}

export interface Community {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  coverImage: string;
  icon: string;
  rules: string[];
  membersCount: number;
  memberIds: string[];
  isOfficial?: boolean;
  createdAt: string;
}

export interface GroupRoom {
  id: string;
  communityId?: string;
  name: string;
  description: string;
  category: string;
  rules: string[];
  activeUsersCount: number;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId?: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  participantIds: string[]; // [userA, userB]
  lastMessage?: string;
  lastMessageTimestamp?: string;
  unreadCount: number;
}

export interface ConnectionRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled';
  createdAt: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'connection_request' | 'connection_accepted' | 'message' | 'reaction' | 'comment' | 'community';
  relatedId?: string; // post ID, user ID, etc.
  createdAt: string;
  isRead: boolean;
}

export interface ReportItem {
  id: string;
  reporterUserId: string;
  reporterName: string;
  targetType: 'post' | 'profile' | 'message' | 'community';
  targetId: string;
  targetAuthorName: string;
  targetPreview: string;
  reason: 'Acoso o intimidación' | 'Contenido inapropiado o explícito' | 'Spam o estafa' | 'Suplantación de identidad' | 'Amenazas o incitación al odio' | 'Otro';
  details: string;
  status: 'pending' | 'reviewed' | 'action_taken' | 'dismissed';
  createdAt: string;
  actionTakenNotes?: string;
}
