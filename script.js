let score = 0;
let multiplier = 1;
let autoclickerCount = 0;
let autoclickerCost = 20;
let clickUpgradeCost = 50;

const SAVE_KEY = 'clickerGame_v1';

const els = {
  score: document.getElementById('score'),
  ppc: document.getElementById('ppc'),
  cps: document.getElementById('cps'),
  clickBtn: document.getElementById('clickBtn'),
  shop: document.getElementById('shop'),
  shopBtn: document.getElementById('shopBtn'),
  autoclickerCost: document.getElementById('autoclickerCost'),
  autoclickerCount: document.getElementById('autoclickerCount'),
  buyAutoclicker: document.getElementById('buyAutoclickerBtn'),
  clickUpgradeCost: document.getElementById('clickUpgradeCost'),
  buyClickUpgrade: document.getElementById('buyClickUpgradeBtn')
};

// === ZAPIS / ODCZYT ===
function save() {
  const data = { score, multiplier, autoclickerCount, autoclickerCost, clickUpgradeCost };
  localStorage.setItem(SAVE_KEY, JSON.stringify(data));
}

function load() {
  const raw = localStorage.getItem(SAVE_KEY);
  if (raw) {
    const d = JSON.parse(raw);
    score = d.score ?? 0;
    multiplier = d.multiplier ?? 1;
    autoclickerCount = d.autoclickerCount ?? 0;
    autoclickerCost = d.autoclickerCost ?? 20;
    clickUpgradeCost = d.clickUpgradeCost ?? 50;
  }
}

// === LOGIKA ===
function getPPC() { return 1 * multiplier; }
function getCPS() { return autoclickerCount * multiplier; }

function update() {
  score = Math.floor(score);
  els.score.textContent = `Punkty: ${score}`;
  els.ppc.textContent = `Punkty za kliknięcie: ${getPPC()}`;
  els.cps.textContent = `Kliknięcia na sekundę: ${getCPS()}`;
  els.autoclickerCost.textContent = autoclickerCost;
  els.autoclickerCount.textContent = autoclickerCount;
  els.clickUpgradeCost.textContent = clickUpgradeCost;

  els.buyAutoclicker.disabled = score < autoclickerCost;
  els.buyClickUpgrade.disabled = score < clickUpgradeCost;

  save();
}

// === ZDARZENIA ===
els.clickBtn.addEventListener('click', () => {
  score += getPPC();
  update();
});

els.shopBtn.addEventListener('click', () => {
  const open = els.shop.style.display === 'block';
  els.shop.style.display = open ? 'none' : 'block';
  els.shopBtn.setAttribute('aria-expanded', !open);
});

els.buyClickUpgrade.addEventListener('click', () => {
  if (score >= clickUpgradeCost) {
    score -= clickUpgradeCost;
    multiplier *= 2;
    clickUpgradeCost = Math.floor(clickUpgradeCost * 1.8);
    update();
  }
});

els.buyAutoclicker.addEventListener('click', () => {
  if (score >= autoclickerCost) {
    score -= autoclickerCost;
    autoclickerCount++;
    autoclickerCost = Math.floor(autoclickerCost * 1.25);
    update();
  }
});

// === AUTOKLIKER + AUTOZAPIS ===
setInterval(() => {
  if (autoclickerCount > 0) {
    score += getCPS();
    update();
  }
}, 1000);

setInterval(save, 5000);

// === START ===
load();
update();