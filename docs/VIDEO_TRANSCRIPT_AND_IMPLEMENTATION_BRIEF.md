# Video Transcript And Implementation Brief

Source video: `New video and website pdf prints/PXL_20260704_153019068.mp4`  
Duration: about 4 minutes 43 seconds  
PDF references: `New video and website pdf prints/1.pdf` through `9.pdf`

## Cleaned Agent-Ready Transcript

The video shows the `eReturn OFFICE` interface for practicing NBR return entry. The visible workspace has a left sidebar with `PSR Detail Entry`, `Double Entry Scores`, and `Double Entry Report`. The top bar has an assessment-year selector, search box, `Third Party User 1`, and a profile icon.

The user starts from the PSR detail/dashboard area. For the practice version, there should be one taxpayer/entry row. Its entry status begins as `NOT_INITIALIZED`. The trainee clicks the row action to start data entry.

The first step is `Assessment`. The form is a bordered Bangla panel inside the office shell. Required fields are marked with red stars. The visible required fields are the return register serial number, return register volume number, return filing date, TIN, tax year, section, and residential status. Some values are prefilled or locked, including register serial number, TIN, tax year, and section. The user fills the missing required register volume/date fields and saves before moving forward.

The assessment form also includes taxpayer name, circle, tax zone, special-benefit checkboxes, birth date, spouse information, contact address, telephone, mobile, email, employer name, business name, BIN, and partner/member name and TIN.

After saving Assessment, the user moves to `Income and Tax`. Initially, only `Income and Tax summary` should be usable. The summary page contains income source rows with checkboxes and amount inputs. If the employment row is checked, a required `চাকরির ধরণ` choice appears with `সরকারি` and `অন্যান্য`. The employment schedule is not available until one of those job types is chosen. Rent, financial assets, and tax rebate each unlock their own schedule tabs only when their checkbox is selected.

The PDFs provide the exact tables for the income pages. PDF 1 contains the income summary, tax calculation, and tax payment rows. PDF 2 contains the employment schedule. PDF 3 contains the rent schedule. PDF 4 contains the financial assets schedule. PDFs 5 and 6 contain the tax rebate schedule.

The form then moves to `Assets`, which has `Assets Summary` and `Living Expenditure`. PDF 7 is the assets summary source. PDFs 8 and 9 show the living expenditure table. After the final living expenditure page is saved, the user can save the return.

When a trainee saves the return, the attempt should be logged for admin review and the trainee should be returned to the dashboard to start a fresh blank attempt. Trainees should not browse old attempts. The admin dashboard should show users, attempts, scores, and a preview. Exact scoring rules are not shown in the video and should remain placeholder until provided.

## Field Sources

- `1.pdf`: Income and Tax summary, tax calculation, payment rows.
- `2.pdf`: Income from employment.
- `3.pdf`: Income from rent.
- `4.pdf`: Income from financial assets.
- `5.pdf` and `6.pdf`: Tax rebate.
- `7.pdf`: Assets Summary.
- `8.pdf` and `9.pdf`: Living Expenditure.
- Video: dashboard, assessment tab, required fields, save/next behavior, office shell context.

## Current Implementation Notes

- The current app uses manual numbers only; it does not calculate totals.
- Required fields block draft save and show a red toast.
- Successful saves show a green toast and unlock next navigation.
- Admin credential is `admin / admin2026`.
- Attempts are stored in localStorage until Supabase is connected.
