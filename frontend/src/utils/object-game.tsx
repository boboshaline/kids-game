import { useGetGameRoundQuery, useProcessTurnMutation } from "@/api/game-slice";
import sound from '@/assets/sound.mp4';
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { ClickableObject } from "./DraggableObject";
import { GameOverScreen } from "./game-over-screen";
import { IdentificationMode } from "./identify";

interface Props {
  levelId: "beginner" | "medium" | "advanced";
  speak: (text: string) => Promise<unknown>;
  onScoreUpdate: (score: number) => void;
  onLivesUpdate: (update: (prev: number) => number) => void;
  sessionId: string;
}

interface GameObject {
  id: number;
  name: string;
  image: string;
  difficulty: number;
}

export function ObjectGame({ levelId, speak, onScoreUpdate, onLivesUpdate, sessionId }: Props) {
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [highlightCorrectId, setHighlightCorrectId] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  const winAudioRef = useRef<HTMLAudioElement | null>(null);
  const startTimeRef = useRef<number>(0);
  const lastSpokenId = useRef<number | null>(null); // Track to prevent repeat/missed audio

  const { data, isFetching } = useGetGameRoundQuery({ levelId, round }, { skip: isGameOver });
  const [processTurn, { isLoading: isProcessing }] = useProcessTurnMutation();

  

  const target = data?.target as GameObject | undefined;
  const options = (data?.options || []) as GameObject[];

  // Game Over Sound
  useEffect(() => {
    if (isGameOver) {
      if (!winAudioRef.current) winAudioRef.current = new Audio(sound);
      winAudioRef.current.play().catch(e => console.error("Audio error", e));
    }
  }, [isGameOver]);

  // Handle Voice Prompts for Beginner Level
  useEffect(() => {
    if (levelId === "beginner" && target && !feedback && !isGameOver) {
      // Only speak if this is a new target we haven't announced yet
      if (lastSpokenId.current !== target.id) {
        speak(`Can you find the... ${target.name}?`);
        lastSpokenId.current = target.id;
      }
    }
  }, [target, feedback, isGameOver, levelId, speak]);

  useEffect(() => {
    if (!isFetching && data) {
      startTimeRef.current = Date.now();
    }
  }, [isFetching, data]);
  const handleChoice = useCallback(async (choice: GameObject) => {
    if (isProcessing || isFetching || !!feedback || !target || isGameOver) return;
    const finalTimeTaken = (Date.now() - startTimeRef.current) / 1000;

    try {
      const result = await processTurn({
        sessionId, levelId, choiceId: choice.id, targetId: target.id, timeTaken: finalTimeTaken, round, streak
      }).unwrap();

      const article = /^[aeiou]/i.test(choice.name) ? "an" : "a";
      if (result.isCorrect) {
        setFeedback({ type: 'success', msg: "PERFECT!" });
        setHighlightCorrectId(choice.id);
        const newScore = score + 10;
        setScore(newScore);
        onScoreUpdate(newScore);
        setStreak(result.newStreak);
        await speak(`Yay! That is ${article} ${choice.name}!`);
      } else {
        setFeedback({ type: 'error', msg: `Oops! Try again.` });
        setStreak(0);
        onLivesUpdate((prev: number) => prev - 1);
        setHighlightCorrectId(target.id);
        await speak(`Oops! That is ${article} ${choice.name}.`);
      }

      setTimeout(() => {
        setHighlightCorrectId(null);
        setFeedback(null);
        if (round >= 10) {
          setIsGameOver(true);
        } else {
          setRound(prev => prev + 1);
        }
      }, 1500);
    } catch (error) { 
      console.error(error); 
    }
  }, [feedback, isFetching, isProcessing, isGameOver, levelId, onLivesUpdate, onScoreUpdate, processTurn, round, score, sessionId, speak, streak, target]);


  // BATCH COMPLETE HANDLER for Medium/Advanced
  const handleBatchComplete = async (correctInBatch: number) => {
    const finalTimeTaken = (Date.now() - startTimeRef.current) / 1000;
    try {
      const result = await processTurn({
        sessionId,
        levelId,
        choiceId: 0, 
        targetId: 0,
        timeTaken: finalTimeTaken,
        round,
        streak,
        pointsEarned: correctInBatch * 2.5 
      }).unwrap();

      setStreak(result.newStreak);
      
     setRound(prev => {
  const nextRound = prev + 1;

  if (nextRound > 10) {
    setIsGameOver(true);
    return prev;
  }

  return nextRound;
});
    } catch (error) {
      console.error("Batch Process Error:", error);
    }
  };

  if (isGameOver) {
    return <GameOverScreen levelId={levelId} score={score} round={round} sessionId={sessionId} />;
  }

  // RENDER Medium / Advanced
  if (levelId === "medium" || levelId === "advanced") {
    return (
     <IdentificationMode
  key={`identify-batch-${round}`}
  data={data}
  round={round}
  speak={speak}
  onScoreUpdate={(earned) => {
    setScore(prev => {
      const newTotal = prev + earned;
      onScoreUpdate(newTotal);
      return newTotal;
    });
  }}
  onLivesUpdate={onLivesUpdate}
  onRoundComplete={handleBatchComplete}
  isLoading={isFetching}
/>
    );
  }
  
  if (isGameOver) {
    return <GameOverScreen levelId={levelId} score={score} round={round} sessionId={sessionId} />;
  }

  

  return (
    <div className="relative max-w-4xl mx-auto w-full px-4 py-2 space-y-8">
      <div className="relative max-w-lg mx-auto">
        <AnimatePresence mode="wait">
          <motion.div 
            key={target?.id || 'loading'} 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="bg-card border border-border/40 rounded-[2rem] p-8 shadow-xl text-center relative overflow-hidden"
          >
            <div className="flex flex-col items-center relative z-10">
              <span className="text-xs font-bold text-primary/60 uppercase tracking-widest mb-2">Round {round} of 10</span>
              <h3 className="text-3xl sm:text-5xl font-black text-foreground capitalize tracking-tight">
                {isFetching && !target ? "Loading..." : `Find the ${target?.name}`}
              </h3>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-muted/10">
              <motion.div 
                className="h-full bg-primary" 
                animate={{ width: `${(round / 10) * 100}%` }} 
              />
            </div>
          </motion.div>
        </AnimatePresence>

        <AnimatePresence>
          {feedback && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 flex items-center justify-center rounded-[2rem] backdrop-blur-md z-30 pointer-events-none"
            >
              <div className={`px-10 py-5 rounded-3xl font-black text-2xl shadow-2xl text-white ${feedback.type === "success" ? "bg-emerald-500" : "bg-rose-500"}`}>
                {feedback.msg}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-center min-h-[350px]">
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
          {options.map((item, index) => (
            <motion.div 
              key={`${item.id}-${index}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
            >
              <ClickableObject 
                disabled={isProcessing || isFetching || !!feedback} 
                item={item} 
                isCorrectHighlight={highlightCorrectId === item.id} 
                onSelect={() => handleChoice(item)} 
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}


