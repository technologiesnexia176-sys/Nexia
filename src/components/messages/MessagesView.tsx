import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  Send,
  MoreVertical,
  Trash2,
  Flag,
  ShieldAlert,
  ArrowLeft,
  Smile,
  CheckCheck,
  Check,
  Eye,
  MessageCircle,
} from 'lucide-react';

export const MessagesView: React.FC = () => {
  const {
    conversations,
    messages,
    currentUser,
    allUsers,
    activeConversationId,
    setActiveConversationId,
    sendMessage,
    deleteConversation,
    blockUser,
    setReportingTarget,
    setViewingProfileId,
  } = useApp();

  const [inputContent, setInputContent] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const activeConv = conversations.find((c) => c.id === activeConversationId);
  const otherUserId = activeConv?.participantIds.find((id) => id !== currentUser.id);
  const otherUser = otherUserId ? allUsers.find((u) => u.id === otherUserId) : null;
  const activeMessages = activeConversationId ? messages[activeConversationId] || [] : [];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputContent.trim() || !activeConversationId) return;
    sendMessage(activeConversationId, inputContent.trim());
    setInputContent('');
    setShowEmojiPicker(false);
  };

  const handleAddEmoji = (emoji: string) => {
    setInputContent((prev) => prev + emoji);
  };

  const emojis = ['😊', '🎮', '🎧', '✨', '👋', '🔥', '🌸', '🍿', '💡', '💜'];

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] min-h-[500px] bg-white rounded-3xl border border-violet-100 shadow-sm overflow-hidden flex">
      {/* LEFT: Conversation List */}
      <div
        className={`w-full sm:w-80 md:w-96 border-r border-neutral-100 flex flex-col bg-neutral-50/50 ${
          activeConversationId ? 'hidden sm:flex' : 'flex'
        }`}
      >
        <div className="p-4 border-b border-neutral-200/80 bg-white">
          <h1 className="text-base font-extrabold text-neutral-900 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-violet-600" />
            <span>Mensajes Privados</span>
          </h1>
          <p className="text-[11px] text-neutral-400 mt-0.5">
            Cifrado de extremo en tránsito • Espacio seguro
          </p>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-neutral-100/80 p-2">
          {conversations.length > 0 ? (
            conversations.map((conv) => {
              const partnerId = conv.participantIds.find((id) => id !== currentUser.id);
              const partner = allUsers.find((u) => u.id === partnerId);
              if (!partner) return null;

              const isSelected = conv.id === activeConversationId;

              return (
                <button
                  key={conv.id}
                  onClick={() => setActiveConversationId(conv.id)}
                  className={`w-full p-3 rounded-2xl text-left flex items-center gap-3 transition-all ${
                    isSelected
                      ? 'bg-violet-100/70 border border-violet-200 shadow-2xs'
                      : 'hover:bg-neutral-100/70'
                  }`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={partner.avatar}
                      alt={partner.name}
                      className="w-12 h-12 rounded-full object-cover ring-1 ring-violet-200"
                    />
                    {partner.showOnlineStatus && partner.isOnline && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className="text-xs font-bold text-neutral-900 truncate">
                        {partner.name}
                      </p>
                      <span className="text-[10px] text-neutral-400">
                        {conv.lastMessageTimestamp}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 truncate">
                      {conv.lastMessage || 'Conversación vacía'}
                    </p>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="text-center py-12 px-4 text-neutral-400 space-y-2">
              <MessageCircle className="w-8 h-8 mx-auto text-neutral-300" />
              <p className="text-xs font-semibold text-neutral-700">Sin mensajes aún</p>
              <p className="text-[11px] text-neutral-500">
                Inicia una charla desde Descubrir o desde el perfil de cualquier amigo.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT: Active Chat View */}
      <div
        className={`flex-1 flex flex-col bg-white ${
          !activeConversationId ? 'hidden sm:flex items-center justify-center' : 'flex'
        }`}
      >
        {activeConv && otherUser ? (
          <>
            {/* Chat Header */}
            <div className="p-3.5 border-b border-neutral-100 flex items-center justify-between bg-white z-10 shadow-2xs">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveConversationId(null)}
                  className="sm:hidden p-1.5 text-neutral-600 hover:bg-neutral-100 rounded-lg"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>

                <button
                  onClick={() => setViewingProfileId(otherUser.id)}
                  className="flex items-center gap-2.5 text-left focus:outline-hidden group"
                >
                  <div className="relative">
                    <img
                      src={otherUser.avatar}
                      alt={otherUser.name}
                      className="w-10 h-10 rounded-full object-cover ring-1 ring-violet-200"
                    />
                    {otherUser.showOnlineStatus && otherUser.isOnline && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border border-white rounded-full" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-xs font-bold text-neutral-900 group-hover:text-violet-700 transition-colors flex items-center gap-1">
                      <span>{otherUser.name}</span>
                    </h2>
                    <p className="text-[10px] text-neutral-400">
                      {otherUser.showOnlineStatus && otherUser.isOnline ? (
                        <span className="text-emerald-600 font-medium">En línea</span>
                      ) : (
                        `@${otherUser.username}`
                      )}
                    </p>
                  </div>
                </button>
              </div>

              {/* Chat Actions Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>

                {showMenu && (
                  <div className="absolute right-0 top-10 z-30 w-48 bg-white rounded-2xl shadow-xl border border-neutral-100 py-1.5 text-xs animate-fade-in">
                    <button
                      onClick={() => {
                        setViewingProfileId(otherUser.id);
                        setShowMenu(false);
                      }}
                      className="w-full px-3.5 py-2 text-left text-neutral-700 hover:bg-neutral-50 flex items-center gap-2"
                    >
                      <Eye className="w-3.5 h-3.5 text-neutral-400" />
                      <span>Ver perfil</span>
                    </button>

                    <button
                      onClick={() => {
                        if (window.confirm('¿Deseas eliminar esta conversación de tu lista?')) {
                          deleteConversation(activeConv.id);
                          setShowMenu(false);
                        }
                      }}
                      className="w-full px-3.5 py-2 text-left text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Eliminar conversación</span>
                    </button>

                    <button
                      onClick={() => {
                        setReportingTarget({
                          type: 'message',
                          id: activeConv.id,
                          authorName: otherUser.name,
                          preview: `Chat con @${otherUser.username}`,
                        });
                        setShowMenu(false);
                      }}
                      className="w-full px-3.5 py-2 text-left text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                    >
                      <Flag className="w-3.5 h-3.5" />
                      <span>Denunciar conversación</span>
                    </button>

                    <button
                      onClick={() => {
                        if (window.confirm(`¿Bloquear a ${otherUser.name}? Ya no podrá enviarte mensajes.`)) {
                          blockUser(otherUser.id);
                          deleteConversation(activeConv.id);
                          setShowMenu(false);
                        }
                      }}
                      className="w-full px-3.5 py-2 text-left text-rose-700 hover:bg-rose-50 flex items-center gap-2 font-semibold"
                    >
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>Bloquear usuario</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-neutral-50/30 to-violet-50/10">
              <div className="text-center py-2">
                <span className="text-[10px] text-neutral-400 bg-neutral-100 px-3 py-1 rounded-full">
                  🛡️ Chat protegido. Respeta las normas de la comunidad de Nexia.
                </span>
              </div>

              {activeMessages.map((msg) => {
                const isMine = msg.senderId === currentUser.id;

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-2xs ${
                        isMine
                          ? 'bg-violet-600 text-white rounded-br-xs'
                          : 'bg-white text-neutral-800 border border-neutral-200/70 rounded-bl-xs'
                      }`}
                    >
                      {msg.content}
                    </div>

                    <div className="flex items-center gap-1 mt-1 px-1 text-[10px] text-neutral-400">
                      <span>{msg.timestamp}</span>
                      {isMine && (
                        <span>
                          {msg.isRead ? (
                            <CheckCheck className="w-3 h-3 text-violet-600" />
                          ) : (
                            <Check className="w-3 h-3 text-neutral-400" />
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Emoji Bar */}
            {showEmojiPicker && (
              <div className="px-4 py-2 border-t border-neutral-100 bg-white flex items-center gap-2 overflow-x-auto">
                {emojis.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => handleAddEmoji(emoji)}
                    className="text-lg hover:scale-125 transition-transform p-1"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}

            {/* Message Input Bar */}
            <form
              onSubmit={handleSend}
              className="p-3 border-t border-neutral-100 bg-white flex items-center gap-2"
            >
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className={`p-2 rounded-xl transition-colors ${
                  showEmojiPicker ? 'bg-violet-100 text-violet-700' : 'text-neutral-400 hover:bg-neutral-100'
                }`}
              >
                <Smile className="w-5 h-5" />
              </button>

              <input
                type="text"
                value={inputContent}
                onChange={(e) => setInputContent(e.target.value)}
                placeholder="Escribe un mensaje privado..."
                className="flex-1 text-xs sm:text-sm px-4 py-2.5 rounded-2xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:ring-2 focus:ring-violet-400 focus:outline-hidden"
              />

              <button
                type="submit"
                disabled={!inputContent.trim()}
                className="p-2.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-40 text-white rounded-2xl shadow-xs transition-colors shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </>
        ) : (
          <div className="text-center p-8 space-y-2 text-neutral-400">
            <div className="w-16 h-16 bg-violet-50 text-violet-600 rounded-3xl flex items-center justify-center mx-auto mb-3">
              <MessageCircle className="w-8 h-8" />
            </div>
            <h2 className="font-bold text-sm text-neutral-800">
              Selecciona una conversación
            </h2>
            <p className="text-xs text-neutral-500 max-w-xs mx-auto">
              Chatea de forma privada, comparte ideas o debate sobre tus animes y videojuegos favoritos.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
