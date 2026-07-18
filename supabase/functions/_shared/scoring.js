export const SCORING_VERSION = 'video-answer-key-answered-fields-2026-07-19-v2'

const employmentRows = [
  'মূল বেতন',
  'বকেয়া বেতন (যা পূর্বে করযোগ্য আয়ের অন্তর্ভুক্ত হয় নাই)',
  'বিশেষ বেতন',
  'বাড়িভাড়া ভাতা',
  'চিকিৎসা ভাতা',
  'যাতায়াত ভাতা',
  'উৎসব ভাতা',
  'সহায়ক কর্মীর জন্য প্রদত্ত ভাতা',
  'ছুটি ভাতা',
  'সম্মানী/পুরস্কার',
  'ওভার টাইম ভাতা',
  'বৈদেশিক ভাতা',
  'ভবিষ্য তহবিলে অর্জিত সুদ',
  'লাম্পগ্রান্ট',
  'গ্র্যাচুইটি',
  'অন্যান্য, যদি থাকে (বিবরণ দিন)',
  'মোট',
]

const assessment = {
  registerSerial: '2024-2025',
  registerVolume: '01',
  filingDate: '12.08.2026',
  tin: '1234567891234',
  taxYear: '2024-2025',
  section: '180',
  name: 'Md. Alauddin Islam',
  circle: '105',
  zone: '05, Dhaka',
  resident: 'Resident',
  birthDate: '16.08.1958',
  spouseName: 'Mst. Zakia Mun',
  spouseTin: '',
  presentAddress: 'Pirojpur',
  telephone: '',
  mobile: '01570000000',
  email: 'mjrenterprise.oficial@gmail.com',
  employer: 'National Board of Revenue',
  businessName: 'M/S. Ananta Enterprise',
  bin: '',
  partnerTin: '',
}

const specialFacilities = Object.fromEntries([
  'মুক্তিযোদ্ধা',
  'মহিলা',
  'তৃতীয় লিঙ্গ',
  'প্রতিবন্ধী ব্যক্তি',
  '৬৫ বৎসর বা তদূর্ধ্ব বয়সী',
  'প্রতিবন্ধী ব্যক্তির পিতা/মাতা/আইনানুগ অভিভাবক',
].map((key) => [key, false]))

const incomeChecked = {
  employment: true,
  rent: true,
  agriculture: true,
  business: true,
  capital: false,
  financial: true,
  other: false,
  firm: false,
  minor: false,
  foreign: false,
}

const incomeAmounts = {
  employment: '395981',
  rent: '180000',
  agriculture: '222000',
  business: '893370',
  capital: '',
  financial: '45000',
  other: '',
  firm: '',
  minor: '',
  foreign: '',
  totalIncome: '1736351',
}

const tax = {
  taxableTax: '209838',
  rebate: '50741',
  afterRebate: '159097',
  minimumTax: '5000',
  payableTax: '159097',
  personalSurcharge: '',
  environmentSurcharge: '',
  specialTax: '',
  totalPayableTax: '159097',
}

const payment = {
  sourceTax: '3000',
  advanceTax: '',
  adjustmentRef: '',
  adjustmentRefText: '',
  carriedExcess: '156097',
  totalPaidTax: '159097',
  excessPayment: '0',
  exemptIncome: '246620',
}

const employmentValues = [
  ['175930', '', '175930'],
  ['', '', ''],
  ['11000', '', '11000'],
  ['105558', '105558', ''],
  ['18000', '18000', ''],
  ['3600', '3600', ''],
  ['29440', '', '29440'],
  ['', '', ''],
  ['3600', '', '3600'],
  ['', '', ''],
  ['', '', ''],
  ['2944', '', '2944'],
  ['31129', '31129', ''],
  ['', '', ''],
  ['', '', ''],
  ['', '', ''],
  ['381201', '158287', '219341'],
]

const employment = Object.fromEntries(employmentRows.flatMap((row, index) =>
  ['income', 'exempt', 'net'].map((column, columnIndex) => [`${row}:${column}`, employmentValues[index][columnIndex]]),
))

const rent = {
  propertyDescription: '65, Mymensingh Lane, Sonargaon Road, Dhaka',
  annualRent: '240000',
  advanceRent: '',
  benefitValue: '',
  adjustedAdvanceRent: '',
  vacancyAllowance: '',
  totalRentValue: '240000',
  allowableDeduction: '60000',
  municipalTax: '60000',
  landRevenue: '',
  loanInterest: '',
  insurancePremium: '',
  otherRentDeduction: '',
  totalAllowableDeduction: '60000',
  netHouseIncome: '180000',
  taxpayerShare: '',
}

const answerKey = {
  assessment,
  specialFacilities,
  incomeChecked,
  incomeAmounts,
  jobType: 'government',
  tax,
  taxChecked: { rebate: true },
  payment,
  employment,
  rent,
  financial: Object.fromEntries(['', '', '45000', '', '', '45000'].map((value, index) => [`financial${index}`, value])),
  rebate: Object.fromEntries(['', '120000', '500000', '', '24000', '', '', '', '', '', '644000', '96600'].map((value, index) => [`rebate${index}`, value])),
  assets: Object.fromEntries([
    '1736351', '246620', '0', '1982971', '13550750', '15533721', '380750', '', '380750', '15152971',
    '1000000', '', '', '1000000', '16152971', '1800000', '', '1800000', '1000000', '',
    '3500000', '2500000', '', '740000', '', '', '281584', '', '1021584', '1000000',
    '750000', '130000', '', '', '', '', '4451386', '16152970', '', '16152970',
  ].map((value, index) => [`asset${index}`, value])),
  living: Object.fromEntries(['137500', '120000', '18500', '45750', '12000', '', '35000', '12000', '', '380750'].map((value, index) => [`living${index}`, value])),
}

const sectionNames = {
  assessment: 'Assessment',
  specialFacilities: 'Assessment - special facility',
  incomeChecked: 'Income and Tax Summary - source selection',
  incomeAmounts: 'Income and Tax Summary',
  jobType: 'Income and Tax Summary',
  tax: 'Tax calculation',
  taxChecked: 'Tax calculation - selection',
  payment: 'Tax payment',
  employment: 'Income from employment',
  rent: 'Income from rent',
  financial: 'Income from financial assets',
  rebate: 'Tax rebate',
  assets: 'Assets Summary',
  living: 'Living Expenditure',
}

const textSections = new Set(['assessment', 'rent'])
const identifierFields = new Set([
  'assessment.registerSerial', 'assessment.registerVolume', 'assessment.filingDate', 'assessment.tin',
  'assessment.taxYear', 'assessment.section', 'assessment.circle', 'assessment.mobile',
])

function getValue(source, path) {
  return path.split('.').reduce((value, key) => value?.[key], source)
}

function normalizeDigits(value) {
  const bengali = '০১২৩৪৫৬৭৮৯'
  return String(value ?? '').replace(/[০-৯]/g, (digit) => String(bengali.indexOf(digit)))
}

function normalize(value, path, expected) {
  if (typeof expected === 'boolean') return Boolean(value)
  let normalized = normalizeDigits(value).normalize('NFKC').trim().replace(/\s+/g, ' ')
  const section = path.split('.')[0]
  if (!textSections.has(section) && !identifierFields.has(path)) normalized = normalized.replaceAll(',', '')
  return normalized.toLocaleLowerCase('en-US')
}

function display(value) {
  if (typeof value === 'boolean') return value ? 'selected' : 'not selected'
  const text = String(value ?? '').trim()
  return text || 'blank'
}

function buildRules() {
  return Object.entries(answerKey).flatMap(([section, expected]) => {
    if (typeof expected !== 'object' || expected === null || Array.isArray(expected)) {
      return [{ section, path: section, label: section, expected }]
    }
    return Object.entries(expected).map(([key, value]) => ({
      section,
      path: `${section}.${key}`,
      label: key,
      expected: value,
    }))
  }).filter((rule) => rule.expected === true
    || (typeof rule.expected !== 'boolean' && String(rule.expected ?? '').trim() !== ''))
}

export const scoringRuleCount = buildRules().length

export function markAttempt(attempt = {}) {
  const details = buildRules().map((rule) => {
    const entered = getValue(attempt, rule.path)
    const correct = normalize(entered, rule.path, rule.expected) === normalize(rule.expected, rule.path, rule.expected)
    return { ...rule, entered: entered ?? '', correct }
  })
  const correctCount = details.filter((detail) => detail.correct).length
  const mistakes = details.filter((detail) => !detail.correct).map((detail) =>
    `${sectionNames[detail.section] || detail.section} - ${detail.label}: expected ${display(detail.expected)}; entered ${display(detail.entered)}.`,
  )

  return {
    score: Number(((correctCount / details.length) * 100).toFixed(2)),
    mistakes,
    summary: {
      scoringVersion: SCORING_VERSION,
      totalFields: details.length,
      correctFields: correctCount,
      incorrectFields: details.length - correctCount,
    },
    details,
  }
}

export function getAnswerKeyForTests() {
  return structuredClone(answerKey)
}
