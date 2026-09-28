// Long-form articles. `body` is HTML. `{{AD}}` inserts an in-article ad; `{{LEAD}}` inserts an inline lead CTA.
const src = (list) => '<h2>Sources</h2><ol class="small">' + list.map(([t, u]) => `<li><a href="${u}" rel="noopener nofollow" target="_blank">${t}</a></li>`).join('') + '</ol>';

module.exports = [
{
  slug: 'chinese-lucky-numbers-guide',
  title: 'Chinese Lucky Numbers: The Complete Guide (0–9, Combos & Real Prices)',
  short: 'Chinese Lucky Numbers Guide',
  desc: 'What every digit means in Chinese culture, why 8 is lucky and 4 is avoided, the best combinations, and what lucky numbers actually sell for.',
  cat: 'Pillar guide', mins: 11, video: 'pT52hREAf18',
  answer: 'In Chinese culture the luckiest digits are <b>8</b> (sounds like 发, "prosper"), <b>6</b> (流, "smooth") and <b>9</b> (久, "long-lasting"). <b>4</b> is avoided because it sounds like 死, "death". Meanings come from homophones, so they change between Mandarin and Cantonese.',
  faq: [
    ['What is the luckiest number in Chinese culture?', 'Eight. 八 (bā) sounds like 发 (fā), "to prosper". Prices, phone numbers, plates and even the 2008 Olympic opening time (8:08 pm on 8/8/08) were chosen for it.'],
    ['Why is 4 unlucky in Chinese?', '四 (sì) sounds almost identical to 死 (sǐ), "death", in both Mandarin and Cantonese. Many buildings skip 4th, 14th and 24th floors.'],
    ['Is 3 lucky or unlucky?', 'Both. In Cantonese 三 sounds like 生 "life / growth" (lucky). In Mandarin it can also echo 散 "scatter" (unlucky for relationships).'],
    ['What does 520 mean?', '我爱你, "I love you" — 20 May is a romantic holiday in China.']
  ],
  body: `
<p>Numbers in China are not just quantities — they are <em>sounds</em>. Because Chinese has many homophones, a digit borrows the meaning of whatever word it sounds like. That is why a phone number, a price tag or a car plate can be read like a sentence, and why people pay real money for "good" numbers.</p>
<h2 id="digits">What each digit means</h2>
<table><thead><tr><th>Digit</th><th>Chinese</th><th>Sounds like</th><th>Verdict</th></tr></thead><tbody>
<tr><td class="mono">0</td><td>零 líng</td><td>Wholeness; folk readings 灵 / 良</td><td>Neutral</td></tr>
<tr><td class="mono">1</td><td>一 yī / yāo</td><td>Unity, first; 要 "will"</td><td>Neutral–good</td></tr>
<tr><td class="mono">2</td><td>二 èr</td><td>Pairs; Cantonese 易 "easy"</td><td>Good</td></tr>
<tr><td class="mono">3</td><td>三 sān</td><td>生 "life" (Cantonese) / 散 "scatter" (Mandarin)</td><td>Mixed</td></tr>
<tr><td class="mono">4</td><td>四 sì</td><td>死 "death"</td><td>Avoided</td></tr>
<tr><td class="mono">5</td><td>五 wǔ</td><td>Five elements; 我 "me"; Cantonese 唔 "not"</td><td>Context</td></tr>
<tr><td class="mono">6</td><td>六 liù</td><td>流 "flow", 禄 "fortune"</td><td>Lucky</td></tr>
<tr><td class="mono">7</td><td>七 qī</td><td>起 "rise", 齐 "together"; Ghost Month</td><td>Mixed</td></tr>
<tr><td class="mono">8</td><td>八 bā</td><td>发 "prosper"</td><td>Luckiest</td></tr>
<tr><td class="mono">9</td><td>九 jiǔ</td><td>久 "long-lasting"</td><td>Lucky</td></tr>
</tbody></table>
<p>Want to check your own number? Use the <a href="../tools/number-decoder.html">Number Decoder</a> — it scores any string of digits in Mandarin, Cantonese or both.</p>
{{AD}}
<h2 id="combos">The combinations that matter</h2>
<p>Single digits are only half the story. Chinese speakers read runs of digits as phrases:</p>
<ul>
<li><b>168</b> 一路发 — "prosperity all the way". A favourite for shop prices and business lines.</li>
<li><b>518</b> 我要发 — "I will prosper".</li>
<li><b>520 / 521</b> 我爱你 / 我愿意 — "I love you" / "I do".</li>
<li><b>1314</b> 一生一世 — "one lifetime". Combined as <b>5201314</b>, "I love you forever".</li>
<li><b>666</b> — "slick, awesome" in internet slang.</li>
<li><b>250</b> 二百五 — "idiot". Never price a gift at 250.</li>
<li><b>14 / 24 / 74</b> — "will die", "easy death" (Cantonese), "angry to death".</li>
<li><b>38</b> — International Women's Day (3/8), but also a mild insult for a gossipy woman. Handle with care.</li>
</ul>
<h2 id="dialects">Mandarin vs Cantonese</h2>
<p>Because meanings come from sounds, dialect changes everything. In Cantonese-speaking Hong Kong and Guangdong, 2 (ji6) sounds like 易 "easy", so <b>28</b> reads "easy prosperity" — one reason Hong Kong's "28" plate sold for HK$18.1 million in 2016. In Mandarin, 3 can read as 散 "scatter", while in Cantonese it is the lucky 生 "life". Read the full <a href="cantonese-vs-mandarin-number-meanings.html">dialect guide</a>.</p>
{{LEAD}}
<h2 id="money">What lucky numbers sell for</h2>
<p>Luck has a price tag. Hong Kong's Transport Department auctions personalised and traditional plates several times a year, and the results are public:</p>
<table><thead><tr><th>Asset</th><th>Price</th><th>Year</th></tr></thead><tbody>
<tr><td>HK plate "28"</td><td>HK$18.1M</td><td>2016</td></tr>
<tr><td>HK plate "18"</td><td>HK$16.5M</td><td>2008</td></tr>
<tr><td>HK plate "88"</td><td>HK$11.4M</td><td>2025</td></tr>
<tr><td>Phone +86 28 8888 8888</td><td>CN¥2.33M</td><td>2003</td></tr>
<tr><td>Beijing mobile ending 88888</td><td>CN¥2.25M</td><td>2020</td></tr>
</tbody></table>
<p>Numeric web domains follow the same logic: roughly 48% of all 1,000 three-digit .com domains were held by Chinese owners in 2015, and domains containing 4 are notoriously hard to sell. See <a href="numeric-domains-chinese-buyers.html">numeric domains & Chinese buyers</a>.</p>
<h2 id="use">How to use this knowledge</h2>
<ol>
<li><b>Pricing:</b> end prices in 8 or 88 for Chinese-speaking customers; avoid 4 and 250.</li>
<li><b>Phone numbers:</b> the last four digits carry most of the value. Try the <a href="../tools/lucky-phone-number-checker.html">phone checker</a>.</li>
<li><b>Dates:</b> weddings cluster on dates with 8, 6 or 9 and on 520. Use the <a href="../tools/lucky-date-picker.html">lucky date picker</a>.</li>
<li><b>Gifts:</b> give in even numbers and red-packet amounts like 88, 168 or 888 — see <a href="red-packet-amounts.html">red packet etiquette</a>.</li>
</ol>
` + src([
    ['Wikipedia — Chinese numerology', 'https://en.wikipedia.org/wiki/Chinese_numerology'],
    ['SCMP — Car plates "S" and "88" go for millions (2025)', 'https://www.scmp.com/news/hong-kong/hong-kong-economy/article/3298899/buyers-quick-mark-hong-kong-car-plates-s-and-88-go-millions'],
    ['Kwiksure — Top priced car plates in Hong Kong', 'https://www.kwiksure.com/blog/top-priced-car-plate-number-hong-kong/'],
    ['VICE — Lucky phone number sold for $300,000', 'https://www.vice.com/en/article/lucky-phone-number-sold-300000-dollars-china-auction-numerology/'],
    ['NamePros — Chinese investors and numeric domains', 'https://www.namepros.com/blog/domain-data-chinese-investors-and-numeric-domains.873715/']
  ])
},
{
  slug: 'meaning-of-00338',
  title: 'What Does 00338 Mean? Stock Code, Dialling Prefix and a Cantonese Blessing',
  short: 'The meaning of 00338',
  desc: 'The story behind our name: 00338 as a Hong Kong stock code, a dialling pattern, a generation label and a Cantonese phrase — plus the one catch.',
  cat: 'Our story', mins: 6,
  answer: '<b>00338</b> is best known as a Hong Kong Stock Exchange code (a listed petrochemical company we are not affiliated with). Read as digits, 00 is China\'s international dialling prefix and a nickname for the post-2000 generation, while <b>338</b> can be read in Cantonese as 生生发 — "grow, grow, prosper".',
  faq: [
    ['Is 00338 a lucky number?', 'Mixed-to-good. It has no 4 and ends in 8 (prosper). In Cantonese, 338 reads 生生发. The catch: 38 (三八) can be slang for a gossipy woman, so the Mandarin reading is weaker. Our decoder scores it about 65/100 overall, 73 in Cantonese.'],
    ['Is 00338.com related to the listed company with code 00338?', 'No. 00338.com is an independent cultural reference site. Stock codes are exchange identifiers; we use the number, not any company\'s name or brand.'],
    ['What does 0033 mean on a phone?', 'From China (international prefix 00), 0033 dials France, whose country code is 33.']
  ],
  body: `
<p>Every number tells a story if you know how to listen. Here is ours.</p>
<h2>1. A Hong Kong stock code</h2>
<p>Hong Kong-listed securities use five-digit codes, and <span class="mono">00338</span> belongs to a Shanghai-based petrochemical producer that is also listed in Shanghai. Company filings carry the line "Stock code: 00338 Hong Kong". <b>00338.com is not affiliated with, endorsed by or connected to that company</b>; we mention the code only because it is the most-searched meaning of the number. If you need company information, go to the official <a href="https://www.hkexnews.hk/" rel="noopener" target="_blank">HKEXnews</a> disclosure site.</p>
<p>Chinese investors care about stock-code numerology too — codes with 8s and no 4s are considered attractive. Try the <a href="../tools/hk-stock-code-decoder.html">HK stock-code decoder</a> to see how any code reads.</p>
{{AD}}
<h2>2. 00 — a dialling prefix and a generation</h2>
<p>China uses <span class="mono">00</span> as its international dialling prefix, the ITU standard. Dial <span class="mono">0033</span> from China and you are calling France (country code 33). In everyday speech, <b>00后</b> ("post-00s") means people born between 2000 and 2009 — China's Gen Z, a generation that grew up online and uses number slang like 520 and 666 fluently.</p>
<h2>3. 338 — a Cantonese blessing</h2>
<p>In Cantonese, 三 (saam1) is a near-homophone of 生 (saang1), "life, birth, growth", and 八 (baat3) echoes 发 (faat3), "prosper". Read that way, <b>338 → 生生发</b>: "grow, grow, prosper" — a folk reading, but one that Cantonese speakers recognise immediately. One Cantonese-language guide puts it plainly: you can't go wrong putting 3s and 8s together.</p>
<h2>4. The catch: 38</h2>
<p>We believe in honest numerology. Inside 338 sits <b>38</b> (三八). March 8 is International Women's Day (三八妇女节), but 三八 is also a common insult for a gossipy or silly woman — 三八婆 in Hong Kong. In Mandarin, 3 can also sound like 散 "scatter". So a Mandarin-speaking reader may see 00338 as neutral, while a Cantonese reader sees growth and prosperity.</p>
<div class="callout gold"><b>Our verdict:</b> 00338 scores about <b>65/100</b> overall, <b>73/100</b> in Cantonese and <b>50/100</b> in Mandarin on our <a href="../tools/number-decoder.html?n=00338">decoder</a>. No 4, ends in 8, strong Cantonese reading — a good number with one caveat. That's exactly the kind of nuance this site exists to explain.</div>
{{LEAD}}
<h2>5. Other places the string appears</h2>
<ul>
<li>In the US FDA National Drug Code system, labeler code 00338 is assigned to a healthcare company.</li>
<li>Technical advisories and part numbers occasionally use 00338 as an identifier.</li>
</ul>
<p>None of these are affiliated with this site — which is exactly why we built an independent, educational home for the number itself.</p>
` + src([
    ['HKEXnews filing showing stock code 00338', 'https://www1.hkexnews.hk/listedco/listconews/sehk/2025/0919/2025091900532.pdf'],
    ['Wikipedia — Telephone numbers in France (country code 33)', 'https://en.wikipedia.org/wiki/Telephone_numbers_in_France'],
    ['Dragon Trail — Meet China\'s post-00s generation', 'https://www.dragontrail.com/resources/blog/meet-chinas-post-00s-generation'],
    ['Joksingjai — Lucky & unlucky numbers in Cantonese', 'https://www.joksingjai.com/resources/lucky-unlucky-numbers-in-cantonese/'],
    ['The Beijinger — Chinese number slang', 'https://www.thebeijinger.com/blog/2015/06/10/10-chinese-number-slangs-you-have-know']
  ])
},
{
  slug: 'cantonese-vs-mandarin-number-meanings',
  title: 'Cantonese vs Mandarin: Why the Same Number Can Be Lucky or Unlucky',
  short: 'Cantonese vs Mandarin numbers',
  desc: 'Number luck depends on pronunciation. A side-by-side guide to how Cantonese and Mandarin speakers read 2, 3, 5, 28, 58 and more.',
  cat: 'Language', mins: 7,
  answer: 'Chinese number luck comes from sound-alike words, so it depends on dialect. Cantonese makes <b>2</b> "easy" (易) and <b>3</b> "life" (生), turning 28 and 38-free 3s very lucky; Mandarin can read 3 as "scatter" (散). Cantonese <b>5</b> (ng5) sounds like "not" (唔), so <b>58</b> reads "no prosperity".',
  faq: [
    ['Why is 28 lucky in Hong Kong?', 'Cantonese 二八 (ji6 baat3) sounds like 易发 "easy prosperity".'],
    ['Why is 58 unlucky in Cantonese?', '五八 (ng5 baat3) sounds like 唔发 "not prosper".'],
    ['Is 4 unlucky in both?', 'Yes. 四 sounds like 死 "death" in Mandarin (sǐ) and Cantonese (sei2).']
  ],
  body: `
<p>Mandarin (Putonghua) is China's national language; Cantonese dominates Hong Kong, Macau, Guangdong and many overseas Chinese communities. Their pronunciations differ enough that the same number can send opposite messages.</p>
<h2>Side-by-side</h2>
<table><thead><tr><th>Number</th><th>Mandarin reading</th><th>Cantonese reading</th></tr></thead><tbody>
<tr><td class="mono">2</td><td>èr — pairs, "good things come in twos"</td><td>ji6 ≈ 易 "easy"</td></tr>
<tr><td class="mono">3</td><td>sān — 生 "life" or 散 "scatter"</td><td>saam1 ≈ 生 "life, growth" (lucky)</td></tr>
<tr><td class="mono">5</td><td>wǔ — 我 "me" (520 = I love you)</td><td>ng5 ≈ 唔 "not"</td></tr>
<tr><td class="mono">9</td><td>jiǔ ≈ 久 "long-lasting"</td><td>gau2 ≈ 久 "long-lasting"; also slang in some contexts</td></tr>
<tr><td class="mono">24</td><td>èr-sì — neutral-to-bad (4)</td><td>ji6 sei2 ≈ 易死 "easy death"</td></tr>
<tr><td class="mono">28</td><td>èr-bā — fine</td><td>ji6 baat3 ≈ 易发 "easy prosperity"</td></tr>
<tr><td class="mono">58</td><td>wǔ-bā — fine</td><td>ng5 baat3 ≈ 唔发 "no prosperity"</td></tr>
<tr><td class="mono">338</td><td>sān-sān-bā — mixed (三八 slang)</td><td>生生发 "grow, grow, prosper"</td></tr>
</tbody></table>
{{AD}}
<h2>Which reading should you use?</h2>
<p>Use the dialect of your <em>audience</em>, not your own. A Hong Kong buyer will price a "28" plate very differently from a Beijing buyer. Our <a href="../tools/number-decoder.html">decoder</a> lets you switch between Mandarin, Cantonese and a blended score.</p>
<h2>Other dialects</h2>
<p>Shanghainese, Hokkien/Taiwanese and Hakka have their own twists — for example 十三点 ("thirteen o'clock") is Shanghainese for "silly". If you are naming a business for a specific region, <a href="../get-a-lucky-number.html?intent=consult">ask us for a regional check</a>.</p>
{{LEAD}}
` + src([
    ['Joksingjai — Lucky & unlucky numbers in Cantonese', 'https://www.joksingjai.com/resources/lucky-unlucky-numbers-in-cantonese/'],
    ['Wikipedia — Chinese numerology', 'https://en.wikipedia.org/wiki/Chinese_numerology'],
    ['Kwiksure — Top priced car plates in Hong Kong', 'https://www.kwiksure.com/blog/top-priced-car-plate-number-hong-kong/']
  ])
},
{
  slug: 'hong-kong-license-plate-auctions',
  title: 'Hong Kong Licence Plate Auctions: Record Prices & How Lucky Numbers Are Valued',
  short: 'HK plate auction records',
  desc: 'Record prices for Hong Kong vehicle registration marks, how the auctions work and what makes a plate valuable.',
  cat: 'Data', mins: 8, sponsor: true,
  answer: 'Hong Kong\'s record plate is <b>"W"</b> at <b>HK$26 million</b> (2021). Numeric records include <b>"28"</b> (HK$18.1M, 2016), <b>"18"</b> (HK$16.5M, 2008) and <b>"88"</b> (HK$11.4M, 2025). Plates are sold by the Transport Department at public paddle auctions, with Lunar New Year sessions drawing the biggest bids.',
  faq: [
    ['How much is the most expensive licence plate in Hong Kong?', '"W", sold for HK$26 million in 2021, according to published auction records.'],
    ['How do Hong Kong plate auctions work?', 'The Transport Department holds paddle-bid auctions for traditional and personalised marks; results are published after each session and plates must be assigned to a vehicle within 12 months.'],
    ['Why are 18 and 28 so valuable?', 'In Cantonese, 18 reads 实发 "sure prosperity" and 28 reads 易发 "easy prosperity".']
  ],
  body: `
<p>Nowhere is number luck priced more transparently than Hong Kong's vehicle registration mark auctions. Proceeds go to the government's Lotteries Fund for charity, and results are published after every session.</p>
<h2>Record prices</h2>
{{PLATES}}
<p class="small muted">Sources: Kwiksure, SCMP. Lists compiled by different outlets don't always agree on ranking; figures are hammer prices as reported.</p>
{{AD}}
<h2>How the auctions work</h2>
<ul>
<li>The Transport Department runs <b>paddle-bid public auctions</b> for traditional marks (e.g. "AB 1234") and personalised marks (up to 8 characters).</li>
<li>A typical session offers around 100 personalised and 220 traditional marks; personalised marks carry a HK$5,000 reserve price.</li>
<li>Winners must assign the mark to a vehicle within 12 months.</li>
<li>Special Lunar New Year auctions feature the most auspicious marks.</li>
</ul>
<h2>What makes a plate valuable?</h2>
<ol>
<li><b>Brevity:</b> single characters (W, H, S) and one-to-two digit numbers are the rarest.</li>
<li><b>8s and pairs:</b> 8, 88, 18, 28, 168, 2288.</li>
<li><b>No 4s:</b> a 4 can cut value dramatically.</li>
<li><b>Cantonese reading:</b> because Hong Kong is Cantonese-speaking, 2 and 3 are strong positives.</li>
</ol>
<p>Test any plate with our <a href="../tools/lucky-license-plate-checker.html">licence plate checker</a>.</p>
{{LEAD}}
` + src([
    ['HK Transport Department — Personalised VRM auctions', 'https://www.td.gov.hk/en/public_services/vehicle_registration_mark/pvrm_auction/index.html'],
    ['HK Government press release — auction notice', 'https://www.info.gov.hk/gia/general/202510/06/P2025100600277.htm'],
    ['SCMP — "H" plate fetches HK$20 million (2026)', 'https://www.scmp.com/news/hong-kong/society/article/3345036/h-races-riches-car-plate-fetches-hk20-million-hong-kong-auction'],
    ['SCMP — "S" and "88" go for millions (2025)', 'https://www.scmp.com/news/hong-kong/hong-kong-economy/article/3298899/buyers-quick-mark-hong-kong-car-plates-s-and-88-go-millions'],
    ['Kwiksure — Top priced car plates', 'https://www.kwiksure.com/blog/top-priced-car-plate-number-hong-kong/']
  ])
},
{
  slug: 'numeric-domains-chinese-buyers',
  title: 'Numeric Domains & Chinese Buyers: Why Digits Sell for Millions',
  short: 'Numeric domains & Chinese buyers',
  desc: 'Why Chinese investors dominate numeric .com domains, which digit patterns sell, notable sales, and how to value a numeric name.',
  cat: 'Data', mins: 9, sponsor: true,
  answer: 'Numbers are easier than Latin letters for Chinese users to remember and type, and they carry luck. In 2015, Chinese owners held about <b>59 of 100 two-digit .coms</b> and roughly <b>48% of all 1,000 three-digit .coms</b>. Names with 8s, 6s and 9s sell best; names containing <b>4</b> are hard to sell.',
  faq: [
    ['Why do Chinese buyers like numeric domains?', 'Digits are universal, easy to remember across dialects and carry lucky meanings (8 prosper, 6 smooth, 9 lasting).'],
    ['Which numeric domains sell best?', 'Short (2–4 digits), no 4, with 8/6/9/2 or meaningful combos such as 168, 518 and 520.'],
    ['How many 5-digit .com domains exist?', '100,000 (00000–99999), which makes 5-digit names like 00338.com far more available than 3- or 4-digit names.']
  ],
  body: `
<p>If you have ever wondered why a string of digits like <span class="mono">114.com</span> could sell for over two million dollars, the answer is culture plus scarcity.</p>
<h2>The market in numbers</h2>
<ul>
<li>There are only 100 two-digit .com domains, 1,000 three-digit and 10,000 four-digit ones.</li>
<li>In 2015, NamePros/DomainTools data showed <b>59 of 100 NN.coms</b> and about <b>480 of 1,000 NNN.coms</b> had Chinese registrants, compared with about 15.5% of two-letter .coms.</li>
<li>Prices started climbing sharply around early 2014, driven by Chinese end-users and investors.</li>
</ul>
<h2>Notable sales</h2>
{{DOMAINS}}
{{AD}}
<h2>What sells in 2026</h2>
<p>According to a 2026 NamePros guide for Western investors, 8s and 6s are "universally desirable", 2s and 9s are highly liquid, and domains containing 4 are hard to sell. Patterns like AABB, ABAB and repeating 8s command premiums.</p>
<h2>How to value a numeric domain</h2>
<ol>
<li><b>Length:</b> each extra digit is a step down in scarcity.</li>
<li><b>Digits:</b> run it through our <a href="../tools/numeric-domain-checker.html">numeric domain checker</a>.</li>
<li><b>Pattern:</b> repeats, sequences and meaningful combos (168, 520) add value.</li>
<li><b>Extension:</b> .com dominates; .cn and .net follow.</li>
<li><b>Comparable sales:</b> check recent public sales reports before pricing.</li>
</ol>
{{LEAD}}
` + src([
    ['NamePros — Domain data: Chinese investors and numeric domains', 'https://www.namepros.com/blog/domain-data-chinese-investors-and-numeric-domains.873715/'],
    ['NamePros — The Chinese domain market (2026 edition)', 'https://www.namepros.com/threads/the-chinese-domain-market-a-complete-guide-for-western-investors-2026-edition.1384515/'],
    ['Media Options — Numeric domain value in Chinese culture', 'https://mediaoptions.com/blog/understanding-numeric-domain-value-in-chinese-culture/'],
    ['Domain Name Wire — Making a fortune with 88.com', 'https://domainnamewire.com/2020/07/28/making-a-fortune-with-88-com/']
  ])
},
{
  slug: 'lucky-phone-numbers-china',
  title: 'Lucky Phone Numbers in China: 靓号 Culture, Auctions and How to Choose One',
  short: 'Lucky phone numbers (靓号)',
  desc: 'Why "beautiful numbers" (靓号) sell for fortunes, record prices, and a practical checklist for choosing a lucky mobile or business number.',
  cat: 'Guide', mins: 7,
  answer: 'A 靓号 (liànghào, "beautiful number") is a phone number with lucky digits or memorable patterns. A Chengdu number, +86 28 8888 8888, sold for CN¥2.33 million in 2003, and a Beijing number ending 88888 fetched CN¥2.25 million at a 2020 court auction. The last four digits carry most of the value.',
  faq: [
    ['What is a 靓号?', 'A "beautiful number" — a phone number with auspicious digits (8, 6, 9) or patterns (AAAA, ABAB, 168, 518).'],
    ['Which phone endings are luckiest?', '8888, 6666, 9999, 168, 518, 1688 and AABB patterns like 6688.'],
    ['Should I avoid 4 in my business number?', 'For Chinese-speaking customers, yes — especially at the end.']
  ],
  body: `
<p>In China, carriers and resellers grade numbers by pattern, and premium numbers are sold, auctioned and even seized as assets in court cases.</p>
<h2>Record prices</h2>
{{PHONES}}
{{AD}}
<h2>Checklist for choosing a number</h2>
<ol>
<li><b>Focus on the last 4 digits.</b> That is what people remember and read.</li>
<li><b>Avoid 4, 14, 24, 74 and 250.</b></li>
<li><b>Prefer 8, 6, 9</b> and patterns: AAAA, AABB, ABAB, ABCD rising.</li>
<li><b>Match your audience's dialect.</b> Cantonese customers love 28; Mandarin ones love 168 and 518.</li>
<li><b>Match your brand.</b> A florist may want 520; a finance firm 888 or 1688.</li>
</ol>
<p>Score any number instantly with the <a href="../tools/lucky-phone-number-checker.html">lucky phone number checker</a>, or generate candidates with the <a href="../tools/lucky-number-generator.html">lucky number generator</a>.</p>
{{LEAD}}
` + src([
    ['Wikipedia — Chinese numerology', 'https://en.wikipedia.org/wiki/Chinese_numerology'],
    ['VICE — Lucky phone number sold for $300,000', 'https://www.vice.com/en/article/lucky-phone-number-sold-300000-dollars-china-auction-numerology/'],
    ['Guinness World Records — world\'s most expensive phone number', 'https://www.guinnessworldrecords.com/news/2026/2/the-bizarre-story-of-the-worlds-most-expensive-phone-number']
  ])
},
{
  slug: 'chinese-number-slang-520-1314',
  title: 'Chinese Number Slang: 520, 1314, 666, 88 and the Codes Everyone Uses Online',
  short: 'Number slang: 520, 1314, 666',
  desc: 'A glossary of Chinese internet number codes — love codes, compliments and insults — with meanings and when to use them.',
  cat: 'Glossary', mins: 6,
  answer: '<b>520</b> = I love you, <b>521</b> = I do / I\'m willing, <b>1314</b> = forever, <b>5201314</b> = I love you forever, <b>666</b> = awesome, <b>88</b> = bye-bye, <b>250</b> = idiot, <b>748</b> = go die. They work because the digits sound like the words.',
  faq: [
    ['What is 520 day?', '20 May, a romantic holiday for couples in China. Marriage registries see booking surges — Nanjing had over 1,400 couples booked in 2025.'],
    ['What does 666 mean in Chinese?', '"Awesome" or "slick" — praise for a skilful move, especially in gaming and livestreams.'],
    ['What does 88 mean in chat?', '"Bye-bye" (bā bā sounds like "bye-bye").']
  ],
  body: `
<p>Chinese internet users type numbers the way English speakers use "LOL" or "BRB". Here's the essential glossary.</p>
<h2>Love codes</h2>
<table><thead><tr><th>Code</th><th>Reads as</th><th>Meaning</th></tr></thead><tbody>
<tr><td class="mono">520</td><td>我爱你</td><td>I love you</td></tr>
<tr><td class="mono">521</td><td>我愿意</td><td>I do / I'm willing</td></tr>
<tr><td class="mono">1314</td><td>一生一世</td><td>For a lifetime</td></tr>
<tr><td class="mono">5201314</td><td>我爱你一生一世</td><td>I love you forever</td></tr>
<tr><td class="mono">3344</td><td>生生世世</td><td>Life after life</td></tr>
<tr><td class="mono">9420</td><td>就是爱你</td><td>It's you I love</td></tr>
</tbody></table>
{{AD}}
<h2>Everyday codes</h2>
<table><thead><tr><th>Code</th><th>Meaning</th></tr></thead><tbody>
<tr><td class="mono">666</td><td>Awesome, slick</td></tr>
<tr><td class="mono">88</td><td>Bye-bye</td></tr>
<tr><td class="mono">233</td><td>LOL (from a laughing emoticon code)</td></tr>
<tr><td class="mono">886</td><td>Bye-bye, I'm off</td></tr>
<tr><td class="mono">555</td><td>Boo-hoo (crying)</td></tr>
</tbody></table>
<h2>Codes to avoid</h2>
<ul><li><b>250</b> — idiot</li><li><b>748</b> — go die</li><li><b>38</b> — Women's Day, but also slang for a gossipy woman</li><li><b>14 / 74</b> — death, fury</li></ul>
<p>Decode any code with our <a href="../tools/number-decoder.html">Number Decoder</a>.</p>
{{LEAD}}
` + src([
    ['The Beijinger — 10 Chinese number slangs you have to know', 'https://www.thebeijinger.com/blog/2015/06/10/10-chinese-number-slangs-you-have-know'],
    ['Global Times — 520 wedding registrations (2026)', 'https://www.globaltimes.cn/page/202605/1360605.shtml'],
    ['Wikipedia — Chinese numerology', 'https://en.wikipedia.org/wiki/Chinese_numerology']
  ])
},
{
  slug: 'why-4-is-unlucky',
  title: 'Why 4 Is Unlucky in Chinese Culture (and Where You\'ll Notice It)',
  short: 'Why 4 is unlucky',
  desc: 'Tetraphobia explained: why 四 sounds like death, missing floors in buildings, hospital rooms, prices and how to handle a number with 4.',
  cat: 'Guide', mins: 5,
  answer: '<b>四 (sì)</b> sounds almost the same as <b>死 (sǐ)</b>, "death", in Mandarin and Cantonese. That is why many buildings in Greater China skip the 4th, 14th and 24th floors, hospitals avoid room 4, and numbers containing 4 sell for less.',
  faq: [
    ['Do all Chinese people avoid 4?', 'Not all, but avoidance is widespread in property, phone numbers, plates, prices and gifts.'],
    ['Is 4 ever lucky?', 'Occasionally, in phrases where the sound changes meaning — e.g. 3344 生生世世 "life after life" — and some almanacs list 4 as personally lucky for certain zodiac signs.'],
    ['What about 14 and 24?', '14 reads "will die" and 24 in Cantonese reads "easy death" — both avoided.']
  ],
  body: `
<p>Fear of the number four — tetraphobia — is one of the most visible number beliefs in East Asia.</p>
<h2>Where you'll see it</h2>
<ul>
<li><b>Buildings:</b> many residential towers skip floors 4, 14, 24 and sometimes 40–49. One Hong Kong tower is famous for skipping over 40 floor numbers.</li>
<li><b>Hospitals & hotels:</b> rooms ending in 4 are often skipped.</li>
<li><b>Prices:</b> retailers avoid prices like 44 or 144.</li>
<li><b>Phone numbers & plates:</b> sellers discount numbers with 4.</li>
<li><b>Gifts:</b> never give four of anything — especially clocks, knives or pears.</li>
</ul>
{{AD}}
<h2>If your number contains 4</h2>
<p>Don't panic. Context matters: a 4 in the middle is weaker than a 4 at the end, and combos can flip the meaning. Run it through the <a href="../tools/number-decoder.html">decoder</a> — then decide whether it's worth changing. Need a replacement? <a href="../get-a-lucky-number.html?intent=phone">We can help you source one</a>.</p>
{{LEAD}}
` + src([
    ['Wikipedia — Chinese numerology', 'https://en.wikipedia.org/wiki/Chinese_numerology'],
    ['NamePros — Chinese domain market guide (2026)', 'https://www.namepros.com/threads/the-chinese-domain-market-a-complete-guide-for-western-investors-2026-edition.1384515/']
  ])
},
{
  slug: 'red-packet-amounts',
  title: 'Lucky Red Packet (Hongbao) Amounts: How Much to Give and Numbers to Avoid',
  short: 'Red packet amounts',
  desc: 'Etiquette for 红包 red envelopes: lucky amounts for weddings, Lunar New Year and business, plus the numbers you should never give.',
  cat: 'Etiquette', mins: 5,
  answer: 'Give <b>even amounts</b> with lucky digits — <b>88, 168, 288, 666, 888</b> — and avoid anything with <b>4</b> or the amount <b>250</b>. Odd amounts are traditionally associated with funerals. Use new, crisp notes.',
  faq: [
    ['How much should I give at a Chinese wedding?', 'Typically enough to cover your meal at the banquet, rounded to a lucky even amount like 688, 888 or 1,688 in local currency. Local norms vary.'],
    ['Is 520 a good red-packet amount?', 'Yes, between partners — it means "I love you". Many digital red packets are capped at 200, so people send 5.20 or 52.0 online.'],
    ['What amounts are for funerals?', 'Odd amounts are traditionally used in white envelopes (帛金) for funerals.']
  ],
  body: `
<p>Red packets (红包 hóngbāo / 利是 lai6 si6 in Cantonese) are given at Lunar New Year, weddings, birthdays and business openings. The amount itself is a message.</p>
<h2>Quick reference</h2>
<table><thead><tr><th>Occasion</th><th>Good amounts</th><th>Why</th></tr></thead><tbody>
<tr><td>Lunar New Year (kids)</td><td>20, 50, 88, 100</td><td>Even, round, 88 = double prosperity</td></tr>
<tr><td>Wedding</td><td>388*, 688, 888, 1688</td><td>Prosperity, smoothness</td></tr>
<tr><td>Partner</td><td>520, 1314</td><td>I love you / forever</td></tr>
<tr><td>Business opening</td><td>168, 888, 1688</td><td>Prosperity all the way</td></tr>
<tr><td>Staff bonus</td><td>66, 88, 168</td><td>Smooth progress</td></tr>
</tbody></table>
<p class="small muted">* 388 reads "生发发" in Cantonese; in Mandarin contexts some prefer 688 because of the 38 slang.</p>
{{AD}}
<h2>Never give</h2>
<ul><li>Anything with <b>4</b> (40, 400, 444)</li><li><b>250</b> — "idiot"</li><li>Odd amounts at happy occasions</li><li>Coins or old, torn notes</li></ul>
<p>Check any amount with our <a href="../tools/number-decoder.html">decoder</a>.</p>
{{LEAD}}
` + src([
    ['Wikipedia — Red envelope', 'https://en.wikipedia.org/wiki/Red_envelope'],
    ['Wikipedia — Chinese numerology', 'https://en.wikipedia.org/wiki/Chinese_numerology']
  ])
},
{
  slug: 'hong-kong-stock-codes-lucky-numbers',
  title: 'Lucky Stock Codes: How Number Symbolism Shows Up in Hong Kong Tickers',
  short: 'Lucky HK stock codes',
  desc: 'How Hong Kong\'s five-digit stock codes work, why companies and investors notice lucky digits, and how to read a code — for culture, not trading.',
  cat: 'Markets & culture', mins: 6,
  answer: 'Hong Kong securities use <b>five-digit codes</b> (e.g. 00338, 00005). Codes are assigned by the exchange, but investors and issuers in Chinese markets notice lucky digits (8, 6, 9) and avoid 4 when they can choose. Symbolism is cultural colour — it is never a reason to buy or sell.',
  faq: [
    ['How are Hong Kong stock codes formatted?', 'Five digits, often written with leading zeros (00338) or shortened (0338.HK / 338.HK) on data sites.'],
    ['Do lucky stock codes outperform?', 'There is no reliable evidence that they do. Treat code symbolism as culture, not a signal.'],
    ['Where can I look up a Hong Kong code?', 'The exchange\'s official disclosure site, HKEXnews.']
  ],
  body: `
<p>Five-digit codes are Hong Kong's ticker system. Leading zeros are dropped on many data sites, so <span class="mono">00338</span>, <span class="mono">0338.HK</span> and <span class="mono">338.HK</span> all point to the same listing.</p>
<h2>Why codes get noticed</h2>
<ul>
<li>Codes are easy to remember and read as numbers, so investors notice 8s and 4s just like on plates or phones.</li>
<li>Low codes (single and double digits) belong to many of the oldest listings — a mark of heritage.</li>
<li>Where issuers have a choice, auspicious digits are sometimes preferred.</li>
</ul>
{{AD}}
<h2>Decode a code</h2>
<p>Use our <a href="../tools/hk-stock-code-decoder.html">HK stock code decoder</a> to see how any code reads in Chinese number symbolism. It shows the digits' meanings only — it doesn't provide company data, prices or advice.</p>
<div class="callout"><b>Not investment advice.</b> 00338.com is a cultural education site. We are not affiliated with any listed company or exchange, and code symbolism tells you nothing about a company's prospects.</div>
{{LEAD}}
` + src([
    ['HKEXnews — official disclosure site', 'https://www.hkexnews.hk/'],
    ['StockAnalysis — HKG 0338 quote page (example of code formats)', 'https://stockanalysis.com/quote/hkg/0338/']
  ])
}
];
