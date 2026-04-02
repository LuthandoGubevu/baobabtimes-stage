import React, { useState } from "react";
import { Mail, Phone, MapPin, MessageSquare, Globe, Users, X, Send, Loader2 } from "lucide-react";
import { db, auth } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";

/**
 * ContactPage component displaying the Internal Comms Team contact details.
 */
export default function ContactPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "TEAM_MILESTONE"
  });

  const team = [
    {
      name: "Harvey de Wit",
      role: "People Executive",
      cell: "+27 71 682 0890",
      tel: "+27 43 004 0071",
      email: "harvey@baobabbrands.com",
      image: "https://picsum.photos/seed/harvey/400/400"
    },
    {
      name: "Shayna Elcott",
      role: "Creative Director & Internal Communications",
      cell: "+27 83 546 8542",
      tel: "+27 43 004 0071",
      email: "shayna@baobabbrands.com",
      image: "https://picsum.photos/seed/shayna/400/400"
    },
    {
      name: "Roslyn Goldsmith",
      role: "Principal Staff Officer",
      cell: "+27 83 679 9305",
      tel: "+27 43 004 0071",
      email: "roslyn@baobabbrands.com",
      image: "https://picsum.photos/seed/roslyn/400/400"
    }
  ];

  const officeAddress = "Baobab House, Triple Point, St Helena Road, Beacon Bay, East London, South Africa";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) {
      toast.error("Please log in to submit a story idea.");
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "story_ideas"), {
        ...formData,
        authorId: auth.currentUser.uid,
        authorName: auth.currentUser.displayName || "Anonymous",
        authorEmail: auth.currentUser.email,
        status: "PENDING",
        createdAt: serverTimestamp()
      });
      toast.success("Story idea submitted successfully! Our team will review it soon.");
      setIsModalOpen(false);
      setFormData({ title: "", description: "", category: "TEAM_MILESTONE" });
    } catch (error) {
      console.error("Error submitting story idea:", error);
      toast.error("Failed to submit story idea. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      {/* Hero Section */}
      <div className="bg-stone-900 text-white py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl backdrop-blur-sm mb-4">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-serif font-bold italic tracking-tight">Internal Comms Team</h1>
          <p className="text-stone-400 text-xl font-light max-w-2xl mx-auto leading-relaxed">
            Meet the voices behind The Baobab Times. We're here to help you share your stories and stay connected.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12">
        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {team.map((member, idx) => (
            <div key={idx} className="bg-white rounded-[2.5rem] shadow-sm border border-stone-200 overflow-hidden group hover:shadow-xl transition-all duration-500">
              <div className="aspect-square overflow-hidden relative">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                  <p className="text-white text-sm font-medium italic">"Always here to help."</p>
                </div>
              </div>
              <div className="p-8 space-y-6">
                <div>
                  <h3 className="text-2xl font-serif font-bold italic text-stone-900">{member.name}</h3>
                  <p className="text-stone-500 font-medium text-sm uppercase tracking-widest mt-1">{member.role}</p>
                </div>

                <div className="space-y-3">
                  <a href={`mailto:${member.email}`} className="flex items-center space-x-3 text-stone-600 hover:text-stone-900 transition-colors group/link">
                    <div className="p-2 bg-stone-50 rounded-lg group-hover/link:bg-stone-100 transition-colors">
                      <Mail size={16} />
                    </div>
                    <span className="text-sm">{member.email}</span>
                  </a>
                  <div className="flex items-center space-x-3 text-stone-600">
                    <div className="p-2 bg-stone-50 rounded-lg">
                      <Phone size={16} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold uppercase tracking-tighter text-stone-400">Cell</span>
                      <span className="text-sm">{member.cell}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 text-stone-600">
                    <div className="p-2 bg-stone-50 rounded-lg">
                      <Phone size={16} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold uppercase tracking-tighter text-stone-400">Tel</span>
                      <span className="text-sm">{member.tel}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Office Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-[2.5rem] p-12 border border-stone-200 shadow-sm space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-serif font-bold italic">Our Office</h2>
              <p className="text-stone-500 font-light leading-relaxed">
                Visit us at our headquarters in East London. We're always open for a coffee and a chat about your next big story.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-stone-900 text-white rounded-2xl shadow-lg">
                  <MapPin size={24} />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-stone-900">Headquarters</h3>
                  <p className="text-stone-500 text-sm leading-relaxed max-w-xs">
                    {officeAddress}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-3 bg-stone-100 text-stone-900 rounded-2xl">
                  <Globe size={24} />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-stone-900">Regions</h3>
                  <p className="text-stone-500 text-sm leading-relaxed">
                    South Africa | Lesotho | Botswana | Namibia | Côte d'Ivoire
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-stone-900 rounded-[2.5rem] p-12 text-white flex flex-col justify-center space-y-8 shadow-xl">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                <MessageSquare className="text-white" size={24} />
              </div>
              <h2 className="text-3xl font-serif font-bold italic">Have a story to share?</h2>
              <p className="text-stone-400 font-light leading-relaxed">
                Whether it's a team milestone, an innovative project, or a recognition for a colleague, we want to hear about it.
              </p>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto px-10 py-4 bg-white text-stone-900 font-bold rounded-2xl hover:bg-stone-100 transition-all shadow-lg flex items-center justify-center space-x-2 group"
            >
              <span>Submit a Story Idea</span>
            </button>
          </div>
        </div>
      </div>

      {/* Submission Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 sm:p-12 space-y-8">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <h2 className="text-3xl font-serif font-bold italic text-stone-900">Share Your Idea</h2>
                    <p className="text-stone-500 text-sm">Tell us about something great happening in your world.</p>
                  </div>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 hover:bg-stone-100 rounded-full transition-colors"
                  >
                    <X size={24} className="text-stone-400" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-stone-400">Category</label>
                    <select 
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-stone-900 transition-all"
                    >
                      <option value="TEAM_MILESTONE">Team Milestone</option>
                      <option value="INNOVATIVE_PROJECT">Innovative Project</option>
                      <option value="RECOGNITION">Recognition Spotlight</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-stone-400">Title</label>
                    <input 
                      required
                      type="text"
                      placeholder="What's the headline?"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-stone-900 transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-stone-400">Description</label>
                    <textarea 
                      required
                      rows={4}
                      placeholder="Give us the details..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-stone-900 transition-all resize-none"
                    />
                  </div>

                  <button 
                    disabled={isSubmitting}
                    type="submit"
                    className="w-full py-5 bg-stone-900 text-white font-bold rounded-2xl hover:bg-stone-800 transition-all shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <>
                        <span>Submit Idea</span>
                        <Send size={18} />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
