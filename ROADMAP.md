# The Baobab Times: MVP Implementation Roadmap

This roadmap outlines a 3-phase execution plan to build and deploy **The Baobab Times**, focusing on delivering immediate value through core editorial features before expanding into social engagement and leadership dialogue.

---

## Phase 1: Core Foundation & Editorial (Weeks 1-2)
**Goal:** Establish the "Read" experience. Enable the company to publish news and employees to consume it.

### 🏗️ Infrastructure
- [x] Backend Module Architecture (Express + Prisma)
- [x] Database Schema Design (PostgreSQL)
- [x] Basic Auth Mock & Role-based routing

### 📰 Editorial Features
- **Article Feed:** Responsive grid/list view of published articles.
- **Article Detail:** Full-page reading experience with rich text support.
- **Contributor Dashboard:** Simple interface for authors to create and edit drafts.
- **Category Management:** Filter news by department (HR, Tech, Operations).

---

## Phase 2: Social Engagement & Recognition (Weeks 3-4)
**Goal:** Foster a culture of appreciation and increase daily active users through peer-to-peer interaction.

### 🌟 Peer Recognition
- **Recognition Feed:** A live "Wall of Fame" showing approved shout-outs.
- **Submission Flow:** Easy-to-use modal for nominating colleagues with specific categories (Innovation, Teamwork).
- **Admin Moderation:** A dedicated queue for Admins to approve/reject recognitions before they go public.

### 📈 Engagement Analytics
- **View Tracking:** Real-time view counts on articles.
- **Featured Content:** Ability for editors to "pin" critical global updates to the top of the feed.
- **User Profiles:** Basic directory showing a user's contributions and recognitions received.

---

## Phase 3: Leadership Dialogue & Refinement (Weeks 5-6)
**Goal:** Bridge the gap between leadership and employees while hardening the platform for scale.

### 🎤 CEO AMA (Ask Me Anything)
- **Question Portal:** Anonymous (or identified) question submission for the CEO.
- **Leadership Dashboard:** Private interface for the CEO/Leadership to review moderated questions and post answers.
- **Q&A Archive:** A searchable repository of past leadership responses.

### 🛡️ Platform Hardening
- **Soft Delete Implementation:** UI support for archiving content without permanent loss.
- **Audit Logging:** Visible history of article edits and moderation actions for Admins.
- **Advanced Search:** Global search across articles, recognitions, and Q&A.
- **Performance Optimization:** Image lazy loading and database indexing for high-traffic news days.
