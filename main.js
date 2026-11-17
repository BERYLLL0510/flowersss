import './style.css'

const flowers = [
  { id:'rose', name:'玫瑰', en:'Rose', type:'主花', color:'#db7880', emoji:'🌹', meaning:'熱烈而真誠的愛' },
  { id:'tulip', name:'鬱金香', en:'Tulip', type:'主花', color:'#f2a495', emoji:'🌷', meaning:'溫柔的自信' },
  { id:'sunflower', name:'向日葵', en:'Sunflower', type:'主花', color:'#e9b94c', emoji:'🌻', meaning:'永遠朝向光亮' },
  { id:'daisy', name:'雛菊', en:'Daisy', type:'配花', color:'#f7e9c9', emoji:'🌼', meaning:'簡單純粹的快樂' },
  { id:'cherry', name:'櫻花', en:'Cherry blossom', type:'配花', color:'#e8a9bb', emoji:'🌸', meaning:'珍惜每個當下' },
  { id:'lavender', name:'薰衣草', en:'Lavender', type:'配花', color:'#aa9bc9', emoji:'🪻', meaning:'安定而細膩的心' },
  { id:'eucalyptus', name:'尤加利', en:'Eucalyptus', type:'葉材', color:'#8ca98e', emoji:'🌿', meaning:'自在呼吸的勇氣' },
  { id:'fern', name:'蕨葉', en:'Fern', type:'葉材', color:'#648b68', emoji:'🌱', meaning:'靜靜生長的力量' },
]
const vases = [
  {id:'cream',name:'奶油陶瓶',shape:'vase-cream', color:'#eee1cb'},
  {id:'blue',name:'海霧玻璃瓶',shape:'vase-blue', color:'#b8d5d2'},
  {id:'pink',name:'蜜桃小花器',shape:'vase-pink', color:'#e8b6a8'},
  {id:'green',name:'森林陶瓶',shape:'vase-green', color:'#a8b79c'},
]
const app = document.querySelector('#app')
let bouquet = [], selected = null, activeFilter = '全部', profile = null

const svgFlower = (f, x, y, s, tilt=0, index=0) => {
  const colors = { rose:['#eea2a2','#d66d79'], tulip:['#ffd1b7','#e88f87'], sunflower:['#f7d26b','#b87932'], daisy:['#fff8e7','#e8c858'], cherry:['#f7cada','#d887a5'], lavender:['#c9b5dc','#8b75a6'], eucalyptus:['#bdd0b6','#829d86'], fern:['#a7c49e','#668b6b'] }
  const [petal, center] = colors[f.id] || ['#f3d8d4','#d79087']
  let head = ''
  if (f.id === 'rose') head = `<g>${[0,45,90,135,180,225,270,315].map(a=>`<ellipse cx="0" cy="-8" rx="8" ry="12" transform="rotate(${a})" fill="${petal}"/>`).join('')}<circle r="7" fill="${center}"/><path d="M-4 1Q0-7 5-1Q0 5-4 1" fill="#f7c7b0"/></g>`
  else if (f.id === 'sunflower') head = `<g>${Array.from({length:12},(_,i)=>`<ellipse cx="0" cy="-10" rx="5" ry="10" transform="rotate(${i*30})" fill="${petal}"/>`).join('')}<circle r="8" fill="#81512f"/><circle r="4" fill="#b47535"/></g>`
  else if (f.id === 'eucalyptus' || f.id === 'fern') head = `<g fill="${petal}"><ellipse cx="-9" cy="-10" rx="8" ry="4" transform="rotate(-32 -9 -10)"/><ellipse cx="9" cy="-21" rx="8" ry="4" transform="rotate(32 9 -21)"/><ellipse cx="-9" cy="-33" rx="8" ry="4" transform="rotate(-32 -9 -33)"/><ellipse cx="8" cy="-44" rx="8" ry="4" transform="rotate(32 8 -44)"/><ellipse cx="0" cy="-55" rx="6" ry="10"/></g>`
  else { const n=f.id==='lavender'?6:8; head = `<g>${Array.from({length:n},(_,i)=>`<ellipse cx="0" cy="-9" rx="5.5" ry="9" transform="rotate(${i*360/n})" fill="${petal}"/>`).join('')}<circle r="4.5" fill="${center}"/></g>` }
  return `<svg class="stem" data-index="${index}" data-id="${f.id}" style="left:${x}%;top:${y}%;--scale:${s};--tilt:${tilt}deg" viewBox="-34 -80 68 185" aria-label="${f.name}"><path d="M0 0Q${tilt>0?10:-10} 40 0 95" fill="none" stroke="#738c68" stroke-width="3" stroke-linecap="round"/><path d="M0 40Q-19 27-21 39Q-13 48 0 44M0 56Q18 43 21 54Q14 64 0 60" fill="#89a37c"/><g transform="translate(0 -4)">${head}</g></svg>`
}

function render() {
  app.innerHTML = `
    <header class="topbar"><a class="brand" href="#" aria-label="花日首頁"><span class="brand-mark">花</span><span>HANABI <small>FLOWER STUDIO</small></span></a><nav><a href="#story">花的故事</a><a href="#studio">開始創作</a></nav><button class="sound-btn" id="sound">♫ <span>一點音樂</span></button></header>
    <main>
      <section class="hero" id="story"><div class="hero-copy"><p class="eyebrow"><i></i> YOUR BIRTH FLOWER STUDIO</p><h1>把今天的你，<br/><em>插成一束花。</em></h1><p class="hero-text">每個生日，都有一朵花在等你。<br/>找到你的專屬花朵，再為它挑選喜歡的夥伴。</p><a class="primary-btn" href="#studio">找到我的生日花 <span>↗</span></a><p class="hero-note">一點生日靈感，一場自在的創作。</p></div><div class="hero-art"><div class="sun-orb"></div><div class="hero-flower f1">✿</div><div class="hero-flower f2">✿</div><div class="hero-flower f3">✿</div><div class="hero-stem s1"></div><div class="hero-stem s2"></div><div class="hero-jar"><div class="jar-neck"></div></div><span class="art-label">GROW IN YOUR OWN WAY</span></div><div class="side-note">NO. 01　｜　A FLOWER FOR YOU</div></section>
      <section class="studio-section" id="studio"><div class="section-heading"><p class="eyebrow"><i></i> MAKE YOUR OWN BOUQUET</p><h2>從一朵花，開始認識自己。</h2><p>不需要插花經驗，喜歡就是最好的搭配。</p></div>
        <div class="studio-shell"><aside class="controls"><div class="step-label"><span>01</span> 找到你的生日花 <small>YOUR FLOWER</small></div><form id="birth-form" class="birth-form"><label>出生年月日<input type="date" id="birthday" required max="${new Date().toISOString().slice(0,10)}" value="${profile?.birthday||''}"/></label><label>想收到怎樣的祝福？<select id="gender"><option value="不指定">不指定</option><option value="女性" ${profile?.gender==='女性'?'selected':''}>女性</option><option value="男性" ${profile?.gender==='男性'?'selected':''}>男性</option><option value="非二元／其他" ${profile?.gender==='非二元／其他'?'selected':''}>非二元／其他</option></select></label><button class="find-btn">抽出我的專屬花朵 <span>→</span></button></form><div id="birth-result" class="birth-result ${profile?'show':''}"></div>
          <div class="divider"></div><div class="step-label"><span>02</span> 挑選喜歡的花材 <small>FLOWERS</small></div><div class="filters">${['全部','主花','配花','葉材'].map(x=>`<button class="filter ${activeFilter===x?'active':''}" data-filter="${x}">${x}</button>`).join('')}</div><div id="flower-list" class="flower-list"></div><p class="tip">點一下花材，把它加入花束裡。</p><div class="step-label vase-label"><span>03</span> 選一只喜歡的花瓶 <small>VASE</small></div><div class="vase-options">${vases.map(v=>`<button class="vase-option ${window.currentVase===v.id?'chosen':''}" data-vase="${v.id}"><span class="mini-vase ${v.shape}"></span><span>${v.name}</span></button>`).join('')}</div></aside>
          <section class="canvas-area"><div class="canvas-top"><span>YOUR LITTLE GARDEN</span><button id="clear" class="clear-btn">重新開始 ↺</button></div><div class="canvas" id="canvas"><div class="canvas-glow"></div><div class="flower-art">${bouquet.map((b,i)=>svgFlower(b.flower,b.x,b.y,b.scale,b.tilt)).join('')}<div class="vase-main ${vases.find(v=>v.id===(window.currentVase||'cream')).shape}"><div class="vase-rim"></div><div class="vase-body"></div></div><div class="table-shadow"></div></div><div class="canvas-caption">${profile?`一束為 ${profile.gender==='不指定'?'你':profile.gender} 準備的花`:'每一枝花，都由你決定。'}</div></div><div class="canvas-bottom"><span><b>${bouquet.length.toString().padStart(2,'0')}</b> 枝花材</span><button id="save" class="save-btn" ${bouquet.length?'':'disabled'}>保存我的花束 <span>↗</span></button></div></section></div>
      </section>
      <section class="quote"><span>❋</span><p>花不必開得一樣。<br/><em>你也是。</em></p><small>TAKE YOUR TIME. GROW IN YOUR OWN WAY.</small></section>
    </main><footer><a class="brand" href="#"><span class="brand-mark">花</span><span>HANABI <small>FLOWER STUDIO</small></span></a><span>送給每一個正在長成自己的你。</span><span>© 2026 HANABI</span></footer><div id="toast" class="toast"></div>`
  renderFlowers(); bind()
  if(profile) showBirthResult()
}
function renderFlowers(){const el=document.querySelector('#flower-list');if(!el)return;el.innerHTML=flowers.filter(f=>activeFilter==='全部'||f.type===activeFilter).map(f=>`<button class="flower-card" data-flower="${f.id}"><span class="flower-icon" style="--flower-color:${f.color}">${f.emoji}</span><span class="flower-info"><b>${f.name}</b><small>${f.en}</small></span><span class="plus">＋</span></button>`).join('')}
function findFlower(date){const [y,m,d]=date.split('-').map(Number);const n=(y+m*3+d*7)%flowers.length;return flowers[n]}
function showBirthResult(){const f=profile.flower;const el=document.querySelector('#birth-result');el.classList.add('show');el.innerHTML=`<span class="result-flower" style="--flower-color:${f.color}">${f.emoji}</span><div><small>YOUR BIRTH FLOWER</small><strong>${f.name}</strong><p>${f.meaning}</p></div><button class="add-birth" data-flower="${f.id}">加入花束 ＋</button>`}
function toast(msg){const t=document.querySelector('#toast');t.textContent=msg;t.classList.add('visible');setTimeout(()=>t.classList.remove('visible'),2200)}
function addFlower(id){const f=flowers.find(x=>x.id===id);if(!f)return;const i=bouquet.length;bouquet.push({flower:f,x:31+((i*19)%42),y:15+((i*13)%30),scale:.83+(i%3)*.1,tilt:(i%2?1:-1)*(8+(i%4)*5)});render()}
function bind(){document.querySelector('#birth-form').addEventListener('submit',e=>{e.preventDefault();const date=document.querySelector('#birthday').value;if(!date)return;profile={birthday:date,gender:document.querySelector('#gender').value,flower:findFlower(date)};render();document.querySelector('#birth-result').scrollIntoView({block:'nearest',behavior:'smooth'})});document.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>{activeFilter=b.dataset.filter;document.querySelectorAll('[data-filter]').forEach(x=>x.classList.toggle('active',x===b));renderFlowers()});document.querySelectorAll('[data-flower]').forEach(b=>b.onclick=()=>addFlower(b.dataset.flower));document.querySelectorAll('[data-vase]').forEach(b=>b.onclick=()=>{window.currentVase=b.dataset.vase;render()});document.querySelectorAll('.stem').forEach(stem=>{let start=null;stem.addEventListener('pointerdown',e=>{start={x:e.clientX,y:e.clientY};stem.setPointerCapture(e.pointerId)});stem.addEventListener('pointermove',e=>{if(!start)return;const rect=document.querySelector('#canvas').getBoundingClientRect();const b=bouquet[Number(stem.dataset.index)];b.x=Math.max(5,Math.min(95,b.x+(e.clientX-start.x)/rect.width*100));b.y=Math.max(0,Math.min(80,b.y+(e.clientY-start.y)/rect.height*100));start={x:e.clientX,y:e.clientY};stem.style.left=`${b.x}%`;stem.style.top=`${b.y}%`});stem.addEventListener('pointerup',()=>start=null);stem.addEventListener('pointercancel',()=>start=null)});document.querySelector('#clear').onclick=()=>{bouquet=[];profile=null;render();toast('花束已重新開始')};document.querySelector('#save').onclick=()=>{const blob=new Blob([`<!doctype html><meta charset="utf-8"><title>我的花束</title><style>body{font:24px sans-serif;display:grid;place-items:center;height:100vh;background:#f8f5ef;color:#415044;text-align:center}div{padding:4rem}span{font-size:70px}</style><div><span>${bouquet.map(x=>x.flower.emoji).join(' ')}</span><h1>我的花束</h1><p>${profile?profile.flower.name+'・':''}${bouquet.map(x=>x.flower.name).join('、')}</p><p>花日 HANABI</p></div>`],{type:'text/html'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='我的花束.html';a.click();URL.revokeObjectURL(a.href);toast('已保存你的花束！')};document.querySelector('#sound').onclick=()=>toast('音樂即將為花園添上一點聲音 🌱')}
render()
