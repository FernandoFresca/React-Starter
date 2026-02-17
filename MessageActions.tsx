// Message Actions Component
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
