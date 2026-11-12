import React, { useState, useEffect } from 'react';
import { 
  X, 
  Send, 
  MessageSquare, 
  Sparkles, 
  Check, 
  Lightbulb, 
  Bug, 
  ThumbsUp, 
  ExternalLink,
  Heart
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface FeedbackItem {
  id: string;
  author: string;
  location?: string;
  category: 'idea' | 'texture' | 'bug' | 'praise';
  comment: string;
  sentiment: string;
  timestamp: string;
  upvotes: number;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'write' | 'list'>('write');
  const [comments, setComments] = useState<FeedbackItem[]>([]);
  
  // Form fields
  const [author, setAuthor] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState<'idea' | 'texture' | 'bug' | 'praise'>('idea');
  const [commentText, setCommentText] = useState('');
  const [sentiment, setSentiment] = useState('😍');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Load ONLY real user comments from localStorage (no mock/invented data)
  useEffect(() => {
    try {
      const stored = localStorage.getItem('speckled_graphite_feedback');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setComments(parsed);
        }
      }
    } catch {
      setComments([]);
    }
  }, []);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newFeedback: FeedbackItem = {
      id: String(Date.now()),
      author: author.trim() || (language === 'es' ? 'Diseñador Anónimo' : 'Anonymous Designer'),
      location: language === 'es' ? 'Visitante Web' : 'Web Visitor',
      category,
      comment: commentText.trim(),
      sentiment,
      timestamp: language === 'es' ? 'Hace un momento' : 'Just now',
      upvotes: 1,
    };

    const updated = [newFeedback, ...comments];
    try {
      localStorage.setItem('speckled_graphite_feedback', JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }

    setComments(updated);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setCommentText('');
      setAuthor('');
      setEmail('');
      setActiveTab('list');
    }, 1200);
  };

  const handleOpenGitHubIssue = () => {
    const textSnippet = commentText.trim().slice(0, 50) || (language === 'es' ? 'Sugerencia de la Comunidad' : 'Community Feedback');
    const title = encodeURIComponent(`[Feedback] ${category.toUpperCase()}: ${textSnippet}`);
    const body = encodeURIComponent(
      `### Feedback Category\n${category}\n\n### Sentiment\n${sentiment}\n\n### Message\n${commentText || '(No additional description)'}\n\n### Author\n${author || 'Community Member'}\n\n*Submitted via SpeckledGraphite Web App*`
    );
    window.open(
      `https://github.com/Toalvaresdev/speckled-graphite-web-generator/issues/new?title=${title}&body=${body}`,
      '_blank'
    );
  };

  const handleUpvote = (id: string) => {
    const updated = comments.map((c) => (c.id === id ? { ...c, upvotes: c.upvotes + 1 } : c));
    setComments(updated);
    try {
      localStorage.setItem('speckled_graphite_feedback', JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150 cursor-pointer"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-xl bg-studio-900 border border-studio-700/80 rounded-2xl shadow-studio overflow-hidden flex flex-col max-h-[90vh] cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-studio-800 flex items-center justify-between bg-studio-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-accent/15 text-accent border border-accent/20">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span>{t.feedbackModal.title}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-studio-800 text-studio-400 border border-studio-700/60">
                  {t.feedbackModal.globalBadge}
                </span>
              </h2>
              <p className="text-xs text-studio-400">
                {t.feedbackModal.subtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-studio-400 hover:text-white hover:bg-studio-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-b border-studio-800 flex gap-4 bg-studio-950/20 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('write')}
            className={`py-3 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'write'
                ? 'border-accent text-white'
                : 'border-transparent text-studio-400 hover:text-studio-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span>{t.feedbackModal.tabWrite}</span>
          </button>
          <button
            onClick={() => setActiveTab('list')}
            className={`py-3 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'list'
                ? 'border-accent text-white'
                : 'border-transparent text-studio-400 hover:text-studio-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>
              {t.feedbackModal.tabList} {comments.length > 0 && `(${comments.length})`}
            </span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 font-sans text-xs custom-scrollbar">
          {activeTab === 'write' ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Category selector */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase text-studio-400 font-semibold">
                  {t.feedbackModal.category}
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'idea', label: t.feedbackModal.catIdea, icon: Lightbulb },
                    { id: 'texture', label: t.feedbackModal.catTexture, icon: Sparkles },
                    { id: 'bug', label: t.feedbackModal.catBug, icon: Bug },
                    { id: 'praise', label: t.feedbackModal.catPraise, icon: ThumbsUp },
                  ].map((cat) => {
                    const Icon = cat.icon;
                    const isSelected = category === cat.id;
                    return (
                      <button
                        type="button"
                        key={cat.id}
                        onClick={() => setCategory(cat.id as any)}
                        className={`p-2 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
                          isSelected
                            ? 'bg-accent/15 border-accent text-white font-semibold'
                            : 'bg-studio-950/70 border-studio-800 text-studio-400 hover:border-studio-700'
                        }`}
                      >
                        <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-accent' : 'text-studio-400'}`} />
                        <span className="text-[10px] truncate max-w-full">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sentiment Emojis */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase text-studio-400 font-semibold">
                  {t.feedbackModal.experience}
                </label>
                <div className="flex gap-2">
                  {['😍', '🔥', '💡', '👍', '🤔'].map((emo) => {
                    const isSelected = sentiment === emo;
                    return (
                      <button
                        type="button"
                        key={emo}
                        onClick={() => setSentiment(emo)}
                        className={`px-3 py-1.5 rounded-lg border text-sm transition ${
                          isSelected
                            ? 'bg-accent/20 border-accent text-white scale-105'
                            : 'bg-studio-950/60 border-studio-800 text-studio-300 hover:border-studio-700'
                        }`}
                      >
                        {emo}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Name & Email */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-studio-400">
                    {t.feedbackModal.nameLabel}
                  </label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder={t.feedbackModal.namePlaceholder}
                    className="w-full px-3 py-2 bg-studio-950 border border-studio-800 rounded-lg text-white focus:outline-none focus:border-accent"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-studio-400">
                    {t.feedbackModal.emailLabel}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.feedbackModal.emailPlaceholder}
                    className="w-full px-3 py-2 bg-studio-950 border border-studio-800 rounded-lg text-white focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              {/* Comment text */}
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-studio-400">
                  {t.feedbackModal.messageLabel}
                </label>
                <textarea
                  rows={3}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder={t.feedbackModal.messagePlaceholder}
                  className="w-full px-3 py-2 bg-studio-950 border border-studio-800 rounded-lg text-white focus:outline-none focus:border-accent resize-none"
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  disabled={!commentText.trim() || isSubmitted}
                  className="flex-1 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-white font-semibold text-xs flex items-center justify-center gap-2 transition disabled:opacity-50 shadow-glow"
                >
                  {isSubmitted ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300" />
                      <span>{t.feedbackModal.submittedSuccess}</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>{t.feedbackModal.submitLocal}</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleOpenGitHubIssue}
                  className="px-4 py-2.5 rounded-xl bg-studio-800 hover:bg-studio-700 text-white font-semibold text-xs flex items-center justify-center gap-2 border border-studio-700 transition"
                  title={t.feedbackModal.githubDesc}
                >
                  <svg className="w-3.5 h-3.5 fill-current text-studio-300" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  <span>GitHub Issue</span>
                  <ExternalLink className="w-3 h-3 text-studio-400" />
                </button>
              </div>

              {/* Explanation Note */}
              <p className="text-[11px] text-studio-500 leading-relaxed bg-studio-950/40 p-2.5 rounded-lg border border-studio-800/60">
                💡 <span className="text-studio-400">{t.feedbackModal.persistenceNotice}</span>
              </p>
            </form>
          ) : (
            <div className="space-y-3">
              {comments.length === 0 ? (
                /* Pure Real Empty State */
                <div className="py-12 flex flex-col items-center justify-center text-center px-4">
                  <div className="w-12 h-12 rounded-2xl bg-studio-800/60 border border-studio-700 flex items-center justify-center mb-3 text-studio-400">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-1">
                    {t.feedbackModal.emptyTitle}
                  </h3>
                  <p className="text-xs text-studio-400 max-w-sm mb-4">
                    {t.feedbackModal.emptyDesc}
                  </p>
                  <button
                    onClick={() => setActiveTab('write')}
                    className="px-4 py-2 rounded-xl bg-accent hover:bg-accent-hover text-white font-medium text-xs flex items-center gap-2 transition"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{t.feedbackModal.tabWrite}</span>
                  </button>
                </div>
              ) : (
                comments.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl bg-studio-950/70 border border-studio-800/80 hover:border-studio-700 transition space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{item.sentiment}</span>
                        <span className="font-semibold text-white">{item.author}</span>
                        <span className="text-[10px] text-studio-500 font-mono">
                          • {item.timestamp}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-studio-900 border border-studio-800 text-studio-400 uppercase">
                        {item.category}
                      </span>
                    </div>

                    <p className="text-studio-300 text-xs leading-relaxed">
                      {item.comment}
                    </p>

                    <div className="pt-1 flex items-center justify-between text-[11px] text-studio-500">
                      <button
                        onClick={() => handleUpvote(item.id)}
                        className="flex items-center gap-1 hover:text-accent transition"
                      >
                        <Heart className="w-3 h-3 text-rose-500 fill-rose-500/20" />
                        <span>{item.upvotes} {t.feedbackModal.vote}</span>
                      </button>

                      <button
                        onClick={() => {
                          const title = encodeURIComponent(`[Community Feedback] ${item.comment.slice(0, 40)}...`);
                          const body = encodeURIComponent(
                            `### Author\n${item.author}\n\n### Sentiment\n${item.sentiment}\n\n### Comment\n${item.comment}`
                          );
                          window.open(
                            `https://github.com/Toalvaresdev/speckled-graphite-web-generator/issues/new?title=${title}&body=${body}`,
                            '_blank'
                          );
                        }}
                        className="flex items-center gap-1 text-studio-400 hover:text-white transition"
                      >
                        <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                        </svg>
                        <span>GitHub</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
