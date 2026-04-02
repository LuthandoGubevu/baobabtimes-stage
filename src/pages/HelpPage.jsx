import React, { useState } from "react";
import { 
  Search, 
  BookOpen, 
  Award, 
  Newspaper, 
  MessageSquare, 
  Bell, 
  User, 
  HelpCircle, 
  ChevronRight,
  ChevronDown,
  Info,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "motion/react";

const helpContent = [
  {
    id: "getting-started",
    title: "Getting Started",
    icon: BookOpen,
    articles: [
      {
        title: "Welcome to The Baobab Times",
        description: "Your new digital home for everything happening at the company. Learn about the platform's mission and how it brings us together.",
        content: `
Welcome to **The Baobab Times**! This platform is designed to be our unified modern internal media and communication hub. Here, we reimagine company engagement through editorial excellence.

Our goal is to:
*   **Inform**: Keep you updated with company news and strategy.
*   **Engage**: Provide a space for recognition and direct communication with leadership.
*   **Connect**: Build a stronger culture by sharing our stories and values.

Take a moment to explore the different sections and see how you can contribute to our growing community.
        `
      },
      {
        title: "Navigating the Platform",
        description: "A quick guide to finding your way around the different sections of the platform.",
        content: `
Finding your way around is easy! Use the main navigation bar at the top to access:
1.  **Home**: Your personalized feed of the latest news and recognitions.
2.  **Articles**: The full archive of company news, strategy, and culture pieces.
3.  **Recognition**: The wall where we celebrate each other's achievements.
4.  **Ask the CEO**: Your direct line to leadership for questions and feedback.

On mobile, you can access these via the menu icon in the top right corner.
        `
      },
      {
        title: "Understanding Your Role",
        description: "How your access level affects what you see and do on the platform.",
        content: `
The Baobab Times uses role-based access to ensure everyone has the tools they need:

*   **Employees**: Can view all content, post recognitions, react to articles, and submit questions to the CEO.
*   **Admin**: In addition to employee features, Admins can manage articles, moderate content, and access the system dashboard.
*   **CEO**: Has full access, including the ability to publish "From the CEO" messages and respond directly to employee questions.

If you believe your role is incorrect, please contact the Internal Comms team.
        `
      }
    ]
  },
  {
    id: "recognitions",
    title: "Recognitions",
    icon: Award,
    articles: [
      {
        title: "How to Post a Recognition",
        description: "Celebrate your colleagues' hard work and contributions in just a few clicks.",
        content: `
Recognizing a colleague is a great way to build a positive culture. Here's how:

1.  Navigate to the **Recognition** page.
2.  Click the **"Post Recognition"** button.
3.  Enter the name of the person you want to recognize.
4.  Select the **Company Value** they demonstrated.
5.  Write a short message explaining why you're recognizing them.
6.  Click **"Post Recognition"** to share it on the wall!

Your recognition will be visible to everyone in the company, allowing others to add their support with reactions.
        `
      },
      {
        title: "Understanding Our Company Values",
        description: "Learn what each of our core values means and how to spot them in action.",
        content: `
When posting a recognition, you'll be asked to link it to one of our core values:

*   **Smart**: Demonstrating deep expertise, critical thinking, or solving complex problems with elegant solutions.
*   **Communication**: Ensuring clarity, transparency, and effective sharing of information across teams.
*   **Impact**: Making a measurable difference in our goals, projects, or the lives of our customers.
*   **Innovation**: Challenging the status quo, bringing new ideas to life, and finding better ways to work.

By aligning recognitions with these values, we reinforce what makes our culture special.
        `
      },
      {
        title: "Viewing the Recognition Wall",
        description: "Stay inspired by seeing the great work happening across the entire organization.",
        content: `
The **Recognition Wall** is a live feed of all the appreciation being shared across the company. 

*   **Browse**: Scroll through the feed to see recent recognitions.
*   **React**: Use the "Like" button to show your support for a colleague's achievement.
*   **Filter**: You can often filter by department or value to see specific types of recognition.

It's a great place to visit when you need a boost of positivity or want to see who's making a big impact!
        `
      }
    ]
  },
  {
    id: "articles",
    title: "Articles & From the CEO",
    icon: Newspaper,
    articles: [
      {
        title: "Reading Company News",
        description: "Stay informed with the latest updates on strategy, culture, and projects.",
        content: `
Our **Articles** section is the heart of our internal journalism. You'll find:
*   **Strategy Updates**: Deep dives into our goals and progress.
*   **Culture Stories**: Spotlights on our people and internal initiatives.
*   **Project News**: Updates on the exciting work happening across different teams.

Click on any article card to read the full story. You can also see who wrote the piece and when it was published.
        `
      },
      {
        title: "What is 'From the CEO'?",
        description: "Exclusive insights and messages delivered directly from our leadership team.",
        content: `
**"From the CEO"** is a special section reserved for high-level messages directly from our leadership. These pieces often cover:
*   Quarterly reflections and future outlooks.
*   Important organizational changes.
*   Personal thoughts on our mission and values.

These messages are designed to provide transparency and ensure everyone is aligned with our top-level vision.
        `
      },
      {
        title: "Sharing and Saving Articles",
        description: "How to keep track of important news and share interesting stories with your team.",
        content: `
Found an article you want to come back to? 
*   **Bookmark**: Look for the bookmark icon on article cards to save them to your personal list (coming soon!).
*   **Share**: You can copy the URL of any article to share it with colleagues via Slack, Teams, or email.
*   **React**: Don't forget to leave a reaction to let the author know you found the content valuable!
        `
      }
    ]
  },
  {
    id: "ask-ceo",
    title: "Ask the CEO",
    icon: MessageSquare,
    articles: [
      {
        title: "How to Ask a Question",
        description: "Direct communication with our CEO. Share your thoughts, concerns, or curiosity.",
        content: `
We believe in radical transparency. The **Ask the CEO** feature allows you to submit questions directly to leadership.

1.  Go to the **Ask the CEO** page.
2.  Type your question into the submission box.
3.  Click **"Send Question"**.

Your question will be sent to our moderation team first to ensure it follows our community guidelines before being passed to the CEO.
        `
      },
      {
        title: "The Moderation Process",
        description: "What happens after you hit send on a question to the CEO.",
        content: `
To maintain a productive and respectful environment, all questions go through a brief moderation step:
1.  **Review**: A small team checks the question for professional tone and relevance.
2.  **Approval**: Once approved, the question is added to the CEO's queue.
3.  **Response**: The CEO reviews the queue and provides a written response.

We aim to process all questions within a few business days. If a question is rejected, you'll receive a notification explaining why.
        `
      },
      {
        title: "Viewing CEO Responses",
        description: "Where to find the answers to the questions you and your colleagues have asked.",
        content: `
All answered questions are displayed on the **Ask the CEO** page.
*   **Public Feed**: Most questions and answers are visible to everyone to ensure transparency.
*   **Search**: You can search through past questions to see if your topic has already been addressed.
*   **Notifications**: If you asked a question, you'll get an alert as soon as the CEO responds.
        `
      }
    ]
  },
  {
    id: "engagement",
    title: "Notifications & Engagement",
    icon: Bell,
    articles: [
      {
        title: "How Notifications Work",
        description: "Never miss an important update with our real-time alert system.",
        content: `
Notifications keep you in the loop without you having to constantly check the platform. You'll get alerts for:
*   **New Articles**: When a major news piece is published.
*   **CEO Messages**: When a new "From the CEO" post goes live.
*   **Recognitions**: When someone recognizes you or reacts to your posts.
*   **AMA Answers**: When a question you asked or followed is answered.

Click the bell icon in the top navigation to see your recent activity.
        `
      },
      {
        title: "Reacting to Content",
        description: "Use likes and reactions to show your support and provide quick feedback.",
        content: `
Engagement makes the platform come alive! You can react to almost any piece of content:
*   **Articles**: Like a story to show you've read it and found it useful.
*   **Recognitions**: Add a "Like" to join in celebrating a colleague's success.
*   **CEO Messages**: Show your support for leadership updates.

Reactions are a quick, low-pressure way to participate in the company conversation.
        `
      }
    ]
  },
  {
    id: "account",
    title: "Account & Profile",
    icon: User,
    articles: [
      {
        title: "Updating Your Profile",
        description: "Keep your information current so colleagues can easily find and recognize you.",
        content: `
Your profile helps others know who you are and what you do. To update it:
1.  Click on your profile picture in the top right.
2.  Select **"Settings"**.
3.  Under the **"Profile"** tab, you can update your display name, job title, and department.
4.  Click **"Save Changes"**.

Keeping this info accurate ensures that recognitions are sent to the right person!
        `
      },
      {
        title: "Changing Your Avatar",
        description: "Personalize your presence on the platform with a profile photo.",
        content: `
A photo makes the platform feel more human. To change your avatar:
1.  Go to **Settings > Profile**.
2.  Click on your current avatar or the "Upload" button.
3.  Select a clear, professional photo from your device.
4.  Adjust the crop if necessary and save.

If you don't upload a photo, the system will use a default icon with your initials.
        `
      }
    ]
  },
  {
    id: "faqs",
    title: "FAQs",
    icon: HelpCircle,
    articles: [
      {
        title: "Frequently Asked Questions",
        description: "Quick answers to the most common questions about The Baobab Times.",
        content: `
**Q: Why can’t I access the dashboard?**
A: The dashboard is reserved for Admins and the CEO to manage content and system settings. Standard employee accounts do not have access to these administrative tools.

**Q: Can I edit a recognition after posting?**
A: Currently, recognitions cannot be edited once posted to ensure the integrity of the wall. If you made a major error, please contact an Admin to have it removed so you can repost.

**Q: Who can see my posts?**
A: The Baobab Times is an internal platform. All articles, recognitions, and CEO questions are visible to all employees of the company, but not to the public.

**Q: Why hasn’t my question been answered?**
A: The CEO receives many questions and aims to answer them as thoughtfully as possible. Some questions may take longer to research, or they may be currently in the moderation queue.

**Q: Can I post anonymously?**
A: To encourage a culture of accountability and transparency, most features require your name. However, some specific surveys or feedback tools may allow for anonymity when explicitly stated.

**Q: How do I report inappropriate content?**
A: If you see something that violates our community guidelines, please click the "Report" flag (if available) or email the Internal Comms team directly.

**Q: Can I delete my account?**
A: Account management is handled through the company's central identity system. If you are leaving the company, your account will be deactivated automatically.

**Q: Is my data secure?**
A: Yes. We use industry-standard encryption and secure cloud providers (Firebase) to ensure your data is protected and only accessible to authorized internal personnel.

**Q: How do I search for articles?**
A: Use the search bar in the top navigation of the dashboard or the main Articles page to find content by keyword, author, or category.

**Q: Can I use the platform on mobile?**
A: Absolutely! The Baobab Times is fully responsive and works great on smartphone and tablet browsers.
        `
      }
    ]
  },
  {
    id: "best-practices",
    title: "Best Practices",
    icon: CheckCircle2,
    articles: [
      {
        title: "Writing Meaningful Recognitions",
        description: "Tips for making your appreciation more impactful and memorable.",
        content: `
A great recognition is specific and timely. Try these tips:
*   **Be Specific**: Instead of "Great job," try "Great job leading the client presentation and handling those tough questions."
*   **Link to Values**: Explain *how* they demonstrated the value. "Sarah showed Innovation by finding a way to automate our weekly reporting."
*   **Don't Wait**: Post your recognition as soon as possible after the event while the details are fresh.
        `
      },
      {
        title: "Professional Communication Tips",
        description: "How to maintain a positive and productive tone across the platform.",
        content: `
The Baobab Times is a professional space. Keep these guidelines in mind:
*   **Be Constructive**: When asking questions or providing feedback, focus on solutions and growth.
*   **Be Respectful**: Treat every colleague with the same respect you would in a face-to-face meeting.
*   **Check Your Tone**: Without body language, text can sometimes be misinterpreted. Read your post once more before hitting send to ensure it sounds the way you intended.
        `
      },
      {
        title: "Platform Do's and Don'ts",
        description: "A quick summary of how to be a great citizen of The Baobab Times.",
        content: `
**Do:**
*   Celebrate your colleagues often.
*   Stay informed by reading weekly updates.
*   Ask thoughtful questions that help the whole company.
*   Keep your profile information up to date.

**Don't:**
*   Share confidential client data on the public wall.
*   Use the platform for personal grievances.
*   Post spam or low-effort content.
*   Impersonate other team members.
        `
      }
    ]
  }
];

export default function HelpPage() {
  const [activeSection, setActiveSection] = useState(helpContent[0].id);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedArticle, setExpandedArticle] = useState(null);

  const filteredContent = helpContent.map(section => ({
    ...section,
    articles: section.articles.filter(article => 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(section => section.articles.length > 0);

  const currentSection = helpContent.find(s => s.id === activeSection);

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      {/* Hero Section */}
      <div className="bg-stone-900 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h1 className="text-5xl font-serif font-bold italic">How can we help?</h1>
            <p className="text-stone-400 text-lg font-light max-w-2xl mx-auto">
              Find answers, learn about features, and discover how to get the most out of The Baobab Times.
            </p>
          </motion.div>

          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500" size={20} />
            <input 
              type="text"
              placeholder="Search for articles, features, or FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/10 rounded-2xl text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-3">
            <div className="bg-white rounded-3xl shadow-sm border border-stone-200 p-4 sticky top-24">
              <h2 className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">Sections</h2>
              <nav className="space-y-1">
                {helpContent.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => {
                      setActiveSection(section.id);
                      setSearchQuery("");
                      setExpandedArticle(null);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      activeSection === section.id && !searchQuery
                        ? "bg-stone-900 text-white shadow-lg shadow-stone-200"
                        : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"
                    }`}
                  >
                    <section.icon size={18} />
                    <span>{section.title}</span>
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="lg:col-span-9 space-y-6">
            {searchQuery ? (
              <div className="space-y-6">
                <h2 className="text-2xl font-serif font-bold italic">Search Results for "{searchQuery}"</h2>
                {filteredContent.length > 0 ? (
                  filteredContent.map(section => (
                    <div key={section.id} className="space-y-4">
                      <h3 className="text-sm font-bold uppercase tracking-widest text-stone-400 flex items-center gap-2">
                        <section.icon size={14} />
                        {section.title}
                      </h3>
                      <div className="grid gap-4">
                        {section.articles.map((article, idx) => (
                          <ArticleCard 
                            key={idx} 
                            article={article} 
                            isExpanded={expandedArticle === `${section.id}-${idx}`}
                            onToggle={() => setExpandedArticle(expandedArticle === `${section.id}-${idx}` ? null : `${section.id}-${idx}`)}
                          />
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white rounded-3xl p-12 text-center border border-stone-200">
                    <AlertCircle className="w-12 h-12 text-stone-300 mx-auto mb-4" />
                    <p className="text-stone-500">No articles found matching your search.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center space-x-4 mb-2">
                  <div className="p-3 bg-stone-900 text-white rounded-2xl shadow-lg">
                    {currentSection && <currentSection.icon size={24} />}
                  </div>
                  <h2 className="text-3xl font-serif font-bold italic">{currentSection?.title}</h2>
                </div>
                
                <div className="grid gap-4">
                  {currentSection?.articles.map((article, idx) => (
                    <ArticleCard 
                      key={idx} 
                      article={article} 
                      isExpanded={expandedArticle === idx}
                      onToggle={() => setExpandedArticle(expandedArticle === idx ? null : idx)}
                    />
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="max-w-4xl mx-auto mt-20 px-4">
        <div className="bg-amber-50 border border-amber-100 rounded-3xl p-8 text-center space-y-4">
          <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto">
            <Info size={24} />
          </div>
          <h3 className="text-xl font-serif font-bold">Still need help?</h3>
          <p className="text-stone-600 max-w-md mx-auto">
            If you couldn't find what you were looking for, our Internal Comms team is here to support you.
          </p>
          <button className="px-8 py-3 bg-stone-900 text-white font-bold rounded-xl hover:bg-stone-800 transition-colors">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}

function ArticleCard({ article, isExpanded, onToggle }) {
  return (
    <div className={`bg-white rounded-3xl border transition-all duration-300 ${
      isExpanded ? "border-stone-900 shadow-xl" : "border-stone-200 hover:border-stone-400 shadow-sm"
    }`}>
      <button 
        onClick={onToggle}
        className="w-full text-left p-6 sm:p-8 flex items-start justify-between group"
      >
        <div className="space-y-2 flex-1 pr-8">
          <h3 className={`text-xl font-serif font-bold transition-colors ${
            isExpanded ? "text-stone-900" : "text-stone-700 group-hover:text-stone-900"
          }`}>
            {article.title}
          </h3>
          {!isExpanded && (
            <p className="text-stone-500 font-light line-clamp-2">{article.description}</p>
          )}
        </div>
        <div className={`mt-1 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}>
          <ChevronDown className="text-stone-400" size={20} />
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-6 sm:px-8 pb-8 pt-2 border-t border-stone-100">
              <div className="prose prose-stone max-w-none prose-p:text-stone-600 prose-li:text-stone-600 prose-strong:text-stone-900">
                <ReactMarkdown>{article.content}</ReactMarkdown>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
