# Scoring System

## Reference

- Source: `new video.mp4`
- Source SHA-256: `d32de6d979b163ee471199b85e7c1dbe31ce5a68655d1bc3ad356d80d84c3ded`
- Marking version: `video-answer-key-answered-fields-2026-07-19-v2`
- Scored answers: 110

The video contains no usable narration. Its visible, completed form is therefore the authoritative answer key.

## Rules

Only controls visibly populated or selected in the reference video are scored. Reference-blank fields are excluded from the denominator. The score is `(correct / 110) * 100`, rounded to two decimal places; for example, 109 correct answers score `99.09%`.

Money values accept commas and Bengali or English digits. Text comparison ignores case, repeated whitespace, and surrounding whitespace. Identifiers and dates preserve significant formatting, including the leading zero in the register volume.

## Security

The answer key is stored only in the Supabase Edge Function source. `submit-attempt` ignores any score or mistake list supplied by the browser, calculates both on the server, and writes the authoritative result to `return_attempts`.

Each mismatch stored for admin preview includes the form section, field key, expected answer, and submitted answer. The saved payload also records the scoring version and correct/incorrect field counts.

## Attempt Availability

Seven assessment slots are displayed, but only Assessment 1 is unlocked for this release. The frontend blocks further assessment entry, the submission function rejects a second assessment, and the database trigger enforces the limit. Practice submissions are unlimited, unscored, and represented only by an atomic count and last-completed timestamp.
