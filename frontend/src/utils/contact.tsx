import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail, MapPin, Phone, Send, Twitter } from "lucide-react";

export function Contact() {
  return (
    <section id="contact" className="relative mt-20 w-full px-6 sm:px-12 lg:px-24 xl:px-32 2xl:px-48 pb-32 overflow-hidden">
      
      {/* Background Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full -z-10" />

      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col items-center text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-4"
          >
            Get In Touch
          </motion.h2>
          <p className="text-gray-400 text-lg max-w-xl">
            Have questions about Play2Learn? We'd love to hear from you. 
            Drop us a message and let's start a conversation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Left Side: Contact Information */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-3xl backdrop-blur-md">
              <h3 className="text-2xl font-bold text-white mb-6">Contact Information</h3>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4 group">
                  <div className="p-3 bg-purple-500/10 rounded-2xl group-hover:bg-purple-500/20 transition-colors">
                    <Mail className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Email us at</p>
                    <p className="text-white font-medium">hello@play2learn.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 group">
                  <div className="p-3 bg-pink-500/10 rounded-2xl group-hover:bg-pink-500/20 transition-colors">
                    <Phone className="w-6 h-6 text-pink-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Call us</p>
                    <p className="text-white font-medium">+254 700 000 000</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 group">
                  <div className="p-3 bg-blue-500/10 rounded-2xl group-hover:bg-blue-500/20 transition-colors">
                    <MapPin className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Visit us</p>
                    <p className="text-white font-medium">Innovation Hub, Moi University, Eldoret</p>
                  </div>
                </div>
              </div>

              {/* Socials */}
              <div className="mt-10 pt-8 border-t border-slate-800 flex gap-4">
                {[Github, Twitter, Linkedin].map((Icon, idx) => (
                  <motion.a
                    key={idx}
                    href="#"
                    whileHover={{ y: -3 }}
                    className="p-3 bg-slate-800/50 rounded-xl text-gray-400 hover:text-purple-400 transition-colors"
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Side: Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-slate-900/40 border border-slate-800 p-8 rounded-3xl backdrop-blur-md"
          >
            <form className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-gray-400 ml-1">Name</label>
                  <input 
                    type="text" 
                    placeholder="John Doe"
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-400 ml-1">Email</label>
                  <input 
                    type="email" 
                    placeholder="john@example.com"
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm text-gray-400 ml-1">Message</label>
                <textarea 
                  rows={4} 
                  placeholder="How can we help you?"
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all resize-none"
                ></textarea>
              </div>

              <motion.div whileTap={{ scale: 0.95 }}>
                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-6 rounded-xl shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2 border-none">
                  Send Message
                  <Send className="w-4 h-4" />
                </Button>
              </motion.div>
            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
}