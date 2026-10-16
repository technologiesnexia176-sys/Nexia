import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  X,
  UserCheck,
  Clock,
  Send,
  Trash2,
  ShieldAlert,
  MessageCircle,
  Eye,
} from 'lucide-react';

export const ConnectionsModal: React.FC = () => {
  const {
    isConnectionsModalOpen,
    setIsConnectionsModalOpen,
    connections,
    currentUser,
    allUsers,
    acceptConnectionRequest,
    rejectConnectionRequest,
    cancelConnectionRequest,
    removeConnection,
    blockUser,
    startOrOpenConversation,
    setViewingProfileId,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'connected' | 'received' | 'sent'>('connected');

  if (!isConnectionsModalOpen) return null;

  // Active accepted connections
  const connectedUserIds = connections
    .filter((c) => c.status === 'accepted')
    .map((c) => (c.fromUserId === currentUser.id ? c.toUserId : c.fromUserId));

  const connectedUsers = allUsers.filter((u) => connectedUserIds.includes(u.id));

  // Pending received requests
  const receivedRequests = connections.filter(
    (c) => c.toUserId === currentUser.id && c.status === 'pending'
  );

  // Pending sent requests
  const sentRequests = connections.filter(
    (c) => c.fromUserId === currentUser.id && c.status === 'pending'
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-violet-100 flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-violet-100 rounded-xl text-violet-700">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-neutral-900 text-sm">Gestor de Conexiones</h2>
              <p className="text-[11px] text-neutral-500">Amistades y solicitudes en Nexia</p>
            </div>
          </div>

          <button
            onClick={() => setIsConnectionsModalOpen(false)}
            aria-label="Cerrar modal de conexiones"
            className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab pills */}
        <div className="flex border-b border-neutral-100 p-2 gap-1 bg-neutral-50 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('connected')}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'connected'
                ? 'bg-white shadow-xs text-violet-700 font-bold'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <span>Conectados</span>
            <span className="text-[10px] bg-violet-100 px-1.5 py-0.2 rounded-full text-violet-700">
              {connectedUsers.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('received')}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'received'
                ? 'bg-white shadow-xs text-violet-700 font-bold'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <span>Recibidas</span>
            {receivedRequests.length > 0 && (
              <span className="text-[10px] bg-rose-500 text-white px-1.5 py-0.2 rounded-full font-bold">
                {receivedRequests.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('sent')}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'sent'
                ? 'bg-white shadow-xs text-violet-700 font-bold'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <span>Enviadas</span>
            <span className="text-[10px] bg-neutral-200 px-1.5 py-0.2 rounded-full text-neutral-600">
              {sentRequests.length}
            </span>
          </button>
        </div>

        {/* Tab Content List */}
        <div className="p-4 overflow-y-auto flex-1 space-y-3">
          {/* TAB 1: CONNECTED FRIENDS */}
          {activeTab === 'connected' && (
            <>
              {connectedUsers.length > 0 ? (
                connectedUsers.map((user) => (
                  <div
                    key={user.id}
                    className="p-3 bg-neutral-50/70 hover:bg-neutral-50 rounded-2xl border border-neutral-200/60 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative shrink-0">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-11 h-11 rounded-full object-cover ring-1 ring-violet-200"
                        />
                        {user.showOnlineStatus && user.isOnline && (
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                        )}
                      </div>

                      <div className="truncate">
                        <p className="text-xs font-bold text-neutral-900 truncate">
                          {user.name}
                        </p>
                        <p className="text-[10px] text-neutral-500 truncate">
                          @{user.username} • {user.city ? `${user.city}, ` : ''}{user.country}
                        </p>
                        <span className="text-[9px] font-semibold text-violet-700 bg-violet-100/70 px-1.5 py-0.2 rounded-md">
                          {user.connectionType}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => {
                          setIsConnectionsModalOpen(false);
                          startOrOpenConversation(user.id);
                        }}
                        title="Enviar mensaje privado"
                        className="p-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl shadow-xs transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          setIsConnectionsModalOpen(false);
                          setViewingProfileId(user.id);
                        }}
                        title="Ver perfil"
                        className="p-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 rounded-xl transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          if (window.confirm(`¿Eliminar la conexión con ${user.name}?`)) {
                            removeConnection(user.id);
                          }
                        }}
                        title="Eliminar conexión"
                        className="p-2 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-neutral-400 space-y-1">
                  <UserCheck className="w-8 h-8 mx-auto text-neutral-300" />
                  <p className="text-xs font-semibold text-neutral-700">Aún no tienes conexiones</p>
                  <p className="text-[11px] text-neutral-500">
                    Visita la pestaña Descubrir para conectar con personas con tus mismos gustos.
                  </p>
                </div>
              )}
            </>
          )}

          {/* TAB 2: RECEIVED REQUESTS */}
          {activeTab === 'received' && (
            <>
              {receivedRequests.length > 0 ? (
                receivedRequests.map((req) => {
                  const requester = allUsers.find((u) => u.id === req.fromUserId);
                  if (!requester) return null;

                  return (
                    <div
                      key={req.id}
                      className="p-3 bg-violet-50/50 rounded-2xl border border-violet-100 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={requester.avatar}
                          alt={requester.name}
                          className="w-11 h-11 rounded-full object-cover ring-1 ring-violet-200 shrink-0"
                        />
                        <div className="truncate">
                          <p className="text-xs font-bold text-neutral-900 truncate">
                            {requester.name}
                          </p>
                          <p className="text-[10px] text-neutral-500 truncate">
                            Busca: {requester.connectionType}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => acceptConnectionRequest(req.id)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                        >
                          Aceptar
                        </button>
                        <button
                          onClick={() => rejectConnectionRequest(req.id)}
                          className="px-3 py-1.5 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 rounded-xl text-xs font-medium transition-colors"
                        >
                          Rechazar
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-neutral-400 space-y-1">
                  <Clock className="w-8 h-8 mx-auto text-neutral-300" />
                  <p className="text-xs font-semibold text-neutral-700">No hay solicitudes pendientes</p>
                  <p className="text-[11px] text-neutral-500">
                    Te notificaremos cuando alguien quiera conectar contigo.
                  </p>
                </div>
              )}
            </>
          )}

          {/* TAB 3: SENT REQUESTS */}
          {activeTab === 'sent' && (
            <>
              {sentRequests.length > 0 ? (
                sentRequests.map((req) => {
                  const targetUser = allUsers.find((u) => u.id === req.toUserId);
                  if (!targetUser) return null;

                  return (
                    <div
                      key={req.id}
                      className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200/60 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={targetUser.avatar}
                          alt={targetUser.name}
                          className="w-10 h-10 rounded-full object-cover shrink-0"
                        />
                        <div className="truncate">
                          <p className="text-xs font-bold text-neutral-900 truncate">
                            {targetUser.name}
                          </p>
                          <span className="text-[10px] text-neutral-400">
                            Pendiente de respuesta
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => cancelConnectionRequest(req.id)}
                        className="px-2.5 py-1 text-xs text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg transition-colors font-medium shrink-0"
                      >
                        Cancelar
                      </button>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-neutral-400 space-y-1">
                  <Send className="w-8 h-8 mx-auto text-neutral-300" />
                  <p className="text-xs font-semibold text-neutral-700">No tienes solicitudes enviadas</p>
                  <p className="text-[11px] text-neutral-500">
                    Las solicitudes que envíes a otros usuarios aparecerán aquí.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
