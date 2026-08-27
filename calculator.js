// ---------- Basic Calculator modal (shared by index.html and settings.html) ----------
(function(){
  const display = document.getElementById('calcDisplay');
  if(!display) return; // calculator modal isn't on this page

  let current = '0';
  let previous = null;
  let operator = null;
  let waitingForNext = false;

  function updateDisplay(){
    display.textContent = current;
  }

  function inputNumber(num){
    if(waitingForNext){
      current = num;
      waitingForNext = false;
    } else {
      current = (current === '0') ? num : current + num;
    }
    updateDisplay();
  }

  function inputDecimal(){
    if(waitingForNext){
      current = '0.';
      waitingForNext = false;
      updateDisplay();
      return;
    }
    if(!current.includes('.')) current += '.';
    updateDisplay();
  }

  function clearAll(){
    current = '0';
    previous = null;
    operator = null;
    waitingForNext = false;
    updateDisplay();
  }

  function backspace(){
    current = current.length > 1 ? current.slice(0, -1) : '0';
    updateDisplay();
  }

  function percent(){
    current = String(parseFloat(current) / 100);
    updateDisplay();
  }

  function compute(){
    if(operator === null || previous === null) return;
    const prev = parseFloat(previous);
    const curr = parseFloat(current);
    let result;
    switch(operator){
      case '+': result = prev + curr; break;
      case '-': result = prev - curr; break;
      case '*': result = prev * curr; break;
      case '/': result = curr === 0 ? NaN : prev / curr; break;
      default: return;
    }
    current = Number.isFinite(result) ? String(parseFloat(result.toFixed(8))) : 'Error';
    operator = null;
    previous = null;
    waitingForNext = true;
    updateDisplay();
  }

  function chooseOperator(op){
    if(operator && !waitingForNext) compute();
    previous = current;
    operator = op;
    waitingForNext = true;
  }

  document.querySelectorAll('#calculator [data-num]').forEach(btn=>{
    btn.addEventListener('click', ()=> inputNumber(btn.dataset.num));
  });
  document.querySelectorAll('#calculator [data-op]').forEach(btn=>{
    btn.addEventListener('click', ()=> chooseOperator(btn.dataset.op));
  });
  document.querySelectorAll('#calculator [data-action]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const action = btn.dataset.action;
      if(action === 'clear') clearAll();
      else if(action === 'backspace') backspace();
      else if(action === 'decimal') inputDecimal();
      else if(action === 'percent') percent();
      else if(action === 'equals') compute();
    });
  });

  // ---------- Open / close modal ----------
  const overlay = document.getElementById('calcOverlay');
  const openBtn = document.getElementById('calcToggle');
  const closeBtn = document.getElementById('calcClose');

  if(openBtn) openBtn.addEventListener('click', ()=> overlay.classList.add('open'));
  if(closeBtn) closeBtn.addEventListener('click', ()=> overlay.classList.remove('open'));
  overlay.addEventListener('click', (e)=>{
    if(e.target === overlay) overlay.classList.remove('open');
  });
})();
