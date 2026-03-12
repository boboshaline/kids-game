"use client";

import { Button } from "@/components/ui/button";
import emailjs from "@emailjs/browser";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Github, Linkedin, Mail, MapPin, Phone, Send, Twitter } from "lucide-react";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export function Contact() {
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic Validation
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill all fields.");
      return;
    }

    setLoading(true);

    try {
      // Configuration IDs
      const SERVICE_ID = "service_c2b3t0d";
      const TEMPLATE_ID = "template_6446two";
      const PUBLIC_KEY = "acdIbBu_BH4V54EPG";

      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        message: formData.message,
        to_email: "shalinewambui04@gmail.com", // Ensure this variable exists in your EmailJS template
      };

      await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);

      toast.success("Message sent successfully!");
      setIsSubmitted(true);
      setFormData({ name: "", email: "", message: "" });
      
      // Reset success state after 5 seconds to show form again
      setTimeout(() => setIsSubmitted(false), 5000);

    } catch (err: any) {
      console.error("EmailJS Full Error:", err);
      
      // Specific error handling for "Failed to Fetch" (usually ad-blockers)
      if (err.status === 0 || err.name === "TypeError") {
        toast.error("Network Error: Please disable ad-blockers and check your connection.");
      } else {
        toast.error("Failed to send message. Please verify Service/Template IDs.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="relative mt-20 w-full px-6 sm:px-12 lg:px-24 xl:px-32 2xl:px-48 pb-32 overflow-hidden font-['Quicksand']">
      
      <Toaster position="top-right" reverseOrder={false} />

      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full -z-10" />

      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col items-center text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-5xl font-black bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-4 tracking-tighter"
          >
            Get In Touch
          </motion.h2>
          <p className="text-gray-400 text-lg max-w-xl font-medium">
            Have questions about Play2Learn? We'd love to hear from you. 
            Drop us a message and let's start a conversation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
          
          {/* Left Side: Contact Info */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex"
          >
            <div className="bg-slate-900/40 border border-white/10 p-8 rounded-[2rem] backdrop-blur-md w-full flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-black text-white mb-8 tracking-tight">Contact Information</h3>
                
                <div className="space-y-6">
                  <div className="flex items-center gap-4 group">
                    <div className="p-4 bg-purple-500/10 rounded-2xl group-hover:bg-purple-500/20 transition-all">
                      <Mail className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-xs uppercase font-black tracking-widest text-purple-400/60">Email us</p>
                      <p className="text-white font-bold">hello@play2learn.com</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 group">
                    <div className="p-4 bg-pink-500/10 rounded-2xl group-hover:bg-pink-500/20 transition-all">
                      <Phone className="w-6 h-6 text-pink-400" />
                    </div>
                    <div>
                      <p className="text-xs uppercase font-black tracking-widest text-pink-400/60">Call us</p>
                      <p className="text-white font-bold">+254 700 000 000</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 group">
                    <div className="p-4 bg-blue-500/10 rounded-2xl group-hover:bg-blue-500/20 transition-all">
                      <MapPin className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-xs uppercase font-black tracking-widest text-blue-400/60">Visit us</p>
                      <p className="text-white font-bold leading-tight">Innovation Hub, Eldoret, Kenya</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Socials */}
              <div className="mt-12 pt-8 border-t border-white/5 flex gap-4">
                {[Github, Twitter, Linkedin].map((Icon, idx) => (
                  <motion.a
                    key={idx}
                    href="#"
                    whileHover={{ y: -5, backgroundColor: "rgba(168, 85, 247, 0.2)" }}
                    className="p-4 bg-white/5 rounded-2xl text-gray-400 hover:text-white transition-all border border-white/5"
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Side: Form / Success State */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-slate-900/40 border border-white/10 p-8 rounded-[2rem] backdrop-blur-md relative overflow-hidden"
          >
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.form 
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="space-y-5" 
                  onSubmit={handleSubmit}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1">Name</label>
                      <input 
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your Name"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all placeholder:text-gray-600 font-bold"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1">Email</label>
                      <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="email@example.com"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all placeholder:text-gray-600 font-bold"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1">Message</label>
                    <textarea 
                      name="message"
                      rows={5} 
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us what's on your mind..."
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all resize-none placeholder:text-gray-600 font-bold"
                    ></textarea>
                  </div>

                  <motion.div whileTap={{ scale: 0.98 }}>
                    <Button 
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-black py-7 rounded-2xl shadow-xl shadow-purple-500/20 flex items-center justify-center gap-3 border-none text-lg transition-all"
                    >
                      {loading ? "SENDING..." : "SEND MESSAGE"}
                      <Send className={`w-5 h-5 ${loading ? 'animate-ping' : ''}`} />
                    </Button>
                  </motion.div>
                </motion.form>
              ) : (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center py-10"
                >
                  <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                  </div>
                  <h3 className="text-3xl font-black text-white mb-2">Message Sent!</h3>
                  <p className="text-gray-400 font-medium">Thank you for reaching out. <br/> We'll get back to you shortly.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

        </div>
      </div>
    </section>
  );
}