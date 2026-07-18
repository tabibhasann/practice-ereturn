# Practice eReturn Office

A local training simulator for the Bangladesh NBR eReturn Office data-entry workflow shown in the supplied PDFs and video.

This is not connected to the real NBR website. It is a safe practice clone where trainees can repeatedly fill a return-like form before using the production system.

## Current Flow

- Admin creates trainee usernames from the admin dashboard.
- Trainees sign in with only their username. No trainee password is required.
- The trainee dashboard shows exactly one `NOT_INITIALIZED` PSR row.
- Clicking `Entry` opens a blank attempt.
- The form starts at `Assessment`, then moves to `Income and Tax`, then `Assets`.
- `Save Draft` validates required red-star fields. Errors show a red toast; successful saves show a green toast.
- `Next` becomes available only after the current page is saved.
- Income schedule tabs appear only after the matching source is selected:
  - employment + job type enables `Income from employment`
  - rent enables `Income from rent`
  - financial assets enables `Income from financial assets`
  - tax rebate enables `Tax rebate`
- Number fields are manual. Totals are not automatically calculated.
- `Save Return` appears on the final living-expenditure page after saving that page.
- Created trainee usernames and submitted attempts are stored in Supabase. Production sign-in is disabled when `VITE_SUPABASE_URL` or `VITE_SUPABASE_PUBLISHABLE_KEY` is missing, so the app can never silently create browser-only accounts.

## Admin

Admin credential:

```text
username: admin
password: admin2026
```

The admin dashboard shows submitted users, attempt counts, server-calculated scores, and a full preview of each attempt. The marking key is derived from `new video.mp4`; every scored field and control is compared on the server, and each mismatch records the expected and submitted answer.

The admin dashboard can also create and copy trainee usernames. Created users appear even before they submit an attempt.

## Supabase Note

For about 500 attempts, JSON-only storage should be small, usually only a few megabytes. The main storage risk would come from saving generated PDFs, screenshots, or attachments; those should go into Supabase Storage only if needed.

## Run Locally

```bash
npm install
npm run dev -- --host 127.0.0.1
```

Open:

```text
http://127.0.0.1:5173/
```

## Verify

```bash
npm run lint
npm run build
```

More context:

- [Project Explanation](docs/PROJECT_EXPLANATION.md)
- [Coverage Audit](docs/COVERAGE_AUDIT.md)
- [Video Transcript and Implementation Brief](docs/VIDEO_TRANSCRIPT_AND_IMPLEMENTATION_BRIEF.md)
- [Supabase Plan](docs/SUPABASE_PLAN.md)
