import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  Search,
  Filter,
  UserPlus,
  UserCheck,
  MessageCircle,
  Eye,
  Sparkles,
  MapPin,
  Check,
  UserCog,
} from 'lucide-react';
import { matchesDiscoveryFilter } from '../../utils/safetyAndValidation.ts';

export const DiscoveryView: React.FC = () => {
  const {
    allUsers,
    currentUser,
    blockedUserIds,
    setViewingProfileId,
    sendConnectionRequest,
    startOrOpenConversation,
    getUserConnectionStatus,
    setIsConnectionsModalOpen,
    connections,
  } = useApp();

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [selectedConnectionType, setSelectedConnectionType] = useState('all');
  const [selectedInterest, setSelectedInterest] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Incoming pending requests count
  const pendingReceivedCount = connections.filter(
    (c) => c.toUserId === currentUser.id && c.status === 'pending'
  ).length;

  // Filter users: exclude current user, exclude blocked users, exclude suspended users, apply filters
  const discoverableUsers = allUsers.filter((user) => {
    if (user.id === currentUser.id) return false;
    if (blockedUserIds.includes(user.id)) return false;

    return matchesDiscoveryFilter(user, {
      country: selectedCountry,
      language: selectedLanguage,
      connectionType: selectedConnectionType,
      interest: selectedInterest,
      query: searchQuery,
    });
  });

  const availableCountries = ['all', 'México', 'Argentina', 'Chile', 'España', 'Colombia', 'Perú'];
  const availableConnectionTypes = [
    'all',
    'Amistad',
    'Conversación',
    'Comunidad',
    'Relación romántica',
    'Intereses similares',
  ];
  const popularInterests = [
    'all',
    'Anime',
    'Videojuegos',
    'Música',
    'Tecnología',
    'Arte y dibujo',
    'Lectura',
    'Viajes',
  ];

  return (
    <div className="space-y-4 max-w-4xl mx-auto pb-12">
      {/* Top Banner & Connections shortcut */}
      <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 rounded-2xl p-4 text-white shadow-md flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-amber-300" />
            <h1 className="text-base font-extrabold tracking-tight">Descubrir Personas</h1>
          </div>
          <p className="text-xs text-violet-100 max-w-md">
            Conoce personas afines a tus pasiones en un entorno respetuoso. Ubicación precisa jamás revelada.
          </p>
        </div>

        <button
          onClick={() => setIsConnectionsModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-2 bg-white text-violet-800 rounded-xl text-xs font-bold shadow-xs hover:bg-violet-50 transition-all shrink-0"
        >
          <UserCog className="w-4 h-4 text-violet-600" />
          <span>Mis Conexiones</span>
          {pendingReceivedCount > 0 && (
            <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ml-1">
              {pendingReceivedCount}
            </span>
          )}
        </button>
      </div>

      {/* Search Bar & Filter Toggle */}
      <div className="bg-white rounded-2xl p-3 border border-violet-100/80 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre, @usuario, bio o intereses..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-neutral-50 border border-neutral-200 focus:bg-white focus:ring-2 focus:ring-violet-400 focus:outline-hidden transition-all"
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1 px-3 py-2 text-xs font-semibold rounded-xl border transition-colors shrink-0 ${
              showFilters || selectedCountry !== 'all' || selectedConnectionType !== 'all' || selectedInterest !== 'all'
                ? 'bg-violet-100 text-violet-700 border-violet-300'
                : 'text-neutral-600 border-neutral-200 hover:bg-neutral-50'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filtros</span>
          </button>
        </div>

        {/* Expandable Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-neutral-100 text-xs animate-fade-in">
            {/* Country */}
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">País</label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full p-2 rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-800 text-xs focus:ring-2 focus:ring-violet-400 focus:outline-hidden"
              >
                {availableCountries.map((c) => (
                  <option key={c} value={c}>
                    {c === 'all' ? 'Todos los países' : c}
                  </option>
                ))}
              </select>
            </div>

            {/* Connection Type */}
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Busca</label>
              <select
                value={selectedConnectionType}
                onChange={(e) => setSelectedConnectionType(e.target.value)}
                className="w-full p-2 rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-800 text-xs focus:ring-2 focus:ring-violet-400 focus:outline-hidden"
              >
                {availableConnectionTypes.map((t) => (
                  <option key={t} value={t}>
                    {t === 'all' ? 'Cualquier tipo de conexión' : t}
                  </option>
                ))}
              </select>
            </div>

            {/* Interests */}
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Interés principal</label>
              <select
                value={selectedInterest}
                onChange={(e) => setSelectedInterest(e.target.value)}
                className="w-full p-2 rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-800 text-xs focus:ring-2 focus:ring-violet-400 focus:outline-hidden"
              >
                {popularInterests.map((i) => (
                  <option key={i} value={i}>
                    {i === 'all' ? 'Todos los intereses' : i}
                  </option>
                ))}
              </select>
            </div>

            {/* Reset Filters button */}
            {(selectedCountry !== 'all' || selectedConnectionType !== 'all' || selectedInterest !== 'all' || searchQuery) && (
              <div className="sm:col-span-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCountry('all');
                    setSelectedConnectionType('all');
                    setSelectedInterest('all');
                    setSearchQuery('');
                  }}
                  className="text-xs text-rose-600 hover:underline font-semibold"
                >
                  Restablecer todos los filtros
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Discovery Profile Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {discoverableUsers.length > 0 ? (
          discoverableUsers.map((user) => {
            const status = getUserConnectionStatus(user.id);

            return (
              <div
                key={user.id}
                className="bg-white rounded-3xl border border-violet-100 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
              >
                {/* Card Top: Image + Quick Overlays */}
                <div className="relative h-48 bg-neutral-800 cursor-pointer" onClick={() => setViewingProfileId(user.id)}>
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                  {/* Online indicator */}
                  {user.showOnlineStatus && user.isOnline && (
                    <div className="absolute top-3 left-3 bg-neutral-900/70 backdrop-blur-xs px-2 py-0.5 rounded-full flex items-center gap-1.5 text-[10px] text-emerald-400 font-semibold border border-emerald-500/30">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>En línea</span>
                    </div>
                  )}

                  {/* Connection seeking badge */}
                  <div className="absolute top-3 right-3 bg-violet-900/80 backdrop-blur-xs text-violet-200 text-[10px] font-semibold px-2.5 py-0.5 rounded-full border border-violet-400/30">
                    {user.connectionType}
                  </div>

                  {/* Name and Location at bottom of photo */}
                  <div className="absolute bottom-2.5 left-3 right-3 text-white">
                    <p className="text-base font-extrabold flex items-center gap-1">
                      <span>{user.name}</span>
                      <span className="font-normal text-neutral-300">, {user.age}</span>
                    </p>
                    <p className="text-[11px] text-neutral-300 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-violet-400 shrink-0" />
                      <span className="truncate">
                        {user.city ? `${user.city}, ` : ''}{user.country || 'Ubicación privada'}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Card Body: Bio snippet & Shared interests */}
                <div className="p-3.5 space-y-2.5 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
                      {user.bio}
                    </p>

                    {/* Interest tags */}
                    <div className="flex flex-wrap gap-1 mt-2.5">
                      {[...(user.interests || [])].slice(0, 3).map((item, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-semibold bg-violet-50 text-violet-700 px-2 py-0.5 rounded-md border border-violet-100"
                        >
                          {item}
                        </span>
                      ))}
                      {(user.interests || []).length > 3 && (
                        <span className="text-[10px] text-neutral-400 self-center">
                          +{user.interests.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="pt-2 border-t border-neutral-100 grid grid-cols-3 gap-1.5">
                    {/* View Profile */}
                    <button
                      onClick={() => setViewingProfileId(user.id)}
                      title="Ver perfil completo"
                      className="py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span className="hidden xs:inline">Perfil</span>
                    </button>

                    {/* Connect */}
                    <button
                      onClick={() => {
                        if (status === 'none') sendConnectionRequest(user.id);
                      }}
                      disabled={status !== 'none'}
                      title={status === 'connected' ? 'Conectados' : status === 'pending_sent' ? 'Solicitud enviada' : 'Enviar solicitud de conexión'}
                      className={`py-1.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
                        status === 'connected'
                          ? 'bg-emerald-100 text-emerald-800'
                          : status === 'pending_sent'
                          ? 'bg-neutral-100 text-neutral-500'
                          : 'bg-violet-600 hover:bg-violet-700 text-white shadow-2xs'
                      }`}
                    >
                      {status === 'connected' ? (
                        <>
                          <UserCheck className="w-3.5 h-3.5" />
                          <span className="hidden xs:inline">Amigos</span>
                        </>
                      ) : status === 'pending_sent' ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span className="hidden xs:inline">Enviada</span>
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-3.5 h-3.5" />
                          <span className="hidden xs:inline">Conectar</span>
                        </>
                      )}
                    </button>

                    {/* Message */}
                    <button
                      onClick={() => startOrOpenConversation(user.id)}
                      title="Enviar mensaje"
                      className="py-1.5 bg-violet-50 hover:bg-violet-100 text-violet-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 border border-violet-200 transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span className="hidden xs:inline">Chat</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full bg-white rounded-3xl p-8 text-center border border-neutral-200/80 space-y-2">
            <Sparkles className="w-8 h-8 text-neutral-400 mx-auto" />
            <h3 className="font-bold text-sm text-neutral-800">
              No se encontraron perfiles con los filtros seleccionados
            </h3>
            <p className="text-xs text-neutral-500">
              Prueba cambiando el país, interés o tipo de conexión.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
