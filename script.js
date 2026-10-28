/* ===== DATA ===== */
const AMOUNTS=[380927,899000,363468,807189,493427,858312,621751,655212,134045,861216,127925,768748,52111,539413,239655,265170,619112,714444,831436,553078,460664,551540,588561,516113,106022,591908,851595,308629,321090,121659,736570,400277,491958,993311,380824,134467,731552,682570,160244,566758,158586,647424,332598,786896,243092,486220,2938,17472,356994,737021,400753,662921,772317,713941,716163,566150,796206,110683,702079,516675,692670,618270,987323,121487,435382,160214,486196,728095,720478,212668,523757,655528,210485,101801,603829,778049,779798,783776,197621,310376,373813,165195,254898,240472,95505,465486,785149,99791,901219,837747,140543,365451,198279,801343,351250,882855,334500,511109,640288,290759];
const FRAUD=new Set([4,7,8,17,19,27,31,37,42,44,50,52,54,55,57,61,62,63,68,72,75,76,78,87,90,96,99]);

/* ===== STATISTICS ===== */
const n=AMOUNTS.length;
const mean=AMOUNTS.reduce((a,b)=>a+b,0)/n;
const sd=Math.sqrt(AMOUNTS.reduce((s,a)=>s+(a-mean)**2,0)/n);
const T1=mean, T2=mean+0.5*sd;               // risk thresholds
const RISKS=['low','med','high'];
const D=AMOUNTS.map((a,i)=>{
  const z=(a-mean)/sd;
  return{id:'T'+String(i+1).padStart(3,'0'),a,z,f:FRAUD.has(i+1)?1:0,r:z<0?'low':z<0.5?'med':'high'};
});
const byRisk=Object.fromEntries(RISKS.map(r=>[r,D.filter(d=>d.r===r)]));
const totalFraud=D.filter(d=>d.f).length;
const capture=byRisk.high.filter(d=>d.f).length/totalFraud*100;

/* ===== I18N ===== */
const T={
en:{tag:'STATISTICAL RISK ENGINE',h1a:'Online Payment',h1b:'Fraud Detection',
lead:'Every transaction is scored with a z-score and placed in a risk level. Then we check the levels against the known fraud labels.',
cta:'SEE THE METHOD ↓',k1:'Transactions',k2:'Fraud rate %',k3:'Mean amount',k4:'Fraud caught in High %',
mTitle:'Method',s1t:'Load',s1:'100 transactions are loaded: ID, amount and a fraud label (0/1).',
s2t:'Describe',s2:'We compute the average amount (μ) and the standard deviation (σ).',
s3t:'Score',s3:'Each amount gets a z-score: z = (x − μ) / σ.',
s4t:'Classify',s4:'z < 0 → Low · 0 ≤ z < 0.5 → Medium · z ≥ 0.5 → High.',
s5t:'Validate',s5:'We check how many of the known frauds fall into each risk level.',
c1Title:'Amount distribution',c2Title:'Risk map',c3Title:'Risk split',c4Title:'Fraud rate per level',
gTitle:'High-risk watchlist',gSub:'Click a tile to see its details. Red marker = confirmed fraud.',
oTitle:'Conclusion',legit:'Legitimate',fraud:'Fraud',low:'Low Risk',med:'Medium Risk',high:'High Risk',
foot:'Statistical fraud detection · z-score model',tx:'transactions',amount:'Amount',
status:'Status',level:'Level',range:'Range',count:'Count',rate:'Fraud rate',
outro:(c,h)=>`The High Risk level contains <b>${c}%</b> of all confirmed frauds, while no fraud appears in Low Risk. Large amounts are the main warning sign: ${h} transactions should be sent to manual review first.`,
info:{hist:['Amount distribution','Transactions are grouped into bands of 100,000. <b>Blue</b> = legitimate, <b>red</b> = fraud. Fraud only appears in the upper bands. <br><br>Click a bar for details.'],
scatter:['Risk map','Each mark is one transaction. The height shows the amount. <b>Circles</b> are legitimate and <b>squares</b> are fraud. The dashed lines are the thresholds μ and μ + 0.5σ, which separate the three risk zones.'],
donut:['Risk split','How many transactions fall into each level. Click a segment to see its range and fraud count.'],
rate:['Fraud rate per level','The share of transactions in each level that are really fraudulent. A good model gives a fraud rate that rises with the risk level.']},
binInfo:'This band contains',zLbl:'z-score'},
fr:{tag:'MOTEUR DE RISQUE STATISTIQUE',h1a:'Détection de fraude',h1b:'aux paiements en ligne',
lead:'Chaque transaction reçoit un z-score et un niveau de risque. On compare ensuite ces niveaux aux fraudes connues.',
cta:'VOIR LA MÉTHODE ↓',k1:'Transactions',k2:'Taux de fraude %',k3:'Montant moyen',k4:'Fraudes en risque élevé %',
mTitle:'Méthode',s1t:'Charger',s1:'100 transactions sont chargées : ID, montant et étiquette de fraude (0/1).',
s2t:'Décrire',s2:'On calcule le montant moyen (μ) et l’écart-type (σ).',
s3t:'Scorer',s3:'Chaque montant reçoit un z-score : z = (x − μ) / σ.',
s4t:'Classer',s4:'z < 0 → Faible · 0 ≤ z < 0,5 → Moyen · z ≥ 0,5 → Élevé.',
s5t:'Valider',s5:'On regarde combien de fraudes connues tombent dans chaque niveau de risque.',
c1Title:'Distribution des montants',c2Title:'Carte des risques',c3Title:'Répartition des risques',c4Title:'Taux de fraude par niveau',
gTitle:'Liste de surveillance',gSub:'Cliquez sur une tuile pour voir le détail. Marqueur rouge = fraude confirmée.',
oTitle:'Conclusion',legit:'Légitime',fraud:'Fraude',low:'Risque faible',med:'Risque moyen',high:'Risque élevé',
foot:'Détection statistique de fraude · modèle z-score',tx:'transactions',amount:'Montant',
status:'Statut',level:'Niveau',range:'Plage',count:'Nombre',rate:'Taux de fraude',
outro:(c,h)=>`Le niveau Élevé contient <b>${c} %</b> des fraudes confirmées, et aucune fraude n’apparaît en risque faible. Les gros montants sont le principal signal d’alerte : ${h} transactions sont à vérifier manuellement en priorité.`,
info:{hist:['Distribution des montants','Les transactions sont regroupées par tranches de 100 000. <b>Bleu</b> = légitime, <b>rouge</b> = fraude. Les fraudes n’apparaissent que dans les tranches hautes.<br><br>Cliquez sur une barre pour le détail.'],
scatter:['Carte des risques','Chaque marque est une transaction. La hauteur indique le montant. Les <b>cercles</b> sont légitimes et les <b>carrés</b> sont des fraudes. Les lignes pointillées sont les seuils μ et μ + 0,5σ, qui séparent les trois zones de risque.'],
donut:['Répartition des risques','Le nombre de transactions dans chaque niveau. Cliquez sur un segment pour voir sa plage et ses fraudes.'],
rate:['Taux de fraude par niveau','La part des transactions de chaque niveau qui sont réellement frauduleuses. Un bon modèle donne un taux qui augmente avec le niveau de risque.']},
binInfo:'Cette tranche contient',zLbl:'z-score'}
};
let lang='en';
const t=k=>T[lang][k];
const fmt=v=>Math.round(v).toLocaleString(lang==='fr'?'fr-FR':'en-US');
function applyLang(){
  document.documentElement.lang=lang;
  document.querySelectorAll('[data-i18n]').forEach(el=>el.textContent=t(el.dataset.i18n));
  document.querySelectorAll('.lang span').forEach(s=>s.classList.toggle('on',s.dataset.l===lang));
  document.getElementById('outroText').innerHTML=t('outro')(capture.toFixed(0),byRisk.high.length);
  buildGrid(); charts.forEach(c=>c.draw());
  document.querySelectorAll('[data-count]').forEach(el=>{if(el.dataset.done)el.textContent=kpiVal(el.dataset.count,1)});
}

/* ===== HELPERS ===== */
const css=v=>getComputedStyle(document.documentElement).getPropertyValue(v).trim();
const ease=x=>1-Math.pow(1-x,3);
const riskColor=r=>({low:css('--blue'),med:css('--yellow'),high:css('--red')})[r];
const tip=document.getElementById('tip');
function showTip(html,x,y){tip.innerHTML=html;tip.style.left=(x+16)+'px';tip.style.top=(y+16)+'px';tip.classList.add('on')}
const hideTip=()=>tip.classList.remove('on');
const modal=document.getElementById('modal');
function openModal(title,body){document.getElementById('mTitle').textContent=title;document.getElementById('mBody').innerHTML=body;modal.classList.add('on')}
modal.addEventListener('click',e=>{if(e.target===modal||e.target.classList.contains('m-close'))modal.classList.remove('on')});
document.addEventListener('keydown',e=>e.key==='Escape'&&modal.classList.remove('on'));
const txBody=d=>`<b>${t('amount')}:</b> ${fmt(d.a)}<br><b>${t('zLbl')}:</b> ${d.z.toFixed(2)}<br><b>${t('level')}:</b> ${t(d.r)}<br><b>${t('status')}:</b> ${d.f?'⚠ '+t('fraud'):t('legit')}`;

/* ===== CHART ENGINE ===== */
const charts=[];
function Chart(id,render,hit,click){
  const cv=document.getElementById(id),ctx=cv.getContext('2d');
  const c={cv,ctx,p:0,started:false,w:0,h:0,shapes:[]};
  c.draw=()=>{const r=cv.getBoundingClientRect(),dpr=devicePixelRatio||1;
    c.w=r.width;c.h=r.height;cv.width=c.w*dpr;cv.height=c.h*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);
    ctx.clearRect(0,0,c.w,c.h);ctx.font='600 12px Inconsolata';c.shapes=[];render(c,ease(c.p));};
  c.start=()=>{if(c.started)return;c.started=true;const t0=performance.now();
    const loop=now=>{c.p=Math.min(1,(now-t0)/1600);c.draw();if(c.p<1)requestAnimationFrame(loop)};requestAnimationFrame(loop)};
  const pos=e=>{const r=cv.getBoundingClientRect();return[e.clientX-r.left,e.clientY-r.top]};
  cv.addEventListener('mousemove',e=>{const s=hit(c,...pos(e));s?showTip(s.tip,e.clientX,e.clientY):hideTip()});
  cv.addEventListener('mouseleave',hideTip);
  cv.addEventListener('click',e=>{const s=hit(c,...pos(e));if(s)click(s)});
  charts.push(c);return c;
}
const rectHit=(c,x,y)=>c.shapes.find(s=>x>=s.x&&x<=s.x+s.w&&y>=s.y&&y<=s.y+s.h);
function axes(c,L,B,maxY,ticks,lab){
  const ctx=c.ctx;ctx.strokeStyle=css('--line');ctx.lineWidth=2;
  ctx.beginPath();ctx.moveTo(L,10);ctx.lineTo(L,c.h-B);ctx.lineTo(c.w-10,c.h-B);ctx.stroke();
  ctx.fillStyle=css('--muted');ctx.textAlign='right';
  for(let i=0;i<=ticks;i++){const v=maxY*i/ticks,y=c.h-B-(c.h-B-10)*i/ticks;ctx.fillText(lab(v),L-6,y+4)}
}

/* 1. Histogram */
const BINS=Array.from({length:10},(_,i)=>{const lo=i*1e5,hi=lo+1e5,items=D.filter(d=>d.a>=lo&&d.a<hi);
  return{lo,hi,legit:items.filter(d=>!d.f).length,fraud:items.filter(d=>d.f).length}});
Chart('hist',(c,p)=>{
  const L=40,B=30,ctx=c.ctx,max=Math.max(...BINS.map(b=>b.legit+b.fraud));
  axes(c,L,B,max,4,v=>Math.round(v));
  const bw=(c.w-L-20)/BINS.length,H=c.h-B-10;
  BINS.forEach((b,i)=>{const x=L+8+i*bw,gw=bw-10;
    const local=Math.max(0,Math.min(1,p*1.6-i*0.06));
    const hl=b.legit/max*H*local,hf=b.fraud/max*H*local,base=c.h-B;
    ctx.fillStyle=css('--blue');ctx.fillRect(x,base-hl,gw,hl);
    ctx.fillStyle=css('--red');ctx.fillRect(x,base-hl-hf,gw,hf);
    ctx.fillStyle=css('--muted');ctx.textAlign='center';ctx.fillText((b.lo/1e3)+'k',x+gw/2,base+18);
    c.shapes.push({x,y:base-hl-hf,w:gw,h:hl+hf||2,b,
      tip:`${fmt(b.lo)}–${fmt(b.hi)}<br>${t('legit')}: ${b.legit} · ${t('fraud')}: ${b.fraud}`});
  });
},rectHit,s=>{const b=s.b,tot=b.legit+b.fraud;
  openModal(`${fmt(b.lo)} – ${fmt(b.hi)}`,`${t('binInfo')} <b>${tot}</b> ${t('tx')}.<br><b>${t('legit')}:</b> ${b.legit}<br><b>${t('fraud')}:</b> ${b.fraud}<br><b>${t('rate')}:</b> ${tot?(b.fraud/tot*100).toFixed(0):0}%`)});

/* 2. Scatter */
Chart('scatter',(c,p)=>{
  const L=60,B=26,ctx=c.ctx,max=1e6,H=c.h-B-10,W=c.w-L-20;
  const Y=v=>c.h-B-v/max*H;
  // zones
  [[0,T1,'--blue'],[T1,T2,'--yellow'],[T2,max,'--red']].forEach(([a,b,col])=>{
    ctx.fillStyle=css(col);ctx.globalAlpha=.08*p;ctx.fillRect(L,Y(b),W+10,Y(a)-Y(b));ctx.globalAlpha=1});
  axes(c,L,B,max,5,v=>(v/1e3)+'k');
  ctx.setLineDash([6,5]);ctx.strokeStyle=css('--accent');ctx.lineWidth=2;
  [[T1,'μ'],[T2,'μ+0.5σ']].forEach(([v,l])=>{ctx.beginPath();ctx.moveTo(L,Y(v));ctx.lineTo(L+(W+10)*p,Y(v));ctx.stroke();
    ctx.fillStyle=css('--accent');ctx.textAlign='left';ctx.fillText(l,L+6,Y(v)-6)});
  ctx.setLineDash([]);
  D.forEach((d,i)=>{if(i/n>p)return;const x=L+10+i/(n-1)*(W-10),y=Y(d.a),s=d.f?10:9;
    ctx.fillStyle=riskColor(d.r);ctx.strokeStyle=css('--line');ctx.lineWidth=1.5;
    if(d.f){ctx.fillRect(x-s/2,y-s/2,s,s);ctx.strokeRect(x-s/2,y-s/2,s,s)}
    else{ctx.beginPath();ctx.arc(x,y,s/2,0,7);ctx.fill();ctx.stroke()}
    c.shapes.push({x:x-7,y:y-7,w:14,h:14,d,tip:`<b>${d.id}</b> · ${fmt(d.a)}<br>${t(d.r)}${d.f?' · ⚠ '+t('fraud'):''}`});
  });
},rectHit,s=>openModal(s.d.id,txBody(s.d)));

/* 3. Donut */
Chart('donut',(c,p)=>{
  const ctx=c.ctx,cx=c.w/2,cy=c.h/2,R=Math.min(c.w,c.h)/2-20,r=R*.55;let a0=-Math.PI/2;
  c.geo={cx,cy,R,r,segs:[]};
  RISKS.forEach(k=>{const v=byRisk[k].length,a1=a0+v/n*Math.PI*2*p;
    ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,R,a0,a1);ctx.closePath();ctx.fillStyle=riskColor(k);ctx.fill();
    ctx.strokeStyle=css('--card');ctx.lineWidth=4;ctx.stroke();
    c.geo.segs.push({k,a0,a1});a0=a1});
  ctx.beginPath();ctx.arc(cx,cy,r,0,7);ctx.fillStyle=css('--card');ctx.fill();
  ctx.fillStyle=css('--ink');ctx.textAlign='center';ctx.font='900 34px Inconsolata';ctx.fillText(Math.round(n*p),cx,cy+6);
  ctx.font='600 12px Inconsolata';ctx.fillStyle=css('--muted');ctx.fillText(t('tx').toUpperCase(),cx,cy+26);
},(c,x,y)=>{const g=c.geo;if(!g)return;const dx=x-g.cx,dy=y-g.cy,dist=Math.hypot(dx,dy);
  if(dist<g.r||dist>g.R)return;let a=Math.atan2(dy,dx);if(a<-Math.PI/2)a+=Math.PI*2;
  const s=g.segs.find(s=>a>=s.a0&&a<s.a1);if(!s)return;const items=byRisk[s.k];
  return{k:s.k,tip:`<b>${t(s.k)}</b><br>${items.length} ${t('tx')} · ${items.filter(d=>d.f).length} ${t('fraud').toLowerCase()}`}},
s=>{const it=byRisk[s.k],a=it.map(d=>d.a),f=it.filter(d=>d.f).length;
  openModal(t(s.k),`<b>${t('count')}:</b> ${it.length}<br><b>${t('range')}:</b> ${fmt(Math.min(...a))} – ${fmt(Math.max(...a))}<br><b>${t('fraud')}:</b> ${f}<br><b>${t('rate')}:</b> ${(f/it.length*100).toFixed(0)}%`)});

/* 4. Fraud rate per level */
Chart('rate',(c,p)=>{
  const L=44,B=30,ctx=c.ctx,H=c.h-B-10;axes(c,L,B,100,4,v=>v+'%');
  const bw=(c.w-L-20)/3;
  RISKS.forEach((k,i)=>{const it=byRisk[k],rate=it.filter(d=>d.f).length/it.length*100;
    const h=rate/100*H*p,x=L+14+i*bw,w=bw-28,y=c.h-B-h;
    ctx.fillStyle=riskColor(k);ctx.fillRect(x,y,w,h);ctx.strokeStyle=css('--line');ctx.lineWidth=2;ctx.strokeRect(x,y,w,h);
    ctx.fillStyle=css('--ink');ctx.textAlign='center';ctx.font='900 16px Inconsolata';ctx.fillText((rate*p).toFixed(0)+'%',x+w/2,y-8);
    ctx.font='600 12px Inconsolata';ctx.fillStyle=css('--muted');ctx.fillText(k.toUpperCase(),x+w/2,c.h-B+18);
    c.shapes.push({x,y:Math.min(y,c.h-B-20),w,h:Math.max(h,20),k,tip:`<b>${t(k)}</b> · ${rate.toFixed(0)}%`});
  });
},rectHit,s=>{const it=byRisk[s.k],f=it.filter(d=>d.f).length;
  openModal(t(s.k),`<b>${f}</b> / ${it.length} ${t('tx')} → <b>${(f/it.length*100).toFixed(0)}%</b><br><br>${T[lang].info.rate[1]}`)});

/* info buttons */
document.querySelectorAll('.info').forEach(b=>b.addEventListener('click',()=>{const [ti,tx]=T[lang].info[b.dataset.info];openModal(ti,tx)}));

/* ===== WATCHLIST ===== */
function buildGrid(){
  const g=document.getElementById('grid');g.innerHTML='';
  [...byRisk.high].sort((a,b)=>b.a-a.a).forEach(d=>{
    const el=document.createElement('div');el.className='tile'+(d.f?' f':'');
    el.innerHTML=`<b>${d.id}</b><small>${fmt(d.a)}</small>`;
    el.onclick=()=>openModal(d.id,txBody(d));g.appendChild(el)});
}

/* ===== KPI COUNTERS ===== */
const kpiTarget={n,fr:totalFraud/n*100,mean,cap:capture};
const kpiVal=(k,p)=>k==='mean'?fmt(kpiTarget[k]*p):Math.round(kpiTarget[k]*p);
function countUp(el){const k=el.dataset.count,t0=performance.now();
  const step=now=>{const p=ease(Math.min(1,(now-t0)/1400));el.textContent=kpiVal(k,p);
    if(p<1)requestAnimationFrame(step);else el.dataset.done=1};requestAnimationFrame(step)}

/* ===== REVEAL ===== */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;
  const el=e.target;el.classList.add('in');
  el.querySelectorAll('canvas.chart').forEach(cv=>charts.find(c=>c.cv===cv)?.start());
  el.querySelectorAll('[data-count]').forEach(countUp);
  io.unobserve(el)}),{threshold:.2});

/* ===== THEME / ACCENT / LANG ===== */
const root=document.documentElement;
document.getElementById('themeBtn').onclick=()=>{
  root.dataset.theme=root.dataset.theme==='dark'?'light':'dark';localStorage.theme=root.dataset.theme;
  setTimeout(()=>charts.forEach(c=>c.draw()),60)};
function setAccent(c){root.style.setProperty('--accent',c);localStorage.accent=c;
  document.querySelectorAll('.accents button').forEach(b=>b.classList.toggle('on',b.dataset.c===c));
  charts.forEach(ch=>ch.draw())}
document.querySelectorAll('.accents button').forEach(b=>b.onclick=()=>setAccent(b.dataset.c));
document.getElementById('accentPick').oninput=e=>setAccent(e.target.value);
document.getElementById('langBtn').onclick=()=>{lang=lang==='en'?'fr':'en';localStorage.lang=lang;applyLang()};
addEventListener('resize',()=>charts.forEach(c=>c.draw()));

/* ===== STARS ===== */
(()=>{const cv=document.getElementById('stars'),ctx=cv.getContext('2d');let W,H,mx=-999,my=-999;
  const resize=()=>{W=cv.width=innerWidth;H=cv.height=innerHeight};resize();addEventListener('resize',resize);
  addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY});
  const S=Array.from({length:160},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,
    r:Math.random()*1.6+.3,vx:(Math.random()-.5)*.2,vy:(Math.random()-.5)*.2,ox:0,oy:0,tw:Math.random()*6}));
  (function loop(){ctx.clearRect(0,0,W,H);const col=css('--ink'),acc=css('--accent');
    S.forEach(s=>{s.x=(s.x+s.vx+W)%W;s.y=(s.y+s.vy+H)%H;s.tw+=.03;
      const dx=s.x-mx,dy=s.y-my,d=Math.hypot(dx,dy);
      if(d<130){const f=(130-d)/130*22;s.ox+=(dx/d*f-s.ox)*.15;s.oy+=(dy/d*f-s.oy)*.15}
      else{s.ox*=.94;s.oy*=.94}
      ctx.globalAlpha=.35+Math.sin(s.tw)*.25;ctx.fillStyle=d<130?acc:col;
      ctx.fillRect(s.x+s.ox,s.y+s.oy,s.r*1.6,s.r*1.6)});   // square stars = discrete geometry
    ctx.globalAlpha=1;requestAnimationFrame(loop)})();
})();

/* ===== INIT + LOADER ===== */
root.dataset.theme=localStorage.theme||'light';
lang=localStorage.lang||((navigator.language||'en').startsWith('fr')?'fr':'en');
setAccent(localStorage.accent||'#e63946');
applyLang();
(()=>{const fill=document.getElementById('ldFill'),pct=document.getElementById('ldPct');let v=0;
  const tick=()=>{v=Math.min(100,v+Math.random()*7+2);fill.style.width=v+'%';pct.textContent=Math.floor(v)+'%';
    if(v<100)setTimeout(tick,60);
    else setTimeout(()=>{document.getElementById('loader').classList.add('done');
      document.querySelectorAll('.reveal').forEach(el=>io.observe(el))},350)};
  tick()})();
