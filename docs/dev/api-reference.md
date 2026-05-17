---
title: API Reference
sidebar_label: API Reference
---

# API Reference

All API endpoints are prefixed with `/api/`. Authentication uses JWT Bearer tokens obtained from `/api/token/`.

An interactive Swagger UI is available at `/api/docs/` on the running backend.

---

## Authentication

### `POST /api/token/`

Obtain a JWT token pair.

**Request body:**
```json
{
  "username": "user@example.com",
  "password": "secret"
}
```

**Response:**
```json
{
  "access": "<jwt-access-token>",
  "refresh": "<jwt-refresh-token>"
}
```

### `POST /api/token/refresh/`

Refresh an expired access token.

**Request body:**
```json
{
  "refresh": "<jwt-refresh-token>"
}
```

---

## Profile

### `GET /api/profiles/`

List the authenticated user's candidate profile.

**Response:**
```json
[{
  "id": 1,
  "full_name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "+49 30 1234567",
  "location": "Berlin, Germany",
  "linkedin_url": "https://linkedin.com/in/janedoe",
  "github_url": "https://github.com/janedoe",
  "summary": "Senior Product Manager with 6 years experience...",
  "years_experience": 6
}]
```

### `POST /api/profiles/`

Create a candidate profile (done once; subsequent calls use PATCH).

### `PATCH /api/profiles/{id}/`

Update a candidate profile.

---

## MBTI Profile

### `GET /api/mbti-profiles/`

Get the user's MBTI profile.

**Response:**
```json
{
  "id": 1,
  "mbti_type": "ENFJ",
  "tone_preferences": {},
  "writing_style_notes": "",
  "strengths": ["leadership", "empathy"],
  "weaknesses": ["overcommitting"]
}
```

### `POST /api/mbti-profiles/`

Create the MBTI profile.

### `PATCH /api/mbti-profiles/{id}/`

Update MBTI type and preferences.

---

## Technical Review

> **Note:** The technical review backend API is simpler than the frontend model. See the [Gap Report](./gap-report) for missing fields.

### `GET /api/technical-reviews/`

List technical reviews for the authenticated user.

### `POST /api/technical-reviews/`

Create a technical review.

**Request body:**
```json
{
  "title": "My Technical Review",
  "overall_level": "senior",
  "notes": ""
}
```

### `GET /api/skill-assessments/`

List skill assessments for the user's technical reviews.

### `POST /api/skill-assessments/`

Add a skill assessment.

**Request body:**
```json
{
  "review": 1,
  "skill_name": "Django",
  "proficiency": 4,
  "evidence": "Led migration of 3 monolith services to DRF APIs",
  "tags": ["backend", "python"]
}
```

### `GET /api/project-experiences/`

List project experiences.

### `POST /api/project-experiences/`

Add a project experience.

**Request body:**
```json
{
  "review": 1,
  "project_name": "Real-time Analytics Dashboard",
  "role": "Lead PM",
  "tech_stack": ["React", "PostgreSQL"],
  "achievements": "Reduced time-to-insight from 4h to 15min",
  "duration_months": 6
}
```

---

## Applications

### `GET /api/applications/`

List all job applications for the authenticated user.

**Query parameters:**
- `status` — filter by status
- `page` — pagination

**Response:**
```json
[{
  "id": 1,
  "job_title": "Senior PM",
  "company_name": "Meridian Analytics",
  "job_description": "...",
  "personal_note": "Love their data team culture",
  "technical_review": 1,
  "status": "generated",
  "optimized_cv": "...",
  "cover_letter": "...",
  "created_at": "2026-05-17T10:00:00Z",
  "updated_at": "2026-05-17T10:05:00Z"
}]
```

### `POST /api/applications/`

Create a new application.

**Request body:**
```json
{
  "job_title": "Senior PM",
  "company_name": "Meridian Analytics",
  "job_description": "We are looking for...",
  "personal_note": "Optional personal context",
  "technical_review": 1
}
```

### `PATCH /api/applications/{id}/`

Update an application (e.g. status change).

### `DELETE /api/applications/{id}/`

Delete an application.

---

## Generation endpoints

### `POST /api/applications/{id}/generate-cv/`

Start asynchronous CV generation.

**Guards:**
- Requires a linked `technical_review`
- Returns `400` if application is `submitted` (unless `?force=true`)

**Response (202):**
```json
{
  "task_id": "abc-123",
  "status": "PENDING"
}
```

### `POST /api/applications/{id}/generate-cover-letter/`

Start asynchronous cover letter generation.

**Additional guard:** Requires MBTI profile to exist.

**Response (202):** Same structure as generate-cv.

### `POST /api/applications/{id}/generate-all/`

Generate both CV and cover letter in sequence.

**Guards:** All of the above combined.

---

## Task status

### `GET /api/tasks/{task_id}/`

Poll a Celery task's status.

**Response:**
```json
{
  "task_id": "abc-123",
  "status": "SUCCESS",
  "result": {
    "artifact_id": 42,
    "artifact_type": "cv",
    "application_id": 1,
    "created_at": "2026-05-17T10:05:30Z"
  }
}
```

Possible `status` values: `PENDING`, `STARTED`, `SUCCESS`, `FAILURE`, `RETRY`, `REVOKED`

---

## Generated Artifacts

### `GET /api/artifacts/`

List all generated artifacts for the user (read-only).

**Response:**
```json
[{
  "id": 42,
  "application": 1,
  "artifact_type": "cv",
  "content": "Jane Doe\nSenior Product Manager\n...",
  "model_used": "placeholder-v1",
  "created_at": "2026-05-17T10:05:30Z"
}]
```

---

## Dashboard

### `GET /api/dashboard/`

Returns summary statistics.

**Response:**
```json
{
  "counts_by_status": {
    "draft": 3,
    "reviewed": 0,
    "generated": 12,
    "submitted": 5
  },
  "recent_applications": [
    {
      "id": 1,
      "job_title": "Senior PM",
      "company_name": "Meridian Analytics",
      "status": "generated",
      "created_at": "2026-05-17T10:00:00Z"
    }
  ],
  "last_generated_at": "2026-05-17T10:05:30Z"
}
```

---

## OpenAPI / Swagger

The full interactive API documentation is available at:

- **Swagger UI:** `GET /api/docs/`
- **ReDoc:** `GET /api/redoc/`
- **Schema JSON:** `GET /api/schema/`

These are auto-generated by `drf-spectacular` from the Django views.
