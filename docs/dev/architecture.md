---
title: Architecture Overview
sidebar_label: Architecture
---

# Architecture Overview

## Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 14 (TypeScript, App Router) |
| **Backend** | Django 4.x + Django REST Framework |
| **Database** | PostgreSQL |
| **Task queue** | Celery + Redis |
| **PDF export** | WeasyPrint |
| **Auth** | NextAuth.js (frontend) + simplejwt (backend) |

---

## Repository layout

```
code-projects/
├── wxrk/
│   └── wxrk_frontend/          # Next.js app
│       ├── src/app/             # App Router pages
│       │   ├── (app)/           # Authenticated pages
│       │   │   ├── dashboard/
│       │   │   ├── profile/
│       │   │   ├── technical-review/
│       │   │   ├── applications/
│       │   │   │   ├── new/
│       │   │   │   └── [id]/
│       │   │   └── settings/
│       │   ├── (auth)/          # Login / register pages
│       │   └── onboarding/
│       ├── src/lib/api/         # Typed API client functions
│       ├── src/types/           # Shared TypeScript types
│       ├── src/store/           # Zustand state stores
│       └── src/components/      # Shared UI components
│
├── wxrk-backend/               # Django project
│   ├── wxrk_backend/           # Django settings, root URLs
│   ├── profile_app/            # Candidate profile + MBTI
│   ├── technical_review/       # TechnicalReview, SkillAssessment, ProjectExperience
│   ├── applications/           # JobApplication, GeneratedArtifact, Celery tasks
│   └── dashboard/              # Dashboard summary endpoint
│
└── wxrk_documentation/         # This site
```

---

## Authentication flow

```
Browser                     Next.js                     Django
   │                           │                            │
   │ POST /auth/signin          │                            │
   │ ─────────────────────────► │                            │
   │                           │ POST /api/token/           │
   │                           │ ──────────────────────────► │
   │                           │ ◄────────────────────────── │
   │                           │  { access, refresh }        │
   │ ◄───────────────────────── │                            │
   │  NextAuth session cookie   │                            │
   │                           │                            │
   │ GET /api/profile/          │                            │
   │ Authorization: Bearer ...  │                            │
   │ ─────────────────────────────────────────────────────► │
   │ ◄───────────────────────────────────────────────────── │
```

- The frontend stores the JWT access token in the NextAuth session.
- All API calls from `src/lib/api/client.ts` inject `Authorization: Bearer <token>` automatically.
- Token refresh is handled by `simplejwt`'s `/api/token/refresh/` endpoint.

---

## CV / Cover Letter generation pipeline

```
Frontend                     Django                     Celery Worker
   │                            │                            │
   │ POST /api/applications/    │                            │
   │ {id}/generate-cv/          │                            │
   │ ──────────────────────────► │                            │
   │                            │ generate_cv_task.delay(id) │
   │                            │ ──────────────────────────► │
   │ { task_id, status: PENDING }│                            │
   │ ◄────────────────────────── │                            │
   │                            │                            │ fetch application
   │                            │                            │ with related data
   │                            │                            │
   │                            │                            │ call AI service
   │                            │                            │ (generate_optimized_cv)
   │                            │                            │
   │                            │                            │ save to JobApplication
   │                            │                            │ + GeneratedArtifact
   │                            │                            │
   │ GET /api/tasks/{task_id}/  │                            │
   │ ──────────────────────────► │                            │
   │ { status: SUCCESS,         │                            │
   │   result: { artifact_id }} │                            │
   │ ◄────────────────────────── │                            │
```

The frontend polls `/api/tasks/{task_id}/` until `status === 'SUCCESS'` or `'FAILURE'`.

---

## Backend Django apps

### `profile_app`

Manages the candidate identity layer.

| Model | Purpose |
|---|---|
| `CandidateProfile` | One per user. Stores name, email, phone, location, LinkedIn, GitHub, summary, years_experience |
| `MBTIProfile` | One-to-one with CandidateProfile. Stores MBTI type, tone preferences, strengths, weaknesses |

### `technical_review`

Manages the career data layer.

| Model | Purpose |
|---|---|
| `TechnicalReview` | One per candidate. Header with overall_level and notes |
| `SkillAssessment` | Many per review. Skill name + proficiency (1–5) + evidence + tags |
| `ProjectExperience` | Many per review. Project name + role + tech_stack + achievements + duration |

:::note Frontend / Backend mismatch
The frontend Technical Review model is significantly richer than the backend. See the [Gap Report](./gap-report) for details.
:::

### `applications`

Manages the application and generation layer.

| Model | Purpose |
|---|---|
| `JobApplication` | One per application. Links candidate + technical_review. Stores job_description, personal_note, optimized_cv, cover_letter |
| `GeneratedArtifact` | Immutable generation record. Stores content, model_used, prompt_used, meta |

### `dashboard`

Single view: `dashboard_summary` — returns counts by status, last 5 applications, and last generated timestamp.

---

## Frontend state management

The frontend uses **Zustand** for global state (`src/store/`). The main store is `userStore` which holds the resolved user name from the accounts API.

API calls use **Axios** via the typed client in `src/lib/api/client.ts`. Each domain has its own API module:

- `applicationsApi` — CRUD + generate + scrape + quota
- `profileApi` — get, update, avatar, MBTI, import
- `technicalReviewApi` — experiences CRUD + versions
- `fitAnalysisApi` — fit score + interviewer
- `dashboardApi` — stats + activity + drafts

---

## Key environment variables

### Frontend (Next.js)

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_DJANGO_API_URL` | Django backend base URL (e.g. `http://localhost:8000/api`) |
| `NEXTAUTH_URL` | Full URL of the Next.js app |
| `NEXTAUTH_SECRET` | Secret for NextAuth session encryption |

### Backend (Django)

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `REDIS_URL` | Redis connection for Celery broker |
| `DJANGO_SECRET_KEY` | Django secret key |
| `ALLOWED_HOSTS` | Comma-separated allowed hosts |
