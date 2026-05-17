---
title: Technical Review
sidebar_label: Technical Review
---

# Technical Review

The **Technical Review** is the most important section in WXRK. It is your structured career database — the raw material the AI uses to produce tailored CVs.

Think of it as a very detailed version of your LinkedIn experience section, enriched with projects, skill ratings, STAR stories, and emotional context.

Navigate to **Technical Review** from the left sidebar.

---

## Overview

Each **Experience** represents one role at one company. You can add as many experiences as you like. Within each experience you can add:

- **Projects** — specific deliverables or initiatives you worked on
- **STAR Stories** — structured behavioural examples
- **Emotional Context** — manager style, work environment, and stress level (used internally to calibrate tone, not exported)

---

## Adding a work experience

Click **+ Add experience** (or the `+` icon) to open a new experience panel.

### Required fields

| Field | Description |
|---|---|
| **Company name** | Name of the employer |
| **Job title** | Your official title in that role |
| **Start date** | Month and year (YYYY-MM format) |
| **End date / Present** | Month and year, or toggle "Currently here" |

### Optional fields

| Field | Description |
|---|---|
| **Company description** | One-line description of what the company does |
| **Location** | City or Remote |
| **Summary** | A 2–4 sentence narrative of what you did |
| **Technical skills** | Tag list — languages, frameworks, tools |
| **Software tools** | Tag list — platforms, services, IDEs |
| **General skills** | Tag list — soft skills, methodologies |

---

## Adding projects

Within an experience, click **+ Add project** to document a specific deliverable.

| Field | Description |
|---|---|
| **Project name** | Short, descriptive name |
| **Impact metric** | Quantified outcome (e.g. *Reduced latency by 40%*) |
| **Summary** | What you built and how |
| **Tech stack** | Tags for technologies used |

:::tip Quantify everything
Impact metrics are the single most powerful input for CV generation. Always aim for numbers: *"Reduced cold-start time from 4s to 800ms"*, *"Increased test coverage from 12% to 87%"*, *"Cut infrastructure cost by $18k/month"*.
:::

---

## Adding STAR stories

STAR stories are structured behavioural examples used in interviews and cover letters.

| Field | Description |
|---|---|
| **Situation** | What was the context? |
| **Task** | What were you responsible for? |
| **Action** | What did you specifically do? |
| **Result** | What was the outcome? (quantify if possible) |
| **Tags** | Category labels: leadership, delivery under pressure, conflict, performance, mentoring, stakeholder |

---

## Emotional context

Each experience has an optional **Emotional Context** section. This is not exported to your CV — it is used to fine-tune the *tone* of cover letters written for similar roles.

| Field | Options |
|---|---|
| **Manager style** | Hands-off, outcome-focused / Collaborative, involved / Directive, process-driven / Mentoring, coaching |
| **Work environment** | Remote / Hybrid / On-site |
| **Stress level** | 1 (low) to 5 (high) |
| **Manager note** | Free text — describe the dynamics |
| **Stress note** | Free text — how you handled pressure |
| **Values note** | Free text — what mattered most in this role |

---

## Version history

The Technical Review is versioned. Each time you make significant changes and save, a new version snapshot is stored. You can:

- View the **History** panel (clock icon in the header) to see all versions
- Compare versions to see what changed between two snapshots
- Restore a previous version if needed

---

## Completeness indicator

Each experience card shows a **completeness** status. WXRK considers an experience complete when it has:

- At least one project
- At least one STAR story
- Summary text
- At least three tagged skills

An experience without these items will still be used for CV generation, but the output will be less tailored.

---

## Tips for best results

1. **Add at least 2 experiences** — the AI needs context and contrast to write a strong summary.
2. **Use specific tech stack tags** — generic tags like "backend" are less useful than "Django", "PostgreSQL", "Celery".
3. **Write your STAR stories in first person** — *"I led..."*, not *"We led..."*
4. **Save regularly** — the page auto-saves drafts but explicit saves create version snapshots.
