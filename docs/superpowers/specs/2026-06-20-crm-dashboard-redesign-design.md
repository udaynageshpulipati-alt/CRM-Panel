# Design Document: CRM Dashboard UI & Functionality Improvements
Date: 2026-06-20
Status: Approved

## 1. Objective
Modernize the Operations CRM dashboard UI and functionality. Key goals include global design updates, redesigned dashboard widgets (KPIs, To-Do list, Attendance, Analytics), a native HTML5 drag-and-drop Kanban board for Daily Tasks, and fully operational delete/download actions across other pages.

## 2. Design System & Theme
* **Typography:** Clean font hierarchy using **Inter** across the entire application with weights 400, 500, 600, and 700.
* **Color Palette:**
  * Background: `#050b1e`
  * Surface Cards: Solid `#0b1226` to `#10192f`
  * Primary Accent: `#3b82f6` (Blue)
  * Success Accent: `#10b981` (Emerald)
  * Text Primary: `#f8fafc`
  * Text Secondary: `#94a3b8`
* **Styling & Interactions:**
  * Thin borders (`border-slate-800/80`).
  * Muted rounded corners (16px–20px).
  * Smooth 150-200ms transitions.
  * On-hover lift effect, subtle border highlight, and soft blue shadow.
  * No excessive glassmorphism, blur, or neon glows.

## 3. Sidebar Navigation & Layout
* **Simplified Titles & Clean Icons:**
  * Dashboard (LayoutDashboard)
  * Daily Tasks (Clock)
  * To-Do List (CheckSquare)
  * Attendance (Users)
  * Meetings (Calendar)
  * Issues & Blockers (AlertCircle)
  * Follow-Ups (ArrowRightLeft)
  * Reports (FileText)
  * Documents (Folder)
  * Settings (Settings)
* **Visuals:** Highlighted active routes with subtle solid background/dot markers and clean typography.

## 4. Dashboard Widgets
* **KPI Cards:** Solid card metrics for Total Tasks, Completed, In Progress, Pending, and On Hold.
* **Today's To-Do List:** Redesigned clean cards with priority tags, status indicators, progress bars, and a clear list of completed tasks.
* **Attendance Card:** Compact ring showing monthly percentage, small sub-metrics for *In, Out, Hrs*, and a clear *Check In/Out* toggle action.
* **Analytics Widget:** Side-by-side charts for *Daily Performance* (stacked/grouped bars) and *Monthly Attendance* (smooth area line) using Recharts.

## 5. Daily Tasks Kanban Board
* **Columns:** Not Started (Pending), In Progress, Completed, High Priority (separate status).
* **Drag-and-Drop:** Native HTML5 pointer event handling to seamlessly drag cards between columns and update status.
* **Actions:** Clean Edit and Delete buttons on each card with fully functional state management.

## 6. Utility Improvements
* **Meetings:** Add a delete action with confirmation.
* **Chairman Follow-Ups:** Keep completed instructions visible but styled slightly muted, and add a delete action.
* **Operations Vault (Documents):** Implement actual browser downloads (by generating a downloadable mock text blob of the file) and delete actions with confirmation.
* **Reports:** Redesigned premium layout and custom charts color matching the new palette.
