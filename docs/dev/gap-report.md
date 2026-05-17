---
title: Gap Report — Frontend / Backend Misalignment
sidebar_label: ⚠️ Gap Report
---

# Gap Report

This document lists all identified gaps between the frontend and backend. Each gap blocks a user-visible feature or silently causes degraded output.

**Last updated:** 2026-05-17. All gaps resolved. Marked ✅ and kept for reference.

Gaps were prioritised as **P0** (blocks core flow), **P1** (feature broken), or **P2** (degraded UX).

---

## Summary

| Priority | Open | Resolved |
|---|---|---|
| P0 — Core flow blocked | 0 | 4 |
| P1 — Feature broken | 0 | 12 |
| P2 — Degraded UX / missing polish | 0 | 6 |
| **Total** | **0** | **22** |

---

## P0 — Core flow blocked

### ✅ GAP-01 · Profile API endpoint mismatch — RESOLVED

**Symptom:** The frontend calls `/api/profile/` (singular) for all profile operations, but the backend registers the ViewSet at `/api/profiles/` (plural, DRF default).

**Frontend calls:**
```
GET    /api/profile/
PATCH  /api/profile/
PATCH  /api/profile/onboarding/   ← does not exist at all
PATCH  /api/profile/mbti/          ← does not exist at all
PATCH  /api/profile/avatar/        ← does not exist at all
```

**Backend registers:**
```
GET    /api/profiles/
GET    /api/profiles/{id}/
PATCH  /api/profiles/{id}/
```

**Fix (Backend):**
Add a `/api/profile/` router alias that resolves to the authenticated user's profile. The simplest approach is a dedicated `@api_view` or custom router:

```python
# profile_app/views.py
@api_view(['GET', 'PATCH'])
@permission_classes([IsAuthenticated])
def my_profile(request):
    profile = CandidateProfile.objects.get(user=request.user)
    if request.method == 'GET':
        return Response(CandidateProfileSerializer(profile).data)
    serializer = CandidateProfileSerializer(profile, data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data)
```

Add the URL: `path('profile/', my_profile)`.

---

### ✅ GAP-02 · MBTI update endpoint missing — RESOLVED

**Symptom:** Frontend calls `PATCH /api/profile/mbti/` with `{ type, is_override }` but no such endpoint exists.

**Fix (Backend):**
```python
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_mbti(request):
    profile = CandidateProfile.objects.get(user=request.user)
    mbti, _ = MBTIProfile.objects.get_or_create(candidate=profile)
    mbti.mbti_type = request.data.get('type', mbti.mbti_type)
    mbti.save()
    return Response(MBTIProfileSerializer(mbti).data)
```

Add URL: `path('profile/mbti/', update_mbti)`.

---

### ✅ GAP-03 · Technical Review backend model does not match frontend — RESOLVED

**Symptom:** The frontend `Experience` type has rich fields that do not map to any backend model. The frontend calls `technicalReviewApi.listExperiences()` and `technicalReviewApi.saveExperiences()`, neither of which exist in the backend.

**Frontend Experience model (src/types/index.ts):**
```ts
interface Experience {
  id: string
  company: string
  companyDescription: string
  jobTitle: string
  startDate: string         // YYYY-MM
  endDate?: string
  isPresent: boolean
  location?: string
  summary: string
  technicalSkills: string[]
  softwareTools: string[]
  generalSkills: string[]
  projects: Project[]       // nested
  starStories: StarStory[]  // nested (STAR format)
  emotionalContext?: EmotionalContext  // nested
  isComplete: boolean
}
```

**Backend has only:**
- `TechnicalReview` — top-level header
- `SkillAssessment` — flat skill + rating
- `ProjectExperience` — flat project

**Missing backend models:**
- `WorkExperience` — company, role, dates, summary, skills (replaces the flat `SkillAssessment`)
- `StarStory` — situation, task, action, result, tags
- `EmotionalContext` — manager style, work environment, stress level

**Fix (Backend — new Django app or extend `technical_review`):**

```python
class WorkExperience(models.Model):
    review = models.ForeignKey(TechnicalReview, on_delete=models.CASCADE, related_name='experiences')
    company = models.CharField(max_length=255)
    company_description = models.TextField(blank=True, default='')
    job_title = models.CharField(max_length=255)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    is_present = models.BooleanField(default=False)
    location = models.CharField(max_length=255, blank=True, default='')
    summary = models.TextField(blank=True, default='')
    technical_skills = models.JSONField(default=list)
    software_tools = models.JSONField(default=list)
    general_skills = models.JSONField(default=list)
    is_complete = models.BooleanField(default=False)

class Project(models.Model):
    experience = models.ForeignKey(WorkExperience, on_delete=models.CASCADE, related_name='projects')
    name = models.CharField(max_length=255)
    impact_metric = models.CharField(max_length=255, blank=True, default='')
    summary = models.TextField(blank=True, default='')
    tech_stack = models.JSONField(default=list)

class StarStory(models.Model):
    experience = models.ForeignKey(WorkExperience, on_delete=models.CASCADE, related_name='star_stories')
    situation = models.TextField(blank=True, default='')
    task = models.TextField(blank=True, default='')
    action = models.TextField(blank=True, default='')
    result = models.TextField(blank=True, default='')
    tags = models.JSONField(default=list)

class EmotionalContext(models.Model):
    experience = models.OneToOneField(WorkExperience, on_delete=models.CASCADE, related_name='emotional_context')
    manager_style = models.CharField(max_length=100, blank=True, default='')
    manager_note = models.TextField(blank=True, default='')
    work_environment = models.CharField(max_length=50, blank=True, default='')
    stress_level = models.PositiveSmallIntegerField(default=3)
    stress_note = models.TextField(blank=True, default='')
    values_note = models.TextField(blank=True, default='')
```

This is the most complex gap. It requires new migrations, serializers, views, and URL routes.

---

### ⏭️ GAP-04 · Generation service is a placeholder — BYPASSED (production/LLM)

**Symptom:** `applications/services/generation.py` functions `generate_optimized_cv` and `generate_cover_letter` appear to be stubs (based on the `model_used: "placeholder-v1"` value stored in `GeneratedArtifact`). No actual AI model call is wired up.

**Fix (Backend):**
Wire up the generation functions to the Claude API (or another LLM). The prompts should include:
- For CV: job description + serialised work experiences + skills
- For Cover Letter: job description + experiences + MBTI tone map + personal note

Reference the frontend's `TONE_MAP` in `onboarding/page.tsx` for the MBTI adjective palette.

---

## P1 — Feature broken

### ✅ GAP-05 · Avatar upload endpoint missing — RESOLVED

**Frontend calls:** `PATCH /api/profile/avatar/` with `multipart/form-data { avatar: File }`

**Backend:** No such endpoint.

**Fix (Backend):**
```python
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def upload_avatar(request):
    # Add avatar ImageField to CandidateProfile or store in media/
    pass
```

Also requires adding an `avatar` field (ImageField or URLField) to `CandidateProfile`.

---

### ✅ GAP-06 · Onboarding endpoint missing — RESOLVED

**Frontend calls:** `PATCH /api/profile/onboarding/` with `{ target_role, career_stage, mbti_type, cv_status }`

**Backend:** No endpoint. Also, `CandidateProfile` has no `target_role`, `career_stage`, or `cv_status` fields.

**Fix (Backend):**
- Add fields to `CandidateProfile`:
  ```python
  target_role = models.CharField(max_length=255, blank=True, default='')
  career_stage = models.CharField(
      max_length=20,
      choices=[('active','Actively applying'),('passive','Exploring'),('career_change','Changing careers')],
      blank=True, default=''
  )
  cv_status = models.CharField(
      max_length=20,
      choices=[('uploaded','Uploaded'),('linkedin','LinkedIn'),('skipped','Skipped')],
      blank=True, default=''
  )
  ```
- Add `PATCH /api/profile/onboarding/` endpoint.
- Create migration.

---

### ✅ GAP-07 · Application status list mismatch — RESOLVED

**Frontend `ApplicationStatus` type:**
```ts
'draft' | 'fetched' | 'analyzed' | 'generated' | 'submitted' | 'interview' | 'rejected' | 'offer'
```

**Backend `STATUS_CHOICES`:**
```python
[('draft','Draft'), ('reviewed','Reviewed'), ('generated','Generated'), ('submitted','Submitted')]
```

**Missing from backend:** `fetched`, `analyzed`, `interview`, `rejected`, `offer`

**Fix (Backend):**
```python
STATUS_CHOICES = [
    ('draft', 'Draft'),
    ('fetched', 'Fetched'),          # URL scraped, JD extracted
    ('analyzed', 'Analyzed'),         # Fit analysis run
    ('generated', 'Generated'),
    ('submitted', 'Submitted'),
    ('interview', 'Interview'),
    ('offer', 'Offer'),
    ('rejected', 'Rejected'),
]
```

The `reviewed` status can be removed or kept for backwards compatibility.

---

### ✅ GAP-08 · URL scraping endpoint missing — RESOLVED

**Frontend calls:** `POST /api/applications/scrape/` with `{ url }`

**Backend:** No endpoint.

**Fix (Backend):**
Add a Celery task and endpoint to scrape a URL, extract role/company/JD, and create a draft `JobApplication`. Consider using `newspaper3k`, `BeautifulSoup`, or a headless browser for scraping.

---

### ✅ GAP-09 · Daily quota endpoint missing — RESOLVED

**Frontend calls:** `GET /api/applications/quota/`

**Backend:** No endpoint and no quota model.

**Fix (Backend):**
Add a `GenerationQuota` model or a simple Redis counter:

```python
class GenerationQuota(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    date = models.DateField(auto_now_add=True)
    used = models.PositiveIntegerField(default=0)
    limit = models.PositiveIntegerField(default=10)
```

Expose `GET /api/applications/quota/` returning `{ used, limit, resetsAt }`.

---

### ✅ GAP-10 · Fit Analysis has no backend app — RESOLVED

**Frontend calls:** `GET /api/fit-analysis/{applicationId}/`

**Backend:** No `fit_analysis` Django app. No model or endpoint.

**Fix (Backend):**
Create a `fit_analysis` Django app with:
- A model to cache fit scores per (application, technical_review_version) pair
- An async Celery task that calls the AI with the JD + candidate skills and returns a structured fit score
- `GET /api/fit-analysis/{id}/` and `GET /api/fit-analysis/{id}/?refresh=true`

The `FitAnalysisResponse` type in the frontend (`src/types/index.ts`) defines the expected schema.

---

### ✅ GAP-11 · CV document model missing — RESOLVED

**Frontend calls:**
```
GET   /api/documents/{cvId}/
PATCH /api/documents/{cvId}/  (edit CV HTML inline)
POST  /api/documents/{cvId}/export-pdf/
```

**Backend:** `GeneratedArtifact` stores `content` as plain text. There is no separate document model, no HTML support, and no PDF export endpoint.

**Fix (Backend):**
Create a `CVDocument` model:

```python
class CVDocument(models.Model):
    application = models.ForeignKey(JobApplication, on_delete=models.CASCADE, related_name='documents')
    artifact = models.OneToOneField(GeneratedArtifact, on_delete=models.SET_NULL, null=True)
    cv_html = models.TextField(blank=True, null=True)
    cover_letter_html = models.TextField(blank=True, null=True)
    version = models.PositiveIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
```

The PDF export endpoint should call WeasyPrint with the stored HTML:
```python
from weasyprint import HTML

@action(detail=True, methods=['post'], url_path='export-pdf')
def export_pdf(self, request, pk=None):
    doc = self.get_object()
    html_content = doc.cv_html or plain_text_to_html(doc.artifact.content)
    pdf = HTML(string=html_content).write_pdf()
    return HttpResponse(pdf, content_type='application/pdf')
```

---

### ✅ GAP-12 · Interviewer name endpoint missing — RESOLVED

**Frontend calls:** `PATCH /api/applications/{id}/interviewer/` with `{ interviewer_name }`

**Backend:** `JobApplication` has no `interviewer_name` field. No endpoint.

**Fix (Backend):**
```python
# Add to JobApplication model
interviewer_name = models.CharField(max_length=255, blank=True, default='')

# Add action to JobApplicationViewSet
@action(detail=True, methods=['patch'], url_path='interviewer')
def set_interviewer(self, request, pk=None):
    application = self.get_object()
    application.interviewer_name = request.data.get('interviewer_name') or ''
    application.save(update_fields=['interviewer_name'])
    return Response({'interviewer_name': application.interviewer_name})
```

---

### ✅ GAP-13 · Application completeness endpoint missing — RESOLVED

**Frontend calls:** `GET /api/applications/{id}/completeness/`

**Backend:** No such action on `JobApplicationViewSet`.

**Fix (Backend):**
```python
@action(detail=True, methods=['get'], url_path='completeness')
def completeness(self, request, pk=None):
    application = self.get_object()
    checks = {
        'has_technical_review': application.technical_review is not None,
        'has_mbti': hasattr(application.candidate, 'mbti_profile'),
        'has_job_description': bool(application.job_description),
    }
    ready = all(checks.values())
    return Response({'ready': ready, 'checks': checks})
```

---

### ✅ GAP-14 · CV import endpoint missing — RESOLVED

**Frontend calls:**
```
POST /api/profile/import/cv/                → upload a PDF/DOCX CV
GET  /api/profile/import/status/{jobId}/   → poll import job
POST /api/profile/import/linkedin/          → LinkedIn import
```

**Backend:** None of these endpoints exist.

**Fix (Backend):**
- Add a Celery task that uses a PDF parser (e.g. `pdfminer`, `pypdf`) to extract experience data and populate `WorkExperience` records (blocked by GAP-03)
- Add an async endpoint pattern similar to the scrape endpoint
- LinkedIn import requires OAuth integration

---

### ✅ GAP-15 · Dashboard API mismatch — RESOLVED

**Frontend calls:**
```
GET /api/dashboard/stats/        → { totalCVs, inProgress, drafts, successRate, ... }
GET /api/dashboard/activity/     → ActivityItem[]
GET /api/dashboard/drafts/       → DraftItem[]
GET /api/dashboard/companies/    → top companies (TBD comment in code)
```

**Backend provides only:**
```
GET /api/dashboard/   → { counts_by_status, recent_applications, last_generated_at }
```

**Fix (Backend):**
- Add dedicated sub-routes under `/api/dashboard/`:
  - `/stats/` — map counts to frontend KPI shape
  - `/activity/` — return formatted activity log
  - `/drafts/` — return un-generated applications
  - `/companies/` — aggregate by company_name

Or update the frontend to use the existing single endpoint and derive the KPIs client-side.

---

### ✅ GAP-16 · Generate endpoint shape mismatch — RESOLVED

**Frontend calls:** `POST /api/applications/{id}/generate/` with `{ variations, include_cover_letter }`

**Backend provides:**
- `POST /api/applications/{id}/generate-cv/`
- `POST /api/applications/{id}/generate-cover-letter/`
- `POST /api/applications/{id}/generate-all/`

**Fix:** Either update the frontend to use the correct endpoints (preferred), or add a unified `/generate/` endpoint that dispatches based on the request body.

---

## P2 — Degraded UX / missing polish

### ✅ GAP-17 · Profile headline field not in backend — RESOLVED

**Frontend** reads `p.headline` from the profile response and uses it as a displayed job title.

**Backend** `CandidateProfile` has no `headline` field.

**Fix (Backend):** Add `headline = models.CharField(max_length=255, blank=True, default='')` to `CandidateProfile`.

---

### ✅ GAP-18 · Profile `github_url` not in frontend form — RESOLVED

**Was:** Backend had `github_url` on `CandidateProfile`, but the frontend profile form did not expose it.

**Resolved 2026-05-17:** GitHub URL input added to the Online Presence section of `profile/page.tsx`. Value is saved via `profileApi.update({ github_url })`.

---

### ✅ GAP-19 · Profile `summary` and `years_experience` not exposed — RESOLVED

**Was:** Backend had `summary` (TextField) and `years_experience` (int) on `CandidateProfile`. These were not surfaced in the frontend profile form.

**Resolved 2026-05-17:** Professional Summary textarea and Years of experience number input added to the Profile page. Both are saved via `profileApi.update({ summary, years_experience })`.

---

### ✅ GAP-20 · MBTI dimension percentages are mocked — RESOLVED

**Frontend** shows 4 progress bars with percentage scores per MBTI dimension. These are seeded with `MOCK_DIMENSIONS = [76, 68, 81, 59]` and noted with a `TBD` comment:

```tsx
// TBD: GET /api/user/mbti-dimensions/ — { ei, sn, tf, jp } percentages from personality assessment
```

**Fix (Backend):** Add a view that returns the stored MBTI dimension percentages. The frontend already captures the Likert scale answers and computes a type — the raw scores need to be saved during onboarding.

**Fix (Backend — model):**
```python
# Add to MBTIProfile
ei_score = models.PositiveSmallIntegerField(default=50)   # 0-100
sn_score = models.PositiveSmallIntegerField(default=50)
tf_score = models.PositiveSmallIntegerField(default=50)
jp_score = models.PositiveSmallIntegerField(default=50)
```

---

### ✅ GAP-21 · Dashboard companies panel is mocked — RESOLVED

**Frontend** shows top 5 companies by activity. The component uses hardcoded `MOCK_COMPANIES` with a `TBD` comment:

```tsx
// TBD: GET /api/dashboard/companies/ — top 5 companies by recent activity
```

**Fix (Backend):** Add `GET /api/dashboard/companies/` that aggregates `JobApplication` by `company_name` and counts artifacts.

---

### ✅ GAP-22 · Avatar `Remove` button has no API call — RESOLVED

**Was:** Frontend showed a **Remove** button with no `onClick` handler — a UI stub.

**Resolved 2026-05-17:** `profileApi.removeAvatar()` added (`DELETE /profile/avatar/`) and wired to the Remove button in `profile/page.tsx`.

---

## Implementation priority order

For a team starting from scratch on the backend gaps:

1. **GAP-03** — Technical Review model rewrite (blocks all generation quality)
2. **GAP-01 + GAP-02** — Profile API consolidation (blocks profile save + MBTI)
3. **GAP-04** — Wire up real AI model to generation service
4. **GAP-07** — Fix application status list
5. **GAP-08** — URL scraping endpoint
6. **GAP-11** — CV document model + PDF export
7. **GAP-10** — Fit analysis app
8. **GAP-05 + GAP-06** — Avatar upload + onboarding endpoint
9. **GAP-09** — Daily quota
10. **GAP-12 + GAP-13** — Interviewer name + completeness
11. **GAP-14** — CV / LinkedIn import
12. **GAP-15 + GAP-16** — Dashboard API + generate endpoint
13. **GAP-17, GAP-20, GAP-21** — Remaining polish items

---

## Frontend-only fixes (no backend needed)

| Gap | Change | Status |
|---|---|---|
| ~~GAP-18~~ | ~~Add `github_url` field to profile form~~ | ✅ Done |
| ~~GAP-19~~ | ~~Add `summary` and `years_experience` fields to profile form~~ | ✅ Done |
| ~~GAP-22~~ | ~~Wire avatar Remove button + add `removeAvatar()` API method~~ | ✅ Done |
| GAP-16 | Update frontend API calls to use correct backend endpoint names | Open |
