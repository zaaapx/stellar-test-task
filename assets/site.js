// Shared across pages: catalog, fitting list, favourites, toast, header menus.
const LB='https://luce.b-cdn.net/storage/shop/category/';
const SIZES=[34,36,38,40,42,44,46,48,50];
const CATALOG={
  'J-1165':{name:'Весільна сукня J-1165',coll:'Dazzle 2026',sil:'Русалка',price:42500,img:LB+'LaBoheme2026/Amanda/Amanda(1).jpg?width=400',colors:['Білий','Айворі'],off:[48,50],url:'index.html'},
  'J-1166':{name:'Весільна сукня J-1166',coll:'Dazzle 2026',sil:'Русалка',price:39900,img:LB+'JardindeLumiere/Bijou/Bijou_(4).jpg?width=400',colors:['Білий','Айворі'],off:[50]},
  'J-1167':{name:'Весільна сукня J-1167',coll:'Dazzle 2026',sil:'Пряма',price:36500,img:LB+'JardindeLumiere/Debora/Debora_(1).jpg?width=400',colors:['Білий','Айворі'],off:[34]},
  'J-1170':{name:'Весільна сукня J-1170',coll:'Dazzle 2026',sil:'Русалка',price:44900,img:LB+'JardindeLumiere/Elegance/Elegance_(6ROTATE).jpg?width=400',colors:['Айворі'],off:[]},
  'J-1174':{name:'Весільна сукня J-1174',coll:'Dazzle 2026',sil:'А-силует',price:38700,img:LB+'JardindeLumiere/Ethereal/Ethereal_(1Rotate).jpg?width=400',colors:['Білий','Айворі'],off:[]},
  'J-1175':{name:'Весільна сукня J-1175',coll:'Dazzle 2026',sil:'Пряма',price:35900,img:LB+'JardindeLumiere/Eveil/Eveil_(5).jpg?width=400',colors:['Айворі'],off:[50]},
  'J-1172':{name:'Весільна сукня J-1172',coll:'Dazzle 2026',sil:'Корсет',price:41200,img:LB+'JardindeLumiere/Gabi/Gabi_(2).jpg?width=400',colors:['Білий','Айворі'],off:[48]}
};
const FIT_MAX=5;
const money=n=>n.toLocaleString('uk-UA').replace(/,/g,' ')+' ₴';
const plural=(n,a,b,c)=>{const m=n%10,h=n%100;return n+' '+(m===1&&h!==11?a:m>=2&&m<=4&&(h<12||h>14)?b:c);};
const dresses=n=>plural(n,'сукня','сукні','суконь');

// storage is a convenience: the page works without it
const store={get(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d;}catch(e){return d;}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}}};

// ---------- fitting list ----------
const fit={
  items:store.get('jj-fit',[]).filter(x=>CATALOG[x.id]),
  has(id){return this.items.some(x=>x.id===id);},
  get(id){return this.items.find(x=>x.id===id);},
  save(){store.set('jj-fit',this.items);document.dispatchEvent(new CustomEvent('fit:change'));},
  add(item){if(this.has(item.id)){Object.assign(this.get(item.id),item);this.save();return true;}
    if(this.items.length>=FIT_MAX){say('До однієї примірки можна додати до '+FIT_MAX+' суконь');return false;}
    this.items.push(item);this.save();say(item.id+' додано до примірки',/fitting\.html$/.test(location.pathname)?null:{href:'fitting.html',label:'Перейти'});return true;},
  update(id,patch){const x=this.get(id);if(x){Object.assign(x,patch);this.save();}},
  remove(id){this.items=this.items.filter(x=>x.id!==id);this.save();},
  clear(){this.items=[];this.save();}
};
function renderFitCount(){const c=document.getElementById('fitCnt');if(c){c.textContent=fit.items.length;c.hidden=!fit.items.length;}
  const h=document.querySelector('.fithead');if(h)h.setAttribute('aria-label','Примірка'+(fit.items.length?', '+dresses(fit.items.length):''));}
document.addEventListener('fit:change',renderFitCount);

// ---------- toast ----------
const toastEl=document.getElementById('toast');let toastT;
function say(msg,link){toastEl.innerHTML='';const s=document.createElement('span');s.textContent=msg;toastEl.appendChild(s);
  if(link){const a=document.createElement('a');a.href=link.href;a.textContent=link.label;toastEl.appendChild(a);}
  toastEl.classList.toggle('link',!!link);toastEl.classList.add('on');clearTimeout(toastT);toastT=setTimeout(()=>toastEl.classList.remove('on'),link?4000:2200);}

// ---------- favourites ----------
const favs=new Set(store.get('jj-fav',[]));
function paintFav(key){const on=favs.has(key);document.querySelectorAll(`[data-fav="${CSS.escape(key)}"]`).forEach(b=>{b.classList.toggle('on',on);b.setAttribute('aria-pressed',on);b.setAttribute('aria-label',on?'Прибрати з обраного':'Додати в обране');const s=b.querySelector('span');if(s&&b.classList.contains('favmain'))s.textContent=on?'Збережено':'Зберегти';});
  const c=document.getElementById('favCnt');if(c){c.textContent=favs.size;c.hidden=!favs.size;}}
function toggleFav(key,label){const on=!favs.has(key);on?favs.add(key):favs.delete(key);store.set('jj-fav',[...favs]);paintFav(key);say(on?label+': додано в обране':label+': прибрано з обраного');}
function bindFavs(root=document){root.querySelectorAll('[data-fav]').forEach(b=>{if(b.dataset.bound)return;b.dataset.bound=1;paintFav(b.dataset.fav);
  b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();const k=b.dataset.fav;toggleFav(k,k==='J-1165'?'Сукня J-1165':k);});});}

// ---------- quick add to fitting from product cards ----------
function paintFitBtns(){document.querySelectorAll('[data-fitadd]').forEach(b=>{const on=fit.has(b.dataset.fitadd);b.classList.toggle('on',on);b.setAttribute('aria-pressed',on);b.setAttribute('aria-label',on?'Прибрати з примірки':'Додати до примірки');});}
function bindFitBtns(root=document){root.querySelectorAll('[data-fitadd]').forEach(b=>{if(b.dataset.bound)return;b.dataset.bound=1;
  b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();const id=b.dataset.fitadd;
    if(fit.has(id)){fit.remove(id);say(id+' прибрано з примірки');}else fit.add({id,color:CATALOG[id].colors.includes('Айворі')?'Айворі':CATALOG[id].colors[0],size:null});});});paintFitBtns();}
document.addEventListener('fit:change',paintFitBtns);

// ---------- header dropdowns, mobile menu ----------
document.querySelectorAll('.dd').forEach(dd=>{const t=dd.querySelector('.dd-t');let tm;
  const set=o=>{dd.classList.toggle('open',o);t.setAttribute('aria-expanded',o);};
  t.addEventListener('click',e=>{e.stopPropagation();const o=!dd.classList.contains('open');document.querySelectorAll('.dd.open').forEach(x=>x!==dd&&x.classList.remove('open'));set(o);});
  dd.addEventListener('mouseenter',()=>{if(matchMedia('(hover:hover)').matches){clearTimeout(tm);set(true);}});
  dd.addEventListener('mouseleave',()=>{if(matchMedia('(hover:hover)').matches)tm=setTimeout(()=>set(false),150);});
  dd.querySelectorAll('.dd-m a').forEach(a=>a.addEventListener('click',()=>{if(dd.classList.contains('lang')){t.firstChild.textContent=a.dataset.code;dd.querySelectorAll('a').forEach(x=>x.classList.toggle('on',x===a));}set(false);}));});
document.addEventListener('click',()=>document.querySelectorAll('.dd.open').forEach(d=>{d.classList.remove('open');d.querySelector('.dd-t').setAttribute('aria-expanded',false);}));
addEventListener('keydown',e=>{if(e.key==='Escape')document.querySelectorAll('.dd.open').forEach(d=>d.classList.remove('open'));});
function trap(panel,e){if(e.key!=='Tab')return;const f=[...panel.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex="0"]')].filter(x=>x.offsetParent!==null);if(!f.length)return;const a=f[0],z=f[f.length-1];if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus();}else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus();}}
const mmenu=document.getElementById('mmenu');
document.querySelector('.burger').onclick=()=>{mmenu.classList.add('on');mmenu.setAttribute('aria-hidden','false');document.body.classList.add('lock');setTimeout(()=>document.getElementById('mmClose').focus(),300);};
document.getElementById('mmClose').onclick=()=>{mmenu.classList.remove('on');mmenu.setAttribute('aria-hidden','true');document.body.classList.remove('lock');document.querySelector('.burger').focus();};
mmenu.addEventListener('keydown',e=>{trap(mmenu,e);if(e.key==='Escape')document.getElementById('mmClose').click();});
document.querySelectorAll('.mm-lang a').forEach(a=>a.addEventListener('click',()=>document.querySelectorAll('.mm-lang a').forEach(x=>x.classList.toggle('on',x===a))));
// demo links: don't jump to top
document.querySelectorAll('a[href="#"]').forEach(a=>a.addEventListener('click',e=>e.preventDefault()));

renderFitCount();bindFavs();bindFitBtns();
// keep tabs in sync when the list changes in another tab
addEventListener('storage',e=>{if(e.key==='jj-fit'){fit.items=store.get('jj-fit',[]).filter(x=>CATALOG[x.id]);document.dispatchEvent(new CustomEvent('fit:change'));}});
