import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  X,
  Lock,
  Bell,
  Shield,
  UserX,
  FileText,
  LifeBuoy,
  LogOut,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

export const SettingsModal: React.FC = () => {
  const {
    isSettingsOpen,
    setIsSettingsOpen,
    logout,
    deleteAccount,
    blockedUserIds,
    unblockUser,
    allUsers,
    setIsSafetyOpen,
  } = useApp();

  const [activeSubView, setActiveSubView] = useState<'main' | 'blocked' | 'password' | 'notifications' | 'support' | 'delete'>('main');

  // Change password state
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [passSuccess, setPassSuccess] = useState(false);

  // Notification toggles
  const [pushNotifs, setPushNotifs] = useState(true);
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [activityNotifs, setActivityNotifs] = useState(true);

  // Support message
  const [supportMessage, setSupportMessage] = useState('');
  const [supportSent, setSupportSent] = useState(false);

  // Account deletion confirmation
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  if (!isSettingsOpen) return null;

  const blockedUsers = allUsers.filter((u) => blockedUserIds.includes(u.id));

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPass || !newPass) return;
    setPassSuccess(true);
    setTimeout(() => {
      setPassSuccess(false);
      setOldPass('');
      setNewPass('');
      setActiveSubView('main');
    }, 1500);
  };

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportMessage.trim()) return;
    setSupportSent(true);
    setTimeout(() => {
      setSupportSent(false);
      setSupportMessage('');
      setActiveSubView('main');
    }, 1500);
  };

  const handleDeleteAccountConfirm = () => {
    if (deleteConfirmText.trim().toUpperCase() === 'ELIMINAR') {
      deleteAccount();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-violet-100 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-neutral-900 text-sm">
              {activeSubView === 'main'
                ? 'Configuración de la cuenta'
                : activeSubView === 'blocked'
                ? 'Usuarios bloqueados'
                : activeSubView === 'password'
                ? 'Cambiar contraseña'
                : activeSubView === 'notifications'
                ? 'Preferencias de notificaciones'
                : activeSubView === 'support'
                ? 'Contacto y soporte'
                : 'Eliminar cuenta'}
            </h2>
          </div>
          <button
            onClick={() => {
              if (activeSubView !== 'main') {
                setActiveSubView('main');
              } else {
                setIsSettingsOpen(false);
              }
            }}
            aria-label="Cerrar ajustes"
            className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto flex-1 text-xs">
          {activeSubView === 'main' && (
            <div className="space-y-1">
              <button
                onClick={() => setActiveSubView('password')}
                className="w-full p-3 rounded-2xl hover:bg-neutral-50 flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-violet-100 text-violet-700 rounded-xl">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-neutral-800">Cambiar contraseña</p>
                    <p className="text-[11px] text-neutral-400">Actualiza tus credenciales de acceso</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-400" />
              </button>

              <button
                onClick={() => setActiveSubView('notifications')}
                className="w-full p-3 rounded-2xl hover:bg-neutral-50 flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-violet-100 text-violet-700 rounded-xl">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-neutral-800">Gestionar notificaciones</p>
                    <p className="text-[11px] text-neutral-400">Avisos de mensajes, comentarios y solicitudes</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-400" />
              </button>

              <button
                onClick={() => setActiveSubView('blocked')}
                className="w-full p-3 rounded-2xl hover:bg-neutral-50 flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-rose-100 text-rose-700 rounded-xl">
                    <UserX className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-neutral-800">Usuarios bloqueados ({blockedUserIds.length})</p>
                    <p className="text-[11px] text-neutral-400">Gestiona tu lista de bloqueo</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-400" />
              </button>

              <button
                onClick={() => {
                  setIsSettingsOpen(false);
                  setIsSafetyOpen(true);
                }}
                className="w-full p-3 rounded-2xl hover:bg-neutral-50 flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-neutral-800">Condiciones de uso y privacidad</p>
                    <p className="text-[11px] text-neutral-400">Normas comunitarias y protección de datos</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-400" />
              </button>

              <button
                onClick={() => setActiveSubView('support')}
                className="w-full p-3 rounded-2xl hover:bg-neutral-50 flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-sky-100 text-sky-700 rounded-xl">
                    <LifeBuoy className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-neutral-800">Contactar con soporte</p>
                    <p className="text-[11px] text-neutral-400">Ayuda con tu cuenta y sugerencias</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-400" />
              </button>

              <div className="pt-4 border-t border-neutral-100 space-y-2">
                <button
                  onClick={logout}
                  className="w-full p-3 rounded-2xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Cerrar sesión</span>
                </button>

                <button
                  onClick={() => setActiveSubView('delete')}
                  className="w-full p-2.5 text-center text-rose-600 hover:text-rose-700 font-semibold transition-colors block text-[11px]"
                >
                  Solicitar eliminación permanente de mi cuenta
                </button>
              </div>
            </div>
          )}

          {/* SUB-VIEW: BLOCKED USERS */}
          {activeSubView === 'blocked' && (
            <div className="space-y-3">
              <p className="text-[11px] text-neutral-500">
                Las personas en esta lista no pueden ver tu perfil, enviarte mensajes ni interactuar con tus publicaciones.
              </p>

              {blockedUsers.length > 0 ? (
                blockedUsers.map((user) => (
                  <div
                    key={user.id}
                    className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-9 h-9 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-bold text-neutral-900">{user.name}</p>
                        <p className="text-[10px] text-neutral-400">@{user.username}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => unblockUser(user.id)}
                      className="px-3 py-1 bg-white hover:bg-violet-50 text-violet-700 border border-violet-200 rounded-xl text-xs font-semibold"
                    >
                      Desbloquear
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-neutral-400">
                  <UserX className="w-8 h-8 mx-auto text-neutral-300 mb-1" />
                  <p className="font-semibold text-neutral-700">No tienes usuarios bloqueados</p>
                </div>
              )}
            </div>
          )}

          {/* SUB-VIEW: CHANGE PASSWORD */}
          {activeSubView === 'password' && (
            <form onSubmit={handleChangePassword} className="space-y-3">
              {passSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Contraseña actualizada correctamente.</span>
                </div>
              )}
              <div>
                <label className="block font-bold text-neutral-700 mb-1">Contraseña actual</label>
                <input
                  type="password"
                  required
                  value={oldPass}
                  onChange={(e) => setOldPass(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">Nueva contraseña</label>
                <input
                  type="password"
                  required
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl shadow-xs"
              >
                Guardar nueva contraseña
              </button>
            </form>
          )}

          {/* SUB-VIEW: NOTIFICATIONS */}
          {activeSubView === 'notifications' && (
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 bg-neutral-50 rounded-2xl border border-neutral-100">
                <div>
                  <p className="font-bold text-neutral-800">Notificaciones en la app</p>
                  <p className="text-[10px] text-neutral-400">Avisos instantáneos de actividad</p>
                </div>
                <input
                  type="checkbox"
                  checked={pushNotifs}
                  onChange={(e) => setPushNotifs(e.target.checked)}
                  className="rounded text-violet-600 w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-neutral-50 rounded-2xl border border-neutral-100">
                <div>
                  <p className="font-bold text-neutral-800">Correos electrónicos de resumen</p>
                  <p className="text-[10px] text-neutral-400">Resumen semanal de comunidades</p>
                </div>
                <input
                  type="checkbox"
                  checked={emailNotifs}
                  onChange={(e) => setEmailNotifs(e.target.checked)}
                  className="rounded text-violet-600 w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-neutral-50 rounded-2xl border border-neutral-100">
                <div>
                  <p className="font-bold text-neutral-800">Alertas de solicitudes de conexión</p>
                  <p className="text-[10px] text-neutral-400">Cuando alguien desea conectar</p>
                </div>
                <input
                  type="checkbox"
                  checked={activityNotifs}
                  onChange={(e) => setActivityNotifs(e.target.checked)}
                  className="rounded text-violet-600 w-4 h-4"
                />
              </label>
            </div>
          )}

          {/* SUB-VIEW: SUPPORT */}
          {activeSubView === 'support' && (
            <form onSubmit={handleSupportSubmit} className="space-y-3">
              {supportSent ? (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Tu mensaje ha sido enviado al equipo de soporte de Nexia Technologies.</span>
                </div>
              ) : (
                <>
                  <p className="text-[11px] text-neutral-500">
                    ¿Tienes dudas, problemas técnicos o sugerencias para Nexia? Escríbenos directamente.
                  </p>
                  <textarea
                    rows={4}
                    required
                    value={supportMessage}
                    onChange={(e) => setSupportMessage(e.target.value)}
                    placeholder="Describe en qué te podemos ayudar..."
                    className="w-full p-3 rounded-2xl border border-neutral-200 bg-neutral-50 text-xs focus:ring-2 focus:ring-violet-400 focus:outline-hidden"
                  />
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl shadow-xs"
                  >
                    Enviar ticket de soporte
                  </button>
                </>
              )}
            </form>
          )}

          {/* SUB-VIEW: ACCOUNT DELETION */}
          {activeSubView === 'delete' && (
            <div className="space-y-3 text-neutral-700">
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 space-y-1">
                <div className="flex items-center gap-2 font-bold text-rose-900">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Eliminación permanente e irreversible</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Esta acción eliminará de forma definitiva tu perfil de Nexia, todas tus publicaciones, historias, conexiones y mensajes. No podrás recuperar tu cuenta una vez confirmada.
                </p>
              </div>

              <div>
                <label className="block font-bold text-neutral-800 mb-1">
                  Escribe la palabra <span className="text-rose-600 font-mono">ELIMINAR</span> para confirmar:
                </label>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="ELIMINAR"
                  className="w-full p-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-xs focus:ring-2 focus:ring-rose-400 focus:outline-hidden font-mono"
                />
              </div>

              <button
                type="button"
                onClick={handleDeleteAccountConfirm}
                disabled={deleteConfirmText.trim().toUpperCase() !== 'ELIMINAR'}
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white font-bold rounded-xl shadow-md transition-colors"
              >
                Eliminar mi cuenta definitivamente
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
