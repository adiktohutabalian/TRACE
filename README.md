<!-- # TRACE — Find your way back. -->

> **A focused cognitive context preserver designed to eliminate task re-orientation fatigue by tracking the exact coordinates of your work sessions.**

---

## 🎯 The Problem

When developers, researchers, and students switch across multiple demanding projects (e.g., thesis writing, language acquisition, software engineering), the greatest friction is not the task execution itself. It is the **15–20 minutes of orientation latency** spent reconstructing:
- *"Where did I stop last time?"*
- *"What subtle blocker or important mental model was in my head?"*
- *"What is the absolute immediate next step to begin without procrastination?"*

Traditional to-do apps fail here because they track abstract future goals rather than **session checkpoints**.

---

## 💡 The Solution: The Triad of Context

TRACE enforces a zero-friction, 3-field cognitive coordinate system recorded at the end of each work sprint:

1. **Where I Stopped (`where_left_off`)**: The exact concrete anchor of progress (e.g., *“Chapter 3: Methodology Section 3.2 data metrics”*).
2. **Important Context (`whats_important`)**: Mental state, warnings, or active questions (e.g., *“Formula 4 has an outlier when n < 10”*).
3. **Immediate Next Action (`whats_next`)**: A micro-step small enough to execute in under 3 minutes upon returning, breaking initial inertia.

---

## 🏗️ Architecture & Engineering Decisions

### 1. Relational Entity Domain
The system models relational integrity across three isolated layers:
- **`users`**: Account identity with password hashing simulation and Bearer token session authentication.
- **`activities`**: Topic-level workspaces tagged with visual brand colors (`1:N` cascade relationship from users).
- **`checkpoints`**: Contextual coordinate history anchored to specific activities (`1:N` cascade relationship from activities).

### 2. Full-Stack Mechanics
- **Frontend**: React 18 + TypeScript + Tailwind CSS + Lucide Icons.
- **Backend API**: Express.js server providing RESTful endpoints for authentication, activity lifecycle, and immutable checkpoint audit logs.
- **Relational Data Isolation**: Strict user-level tenant isolation enforced at the database retrieval layer (`user_id` validation).

---

## 🚀 How to Run Locally in VS Code

If you downloaded this project as a ZIP archive, follow these steps to run it on your local machine:

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or bun

### Setup Steps
1. **Extract the ZIP file** and open the folder in **Visual Studio Code**.
2. Open the built-in terminal (`Ctrl + \`` or `Cmd + \``).
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **(Optional) Connect to Supabase Cloud Database**:
   Create a `.env` file in the root folder with your Supabase credentials:
   ```env
   SUPABASE_URL=https://eqoabqdpzwwkahqdpjte.supabase.co
   SUPABASE_ANON_KEY=your_supabase_publishable_or_anon_key_here
   ```
   *(If not provided, the app will automatically run using its local JSON database fallback engine without any configuration).*

5. **Start the development server**:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

---

## 🛡️ Key Project Files

- `/server.ts` — Express backend API with user authentication, route handlers, and relational data persistence.
- `/src/types.ts` — Core domain contracts, entity definitions, and API interfaces.
- `/src/api.ts` — Client-side API layer with automated bearer token interception.
- `/src/components/ResumeCard.tsx` — Hero dashboard component calculating relative time decay and immediate next actions.
- `/src/components/CheckpointModal.tsx` — Dual-mode modal (create/edit) with keyboard shortcuts and event propagation guards.
- `/src/components/ActivityDetailView.tsx` — Contextual audit timeline displaying historical progression checkpoints.

---

## 👤 Author
- Adikto Hutabalian (Portfolio Project)
