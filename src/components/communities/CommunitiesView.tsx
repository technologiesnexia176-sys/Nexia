import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  Users,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  Send,
  Flag,
  CheckCircle2,
  PlusCircle,
  Hash,
  Crown,
  Lock,
} from 'lucide-react';
import { PostCard } from '../feed/PostCard.tsx';
import { CreatePostBox } from '../feed/CreatePostBox.tsx';
import { canAccessVipLounge } from '../../utils/safetyAndValidation.ts';

export const CommunitiesView: React.FC = () => {
  const {
    communities,
    joinCommunity,
    leaveCommunity,
    currentUser,
    activeCommunityId,
    setActiveCommunityId,
    rooms,
    activeRoomId,
    setActiveRoomId,
    roomMessages,
    sendRoomMessage,
    posts,
    setReportingTarget,
    setIsPremiumPortalOpen,
  } = useApp();

  const [topTab, setTopTab] = useState<'communities' | 'rooms'>('communities');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [roomInput, setRoomInput] = useState('');

  React.useEffect(() => {
    if (activeRoomId) {
      setTopTab('rooms');
    }
  }, [activeRoomId]);

  const activeComm = communities.find((c) => c.id === activeCommunityId);
  const activeRoom = rooms.find((r) => r.id === activeRoomId);

  const categories = [
    'all',
    'Anime y manga',
    'Videojuegos',
    'Música',
    'Películas y series',
    'Arte y dibujo',
    'Comunidad LGBTQ+',
    'Amistad',
    'Tecnología',
  ];

  const filteredCommunities = communities.filter((c) => {
    if (selectedCategory === 'all') return true;
    return c.category === selectedCategory;
  });

  const communityPosts = activeCommunityId
    ? posts.filter((p) => p.communityId === activeCommunityId)
    : [];

  const handleSendRoomMsg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomInput.trim() || !activeRoomId) return;
    sendRoomMessage(activeRoomId, roomInput.trim());
    setRoomInput('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 pb-12">
      {/* Sub-header navigation: Comunidades vs Salas grupales */}
      <div className="bg-white rounded-2xl p-2 border border-violet-100 flex gap-1 shadow-xs">
        <button
          onClick={() => {
            setTopTab('communities');
            setActiveRoomId(null);
          }}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
            topTab === 'communities'
              ? 'bg-violet-600 text-white shadow-xs'
              : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Comunidades Temáticas</span>
        </button>

        <button
          onClick={() => {
            setTopTab('rooms');
            setActiveCommunityId(null);
          }}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
            topTab === 'rooms'
              ? 'bg-violet-600 text-white shadow-xs'
              : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Salas Grupales en Vivo</span>
        </button>
      </div>

      {/* SECTION 1: COMMUNITIES */}
      {topTab === 'communities' && (
        <>
          {activeComm ? (
            /* COMMUNITY DETAIL VIEW */
            <div className="space-y-4 animate-fade-in">
              {/* Cover Banner */}
              <div className="relative rounded-3xl overflow-hidden h-52 sm:h-64 shadow-md bg-neutral-900 border border-violet-100">
                <img
                  src={activeComm.coverImage}
                  alt={activeComm.name}
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-5 text-white">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-violet-300 bg-violet-950/70 px-2 py-0.5 rounded-md border border-violet-400/30">
                        {activeComm.category}
                      </span>
                      <h1 className="text-xl sm:text-2xl font-black mt-1">
                        {activeComm.name}
                      </h1>
                      <p className="text-xs text-neutral-300 mt-1 max-w-xl">
                        {activeComm.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {activeComm.memberIds.includes(currentUser.id) ? (
                        <button
                          onClick={() => leaveCommunity(activeComm.id)}
                          className="px-4 py-2 bg-white/20 hover:bg-rose-600 text-white rounded-xl text-xs font-bold border border-white/20 transition-colors"
                        >
                          Miembro (Salir)
                        </button>
                      ) : (
                        <button
                          onClick={() => joinCommunity(activeComm.id)}
                          className="px-5 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors"
                        >
                          Unirse a la comunidad
                        </button>
                      )}

                      <button
                        onClick={() =>
                          setReportingTarget({
                            type: 'community',
                            id: activeComm.id,
                            authorName: activeComm.name,
                            preview: activeComm.description,
                          })
                        }
                        title="Denunciar comunidad"
                        className="p-2 bg-black/40 hover:bg-rose-600 text-white rounded-xl transition-colors"
                      >
                        <Flag className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-neutral-300 mt-3 pt-2 border-t border-white/10">
                    <span className="font-semibold text-white">
                      {activeComm.membersCount.toLocaleString()} miembros
                    </span>
                    <span>•</span>
                    <button
                      onClick={() => setActiveCommunityId(null)}
                      className="text-violet-300 hover:text-white underline font-semibold"
                    >
                      ← Volver a lista de comunidades
                    </button>
                  </div>
                </div>
              </div>

              {/* Community Rules Box */}
              <div className="bg-white rounded-2xl p-4 border border-violet-100 shadow-2xs space-y-2">
                <div className="flex items-center gap-2 text-violet-700 font-bold text-xs">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Normas de convivencia de {activeComm.name}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-neutral-600">
                  {activeComm.rules.map((rule, idx) => (
                    <div key={idx} className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{rule}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Community Create Post & Feed */}
              <div className="space-y-4">
                <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                  Muro de la comunidad
                </h2>
                <CreatePostBox communityId={activeComm.id} />

                {communityPosts.length > 0 ? (
                  communityPosts.map((post) => <PostCard key={post.id} post={post} />)
                ) : (
                  <div className="bg-white rounded-2xl p-8 text-center border border-neutral-200 space-y-1">
                    <Sparkles className="w-8 h-8 text-violet-400 mx-auto" />
                    <p className="text-xs font-bold text-neutral-800">
                      Aún no hay publicaciones en esta comunidad
                    </p>
                    <p className="text-[11px] text-neutral-500">
                      ¡Comparte tus recomendaciones o proyectos para iniciar la conversación!
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* COMMUNITIES LIST GRID */
            <div className="space-y-4">
              {/* Category selector */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 transition-all ${
                      selectedCategory === cat
                        ? 'bg-violet-600 text-white shadow-xs'
                        : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200'
                    }`}
                  >
                    {cat === 'all' ? 'Todas las categorías' : cat}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredCommunities.map((comm) => {
                  const isMember = comm.memberIds.includes(currentUser.id);

                  return (
                    <div
                      key={comm.id}
                      className="bg-white rounded-3xl border border-violet-100 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div className="relative h-36 bg-neutral-900">
                        <img
                          src={comm.coverImage}
                          alt={comm.name}
                          className="w-full h-full object-cover opacity-85"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                        <span className="absolute top-3 left-3 bg-neutral-900/80 backdrop-blur-xs text-violet-200 text-[10px] font-semibold px-2 py-0.5 rounded-md border border-violet-400/30">
                          {comm.category}
                        </span>

                        <div className="absolute bottom-2.5 left-3 right-3 text-white">
                          <h2 className="text-base font-extrabold">{comm.name}</h2>
                          <span className="text-[11px] text-neutral-300">
                            {comm.membersCount.toLocaleString()} miembros
                          </span>
                        </div>
                      </div>

                      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                        <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
                          {comm.description}
                        </p>

                        <div className="flex items-center gap-2 pt-2 border-t border-neutral-100">
                          <button
                            onClick={() => setActiveCommunityId(comm.id)}
                            className="flex-1 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl text-xs font-bold transition-colors"
                          >
                            Entrar al muro
                          </button>

                          {isMember ? (
                            <button
                              onClick={() => leaveCommunity(comm.id)}
                              className="px-3 py-2 bg-emerald-50 text-emerald-700 hover:bg-rose-50 hover:text-rose-600 rounded-xl text-xs font-semibold border border-emerald-200 transition-colors"
                            >
                              Miembro
                            </button>
                          ) : (
                            <button
                              onClick={() => joinCommunity(comm.id)}
                              className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                            >
                              Unirse
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      {/* SECTION 2: LIVE TEXT ROOMS (Salas grupales) */}
      {topTab === 'rooms' && (
        <div className="space-y-4">
          {activeRoom ? (
            /* ACTIVE ROOM CHAT STREAM */
            <div className="bg-white rounded-3xl border border-violet-100 shadow-sm overflow-hidden flex flex-col h-[560px]">
              {/* Room Header */}
              <div className="p-4 border-b border-neutral-100 bg-violet-50/50 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Hash className="w-5 h-5 text-violet-600" />
                    <h2 className="text-sm font-bold text-neutral-900">{activeRoom.name}</h2>
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    {activeRoom.description} • {activeRoom.activeUsersCount} personas conectadas
                  </p>
                </div>

                <button
                  onClick={() => setActiveRoomId(null)}
                  className="text-xs text-violet-700 hover:underline font-semibold"
                >
                  Cambiar sala
                </button>
              </div>

              {/* Room Rules Alert */}
              <div className="px-4 py-2 bg-violet-100/40 border-b border-violet-100 text-[11px] text-violet-900 flex items-center justify-between">
                <span>🛡️ Normas de la sala: {activeRoom.rules.join(' • ')}</span>
              </div>

              {/* Room Messages Feed */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-neutral-50/30">
                {(roomMessages[activeRoom.id] || []).map((msg) => (
                  <div key={msg.id} className="flex items-start gap-2.5">
                    <img
                      src={msg.senderAvatar}
                      alt={msg.senderName}
                      className="w-8 h-8 rounded-full object-cover ring-1 ring-violet-200 mt-0.5 shrink-0"
                    />
                    <div className="bg-white p-2.5 rounded-2xl border border-neutral-200/70 shadow-2xs max-w-[85%]">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-bold text-xs text-neutral-900">{msg.senderName}</span>
                        <span className="text-[10px] text-neutral-400">{msg.time}</span>
                      </div>
                      <p className="text-xs text-neutral-700 leading-normal">{msg.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Room Input Form */}
              <form onSubmit={handleSendRoomMsg} className="p-3 border-t border-neutral-100 bg-white flex gap-2">
                <input
                  type="text"
                  value={roomInput}
                  onChange={(e) => setRoomInput(e.target.value)}
                  placeholder={`Mensaje en #${activeRoom.name}...`}
                  className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:ring-2 focus:ring-violet-400 focus:outline-hidden"
                />
                <button
                  type="submit"
                  disabled={!roomInput.trim()}
                  className="px-4 py-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          ) : (
            /* ROOMS LIST */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {rooms.map((room) => {
                const isVipRoom = room.id === 'room_vip_premium';
                const userTier = currentUser.subscriptionTier || (currentUser.isPlusSubscriber ? 'plus_199' : 'free');
                const hasVipAccess = canAccessVipLounge(userTier);

                const handleRoomClick = () => {
                  if (isVipRoom && !hasVipAccess) {
                    setIsPremiumPortalOpen(true);
                  } else {
                    setActiveRoomId(room.id);
                  }
                };

                return (
                  <div
                    key={room.id}
                    className={`rounded-3xl p-5 border transition-all space-y-3 flex flex-col justify-between ${
                      isVipRoom
                        ? 'bg-gradient-to-br from-violet-50/70 via-purple-50/40 to-amber-50/30 border-amber-200/80 shadow-xs'
                        : 'bg-white border-violet-100 shadow-xs hover:border-violet-300'
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                          isVipRoom
                            ? 'bg-gradient-to-r from-amber-500 to-violet-600 text-white border-amber-400'
                            : 'text-violet-700 bg-violet-50 border-violet-100'
                        }`}>
                          {room.category}
                        </span>
                        <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          {room.activeUsersCount} activos
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {isVipRoom && <Crown className="w-4 h-4 text-amber-500 shrink-0" />}
                        <h2 className="text-sm font-bold text-neutral-900">{room.name}</h2>
                      </div>
                      <p className="text-xs text-neutral-500 leading-relaxed">{room.description}</p>
                    </div>

                    <div className="pt-2 border-t border-neutral-100">
                      <button
                        onClick={handleRoomClick}
                        className={`w-full py-2 rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5 ${
                          isVipRoom && !hasVipAccess
                            ? 'bg-gradient-to-r from-amber-500 to-violet-600 hover:from-amber-600 hover:to-violet-700 text-white'
                            : 'bg-violet-600 hover:bg-violet-700 text-white'
                        }`}
                      >
                        {isVipRoom && !hasVipAccess ? (
                          <>
                            <Lock className="w-3.5 h-3.5" />
                            <span>Desbloquear con Sitio Premium ($0.99)</span>
                          </>
                        ) : (
                          <>
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Entrar a charlar</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
