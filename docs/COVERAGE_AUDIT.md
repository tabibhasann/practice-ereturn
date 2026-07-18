# Coverage Audit

This audit reflects the current implementation after reviewing the new PDFs in `New video and website pdf prints/` and the newer assessment video.

## Confirmed In The App

1. Office shell with `eReturn OFFICE`, sidebar items, assessment-year selector, search, `Third Party User 1`, and avatar.
2. Admin-created trainee usernames.
3. Trainee login with only a username and no trainee password.
4. Admin login using a salted password hash and expiring server-side session.
4. Trainee dashboard with only one row and initial status `NOT_INITIALIZED`.
5. Unlimited practice and Assessment 1 each start a fresh blank form; Assessments 2-7 are locked.
6. Assessment page based on the video:
   - register serial number
   - register volume number
   - filing date
   - TIN
   - tax year
   - section
   - taxpayer name
   - circle/zone
   - residential status radios
   - special-status checkboxes
   - birth/spouse/contact/employer/business/BIN/partner fields
7. Required-field validation with red error toast.
8. Successful draft save with green toast.
9. `Next` locked until save draft.
10. `Income and Tax summary` is the only useful income tab at first.
11. Employment checkbox plus required job type enables `Income from employment`.
12. Rent checkbox enables `Income from rent`.
13. Financial-assets checkbox enables `Income from financial assets`.
14. Tax-rebate checkbox enables `Tax rebate`.
15. Amount fields for unchecked income rows are disabled.
16. All numeric fields are manual, including total rows.
17. Income summary rows 1-11 from PDF 1.
18. Tax calculation rows 12-19 from PDF 1.
19. Payment rows 20-26 from PDF 1.
20. Employment schedule rows from PDF 2.
21. Rent schedule rows from PDF 3.
22. Financial-assets schedule rows from PDF 4.
23. Rebate schedule rows from PDFs 5-6.
24. Assets Summary rows from PDF 7.
25. Living Expenditure rows from PDFs 8-9.
26. Final practice/assessment submission unlocks only after saving `Living Expenditure`.
27. Practice stores only a counter and timestamp; assessment stores the full marked form.
28. Trainees see neither scores nor submission history.
29. Admin dashboard lists users, practice counts, assessment status, latest submission, score, exact mistakes, and full-form preview.

## Placeholder Or Future Work

- Supabase is connected for the current production environment. If configuration is missing, sign-in and writes fail closed.
- Scoring uses 110 visibly answered controls from `new video.mp4`. The Supabase submission function calculates the two-decimal score and mistake list; client-provided scores are ignored.
- Admin preview renders every form page, including fields the trainee left blank.
- Exact pixel-perfect matching may still need small spacing/color tweaks after stakeholder review, but the field coverage and interaction logic are in place.

## Verification Run

The current implementation was verified with:

```bash
npm run lint
npm run build
```

An automated Chromium flow also passed:

- trainee login
- one-row `NOT_INITIALIZED` dashboard
- assessment validation
- save draft / next unlock
- dynamic income tabs
- rent required-field validation
- assets summary to living expenditure
- final save return
- admin dashboard
- admin preview
