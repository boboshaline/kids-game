"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    question: "Is Play2Learn safe for kids?",
    answer:
      "Absolutely! We prioritize safety above all. The platform is a closed, curated environment with zero external ads, no data tracking, and no external social media links.",
  },
  {
    question: "Is the platform completely free?",
    answer:
      "Yes, Play2Learn is 100% free. We believe every curious mind deserves an equal opportunity to explore, play, and grow without paywalls.",
  },
  {
    question: "What age range is this optimized for?",
    answer:
      "Our content is crafted for children aged 3–8. The interface is simple, tactile, and focuses on cognitive development through pattern recognition.",
  },
  {
    question: "Can I use this on a tablet or phone?",
    answer:
      "Yes! Play2Learn is fully responsive and touch-optimized, making it perfect for tablets and touch-screen monitors.",
  },
];

export function FAQ() {
  const [openItem, setOpenItem] = useState<string | null>(null);

  return (
    <section className="relative py-32 px-6 overflow-hidden">

      {/* Background glow */}
      <div className="absolute -top-40 left-0 w-[500px] h-[500px] bg-purple-500/20 blur-[220px] rounded-full" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-pink-400/20 blur-[240px] rounded-full" />

      <div className="max-w-4xl mx-auto relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24"
        >
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 mb-8 font-bold tracking-wide">
            <HelpCircle className="w-5 h-5" />
            Got Questions?
          </div>

          <h2 className="text-5xl sm:text-6xl font-extrabold leading-tight">
            Everything you need
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500">
              to know
            </span>
          </h2>
        </motion.div>

        {/* Accordion */}
        <Accordion
          type="single"
          collapsible
          className="space-y-8"
          onValueChange={(val) => setOpenItem(val)}
        >
          {faqs.map((faq, index) => {
            const value = `item-${index}`;
            const isOpen = openItem === value;

            return (
              <motion.div
                key={value}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.12 }}
              >
                <AccordionItem
                  value={value}
                  className="relative group rounded-3xl overflow-hidden border border-white/10 backdrop-blur-lg bg-slate-900/50"
                >

                  {/* animated gradient border */}
                  <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-r from-purple-500/30 via-pink-400/30 to-purple-500/30 blur-xl" />

                  <AccordionTrigger
                    className="relative px-10 py-8 text-left flex justify-between items-center text-xl sm:text-2xl font-extrabold text-white hover:no-underline"
                  >
                    {faq.question}

                    <motion.div
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="ml-6 w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-2xl font-bold shadow-lg"
                    >
                      +
                    </motion.div>
                  </AccordionTrigger>

                  <AccordionContent className="px-10 pb-10">
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : -10 }}
                      transition={{ duration: 0.3 }}
                      className="text-lg sm:text-xl text-gray-300 leading-relaxed"
                    >
                      {faq.answer}
                    </motion.div>
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            );
          })}
        </Accordion>
      </div>
    </section>
  );
}