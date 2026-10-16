import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { EditProfileModal } from './EditProfileModal.tsx';
import { PostCard } from '../feed/PostCard.tsx';
import {
  Edit3,
  MapPin,
  Calendar,
  Sparkles,
  Gamepad2,
  Tv,
  Music,
  Film,
  Globe,
  Settings,
  BadgeCheck,
  CheckCircle2,
  Lock,
  Crown,
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const {
    currentUser,
    posts,
    connections,
    setIsSettingsOpen,
    setIsPlusModalOpen,
    setIsPremiumPortalOpen,
    toggleOnlineVisibility,
  } = useApp();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  const myPosts = posts.filter((p) => p.userId === currentUser.id);
  const myConnectionsCount = connections.filter((c) => c.status === 'accepted').length;
  const photos = currentUser.photos && currentUser.photos.length > 0 ? currentUser.photos : [currentUser.avatar];

  return (
    <div className="max-w-2xl mx-auto space-y-4 pb-12">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl border border-violet-100 shadow-sm overflow-hidden">
        {/* Photos Carousel */}
        <div className="relative h-64 sm:h-72 bg-neutral-900">
          <img
            src={photos[activePhotoIndex]}
            alt={currentUser.name}
            className="w-full h-full object-cover"
          />

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

          {/* Action buttons on top of photo */}
          <div className="absolute top-3 right-3 flex items-center gap-2 z-20">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="p-2 bg-black/50 hover:bg-black/70 backdrop-blur-xs text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Edit3 className="w-4 h-4" />
              <span>Editar perfil</span>
            </button>

            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 bg-black/50 hover:bg-black/70 backdrop-blur-xs text-white rounded-xl transition-colors"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>

          {/* Gradient text overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-end p-5 text-white">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black">{currentUser.name}</h1>
              <span className="text-xl font-medium text-neutral-300">, {currentUser.age}</span>

              {currentUser.identityVerified ? (
                <span title="Identidad Verificada" className="text-amber-400">
                  <BadgeCheck className="w-5 h-5 fill-amber-400 text-neutral-900" />
                </span>
              ) : currentUser.emailVerified ? (
                <span title="Correo Verificado" className="text-sky-400">
                  <CheckCircle2 className="w-4 h-4 text-sky-400" />
                </span>
              ) : null}
            </div>

            <div className="flex items-center gap-3 text-xs text-neutral-300 mt-1 flex-wrap">
              <span>@{currentUser.username}</span>
              {currentUser.city && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-violet-400" />
                  <span>{currentUser.city}, {currentUser.country}</span>
                </div>
              )}
              {(currentUser.subscriptionTier === 'plus_199' || currentUser.isPlusSubscriber) && (
                <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.2 rounded-full text-[10px] font-bold">
                  Nexia Plus (1.99$)
                </span>
              )}
              {currentUser.subscriptionTier === 'pass_99' && (
                <span className="bg-violet-400/20 text-violet-200 border border-violet-400/30 px-2 py-0.2 rounded-full text-[10px] font-bold">
                  Nexia Pass (0.99$)
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 divide-x divide-neutral-100 border-b border-neutral-100 text-center py-3 bg-neutral-50/60">
          <div>
            <span className="text-base font-extrabold text-neutral-900 block">{myPosts.length}</span>
            <span className="text-[10px] uppercase font-semibold text-neutral-500">Publicaciones</span>
          </div>
          <div>
            <span className="text-base font-extrabold text-neutral-900 block">{myConnectionsCount}</span>
            <span className="text-[10px] uppercase font-semibold text-neutral-500">Conexiones</span>
          </div>
          <div>
            <span className="text-base font-extrabold text-neutral-900 block">{photos.length}</span>
            <span className="text-[10px] uppercase font-semibold text-neutral-500">Fotos</span>
          </div>
        </div>

        {/* Body Details */}
        <div className="p-5 space-y-4 text-xs">
          {/* Connection Type badge */}
          <div className="flex items-center justify-between p-3 bg-violet-50 rounded-2xl border border-violet-100">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-violet-600 block">
                Tipo de conexión que buscas
              </span>
              <span className="text-sm font-bold text-violet-950">
                {currentUser.connectionType}
              </span>
            </div>
            <Sparkles className="w-5 h-5 text-violet-600" />
          </div>

          {/* Sitio Premium Banner Card */}
          <div className="p-3.5 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 rounded-2xl text-white flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center">
                <Crown className="w-4 h-4 text-amber-300" />
              </div>
              <div>
                <p className="font-bold text-xs">Sitio Premium & Planes</p>
                <p className="text-[10px] text-violet-100">
                  Lounge VIP y funciones exclusivas desde US$0.99 / mes
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsPremiumPortalOpen(true)}
              className="px-3 py-1.5 bg-white text-violet-800 rounded-xl font-bold text-xs hover:bg-violet-50 transition-colors shadow-2xs shrink-0"
            >
              Ver sitio
            </button>
          </div>

          {/* Quick toggle: Online state */}
          <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-100 flex items-center justify-between">
            <div>
              <p className="font-bold text-neutral-800">Estado de conexión visible</p>
              <p className="text-[10px] text-neutral-400">
                {currentUser.showOnlineStatus
                  ? 'Tus amigos pueden ver si estás en línea (punto verde)'
                  : 'Tu estado está oculto para mayor privacidad'}
              </p>
            </div>
            <button
              onClick={toggleOnlineVisibility}
              className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
                currentUser.showOnlineStatus
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-neutral-200 text-neutral-600'
              }`}
            >
              {currentUser.showOnlineStatus ? 'Visible' : 'Oculto'}
            </button>
          </div>

          {/* Bio */}
          <div>
            <h2 className="font-bold text-neutral-500 uppercase tracking-wider mb-1">
              Sobre mí
            </h2>
            <p className="text-neutral-700 leading-relaxed text-sm whitespace-pre-line">
              {currentUser.bio}
            </p>
          </div>

          {/* Languages */}
          {currentUser.languages && currentUser.languages.length > 0 && (
            <div>
              <h2 className="font-bold text-neutral-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-violet-600" />
                <span>Idiomas</span>
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {currentUser.languages.map((l) => (
                  <span key={l} className="bg-neutral-100 text-neutral-700 px-2.5 py-1 rounded-lg font-medium">
                    {l}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Interests & Hobbies tags */}
          <div>
            <h2 className="font-bold text-neutral-500 uppercase tracking-wider mb-1.5">
              Intereses & Aficiones
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {[...(currentUser.interests || []), ...(currentUser.hobbies || [])].map((item, idx) => (
                <span
                  key={idx}
                  className="bg-violet-100/70 text-violet-800 font-semibold px-3 py-1 rounded-full border border-violet-200"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Passions Breakdown */}
          <div className="space-y-2 pt-2 border-t border-neutral-100">
            {currentUser.favoriteAnime && currentUser.favoriteAnime.length > 0 && (
              <div className="flex items-start gap-2">
                <Tv className="w-4 h-4 text-violet-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-neutral-700">Anime / Manga: </span>
                  <span className="text-neutral-600">{currentUser.favoriteAnime.join(', ')}</span>
                </div>
              </div>
            )}

            {currentUser.favoriteGames && currentUser.favoriteGames.length > 0 && (
              <div className="flex items-start gap-2">
                <Gamepad2 className="w-4 h-4 text-violet-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-neutral-700">Videojuegos: </span>
                  <span className="text-neutral-600">{currentUser.favoriteGames.join(', ')}</span>
                </div>
              </div>
            )}

            {currentUser.favoriteMusic && currentUser.favoriteMusic.length > 0 && (
              <div className="flex items-start gap-2">
                <Music className="w-4 h-4 text-violet-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-neutral-700">Música: </span>
                  <span className="text-neutral-600">{currentUser.favoriteMusic.join(', ')}</span>
                </div>
              </div>
            )}

            {currentUser.favoriteMovies && currentUser.favoriteMovies.length > 0 && (
              <div className="flex items-start gap-2">
                <Film className="w-4 h-4 text-violet-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-neutral-700">Cine & Series: </span>
                  <span className="text-neutral-600">{currentUser.favoriteMovies.join(', ')}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* User's Posts Feed */}
      <div className="space-y-3">
        <h2 className="font-bold text-xs uppercase tracking-wider text-neutral-500 px-1">
          Tus publicaciones ({myPosts.length})
        </h2>

        {myPosts.length > 0 ? (
          myPosts.map((post) => <PostCard key={post.id} post={post} />)
        ) : (
          <div className="bg-white rounded-3xl p-8 text-center border border-neutral-200 space-y-1">
            <Sparkles className="w-8 h-8 text-neutral-300 mx-auto" />
            <p className="text-xs font-bold text-neutral-700">Aún no has publicado nada</p>
            <p className="text-[11px] text-neutral-500">
              Ve a la pantalla de Inicio para compartir tu primera publicación con Nexia.
            </p>
          </div>
        )}
      </div>

      <EditProfileModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} />
    </div>
  );
};
