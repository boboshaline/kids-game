import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ArrowLeft, Heart, Timer, Trophy } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { ObjectGame } from "./object-game";
import { useSpeech } from "./useSpeech";

export function GameComponent() {
  const { levelId } = useParams();
  const navigate = useNavigate();
  const { speak } = useSpeech();

  // --- HUD & GAME STATE ---
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [secondsLeft, setSecondsLeft] = useState(300); // 5 Minutes total
  const [isGameOverFromParent, setIsGameOverFromParent] = useState(false);
 const [sessionId] = useState(() => uuidv4());

  console.log("Session ID:", sessionId); 
   
//to give each player a unique id
  useEffect(() => {
  let userId = localStorage.getItem("game_user_id");
  if (!userId) {
    userId = `player_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("game_user_id", userId);
  }
}, []);

  // --- TIMER LOGIC ---
useEffect(() => {
  let interval: NodeJS.Timeout;

  if (gameStarted && !isGameOverFromParent) {
    interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setIsGameOverFromParent(true); // ✅ safe, only called when timer hits 0
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  return () => clearInterval(interval);
}, [gameStarted, isGameOverFromParent]);

  // Format seconds into MM:SS
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // --- CALLBACKS FOR CHILD COMPONENT ---
  const handleScoreChange = useCallback((newScore: number) => {
    setScore(newScore);
  }, []);

  const handleLivesChange = useCallback((newLives: number) => {
    setLives(newLives);
    if (newLives <= 0) {
      setIsGameOverFromParent(true);
    }
  }, []);
return (
  <div className="min-h-screen bg-background text-foreground font-['Quicksand'] p-2 sm:p-4 transition-colors duration-500 overflow-hidden">
    
    {/* Top Navigation / HUD - Tightened margins */}
    <nav className="max-w-5xl mx-auto flex items-center justify-between gap-2 mb-4">
      <Button
        variant="ghost"
        onClick={() => navigate("/")}
        className="gap-2 text-muted-foreground hover:text-primary p-2 transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="hidden sm:inline font-bold text-sm">Back</span>
      </Button>

      {/* HUD - Scaled down */}
      <motion.div 
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center gap-4 sm:gap-6 bg-card/60 px-4 py-2 rounded-2xl border border-border/50 backdrop-blur-md shadow-lg"
      >
        <div className="flex items-center gap-1.5">
          <Trophy className="w-4 h-4 text-yellow-500" />
          <span className="font-black text-base">{score}</span>
        </div>
        
        <div className="flex items-center gap-1.5">
          <Heart className={`w-4 h-4 ${lives === 1 ? 'text-destructive animate-pulse' : 'text-rose-500 fill-rose-500'}`} />
          <span className="font-black text-base">{lives}</span>
        </div>
        
        <div className="flex items-center gap-1.5">
          <Timer className={`w-4 h-4 ${secondsLeft < 30 ? 'text-destructive animate-bounce' : 'text-primary'}`} />
          <span className={`font-black text-base ${secondsLeft < 30 ? 'text-destructive' : ''}`}>
            {formatTime(secondsLeft)}
          </span>
        </div>
      </motion.div>
    </nav>

    {/* Main Game Area */}
    <main className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative"
      >
        {/* Level Badge - Smaller and lower profile */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-20">
          <span className="bg-primary text-primary-foreground px-4 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-md">
            LEVEL: {levelId}
          </span>
        </div>

        {/* Main Card - HEIGHT REDUCED from 650px to 450px */}
        <Card className="min-h-[450px] sm:min-h-[500px] w-full bg-card/40 border-border/40 flex flex-col items-center justify-center p-4 sm:p-8 text-center relative overflow-hidden shadow-xl backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />

          {gameStarted ? (
            <div className="w-full z-10">

        <ObjectGame
          speak={speak}
          levelId={levelId || "beginner"}
          onScoreUpdate={handleScoreChange}
          onLivesUpdate={handleLivesChange}
          isTimeUp={secondsLeft === 0}
          sessionId={sessionId} 
        />
      
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="z-10 flex flex-col items-center gap-6"
            >
              <div className="relative">
                <Trophy className="w-20 h-20 text-primary animate-float" />
              </div>

              <div className="space-y-1">
                <h2 className="text-4xl font-black tracking-tighter text-foreground">Ready?</h2>
                <p className="text-muted-foreground text-base font-medium">Find the objects quickly!</p>
              </div>

              <Button
                size="lg"
                onClick={() => setGameStarted(true)}
                className="rounded-2xl px-10 py-6 text-xl font-black shadow-lg hover:scale-105 active:scale-95 transition-all bg-primary text-primary-foreground border-b-4 border-black/10"
              >
                START GAME
              </Button>
            </motion.div>
          )}
        </Card>
      </motion.div>

     {/* Footer Stats - Now perfectly aligned to the card width */}
      <div className="grid grid-cols-3 gap-3 mt-4 w-full">
        {[
          { label: "Challenge", val: "Pattern Match" },
          { label: "Difficulty", val: levelId },
          { label: "Status", val: gameStarted ? "Playing" : "Waiting" }
        ].map((stat, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -2 }}
            className="bg-card/30 border border-border/30 p-3 rounded-2xl text-center flex flex-col items-center justify-center backdrop-blur-sm"
          >
            <p className="text-[9px] text-muted-foreground uppercase font-black tracking-[0.15em] mb-0.5">
              {stat.label}
            </p>
            <p className="text-foreground font-black uppercase text-xs sm:text-sm truncate w-full px-1">
              {stat.val}
            </p>
          </motion.div>
        ))}
      </div>
    </main>
  </div>
);
}