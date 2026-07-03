# Coverage Audit After Frame Review

This audit compares the saved video frames/contact sheets with the practice app in `practice-ereturn/`.

## Reference Folders

- Important frames: `extracted/important_frames/`
- Original frame extraction: `extracted/frames/`
- Contact sheets: `extracted/contact_01.jpg`, `extracted/contact_02.jpg`, `extracted/contact_03.jpg`
- Latest implementation screenshots: `extracted/screenshots/`

## Added To The App

The app now includes these sections visible in the video:

1. eReturn Office login with `User Manual`, `User ID`, `Reset password?`, and link to TIN Registration.
2. Separate TIN Registration practice screen with `TIN REGISTRATION` banner, nav buttons, login form, quick-management buttons, and eReturn user link.
3. eReturn Office shell with sidebar, year selector, search, third-party user, avatar, and collapse control.
4. PSR Detail Entries dashboard with filter panel, 12 digit TIN input, assessment year/status selectors, reset, show-entries selector, and expanded PSR table columns.
5. Assessment form expanded to rows ১-১৪ with personal/contact/employer/business/BIN/partner fields.
6. Income and Tax summary expanded through rows ১-১০ plus total row, including employment-type radio controls for salary income.
7. Income from employment table expanded with salary/allowance/exemption/taxable amount columns.
8. Income from rent / house property workflow with property location/description, annual rental income, claimed expenses, municipal/local tax, land revenue, interest/mortgage/capital charge, insurance, vacancy, other, and net income.
9. Financial asset income table with bank interest/profit, dividend, savings certificate profit, securities income, other, and net.
10. Tax calculation table with rows ১১-১৯: total income, taxable-income tax, rebate, post-rebate tax, minimum tax, payable tax, surcharge/environment surcharge, special interest/fine, and total payable tax.
11. Tax payment table with rows ২০-২৬: source tax, advance tax, refundable adjustment, tax paid with return, total paid tax, excess payment, and tax-exempt/tax-free income.
12. Investment rebate table with visible investment/rebate categories.
13. Assets step with `Asset Summary` and `Living Expenditure` tabs.
14. Asset Summary long statement covering business capital, director shares, partnership capital, non-agricultural property, agricultural property, financial assets, savings/DPS, loans, deposits, provident fund, motor vehicles, jewelry, furniture/electronics, other assets, liabilities, current/previous net wealth, and total assets.
15. Living Expenditure table with expense/source-of-fund rows and a green `Save Return` style action.
16. Preview expanded from one page to multiple generated return-style pages:
    - Summary page.
    - Individual taxpayer return page with photo/tick-box identity layout.
    - Tax computation/payment/refund page.
    - Assets/liabilities/source-of-fund page.
    - Generated schedules including employment, house property, and investment tax credit.
    - Instruction/checklist page.

## Still Not Perfect / Cannot Guarantee

- Some Bangla labels in the video are small, blurred, or partially hidden by cursor/highlight. I recreated every distinct section and all labels that were readable or inferable from the frames.
- The generated Excel/PDF output is represented as native HTML pages, not a real spreadsheet export.
- Data propagation is partial: main totals update from the practice income table, but every schedule row is not wired into one official tax computation engine.
- The UI is a training simulator, not a connection to the real NBR server.

## Verification

Latest build passes with:

```bash
cd practice-ereturn
npm run build
```

Latest screenshots generated:

- `extracted/screenshots/app-tin-registration.png`
- `extracted/screenshots/app-dashboard-expanded.png`
- `extracted/screenshots/app-income-expanded.png`
- `extracted/screenshots/app-assets-expanded.png`
- `extracted/screenshots/app-living-expenditure.png`
- `extracted/screenshots/app-preview-expanded.png`
