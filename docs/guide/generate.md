---
title: Generate CV & Cover Letter
sidebar_label: Generate CV & Cover Letter
---

# Generate CV & Cover Letter

Once you have a job application and a technical review, WXRK can generate tailored documents for you. Generation happens asynchronously — you submit the request and poll for the result.

Open an application from the Applications list to reach the **Application Detail** page.

---

## Prerequisites checklist

Before generating, make sure:

| Requirement | Why it matters |
|---|---|
| ✅ Technical Review exists | The AI uses your experience data to match the job description |
| ✅ MBTI profile set | Required for cover letter generation |
| ✅ Job description is present | The AI needs the target job to optimise against |

The application detail page shows a **completeness indicator** that flags any missing requirements.

---

## Generation options

### Generate CV only

Click **Generate CV** (or the dropdown option). WXRK:

1. Sends your technical review and the job description to the AI
2. The AI selects the most relevant experiences, projects, and skills
3. Produces a structured CV optimised for the role
4. Status changes to **Generated**

### Generate Cover Letter only

Click **Generate Cover Letter**. WXRK:

1. Uses your technical review + MBTI type + job description + personal context
2. Writes a cover letter in your personality voice
3. Typically 3–4 paragraphs

### Generate both at once

Click **Generate All** to run both tasks simultaneously. This is the fastest path when applying to a new role.

---

## Waiting for results

Generation is asynchronous. While WXRK processes your request:

- A **status indicator** shows the current task state: `PENDING → STARTED → SUCCESS`
- The page polls the backend every few seconds
- Most generations complete in **10–30 seconds**

If generation fails (timeout, API error), a toast notification explains the error. You can retry by clicking the generate button again.

---

## Reviewing and editing

Once generated, the CV and cover letter appear in separate tabs on the application detail page.

### CV tab
- Full CV text rendered in a structured layout
- **Edit** the text inline if you want to tweak wording, reorder sections, or add context the AI missed
- **Word count** shown in the header

### Cover Letter tab
- Full cover letter text
- **Edit** inline
- Anchored to a specific CV document — regenerating the CV does not overwrite the cover letter unless you explicitly request it

---

## Exporting as PDF

Click **Export PDF** to download a formatted PDF of the CV or cover letter.

:::info PDF generation
PDFs are generated server-side using WeasyPrint. If you encounter rendering issues (fonts, layout), see the [Gap Report](../dev/gap-report) for known limitations.
:::

---

## Fit Analysis

The **Fit Analysis** tab shows how well your profile matches the job description. It includes:

- Overall fit score
- Skill match breakdown
- Gap analysis — skills in the job description you do not yet have on your profile
- Suggested improvements

Use the fit analysis before generating to identify areas where adding more detail to your Technical Review would improve output quality.

---

## Timeline and notes

The application detail page includes a **Timeline** section where you can:

- Add notes about the application (interview dates, hiring manager name, recruiter contact)
- Log events as the application progresses
- Record the interviewer name (used to personalise future communications)

---

## Regenerating

You can regenerate documents at any time. If the application status is **Submitted**, WXRK will warn you before overwriting. Pass `?force=true` in the URL to bypass this check.

:::warning Regeneration overwrites
Each generation creates a new artifact, but only the latest version is shown in the UI. Previous generated versions are stored in the database and can be retrieved via the API.
:::

---

## Force-regenerating a submitted application

If you need to regenerate after submitting (e.g. to apply to a similar role at another company):

1. Open the application
2. Click **Generate** — a warning modal appears
3. Confirm to proceed

Or duplicate the application and generate fresh documents on the copy.
