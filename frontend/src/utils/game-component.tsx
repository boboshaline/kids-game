import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ArrowLeft, Heart, Timer, Trophy } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ObjectGame } from "./object-game";

export  function GameComponent() {
  const { levelId } = useParams();
  const navigate = useNavigate();
  const[gameStarted,setGameStarted]=useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground font-['Quicksand'] p-4 sm:p-6">
      {/* Top Navigation / HUD */}
      <nav className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        <div className="w-full md:w-auto flex justify-start">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")}
            className="gap-2 text-muted-foreground hover:text-primary p-0 sm:p-2"
          >
            <ArrowLeft className="w-5 h-5" /> 
            <span className="inline">Back to Home</span>
          </Button>
        </div>

        {/* HUD - Optimized for small screens */}
        <div className="w-full md:w-auto flex items-center justify-around md:justify-end gap-3 sm:gap-6 bg-card/50 px-4 py-3 sm:px-6 rounded-2xl border border-border backdrop-blur-sm shadow-lg">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-secondary" />
            <span className="font-bold text-sm sm:text-base">0</span>
          </div>
          <div className="h-4 w-[1px] bg-border hidden sm:block" />
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-destructive fill-destructive" />
            <span className="font-bold text-sm sm:text-base">3</span>
          </div>
          <div className="h-4 w-[1px] bg-border hidden sm:block" />
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Timer className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            <span className="font-bold text-sm sm:text-base tracking-mono">05:00</span>
          </div>
        </div>
      </nav>

      {/* Main Game Area */}
      <main className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative"
        >
          {/* Level Badge */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 whitespace-nowrap">
            <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest shadow-lg">
              Level: {levelId}
            </span>
          </div>

          {/* Inside Game.tsx */}

<Card className="min-h-[600px] w-full bg-card border-border flex flex-col items-center justify-center p-6 sm:p-12 text-center relative overflow-hidden shadow-2xl ring-1 ring-white/5">
  {/* Background glow for depth */}
  <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

  {gameStarted ? (
    <div className="w-full flex items-center justify-center z-10">
      <ObjectGame levelId={levelId || "beginner"} />
    </div>
  ) : (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="z-10 flex flex-col items-center gap-6"
    >
      <div className="relative">
        <div className="absolute inset-0 bg-primary blur-3xl opacity-20 rounded-full" />
        <Trophy className="w-24 h-24 text-primary relative z-10 animate-bounce" />
      </div>
      
      <div>
        <h2 className="text-4xl sm:text-5xl font-black mb-3">Ready to Play?</h2>
        <p className="text-muted-foreground text-lg max-w-sm mx-auto">
          You'll see different objects. Find the right one as fast as you can!
        </p>
      </div>

      <Button 
        size="lg"
        onClick={() => setGameStarted(true)}
        className="rounded-full px-10 py-8 text-2xl font-black shadow-xl hover:scale-110 transition-transform bg-primary hover:bg-primary/90"
      >
        START CHALLENGE
      </Button>
    </motion.div>
  )}
</Card>
        </motion.div>

        {/* Game Tips Section - Stacked on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-6 sm:mt-8">
          {[
            { label: "Objective", val: "Match the patterns" },
            { label: "Difficulty", val: levelId },
            { label: "Bonus", val: "1.5x Multiplier" }
          ].map((stat, i) => (
            <div key={i} className="bg-input/30 border border-border p-3 sm:p-4 rounded-xl text-center flex sm:flex-col justify-between items-center sm:justify-center">
              <p className="text-[10px] sm:text-xs text-muted-foreground uppercase font-bold tracking-tighter">{stat.label}</p>
              <p className="text-foreground font-semibold uppercase text-xs sm:text-base">{stat.val}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}