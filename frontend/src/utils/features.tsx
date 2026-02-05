import { motion } from "framer-motion";
import {
    BarChart3,
    BrainCircuit,
    Gamepad2,
    LineChart,
    Trophy,
    Volume2
} from "lucide-react";

const features = [
    {
        title: "Interactive Gaming",
        desc: "Engaging educational games built with modern web tech to keep kids excited about learning.",
        icon: <Gamepad2 className="w-8 h-8 text-purple-400" />,
    },
    {
        title: "Progressive Levels",
        desc: "Multiple game stages that grow in difficulty, ensuring the challenge always matches the skill.",
        icon: <Trophy className="w-8 h-8 text-yellow-400" />,
    },
    {
        title: "AI Adaptive Learning",
        desc: "Smart logic that adjusts content in real-time based on how your child performs.",
        icon: <BrainCircuit className="w-8 h-8 text-blue-400" />,
    },
    {
        title: "Audio Reinforcement",
        desc: "Crystal clear audio feedback to help master object recognition and perfect pronunciation.",
        icon: <Volume2 className="w-8 h-8 text-green-400" />,
    },
    {
        title: "Smart Tracking",
        desc: "Detailed learning curves and progress reports to visualize educational growth.",
        icon: <LineChart className="w-8 h-8 text-pink-400" />,
    },
    {
        title: "Impact Analysis",
        desc: "Scientifically designed to evaluate and improve the effectiveness of adaptive learning.",
        icon: <BarChart3 className="w-8 h-8 text-orange-400" />,
    },
];

export function Features() {
    return (
        <section className="mt-20 w-full px-6 sm:px-12 lg:px-24 xl:px-32 2xl:px-48 pb-20 overflow-hidden">
            {/* Centered Section Header */}
            <div className="flex flex-col items-center text-center mb-16">
                <motion.h2 
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-3xl sm:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-4"
                >
                    Project Features
                </motion.h2>
                <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: "80px" }}
                    viewport={{ once: true }}
                    className="h-1.5 bg-purple-600 rounded-full mb-6"
                />
                <p className="text-gray-400 text-lg max-w-2xl font-medium">
                    Our core objectives turned into powerful tools to help children learn, 
                    grow, and explore in a digital environment.
                </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-[1400px] mx-auto">
                {features.map((feature, i) => (
                    <motion.div
                        key={i}
                        // Logic: Even cards (0, 2, 4) from left (-100), Odd cards (1, 3, 5) from right (100)
                        initial={{ 
                            opacity: 0, 
                            x: i % 2 === 0 ? -100 : 100 
                        }}
                        whileInView={{ 
                            opacity: 1, 
                            x: 0 
                        }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ 
                            duration: 0.6, 
                            delay: i * 0.1,
                            type: "spring",
                            stiffness: 50
                        }}
                        whileHover={{ 
                            y: -8, 
                            backgroundColor: "rgba(30, 41, 59, 0.6)",
                            transition: { duration: 0.2 } 
                        }}
                        className="bg-slate-900/40 border border-slate-800 p-8 rounded-3xl backdrop-blur-sm hover:border-purple-500/50 transition-all group"
                    >
                        <div className="mb-4 p-4 bg-slate-800/50 w-fit rounded-2xl group-hover:scale-110 group-hover:bg-purple-500/10 transition-all duration-300">
                            {feature.icon}
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">
                            {feature.title}
                        </h3>
                        <p className="text-gray-400 leading-relaxed text-sm sm:text-base">
                            {feature.desc}
                        </p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}