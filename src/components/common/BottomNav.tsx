import React from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  Home,
  Compass,
  Users,
  MessageCircle,
  User,
} from 'lucide-react';

interface NavItem {
  id: 'feed' | 'discover' | 'communities' | 'messages' | 'profile';
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  avatar?: string;
}

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, currentUser, conversations } = useApp();

  const totalUnreadMessages = conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);

  const navItems: NavItem[] = [
    { id: 'feed', label: 'Inicio', icon: Home },
    { id: 'discover', label: 'Descubrir', icon: Compass },
    { id: 'communities', label: 'Comunidades', icon: Users },
    {
      id: 'messages',
      label: 'Mensajes',
      icon: MessageCircle,
      badge: totalUnreadMessages > 0 ? totalUnreadMessages : undefined,
    },
    { id: 'profile', label: 'Perfil', icon: User, avatar: currentUser.avatar },
  ];

  return (
    <nav
      aria-label="Navegación principal"
      className="sticky bottom-0 z-30 bg-white/95 backdrop-blur-md border-t border-violet-100 shadow-md px-2 py-1.5 flex items-center justify-around"
    >
      {navItems.map((item) => {
        const isActive = activeTab === item.id;
        const Icon = item.icon;

        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            aria-label={item.label}
            aria-current={isActive ? 'page' : undefined}
            className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all relative ${
              isActive
                ? 'text-violet-700 font-bold'
                : 'text-neutral-500 hover:text-neutral-900 font-medium'
            }`}
          >
            <div className="relative flex items-center justify-center">
              {item.avatar && isActive ? (
                <div className="w-6 h-6 rounded-full ring-2 ring-violet-600 p-[1px] overflow-hidden">
                  <img
                    src={item.avatar}
                    alt={currentUser.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              ) : (
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-110 stroke-[2.4]' : 'scale-100 stroke-[1.8]'
                  }`}
                />
              )}

              {item.badge && (
                <span className="absolute -top-1 -right-2 bg-rose-500 text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </div>

            <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-[76px]">
              {item.label}
            </span>

            {isActive && (
              <span className="w-1 h-1 bg-violet-600 rounded-full mt-0.5" />
            )}
          </button>
        );
      })}
    </nav>
  );
};
