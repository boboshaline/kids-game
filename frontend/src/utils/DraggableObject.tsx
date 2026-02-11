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
}


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
}

export function ClickableObject({ item, disabled, onSelect }: Props) {
  return (
    <div 
      className="w-full h-full flex items-center justify-center p-4"
      onClick={!disabled ? onSelect : undefined}
    >
      <motion.div
        whileHover={!disabled ? { scale: 1.1 } : {}}
        whileTap={!disabled ? { scale: 0.95 } : {}}
        className="relative flex items-center justify-center cursor-pointer group"
      >
        {/* The Chic Circle Border */}
        <div className={`
          absolute inset-0 rounded-full border-2 
          transition-all duration-300 ease-out
          ${disabled 
            ? "border-muted/20" 
            : "border-primary/20 group-hover:border-primary group-hover:scale-110 shadow-sm group-hover:shadow-primary/20"
          }
        `} />

        {/* Optional: Subtle background fill on hover */}
        {!disabled && (
          <div className="absolute inset-0 rounded-full bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        )}

        {/* The Item (Emoji) */}
        <span 
          role="img"
          aria-label={item.name}
          className="text-6xl sm:text-7xl lg:text-8xl block leading-none select-none z-10 p-6"
          style={{
            background: 'none',
            backgroundColor: 'transparent',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          {item.image}
        </span>
      </motion.div>
    </div>
  );
}