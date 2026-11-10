# UniVoice — Code Index & File Reference

## 1. Chat & Streaming Engine

- `frontend/app/(chat)/api/chat/route.ts`: Core AI SDK 7 streaming endpoint; validates session, loads history, calls AI gateway, executes tools.
- `frontend/lib/ai/prompts.ts`: System instructions, artifact rules, and department prompt templates.
- `frontend/lib/ai/models.ts` & `providers.ts`: Multi-provider routing configurations (Kimi, DeepSeek, etc.).
- `frontend/components/chat/multimodal-input.tsx`: Input box supporting text, file attachments, and slash commands.
- `frontend/components/chat/message.tsx`: Chat bubble rendering streaming parts, markdown, artifacts, and campaign preview cards.

## 2. Roles & Governance Domain

- `frontend/lib/roles.ts`: Central definitions, labels, badges, and icon associations for the 5 university roles.
- `frontend/hooks/use-role.tsx`: React context and `localStorage` provider managing active department role.
- `frontend/components/chat/role-selector.tsx`: Header dropdown allowing users to switch active department context.

## 3. Student Records & Registries (TanStack Table v9)

- `frontend/app/(chat)/student-records/page.tsx`: Main registry view hosting tables and handoff action buttons.
- `frontend/components/student-records/student-records-table.tsx`: TanStack Table v9 core rendering pagination and filters.
- `frontend/components/student-records/columns/`: Role-specific table column definitions (`finance.tsx`, `admissions.tsx`, etc.).
- `frontend/modules/students/configurations.ts`: Student Records filter options and page-size constant (`STUDENT_RECORDS_PAGE_SIZE = 25`).
- `frontend/modules/students/data/demo-records.ts`: Role-specific fallback demo datasets and generators.
- `frontend/modules/departments/domain/academic-structure.ts`: Academic department and branch reference data.
- `frontend/lib/student-records/supabase-queries.ts`: Live query helpers for Supabase database tables.
- `frontend/lib/student-records/campaign-handoff.ts`: Converts filtered student rows into natural-language campaign drafts.

## 4. Human-In-The-Loop (HITL) Campaign Flow

- `frontend/components/chat/campaign-preview-card.tsx`: Interactive preview card showing dial list, script summary, Approve/Cancel buttons.
- `frontend/lib/campaign.ts`: Campaign types (`CampaignPreviewData`), mock campaigns, and draft parsing utilities.

## 5. Database & Persistence Layer

- `frontend/lib/db/schema.ts`: Drizzle ORM schema definitions (Users, Chats, Messages, Votes, Documents).
- `frontend/lib/db/queries.ts`: Typed database queries for fetching chats and user sessions.
- `frontend/lib/supabase.ts`: Supabase browser/server client initialization and RLS status checking.

## 6. Analytics & Auxiliary Pages

- `frontend/app/(chat)/analytics/`: Campaign performance metrics, call success rates, department breakdowns.
- `frontend/lib/analytics.ts` & `campaign-analytics.ts`: Mock analytics data providers.
- `frontend/app/(chat)/plugins/page.tsx`: Integration status UI for external college registry plugins.

## 7. Artifacts & Shared UI

- `frontend/artifacts/`: Code, sheet, text, and image artifact handlers.
- `frontend/components/ui/`: Standard shadcn/ui primitives (button, dialog, dropdown-menu, table, etc.).
