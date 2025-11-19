/**
 * Latvia-specific debt management constants and information
 */

// Debt types available in Latvia
export const DEBT_TYPES = [
  { value: 'credit_card', label: 'Credit Card / Kredītkarte', emoji: '💳' },
  { value: 'personal_loan', label: 'Personal Loan / Patēriņa kredīts', emoji: '💰' },
  { value: 'mortgage', label: 'Mortgage / Hipotēka', emoji: '🏠' },
  { value: 'car_loan', label: 'Car Loan / Auto kredīts', emoji: '🚗' },
  { value: 'student_loan', label: 'Student Loan / Studenta kredīts', emoji: '🎓' },
  { value: 'other', label: 'Other / Citi', emoji: '📋' },
] as const;

// Average interest rates in Latvia (approximate, as of 2024)
export const AVERAGE_INTEREST_RATES_LATVIA = {
  credit_card: 18.0, // Credit cards typically 15-25% APR
  personal_loan: 10.0, // Personal loans typically 8-15% APR
  mortgage: 3.5, // Mortgages typically 2.5-4.5% APR
  car_loan: 6.0, // Car loans typically 4-8% APR
  student_loan: 5.0, // Student loans typically 3-7% APR
  other: 10.0, // Default average
};

// Recommended debt-to-income ratio limits
export const DEBT_TO_INCOME_LIMITS = {
  safe: 28, // Below 28% is considered safe
  moderate: 36, // 28-36% is moderate risk
  high: 43, // Above 43% is high risk (Latvia mortgage lending limit)
};

// Latvian financial resources and organizations
export const LATVIA_DEBT_RESOURCES = [
  {
    name: 'Financial and Capital Market Commission (FKTK)',
    nameLatvian: 'Finanšu un kapitāla tirgus komisija',
    description: 'Regulatory authority for financial services in Latvia',
    descriptionLatvian: 'Finanšu pakalpojumu regulators Latvijā',
    url: 'https://www.fktk.lv/en/',
    type: 'regulatory',
  },
  {
    name: 'Consumer Rights Protection Centre (PTAC)',
    nameLatvian: 'Patērētāju tiesību aizsardzības centrs',
    description: 'Consumer protection and debt counseling services',
    descriptionLatvian: 'Patērētāju aizsardzība un parādu konsultācijas',
    url: 'https://www.ptac.gov.lv/en',
    type: 'consumer_protection',
  },
  {
    name: 'Credit Information Bureau',
    nameLatvian: 'Kredītinformācijas birojs',
    description: 'Check your credit history and score',
    descriptionLatvian: 'Pārbaudiet savu kredītvēsturi',
    url: 'https://www.kib.lv/',
    type: 'credit_bureau',
  },
  {
    name: 'Latvian Commercial Banks Association',
    nameLatvian: 'Latvijas Komercbanku asociācija',
    description: 'Information about banking services and loans',
    descriptionLatvian: 'Informācija par banku pakalpojumiem un kredītiem',
    url: 'https://www.bankasoc.lv/',
    type: 'industry',
  },
];

// Debt consolidation tips for Latvia
export const CONSOLIDATION_TIPS_LATVIA = [
  {
    title: 'Compare Multiple Banks',
    titleLatvian: 'Salīdziniet vairākas bankas',
    description: 'Contact at least 3 different banks to compare consolidation loan offers.',
    descriptionLatvian: 'Sazinieties ar vismaz 3 dažādām bankām, lai salīdzinātu piedāvājumus.',
  },
  {
    title: 'Check Your Credit Score',
    titleLatvian: 'Pārbaudiet savu kredītreitingu',
    description: 'A good credit score will help you get better interest rates.',
    descriptionLatvian: 'Labs kredītreitings palīdzēs iegūt labākus procentu likmes.',
  },
  {
    title: 'Calculate Total Costs',
    titleLatvian: 'Aprēķiniet kopējās izmaksas',
    description: 'Include all fees, not just the interest rate.',
    descriptionLatvian: 'Iekļaujiet visas komisijas maksas, ne tikai procentu likmi.',
  },
  {
    title: 'Avoid New Debt',
    titleLatvian: 'Izvairieties no jauniem parādiem',
    description: 'After consolidating, resist the temptation to use freed-up credit cards.',
    descriptionLatvian: 'Pēc parādu konsolidācijas izvairieties izmantot atbrīvotās kredītkartes.',
  },
];

// Refinancing tips for Latvia
export const REFINANCING_TIPS_LATVIA = [
  {
    title: 'Check for Early Repayment Fees',
    titleLatvian: 'Pārbaudiet priekšlaicīgas atmaksas komisiju',
    description: 'Some loans have penalties for early repayment.',
    descriptionLatvian: 'Dažiem kredītiem ir soda naudas par priekšlaicīgu atmaksu.',
  },
  {
    title: 'Consider Loan Term',
    titleLatvian: 'Apsveriet kredīta termiņu',
    description: 'Longer term = lower payment but more interest. Find the right balance.',
    descriptionLatvian: 'Garāks termiņš = mazāks maksājums, bet vairāk procentu.',
  },
  {
    title: 'Improve Your Credit First',
    titleLatvian: 'Vispirms uzlabojiet savu kredītvēsturi',
    description: 'Wait a few months if your credit score is improving.',
    descriptionLatvian: 'Pagaidiet dažus mēnešus, ja jūsu kredītreitings uzlabojas.',
  },
];

// Warning signs of problem debt
export const DEBT_WARNING_SIGNS = [
  {
    sign: 'Only Making Minimum Payments',
    signLatvian: 'Maksājat tikai minimālos maksājumus',
    description: 'Making only minimum payments means debt will take years to pay off.',
    descriptionLatvian: 'Minimālie maksājumi nozīmē, ka parāda atmaksa aizņems gadus.',
    severity: 'high',
  },
  {
    sign: 'Using Credit for Necessities',
    signLatvian: 'Izmantojat kredītu pamata lietām',
    description: 'Using credit cards for groceries or bills is a red flag.',
    descriptionLatvian: 'Kredītkaršu izmantošana pārtikai vai rēķiniem ir brīdinājuma signāls.',
    severity: 'high',
  },
  {
    sign: 'Missing or Late Payments',
    signLatvian: 'Nokavēti vai izlaisti maksājumi',
    description: 'Missing payments damages credit and adds fees.',
    descriptionLatvian: 'Nokavēti maksājumi bojā kredītvēsturi un pievieno komisijas maksas.',
    severity: 'critical',
  },
  {
    sign: 'Debt-to-Income Ratio Above 43%',
    signLatvian: 'Parādu un ienākumu attiecība virs 43%',
    description: 'More than 43% of income going to debt is unsustainable.',
    descriptionLatvian: 'Vairāk nekā 43% no ienākumiem parādiem nav ilgtspējīgi.',
    severity: 'critical',
  },
  {
    sign: 'Avoiding Debt Statements',
    signLatvian: 'Izvairāties no parādu pārskatiem',
    description: 'Not opening bills or checking balances is avoidance.',
    descriptionLatvian: 'Rēķinu neatvēršana vai bilances nepārbaudīšana ir izvairīšanās.',
    severity: 'moderate',
  },
];

// Step-by-step debt payoff guide
export const DEBT_PAYOFF_STEPS = [
  {
    step: 1,
    title: 'List All Debts',
    titleLatvian: 'Uzskaitiet visus parādus',
    description: 'Write down every debt: balance, interest rate, minimum payment.',
    descriptionLatvian: 'Uzrakstiet katru parādu: atlikumu, procentu likmi, minimālo maksājumu.',
  },
  {
    step: 2,
    title: 'Stop Adding New Debt',
    titleLatvian: 'Pārtrauciet pievienot jaunus parādus',
    description: 'Put credit cards away. Live on cash or debit only.',
    descriptionLatvian: 'Nolieciet kredītkartes malā. Dzīvojiet tikai ar skaidru naudu vai debetkarti.',
  },
  {
    step: 3,
    title: 'Build a Small Emergency Fund',
    titleLatvian: 'Izveidojiet nelielu ārkārtas fondu',
    description: 'Save €500-1000 to avoid new debt for emergencies.',
    descriptionLatvian: 'Ietaupiet €500-1000 ārkārtas situācijām.',
  },
  {
    step: 4,
    title: 'Choose Your Strategy',
    titleLatvian: 'Izvēlieties stratēģiju',
    description: 'Avalanche (save money) or Snowball (quick wins).',
    descriptionLatvian: 'Avalanche (ietaupiet naudu) vai Snowball (ātras uzvaras).',
  },
  {
    step: 5,
    title: 'Find Extra Money',
    titleLatvian: 'Atrodiet papildu naudu',
    description: 'Cut expenses, increase income, put everything extra toward debt.',
    descriptionLatvian: 'Samaziniet izdevumus, palieliniet ienākumus, visu papildu naudu parādiem.',
  },
  {
    step: 6,
    title: 'Track Progress',
    titleLatvian: 'Sekojiet progresam',
    description: 'Update your balances monthly. Celebrate each debt paid off!',
    descriptionLatvian: 'Atjauniniet bilances katru mēnesi. Sviniet katru atmaksāto parādu!',
  },
];

// When to seek professional help
export const WHEN_TO_SEEK_HELP = [
  'Total debt exceeds 6 months of gross income',
  'Debt-to-income ratio above 50%',
  'Receiving collection calls or legal notices',
  'Considering bankruptcy',
  'Unable to make minimum payments',
  'Experiencing significant stress or anxiety about debt',
];

export const WHEN_TO_SEEK_HELP_LATVIAN = [
  'Kopējais parāds pārsniedz 6 mēnešu bruto ienākumus',
  'Parādu un ienākumu attiecība virs 50%',
  'Saņemat zvanus no piedziņas aģentūrām vai juridiskus paziņojumus',
  'Apsverot bankrotu',
  'Nespējat veikt minimālos maksājumus',
  'Izjūtat nozīmīgu stresu vai trauksmi par parādiem',
];
