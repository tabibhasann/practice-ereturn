# NBR eReturn Office Practice Form - Video Transcript and Build Brief

Source video: `WhatsApp Video 2026-07-03 at 20.47.20.mp4`  
Duration: 46:16  
Visual target: Bangladesh NBR `eReturn OFFICE` / `TIN Registration` style web form.

## Important Reference Images

Use these images as the primary visual references:

- `extracted/contact_01.jpg` - first 20 minutes overview: login, TIN login page, dashboard, assessment form, income summary.
- `extracted/contact_02.jpg` - middle workflow overview: income/tax schedules, calculations, repeated table entry.
- `extracted/contact_03.jpg` - final workflow overview: last entry screens and generated return/PDF/Excel-style output.
- `extracted/frames/frame_00-07-30.jpg` - assessment/personal information form with header/sidebar.
- `extracted/frames/frame_00-15-00.jpg` - Income and Tax summary table with checkboxes and amount fields.
- `extracted/frames/frame_00-25-00.jpg` - Assets section with Bangla labels and amount fields.
- `extracted/screenshots/app-income-tax.png` - implemented clone reference screenshot.
- `extracted/screenshots/app-assessment.png` - implemented assessment screen screenshot.
- `extracted/screenshots/app-preview.png` - implemented print/return preview screenshot.

## Transcript Quality Note

The audio is a compressed phone/WhatsApp screen-recording narration in Bangla. Local Whisper ASR was attempted with multilingual and Bengali-forced models, but the raw output contained many recognition errors and occasional wrong-script text. Raw partial machine outputs are saved in `extracted/transcript/` for audit, but the transcript below is a cleaned agent-ready transcript based on the spoken intent plus visual evidence from the video frames. Treat it as a faithful workflow transcript, not a legal verbatim subtitle file.

## Cleaned Agent-Ready Transcript

The narrator begins by greeting the viewer and explaining that this video shows the data-entry system used for NBR/eReturn Office practice. The purpose is to explain how a third-party or office user enters taxpayer return information before trying it on the real site.

The narrator explains that before starting, the operator should collect the taxpayer's required documents and information. The important inputs include NID card information, mobile number, email address, employer or business information, and any supporting tax/return information. The operator will need a user ID and password for the office/practice system. An OTP may be sent to the registered mobile number during login or verification.

The video first shows a login-style page and then a TIN Registration page. The narrator indicates that the operator logs in using the provided credentials. After login, the user reaches the eReturn Office interface. The UI has a large `eReturn OFFICE` logo at top-left, a pale blue/gray layout, a left sidebar, and a top bar with assessment year selector, search box, and a third-party user profile area.

The narrator then shows the `PSR Detail Entry` area. The operator selects the assessment year, searches if necessary, and opens a taxpayer return row. The dashboard/table contains taxpayer details such as TIN, name, assessment year, zone, circle, status, and an action button. The narrator explains that the operator should choose the correct taxpayer and correct year before entry.

The return entry form opens in a step-based screen. At the top-right of the form are step pills: `Assessment`, `Income and Tax`, and `Assets`. The narrator starts with the assessment/personal information area. This section contains Bangla numbered fields for taxpayer identity and contact details. Visible fields include taxpayer name, NID, tax zone/circle, address, mobile number, email, employer name for salaried taxpayers, business name, BIN, and partner/member information if applicable. The operator enters or checks these fields one by one.

Next, the narrator moves to `Income and Tax`. Inside this step are tabs such as `Income and Tax summary`, `Income from employment`, and other tax/rebate or calculation tabs. The `Income and Tax summary` table lists sources of income in Bangla. Each row has a checkbox and an amount field. Visible examples include income from salary/employment, house rent, agriculture, business, capital gain, financial assets, and other sources. The narrator demonstrates checking the relevant source and entering amounts, such as salary income around 300,000, financial asset income, and other income amounts.

The narrator then opens the employment/salary schedule. This table contains salary-related lines such as basic salary, bonuses/festival allowance, medical allowance, house rent allowance, transport allowance, and other benefits. The operator fills gross amount, exempt amount, and taxable amount columns. The video repeatedly shows entering numbers into cells and moving through rows.

The narrator continues through additional income and calculation pages. The form uses many Bangla tables with numbered rows, amount fields, and automatic or manually entered totals. The operator enters relevant figures and leaves non-applicable rows as zero. The narrator emphasizes matching the taxpayer's real documents and ensuring the totals are correct.

The video then moves into tax calculation/rebate/payment-like sections. The operator enters or reviews total income, tax-free threshold, calculated tax, deducted tax, and payable tax. The form has `Save Draft`/navigation controls at the bottom. The narrator demonstrates saving or moving forward after entering values.

Next, the narrator goes to the `Assets` section. The assets form contains Bangla rows for cash/bank balance, savings certificates/shares/debentures, motor vehicles, gold/jewelry, furniture/electronic items, business-excluded cash/funds, loans given, and other investments. Each row has a Taka amount field. The operator enters known assets and keeps other rows at zero. A total assets line appears at the bottom.

Near the end, the narrator shows a generated return/output document in a spreadsheet/PDF-like view. It resembles a formal income tax return with pages and a red top border in the external viewer. The output contains taxpayer identity, income totals, tax calculation, asset statements, verification/signature, and additional return pages. The narrator scrolls through several pages, showing that the data entered in the web form feeds into this final generated return.

The overall goal of the video is to teach operators how to practice entering NBR eReturn data: log in, select taxpayer/year, fill assessment information, enter income and salary schedules, enter tax/rebate/payment amounts, enter assets, save/preview, and verify the generated return before using the real production website.

## Visual/UI Requirements for a Clone

- Use a pale blue/gray office-style background.
- Keep a fixed left sidebar on desktop with `eReturn OFFICE` logo, hamburger menu, and menu items `PSR Detail Entry` and `Double Entry Scores`.
- Keep a top bar with assessment year selector, search input, search button, `Third Party User 1`, and a circular profile icon.
- Dashboard must show a table of taxpayer rows with an `Entry` action.
- Form screen must have step pills: `Assessment`, `Income and Tax`, `Assets`.
- `Assessment` should use a large bordered Bangla form area with line-numbered personal/taxpayer fields.
- `Income and Tax` should use tab buttons and table rows with checkboxes and Taka amount fields.
- `Assets` should use a Bangla amount table.
- Bottom actions should include `Save Draft` and `Preview Return`.
- Preview should show a printable return summary and print button, matching the final output concept from the video.

## Implemented Practice App

The local implementation is in `practice-ereturn/`.

Main files:

- `practice-ereturn/src/App.jsx`
- `practice-ereturn/src/App.css`
- `practice-ereturn/src/index.css`

Run:

```bash
cd practice-ereturn
npm install
npm run dev -- --host 127.0.0.1
```

Open:

```text
http://127.0.0.1:5173/
```

Verified screens are saved in `extracted/screenshots/`.
