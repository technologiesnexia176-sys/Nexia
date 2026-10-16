import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  UserProfile,
  Post,
  Comment,
  Story,
  Community,
  GroupRoom,
  Conversation,
  ChatMessage,
  ConnectionRequest,
  AppNotification,
  ReportItem,
} from '../types/index.ts';
import {
  CURRENT_USER_DEFAULT,
  INITIAL_USERS,
  INITIAL_STORIES,
  INITIAL_POSTS,
  INITIAL_COMMENTS,
  INITIAL_COMMUNITIES,
  INITIAL_ROOMS,
  INITIAL_CONVERSATIONS,
  INITIAL_MESSAGES,
  INITIAL_CONNECTIONS,
  INITIAL_NOTIFICATIONS,
  INITIAL_REPORTS,
} from '../data/initialData.ts';
import { isStoryExpired } from '../utils/safetyAndValidation.ts';

interface AppContextType {
  // Auth & Current User
  currentUser: UserProfile;
  isLoggedIn: boolean;
  login: (email: string, pass: string) => boolean;
  logout: () => void;
  register: (user: Partial<UserProfile>) => boolean;
  deleteAccount: () => void;
  updateProfile: (updated: Partial<UserProfile>) => void;
  toggleOnlineVisibility: () => void;
  setCurrentUserById: (userId: string) => void;

  // Active navigation & view state
  activeTab: 'feed' | 'discover' | 'communities' | 'messages' | 'profile';
  setActiveTab: (tab: 'feed' | 'discover' | 'communities' | 'messages' | 'profile') => void;
  viewingProfileId: string | null;
  setViewingProfileId: (id: string | null) => void;
  activeCommunityId: string | null;
  setActiveCommunityId: (id: string | null) => void;
  activeRoomId: string | null;
  setActiveRoomId: (id: string | null) => void;
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;

  // Modals
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  isSafetyOpen: boolean;
  setIsSafetyOpen: (open: boolean) => void;
  isPlusModalOpen: boolean;
  setIsPlusModalOpen: (open: boolean) => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (open: boolean) => void;
  isConnectionsModalOpen: boolean;
  setIsConnectionsModalOpen: (open: boolean) => void;
  reportingTarget: { type: 'post' | 'profile' | 'message' | 'community'; id: string; authorName: string; preview: string } | null;
  setReportingTarget: (target: { type: 'post' | 'profile' | 'message' | 'community'; id: string; authorName: string; preview: string } | null) => void;
  activeStoryId: string | null;
  setActiveStoryId: (id: string | null) => void;
  isCreateStoryOpen: boolean;
  setIsCreateStoryOpen: (open: boolean) => void;

  // Frame toggle (Android device frame or fluid full-width)
  useMobileFrame: boolean;
  setUseMobileFrame: (val: boolean) => void;

  // Social Data & Lists
  allUsers: UserProfile[];
  blockedUserIds: string[];
  blockUser: (userId: string) => void;
  unblockUser: (userId: string) => void;

  // Posts
  posts: Post[];
  createPost: (content: string, imageUrl?: string, categoryTag?: string, communityId?: string) => void;
  likePost: (postId: string) => void;
  deletePost: (postId: string) => void;
  comments: Record<string, Comment[]>;
  addComment: (postId: string, content: string) => void;

  // Stories
  stories: Story[];
  createStory: (data: { imageUrl?: string; text?: string; backgroundColor?: string; caption?: string }) => void;
  deleteStory: (storyId: string) => void;

  // Connections
  connections: ConnectionRequest[];
  sendConnectionRequest: (targetUserId: string) => void;
  acceptConnectionRequest: (requestId: string) => void;
  rejectConnectionRequest: (requestId: string) => void;
  cancelConnectionRequest: (requestId: string) => void;
  removeConnection: (targetUserId: string) => void;
  getUserConnectionStatus: (targetUserId: string) => 'none' | 'pending_sent' | 'pending_received' | 'connected';

  // Direct Messages
  conversations: Conversation[];
  messages: Record<string, ChatMessage[]>;
  sendMessage: (conversationId: string, content: string) => void;
  startOrOpenConversation: (targetUserId: string) => void;
  deleteConversation: (conversationId: string) => void;

  // Communities
  communities: Community[];
  joinCommunity: (communityId: string) => void;
  leaveCommunity: (communityId: string) => void;
  rooms: GroupRoom[];
  roomMessages: Record<string, Array<{ id: string; senderName: string; senderAvatar: string; content: string; time: string }>>;
  sendRoomMessage: (roomId: string, content: string) => void;

  // Notifications
  notifications: AppNotification[];
  markNotificationRead: (notifId: string) => void;
  markAllNotificationsRead: () => void;
  unreadNotificationsCount: number;

  // Moderation & Admin
  reports: ReportItem[];
  submitReport: (reason: ReportItem['reason'], details: string) => void;
  adminResolveReport: (reportId: string, action: 'dismiss' | 'delete_content' | 'suspend_user', notes?: string) => void;
  adminAuditLog: Array<{ id: string; action: string; timestamp: string }>;

  // Nexia Premium Subscriptions (0.99$ Pass and 1.99$ Plus)
  isPremiumPortalOpen: boolean;
  setIsPremiumPortalOpen: (open: boolean) => void;
  subscribeToTier: (tier: 'pass_99' | 'plus_199') => void;
  subscribeToPass: () => void; // 0.99$ / month
  subscribeToPlus: () => void; // 1.99$ / month
  cancelPlusSubscription: () => void;
  cancelSubscription: () => void;
  premiumTheme: 'default' | 'amethyst' | 'aurora' | 'midnight';
  setPremiumTheme: (theme: 'default' | 'amethyst' | 'aurora' | 'midnight') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load saved state or default
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('nexia_current_user');
    return saved ? JSON.parse(saved) : CURRENT_USER_DEFAULT;
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const saved = localStorage.getItem('nexia_is_logged_in');
    return saved !== null ? JSON.parse(saved) : true; // Logged in by default for seamless exploration
  });

  const [allUsers, setAllUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('nexia_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [blockedUserIds, setBlockedUserIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('nexia_blocked_users');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeTab, setActiveTab] = useState<'feed' | 'discover' | 'communities' | 'messages' | 'profile'>('feed');
  const [viewingProfileId, setViewingProfileId] = useState<string | null>(null);
  const [activeCommunityId, setActiveCommunityId] = useState<string | null>(null);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  // Modals state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSafetyOpen, setIsSafetyOpen] = useState(false);
  const [isPlusModalOpen, setIsPlusModalOpen] = useState(false);
  const [isPremiumPortalOpen, setIsPremiumPortalOpen] = useState(false);
  const [premiumTheme, setPremiumTheme] = useState<'default' | 'amethyst' | 'aurora' | 'midnight'>('default');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isConnectionsModalOpen, setIsConnectionsModalOpen] = useState(false);
  const [reportingTarget, setReportingTarget] = useState<AppContextType['reportingTarget']>(null);
  const [activeStoryId, setActiveStoryId] = useState<string | null>(null);
  const [isCreateStoryOpen, setIsCreateStoryOpen] = useState(false);

  // Mobile frame simulator toggle (desktop view can see Android mobile frame)
  const [useMobileFrame, setUseMobileFrame] = useState(false);

  // Social Data State
  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem('nexia_posts');
    return saved ? JSON.parse(saved) : INITIAL_POSTS;
  });

  const [comments, setComments] = useState<Record<string, Comment[]>>(() => {
    const saved = localStorage.getItem('nexia_comments');
    return saved ? JSON.parse(saved) : INITIAL_COMMENTS;
  });

  const [stories, setStories] = useState<Story[]>(() => {
    const saved = localStorage.getItem('nexia_stories');
    const rawStories: Story[] = saved ? JSON.parse(saved) : INITIAL_STORIES;
    // Filter expired 24h stories
    return rawStories.filter((s) => !isStoryExpired(s.createdAt));
  });

  const [connections, setConnections] = useState<ConnectionRequest[]>(() => {
    const saved = localStorage.getItem('nexia_connections');
    return saved ? JSON.parse(saved) : INITIAL_CONNECTIONS;
  });

  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem('nexia_conversations');
    return saved ? JSON.parse(saved) : INITIAL_CONVERSATIONS;
  });

  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(() => {
    const saved = localStorage.getItem('nexia_messages');
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  const [communities, setCommunities] = useState<Community[]>(() => {
    const saved = localStorage.getItem('nexia_communities');
    return saved ? JSON.parse(saved) : INITIAL_COMMUNITIES;
  });

  const [rooms] = useState<GroupRoom[]>(INITIAL_ROOMS);
  const [roomMessages, setRoomMessages] = useState<Record<string, Array<{ id: string; senderName: string; senderAvatar: string; content: string; time: string }>>>({
    room_otaku: [
      { id: 'rm1', senderName: 'Valentina Vega', senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80', content: '¿Alguien más está siguiendo las novedades del manga?', time: '17:30' },
      { id: 'rm2', senderName: 'Daniel Torres', senderAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80', content: '¡Sí! Los últimos giros de guión han sido asombrosos.', time: '17:35' },
    ],
    room_vip_premium: [
      { id: 'rvp1', senderName: 'Mateo Silva', senderAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80', content: '¡Bienvenidos al Lounge VIP de Nexia! Espacio exclusivo para miembros de $0.99 y $1.99.', time: '12:00' },
      { id: 'rvp2', senderName: 'Valentina Vega', senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80', content: '¡Hola a todos! Este espacio es genial para compartir proyectos y eventos antes que nadie.', time: '12:15' },
    ],
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('nexia_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [reports, setReports] = useState<ReportItem[]>(() => {
    const saved = localStorage.getItem('nexia_reports');
    return saved ? JSON.parse(saved) : INITIAL_REPORTS;
  });

  const [adminAuditLog, setAdminAuditLog] = useState<Array<{ id: string; action: string; timestamp: string }>>([
    { id: 'log_1', action: 'Sistema de seguridad Nexia iniciado.', timestamp: '2026-03-14 09:00' },
    { id: 'log_2', action: 'Reporte rep_1 registrado y puesto en cola de revisión.', timestamp: '2026-03-14 10:05' },
  ]);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('nexia_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('nexia_is_logged_in', JSON.stringify(isLoggedIn));
  }, [isLoggedIn]);

  useEffect(() => {
    localStorage.setItem('nexia_users', JSON.stringify(allUsers));
  }, [allUsers]);

  useEffect(() => {
    localStorage.setItem('nexia_blocked_users', JSON.stringify(blockedUserIds));
  }, [blockedUserIds]);

  useEffect(() => {
    localStorage.setItem('nexia_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('nexia_comments', JSON.stringify(comments));
  }, [comments]);

  useEffect(() => {
    localStorage.setItem('nexia_stories', JSON.stringify(stories));
  }, [stories]);

  useEffect(() => {
    localStorage.setItem('nexia_connections', JSON.stringify(connections));
  }, [connections]);

  useEffect(() => {
    localStorage.setItem('nexia_conversations', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem('nexia_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('nexia_communities', JSON.stringify(communities));
  }, [communities]);

  useEffect(() => {
    localStorage.setItem('nexia_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('nexia_reports', JSON.stringify(reports));
  }, [reports]);

  // Auth functions
  const login = (email: string) => {
    const existing = allUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      setCurrentUser(existing);
    }
    setIsLoggedIn(true);
    setIsAuthModalOpen(false);
    return true;
  };

  const logout = () => {
    setIsLoggedIn(false);
    setIsAuthModalOpen(true);
  };

  const register = (user: Partial<UserProfile>) => {
    const newUser: UserProfile = {
      ...CURRENT_USER_DEFAULT,
      ...user,
      id: `user_${Date.now()}`,
      username: user.username ? user.username.replace('@', '') : `user_${Date.now().toString().slice(-4)}`,
      emailVerified: true,
      identityVerified: false,
      isPlusSubscriber: false,
      role: 'user',
      createdAt: new Date().toISOString(),
    };
    setAllUsers((prev) => [newUser, ...prev]);
    setCurrentUser(newUser);
    setIsLoggedIn(true);
    setIsAuthModalOpen(false);
    return true;
  };

  const deleteAccount = () => {
    // Real deletion: purge user's posts, stories, connections, and set logged out
    const uid = currentUser.id;
    setPosts((prev) => prev.filter((p) => p.userId !== uid));
    setStories((prev) => prev.filter((s) => s.userId !== uid));
    setConnections((prev) => prev.filter((c) => c.fromUserId !== uid && c.toUserId !== uid));
    setAllUsers((prev) => prev.filter((u) => u.id !== uid));
    setIsLoggedIn(false);
    setIsSettingsOpen(false);
    localStorage.removeItem('nexia_current_user');
  };

  const updateProfile = (updated: Partial<UserProfile>) => {
    setCurrentUser((prev) => {
      const next = { ...prev, ...updated };
      setAllUsers((users) => users.map((u) => (u.id === prev.id ? next : u)));
      return next;
    });
  };

  const toggleOnlineVisibility = () => {
    updateProfile({ showOnlineStatus: !currentUser.showOnlineStatus });
  };

  const setCurrentUserById = (userId: string) => {
    const found = allUsers.find((u) => u.id === userId);
    if (found) {
      setCurrentUser(found);
    }
  };

  // Block / Unblock user
  const blockUser = (userId: string) => {
    if (!blockedUserIds.includes(userId)) {
      setBlockedUserIds((prev) => [...prev, userId]);
      // Remove any connection
      setConnections((prev) => prev.filter((c) => 
        !( (c.fromUserId === currentUser.id && c.toUserId === userId) || 
           (c.fromUserId === userId && c.toUserId === currentUser.id) )
      ));
      // Log admin audit
      setAdminAuditLog((prev) => [
        { id: `audit_${Date.now()}`, action: `Usuario ${currentUser.name} bloqueó a ${userId}`, timestamp: new Date().toLocaleTimeString() },
        ...prev,
      ]);
    }
  };

  const unblockUser = (userId: string) => {
    setBlockedUserIds((prev) => prev.filter((id) => id !== userId));
  };

  // Posts
  const createPost = (content: string, imageUrl?: string, categoryTag?: string, communityId?: string) => {
    const targetCommunity = communityId ? communities.find((c) => c.id === communityId) : undefined;
    const newPost: Post = {
      id: `post_${Date.now()}`,
      userId: currentUser.id,
      authorName: currentUser.name,
      authorUsername: currentUser.username,
      authorAvatar: currentUser.avatar,
      content,
      imageUrl,
      categoryTag: categoryTag || (targetCommunity ? targetCommunity.category : 'General'),
      communityId,
      communityName: targetCommunity ? targetCommunity.name : undefined,
      createdAt: 'Hace un momento',
      likes: [],
      commentsCount: 0,
      visibility: currentUser.profileVisibility,
    };
    setPosts((prev) => [newPost, ...prev]);
  };

  const likePost = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const hasLiked = p.likes.includes(currentUser.id);
        const nextLikes = hasLiked
          ? p.likes.filter((uid) => uid !== currentUser.id)
          : [...p.likes, currentUser.id];
        return { ...p, likes: nextLikes };
      })
    );
  };

  const deletePost = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  const addComment = (postId: string, content: string) => {
    const newComment: Comment = {
      id: `comm_${Date.now()}`,
      postId,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      content,
      createdAt: 'Hace un momento',
    };
    setComments((prev) => ({
      ...prev,
      [postId]: [...(prev[postId] || []), newComment],
    }));
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, commentsCount: p.commentsCount + 1 } : p))
    );
  };

  // Stories (24 hours expiry)
  const createStory = (data: { imageUrl?: string; text?: string; backgroundColor?: string; caption?: string }) => {
    const now = Date.now();
    const newStory: Story = {
      id: `story_${Date.now()}`,
      userId: currentUser.id,
      authorName: currentUser.name,
      authorUsername: currentUser.username,
      authorAvatar: currentUser.avatar,
      imageUrl: data.imageUrl,
      text: data.text,
      backgroundColor: data.backgroundColor || '#7C3AED',
      caption: data.caption,
      createdAt: now,
      expiresAt: now + 24 * 60 * 60 * 1000,
    };
    setStories((prev) => [newStory, ...prev]);
    setIsCreateStoryOpen(false);
  };

  const deleteStory = (storyId: string) => {
    setStories((prev) => prev.filter((s) => s.id !== storyId));
    if (activeStoryId === storyId) setActiveStoryId(null);
  };

  // Connections
  const sendConnectionRequest = (targetUserId: string) => {
    if (targetUserId === currentUser.id) return;
    const existing = connections.find(
      (c) =>
        (c.fromUserId === currentUser.id && c.toUserId === targetUserId) ||
        (c.fromUserId === targetUserId && c.toUserId === currentUser.id)
    );
    if (!existing) {
      const newReq: ConnectionRequest = {
        id: `conn_${Date.now()}`,
        fromUserId: currentUser.id,
        toUserId: targetUserId,
        status: 'pending',
        createdAt: 'Hoy',
      };
      setConnections((prev) => [...prev, newReq]);
    }
  };

  const acceptConnectionRequest = (requestId: string) => {
    setConnections((prev) =>
      prev.map((c) => (c.id === requestId ? { ...c, status: 'accepted' } : c))
    );
  };

  const rejectConnectionRequest = (requestId: string) => {
    setConnections((prev) =>
      prev.map((c) => (c.id === requestId ? { ...c, status: 'rejected' } : c))
    );
  };

  const cancelConnectionRequest = (requestId: string) => {
    setConnections((prev) => prev.filter((c) => c.id !== requestId));
  };

  const removeConnection = (targetUserId: string) => {
    setConnections((prev) =>
      prev.filter(
        (c) =>
          !(
            (c.fromUserId === currentUser.id && c.toUserId === targetUserId) ||
            (c.fromUserId === targetUserId && c.toUserId === currentUser.id)
          )
      )
    );
  };

  const getUserConnectionStatus = (targetUserId: string): 'none' | 'pending_sent' | 'pending_received' | 'connected' => {
    const conn = connections.find(
      (c) =>
        (c.fromUserId === currentUser.id && c.toUserId === targetUserId) ||
        (c.fromUserId === targetUserId && c.toUserId === currentUser.id)
    );
    if (!conn) return 'none';
    if (conn.status === 'accepted') return 'connected';
    if (conn.status === 'pending') {
      return conn.fromUserId === currentUser.id ? 'pending_sent' : 'pending_received';
    }
    return 'none';
  };

  // Direct Messages
  const sendMessage = (conversationId: string, content: string) => {
    const conv = conversations.find((c) => c.id === conversationId);
    if (!conv) return;
    const recipientId = conv.participantIds.find((id) => id !== currentUser.id);

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      conversationId,
      senderId: currentUser.id,
      receiverId: recipientId,
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: false,
    };

    setMessages((prev) => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), newMsg],
    }));

    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId
          ? {
              ...c,
              lastMessage: content,
              lastMessageTimestamp: 'Ahora',
            }
          : c
      )
    );

    // Friendly auto-reply after 2.5s if talking to a demo user
    if (recipientId && recipientId !== currentUser.id) {
      setTimeout(() => {
        const replyMsg: ChatMessage = {
          id: `msg_${Date.now() + 1}`,
          conversationId,
          senderId: recipientId,
          receiverId: currentUser.id,
          content: '¡Qué buen punto! Me alegra que conectemos en Nexia. ¡Seguimos en contacto!',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isRead: true,
        };
        setMessages((prev) => ({
          ...prev,
          [conversationId]: [...(prev[conversationId] || []), replyMsg],
        }));
        setConversations((prev) =>
          prev.map((c) =>
            c.id === conversationId
              ? {
                  ...c,
                  lastMessage: replyMsg.content,
                  lastMessageTimestamp: 'Ahora',
                }
              : c
          )
        );
      }, 2500);
    }
  };

  const startOrOpenConversation = (targetUserId: string) => {
    let conv = conversations.find((c) =>
      c.participantIds.includes(currentUser.id) && c.participantIds.includes(targetUserId)
    );
    if (!conv) {
      conv = {
        id: `conv_${Date.now()}`,
        participantIds: [currentUser.id, targetUserId],
        lastMessage: 'Conversación iniciada',
        lastMessageTimestamp: 'Ahora',
        unreadCount: 0,
      };
      setConversations((prev) => [conv!, ...prev]);
    }
    setActiveConversationId(conv.id);
    setActiveTab('messages');
  };

  const deleteConversation = (conversationId: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== conversationId));
    setMessages((prev) => {
      const next = { ...prev };
      delete next[conversationId];
      return next;
    });
    if (activeConversationId === conversationId) setActiveConversationId(null);
  };

  // Communities & Rooms
  const joinCommunity = (communityId: string) => {
    setCommunities((prev) =>
      prev.map((comm) => {
        if (comm.id !== communityId) return comm;
        if (comm.memberIds.includes(currentUser.id)) return comm;
        return {
          ...comm,
          memberIds: [...comm.memberIds, currentUser.id],
          membersCount: comm.membersCount + 1,
        };
      })
    );
  };

  const leaveCommunity = (communityId: string) => {
    setCommunities((prev) =>
      prev.map((comm) => {
        if (comm.id !== communityId) return comm;
        return {
          ...comm,
          memberIds: comm.memberIds.filter((id) => id !== currentUser.id),
          membersCount: Math.max(0, comm.membersCount - 1),
        };
      })
    );
  };

  const sendRoomMessage = (roomId: string, content: string) => {
    const newMsg = {
      id: `rm_${Date.now()}`,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      content,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setRoomMessages((prev) => ({
      ...prev,
      [roomId]: [...(prev[roomId] || []), newMsg],
    }));
  };

  // Notifications
  const markNotificationRead = (notifId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.isRead).length;

  // Reports & Moderation
  const submitReport = (reason: ReportItem['reason'], details: string) => {
    if (!reportingTarget) return;
    const newReport: ReportItem = {
      id: `rep_${Date.now()}`,
      reporterUserId: currentUser.id,
      reporterName: currentUser.name,
      targetType: reportingTarget.type,
      targetId: reportingTarget.id,
      targetAuthorName: reportingTarget.authorName,
      targetPreview: reportingTarget.preview,
      reason,
      details,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setReports((prev) => [newReport, ...prev]);
    setReportingTarget(null);
    setAdminAuditLog((prev) => [
      { id: `audit_${Date.now()}`, action: `Nuevo reporte recibido: ${reason} contra ${reportingTarget.authorName}`, timestamp: new Date().toLocaleTimeString() },
      ...prev,
    ]);
  };

  const adminResolveReport = (reportId: string, action: 'dismiss' | 'delete_content' | 'suspend_user', notes?: string) => {
    const rep = reports.find((r) => r.id === reportId);
    if (!rep) return;

    if (action === 'delete_content') {
      if (rep.targetType === 'post') {
        deletePost(rep.targetId);
      }
    } else if (action === 'suspend_user') {
      setAllUsers((prev) =>
        prev.map((u) => (u.id === rep.targetId ? { ...u, isSuspended: true } : u))
      );
    }

    setReports((prev) =>
      prev.map((r) =>
        r.id === reportId
          ? {
              ...r,
              status: action === 'dismiss' ? 'dismissed' : 'action_taken',
              actionTakenNotes: notes || `Acción aplicada: ${action}`,
            }
          : r
      )
    );

    setAdminAuditLog((prev) => [
      { id: `audit_${Date.now()}`, action: `Reporte ${reportId} resuelto con acción: ${action}`, timestamp: new Date().toLocaleTimeString() },
      ...prev,
    ]);
  };

  // Nexia Subscriptions (0.99$ Pass and 1.99$ Plus)
  const subscribeToTier = (tier: 'pass_99' | 'plus_199') => {
    updateProfile({
      subscriptionTier: tier,
      isPlusSubscriber: tier === 'plus_199',
    });
    setIsPlusModalOpen(false);
  };

  const subscribeToPass = () => {
    subscribeToTier('pass_99');
  };

  const subscribeToPlus = () => {
    subscribeToTier('plus_199');
  };

  const cancelSubscription = () => {
    updateProfile({
      subscriptionTier: 'free',
      isPlusSubscriber: false,
    });
  };

  const cancelPlusSubscription = () => {
    cancelSubscription();
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        isLoggedIn,
        login,
        logout,
        register,
        deleteAccount,
        updateProfile,
        toggleOnlineVisibility,
        setCurrentUserById,
        activeTab,
        setActiveTab,
        viewingProfileId,
        setViewingProfileId,
        activeCommunityId,
        setActiveCommunityId,
        activeRoomId,
        setActiveRoomId,
        activeConversationId,
        setActiveConversationId,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isSettingsOpen,
        setIsSettingsOpen,
        isSafetyOpen,
        setIsSafetyOpen,
        isPlusModalOpen,
        setIsPlusModalOpen,
        isAdminOpen,
        setIsAdminOpen,
        isNotificationsOpen,
        setIsNotificationsOpen,
        isConnectionsModalOpen,
        setIsConnectionsModalOpen,
        reportingTarget,
        setReportingTarget,
        activeStoryId,
        setActiveStoryId,
        isCreateStoryOpen,
        setIsCreateStoryOpen,
        useMobileFrame,
        setUseMobileFrame,
        allUsers,
        blockedUserIds,
        blockUser,
        unblockUser,
        posts,
        createPost,
        likePost,
        deletePost,
        comments,
        addComment,
        stories,
        createStory,
        deleteStory,
        connections,
        sendConnectionRequest,
        acceptConnectionRequest,
        rejectConnectionRequest,
        cancelConnectionRequest,
        removeConnection,
        getUserConnectionStatus,
        conversations,
        messages,
        sendMessage,
        startOrOpenConversation,
        deleteConversation,
        communities,
        joinCommunity,
        leaveCommunity,
        rooms,
        roomMessages,
        sendRoomMessage,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        unreadNotificationsCount,
        reports,
        submitReport,
        adminResolveReport,
        adminAuditLog,
        isPremiumPortalOpen,
        setIsPremiumPortalOpen,
        subscribeToTier,
        subscribeToPass,
        subscribeToPlus,
        cancelPlusSubscription,
        cancelSubscription,
        premiumTheme,
        setPremiumTheme,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
