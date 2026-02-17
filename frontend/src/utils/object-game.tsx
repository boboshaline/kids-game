import { useGetGameRoundQuery, useProcessTurnMutation } from "@/api/game-slice";
import sound from '@/assets/sound.mp4';
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { Volume2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ClickableObject } from "./DraggableObject";
import { GameOverScreen } from "./game-over-screen";

interface Props {
  levelId: string;
  speak: (text: string) => Promise<unknown>;
  onScoreUpdate: (score: number) => void;
onLivesUpdate: (update: any) => void;
  isTimeUp?: boolean;
    isCorrectHighlight?: boolean;
    sessionId: string;

}

interface GameObject {
  id: number;
  name: string;
  image: string;
  difficulty: number;
}

interface ProcessTurnResponse {
  success: boolean;
  isCorrect: boolean;
  newStreak: number;
  message?: string;
  aiDecision?: string;
  recordId?: string;
}

export function ObjectGame({ levelId, speak, onScoreUpdate, onLivesUpdate, isTimeUp,sessionId }: Props) {
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [highlightCorrectId, setHighlightCorrectId] = useState<number | null>(null);
// const[showAnalysis,setShowAnalysis]=useState(false);
// const[savedSessionId,setSavedSessionId]=useState<string>("");

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  const winAudioRef = useRef<HTMLAudioElement | null>(null);
  const startTimeRef = useRef<number>(0);

  const { data, isLoading, isFetching } = useGetGameRoundQuery({ levelId, round }, { skip: isGameOver });
  const [processTurn, { isLoading: isProcessing }] = useProcessTurnMutation();

  const target = data?.target as GameObject | undefined;
  const options = (data?.options || []) as GameObject[];

  // 1. Handle External Game Over (Timer Run Out)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (isTimeUp) setIsGameOver(true);
  }, [isTimeUp]);

  // 2. Play win sound when game ends
  useEffect(() => {
    if (isGameOver) {
      if (!winAudioRef.current) {
        winAudioRef.current = new Audio(sound);
      }
      winAudioRef.current.currentTime = 0;
      winAudioRef.current.play().catch(() => {});
    }
  }, [isGameOver]);

  // 3. New Target Logic
  useEffect(() => {
    if (target && !isFetching && !feedback && !isGameOver) {
      startTimeRef.current = Date.now();
      speak(`Can you find the... ${target.name}?`);
    }
  }, [target, isFetching, speak, feedback,isGameOver]);

 
  // 4. Choice Logic
  const handleChoice = async (choice: GameObject) => {
    if (isProcessing || isFetching || feedback || !target) return;

    const currentTime = new Date().getTime();
    const secondsElapsed = (currentTime - startTimeRef.current) / 1000;
    const finalTimeTaken = Math.min(Math.max(secondsElapsed, 0.1), 60);

    try {
      const result: ProcessTurnResponse = await processTurn({
        sessionId,
        levelId,
        choiceId: choice.id,
        targetId: target.id,
        timeTaken: finalTimeTaken,
        round,
        streak
      }).unwrap();

      const article = /^[aeiou]/i.test(choice.name) ? "an" : "a";

      if (result.isCorrect) {
        setFeedback({ type: 'success', msg: "PERFECT!" });
        
        // Update local score and sync with parent
        const newScore = score + 10;
        setScore(newScore);
        onScoreUpdate(newScore);
        
        setStreak(result.newStreak);
        
        await speak(`Yay! That is ${article} ${choice.name}!`);
        
        setFeedback(null);
        if (round >= 10) {
          setIsGameOver(true);
        } else {
          setRound(r => r + 1);
        }
     } else {
  setFeedback({ type: 'error', msg: `Oops! That is not correct.` });

  setStreak(0);
  onLivesUpdate(prev => prev - 1);

  // const correctArticle = /^[aeiou]/i.test(target.name) ? "an" : "a";

  // Highlight correct emoji
  setHighlightCorrectId(target.id);

  await speak(
    `Oops! That is ${article} ${choice.name}. The correct answer is this.`
  );

  // Give child time to SEE the correct emoji
  await new Promise(resolve => setTimeout(resolve, 1500));

  setHighlightCorrectId(null); // remove highlight
  setFeedback(null);

  if (round >= 10) {
    setIsGameOver(true);
  } else {
    setRound(r => r + 1);
  }
}


    } catch (error) {
      console.error("Game Error:", error);
    }
  };


  if (isGameOver) {
    return(
      <GameOverScreen levelId={levelId} score={score} round={round} sessionId={sessionId} />
    )
  }

  return (
    <div className="relative max-w-4xl mx-auto w-full px-4 py-2 space-y-6">
      
      {/* Target Question Card - MINIMIZED */}
      <div className="relative max-w-lg mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={target?.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-card border border-border/40 rounded-[1.5rem] p-6 shadow-lg text-center relative overflow-hidden"
          >
            <div className="flex flex-col items-center relative z-10">
              <h2 className="text-sm text-muted-foreground font-medium mb-0.5 uppercase tracking-wider">Find the</h2>
              <div className="flex items-center justify-center gap-3">
                <h3 className="text-4xl sm:text-5xl font-black text-foreground capitalize tracking-tight">
                  {target?.name}
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => speak(target?.name || "")}
                  className="h-10 w-10 rounded-full bg-primary/10 hover:bg-primary/20"
                >
                  <Volume2 className="h-5 w-5 text-primary" />
                </Button>
              </div>
            </div>
            
            {/* Thinner Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted/10">
              <motion.div 
                className="h-full bg-primary/60"
                initial={{ width: 0 }}
                animate={{ width: `${(round / 10) * 100}%` }}
              />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Feedback Overlay - Adjusted for smaller card */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center rounded-[1.5rem] backdrop-blur-sm z-30 pointer-events-none"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className={`px-8 py-3 rounded-2xl font-black text-xl shadow-xl text-white
                  ${feedback.type === "success" ? "bg-emerald-500" : "bg-rose-500"}`}
              >
                {feedback.msg}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Options Grid - Tightened spacing */}
      <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 max-w-3xl mx-auto w-full px-2 min-h-[180px]">
        <AnimatePresence mode="wait">
          {isLoading || isFetching ? (
            <motion.div
              key="loader"
              className="flex gap-6"
            >
              {[0, 1, 2].map((i) => (
                <div key={i} className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-muted/20 animate-pulse" />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key={`grid-${round}`}
              initial="hidden" animate="visible" exit="exit"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
                exit: { opacity: 0, scale: 0.95 }
              }}
              className="flex flex-wrap items-center justify-center gap-6 sm:gap-10"
            >
              {options.map((item: GameObject) => (
                <motion.div
                  key={`${item.id}-${round}`}
                  variants={{
                    hidden: { opacity: 0, scale: 0.8 },
                    visible: { opacity: 1, scale: 1 },
                    exit: { opacity: 0, scale: 0.8 }
                  }}
                  whileHover={{ y: -5 }}
                  className="flex items-center justify-center"
                >
                 <ClickableObject
  disabled={isProcessing || isFetching || !!feedback}
  item={item}
  isCorrectHighlight={highlightCorrectId === item.id}
  onSelect={() => handleChoice(item)}
/>

                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}