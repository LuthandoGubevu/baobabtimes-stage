import React from "react";
import { 
  PenTool, 
  CheckCircle, 
  XCircle, 
  Layout, 
  Heart, 
  Shield, 
  Globe, 
  FileText,
  Target,
  MessageCircle,
  Zap,
  Users,
  Eye,
  Lock,
  Image as ImageIcon,
  Check,
  X,
  ArrowRight
} from "lucide-react";

/**
 * Editorial Guidelines Page
 * A polished, highly structured guide for all platform contributors.
 */
export default function GuidelinesPage() {
  const sections = [
    {
      id: "purpose",
      title: "1. Purpose of Content",
      icon: Target,
      content: "Every piece of content on The Baobab Times should serve at least one of these goals:",
      items: [
        { title: "Inform", text: "Share essential news, strategy updates, and project progress." },
        { title: "Engage", text: "Foster a sense of community and encourage interaction." },
        { title: "Celebrate", text: "Recognize individual and team achievements." },
        { title: "Align", text: "Ensure everyone understands our mission, vision, and values." }
      ]
    },
    {
      id: "tone",
      title: "2. Tone of Voice",
      icon: MessageCircle,
      content: "Our voice is Human, Professional, and Transparent. We avoid 'corporate-speak' in favor of clear, direct communication.",
      principles: [
        { title: "Be Authentic", text: "Write like a person, not a department." },
        { title: "Be Encouraging", text: "Focus on growth, success, and constructive feedback." },
        { title: "Be Clear", text: "If a ten-year-old wouldn't understand the sentence, simplify it." }
      ],
      comparison: {
        bad: "We are leveraging synergistic paradigms to optimize our vertical integration.",
        good: "We're working together across teams to make our processes faster and simpler."
      }
    },
    {
      id: "style",
      title: "3. Writing Style",
      icon: PenTool,
      content: "Keep your writing accessible and easy to scan.",
      items: [
        { title: "Active Voice", text: "'The team completed the project' is better than 'The project was completed by the team.'" },
        { title: "Short Sentences", text: "Aim for 15–20 words per sentence." },
        { title: "Bullet Points", text: "Use them for lists to improve readability." },
        { title: "No Jargon", text: "Define technical terms if they are necessary, or avoid them entirely." }
      ]
    },
    {
      id: "structure",
      title: "4. Article Structure",
      icon: Layout,
      content: "Follow this standard template for news and culture articles:",
      steps: [
        { title: "Headline", text: "Catchy but accurate (e.g., 'How the Marketing Team Smashed Q1 Targets')." },
        { title: "Lead Paragraph", text: "Summarize the 'Who, What, When, Where, and Why' in 2–3 sentences." },
        { title: "Body", text: "Use subheadings to break up different sections of the story." },
        { title: "Quotes", text: "Include a quote from a team member to add a human element." },
        { title: "Call to Action", text: "End with a question or a link to learn more." }
      ]
    },
    {
      id: "recognition",
      title: "5. Recognition Guidelines",
      icon: Heart,
      content: "Recognitions are the heartbeat of our culture. To make them meaningful:",
      items: [
        { title: "Be Specific", text: "Don't just say 'Good job.' Say 'Thanks for staying late to help me debug the login issue on Tuesday.'" },
        { title: "Connect to Values", text: "Mention which company value (Smart, Innovation, etc.) was demonstrated." },
        { title: "Keep it Timely", text: "Post as soon as possible after the event." }
      ]
    },
    {
      id: "leadership",
      title: "6. CEO & Leadership Content",
      icon: Users,
      content: "Messages from leadership should feel Authentic, Strategic, and Accessible.",
      items: [
        { title: "Strategic Clarity", text: "Explain the 'Why' behind big decisions." },
        { title: "Vulnerability", text: "It's okay to share challenges, not just wins." },
        { title: "Directness", text: "Use 'I' and 'We' to build a personal connection with the organization." }
      ]
    },
    {
      id: "inclusivity",
      title: "7. Inclusivity & Respect",
      icon: Globe,
      content: "We are a global, diverse team. Our language must reflect that.",
      items: [
        { title: "Gender-Neutral", text: "Use 'they/them' or 'team members' instead of 'guys' or 'he/she.'" },
        { title: "Bias-Free", text: "Avoid assumptions based on age, background, or location." },
        { title: "Respectful", text: "Never use language that could be perceived as exclusionary or harmful." }
      ]
    },
    {
      id: "responsibility",
      title: "8. Accuracy & Responsibility",
      icon: Shield,
      content: "Accuracy builds trust. Responsibility protects our community.",
      items: [
        { title: "Fact-Check", text: "Double-check names, dates, and data points before publishing." },
        { title: "Confidentiality", text: "Never share sensitive client data or private financial info that hasn't been cleared for internal release." },
        { title: "Attribution", text: "If you're citing data or a quote, mention the source." }
      ]
    },
    {
      id: "media",
      title: "9. Media & Formatting",
      icon: ImageIcon,
      content: "Visuals and formatting guide the reader's eye.",
      items: [
        { title: "Images", text: "Use high-quality, relevant photos. Real team photos are always better than stock!" },
        { title: "Formatting", text: "Use Bold for emphasis, but don't overdo it. Use Italics for titles." },
        { title: "Links", text: "Ensure all links are active and point to secure (https) internal resources." }
      ]
    },
    {
      id: "process",
      title: "10. Review & Approval",
      icon: Eye,
      content: "Our workflow ensures quality and consistency.",
      steps: [
        { title: "Draft", text: "Create your content in the contributor dashboard." },
        { title: "Review", text: "Admins will review for tone, clarity, and guideline adherence." },
        { title: "Edit", text: "You may be asked to make minor adjustments." },
        { title: "Publish", text: "Once cleared, your content goes live!" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      {/* Hero Header */}
      <div className="bg-stone-900 text-white py-16 md:py-24 px-4 relative overflow-hidden flex flex-col justify-center min-h-[auto]">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-4 md:space-y-6">
          <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-white/10 rounded-2xl backdrop-blur-sm mb-2 md:mb-4">
            <PenTool className="w-6 h-6 md:w-8 md:h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold italic tracking-tight">Editorial Guidelines</h1>
          <p className="text-stone-400 text-base md:text-xl font-light max-w-2xl mx-auto leading-relaxed px-2 md:px-0">
            Crafting the voice of The Baobab Times. A guide to clear, human, and impactful communication.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 lg:-mt-12 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Table of Contents Sidebar */}
          <aside className="lg:col-span-3 hidden lg:block">
            <div className="bg-white rounded-3xl shadow-sm border border-stone-200 p-6 sticky top-24">
              <h2 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-6">Contents</h2>
              <nav className="space-y-1">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-medium text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-all group"
                  >
                    <section.icon size={16} className="text-stone-400 group-hover:text-stone-900" />
                    <span>{section.title.split('. ')[1]}</span>
                  </a>
                ))}
                <a
                  href="#dos-donts"
                  className="flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-medium text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-all group"
                >
                  <CheckCircle size={16} className="text-stone-400 group-hover:text-stone-900" />
                  <span>Do's & Don'ts</span>
                </a>
              </nav>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="lg:col-span-9 space-y-12">
            {sections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-24">
                <div className="bg-white rounded-[2.5rem] shadow-sm border border-stone-200 overflow-hidden">
                  <div className="p-8 sm:p-12 space-y-8">
                    {/* Section Header */}
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-stone-100 rounded-2xl text-stone-900">
                        <section.icon size={24} />
                      </div>
                      <h2 className="text-3xl font-serif font-bold italic">{section.title}</h2>
                    </div>

                    <p className="text-lg text-stone-600 leading-relaxed font-light">
                      {section.content}
                    </p>

                    {/* Section Items */}
                    {section.items && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {section.items.map((item, idx) => (
                          <div key={idx} className="p-6 bg-stone-50 rounded-2xl border border-stone-100 space-y-2">
                            <h3 className="font-bold text-stone-900">{item.title}</h3>
                            <p className="text-sm text-stone-500 leading-relaxed">{item.text}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Section Steps */}
                    {section.steps && (
                      <div className="space-y-4">
                        {section.steps.map((step, idx) => (
                          <div key={idx} className="flex items-start space-x-4 p-4 rounded-2xl hover:bg-stone-50 transition-colors">
                            <div className="w-8 h-8 bg-stone-900 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                              {idx + 1}
                            </div>
                            <div className="space-y-1">
                              <h3 className="font-bold text-stone-900">{step.title}</h3>
                              <p className="text-sm text-stone-500 leading-relaxed">{step.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Section Principles */}
                    {section.principles && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {section.principles.map((p, idx) => (
                            <div key={idx} className="text-center space-y-2">
                              <div className="w-10 h-10 bg-stone-900 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                                <Check size={18} />
                              </div>
                              <h3 className="font-bold text-stone-900">{p.title}</h3>
                              <p className="text-xs text-stone-500 leading-relaxed">{p.text}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Comparison Block */}
                    {section.comparison && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                        <div className="p-6 bg-red-50 rounded-2xl border border-red-100 space-y-3">
                          <div className="flex items-center space-x-2 text-red-600 font-bold text-xs uppercase tracking-widest">
                            <X size={14} />
                            <span>Avoid</span>
                          </div>
                          <p className="text-sm text-red-900 italic font-serif">"{section.comparison.bad}"</p>
                        </div>
                        <div className="p-6 bg-green-50 rounded-2xl border border-green-100 space-y-3">
                          <div className="flex items-center space-x-2 text-green-600 font-bold text-xs uppercase tracking-widest">
                            <Check size={14} />
                            <span>Try</span>
                          </div>
                          <p className="text-sm text-green-900 font-medium">"{section.comparison.good}"</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            ))}

            {/* Do's and Don'ts Section */}
            <section id="dos-donts" className="scroll-mt-24">
              <div className="bg-white rounded-[2.5rem] shadow-sm border border-stone-200 overflow-hidden">
                <div className="p-8 sm:p-12 space-y-8">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-stone-100 rounded-2xl text-stone-900">
                      <CheckCircle size={24} />
                    </div>
                    <h2 className="text-3xl font-serif font-bold italic">11. Do's & Don'ts</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h3 className="text-sm font-bold uppercase tracking-widest text-green-600 flex items-center gap-2">
                        <Check size={16} />
                        Always Do
                      </h3>
                      <ul className="space-y-3">
                        {[
                          "Use real names and tag colleagues",
                          "Share photos of the team in action",
                          "Ask questions to encourage comments",
                          "Keep it positive and constructive"
                        ].map((item, i) => (
                          <li key={i} className="flex items-center space-x-3 text-stone-600 text-sm">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-sm font-bold uppercase tracking-widest text-red-600 flex items-center gap-2">
                        <X size={16} />
                        Please Avoid
                      </h3>
                      <ul className="space-y-3">
                        {[
                          "Use overly technical acronyms",
                          "Post personal grievances or complaints",
                          "Use 'ALL CAPS' for emphasis",
                          "Share unverified rumors"
                        ].map((item, i) => (
                          <li key={i} className="flex items-center space-x-3 text-stone-600 text-sm">
                            <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Examples Section */}
            <section id="examples" className="scroll-mt-24">
              <div className="bg-stone-900 rounded-[2.5rem] shadow-xl p-8 sm:p-12 text-white space-y-10">
                <div className="text-center space-y-4">
                  <h2 className="text-4xl font-serif font-bold italic">12. Examples of Excellence</h2>
                  <p className="text-stone-400 font-light max-w-xl mx-auto">
                    Real-world examples of how to put these guidelines into practice.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-white/5 rounded-3xl p-8 border border-white/10 space-y-4">
                    <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs uppercase tracking-widest">
                      <Heart size={14} />
                      <span>Great Recognition</span>
                    </div>
                    <blockquote className="text-lg font-serif italic text-stone-200 leading-relaxed">
                      "Huge shoutout to <span className="text-white font-bold">Marcus</span> for demonstrating <span className="text-white font-bold">Innovation</span>! He created a new script that saved the dev team 5 hours of manual work every week. This is a massive <span className="text-white font-bold">Impact</span> on our productivity. Thanks, Marcus!"
                    </blockquote>
                  </div>
                  <div className="bg-white/5 rounded-3xl p-8 border border-white/10 space-y-4">
                    <div className="flex items-center space-x-2 text-blue-400 font-bold text-xs uppercase tracking-widest">
                      <FileText size={14} />
                      <span>Great Article Intro</span>
                    </div>
                    <blockquote className="text-lg font-serif italic text-stone-200 leading-relaxed">
                      "Last week, our Customer Success team reached a major milestone: 1,000 resolved tickets with a 98% satisfaction rate. Here’s how they did it, and what we can all learn from their approach to 'Communication first'."
                    </blockquote>
                  </div>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>

      {/* Final CTA */}
      <div className="max-w-4xl mx-auto mt-24 px-4">
        <div className="bg-white rounded-[3rem] p-12 text-center border border-stone-200 shadow-2xl shadow-stone-200/50 space-y-8">
          <div className="w-20 h-20 bg-stone-900 text-white rounded-3xl flex items-center justify-center mx-auto rotate-3 shadow-xl">
            <Zap size={32} />
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-serif font-bold italic">Ready to make an impact?</h2>
            <p className="text-stone-500 max-w-md mx-auto leading-relaxed">
              Your voice matters. Use these guidelines to share your stories and celebrate your colleagues.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="w-full sm:w-auto px-10 py-4 bg-stone-900 text-white font-bold rounded-2xl hover:bg-stone-800 transition-all shadow-lg shadow-stone-200 flex items-center justify-center space-x-2 group">
              <span>Go to Dashboard</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="w-full sm:w-auto px-10 py-4 bg-stone-100 text-stone-900 font-bold rounded-2xl hover:bg-stone-200 transition-all">
              Contact Editors
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
