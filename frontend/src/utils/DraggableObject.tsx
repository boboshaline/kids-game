import { motion } from "framer-motion";

interface GameObject {
  id: number;
  name: string;
  image: string;
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
      className={`w-full h-full flex items-center justify-center p-4 ${isCorrectHighlight ? "z-50" : "z-0"}`}
      onClick={!disabled ? onSelect : undefined}
    >
      <motion.div
        whileHover={!disabled ? { y: -8, scale: 1.05 } : {}}
        whileTap={!disabled ? { scale: 0.92 } : {}}

        animate={isCorrectHighlight ? {
          scale: 1.15,
          y: -12,
        } : { scale: 1, y: 0 }}

        transition={{
          type: "spring",
          stiffness: 500,
          damping: 20
        }}
        className={`
          relative flex items-center justify-center cursor-pointer group
          ${disabled ? "cursor-not-allowed opacity-40" : "opacity-100"}
          ${isCorrectHighlight ? "z-50" : "z-10"}
        `}
      >
        {isCorrectHighlight && (
          <motion.div
            layoutId="highlight-glow"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1.4 }}
            className="absolute inset-0 bg-primary/20 blur-2xl rounded-full -z-10"
          />
        )}

        <div className={`
          absolute inset-0 rounded-full border-2 
          transition-all duration-500 ease-out
          ${isCorrectHighlight 
            ? "border-primary shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)] scale-110" 
            : "border-primary/10 group-hover:border-primary/40 shadow-none"
          }
        `} />

        <span
          role="img"
          aria-label={item.name}
          className={`
            text-6xl sm:text-7xl lg:text-8xl block leading-none select-none z-20 p-6
            transition-transform duration-300
            ${isCorrectHighlight ? "drop-shadow-xl" : "drop-shadow-sm"}
          `}
          style={{
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          {item.image}
        </span>
      </motion.div>
    </div>
  );
}