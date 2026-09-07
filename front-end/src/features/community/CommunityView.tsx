import { useState } from 'react';
import type { FormEvent } from 'react';
import {
  HeartIcon,
  MessageCircleIcon,
  PlusIcon,
  SparklesIcon,
  TrashIcon,
  UsersIcon,
} from '../../components/icons/Icons';
import type { Post, PostCategory, UserRole } from '../../types/api';

type CommunityViewProps = {
  posts: Post[];
  currentUserId: string;
  userRole?: UserRole;
  loading: boolean;
  onCreatePost: (conteudo: string, categoria: PostCategory) => Promise<void>;
  onLikePost: (postId: string) => Promise<void>;
  onCommentPost: (postId: string, conteudo: string) => Promise<void>;
  onDeletePost: (postId: string) => Promise<void>;
};

const CATEGORIES: PostCategory[] = ['Geral', 'Treino', 'Evolução', 'Nutrição', 'Dicas'];

export function CommunityView({
  posts,
  currentUserId,
  userRole,
  loading,
  onCreatePost,
  onLikePost,
  onCommentPost,
  onDeletePost,
}: CommunityViewProps) {
  const [selectedFilter, setSelectedFilter] = useState<'Todas' | PostCategory>('Todas');
  const [newPostText, setNewPostText] = useState('');
  const [newPostCategory, setNewPostCategory] = useState<PostCategory>('Treino');
  const [openComments, setOpenComments] = useState<{ [postId: string]: boolean }>({});
  const [commentTexts, setCommentTexts] = useState<{ [postId: string]: string }>({});

  const filteredPosts = posts.filter(
    (p) => selectedFilter === 'Todas' || p.categoria === selectedFilter,
  );

  const getInitials = (name?: string) => {
    if (!name) return 'VF';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const getCategoryClass = (cat: PostCategory) => {
    switch (cat) {
      case 'Evolução':
        return 'cat-evolution';
      case 'Treino':
        return 'cat-workout';
      case 'Nutrição':
        return 'cat-nutrition';
      case 'Dicas':
        return 'cat-tips';
      default:
        return 'cat-general';
    }
  };

  const handleCreatePost = async (e: FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;
    await onCreatePost(newPostText, newPostCategory);
    setNewPostText('');
  };

  const toggleComments = (postId: string) => {
    setOpenComments((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleAddComment = async (postId: string, e: FormEvent) => {
    e.preventDefault();
    const text = commentTexts[postId]?.trim();
    if (!text) return;
    await onCommentPost(postId, text);
    setCommentTexts((prev) => ({ ...prev, [postId]: '' }));
  };

  return (
    <div className="view-container">
      {/* Header */}
      <header className="view-header-row">
        <div>
          <div className="date-pill">
            <UsersIcon size={14} />
            <span>Rede Social & Comunidade</span>
          </div>
          <h1 className="view-title">Comunidade VitalFIT</h1>
          <p className="view-subtitle">
            Conecte-se com outros atletas, compartilhe seus recordes pessoais, dicas e motive a comunidade!
          </p>
        </div>
      </header>

      {/* Composer Card */}
      <section className="community-composer-card">
        <form onSubmit={handleCreatePost} className="composer-form">
          <div className="composer-top">
            <label htmlFor="composer-textarea" className="composer-label">
              <SparklesIcon size={16} />
              <span>O que você conquistou hoje?</span>
            </label>
            <div className="composer-category-picker">
              <span>Categoria:</span>
              <select
                value={newPostCategory}
                onChange={(e) => setNewPostCategory(e.target.value as PostCategory)}
                className="category-select"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <textarea
            id="composer-textarea"
            className="composer-input"
            rows={3}
            placeholder="Ex: Treino pesado de pernas concluído! Bati minha meta de 450 kcal e novo recorde no agachamento! 💪🔥"
            value={newPostText}
            onChange={(e) => setNewPostText(e.target.value)}
            required
            minLength={3}
          />

          <div className="composer-actions">
            <span className="composer-tip">Seja respeitoso e inspire os outros atletas!</span>
            <button type="submit" className="btn-primary" disabled={loading || !newPostText.trim()}>
              <PlusIcon size={16} />
              <span>{loading ? 'Publicando...' : 'Publicar no Feed'}</span>
            </button>
          </div>
        </form>
      </section>

      {/* Categories Filter */}
      <div className="filters-bar">
        <div className="filter-pills-scroll">
          <button
            type="button"
            className={`filter-chip ${selectedFilter === 'Todas' ? 'active' : ''}`}
            onClick={() => setSelectedFilter('Todas')}
          >
            Todas ({posts.length})
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`filter-chip ${selectedFilter === cat ? 'active' : ''}`}
              onClick={() => setSelectedFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Feed Posts */}
      <section className="feed-posts-list">
        {filteredPosts.map((post) => {
          const hasLiked = post.likes?.includes(currentUserId);
          const commentsCount = post.comments?.length ?? 0;
          const isOwner = post.userId === currentUserId || userRole === 'admin';
          const isCommentsOpen = Boolean(openComments[post.id]);

          return (
            <article key={post.id} className="post-card">
              {/* Post Header */}
              <div className="post-header">
                <div className="post-author-wrap">
                  <div className="author-avatar">{getInitials(post.autorNome)}</div>
                  <div className="author-details">
                    <span className="author-name">{post.autorNome}</span>
                    <span className="post-timestamp">
                      {new Date(post.createdAt).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>

                <div className="post-header-badges">
                  <span className={`post-category-tag ${getCategoryClass(post.categoria)}`}>
                    {post.categoria}
                  </span>
                  {isOwner ? (
                    <button
                      type="button"
                      className="btn-delete-post"
                      onClick={() => onDeletePost(post.id)}
                      title="Excluir publicação"
                    >
                      <TrashIcon size={15} />
                    </button>
                  ) : null}
                </div>
              </div>

              {/* Post Body */}
              <div className="post-body">
                <p>{post.conteudo}</p>
              </div>

              {/* Post Actions (Like & Comment buttons) */}
              <div className="post-actions-bar">
                <button
                  type="button"
                  className={`btn-action-like ${hasLiked ? 'liked' : ''}`}
                  onClick={() => onLikePost(post.id)}
                  title={hasLiked ? 'Descurtir' : 'Curtir'}
                >
                  <HeartIcon size={18} filled={hasLiked} />
                  <span>{post.likes?.length ?? 0}</span>
                </button>

                <button
                  type="button"
                  className="btn-action-comment"
                  onClick={() => toggleComments(post.id)}
                >
                  <MessageCircleIcon size={18} />
                  <span>{commentsCount} comentários</span>
                </button>
              </div>

              {/* Expandable Comments Section */}
              {isCommentsOpen ? (
                <div className="comments-section">
                  {/* Comments list */}
                  <div className="comments-list">
                    {post.comments?.map((comment) => (
                      <div key={comment.id} className="comment-bubble">
                        <div className="comment-top">
                          <strong className="comment-author">{comment.autorNome}</strong>
                          <span className="comment-time">
                            {new Date(comment.createdAt).toLocaleTimeString('pt-BR', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <p className="comment-text">{comment.conteudo}</p>
                      </div>
                    ))}
                    {commentsCount === 0 ? (
                      <p className="no-comments-hint">Seja o primeiro a comentar!</p>
                    ) : null}
                  </div>

                  {/* Add comment form */}
                  <form
                    onSubmit={(e) => handleAddComment(post.id, e)}
                    className="add-comment-form"
                  >
                    <input
                      type="text"
                      className="comment-input"
                      placeholder="Escreva um comentário..."
                      value={commentTexts[post.id] ?? ''}
                      onChange={(e) =>
                        setCommentTexts((prev) => ({ ...prev, [post.id]: e.target.value }))
                      }
                      required
                    />
                    <button
                      type="submit"
                      className="btn-submit-comment"
                      disabled={!commentTexts[post.id]?.trim()}
                    >
                      Enviar
                    </button>
                  </form>
                </div>
              ) : null}
            </article>
          );
        })}

        {filteredPosts.length === 0 ? (
          <div className="empty-state-card">
            <div className="empty-icon">
              <UsersIcon size={40} />
            </div>
            <h3>Nenhuma publicação nesta categoria</h3>
            <p>Seja o primeiro a compartilhar um treino, refeição ou conquista com a comunidade!</p>
          </div>
        ) : null}
      </section>
    </div>
  );
}
