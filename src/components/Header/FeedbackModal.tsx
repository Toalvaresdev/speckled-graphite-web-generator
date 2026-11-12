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
  GitPullRequest,
  Star
} from 'lucide-react';

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

const INITIAL_FEEDBACK: FeedbackItem[] = [
  {
    id: '1',
    author: 'Alex M.',
    location: 'United States',
    category: 'praise',
    comment: 'The Kilowatty Dark Sparkle texture is insane. Replaced our 2.5MB header background on Next.js with this CSS snippet and shaved 300ms off LCP.',
    sentiment: '🔥',
    timestamp: '2 hours ago',
    upvotes: 14,
  },
  {
    id: '2',
    author: 'Liam K.',
    location: 'Australia',
    category: 'idea',
    comment: 'Would be awesome to have an export preset specifically for Tailwind CSS v4 or a Figma plugin bridge. Starred on GitHub!',
    sentiment: '💡',
    timestamp: '5 hours ago',
    upvotes: 9,
  },
  {
    id: '3',
    author: 'Matías R.',
    location: 'Chile',
    category: 'texture',
    comment: 'Excelente herramienta. El control de agudeza de stippling con feTurbulence quedó perfecto para fondos oscuros.',
    sentiment: '😍',
    timestamp: '1 day ago',
    upvotes: 7,
  },
  {
    id: '4',
    author: 'Eero H.',
    location: 'Finland',
    category: 'idea',
    comment: 'Native SVG noise without raster blur on high-DPI displays works like a charm. Minimal and super fast.',
    sentiment: '👍',
    timestamp: '1 day ago',
    upvotes: 6,
  },
];

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'write' | 'list'>('write');
  const [comments, setComments] = useState<FeedbackItem[]>([]);
  
  // Form fields
  const [author, setAuthor] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState<'idea' | 'texture' | 'bug' | 'praise'>('idea');
  const [commentText, setCommentText] = useState('');
  const [sentiment, setSentiment] = useState('😍');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Load comments from localStorage merged with defaults
  useEffect(() => {
    try {
      const stored = localStorage.getItem('speckled_graphite_feedback');
      if (stored) {
        const parsed = JSON.parse(stored);
        setComments([...parsed, ...INITIAL_FEEDBACK]);
      } else {
        setComments(INITIAL_FEEDBACK);
      }
    } catch {
      setComments(INITIAL_FEEDBACK);
    }
  }, []);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newFeedback: FeedbackItem = {
      id: String(Date.now()),
      author: author.trim() || 'Anonymous Designer',
      location: 'Global Visitor',
      category,
      comment: commentText.trim(),
      sentiment,
      timestamp: 'Just now',
      upvotes: 1,
    };

    const updatedUserList = [newFeedback, ...comments.filter(c => !INITIAL_FEEDBACK.some(init => init.id === c.id))];
    try {
      localStorage.setItem('speckled_graphite_feedback', JSON.stringify(updatedUserList));
    } catch (err) {
      console.error(err);
    }

    setComments([newFeedback, ...comments]);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setCommentText('');
      setAuthor('');
      setEmail('');
      setActiveTab('list');
    }, 1500);
  };

  const handleOpenGitHubIssue = () => {
    const title = encodeURIComponent(`[Feedback] ${category.toUpperCase()}: ${commentText.slice(0, 50)}...`);
    const body = encodeURIComponent(
      `### Feedback Category\n${category}\n\n### Message\n${commentText}\n\n### Author\n${author || 'Community Member'}`
    );
    window.open(
      `https://github.com/Toalvaresdev/speckled-graphite-web-generator/issues/new?title=${title}&body=${body}`,
      '_blank'
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div 
        className="w-full max-w-xl bg-studio-900 border border-studio-700/80 rounded-2xl shadow-studio overflow-hidden flex flex-col max-h-[90vh]"
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
                <span>Feedback & Comunidad</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-studio-800 text-studio-400 border border-studio-700/60">
                  Global
                </span>
              </h2>
              <p className="text-xs text-studio-400">
                Comparte sugerencias, ideas de texturas o colabora en GitHub
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
            <span>Dejar Feedback / Comentario</span>
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
            <span>Comentarios de la Comunidad ({comments.length})</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 font-sans text-xs custom-scrollbar">
          {activeTab === 'write' ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Category selector */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase text-studio-400 font-semibold">
                  Categoría
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'idea', label: 'Idea / Función', icon: Lightbulb },
                    { id: 'texture', label: 'Nueva Textura', icon: Sparkles },
                    { id: 'bug', label: 'Reportar Error', icon: Bug },
                    { id: 'praise', label: 'Testimonio', icon: ThumbsUp },
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
                        <span className="text-[10px]">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sentiment Emojis */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase text-studio-400 font-semibold">
                  ¿Cómo ha sido tu experiencia?
                </label>
                <div className="flex gap-2">
                  {['😍 Me encanta', '🔥 Brutal', '💡 Gran idea', '👍 Buena', '🤔 Mejorable'].map((emo) => {
                    const iconOnly = emo.split(' ')[0];
                    const isSelected = sentiment === iconOnly;
                    return (
                      <button
                        type="button"
                        key={emo}
                        onClick={() => setSentiment(iconOnly)}
                        className={`px-2.5 py-1.5 rounded-lg border text-xs transition ${
                          isSelected
                            ? 'bg-accent/20 border-accent text-white font-semibold'
                            : 'bg-studio-950/60 border-studio-800 text-studio-400 hover:text-white'
                        }`}
                      >
                        {emo}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Comment Textarea */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase text-studio-400 font-semibold">
                  Tu Mensaje o Sugerencia *
                </label>
                <textarea
                  required
                  rows={4}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Ej: Me gustaría poder exportar las texturas directamente como preset de Tailwind o shader WebGL..."
                  className="w-full bg-studio-950 border border-studio-800 rounded-xl p-3 text-xs text-white placeholder-studio-500 focus:border-accent outline-none resize-none leading-relaxed"
                />
              </div>

              {/* Name & Email inputs */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-studio-400">Nombre / Usuario (Opcional)</label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Ej: Carlos o @carlosdev"
                    className="w-full bg-studio-950 border border-studio-800 rounded-xl px-3 py-2 text-xs text-white focus:border-accent outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-studio-400">Email (Opcional)</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Para responderte si deseas"
                    className="w-full bg-studio-950 border border-studio-800 rounded-xl px-3 py-2 text-xs text-white focus:border-accent outline-none"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="submit"
                  disabled={isSubmitted || !commentText.trim()}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-xs bg-accent hover:bg-accent-hover text-white shadow-glow transition disabled:opacity-50"
                >
                  {isSubmitted ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300" />
                      <span>¡Gracias! Comentario publicado</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Publicar Comentario</span>
                    </>
                  )}
                </button>

                {commentText.trim() && (
                  <button
                    type="button"
                    onClick={handleOpenGitHubIssue}
                    title="Crear un Issue formal en GitHub con este mensaje"
                    className="flex items-center gap-1.5 px-3 py-3 rounded-xl border border-studio-700 bg-studio-800 hover:bg-studio-700 text-white font-medium text-xs transition"
                  >
                    <GitPullRequest className="w-3.5 h-3.5 text-accent" />
                    <span>Enviar a GitHub</span>
                  </button>
                )}
              </div>
            </form>
          ) : (
            /* Tab 2: Community comments feed */
            <div className="space-y-3">
              {comments.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-studio-950/70 border border-studio-800/80 space-y-2 hover:border-studio-700 transition"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{item.sentiment}</span>
                      <span className="font-semibold text-white text-xs">{item.author}</span>
                      {item.location && (
                        <span className="text-[10px] font-mono text-studio-500">
                          • {item.location}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-mono text-studio-500">{item.timestamp}</span>
                  </div>

                  <p className="text-studio-300 text-xs leading-relaxed pl-1">
                    {item.comment}
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-studio-900 text-[10px] text-studio-500">
                    <span className="uppercase font-mono tracking-wider px-1.5 py-0.2 rounded bg-studio-900 border border-studio-800">
                      {item.category}
                    </span>
                    <button
                      onClick={() => {
                        setComments(
                          comments.map((c) =>
                            c.id === item.id ? { ...c, upvotes: c.upvotes + 1 } : c
                          )
                        );
                      }}
                      className="flex items-center gap-1 text-studio-400 hover:text-accent transition"
                    >
                      <ThumbsUp className="w-3 h-3" />
                      <span>{item.upvotes}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer: GitHub Contribution Banner */}
        <div className="p-4 border-t border-studio-800 bg-studio-950/80 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-studio-400">
            <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span>Proyecto de Código Abierto en GitHub</span>
          </div>
          <a
            href="https://github.com/Toalvaresdev/speckled-graphite-web-generator"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-studio-800 hover:bg-studio-700 text-white border border-studio-700 hover:border-studio-600 transition"
          >
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>Contribuir o Dar Star</span>
            <ExternalLink className="w-3 h-3 text-studio-400 ml-0.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
