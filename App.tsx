import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  SendHorizontal,
  MessageSquare,
  Sparkles,
  Zap,
  Hash,
  FileText,
  ImageIcon,
  Mic,
  Paperclip,
  Camera,
  ShoppingBag,
  X,
  Square,
  PanelLeftClose,
  PanelLeftOpen,
  Package,
  Grid3X3,
  Bookmark,
  Book,
  GitCommit,
  ChevronsRight,
  EyeOff,
  Eye,
  MessageCircle,
  Menu,
  RotateCcw,
  ArrowUp,
  Play,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Volume2,
  MoreHorizontal,
} from 'lucide-react';

// ── Hooks ──────────────────────────────────────────────────────────────────────
const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
};

// ── Types ──────────────────────────────────────────────────────────────────────
interface Message {
  id: number;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
  images?: string[];
  isAudioTranscription?: boolean;
  feedback?: 'like' | 'dislike' | null;
}

interface Attachment {
  id: number;
  type: string;
  name: string;
}

interface ChatSession {
  id: number;
  title: string;
  messages: Message[];
}

// ── Data ───────────────────────────────────────────────────────────────────────
const APPS_NAV = [
  { icon: Package, label: 'Automações' },
  { icon: Hash, label: 'Prompts Salvos' },
  { icon: Book, label: 'Documentos' },
  { icon: Grid3X3, label: 'Galeria' },
];

const ARTICLES = [
  { id: 1, label: 'Noticia 01' },
  { id: 2, label: 'Noticia 02' },
  { id: 3, label: 'Noticia 03' },
  { id: 4, label: 'Noticia 04' },
];

const NAV_PILLS = ['Sobre mim', 'Habilidade', 'Projetos', 'Cursos'];

const SUGGESTIONS = [
  'Quais sao suas especialidades?',
  'Me mostrar os seus projetos mais recentes?',
];

const AI_RESPONSES = [
  'Analisei sua solicitação. Aqui está minha sugestão detalhada com base nas melhores práticas.',
  'Excelente pergunta. Considerando os requisitos que você mencionou, recomendo a seguinte abordagem.',
  'Com base na análise, posso identificar três pontos principais que merecem atenção.',
  'Entendido. Preparei uma resposta que considera tanto a performance quanto a manutenibilidade.',
];

const PLUS_MENU_ITEMS = [
  { icon: Paperclip, label: 'Adicionar arquivo', type: 'file', disabled: false },
  { icon: ImageIcon, label: 'Subir imagem', type: 'image', disabled: false },
  { icon: Camera, label: 'Abrir câmera', type: 'camera', disabled: false },
  { icon: ShoppingBag, label: 'Fazer compra aqui', type: 'purchase', disabled: true, tag: 'Novo' },
];

// ── Gradient text style helper ─────────────────────────────────────────────────
const gradientTextStyle: React.CSSProperties = {
  backgroundImage: 'linear-gradient(92.13deg, rgb(93, 97, 105) 0.15%, rgb(92, 102, 118) 37.87%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};

const lightGradientTextStyle: React.CSSProperties = {
  backgroundImage: 'linear-gradient(95deg, rgb(255, 255, 255) 0.15%, rgba(255, 255, 255, 0.9) 37.87%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};

// ── Glassmorphism classes ──────────────────────────────────────────────────────
const glassCard = `backdrop-blur-[22px] bg-[rgba(183,191,209,0.49)] border border-[rgba(255,255,255,0.45)] border-dashed rounded-[20px]`;
const glassButton = `backdrop-blur-[22px] bg-[rgba(255,255,255,0.17)] border-[0.5px] border-solid border-white rounded-[16px]`;
const glassButtonHover = `${glassButton} hover:bg-[rgba(255,255,255,0.3)] transition-all duration-200`;
const flatButton = `backdrop-blur-[15px] bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.2)] rounded-[16px] transition-all duration-200 hover:bg-[rgba(255,255,255,0.2)]`;
const chatInputGlass = `backdrop-blur-[15px] bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.2)] rounded-[20px] shadow-[0_8px_32px_0_rgba(0,0,0,0.18)]`;

// ── Sidebar ────────────────────────────────────────────────────────────────────
const Sidebar: React.FC<{
  isCollapsed: boolean;
  onToggle: () => void;
  onSendMessage?: (text: string) => void;
  sessions: ChatSession[];
  activeSessionId: number | null;
  onSwitchSession: (id: number) => void;
  onNewChat: () => void;
  onReset: () => void;
}> = ({ isCollapsed, onToggle, onSendMessage, sessions, activeSessionId, onSwitchSession, onNewChat, onReset }) => {
  const [logoHover, setLogoHover] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  if (isCollapsed) {
    return (
      <aside className="w-16 flex flex-col h-screen shrink-0 select-none transition-all duration-300 z-50 absolute top-0 left-0 bg-transparent">
        <div className="flex items-center justify-center pt-5 pb-4">
          <button
            onClick={onToggle}
            className="w-12 h-12 flex items-center justify-center rounded-xl
                       text-[rgb(84,95,119)]/40 hover:text-[rgb(84,95,119)] hover:bg-[rgba(255,255,255,0.08)] transition-all duration-200"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center gap-2 px-2 pt-2">
          {APPS_NAV.map(({ icon: Icon, label }) => (
            <div key={label} className="relative group">
              <button
                title={label}
                onClick={onToggle}
                className="w-12 h-12 flex items-center justify-center rounded-xl
                           text-[rgb(84,95,119)]/40 hover:text-[rgb(84,95,119)] hover:bg-[rgba(255,255,255,0.08)] transition-all duration-200"
              >
                <Icon className="w-5 h-5" />
              </button>
              <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-1.5 
                              bg-[rgba(93,97,105,0.85)] backdrop-blur-md text-white text-sm font-medium 
                              rounded-lg whitespace-nowrap pointer-events-none
                              opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50">
                {label}
              </div>
            </div>
          ))}

          <div className="pt-2">
            <button
              onClick={onReset}
              title="Reiniciar conversa"
              className="w-12 h-12 flex items-center justify-center rounded-xl
                       text-[rgb(84,95,119)]/40 hover:text-[rgb(84,95,119)] hover:bg-[rgba(255,255,255,0.08)] transition-all duration-200"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>


      </aside>
    );
  }

  return (
    <aside
      className={`w-[305px] ${glassButton} flex flex-col h-[calc(100vh-118px)] shrink-0 select-none 
                   transition-all duration-300 z-50 m-[24px] ml-[24px] mr-0 p-[1.4rem] rounded-[32px] absolute top-0 left-0 shadow-2xl shadow-black/20`}
      style={{ opacity: 1 }}
    >
      {/* Header: Search + Chat + Close */}
      <div className="flex gap-2 items-start w-full mb-0">
        <div
          className={`bg-[rgba(255,255,255,0.15)] flex gap-2 h-[61px] items-center 
                      px-4 py-1.5 rounded-[20px] transition-all duration-300 cursor-text hover:bg-[rgba(255,255,255,0.3)]
                      ${searchExpanded ? 'flex-[1_1_100%]' : 'flex-1'}`}
          onClick={() => {
            setSearchExpanded(true);
            setTimeout(() => searchInputRef.current?.focus(), 50);
          }}
        >
          <Search className="w-5 h-5 text-[#545f77] shrink-0" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Buscar..."
            className="bg-transparent border-none outline-none w-full font-medium text-[#545f77] text-base tracking-tight placeholder:text-[#545f77]/60"
          />
          {searchExpanded && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSearchExpanded(false);
                if (searchInputRef.current) searchInputRef.current.value = '';
              }}
              className="shrink-0 w-6 h-6 flex items-center justify-center rounded-full 
                         hover:bg-[rgba(255,255,255,0.2)] transition-all duration-200"
            >
              <X className="w-4 h-4 text-[#545f77]" />
            </button>
          )}
        </div>
        {!searchExpanded && (
          <>
            <button
              onClick={onNewChat}
              className="bg-[rgba(255,255,255,0.15)] flex flex-col items-center justify-center 
                          p-1.5 rounded-[20px] w-[61px] h-[61px] shrink-0 hover:bg-[rgba(255,255,255,0.3)] transition-all duration-200"
            >
              <MessageCircle className="w-5 h-5 text-[#545f77]" />
            </button>
            <button
              onClick={onToggle}
              className={`bg-[rgba(255,255,255,0.15)] flex flex-col items-center justify-center 
                           p-1.5 rounded-[20px] w-[61px] h-[61px] shrink-0 hover:bg-[rgba(255,255,255,0.3)] transition-all duration-200`}
            >
              <PanelLeftClose className="w-5 h-5 text-[#545f77]" />
            </button>
          </>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto pt-[60px] space-y-10">
        {/* App section */}
        <div className="space-y-6">
          <p
            className="font-bold text-lg tracking-tight"
            style={gradientTextStyle}
          >
            App
          </p>
          <div className="space-y-4">
            {APPS_NAV.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex gap-2.5 items-center w-full cursor-pointer group
                           rounded-xl px-2 py-1.5 -mx-2
                           hover:bg-[rgba(255,255,255,0.08)] transition-all duration-200"
              >
                <Icon className="w-5 h-5 text-[rgb(84,95,119)] shrink-0 group-hover:fill-current transition-all duration-200" />
                <p
                  className="font-medium text-[18.6px] tracking-tight leading-normal"
                  style={gradientTextStyle}
                >
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Artigos section */}
        <div className="space-y-6">
          <p
            className="font-bold text-lg tracking-tight"
            style={gradientTextStyle}
          >
            Artigos
          </p>
          <div className="space-y-4">
            {ARTICLES.map((article) => (
              <div
                key={article.id}
                className="flex gap-2.5 items-center w-full cursor-pointer group
                           rounded-xl px-2 py-1.5 -mx-2
                           hover:bg-[rgba(255,255,255,0.08)] transition-all duration-200"
              >
                <Bookmark className="w-5 h-5 text-[rgb(84,95,119)] shrink-0 group-hover:fill-current transition-all duration-200" />
                <p
                  className="font-medium text-[18.6px] tracking-tight leading-normal"
                  style={gradientTextStyle}
                >
                  {article.label}
                </p>
              </div>
            ))}
          </div>
        </div>
        {/* Conversas section */}
        <div className="space-y-6">
          <p
            className="font-bold text-lg tracking-tight"
            style={gradientTextStyle}
          >
            Conversas
          </p>
          <div className="space-y-4">
            {sessions.map((session) => (
              <div
                key={session.id}
                onClick={() => onSwitchSession(session.id)}
                className={`flex gap-2.5 items-center w-full cursor-pointer group
                           rounded-xl px-2 py-1.5 -mx-2 transition-all duration-200
                           ${activeSessionId === session.id ? 'bg-[rgba(255,255,255,0.15)]' : 'hover:bg-[rgba(255,255,255,0.08)]'}`}
              >
                <MessageCircle className={`w-5 h-5 shrink-0 transition-all duration-200 ${activeSessionId === session.id ? 'text-[rgb(84,95,119)] fill-current' : 'text-[rgb(84,95,119)] group-hover:fill-current'}`} />
                <p
                  className="font-medium text-[18.6px] tracking-tight leading-normal truncate"
                  style={gradientTextStyle}
                >
                  {session.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer branding */}
      <div className="h-6 w-[157px] shrink-0 flex items-center">
        <span className="text-xs font-medium tracking-tight" style={gradientTextStyle}>
          Nando's AI · Portfólio
        </span>
      </div>
    </aside >
  );
};

// ── Plus Menu Popover ──────────────────────────────────────────────────────────
const popoverMotion = {
  initial: { opacity: 0, y: 8, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 8, scale: 0.95 },
  transition: { duration: 0.15, ease: 'easeOut' as const },
};

const PlusMenuPopover: React.FC<{
  show: boolean;
  onSelect: (type: string) => void;
}> = ({ show, onSelect }) => (
  <AnimatePresence>
    {show && (
      <motion.div
        {...popoverMotion}
        className={`absolute bottom-full left-0 mb-3 
                     backdrop-blur-[22px] bg-[rgba(255,255,255,0.85)] border border-[rgba(255,255,255,0.6)]
                     rounded-2xl shadow-2xl shadow-black/10
                     p-1.5 min-w-[220px] z-[60]`}
      >
        <p className="px-3 pt-1.5 pb-1.5 text-[11px] font-semibold uppercase tracking-widest" style={gradientTextStyle}>
          Adicionar
        </p>
        {PLUS_MENU_ITEMS.map(({ icon: Icon, label, type, disabled, tag }) => (
          <button
            key={type}
            onClick={() => !disabled && onSelect(type)}
            className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all duration-150
              ${disabled
                ? 'opacity-40 cursor-not-allowed'
                : 'hover:bg-[rgba(163,171,190,0.3)] cursor-pointer'
              }`}
          >
            <div className="flex items-center gap-2.5">
              <Icon className="w-4 h-4 shrink-0 text-[rgb(84,95,119)]" />
              <span className="flex-1" style={gradientTextStyle}>{label}</span>
              {tag && (
                <span className="text-[10px] font-semibold bg-[rgba(93,97,105,0.8)] text-white px-2 py-0.5 rounded-md">
                  {tag}
                </span>
              )}
            </div>
          </button>
        ))}
      </motion.div>
    )}
  </AnimatePresence>
);

// ── Attachment Thumbnail ───────────────────────────────────────────────────────
const AttachmentThumbnail: React.FC<{
  attachment: Attachment;
  onRemove: (id: number) => void;
}> = ({ attachment, onRemove }) => {
  const iconMap: Record<string, React.FC<{ className?: string }>> = {
    file: Paperclip,
    image: ImageIcon,
    camera: Camera,
  };
  const Icon = iconMap[attachment.type] || FileText;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="relative group"
    >
      <div
        className={`w-16 h-16 ${glassButton} flex flex-col items-center justify-center gap-1`}
      >
        <Icon className="w-5 h-5 text-[rgb(84,95,119)]" />
        <span className="text-[9px] font-medium truncate max-w-[52px]" style={gradientTextStyle}>
          {attachment.name}
        </span>
      </div>
      <button
        onClick={() => onRemove(attachment.id)}
        className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[rgb(93,97,105)] text-white rounded-full 
                   flex items-center justify-center opacity-0 group-hover:opacity-100 
                   transition-opacity duration-150 shadow-md"
      >
        <X className="w-3 h-3" />
      </button>
    </motion.div>
  );
};

// ── Audio Wave Visualizer ──────────────────────────────────────────────────────
const AudioWave: React.FC = () => {
  const bars = 24;
  return (
    <div className="flex items-center justify-center gap-[3px] h-8">
      {Array.from({ length: bars }).map((_, i) => (
        <div
          key={i}
          className="w-[3px] bg-white/60 rounded-full"
          style={{
            animation: `waveBar 0.8s ease-in-out ${i * 0.05}s infinite`,
            height: '6px',
          }}
        />
      ))}
    </div>
  );
};

// ── Message Actions ────────────────────────────────────────────────────────────
const MessageActions: React.FC<{
  messageId: number;
  feedback: 'like' | 'dislike' | null;
  onFeedback: (messageId: number, type: 'like' | 'dislike') => void;
}> = ({ messageId, feedback, onFeedback }) => {
  const [showFeedbackMessage, setShowFeedbackMessage] = useState(false);

  const handleCopy = async () => {
    console.log('Copy clicked');
  };

  const handleLike = () => {
    onFeedback(messageId, 'like');
    setShowFeedbackMessage(true);
  };

  const handleDislike = () => {
    onFeedback(messageId, 'dislike');
    setShowFeedbackMessage(true);
  };

  const handleReadAloud = () => {
    console.log('Read aloud clicked');
  };

  const handleMore = () => {
    console.log('More options clicked');
  };

  useEffect(() => {
    if (showFeedbackMessage) {
      const timer = setTimeout(() => {
        setShowFeedbackMessage(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showFeedbackMessage]);

  return (
    <div className="flex items-center gap-2 mt-3">
      <button
        onClick={handleCopy}
        aria-label="Copiar resposta"
        className="p-2 rounded-lg text-[rgb(84,95,119)]/40 hover:text-[rgb(84,95,119)] hover:bg-[rgba(255,255,255,0.08)] transition-all duration-200"
      >
        <Copy className="w-4 h-4" />
      </button>

      <button
        onClick={handleLike}
        disabled={feedback === 'dislike'}
        aria-label="Gostei"
        className={`p-2 rounded-lg transition-all duration-200 ${feedback === 'like'
          ? 'text-[rgb(84,95,119)] bg-[rgba(255,255,255,0.08)]'
          : 'text-[rgb(84,95,119)]/40 hover:text-[rgb(84,95,119)] hover:bg-[rgba(255,255,255,0.08)]'
          } ${feedback === 'dislike' ? 'opacity-30 cursor-not-allowed' : ''}`}
      >
        <ThumbsUp className="w-4 h-4" fill={feedback === 'like' ? 'currentColor' : 'none'} />
      </button>

      <button
        onClick={handleDislike}
        disabled={feedback === 'like'}
        aria-label="Não gostei"
        className={`p-2 rounded-lg transition-all duration-200 ${feedback === 'dislike'
          ? 'text-[rgb(84,95,119)] bg-[rgba(255,255,255,0.08)]'
          : 'text-[rgb(84,95,119)]/40 hover:text-[rgb(84,95,119)] hover:bg-[rgba(255,255,255,0.08)]'
          } ${feedback === 'like' ? 'opacity-30 cursor-not-allowed' : ''}`}
      >
        <ThumbsDown className="w-4 h-4" fill={feedback === 'dislike' ? 'currentColor' : 'none'} />
      </button>

      <button
        onClick={handleReadAloud}
        aria-label="Ler em voz alta"
        className="p-2 rounded-lg text-[rgb(84,95,119)]/40 hover:text-[rgb(84,95,119)] hover:bg-[rgba(255,255,255,0.08)] transition-all duration-200"
      >
        <Volume2 className="w-4 h-4" />
      </button>

      {showFeedbackMessage && feedback && (
        <motion.span
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
          className="text-xs text-[rgb(84,95,119)]/70 ml-1"
        >
          Obrigado pelo feedback!
        </motion.span>
      )}

      <button
        onClick={handleMore}
        aria-label="Mais opções"
        className="p-2 rounded-lg text-[rgb(84,95,119)]/40 hover:text-[rgb(84,95,119)] hover:bg-[rgba(255,255,255,0.08)] transition-all duration-200"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>
    </div>
  );
};

// ── Chat Message ───────────────────────────────────────────────────────────────
const ChatMessage: React.FC<{
  message: Message;
  onFeedback?: (messageId: number, type: 'like' | 'dislike') => void;
}> = ({ message, onFeedback }) => {
  const isUser = message.role === 'user';
  // Desktop: 4 cols, Tablet: 2 cols, Mobile: 1 col
  // Mobile check is needed for padding adjustments too.
  // We can use CSS grid flow for responsiveness without JS if we use media queries or tailwind classes.

  return (
    <div
      className={`animate-fade-in-up w-full flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`relative flex flex-col ${isUser ? 'items-end max-w-[80%] phone:max-w-full' : 'w-full max-w-[70%]'}`}
      >
        <div
          className={`flex flex-col relative
            ${isUser
              ? 'bg-[rgba(255,255,255,0.05)] text-[rgb(84,95,119)] px-5 py-[15px] rounded-[20px] border border-white/10'
              : 'backdrop-blur-[45px] bg-[rgba(255,255,255,0.02)] text-[rgb(84,95,119)] px-[20px] md:px-[35px] py-[30px] rounded-[16px] w-full'
            }`}
          style={{
            fontSize: '18px',
            lineHeight: '1.7'
          }}
        >
          {/* Audio Transcription Indicator */}
          {message.isAudioTranscription && (
            <div className="flex items-center gap-2 mb-2">
              <Play className="w-4 h-4" fill="currentColor" />
              <span className="text-xs opacity-60">Transcrição de áudio</span>
            </div>
          )}

          {/* Message Content */}
          <span className={`${!isUser ? 'text-[18px] font-normal' : ''}`}>
            {message.content}
          </span>

          {/* Image Grid for AI */}
          {!isUser && message.images && message.images.length > 0 && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
              {message.images.map((imgSrc, idx) => (
                <div
                  key={idx}
                  className="rounded-[16px] overflow-hidden bg-[rgba(0,0,0,0.05)] h-[200px] relative"
                >
                  <img
                    src={imgSrc}
                    alt={`attachment-${idx}`}
                    className="w-full h-full object-cover"
                    style={{ display: 'block' }}
                  />
                </div>
              ))}
            </div>
          )}

          <span className={`text-[11px] opacity-70 mt-2 ${isUser ? 'self-end' : 'self-start'}`}
            style={{ color: isUser ? '#000000' : 'rgb(84,95,119)' }}>
            {message.timestamp.toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>

        {/* Action Bar for AI messages */}
        {!isUser && onFeedback && (
          <MessageActions
            messageId={message.id}
            feedback={message.feedback || null}
            onFeedback={onFeedback}
          />
        )}
      </div>
    </div>
  );
};

// ── Command Center ─────────────────────────────────────────────────────────────
const CommandCenter: React.FC<{
  inputValue: string;
  setInputValue: (v: string) => void;
  onSend: () => void;
  isCentered: boolean;
  onSendMessage?: (text: string, isAudioTranscription?: boolean) => void;
  inputRef?: React.RefObject<HTMLTextAreaElement>;
}> = ({ inputValue, setInputValue, onSend, isCentered, onSendMessage, inputRef }) => {
  const [showPlusMenu, setShowPlusMenu] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [recordingError, setRecordingError] = useState<string | null>(null);
  const fallbackRef = useRef<HTMLTextAreaElement>(null);
  const textareaRef = inputRef || fallbackRef;
  const containerRef = useRef<HTMLDivElement>(null);
  const recordingInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowPlusMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [inputValue]);

  useEffect(() => {
    if (isRecording) {
      setRecordingTime(0);
      recordingInterval.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (recordingInterval.current) {
        clearInterval(recordingInterval.current);
        recordingInterval.current = null;
      }
      setRecordingTime(0);
    }
    return () => {
      if (recordingInterval.current) clearInterval(recordingInterval.current);
    };
  }, [isRecording]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handlePlusMenuSelect = (type: string) => {
    const nameMap: Record<string, string> = {
      file: 'documento.pdf',
      image: 'imagem.png',
      camera: 'foto.jpg',
    };
    const newAttachment: Attachment = {
      id: Date.now(),
      type,
      name: nameMap[type] || 'arquivo',
    };
    setAttachments((prev) => [...prev, newAttachment]);
    setShowPlusMenu(false);
  };

  const removeAttachment = useCallback((id: number) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
      }
      if (recordingInterval.current) {
        clearInterval(recordingInterval.current);
      }
    };
  }, [mediaRecorder]);

  const startRecording = async () => {
    try {
      // Check browser support
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setRecordingError('Seu navegador não suporta gravação de áudio.');
        return;
      }

      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Create MediaRecorder
      const recorder = new MediaRecorder(stream);
      audioChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      setRecordingError(null);
      setRecordingTime(0);

      // Start timer
      if (recordingInterval.current) {
        clearInterval(recordingInterval.current);
      }
      recordingInterval.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

    } catch (error) {
      console.error('Error starting recording:', error);
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          setRecordingError('Permissão de microfone negada.');
        } else if (error.name === 'NotFoundError') {
          setRecordingError('Nenhum microfone encontrado.');
        } else {
          setRecordingError('Erro ao iniciar gravação.');
        }
      }
    }
  };

  const stopRecording = (): Promise<void> => {
    return new Promise((resolve) => {
      if (!mediaRecorder || mediaRecorder.state === 'inactive') {
        resolve();
        return;
      }

      mediaRecorder.onstop = () => {
        // Stop timer
        if (recordingInterval.current) {
          clearInterval(recordingInterval.current);
          recordingInterval.current = null;
        }

        setIsRecording(false);
        setMediaRecorder(null);
        resolve();
      };

      mediaRecorder.stop();
    });
  };

  const handleSendDuringRecording = async () => {
    if (!isRecording) return;

    const duration = recordingTime;
    await stopRecording();

    // Send audio transcription
    const transcriptionText = `Esta é uma simulação de transcrição de áudio. O áudio foi gravado por ${formatTime(duration)}.`;
    onSendMessage?.(transcriptionText, true);

    setRecordingTime(0);
    audioChunksRef.current = [];
  };

  const toggleRecording = async () => {
    if (isRecording) {
      // Stop recording and send
      const duration = recordingTime;
      await stopRecording();

      // Send simulated audio transcription
      const transcriptionText = `Esta é uma simulação de transcrição de áudio. O áudio foi gravado por ${formatTime(duration)}.`;
      onSendMessage?.(transcriptionText, true);

      setRecordingTime(0);
      audioChunksRef.current = [];
    } else {
      // Start recording
      await startRecording();
    }
  };

  return (
    <div className="w-full" ref={containerRef}>
      {/* Greeting text when centered */}
      {isCentered && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="overflow-hidden">
            <p
              className="font-medium text-[40px] leading-normal tracking-tight"
              style={gradientTextStyle}
            >
              Ola, pode me chamar de
            </p>
            <div className="flex items-center gap-3">
              <p
                className="font-medium italic text-[40px] leading-normal tracking-tight"
                style={gradientTextStyle}
              >
                Nando
              </p>
              <div
                className={`${glassButton} bg-[rgba(255,255,255,0.17)] h-[39px] flex items-center justify-center px-3 py-1.5`}
              >
                <span className="font-medium text-[18.6px] text-white tracking-tight">
                  {` 🏄  💬  🎨`}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Input Container */}
      <div className="relative">
        {/* Main Input Box — glassmorphism */}
        <div
          className={`${chatInputGlass} transition-shadow duration-300 
                      ${isCentered ? 'hover:shadow-xl hover:shadow-black/5' : ''}`}
        >
          {/* Attachment Thumbnails */}
          <AnimatePresence>
            {attachments.length > 0 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="flex items-center gap-2 px-5 pt-4 pb-1 flex-wrap">
                  {attachments.map((att) => (
                    <AttachmentThumbnail key={att.id} attachment={att} onRemove={removeAttachment} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Textarea */}
          <div className="px-4 pt-6 pb-[50px]">
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={(e) => e.target.placeholder = ''}
              onBlur={(e) => e.target.placeholder = 'Mande uma mensagem para mim'}
              placeholder="Mande uma mensagem para mim"
              rows={1}
              className="w-full bg-transparent resize-none outline-none text-[24px]
                         placeholder:opacity-100 leading-relaxed max-h-[150px]
                         font-normal text-[rgb(84,95,119)]"
              style={{
                caretColor: 'rgb(84,95,119)',
              }}
            />
          </div>

          {/* Recording Error Message */}
          {recordingError && (
            <div className="px-4 pb-2">
              <div className="text-xs text-red-400 bg-red-500/10 px-3 py-2 rounded-lg border border-red-500/20">
                {recordingError}
              </div>
            </div>
          )}

          {/* Action Bar */}
          <div className="flex items-end justify-between px-1.5 pb-1.5 pt-1.5">
            {/* Left: Plus + Ferramentas */}
            <div className="flex items-center gap-1.5">
              {/* Plus button */}
              <div className="relative">
                <PlusMenuPopover
                  show={showPlusMenu}
                  onSelect={handlePlusMenuSelect}
                />
                <button
                  onClick={() => setShowPlusMenu(!showPlusMenu)}
                  className={`${flatButton} w-[54px] h-[54px] flex items-center justify-center`}
                >
                  <Plus className="w-6 h-6 text-[rgb(84,95,119)]" />
                </button>
              </div>

              {/* Ferramentas button */}
              <button
                className={`${flatButton} flex items-center gap-2.5 h-[54px] px-5 py-4`}
              >
                <GitCommit className="w-5 h-5 text-[rgb(84,95,119)]" />
                <span
                  className="font-medium text-[18.6px] tracking-tight"
                  style={gradientTextStyle}
                >
                  Ferramentas
                </span>
              </button>
            </div>

            {/* Right: Recording indicators + Send */}
            <div className="flex items-center gap-2">
              {/* Recording indicators */}
              <AnimatePresence>
                {isRecording && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-3 overflow-hidden"
                  >
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
                      <span className="text-sm font-mono font-medium text-white/50 tabular-nums">
                        {formatTime(recordingTime)}
                      </span>
                    </div>
                    <div className="shrink-0">
                      <AudioWave />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Mic / Stop button */}
              <button
                onClick={toggleRecording}
                className="relative shrink-0"
              >
                {isRecording && (
                  <span className="absolute inset-0 rounded-[16px] border-2 border-red-400 animate-pulse-ring" />
                )}
                <div
                  className={`${flatButton} w-[54px] h-[54px] flex items-center justify-center
                    ${isRecording
                      ? 'bg-red-500 text-white'
                      : 'text-[rgb(84,95,119)]'
                    }`}
                >
                  {isRecording ? (
                    <Square className="w-4 h-4 fill-current" />
                  ) : (
                    <Mic className="w-[18px] h-[18px]" />
                  )}
                </div>
              </button>

              {/* Send button */}
              <button
                onClick={isRecording ? handleSendDuringRecording : onSend}
                disabled={!inputValue.trim() && !isRecording}
                className={`w-[54px] h-[54px] flex items-center justify-center rounded-[16px]
                            shrink-0 transition-all duration-200
                  ${(inputValue.trim() || isRecording)
                    ? 'bg-[rgba(30,30,30,0.6)] text-white hover:bg-[rgba(42,42,42,0.7)]'
                    : 'bg-[rgba(255,255,255,0.1)] text-[rgb(84,95,119)]/25 border border-[rgba(255,255,255,0.2)]'
                  }`}
              >
                <ArrowUp className="w-[18px] h-[18px]" />
              </button>
            </div>
          </div>
        </div>
      </div >

      {/* Suggestions */}
      {
        isCentered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="mt-16 space-y-5"
          >
            <p
              className="font-medium text-[20px]"
              style={gradientTextStyle}
            >
              Algumas ideias para gente conversar:
            </p>
            <div className="flex flex-col gap-2">
              {SUGGESTIONS.map((suggestion, i) => (
                <button
                  key={i}
                  onClick={() => onSendMessage?.(suggestion)}
                  className={`${glassCard} p-1.5 text-left transition-all duration-200 
                             hover:bg-[rgba(183,191,209,0.65)] cursor-pointer w-fit`}
                >
                  <div className="p-4">
                    <span
                      className="font-normal text-[18.6px] leading-normal"
                      style={gradientTextStyle}
                    >
                      {suggestion}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )
      }
    </div >
  );
};



// ── Navigation Pills ───────────────────────────────────────────────────────────
// ── Navigation Pills ───────────────────────────────────────────────────────────
const NavigationPills: React.FC<{
  onSendMessage?: (text: string) => void;
  isCompact?: boolean;
  visualizeImages: boolean;
  onToggleVisualize: () => void;
}> = ({ onSendMessage, isCompact, visualizeImages, onToggleVisualize }) => {
  const [showMenu, setShowMenu] = useState(false);

  if (isCompact) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className={`${glassCard} p-1.5 cursor-pointer`}
        >
          <div className="px-4 py-4 flex items-center justify-center">
            <Menu className="w-6 h-6 text-[rgb(84,95,119)]" />
          </div>
        </button>
        <AnimatePresence>
          {showMenu && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full right-0 mt-2 min-w-[180px]
                         backdrop-blur-[15px] bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.1)]
                         rounded-[24px] shadow-xl shadow-black/10 overflow-hidden z-[60]"
            >
              <div className="p-1.5 flex flex-col gap-1">
                {NAV_PILLS.map((pill) => (
                  <button
                    key={pill}
                    onClick={() => {
                      onSendMessage?.(pill);
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-4 py-3 rounded-xl text-[16px] font-medium transition-all duration-150
                               hover:bg-[rgba(163,171,190,0.3)] text-[rgb(84,95,119)]"
                  >
                    {pill}
                  </button>
                ))}

                {/* Visualizer Toggle for Compact Mode */}
                <div className="h-px bg-white/10 my-1 mx-2" />
                <button
                  onClick={() => setShowMenu(false)}
                  className="w-full text-left px-4 py-3 rounded-xl text-[16px] font-medium transition-all duration-150
                             hover:bg-[rgba(163,171,190,0.3)] text-[rgb(84,95,119)] flex items-center gap-2"
                >
                  <EyeOff className="w-5 h-5" />
                  <span>{visualizeImages ? 'Ocultar imagens' : 'Visualizar imagens'}</span>
                </button>
                {/* Fallback for pill selection in menu */}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex items-center gap-3 absolute right-0 top-0"
    >
      {NAV_PILLS.map((pill) => (
        <button
          key={pill}
          onClick={() => onSendMessage?.(pill)}
          className={`${glassCard} p-1.5 transition-all duration-200 
                       hover:bg-[rgba(183,191,209,0.65)] cursor-pointer`}
        >
          <div className="px-4 py-4">
            <span
              className="font-normal text-[18.6px] leading-normal whitespace-nowrap"
              style={gradientTextStyle}
            >
              {pill}
            </span>
          </div>
        </button>
      ))}
    </motion.div>
  );
};


// ── Main App ───────────────────────────────────────────────────────────────────
const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isCompactMode = useMediaQuery('(max-width: 1550px)');
  const isMobile = useMediaQuery('(max-width: 800px)');
  const [chatMode, setChatMode] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [visualizeImages, setVisualizeImages] = useState(true);

  // Chat Sessions State
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<number | null>(null);
  const activeSessionIdRef = useRef<number | null>(null);

  useEffect(() => {
    activeSessionIdRef.current = activeSessionId;
  }, [activeSessionId]);

  // Derived state: messages to display
  // If activeSessionId is set, show that session's messages.
  // If not, show "current draft" messages (which we store in `messages` state until session created).
  // Actually, let's keep `messages` state as the "viewed" messages.
  // When switching sessions, we update `messages`.
  // ONE CAVEAT: React state updates are async. Keeping `messages` in sync with `sessions` is tricky.
  // BETTER APPROACH: `messages` is just for the VIEW.
  // But we need to update the session in `sessions` array when `messages` change.
  // Let's use `useEffect` to sync `messages` back to `sessions` if `activeSessionId` is set?
  // No, that causes loops.
  // Standard approach: centralized state.
  // Let's use `sessions` as the source of truth for saved chats.
  // And `messages` for the current view (whether saved or new).
  // Wait, if I type a message and send, it should update `messages`.
  // If `activeSessionId` is set, it should ALSO update that session in `sessions`.

  // Let's modify `sendDirectMessage` to handle the logic.

  const scrollToLatest = () => {
    // Use getBoundingClientRect for reliable positioning in nested flex layouts
    setTimeout(() => {
      if (messagesEndRef.current && scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const target = messagesEndRef.current;

        // Get actual visual positions relative to the viewport
        const containerRect = container.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();

        // Calculate scroll offset:
        // (targetRect.top - containerRect.top) = visual distance from container top to target
        // + container.scrollTop = convert to absolute scroll position
        // - 10 = small buffer so message isn't flush against the very top
        const scrollOffset = targetRect.top - containerRect.top + container.scrollTop - 10;

        container.scrollTo({
          top: scrollOffset,
          behavior: 'smooth'
        });
      }
    }, 200);
  };

  useEffect(() => {
    if (messages.length > 0) {
      scrollToLatest();
    }
  }, [messages]);

  const handleSend = () => {
    const text = inputValue.trim();
    if (!text) return;
    setChatMode(true);
    sendDirectMessage(text);
    setInputValue('');
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  const handleNewChat = () => {
    setActiveSessionId(null);
    setMessages([]);
    setInputValue('');
    setChatMode(true);
    // Close sidebar when creating new chat
    if (!sidebarCollapsed) {
      setSidebarCollapsed(true);
    }
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  const handleReset = () => {
    setSessions([]);
    setActiveSessionId(null);
    setMessages([]);
    setInputValue('');
    setChatMode(false);
  };

  const sendDirectMessage = (text: string, isAudioTranscription: boolean = false) => {
    setChatMode(true);
    const userMsg: Message = {
      id: Date.now(),
      role: 'user',
      content: text,
      timestamp: new Date(),
      isAudioTranscription,
    };

    // Optimistic update of messages view
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);

    // Session Management
    let currentSessionId = activeSessionId;

    if (currentSessionId === null) {
      // Create new session logic
      // We only create a session if it's the FIRST message, OR if we are in "new chat" mode.
      // If messages was empty, create new session.
      if (messages.length === 0) {
        const newSession: ChatSession = {
          id: Date.now(),
          title: text, // Title is 1st message
          messages: [userMsg],
        };
        setSessions(prev => [...prev, newSession]);
        setActiveSessionId(newSession.id);
        currentSessionId = newSession.id;
      } else {
        // This case shouldn't happen commonly if we handle "new chat" correctly, 
        // but if we are in "draft" mode with existing messages but no session ID (edge case?), 
        // we should probably have created the session on the first message.
        // Let's assume activeSessionId is null ONLY when messages is empty.
        // Wait, if I send msg 1 -> Session created. ActiveSession set.
        // Msg 2 -> activeSession is set.
        // So this block is for the FIRST message of a new flow.
      }
    } else {
      // Update existing session
      setSessions(prev => prev.map(session =>
        session.id === currentSessionId
          ? { ...session, messages: [...session.messages, userMsg] }
          : session
      ));
    }

    setTimeout(() => {
      const hasImages = Math.random() > 0.5; // 50% chance of images
      const aiMsg: Message = {
        id: Date.now() + 1,
        role: 'ai',
        content: AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)],
        timestamp: new Date(),
        images: hasImages ? [
          'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&q=80',
          'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=400&q=80',
          'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=400&q=80',
          'https://images.unsplash.com/photo-1557683316-973673baf926?w=400&q=80',
        ] : undefined,
      };

      // Only update view if we are still on the active session
      if (activeSessionIdRef.current === currentSessionId) {
        setMessages(prev => [...prev, aiMsg]);
      }

      // Update session with AI response
      if (currentSessionId) {
        setSessions(prev => prev.map(session =>
          session.id === currentSessionId
            ? { ...session, messages: [...session.messages, aiMsg] }
            : session
        ));
      }
    }, 1000);
  };

  const switchSession = (sessionId: number) => {
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      setActiveSessionId(sessionId);
      setMessages(session.messages);
      setChatMode(true);
    }
  };

  return (
    <div
      className="flex justify-center items-center h-screen w-full overflow-hidden"
      style={{
        background: `radial-gradient(ellipse at top left, rgba(157,174,208,1) 0%, rgba(228,224,220,1) 100%)`,
      }}
    >
      {/* Sidebar */}
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((prev) => !prev)}
        onSendMessage={sendDirectMessage}
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSwitchSession={switchSession}
        onNewChat={handleNewChat}
        onReset={handleReset}
      />

      {/* Main View */}
      <main className="flex-1 flex flex-col h-screen relative">
        {/* Top Bar: Nav Pills — right side */}
        <div className="flex items-start justify-end px-8 pt-8 pb-4 absolute top-0 left-0 right-0 z-10 pointer-events-none">
          <div className="pointer-events-auto relative">
            <NavigationPills
              onSendMessage={sendDirectMessage}
              isCompact={isCompactMode}
              visualizeImages={visualizeImages}
              onToggleVisualize={() => setVisualizeImages(!visualizeImages)}
            />
          </div>
        </div>

        {/* ── Dynamic Layout ────────────────────────────────────────── */}
        {chatMode ? (
          <>
            {/* Messages Feed — centered */}
            <div
              id="chat-interface-wrapper"
              ref={scrollContainerRef}
              className="flex-1 overflow-y-auto pt-[120px] relative"
            >

              {/* Inner Container for centering */}
              <div className="mx-auto w-full max-w-[1200px] px-16 flex flex-col gap-6 pb-[400px]">
                {messages.map((msg, index) => (
                  <div
                    key={msg.id}
                    ref={index === messages.length - 1 ? messagesEndRef : null}
                    style={{ scrollMarginTop: '130px' }}
                  >
                    <ChatMessage
                      message={msg}
                      onFeedback={(id, type) => {
                        setMessages(prev => prev.map(m =>
                          m.id === id ? { ...m, feedback: type } : m
                        ));
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Command Center — centered at bottom with responsive width */}
            <div className="fixed bottom-[40px] left-1/2 transform -translate-x-1/2 z-40 w-full md:w-[90vw] xl:w-[60vw] px-4 md:px-8">
              <div className={`${isCompactMode ? '' : 'pt-8 pb-5'}`}>
                <CommandCenter
                  inputRef={inputRef}
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                  onSend={handleSend}
                  isCentered={false}
                  onSendMessage={sendDirectMessage}
                />
              </div>
            </div>
          </>
        ) : (
          /* Empty State — input centered-left in viewport */
          <div className="flex-1 flex flex-col justify-center items-center px-8 pb-20">
            <motion.div
              key="centered-input"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="w-full md:w-[70vw] xl:w-[60vw]"
            >
              <CommandCenter
                inputRef={inputRef}
                inputValue={inputValue}
                setInputValue={setInputValue}
                onSend={handleSend}
                isCentered={true}
                onSendMessage={sendDirectMessage}
              />
            </motion.div>
          </div>
        )}




      </main>
    </div>
  );
};

export default App;