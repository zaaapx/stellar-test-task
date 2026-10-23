// Fitting page: list of dresses + booking drawer (salon → date & time → contacts → done).
const listEl=document.getElementById('flList'),emptyEl=document.getElementById('flEmpty'),gridEl=document.getElementById('flGrid');
const fitSticky=document.getElementById('sticky');

let csUid=0;
// custom select (same look as the header dropdowns)
function csHTML(k,label,id,opts,val){const u='cs'+(++csUid);const cur=opts.find(o=>String(o.v)===String(val))||opts[0];
  return `<div class="cs" data-k="${k}"><span class="caps muted" id="${u}l">${label}</span>
    <button type="button" class="cs-t" aria-haspopup="listbox" aria-expanded="false" aria-controls="${u}m" aria-labelledby="${u}l ${u}v" data-key="${id}-${k}"><span id="${u}v">${cur.t}</span><svg class="ic chev" aria-hidden="true"><use href="#i-down"/></svg></button>
    <ul class="cs-m" id="${u}m" role="listbox" tabindex="-1" aria-labelledby="${u}l">${opts.map(o=>`<li role="option" data-v="${o.v}" aria-selected="${String(o.v)===String(cur.v)}"${o.off?' aria-disabled="true"':''}>${o.t}</li>`).join('')}</ul></div>`;}
function itemHTML(x){const d=CATALOG[x.id];
  const colorOpts=d.colors.map(c=>({v:c,t:c}));
  const sizeOpts=d.acc?[]:[{v:'',t:'Підберемо в салоні'}].concat(SIZES.map(s=>({v:s,t:d.off.includes(s)?s+' · немає':String(s),off:d.off.includes(s)})));
  return `<article class="fl-item" data-id="${x.id}">
    <a href="${d.url||'#'}"><img src="${d.img}" alt="${d.name}" width="120" height="180"></a>
    <div class="fl-info">
      <h3><a href="${d.url||'#'}">${d.name.replace(x.id,'<span style="white-space:nowrap">'+x.id+'</span>')}</a></h3>
      <p class="s muted">${metaOf(x.id)}</p>
      <p class="fl-price">${money(d.price)}</p>
    </div>
    <div class="fl-opts">
      ${csHTML('color','Колір',x.id,colorOpts,x.color)}
      ${d.acc?'':csHTML('size','Розмір EU',x.id,sizeOpts,x.size??'')}
    </div>
    <button type="button" class="fl-rm" aria-label="Прибрати ${x.id} з примірки"><svg class="ic"><use href="#i-close"/></svg><span>Прибрати</span></button>
  </article>`;}

function renderList(){const n=fit.items.length;
  gridEl.hidden=!n;emptyEl.hidden=!!n;
  const nd=fit.dressCount();document.getElementById('flCount').textContent=n?fitSummary(fit.items):'';
  listEl.innerHTML=fit.items.map(itemHTML).join('');
  document.getElementById('sumCount').textContent=fitSummary(fit.items)||'—';
  document.querySelectorAll('#flCap i').forEach((i,k)=>i.classList.toggle('on',k<nd));
  document.getElementById('sumLeft').textContent=nd<FIT_MAX?'Суконь можна додати ще '+(FIT_MAX-nd)+' з '+FIT_MAX:'Суконь максимум, аксесуари можна додавати';
  document.getElementById('stickyCount').textContent=n?fitSummary(fit.items):'Підбір стилістки';
  renderMore();stick();}
// custom select behaviour: mouse + keyboard (listbox pattern)
let csRefocus=null;
function csClose(cs,focus){if(!cs)return;cs.classList.remove('open');const t=cs.querySelector('.cs-t');t.setAttribute('aria-expanded','false');cs.querySelectorAll('li.act').forEach(l=>l.classList.remove('act'));if(focus)t.focus();}
function csOpen(cs){document.querySelectorAll('.cs.open').forEach(o=>o!==cs&&csClose(o));const r=cs.querySelector('.cs-t').getBoundingClientRect(),mh=Math.min(296,cs.querySelector('.cs-m').scrollHeight),bar=fitSticky.classList.contains('show')?fitSticky.offsetHeight:0;cs.classList.toggle('up',innerHeight-bar-r.bottom<mh+8&&r.top>mh+8);cs.classList.add('open');cs.querySelector('.cs-t').setAttribute('aria-expanded','true');
  const m=cs.querySelector('.cs-m');const sel=m.querySelector('[aria-selected="true"]')||m.querySelector('li:not([aria-disabled])');csAct(cs,sel);m.focus({preventScroll:true});}
function csAct(cs,li){cs.querySelectorAll('li.act').forEach(l=>l.classList.remove('act'));if(!li)return;li.classList.add('act');const m=cs.querySelector('.cs-m');if(!li.id)li.id=m.id+'-'+[...m.children].indexOf(li);m.setAttribute('aria-activedescendant',li.id);li.scrollIntoView({block:'nearest'});}
function csPick(cs,li){if(!li||li.getAttribute('aria-disabled'))return;const id=cs.closest('.fl-item').dataset.id,k=cs.dataset.k,v=li.dataset.v;
  csRefocus=cs.querySelector('.cs-t').dataset.key;csClose(cs);fit.update(id,{[k]:k==='size'?(v?+v:null):v});}
listEl.addEventListener('click',e=>{const t=e.target.closest('.cs-t');if(t){e.stopPropagation();const cs=t.closest('.cs');cs.classList.contains('open')?csClose(cs):csOpen(cs);return;}
  const li=e.target.closest('.cs-m li');if(li){e.stopPropagation();csPick(li.closest('.cs'),li);}});
listEl.addEventListener('keydown',e=>{const cs=e.target.closest('.cs');if(!cs)return;const open=cs.classList.contains('open');
  if(e.target.classList.contains('cs-t')&&['ArrowDown','ArrowUp','Enter',' '].includes(e.key)){e.preventDefault();csOpen(cs);return;}
  if(!open)return;const items=[...cs.querySelectorAll('li:not([aria-disabled])')];const act=cs.querySelector('li.act');let i=items.indexOf(act);
  if(e.key==='ArrowDown'){e.preventDefault();csAct(cs,items[Math.min(items.length-1,i+1)]);}
  else if(e.key==='ArrowUp'){e.preventDefault();csAct(cs,items[Math.max(0,i-1)]);}
  else if(e.key==='Home'){e.preventDefault();csAct(cs,items[0]);}else if(e.key==='End'){e.preventDefault();csAct(cs,items[items.length-1]);}
  else if(e.key==='Enter'||e.key===' '){e.preventDefault();csPick(cs,act);}
  else if(e.key==='Escape'){e.preventDefault();csClose(cs,true);}else if(e.key==='Tab'){csClose(cs);}});
listEl.addEventListener('mouseover',e=>{const li=e.target.closest('.cs-m li:not([aria-disabled])');if(li)csAct(li.closest('.cs'),li);});
document.addEventListener('click',()=>document.querySelectorAll('.cs.open').forEach(c=>csClose(c)));
document.addEventListener('fit:change',()=>setTimeout(()=>{if(csRefocus){const t=listEl.querySelector(`.cs-t[data-key="${csRefocus}"]`);csRefocus=null;t&&t.focus();}}));
listEl.addEventListener('click',e=>{const b=e.target.closest('.fl-rm');if(!b)return;const id=b.closest('.fl-item').dataset.id;fit.remove(id);
  say(id+' прибрано з примірки');const first=listEl.querySelector('.fl-rm');(first||document.querySelector('.fl-empty .btn'))?.focus();});

// "add more" cards: dresses that are not in the list yet
function renderMore(){const el=document.getElementById('moreCards');const ids=Object.keys(CATALOG).filter(id=>!isAcc(id)&&!fit.has(id));
  document.getElementById('more').hidden=!ids.length;
  el.innerHTML=ids.slice(0,4).map(id=>{const d=CATALOG[id];return `<a class="card" href="${d.url||'#'}"><div class="im"><img loading="lazy" src="${d.img.replace('width=400','width=600')}" alt="${id}"><button type="button" class="circ fav" data-fav="${id}" aria-label="Додати в обране" aria-pressed="false"><svg class="ic sm"><use href="#i-heart"/></svg></button><button type="button" class="circ fitb" data-fitadd="${id}" aria-label="Додати до примірки" aria-pressed="false"><svg class="ic sm"><use href="#i-hanger"/></svg></button></div><div class="meta"><span>${id}</span><span class="s muted">${d.coll} · ${d.sil}</span><span>${money(d.price)}</span></div></a>`;}).join('');
  el.querySelectorAll('a[href="#"]').forEach(a=>a.addEventListener('click',e=>e.preventDefault()));
  bindFavs(el);bindFitBtns(el);}
document.addEventListener('fit:change',renderList);

// ---------- booking drawer ----------
const st={city:'Чернівці',salon:0,date:null,time:null,step:1,view:null};
const SALONS={
  'Чернівці':[{n:'Шоурум Jeorjett',a:'Чернівці, вул. Головна, 120',h:'Пн–Сб 10:00–19:00'}],
  'Київ':[{n:'Салон-партнер «Bianca»',a:'Київ, вул. Велика Васильківська, 45',h:'Щодня 10:00–20:00'},{n:'Салон-партнер «White Room»',a:'Київ, просп. Берестейський, 12',h:'Пн–Сб 11:00–19:00'}],
  'Львів':[{n:'Салон-партнер «Aurelia»',a:'Львів, вул. Городоцька, 30',h:'Пн–Сб 10:00–19:00'}],
  'Одеса':[{n:'Салон-партнер «Mare»',a:'Одеса, вул. Дерибасівська, 15',h:'Щодня 10:00–19:00'}]};
const mapUrl=a=>'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(a);
function renderCities(){const el=document.getElementById('dCities');el.innerHTML='';Object.keys(SALONS).forEach(c=>{const b=document.createElement('button');b.type='button';b.textContent=c;b.className=c===st.city?'on':'';b.setAttribute('aria-pressed',c===st.city);b.onclick=()=>{st.city=c;st.salon=0;renderCities();renderSalons();};el.appendChild(b);});}
function renderSalons(){const el=document.getElementById('dSalons');el.innerHTML='';SALONS[st.city].forEach((s,i)=>{const d=document.createElement('div');d.className='salon'+(i===st.salon?' on':'');d.setAttribute('role','radio');d.setAttribute('aria-checked',i===st.salon);d.tabIndex=0;
  d.innerHTML=`<span class="rd"></span><div><p class="nm">${s.n}</p><p class="s sec">${s.a}</p><p class="s muted">${s.h}</p><a class="maplink" href="${mapUrl(s.a)}" target="_blank" rel="noopener">Відкрити в Google Maps<svg class="ic"><use href="#i-ext"/></svg></a></div>`;
  d.onclick=e=>{if(e.target.closest('a'))return;st.salon=i;renderSalons();};d.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();d.click();}};el.appendChild(d);});}
function renderDressList(){const el=document.getElementById('dDresses');
  el.innerHTML=fit.items.length?fit.items.map(x=>`<div class="dw-dress"><img src="${CATALOG[x.id].img}" alt=""><div><p>${CATALOG[x.id].name}</p><p class="s muted">${x.color}${isAcc(x.id)?'':' · '+(x.size?x.size+' EU':'розмір підберемо')}</p></div></div>`).join('')
    :'<div class="dw-dress"><div><p>Підбір стилістки</p><p class="s muted">Стилістка підготує 3–5 моделей під ваш запит</p></div></div>';}

const MONTHS=['січень','лютий','березень','квітень','травень','червень','липень','серпень','вересень','жовтень','листопад','грудень'];
const today=new Date();today.setHours(0,0,0,0);const maxDay=new Date(today);maxDay.setDate(maxDay.getDate()+60);
st.view=new Date(today.getFullYear(),today.getMonth(),1);
const avail=d=>d>today&&d<=maxDay&&d.getDay()!==0;
function renderCal(){const g=document.getElementById('calGrid');g.innerHTML='';const v=st.view;document.getElementById('calTitle').textContent=MONTHS[v.getMonth()]+' '+v.getFullYear();
  const first=(new Date(v.getFullYear(),v.getMonth(),1).getDay()+6)%7;const days=new Date(v.getFullYear(),v.getMonth()+1,0).getDate();
  for(let i=0;i<first;i++)g.appendChild(document.createElement('span'));
  for(let d=1;d<=days;d++){const dt=new Date(v.getFullYear(),v.getMonth(),d);const b=document.createElement('button');b.type='button';b.textContent=d;b.disabled=!avail(dt);
    if(st.date&&+st.date===+dt)b.className='on';b.onclick=()=>{st.date=dt;st.time=null;renderCal();renderSlots();updFoot();};g.appendChild(b);}
  document.getElementById('calPrev').disabled=v<=new Date(today.getFullYear(),today.getMonth(),1);
  document.getElementById('calNext').disabled=new Date(v.getFullYear(),v.getMonth()+1,1)>maxDay;}
document.getElementById('calPrev').onclick=()=>{st.view=new Date(st.view.getFullYear(),st.view.getMonth()-1,1);renderCal();};
document.getElementById('calNext').onclick=()=>{st.view=new Date(st.view.getFullYear(),st.view.getMonth()+1,1);renderCal();};
const SLOTS={'Ранок':['09:00','09:30','10:00','10:30','11:00','11:30'],'День':['12:00','12:30','13:00','14:00','14:30','15:00'],'Вечір':['16:00','16:30','17:00','17:30','18:00','18:30']};
function renderSlots(){const el=document.getElementById('slots');if(!st.date)return;el.innerHTML='';const k=st.date.getDate();
  Object.entries(SLOTS).forEach(([grp,ts])=>{const w=document.createElement('div');w.className='slot-g';w.innerHTML=`<p class="caps muted">${grp}</p>`;const r=document.createElement('div');r.className='slot-r';
    ts.forEach((t,i)=>{const b=document.createElement('button');b.type='button';b.textContent=t;b.disabled=((k+i*5)%4===0);if(st.time===t)b.className='on';b.onclick=()=>{st.time=t;renderSlots();updFoot();};r.appendChild(b);});w.appendChild(r);el.appendChild(w);});}

const drawer=document.getElementById('drawer'),ovl=document.getElementById('ovl'),nextB=document.getElementById('dwNext'),backB=document.getElementById('dwBack');
const TITLES={1:'Місто і салон',2:'Дата і час',3:'Ваші контакти'};
const fmtDate=d=>d.getDate()+' '+['січня','лютого','березня','квітня','травня','червня','липня','серпня','вересня','жовтня','листопада','грудня'][d.getMonth()]+', '+['нд','пн','вт','ср','чт','пт','сб'][d.getDay()];
let booked=[];
function summary(items){const s=SALONS[st.city][st.salon];
  const dl=items.length?'<ul>'+items.map(x=>`<li>${x.id} · ${x.color.toLowerCase()}${isAcc(x.id)?'':' · '+(x.size?x.size+' EU':'розмір підберемо')}</li>`).join('')+'</ul>':'Підбір стилістки';
  return `<dl><div><dt>Примірка</dt><dd>${dl}</dd></div><div><dt>Салон</dt><dd>${s.n}<br><span class="sec">${s.a}</span><br><a class="maplink" href="${mapUrl(s.a)}" target="_blank" rel="noopener">Відкрити в Google Maps<svg class="ic"><use href="#i-ext"/></svg></a></dd></div><div><dt>Дата</dt><dd>${st.date?fmtDate(st.date):'—'}</dd></div><div><dt>Час</dt><dd>${st.time||'—'}</dd></div></dl>`;}
const dForm=document.getElementById('dForm');
function valid3(){const f=dForm.elements;return f.name.value.trim().length>1&&f.phone.value.replace(/\D/g,'').length>=9&&f.ok.checked;}
function updFoot(){const s=st.step;nextB.disabled=(s===2&&!(st.date&&st.time))||(s===3&&!valid3());
  nextB.textContent=s===3?'Записатися':'Далі';backB.style.display=s===1?'none':'';
  document.querySelector('.dw-foot').style.gridTemplateColumns=s===1?'1fr':'1fr 2fr';}
function go(s){st.step=s;drawer.querySelectorAll('.step').forEach(x=>x.hidden=+x.dataset.step!==s);
  document.getElementById('dwTitle').textContent=TITLES[s];document.getElementById('dwStep').textContent='Крок '+s+' / 3';
  document.querySelectorAll('#dwBar i').forEach((b,k)=>b.classList.toggle('on',k<Math.min(s,3)));
  if(s===2){renderCal();renderSlots();}
  if(s===3)document.getElementById('dSum').innerHTML=summary(fit.items);
  document.getElementById('dwBody').scrollTop=0;updFoot();}
let lastFocus=null;
function openFit(){lastFocus=document.activeElement;renderDressList();renderCities();renderSalons();go(1);drawer.classList.add('on');ovl.classList.add('on');drawer.setAttribute('aria-hidden','false');document.body.classList.add('lock');stick();setTimeout(()=>document.getElementById('dwClose').focus(),300);}
function closeFit(toModal){drawer.classList.remove('on');ovl.classList.remove('on');drawer.setAttribute('aria-hidden','true');document.body.classList.remove('lock');
  stick();if(!toModal&&lastFocus&&document.contains(lastFocus))lastFocus.focus();}
document.querySelectorAll('[data-book]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();openFit();}));
document.getElementById('dwClose').onclick=()=>closeFit();ovl.onclick=()=>closeFit();
addEventListener('keydown',e=>{if(e.key==='Escape'&&drawer.classList.contains('on'))closeFit();});
nextB.onclick=()=>{if(st.step===3){if(valid3())submitBooking();return;}go(st.step+1);};
backB.onclick=()=>go(Math.max(1,st.step-1));
dForm.addEventListener('input',updFoot);dForm.addEventListener('change',updFoot);
drawer.addEventListener('keydown',e=>trap(drawer,e));

// ---------- confirmation popup over the fitting page ----------
const modal=document.getElementById('doneModal');let modalBack=null;
function submitBooking(){booked=fit.items.map(x=>({...x}));document.getElementById('dmSum').innerHTML=summary(booked);
  closeFit(true);st.date=null;st.time=null;dForm.reset();document.getElementById('slots').innerHTML='<p class="s muted">Оберіть дату, щоб побачити вільний час</p>';
  fit.clear();modalBack=document.querySelector('.fl-empty .btn')||document.body;modal.hidden=false;document.body.classList.add('lock');requestAnimationFrame(()=>modal.classList.add('on'));setTimeout(()=>document.getElementById('dmOk').focus(),50);stick();}
function closeModal(){modal.classList.remove('on');document.body.classList.remove('lock');setTimeout(()=>{modal.hidden=true;modalBack&&modalBack.focus&&modalBack.focus();},200);}
document.getElementById('dmOk').onclick=closeModal;document.getElementById('dmClose').onclick=closeModal;
modal.addEventListener('click',e=>{if(e.target===modal)closeModal();});
modal.addEventListener('keydown',e=>{trap(modal,e);if(e.key==='Escape')closeModal();});

// sticky bar (mobile): shown while the summary button is off-screen
const sumBtn=document.getElementById('sumBook');
function stick(){const r=sumBtn.getBoundingClientRect();const visible=!gridEl.hidden&&(r.top>innerHeight||r.bottom<0)&&!drawer.classList.contains('on');fitSticky.classList.toggle('show',visible);}
addEventListener('scroll',stick,{passive:true});addEventListener('resize',stick);
renderList();
