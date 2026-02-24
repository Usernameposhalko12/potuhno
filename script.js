

const accounts = {
  "OBSHAK123": "OBSHAK123"
};

let currentUser = null;
let balance = 0;

let inventory1 = [];
let usedPromos = [];

let lastPromoTimes = JSON.parse(localStorage.getItem(currentUser + "_lastPromoTimes") || "[]");

let blockedItems = new Set();
const qualities = [
  {name:"Прямо з цеху", chance:0.125},
  {name:"Після консервації", chance:0.25},
  {name:"Після уроку", chance:0.40},
  {name:"Зношена", chance:0.225}
];

function saveData() {
  if (!currentUser) return;
  localStorage.setItem(currentUser + "_balance", balance);

 

localStorage.setItem(currentUser + "_inventory1", JSON.stringify(inventory1));
  localStorage.setItem(currentUser + "_usedPromos", JSON.stringify(usedPromos));
  localStorage.setItem(currentUser + "_blockedItems", JSON.stringify(Array.from(blockedItems)));
}
  function loadData() {
  if (!currentUser) return;
  balance = parseInt(localStorage.getItem(currentUser + "_balance")) || 0;

lastPromoTimes = JSON.parse(localStorage.getItem(currentUser + "_lastPromoTimes") || "[]");
inventory1 = JSON.parse(localStorage.getItem(currentUser + "_inventory1")) || [];
  usedPromos = JSON.parse(localStorage.getItem(currentUser + "_usedPromos")) || [];
  blockedItems = new Set(JSON.parse(localStorage.getItem(currentUser + "_blockedItems")) || []);
}

function addBalance(amount) {
    if (typeof balance === "undefined") window.balance = 0;
    balance = Number(balance) || 0;
    balance += Number(amount);
    localStorage.setItem("balance", balance);
    const el = document.getElementById("balanceDisplay");
    if (el) el.textContent = balance;
    return balance;
}

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

function strToB64(str) {
  return window.btoa(unescape(encodeURIComponent(str)));
}

function b64ToStr(b64) {
  return decodeURIComponent(escape(window.atob(b64)));
}

function loginScreen() {
  document.getElementById("app").innerHTML = `
    <h2>Вхід у акаунт</h2>
    <input id="login" placeholder="Логін" /><br />
    <input id="password" placeholder="Пароль" type="password" /><br />
    <button onclick="login()">Увійти</button>
  `;
}

function login() {
  const loginVal = document.getElementById("login").value.trim();
  const passVal = document.getElementById("password").value;

  if (accounts[loginVal] && accounts[loginVal] === passVal) {
    currentUser = loginVal;
    loadData();
    mainMenu();
  } else {
    alert("Невірний логін або пароль");
  }
}

function logout() {
  saveData();

  currentUser = null;
  balance = 0;
  inventory1 = [];
  usedPromos = [];
  blockedItems.clear();

  loginScreen();
}


function mainMenu() {
  saveData();

 
  let html = `
    <!-- Верхня PNG-шапка -->
    <div style="text-align:center; position:relative; top:-83px;">
      <img src="img/top-banner.png"
           style="width:80%; max-width:480px; transform:scale(1.3);
                  filter:drop-shadow(0 4px 8px rgba(0,0,0,0.35));">
    </div>

    <!-- Контейнер меню -->
    <div style="
      position:relative;
      top:-150px;
      padding:20px;
      border-radius:18px;
      max-width:420px;
      margin:0 auto;
      background:rgba(255,255,255,0.15);
      backdrop-filter:blur(8px);
      box-shadow:0 0 18px rgba(0,0,0,0.25);
    ">
      <h2 style="text-align:center;margin:0;font-size:26px;font-weight:700;">
        Вітаю, ${currentUser}
      </h2>

      <p style="text-align:center;margin:4px 0 20px;font-size:17px;font-weight:500;">
        Баланс: <span style="font-weight:700; color:#ffe14d;">${balance}</span> Гривень
      </p>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        <button onclick="shopMenu()" class="menuButton">🛒 Магазин</button>
        <button onclick="promoMenu()" class="menuButton">🎁 Промокод</button>
<button onclick="showInventory()" class="menuButton">🎒 Інвентар (${inventory1.length})</button>
        <button onclick="arcadeMenu()" class="menuButton">🎮 Міні-ігри</button>
          <button onclick="openMarket()" class="menuButton"
        style="grid-column:1/3;background:#ffcc77;">
            🛒 Ринок
           </button>

        <button onclick="logout()" class="menuButton"
          style="grid-column:1/3;background:#ff4c4c;">
          🚪 Вийти
        </button>
      </div>
    </div>

  `;

  document.getElementById("app").innerHTML = html;
}

function shopMenu() {
  const shopItems = [
    { name: "Грошовий Кейс +", price: 25, img: "case_threecase.png", type: "threecase" },
    { name: "Грошовий Кейс", price: 20, img: "case_onecase.png", type: "onecase" },
    { name: "Грошовий Кейс Преміум", price: 30, img: "case_twocase.png", type: "twocase" }
  ];


  let html = `
    <div style="
      background: linear-gradient(135deg, #1b1b1b, #2b2b2b);
      padding: 20px;
      color: #fff;
      border-radius: 10px;
      box-shadow: 0 0 25px rgba(0,0,0,0.6);
      text-align:center;
    ">
      <h2 style="color:#ffd966; text-shadow:0 0 10px #ffcc00;">🛒 Магазин</h2>
      <div style="
        background:rgba(255,255,255,0.05);
        padding:8px 20px;
        border-radius:8px;
        display:inline-block;
        margin-bottom:20px;
        font-weight:bold;
      ">💰 Баланс: <span style="color:#00ff88;">${balance}</span> Гривень</div>

      <div style="display:flex; flex-wrap:wrap; gap:25px; justify-content:center;">
  `;

  shopItems.forEach(item => {
    html += `
      <div style="
        width:200px;
        background:rgba(255,255,255,0.05);
        border:1px solid rgba(255,255,255,0.1);
        border-radius:12px;
        box-shadow:0 0 10px rgba(0,0,0,0.4);
        padding:12px;
        text-align:center;
        transition:transform 0.2s ease, box-shadow 0.3s ease;
      " 
      onmouseover="this.style.transform='scale(1.05)'; this.style.boxShadow='0 0 18px rgba(255,255,255,0.2)';"
      onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 0 10px rgba(0,0,0,0.4)';"
      >
        <img src="img/${item.img}" width="150" style="border-radius:6px; margin-bottom:8px;"><br/>
        <b style="color:#ffd966;">${item.name}</b><br/>
        <button onclick="buyItem('${item.type}', ${item.price}, ${Boolean(item.isKey)})" style="
          margin-top:8px;
          background:linear-gradient(90deg, #ff9900, #ffcc00);
          border:none;
          padding:8px 15px;
          color:#222;
          border-radius:6px;
          font-weight:bold;
          cursor:pointer;
          transition:all 0.2s;
        " 
        onmouseover="this.style.background='linear-gradient(90deg,#ffaa00,#ffee66)';"
        onmouseout="this.style.background='linear-gradient(90deg,#ff9900,#ffcc00)';"
        >Купити за ${item.price} 💰</button>
      </div>
    `;
  });

  html += `
      </div>
      <br/>
      <button onclick="mainMenu()" style="
        margin-top:15px;
        background:linear-gradient(90deg, #888, #bbb);
        border:none;
        padding:8px 15px;
        border-radius:8px;
        font-weight:bold;
        cursor:pointer;
      ">⬅️ Назад</button>
    </div>
  `;

  document.getElementById("app").innerHTML = html;
}

function buyItem(type, cost) {
  if (balance < cost) {
    alert("Недостатньо гривень!");
    return;
  }

  balance -= cost;
  addCase(type);

  saveData();
  alert("Купівля успішна!");
  shopMenu();
}

function addCase(caseType, count = 1){
  for(let i = 0; i < count; i++){
    inventory1.push({
      id: `${caseType}_${Date.now()}_${Math.random().toString(36).slice(2,7)}`,
      type: "case",
      caseType
    });
  }
  saveData();
}

function showInventory() {
  let html = `<h2>🎒 Інвентар</h2>`;

  if (!inventory1.length) {
    html += `<div class="alert">Інвентар порожній</div>`;
  } else {
    html += `<div class="inventory-grid">`;

    inventory1.forEach((item, idx) => {
      const locked = blockedItems.has(item.id);

      html += `
        <div class="inv-card ${locked ? "inv-locked" : ""}">
          <div class="item-name" style="
            font-weight:bold;
            margin-bottom:6px;
            word-wrap: break-word;
            word-break: break-word;
            hyphens: auto;
            text-align:center;
          ">
            ${item.type === "case"
              ? "Кейс: " + getCaseName(item.caseType)
              : item.name
            }
          </div>

          <img src="img/${item.type === "case"
            ? "case_" + item.caseType + ".png"
            : item.img
          }" width="120">

          ${item.rarity ? `
            <div class="rarity-badge" style="background:${getRarityColor(item.rarity)}">
              Рідкість: ${item.rarity}
            </div>` : ""}

          ${item.quality ? `
            <div class="quality-badge" style="background:${getQualityColor(item.quality)}">
              Якість: ${item.quality}
            </div>` : ""}

          ${item.premium ? `
            <div class="quality-badge" style="background:#f5d300;color:#000">
              ⭐ Преміум
            </div>` : ""}

 ${item.type === "case"
  ? `<button onclick="openCase(${idx})" ${locked ? "disabled" : ""}>Відкрити</button>`
  : ""}
          <button onclick="toggleBlock(${idx})">
            ${locked ? "Розблокувати" : "Заблокувати"}
          </button>

          <button onclick="deleteItem(${idx})" ${locked ? "disabled" : ""}>
            Видалити
          </button>
        </div>
      `;
    });

    html += `</div>`;
  }

  html += `<br><button onclick="mainMenu()">Назад</button>`;
  document.getElementById("app").innerHTML = html;
}

function viewItem(idx){
  const i = inventory[idx];
  if(!i) return;

  const date = i.createdAt
    ? new Date(i.createdAt).toLocaleString("uk-UA", {hour12:false})
    : "Невідомо";

  document.getElementById("app").innerHTML = `
    <h2>📜 Історія предмета</h2>

    <div style="
      max-width:240px;
      margin:20px auto;
      background: rgba(210, 190, 150, 0.75);
      padding:15px;
      border-radius:18px;
      border:2px solid #a88963;
      box-shadow:0 0 25px rgba(120,90,50,0.6);
      color:#2b1d0e;
      text-align:center;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    ">
      <b>${i.name || getCaseName(i.caseType)}</b><br>
      <img src="img/${i.img || `case_${i.caseType}.png`}" width="140" style="border-radius:12px;margin:10px 0;"><br>
      
      ${i.rarity ? `<div style="background:${getRarityColor(i.rarity)};padding:4px 6px;border-radius:8px;margin-top:5px;color:#fff;font-weight:bold;">
        Рідкість: ${i.rarity}
      </div>` : ""}

      ${i.quality ? `<div style="background:${getQualityColor(i.quality)};padding:3px 6px;border-radius:8px;margin-top:4px;color:#fff;font-weight:bold;">
        Якість: ${i.quality}
      </div>` : ""}

      ${i.premium ? `<div style="background:#f5d300;color:#000;padding:3px 6px;border-radius:8px;margin-top:4px;font-weight:bold;">
        ⭐ Преміум
      </div>` : ""}

 <p style="margin-top:8px;">🎁 Кейс: <b>${
  i.fromCase ? getCaseName(i.fromCase) : "Невідомо"
}</b></p>
      <p>🕒 Дата вибиття: <b>${date}</b></p>
      <small>ID: ${i.id}</small>
    </div>

    <button onclick="showInventory()" style="
      background: linear-gradient(45deg, #b89b72, #e0c49a);
      border:none;
      padding:10px 20px;
      border-radius:16px;
      cursor:pointer;
      color:#2b1d0e;
      font-weight:bold;
      margin:auto;
      display:block;
      box-shadow:0 4px 0 #8b6b45, 0 0 12px rgba(120,90,50,0.6);
      ">Назад</button>
  `;
}

/* ================== BLOCK / DELETE ================== */
function toggleBlock(idx){
  const i = inventory1[idx];
  if(!i) return;

  blockedItems.has(i.id)
    ? blockedItems.delete(i.id)
    : blockedItems.add(i.id);

  saveData();
  showInventory();
}

function deleteItem(idx){
  const i = inventory1[idx];
  if(!i) return;

  if(blockedItems.has(i.id)){
    alert("Предмет заблокований!");
    return;
  }

  inventory1.splice(idx,1);
  saveData();
  showInventory();
}

/* ================== ADD ITEM FROM CASE ================== */

function addItemFromCase(item, caseType){
  const newItem = {
    ...item,
    id: crypto.randomUUID(),        // унікальний ID
    createdAt: Date.now(),          // час отримання
    fromCase: caseType              // з якого кейсу
  };
  inventory1.push(newItem);
  saveData();
  return newItem; // повертаємо новий об'єкт на всяк випадок
}

function getCaseName(type){
  if(type === "threecase") return "Грошовий Кейс +";
  if(type === "twocase") return "Грошовий Кейс Преміум";
  if(type === "onecase") return "Грошовий Кейс";
return "Невідомий кейс";
}

// ===================== ANIMATION CONFIG =====================
const ANIM = {
  itemsCount: 41,
  itemWidth: 150,
  itemGap: 15,
  duration: 6300,
  containerWidth: 700
};

// ===================== UI PREVIEW POOL (FIX) =====================
const _previewPoolCache = new WeakMap();

function buildPreviewPool(dropFunc, tries = 3000){
  if(_previewPoolCache.has(dropFunc)){
    return _previewPoolCache.get(dropFunc);
  }

  const map = {};
  for(let i = 0; i < tries; i++){
    const d = dropFunc();
    map[d.name] = d; // унікальність
  }

  const pool = Object.values(map);
  _previewPoolCache.set(dropFunc, pool);
  return pool;
}

// ===================== OPEN CASE =====================

function openCase(idx){
  if(!inventory1[idx]) return;
  const item = inventory1[idx];
  if(item.type !== "case") return;

  let dropFunc = null;
  switch(item.caseType){
    case "threecase": dropFunc = dropAutumnCase; break;
    case "twocase": dropFunc = dropAbsoluteCase; break;
    case "onecase": dropFunc = dropBoxCase; break;
    default: alert("Невідомий тип кейсу"); return;
  }

  const finalDrop = dropFunc();

  showCasePreview(dropFunc, item.caseType, () => {
    inventory1.splice(idx, 1);
    animateCaseOpening(finalDrop, dropFunc, item.caseType);
  });
}

// ===================== PREVIEW (FIXED) =====================
function showCasePreview(dropFunc, caseType, onOpen){
  const app = document.getElementById("app");

  // 🔥 FIX: ПОВНИЙ ПУЛ, НЕ RNG
  const items = buildPreviewPool(dropFunc);

  const rarityTabs = {
    "Спеціальні": [],
    "Секретні": [],
    "Епічні": [],
    "Виняткові": [],
    "Звичайні": []
  };

  items.forEach(item=>{
    if(item.rarity==="Спеціальна") rarityTabs["Спеціальні"].push(item);
    else if(item.rarity==="Секретна") rarityTabs["Секретні"].push(item);
    else if(item.rarity==="Епічна") rarityTabs["Епічні"].push(item);
    else if(item.rarity==="Виняткова") rarityTabs["Виняткові"].push(item);
    else rarityTabs["Звичайні"].push(item);
  });

  const tabsButtons = Object.keys(rarityTabs).map(r=>
    `<button class="rarity-tab" data-tab="${r}" style="margin:5px;padding:5px 12px;cursor:pointer;">${r}</button>`
  ).join("");

  app.innerHTML = `
    <h2>${getCaseName(caseType)} — можливі предмети</h2>

    <div id="roulette" style="overflow:hidden;width:${ANIM.containerWidth}px;margin:20px auto;position:relative;background:#111;padding:12px;border:4px solid gold;border-radius:8px;">
      <div id="roulette-strip" style="display:flex;align-items:center;"></div>
      <div id="roulette-arrow" style="position:absolute;top:0;bottom:0;left:50%;width:4px;background:red;transform:translateX(-50%);"></div>
    </div>

    <div id="rarity-buttons" style="text-align:center;">${tabsButtons}</div>

    <div id="rarity-panels" style="margin-top:15px;">
      ${Object.keys(rarityTabs).map(r=>{
        const html = rarityTabs[r].map(p=>{
          const c = getRarityColor(p.rarity);
          return `
            <div style="width:100px;background:#111;border:2px solid ${c};border-radius:6px;padding:6px;text-align:center;margin:5px;display:inline-block;">
              <img src="img/${p.img}" width="80">
              <div style="font-size:12px;color:${c};font-weight:bold;">${p.name}</div>
            </div>
          `;
        }).join("");
        return `<div class="rarity-panel" data-panel="${r}" style="display:none;background:#222;padding:10px;border-radius:6px;">${html}</div>`;
      }).join("")}
    </div>

    <div style="text-align:center;margin-top:20px;">
      <button id="open-case-btn" style="font-size:18px;padding:10px 30px;background:gold;color:#111;border-radius:6px;cursor:pointer;font-weight:bold;">🎰 ВІДКРИТИ</button>
      <button id="cancel-case-btn" style="font-size:18px;padding:10px 30px;background:#888;color:#fff;border-radius:6px;cursor:pointer;font-weight:bold;margin-left:10px;">❌ ВІДМІНИТИ</button>
    </div>
  `;

  const panels = document.querySelectorAll(".rarity-panel");
  if(panels.length) panels[0].style.display="block";

  document.querySelectorAll(".rarity-tab").forEach(btn=>{
    btn.onclick = ()=>{
      panels.forEach(p=>p.style.display="none");
      document.querySelector(`.rarity-panel[data-panel="${btn.dataset.tab}"]`).style.display="block";
    };
  });

  document.getElementById("open-case-btn").onclick = onOpen;
  document.getElementById("cancel-case-btn").onclick = showInventory;

// ---------- РУЛЕТКА ПРЕВ’Ю (НЕ RNG) ----------
  const strip = document.getElementById("roulette-strip");
  for(let i=0;i<ANIM.itemsCount;i++){
    const p = items[Math.floor(Math.random()*items.length)];
    const el = document.createElement("div");
    el.style.width = ANIM.itemWidth+"px";
    el.style.flex = `0 0 ${ANIM.itemWidth}px`;
    el.style.margin = `0 ${ANIM.itemGap/2}px`;
    const color = getRarityColor(p.rarity);
    el.style.boxShadow = `0 0 12px ${color}`;
    el.innerHTML = `
  <img src="img/${p.img}" width="${ANIM.itemWidth-20}" style="display:block;margin:0 auto;">
  <div style="color:${color};font-weight:bold;text-align:center;">${p.name}</div>
`;
    strip.appendChild(el);
  }
}

// ===================== OPENING ANIMATION (UNCHANGED) =====================
function animateCaseOpening(finalDrop, dropFunc, caseType){
  const cfg = ANIM;
  const app = document.getElementById("app");

  app.innerHTML = `
    <h2>Відкриття ${getCaseName(caseType)}...</h2>
    <div id="roulette" style="overflow:hidden;width:${cfg.containerWidth}px;margin:20px auto;position:relative;background:#111;padding:12px;border:4px solid gold;border-radius:8px;">
      <div id="roulette-strip" style="display:flex;align-items:center;"></div>
      <div id="roulette-arrow" style="position:absolute;top:0;bottom:0;width:4px;background:red;"></div>
    </div>
  `;

  const strip = document.getElementById("roulette-strip");
  const centerIndex = Math.floor(cfg.itemsCount / 2);
  const pool = [];

  for(let i=0;i<cfg.itemsCount;i++) pool.push(dropFunc());
  pool[centerIndex] = finalDrop;

  pool.forEach(p=>{
    const el = document.createElement("div");
    el.style.width = cfg.itemWidth+"px";
    el.style.flex = `0 0 ${cfg.itemWidth}px`;
    el.style.margin = `0 ${cfg.itemGap/2}px`;
    const color = getRarityColor(p.rarity);
    el.style.boxShadow = `0 0 12px ${color}`;
    

el.innerHTML = `
  <img src="img/${p.img}" width="${cfg.itemWidth-20}" style="display:block;margin:0 auto;">
  <div style="color:${color};font-weight:bold;text-align:center;">${p.name}</div>
`;

    strip.appendChild(el);
  });

const arrow = document.getElementById("roulette-arrow");
arrow.style.left = `calc(50% + ${Math.floor(Math.random()*11-5)}px)`;

const step = cfg.itemWidth + cfg.itemGap;
const targetX = -(centerIndex*step - (cfg.containerWidth/2 - cfg.itemWidth/2));

requestAnimationFrame(()=>{
  strip.style.transition = `transform ${cfg.duration}ms cubic-bezier(.15,.85,.25,1)`;
  strip.style.transform = `translateX(${targetX}px)`;
});

strip.addEventListener("transitionend", () => {
  const winEl = strip.children[centerIndex];
  winEl.style.transform = "scale(1.3)";
  winEl.style.boxShadow = "0 0 50px gold";

  // Додаємо предмет через глобальну функцію
  addItemFromCase(finalDrop, caseType);

  setTimeout(() => {
    alert(`Ви отримали: ${finalDrop.name}`);
    showInventory();
  }, 600);
}, { once: true });
}

function dropAbsoluteCase(){
  const pool = [
    {name:"500 Гривень", img:"500.png", rarity:"Спеціальна", chance:0.001},
    {name:"200 Гривень", img:"200.png", rarity:"Секретна", chance:0.01},
    {name:"100 Гривень", img:"100.png", rarity:"Секретна", chance:0.015},
    {name:"50 Гривень", img:"50.png", rarity:"Епічна", chance:0.054},
    {name:"20 Гривень", img:"20.png", rarity:"Виняткова", chance:0.10},
    {name:"10 Гривень", img:"10.png", rarity:"Виняткова", chance:0.15},
    {name:"5 Гривень", img:"5.png", rarity:"Звичайна", chance:0.27},
    {name:"1 Гривня", img:"1.png", rarity:"Звичайна", chance:0.40}
  ]

  let r = Math.random(), sum = 0;
  for(const p of pool){
    sum += p.chance;
    if(r < sum) return createItem(p);
  }
  return createItem(pool[pool.length-1]);
}

function dropByRates(rates){
  const r = Math.random();
  let sum = 0;
  for(const key in rates){
    sum += rates[key];
    if(r < sum) return key;
  }
  return Object.keys(rates)[Object.keys(rates).length - 1];
}

function chooseQuality(){
  let r = Math.random();
  let cumulative = 0;
  for (const q of qualities){
    cumulative += q.chance;
    if (r < cumulative) return q.name;
  }
  return qualities[qualities.length - 1].name; // на всяк випадок
}

function isPremiumApplicable(quality){
  return quality !== "Зношена";
}

function maybePremium(quality){
  if(!isPremiumApplicable(quality)) return false;
  return Math.random() < 0.05; 
}

function createItem(base){
  const quality = chooseQuality();
  const premium = maybePremium(quality);
  return {
    id: generateId(),
    type: "item",
    name: base.name,
    img: base.img,
    rarity: base.rarity,
    quality,
    premium
  };
}

// Предмети по рідкості
const itemsPool = {
  secret: [
    {name:"200 Гривень", img:"200.png", rarity:"Секретна"},
    {name:"100 Гривень", img:"100.png", rarity:"Секретна"}
  ],
  epic: [
    {name:"50 Гривень", img:"50.png", rarity:"Епічна"}
  ],
  exceptional: [
    {name:"20 Гривень", img:"20.png", rarity:"Виняткова"},
    {name:"10 Гривень", img:"10.png", rarity:"Виняткова"}
  ],
  common: [
    {name:"5 Гривень", img:"5.png", rarity:"Звичайна"},
    {name:"1 Гривня", img:"1.png", rarity:"Звичайна"}
  ]
};

function dropAutumnCase(){
  const rates = {secret:0.01, epic:0.05, exceptional:0.35, common:0.59};
  let rarity = dropByRates(rates);

  if(rarity === "secret"){
    const choice = itemsPool.secret[Math.floor(Math.random() * itemsPool.secret.length)];
    return createItem(choice);
  }

  if(rarity === "epic"){
    const choice = itemsPool.epic[Math.floor(Math.random() * itemsPool.epic.length)];
    return createItem(choice);
  }

  if(rarity === "exceptional"){
    const choice = itemsPool.exceptional[Math.floor(Math.random() * itemsPool.exceptional.length)];
    return createItem(choice);
  }

  const choice = itemsPool.common[Math.floor(Math.random() * itemsPool.common.length)];
  return createItem(choice);
}

function dropBoxCase(){
  const rates = {secret:0.01, epic:0.5, exceptional:0.30, common:0.64};
  let rarity = dropByRates(rates);

  if(rarity === "secret"){
    return createItem(itemsPool.secret.find(i => i.name === "100 Гривень"));
  }

  if(rarity === "epic"){
    const choice = itemsPool.epic[Math.floor(Math.random() * itemsPool.epic.length)];
    return createItem(choice);
  }

  if(rarity === "exceptional"){
    const choice = itemsPool.exceptional[Math.floor(Math.random() * itemsPool.exceptional.length)];
    return createItem(choice);
  }

  const choice = itemsPool.common[Math.floor(Math.random() * itemsPool.common.length)];
  return createItem(choice);
}

function getRarityColor(rarity){
  switch(rarity){
    case "Спеціальна": return "#FFD700";
    case "Секретна": return "#cc0033";
    case "Епічна": return "#9933ff";
    case "Виняткова": return "#3399ff";
    case "Звичайна": return "#33cc33";
    default: return "#888";
  }
}

function getQualityColor(quality){
  switch(quality){
    case "Прямо з цеху": return "#e6d31f";
    case "Після консервації": return "#e67e22";
    case "Після уроку": return "#2980b9";
    case "Зношена": return "#555";
    default: return "#888";
  }
}

// ==== PROMO CODES ====

const promoCodesBase64 = {
  [strToB64("TEST100")]: { type: "infinite", reward: () => addBalance(100) },

  [strToB64("TEST50")]: { type: "infinite", reward: () => addBalance(50) },

  [strToB64("TEST20")]: { type: "infinite", reward: () => addBalance(20) },

  [strToB64("TEST10")]: { type: "infinite", reward: () => addBalance(10) },

  [strToB64("CASE1")]: { type: "infinite", reward: () => addCase("onecase") }
};

function promoMenu() {


  const recentTimes = lastPromoTimes
    .slice()
    .reverse()
    .map(t => {
      const d = new Date(t);
      return `<li>${d.toLocaleString("uk-UA", {hour12:false})}</li>`;
    })
    .join("");

  let html = `
    <h2>Введіть промокод</h2>
    <input id="promoInput" placeholder="Промокод" /><br/>
    <button onclick="applyPromo()">Активувати</button><br/><br/>

    <h3>Останні використання:</h3>
    <ul style="max-height:200px; overflow-y:auto; padding-left:20px;">
      ${recentTimes || "<li>Поки немає записів</li>"}
    </ul>

    <button onclick="mainMenu()">Назад</button>
  `;
  document.getElementById("app").innerHTML = html;
}

function applyPromo() {
  const code = document.getElementById("promoInput").value.trim();
  if (!code) {
    alert("Введіть промокод");
    return;
  }

  const codeB64 = strToB64(code);

  if (!promoCodesBase64[codeB64]) {
    alert("Промокод не знайдено");
    return;
  }

  if (promoCodesBase64[codeB64].type === "once" && usedPromos.includes(codeB64)) {
    alert("Цей промокод вже використаний");
    return;
  }

  promoCodesBase64[codeB64].reward();

  if (promoCodesBase64[codeB64].type === "once") {
    usedPromos.push(codeB64);
  }

  const now = new Date().toISOString();
  lastPromoTimes.push(now);
  if (lastPromoTimes.length > 10) lastPromoTimes.shift();

  saveData();
  localStorage.setItem(currentUser + "_lastPromoTimes", JSON.stringify(lastPromoTimes));

  alert("Промокод активовано!");
  promoMenu();
}

// ==== РОЗШИРЕННЯ saveData() ====
const originalSaveData = saveData;
saveData = function() {
  if (!currentUser) return;
  originalSaveData();
  localStorage.setItem(currentUser + "_lastPromoTimes", JSON.stringify(lastPromoTimes));
};

function arcadeMenu() {
  const html = `
    <div style="
      max-width:480px;
      margin:20px auto;
      padding:20px;
      background: rgba(20,20,20,0.85);
      border-radius:18px;
      box-shadow: 0 0 25px rgba(0,0,0,0.6);
      color: #fff;
      text-align:center;
    ">
      <h2 style="font-size:28px; color:#ffd966; margin-bottom:10px;">🎮 Міні-ігри</h2>
      <div style="
        background: rgba(255,255,255,0.05);
        padding:10px 15px;
        border-radius:10px;
        margin-bottom:20px;
        font-weight:bold;
        font-size:16px;
        color:#00ff88;
      ">
        💰 Баланс: ${balance} Гривень
      </div>

      <div style="display:flex; flex-direction:column; gap:15px;">
        <button onclick="startSaperPaid()" ${balance < 20 ? "disabled" : ""}
          style="
            padding:15px;
            font-size:18px;
            border:none;
            border-radius:12px;
            background: linear-gradient(90deg,#ff9900,#ffcc00);
            color:#222;
            font-weight:bold;
            cursor:pointer;
            box-shadow:0 0 12px rgba(255,204,0,0.5);
            transition: transform 0.2s, box-shadow 0.2s;
          "
          onmouseover="this.style.transform='scale(1.05)'; this.style.boxShadow='0 0 18px rgba(255,204,0,0.8)';"
          onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 0 12px rgba(255,204,0,0.5)';"
        >
          Сапер (20 Гривень)
        </button>
      </div>

      <button onclick="mainMenu()" style="
        margin-top:25px;
        padding:12px 25px;
        font-size:16px;
        border:none;
        border-radius:12px;
        background:#888;
        color:#fff;
        font-weight:bold;
        cursor:pointer;
        transition:0.15s;
      "
      onmouseover="this.style.background='#aaa';"
      onmouseout="this.style.background='#888';"
      >⬅ Назад</button>
    </div>
  `;

  document.getElementById("app").innerHTML = html;
}

     
// ===== Сапер =====
function startSaperPaid() {
    if (balance < 20) {
        alert("Недостатньо Гривень для гри в Сапер!");
        return;
    }
    addBalance(-20);
    startSaper();
}

function startSaper() {
    let rows = 8, cols = 8, minesCount = 10;
    let board = [], revealed = [], exploded = false, saperScore = 0;

    for (let r = 0; r < rows; r++) {
        board[r] = []; revealed[r] = [];
        for (let c = 0; c < cols; c++) { board[r][c] = 0; revealed[r][c] = false; }
    }

    let placed = 0;
    while (placed < minesCount) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * cols);
        if (board[r][c] === 0) { board[r][c] = "M"; placed++; }
    }

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (board[r][c] === "M") continue;
            let count = 0;
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    let nr = r + dr, nc = c + dc;
                    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && board[nr][nc] === "M") count++;
                }
            }
            board[r][c] = count;
        }
    }

    window.reveal = function (r, c) {
        if (revealed[r][c] || exploded) return;
        revealed[r][c] = true;

        if (board[r][c] === "M") {
            exploded = true;
            saperScore = 0;
        } else {
            let oldScore = saperScore;
            saperScore += 4;

            let oldMilestone = Math.floor(oldScore / 30);
            let newMilestone = Math.floor(saperScore / 30);
            if (newMilestone > oldMilestone) giveArcadeRewards(saperScore);
        }

        renderBoard();
    };

    function renderBoard() {
        let html = `
        <div style="
            margin:auto;
            padding:20px;
            width:fit-content;
            background:rgba(0,0,0,0.45);
            border-radius:12px;
            box-shadow:0 0 18px rgba(0,0,0,0.6);
            text-align:center;
            color:white;
        ">
            <h2 style="margin-top:0;font-size:28px;letter-spacing:1px;">💣 САПЕР</h2>
            <p style="font-size:18px;margin-bottom:18px;">Очки:
                <span style="font-weight:bold;color:#ffd64a;">${saperScore}</span>
            </p>

            <div style="
                display:grid;
                grid-template-columns: repeat(${cols}, 42px);
                gap:6px;
                margin:auto;
            ">
        `;

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                let isOpen = revealed[r][c];
                let isMine = board[r][c] === "M";

                let bg = isOpen ? "#2d2d2d" : "#4e4e4e";
                let cellContent = "";

                if (isOpen && isMine) {
                    cellContent = "💣";
                    bg = "#8b1e1e";
                }

                html += `
                <div onclick="reveal(${r},${c})"
                    style="
                        width:42px;
                        height:42px;
                        display:flex;
                        align-items:center;
                        justify-content:center;
                        font-size:22px;
                        border-radius:6px;
                        cursor:pointer;
                        user-select:none;
                        background:${bg};
                        color:white;
                        box-shadow: inset 0 0 4px rgba(0,0,0,0.6);
                        transition:0.15s;
                    "
                    onmouseover="this.style.filter='brightness(1.18)'"
                    onmouseout="this.style.filter='brightness(1)'"
                >${cellContent}</div>`;
            }
        }

        html += `</div>`;

        if (!exploded) {
            html += `
            <button onclick="stopSaper()" style="
                margin-top:18px;
                padding:10px 20px;
                background:#ffaa2b;
                border:0;
                border-radius:8px;
                font-size:18px;
                cursor:pointer;
                color:black;
            ">Зупинитися</button>`;
        } else {
            html += `
            <p style="color:#ff6b6b;margin-top:18px;font-size:18px;">
                💥 Ви вибухнули!
            </p>
            <button onclick='startSaperPaid()' style="
                padding:10px 18px;
                background:#ff3b3b;
                border:0;
                border-radius:8px;
                font-size:18px;
                cursor:pointer;
                color:white;
            ">Нова гра (20 Гривень)</button>`;
        }

        html += `
            <br><br>
            <button onclick='arcadeMenu()' style="
                padding:8px 16px;
                background:#444;
                border:0;
                border-radius:6px;
                font-size:16px;
                cursor:pointer;
                color:white;
            ">⬅ Назад</button>
        </div>`;

        document.getElementById("app").innerHTML = html;
    }

    window.stopSaper = function () {
        addBalance(saperScore);
        alert(`Гра завершена! Отримано ${saperScore} Гривень.`);
        arcadeMenu();
    };

    renderBoard();
}


const allItems = [
  {name:"500 Гривень", img:"500.png", rarity:"Спеціальна", collection:"Грошовий Кейс", price:500},
  {name:"200 Гривень", img:"200.png", rarity:"Секретна", collection:"Грошовий Кейс", price:200},
  {name:"100 Гривень", img:"100.png", rarity:"Секретна", collection:"Грошовий Кейс", price:100},
  {name:"50 Гривень", img:"50.png", rarity:"Епічна", collection:"Грошовий Кейс", price:50},
  {name:"20 Гривень", img:"20.png", rarity:"Виняткова", collection:"Грошовий Кейс", price:20},
  {name:"10 Гривень", img:"10.png", rarity:"Виняткова", collection:"Грошовий Кейс", price:10},
  {name:"5 Гривень", img:"5.png", rarity:"Звичайна", collection:"Грошовий Кейс", price:5},
  {name:"1 Гривня", img:"1.png", rarity:"Звичайна", collection:"Грошовий Кейс", price:1}
];

function getItemPrice(item){
  let price = item.price || 0;
  const qm = {
    "Прямо з цеху":1.1,
    "Після консервації":1.0,
    "Після уроку":0.9,
    "Зношена":0.8
  }[item.quality] || 1;
  const pm = item.premium ? 2 : 1;
  return Math.round(price * qm * pm);
}

function openMarket(){
  const app = document.getElementById("app");
  const collections = [...new Set(allItems.map(i=>i.collection))];

  app.innerHTML = `
    <h2 style="text-align:center;margin-bottom:15px;">Маркет</h2>
    <div id="market-tabs" style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-bottom:20px;"></div>
    <div id="market-items" style="display:flex;flex-wrap:wrap;gap:15px;justify-content:center;"></div>
    <div style="text-align:center;margin-top:20px;">
      <button onclick="mainMenu()">⬅ Назад</button>
    </div>
    ${sellModalHTML()}
  `;

  const tabs = document.getElementById("market-tabs");
  collections.forEach(col=>{
    const b=document.createElement("button");
    b.textContent=col;
    b.onclick=()=>showMarketCollection(col);
    tabs.appendChild(b);
  });

  if(collections.length) showMarketCollection(collections[0]);
}

function showMarketCollection(collection){
  const wrap=document.getElementById("market-items");
  wrap.innerHTML="";
  allItems.filter(i=>i.collection===collection).forEach(item=>{
    const d=document.createElement("div");
    d.style="width:150px;background:#fff;border-radius:10px;padding:10px;text-align:center;box-shadow:0 2px 8px rgba(0,0,0,.25);";
    d.innerHTML=`
      <img src="img/${item.img}" style="max-width:100%;">
      <div style="font-weight:bold;">${item.name}</div>
      <div style="font-size:13px;">${item.rarity}</div>
      <div style="margin:5px 0;">${item.price} Гривень</div>
      <button onclick="openSellModal('${item.name}')">Продати</button>
    `;
    wrap.appendChild(d);
  });
}

let sellTargetName=null;

function sellModalHTML(){
  return `
  <div id="sellModal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,.6);justify-content:center;align-items:center;z-index:999;">
    <div style="background:#fff;padding:20px;border-radius:12px;max-width:600px;width:90%;">
      <h3 style="text-align:center;">Селлівентар</h3>
      <div id="sellList" style="display:flex;flex-wrap:wrap;gap:10px;justify-content:center;margin-top:15px;"></div>
      <div style="text-align:center;margin-top:15px;">
        <button onclick="confirmSell()">Продати вибране</button>
        <button onclick="closeSellModal()">Закрити</button>
      </div>
    </div>
  </div>`;
}

function openSellModal(name){
  sellTargetName=name;
  const modal=document.getElementById("sellModal");
  const list=document.getElementById("sellList");
  list.innerHTML="";
  const inv=JSON.parse(localStorage.getItem(currentUser+"_inventory1")||"[]");
  const items=inv.filter(i=>i.name===name);

  if(!items.length){
    list.innerHTML="<p>У тебе немає цього предмета</p>";
  }

  items.forEach((item,idx)=>{
    const base=allItems.find(i=>i.name===item.name)||{};
    const price=getItemPrice({...item,price:base.price});
    const el=document.createElement("div");
    el.style="width:130px;border:1px solid #ccc;border-radius:8px;padding:8px;text-align:center;";
    el.innerHTML=`
      <input type="checkbox" data-idx="${idx}">
      <img src="img/${item.img}" style="max-width:100%;">
      <div style="font-size:13px;">${base.rarity}</div>
      <div style="font-size:12px;">Якість: ${item.quality||"Немає"}</div>
      <div style="font-size:12px;">${item.premium?"⭐ Преміум":""}</div>
      <div>Ціна: ${price} Гривень</div>
    `;
    list.appendChild(el);
  });

  modal.style.display="flex";
}

function confirmSell(){
  const checks=[...document.querySelectorAll("#sellList input:checked")];
  if(!checks.length){alert("Нічого не вибрано");return;}
  let total=0,sold=0;
  let inv=JSON.parse(localStorage.getItem(currentUser+"_inventory1")||"[]");
  const idxs=checks.map(c=>+c.dataset.idx).sort((a,b)=>b-a);

  idxs.forEach(i=>{
    const same=inv.filter(it=>it.name===sellTargetName);
    const item=same[i];
    if(!item) return;
    if(typeof blockedItems!=="undefined"&&blockedItems.has(item.id)) return;
    const base=allItems.find(b=>b.name===item.name)||{};
    total+=getItemPrice({...item,price:base.price});
    const ri=inv.indexOf(item);
    if(ri!==-1){deleteItem(ri);sold++;}
  });

  balance+=total;
  localStorage.setItem("balance",balance);
  alert(`Продано: ${sold} шт.\nОтримано: ${total} Гривень`);
  closeSellModal();
}

function closeSellModal(){
  document.getElementById("sellModal").style.display="none";
}


window.onload = () => {
  loginScreen();
};