import test from 'node:test'
import assert from 'node:assert/strict'
import {
  getAnswerKeyForTests,
  markAttempt,
  scoringRuleCount,
  SCORING_VERSION,
} from '../supabase/functions/_shared/scoring.js'

test('the complete video answer key scores 100', () => {
  const result = markAttempt(getAnswerKeyForTests())

  assert.equal(result.score, 100)
  assert.equal(result.mistakes.length, 0)
  assert.equal(result.summary.totalFields, scoringRuleCount)
  assert.equal(result.summary.correctFields, scoringRuleCount)
  assert.equal(result.summary.scoringVersion, SCORING_VERSION)
})

test('a wrong value produces a lower score and an exact mistake', () => {
  const attempt = getAnswerKeyForTests()
  attempt.incomeAmounts.totalIncome = '100'
  const result = markAttempt(attempt)

  assert.ok(result.score < 100)
  assert.equal(result.summary.incorrectFields, 1)
  assert.match(result.mistakes[0], /Income and Tax Summary - totalIncome/)
  assert.match(result.mistakes[0], /expected 1736351; entered 100/)
})

test('money commas, Bengali digits, text case, and surrounding spaces are normalized', () => {
  const attempt = getAnswerKeyForTests()
  attempt.incomeAmounts.totalIncome = '১,৭৩৬,৩৫১'
  attempt.assessment.name = '  md. alauddin islam  '
  const result = markAttempt(attempt)

  assert.equal(result.score, 100)
  assert.equal(result.mistakes.length, 0)
})

test('an unexpected value in a reference-blank field is a mistake', () => {
  const attempt = getAnswerKeyForTests()
  attempt.assessment.telephone = '12345'
  const result = markAttempt(attempt)

  assert.equal(result.summary.incorrectFields, 1)
  assert.match(result.mistakes[0], /telephone: expected blank; entered 12345/)
})
