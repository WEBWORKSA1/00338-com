const fs=require('fs'),path=require('path');
const J=path.join(__dirname,'..','jekyll'),OUT=process.argv[2]||path.join(__dirname,'..','jekyll-compact'); // run after to-jekyll.js; copy the output over jekyll/ (compacts zodiac pages + numbers index into layouts)
const rd=f=>fs.readFileSync(path.join(J,f),'utf8');
const put=(f,s)=>{const p=path.join(OUT,f);fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,s)};
// ---- zodiac
const signs=['rat','ox','tiger','rabbit','dragon','snake','horse','goat','monkey','rooster','dog','pig'];
const aside=rd('zodiac/rat.html').match(/<aside class="aside">[\s\S]*?<\/aside>/)[0];
const grid=[];
for(const s of signs){const h=rd(`zodiac/${s}.html`);
 const g=(re)=>{const m=h.match(re);if(!m)throw new Error(s+' '+re);return m[1]};
 const d={layout:'zodiac',title:g(/title: "(.*)"/),description:g(/description: "(.*)"/),canon:`zodiac/${s}.html`,base:'../',permalink:`/zodiac/${s}.html`,
  k:s,nm:g(/<span>([A-Za-z]+)<\/span><\/nav>/),gl:g(/var\(--red\)">(.)<\/div>/),py:g(/<div class="muted">. (\S+) · Chinese/),i:+g(/zodiac sign (\d+) of 12/),
  ln:g(/Lucky numbers:<\/b> <span class="mono">(.*?)<\/span>/),col:g(/Lucky colours:<\/b> (.*?) ·/),best:g(/Best matches:<\/b> (.*?) ·/),clash:g(/Clash:<\/b> (.*?)<\/div>/),
  q1a:g(/"What are the lucky numbers for the \w+\?","acceptedAnswer":\{"@type":"Answer","text":"(.*?)"\}/),
  q3a:g(/"What years are the Year of the \w+\?","acceptedAnswer":\{"@type":"Answer","text":"(.*?)"\}/),
  prose:g(/<div class="prose">([\s\S]*?)\n<div class="ad-slot/),
  yrs:[...g(/<tbody>(.*?)<\/tbody><\/table><\/div>/).matchAll(/<tr><td class="mono">(\d+)<\/td><td>(.*?)<\/td><td class="mono">(.*?)<\/td><\/tr>/g)].map(m=>[m[1],m[2],m[3]])};
 grid.push([s,d.gl,d.nm]);
 put(`zodiac/${s}.html`,'---\n'+JSON.stringify(d)+'\n---\n');}
put('_data/signs.json',JSON.stringify(grid));
// layout: reconstruct from rat file with placeholders
let L=rd('zodiac/rat.html').replace(/^---[\s\S]*?---\n/,'');
const r=JSON.parse(fs.readFileSync(path.join(OUT,'zodiac/rat.html'),'utf8').split('\n')[1]);
L=L.replace(aside,'{% include aside-z.html %}');
L=L.replace(/<h2 style="margin-top:1.4em">Other signs<\/h2><div class="zodiac-grid">.*?<\/div>/,'<h2 style="margin-top:1.4em">Other signs</h2><div class="zodiac-grid">{% for z in site.data.signs %}{% if z[0] != page.k %}<a href="{{ z[0] }}.html"><span class="glyph">{{ z[1] }}</span><span>{{ z[2] }}</span></a>{% endif %}{% endfor %}</div>');
L=L.replace(/<tbody>.*?<\/tbody>/,'<tbody>{% for y in page.yrs %}<tr><td class="mono">{{ y[0] }}</td><td>{{ y[1] }}</td><td class="mono">{{ y[2] }}</td></tr>{% endfor %}</tbody>');
L=L.replace(r.prose,'{{ page.prose }}');
L=L.split(r.q1a).join('{{ page.q1a }}').split(r.q3a).join('{{ page.q3a }}');
L=L.split('Dragon, Monkey, Ox').join('{{ page.best }}').split('clash sign is the Horse').join('clash sign is the {{ page.clash }}').split('<b>Clash:</b> Horse').join('<b>Clash:</b> {{ page.clash }}');
L=L.split('Blue, Gold, Green').join('{{ page.col }}').split('<span class="mono">2, 3</span>').join('<span class="mono">{{ page.ln }}</span>');
L=L.split('zodiac/rat.html').join('zodiac/{{ page.k }}.html').split('鼠 shǔ').join('{{ page.gl }} {{ page.py }}').split('sign 1 of 12').join('sign {{ page.i }} of 12').split('>鼠<').join('>{{ page.gl }}<');
L=L.split('<h2>Rat ').join('<h2>{{ page.nm }} ').split(' Rat').join(' {{ page.nm }}').split('>Rat<').join('>{{ page.nm }}<').split('"Rat"').join('"{{ page.nm }}"');
put('_layouts/zodiac.html','---\nlayout: default\n---\n'+L);
put('_includes/aside-z.html',aside);
// ---- numbers index
let N=rd('numbers/index.html');
const fmN=N.match(/^---[\s\S]*?---\n/)[0];let body=N.slice(fmN.length);
const groups=[];body=body.replace(/<div class="related">(.*?)<\/div>/g,(m,inner)=>{const items=[...inner.matchAll(/<a href="([^"]+)\.html" title="(\d+)\/100 — [^"]*"[^>]*>/g)].map(x=>x[1]+':'+x[2]);groups.push(items.join(' '));return `<div class="related">{% assign L = page.g${groups.length} | split: " " %}{% include nlist.html %}</div>`});
put('numbers/index.html',fmN.replace('---\n',`---\n`).replace(/\n---\n$/,'\n'+groups.map((g,i)=>`g${i+1}: "${g}"`).join('\n')+'\n---\n')+body);
put('_includes/nlist.html','{% for it in L %}{% assign p = it | split: ":" %}{% assign s = p[1] | plus: 0 %}{% if s >= 85 %}{% assign t = "Very lucky 大吉" %}{% elsif s >= 68 %}{% assign t = "Lucky 吉" %}{% elsif s >= 48 %}{% assign t = "Neutral / mixed 平" %}{% elsif s >= 30 %}{% assign t = "Unlucky 凶" %}{% else %}{% assign t = "Very unlucky 大凶" %}{% endif %}<a href="{{ p[0] }}.html" title="{{ s }}/100 — {{ t }}" style="border-color:{% if s >= 68 %}color-mix(in srgb,var(--jade) 45%,var(--line)){% elsif s < 48 %}color-mix(in srgb,var(--bad) 45%,var(--line)){% else %}var(--line){% endif %}">{{ p[0] }}</a>{% endfor %}');
