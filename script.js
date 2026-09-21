"use strict";
/* ============================ Game data ============================ */
const BUILDINGS = [
  {id:'kernel',  name:'Lonely Kernel',    icon:'🌽', baseCost:15,          baseCps:0.1,     blurb:'One brave kernel, popping on principle.'},
  {id:'popper',  name:'Hand Popper',      icon:'🍿', baseCost:100,         baseCps:1,       blurb:'A trusty stovetop popper with a squeaky crank.'},
  {id:'cart',    name:'Popcorn Cart',     icon:'🛒', baseCost:1100,        baseCps:8,       blurb:'Red-awning cart rolling up to the curb.'},
  {id:'stand',   name:'Concession Stand', icon:'🎪', baseCost:12000,       baseCps:47,      blurb:'Butter pump, soda fountain, the works.'},
  {id:'theater', name:'Movie Theater',    icon:'🎬', baseCost:130000,      baseCps:260,     blurb:'Sticky floors optional, popcorn mandatory.'},
  {id:'drivein', name:'Drive-In',         icon:'🚗', baseCost:1400000,     baseCps:1400,    blurb:'Popcorn under the stars, engines idling.'},
  {id:'factory', name:'Popcorn Factory',  icon:'🏭', baseCost:20000000,    baseCps:7800,    blurb:'Industrial poppers running around the clock.'},
  {id:'farm',    name:'Corn Megafarm',    icon:'🌾', baseCost:330000000,   baseCps:44000,   blurb:'Horizon-to-horizon rows of popping corn.'},
  {id:'butter',  name:'Butter Refinery',  icon:'🧈', baseCost:5100000000,  baseCps:260000,  blurb:'Refines pure, golden, liquid joy.'},
  {id:'planet',  name:'Popcorn Planet',   icon:'🪐', baseCost:75000000000, baseCps:1600000, blurb:'A whole world of popped perfection.'},
];

// kinds: clickmul, clickcps, global, building
const UPGRADES = [
  // click power
  {id:'c1', name:'Buttery Fingers',  icon:'🧈', cost:500,      kind:'clickmul', val:2, req:s=>s.clicks>=12,          blurb:'Grip slips, output doubles. Click power ×2.'},
  {id:'c2', name:'Reinforced Scoop', icon:'🥄', cost:6000,     kind:'clickmul', val:2, req:s=>s.clicks>=60,          blurb:'A sturdier scoop hauls twice the pop. Click power ×2.'},
  {id:'c3', name:'Jumbo Bucket',     icon:'🪣', cost:75000,    kind:'clickmul', val:2, req:s=>s.clicks>=250,         blurb:'Cinema-size or nothing. Click power ×2.'},
  {id:'c4', name:'Free Refills',     icon:'♻️', cost:5000000,  kind:'clickmul', val:2, req:s=>s.clicks>=900,         blurb:'The bucket never empties. Click power ×2.'},
  {id:'cc1',name:'Souvenir Cursor',  icon:'🖱️', cost:120000,   kind:'clickcps', val:0.01, req:s=>rawCps()>=90,       blurb:'Each pop also gains +1% of your popcorn/sec.'},
  {id:'cc2',name:'Combo Meal Deal',  icon:'🍔', cost:80000000, kind:'clickcps', val:0.02, req:s=>rawCps()>=4500,     blurb:'Each pop gains an extra +2% of your popcorn/sec.'},

  // global
  {id:'g1', name:'Extra Salt',       icon:'🧂', cost:900000,      kind:'global', val:1.05, req:s=>s.totalPopcorn>=500000,    blurb:'A dash more flavor. All popcorn output ×1.05.'},
  {id:'g2', name:'Surround Aroma',   icon:'👃', cost:400000000,   kind:'global', val:1.10, req:s=>s.totalPopcorn>=2e8,       blurb:'The smell pulls crowds. All output ×1.10.'},
  {id:'g3', name:'Golden Ratio Pop', icon:'📐', cost:1e11,        kind:'global', val:1.15, req:s=>s.totalPopcorn>=6e10,      blurb:'Mathematically perfect kernels. All output ×1.15.'},

  // per-building (own >=1 then >=10)
  {id:'b_kernel1',  name:'Premium Kernels', icon:'🌽', cost:120,           kind:'building', building:'kernel',  val:2, req:s=>own('kernel')>=1,  blurb:'Lonely Kernels pop twice as eagerly.'},
  {id:'b_kernel2',  name:'Heirloom Corn',   icon:'🌽', cost:600,           kind:'building', building:'kernel',  val:2, req:s=>own('kernel')>=10, blurb:'Lonely Kernels ×2 again.'},
  {id:'b_popper1',  name:'Non-Stick Coat',  icon:'🍿', cost:1000,          kind:'building', building:'popper',  val:2, req:s=>own('popper')>=1,  blurb:'Hand Poppers ×2.'},
  {id:'b_popper2',  name:'Twin Poppers',    icon:'🍿', cost:5000,          kind:'building', building:'popper',  val:2, req:s=>own('popper')>=10, blurb:'Hand Poppers ×2 again.'},
  {id:'b_cart1',    name:'Squeaky Wheels',  icon:'🛒', cost:11000,         kind:'building', building:'cart',    val:2, req:s=>own('cart')>=1,    blurb:'Popcorn Carts ×2.'},
  {id:'b_cart2',    name:'Rush-Hour Route', icon:'🛒', cost:55000,         kind:'building', building:'cart',    val:2, req:s=>own('cart')>=10,   blurb:'Popcorn Carts ×2 again.'},
  {id:'b_stand1',   name:'Extra Napkins',   icon:'🎪', cost:120000,        kind:'building', building:'stand',   val:2, req:s=>own('stand')>=1,   blurb:'Concession Stands ×2.'},
  {id:'b_stand2',   name:'Combo Deals',     icon:'🎪', cost:600000,        kind:'building', building:'stand',   val:2, req:s=>own('stand')>=10,  blurb:'Concession Stands ×2 again.'},
  {id:'b_theater1', name:'Surround Sound',  icon:'🎬', cost:1300000,       kind:'building', building:'theater', val:2, req:s=>own('theater')>=1, blurb:'Movie Theaters ×2.'},
  {id:'b_theater2', name:'IMAX Screens',    icon:'🎬', cost:6500000,       kind:'building', building:'theater', val:2, req:s=>own('theater')>=10,blurb:'Movie Theaters ×2 again.'},
  {id:'b_drivein1', name:'Bigger Speakers', icon:'🚗', cost:14000000,      kind:'building', building:'drivein', val:2, req:s=>own('drivein')>=1, blurb:'Drive-Ins ×2.'},
  {id:'b_drivein2', name:'Double Features', icon:'🚗', cost:70000000,      kind:'building', building:'drivein', val:2, req:s=>own('drivein')>=10,blurb:'Drive-Ins ×2 again.'},
  {id:'b_factory1', name:'Conveyor Belts',  icon:'🏭', cost:200000000,     kind:'building', building:'factory', val:2, req:s=>own('factory')>=1, blurb:'Popcorn Factories ×2.'},
  {id:'b_factory2', name:'Night Shift',     icon:'🏭', cost:1000000000,    kind:'building', building:'factory', val:2, req:s=>own('factory')>=10,blurb:'Popcorn Factories ×2 again.'},
  {id:'b_farm1',    name:'GMO Cobs',        icon:'🌾', cost:3300000000,    kind:'building', building:'farm',    val:2, req:s=>own('farm')>=1,    blurb:'Corn Megafarms ×2.'},
  {id:'b_farm2',    name:'Rain Machines',   icon:'🌾', cost:16500000000,   kind:'building', building:'farm',    val:2, req:s=>own('farm')>=10,   blurb:'Corn Megafarms ×2 again.'},
  {id:'b_butter1',  name:'Clarified Butter',icon:'🧈', cost:51000000000,   kind:'building', building:'butter',  val:2, req:s=>own('butter')>=1,  blurb:'Butter Refineries ×2.'},
  {id:'b_butter2',  name:'Butter Pipelines',icon:'🧈', cost:255000000000,  kind:'building', building:'butter',  val:2, req:s=>own('butter')>=10, blurb:'Butter Refineries ×2 again.'},
  {id:'b_planet1',  name:'Orbital Poppers', icon:'🪐', cost:750000000000,  kind:'building', building:'planet',  val:2, req:s=>own('planet')>=1,  blurb:'Popcorn Planets ×2.'},
  {id:'b_planet2',  name:'Popcorn Nebula',  icon:'🪐', cost:3750000000000, kind:'building', building:'planet',  val:2, req:s=>own('planet')>=10, blurb:'Popcorn Planets ×2 again.'},
];

const ACH = [
  {id:'firstpop', name:'First Pop',        icon:'🍿', blurb:'Pop your first piece by hand.', test:s=>s.handmade>=1},
  {id:'snack',    name:'Snack Attack',     icon:'🥤', blurb:'Pop 100 popcorn.',              test:s=>s.totalPopcorn>=100},
  {id:'buttered', name:'Buttered Up',      icon:'🧈', blurb:'Pop 1,000 popcorn.',            test:s=>s.totalPopcorn>=1000},
  {id:'matinee',  name:'Matinee',          icon:'🎟️', blurb:'Pop 100K popcorn.',             test:s=>s.totalPopcorn>=1e5},
  {id:'block',    name:'Blockbuster',      icon:'🎬', blurb:'Pop 1M popcorn.',               test:s=>s.totalPopcorn>=1e6},
  {id:'franchise',name:'Franchise',        icon:'🏆', blurb:'Pop 1B popcorn.',               test:s=>s.totalPopcorn>=1e9},
  {id:'baron',    name:'Butter Baron',     icon:'👑', blurb:'Pop 1T popcorn.',               test:s=>s.totalPopcorn>=1e12},
  {id:'click100', name:'Getting Handsy',   icon:'👆', blurb:'Click 100 times.',              test:s=>s.clicks>=100},
  {id:'click1k',  name:'Repetitive Strain',icon:'🤕', blurb:'Click 1,000 times.',            test:s=>s.clicks>=1000},
  {id:'click10k', name:'Iron Thumb',       icon:'💪', blurb:'Click 10,000 times.',           test:s=>s.clicks>=10000},
  {id:'gold1',    name:'Golden Touch',     icon:'✨', blurb:'Catch a golden popcorn.',       test:s=>s.goldenCaught>=1},
  {id:'gold25',   name:'Midas of Movies',  icon:'🌟', blurb:'Catch 25 golden popcorn.',      test:s=>s.goldenCaught>=25},
  {id:'own50',    name:'Concessionaire',   icon:'🎪', blurb:'Own 50 generators.',            test:s=>totalBuildings()>=50},
  {id:'own200',   name:'Popcorn Empire',   icon:'🏙️', blurb:'Own 200 generators.',           test:s=>totalBuildings()>=200},
  {id:'full',     name:'Full House',       icon:'🎭', blurb:'Own one of every generator.',   test:s=>distinctOwned()>=BUILDINGS.length},
  {id:'soldout',  name:'Sold Out',         icon:'🚫', blurb:'Own 10 of every generator.',    test:s=>BUILDINGS.every(b=>own(b.id)>=10)},
  {id:'cps1k',    name:'Popping Off',      icon:'⚡', blurb:'Reach 1,000 popcorn/sec.',      test:s=>rawCps()>=1000},
  {id:'cps1m',    name:'Popcorn Tycoon',   icon:'💰', blurb:'Reach 1M popcorn/sec.',         test:s=>rawCps()>=1e6},
];

const TICKER = [
  'BREAKING: Local kernel refuses to pop, cites stage fright.',
  'Butter futures soar as Refinery goes online.',
  'Critics rave: "A-maize-ing." — Popcorn Times',
  'Study finds 9 of 10 movies improved by more popcorn.',
  'Drive-In sells out; cars parked to the horizon.',
  'Scientists confirm the fluffy ones taste better.',
  'Tip: golden popcorn appears when you least expect it.',
  'Popcorn Planet declares itself a snack sovereign nation.',
  'Napkin shortage narrowly averted at the Stand.',
];

const SAVE_KEY = 'popcornClickerSave.v1';
const SUFFIX = ['','K','M','B','T','Qa','Qi','Sx','Sp','Oc','No','Dc','Ud','Dd'];

/* ============================ State ============================ */
function freshState(){
  return {
    popcorn:0, totalPopcorn:0, clicks:0, handmade:0, goldenCaught:0,
    buildings:{}, upgrades:{}, achievements:{}, unlocked:{},
    buyAmount:1, createdAt:Date.now(),
  };
}
let state = freshState();
// runtime-only (not saved)
let cpsFrenzyUntil = 0, clickFrenzyUntil = 0;
let goldenTimer = 0, goldenInterval = rand(75,150), goldenActive = false;
let currentTab = 'gen';

function own(id){ return state.buildings[id]||0; }
function totalBuildings(){ return BUILDINGS.reduce((a,b)=>a+own(b.id),0); }
function distinctOwned(){ return BUILDINGS.reduce((a,b)=>a+(own(b.id)>0?1:0),0); }
function upgradesOwned(){ return UPGRADES.reduce((a,u)=>a+(state.upgrades[u.id]?1:0),0); }
function achEarned(){ return ACH.reduce((a,x)=>a+(state.achievements[x.id]?1:0),0); }

/* ============================ Math ============================ */
function buildingMult(id){ let m=1; for(const u of UPGRADES){ if(u.kind==='building'&&u.building===id&&state.upgrades[u.id]) m*=u.val; } return m; }
function globalMult(){ let m=1; for(const u of UPGRADES){ if(u.kind==='global'&&state.upgrades[u.id]) m*=u.val; } return m; }
function clickMul(){ let m=1; for(const u of UPGRADES){ if(u.kind==='clickmul'&&state.upgrades[u.id]) m*=u.val; } return m; }
function clickCpsFrac(){ let f=0; for(const u of UPGRADES){ if(u.kind==='clickcps'&&state.upgrades[u.id]) f+=u.val; } return f; }

function rawCps(){
  let c=0;
  for(const b of BUILDINGS){ const n=own(b.id); if(n) c += n*b.baseCps*buildingMult(b.id); }
  return c*globalMult();
}
function frenzyMult(){ return performance.now()<cpsFrenzyUntil ? 7 : 1; }
function clickFrenzyMult(){ return performance.now()<clickFrenzyUntil ? 777 : 1; }
function effectiveCps(){ return rawCps()*frenzyMult(); }
function clickValue(){ return (clickMul() + rawCps()*clickCpsFrac()) * clickFrenzyMult(); }

function buildingCost(b){ return Math.ceil(b.baseCost*Math.pow(1.15, own(b.id))); }
function costFor(b, q){
  const base = b.baseCost*Math.pow(1.15, own(b.id));
  return Math.ceil(base*(Math.pow(1.15,q)-1)/0.15);
}
function maxAffordable(b){
  const base = b.baseCost*Math.pow(1.15, own(b.id));
  const m = Math.floor(Math.log(1 + state.popcorn*0.15/base)/Math.log(1.15));
  return (isFinite(m)&&m>0)?m:0;
}
function currentQty(b){ return state.buyAmount==='max' ? maxAffordable(b) : state.buyAmount; }

/* ============================ Formatting ============================ */
function fmt(n){
  if(!isFinite(n)) return '∞';
  n = n<0?0:n;
  if(n<1000){ if(n<10 && n%1>0.0001) return n.toFixed(1); return Math.floor(n).toLocaleString('en-US'); }
  const tier = Math.floor(Math.log10(n)/3);
  if(tier>=SUFFIX.length) return n.toExponential(2);
  const scaled = n/Math.pow(1000,tier);
  return (scaled<10?scaled.toFixed(2):scaled<100?scaled.toFixed(1):Math.floor(scaled).toString())+SUFFIX[tier];
}
function rand(a,b){ return a+Math.random()*(b-a); }

/* ============================ DOM refs ============================ */
const $ = id => document.getElementById(id);
const el = {
  bank:$('bank'), cps:$('cps'), clickval:$('clickval'), buff:$('buff'),
  clicker:$('clicker'), statlist:$('statlist'), saveinfo:$('saveinfo'),
  paneGen:$('pane-gen'), paneUp:$('pane-up'), paneAch:$('pane-ach'),
  upbadge:$('upbadge'), achbadge:$('achbadge'), upnudge:$('upnudge'),
  fx:$('fxlayer'), golden:$('goldenlayer'), toasts:$('toasts'), ticker:$('ticker'),
  modalback:$('modalback'), modaltitle:$('modaltitle'), modalbody:$('modalbody'), modalactions:$('modalactions'),
};

/* ============================ Rendering ============================ */
let genRows = {}, genBuilt=false;
function buildGenRows(){
  el.paneGen.innerHTML='';
  genRows={};
  BUILDINGS.forEach((b,i)=>{
    const btn=document.createElement('button');
    btn.className='shop-item'; btn.dataset.b=b.id; btn.hidden=true;
    btn.innerHTML =
      `<span class="si-icon">${b.icon}</span>`+
      `<span class="si-main"><span class="si-name">${b.name}</span>`+
      `<span class="si-sub"></span><span class="si-cost"></span></span>`+
      `<span class="si-count">0</span>`;
    btn.addEventListener('click',()=>buyBuilding(b));
    el.paneGen.appendChild(btn);
    genRows[b.id]={btn, sub:btn.querySelector('.si-sub'), cost:btn.querySelector('.si-cost'), count:btn.querySelector('.si-count')};
  });
  genBuilt=true;
}
function revealed(b,i){
  if(state.unlocked[b.id]) return true;
  if(own(b.id)>0){ state.unlocked[b.id]=true; return true; }
  if(i===0){ state.unlocked[b.id]=true; return true; }
  if(own(BUILDINGS[i-1].id)>0 || state.totalPopcorn >= b.baseCost*0.35){ state.unlocked[b.id]=true; return true; }
  return false;
}
function renderGen(){
  if(!genBuilt) buildGenRows();
  BUILDINGS.forEach((b,i)=>{
    const r=genRows[b.id];
    if(!revealed(b,i)){ r.btn.hidden=true; return; }
    r.btn.hidden=false;
    const q=currentQty(b);
    const cost = state.buyAmount==='max' ? (q>0?costFor(b,q):buildingCost(b)) : costFor(b,q);
    const each = b.baseCps*buildingMult(b.id)*globalMult();
    r.sub.textContent = `${fmt(each)}/s each · ${fmt(each*own(b.id))}/s total`;
    const qtyLabel = state.buyAmount==='max' ? (q>0?`×${q}`:'') : `×${q}`;
    r.cost.textContent = `🍿 ${fmt(cost)} ${qtyLabel}`;
    r.count.textContent = own(b.id);
    r.count.classList.toggle('has', own(b.id)>0);
    const affordable = state.buyAmount==='max' ? q>0 : state.popcorn>=cost;
    r.btn.classList.toggle('locked-buy', !affordable);
  });
}

let upSig='';
function availableUpgrades(){ return UPGRADES.filter(u=>!state.upgrades[u.id] && u.req(state)); }
function renderUp(){
  const list=availableUpgrades();
  const sig=list.map(u=>u.id).join(',');
  if(sig!==upSig){
    upSig=sig;
    el.paneUp.innerHTML='';
    if(!list.length){ el.paneUp.innerHTML='<div class="empty">No upgrades available yet — keep popping and buying generators to unlock buttery improvements.</div>'; }
    for(const u of list){
      const btn=document.createElement('button');
      btn.className='up-item'; btn.dataset.u=u.id;
      btn.innerHTML=`<span class="ui-icon">${u.icon}</span>`+
        `<span class="ui-main"><span class="ui-name">${u.name}</span><span class="ui-blurb">${u.blurb}</span></span>`+
        `<span class="ui-cost">🍿 ${fmt(u.cost)}</span>`;
      btn.addEventListener('click',()=>buyUpgrade(u));
      el.paneUp.appendChild(btn);
    }
  }
  el.paneUp.querySelectorAll('.up-item').forEach(btn=>{
    const u=UPGRADES.find(x=>x.id===btn.dataset.u);
    btn.classList.toggle('locked-buy', state.popcorn<u.cost);
  });
  const n=list.length;
  el.upbadge.textContent=n; el.upbadge.classList.toggle('show', n>0);
  // availability indicators: pulse the tab badge and float a nudge when an
  // upgrade is affordable but the Upgrades tab isn't the one you're looking at
  const affordable = list.filter(u=>state.popcorn>=u.cost).length;
  el.upbadge.classList.toggle('ready', affordable>0);
  el.upnudge.hidden = !(affordable>0 && currentTab!=='up');
}

let achBuilt=false;
function renderAch(){
  if(!achBuilt){
    el.paneAch.innerHTML='';
    for(const a of ACH){
      const d=document.createElement('div');
      d.className='ach'; d.dataset.a=a.id;
      d.innerHTML=`<span class="ach-icon">${a.icon}</span><span><span class="ach-name">${a.name}</span><span class="ach-blurb">${a.blurb}</span></span>`;
      el.paneAch.appendChild(d);
    }
    achBuilt=true;
  }
  for(const a of ACH){
    const d=el.paneAch.querySelector(`[data-a="${a.id}"]`);
    d.classList.toggle('earned', !!state.achievements[a.id]);
  }
  const n=achEarned();
  el.achbadge.textContent=`${n}/${ACH.length}`; el.achbadge.classList.toggle('show', true);
}

function renderStats(){
  const rows=[
    ['Popcorn / second', fmt(rawCps())],
    ['Total popped', fmt(state.totalPopcorn)],
    ['Popped by hand', fmt(state.handmade)],
    ['Total clicks', state.clicks.toLocaleString('en-US')],
    ['Generators owned', totalBuildings().toLocaleString('en-US')],
    ['Upgrades bought', `${upgradesOwned()}/${UPGRADES.length}`],
    ['Golden popcorn caught', state.goldenCaught.toLocaleString('en-US')],
    ['Buckets served', fmt(Math.floor(state.totalPopcorn/240))],
    ['Butter melted', fmt(state.totalPopcorn*0.0025)+' L'],
    ['Popping since', new Date(state.createdAt).toLocaleDateString('en-US')],
  ];
  el.statlist.innerHTML = rows.map(([k,v])=>`<li><span>${k}</span><b>${v}</b></li>`).join('');
}

function renderBuff(){
  const now=performance.now();
  const frenzy=now<cpsFrenzyUntil, cf=now<clickFrenzyUntil;
  if(frenzy||cf){
    let parts=[];
    if(frenzy) parts.push(`🔥 Buttered Up ×7 (${Math.ceil((cpsFrenzyUntil-now)/1000)}s)`);
    if(cf) parts.push(`⚡ Popping Off ×777 (${Math.ceil((clickFrenzyUntil-now)/1000)}s)`);
    el.buff.textContent=parts.join('  ·  ');
    el.buff.classList.add('show');
  } else el.buff.classList.remove('show');
}

function render(){
  el.bank.textContent = fmt(state.popcorn);
  const cps=effectiveCps();
  el.cps.textContent = `${fmt(cps)} per second` + (frenzyMult()>1?' 🔥':'');
  el.clickval.textContent = '+'+fmt(clickValue());
  renderGen(); renderUp(); renderStats(); renderBuff();
}

/* ============================ Actions ============================ */
function buyBuilding(b){
  const q=currentQty(b); if(q<=0) return;
  const cost=costFor(b,q);
  if(state.popcorn<cost) return;
  state.popcorn-=cost;
  state.buildings[b.id]=own(b.id)+q;
  renderAch();
}
function buyUpgrade(u){
  if(state.upgrades[u.id]||state.popcorn<u.cost) return;
  state.popcorn-=u.cost;
  state.upgrades[u.id]=true;
  upSig='';           // force upgrade pane rebuild
  toast('🎉','Upgrade!',u.name);
}

function popClick(e){
  const v=clickValue();
  state.popcorn+=v; state.totalPopcorn+=v; state.handmade+=v; state.clicks++;
  el.clicker.classList.remove('pop'); void el.clicker.offsetWidth; el.clicker.classList.add('pop');
  const x = e && e.clientX ? e.clientX : window.innerWidth/2;
  const y = e && e.clientY ? e.clientY : window.innerHeight/2;
  floatText('+'+fmt(v), x, y);
  spawnKernels(x,y);
}
function floatText(txt,x,y){
  const f=document.createElement('div'); f.className='float'; f.textContent=txt;
  f.style.left=x+'px'; f.style.top=(y-10)+'px';
  el.fx.appendChild(f); setTimeout(()=>f.remove(),1000);
}
let kernelCount=0;
function spawnKernels(x,y){
  if(kernelCount>60) return;
  const n=2+Math.floor(Math.random()*2);
  for(let i=0;i<n;i++){
    kernelCount++;
    const k=document.createElement('div'); k.className='kernel'; k.textContent='🍿';
    k.style.left=x+'px'; k.style.top=y+'px';
    const dx=rand(-70,70), dy=rand(-90,-30);
    k.animate([{transform:'translate(-50%,-50%) rotate(0)',opacity:1},
               {transform:`translate(calc(-50% + ${dx}px),${dy}px) rotate(${rand(-180,180)}deg)`,opacity:0}],
              {duration:800,easing:'cubic-bezier(.2,.7,.3,1)'});
    el.fx.appendChild(k); setTimeout(()=>{k.remove();kernelCount--;},800);
  }
}

/* ============================ Golden popcorn ============================ */
function updateGolden(dt){
  if(goldenActive) return;
  goldenTimer+=dt;
  if(goldenTimer>=goldenInterval){ goldenTimer=0; goldenInterval=rand(75,150); spawnGolden(); }
}
function spawnGolden(){
  goldenActive=true;
  const g=document.createElement('button');
  g.className='golden'; g.textContent='🍿'; g.setAttribute('aria-label','Golden popcorn! Click for a bonus');
  g.style.left=rand(8,78)+'vw'; g.style.top=rand(16,74)+'vh';
  el.golden.appendChild(g);
  const life=setTimeout(()=>{ g.remove(); goldenActive=false; }, 13000);
  g.addEventListener('click',()=>{ clearTimeout(life); g.remove(); goldenActive=false; applyGolden(); });
}
function applyGolden(){
  state.goldenCaught++;
  const r=Math.random();
  if(r<0.62){ cpsFrenzyUntil=performance.now()+15000; toast('🔥','Buttered Up!','Popcorn output ×7 for 15 seconds!'); }
  else if(r<0.85){ const g=Math.min(state.popcorn*0.15, rawCps()*900)+13; state.popcorn+=g; state.totalPopcorn+=g; toast('🍀','Lucky Kernel!','+'+fmt(g)+' popcorn!'); }
  else { clickFrenzyUntil=performance.now()+13000; toast('⚡','Popping Off!','Click power ×777 for 13 seconds!'); }
  renderAch();
}

/* ============================ Toasts ============================ */
function toast(icon,title,sub){
  const t=document.createElement('div'); t.className='toast';
  t.innerHTML=`<span class="ti">${icon}</span><span><b>${title}</b><small>${sub}</small></span>`;
  el.toasts.appendChild(t);
  setTimeout(()=>{ t.style.transition='opacity .4s'; t.style.opacity='0'; setTimeout(()=>t.remove(),400); }, 4200);
}

/* ============================ Achievements ============================ */
function checkAchievements(){
  let changed=false;
  for(const a of ACH){
    if(!state.achievements[a.id] && a.test(state)){
      state.achievements[a.id]=true; changed=true;
      toast(a.icon,'Trophy unlocked!',a.name);
    }
  }
  if(changed) renderAch();
}

/* ============================ Save / load ============================ */
function serialize(){ return JSON.stringify({
  popcorn:state.popcorn, totalPopcorn:state.totalPopcorn, clicks:state.clicks,
  handmade:state.handmade, goldenCaught:state.goldenCaught, buildings:state.buildings,
  upgrades:state.upgrades, achievements:state.achievements, unlocked:state.unlocked,
  buyAmount:state.buyAmount, createdAt:state.createdAt,
}); }
function applyData(d){
  if(!d||typeof d!=='object') return;
  const f=freshState();
  state = Object.assign(f, d);
  state.buildings=Object.assign({},d.buildings||{});
  state.upgrades=Object.assign({},d.upgrades||{});
  state.achievements=Object.assign({},d.achievements||{});
  state.unlocked=Object.assign({},d.unlocked||{});
  if(![1,10,100,'max'].includes(state.buyAmount)) state.buyAmount=1;
  if(!state.createdAt) state.createdAt=Date.now();
}
function save(quiet){
  try{ localStorage.setItem(SAVE_KEY, serialize()); if(!quiet) flashSave('Saved!'); }
  catch(e){ if(!quiet) flashSave('Save unavailable in this browser'); }
}
function load(){
  try{ const raw=localStorage.getItem(SAVE_KEY); if(raw) applyData(JSON.parse(raw)); }catch(e){}
}
let saveMsgTimer=0;
function flashSave(msg){ el.saveinfo.textContent=msg; clearTimeout(saveMsgTimer); saveMsgTimer=setTimeout(()=>{el.saveinfo.textContent='';},2500); }

/* ============================ Modal ============================ */
function openModal(title, bodyHtml, actions){
  el.modaltitle.textContent=title; el.modalbody.innerHTML=bodyHtml;
  el.modalactions.innerHTML='';
  for(const a of actions){
    const btn=document.createElement('button'); btn.textContent=a.label; if(a.cls) btn.className=a.cls;
    btn.addEventListener('click',()=>{ if(a.act) a.act(); if(a.close!==false) closeModal(); });
    el.modalactions.appendChild(btn);
  }
  el.modalback.hidden=false;
}
function closeModal(){ el.modalback.hidden=true; }
el.modalback.addEventListener('click',e=>{ if(e.target===el.modalback) closeModal(); });

function doExport(){
  const code=btoa(unescape(encodeURIComponent(serialize())));
  openModal('Export save','<p>Copy this code and keep it safe. Paste it into Import on any device to restore your popcorn empire.</p><textarea readonly id="exp"></textarea>',
    [{label:'Copy',cls:'primary',close:false,act:()=>{ const t=$('exp'); t.select(); try{document.execCommand('copy');}catch(e){} try{navigator.clipboard.writeText(code);}catch(e){} flashSave('Copied to clipboard'); }},
     {label:'Close'}]);
  $('exp').value=code;
}
function doImport(){
  openModal('Import save','<p>Paste a save code below. This will overwrite your current progress.</p><textarea id="imp" placeholder="Paste your save code here..."></textarea>',
    [{label:'Load save',cls:'primary',act:()=>{
        try{ const raw=decodeURIComponent(escape(atob($('imp').value.trim()))); applyData(JSON.parse(raw)); genBuilt=false; achBuilt=false; upSig=''; render(); renderAch(); flashSave('Save loaded!'); }
        catch(e){ flashSave('That code could not be read'); }
     }},
     {label:'Cancel'}]);
}
function doReset(){
  openModal('Reset everything?','<p>This wipes your entire popcorn empire — all popcorn, generators, upgrades and trophies. There is no undo.</p>',
    [{label:'Delete my save',cls:'danger',act:()=>{ try{localStorage.removeItem(SAVE_KEY);}catch(e){} state=freshState(); cpsFrenzyUntil=clickFrenzyUntil=0; genBuilt=false; achBuilt=false; upSig=''; render(); renderAch(); flashSave('Fresh tub, fresh start.'); }},
     {label:'Keep playing',cls:'primary'}]);
}

/* ============================ Wiring ============================ */
el.clicker.addEventListener('click', popClick);
document.querySelectorAll('.buymode button').forEach(b=>b.addEventListener('click',()=>{
  document.querySelectorAll('.buymode button').forEach(x=>x.classList.remove('on'));
  b.classList.add('on');
  const v=b.dataset.buy; state.buyAmount = v==='max'?'max':parseInt(v,10);
}));
function activateTab(name){
  currentTab=name;
  document.querySelectorAll('.tabs button').forEach(x=>x.classList.toggle('on', x.dataset.tab===name));
  el.paneGen.hidden = name!=='gen'; el.paneUp.hidden = name!=='up'; el.paneAch.hidden = name!=='ach';
}
document.querySelectorAll('.tabs button').forEach(b=>b.addEventListener('click',()=>activateTab(b.dataset.tab)));
el.upnudge.addEventListener('click',()=>{
  activateTab('up');
  el.upnudge.hidden=true;
  document.querySelector('.right').scrollIntoView({behavior:'smooth', block:'start'});
});
$('btn-save').addEventListener('click',()=>save(false));
$('btn-export').addEventListener('click',doExport);
$('btn-import').addEventListener('click',doImport);
$('btn-reset').addEventListener('click',doReset);

el.ticker.innerHTML = TICKER.map(t=>`<span>${t}</span>`).join('') + TICKER.map(t=>`<span>${t}</span>`).join('');

function setBuyModeUI(){
  document.querySelectorAll('.buymode button').forEach(x=>x.classList.toggle('on', x.dataset.buy===String(state.buyAmount)));
}

/* ============================ Loop ============================ */
let last=performance.now();
function loop(now){
  const dt=Math.min((now-last)/1000, 1); last=now;
  const gain=effectiveCps()*dt;
  state.popcorn+=gain; state.totalPopcorn+=gain;
  updateGolden(dt);
  checkAchievements();
  render();
  requestAnimationFrame(loop);
}

/* ============================ Boot ============================ */
function boot(hot){
  if(hot && hot.state){ applyData(hot.state); }
  else { load(); }
  setBuyModeUI();
  render(); renderAch();
  last=performance.now();
  requestAnimationFrame(loop);

  setInterval(()=>save(true), 20000);
  document.addEventListener('visibilitychange',()=>{ if(document.hidden) save(true); });
  window.addEventListener('beforeunload',()=>save(true));
}

// hot-reload support so an update doesn't wipe an open game
try{ window.claude && window.claude.hot && window.claude.hot.snapshot && window.claude.hot.snapshot(()=>({state:JSON.parse(serialize())})); }catch(e){}
if(window.claude && window.claude.hot && window.claude.hot.ready){ window.claude.hot.ready(boot); }
else { boot(window.claude && window.claude.hot ? window.claude.hot.data : null); }
