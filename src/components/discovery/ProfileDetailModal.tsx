import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  X,
  MapPin,
  Globe,
  Sparkles,
  Gamepad2,
  Film,
  Music,
  Tv,
  UserCheck,
  UserPlus,
  MessageCircle,
  Flag,
  ShieldAlert,
  BadgeCheck,
  Check,
} from 'lucide-react';

export const ProfileDetailModal: React.FC = () => {
  const {
    viewingProfileId,
    setViewingProfileId,
    allUsers,
    currentUser,
    getUserConnectionStatus,
    sendConnectionRequest,
    startOrOpenConversation,
    blockUser,
    setReportingTarget,
  } = useApp();

  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  if (!viewingProfileId) return null;

  const user = allUsers.find((u) => u.id === viewingProfileId);
  if (!user) return null;

  const isSelf = user.id === currentUser.id;
  const status = getUserConnectionStatus(user.id);
  const photos = user.photos && user.photos.length > 0 ? user.photos : [user.avatar];

  const handleConnectClick = () => {
    if (status === 'none') {
      sendConnectionRequest(user.id);
    }
  };

  const handleBlock = () => {
    if (window.confirm(`¿Estás seguro de que deseas bloquear a ${user.name}? Ya no verás sus publicaciones ni podrá contactarte.`)) {
      blockUser(user.id);
      setViewingProfileId(null);
    }
  };

  const handleReport = () => {
    setReportingTarget({
      type: 'profile',
      id: user.id,
      authorName: user.name,
      preview: `Perfil de @${user.username}: ${user.bio.slice(0, 80)}`,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-violet-100 my-auto animate-fade-in">
        {/* Photo Carousel / Main Image */}
        <div className="relative h-72 sm:h-80 bg-neutral-900">
          <img
            src={photos[activePhotoIndex]}
            alt={user.name}
            className="w-full h-full object-cover"
          />

          {/* Close button */}
          <button
            onClick={() => setViewingProfileId(null)}
            aria-label="Cerrar perfil"
            className="absolute top-3 right-3 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors z-20 backdrop-blur-xs"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Photos pagination dots */}
          {photos.length > 1 && (
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-20">
              {photos.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActivePhotoIndex(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    activePhotoIndex === i ? 'bg-white w-5' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Gradient Overlay for bottom text */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-end p-5 text-white">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black">{user.name}</h2>
              <span className="text-xl font-medium text-neutral-300">, {user.age}</span>

              {user.identityVerified && (
                <span title="Identidad Verificada" className="text-amber-400">
                  <BadgeCheck className="w-5 h-5 fill-amber-400 text-neutral-900" />
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 text-xs text-neutral-300 mt-1">
              <span>@{user.username}</span>
              {user.city && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-violet-400" />
                  <span>{user.city}, {user.country}</span>
                </div>
              )}
              {user.showOnlineStatus && user.isOnline && (
                <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  En línea
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Profile Content Body */}
        <div className="p-5 space-y-4 max-h-[50vh] overflow-y-auto">
          {/* Connection Type badge */}
          <div className="flex items-center justify-between p-3 bg-violet-50 rounded-2xl border border-violet-100">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-violet-600 block">
                Tipo de conexión deseada
              </span>
              <span className="text-sm font-bold text-violet-950">
                {user.connectionType}
              </span>
            </div>
            <Sparkles className="w-5 h-5 text-violet-600" />
          </div>

          {/* Bio */}
          <div>
            <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">
              Biografía
            </h3>
            <p className="text-sm text-neutral-800 leading-relaxed whitespace-pre-line">
              {user.bio || 'Sin biografía añadida.'}
            </p>
          </div>

          {/* Languages */}
          {user.languages && user.languages.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-violet-600" />
                <span>Idiomas</span>
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {user.languages.map((lang) => (
                  <span
                    key={lang}
                    className="text-xs font-medium bg-neutral-100 text-neutral-700 px-2.5 py-1 rounded-lg"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Interests & Hobbies */}
          <div>
            <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1.5">
              Intereses & Aficiones
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {[...(user.interests || []), ...(user.hobbies || [])].map((item, idx) => (
                <span
                  key={idx}
                  className="text-xs font-semibold bg-violet-100/70 text-violet-800 px-3 py-1 rounded-full border border-violet-200"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Passions list: Anime, Games, Music, Movies */}
          <div className="space-y-2 pt-2 border-t border-neutral-100 text-xs">
            {user.favoriteAnime && user.favoriteAnime.length > 0 && (
              <div className="flex items-start gap-2">
                <Tv className="w-4 h-4 text-violet-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-neutral-700">Anime / Manga: </span>
                  <span className="text-neutral-600">{user.favoriteAnime.join(', ')}</span>
                </div>
              </div>
            )}

            {user.favoriteGames && user.favoriteGames.length > 0 && (
              <div className="flex items-start gap-2">
                <Gamepad2 className="w-4 h-4 text-violet-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-neutral-700">Videojuegos: </span>
                  <span className="text-neutral-600">{user.favoriteGames.join(', ')}</span>
                </div>
              </div>
            )}

            {user.favoriteMusic && user.favoriteMusic.length > 0 && (
              <div className="flex items-start gap-2">
                <Music className="w-4 h-4 text-violet-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-neutral-700">Música: </span>
                  <span className="text-neutral-600">{user.favoriteMusic.join(', ')}</span>
                </div>
              </div>
            )}

            {user.favoriteMovies && user.favoriteMovies.length > 0 && (
              <div className="flex items-start gap-2">
                <Film className="w-4 h-4 text-violet-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-neutral-700">Cine & Series: </span>
                  <span className="text-neutral-600">{user.favoriteMovies.join(', ')}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Action Bar */}
        <div className="p-4 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between gap-2">
          {!isSelf ? (
            <>
              {/* Connection Action */}
              <button
                onClick={handleConnectClick}
                disabled={status === 'pending_sent' || status === 'connected'}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs ${
                  status === 'connected'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : status === 'pending_sent'
                    ? 'bg-neutral-200 text-neutral-600 cursor-default'
                    : 'bg-violet-600 hover:bg-violet-700 text-white'
                }`}
              >
                {status === 'connected' ? (
                  <>
                    <UserCheck className="w-4 h-4" />
                    <span>Conectados</span>
                  </>
                ) : status === 'pending_sent' ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Solicitud enviada</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Conectar</span>
                  </>
                )}
              </button>

              {/* Chat action */}
              <button
                onClick={() => {
                  setViewingProfileId(null);
                  startOrOpenConversation(user.id);
                }}
                className="py-2.5 px-4 bg-white hover:bg-violet-50 text-violet-700 border border-violet-200 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Mensaje</span>
              </button>

              {/* Safety actions (Report & Block) */}
              <div className="flex items-center gap-1">
                <button
                  onClick={handleReport}
                  title="Denunciar perfil"
                  aria-label="Denunciar perfil"
                  className="p-2.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl border border-neutral-200 transition-colors"
                >
                  <Flag className="w-4 h-4" />
                </button>
                <button
                  onClick={handleBlock}
                  title="Bloquear usuario"
                  aria-label="Bloquear usuario"
                  className="p-2.5 text-neutral-400 hover:text-rose-700 hover:bg-rose-50 rounded-xl border border-neutral-200 transition-colors"
                >
                  <ShieldAlert className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <p className="text-xs text-neutral-500 text-center w-full">
              Este es tu propio perfil visible para otros usuarios.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
