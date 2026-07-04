# Project Explanation - NBR eReturn Office Practice Website

## What This Project Is

This project is a practice website for an NBR eReturn Office-style data-entry workflow. The real website already exists; this local app is meant to let trainees practice the same screens and form behavior before entering data into the real system.

The app currently uses browser localStorage as a stand-in database. It is structured so the same saved attempt objects can later be written to Supabase.

## What The Video And PDFs Show

The supplied PDFs show the target form screens for `Income and Tax` and `Assets`. The newer video fills in the missing `Assessment` tab and the office dashboard behavior.

The important workflow is:

1. A trainee signs in.
2. The office dashboard shows one PSR detail row with status `NOT_INITIALIZED`.
3. The trainee clicks `Entry`.
4. The form opens on `Assessment`.
5. Required red-star fields must be filled before draft save.
6. `Income and Tax` starts with only `Income and Tax summary`.
7. Extra income tabs only appear when their source checkbox is selected.
8. Every amount field is manual, including total rows.
9. The trainee saves drafts page by page.
10. The final `Assets > Living Expenditure` page unlocks `Save Return`.
11. Saving the return submits the attempt, resets the trainee to the dashboard, and prepares a blank next attempt.
12. The admin can later review submitted attempts.

## Assessment

The video shows an office-side assessment form with a bordered Bangla panel. Required fields include:

- return register serial number
- return register volume number
- return filing date
- TIN
- tax year
- section
- residential status

The page also includes taxpayer name, circle, zone, special-status checkboxes, birth date, spouse details, contact address, telephone/mobile/email, employer, business name, BIN, and partner/member details.

## Income And Tax

The summary page has income source rows with checkboxes and manual amount fields. The app follows the requested behavior:

- employment requires a job type radio (`সরকারি` or `অন্যান্য`) before the employment schedule tab is enabled
- rent enables the rent schedule
- financial assets enables the financial-assets schedule
- tax rebate enables the rebate schedule
- unchecked income-source amount boxes stay disabled
- totals are not calculated automatically

The included schedules match the PDF field catalogs:

- income from employment
- income from rent
- income from financial assets
- tax rebate
- tax calculation and payment rows

## Assets

The assets section has:

- `Assets Summary`
- `Living Expenditure`

The rows are based on PDFs 7, 8, and 9. `Save Return` is only available after reaching and saving the final living-expenditure page.

## Admin Dashboard

Admin credential:

```text
admin / admin2026
```

The admin can see:

- users who submitted attempts
- number of attempts per user
- latest attempt time
- placeholder score
- preview of the latest attempt and detected placeholder issues

Real scoring/mistake rules are not final yet. The current scoring is intentionally simple so the dashboard is ready for the final criteria later.

## Supabase Estimate

For about 500 attempts, storing JSON form data should usually need only a few megabytes. A conservative planning range is 5-25 MB depending on how much text is typed into long fields and how many versions are kept. Storage becomes much larger only if generated PDFs, screenshots, or attachments are saved.
