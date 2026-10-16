import React from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { Plus } from 'lucide-react';

export const StoriesBar: React.FC = () => {
  const { stories, currentUser, setActiveStoryId, setIsCreateStoryOpen } = useApp();

  const userStory = stories.find((s) => s.userId === currentUser.id);

  return (
    <div className="bg-white rounded-2xl p-3 border border-violet-100/70 shadow-xs">
      <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
        {/* Current User Story slot */}
        <div className="flex flex-col items-center gap-1 shrink-0">
          <div className="relative">
            <button
              onClick={() => {
                if (userStory) {
                  setActiveStoryId(userStory.id);
                } else {
                  setIsCreateStoryOpen(true);
                }
              }}
              aria-label={userStory ? 'Ver mi historia' : 'Crear historia'}
              className={`w-14 h-14 rounded-full p-[2px] transition-transform active:scale-95 flex items-center justify-center ${
                userStory
                  ? 'bg-gradient-to-tr from-violet-600 via-fuchsia-500 to-amber-400'
                  : 'bg-neutral-200'
              }`}
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-full h-full object-cover rounded-full border-2 border-white"
              />
            </button>

            {/* Plus badge */}
            <button
              onClick={() => setIsCreateStoryOpen(true)}
              aria-label="Añadir historia"
              title="Añadir nueva historia"
              className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-violet-600 hover:bg-violet-700 text-white rounded-full flex items-center justify-center shadow-md border-2 border-white"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
            </button>
          </div>
          <span className="text-[11px] font-medium text-neutral-700 max-w-[62px] truncate">
            Tu historia
          </span>
        </div>

        {/* Other Users' active stories */}
        {stories
          .filter((s) => s.userId !== currentUser.id)
          .map((story) => (
            <button
              key={story.id}
              onClick={() => setActiveStoryId(story.id)}
              className="flex flex-col items-center gap-1 shrink-0 focus:outline-hidden group"
            >
              <div className="w-14 h-14 rounded-full p-[2px] bg-gradient-to-tr from-violet-600 via-purple-500 to-indigo-500 group-hover:scale-105 transition-transform flex items-center justify-center">
                <img
                  src={story.authorAvatar}
                  alt={story.authorName}
                  className="w-full h-full object-cover rounded-full border-2 border-white"
                />
              </div>
              <span className="text-[11px] font-medium text-neutral-700 max-w-[62px] truncate">
                {story.authorName.split(' ')[0]}
              </span>
            </button>
          ))}
      </div>
    </div>
  );
};
