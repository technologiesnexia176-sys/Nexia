import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  X,
  Trash2,
  Plus,
  Save,
  Lock,
  Eye,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { calculateAge } from '../../utils/safetyAndValidation.ts';

export const EditProfileModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { currentUser, updateProfile } = useApp();

  const [name, setName] = useState(currentUser.name);
  const [username, setUsername] = useState(currentUser.username);
  const [bio, setBio] = useState(currentUser.bio);
  const [country, setCountry] = useState(currentUser.country || '');
  const [city, setCity] = useState(currentUser.city || '');
  const [birthDate, setBirthDate] = useState(currentUser.birthDate);
  const [avatar, setAvatar] = useState(currentUser.avatar);
  const [photos, setPhotos] = useState<string[]>(currentUser.photos || []);
  const [connectionType, setConnectionType] = useState(currentUser.connectionType);
  const [showOnlineStatus, setShowOnlineStatus] = useState(currentUser.showOnlineStatus);
  const [profileVisibility, setProfileVisibility] = useState(currentUser.profileVisibility);
  const [allowMessagesFrom, setAllowMessagesFrom] = useState(currentUser.allowMessagesFrom);

  // String tags for interests & media
  const [interestsStr, setInterestsStr] = useState(currentUser.interests.join(', '));
  const [hobbiesStr, setHobbiesStr] = useState(currentUser.hobbies.join(', '));
  const [languagesStr, setLanguagesStr] = useState(currentUser.languages.join(', '));
  const [animeStr, setAnimeStr] = useState(currentUser.favoriteAnime.join(', '));
  const [gamesStr, setGamesStr] = useState(currentUser.favoriteGames.join(', '));
  const [musicStr, setMusicStr] = useState(currentUser.favoriteMusic.join(', '));
  const [moviesStr, setMoviesStr] = useState(currentUser.favoriteMovies.join(', '));

  const [newPhotoUrl, setNewPhotoUrl] = useState('');

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const parseList = (str: string) =>
      str
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

    const calculatedAge = calculateAge(birthDate);

    updateProfile({
      name: name.trim() || currentUser.name,
      username: username.replace('@', '').trim() || currentUser.username,
      bio: bio.trim(),
      country: country.trim() || undefined,
      city: city.trim() || undefined,
      birthDate,
      age: calculatedAge >= 18 ? calculatedAge : currentUser.age,
      avatar,
      photos,
      connectionType,
      showOnlineStatus,
      profileVisibility,
      allowMessagesFrom,
      interests: parseList(interestsStr),
      hobbies: parseList(hobbiesStr),
      languages: parseList(languagesStr),
      favoriteAnime: parseList(animeStr),
      favoriteGames: parseList(gamesStr),
      favoriteMusic: parseList(musicStr),
      favoriteMovies: parseList(moviesStr),
    });

    onClose();
  };

  const handleAddPhoto = () => {
    if (!newPhotoUrl.trim()) return;
    setPhotos([...photos, newPhotoUrl.trim()]);
    setNewPhotoUrl('');
  };

  const handleDeletePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-violet-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-neutral-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-violet-600" />
            <h2 className="font-bold text-neutral-900 text-sm">Editar Perfil de Nexia</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar edición"
            className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-5 overflow-y-auto flex-1 space-y-4 text-xs">
          {/* Avatar URL */}
          <div>
            <label className="block font-bold text-neutral-700 mb-1">
              Foto principal (URL de avatar)
            </label>
            <div className="flex items-center gap-3">
              <img
                src={avatar}
                alt="Vista previa"
                className="w-12 h-12 rounded-full object-cover ring-2 ring-violet-500 shrink-0"
              />
              <input
                type="url"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="https://..."
                className="flex-1 p-2 rounded-xl border border-neutral-200 bg-neutral-50 text-xs focus:ring-2 focus:ring-violet-400 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Additional Photos Gallery with delete action */}
          <div>
            <label className="block font-bold text-neutral-700 mb-1">
              Galería de fotografías adicionales ({photos.length})
            </label>
            <div className="grid grid-cols-4 gap-2 mb-2">
              {photos.map((p, idx) => (
                <div key={idx} className="relative rounded-xl overflow-hidden aspect-square border border-neutral-200 group">
                  <img src={p} alt={`Foto ${idx}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleDeletePhoto(idx)}
                    title="Eliminar foto"
                    className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4 text-rose-400" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="url"
                value={newPhotoUrl}
                onChange={(e) => setNewPhotoUrl(e.target.value)}
                placeholder="Añadir URL de foto..."
                className="flex-1 p-2 rounded-xl border border-neutral-200 bg-neutral-50 text-xs focus:ring-2 focus:ring-violet-400 focus:outline-hidden"
              />
              <button
                type="button"
                onClick={handleAddPhoto}
                className="px-3 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Añadir</span>
              </button>
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-neutral-700 mb-1">Nombre visible</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white text-xs focus:ring-2 focus:ring-violet-400 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-bold text-neutral-700 mb-1">Nombre de usuario (@)</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-2 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white text-xs focus:ring-2 focus:ring-violet-400 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Location & Birthdate */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-neutral-700 mb-1">País</label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="México"
                className="w-full p-2 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-neutral-700 mb-1">Ciudad (opcional)</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="CDMX"
                className="w-full p-2 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-neutral-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Nacimiento</span>
              </label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full p-2 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white text-xs"
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block font-bold text-neutral-700 mb-1">Biografía</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              placeholder="Cuéntale a la comunidad sobre ti..."
              className="w-full p-2.5 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white text-xs focus:ring-2 focus:ring-violet-400 focus:outline-hidden resize-none"
            />
          </div>

          {/* Connection Type */}
          <div>
            <label className="block font-bold text-neutral-700 mb-1">
              ¿Qué tipo de conexión buscas?
            </label>
            <select
              value={connectionType}
              onChange={(e) => setConnectionType(e.target.value as any)}
              className="w-full p-2 rounded-xl border border-neutral-200 bg-neutral-50 text-xs focus:ring-2 focus:ring-violet-400 focus:outline-hidden"
            >
              <option value="Amistad">Amistad</option>
              <option value="Conversación">Conversación</option>
              <option value="Comunidad">Comunidad</option>
              <option value="Relación romántica">Relación romántica</option>
              <option value="Intereses similares">Conocer personas con intereses similares</option>
            </select>
          </div>

          {/* Privacy & Online status options */}
          <div className="p-3 bg-violet-50/60 rounded-2xl border border-violet-100 space-y-2.5">
            <h3 className="font-bold text-violet-900 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-violet-600" />
              <span>Privacidad y Estado de Conexión</span>
            </h3>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-neutral-700">Mostrar estado conectado (punto verde)</span>
              <input
                type="checkbox"
                checked={showOnlineStatus}
                onChange={(e) => setShowOnlineStatus(e.target.checked)}
                className="rounded border-neutral-300 text-violet-600 focus:ring-violet-400 w-4 h-4"
              />
            </label>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <div>
                <label className="block text-neutral-600 mb-0.5">Visibilidad de perfil</label>
                <select
                  value={profileVisibility}
                  onChange={(e) => setProfileVisibility(e.target.value as any)}
                  className="w-full p-1.5 rounded-lg border border-neutral-200 bg-white text-[11px]"
                >
                  <option value="public">Público</option>
                  <option value="connections_only">Solo conexiones</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-600 mb-0.5">Mensajes permitidos</label>
                <select
                  value={allowMessagesFrom}
                  onChange={(e) => setAllowMessagesFrom(e.target.value as any)}
                  className="w-full p-1.5 rounded-lg border border-neutral-200 bg-white text-[11px]"
                >
                  <option value="all">De todos</option>
                  <option value="connections_only">Solo conexiones</option>
                </select>
              </div>
            </div>
          </div>

          {/* Passions & Tags */}
          <div className="space-y-2 pt-1 border-t border-neutral-100">
            <h3 className="font-bold text-neutral-700">Intereses y Favoritos (separados por coma)</h3>

            <div>
              <label className="block text-neutral-600 mb-0.5">Intereses</label>
              <input
                type="text"
                value={interestsStr}
                onChange={(e) => setInterestsStr(e.target.value)}
                placeholder="Anime, Videojuegos, Café..."
                className="w-full p-2 rounded-xl border border-neutral-200 bg-neutral-50 text-xs"
              />
            </div>

            <div>
              <label className="block text-neutral-600 mb-0.5">Anime / Manga favorito</label>
              <input
                type="text"
                value={animeStr}
                onChange={(e) => setAnimeStr(e.target.value)}
                placeholder="Frieren, Jujutsu Kaisen, Evangelion..."
                className="w-full p-2 rounded-xl border border-neutral-200 bg-neutral-50 text-xs"
              />
            </div>

            <div>
              <label className="block text-neutral-600 mb-0.5">Videojuegos favoritos</label>
              <input
                type="text"
                value={gamesStr}
                onChange={(e) => setGamesStr(e.target.value)}
                placeholder="Zelda, Persona 5, Elden Ring..."
                className="w-full p-2 rounded-xl border border-neutral-200 bg-neutral-50 text-xs"
              />
            </div>

            <div>
              <label className="block text-neutral-600 mb-0.5">Música favorita</label>
              <input
                type="text"
                value={musicStr}
                onChange={(e) => setMusicStr(e.target.value)}
                placeholder="Tame Impala, Lo-Fi, Rock..."
                className="w-full p-2 rounded-xl border border-neutral-200 bg-neutral-50 text-xs"
              />
            </div>

            <div>
              <label className="block text-neutral-600 mb-0.5">Películas y series</label>
              <input
                type="text"
                value={moviesStr}
                onChange={(e) => setMoviesStr(e.target.value)}
                placeholder="Interstellar, Your Name, Dune..."
                className="w-full p-2 rounded-xl border border-neutral-200 bg-neutral-50 text-xs"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-3 border-t border-neutral-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl font-semibold transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-md transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Guardar cambios</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
