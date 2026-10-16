import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { StoriesBar } from './StoriesBar.tsx';
import { CreatePostBox } from './CreatePostBox.tsx';
import { PostCard } from './PostCard.tsx';
import { filterPostsForUser } from '../../utils/safetyAndValidation.ts';
import { Users, Compass, Sparkles, Filter, Crown } from 'lucide-react';

export const FeedView: React.FC = () => {
  const {
    posts,
    blockedUserIds,
    currentUser,
    connections,
    communities,
    allUsers,
    setActiveTab,
    setActiveCommunityId,
    setViewingProfileId,
    setIsPremiumPortalOpen,
  } = useApp();

  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');

  const userConnectionIds = connections
    .filter((c) => c.status === 'accepted')
    .map((c) => (c.fromUserId === currentUser.id ? c.toUserId : c.fromUserId));

  // Filter posts respecting blocks and privacy
  const filteredPosts = filterPostsForUser(
    posts,
    blockedUserIds,
    currentUser.id,
    userConnectionIds
  ).filter((p) => {
    if (activeCategoryFilter === 'all') return true;
    return p.categoryTag?.toLowerCase() === activeCategoryFilter.toLowerCase();
  });

  const categories = [
    { id: 'all', label: 'Todo' },
    { id: 'Anime y manga', label: 'Anime & Manga' },
    { id: 'Videojuegos', label: 'Videojuegos' },
    { id: 'Música', label: 'Música' },
    { id: 'Películas y series', label: 'Cine & Series' },
    { id: 'Arte y dibujo', label: 'Arte' },
  ];

  // Suggested people to discover
  const suggestedPeople = allUsers
    .filter((u) => u.id !== currentUser.id && !blockedUserIds.includes(u.id))
    .slice(0, 3);

  return (
    <div className="space-y-4 max-w-2xl mx-auto pb-12">
      {/* Stories carousel */}
      <StoriesBar />

      {/* Create new post box */}
      <CreatePostBox />

      {/* Category filter pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <Filter className="w-3.5 h-3.5 text-neutral-400 shrink-0 ml-1" />
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategoryFilter(cat.id)}
            className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 transition-all ${
              activeCategoryFilter === cat.id
                ? 'bg-violet-600 text-white shadow-xs'
                : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200/70'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Suggested Communities Banner (non-intrusive) */}
      <div className="bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-indigo-500/10 border border-violet-100 rounded-2xl p-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-violet-600 text-white flex items-center justify-center shrink-0">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-neutral-900">Comunidades de Nexia</h2>
            <p className="text-[11px] text-neutral-500">
              {communities.length} grupos activos de anime, gaming, música y más.
            </p>
          </div>
        </div>
        <button
          onClick={() => setActiveTab('communities')}
          className="text-xs font-semibold text-violet-700 bg-white hover:bg-violet-50 px-3 py-1.5 rounded-xl border border-violet-200 transition-colors shrink-0"
        >
          Explorar
        </button>
      </div>

      {/* Sitio Premium Promo Banner */}
      <div className="bg-gradient-to-r from-violet-900 via-purple-900 to-indigo-950 border border-violet-800 rounded-2xl p-3.5 text-white flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
            <Crown className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-xs font-bold">Sitio Premium Nexia</h2>
              <span className="text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 px-1.5 py-0.2 rounded-full">
                0.99$ / mes
              </span>
            </div>
            <p className="text-[11px] text-violet-200">
              Desbloquea la Sala VIP Premium Lounge y personalización exclusiva.
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsPremiumPortalOpen(true)}
          className="text-xs font-bold text-neutral-900 bg-amber-300 hover:bg-amber-400 px-3 py-1.5 rounded-xl shadow-xs transition-colors shrink-0"
        >
          Ver Club
        </button>
      </div>

      {/* Social Feed Posts */}
      <div className="space-y-4">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => <PostCard key={post.id} post={post} />)
        ) : (
          <div className="bg-white rounded-2xl p-8 text-center border border-neutral-200/80 space-y-2">
            <Sparkles className="w-8 h-8 text-violet-400 mx-auto" />
            <h2 className="font-bold text-sm text-neutral-800">No hay publicaciones en esta categoría</h2>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              ¡Sé el primero en publicar una reseña de anime, logro de videojuegos o canción favorita!
            </p>
          </div>
        )}
      </div>

      {/* Suggested People quick discovery */}
      {suggestedPeople.length > 0 && (
        <div className="bg-white rounded-2xl p-4 border border-violet-100/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-violet-600" />
              <span>Personas que podrías conocer</span>
            </h2>
            <button
              onClick={() => setActiveTab('discover')}
              className="text-xs text-violet-600 font-semibold hover:underline"
            >
              Ver todos
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {suggestedPeople.map((person) => (
              <div
                key={person.id}
                className="p-3 rounded-xl border border-neutral-100 hover:border-violet-200 bg-neutral-50/50 flex flex-col items-center text-center space-y-1.5 transition-all"
              >
                <div className="relative">
                  <img
                    src={person.avatar}
                    alt={person.name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-violet-200"
                  />
                  {person.showOnlineStatus && person.isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                  )}
                </div>

                <div className="leading-tight">
                  <p className="text-xs font-bold text-neutral-900 truncate max-w-[120px]">
                    {person.name}
                  </p>
                  <span className="text-[10px] text-neutral-500">
                    {person.city ? `${person.city}, ` : ''}{person.country}
                  </span>
                </div>

                <span className="text-[9px] font-semibold text-violet-700 bg-violet-100 px-2 py-0.5 rounded-full">
                  Busca: {person.connectionType}
                </span>

                <button
                  onClick={() => setViewingProfileId(person.id)}
                  className="w-full mt-1 py-1 text-xs font-semibold bg-white border border-neutral-200 hover:border-violet-500 text-neutral-700 hover:text-violet-700 rounded-lg transition-colors"
                >
                  Ver perfil
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
