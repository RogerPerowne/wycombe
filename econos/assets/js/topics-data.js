/* ECONOS Topic Data — add new topics by adding new entries to ECONOS_TOPICS */
window.ECONOS_TOPICS = {
  inflation: {
    id: 'inflation',
    quizId: 'inflation_causes',
    title: 'Inflation – Cost-push vs Demand-pull',
    subject: 'Macroeconomics',
    sessionLabel: 'Session 1 of 2: Learn',
    sessionNum: 1, sessionTotal: 2,
    estimatedTime: '20–25 minutes',
    goal: 'Build a strong foundation for exam success',
    intro: "This session builds the foundation you'll need to answer exam questions with confidence.",
    whatYoullDo: {
      desc: "Learn key concepts, check your understanding and build the first links in the chain.",
      outcomes: ['Understand the key ideas', 'Check your understanding', 'Build a simple causal chain']
    },
    orientationTip: "Take your time, there's no rush. Focus on understanding – you can't get questions right without a strong foundation.",

    cards: [
      {
        id: 1, type: 'basic',
        title: 'What is inflation?',
        definition: 'Inflation is when the general price level of goods and services in an economy rises.',
        keyTakeaway: 'Inflation means the same amount of money buys you fewer goods and services.',
        whyMatters: [
          { color: '#7C3AED', bg: '#EDE9FE', title: 'Affects purchasing power', text: 'As prices rise, money buys less.' },
          { color: '#D97706', bg: '#FEF3C7', title: 'Impacts decisions', text: 'Consumers, businesses and governments are all affected.' },
          { color: '#2563EB', bg: '#DBEAFE', title: 'Key economic indicator', text: 'It signals changes in the health of an economy.' }
        ],
        sideTip: { type: 'focus', label: 'Focus tip', color: '#D97706', bg: '#FFFBEB', text: "Take your time with each card. Understanding now will help you answer questions later." }
      },
      {
        id: 2, type: 'comparison',
        title: 'Types of inflation',
        intro: 'There are two main types of inflation. They happen for different reasons and affect the economy in different ways.',
        keyIdea: 'Understanding the type of inflation helps economists predict its effects and choose the right policies.',
        leftCol: {
          title: 'Demand-pull inflation', color: '#16A34A', bg: '#F0FDF4', borderColor: '#86EFAC',
          causedBy: 'Too much demand in the economy chasing too few goods and services.',
          mechanism: "When demand rises (e.g. higher consumer spending), businesses increase prices because they can.",
          example: 'A boom in consumer confidence leads to higher spending on holidays, restaurants and goods.'
        },
        rightCol: {
          title: 'Cost-push inflation', color: '#2563EB', bg: '#EFF6FF', borderColor: '#93C5FD',
          causedBy: 'Rising costs of production for businesses.',
          mechanism: 'When costs rise (e.g. higher wages, raw materials), businesses increase prices to protect profits.',
          example: 'Higher oil prices increase transport costs, pushing up the price of many goods and services.'
        },
        thinkPrompt: 'Can you think of a recent example of each type of inflation?',
        sideTip: { type: 'exam', label: 'Exam tip', color: '#2563EB', bg: '#EFF6FF', text: 'In exams, you may be asked to explain or evaluate the causes and effects of one or both types of inflation.' }
      },
      {
        id: 3, type: 'mechanism',
        title: 'How inflation happens',
        intro: "Inflation doesn't just appear – it follows a chain of events from an initial trigger through to rising prices.",
        demandPullSteps: [
          'Consumer spending rises (e.g. after a tax cut or rise in confidence)',
          'Businesses face strong demand for goods and services',
          'Firms raise prices – they can charge more when demand is high',
          'General price level increases – demand-pull inflation'
        ],
        costPushSteps: [
          'Input costs rise (e.g. oil prices, wages, raw materials)',
          'Businesses face higher production costs',
          'Firms raise prices to protect their profit margins',
          'General price level increases – cost-push inflation'
        ],
        keyPoint: 'Both types follow a chain from cause → pressure → price rise. The key difference is where the pressure starts.',
        thinkPrompt: 'How is the chain for demand-pull inflation different from cost-push?',
        sideTip: { type: 'exam', label: 'Exam tip', color: '#2563EB', bg: '#EFF6FF', text: 'Always explain the mechanism – show how the cause leads to the effect step by step. Each link in the chain earns marks.' }
      },
      {
        id: 4, type: 'impacts',
        title: 'Impacts of inflation',
        intro: 'Inflation affects different groups in different ways.',
        examSkill: 'In exams, you need to explain how inflation affects different people and the economy.',
        groups: [
          { title: 'Consumers', color: '#0D9488', bg: '#F0FDFA', borderColor: '#99F6E4',
            points: ['Real incomes may fall', 'Purchasing power decreases', 'Particularly harmful if wages lag inflation'] },
          { title: 'Firms', color: '#D97706', bg: '#FFFBEB', borderColor: '#FCD34D',
            points: ['Rising costs reduce profit margins', 'Uncertainty may reduce investment', 'Some firms pass costs onto consumers'] },
          { title: 'Economy', color: '#2563EB', bg: '#EFF6FF', borderColor: '#93C5FD',
            points: ['Loss of international competitiveness', 'Exports fall, imports rise', 'Slower economic growth possible'] }
        ],
        winners: [{ who: 'Borrowers', why: 'Repay debt in lower real terms.' }],
        losers: ['Savers (value of savings eroded)', 'Fixed-income earners'],
        example: 'During periods of high inflation, households face rising energy and food costs, reducing real living standards.',
        thinkPrompt: 'Which group is most affected by inflation in the current UK economy?',
        sideTip: { type: 'next', label: 'Coming up next', color: '#7C3AED', bg: '#F5F3FF', title: 'Summary – bring everything together', text: "We'll recap the key points before you move on to quick checks." }
      },
      {
        id: 5, type: 'summary',
        title: 'Summary – Inflation',
        subtitle: "Here's everything you've learned. A clear picture to keep in your head.",
        sections: [
          { num: 1, title: 'What is inflation?',
            bullets: ['Inflation is a sustained rise in the general price level.', 'It reduces the purchasing power of money.'] },
          { num: 2, title: 'Types of inflation',
            cols: [
              { heading: 'Demand-pull inflation', text: 'Caused by excess demand in the economy.' },
              { heading: 'Cost-push inflation', text: 'Caused by rising costs of production.' }
            ]
          },
          { num: 3, title: 'Impacts of inflation',
            cols: [
              { heading: 'Consumers', text: 'real incomes fall.' },
              { heading: 'Firms', text: 'higher costs and uncertainty.' },
              { heading: 'Economy', text: 'lower competitiveness and slower growth.' }
            ]
          }
        ],
        flowSteps: [
          { label: 'Demand ↑\nor Costs ↑', sub: '(Causes)', color: '#2563EB', bg: '#DBEAFE' },
          { label: 'Excess demand\nor rising\nproduction costs', sub: '(Pressure)', color: '#D97706', bg: '#FEF3C7' },
          { label: 'General price\nlevel rises\n(Inflation)', sub: '(Result)', color: '#DC2626', bg: '#FEE2E2' },
          { label: 'Effects on\nconsumers, firms\nand economy', sub: '(Impact)', color: '#0D9488', bg: '#CCFBF1' }
        ],
        winners: ["Borrowers – repay debt in lower real terms."],
        losers: ["Savers – value of savings eroded.", "Fixed-income earners."],
        rememberOne: 'Inflation is caused by demand or cost pressures, leading to higher prices with mixed effects for different groups and the economy.',
        sideTip: { type: 'complete', label: "You've completed all learn cards! 🎉" }
      }
    ],

    quiz: [
      { q: 'What does inflation measure?',
        opts: ['The rate of change of GDP', 'The rate at which the general price level rises', 'The level of unemployment in the economy', 'Changes in the exchange rate'],
        ans: 1, exp: 'Inflation measures the rate at which the general price level of goods and services rises over time.' },
      { q: 'Cost-push inflation is caused by:',
        opts: ['Excess demand in the economy', 'A fall in interest rates', 'Rising production costs for businesses', 'Increased consumer confidence'],
        ans: 2, exp: 'Cost-push inflation occurs when businesses face rising production costs (e.g. wages, raw materials) and pass these on as higher prices.' },
      { q: 'Which of the following is an example of demand-pull inflation?',
        opts: ['Higher oil prices increasing transport costs', 'Rising wages in the automotive sector', 'A consumer boom following a tax cut', 'Supply chain disruptions reducing output'],
        ans: 2, exp: 'A consumer boom following a tax cut increases demand in the economy, which can lead to demand-pull inflation as businesses raise prices.' },
      { q: 'What happens to purchasing power when inflation rises?',
        opts: ['It increases', 'It stays the same', 'It first rises then falls', 'It falls'],
        ans: 3, exp: 'When inflation rises, purchasing power falls – the same amount of money buys fewer goods and services.' },
      { q: 'Who typically benefits from inflation?',
        opts: ['Savers', 'Fixed-income earners', 'Borrowers', 'Pensioners on fixed pensions'],
        ans: 2, exp: 'Borrowers benefit from inflation because they repay their debts in money that is worth less in real terms than when they borrowed.' },
      { q: 'The mechanism of cost-push inflation involves:',
        opts: ['Consumers bidding up prices', 'Government increasing the money supply', 'Businesses raising prices to protect profit margins', 'Banks reducing interest rates'],
        ans: 2, exp: 'In cost-push inflation, businesses face higher production costs and raise their prices to protect their profit margins.' },
      { q: 'Which of the following would most likely cause demand-pull inflation?',
        opts: ['Rising global oil prices', 'Higher import costs', 'Supply chain disruptions', 'A fall in income tax rates'],
        ans: 3, exp: 'A fall in income tax rates leaves consumers with more disposable income, increasing demand in the economy and potentially causing demand-pull inflation.' },
      { q: 'What effect does high inflation typically have on international competitiveness?',
        opts: ['It improves competitiveness', 'It has no effect', 'It reduces competitiveness', 'It increases exports'],
        ans: 2, exp: "High inflation makes a country's goods more expensive relative to foreign competitors, reducing international competitiveness and potentially reducing exports." },
      { q: 'If wages rise by 2% but inflation is 5%, what happens to real income?',
        opts: ['Real income rises by 7%', 'Real income stays the same', 'Real income falls', 'Real income rises by 2%'],
        ans: 2, exp: 'Real income measures purchasing power. If wages rise by less than inflation, real income falls – workers can buy less with their earnings.' },
      { q: 'Which statement best explains why inflation harms savers?',
        opts: ['Banks lower interest rates during inflation', 'The real value of savings is eroded as prices rise', 'Savers must pay more tax during inflation', 'Savings accounts are closed during inflationary periods'],
        ans: 1, exp: 'Inflation erodes the real value of savings – if the interest rate on savings is lower than inflation, savers are losing purchasing power over time.' }
    ],

    chain: {
      title: 'Build the causal chain',
      subtitle: 'Scenario: A rise in global oil prices leads to cost-push inflation in the UK.',
      instructions: 'Drag the steps into the correct order to complete the causal chain.',
      steps: [
        { id: 'a', stage: 'Cause',        stageColor: '#2563EB', stageBg: '#DBEAFE', text: 'Global oil prices rise sharply due to supply disruptions' },
        { id: 'b', stage: 'Transmission', stageColor: '#D97706', stageBg: '#FEF3C7', text: 'UK businesses face higher energy and transport costs' },
        { id: 'c', stage: 'Response',     stageColor: '#EA580C', stageBg: '#FFF7ED', text: 'Businesses raise prices to protect their profit margins' },
        { id: 'd', stage: 'Result',       stageColor: '#DC2626', stageBg: '#FEE2E2', text: 'The general price level in the UK rises (cost-push inflation)' },
        { id: 'e', stage: 'Impact',       stageColor: '#0D9488', stageBg: '#CCFBF1', text: 'Consumers face higher prices and real incomes fall' }
      ],
      examTip: 'In the exam, causal chains like this can be worth 4–6 marks. Each well-explained link earns you credit – use the language of economics (cause, mechanism, effect).'
    }
  }
  /* ── ADD NEW TOPICS BELOW ─────────────────────────────────────────────────
     supply_demand: { id: 'supply_demand', title: '...', cards: [...], quiz: [...], chain: {...} },
     market_failure: { ... },
  ── ──────────────────────────────────────────────────────────────────────── */
};
