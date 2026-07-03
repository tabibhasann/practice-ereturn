# Practice eReturn Office

A local training simulator for the Bangladesh NBR eReturn Office data-entry workflow shown in the supplied screen-recording video.

This is not connected to the real NBR system. It is a safe practice clone for learning the flow before entering data into the production website.

## What It Includes

- eReturn Office login screen
- TIN Registration login/context screen
- PSR Detail Entries dashboard with filters and status columns
- Assessment form
- Income and Tax forms:
  - income summary
  - employment income
  - rent / house property income
  - financial asset income
  - tax calculation
  - tax payment
  - investment rebate
- Assets forms:
  - asset summary
  - living expenditure/source of fund
- Multi-page generated return preview with schedules and instruction/checklist page

## Run Locally

```bash
npm install
npm run dev -- --host 127.0.0.1
```

Open:

```text
http://127.0.0.1:5173/
```

## Build

```bash
npm run build
```

## Project Notes

The video source was a compressed WhatsApp screen recording, so some tiny Bangla labels were partially blurred or covered by the cursor. The implementation recreates every distinct visible screen/section that could be identified from the extracted frames.

Read:

- [Project Explanation](docs/PROJECT_EXPLANATION.md)
- [Coverage Audit](docs/COVERAGE_AUDIT.md)
- [Video Transcript and Implementation Brief](docs/VIDEO_TRANSCRIPT_AND_IMPLEMENTATION_BRIEF.md)
