# UniVoice — Project State & Invariants

## 1. Product Summary

UniVoice is a multi-agent outbound voice campaign platform tailored for university governance. Non-technical clerks generate targeted voice campaigns from student registries (fees, admissions, scholarship, library, attendance) using natural language. The current repository contains the Next.js frontend application with mock analytics and demo-mode HITL campaign approvals.

## 2. Global Execution Invariants

- Application Boundary: All code lives inside `frontend/`. Never touch or run commands from root `package.json`. Always run scripts using `pnpm` inside `frontend/`.
- Path Aliasing: Use `@/*` pointing directly to `frontend/*`.
- Ghost Backend Ban: Telephony, Python, FastAPI, and LangGraph do NOT exist in this repo. Mock backend interactions on the frontend until formal backend integration.
- Pagination Constraint: Student Records page size is strictly centralized. Always import `STUDENT_RECORDS_PAGE_SIZE` from `@/modules/students/configurations` (= 25). Never hardcode numbers.
- Five Core Roles: System operations are restricted to `finance`, `admissions`, `scholarship`, `library`, and `class_teacher` (defined in `lib/roles.ts`).

## 3. Library & Framework Contracts

- Framework: Next.js 16.2 (App Router, Turbopack, React Compiler enabled).
- React: React 19.2 (React Server Components + client boundaries). Memoize or isolate TanStack table columns to avoid compiler render loops.
- AI SDK (v7): Use modern AI SDK 7 streaming patterns (`streamText`, `@ai-sdk/react`, modern UI message stream parts). Never use deprecated v2/v3 chat methods.
- Styling: Tailwind CSS v4 + `tailwindcss-animate`, shadcn/ui primitives built on Radix UI, Lucide icons, Framer Motion.
- Persistence: Drizzle ORM + `postgres` driver for chat data; Supabase client for student domain reads.
- Tables & Data: TanStack Table v9 for Student Records; PapaParse for sheet parsing; `react-data-grid` and CodeMirror for artifacts.

## 4. Feature Implementation Checklist

- [x] Vercel Chatbot baseline (auth, streaming chat, history, artifacts)
- [x] Dark ChatGPT-style layout with collapsible sidebar
- [x] Department Role Selector (5 university roles)
- [x] Student Records tables with role-specific filters & pagination (TanStack v9)
- [x] HITL Campaign Preview Card UI with approval toast (Demo sandbox)
- [x] Student Records to Campaign Handoff builder (`campaign-handoff.ts`)
- [x] Analytics list and detail dashboards (Mock data)
- [x] Connected Registries / Plugins page (Simulated status)
- [ ] Role-Aware Zero-Prompting system instructions (`lib/ai/prompts.ts`)
- [ ] Drizzle persistence for campaigns (`Campaign` / `CampaignTarget` in `lib/db/schema.ts`)
- [ ] Connect Records Handoff payload to active chat draft state
- [ ] Live Supabase student queries triggered via chat tool calls
