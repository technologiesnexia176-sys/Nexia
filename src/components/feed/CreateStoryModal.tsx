import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { X, Image, Type, Sparkles } from 'lucide-react';

export const CreateStoryModal: React.FC = () => {
  const { isCreateStoryOpen, setIsCreateStoryOpen, createStory } = useApp();

  const [storyType, setStoryType] = useState<'text' | 'image'>('text');
  const [text, setText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('#6D28D9');

  if (!isCreateStoryOpen) return null;

  const colorPresets = [
    '#6D28D9', // Deep Purple (Nexia primary)
    '#4F46E5', // Indigo
    '#059669', // Emerald
    '#DB2777', // Pink
    '#D97706', // Amber
    '#0F172A', // Midnight Slate
  ];

  const sampleImages = [
    'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (storyType === 'text' && !text.trim()) return;
    if (storyType === 'image' && !imageUrl.trim()) return;

    createStory({
      imageUrl: storyType === 'image' ? imageUrl : undefined,
      text: storyType === 'text' ? text : undefined,
      backgroundColor,
      caption: caption.trim() || undefined,
    });

    setText('');
    setImageUrl('');
    setCaption('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl space-y-4 border border-violet-100">
        <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-violet-100 rounded-xl text-violet-700">
              <Sparkles className="w-4 h-4" />
            </div>
            <h2 className="font-bold text-neutral-900 text-sm">Crear Historia (24h)</h2>
          </div>
          <button
            onClick={() => setIsCreateStoryOpen(false)}
            aria-label="Cerrar modal de historia"
            className="p-1 text-neutral-400 hover:text-neutral-700 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Story Type Selector */}
        <div className="flex bg-neutral-100 p-1 rounded-xl gap-1">
          <button
            type="button"
            onClick={() => setStoryType('text')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              storyType === 'text' ? 'bg-white shadow-xs text-violet-700' : 'text-neutral-600'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            <span>Texto</span>
          </button>
          <button
            type="button"
            onClick={() => setStoryType('image')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              storyType === 'image' ? 'bg-white shadow-xs text-violet-700' : 'text-neutral-600'
            }`}
          >
            <Image className="w-3.5 h-3.5" />
            <span>Foto / Imagen</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {storyType === 'text' ? (
            <>
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Tu mensaje
                </label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="¿Qué estás pensando o escuchando hoy?"
                  rows={3}
                  className="w-full p-3 rounded-2xl border border-neutral-200 text-sm focus:ring-2 focus:ring-violet-500 focus:outline-hidden resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Color de fondo
                </label>
                <div className="flex items-center gap-2">
                  {colorPresets.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setBackgroundColor(color)}
                      className={`w-7 h-7 rounded-full transition-transform ${
                        backgroundColor === color ? 'scale-125 ring-2 ring-violet-500 ring-offset-2' : ''
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  URL de la imagen o selecciona muestra
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full p-2.5 rounded-xl border border-neutral-200 text-xs focus:ring-2 focus:ring-violet-500 focus:outline-hidden"
                />
              </div>

              <div className="flex gap-2">
                {sampleImages.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setImageUrl(img)}
                    className="w-16 h-16 rounded-xl overflow-hidden border-2 hover:border-violet-600 transition-all"
                  >
                    <img src={img} alt="Muestra" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              Pie de foto o pie de historia (opcional)
            </label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Añade un breve comentario..."
              className="w-full p-2.5 rounded-xl border border-neutral-200 text-xs focus:ring-2 focus:ring-violet-500 focus:outline-hidden"
            />
          </div>

          <p className="text-[11px] text-neutral-500">
            ⏳ Esta historia se eliminará automáticamente transcurridas 24 horas.
          </p>

          <button
            type="submit"
            className="w-full py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
          >
            Publicar historia
          </button>
        </form>
      </div>
    </div>
  );
};
