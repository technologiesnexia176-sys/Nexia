import React from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { NexiaLogo } from './NexiaLogo.tsx';
import {
  Bell,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Smartphone,
  Monitor,
  Settings,
  ShieldAlert,
  Crown,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentUser,
    unreadNotificationsCount,
    setIsNotificationsOpen,
    setActiveTab,
    setIsSafetyOpen,
    setIsPlusModalOpen,
    setIsPremiumPortalOpen,
    setIsAdminOpen,
    setIsSettingsOpen,
    useMobileFrame,
    setUseMobileFrame,
  } = useApp();

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-violet-100 shadow-xs px-4 py-2.5 flex items-center justify-between">
      {/* Brand & Slogan */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setActiveTab('feed')}
          className="flex items-center text-left focus:outline-hidden"
          title="Nexia — Conexiones reales, en un espacio seguro"
        >
          <NexiaLogo size="md" />
        </button>

        <span className="hidden md:inline-flex text-xs font-medium text-neutral-500 bg-violet-50/80 px-2.5 py-1 rounded-full border border-violet-100/60">
          «Conexiones reales, en un espacio seguro»
        </span>
      </div>

      {/* Action controls */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Toggle mobile / desktop frame simulation for testing */}
        <button
          onClick={() => setUseMobileFrame(!useMobileFrame)}
          aria-label={useMobileFrame ? 'Vista Pantalla Completa' : 'Vista Marco Android'}
          title={useMobileFrame ? 'Cambiar a vista completa' : 'Simular teléfono Android'}
          className="hidden sm:flex items-center gap-1 px-2 py-1 text-xs font-medium text-neutral-600 hover:text-violet-700 hover:bg-violet-50 rounded-lg transition-colors border border-neutral-200"
        >
          {useMobileFrame ? (
            <>
              <Monitor className="w-3.5 h-3.5 text-violet-600" />
              <span>Expandir</span>
            </>
          ) : (
            <>
              <Smartphone className="w-3.5 h-3.5 text-violet-600" />
              <span>Android</span>
            </>
          )}
        </button>

        {/* Sitio Premium Button / Badge */}
        <button
          onClick={() => setIsPremiumPortalOpen(true)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all shadow-xs ${
            currentUser.subscriptionTier === 'plus_199' || currentUser.isPlusSubscriber
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white'
              : currentUser.subscriptionTier === 'pass_99'
              ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white'
              : 'bg-gradient-to-r from-violet-100 to-purple-100 text-violet-800 hover:from-violet-200 hover:to-purple-200 border border-violet-200'
          }`}
          title="Sitio Premium Nexia (desde US$0.99/mes)"
        >
          <Crown className="w-3.5 h-3.5 fill-current" />
          <span className="hidden xs:inline">
            {currentUser.subscriptionTier === 'plus_199' || currentUser.isPlusSubscriber
              ? 'Nexia Plus'
              : currentUser.subscriptionTier === 'pass_99'
              ? 'Nexia Pass'
              : 'Sitio Premium (0.99$)'}
          </span>
        </button>

        {/* Safety Center */}
        <button
          onClick={() => setIsSafetyOpen(true)}
          aria-label="Centro de Seguridad y Normas"
          title="Centro de Seguridad y Normas de Nexia"
          className="p-2 text-neutral-600 hover:text-violet-700 hover:bg-violet-50 rounded-full transition-colors"
        >
          <ShieldCheck className="w-5 h-5 text-violet-600" />
        </button>

        {/* Admin Dashboard button (if admin) */}
        {currentUser.role === 'admin' && (
          <button
            onClick={() => setIsAdminOpen(true)}
            aria-label="Panel Administrativo"
            title="Panel de Control y Moderación"
            className="p-2 text-rose-600 hover:bg-rose-50 rounded-full transition-colors relative"
          >
            <ShieldAlert className="w-5 h-5" />
            <span className="sr-only">Admin</span>
          </button>
        )}

        {/* Notifications */}
        <button
          onClick={() => setIsNotificationsOpen(true)}
          aria-label="Notificaciones"
          className="p-2 text-neutral-600 hover:text-violet-700 hover:bg-violet-50 rounded-full transition-colors relative"
        >
          <Bell className="w-5 h-5" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
              {unreadNotificationsCount}
            </span>
          )}
        </button>

        {/* Direct Messages Quick Access */}
        <button
          onClick={() => setActiveTab('messages')}
          aria-label="Mensajes Privados"
          className="p-2 text-neutral-600 hover:text-violet-700 hover:bg-violet-50 rounded-full transition-colors"
        >
          <MessageCircle className="w-5 h-5" />
        </button>

        {/* Account Settings */}
        <button
          onClick={() => setIsSettingsOpen(true)}
          aria-label="Ajustes de la cuenta"
          className="p-2 text-neutral-600 hover:text-violet-700 hover:bg-violet-50 rounded-full transition-colors"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};
