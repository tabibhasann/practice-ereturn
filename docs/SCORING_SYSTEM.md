# Scoring System

## Reference

- Source: `new video.mp4`
- Source SHA-256: `d32de6d979b163ee471199b85e7c1dbe31ce5a68655d1bc3ad356d80d84c3ded`
- Marking version: `video-answer-key-2026-07-18-v1`
- Scored controls: 202

The video contains no usable narration. Its visible, completed form is therefore the authoritative answer key.

## Rules

Every form field, checkbox, and radio selection in the reference return is one scored control. Reference-blank fields are included, so an unexpected entry is reported as a mistake. The integer score is the completed percentage rounded down; a score of 100 is only possible when all 202 controls match.

Money values accept commas and Bengali or English digits. Text comparison ignores case, repeated whitespace, and surrounding whitespace. Identifiers and dates preserve significant formatting, including the leading zero in the register volume.

## Security

The answer key is stored only in the Supabase Edge Function source. `submit-attempt` ignores any score or mistake list supplied by the browser, calculates both on the server, and writes the authoritative result to `return_attempts`.

Each mismatch stored for admin preview includes the form section, field key, expected answer, and submitted answer. The saved payload also records the scoring version and correct/incorrect field counts.

## Attempt Availability

Seven slots are displayed, but only slot 1 is unlocked for this release. The frontend blocks further entry, the submission function rejects a second return, and the database trigger enforces the trainee's `attempt_limit` of 1.
