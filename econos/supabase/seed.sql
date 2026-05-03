-- econOS A-Level Economics Platform — Seed Data
-- Run AFTER schema.sql. Safe to re-run (uses ON CONFLICT DO NOTHING).
-- Includes real Edexcel A-Level Economics content for Themes 1–4.

-- ─── TOPICS ────────────────────────────────────────────────────────────────────
insert into public.topics (id, theme_number, theme_name, title, slug, description, order_in_theme, icon) values

-- Theme 1: Introduction to Markets and Market Failure
('1a000000-0000-0000-0000-000000000001', 1, 'Theme 1: Introduction to Markets', 'Demand Theory', 'demand-theory', 'How consumer demand works, what drives it, and how it responds to price and income changes', 1, '📉'),
('1a000000-0000-0000-0000-000000000002', 1, 'Theme 1: Introduction to Markets', 'Supply Theory', 'supply-theory', 'Producer behaviour, cost structures, and how supply responds to market signals', 2, '📈'),
('1a000000-0000-0000-0000-000000000003', 1, 'Theme 1: Introduction to Markets', 'Elasticity', 'elasticity', 'Price, income and cross elasticity of demand; price elasticity of supply', 3, '🔄'),
('1a000000-0000-0000-0000-000000000004', 1, 'Theme 1: Introduction to Markets', 'Market Equilibrium', 'market-equilibrium', 'How markets clear, shifts in demand and supply, and price determination', 4, '⚖️'),
('1a000000-0000-0000-0000-000000000005', 1, 'Theme 1: Introduction to Markets', 'Market Failure & Externalities', 'market-failure-externalities', 'When markets allocate resources inefficiently — externalities, public goods, information failure', 5, '⚠️'),
('1a000000-0000-0000-0000-000000000006', 1, 'Theme 1: Introduction to Markets', 'Government Intervention', 'government-intervention', 'Taxes, subsidies, price controls, regulation and their effects on market outcomes', 6, '🏛️'),

-- Theme 2: The UK Economy — Performance and Policies
('2a000000-0000-0000-0000-000000000001', 2, 'Theme 2: The UK Economy', 'Macroeconomic Objectives', 'macro-objectives', 'Economic growth, low unemployment, price stability, balance of payments equilibrium', 1, '🎯'),
('2a000000-0000-0000-0000-000000000002', 2, 'Theme 2: The UK Economy', 'Aggregate Demand', 'aggregate-demand', 'Components of AD, the multiplier, and demand-side shocks', 2, '📊'),
('2a000000-0000-0000-0000-000000000003', 2, 'Theme 2: The UK Economy', 'Aggregate Supply', 'aggregate-supply', 'SRAS, LRAS and the factors that shift them', 3, '🏭'),
('2a000000-0000-0000-0000-000000000004', 2, 'Theme 2: The UK Economy', 'Monetary Policy', 'monetary-policy', 'Interest rates, quantitative easing, the Bank of England and the transmission mechanism', 4, '🏦'),
('2a000000-0000-0000-0000-000000000005', 2, 'Theme 2: The UK Economy', 'Fiscal Policy', 'fiscal-policy', 'Government spending, taxation, budget deficits and the national debt', 5, '💰'),
('2a000000-0000-0000-0000-000000000006', 2, 'Theme 2: The UK Economy', 'Supply-Side Policies', 'supply-side-policies', 'Improving productive capacity and efficiency: education, privatisation, deregulation', 6, '⚙️'),
('2a000000-0000-0000-0000-000000000007', 2, 'Theme 2: The UK Economy', 'Unemployment', 'unemployment', 'Types of unemployment, its causes, costs and remedies', 7, '👷'),
('2a000000-0000-0000-0000-000000000008', 2, 'Theme 2: The UK Economy', 'Inflation', 'inflation', 'Causes of inflation, CPI measurement, demand-pull vs cost-push', 8, '📉'),
('2a000000-0000-0000-0000-000000000009', 2, 'Theme 2: The UK Economy', 'Exchange Rates', 'exchange-rates', 'Floating vs fixed exchange rates, appreciation, depreciation and current account effects', 9, '💱'),
('2a000000-0000-0000-0000-000000000010', 2, 'Theme 2: The UK Economy', 'Balance of Payments', 'balance-of-payments', 'Current account, capital account, and policies to correct deficits', 10, '🌍'),

-- Theme 3: Business Behaviour and the Labour Market
('3a000000-0000-0000-0000-000000000001', 3, 'Theme 3: Business Behaviour', 'Revenue and Costs', 'revenue-costs', 'Total, average and marginal revenue; short-run and long-run costs; economies of scale', 1, '💼'),
('3a000000-0000-0000-0000-000000000002', 3, 'Theme 3: Business Behaviour', 'Perfect Competition', 'perfect-competition', 'Price-taking firms, normal profit, allocative and productive efficiency', 2, '🏪'),
('3a000000-0000-0000-0000-000000000003', 3, 'Theme 3: Business Behaviour', 'Monopoly', 'monopoly', 'Market power, deadweight loss, natural monopoly, price discrimination', 3, '🦁'),
('3a000000-0000-0000-0000-000000000004', 3, 'Theme 3: Business Behaviour', 'Oligopoly', 'oligopoly', 'Game theory, price rigidity, collusion, price leadership', 4, '🤝'),
('3a000000-0000-0000-0000-000000000005', 3, 'Theme 3: Business Behaviour', 'Labour Market', 'labour-market', 'Wage determination, monopsony, trade unions, discrimination', 5, '👩‍💼'),

-- Theme 4: A Global Perspective
('4a000000-0000-0000-0000-000000000001', 4, 'Theme 4: A Global Perspective', 'International Trade', 'international-trade', 'Comparative advantage, terms of trade, trading blocs, protectionism', 1, '🚢'),
('4a000000-0000-0000-0000-000000000002', 4, 'Theme 4: A Global Perspective', 'Globalisation', 'globalisation', 'Causes and consequences of globalisation for developed and developing economies', 2, '🌐'),
('4a000000-0000-0000-0000-000000000003', 4, 'Theme 4: A Global Perspective', 'Economic Development', 'economic-development', 'Measures of development, aid, debt, FDI and barriers to development', 3, '🌱')

on conflict (slug) do nothing;

-- ─── SUBTOPICS ─────────────────────────────────────────────────────────────────
insert into public.subtopics (id, topic_id, title, slug, order_in_topic, estimated_minutes, content_html, key_terms, learning_objectives) values

-- Demand Theory subtopics
('1b000000-0001-0000-0000-000000000001', '1a000000-0000-0000-0000-000000000001', 'The Law of Demand', 'law-of-demand', 1, 12,
'<h2>The Law of Demand</h2>
<p>The law of demand states that, <em>ceteris paribus</em> (all else equal), as the price of a good rises, the quantity demanded falls — and vice versa. This inverse relationship occurs because of two effects:</p>
<ul>
  <li><strong>The substitution effect:</strong> When a good becomes more expensive, consumers switch to cheaper substitutes.</li>
  <li><strong>The income effect:</strong> A price rise reduces real purchasing power, so consumers buy less.</li>
</ul>
<h3>The Demand Curve</h3>
<p>A demand curve slopes downward from left to right, showing this inverse relationship. A movement <em>along</em> the curve is caused by a change in price. A <em>shift</em> of the entire curve is caused by a change in any other determinant of demand.</p>
<h3>Shifts in Demand</h3>
<p>The demand curve shifts right (increases) when:</p>
<ul>
  <li>Consumer incomes rise (for normal goods)</li>
  <li>The price of a substitute rises</li>
  <li>The price of a complement falls</li>
  <li>Consumer tastes favour the good more</li>
  <li>Population increases</li>
</ul>
<div class="content-callout warn"><strong>Common mistake:</strong> Do not confuse a movement along the demand curve (caused by price change) with a shift of the curve (caused by non-price factors).</div>',
'[{"term":"Ceteris paribus","def":"Latin for all other things equal — used to isolate the effect of one variable"},{"term":"Substitution effect","def":"When a price rise makes consumers switch to cheaper alternatives"},{"term":"Income effect","def":"A price rise reduces real income, reducing the quantity consumers can afford"},{"term":"Normal good","def":"A good for which demand rises as income rises"},{"term":"Inferior good","def":"A good for which demand falls as income rises (e.g. bus travel)"}]',
'["Explain the law of demand with reference to income and substitution effects","Distinguish between a movement along and a shift of the demand curve","Identify factors that cause the demand curve to shift"]'
),

('1b000000-0001-0000-0000-000000000002', '1a000000-0000-0000-0000-000000000001', 'Shifts in Demand', 'shifts-in-demand', 2, 10,
'<h2>Shifts in Demand</h2>
<p>When any factor other than the good''s own price changes, the entire demand curve shifts. An outward (rightward) shift means demand has increased at every price level.</p>
<h3>Key Shifters (PIRATES)</h3>
<ul>
  <li><strong>P</strong>opulation size and structure</li>
  <li><strong>I</strong>ncome of consumers</li>
  <li><strong>R</strong>elated goods (substitutes and complements)</li>
  <li><strong>A</strong>dvertising and consumer tastes</li>
  <li><strong>T</strong>axes and subsidies on the good</li>
  <li><strong>E</strong>xpectations of future prices</li>
  <li><strong>S</strong>easonality</li>
</ul>',
'[{"term":"Substitute goods","def":"Goods that can replace each other — a rise in price of one increases demand for the other (e.g. butter and margarine)"},{"term":"Complementary goods","def":"Goods consumed together — a rise in price of one reduces demand for the other (e.g. cars and petrol)"}]',
'["Identify all factors that shift the demand curve","Explain why income affects demand differently for normal vs inferior goods"]'
),

-- Elasticity subtopics
('1b000000-0003-0000-0000-000000000001', '1a000000-0000-0000-0000-000000000003', 'Price Elasticity of Demand', 'ped', 1, 15,
'<h2>Price Elasticity of Demand (PED)</h2>
<p>PED measures how responsive quantity demanded is to a change in price.</p>
<div class="content-formula">PED = % change in quantity demanded ÷ % change in price</div>
<p>PED is always negative (inverse relationship), but we usually quote the absolute value. A PED value of 0.5 means demand is <strong>inelastic</strong> (changes in price have a small effect); a value of 2.0 means demand is <strong>elastic</strong>.</p>
<h3>Determinants of PED</h3>
<ul>
  <li><strong>Number and closeness of substitutes</strong> — more substitutes = more elastic</li>
  <li><strong>Proportion of income spent</strong> — higher proportion = more elastic</li>
  <li><strong>Necessity vs luxury</strong> — necessities are more inelastic</li>
  <li><strong>Time period</strong> — demand is more elastic in the long run</li>
  <li><strong>Habit forming</strong> — addictive goods are inelastic (e.g. cigarettes)</li>
</ul>
<h3>Revenue and PED</h3>
<p>If demand is elastic (PED &gt; 1): raising price reduces total revenue. If demand is inelastic (PED &lt; 1): raising price increases total revenue.</p>
<div class="content-callout info"><strong>Exam tip:</strong> Always state whether demand is elastic or inelastic before explaining the revenue effect.</div>',
'[{"term":"Price elasticity of demand","def":"% change in Qd ÷ % change in P — measures responsiveness of demand to price"},{"term":"Elastic demand","def":"PED > 1: a 1% price rise causes more than 1% fall in Qd"},{"term":"Inelastic demand","def":"PED < 1: a 1% price rise causes less than 1% fall in Qd"},{"term":"Unit elastic","def":"PED = 1: % change in Qd exactly equals % change in P"},{"term":"Total revenue","def":"Price × Quantity — used to assess impact of price changes"}]',
'["Calculate PED from data","Explain the determinants of PED","Apply PED to predict the effect of a price change on total revenue"]'
),

('1b000000-0003-0000-0000-000000000002', '1a000000-0000-0000-0000-000000000003', 'Income and Cross Elasticity', 'yed-ced', 2, 12,
'<h2>Income Elasticity of Demand (YED)</h2>
<div class="content-formula">YED = % change in quantity demanded ÷ % change in income</div>
<ul>
  <li><strong>YED &gt; 0:</strong> Normal good — demand rises with income</li>
  <li><strong>YED &gt; 1:</strong> Luxury good — demand rises faster than income</li>
  <li><strong>YED &lt; 0:</strong> Inferior good — demand falls as income rises</li>
</ul>
<h2>Cross Elasticity of Demand (XED)</h2>
<div class="content-formula">XED = % change in Qd of Good A ÷ % change in price of Good B</div>
<ul>
  <li><strong>XED &gt; 0:</strong> Substitutes (e.g. Pepsi and Coke)</li>
  <li><strong>XED &lt; 0:</strong> Complements (e.g. cars and petrol)</li>
  <li><strong>XED = 0:</strong> Unrelated goods</li>
</ul>',
'[{"term":"Income elasticity of demand (YED)","def":"% change in Qd ÷ % change in income"},{"term":"Normal good","def":"YED > 0: demand rises with income"},{"term":"Inferior good","def":"YED < 0: demand falls as income rises"},{"term":"Cross elasticity (XED)","def":"% change in Qd of A ÷ % change in price of B"},{"term":"Substitute","def":"XED > 0: goods that replace each other"},{"term":"Complement","def":"XED < 0: goods consumed together"}]',
'["Calculate YED and classify goods as normal, luxury or inferior","Calculate XED and classify goods as substitutes or complements","Explain business implications of YED for revenue forecasting"]'
),

-- Market Failure subtopics
('1b000000-0005-0000-0000-000000000001', '1a000000-0000-0000-0000-000000000005', 'Externalities', 'externalities', 1, 15,
'<h2>Externalities</h2>
<p>An externality is a cost or benefit experienced by a third party not involved in the transaction. Externalities cause a divergence between private and social costs/benefits, leading to market failure.</p>
<h3>Negative Externalities in Production</h3>
<p>Example: factory pollution. The producer bears only private costs (labour, materials), but society bears additional external costs (health problems, environmental damage). This means:</p>
<ul><li>Social cost &gt; Private cost</li><li>Market output &gt; Socially optimal output (overproduction)</li></ul>
<h3>Positive Externalities in Consumption</h3>
<p>Example: education. The consumer gains private benefits, but society also benefits (higher productivity, less crime). This means:</p>
<ul><li>Social benefit &gt; Private benefit</li><li>Market output &lt; Socially optimal output (underprovision)</li></ul>',
'[{"term":"Externality","def":"A cost or benefit that falls on a third party not involved in the transaction"},{"term":"Negative externality","def":"A cost imposed on third parties — causes market overproduction"},{"term":"Positive externality","def":"A benefit conferred on third parties — causes market underprovision"},{"term":"Social optimum","def":"The output level where social marginal cost = social marginal benefit"},{"term":"Deadweight loss","def":"The welfare loss caused by market failure — shown as a triangle on a supply/demand diagram"}]',
'["Explain the difference between private and social costs/benefits","Identify examples of negative and positive externalities","Show on a diagram how externalities lead to market failure"]'
),

-- Monetary Policy subtopics
('2b000000-0004-0000-0000-000000000001', '2a000000-0000-0000-0000-000000000004', 'Interest Rates and the Bank of England', 'interest-rates', 1, 15,
'<h2>The Bank of England and Monetary Policy</h2>
<p>The Bank of England''s Monetary Policy Committee (MPC) meets monthly to set the base (Bank) rate. Its primary objective is to keep CPI inflation at 2% (±1%). The base rate influences borrowing costs across the entire economy.</p>
<h3>How Interest Rates Work</h3>
<ul>
  <li><strong>Lower interest rates</strong> → cheaper borrowing → more consumer spending and business investment → AD rises → output and inflation rise</li>
  <li><strong>Higher interest rates</strong> → dearer borrowing → saving more attractive → AD falls → inflation falls</li>
</ul>
<h3>Transmission Mechanism</h3>
<p>A rate change affects the economy through several channels:</p>
<ol>
  <li><strong>Consumer credit:</strong> mortgage payments change, affecting disposable income</li>
  <li><strong>Business investment:</strong> cost of capital changes</li>
  <li><strong>Asset prices:</strong> lower rates raise house and share prices, boosting wealth</li>
  <li><strong>Exchange rate:</strong> lower rates cause currency depreciation, boosting exports</li>
  <li><strong>Expectations:</strong> signals intent on future policy</li>
</ol>
<div class="content-callout info"><strong>Evaluation point:</strong> There are long and variable lags in monetary policy — typically 18–24 months for the full effect on inflation.</div>',
'[{"term":"Base rate","def":"The Bank of England''s benchmark interest rate, set by the MPC"},{"term":"MPC","def":"Monetary Policy Committee — 9 members who vote on the Bank Rate monthly"},{"term":"Transmission mechanism","def":"The channels through which a change in interest rates affects spending and inflation"},{"term":"Quantitative easing","def":"When the Bank of England creates money electronically to buy bonds, expanding the money supply"}]',
'["Explain how the Bank of England uses interest rates to meet its inflation target","Trace the transmission mechanism of a change in interest rates","Evaluate the effectiveness of interest rate policy"]'
),

('2b000000-0004-0000-0000-000000000002', '2a000000-0000-0000-0000-000000000004', 'Quantitative Easing', 'quantitative-easing', 2, 12,
'<h2>Quantitative Easing (QE)</h2>
<p>QE is an unconventional monetary policy tool used when interest rates are near zero. The Bank of England creates new electronic money and uses it to buy financial assets (primarily government bonds, or gilts) from commercial banks and other institutions.</p>
<h3>How QE Works</h3>
<ol>
  <li>Bank of England buys bonds from commercial banks</li>
  <li>Banks receive new money in their reserve accounts</li>
  <li>Bond prices rise and yields (interest rates) fall across the economy</li>
  <li>Lower long-term rates encourage borrowing and investment</li>
  <li>Wealth effect: rising asset prices boost confidence and spending</li>
</ol>
<h3>Evaluation of QE</h3>
<ul>
  <li>✅ Avoids liquidity trap when rates are at zero lower bound</li>
  <li>✅ Prevents deflation and keeps credit flowing</li>
  <li>❌ Benefits mainly wealthy asset-owners — worsens inequality</li>
  <li>❌ Risk of inflation if money supply grows too fast</li>
  <li>❌ Difficult to reverse ("tapering" can cause market volatility)</li>
</ul>',
'[{"term":"Quantitative easing (QE)","def":"Central bank creates money to buy bonds, expanding money supply and lowering long-term yields"},{"term":"Zero lower bound","def":"When interest rates approach 0%, making traditional rate cuts ineffective"},{"term":"Gilt","def":"A UK government bond — the main asset purchased during QE"},{"term":"Tapering","def":"Gradually reducing QE asset purchases — can cause bond market volatility"}]',
'["Explain how QE works and why it is used","Evaluate the effectiveness and risks of QE","Compare QE to conventional interest rate policy"]'
),

-- Fiscal Policy subtopics
('2b000000-0005-0000-0000-000000000001', '2a000000-0000-0000-0000-000000000005', 'Government Spending and Taxation', 'spending-taxation', 1, 15,
'<h2>Fiscal Policy</h2>
<p>Fiscal policy is the use of government spending and taxation to influence aggregate demand and the wider economy. It is managed by HM Treasury (the Chancellor of the Exchequer).</p>
<h3>Expansionary Fiscal Policy</h3>
<ul>
  <li>Increase government spending (G↑) — directly adds to AD</li>
  <li>Cut income tax — raises disposable income → C↑</li>
  <li>Cut corporation tax — raises post-tax profits → I↑</li>
</ul>
<h3>Contractionary Fiscal Policy</h3>
<ul>
  <li>Reduce government spending (G↓)</li>
  <li>Increase tax rates</li>
</ul>
<h3>The Fiscal Multiplier</h3>
<p>An initial change in government spending can have a multiplied effect on GDP. If the MPC (marginal propensity to consume) = 0.8, the multiplier = 1/(1-0.8) = 5. In practice, the multiplier is lower due to leakages (taxation, saving, imports).</p>',
'[{"term":"Fiscal policy","def":"Government spending and taxation used to influence economic activity"},{"term":"Expansionary fiscal policy","def":"Increasing spending or cutting taxes to boost AD"},{"term":"Contractionary fiscal policy","def":"Cutting spending or raising taxes to reduce AD"},{"term":"Fiscal multiplier","def":"The ratio of a change in GDP to the initial change in government spending"},{"term":"Budget deficit","def":"When government spending exceeds tax revenue in a year"},{"term":"National debt","def":"The cumulative total of all past government borrowing"}]',
'["Distinguish between expansionary and contractionary fiscal policy","Explain the multiplier effect with a numerical example","Evaluate the effectiveness of fiscal policy"]'
),

('2b000000-0005-0000-0000-000000000002', '2a000000-0000-0000-0000-000000000005', 'Budget Deficits and National Debt', 'budget-deficits', 2, 12,
'<h2>Budget Deficits and National Debt</h2>
<p>A <strong>budget deficit</strong> occurs when annual government expenditure exceeds tax revenue. The government must borrow to finance the gap, typically by issuing gilts. The <strong>national debt</strong> is the accumulated total of all past borrowing.</p>
<h3>Cyclical vs Structural Deficits</h3>
<ul>
  <li><strong>Cyclical deficit:</strong> caused by economic downturns — tax revenues fall and welfare spending rises automatically. Disappears as the economy recovers.</li>
  <li><strong>Structural deficit:</strong> the deficit that remains even at full employment — indicates government spending is fundamentally too high relative to tax revenue.</li>
</ul>
<h3>Automatic Stabilisers</h3>
<p>Automatic stabilisers are tax and benefit systems that respond to the economic cycle without deliberate policy action:</p>
<ul>
  <li>In recession: unemployment benefit rises (G↑), income tax receipts fall (T↓) → stimulates AD</li>
  <li>In boom: benefit spending falls, tax receipts rise → dampens AD</li>
</ul>',
'[{"term":"Budget deficit","def":"Annual shortfall when G > T"},{"term":"National debt","def":"Cumulative total of all government borrowing"},{"term":"Cyclical deficit","def":"Deficit caused by economic downturn — disappears when economy recovers"},{"term":"Structural deficit","def":"Deficit that persists even at full employment"},{"term":"Automatic stabiliser","def":"Tax and benefit changes that automatically offset economic fluctuations"}]',
'["Distinguish between cyclical and structural budget deficits","Explain how automatic stabilisers work","Evaluate the significance of government debt levels"]'
),

-- Exchange Rates subtopics
('2b000000-0009-0000-0000-000000000001', '2a000000-0000-0000-0000-000000000009', 'Exchange Rate Determination', 'exchange-rate-determination', 1, 15,
'<h2>Exchange Rate Determination</h2>
<p>In a floating exchange rate system, the value of a currency is determined by demand and supply in the foreign exchange market.</p>
<h3>Demand for Sterling</h3>
<p>Sterling is demanded by foreigners who wish to buy UK exports, invest in the UK, or for speculation. The demand curve slopes downward — a weaker pound makes UK goods cheaper for foreigners, increasing demand for sterling.</p>
<h3>Factors Causing Appreciation</h3>
<ul>
  <li>Higher UK interest rates (attract foreign capital)</li>
  <li>Improved export performance</li>
  <li>Reduced inflation (makes UK goods more competitive)</li>
  <li>Speculation (if markets expect further appreciation)</li>
</ul>
<h3>Effects of Depreciation</h3>
<ul>
  <li>Exports cheaper for foreign buyers → export demand rises (if PED elastic)</li>
  <li>Imports more expensive → import demand falls (if PED elastic)</li>
  <li>Current account may improve — but only if Marshall-Lerner condition holds</li>
  <li>Import-push inflation → higher price level</li>
</ul>',
'[{"term":"Appreciation","def":"A rise in the exchange rate — the currency buys more foreign currency"},{"term":"Depreciation","def":"A fall in the exchange rate — the currency buys less foreign currency"},{"term":"Marshall-Lerner condition","def":"Current account improves after depreciation only if PED(x) + PED(m) > 1"},{"term":"J-curve effect","def":"Current account initially worsens after depreciation before improving, as export/import volumes take time to adjust"}]',
'["Explain how exchange rates are determined in a floating system","Identify factors causing appreciation and depreciation","Evaluate the effect of exchange rate changes on the current account"]'
),

-- Supply-side policies
('2b000000-0006-0000-0000-000000000001', '2a000000-0000-0000-0000-000000000006', 'Supply-Side Policies', 'supply-side-overview', 1, 15,
'<h2>Supply-Side Policies</h2>
<p>Supply-side policies aim to improve the productive capacity of the economy — shifting the LRAS curve to the right. Unlike demand-side policies, they tackle the underlying supply of goods and services rather than just stimulating demand.</p>
<h3>Types of Supply-Side Policy</h3>
<h4>Market-Based (free market) Approaches</h4>
<ul>
  <li><strong>Privatisation:</strong> transferring state-owned industries to the private sector — increases competition and efficiency</li>
  <li><strong>Deregulation:</strong> removing unnecessary regulations to lower business costs</li>
  <li><strong>Reducing income tax:</strong> increases work incentives</li>
  <li><strong>Reducing welfare benefits:</strong> narrows the poverty trap, incentivises work</li>
</ul>
<h4>Interventionist Approaches</h4>
<ul>
  <li><strong>Education and training:</strong> improves human capital, raises productivity</li>
  <li><strong>Infrastructure investment:</strong> reduces business costs, improves efficiency</li>
  <li><strong>R&D subsidies:</strong> promotes innovation and technological progress</li>
  <li><strong>Industrial policy:</strong> targeted support for strategic sectors</li>
</ul>',
'[{"term":"Supply-side policy","def":"Policies designed to increase productive capacity and shift LRAS right"},{"term":"Privatisation","def":"Transfer of state-owned enterprise to private ownership"},{"term":"Deregulation","def":"Removing government rules that restrict market competition"},{"term":"Human capital","def":"The skills, knowledge and experience of the workforce"},{"term":"LRAS","def":"Long-run aggregate supply — the economy''s maximum productive capacity"}]',
'["Distinguish between market-based and interventionist supply-side policies","Explain how each type improves productive capacity","Evaluate the effectiveness of supply-side policies compared to demand-side alternatives"]'
),

-- Monopoly
('3b000000-0003-0000-0000-000000000001', '3a000000-0000-0000-0000-000000000003', 'Monopoly Power and Efficiency', 'monopoly-efficiency', 1, 15,
'<h2>Monopoly</h2>
<p>A pure monopoly exists when one firm supplies the entire market. In practice, a firm with a market share above 25% can be considered dominant under UK competition law. Monopolists are price makers — they can choose the price or quantity, but not both.</p>
<h3>Profit Maximisation</h3>
<p>Like all firms, a monopolist maximises profit where MC = MR. But unlike competitive firms, MR lies below the demand curve — meaning the monopolist restricts output below the competitive level and charges a higher price.</p>
<h3>Efficiency Costs</h3>
<ul>
  <li><strong>Allocative inefficiency:</strong> P &gt; MC → too little output is produced</li>
  <li><strong>Productive inefficiency:</strong> no competitive pressure to minimise costs</li>
  <li><strong>Deadweight welfare loss:</strong> consumer and producer surplus that is lost</li>
  <li><strong>X-inefficiency:</strong> slack within the firm due to lack of competition</li>
</ul>
<h3>Potential Benefits of Monopoly</h3>
<ul>
  <li>Economies of scale → lower average costs → lower prices possible</li>
  <li>Supernormal profits fund R&D and innovation</li>
  <li>Natural monopoly: one firm can serve the market at lower cost than many</li>
</ul>',
'[{"term":"Monopoly","def":"Single firm supplying the entire market; price maker"},{"term":"Market power","def":"Ability to set prices above competitive levels"},{"term":"Deadweight loss","def":"Welfare loss from monopoly restriction of output"},{"term":"X-inefficiency","def":"Organisational slack due to lack of competitive pressure"},{"term":"Natural monopoly","def":"Industry where one firm can supply the whole market at lower cost than two or more"}]',
'["Explain how a monopolist maximises profit using MC=MR","Show the sources of inefficiency in monopoly on a diagram","Evaluate whether monopoly is always harmful to society"]'
)

on conflict (id) do nothing;

-- ─── QUESTIONS ─────────────────────────────────────────────────────────────────

-- ── MCQ: MONETARY POLICY ──────────────────────────────────────────────────────
insert into public.questions (id, topic_id, subtopic_id, type, question_text, options, correct_answer, explanation, difficulty) values

('q0000000-0004-0001-0001-000000000001', '2a000000-0000-0000-0000-000000000004', '2b000000-0004-0000-0000-000000000001', 'mcq',
'The Bank of England''s primary monetary policy objective is to:',
'[{"text":"Maximise GDP growth","correct":false,"explanation":"Growth is a government objective, not the Bank of England''s primary mandate."},{"text":"Keep CPI inflation at the 2% target","correct":true,"explanation":"The MPC''s mandate is to maintain price stability, defined as CPI inflation of 2% (±1%)."},{"text":"Achieve full employment","correct":false,"explanation":"The US Federal Reserve has a dual mandate including employment, but the Bank of England''s primary mandate is price stability."},{"text":"Maintain a balanced budget","correct":false,"explanation":"The budget is managed by HM Treasury, not the Bank of England."}]',
'Keep CPI inflation at the 2% target', 'The Bank of England''s Monetary Policy Committee has a statutory mandate to keep CPI inflation at 2% (with a tolerance band of ±1%). All other objectives are secondary.', 'core'),

('q0000000-0004-0001-0001-000000000002', '2a000000-0000-0000-0000-000000000004', '2b000000-0004-0000-0000-000000000001', 'mcq',
'Which of the following is an example of expansionary monetary policy?',
'[{"text":"Increasing income tax","correct":false,"explanation":"Tax changes are fiscal policy, not monetary policy."},{"text":"Cutting government spending","correct":false,"explanation":"Government spending is fiscal policy."},{"text":"Reducing the base interest rate","correct":true,"explanation":"A rate cut lowers borrowing costs, stimulates spending and investment, and increases AD — this is expansionary."},{"text":"Increasing the reserve ratio requirement","correct":false,"explanation":"Raising reserve requirements restricts bank lending and would be contractionary."}]',
'Reducing the base interest rate', 'Expansionary monetary policy increases AD by reducing borrowing costs. A rate cut makes credit cheaper, encourages borrowing and spending, and reduces the reward for saving.', 'foundation'),

('q0000000-0004-0001-0001-000000000003', '2a000000-0000-0000-0000-000000000004', '2b000000-0004-0000-0000-000000000002', 'mcq',
'Quantitative easing (QE) involves the Bank of England:',
'[{"text":"Printing physical banknotes and distributing them","correct":false,"explanation":"QE is the electronic creation of money — no physical notes are printed."},{"text":"Buying government bonds from banks and financial institutions","correct":true,"explanation":"The Bank creates electronic reserves and uses them to purchase gilts (and other assets), expanding the money supply and lowering long-term yields."},{"text":"Setting negative interest rates on commercial bank deposits","correct":false,"explanation":"Negative rates are a separate policy tool, not QE."},{"text":"Reducing the required reserve ratio for banks","correct":false,"explanation":"The UK does not use reserve ratio requirements as a primary monetary tool."}]',
'Buying government bonds from banks and financial institutions', 'QE works by the Bank of England creating new money electronically and purchasing bonds. This pushes bond prices up, yields down, increases money in circulation, and lowers long-term borrowing costs.', 'core'),

('q0000000-0004-0001-0001-000000000004', '2a000000-0000-0000-0000-000000000004', '2b000000-0004-0000-0000-000000000001', 'mcq',
'If the Bank of England raises the base rate, which of the following is the most likely short-term effect?',
'[{"text":"Consumer and business borrowing increases","correct":false,"explanation":"Higher rates make borrowing more expensive, so borrowing falls."},{"text":"Sterling is likely to appreciate","correct":true,"explanation":"Higher interest rates attract foreign capital inflows seeking better returns — increasing demand for sterling and causing appreciation."},{"text":"Aggregate demand rises","correct":false,"explanation":"Higher rates reduce consumer spending and business investment, reducing AD."},{"text":"Asset prices rise","correct":false,"explanation":"Higher rates typically depress asset prices such as house prices and equities."}]',
'Sterling is likely to appreciate', 'Higher interest rates make UK assets more attractive to foreign investors. They buy sterling to invest in UK financial markets, increasing demand for the currency and causing appreciation. This is one of the key transmission channels of monetary policy.', 'core'),

('q0000000-0004-0001-0001-000000000005', '2a000000-0000-0000-0000-000000000004', '2b000000-0004-0000-0000-000000000001', 'mcq',
'The time lag between a change in interest rates and its full effect on inflation is typically:',
'[{"text":"Immediate","correct":false,"explanation":"There is significant lag in monetary policy transmission."},{"text":"3–6 months","correct":false,"explanation":"Some effects (e.g. exchange rate) appear quickly, but the full inflation effect takes longer."},{"text":"18–24 months","correct":true,"explanation":"The Bank of England estimates the full effect on inflation takes around 18–24 months, making monetary policy difficult to calibrate."},{"text":"5–10 years","correct":false,"explanation":"This overstates the lag significantly."}]',
'18–24 months', 'Monetary policy works through long and variable lags. While financial markets react quickly, real-economy effects (spending, employment, prices) take 18–24 months to fully materialise, creating a risk of over- or under-correction.', 'stretch'),

-- ── MCQ: FISCAL POLICY ────────────────────────────────────────────────────────
('q0000000-0005-0001-0001-000000000001', '2a000000-0000-0000-0000-000000000005', '2b000000-0005-0000-0000-000000000002', 'mcq',
'Automatic stabilisers are best described as:',
'[{"text":"Government spending decisions voted on annually in the budget","correct":false,"explanation":"These are discretionary fiscal policy decisions, not automatic stabilisers."},{"text":"Tax and benefit systems that respond automatically to the economic cycle","correct":true,"explanation":"Automatic stabilisers (income tax, JSA) expand the deficit in recessions and shrink it in booms without any deliberate policy action."},{"text":"Central bank interventions in the foreign exchange market","correct":false,"explanation":"This describes exchange rate intervention, not fiscal stabilisers."},{"text":"Fixed infrastructure investment programmes","correct":false,"explanation":"Fixed spending programmes do not automatically respond to the economic cycle."}]',
'Tax and benefit systems that respond automatically to the economic cycle', 'Automatic stabilisers reduce the need for discretionary intervention. In recession: tax receipts fall and benefit spending rises, supporting AD. In boom: tax rises and benefits fall, dampening inflationary pressure — all without government action.', 'core'),

('q0000000-0005-0001-0001-000000000002', '2a000000-0000-0000-0000-000000000005', '2b000000-0005-0000-0000-000000000001', 'mcq',
'Which of the following policies would increase the fiscal multiplier?',
'[{"text":"Cutting income tax for high earners","correct":false,"explanation":"High earners have a lower MPC, so their spending generates a smaller multiplier effect."},{"text":"Increasing government spending on public services","correct":true,"explanation":"Government spending has a multiplier as recipients spend their income, which becomes income for others. Targeting low-income groups maximises the effect as they have higher MPC."},{"text":"Reducing the national minimum wage","correct":false,"explanation":"This reduces spending power of low earners, who have high MPC — shrinking the multiplier."},{"text":"Increasing interest rates simultaneously","correct":false,"explanation":"Higher rates crowd out private investment, reducing the multiplier."}]',
'Increasing government spending on public services', 'The multiplier effect amplifies initial spending changes. It is largest when: MPC is high (recipients spend most of any income increase), there are few leakages (low tax, low import propensity), and resources are underemployed.', 'stretch'),

('q0000000-0005-0001-0001-000000000003', '2a000000-0000-0000-0000-000000000005', '2b000000-0005-0000-0000-000000000002', 'mcq',
'A structural budget deficit is one that:',
'[{"text":"Is caused entirely by economic recession","correct":false,"explanation":"That describes a cyclical deficit, which disappears when the economy recovers."},{"text":"Remains even when the economy is at full employment","correct":true,"explanation":"A structural deficit persists regardless of the economic cycle — it reflects a fundamental imbalance between government spending and tax revenue."},{"text":"Arises from emergency spending during a financial crisis","correct":false,"explanation":"Emergency spending can worsen either a cyclical or structural deficit but does not define either."},{"text":"Occurs when government debt exceeds GDP","correct":false,"explanation":"This describes a debt-to-GDP ratio above 100%, not a structural deficit."}]',
'Remains even when the economy is at full employment', 'Distinguishing structural from cyclical deficits is crucial for policy. A cyclical deficit self-corrects as the economy grows; a structural deficit requires deliberate fiscal adjustment (spending cuts or tax rises) to eliminate.', 'stretch'),

-- ── MCQ: ELASTICITY ──────────────────────────────────────────────────────────
('q0000000-0003-0001-0001-000000000001', '1a000000-0000-0000-0000-000000000003', '1b000000-0003-0000-0000-000000000001', 'mcq',
'If the price of a good rises by 10% and quantity demanded falls by 25%, the price elasticity of demand is:',
'[{"text":"-2.5","correct":true,"explanation":"PED = % change in Qd ÷ % change in P = -25% ÷ +10% = -2.5. Demand is elastic."},{"text":"-0.4","correct":false,"explanation":"This is the reciprocal — you divided price change by quantity change rather than the other way round."},{"text":"+2.5","correct":false,"explanation":"PED is always negative — price and quantity demanded move in opposite directions."},{"text":"-1.0","correct":false,"explanation":"PED = 1 only if the percentage changes are equal. Here Qd falls more than price rises."}]',
'-2.5', 'PED = % ΔQd ÷ % ΔP = -25 ÷ 10 = -2.5. Since |PED| > 1, demand is elastic — a 1% price rise causes more than 1% fall in quantity demanded.', 'foundation'),

('q0000000-0003-0001-0001-000000000002', '1a000000-0000-0000-0000-000000000003', '1b000000-0003-0000-0000-000000000001', 'mcq',
'A firm discovers that raising its price by 5% reduces total revenue. This tells us that demand for its product is:',
'[{"text":"Perfectly inelastic","correct":false,"explanation":"With perfectly inelastic demand, a price rise causes no change in Qd, so TR rises proportionally."},{"text":"Elastic","correct":true,"explanation":"When demand is elastic (PED > 1), a price rise reduces TR because the fall in Qd more than offsets the higher price."},{"text":"Inelastic","correct":false,"explanation":"When demand is inelastic, a price rise increases TR."},{"text":"Unit elastic","correct":false,"explanation":"With unit elastic demand (PED = -1), TR stays constant when price changes."}]',
'Elastic', 'Total Revenue = P × Q. When demand is elastic, the % fall in Qd exceeds the % rise in P, so TR falls. When demand is inelastic, the % fall in Qd is smaller than the % rise in P, so TR rises.', 'core'),

('q0000000-0003-0001-0001-000000000003', '1a000000-0000-0000-0000-000000000003', '1b000000-0003-0000-0000-000000000002', 'mcq',
'Which of the following goods is most likely to have a negative income elasticity of demand?',
'[{"text":"Foreign holidays","correct":false,"explanation":"Foreign holidays are a luxury good with YED > 1."},{"text":"Branded sportswear","correct":false,"explanation":"This is a normal, likely luxury good."},{"text":"Own-brand supermarket bread","correct":true,"explanation":"Budget food items tend to be inferior goods — as income rises, consumers switch to more expensive alternatives, reducing demand for cheap staples."},{"text":"Restaurant meals","correct":false,"explanation":"Restaurant meals are normal goods with positive YED — demand rises with income."}]',
'Own-brand supermarket bread', 'Inferior goods (YED < 0) are typically low-quality substitutes consumed when income is limited. As incomes rise, consumers trade up to superior alternatives. Examples: instant noodles, bus travel, budget-brand products.', 'core'),

('q0000000-0003-0001-0001-000000000004', '1a000000-0000-0000-0000-000000000003', '1b000000-0003-0000-0000-000000000002', 'mcq',
'The cross elasticity of demand between petrol and cars is expected to be:',
'[{"text":"Positive","correct":false,"explanation":"Positive XED indicates substitutes — petrol and cars are not substitutes."},{"text":"Zero","correct":false,"explanation":"Zero XED means unrelated goods — but petrol and cars are strongly related."},{"text":"Negative","correct":true,"explanation":"Petrol and cars are complements — consumed together. A rise in petrol prices reduces demand for cars, giving XED < 0."},{"text":"Greater than one","correct":false,"explanation":"The sign matters more than the magnitude here — and the sign will be negative for complements."}]',
'Negative', 'Complementary goods have negative XED because they are used together. If petrol becomes expensive, car ownership becomes more costly overall → demand for cars falls. Other complement pairs: coffee and coffee machines, printers and ink cartridges.', 'core'),

-- ── MCQ: DEMAND ───────────────────────────────────────────────────────────────
('q0000000-0001-0001-0001-000000000001', '1a000000-0000-0000-0000-000000000001', '1b000000-0001-0000-0000-000000000001', 'mcq',
'Which of the following would cause a rightward shift in the demand curve for electric vehicles?',
'[{"text":"A rise in the price of electric vehicles","correct":false,"explanation":"A price change causes a movement along the demand curve, not a shift."},{"text":"A large rise in the price of petrol","correct":true,"explanation":"Petrol and electric vehicles are substitutes. A petrol price rise makes EVs relatively cheaper, increasing demand for them at every price level."},{"text":"A fall in consumer incomes","correct":false,"explanation":"Assuming EVs are normal goods, lower incomes reduce demand — shifting the curve left."},{"text":"An improvement in battery technology reducing EV running costs","correct":false,"explanation":"Reduced running costs could increase demand, but this would primarily affect supply (lower costs for producers), not shift the demand curve."}]',
'A large rise in the price of petrol', 'A rightward demand shift means demand increases at every price. Since petrol and EVs are substitutes, higher petrol prices make EVs more attractive. Other rightward shifters: rising incomes (normal good), increased environmental awareness, government subsidies for buyers.', 'foundation'),

('q0000000-0001-0001-0001-000000000002', '1a000000-0000-0000-0000-000000000001', '1b000000-0001-0000-0000-000000000001', 'mcq',
'The income effect of a price rise means that:',
'[{"text":"Consumers buy more because the good is perceived as better quality","correct":false,"explanation":"This confuses the income effect with Veblen goods or Giffen goods."},{"text":"Consumers switch to cheaper substitute goods","correct":false,"explanation":"This is the substitution effect, not the income effect."},{"text":"A higher price reduces consumers'' real purchasing power, so they buy less","correct":true,"explanation":"When a good''s price rises, the same money income buys less — reducing real purchasing power and causing quantity demanded to fall."},{"text":"Higher prices signal greater scarcity, increasing demand","correct":false,"explanation":"This is not standard economic theory — it describes speculative or Veblen goods."}]',
'A higher price reduces consumers'' real purchasing power, so they buy less', 'The income effect occurs because a price rise is equivalent to a fall in real income — consumers can afford less with the same nominal income. For normal goods, this reinforces the substitution effect, both reducing Qd.', 'core'),

-- ── MCQ: MARKET FAILURE ───────────────────────────────────────────────────────
('q0000000-0005-0001-0001-000000000010', '1a000000-0000-0000-0000-000000000005', '1b000000-0005-0000-0000-000000000001', 'mcq',
'Negative externalities in production lead to:',
'[{"text":"Market output being below the socially optimal level","correct":false,"explanation":"Underproduction occurs with positive externalities, not negative ones."},{"text":"Market price being set above the social optimum","correct":false,"explanation":"The market price with negative externalities is typically BELOW the social optimum (it ignores external costs)."},{"text":"Market output being above the socially optimal level — overproduction","correct":true,"explanation":"Producers do not bear the full social cost, so they produce more than is socially optimal. The market equilibrium output > social optimum output."},{"text":"No effect on market equilibrium","correct":false,"explanation":"External costs always cause market failure — the market systematically misallocates resources."}]',
'Market output being above the socially optimal level — overproduction', 'With negative externalities, the supply curve (based on private costs) lies below the true social supply curve (private + external costs). The market produces at the intersection of demand and private supply — more than optimal. A Pigouvian tax can correct this.', 'core'),

('q0000000-0005-0001-0001-000000000011', '1a000000-0000-0000-0000-000000000005', '1b000000-0005-0000-0000-000000000001', 'mcq',
'A public good is defined by which combination of characteristics?',
'[{"text":"Rival and excludable","correct":false,"explanation":"This describes a private good."},{"text":"Non-rival and excludable","correct":false,"explanation":"This describes a club good (e.g. pay-per-view TV)."},{"text":"Rival and non-excludable","correct":false,"explanation":"This describes a common good (e.g. fish in the ocean)."},{"text":"Non-rival and non-excludable","correct":true,"explanation":"Public goods have both properties: consumption by one does not reduce availability to others (non-rival) and it is impossible or impractical to exclude anyone from consuming (non-excludable)."}]',
'Non-rival and non-excludable', 'Public goods cause market failure because of the free rider problem. If exclusion is impossible, no one has an incentive to pay — private firms cannot charge and so will not supply. Government must provide instead. Examples: national defence, street lighting, flood barriers.', 'core'),

-- ── MCQ: EXCHANGE RATES ───────────────────────────────────────────────────────
('q0000000-0009-0001-0001-000000000001', '2a000000-0000-0000-0000-000000000009', '2b000000-0009-0000-0000-000000000001', 'mcq',
'If sterling depreciates, which of the following is most likely in the short term?',
'[{"text":"UK exports become more expensive for foreign buyers","correct":false,"explanation":"Depreciation makes sterling cheaper, so UK goods cost fewer foreign currency units — exports become CHEAPER for foreigners."},{"text":"UK imports become cheaper for UK consumers","correct":false,"explanation":"Imports priced in foreign currency cost MORE sterling after depreciation."},{"text":"UK export volumes rise and import volumes fall, potentially improving the current account","correct":true,"explanation":"Cheaper exports boost foreign demand; dearer imports reduce domestic demand for them. If Marshall-Lerner holds, the current account improves."},{"text":"The current account deficit immediately improves","correct":false,"explanation":"The J-curve effect means the current account may initially worsen before improving, as volumes take time to adjust."}]',
'UK export volumes rise and import volumes fall, potentially improving the current account', 'Depreciation improves international competitiveness but requires the Marshall-Lerner condition (sum of PEDs > 1) to improve the current account. Short-run volumes are sticky (contracts, habits), so the J-curve means the current account may worsen initially.', 'core'),

('q0000000-0009-0001-0001-000000000002', '2a000000-0000-0000-0000-000000000009', '2b000000-0009-0000-0000-000000000001', 'mcq',
'The Marshall-Lerner condition states that a currency depreciation will improve the current account only if:',
'[{"text":"The sum of PEDs for exports and imports is less than 1","correct":false,"explanation":"If sum of PEDs < 1, volumes barely respond to the price change — the current account worsens."},{"text":"The sum of PEDs for exports and imports exceeds 1","correct":true,"explanation":"If PED(x) + PED(m) > 1, the volume effects (more exports, fewer imports) outweigh the adverse price effects, improving the current account."},{"text":"The exchange rate has been falling for at least 12 months","correct":false,"explanation":"Time is relevant to the J-curve, but the Marshall-Lerner condition is about elasticities, not time."},{"text":"Exports are more elastic than imports","correct":false,"explanation":"The condition requires the SUM of both elasticities to exceed 1 — it does not require exports to be more elastic than imports."}]',
'The sum of PEDs for exports and imports exceeds 1', 'The Marshall-Lerner condition: if PED(x) + PED(m) > 1, depreciation improves the current account. In the short run, elasticities tend to be low (contracts, habits) → J-curve effect. In the long run, elasticities rise as markets adjust.', 'stretch'),

-- ── MCQ: SUPPLY-SIDE POLICIES ─────────────────────────────────────────────────
('q0000000-0006-0001-0001-000000000001', '2a000000-0000-0000-0000-000000000006', '2b000000-0006-0000-0000-000000000001', 'mcq',
'Which of the following is a market-based (free market) supply-side policy?',
'[{"text":"Increased government spending on apprenticeship training","correct":false,"explanation":"Government training spending is an interventionist supply-side policy."},{"text":"Public investment in high-speed rail infrastructure","correct":false,"explanation":"This is interventionist — the state directly provides infrastructure."},{"text":"Privatisation of state-owned enterprises","correct":true,"explanation":"Privatisation transfers ownership to the private sector, introducing competition and profit motive to improve efficiency — a core market-based supply-side reform."},{"text":"Subsidies for research and development","correct":false,"explanation":"R&D subsidies involve government intervention in the market — not market-based."}]',
'Privatisation of state-owned enterprises', 'Market-based supply-side policies work by extending the role of markets and reducing government intervention: privatisation, deregulation, reducing income tax, reducing welfare benefits. Interventionist approaches use the state to improve outcomes: education, infrastructure, R&D subsidies.', 'core'),

('q0000000-0006-0001-0001-000000000002', '2a000000-0000-0000-0000-000000000006', '2b000000-0006-0000-0000-000000000001', 'mcq',
'Supply-side policies primarily aim to:',
'[{"text":"Increase aggregate demand","correct":false,"explanation":"AD is the target of demand-side policies. Supply-side policies work on productive capacity."},{"text":"Shift the LRAS curve to the right","correct":true,"explanation":"Supply-side policies increase the economy''s productive potential — allowing more output without causing inflation. This is represented by a rightward shift of LRAS."},{"text":"Reduce the budget deficit in the short run","correct":false,"explanation":"Some supply-side policies (like education spending) initially increase the deficit. Benefits take years or decades to materialise."},{"text":"Reduce unemployment in the next 6 months","correct":false,"explanation":"Supply-side policies work slowly — they build productive capacity over years."}]',
'Shift the LRAS curve to the right', 'Supply-side policies increase the economy''s long-run productive capacity. Unlike demand-side policies, they can raise real output without increasing inflationary pressure. However, they typically take years or decades to show effects — a key limitation.', 'core'),

-- ── MCQ: MONOPOLY ─────────────────────────────────────────────────────────────
('q0000000-0003m-001-0001-000000000001', '3a000000-0000-0000-0000-000000000003', '3b000000-0003-0000-0000-000000000001', 'mcq',
'Compared to a perfectly competitive market, a profit-maximising monopolist will produce:',
'[{"text":"More output at a lower price","correct":false,"explanation":"Monopolists restrict output to push up prices — the opposite."},{"text":"The same output at a higher price","correct":false,"explanation":"Monopolists restrict both — lower output AND higher price."},{"text":"Less output at a higher price","correct":true,"explanation":"The monopolist maximises profit at MC=MR. Since MR lies below the demand curve, this gives lower output than the competitive equilibrium (where P=MC) and a higher price."},{"text":"More output at a higher price","correct":false,"explanation":"A monopolist would never voluntarily produce more than the competitive level at a higher price — that would reduce profit."}]',
'Less output at a higher price', 'In perfect competition, P=MC=MR at equilibrium. In monopoly, P>MR, so the firm sets MC=MR at a lower quantity and charges the demand-curve price for that quantity — higher than in competition. This creates deadweight loss.', 'core')

on conflict (id) do nothing;

-- ── CHAIN (LINK IT) QUESTIONS ─────────────────────────────────────────────────
insert into public.questions (id, topic_id, subtopic_id, type, question_text, chain_steps, explanation, difficulty) values

('c0000000-0004-0001-0001-000000000001', '2a000000-0000-0000-0000-000000000004', '2b000000-0004-0000-0000-000000000001', 'chain',
'Trace the transmission mechanism: How does a Bank of England interest rate cut affect inflation?',
'[{"position":1,"step":"Bank of England cuts the base rate","hint":"What does the MPC decide?"},{"position":2,"step":"Commercial banks reduce their mortgage and loan rates","hint":"How do banks respond to cheaper central bank funding?"},{"position":3,"step":"Consumers'' mortgage payments fall — more disposable income","hint":"How does cheaper borrowing affect households?"},{"position":4,"step":"Consumer spending (C) rises","hint":"What do households do with extra disposable income?"},{"position":5,"step":"Business investment (I) rises — cheaper to borrow capital","hint":"How do lower rates affect firms'' investment decisions?"},{"position":6,"step":"Sterling depreciates — lower rates reduce capital inflows","hint":"What happens to demand for sterling?"},{"position":7,"step":"Exports become cheaper; imports become more expensive","hint":"How does currency depreciation affect trade competitiveness?"},{"position":8,"step":"Aggregate demand rises","hint":"AD = C + I + G + (X-M)"},{"position":9,"step":"Inflationary pressure increases — economy moves toward 2% target","hint":"What happens to price level as AD rises toward/above potential output?"}]',
'This is the monetary transmission mechanism. Rate cuts work through: consumer credit channel (lower mortgage costs boost spending), investment channel (cheaper capital expenditure), and exchange rate channel (depreciation boosts net exports). All channels expand AD, raising output and inflation.', 'core'),

('c0000000-0005-0001-0001-000000000001', '2a000000-0000-0000-0000-000000000005', '2b000000-0005-0000-0000-000000000001', 'chain',
'Trace the chain: How does an increase in government spending lead to a multiplied rise in GDP?',
'[{"position":1,"step":"Government increases spending on infrastructure (G rises)","hint":"What is the initial injection into the economy?"},{"position":2,"step":"Construction firms receive the spending as revenue","hint":"Who directly benefits from the government contract?"},{"position":3,"step":"Construction workers receive higher wages","hint":"How does firm revenue translate into household income?"},{"position":4,"step":"Workers spend a proportion of their income (the MPC)","hint":"Not all income is spent — some leaks to saving and tax"},{"position":5,"step":"This spending becomes income for other firms and workers","hint":"Each round of spending creates income for more households"},{"position":6,"step":"Each subsequent round of spending is smaller due to leakages","hint":"What reduces each round — tax, saving, imports"},{"position":7,"step":"Total GDP rise is a multiple of the initial spending (Multiplier = 1/(1-MPC))","hint":"If MPC = 0.8, multiplier = 5"}]',
'The Keynesian multiplier shows how an initial injection (G, I, or X) generates a larger increase in national income. Multiplier = 1 / (1 - MPC) = 1 / MPS+MPT+MPM. High MPC, low tax and import propensity maximise the multiplier. In practice, UK multiplier estimates range from 0.5 to 1.5.', 'core'),

('c0000000-0009-0001-0001-000000000001', '2a000000-0000-0000-0000-000000000009', '2b000000-0009-0000-0000-000000000001', 'chain',
'Trace the chain: How does a depreciation of sterling affect the UK current account?',
'[{"position":1,"step":"The pound depreciates — costs fewer foreign currency units per pound","hint":"What does depreciation mean for the exchange rate?"},{"position":2,"step":"UK export prices fall in foreign currency terms","hint":"How does depreciation affect the price foreigners pay for UK goods?"},{"position":3,"step":"UK exports become more internationally competitive","hint":"What effect does a lower price have on export demand?"},{"position":4,"step":"Export volumes rise (if demand is elastic)","hint":"What is the condition for export volumes to rise significantly?"},{"position":5,"step":"Import prices rise in sterling terms","hint":"Imports priced in foreign currency now cost more pounds"},{"position":6,"step":"Import volumes fall (if demand is elastic)","hint":"UK consumers substitute away from expensive imports"},{"position":7,"step":"Net exports (X-M) improve","hint":"More exports, fewer imports"},{"position":8,"step":"Current account deficit narrows (if Marshall-Lerner condition holds)","hint":"What must be true for the improvement to materialise?"}]',
'Depreciation improves competitiveness but the current account only improves if the Marshall-Lerner condition holds (sum of PEDs > 1). In the short run, the J-curve effect means the current account may worsen before improving, as export and import volumes are sticky while prices adjust immediately.', 'stretch'),

('c0000000-0005m-001-0001-000000000001', '1a000000-0000-0000-0000-000000000005', '1b000000-0005-0000-0000-000000000001', 'chain',
'Trace the chain: Why does a factory producing pollution lead to market failure?',
'[{"position":1,"step":"Factory produces goods using production processes that emit pollution","hint":"What is the external effect of production?"},{"position":2,"step":"The factory only considers its own private costs (labour, materials, energy)","hint":"What costs does the firm include in its decisions?"},{"position":3,"step":"External costs (respiratory disease, environmental damage) fall on third parties","hint":"Who bears the pollution costs?"},{"position":4,"step":"Social cost = Private cost + External cost","hint":"How do we account for ALL costs to society?"},{"position":5,"step":"The market supply curve reflects only private cost — it lies below the social supply curve","hint":"The firm''s supply curve ignores external costs"},{"position":6,"step":"Market equilibrium output is greater than the socially optimal output","hint":"More is produced than society values net of all costs"},{"position":7,"step":"Deadweight welfare loss — overproduction creates a welfare loss triangle","hint":"Society would be better off with lower output"},{"position":8,"step":"Government may intervene: Pigouvian tax shifts supply curve up to internalise the externality","hint":"A tax equal to the external cost per unit corrects the market failure"}]',
'Negative externalities cause overproduction. The firm''s private supply curve lies below the true social supply curve. A Pigouvian tax equal to the marginal external cost per unit shifts the supply curve up, eliminating the wedge between private and social cost and restoring the socially optimal output.', 'core')

on conflict (id) do nothing;

-- ── SPOT THE FLAW QUESTIONS ───────────────────────────────────────────────────
insert into public.questions (id, topic_id, subtopic_id, type, question_text, flaw_answers, explanation, difficulty) values

('f0000000-0004-0001-0001-000000000001', '2a000000-0000-0000-0000-000000000004', '2b000000-0004-0000-0000-000000000001', 'flaw',
'A student writes: "A cut in interest rates will always boost economic growth because consumers will borrow more and spend more, which increases aggregate demand." Which answer contains a significant flaw in the reasoning?',
'[{"text":"A rate cut reduces mortgage payments, freeing up household disposable income which can be spent on goods and services, boosting consumption and AD.","is_flawed":false,"explanation":"This is correct reasoning — lower mortgage costs directly increase disposable income and consumer spending."},{"text":"Interest rate cuts always lead to economic growth regardless of the state of the economy or consumer confidence.","is_flawed":true,"explanation":"This is flawed. Rate cuts may be ineffective in a liquidity trap (when rates are near zero and cutting further has little effect). Consumer and business confidence matters — in deep recession, firms and consumers may not borrow even at very low rates. Also, the full effect takes 18–24 months."},{"text":"Lower interest rates reduce the cost of borrowing for businesses, potentially stimulating investment and adding to AD.","is_flawed":false,"explanation":"This is sound reasoning — lower rates reduce the hurdle rate for investment projects, increasing business investment."}]',
'The word "always" is the key flaw. Monetary policy can be ineffective in a liquidity trap, when confidence is very low, when credit markets are frozen, or when banks are unwilling to lend. Rate cuts are powerful but not guaranteed to work — evaluation must consider these limitations.', 'core'),

('f0000000-0009-0001-0001-000000000001', '2a000000-0000-0000-0000-000000000009', '2b000000-0009-0000-0000-000000000001', 'flaw',
'A student argues: "A depreciation of the pound will always improve the UK''s current account deficit because UK exports will become cheaper for foreign buyers, so they will buy more." Spot the flawed reasoning.',
'[{"text":"When sterling depreciates, UK goods priced in dollars become cheaper for American consumers, potentially increasing export demand from the US.","is_flawed":false,"explanation":"This is accurate — depreciation does lower export prices in foreign currency terms, and can increase export demand."},{"text":"A depreciation will always improve the current account deficit immediately.","is_flawed":true,"explanation":"Two significant flaws: (1) The Marshall-Lerner condition must hold — if PED(x) + PED(m) < 1, the current account worsens. (2) Even if ML holds, the J-curve means the current account worsens in the short run before improving, as volume responses take time."},{"text":"Import prices rise after depreciation, which may reduce import demand if consumers find suitable domestic alternatives.","is_flawed":false,"explanation":"This is valid reasoning — dearer imports can lead to import substitution, improving the current account."}]',
'Two flaws: The Marshall-Lerner condition (sum of PEDs > 1) must hold for the current account to improve. Even when ML holds, the J-curve means the current account initially worsens (prices adjust instantly but volumes take 12–18 months to respond). "Always" and "immediately" are both wrong.', 'stretch'),

('f0000000-0005-0001-0001-000000000001', '2a000000-0000-0000-0000-000000000005', '2b000000-0005-0000-0000-000000000001', 'flaw',
'A student claims: "Increasing the minimum wage will benefit all low-paid workers because they will receive higher hourly pay." Identify the flawed argument.',
'[{"text":"Higher minimum wages increase the take-home pay of workers who remain employed, improving their living standards.","is_flawed":false,"explanation":"This is correct for workers who keep their jobs — a higher minimum wage does raise earnings for employed low-wage workers."},{"text":"A minimum wage rise above the equilibrium wage will increase employment and wages simultaneously.","is_flawed":true,"explanation":"Standard labour market theory suggests a minimum wage set above the equilibrium wage creates a wage floor. This increases the quantity of labour supplied but reduces the quantity demanded, creating unemployment. Not all low-paid workers benefit — some may lose their jobs or have hours cut."},{"text":"Employers may respond to higher minimum wages by reducing hours, using more automation, or increasing prices — partially offsetting the wage gain.","is_flawed":false,"explanation":"These are valid concerns about minimum wage effects — monopsony theory aside, these are legitimate supply-side responses employers can make."}]',
'The flawed claim ignores the potential for job losses. If the minimum wage is set above the market-clearing wage, it creates a surplus of labour (unemployment). Some workers gain higher wages; others lose jobs or have hours reduced. In monopsony labour markets, the minimum wage can actually increase both wages and employment — adding important nuance.', 'core'),

('f0000000-0006-0001-0001-000000000001', '2a000000-0000-0000-0000-000000000006', '2b000000-0006-0000-0000-000000000001', 'flaw',
'A student writes: "Supply-side policies are the best way to reduce unemployment because they increase the productive capacity of the economy." Find the flaw.',
'[{"text":"Supply-side policies such as education and training reduce structural unemployment by improving workers'' skills and productivity.","is_flawed":false,"explanation":"This is valid — improving human capital directly tackles structural unemployment caused by skills mismatches."},{"text":"Supply-side policies can reduce all types of unemployment because they shift the LRAS curve to the right.","is_flawed":true,"explanation":"This is flawed. Supply-side policies are effective for structural and frictional unemployment. They are NOT effective for demand-deficient (cyclical) unemployment — in a recession, raising productive capacity does not create demand. Cyclical unemployment requires demand-side policies (fiscal or monetary stimulus)."},{"text":"The effectiveness of supply-side policies depends on how quickly workers can acquire new skills and how geographically mobile labour is.","is_flawed":false,"explanation":"These are legitimate evaluation points — structural policies take time and face geographic mismatch issues."}]',
'Supply-side policies tackle supply-side causes of unemployment (structural, frictional) but cannot fix demand-deficient unemployment. In a recession, the problem is insufficient demand — firms won''t hire even if workers are more productive. The right tool for cyclical unemployment is demand-side stimulus.', 'core')

on conflict (id) do nothing;
