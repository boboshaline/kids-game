import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { AnimatePresence, motion } from "framer-motion";
import { Flame, Star, X, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface LevelOption {
  id: "beginner" | "medium" | "advanced";
  title: string;
  desc: string;
  icon: React.ReactNode;
  variant: "primary" | "secondary" | "accent"; // Mapping to your theme colors
  borderColor: string;
}

const levels: LevelOption[] = [
  {
    id: "beginner",
    title: "Beginner",
    desc: "Perfect for young explorers starting their journey.",
    icon: <Star className="w-6 h-6 text-green-400" />,
    variant: "primary",
    borderColor: "hover:border-primary",
  },
  {
    id: "medium",
    title: "Medium",
    desc: "A bit more challenging to keep the brain growing.",
    icon: <Zap className="w-6 h-6 text-yellow-400" />,
    variant: "secondary",
    borderColor: "hover:border-secondary",
  },
  {
    id: "advanced",
    title: "Advanced",
    desc: "For the masters of Play2Learn! Are you ready?",
    icon: <Flame className="w-6 h-6 text-destructive" />,
    variant: "accent",
    borderColor: "hover:border-destructive",
  }
];

interface LevelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Level({ isOpen, onClose }: LevelProps) {
    const navigate=useNavigate();

    const handleSelectLevel=(levelId:string)=>{
        onClose();
        navigate(`/game/${levelId}`);
    }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          {/* Backdrop using your --background theme */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl z-10"
          >
            <Card className="bg-card border-border shadow-2xl rounded-[2.5rem] overflow-hidden">
              {/* Close Button - Shadcn ghost variant */}
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="absolute top-6 right-6 rounded-full hover:bg-white/10"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </Button>

              <CardHeader className="text-center pt-10">
                <CardTitle className="text-4xl font-bold text-foreground">
                  Select Your Level
                </CardTitle>
                <CardDescription className="text-muted-foreground text-lg">
                  Choose the path that fits your learning style
                </CardDescription>
              </CardHeader>

              <CardContent className="grid grid-cols-1 gap-4 pb-10 px-8">
                {levels.map((level, i) => (
                  <motion.div
                    key={level.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Button
                      variant="outline"
                      className={`w-full h-auto flex items-center justify-start gap-6 p-6 bg-input/50 border-2 border-border rounded-2xl transition-all text-left ${level.borderColor} group overflow-hidden relative`}
                      onClick={() => {
                        handleSelectLevel(level.id);
                      }}
                    >
                      {/* Icon Container */}
                      <div className="bg-background p-4 rounded-xl shadow-inner group-hover:scale-110 transition-transform">
                        {level.icon}
                      </div>

                      <div className="flex flex-col">
                        <span className={`text-xl font-bold uppercase tracking-tight 
                          ${level.id === 'beginner' ? 'text-primary' : 
                            level.id === 'medium' ? 'text-secondary' : 'text-destructive'}`}>
                          {level.title}
                        </span>
                        <span className="text-muted-foreground font-normal whitespace-normal line-clamp-1">
                          {level.desc}
                        </span>
                      </div>
                    </Button>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}