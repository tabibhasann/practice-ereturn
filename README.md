# Practice eReturn Office

A local training simulator for the Bangladesh NBR eReturn Office data-entry workflow shown in the supplied PDFs and video.

This is not connected to the real NBR website. It is a safe practice clone where trainees can repeatedly fill a return-like form before using the production system.

## Current Flow

- Admin creates trainee usernames from the admin dashboard.
- Trainees sign in with only their username. No trainee password is required.
- The trainee dashboard shows exactly one `NOT_INITIALIZED` PSR row.
- `Start Practice` opens a blank, unscored practice return. Practice is unlimited and only its completion count is retained.
- `Begin Assessment` opens Assessment 1 after confirmation. Assessments 2-7 remain visibly locked.
- The form starts at `Assessment`, then moves to `Income and Tax`, then `Assets`.
- `Save Draft` validates required red-star fields. Errors show a red toast; successful saves show a green toast.
- `Next` becomes available only after the current page is saved.
- Income schedule tabs appear only after the matching source is selected:
  - employment + job type enables `Income from employment`
  - rent enables `Income from rent`
  - financial assets enables `Income from financial assets`
  - tax rebate enables `Tax rebate`
- Number fields are manual. Totals are not automatically calculated.
- The final action is `Complete Practice` in practice mode and `Submit Assessment` in assessment mode.
- Created usernames, practice counts, and assessment submissions are stored in Supabase. Production sign-in is disabled when Supabase configuration is missing, so the app cannot silently create browser-only accounts.

## Admin

The production admin credential is provisioned separately. The password is salted and PBKDF2-hashed in Supabase; successful login issues a random, expiring server-side session that is revoked at logout. Neither the password nor an admin secret is bundled into the frontend.

## Data safety

- Production data is stored only in Supabase project `wiqtbrexjjqzdtyvbwdm` (`practice-ereturn`). The app does not create browser-only users or attempts when Supabase is unavailable.
- Usernames, practice counts, and assessment submissions synchronize directly to Supabase; no manual browser export is needed for normal operation.
- Restrict Supabase organization membership, enable MFA for every owner, and pause rather than delete the project. Supabase treats project deletion as permanent.
- Database schema, policies, scoring logic, and Edge Function source are versioned in this repository. Production secrets are not.

The admin dashboard shows trainee practice counts and Assessment 1 submissions, scores, exact mistakes, and a full-form preview. Trainees never see scores, mistakes, or submission history. The marking key is derived from `new video.mp4`; its 110 visibly populated answers are compared on the server and normalized to a two-decimal percentage.

The admin dashboard can create and copy trainee usernames, deactivate and restore access, and permanently delete usernames that have never recorded practice or assessment activity. Users with activity must be deactivated so their audit history remains intact.

## Supabase Note

For about 500 assessments, JSON-only storage should be small, usually only a few megabytes. Practice stores only a counter and timestamp, not the form payload. The main storage risk would come from generated PDFs, screenshots, or attachments; those should go into Supabase Storage only if needed.

Older browser-only records are synchronized silently after a successful login. A valid admin login can restore usernames and attempts from that browser; a trainee login can restore that existing trainee's first attempt. The server deduplicates recovered attempts and recalculates every score.

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
npm test
npm run build
```

More context:

- [Project Explanation](docs/PROJECT_EXPLANATION.md)
- [Coverage Audit](docs/COVERAGE_AUDIT.md)
- [Video Transcript and Implementation Brief](docs/VIDEO_TRANSCRIPT_AND_IMPLEMENTATION_BRIEF.md)
- [Supabase Plan](docs/SUPABASE_PLAN.md)
