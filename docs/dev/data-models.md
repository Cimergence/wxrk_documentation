---
title: Data Models
sidebar_label: Data Models
---

# Data Models

## Entity Relationship Overview

```
User (Django auth)
 └─── CandidateProfile (1:1)
       ├─── MBTIProfile (1:1)
       ├─── TechnicalReview (1:N)
       │     ├─── SkillAssessment (1:N)
       │     └─── ProjectExperience (1:N)
       └─── JobApplication (1:N)
             ├─── links to TechnicalReview (FK, nullable)
             └─── GeneratedArtifact (1:N)
```

---

## CandidateProfile

**App:** `profile_app`

| Field | Type | Notes |
|---|---|---|
| `user` | OneToOneField → User | Cascade delete |
| `full_name` | CharField(255) | Required |
| `email` | EmailField | Required |
| `phone` | CharField(50) | Optional |
| `location` | CharField(255) | Optional |
| `linkedin_url` | URLField | Optional |
| `github_url` | URLField | Optional |
| `summary` | TextField | Optional professional summary |
| `years_experience` | PositiveIntegerField | Default 0 |

---

## MBTIProfile

**App:** `profile_app`

| Field | Type | Notes |
|---|---|---|
| `candidate` | OneToOneField → CandidateProfile | Cascade delete |
| `mbti_type` | CharField(4) | Choices: all 16 MBTI types |
| `tone_preferences` | JSONField | Flexible tone configuration |
| `writing_style_notes` | TextField | Optional free text |
| `strengths` | JSONField(list) | List of strength strings |
| `weaknesses` | JSONField(list) | List of weakness strings |

---

## TechnicalReview

**App:** `technical_review`

| Field | Type | Notes |
|---|---|---|
| `candidate` | ForeignKey → CandidateProfile | Cascade delete |
| `title` | CharField(255) | Review name |
| `overall_level` | CharField(10) | Choices: junior / mid / senior |
| `notes` | TextField | General notes |
| `created_at` | DateTimeField | Auto |
| `updated_at` | DateTimeField | Auto |

---

## SkillAssessment

**App:** `technical_review`

| Field | Type | Notes |
|---|---|---|
| `review` | ForeignKey → TechnicalReview | Cascade delete |
| `skill_name` | CharField(255) | e.g. "Django", "React" |
| `proficiency` | PositiveSmallIntegerField | 1–5 (validated) |
| `evidence` | TextField | Free text |
| `tags` | JSONField(list) | Category tags |

---

## ProjectExperience

**App:** `technical_review`

| Field | Type | Notes |
|---|---|---|
| `review` | ForeignKey → TechnicalReview | Cascade delete |
| `project_name` | CharField(255) | |
| `role` | CharField(255) | Candidate's role |
| `tech_stack` | JSONField(list) | Technology tags |
| `achievements` | TextField | Free text |
| `duration_months` | PositiveIntegerField | Default 0 |

---

## JobApplication

**App:** `applications`

| Field | Type | Notes |
|---|---|---|
| `candidate` | ForeignKey → CandidateProfile | Cascade delete |
| `job_title` | CharField(255) | |
| `company_name` | CharField(255) | |
| `job_description` | TextField | Full JD text |
| `personal_note` | TextField | Candidate's personal context |
| `technical_review` | ForeignKey → TechnicalReview | SET NULL on delete |
| `status` | CharField(20) | Choices: draft / reviewed / generated / submitted |
| `optimized_cv` | TextField | Generated CV text |
| `cover_letter` | TextField | Generated cover letter text |
| `created_at` | DateTimeField | Auto |
| `updated_at` | DateTimeField | Auto |

**Status lifecycle:** `draft` → `generated` → `submitted`

---

## GeneratedArtifact

**App:** `applications`

Immutable record of each generation call. Multiple artifacts can exist per application.

| Field | Type | Notes |
|---|---|---|
| `application` | ForeignKey → JobApplication | Cascade delete |
| `artifact_type` | CharField(20) | Choices: cv / cover_letter |
| `content` | TextField | Full generated text |
| `model_used` | TextField | Model identifier |
| `prompt_used` | TextField | Full prompt sent to AI |
| `meta` | JSONField | Task ID, etc. |
| `created_at` | DateTimeField | Auto |

---

## Frontend type extensions (not yet in backend)

The frontend defines several types that have no corresponding backend model. These are documented in the [Gap Report](./gap-report).

Key missing types:

| Frontend type | Status |
|---|---|
| `Experience` (rich, with starStories, emotionalContext) | Not in backend |
| `GeneratedCVDocument` (HTML format, versioned) | Not in backend |
| `FitAnalysisResponse` | No backend app |
| `DailyQuota` | No backend model |
| `ActivityItem` | No backend model |
| `DraftItem` | No backend endpoint |
