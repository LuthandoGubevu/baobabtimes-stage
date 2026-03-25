# The Baobab Times: Dashboard Technical Specification

This document details the implementation plan for the **Editorial & Engagement Operations Dashboard**.

---

## 1. Route Map
The dashboard is accessible via the `/dashboard` prefix.

| Path | Component | Purpose |
| :--- | :--- | :--- |
| `/dashboard` | `DashboardOverview` | High-level summary of platform activity and quick actions. |
| `/dashboard/articles` | `ArticleList` | Management table for all editorial content. |
| `/dashboard/articles/new` | `ArticleEditor` | Full-screen interface for creating new articles. |
| `/dashboard/articles/:id/edit` | `ArticleEditor` | Interface for editing existing content. |
| `/dashboard/categories` | `CategoryList` | Manage taxonomy and display order. |
| `/dashboard/recognition` | `RecognitionModeration` | Approve or reject peer-to-peer shout-outs. |
| `/dashboard/ask-ceo` | `CeoAmaModeration` | Triage questions for the leadership team. |
| `/dashboard/ask-ceo/:id/answer` | `CeoAnswerEditor` | CEO-only interface for responding to questions. |
| `/dashboard/media` | `MediaLibrary` | Centralized asset management. |
| `/dashboard/users` | `UserManagement` | Employee directory and role assignment. |
| `/dashboard/settings` | `SettingsPage` | Global platform configuration. |

---

## 2. Feature-Based React Folder Structure
The dashboard is organized by domain modules to ensure scalability.

```text
src/dashboard/
├── components/         # Reusable Admin UI (Sidebar, Topbar, StatCard)
├── layouts/            # DashboardLayout.tsx (The Shell)
├── modules/            # Domain-specific modules
│   ├── overview/       # Command center
│   ├── articles/       # Editorial workflow
│   ├── recognition/    # Moderation tools
│   ├── ask-ceo/        # Leadership dialogue
│   ├── media/          # Asset management
│   ├── users/          # Team management
│   └── settings/       # Platform config
├── hooks/              # Dashboard-specific hooks (useDashboardStats)
├── services/           # API clients for dashboard modules
└── pages/              # Shared dashboard pages
```

---

## 3. Reusable Dashboard Component Inventory
A library of consistent UI elements for the back-office.

*   **`Sidebar`**: Collapsible navigation with active state tracking.
*   **`StatCard`**: Visual metrics with trend indicators (Up/Down).
*   **`DataTable`**: Sortable, paginated table with bulk actions.
*   **`StatusBadge`**: Color-coded workflow indicators (Draft, Published, etc.).
*   **`PageHeader`**: Standardized title area with primary actions.
*   **`ConfirmModal`**: Safety check for destructive actions (Delete/Archive).
*   **`MediaPicker`**: Modal for selecting assets from the library.
*   **`RichTextEditor`**: Block-based editor for articles and CEO answers.

---

## 4. Page-by-Page Breakdown

### **Dashboard Overview**
*   **Stats Grid:** Readers, Articles, Pending Moderation.
*   **Activity Feed:** Real-time log of platform events.
*   **Quick Actions:** "Create Article," "Moderate Recognition."

### **Article List**
*   **Filter Bar:** Search by title, filter by category/status.
*   **Management Table:** View counts, author info, and quick edit links.
*   **Bulk Actions:** Publish or Archive multiple selected items.

### **Recognition Moderation**
*   **Moderation Queue:** Card-based view of pending recognitions.
*   **Actions:** Approve (Publish to feed) or Reject (Hide).

### **Ask the CEO**
*   **Triage View:** Moderators filter questions for the CEO.
*   **Answer View:** CEO writes responses with rich text support.

---

## 5. MVP Implementation Sequence

### **Step 1: The Shell (Completed)**
*   Implement `DashboardLayout` and `Sidebar`.
*   Define the route map in `App.tsx`.

### **Step 2: Editorial Core**
*   Build the `ArticleList` table with mock data.
*   Implement the `ArticleEditor` with basic form fields (Title, Excerpt, Category).

### **Step 3: Moderation Engine**
*   Build the `RecognitionModeration` queue.
*   Implement the `CeoAmaModeration` triage view.

### **Step 4: Data Integration**
*   Connect the dashboard modules to the Express/Prisma backend.
*   Implement real-time updates using TanStack Query.

### **Step 5: Access Control**
*   Apply `ProtectedRoute` logic to restrict dashboard modules by role.
