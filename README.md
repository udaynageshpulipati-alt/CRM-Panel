# Operations CRM Panel

A premium, modern Operations CRM Dashboard designed for **Realty Ops** management. This application features a sleek dark enterprise design system, responsive analytics charts, and a dynamic date-based operational archiving system.

---

## 🚀 Core Features

### 1. Daily Tasks & Kanban Board (`/tasks`)
* **Active Columns**: Drag-and-drop or status-update workflow cards across *Not Started*, *In Progress*, *Completed*, and *High Priority*.
* **Date-Based Archiving**: Tasks completed on previous days are automatically moved to the records section to keep the active workspace clean.
* **Tasks Records**: A searchable, paginated audit table at the bottom of the page showing all historical completed tasks.

### 2. To-Do Checklist Checklist (`/todo` & Dashboard Widget)
* **Checklist Flow**: Quickly add, toggle, and manage daily checklist tasks.
* **Coherent State**: Synchronized in real-time between the sidebar module page and the home dashboard widget via LocalStorage.
* **To-Do Records**: Automatic daily archiving of completed checklist items.

### 3. Scheduled Meetings (`/meetings`)
* **Active Timeline**: Lists upcoming confirmed, pending, or cancelled meetings, along with meetings completed today.
* **Meetings Records**: Persistent paginated record of past sessions showing attendee lists and session notes.

### 4. Direct Follow-Ups (`/followups`)
* **Chairman Orders**: Tracks direct directives from the board with progress updates.
* **Remarks Thread**: Add updates and remarks directly to individual instructions.

### 5. Issues & Blockers (`/issues`)
* **Blocker Pipeline**: Raise, start, and resolve site blocker issues with a ping alert for high-priority items.
* **Resolved Archive**: A searchable table of all resolved blockers.

### 6. Operations Reports & Export (`/reports`)
* **Dynamic Calculations**: Real-time stats compiled from tasks, checklist items, and meeting logs.
* **Export Options**: Interactive formatting designed specifically for print-to-PDF reports.
* **Reports Archive**: Sign off on active operational states and preserve them in a saved archive log.

---

## 🛠 Tech Stack
* **Framework**: [Next.js](https://nextjs.org/) (Static Export Configured)
* **Styling**: [Tailwind CSS](https://tailwindcss.com/)
* **Interactions**: [Framer Motion](https://www.framer.com/motion/)
* **Analytics**: [Recharts](https://recharts.org/)
* **Icons**: [Lucide React](https://lucide.dev/)

---

## ⚙️ Setup & Installation

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

### 3. Build & Export Static Files
Generates a static HTML build under the `out/` directory:
```bash
npm run build
```

---

## 🌐 Deploying to Hostinger
1. Configure Next.js for static export (enabled by default in `next.config.ts`).
2. Run `npm run build` to generate the `out/` directory.
3. Log in to your **Hostinger hPanel**.
4. Open the **File Manager** of your domain and navigate to the `public_html` directory.
5. Drag and upload all files and folders inside the `app-src/out` directory into `public_html`.
