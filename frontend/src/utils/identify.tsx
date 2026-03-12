import { AnimatePresence, motion, useAnimation } from "framer-motion";
import { CheckCircle2, Mic, Volume2, XCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface IdentificationProps {
  data: any;
  round: number;
  speak: (text: string) => Promise<unknown>;
  onScoreUpdate: (score: number) => void;
  onLivesUpdate: (update: (prev: number) => number) => void;
  onRoundComplete: (correctInBatch: number) => void;
  isLoading: boolean;
}

export function IdentificationMode({
  data,
  round,
  speak,
  onScoreUpdate,
  onLivesUpdate,
  onRoundComplete,
  isLoading,
}: IdentificationProps) {

  const [localIndex, setLocalIndex] = useState(0);
  const [feedback, setFeedback] = useState<'success' | 'error' | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");

  const recognitionRef = useRef<any>(null);
  const batchCorrectRef = useRef(0);
  const hasCompletedBatchRef = useRef(false);

  const items = data?.options || [];
  const currentItem = items[localIndex];
  const currentItemRef = useRef(currentItem);

  const micAnimation = useAnimation();

  useEffect(() => {
    currentItemRef.current = currentItem;
  }, [currentItem]);

  // Reset on new round
  useEffect(() => {
    batchCorrectRef.current = 0;
    hasCompletedBatchRef.current = false;
    setLocalIndex(0);
    setTranscript("");
    setFeedback(null);
  }, [round]);

  // Batch completion
  useEffect(() => {
    if (items.length > 0 && localIndex >= items.length && !hasCompletedBatchRef.current) {
      hasCompletedBatchRef.current = true;
      if (recognitionRef.current) recognitionRef.current.abort();
      onRoundComplete(batchCorrectRef.current);
    }
  }, [localIndex, items.length, onRoundComplete]);

  // Prompt speech
  useEffect(() => {
    if (currentItem && !feedback && !isLoading) {
      speak("What is this?");
    }
  }, [localIndex, currentItem, feedback, isLoading, speak]);

  const handleSpeech = async (spokenText: string) => {
    const activeItem = currentItemRef.current;
    if (!activeItem || feedback) return;

    const answer = activeItem.name.toLowerCase();
    const spoken = spokenText.toLowerCase();
    const isCorrect = spoken.includes(answer) || answer.includes(spoken);

    if (isCorrect) {
      setFeedback("success");
      batchCorrectRef.current += 1;
      onScoreUpdate(2.5);
      await speak(`Great! That is ${answer}`);
    } else {
      setFeedback("error");
      onLivesUpdate(prev => prev - 1);
      await speak(`Not quite. This is a ${answer}`);
    }

    setTimeout(() => {
      setFeedback(null);
      setTranscript("");
      setLocalIndex(prev => prev + 1);
    }, 1200);
  };

  // Speech recognition setup
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      micAnimation.start({
        scale: [1, 1.2, 1],
        transition: { repeat: Infinity, duration: 0.6 },
      });
    };

    recognition.onend = () => {
      setIsListening(false);
      micAnimation.stop();
    };

    recognition.onerror = () => setIsListening(false);

    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      handleSpeech(text);
    };

    recognitionRef.current = recognition;
  }, [micAnimation]);

  const startListening = () => {
    if (!recognitionRef.current || isListening || feedback || isLoading || localIndex >= items.length) return;
    recognitionRef.current.start();
  };

  if (isLoading || !currentItem) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <p className="text-lg font-bold text-primary animate-pulse">
          Loading objects...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-md mx-auto">

      {/* Round Info */}
      <div className="text-center space-y-1">
        <h2 className="text-xs font-black text-primary/40 uppercase tracking-[0.3em]">
          Round {round}
        </h2>
        <p className="text-sm font-bold text-primary/70">
          Object {localIndex + 1} of {items.length}
        </p>
      </div>

      {/* Image Card */}
      <div className="relative w-full aspect-square max-w-[300px] bg-card border rounded-3xl shadow-xl flex items-center justify-center p-8 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentItem.image}
            src={currentItem.image}
            className="max-h-full max-w-full object-contain"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.4 }}
          />
        </AnimatePresence>

        {/* Feedback overlay */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`absolute inset-0 flex items-center justify-center z-20 backdrop-blur-sm ${
                feedback === "success" ? "bg-green-500/70" : "bg-red-500/70"
              }`}
            >
              {feedback === "success"
                ? <CheckCircle2 className="w-24 h-24 text-white"/>
                : <XCircle className="w-24 h-24 text-white"/>
              }
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-center gap-10">

        {/* Speaker */}
        <button
          onClick={() => speak(currentItem.name)}
          className="h-14 w-14 rounded-full border-2 border-primary flex items-center justify-center text-primary hover:scale-110 transition-shadow shadow-md"
        >
          <Volume2 className="h-6 w-6"/>
        </button>

        {/* Mic with waveform */}
        <div className="relative flex items-center justify-center">
          {isListening && (
            <motion.div
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="absolute w-28 h-28 rounded-full border-2 border-primary opacity-40"
            />
          )}
          <motion.button
            onClick={startListening}
            animate={micAnimation}
            className={`relative z-10 h-20 w-20 rounded-full bg-gradient-to-br from-primary to-primary/80 shadow-lg flex items-center justify-center hover:scale-105 transition-transform`}
          >
            <Mic className="h-10 w-10 text-white"/>
          </motion.button>
        </div>

      </div>

      {/* Transcript */}
      <motion.div
        key={transcript}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="h-10 text-center text-lg font-bold text-primary italic"
      >
        {transcript}
      </motion.div>
    </div>
  );
}