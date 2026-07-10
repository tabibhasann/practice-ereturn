import { useEffect, useMemo, useState } from 'react'
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Eye,
  FileText,
  Lock,
  LogOut,
  Menu,
  Plus,
  Search,
  Send,
  UserRound,
  X,
} from 'lucide-react'
import './App.css'
import { callSupabaseFunction, isSupabaseConfigured } from './supabaseClient'

const ADMIN_USERNAME = 'admin-nbr-7k4p9q'
const MAX_ATTEMPTS = 7
const ATTEMPTS_KEY = 'practice-ereturn-attempts'
const USERS_KEY = 'practice-ereturn-users'

const steps = ['Assessment', 'Income and Tax', 'Assets']

const traineeRow = {
  tin: '417940431464',
  name: 'Practice Candidate',
  submissionSection: '180',
  assessmentYear: '2025-2026',
  totalIncome: '0',
  totalTaxPaid: '0',
  taxPaid173: '0',
  netAsset: '0',
  psrStatus: 'APPROVED',
  entryStatus: 'NOT_INITIALIZED',
}

const assessmentFields = [
  { key: 'registerSerial', label: 'রিটার্ন রেজিস্টারের ক্রমিক নম্বর', required: true, value: '' },
  { key: 'registerVolume', label: 'রিটার্ন রেজিস্টারের ভল্যুম নম্বর', required: true, value: '' },
  { key: 'filingDate', label: 'রিটার্ন দাখিলের তারিখ', required: true, value: '' },
  { key: 'tin', no: '১', label: 'টিআইএন', required: true, value: '' },
  { key: 'taxYear', no: '২', label: 'কর বছর', required: true, value: '' },
  { key: 'section', no: '৩', label: 'ধারা', required: true, value: '' },
  { key: 'name', no: '৪', label: 'করদাতার নাম', required: false, value: '' },
  { key: 'circle', no: '৫(ক)', label: 'সার্কেল', required: false, value: '' },
  { key: 'zone', no: '৫(খ)', label: 'কর অঞ্চল', required: false, value: '' },
  { key: 'resident', no: '৬', label: 'আবাসিক মর্যাদা', required: true, value: '', type: 'radio', options: ['Resident', 'Non Resident'] },
  { key: 'birthDate', no: '৮', label: 'জন্ম তারিখ', required: false, value: '', placeholder: 'দিন-মাস-বৎসর' },
  { key: 'spouseName', no: '৯', label: 'স্ত্রী/স্বামীর নাম', required: false, value: '' },
  { key: 'spouseTin', no: '১০', label: 'স্ত্রী/স্বামী করদাতা হলে টিআইএন', required: false, value: '' },
  { key: 'presentAddress', no: '১১', label: 'যোগাযোগের ঠিকানা', required: false, value: '' },
  { key: 'telephone', label: 'টেলিফোন', required: false, value: '' },
  { key: 'mobile', label: 'মোবাইল', required: false, value: '' },
  { key: 'email', label: 'ই-মেইল', required: false, value: '' },
  { key: 'employer', no: '১২', label: 'চাকরিজীবী করদাতার ক্ষেত্রে নিয়োগকারী প্রতিষ্ঠানের নাম', required: false, value: '' },
  { key: 'businessName', no: '১৩(ক)', label: 'ব্যবসা প্রতিষ্ঠানের নাম', required: false, value: '' },
  { key: 'bin', no: '১৩(খ)', label: 'ব্যবসার নিবন্ধন নম্বর (BIN)(সমূহ)', required: false, value: '' },
  { key: 'partnerTin', no: '১৪', label: 'ফার্ম বা ব্যক্তি সংঘের ক্ষেত্রে অংশীদার/সদস্যদের নাম ও টিআইএন', required: false, value: '' },
]

const specialFacilityRows = [
  'মুক্তিযোদ্ধা',
  'মহিলা',
  'তৃতীয় লিঙ্গ',
  'প্রতিবন্ধী ব্যক্তি',
  '৬৫ বৎসর বা তদূর্ধ্ব বয়সী',
  'প্রতিবন্ধী ব্যক্তির পিতা/মাতা/আইনানুগ অভিভাবক',
]

const incomeSummaryRows = [
  { key: 'employment', no: '১', label: 'চাকরি হইতে আয় (এই রিটার্নের তফসিল ১ অনুযায়ী)', tab: 'Income from employment', requiredExtra: 'jobType' },
  { key: 'rent', no: '২', label: 'ভাড়া হইতে আয় (এই রিটার্নের তফসিল ২ অনুযায়ী)', tab: 'Income from rent' },
  { key: 'agriculture', no: '৩', label: 'কৃষি হইতে আয় (এই রিটার্নের তফসিল ৩ অনুযায়ী)' },
  { key: 'business', no: '৪', label: 'ব্যবসা হইতে আয় (এই রিটার্নের তফসিল ৪ অনুযায়ী)' },
  { key: 'capital', no: '৫', label: 'মূলধনি আয়' },
  { key: 'financial', no: '৬', label: 'আর্থিক পরিসম্পদ হইতে আয় (ব্যাংক সুদ / মুনাফা, লভ্যাংশ, সঞ্চয়পত্র মুনাফা, সিকিউরিটিজ ইত্যাদি)', tab: 'Income from financial assets' },
  { key: 'other', no: '৭', label: 'অন্যান্য উৎস হইতে আয় (রয়্যালটি, লাইসেন্স ফি, সম্মানী, ফি, সরকার প্রদত্ত নগদ ভর্তুকি ইত্যাদি)' },
  { key: 'firm', no: '৮', label: 'ফার্ম বা ব্যক্তিসংঘের আয়ের অংশ' },
  { key: 'minor', no: '৯', label: 'অপ্রাপ্ত বয়স্ক সন্তান, স্ত্রী বা স্বামীর আয় (করদাতা না হইলে)' },
  { key: 'foreign', no: '১০', label: 'বিদেশে উদ্ভূত করযোগ্য আয়' },
  { key: 'totalIncome', no: '১১', label: 'মোট আয় (ক্রমিক ১ হইতে ১০ এর সমষ্টি)', total: true },
]

const taxRows = [
  { key: 'taxableTax', no: '১২', label: 'মোট কর পরিগণনাযোগ্য আয়ের উপর আরোপযোগ্য আয়কর' },
  { key: 'rebate', no: '১৩', label: 'কর রেয়াত (এই রিটার্নের তফসিল ৫ অনুযায়ী)', checkbox: true, tab: 'Tax rebate' },
  { key: 'afterRebate', no: '১৪', label: 'রেয়াত-পরবর্তী প্রদেয় করদায় (১২-১৩)' },
  { key: 'minimumTax', no: '১৫', label: 'ন্যূনতম কর' },
  { key: 'payableTax', no: '১৬', label: 'প্রদেয় কর (ক্রমিক ১৪ ও ক্রমিক ১৫ এর মধ্যে যাহা অধিক)' },
  { key: 'personalSurcharge', no: '১৭(ক)', label: 'নেট পরিসম্পদের জন্য প্রদেয় সারচার্জ (প্রযোজ্য ক্ষেত্রে)' },
  { key: 'environmentSurcharge', no: '১৭(খ)', label: 'পরিবেশ সারচার্জ (প্রযোজ্য ক্ষেত্রে)' },
  { key: 'specialTax', no: '১৮', label: 'বিলম্ব সুদ, জরিমানা অথবা আয়কর আইনের অধীন প্রদেয় কোনো অঙ্ক (যদি থাকে)' },
  { key: 'totalPayableTax', no: '১৯', label: 'মোট প্রদেয় কর (১৬+১৭+১৮)' },
]

const paymentRows = [
  { key: 'sourceTax', no: '২০', label: 'উৎসে কর্তিত/সংগৃহীত কর (প্রমাণাদি সংযুক্ত করুন)' },
  { key: 'advanceTax', no: '২১', label: 'পরিশোধিত অগ্রিম কর (প্রমাণাদি সংযুক্ত করুন)' },
  { key: 'adjustmentRef', no: '২২', label: 'প্রত্যার্পণযোগ্য করের সমন্বয় (যদি থাকে)', hasText: true },
  { key: 'carriedExcess', no: '২৩', label: 'এই রিটার্নের সহিত পরিশোধিত অবশিষ্ট কর (প্রমাণাদি সংযুক্ত করুন)' },
  { key: 'totalPaidTax', no: '২৪', label: 'প্রদেয় কর (২০+২১+২২+২৩)' },
  { key: 'excessPayment', no: '২৫', label: 'অতিরিক্ত পরিশোধ' },
  { key: 'exemptIncome', no: '২৬', label: 'কর অব্যাহতিপ্রাপ্ত / করমুক্ত আয় (বিবরণ সংযুক্ত করুন)' },
]

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

const rentRows = [
  { key: 'propertyDescription', no: '', label: 'সম্পত্তির অবস্থান, বর্ণনা ও মালিকানার অংশ', type: 'textarea', required: true },
  { key: 'annualRent', no: '১', label: 'বার্ষিক প্রাপ্ত ভাড়া বা বার্ষিক মূল্য, যাহা অধিক' },
  { key: 'advanceRent', no: '২', label: 'অগ্রিম প্রাপ্ত ভাড়া' },
  { key: 'benefitValue', no: '৩', label: 'ভাড়া ব্যতীত অন্য কোনো সুবিধার মূল্য' },
  { key: 'adjustedAdvanceRent', no: '৪', label: 'সমন্বয়কৃত অগ্রিম ভাড়া' },
  { key: 'vacancyAllowance', no: '৫', label: 'খালি থাকার জন্য ছাড়' },
  { key: 'totalRentValue', no: '৬', label: 'মোট ভাড়ামূল্য [(১+২+৩)-৪-৫]' },
  { key: 'allowableDeduction', no: '৭', label: 'অনুমোদনযোগ্য বিয়োজনসমূহ' },
  { key: 'municipalTax', no: '৭(ক)', label: 'মেরামত, আদায় ইত্যাদি / পৌর কর অথবা স্থানীয় কর' },
  { key: 'landRevenue', no: '৭(খ)', label: 'ভূমি রাজস্ব' },
  { key: 'loanInterest', no: '৭(গ)', label: 'পরিশোধিত ঋণের উপর সুদ / ব্যাংক / মূলধনি চার্জ' },
  { key: 'insurancePremium', no: '৭(ঘ)', label: 'পরিশোধিত বীমা প্রিমিয়াম' },
  { key: 'otherRentDeduction', no: '৭(ঙ)', label: 'অন্যান্য (যদি থাকে)' },
  { key: 'totalAllowableDeduction', no: '৮', label: 'মোট অনুমোদনযোগ্য বিয়োজন' },
  { key: 'netHouseIncome', no: '৯', label: 'নীট আয় (ক্রমিক ১ হইতে ক্রমিক ৮ এর বিয়োগফল)' },
  { key: 'taxpayerShare', no: '১০', label: 'করদাতার অংশ (প্রযোজ্য ক্ষেত্রে)' },
]

const financialRows = [
  'ব্যাংক সুদ / মুনাফা হইতে আয়',
  'লভ্যাংশ হইতে আয়',
  'সঞ্চয়পত্র মুনাফা হইতে আয়',
  'সিকিউরিটিজ হইতে আয়',
  'অন্যান্য',
  'নেট',
]

const rebateRows = [
  'জীবন বীমা প্রিমিয়াম (৬ষ্ঠ তফসিল অংশ-৩, অনুচ্ছেদ- ২১, ২২)',
  'ডিপোজিট পেনশন/মাসিক সঞ্চয় স্কিমে প্রদত্ত চাঁদা',
  'সরকারি সিকিউরিটিজ, ইউনিট সার্টিফিকেট, মিউচুয়াল ফান্ড, ইটিএফ অথবা যৌথ বিনিয়োগ স্কিমে বিনিয়োগ',
  'অনুমোদিত স্টক এক্সচেঞ্জে তালিকাভুক্ত সিকিউরিটিজে বিনিয়োগ',
  'Provident Fund Act, 1925 এর বিধানাবলি প্রযোজ্য এইরূপ যেকোনো তহবিলে করদাতার চাঁদা',
  'কল্যাণ ও ত্রাণ নিয়ন্ত্রণকারী কর্তৃক অনুমোদিত তহবিলে প্রদত্ত চাঁদা',
  'অনুমোদিত বার্ধক্য তহবিলে প্রদত্ত চাঁদা',
  'কল্যাণ তহবিলে প্রদত্ত / গোষ্ঠী বীমা তহবিলে প্রদত্ত চাঁদা',
  'যাকাত তহবিলে প্রদত্ত চাঁদা',
  'অন্যান্য, যদি থাকে (বিবরণ দিন)',
  'মোট বিনিয়োগ (ক্রমিক ১ হইতে ক্রমিক ১০ পর্যন্ত যোগফল)',
  'কর রেয়াতের পরিমাণ',
]

const assetSummaryRows = [
  'অর্জিত তহবিলসমূহ: রিটার্নে প্রদর্শিত মোট আয়',
  'কর অব্যাহতিপ্রাপ্ত আয়',
  'দান-গ্রহণ/অন্যান্য প্রাপ্তি',
  'মোট অর্জিত তহবিল',
  'বিগত আয়বর্ষের শেষ তারিখের নীট সম্পদ',
  'অর্জিত তহবিল ও বিগত আয়বর্ষের শেষ তারিখের নীট সম্পদের যোগফল',
  'জীবনযাপন সংশ্লিষ্ট ব্যয়',
  'আইনসম্মত নয় এমন দান প্রদান/ব্যয়/ক্ষতি',
  'মোট ব্যয় ও ক্ষতি',
  'এই আয়বর্ষের শেষ তারিখের নীট সম্পদ',
  'প্রাতিষ্ঠানিক দায়',
  'অপ্রাতিষ্ঠানিক দায়',
  'অন্যান্য দায়',
  'ব্যবসার বাহির্ভূত মোট দায়',
  'মোট পরিসম্পদ',
  'বাংলাদেশে অবস্থিত পরিসম্পদের খাতভিত্তিক বিবরণ: ব্যবসার মোট পরিসম্পদ',
  'ব্যবসায়িক দায়',
  'ব্যবসার মূলধন',
  'পরিচালক হিসাবে লিমিটেড কোম্পানিতে শেয়ার বিনিয়োগ',
  'অংশীদারী ফার্মের মূলধনের জের',
  'অ-কৃষি সম্পত্তি / জমি / গৃহ সম্পত্তি',
  'কৃষি সম্পত্তি',
  'শেয়ার / ডিবেঞ্চার / বন্ড / সিকিউরিটিজ / ইউনিট সার্টিফিকেট',
  'সঞ্চয়পত্র / ডিপোজিট পেনশন স্কিম',
  'ঋণ প্রদান (ঋণ গ্রহীতার নাম ও এনআইডি উল্লেখ করুন)',
  'সঞ্চয়ী / মেয়াদি আমানত',
  'প্রভিডেন্ট ফান্ড বা অন্যান্য ফান্ড',
  'অন্যান্য বিনিয়োগ',
  'মোট আর্থিক সম্পদ',
  'মোটর যান (রেজিস্ট্রেশন খরচসহ ক্রয়মূল্য)',
  'স্বর্ণালঙ্কার',
  'আসবাবপত্র ও ইলেকট্রনিক সামগ্রী',
  'অন্যান্য পরিসম্পদ',
  'ব্যবসা বহির্ভূত নগদ অর্থ ও তহবিল: ব্যাংকে গচ্ছিত অর্থ',
  'হাতে নগদ',
  'অন্যান্য অর্থ',
  'মোট আর্থিক সম্পদ',
  'বাংলাদেশে অবস্থিত মোট পরিসম্পদ',
  'বাংলাদেশের বাহিরে অবস্থিত পরিসম্পদ',
  'বাংলাদেশে অবস্থিত ও বাংলাদেশের বাহিরে অবস্থিত মোট পরিসম্পদ',
]

const livingRows = [
  'ব্যক্তিগত ও পরিবারের ভরণপোষণ খরচ',
  'আবাসন সংক্রান্ত ব্যয়',
  'ব্যক্তিগত যানবাহন সংক্রান্ত ব্যয়',
  'ইউটিলিটি সংক্রান্ত ব্যয় (বিদ্যুৎ বিল, গ্যাস, পানি, টেলিফোন, মোবাইল, ইন্টারনেট ইত্যাদি)',
  'শিক্ষা ব্যয়',
  'নিজ খরচে দেশে ও বিদেশে ভ্রমণ, অবকাশ ইত্যাদি সংক্রান্ত ব্যয়',
  'উৎসব ও অন্যান্য বিশেষ ব্যয়',
  'উৎসে কর্তিত / সংগৃহীত কর ও বিগত বছরের রিটার্নের ভিত্তিতে প্রদেয় আয়কর ও সারচার্জ',
  'প্রাতিষ্ঠানিক ও অন্যান্য উৎস হতে গৃহীত ব্যক্তিগত খাতের সুদ পরিশোধ',
  'মোট',
]

function emptyRecord(rows, prefix = '') {
  return Object.fromEntries(rows.map((row, index) => [`${prefix}${index}`, '']))
}

function emptyEmploymentRecord() {
  return Object.fromEntries(
    employmentRows.flatMap((row) => ['income', 'exempt', 'net'].map((col) => [`${row}:${col}`, ''])),
  )
}

function createBlankAttempt(userName = '', userCode = '') {
  return {
    id: crypto.randomUUID(),
    userName,
    userCode,
    createdAt: new Date().toISOString(),
    submittedAt: null,
    status: 'draft',
    score: null,
    mistakes: [],
    savedSteps: {},
    savedTabs: {},
    assessment: Object.fromEntries(assessmentFields.map((field) => [field.key, field.value || ''])),
    specialFacilities: Object.fromEntries(specialFacilityRows.map((row) => [row, false])),
    incomeChecked: Object.fromEntries(incomeSummaryRows.filter((row) => !row.total).map((row) => [row.key, false])),
    incomeAmounts: Object.fromEntries(incomeSummaryRows.map((row) => [row.key, ''])),
    jobType: '',
    tax: Object.fromEntries(taxRows.map((row) => [row.key, ''])),
    taxChecked: { rebate: false },
    payment: Object.fromEntries(paymentRows.flatMap((row) => [[row.key, ''], row.hasText ? [`${row.key}Text`, ''] : []])),
    employment: emptyEmploymentRecord(),
    rent: Object.fromEntries(rentRows.map((row) => [row.key, ''])),
    financial: emptyRecord(financialRows, 'financial'),
    rebate: emptyRecord(rebateRows, 'rebate'),
    assets: emptyRecord(assetSummaryRows, 'asset'),
    living: emptyRecord(livingRows, 'living'),
  }
}

function readAttempts() {
  try {
    return JSON.parse(localStorage.getItem(ATTEMPTS_KEY) || '[]')
  } catch {
    return []
  }
}

function writeAttempts(attempts) {
  localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(attempts))
}

function readUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '{}')
  } catch {
    return {}
  }
}

function writeUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function normalizeUserName(userName) {
  return userName.trim().toLowerCase()
}

function attemptUserKey(attempt) {
  return attempt.userCode || normalizeUserName(attempt.userName || '')
}

function createUsername(existingUsers) {
  let username = ''
  do {
    username = `USR-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
  } while (existingUsers[normalizeUserName(username)])
  return username
}

function userRowsToMap(rows = []) {
  return Object.fromEntries(rows.map((row) => [normalizeUserName(row.username), {
    id: row.id,
    username: row.username,
    userName: row.display_name || row.username,
    createdAt: row.created_at,
    disabledAt: row.disabled_at,
    attemptLimit: Number(row.attempt_limit || MAX_ATTEMPTS),
  }]))
}

function attemptRowToAttempt(row) {
  const payload = row.payload || {}
  return {
    ...payload,
    id: row.id,
    userName: payload.userName || row.username,
    userCode: normalizeUserName(row.username),
    submittedAt: row.submitted_at,
    score: row.score,
    mistakes: row.mistakes || payload.mistakes || [],
    status: payload.status || 'submitted',
  }
}

function App() {
  const [session, setSession] = useState(null)
  const [screen, setScreen] = useState('login')
  const [step, setStep] = useState('Assessment')
  const [incomeTab, setIncomeTab] = useState('Income and Tax summary')
  const [assetTab, setAssetTab] = useState('Assets Summary')
  const [attempt, setAttempt] = useState(() => createBlankAttempt())
  const [attempts, setAttempts] = useState(() => readAttempts())
  const [users, setUsers] = useState(() => readUsers())
  const [dataLoading, setDataLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const [previewAttempt, setPreviewAttempt] = useState(null)

  const showToast = (type, message) => {
    setToast({ type, message })
    window.setTimeout(() => setToast(null), 2400)
  }

  useEffect(() => {
    if (isSupabaseConfigured) return
    writeAttempts(attempts)
  }, [attempts])

  useEffect(() => {
    if (isSupabaseConfigured) return
    writeUsers(users)
  }, [users])

  const loadAdminData = async (adminCredentials) => {
    if (!isSupabaseConfigured) return
    setDataLoading(true)
    try {
      const data = await callSupabaseFunction('admin-users', adminCredentials)
      setUsers(userRowsToMap(data.users || []))
      setAttempts((data.attempts || []).map(attemptRowToAttempt))
    } catch (error) {
      showToast('error', error.message || 'Could not load Supabase data.')
    } finally {
      setDataLoading(false)
    }
  }

  const login = async ({ userName, password }) => {
    const trimmedUserName = userName.trim()
    const normalizedUserName = normalizeUserName(userName)
    if (normalizedUserName === ADMIN_USERNAME) {
      if (!password) {
        showToast('error', 'Please enter the admin password.')
        return
      }
      const adminCredentials = { adminUsername: ADMIN_USERNAME, adminPassword: password }
      await loadAdminData(adminCredentials)
      setSession({ role: 'admin', userName: ADMIN_USERNAME, ...adminCredentials })
      setScreen('admin')
      return
    }
    if (!trimmedUserName) {
      showToast('error', 'Please enter your username.')
      return
    }

    let existingUser = users[normalizedUserName]
    if (isSupabaseConfigured) {
      try {
        const data = await callSupabaseFunction('trainee-login', { username: trimmedUserName })
        existingUser = userRowsToMap([data.user])[normalizeUserName(data.user.username)]
        existingUser.attemptCount = Number(data.attemptCount || 0)
        setUsers((current) => ({ ...current, [normalizeUserName(data.user.username)]: existingUser }))
      } catch (error) {
        showToast('error', error.message || 'This username was not created by admin.')
        return
      }
    }
    if (!existingUser) {
      showToast('error', 'This username was not created by admin.')
      return
    }
    if (existingUser.disabledAt) {
      showToast('error', 'This username is disabled.')
      return
    }

    const accountName = existingUser.userName || existingUser.username || trimmedUserName
    const localAttemptCount = attempts.filter((item) => attemptUserKey(item) === normalizedUserName).length
    setSession({
      role: 'trainee',
      userName: accountName,
      accountKey: normalizedUserName,
      attemptCount: isSupabaseConfigured ? Number(existingUser.attemptCount || 0) : localAttemptCount,
      attemptLimit: Number(existingUser.attemptLimit || MAX_ATTEMPTS),
    })
    setAttempt(createBlankAttempt(accountName, normalizedUserName))
    setScreen('dashboard')
  }

  const createTraineeUser = async () => {
    const username = createUsername(users)
    const key = normalizeUserName(username)

    if (isSupabaseConfigured) {
      try {
        const data = await callSupabaseFunction('admin-create-username', {
          adminUsername: session?.adminUsername,
          adminPassword: session?.adminPassword,
        })
        setUsers((current) => ({ ...userRowsToMap([data.user]), ...current }))
        showToast('success', `Created username ${data.user.username}.`)
      } catch (error) {
        showToast('error', error.message)
        return
      }
      return
    }

    setUsers((current) => ({
      [key]: {
        username,
        userName: username,
        createdAt: new Date().toISOString(),
      },
      ...current,
    }))
    showToast('success', `Created username ${username}.`)
  }

  const logout = () => {
    setSession(null)
    setScreen('login')
    setStep('Assessment')
    setIncomeTab('Income and Tax summary')
    setAssetTab('Assets Summary')
  }

  const currentSaveKey = () => (step === 'Income and Tax' ? incomeTab : step === 'Assets' ? assetTab : step)

  const patchAttempt = (updater) => {
    setAttempt((current) => {
      const next = typeof updater === 'function' ? updater(current) : { ...current, ...updater }
      if (screen !== 'form') return next

      const tabKey = currentSaveKey()
      const savedTabs = { ...next.savedTabs }
      const savedSteps = { ...next.savedSteps }
      delete savedTabs[tabKey]
      delete savedSteps[step]
      if (step === 'Income and Tax') delete savedSteps.Assets

      return { ...next, savedTabs, savedSteps }
    })
  }

  const availableIncomeTabs = useMemo(() => {
    const tabs = ['Income and Tax summary']
    if (attempt.incomeChecked.employment && attempt.jobType) tabs.push('Income from employment')
    if (attempt.incomeChecked.rent) tabs.push('Income from rent')
    if (attempt.incomeChecked.financial) tabs.push('Income from financial assets')
    if (attempt.taxChecked.rebate) tabs.push('Tax rebate')
    return tabs
  }, [attempt.incomeChecked, attempt.jobType, attempt.taxChecked.rebate])

  useEffect(() => {
    if (!availableIncomeTabs.includes(incomeTab)) {
      setIncomeTab('Income and Tax summary')
    }
  }, [availableIncomeTabs, incomeTab])

  const validateCurrent = () => {
    if (step === 'Assessment') {
      const missing = assessmentFields.filter((field) => field.required && !String(attempt.assessment[field.key] || '').trim())
      if (missing.length) return `Please fill required Assessment field: ${missing[0].label}`
    }
    if (step === 'Income and Tax') {
      if (incomeTab === 'Income and Tax summary') {
        if (attempt.incomeChecked.employment && !attempt.jobType) return 'Please select চাকরির ধরণ.'
      }
      if (incomeTab === 'Income from rent' && !attempt.rent.propertyDescription.trim()) {
        return 'Please fill the required property description.'
      }
    }
    return ''
  }

  const saveDraft = () => {
    const error = validateCurrent()
    if (error) {
      showToast('error', error)
      return false
    }
    const tabKey = step === 'Income and Tax' ? incomeTab : step === 'Assets' ? assetTab : step
    const savedTabs = { ...attempt.savedTabs, [tabKey]: true }
    const stepComplete = step === 'Assessment'
      || (step === 'Income and Tax' && availableIncomeTabs.every((item) => savedTabs[item]))
      || (step === 'Assets' && ['Assets Summary', 'Living Expenditure'].every((item) => savedTabs[item]))
    const updated = {
      ...attempt,
      status: 'draft',
      savedSteps: stepComplete ? { ...attempt.savedSteps, [step]: true } : attempt.savedSteps,
      savedTabs,
    }
    setAttempt(updated)
    showToast('success', 'Draft saved successfully.')
    return true
  }

  const nextStep = () => {
    const stepIndex = steps.indexOf(step)
    if (!attempt.savedSteps[step]) {
      showToast('error', 'Please save draft before going next.')
      return
    }
    if (stepIndex < steps.length - 1) {
      setStep(steps[stepIndex + 1])
      if (steps[stepIndex + 1] === 'Income and Tax') setIncomeTab('Income and Tax summary')
    }
  }

  const saveReturn = async () => {
    if (Number(session?.attemptCount || 0) >= Number(session?.attemptLimit || MAX_ATTEMPTS)) {
      showToast('error', 'You have used all 7 attempts. No further returns can be submitted.')
      setScreen('dashboard')
      return
    }
    const error = validateCurrent()
    if (error) {
      showToast('error', error)
      return
    }
    const requiredSaveKeys = ['Assessment', ...availableIncomeTabs, 'Assets Summary', 'Living Expenditure']
    const missingSaveKey = requiredSaveKeys.find((key) => !attempt.savedTabs[key])
    if (missingSaveKey) {
      showToast('error', `Please save draft for ${missingSaveKey} before saving return.`)
      return
    }
    if (!attempt.savedSteps.Assessment || !attempt.savedSteps['Income and Tax'] || !attempt.savedSteps.Assets) {
      showToast('error', 'Please complete every step before saving return.')
      return
    }
    if (availableIncomeTabs.includes('Income from rent') && !attempt.rent.propertyDescription.trim()) {
      showToast('error', 'Please fill the required property description.')
      return
    }
    const submitted = {
      ...attempt,
      status: 'submitted',
      submittedAt: new Date().toISOString(),
      score: scoreAttempt(attempt),
      mistakes: buildPlaceholderMistakes(attempt),
    }
    let savedAttemptCount = Number(session?.attemptCount || 0) + 1
    let savedAttemptLimit = Number(session?.attemptLimit || MAX_ATTEMPTS)
    if (isSupabaseConfigured) {
      try {
        const data = await callSupabaseFunction('submit-attempt', {
          username: session?.accountKey || session?.userName,
          attempt: submitted,
        })
        setAttempts((current) => [attemptRowToAttempt(data.attempt), ...current])
        savedAttemptCount = Number(data.attemptCount || savedAttemptCount)
        savedAttemptLimit = Number(data.attemptLimit || savedAttemptLimit)
        setSession((current) => ({
          ...current,
          attemptCount: savedAttemptCount,
          attemptLimit: savedAttemptLimit,
        }))
      } catch (error) {
        showToast('error', error.message)
        if (error.message?.includes('used all')) {
          setSession((current) => ({
            ...current,
            attemptCount: Number(current?.attemptLimit || MAX_ATTEMPTS),
          }))
          setScreen('dashboard')
        }
        return
      }
    } else {
      setAttempts((current) => [submitted, ...current])
      setSession((current) => ({ ...current, attemptCount: Number(current?.attemptCount || 0) + 1 }))
    }
    const remainingAttempts = Math.max(savedAttemptLimit - savedAttemptCount, 0)
    showToast(
      'success',
      remainingAttempts
        ? `Return saved. ${remainingAttempts} attempt${remainingAttempts === 1 ? '' : 's'} remaining.`
        : `Return saved. You have now used all ${savedAttemptLimit} attempts.`,
    )
    setAttempt(createBlankAttempt(session?.userName || '', session?.accountKey || ''))
    setStep('Assessment')
    setIncomeTab('Income and Tax summary')
    setAssetTab('Assets Summary')
    setScreen('dashboard')
  }

  if (screen === 'login') {
    return <LoginScreen onLogin={login} toast={toast} />
  }

  if (screen === 'admin') {
    return (
      <>
        {toast && <Toast type={toast.type} message={toast.message} />}
        <AdminDashboard
        attempts={attempts}
        users={users}
        dataLoading={dataLoading}
          onCreateUser={createTraineeUser}
          onLogout={logout}
          onNotify={showToast}
          onPreview={(item) => {
            setPreviewAttempt(item)
            setScreen('admin-preview')
          }}
        />
      </>
    )
  }

  if (screen === 'admin-preview' && previewAttempt) {
    return <AttemptPreview attempt={previewAttempt} onBack={() => setScreen('admin')} onNotify={showToast} admin />
  }

  if (screen === 'preview') {
    return <AttemptPreview attempt={attempt} onBack={() => setScreen('form')} onNotify={showToast} />
  }

  return (
    <OfficeShell onLogout={logout} userName={session?.userName || ''} formMode={screen === 'form'}>
      {toast && <Toast type={toast.type} message={toast.message} />}
      {screen === 'dashboard' && (
        <TraineeDashboard
          userName={session?.userName || ''}
          attemptCount={Number(session?.attemptCount || 0)}
          attemptLimit={Number(session?.attemptLimit || MAX_ATTEMPTS)}
          onEntry={() => {
            if (Number(session?.attemptCount || 0) >= Number(session?.attemptLimit || MAX_ATTEMPTS)) {
              showToast('error', 'You have used all 7 attempts.')
              return
            }
            setAttempt(createBlankAttempt(session?.userName || '', session?.accountKey || ''))
            setStep('Assessment')
            setIncomeTab('Income and Tax summary')
            setAssetTab('Assets Summary')
            setScreen('form')
          }}
        />
      )}
      {screen === 'form' && (
        <FormWorkspace
          attempt={attempt}
          patchAttempt={patchAttempt}
          step={step}
          setStep={setStep}
          incomeTab={incomeTab}
          setIncomeTab={setIncomeTab}
          assetTab={assetTab}
          setAssetTab={setAssetTab}
          availableIncomeTabs={availableIncomeTabs}
          onBack={() => setScreen('dashboard')}
          onSaveDraft={saveDraft}
          onNext={nextStep}
          onRequireSave={() => showToast('error', 'Please save draft before going next.')}
          onPreview={() => setScreen('preview')}
          onSaveReturn={saveReturn}
        />
      )}
    </OfficeShell>
  )
}

function LoginScreen({ onLogin, toast }) {
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const adminMode = normalizeUserName(userName) === ADMIN_USERNAME

  return (
    <div className="login-screen">
      {toast && <Toast type={toast.type} message={toast.message} />}
      <form
        className="login-card"
        onSubmit={(event) => {
          event.preventDefault()
          onLogin({ userName, password })
        }}
      >
        <Logo />
        <h1>Welcome!</h1>
        <p>Enter the username provided by the admin</p>
        <label>
          Username
          <input value={userName} onChange={(event) => setUserName(event.target.value)} autoFocus />
        </label>
        {adminMode && (
          <label>
            Admin password
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
          </label>
        )}
        <button type="submit" className="primary-button">Sign In</button>
      </form>
    </div>
  )
}

function OfficeShell({ children, onLogout, userName = '', formMode = false }) {
  return (
    <div className={`office-shell${formMode ? ' form-mode' : ''}`}>
      <aside className="sidebar">
        <div className="sidebar-logo">
          <Logo />
          <button type="button" className="icon-button" aria-label="Menu">
            <Menu size={26} />
          </button>
        </div>
        <nav>
          <button type="button" className="nav-link active">
            <Send size={17} />
            PSR Detail Entry
          </button>
          <button type="button" className="nav-link">
            <Send size={17} />
            Double Entry Scores
          </button>
          <button type="button" className="nav-link">
            <Send size={17} />
            Double Entry Report
          </button>
        </nav>
        <button type="button" className="collapse-button" onClick={onLogout}>
          <LogOut size={18} />
          Logout
        </button>
      </aside>
      <main className="workspace">
        <Topbar userName={userName} />
        {children}
        <Footer />
      </main>
    </div>
  )
}

function Logo() {
  return (
    <div className="brand">
      <span>eReturn</span>
      <small>2025-2026</small>
      <strong>OFFICE</strong>
    </div>
  )
}

function Topbar({ userName }) {
  return (
    <header className="topbar">
      <button type="button" className="topbar-menu-square" aria-label="Menu" />
      <div className="topbar-brand"><Logo /></div>
      <select defaultValue="2025-2026">
        <option>2025-2026</option>
      </select>
      <div className="search-box">
        <input placeholder="Search" />
        <button type="button" aria-label="Search"><Search size={20} /></button>
      </div>
      <a className="user-label">{userName || 'Third Party User 1'}</a>
      <div className="avatar"><UserRound size={24} /></div>
    </header>
  )
}

function AttemptMeter({ used, limit = MAX_ATTEMPTS, compact = false }) {
  const safeUsed = Math.min(Math.max(Number(used || 0), 0), limit)
  return (
    <div className={`attempt-meter${compact ? ' compact' : ''}`} aria-label={`${safeUsed} of ${limit} attempts used`}>
      {Array.from({ length: limit }, (_, index) => {
        const completed = index < safeUsed
        return (
          <span key={index} className={`attempt-slot${completed ? ' used' : ''}`} title={`Attempt ${index + 1}: ${completed ? 'submitted' : 'available'}`}>
            {completed ? <Check size={compact ? 11 : 13} aria-hidden="true" /> : index + 1}
          </span>
        )
      })}
    </div>
  )
}

function TraineeDashboard({ userName, attemptCount, attemptLimit, onEntry }) {
  const remaining = Math.max(attemptLimit - attemptCount, 0)
  const limitReached = remaining === 0
  return (
    <section className="panel-list">
      <div className="panel-heading">
        <h2>PSR Detail Entries</h2>
        <span className="candidate-chip">Candidate: {userName}</span>
      </div>
      <div className={`attempt-summary${limitReached ? ' limit-reached' : ''}`}>
        <div className="attempt-summary-copy">
          <span>Attempt allowance</span>
          <strong>{limitReached ? 'All attempts used' : `${remaining} of ${attemptLimit} remaining`}</strong>
        </div>
        <AttemptMeter used={attemptCount} limit={attemptLimit} />
        <p>{limitReached ? <><Lock size={15} aria-hidden="true" /> No more returns can be submitted.</> : `Your next completed return will be attempt ${attemptCount + 1}.`}</p>
      </div>
      <div className="filter-panel">
        <label>Assessment Year <select defaultValue="2025-2026"><option>2025-2026</option></select></label>
        <label>Status <select defaultValue="NOT_INITIALIZED"><option>NOT_INITIALIZED</option></select></label>
        <label>Show <select defaultValue="50"><option>50</option></select> entries</label>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>SL</th>
            <th>Tin No / Submission Date / Taxpayer Name</th>
            <th>Submission Section</th>
            <th>Assessment Year</th>
            <th>Total Income</th>
            <th>Total Tax Paid</th>
            <th>Tax Paid (173)</th>
            <th>Net Asset</th>
            <th>PSR Status</th>
            <th>Entry Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td><strong>{traineeRow.tin}</strong><small>Submission Date Pending</small><span>{userName || traineeRow.name}</span></td>
            <td>{traineeRow.submissionSection}</td>
            <td>{traineeRow.assessmentYear}</td>
            <td>{traineeRow.totalIncome}</td>
            <td>{traineeRow.totalTaxPaid}</td>
            <td>{traineeRow.taxPaid173}</td>
            <td>{traineeRow.netAsset}</td>
            <td><span className="status-pill">{traineeRow.psrStatus}</span></td>
            <td><span className={`status-pill muted${limitReached ? ' locked' : ''}`}>{limitReached ? 'LIMIT_REACHED' : traineeRow.entryStatus}</span></td>
            <td><button type="button" className="row-button" disabled={limitReached} onClick={onEntry}>{limitReached ? 'Limit reached' : 'Entry'}</button></td>
          </tr>
        </tbody>
      </table>
    </section>
  )
}

function FormWorkspace(props) {
  const {
    attempt,
    patchAttempt,
    step,
    setStep,
    incomeTab,
    setIncomeTab,
    assetTab,
    setAssetTab,
    availableIncomeTabs,
    onBack,
    onSaveDraft,
    onNext,
    onRequireSave,
    onPreview,
    onSaveReturn,
  } = props
  const stepIndex = steps.indexOf(step)
  const activeSaveKey = step === 'Income and Tax' ? incomeTab : step === 'Assets' ? assetTab : step
  const nextEnabled = Boolean(attempt.savedTabs[activeSaveKey])
  const finalPage = step === 'Assets' && assetTab === 'Living Expenditure'
  const finalSaved = Boolean(attempt.savedTabs['Living Expenditure'])
  const handleNext = () => {
    if (!nextEnabled) {
      onRequireSave()
      return
    }
    if (step === 'Income and Tax') {
      const currentTabIndex = availableIncomeTabs.indexOf(incomeTab)
      const nextIncomeTab = availableIncomeTabs[currentTabIndex + 1]
      if (nextIncomeTab) {
        setIncomeTab(nextIncomeTab)
        return
      }
    }
    if (step === 'Assets' && assetTab === 'Assets Summary') {
      setAssetTab('Living Expenditure')
      return
    }
    onNext()
  }
  const canOpenStep = (item) => {
    const targetIndex = steps.indexOf(item)
    if (targetIndex <= stepIndex) return true
    if (item === 'Income and Tax') return Boolean(attempt.savedSteps.Assessment)
    if (item === 'Assets') return Boolean(attempt.savedSteps['Income and Tax'])
    return false
  }
  const requestStep = (item) => {
    if (item === step) return
    if (!canOpenStep(item)) {
      onRequireSave()
      return
    }
    setStep(item)
    if (item === 'Income and Tax') setIncomeTab('Income and Tax summary')
    if (item === 'Assets') setAssetTab('Assets Summary')
  }
  const requestIncomeTab = (item) => {
    if (item === incomeTab) return
    if (!attempt.savedTabs[incomeTab]) {
      onRequireSave()
      return
    }
    setIncomeTab(item)
  }
  const requestAssetTab = (item) => {
    if (item === assetTab) return
    if (item === 'Living Expenditure' && !attempt.savedTabs['Assets Summary']) {
      onRequireSave()
      return
    }
    if (!attempt.savedTabs[assetTab]) {
      onRequireSave()
      return
    }
    setAssetTab(item)
  }

  return (
    <section className="form-space pdf-like">
      <div className="entry-header">
        <button type="button" className="text-button" onClick={onBack}><ChevronLeft size={18} /> Back to PSR Detail Entries</button>
      </div>
      <div className="nbr-heading">
        <strong>জাতীয় রাজস্ব বোর্ড</strong>
        <span>www.nbr.gov.bd</span>
      </div>
      <div className="stepper">
        {steps.map((item) => (
          <button type="button" key={item} disabled={!canOpenStep(item)} className={step === item ? 'active' : attempt.savedSteps[item] ? 'complete' : ''} onClick={() => requestStep(item)}>
            {item}
          </button>
        ))}
      </div>
      {step === 'Income and Tax' && (
        <div className="tabs">
          {availableIncomeTabs.map((item) => {
            const saved = Boolean(attempt.savedTabs[item])
            return (
              <button type="button" key={item} className={incomeTab === item ? 'active' : saved ? 'complete' : ''} onClick={() => requestIncomeTab(item)}>
                {item}
              </button>
            )
          })}
        </div>
      )}
      {step === 'Assets' && (
        <div className="tabs">
          {['Assets Summary', 'Living Expenditure'].map((item) => (
            <button type="button" key={item} disabled={item === 'Living Expenditure' && !attempt.savedTabs['Assets Summary']} className={assetTab === item ? 'active' : attempt.savedTabs[item] ? 'complete' : ''} onClick={() => requestAssetTab(item)}>
              {item}
            </button>
          ))}
        </div>
      )}
      {step === 'Assessment' && (
        <AssessmentTopFields attempt={attempt} patchAttempt={patchAttempt} />
      )}
      <div className="form-card pdf-card">
        {step === 'Assessment' && <AssessmentForm attempt={attempt} patchAttempt={patchAttempt} />}
        {step === 'Income and Tax' && (
          <IncomeTaxForm
            attempt={attempt}
            patchAttempt={patchAttempt}
            incomeTab={incomeTab}
          />
        )}
        {step === 'Assets' && (
          <AssetsForm
            attempt={attempt}
            patchAttempt={patchAttempt}
            assetTab={assetTab}
          />
        )}
      </div>
      <div className="form-actions pdf-actions">
        <button type="button" className="ghost-button" onClick={onSaveDraft}>Save Draft</button>
        {finalPage ? (
          <>
            <button type="button" className="outline-button" onClick={onPreview}>Preview Return</button>
            <button type="button" className="success-button" disabled={!finalSaved} onClick={onSaveReturn}>Save Return</button>
          </>
        ) : (
          <button type="button" className={nextEnabled ? 'next-button enabled' : 'next-button'} disabled={!nextEnabled || (stepIndex === steps.length - 1 && assetTab === 'Living Expenditure')} onClick={handleNext}>
            Next <ChevronRight size={14} />
          </button>
        )}
      </div>
    </section>
  )
}

function AssessmentTopFields({ attempt, patchAttempt }) {
  const setAssessment = (key, value) => {
    patchAttempt((current) => ({
      ...current,
      assessment: { ...current.assessment, [key]: value },
    }))
  }
  return (
    <div className="assessment-top-fields bangla">
      {assessmentFields.slice(0, 3).map((field) => (
        <label key={field.key} className="assessment-top-row">
          <span>{field.label}{field.required && <b className="required">*</b>}</span>
          <input
            disabled={field.disabled}
            value={attempt.assessment[field.key]}
            onChange={(event) => setAssessment(field.key, event.target.value)}
          />
        </label>
      ))}
    </div>
  )
}

function AssessmentForm({ attempt, patchAttempt }) {
  const setAssessment = (key, value) => {
    patchAttempt((current) => ({
      ...current,
      assessment: { ...current.assessment, [key]: value },
    }))
  }

  return (
    <div className="assessment-section bangla">
      <div className="assessment-grid">
        <p className="assessment-required-note">দয়া করে <b className="required">*</b> চিহ্নিত ঘরসমূহ পূরণ করুন</p>
        {assessmentFields.slice(3).map((field) => (
          <div key={field.key}>
            <label className={`field-row${field.readOnly ? ' readonly-row' : ''}`}>
              <span>{field.no ? `${field.no}। ` : ''}{field.label}{field.required && <b className="required">*</b>}</span>
              {field.type === 'radio' ? (
                <span className="inline-radios">
                  {field.options.map((option) => (
                    <label key={option}>
                      <input
                        type="radio"
                        name={field.key}
                        checked={attempt.assessment[field.key] === option}
                        onChange={() => setAssessment(field.key, option)}
                      />
                      {option}
                    </label>
                  ))}
                </span>
              ) : (
                <input
                  type={field.type || 'text'}
                  disabled={field.disabled}
                  readOnly={field.readOnly}
                  placeholder={field.placeholder}
                  value={attempt.assessment[field.key]}
                  onChange={(event) => setAssessment(field.key, event.target.value)}
                />
              )}
            </label>
            {field.key === 'resident' && (
              <div className="field-row special-row">
                <span>৭। করদাতার বিশেষ সুবিধাপ্রাপ্তির ক্ষেত্রে টিক (✓) চিহ্ন দিন</span>
                <div className="special-options">
                  {specialFacilityRows.map((row) => (
                    <label key={row}>
                      <input
                        type="checkbox"
                        checked={Boolean(attempt.specialFacilities[row])}
                        onChange={(event) => patchAttempt((current) => ({
                          ...current,
                          specialFacilities: { ...current.specialFacilities, [row]: event.target.checked },
                        }))}
                      />
                      {row}
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function IncomeTaxForm({ attempt, patchAttempt, incomeTab }) {
  if (incomeTab === 'Income from employment') return <EmploymentSchedule attempt={attempt} patchAttempt={patchAttempt} />
  if (incomeTab === 'Income from rent') return <RentSchedule attempt={attempt} patchAttempt={patchAttempt} />
  if (incomeTab === 'Income from financial assets') return <PlainAmountTable title="আর্থিক পরিসম্পদ হইতে আয়:" rows={financialRows} values={attempt.financial} prefix="financial" patch={(values) => patchAttempt((current) => ({ ...current, financial: values }))} />
  if (incomeTab === 'Tax rebate') return <PlainAmountTable title="কর রেয়াতের জন্য প্রযোজ্য বিনিয়োগ বিবরণী:" rows={rebateRows} values={attempt.rebate} prefix="rebate" patch={(values) => patchAttempt((current) => ({ ...current, rebate: values }))} />
  return <IncomeSummary attempt={attempt} patchAttempt={patchAttempt} />
}

function IncomeSummary({ attempt, patchAttempt }) {
  const toggleIncome = (row, checked) => {
    patchAttempt((current) => ({
      ...current,
      incomeChecked: { ...current.incomeChecked, [row.key]: checked },
      incomeAmounts: checked ? current.incomeAmounts : { ...current.incomeAmounts, [row.key]: '' },
      jobType: row.key === 'employment' && !checked ? '' : current.jobType,
    }))
  }

  return (
    <div className="stacked-section bangla">
      <table className="form-table bangla">
        <thead><tr><th>ক্রম</th><th>মোট আয়ের বিবরণী</th><th>টাকার পরিমাণ</th></tr></thead>
        <tbody>
          {incomeSummaryRows.map((row) => {
            const enabled = row.total || Boolean(attempt.incomeChecked[row.key])
            return (
              <tr key={row.key}>
                <td>{row.no}।</td>
                <td>
                  {row.total ? row.label : (
                    <label className="check-label">
                      <input type="checkbox" checked={Boolean(attempt.incomeChecked[row.key])} onChange={(event) => toggleIncome(row, event.target.checked)} />
                      {row.label}
                    </label>
                  )}
                  {row.requiredExtra === 'jobType' && attempt.incomeChecked.employment && (
                    <div className="job-type-row">চাকরির ধরণ<b className="required">*</b>:
                      <label><input type="radio" name="jobType" checked={attempt.jobType === 'government'} onChange={() => patchAttempt((current) => ({ ...current, jobType: 'government' }))} /> সরকারি</label>
                      <label><input type="radio" name="jobType" checked={attempt.jobType === 'other'} onChange={() => patchAttempt((current) => ({ ...current, jobType: 'other' }))} /> অন্যান্য</label>
                    </div>
                  )}
                </td>
                <td>
                  <input
                    value={attempt.incomeAmounts[row.key]}
                    disabled={!enabled}
                    onChange={(event) => patchAttempt((current) => ({
                      ...current,
                      incomeAmounts: { ...current.incomeAmounts, [row.key]: event.target.value },
                    }))}
                  />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <NumberedTaxTable title="কর পরিগণনা" rows={taxRows} values={attempt.tax} checks={attempt.taxChecked} patchValues={(tax) => patchAttempt((current) => ({ ...current, tax }))} patchChecks={(taxChecked) => patchAttempt((current) => ({ ...current, taxChecked }))} />
      <NumberedTaxTable title="কর পরিশোধ বিবরণ" rows={paymentRows} values={attempt.payment} patchValues={(payment) => patchAttempt((current) => ({ ...current, payment }))} />
    </div>
  )
}

function NumberedTaxTable({ title, rows, values, checks, patchValues, patchChecks }) {
  return (
    <table className="form-table bangla">
      <thead><tr><th colSpan="2">{title}</th><th>টাকার পরিমাণ</th></tr></thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.key}>
            <td>{row.no}।</td>
            <td>
              {row.checkbox && checks ? (
                <label className="check-label"><input type="checkbox" checked={Boolean(checks[row.key])} onChange={(event) => patchChecks({ ...checks, [row.key]: event.target.checked })} /> {row.label}</label>
              ) : row.label}
              {row.hasText && <input className="inline-detail" value={values[`${row.key}Text`]} onChange={(event) => patchValues({ ...values, [`${row.key}Text`]: event.target.value })} />}
            </td>
            <td><input value={values[row.key]} onChange={(event) => patchValues({ ...values, [row.key]: event.target.value })} /></td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function EmploymentSchedule({ attempt, patchAttempt }) {
  const patch = (key, value) => {
    patchAttempt((current) => ({ ...current, employment: { ...current.employment, [key]: value } }))
  }
  return (
    <div className="stacked-section bangla">
      <h2 className="bangla-title">তফসিল ১</h2>
      <p className="center-note">চাকরি হইতে আয় থাকিলে নিম্নোক্ত তফসিলটি পূরণ করিতে হইবে</p>
      <table className="form-table bangla">
        <thead><tr><th>বিবরণসমূহ</th><th>আয়ের পরিমাণ</th><th>কর অব্যাহতি প্রাপ্ত আয়</th><th>নীট করযোগ্য আয়</th></tr></thead>
        <tbody>
          {employmentRows.map((row) => (
            <tr key={row}>
              <td>{row}</td>
              {['income', 'exempt', 'net'].map((col) => {
                const key = `${row}:${col}`
                return <td key={key}><input value={attempt.employment[key]} onChange={(event) => patch(key, event.target.value)} /></td>
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function RentSchedule({ attempt, patchAttempt }) {
  const patch = (key, value) => {
    patchAttempt((current) => ({ ...current, rent: { ...current.rent, [key]: value } }))
  }
  const amountInput = (key) => <input value={attempt.rent[key]} onChange={(event) => patch(key, event.target.value)} />
  return (
    <div className="stacked-section bangla">
      <h2 className="bangla-title">তফসিল ২</h2>
      <p className="center-note">ভাড়া হইতে আয় থাকিলে নিম্নোক্ত তফসিলটি পূরণ করিতে হইবে</p>
      <p className="required-line">দয়া করে <b className="required">*</b> চিহ্নিত ঘরসমূহ পূরণ করুন</p>
      <table className="form-table rent-table bangla">
        <thead>
          <tr>
            <th>সম্পত্তির অবস্থান, বিবরণ ও মালিকানার অংশ<b className="required">*</b></th>
            <th>মোট ভাড়া মূল্য পরিগণনা</th>
            <th>টাকার পরিমাণ</th>
            <th>টাকার পরিমাণ</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td rowSpan="15" className="rent-property-cell">
              <textarea value={attempt.rent.propertyDescription} onChange={(event) => patch('propertyDescription', event.target.value)} />
            </td>
            <td>১। বার্ষিক প্রাপ্ত ভাড়া বা বার্ষিক মূল্য, যাহা অধিক</td>
            <td>{amountInput('annualRent')}</td>
            <td rowSpan="5" />
          </tr>
          <tr><td>২। অগ্রিম প্রাপ্ত ভাড়া</td><td>{amountInput('advanceRent')}</td></tr>
          <tr><td>৩। ভাড়া ব্যতীত অন্য কোনো সুবিধার মূল্য</td><td>{amountInput('benefitValue')}</td></tr>
          <tr><td>৪। সমন্বয়কৃত অগ্রিম ভাড়া</td><td>{amountInput('adjustedAdvanceRent')}</td></tr>
          <tr><td>৫। খালি থাকার জন্য ছাড়</td><td>{amountInput('vacancyAllowance')}</td></tr>
          <tr><td colSpan="2">৬। মোট ভাড়ামূল্য [(১+২+৩)-৪-৫]</td><td>{amountInput('totalRentValue')}</td></tr>
          <tr><td colSpan="2">৭। অনুমোদনযোগ্য বিয়োজনসমূহ</td><td>{amountInput('allowableDeduction')}</td></tr>
          <tr><td>(ক) মেরামত, আদায় ইত্যাদি</td><td>{amountInput('municipalTax')}</td><td rowSpan="5" /></tr>
          <tr><td>(খ) পৌর কর অথবা স্থানীয় কর</td><td>{amountInput('landRevenue')}</td></tr>
          <tr><td>(গ) ভূমি রাজস্ব</td><td>{amountInput('loanInterest')}</td></tr>
          <tr><td>(ঘ) পরিশোধিত ঋণের উপর সুদ / ব্যাংক / মূলধনি চার্জ</td><td>{amountInput('insurancePremium')}</td></tr>
          <tr><td>(ঙ) অন্যান্য (যদি থাকে)</td><td>{amountInput('otherRentDeduction')}</td></tr>
          <tr><td colSpan="2">৮। মোট অনুমোদনযোগ্য বিয়োজন</td><td>{amountInput('totalAllowableDeduction')}</td></tr>
          <tr><td colSpan="2">৯। নীট আয় (ক্রমিক ৬ হইতে ক্রমিক ৮ এর বিয়োগফল)</td><td>{amountInput('netHouseIncome')}</td></tr>
          <tr><td colSpan="2">১০। করদাতার অংশ (প্রযোজ্য ক্ষেত্রে)</td><td>{amountInput('taxpayerShare')}</td></tr>
        </tbody>
      </table>
    </div>
  )
}

function MoneyInput({ value, onChange }) {
  return (
    <span className="money-input">
      <span>টাকা</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} />
    </span>
  )
}

function AssetsSummary({ attempt, patchAttempt }) {
  const patch = (index, value) => {
    patchAttempt((current) => ({ ...current, assets: { ...current.assets, [`asset${index}`]: value } }))
  }
  return (
    <div className="asset-statement bangla">
      <h2 className="bangla-title">পরিসম্পদ দায় ও ব্যয় বিবরণী</h2>
      <p className="center-note"><strong>পরিসম্পদ দায় ও ব্যয় বিবরণী উক্ত করদাতার জন্য প্রযোজ্য নয়</strong></p>
      <div className="asset-lines">
        {assetSummaryRows.map((row, index) => (
          <label key={row} className="asset-line">
            <span>{index + 1}। {row}</span>
            <MoneyInput value={attempt.assets[`asset${index}`]} onChange={(value) => patch(index, value)} />
          </label>
        ))}
      </div>
    </div>
  )
}

function PlainAmountTable({ title, rows, values, prefix, patch }) {
  return (
    <div className="stacked-section bangla">
      <h2 className="table-title">{title}</h2>
      <table className="form-table bangla">
        <tbody>
          {rows.map((row, index) => {
            const key = `${prefix}${index}`
            return (
              <tr key={key}>
                <td>{index + 1}।</td>
                <td>{row}</td>
                <td>
                  <input value={values[key]} onChange={(event) => patch({ ...values, [key]: event.target.value })} />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function AssetsForm({ attempt, patchAttempt, assetTab }) {
  if (assetTab === 'Living Expenditure') {
    return <PlainAmountTable title="জীবনযাপন সংশ্লিষ্ট ব্যয়ের বিবরণী" rows={livingRows} values={attempt.living} prefix="living" patch={(living) => patchAttempt((current) => ({ ...current, living }))} />
  }
  return <AssetsSummary attempt={attempt} patchAttempt={patchAttempt} />
}

function AdminDashboard({ attempts, users, dataLoading, onCreateUser, onLogout, onNotify, onPreview }) {
  const [expandedUsers, setExpandedUsers] = useState({})
  const grouped = attempts.reduce((acc, attempt) => {
    const key = attemptUserKey(attempt)
    acc[key] = acc[key] || []
    acc[key].push(attempt)
    return acc
  }, {})
  const userRows = Object.entries(users).map(([key, user]) => {
    const userAttempts = grouped[key] || []
    return {
      key,
      username: user.username || user.userName,
      createdAt: user.createdAt,
      attempts: userAttempts,
      latest: userAttempts[0],
      attemptLimit: Number(user.attemptLimit || MAX_ATTEMPTS),
    }
  })
  const orphanAttemptRows = Object.entries(grouped)
    .filter(([key]) => !users[key])
    .map(([key, userAttempts]) => ({
      key,
      username: userAttempts[0]?.userName || key,
      createdAt: userAttempts[0]?.createdAt,
      attempts: userAttempts,
      latest: userAttempts[0],
      attemptLimit: MAX_ATTEMPTS,
    }))
  const allUserRows = [...userRows, ...orphanAttemptRows]

  const copyUsername = async (username) => {
    try {
      await navigator.clipboard.writeText(username)
      onNotify('success', `Copied ${username}.`)
    } catch {
      onNotify('error', 'Copy failed. Select and copy the username manually.')
    }
  }

  return (
    <div className="admin-screen">
      <header className="admin-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Create trainee usernames, monitor attempts, marks, and previews.</p>
        </div>
        <div className="admin-header-actions">
          <button type="button" className="success-button" onClick={onCreateUser}><Plus size={16} /> Create trainee</button>
          <button type="button" className="secondary-button" onClick={onLogout}>Logout</button>
        </div>
      </header>
      <section className="admin-grid">
        <div className="admin-card"><strong>{allUserRows.length}</strong><span>Created users</span></div>
        <div className="admin-card"><strong>{attempts.length}</strong><span>Total attempts</span></div>
        <div className="admin-card"><strong>{attempts.length ? Math.round(attempts.reduce((sum, item) => sum + Number(item.score || 0), 0) / attempts.length) : 0}</strong><span>Average mark</span></div>
      </section>
      <table className="data-table admin-table">
        <thead><tr><th>Username</th><th>Attempts</th><th>Latest attempt</th><th>Latest score</th><th>Action</th></tr></thead>
        <tbody>
          {dataLoading && (
            <tr><td colSpan="5" className="empty-cell">Loading Supabase data...</td></tr>
          )}
          {!dataLoading && allUserRows.length === 0 && (
            <tr><td colSpan="5" className="empty-cell">No trainee usernames yet. Create one to begin.</td></tr>
          )}
          {allUserRows.flatMap(({ key, username, attempts: userAttempts, latest, attemptLimit }) => {
            const expanded = Boolean(expandedUsers[key])
            const userRow = (
              <tr key={key}>
                <td>
                  <button type="button" className="copy-username" title="Copy username" onClick={() => copyUsername(username)}>
                    {username}
                  </button>
                </td>
                <td>
                  <span className="attempt-count-label">{userAttempts.length} / {attemptLimit}</span>
                  <AttemptMeter used={userAttempts.length} limit={attemptLimit} compact />
                </td>
                <td>{latest ? new Date(latest.submittedAt || latest.createdAt).toLocaleString() : 'No attempts yet'}</td>
                <td>{latest ? `${latest.score}/100` : '-'}</td>
                <td className="admin-actions">
                  <button type="button" className="row-button" disabled={!userAttempts.length} onClick={() => setExpandedUsers((current) => ({ ...current, [key]: !expanded }))}>
                    {expanded ? 'Hide attempts' : 'View attempts'}
                  </button>
                  <button type="button" className="row-button" disabled={!latest} onClick={() => onPreview(latest)}><Eye size={14} /> Latest</button>
                </td>
              </tr>
            )
            const attemptRows = expanded
              ? userAttempts.map((item, index) => (
                <tr key={item.id} className="attempt-detail-row">
                  <td>Attempt {userAttempts.length - index}</td>
                  <td>{item.status}</td>
                  <td>{new Date(item.submittedAt || item.createdAt).toLocaleString()}</td>
                  <td>{item.score}/100</td>
                  <td><button type="button" className="row-button" onClick={() => onPreview(item)}><Eye size={14} /> Preview attempt</button></td>
                </tr>
              ))
              : []
            return [userRow, ...attemptRows]
          })}
        </tbody>
      </table>
    </div>
  )
}

function AttemptPreview({ attempt, onBack, onNotify, admin = false }) {
  const noopPatch = () => {}
  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(attempt.userName || attempt.userCode || '')
      onNotify?.('success', 'Username copied.')
    } catch {
      onNotify?.('error', 'Copy failed.')
    }
  }
  return (
    <div className="preview-screen">
      <div className="preview-toolbar">
        <button type="button" onClick={onBack}><ChevronLeft size={18} /> Back</button>
        <button type="button" className="preview-close-button" aria-label="Close preview" onClick={onBack}><X size={20} /></button>
      </div>
      <article className="return-page full-preview-page">
        <div className="return-header">
          <FileText size={42} />
          <div>
            <h1>Attempt Preview</h1>
            <p>
              <button type="button" className="copy-username inline-copy" onClick={copyId}>{attempt.userName}</button>
              {' '} - {attempt.status}
            </p>
          </div>
          <strong>{admin ? `Score ${attempt.score}/100` : 'Practice Draft'}</strong>
        </div>
        <section className="mistake-panel">
          <h2>Detected issues / scoring notes</h2>
          <ul>
            {(attempt.mistakes?.length ? attempt.mistakes : buildPlaceholderMistakes(attempt)).map((mistake) => <li key={mistake}>{mistake}</li>)}
          </ul>
        </section>
        <div className="preview-form-pages">
          <PreviewBlock title="Assessment">
            <AssessmentTopFields attempt={attempt} patchAttempt={noopPatch} />
            <AssessmentForm attempt={attempt} patchAttempt={noopPatch} />
          </PreviewBlock>
          <PreviewBlock title="Income and Tax summary">
            <IncomeSummary attempt={attempt} patchAttempt={noopPatch} />
          </PreviewBlock>
          <PreviewBlock title="Income from employment">
            <EmploymentSchedule attempt={attempt} patchAttempt={noopPatch} />
          </PreviewBlock>
          <PreviewBlock title="Income from rent">
            <RentSchedule attempt={attempt} patchAttempt={noopPatch} />
          </PreviewBlock>
          <PreviewBlock title="Income from financial assets">
            <PlainAmountTable title="আর্থিক পরিসম্পদ হইতে আয়:" rows={financialRows} values={attempt.financial} prefix="financial" patch={noopPatch} />
          </PreviewBlock>
          <PreviewBlock title="Tax rebate">
            <PlainAmountTable title="কর রেয়াতের জন্য প্রযোজ্য বিনিয়োগ বিবরণী:" rows={rebateRows} values={attempt.rebate} prefix="rebate" patch={noopPatch} />
          </PreviewBlock>
          <PreviewBlock title="Assets Summary">
            <AssetsSummary attempt={attempt} patchAttempt={noopPatch} />
          </PreviewBlock>
          <PreviewBlock title="Living Expenditure">
            <PlainAmountTable title="জীবনযাপন সংশ্লিষ্ট ব্যয়ের বিবরণী" rows={livingRows} values={attempt.living} prefix="living" patch={noopPatch} />
          </PreviewBlock>
        </div>
      </article>
    </div>
  )
}

function PreviewBlock({ title, children }) {
  return (
    <section className="preview-block">
      <h2>{title}</h2>
      {children}
    </section>
  )
}

function Toast({ type, message }) {
  return <div className={`toast ${type}`}>{message}</div>
}

function Footer() {
  return <footer className="app-footer">Copyright © 2026. National Board of Revenue. All rights reserved.</footer>
}

function scoreAttempt(attempt) {
  let score = 40
  if (Object.values(attempt.assessment).filter(Boolean).length >= 6) score += 15
  if (Object.values(attempt.incomeChecked).some(Boolean)) score += 15
  if (attempt.savedSteps.Assessment) score += 10
  if (attempt.savedSteps['Income and Tax']) score += 10
  if (attempt.savedSteps.Assets) score += 10
  return Math.min(score, 100)
}

function buildPlaceholderMistakes(attempt) {
  const issues = []
  if (!attempt.assessment.name) issues.push('Assessment: taxpayer name was not filled.')
  if (attempt.incomeChecked.employment && !attempt.jobType) issues.push('Income Summary: চাকরির ধরণ was required but not selected.')
  if (attempt.incomeChecked.rent && !attempt.rent.propertyDescription) issues.push('Income from rent: required property description was not filled.')
  if (!Object.values(attempt.incomeChecked).some(Boolean)) issues.push('Income Summary: no income source was selected.')
  if (!issues.length) issues.push('No rule-based mistakes detected yet. Final marking rules can be added later.')
  return issues
}

export default App
