import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import type { Post } from '../../types/index.ts';
import {
  Heart,
  MessageCircle,
  Share2,
  Trash2,
  Flag,
  Send,
  MoreVertical,
} from 'lucide-react';

export const PostCard: React.FC<{ post: Post }> = ({ post }) => {
  const {
    currentUser,
    likePost,
    deletePost,
    comments,
    addComment,
    setReportingTarget,
    setViewingProfileId,
  } = useApp();

  const [showComments, setShowComments] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [shareToast, setShareToast] = useState(false);

  const isLiked = post.likes.includes(currentUser.id);
  const isOwner = post.userId === currentUser.id;
  const postComments = comments[post.id] || [];

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    addComment(post.id, commentInput.trim());
    setCommentInput('');
  };

  const handleShare = () => {
    setShareToast(true);
    setTimeout(() => setShareToast(false), 2000);
  };

  const handleReport = () => {
    setReportingTarget({
      type: 'post',
      id: post.id,
      authorName: post.authorName,
      preview: post.content.slice(0, 100),
    });
    setShowMenu(false);
  };

  return (
    <article className="bg-white rounded-2xl border border-violet-100/70 shadow-xs overflow-hidden transition-all hover:border-violet-200">
      {/* Post Header */}
      <div className="p-4 pb-2.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setViewingProfileId(post.userId)}
            className="w-10 h-10 rounded-full overflow-hidden ring-1 ring-violet-200 hover:ring-violet-400 transition-all shrink-0"
          >
            <img
              src={post.authorAvatar}
              alt={post.authorName}
              className="w-full h-full object-cover"
            />
          </button>

          <div className="flex flex-col text-left">
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => setViewingProfileId(post.userId)}
                className="text-xs font-bold text-neutral-900 hover:text-violet-700 transition-colors"
              >
                {post.authorName}
              </button>
              <span className="text-[11px] text-neutral-400">@{post.authorUsername}</span>
            </div>

            <div className="flex items-center gap-2 text-[10px] text-neutral-400">
              <span>{post.createdAt}</span>
              {post.categoryTag && (
                <>
                  <span>•</span>
                  <span className="text-violet-600 font-medium bg-violet-50 px-2 py-0.5 rounded-full border border-violet-100">
                    {post.categoryTag}
                  </span>
                </>
              )}
              {post.communityName && (
                <>
                  <span>en</span>
                  <span className="font-semibold text-neutral-600 truncate max-w-[120px]">
                    {post.communityName}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Options Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            aria-label="Opciones de publicación"
            className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-full hover:bg-neutral-100"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-8 z-20 w-44 bg-white rounded-xl shadow-lg border border-neutral-100 py-1 text-xs">
              {isOwner ? (
                <button
                  onClick={() => {
                    deletePost(post.id);
                    setShowMenu(false);
                  }}
                  className="w-full px-3 py-2 text-left text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Eliminar publicación</span>
                </button>
              ) : (
                <button
                  onClick={handleReport}
                  className="w-full px-3 py-2 text-left text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                >
                  <Flag className="w-3.5 h-3.5" />
                  <span>Denunciar contenido</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Post Text Content */}
      <div className="px-4 py-1 text-neutral-800 text-sm leading-relaxed whitespace-pre-line">
        {post.content}
      </div>

      {/* Post Media Attachment */}
      {post.imageUrl && (
        <div className="mt-2.5 max-h-[420px] overflow-hidden bg-neutral-100">
          <img
            src={post.imageUrl}
            alt="Contenido de publicación"
            className="w-full h-auto object-cover max-h-[420px]"
          />
        </div>
      )}

      {/* Post Footer Actions */}
      <div className="px-4 py-2.5 mt-1 border-t border-neutral-100 flex items-center justify-between text-neutral-500 text-xs">
        <div className="flex items-center gap-4">
          {/* Like button */}
          <button
            onClick={() => likePost(post.id)}
            className={`flex items-center gap-1.5 transition-colors ${
              isLiked ? 'text-rose-600 font-bold' : 'hover:text-rose-600'
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500 stroke-rose-500' : ''}`} />
            <span>{post.likes.length}</span>
          </button>

          {/* Comments trigger */}
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1.5 hover:text-violet-700 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{postComments.length || post.commentsCount}</span>
          </button>

          {/* Share */}
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 hover:text-violet-700 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span>Compartir</span>
          </button>
        </div>

        {shareToast && (
          <span className="text-[11px] text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-md animate-fade-in">
            Enlace copiado al portapapeles
          </span>
        )}
      </div>

      {/* Comments section */}
      {showComments && (
        <div className="px-4 py-3 bg-neutral-50/80 border-t border-neutral-100 space-y-3">
          {/* List of comments */}
          {postComments.length > 0 ? (
            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {postComments.map((comment) => (
                <div key={comment.id} className="flex items-start gap-2.5 text-xs">
                  <img
                    src={comment.userAvatar}
                    alt={comment.userName}
                    className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5"
                  />
                  <div className="bg-white p-2.5 rounded-xl border border-neutral-200/60 shadow-2xs flex-1">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-bold text-neutral-900">{comment.userName}</span>
                      <span className="text-[10px] text-neutral-400">{comment.createdAt}</span>
                    </div>
                    <p className="text-neutral-700 leading-normal">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-neutral-400 text-center py-1">
              Sé el primero en comentar con respeto y buena onda.
            </p>
          )}

          {/* Add comment input */}
          <form onSubmit={handleCommentSubmit} className="flex items-center gap-2">
            <input
              type="text"
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              placeholder="Escribe un comentario respetuoso..."
              className="flex-1 text-xs px-3 py-2 rounded-xl border border-neutral-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-violet-400"
            />
            <button
              type="submit"
              disabled={!commentInput.trim()}
              className="p-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-40 text-white rounded-xl transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </article>
  );
};
