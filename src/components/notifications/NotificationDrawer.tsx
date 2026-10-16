import React from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  X,
  Bell,
  UserPlus,
  CheckCircle,
  MessageCircle,
  Heart,
  MessageSquare,
  Users,
  CheckCheck,
} from 'lucide-react';

export const NotificationDrawer: React.FC = () => {
  const {
    isNotificationsOpen,
    setIsNotificationsOpen,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    setActiveTab,
    setIsConnectionsModalOpen,
  } = useApp();

  if (!isNotificationsOpen) return null;

  const handleNotificationClick = (notif: (typeof notifications)[0]) => {
    markNotificationRead(notif.id);
    setIsNotificationsOpen(false);

    if (notif.type === 'connection_request' || notif.type === 'connection_accepted') {
      setIsConnectionsModalOpen(true);
    } else if (notif.type === 'message') {
      setActiveTab('messages');
    } else if (notif.type === 'community') {
      setActiveTab('communities');
    } else {
      setActiveTab('feed');
    }
  };

  const getIcon = (type: (typeof notifications)[0]['type']) => {
    switch (type) {
      case 'connection_request':
        return <UserPlus className="w-4 h-4 text-violet-600" />;
      case 'connection_accepted':
        return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      case 'message':
        return <MessageCircle className="w-4 h-4 text-sky-600" />;
      case 'reaction':
        return <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />;
      case 'comment':
        return <MessageSquare className="w-4 h-4 text-amber-500" />;
      case 'community':
        return <Users className="w-4 h-4 text-indigo-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-violet-100 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 border-b border-neutral-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-violet-100 text-violet-700 rounded-xl">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-neutral-900 text-sm">Notificaciones</h2>
              <p className="text-[11px] text-neutral-500">Actividad de tu red social</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={markAllNotificationsRead}
              title="Marcar todas como leídas"
              className="p-1.5 text-xs text-violet-700 hover:bg-violet-50 rounded-lg font-medium flex items-center gap-1"
            >
              <CheckCheck className="w-4 h-4" />
              <span className="hidden xs:inline">Leídas</span>
            </button>
            <button
              onClick={() => setIsNotificationsOpen(false)}
              aria-label="Cerrar notificaciones"
              className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="p-3 overflow-y-auto flex-1 divide-y divide-neutral-100 space-y-1">
          {notifications.length > 0 ? (
            notifications.map((notif) => (
              <button
                key={notif.id}
                onClick={() => handleNotificationClick(notif)}
                className={`w-full p-3 rounded-2xl text-left flex items-start gap-3 transition-colors ${
                  notif.isRead ? 'hover:bg-neutral-50' : 'bg-violet-50/60 hover:bg-violet-50'
                }`}
              >
                <div className="p-2 bg-white rounded-xl shadow-2xs shrink-0 mt-0.5 border border-neutral-100">
                  {getIcon(notif.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className={`text-xs truncate ${notif.isRead ? 'font-semibold text-neutral-800' : 'font-extrabold text-neutral-900'}`}>
                      {notif.title}
                    </p>
                    <span className="text-[10px] text-neutral-400 shrink-0 ml-1">
                      {notif.createdAt}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 leading-normal line-clamp-2">
                    {notif.message}
                  </p>
                </div>

                {!notif.isRead && (
                  <span className="w-2 h-2 bg-violet-600 rounded-full shrink-0 self-center" />
                )}
              </button>
            ))
          ) : (
            <div className="text-center py-12 text-neutral-400">
              <Bell className="w-8 h-8 mx-auto text-neutral-300 mb-1" />
              <p className="font-bold text-neutral-800 text-xs">Sin notificaciones</p>
              <p className="text-[11px] text-neutral-500">Estás al día con todas las novedades.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
