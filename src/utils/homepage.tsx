import { AnimatePresence, motion } from "framer-motion";
import { Play } from "lucide-react";
import { useState } from "react";
import { Contact } from "./contact";
import { Features } from "./features";
import { Level } from "./Level";
import { Navbar } from "./navbar";

export default function HomePage() {
    const[isLevelOpen,setIsLevelOpen]=useState(false);

  const sentence = "Welcome to Play2Learn – where curiosity meets creativity! Explore fun and engaging activities designed to spark young minds, inspire imagination, and make learning an exciting adventure every day.";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.03 },
    },
  };

  const letterVariants = {
    hidden: { opacity: 0, display: "none" },
    visible: { opacity: 1, display: "inline" },
  };

  return (
    <div className="min-h-screen bg-background text-white w-full font-['Quicksand'] selection:bg-purple-500/30 overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <main className="relative pt-20 pb-10 w-full flex flex-col items-center">
        
        {/* Background Glows */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-600/20 blur-[120px] rounded-full -z-10" />

        <div className="px-6 sm:px-12 lg:px-24 xl:px-32 2xl:px-48 flex flex-col items-center text-center">
          {/* Main Title */}
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl sm:text-7xl font-extrabold mb-8 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent"
          >
            Welcome to <span className="text-purple-500">Play2Learn!</span>
          </motion.h1>
          
          {/* Animated Description */}
          <motion.p 
            className="text-gray-400 text-lg sm:text-2xl leading-relaxed max-w-4xl mx-auto text-center mb-12"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {sentence.split("").map((char, index) => (
              <motion.span key={index} variants={letterVariants}>
                {char}
              </motion.span>
            ))}
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="inline-block w-[3px] h-6 sm:h-8 bg-purple-500 ml-1 align-middle"
            />
          </motion.p>

          {/* Intriguing Play Button */}
       <motion.div
  initial={{ opacity: 0, scale: 0.8 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ delay: 2.5, duration: 0.5 }}
  className="relative group mt-8"
  onClick={()=>setIsLevelOpen(true)}
>
  {/* The "Outer Glow" - creates the soft rounded aura */}
  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-md opacity-40 group-hover:opacity-100 transition duration-500"></div>

  <motion.button
    whileHover={{ scale: 1.05, y: -2 }}
    whileTap={{ scale: 0.98 }}
    className="relative flex items-center gap-4 px-10 py-4 bg-slate-950 rounded-full border border-white/10 backdrop-blur-xl shadow-2xl"
  >
    {/* Icon with a soft circular glow */}
    <div className="relative flex items-center justify-center">
      <div className="absolute inset-0 bg-purple-500 blur-lg opacity-40 group-hover:opacity-80 transition-opacity"></div>
      <div className="relative bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-full shadow-inner">
        <Play className="w-5 h-5 text-white fill-white ml-0.5" />
      </div>
    </div>

    {/* Text with improved letter spacing */}
    <div className="flex flex-col items-start px-2">
      <span className="text-xs font-bold text-purple-400 uppercase tracking-[0.2em] mb-0.5">
        Adventure Awaits
      </span>
      <span className="text-xl font-extrabold text-white tracking-tight">
        START PLAYING
      </span>
    </div>

    {/* Subtle Shine Reflection */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
  </motion.button>
</motion.div>
        </div>

        {/* Features Component */}
        <Features />

        {/* Contact Component */}
        <Contact />

      </main>

      {/* Simple Footer */}
      <footer className="w-full py-10 border-t border-white/5 text-center text-gray-500 text-sm">
        © 2026 Play2Learn. All rights reserved. Built for curious minds.
      </footer>
      <AnimatePresence>
        {isLevelOpen && (
          <Level isOpen={isLevelOpen} onClose={() => setIsLevelOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}