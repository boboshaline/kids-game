import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AnimatePresence, motion } from "framer-motion";
import { Trophy, Volume2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { GAME_DATA, type GameObject } from "./game";

interface ObjectGameProps {
  levelId: string;
}

export function ObjectGame({ levelId }: ObjectGameProps) {
  const [target, setTarget] = useState<GameObject | null>(null);
  const [options, setOptions] = useState<GameObject[]>([]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [round, setRound] = useState(1);
  const [gameFinished, setGameFinished] = useState(false);
  
  // Ref to store the start time of the current round
  const startTimeRef = useRef<number>(0);

  // Audio utility
  const playAudio = useCallback((text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel(); 
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.85; 
    utterance.pitch = 1.1; 
    window.speechSynthesis.speak(utterance);
  }, []);

  const generateNewRound = useCallback(() => {
    if (round > 10) {
      setGameFinished(true);
      return;
    }

    setIsCorrect(null);

    // AI Logic: Content Filtering
    const availableItems = GAME_DATA.filter((item) => {
      if (levelId === "beginner") return item.difficulty === 1;
      if (levelId === "medium") return item.difficulty <= 2;
      return true; 
    });

    // AI Logic: Complexity Scaling
    let gridSize = levelId === "beginner" ? 3 : levelId === "medium" ? 4 : 6;
    if (streak >= 3) gridSize = Math.min(gridSize + 1, 8);

    const shuffled = [...availableItems].sort(() => 0.5 - Math.random());
    const selection = shuffled.slice(0, gridSize);
    const newTarget = selection[Math.floor(Math.random() * selection.length)];

    setOptions(selection);
    setTarget(newTarget);

    // ✅ SAFE: We update the ref inside the callback, not during render.
    // We use a setter function style if needed, but simple assignment is fine here.
    startTimeRef.current = Date.now(); 

    playAudio(`Can you find the ${newTarget.name}?`);
  }, [levelId, streak, round, playAudio]);

  useEffect(() => {
    generateNewRound();
  }, [generateNewRound]);

  // ✅ SAFE: Event handlers are allowed to be "impure" and call Date.now()
  const handleChoice = (choice: GameObject) => {
    // We capture the current time here
    const now = Date.now();
    const timeTaken = (now - startTimeRef.current) / 1000;

    if (choice.id === target?.id) {
      setIsCorrect(true);
      setScore((prev) => prev + 10);
      setStreak((prev) => prev + 1);
      playAudio(`Great job! You found the ${choice.name}`);
      
      console.log(`Latency Analysis: ${timeTaken}s`);

      setTimeout(() => {
        setRound((prev) => prev + 1);
        generateNewRound();
      }, 1500);
    } else {
      setIsCorrect(false);
      setStreak(0);
      playAudio(`Oops! That's the ${choice.name}. Try again!`);
      setTimeout(() => setIsCorrect(null), 1200);
    }
  };

  // ... (Keep the rest of your JSX from the previous message)
  // Just ensure the GameFinished and Grid sections are returned here
  if (gameFinished) {
    return (
      <div className="flex flex-col items-center gap-6 p-8 text-center">
        <Trophy className="w-20 h-20 text-yellow-400" />
        <h2 className="text-4xl font-bold">Great Job, Shaline!</h2>
        <p className="text-xl">Final Score: {score}</p>
        <Button onClick={() => window.location.reload()}>Restart Game</Button>
      </div>
    );
  }

  if (!target) return null;

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-6">
       {/* HUD */}
       <div className="w-full grid grid-cols-2 gap-4">
        <Card className="p-4 bg-card/50">
          <Progress value={(round / 10) * 100} className="h-2 mb-2" />
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Round {round}/10</p>
        </Card>
        <Card className="p-4 bg-card/50 flex flex-col items-center justify-center">
          <p className="text-2xl font-black text-secondary">{streak} 🔥</p>
          <p className="text-[10px] font-bold uppercase text-muted-foreground">Current Streak</p>
        </Card>
      </div>

      {/* Target Question */}
      <div className="text-center py-6">
        <h2 className="text-4xl sm:text-6xl font-black mb-4">Find the <span className="text-primary">{target.name}</span></h2>
        <Button variant="outline" size="sm" onClick={() => playAudio(target.name)} className="rounded-full bg-background/50">
          <Volume2 className="w-4 h-4 mr-2" /> Pronounce
        </Button>
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 w-full max-w-2xl">
        <AnimatePresence mode="popLayout">
          {options.map((item) => (
            <motion.div key={item.id} layout initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.5 }}>
              <Card
                onClick={() => isCorrect === null && handleChoice(item)}
                className={`aspect-square flex items-center justify-center text-8xl cursor-pointer border-4 transition-all
                  ${isCorrect === true && item.id === target.id ? 'border-green-500 bg-green-500/10' : 'border-transparent bg-card'}
                  hover:shadow-2xl hover:shadow-primary/20
                `}
              >
                {item.image}
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}