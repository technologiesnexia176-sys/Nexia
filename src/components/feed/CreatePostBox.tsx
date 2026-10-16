import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { Image, Send, Tag, AlertTriangle } from 'lucide-react';
import { checkHarmfulContent } from '../../utils/safetyAndValidation.ts';

export const CreatePostBox: React.FC<{ communityId?: string }> = ({ communityId }) => {
  const { currentUser, createPost, communities } = useApp();

  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [categoryTag, setCategoryTag] = useState('Anime y manga');
  const [showImageInput, setShowImageInput] = useState(false);
  const [warningMsg, setWarningMsg] = useState('');

  const samplePostImages = [
    'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80',
  ];

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    setWarningMsg('');

    if (!content.trim() && !imageUrl) return;

    // Safety check against harassment / illegal content
    const check = checkHarmfulContent(content);
    if (check.isFlagged) {
      setWarningMsg(`Tu publicación no cumple con las normas de Nexia: ${check.reasons.join(', ')}.`);
      return;
    }

    createPost(content.trim(), imageUrl.trim() || undefined, categoryTag, communityId);
    setContent('');
    setImageUrl('');
    setShowImageInput(false);
  };

  return (
    <div className="bg-white rounded-2xl p-4 border border-violet-100/70 shadow-xs space-y-3">
      <div className="flex items-start gap-3">
        <img
          src={currentUser.avatar}
          alt={currentUser.name}
          className="w-10 h-10 rounded-full object-cover shrink-0 ring-2 ring-violet-200"
        />
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              if (warningMsg) setWarningMsg('');
            }}
            placeholder="¿Qué quieres compartir con la comunidad de Nexia? (Anime, juegos, música, aficiones...)"
            rows={2}
            className="w-full text-sm text-neutral-800 placeholder-neutral-400 bg-neutral-50/70 hover:bg-neutral-50 focus:bg-white p-3 rounded-xl border border-neutral-200/80 focus:border-violet-400 focus:ring-2 focus:ring-violet-200 focus:outline-hidden transition-all resize-none"
          />

          {warningMsg && (
            <div className="mt-2 p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{warningMsg}</span>
            </div>
          )}

          {showImageInput && (
            <div className="mt-2 p-2.5 bg-violet-50/50 rounded-xl border border-violet-100 space-y-2">
              <label className="block text-xs font-semibold text-neutral-700">
                Añadir imagen por enlace o elegir muestra:
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full text-xs p-2 bg-white rounded-lg border border-neutral-200 focus:ring-2 focus:ring-violet-400 focus:outline-hidden"
              />
              <div className="flex items-center gap-2 pt-1">
                {samplePostImages.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setImageUrl(img)}
                    className="w-12 h-12 rounded-lg overflow-hidden border border-neutral-200 hover:border-violet-500 transition-all"
                  >
                    <img src={img} alt="Muestra" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-2 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowImageInput(!showImageInput)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  showImageInput
                    ? 'bg-violet-100 text-violet-700'
                    : 'text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                <Image className="w-4 h-4 text-violet-600" />
                <span>Foto</span>
              </button>

              <div className="flex items-center gap-1 text-xs text-neutral-500 bg-neutral-100/80 px-2 py-1 rounded-lg">
                <Tag className="w-3.5 h-3.5 text-violet-600" />
                <select
                  value={categoryTag}
                  onChange={(e) => setCategoryTag(e.target.value)}
                  className="bg-transparent text-xs font-medium text-neutral-700 focus:outline-hidden"
                >
                  <option value="Anime y manga">Anime y manga</option>
                  <option value="Videojuegos">Videojuegos</option>
                  <option value="Música">Música</option>
                  <option value="Películas y series">Películas y series</option>
                  <option value="Arte y dibujo">Arte y dibujo</option>
                  <option value="Tecnología">Tecnología</option>
                  <option value="Amistad">Amistad</option>
                  <option value="Comunidad LGBTQ+">Comunidad LGBTQ+</option>
                </select>
              </div>
            </div>

            <button
              type="button"
              onClick={handlePublish}
              disabled={!content.trim() && !imageUrl}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-40 text-white font-semibold text-xs shadow-xs transition-all active:scale-95"
            >
              <span>Publicar</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
