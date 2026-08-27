// ---------- Account / session UI ----------
const currentUser = getCurrentUser();
if(currentUser){
  document.getElementById('currentUserName').textContent = currentUser.name;
}

// ---------- State (persisted via storage.js) ----------
let transactions = loadTransactions(); // {type,name,qty,price,category,timestamp}
let currentInterval = 'day'; // 'day' | 'month' | 'year'

const categoryColors = { Xerox:'#6C7BF0', Print:'#B29BEF', Laminate:'#F5B44E', Others:'#F5D95E' };
const INTERVAL_PREFIX = { day: "TODAY'S", month: "THIS MONTH'S", year: "THIS YEAR'S" };

const logPanel = document.getElementById('logPanel');
const revenueVal = document.getElementById('revenueVal');
const expenseVal = document.getElementById('expenseVal');
const profitVal = document.getElementById('profitVal');
const revenueLabel = document.getElementById('revenueLabel');
const expenseLabel = document.getElementById('expenseLabel');
const profitLabel = document.getElementById('profitLabel');
const legend = document.getElementById('legend');
const intervalNavLabel = document.getElementById('intervalNavLabel');

function peso(n){ return '₱ ' + n.toFixed(2); }

function isInInterval(tsISO, interval){
  const now = new Date();
  const d = new Date(tsISO);
  if(interval === 'day') return d.toDateString() === now.toDateString();
  if(interval === 'month') return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  if(interval === 'year') return d.getFullYear() === now.getFullYear();
  return true;
}

// ---------- Pie chart ----------
const ctx = document.getElementById('pieChart').getContext('2d');
const pieChart = new Chart(ctx, {
  type: 'pie',
  data: {
    labels: ['Xerox','Print','Laminate','Others'],
    datasets: [{ data:[1,1,1,1], backgroundColor: Object.values(categoryColors), borderWidth: 0 }]
  },
  options: { plugins: { legend:{display:false}, tooltip:{enabled:true} }, responsive:true }
});

// ---------- Recompute everything for the current interval ----------
function recalcAll(){
  const filtered = transactions.filter(t => isInInterval(t.timestamp, currentInterval));
  let revenue = 0, expenses = 0;
  const categoryTotals = { Xerox:0, Print:0, Laminate:0, Others:0 };

  filtered.forEach(t=>{
    if(t.type === 'service'){
      revenue += t.price;
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.qty;
    } else {
      expenses += t.price;
    }
  });

  const prefix = INTERVAL_PREFIX[currentInterval];
  revenueLabel.textContent = `${prefix} REVENUE`;
  expenseLabel.textContent = `${prefix} EXPENSES`;
  profitLabel.textContent = `${prefix} PROFIT`;
  revenueVal.textContent = peso(revenue);
  expenseVal.textContent = peso(expenses);
  profitVal.textContent = peso(revenue - expenses);

  const total = Object.values(categoryTotals).reduce((a,b)=>a+b,0);
  pieChart.data.datasets[0].data = total === 0 ? [1,1,1,1] : Object.values(categoryTotals);
  pieChart.update();

  legend.innerHTML = '';
  Object.keys(categoryTotals).forEach(cat=>{
    const pct = total > 0 ? Math.round((categoryTotals[cat]/total)*100) : 0;
    const row = document.createElement('div');
    row.className = 'legend-item';
    row.innerHTML = `<span class="dot" style="background:${categoryColors[cat]}"></span>${cat} — ${pct}%`;
    legend.appendChild(row);
  });

  if(filtered.length === 0){
    logPanel.innerHTML = '<div class="log-empty">No transactions in this period yet.</div>';
  } else {
    logPanel.innerHTML = '';
    [...filtered].reverse().forEach(t=>{
      const entry = document.createElement('div');
      entry.className = 'log-entry ' + t.type;
      const label = t.type === 'service' ? 'Services' : 'Purchase';
      entry.innerHTML = `<span>${label}: ${t.name}</span><span>Quantity: ${t.qty}</span><span>Price: ${peso(t.price)}</span>`;
      logPanel.appendChild(entry);
    });
  }
}

// ---------- Add handlers ----------
document.getElementById('addServiceBtn').addEventListener('click', ()=>{
  const sel = document.getElementById('serviceSelect');
  const name = sel.value;
  const cat = sel.selectedOptions[0] ? (sel.selectedOptions[0].dataset.cat || 'Others') : 'Others';
  const qty = parseFloat(document.getElementById('serviceQty').value);
  const price = parseFloat(document.getElementById('servicePrice').value);

  if(!name || !qty || qty <= 0 || isNaN(price) || price < 0){
    alert('Please select a service and enter a valid quantity and price.');
    return;
  }

  transactions.push({type:'service', name, qty, price, category:cat, timestamp:new Date().toISOString()});
  saveTransactions(transactions);
  recalcAll();

  sel.value = '';
  document.getElementById('serviceQty').value = '';
  document.getElementById('servicePrice').value = '';
});

document.getElementById('addPurchaseBtn').addEventListener('click', ()=>{
  const sel = document.getElementById('purchaseSelect');
  const name = sel.value;
  const qty = parseFloat(document.getElementById('purchaseQty').value);
  const price = parseFloat(document.getElementById('purchasePrice').value);

  if(!name || !qty || qty <= 0 || isNaN(price) || price < 0){
    alert('Please select a purchase item and enter a valid quantity and price.');
    return;
  }

  transactions.push({type:'purchase', name, qty, price, timestamp:new Date().toISOString()});
  saveTransactions(transactions);
  recalcAll();

  sel.value = '';
  document.getElementById('purchaseQty').value = '';
  document.getElementById('purchasePrice').value = '';
});

// ---------- Dropdown helpers ----------
const intervalDropdown = document.getElementById('intervalDropdown');
const themeDropdown = document.getElementById('themeDropdown');
const accountDropdown = document.getElementById('accountDropdown');

function closeAllDropdowns(except){
  [intervalDropdown, themeDropdown, accountDropdown].forEach(d=>{
    if(d !== except) d.classList.remove('open');
  });
}

document.getElementById('intervalToggle').addEventListener('click', (e)=>{
  e.stopPropagation();
  const isOpen = intervalDropdown.classList.contains('open');
  closeAllDropdowns();
  intervalDropdown.classList.toggle('open', !isOpen);
});
intervalDropdown.querySelectorAll('div').forEach(opt=>{
  opt.addEventListener('click', ()=>{
    currentInterval = opt.dataset.interval;
    intervalNavLabel.textContent = opt.textContent.toUpperCase();
    intervalDropdown.querySelectorAll('div').forEach(d=>d.classList.remove('active'));
    opt.classList.add('active');
    intervalDropdown.classList.remove('open');
    recalcAll();
  });
});

document.getElementById('themeToggle').addEventListener('click', (e)=>{
  e.stopPropagation();
  const isOpen = themeDropdown.classList.contains('open');
  closeAllDropdowns();
  themeDropdown.classList.toggle('open', !isOpen);
});
themeDropdown.querySelectorAll('div').forEach(opt=>{
  opt.addEventListener('click', ()=>{
    const theme = opt.dataset.theme;
    applyTheme(theme);
    saveTheme(theme);
    themeDropdown.querySelectorAll('div').forEach(d=>d.classList.remove('active'));
    opt.classList.add('active');
    themeDropdown.classList.remove('open');
  });
});

document.getElementById('accountToggle').addEventListener('click', (e)=>{
  e.stopPropagation();
  const isOpen = accountDropdown.classList.contains('open');
  closeAllDropdowns();
  accountDropdown.classList.toggle('open', !isOpen);
});
document.getElementById('logoutBtn').addEventListener('click', logout);

document.addEventListener('click', ()=> closeAllDropdowns());

// ---------- Live clock ----------
function tick(){
  const now = new Date();
  let h = now.getHours();
  const m = String(now.getMinutes()).padStart(2,'0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12; if(h === 0) h = 12;
  document.getElementById('timeNow').textContent = `${h}:${m}${ampm} PHT`;
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  document.getElementById('dateNow').textContent = `${months[now.getMonth()]} ${now.getDate()},${now.getFullYear()}`;
}
tick();
setInterval(tick, 1000 * 30);

// ---------- Init ----------
(function initActiveStates(){
  const savedTheme = loadTheme();
  themeDropdown.querySelectorAll('div').forEach(d=>{
    d.classList.toggle('active', d.dataset.theme === savedTheme);
  });
})();

recalcAll();
