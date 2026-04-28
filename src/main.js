/**
 * src/main.js
 * Reasoning Layer / Client Navigation logic.
 */

const state = {
  objective: null,
  gender: null,
  age_group: null,
  height_cm: null,
  current_weight_kg: null,
  target_weight_kg: null,
  fat_area: null,
  biggest_challenge: null
};

let currentStep = 1;
const totalSteps = 10;

document.addEventListener('DOMContentLoaded', () => {

  // Bind View Switcher
  function openQuiz() {
    document.getElementById('advertorial-view').style.display = 'none';
    document.getElementById('quiz-view').style.display = 'flex';
    window.scrollTo(0, 0);
  }

  const startBtns = document.querySelectorAll('.start-quiz-btn');
  startBtns.forEach(btn => btn.addEventListener('click', openQuiz));

  // Make all article images & video clickable → open quiz
  document.querySelectorAll('#advertorial-view .article-image, #advertorial-view video').forEach(el => {
    el.addEventListener('click', openQuiz);
  });

  // Bind quiz buttons
  const optionButtons = document.querySelectorAll('.quiz-btn');
  optionButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const val = e.currentTarget.getAttribute('data-value');

      if(currentStep === 1) state.objective = val;
      if(currentStep === 2) state.gender = val;
      if(currentStep === 4) state.age_group = val;
      if(currentStep === 9) state.fat_area = val;
      if(currentStep === 10) state.biggest_challenge = val;

      nextStep();
    });
  });

  // Bind next/continuar buttons
  const nextButtons = document.querySelectorAll('.quiz-next-btn');
  nextButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      let isValid = true;

      const resetError = (id, grpId) => {
        document.getElementById(id).style.display = 'none';
        document.getElementById(grpId).classList.remove('error');
      };
      const showError = (id, grpId) => {
        document.getElementById(id).style.display = 'block';
        document.getElementById(grpId).classList.add('error');
        isValid = false;
      };

      if (currentStep === 5) {
        resetError('err_height', 'grp_height');
        const h = document.getElementById('q_height').value;
        if(!h || h < 100 || h > 250) { showError('err_height', 'grp_height'); }
        else { state.height_cm = Number(h); }
      }
      else if (currentStep === 6) {
        resetError('err_current_weight', 'grp_current_weight');
        const cw = document.getElementById('q_current_weight').value;
        if(!cw || cw < 30 || cw > 300) { showError('err_current_weight', 'grp_current_weight'); }
        else { state.current_weight_kg = Number(cw); }
      }
      else if (currentStep === 7) {
        resetError('err_target_weight', 'grp_target_weight');
        const tw = document.getElementById('q_target_weight').value;
        if(!tw || tw > state.current_weight_kg || tw < 20) { showError('err_target_weight', 'grp_target_weight'); }
        else { state.target_weight_kg = Number(tw); }
      }

      if (isValid) nextStep();
    });
  });
});

function nextStep() {
  if (currentStep === totalSteps) {
    submitQuiz();
    return;
  }

  const prev = document.querySelector(`.quiz-slide[data-step="${currentStep}"]`);
  if (prev) prev.classList.remove('active');
  currentStep++;
  const next = document.querySelector(`.quiz-slide[data-step="${currentStep}"]`);
  if (next) next.classList.add('active');

  document.getElementById('progress-fill').style.width = `${(currentStep / totalSteps) * 100}%`;

  // Auto-focus input fields on input steps
  if (currentStep === 5) document.getElementById('q_height').focus();
  if (currentStep === 6) document.getElementById('q_current_weight').focus();
  if (currentStep === 7) document.getElementById('q_target_weight').focus();
}

// Generate dynamic SVG weight-loss chart
function buildChart(startWeight, targetWeight) {
  const W = 540, H = 280;
  const pad = { t: 45, r: 30, b: 30, l: 30 };
  const cW = W - pad.l - pad.r;
  const cH = H - pad.t - pad.b;

  // Points
  const x0 = pad.l, y0 = pad.t;
  const x1 = W - pad.r, y1 = H - pad.b;

  // Bezier control points for smooth descent curve
  const cx1 = x0 + cW * 0.35, cy1 = y0 + cH * 0.05;
  const cx2 = x0 + cW * 0.55, cy2 = y1 - cH * 0.08;

  return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;">
    <defs>
      <linearGradient id="aFill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="rgba(59,130,246,0.35)"/>
        <stop offset="100%" stop-color="rgba(59,130,246,0.03)"/>
      </linearGradient>
    </defs>
    <path d="M${x0},${y0} C${cx1},${cy1} ${cx2},${cy2} ${x1},${y1} L${x1},${H - 5} L${x0},${H - 5} Z" fill="url(#aFill)"/>
    <path d="M${x0},${y0} C${cx1},${cy1} ${cx2},${cy2} ${x1},${y1}" fill="none" stroke="#3B82F6" stroke-width="3.5" stroke-linecap="round"/>
    <circle cx="${x0}" cy="${y0}" r="7" fill="#F59E0B"/>
    <circle cx="${x1}" cy="${y1}" r="7" fill="#F59E0B"/>
    <rect x="${x0 - 5}" y="${y0 - 35}" width="60" height="26" rx="5" fill="#F59E0B"/>
    <text x="${x0 + 25}" y="${y0 - 16}" text-anchor="middle" fill="white" font-size="13" font-weight="700" font-family="sans-serif">${startWeight} kg</text>
    <rect x="${x1 - 55}" y="${y1 - 35}" width="60" height="26" rx="5" fill="#F59E0B"/>
    <text x="${x1 - 25}" y="${y1 - 16}" text-anchor="middle" fill="white" font-size="13" font-weight="700" font-family="sans-serif">${targetWeight} kg</text>
  </svg>`;
}

async function submitQuiz() {
  // Show loading
  document.querySelector(`.quiz-slide[data-step="${currentStep}"]`).classList.remove('active');
  document.querySelector(`.quiz-slide[data-step="loading"]`).classList.add('active');
  document.getElementById('progress-fill').style.width = `100%`;

  const payload = {
    user_id: crypto.randomUUID ? crypto.randomUUID() : 'uuid-' + Date.now(),
    ...state,
    timestamp: new Date().toISOString()
  };

  fetch('/api/submit-quiz', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }).catch(err => console.error("Webhook silent fail:", err));

  await new Promise(resolve => setTimeout(resolve, 2500));

  // Dynamic values
  const cw = state.current_weight_kg || 85;
  const tw = state.target_weight_kg || 65;
  const isMale = state.gender === 'Male';

  // Body fat estimation
  const startFat = cw > 90 ? 38 : (cw > 75 ? 32 : 28);
  const endFat = startFat - 11;

  // Target date (~12 weeks from now)
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 84);
  const lang = document.documentElement.lang || 'es';
  const locale = lang === 'pt' ? 'pt-BR' : lang === 'fr' ? 'fr-FR' : 'es-ES';
  const dateStr = targetDate.toLocaleDateString(locale, { day: 'numeric', month: 'numeric', year: 'numeric' });

  // Populate results
  document.getElementById('res-target-date').innerText = dateStr;
  document.getElementById('res-target-weight').innerText = tw;
  document.getElementById('res-cw-display').innerText = cw;
  document.getElementById('res-tw-display').innerText = tw;
  const approxStr = lang === 'pt' ? 'aprox. ' : lang === 'fr' ? 'env. ' : 'ca. ';
  document.getElementById('res-fat-before').innerText = approxStr + startFat + '%';
  document.getElementById('res-fat-after').innerText = approxStr + endFat + '%';

  // Gender-specific body icons (full body, before=wider silhouette)
  const beforeEl = document.getElementById('res-body-before');
  const afterEl = document.getElementById('res-body-after');
  beforeEl.innerHTML = isMale ? '🧍‍♂️' : '🧍‍♀️';
  beforeEl.style.transform = 'scaleX(1.35)';
  afterEl.innerHTML = isMale ? '🏃‍♂️' : '🏃‍♀️';
  afterEl.style.transform = 'scaleX(1)';

  // Dynamic chart
  document.getElementById('res-chart-container').innerHTML = buildChart(cw, tw);

  // Show Results
  document.querySelector(`.quiz-slide[data-step="loading"]`).classList.remove('active');
  document.querySelector(`.quiz-slide[data-step="result"]`).classList.add('active');
  document.getElementById('quiz-view').classList.add('showing-result');
  window.scrollTo(0, 0);

  const progressWrap = document.querySelector('.quiz-progress-wrap');
  if(progressWrap) progressWrap.style.display = 'none';
  const stepInd = document.getElementById('quiz-step-indicator');
  const diagStr = lang === 'pt' ? 'Seu Diagnóstico Pessoal' : lang === 'fr' ? 'Votre Diagnostic Personnel' : 'Tu Diagnóstico Personal';
  if(stepInd) stepInd.innerText = diagStr;
}
