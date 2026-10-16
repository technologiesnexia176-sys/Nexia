import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { X, Trash2, Clock } from 'lucide-react';

export const StoryViewerModal: React.FC = () => {
  const { activeStoryId, setActiveStoryId, stories, currentUser, deleteStory } = useApp();
  const [progress, setProgress] = useState(0);

  const story = stories.find((s) => s.id === activeStoryId);

  useEffect(() => {
    if (!story) return;
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setActiveStoryId(null);
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [story, setActiveStoryId]);

  if (!story) return null;

  const isOwner = story.userId === currentUser.id;
  const hoursRemaining = Math.max(0, Math.round((story.expiresAt - Date.now()) / (3600 * 1000)));

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      <div className="relative w-full max-w-sm h-[85vh] max-h-[700px] bg-neutral-900 rounded-3xl overflow-hidden flex flex-col justify-between shadow-2xl border border-white/10">
        {/* Progress bar */}
        <div className="absolute top-3 left-3 right-3 z-30 flex items-center gap-1">
          <div className="h-1 bg-white/30 rounded-full flex-1 overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Top Story Header */}
        <div className="relative z-30 p-4 pt-6 bg-gradient-to-b from-black/80 to-transparent flex items-center justify-between text-white">
          <div className="flex items-center gap-2.5">
            <img
              src={story.authorAvatar}
              alt={story.authorName}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-violet-500"
            />
            <div>
              <p className="text-xs font-bold leading-tight">{story.authorName}</p>
              <div className="flex items-center gap-1 text-[10px] text-neutral-300">
                <Clock className="w-3 h-3 text-violet-400" />
                <span>Expira en {hoursRemaining}h</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isOwner && (
              <button
                onClick={() => deleteStory(story.id)}
                aria-label="Eliminar mi historia"
                title="Eliminar mi historia"
                className="p-1.5 bg-black/40 hover:bg-rose-600 rounded-full text-white transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setActiveStoryId(null)}
              aria-label="Cerrar historia"
              className="p-1.5 bg-black/40 hover:bg-white/20 rounded-full text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Story Body Content */}
        <div className="flex-1 relative flex items-center justify-center p-4">
          {story.imageUrl ? (
            <img
              src={story.imageUrl}
              alt="Historia visual"
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div
              className="absolute inset-0 flex items-center justify-center p-8 text-center text-white"
              style={{ backgroundColor: story.backgroundColor || '#6D28D9' }}
            >
              <p className="text-xl font-bold leading-snug drop-shadow-md">
                {story.text}
              </p>
            </div>
          )}

          {/* Caption overlay */}
          {story.caption && (
            <div className="absolute bottom-4 left-4 right-4 z-20 bg-black/60 backdrop-blur-md p-3 rounded-2xl text-white text-xs border border-white/10 text-center">
              {story.caption}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
