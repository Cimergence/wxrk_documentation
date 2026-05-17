---
title: Applications
sidebar_label: Applications
---

# Applications

An **Application** in WXRK links a job description to your profile and technical review. It is the starting point for generating a CV and cover letter.

Navigate to **Applications** from the left sidebar.

---

## Creating a new application

Click **+ New application** (or the `+` button) to open the creation form.

### Input method

Choose how you want to provide the job description:

| Mode | How it works |
|---|---|
| **URL** | Paste the link to the job posting — WXRK scrapes the page and extracts the description automatically |
| **Paste** | Copy the job description text and paste it directly |

#### URL mode (recommended)

1. Paste the full job posting URL (must start with `http://` or `https://`)
2. Click **Fetch** — WXRK sends the URL to the backend, which scrapes the page
3. A toast confirms the company name and role once extracted
4. Review the extracted description in the preview panel

If the URL fails to scrape (paywall, login-required pages), fall back to **Paste** mode.

#### Paste mode

Paste the full job description text. There is no minimum length, but longer descriptions produce better-tailored output.

---

### Personal context (optional)

Expand the **Personal context** section to add a note to yourself about why you want this role:

- Why this company?
- What excites you about the role?
- Anything you want the cover letter to emphasise?

This text is passed to the AI and influences the cover letter narrative.

### Additional information (optional)

Expand **Additional information** for any extra context:

- Salary expectations
- Referral details
- Specific requirements you want to address

---

### Daily quota

WXRK enforces a **daily generation quota** (currently 10 applications per day). The quota resets at midnight. If you hit the limit, you can still create draft applications and generate once the quota resets.

---

## Application list

The main Applications page shows all your applications. Three views are available:

### List view
Compact table sorted by creation date (newest first). Shows company, role, status badge, and creation date.

### Tile view
Card grid — good for visual scanning. Shows company initials, role, snippet of the job description, and status.

### Kanban view
Columns organised by status:

| Column | Meaning |
|---|---|
| **Draft** | Created but not yet generated |
| **Generated** | CV / cover letter produced |
| **Submitted** | You have applied |
| **Interview** | You have an interview scheduled |
| **Offer** | An offer has been made |
| **Rejected** | Application closed |

Drag cards between columns to update status. This is your application pipeline tracker.

---

## Filtering and sorting

- **Filter by status** — All / Draft / Generated / Submitted / Interview / Rejected / Offer
- **Sort by** — Newest / Oldest / Company name
- **Search** — Search by company name or role title

---

## Application status lifecycle

```
Draft → Generated → Submitted → Interview → Offer
                                          ↘ Rejected
```

You can manually move an application to any status at any time from the application detail page or the Kanban board.

---

## Deleting an application

Swipe left (mobile) or use the three-dot menu (desktop) on a list item to delete. Deletion is permanent but shows an **undo toast** for 5 seconds.
