import { AnimatePresence, motion } from "framer-motion";

interface GameObject {
  id: number;
  name: string;
  image: string; // URL from Python
  difficulty: number;
}

interface Props {
  item: GameObject;
  disabled: boolean;
  onSelect: () => void;
  isCorrectHighlight?: boolean;
}



export function ClickableObject({ item, disabled, onSelect, isCorrectHighlight }: Props) {
  return (
    <div
      className={`relative w-full h-full flex items-center justify-center p-4 
        ${isCorrectHighlight ? "z-50" : "z-0"}`}
      onClick={!disabled ? onSelect : undefined}
    >
      <motion.div
        layout // Smoothly handles layout shifts
        initial={false}
        animate={isCorrectHighlight 
          ? { scale: 1.2, y: -20, zIndex: 50 } 
          : { scale: 1, y: 0, zIndex: 10 }
        }
        whileHover={!disabled && !isCorrectHighlight ? { y: -8, scale: 1.05 } : {}}
        whileTap={!disabled ? { scale: 0.92 } : {}}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className={`
          relative flex items-center justify-center cursor-pointer group
          ${disabled && !isCorrectHighlight ? "cursor-not-allowed opacity-40" : "opacity-100"}
        `}
      >
        {/* The Animated "Aura" / Glow */}
        <AnimatePresence>
          {isCorrectHighlight && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: [0.4, 0.7, 0.4], 
                scale: [1, 1.3, 1],
              }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="absolute inset-0 bg-primary/30 blur-3xl rounded-full -z-10"
            />
          )}
        </AnimatePresence>

        {/* The Ring/Border */}
        <div className={`
          absolute inset-0 rounded-full border-4 transition-all duration-500
          ${isCorrectHighlight 
            ? "border-primary shadow-[0_0_30px_rgba(var(--primary-rgb),0.6)] scale-110" 
            : "border-transparent group-hover:border-primary/20"
          }
        `} />

        {/* The Image */}
        <img 
          src={item.image} 
          alt={item.name} 
          className={`
            w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-full z-20 transition-transform
            ${isCorrectHighlight ? "ring-4 ring-white shadow-xl" : "shadow-md"}
          `}
        />
      </motion.div>
    </div>
  );
}