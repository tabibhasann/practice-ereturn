import { useEffect, useMemo, useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  FileText,
  Menu,
  Printer,
  Search,
  Send,
  UserRound,
} from 'lucide-react'
import './App.css'

const taxpayers = [
  {
    id: 'TP-001',
    tin: '123456789012',
    name: 'MD HASAN',
    zone: 'Zone-03, Dhaka',
    circle: 'Circle-071',
    status: 'Draft',
    psrStatus: 'APPROVED',
    entryStatus: 'NOT_INITIALIZED',
    submissionSection: '82BB',
    submissionDate: '03-07-2026',
    totalIncome: 350000,
    totalTaxPaid: 12000,
    taxPaid173: 0,
    netAsset: 2800000,
    year: '2025-2026',
  },
  {
    id: 'TP-002',
    tin: '198765432109',
    name: 'ABDUL KARIM',
    zone: 'Zone-08, Dhaka',
    circle: 'Circle-124',
    status: 'Verified',
    psrStatus: 'APPROVED',
    entryStatus: 'VERIFIED',
    submissionSection: '82BB',
    submissionDate: '20-06-2026',
    totalIncome: 336000,
    totalTaxPaid: 5000,
    taxPaid173: 0,
    netAsset: 1200000,
    year: '2024-2025',
  },
  {
    id: 'TP-003',
    tin: '102938475601',
    name: 'NUSRAT JAHAN',
    zone: 'Zone-11, Chattogram',
    circle: 'Circle-208',
    status: 'Ready',
    psrStatus: 'NOT_INITIALIZED',
    entryStatus: 'NEW',
    submissionSection: '82BB',
    submissionDate: '',
    totalIncome: 500000,
    totalTaxPaid: 15000,
    taxPaid173: 0,
    netAsset: 2600000,
    year: '2025-2026',
  },
]

const assessmentFields = [
  ['১', 'করদাতার নাম', 'MD HASAN'],
  ['২', 'জাতীয় পরিচয়পত্র নম্বর', '19901234567890123'],
  ['৩', 'কর অঞ্চল ও সার্কেল', 'Zone-03 / Circle-071'],
  ['৪', 'ঠিকানা', 'House 12, Road 07, Uttara, Dhaka'],
  ['৫', 'মোবাইল', '01575000000'],
  ['৬', 'ই-মেইল', ''],
  ['৭', 'করদাতার ধরন', 'স্বাভাবিক ব্যক্তি'],
  ['৮', 'আবাসিক অবস্থান', 'নিবাসী'],
  ['৯', 'জন্ম তারিখ', '01-01-1990'],
  ['১০', 'লিঙ্গ', 'পুরুষ'],
  ['১১', 'চাকরিজীবী করদাতার ক্ষেত্রে নিয়োগকারী প্রতিষ্ঠানের নাম', 'NBR'],
  ['১২', '(ক) ব্যবসা প্রতিষ্ঠানের নাম', ''],
  ['১৩', '(খ) ব্যবসার নিবন্ধন নম্বর (BIN)(সমূহ)', ''],
  ['১৪', 'ফার্ম বা ব্যক্তিসংঘের ক্ষেত্রে অংশীদার/সদস্যের নাম ও টিআইএন', ''],
]

const incomeRows = [
  { key: 'salary', label: 'চাকরি হতে আয় (এই রিটার্নের তফসিল ১ অনুযায়ী)', amount: 300000, checked: true },
  { key: 'rent', label: 'ভাড়া হতে আয় (এই রিটার্নের তফসিল ২ অনুযায়ী)', amount: 0 },
  { key: 'agri', label: 'কৃষি হতে আয় (এই রিটার্নের তফসিল ৩ অনুযায়ী)', amount: 0 },
  { key: 'business', label: 'ব্যবসা হতে আয় (এই রিটার্নের তফসিল ৪ অনুযায়ী)', amount: 0 },
  { key: 'capital', label: 'মূলধনি আয়', amount: 0 },
  { key: 'financial', label: 'আর্থিক পরিসম্পদ হতে আয়', amount: 30000 },
  { key: 'other', label: 'অন্যান্য উৎস হতে আয়', amount: 6000 },
  { key: 'firmshare', label: 'ফার্ম বা ব্যক্তিসংঘের আয়ের অংশ', amount: 0 },
  { key: 'minor', label: 'অপ্রাপ্ত বয়স্ক সন্তান, স্ত্রী বা স্বামীর আয় (করদাতা না হলে)', amount: 0 },
  { key: 'foreign', label: 'বিদেশে অর্জিত করযোগ্য আয়', amount: 0 },
]

const salaryRows = [
  ['বেতন', 240000, 0, 240000],
  ['ভাতাসমূহ', 40000, 0, 40000],
  ['এরিয়ার বকেয়া বেতন', 0, 0, 0],
  ['আনুতোষিক, অ্যানুইটি, পেনশন বা ইহার সম্পূরক', 0, 0, 0],
  ['পারকুইজিট', 0, 0, 0],
  ['বেতন বা মজুরির পরিবর্তে প্রাপ্ত অথবা অতিরিক্ত প্রাপ্তি', 0, 0, 0],
  ['কর্মচারী শেয়ার স্কিম হতে অর্জিত আয়', 0, 0, 0],
  ['আবাসন সুবিধা', 0, 0, 0],
  ['যানবাহন সুবিধা', 0, 0, 0],
  ['চিকিৎসা ভাতা', 10000, 0, 10000],
  ['বাড়িভাড়া ভাতা', 120000, 60000, 60000],
  ['যাতায়াত ভাতা', 0, 0, 0],
  ['অন্যান্য সুবিধা', 0, 0, 0],
]

const financialIncomeRows = [
  ['ব্যাংক সুদ / মুনাফা হতে আয়', 0],
  ['লভ্যাংশ হতে আয়', 0],
  ['সঞ্চয়পত্র মুনাফা হতে আয়', 0],
  ['সিকিউরিটিজ হতে আয়', 0],
  ['অন্যান্য', 0],
  ['নেট', 0],
]

const taxCalculationRows = [
  ['১১', 'মোট আয় (ক্রমিক ১ হতে ১০ এর সমষ্টি)', 350000],
  ['১২', 'মোট কর পরিগণনাযোগ্য আয়ের উপর আরোপযোগ্য আয়কর', 0],
  ['১৩', 'কর রেয়াত (এই রিটার্নের তফসিল ৩ অনুযায়ী)', 0],
  ['১৪', 'রেয়াত-পরবর্তী প্রদেয় করদায় (১২-১৩)', 0],
  ['১৫', 'ন্যূনতম কর', 5000],
  ['১৬', 'প্রদেয় কর (ক্রমিক ১৪ ও ক্রমিক ১৫ এর মধ্যে যাহা অধিক)', 5000],
  ['১৭(ক)', 'নেট পরিসম্পদের জন্য প্রদেয় সারচার্জ (প্রযোজ্য ক্ষেত্রে)', 0],
  ['১৭(খ)', 'পরিবেশ সারচার্জ (প্রযোজ্য ক্ষেত্রে)', 0],
  ['১৮', 'বিশেষ সুদ, জরিমানা অথবা আয়কর আইনে বর্ণিত প্রদেয় কোনো অঙ্ক (যদি থাকে)', 0],
  ['১৯', 'মোট প্রদেয় কর (১৬+১৭+১৮)', 0],
]

const taxPaymentRows = [
  ['২০', 'উৎসে কর্তিত/সংগৃহীত অগ্রিম কর', 8000],
  ['২১', 'পরিশোধিত অগ্রিম কর (প্রমাণাদি সংযুক্ত করুন)', 0],
  ['২২', 'প্রত্যার্পণযোগ্য করের সমন্বয় (যদি থাকে)', 0],
  ['২৩', 'এই রিটার্নের সহিত পরিশোধিত অবশিষ্ট কর', 4000],
  ['২৪', 'প্রদেয় কর (২০+২১+২২+২৩)', 12000],
  ['২৫', 'অতিরিক্ত পরিশোধ', 0],
  ['২৬', 'কর অব্যাহতিপ্রাপ্ত / করমুক্ত আয় (বিবরণ সংযুক্ত করুন)', 150000],
]

const rebateRows = [
  ['জীবন বীমা প্রিমিয়াম', 0],
  ['ডিপোজিট পেনশন স্কিম', 0],
  ['সঞ্চয়পত্র ক্রয়', 0],
  ['শেয়ার/ডিবেঞ্চার/মিউচুয়াল ফান্ডে বিনিয়োগ', 0],
  ['যাকাত/দান/অনুদান', 0],
  ['অন্যান্য অনুমোদনযোগ্য বিনিয়োগ', 0],
]

const assetRows = [
  ['১(ক)', 'ব্যবসার মূলধন (পরিসম্পদ ও দায়ের পার্থক্য)', 0],
  ['১(খ)', 'পরিচালক হিসাবে লিমিটেড কোম্পানিতে শেয়ার বিনিয়োগ', 0],
  ['১(গ)', 'অংশীদারী ফার্মে মূলধনের জের', 0],
  ['১(ঘ)', 'অ-কৃষি সম্পত্তি/জমি/গৃহ সম্পত্তি (আইন সম্মত ব্যয়সহ ক্রয়মূল্য/অর্জনমূল্য/নির্মাণ ব্যয়/বিনিয়োগ)', 0],
  ['১(ঙ)', 'কৃষি সম্পত্তি (আইনসম্মত ব্যয়সহ ক্রয়মূল্য/অর্জনমূল্য)', 0],
  ['১(চ)', 'আর্থিক সম্পদসমূহ', 1100000],
  ['১(ছ)', 'মোটর যান (রেজিস্ট্রেশন খরচসহ ক্রয়মূল্য)', 0],
  ['১(জ)', 'স্বর্ণালঙ্কার', 4000],
  ['১(ঝ)', 'আসবাবপত্র ও ইলেকট্রনিক সামগ্রী', 0],
  ['১(ঞ)', 'অন্যান্য পরিসম্পদ (ক্রমিক ১ এ বর্ণিত সম্পদ ব্যতীত)', 0],
  ['২', 'বিগত আয়বর্ষের শেষ তারিখের নীট সম্পদ', 2600000],
  ['৩', 'বর্তমান ও বিগত আয়বর্ষের শেষ তারিখের নীট সম্পদের যোগফল (১+২)', 0],
  ['৪(ক)', 'জীবনযাপন সংশ্লিষ্ট ব্যয়: মোট খরচ', 0],
  ['৪(খ)', 'আইনসম্মত নয় এমন দান প্রদান/ব্যয়/ক্ষতি', 0],
  ['৫', 'এই আয়বর্ষের শেষ তারিখের নীট সম্পদ (৩-৪)', 2800000],
  ['৬(ক)', 'ব্যক্তিগত দায়: প্রাতিষ্ঠানিক দায়', 0],
  ['৬(খ)', 'ব্যক্তিগত দায়: অপ্রাতিষ্ঠানিক দায়', 0],
  ['৬(গ)', 'ব্যক্তিগত দায়: অন্যান্য দায়', 200000],
  ['৭', 'মোট পরিসম্পদ (ক্রমিক ৫ ও ৬ এর যোগফল)', 0],
  ['৮(ক)', 'বাংলাদেশে অবস্থিত পরিসম্পদের খাতভিত্তিক বিবরণ: ব্যবসার মোট পরিসম্পদ', 0],
  ['৮(খ)', 'বিনিয়োগ: ব্যবসায়িক দায় (প্রাতিষ্ঠানিক ও অপ্রাতিষ্ঠানিক)', 0],
  ['৮(গ)', 'ব্যবসার মূলধন', 0],
  ['৮(ঘ)', 'পরিচালক হিসাবে লিমিটেড কোম্পানিতে শেয়ার বিনিয়োগ', 0],
  ['৮(ঙ)', 'অংশীদারী ফার্মে মূলধনের জের', 0],
  ['৮(চ)', 'অ-কৃষি সম্পত্তি/জমি/গৃহ সম্পত্তি', 0],
  ['৮(ছ)', 'কৃষি সম্পত্তি', 0],
  ['৮(জ)', 'আর্থিক সম্পদসমূহ', 0],
  ['৮(ঝ)', 'সঞ্চয়পত্র/ডিপোজিট পেনশন স্কিম', 0],
  ['৮(ঞ)', 'ঋণ প্রদান (ঋণ গ্রহীতার নাম ও এনআইডি উল্লেখ করুন)', 0],
  ['৮(ট)', 'সঞ্চয়ী/মেয়াদি আমানত', 0],
  ['৮(ঠ)', 'প্রভিডেন্ট ফান্ড বা অন্যান্য ফান্ড', 100000],
  ['৮(ড)', 'অন্যান্য বিনিয়োগ', 0],
  ['৮(ঢ)', 'মোট আর্থিক সম্পদ', 1100000],
  ['৮(ণ)', 'মোটর যান', 0],
  ['৮(ত)', 'স্বর্ণালঙ্কার', 4000],
  ['৮(থ)', 'আসবাবপত্র ও ইলেকট্রনিক সামগ্রী', 0],
  ['৮(দ)', 'অন্যান্য পরিসম্পদ', 0],
]

const expenseRows = [
  ['১', 'ব্যক্তিগত ও পারিবারিক ব্যয়', 50000],
  ['২', 'কর, সারচার্জ, ফি ইত্যাদি পরিশোধ', 0],
  ['৩', 'দানের পরিমাণ', 0],
  ['৪', 'ভ্রমণ ব্যয়', 0],
  ['৫', 'শিক্ষা ব্যয়', 0],
  ['৬', 'চিকিৎসা ব্যয়', 0],
  ['৭', 'অনুমোদনযোগ্য বিয়োজনসমূহ', 50000],
  ['৭(ক)', 'মেরামত, আদায় ইত্যাদি', 0],
  ['৭(খ)', 'পৌর কর অথবা স্থানীয় কর', 0],
  ['৭(গ)', 'ভূমি রাজস্ব', 0],
  ['৭(ঘ)', 'পরিশোধিত ঋণের উপর সুদ/ব্যাংক/মূলধনি চার্জ', 0],
  ['৭(ঙ)', 'পরিশোধিত বীমা প্রিমিয়াম', 0],
  ['৭(চ)', 'অন্যান্য (যদি থাকে)', 0],
  ['৮', 'মোট অনুমোদনযোগ্য বিয়োজন', 0],
  ['৯', 'নীট আয় (ক্রমিক ১ হতে ক্রমিক ৮ এর বিয়োগফল)', 0],
  ['১০', 'করদাতার অংশ (প্রযোজ্য ক্ষেত্রে)', 0],
]

const generatedSchedules = [
  {
    title: 'Schedule - 1 (Employment Income)',
    rows: ['Salary', 'Allowances', 'Festival bonus', 'House rent allowance', 'Medical allowance', 'Taxable employment income'],
  },
  {
    title: 'Schedule - 2 (House Property Income)',
    rows: ['Annual Rental Income', 'Repair, Collection, etc.', 'Municipal or Local Tax', 'Land Revenue', 'Interest on Loan / Mortgage / Capital Charge', 'Insurance Premium', 'Vacancy Allowance', 'Other, if any', 'Net Income'],
  },
  {
    title: 'Schedule - 3 (Investment Tax Credit)',
    rows: ['Life insurance premium', 'Deposit pension scheme', 'Investment in securities', 'Approved donation', 'Total allowable investment'],
  },
]

const formSteps = ['Assessment', 'Income and Tax', 'Assets']

function App() {
  const [screen, setScreen] = useState('login')
  const [year, setYear] = useState('2025-2026')
  const [query, setQuery] = useState('')
  const [selectedTaxpayer, setSelectedTaxpayer] = useState(taxpayers[0])
  const [step, setStep] = useState('Assessment')
  const [tab, setTab] = useState('Income and Tax summary')
  const [saved, setSaved] = useState(false)
  const [amounts, setAmounts] = useState(() =>
    Object.fromEntries(incomeRows.map((row) => [row.key, row.amount])),
  )

  const totalIncome = useMemo(
    () => Object.values(amounts).reduce((sum, value) => sum + Number(value || 0), 0),
    [amounts],
  )
  const taxPayable = Math.max(Math.round((totalIncome - 350000) * 0.05), 0)
  const totalAssets = assetRows.reduce((sum, row) => sum + Number(row[2] || 0), 0)

  const filteredTaxpayers = taxpayers.filter((taxpayer) =>
    `${taxpayer.name} ${taxpayer.tin} ${taxpayer.zone}`.toLowerCase().includes(query.toLowerCase()),
  )

  useEffect(() => {
    window.history.replaceState({ screen: 'login' }, '', '#login')
    const handlePopState = (event) => {
      setScreen(event.state?.screen || 'login')
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const navigate = (nextScreen) => {
    window.history.pushState({ screen: nextScreen }, '', `#${nextScreen}`)
    setScreen(nextScreen)
  }

  if (screen === 'login') {
    return <LoginScreen onEnter={() => navigate('dashboard')} onTin={() => navigate('tin-registration')} />
  }

  if (screen === 'tin-registration') {
    return <TinRegistration onBack={() => navigate('login')} onEnter={() => navigate('dashboard')} />
  }

  if (screen === 'preview') {
    return (
      <Preview
        taxpayer={selectedTaxpayer}
        year={year}
        totalIncome={totalIncome}
        taxPayable={taxPayable}
        totalAssets={totalAssets}
        onBack={() => navigate('form')}
      />
    )
  }

  return (
    <div className="office-shell">
      <Sidebar onDashboard={() => navigate('dashboard')} />
      <main className="workspace">
        <Topbar year={year} setYear={setYear} query={query} setQuery={setQuery} />
        {screen === 'dashboard' ? (
          <Dashboard
            taxpayers={filteredTaxpayers}
            onNew={() => {
              setSelectedTaxpayer(taxpayers[0])
              setYear('2025-2026')
              setStep('Assessment')
              navigate('form')
            }}
            onOpen={(taxpayer) => {
              setSelectedTaxpayer(taxpayer)
              setYear(taxpayer.year)
              setStep('Assessment')
              navigate('form')
            }}
          />
        ) : (
          <FormWorkspace
            taxpayer={selectedTaxpayer}
            step={step}
            setStep={setStep}
            tab={tab}
            setTab={setTab}
            amounts={amounts}
            setAmounts={setAmounts}
            totalIncome={totalIncome}
            totalAssets={totalAssets}
            saved={saved}
            onDashboard={() => navigate('dashboard')}
            onSave={() => {
              setSaved(true)
              window.setTimeout(() => setSaved(false), 1800)
            }}
            onPreview={() => navigate('preview')}
          />
        )}
      </main>
    </div>
  )
}

function LoginScreen({ onEnter, onTin }) {
  return (
    <div className="login-screen">
      <div className="login-card">
        <Logo />
        <button type="button" className="manual-button">User Manual</button>
        <h1>Welcome!</h1>
        <p>Sign in to go next screen</p>
        <label>
          User ID
          <input defaultValue="123456789012" />
        </label>
        <label>
          Password
          <input type="password" defaultValue="practice" />
        </label>
        <button type="button" className="primary-button" onClick={onEnter}>
          Sign In
        </button>
        <button type="button" className="link-button">Reset password?</button>
        <button type="button" className="link-button" onClick={onTin}>
          Open TIN Registration login
          <ExternalLink size={14} />
        </button>
      </div>
    </div>
  )
}

function TinRegistration({ onBack, onEnter }) {
  return (
    <div className="tin-screen">
      <header className="tin-banner">
        <div>
          <strong>National Board of Revenue</strong>
          <span>Taxpayer's Identification Number</span>
        </div>
        <h1>TIN REGISTRATION</h1>
      </header>
      <nav className="tin-nav">
        {['Home', 'Login', 'Register', 'Forget Password', 'Third Party TIN Verification', 'Return Verify'].map((item) => (
          <button type="button" key={item}>{item}</button>
        ))}
      </nav>
      <main className="tin-login">
        <section>
          <h2>Login</h2>
          <label>User ID <input defaultValue="tp_de_user1@274Dhaka" /></label>
          <label>Password <input type="password" defaultValue="EReturn123#" /></label>
          <button type="button" className="primary-button" onClick={onEnter}>Login</button>
          <p>Do not have User ID? <button type="button" className="inline-link">Register</button></p>
          <p><button type="button" className="inline-link">eReturn User ID</button></p>
        </section>
        <aside>
          <button type="button">Quick Management</button>
          <button type="button">Utility Services</button>
          <button type="button">API Service</button>
          <button type="button" onClick={onBack}>Back to eReturn Office</button>
        </aside>
      </main>
    </div>
  )
}

function Logo() {
  return (
    <div className="brand">
      <span>eReturn</span>
      <strong>OFFICE</strong>
    </div>
  )
}

function Sidebar({ onDashboard }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <Logo />
        <button type="button" className="icon-button" aria-label="Menu">
          <Menu size={26} />
        </button>
      </div>
      <nav>
        <button type="button" className="nav-link active" onClick={onDashboard}>
          <Send size={17} />
          PSR Detail Entry
        </button>
        <button type="button" className="nav-link">
          <Send size={17} />
          Double Entry Scores
        </button>
      </nav>
      <button type="button" className="collapse-button" aria-label="Collapse sidebar">
        <ChevronLeft size={22} />
      </button>
    </aside>
  )
}

function Topbar({ year, setYear, query, setQuery }) {
  return (
    <header className="topbar">
      <select value={year} onChange={(event) => setYear(event.target.value)}>
        <option>2025-2026</option>
        <option>2024-2025</option>
        <option>2023-2024</option>
      </select>
      <div className="search-box">
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search" />
        <button type="button" aria-label="Search">
          <Search size={20} />
        </button>
      </div>
      <span className="user-label">Third Party User 1</span>
      <div className="avatar">
        <UserRound size={24} />
      </div>
    </header>
  )
}

function Dashboard({ taxpayers, onNew, onOpen }) {
  return (
    <section className="panel-list">
      <div className="panel-heading">
        <h2>PSR Detail Entries</h2>
        <button type="button" className="small-button" onClick={onNew}>+ New Entry</button>
      </div>
      <div className="filter-panel">
        <label>12 digit TIN <input placeholder="12 digit TIN" /></label>
        <label>Assessment Year <select defaultValue="2025-2026"><option>2025-2026</option><option>2024-2025</option></select></label>
        <label>Status <select defaultValue="NOT_INITIALIZED"><option>NOT_INITIALIZED</option><option>APPROVED</option><option>VERIFIED</option></select></label>
        <button type="button" className="small-button">Filter Data</button>
        <button type="button" className="warning-button">Reset</button>
        <label>Show <select defaultValue="50"><option>10</option><option>25</option><option>50</option></select> entries</label>
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
          {taxpayers.map((taxpayer, index) => (
            <tr key={taxpayer.id}>
              <td>{index + 1}</td>
              <td>
                <strong>{taxpayer.tin}</strong>
                <small>{taxpayer.submissionDate || 'Submission Date Pending'}</small>
                <span>{taxpayer.name}</span>
              </td>
              <td>{taxpayer.submissionSection}</td>
              <td>{taxpayer.year}</td>
              <td>{formatAmount(taxpayer.totalIncome)}</td>
              <td>{formatAmount(taxpayer.totalTaxPaid)}</td>
              <td>{formatAmount(taxpayer.taxPaid173)}</td>
              <td>{formatAmount(taxpayer.netAsset)}</td>
              <td>
                <span className="status-pill">{taxpayer.psrStatus}</span>
              </td>
              <td>
                <span className="status-pill muted">{taxpayer.entryStatus}</span>
              </td>
              <td>
                <button type="button" className="row-button" onClick={() => onOpen(taxpayer)}>
                  Entry
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

function FormWorkspace(props) {
  const {
    taxpayer,
    step,
    setStep,
    tab,
    setTab,
    amounts,
    setAmounts,
    totalIncome,
    totalAssets,
    saved,
    onSave,
    onPreview,
    onDashboard,
  } = props
  const stepIndex = formSteps.indexOf(step)
  const canGoBack = stepIndex > 0
  const canGoNext = stepIndex < formSteps.length - 1

  return (
    <section className="form-space">
      {saved && <div className="toast">Draft saved successfully</div>}
      <div className="entry-header">
        <button type="button" className="text-button" onClick={onDashboard}>
          <ChevronLeft size={18} />
          Back to PSR Detail Entries
        </button>
        <span>{taxpayer.name} / TIN {taxpayer.tin}</span>
      </div>
      <div className="stepper">
        {formSteps.map((item) => (
          <button
            type="button"
            key={item}
            className={step === item ? 'active' : ''}
            onClick={() => setStep(item)}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="form-card">
        {step === 'Assessment' && <Assessment taxpayer={taxpayer} />}
        {step === 'Income and Tax' && (
          <IncomeTax
            tab={tab}
            setTab={setTab}
            amounts={amounts}
            setAmounts={setAmounts}
            totalIncome={totalIncome}
          />
        )}
        {step === 'Assets' && <Assets totalAssets={totalAssets} />}
      </div>
      <div className="form-actions">
        <button
          type="button"
          className="secondary-button"
          disabled={!canGoBack}
          onClick={() => setStep(formSteps[stepIndex - 1])}
        >
          <ChevronLeft size={16} />
          Previous
        </button>
        <button type="button" className="secondary-button" onClick={onSave}>
          Save Draft
        </button>
        {canGoNext && (
          <button
            type="button"
            className="secondary-button"
            onClick={() => setStep(formSteps[stepIndex + 1])}
          >
            Next
            <ChevronRight size={16} />
          </button>
        )}
        <button type="button" className="warning-button" onClick={onPreview}>
          Preview Return
        </button>
      </div>
    </section>
  )
}

function Assessment({ taxpayer }) {
  return (
    <>
      <h2 className="bangla-title">ব্যক্তিগত ও করদাতা সংক্রান্ত তথ্য</h2>
      <div className="assessment-grid">
        {assessmentFields.map(([number, label, value]) => (
          <label key={number} className="field-row">
            <span>{number}. {label}:</span>
            <input defaultValue={value || (label.includes('মোবাইল') ? '01575000000' : '')} />
          </label>
        ))}
      </div>
      <div className="bordered-note">
        <p>করদাতা: {taxpayer.name} | TIN: {taxpayer.tin}</p>
        <p>এই অনুশীলন ফর্মে তথ্য পরিবর্তন করা যাবে, কিন্তু কোনো সরকারি সাইটে জমা হবে না।</p>
      </div>
    </>
  )
}

function IncomeTax({ tab, setTab, amounts, setAmounts, totalIncome }) {
  const tabs = [
    'Income and Tax summary',
    'Income from employment',
    'Income from rent',
    'Financial assets',
    'Tax calculation',
    'Tax payment',
    'Investment rebate',
  ]

  return (
    <>
      <div className="tabs">
        {tabs.map((item) => (
          <button type="button" key={item} className={tab === item ? 'active' : ''} onClick={() => setTab(item)}>
            {item}
          </button>
        ))}
      </div>
      {tab === 'Income and Tax summary' && (
        <table className="form-table bangla">
          <thead>
            <tr>
              <th>ক্রম</th>
              <th>মোট আয়ের বিবরণী</th>
              <th>টাকার পরিমাণ</th>
            </tr>
          </thead>
          <tbody>
            {incomeRows.map((row, index) => (
              <tr key={row.key}>
                <td>{index + 1}।</td>
                <td>
                  <label className="check-label">
                    <input type="checkbox" defaultChecked={row.checked || Number(amounts[row.key]) > 0} />
                    {row.label}
                    {row.key === 'salary' && (
                      <span className="inline-radios">
                        <input type="radio" name="jobType" defaultChecked /> সরকারি
                        <input type="radio" name="jobType" /> অন্যান্য
                      </span>
                    )}
                  </label>
                </td>
                <td>
                  <input
                    value={amounts[row.key]}
                    onChange={(event) => setAmounts({ ...amounts, [row.key]: event.target.value })}
                  />
                </td>
              </tr>
            ))}
            <tr className="total-row">
              <td colSpan="2">মোট আয়</td>
              <td>{formatAmount(totalIncome)}</td>
            </tr>
          </tbody>
        </table>
      )}
      {tab === 'Income from employment' && (
        <table className="form-table bangla">
          <thead>
            <tr>
              <th>বিবরণ</th>
              <th>আয়ের পরিমাণ</th>
              <th>কর অব্যাহতি</th>
              <th>আয়ের পরিমাণ</th>
            </tr>
          </thead>
          <tbody>
            {salaryRows.map(([label, amount, exempt, taxable]) => (
              <tr key={label}>
                <td>{label}</td>
                <td><input defaultValue={amount} /></td>
                <td><input defaultValue={exempt} /></td>
                <td><input defaultValue={taxable} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {tab === 'Income from rent' && (
        <HousePropertyIncome />
      )}
      {tab === 'Financial assets' && (
        <SimpleAmountTable title="আর্থিক পরিসম্পদ হইতে আয়" rows={financialIncomeRows} />
      )}
      {tab === 'Tax calculation' && (
        <NumberedAmountTable title="কর পরিগণনা" rows={taxCalculationRows} />
      )}
      {tab === 'Tax payment' && (
        <NumberedAmountTable title="কর পরিশোধ বিবরণ" rows={taxPaymentRows} />
      )}
      {tab === 'Investment rebate' && (
        <SimpleAmountTable title="বিনিয়োগ কর রেয়াত / অনুমোদনযোগ্য বিনিয়োগ" rows={rebateRows} />
      )}
    </>
  )
}

function HousePropertyIncome() {
  return (
    <div className="stacked-section bangla">
      <h2 className="bangla-title">ভাড়া / গৃহ সম্পত্তি হতে আয়</h2>
      <div className="property-grid">
        <label>Location and Description of Property <textarea defaultValue="Ashulia, Savar, Dhaka" /></label>
        <label>Particulars <textarea defaultValue="Residential house property" /></label>
      </div>
      <table className="form-table bangla">
        <thead>
          <tr><th>ক্রম</th><th>বিবরণ</th><th>টাকা</th></tr>
        </thead>
        <tbody>
          {[
            ['১', 'বার্ষিক ভাড়া / Annual Rental Income', 336000],
            ['২', 'দাবিকৃত খরচ / Claimed Expenses', 100800],
            ['২(ক)', 'Repair, Collection, etc.', 0],
            ['২(খ)', 'Municipal or Local Tax', 0],
            ['২(গ)', 'Land Revenue', 0],
            ['২(ঘ)', 'Interest on Loan / Mortgage / Capital Charge', 100800],
            ['২(ঙ)', 'Insurance Premium', 0],
            ['২(চ)', 'Vacancy Allowance', 0],
            ['২(ছ)', 'Other, if any', 0],
            ['৩', 'Net Income (Difference between item 1 and 2)', 235200],
          ].map(([no, label, amount]) => (
            <tr key={no}><td>{no}</td><td>{label}</td><td><input defaultValue={amount} /></td></tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function NumberedAmountTable({ title, rows }) {
  return (
    <div className="stacked-section bangla">
      <h2 className="bangla-title">{title}</h2>
      <table className="form-table bangla">
        <thead><tr><th>ক্রম</th><th>বিবরণ</th><th>টাকার পরিমাণ</th></tr></thead>
        <tbody>
          {rows.map(([no, label, amount]) => (
            <tr key={no + label}><td>{no}</td><td>{label}</td><td><input defaultValue={amount} /></td></tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function SimpleAmountTable({ title, rows }) {
  return (
    <div className="stacked-section bangla">
      <h2 className="bangla-title">{title}</h2>
      <table className="form-table bangla">
        <thead><tr><th>ক্রম</th><th>বিবরণ</th><th>টাকার পরিমাণ</th></tr></thead>
        <tbody>
          {rows.map(([label, amount], index) => (
            <tr key={label}><td>{index + 1}।</td><td>{label}</td><td><input defaultValue={amount} /></td></tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Assets({ totalAssets }) {
  const [assetTab, setAssetTab] = useState('Asset Summary')

  return (
    <>
      <div className="tabs">
        {['Asset Summary', 'Living Expenditure'].map((item) => (
          <button type="button" key={item} className={assetTab === item ? 'active' : ''} onClick={() => setAssetTab(item)}>
            {item}
          </button>
        ))}
      </div>
      <h2 className="bangla-title">সম্পদ, দায় ও ব্যয় বিবরণী</h2>
      {assetTab === 'Asset Summary' && (
        <table className="form-table bangla">
          <thead>
            <tr>
              <th>ক্রম</th>
              <th>সম্পদের বিবরণ</th>
              <th>টাকা</th>
            </tr>
          </thead>
          <tbody>
            {assetRows.map(([number, label, amount]) => (
              <tr key={number + label}>
                <td>{number}</td>
                <td>{label}</td>
                <td><input defaultValue={amount} /></td>
              </tr>
            ))}
            <tr className="total-row">
              <td colSpan="2">মোট পরিসম্পদ</td>
              <td>{formatAmount(totalAssets)}</td>
            </tr>
          </tbody>
        </table>
      )}
      {assetTab === 'Living Expenditure' && (
        <>
          <SimpleAmountTable title="ব্যয় ও তহবিলের উৎস / Expense and Source of Fund" rows={expenseRows.map(([no, label, amount]) => [`${no}. ${label}`, amount])} />
          <div className="form-actions inline-actions">
            <button type="button" className="secondary-button">Save Draft</button>
            <button type="button" className="success-button">Save Return</button>
          </div>
        </>
      )}
    </>
  )
}

function Preview({ taxpayer, year, totalIncome, taxPayable, totalAssets, onBack }) {
  return (
    <div className="preview-screen">
      <div className="preview-toolbar">
        <button type="button" onClick={onBack}><ChevronLeft size={18} /> Back to Entry</button>
        <button type="button" onClick={() => window.print()}><Printer size={18} /> Print</button>
      </div>
      <article className="return-page">
        <div className="return-header">
          <FileText size={42} />
          <div>
            <h1>Return of Income</h1>
            <p>National Board of Revenue, Bangladesh</p>
          </div>
          <strong>Assessment Year {year}</strong>
        </div>
        <table>
          <tbody>
            <tr><th>Name of Assessee</th><td>{taxpayer.name}</td><th>TIN</th><td>{taxpayer.tin}</td></tr>
            <tr><th>Circle</th><td>{taxpayer.circle}</td><th>Zone</th><td>{taxpayer.zone}</td></tr>
            <tr><th>Total Income</th><td>{formatAmount(totalIncome)}</td><th>Tax Payable</th><td>{formatAmount(taxPayable)}</td></tr>
            <tr><th>Total Assets</th><td>{formatAmount(totalAssets)}</td><th>Status</th><td>Practice Draft</td></tr>
          </tbody>
        </table>
        <section className="verification">
          <h2>Verification</h2>
          <p>I solemnly declare that this training copy follows the eReturn practice workflow shown in the video.</p>
          <div className="signature-line">Signature</div>
        </section>
      </article>
      <article className="return-page excel-page">
        <div className="excel-title">For Individual and Other Taxpayers (Other Than Company)</div>
        <div className="return-form-grid">
          <div className="photo-box">Photograph</div>
          <label><input type="checkbox" defaultChecked /> Self</label>
          <label><input type="checkbox" /> Universal Self</label>
          <label><input type="checkbox" defaultChecked /> Normal</label>
          <span>Name: {taxpayer.name}</span>
          <span>NID: 19901234567890123</span>
          <span>TIN: {taxpayer.tin}</span>
          <span>Circle: {taxpayer.circle}</span>
          <span>Tax Zone: {taxpayer.zone}</span>
          <span>Residential Status: Resident</span>
        </div>
      </article>
      <article className="return-page excel-page">
        <h2>Income and Tax Summary</h2>
        <NumberedAmountTable title="Return Page 2 - Tax Computation / Payment / Refund" rows={[...taxCalculationRows, ...taxPaymentRows]} />
      </article>
      <article className="return-page excel-page">
        <h2>Assets, Liabilities and Source of Fund</h2>
        <NumberedAmountTable title="Return Page 5 - Assets / Liabilities / Investments" rows={assetRows} />
        <SimpleAmountTable title="Return Page 6 - Expense / Wealth Accretion" rows={expenseRows.map(([no, label, amount]) => [`${no}. ${label}`, amount])} />
      </article>
      <article className="return-page excel-page">
        <h2>Generated Return Schedules</h2>
        {generatedSchedules.map((schedule) => (
          <section className="schedule-preview" key={schedule.title}>
            <h3>{schedule.title}</h3>
            <table>
              <tbody>
                {schedule.rows.map((row, index) => (
                  <tr key={row}><th>{index + 1}</th><td>{row}</td><td>Tk.</td><td>{index === 0 ? formatAmount(totalIncome) : '0'}</td></tr>
                ))}
              </tbody>
            </table>
          </section>
        ))}
      </article>
      <article className="return-page excel-page">
        <h2>Instruction to fill up the Return Form</h2>
        <ul className="instruction-list">
          <li>Salary certificate and bank statement where applicable.</li>
          <li>Bank interest, savings certificate, dividend, rent and property documents.</li>
          <li>Municipal tax, land revenue, property loan and insurance supporting papers.</li>
          <li>Professional income, capital gain, dividend and other income documents.</li>
          <li>Profit and loss account, balance sheet, depreciation and computation notes where applicable.</li>
        </ul>
      </article>
    </div>
  )
}

function formatAmount(value) {
  return new Intl.NumberFormat('en-IN').format(Number(value || 0))
}

export default App
