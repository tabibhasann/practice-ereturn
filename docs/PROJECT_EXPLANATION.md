# Project Explanation - NBR eReturn Office Practice Website

## What This Project Is

This project is a practice/training copy of a Bangladesh NBR eReturn Office data-entry workflow.

The real website already exists. The people who gave the video likely want a separate safe practice website where operators can learn how to enter income tax return data before they use the real government system. The practice site should look and behave like the original screens in the video, but it should not submit anything to the real NBR server.

In simple terms:

- The real site is used for tax return data entry.
- The video teaches how an office/third-party user enters a taxpayer's return data.
- Our project is a training simulator for that workflow.
- Users can practice login, selecting a taxpayer, filling forms, saving drafts, and previewing a generated return.

## Who The Website Is For

This is not mainly for ordinary public users. It appears to be for data-entry operators, tax-office helpers, third-party users, or staff who prepare taxpayer return information.

The UI shows `Third Party User`, `PSR Detail Entry`, and multiple taxpayer rows. That suggests one office user logs in and works on many taxpayer return entries.

## What The Video Shows

The video is a 46-minute screen recording. The narrator explains the workflow in Bangla while moving through the site.

The main flow is:

1. Collect taxpayer documents and information.
2. Log in to the eReturn/TIN related system.
3. Open `eReturn OFFICE`.
4. Go to `PSR Detail Entry`.
5. Select the correct assessment year and taxpayer row.
6. Open the return entry form.
7. Fill `Assessment` information.
8. Fill `Income and Tax` information.
9. Fill salary/employment, rent/house property, financial asset income, tax calculation, tax payment, and rebate information.
10. Fill `Assets` and living expenditure information.
11. Save the return/draft.
12. Generate or preview the return.
13. Review the final return pages/schedules in an Excel/PDF-like output.

## Screen 1 - eReturn Office Login

The first relevant site is an eReturn Office login screen.

Important visible pieces:

- NBR/eReturn Office branding.
- `User Manual`.
- `Welcome!`
- User ID field.
- Password field.
- Reset password link.
- Sign in button.

Purpose:

The office user logs in before reaching the work dashboard.

## Screen 2 - TIN Registration Login

The video also shows a separate `TIN REGISTRATION` website.

Important visible pieces:

- `TIN REGISTRATION` banner.
- Navigation: `Home`, `Login`, `Register`, `Forget Password`, `Third Party TIN Verification`, `Return Verify`.
- Login form.
- `Do not have User ID? Register`.
- `eReturn User ID`.
- Side buttons: `Quick Management`, `Utility Services`, `API Service`.

Purpose:

This is related to taxpayer identification and user access. It is not the main return-entry form, but it appears in the workflow/context.

## Screen 3 - PSR Detail Entries Dashboard

After login, the user reaches the `eReturn OFFICE` workspace.

Important visible pieces:

- Left sidebar:
  - `PSR Detail Entry`
  - `Double Entry Scores`
- Top bar:
  - assessment year selector
  - search box
  - `Third Party User`
  - profile icon
- Dashboard:
  - filter by 12 digit TIN
  - assessment year selector
  - status selector
  - `Filter Data`
  - `Reset`
  - show entries selector
  - table of taxpayers

The table includes data like:

- serial number
- TIN
- submission date
- taxpayer name
- submission section
- assessment year
- total income
- total tax paid
- tax paid under section 173
- net asset
- PSR status
- entry status
- entry action button

Purpose:

The operator picks the taxpayer return they want to work on.

## Screen 4 - Assessment Step

The return entry form has three main step pills:

- `Assessment`
- `Income and Tax`
- `Assets`

The `Assessment` step contains taxpayer identity and personal/business details.

Visible/inferred fields include:

- taxpayer name
- NID
- tax zone/circle
- address
- mobile
- email
- taxpayer type
- residential status
- date/birth/gender type fields
- employer name for salaried taxpayers
- business name
- BIN
- partner/member name and TIN

Purpose:

This step identifies the taxpayer and basic return metadata.

## Screen 5 - Income and Tax Summary

The `Income and Tax` step contains multiple subtabs.

The summary table lists income sources:

- income from employment/salary
- income from rent/house property
- income from agriculture
- income from business
- capital gain
- financial asset income
- other sources
- firm/person association share
- minor child/spouse income
- foreign taxable income
- total income

The salary row includes employment type options such as `সরকারি` and `অন্যান্য`.

Purpose:

This is the high-level income summary. The operator checks applicable income sources and enters amounts.

## Screen 6 - Employment Income

The employment schedule is a detailed salary table.

It includes salary/allowance rows and columns like:

- description
- income amount
- exempt amount
- taxable amount

Visible/inferred rows include:

- salary
- allowances
- arrear salary
- gratuity/annuity/pension-like items
- perquisites
- salary substitute/additional receipt
- employee share scheme income
- house rent allowance
- medical allowance
- transport/conveyance allowance
- festival/bonus allowance
- other benefits

Purpose:

This calculates taxable income from employment.

## Screen 7 - Rent / House Property Income

The later frames show `Income from rent` / house property income.

Visible/inferred fields include:

- property location and description
- annual rental income
- claimed expenses
- repair/collection
- municipal/local tax
- land revenue
- interest on loan/mortgage/capital charge
- insurance premium
- vacancy allowance
- other expense
- total expense
- net income

Purpose:

This calculates taxable income from rented house/property.

## Screen 8 - Financial Asset Income

The video shows a separate table for `আর্থিক পরিসম্পদ হইতে আয়`.

Rows include:

- bank interest/profit
- dividend
- savings certificate profit
- securities income
- other
- net

Purpose:

This records income from financial assets.

## Screen 9 - Tax Calculation, Payment, and Rebate

The video shows tax calculation rows around ১১-২৬.

Important items include:

- total income
- tax on taxable income
- tax rebate
- tax after rebate
- minimum tax
- payable tax
- net wealth surcharge
- environment surcharge
- special interest/fine/other tax
- total payable tax
- tax deducted/collected at source
- advance tax paid
- refundable adjustment
- tax paid with return
- total paid tax
- excess payment
- tax-exempt/tax-free income

There is also an investment rebate area with items like:

- life insurance premium
- deposit pension scheme
- savings certificate purchase
- share/debenture/mutual fund investment
- zakat/donation
- other approved investment

Purpose:

This part calculates how much tax is payable, already paid, adjustable, or refundable.

## Screen 10 - Assets

The `Assets` step is more than a simple asset list. It has inner tabs:

- `Asset Summary`
- `Living Expenditure`

The asset summary includes:

- business capital
- limited-company share investment as director
- partnership capital
- non-agricultural land/house property
- agricultural property
- financial assets
- savings/DPS
- loans given
- deposits
- provident/other funds
- motor vehicle
- gold/jewelry
- furniture/electronics
- other assets
- previous-year net wealth
- current-year net wealth
- living expense/loss adjustment
- institutional liability
- non-institutional liability
- other liability
- total assets

Purpose:

This records the taxpayer's wealth, liabilities, and net worth.

## Screen 11 - Living Expenditure

The living expenditure section records expenses and source-of-fund items.

Visible/inferred rows include:

- personal and family expenditure
- tax/surcharge/fee payment
- donation
- travel expense
- education expense
- medical expense
- allowable deductions
- repair/collection
- municipal/local tax
- land revenue
- interest/loan charge
- insurance premium
- other
- total allowable deduction
- net income
- taxpayer share where applicable

Purpose:

This reconciles income, expenditure, wealth increase, and available funds.

## Screen 12 - Generated Return Output

At the end, the video shows an Excel/PDF-like generated return file.

It includes:

- formal return page
- taxpayer identity page
- photo box
- tick boxes such as self/universal self/normal
- TIN/NID/circle/zone/assessment year
- income and tax summary page
- asset/liability page
- expense/source-of-fund page
- schedules such as:
  - employment income
  - house property income
  - investment tax credit
- instruction/checklist page

Purpose:

This is the final output generated from the entered data. The operator should review this before using/submitting the real return.

## What We Built

The practice app in `practice-ereturn/` recreates the workflow as a safe local training simulator.

It includes:

- login
- TIN Registration screen
- eReturn Office shell
- PSR dashboard
- assessment form
- income/tax subtabs
- employment schedule
- rent/house property schedule
- financial asset schedule
- tax calculation/payment/rebate tables
- asset summary
- living expenditure
- multi-page preview/output
- browser back support and in-app navigation

## Important Limitation

This is not connected to the real NBR system. It is not a real tax calculator. It is a practice/training clone based on a video.

Some tiny labels in the video are blurred or blocked by the cursor. Those were recreated using the clearest visible text and reasonable inference from the return form structure. So the app is now much more complete, but a claim of 100% official/legal exactness would not be honest without access to the real website or original source form.

## What The Client Probably Wants

They likely want:

1. A training website.
2. It should look like the real eReturn Office website.
3. It should let users practice the same data-entry flow.
4. It should prevent trainees from making mistakes on the real government website.
5. It should include the screens and examples from the video.

In plain words: build a safe mock version of the NBR eReturn data-entry system for practice.
