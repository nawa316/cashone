# Cashone — Technical Documentation Suite & Pre-Development Hub

Welcome to the **Cashone Personal Finance & Cashflow Tracker** documentation repository. This directory contains all technical specifications, architectural blueprints, database schemas, UI/UX design systems, and deployment guides.

---

## 📚 Document Index & Navigation

| Document | Purpose & Contents |
| :--- | :--- |
| **[1. Master Product Requirements (PRD)](file:///home/nawa316/Documents/Programming/web/cashone/doc/PRD_Cashone_Finance_Tracker.md)** | Core business vision, goals, functional scope, and personal finance requirements. |
| **[2. Supabase Database Architecture & ERD](file:///home/nawa316/Documents/Programming/web/cashone/doc/PRD_Supabase_Database_Architecture.md)** | PostgreSQL schemas, ERD, double-entry balance triggers, and RLS policies. |
| **[3. System Architecture & Tech Spec](file:///home/nawa316/Documents/Programming/web/cashone/doc/01_System_Architecture.md)** | Next.js 16 App Router architecture, Server Actions, folder structure, and env vars. |
| **[4. UI/UX Design System & Layouts](file:///home/nawa316/Documents/Programming/web/cashone/doc/02_UI_UX_Design_System.md)** | Catamaran typography, dark terminal theme tokens, wireframes, and component states. |
| **[5. API & Data Access Layer Spec](file:///home/nawa316/Documents/Programming/web/cashone/doc/03_API_Data_Access_Spec.md)** | Server Action signatures, Zod validation schemas, and REST route specifications. |
| **[6. Security, Auth & Storage Protocol](file:///home/nawa316/Documents/Programming/web/cashone/doc/04_Security_Auth_Protocol.md)** | Next.js SSR middleware auth, session lifecycle, RLS enforcement, and storage policies. |
| **[7. Testing, QA & Deployment Guide](file:///home/nawa316/Documents/Programming/web/cashone/doc/05_Testing_Deployment_Guide.md)** | Unit test formulas, Supabase migrations, Vercel CI/CD deployment, and preview URLs. |
| **[8. Development Roadmap & Sprints](file:///home/nawa316/Documents/Programming/web/cashone/doc/06_Development_Roadmap.md)** | Sprint timeline, milestones, user stories, and acceptance criteria. |
| **[9. Shadcn UI Design System Specification](file:///home/nawa316/Documents/Programming/web/cashone/doc/07_Design_System_Shadcn.md)** | Complete shadcn/ui setup, `components.json`, CSS tokens, and component library. |

---

## 🛠️ Architecture Quick Reference

* **Framework:** Next.js 16 (App Router) + React 19 + TypeScript
* **Styling:** Tailwind CSS v4 + Catamaran Font (Tabular numbers) + `lucide-react`
* **Database & BaaS:** Supabase (PostgreSQL 15+, Supabase Auth, Row Level Security, Storage)
* **Target Deployment:** Vercel (Edge Middleware + Serverless Functions) & Supabase Cloud
