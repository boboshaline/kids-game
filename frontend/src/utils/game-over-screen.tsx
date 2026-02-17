import { useGetAnalysisQuery } from "@/api/game-slice";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AnimatePresence, motion } from "framer-motion";
import { Award, Brain, Info, Loader2, RefreshCcw, Target, Timer, Trophy, X, Zap } from "lucide-react";
import { useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, XAxis, YAxis } from 'recharts';

interface GameOverProps {
  levelId: string;
  score: number;
  round: number;
  sessionId: string | null;
}

export function GameOverScreen({ levelId, score, round, sessionId }: GameOverProps) {
  const [showAnalysis, setShowAnalysis] = useState(false);

  return (
    <div className="flex items-center justify-center min-h-[50vh] p-4 z-10 w-full">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        <Card className="max-w-sm border-none shadow-2xl bg-card/90 backdrop-blur-xl rounded-[2rem] relative overflow-hidden">
          
          {/* ANALYSIS ICON BUTTON */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowAnalysis(true)}
            className="absolute top-4 right-4 rounded-full bg-primary/10 hover:bg-primary/20 transition-all hover:rotate-12"
          >
            <Info className="w-5 h-5 text-primary" />
          </Button>

          <CardContent className="p-8 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-yellow-100/50 rounded-full flex items-center justify-center mb-4">
              <Trophy className="w-8 h-8 text-yellow-500" />
            </div>
            
            <h2 className="text-3xl font-black text-foreground mb-1 tracking-tight">Level Clear!</h2>
            <p className="text-muted-foreground text-sm mb-6 font-medium italic">Master of the {levelId} realm!</p>
            
            <div className="grid grid-cols-2 gap-3 w-full mb-6">
              <div className="p-3 bg-primary/5 rounded-xl border border-primary/10">
                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Final Score</p>
                <p className="text-2xl font-black text-foreground">{score}</p>
              </div>
              <div className="p-3 bg-primary/5 rounded-xl border border-primary/10">
                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Rounds</p>
                <p className="text-2xl font-black text-foreground">{round}/10</p>
              </div>
            </div>

            <div className="flex flex-col gap-2 w-full">
               <Button 
                size="lg" 
                onClick={() => window.location.reload()}
                className="w-full h-12 rounded-xl text-lg font-bold gap-2 shadow-lg transition-transform active:scale-95"
              >
                <RefreshCcw className="w-5 h-5" /> Play Again
              </Button>
              
              <button 
                onClick={() => setShowAnalysis(true)}
                className="text-xs text-muted-foreground hover:text-primary transition-colors font-semibold uppercase tracking-widest mt-2"
              >
                View Performance Analysis
              </button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ANALYSIS MODAL */}
      <AnimatePresence>
        {showAnalysis && (
          <GameAnalysisModal 
            sessionId={sessionId} 
            onClose={() => setShowAnalysis(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}




export function GameAnalysisModal({ sessionId, onClose }: { sessionId: string | null; onClose: () => void }) {
  const { data, isLoading, isError } = useGetAnalysisQuery(
    { sessionId: sessionId || "" },
    { skip: !sessionId }
  );

  const chartConfig = {
    time: { label: "Response Time", color: "hsl(var(--primary))" },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
        // MAX WIDTH INCREASED, Height capped
        className="bg-card border border-border w-full max-w-4xl rounded-[2.5rem] shadow-3xl p-6 md:p-8 relative overflow-hidden"
      >
        {/* Header - Stays at top */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-2xl md:text-3xl font-black tracking-tight text-foreground">Session Insight</h3>
            <p className="text-[10px] font-mono text-muted-foreground opacity-60 uppercase tracking-widest">ID_{sessionId?.slice(0, 8)}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X className="w-6 h-6" />
          </Button>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="font-bold animate-pulse text-muted-foreground text-sm">Synthesizing data...</p>
          </div>
        ) : isError ? (
          <div className="py-20 text-center text-destructive font-bold font-mono">DATA_LINK_FAILURE</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            
            {/* LEFT SIDE: The Chart (Takes 3/5 width) */}
            <div className="md:col-span-3 space-y-3">
              <div className="flex justify-between items-end px-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Speed Performance (s)</span>
                <div className="flex gap-2 text-[9px] font-bold uppercase">
                   <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500" /> Correct</div>
                   <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500" /> Missed</div>
                </div>
              </div>
              
              <div className="h-[220px] w-full bg-primary/5 rounded-[2rem] p-4 border border-primary/10">
                <ChartContainer config={chartConfig} className="h-full w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data?.history}   margin={{ top: 20, right: 20, bottom: 20, left: 15 }} 
>
                      <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--muted-foreground)/0.1)" />
                      <XAxis dataKey="round" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 700 }} />
                      <YAxis hide />
                      <ChartTooltip content={<ChartTooltipContent hideLabel />} cursor={{ fill: 'transparent' }} />
<Bar
  dataKey="time"
  radius={[4, 4, 4, 4]}
  barSize={24}
  isAnimationActive={true}       // enable animation
  animationDuration={1000}       // duration in milliseconds
  animationEasing="ease-out"     // easing type
>
  {data?.history.map((entry: any, index: number) => {
    const isCorrect = entry.isCorrect === true; 

    return (
      <Cell 
        key={`cell-${index}`} 
        fill={isCorrect ? "hsl(120, 70%, 40%)" : "hsl(0, 70%, 50%)"} 
        fillOpacity={isCorrect ? 1 : 0.8}
        stroke={isCorrect ? "none" : "hsl(0, 70%, 30%)"}
        strokeWidth={isCorrect ? 0 : 1}
      />
    );
  })}
</Bar>


                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </div>

            {/* RIGHT SIDE: Stats & Coach (Takes 2/5 width) */}
            <div className="md:col-span-2 flex flex-col gap-4">
              {/* Stats Sub-grid */}
              <div className="grid grid-cols-2 gap-3">
                <StatCard label="Accuracy" value={`${data?.accuracy}%`} icon={<Target className="w-3 h-3 text-emerald-500" />} />
                <StatCard label="Speed" value={`${data?.avgTime}s`} icon={<Timer className="w-3 h-3 text-blue-500" />} />
                <StatCard label="Streak" value={data?.maxStreak} icon={<Zap className="w-3 h-3 text-yellow-500" />} />
                <StatCard label="Score" value={`${data?.correctRounds}/10`} icon={<Award className="w-3 h-3 text-purple-500" />} />
              </div>

              {/* AI Coach - Slimmer for side placement */}
              <div className="flex-1 bg-foreground text-background p-5 rounded-[2rem] shadow-xl relative overflow-hidden flex flex-col justify-center">
                <Brain className="absolute -right-2 -top-2 w-16 h-16 opacity-10 rotate-12" />
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-60">AI Recommendation</span>
                </div>
                <p className="text-sm md:text-base font-semibold leading-tight italic relative z-10">
                  "{data?.recommendation}"
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-center">
          <Button 
            onClick={onClose} 
            className="w-full md:w-1/2 h-12 rounded-2xl text-base font-black shadow-xl hover:scale-[1.02] transition-all"
          >
            Back to Game
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: any; icon: React.ReactNode }) {
  return (
    <div className="bg-muted/40 border border-border/50 p-3 rounded-2xl flex flex-col items-center text-center">
      <div className="mb-1">{icon}</div>
      <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-tighter">{label}</p>
      <p className="text-lg font-black tracking-tight">{value}</p>
    </div>
  );
}
