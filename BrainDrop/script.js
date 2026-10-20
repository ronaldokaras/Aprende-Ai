const CARDS_TF = [
  { conceptTitle: "Regra de Três Direta", conceptText: "Quando uma grandeza aumenta e a outra também aumenta na mesma proporção.", text: "Se 2 kg de arroz custam R$ 10, então 4 kg custam R$ 20.", answer: 'right', explanation: "Verdadeiro. Dobrou a quantidade, o preço dobrou." },
  { conceptTitle: "Proporção Inversa", conceptText: "Quando uma grandeza aumenta, a outra diminui.", text: "Em uma proporção inversa, quando uma grandeza aumenta, a outra também aumenta.", answer: 'left', explanation: "Falso. Na inversa, se uma sobe, a outra desce." },
  { conceptTitle: "Porcentagem", conceptText: "É uma parte de um todo dividido em 100.", text: "Porcentagem é sempre um número maior que 100.", answer: 'left', explanation: "Falso. Pode ser 10%, 50%, etc." },
  { conceptTitle: "Descontos", conceptText: "Um desconto de 10% significa pagar 90% do valor.", text: "Uma taxa de 10% de desconto em R$ 100 deixa o produto por R$ 90.", answer: 'right', explanation: "Verdadeiro. 100 - 10% = 90." },
  { conceptTitle: "Juros Simples", conceptText: "Juros incidem apenas sobre o valor inicial.", text: "Em juros simples, o valor dos juros aumenta a cada mês mesmo se a dívida não mudar.", answer: 'left', explanation: "Falso. Juros simples são fixos todo mês." },
  { conceptTitle: "Média Aritmética", conceptText: "Soma os valores e divide pela quantidade.", text: "A média entre 2, 4 e 6 é 4.", answer: 'right', explanation: "Verdadeiro. 2+4+6 = 12. 12 / 3 = 4." },
  { conceptTitle: "Física Básica", conceptText: "A água ferve a 100 graus Celsius.", text: "A água ferve a 50 graus Celsius ao nível do mar.", answer: 'left', explanation: "Falso. Ferve a 100 graus." }
];

const CARDS_DPAD = [
  {
    conceptTitle: "Proporção Inversa",
    conceptText: "Quando uma grandeza aumenta, a outra diminui.",
    text: "Se dobrar o número de pedreiros, o tempo de obra cai pela metade.",
    options: { left: "Direta", right: "Inversa", up: "Composta", down: "Porcentagem" },
    answer: "right", explanation: "É uma proporção inversa!"
  },
  {
    conceptTitle: "Completar Frase (Inversa)",
    conceptText: "Em uma proporção inversa, as grandezas variam em sentidos opostos.",
    text: "Em uma proporção inversa, quando uma grandeza aumenta, a outra ___.",
    options: { left: "Aumenta", right: "Diminui", up: "Dobra", down: "Fica igual" },
    answer: "right", explanation: "Na inversa, se uma sobe, a outra desce."
  },
  {
    conceptTitle: "Classes Gramaticais",
    conceptText: "Substantivo (nome), Verbo (ação), Adjetivo (qualidade), Advérbio (modo).",
    text: "Na frase 'O menino corria muito rápido', qual a classe da palavra 'rápido'?",
    options: { left: "Substantivo", right: "Verbo", up: "Adjetivo", down: "Advérbio" },
    answer: "down", explanation: "'Rápido' modifica o verbo corria, então é um advérbio."
  },
  {
    conceptTitle: "História",
    conceptText: "Eventos marcantes do Brasil.",
    text: "A Proclamação da República aconteceu no ano de ___.",
    options: { left: "1500", right: "1889", up: "1822", down: "1964" },
    answer: "right", explanation: "Foi em 15 de novembro de 1889."
  },
  {
    conceptTitle: "Matemática",
    conceptText: "Soma e subtração.",
    text: "Qual é o resultado da operação 15 + 27?",
    options: { left: "32", right: "42", up: "40", down: "52" },
    answer: "right", explanation: "15 + 27 = 42."
  }
];

// LÊ O TEMA DO APP PRINCIPAL
function carregarTema() {
  const estado = JSON.parse(localStorage.getItem('aprendeai') || '{}');
  if (!estado.temaEscuro) {
    // Se o app NÃO estiver no escuro, o jogo fica claro
    document.body.classList.add('theme-light');
  } else {
    document.body.classList.remove('theme-light');
  }
}
// Chama a função assim que o jogo carregar
carregarTema();

let CARDS = [];
let gameMode = 'tf'; 
let index = 0, score = 0, streak = 0, maxStreak = 0, mistakes = 0, lives = 3;
let currentWave = 1, correctInWave = 0;
let isAnimating = false, readingMode = false, timerInterval = null, isLearnPhase = true, isSuperDrop = false;
let timeLeft = 10000; 
let swipeThreshold = 80; // Variável de acessibilidade motora
let isHighlightActive = false;

const notes = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25]; 

const screens = { start: document.getElementById("start-screen"), game: document.getElementById("game-screen"), end: document.getElementById("end-screen") };
const learnCard = document.getElementById("learn-card"), quizCard = document.getElementById("quiz-card"), quizButtons = document.getElementById("quiz-buttons");
const conceptTitle = document.getElementById("concept-title"), conceptText = document.getElementById("concept-text");
const cardTextEl = document.getElementById("card-text"), quizLabel = document.getElementById("quiz-label");
const scoreEl = document.getElementById("score"), streakEl = document.getElementById("streak"), statsContainer = document.getElementById("stats-container");
const fireIcon = document.getElementById("fire-icon"), feedbackEl = document.getElementById("feedback");
const comboTextEl = document.getElementById("combo-text"), floatingScore = document.getElementById("floating-score");
const progressBar = document.getElementById("progress-bar"), timerBar = document.getElementById("timer-bar");
const waveOverlay = document.getElementById("wave-overlay"), waveTitle = document.getElementById("wave-title"), currentWaveEl = document.getElementById("current-wave");
const iconLeft = document.getElementById("icon-left"), iconRight = document.getElementById("icon-right"), iconUp = document.getElementById("icon-up"), iconDown = document.getElementById("icon-down");

// VARIÁVEIS DE HAPTICS
const hapticsMap = {
  left: [30], // 1 vibração curta
  right: [30, 50, 30], // 2 vibrações curtas
  up: [50, 20, 50], // Contínuo suave
  down: [100] // Uma longa
};

function atualizarCoracoes() {
  for (let i = 1; i <= 3; i++) {
    const heart = document.getElementById(`heart-${i}`);
    if (i > lives) heart.classList.add("lost");
    else heart.classList.remove("lost");
  }
}

// TTS GLOBAL (LÊ CARD)
function lerTexto(fase) {
  window.speechSynthesis.cancel();
  let texto = fase === 'learn' ? `${conceptTitle.textContent}. ${conceptText.textContent}` : cardTextEl.textContent;
  const utterance = new SpeechSynthesisUtterance(texto);
  utterance.lang = 'pt-BR'; utterance.rate = 1.1;
  window.speechSynthesis.speak(utterance);
}

// TTS LOCAL (LÊ BOTÃO AO PASSAR O DEDO/MOUSE)
function lerBotao(texto, direcao) {
  if (!document.body.classList.contains('dyslexia-mode') && !document.getElementById('acc-focus').checked) return; // Lê apenas se acessibilidade estiver ativa
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(`${direcao}: ${texto}`);
  utterance.lang = 'pt-BR'; utterance.rate = 1.2;
  window.speechSynthesis.speak(utterance);
}

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playSound(type, noteIndex = 0) {
  try {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator(); const gain = audioCtx.createGain();
    osc.connect(gain); gain.connect(audioCtx.destination);
    if (type === 'correct') { 
      osc.type = 'sine'; const freq = notes[Math.min(noteIndex, notes.length - 1)]; osc.frequency.setValueAtTime(freq, audioCtx.currentTime); 
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime); gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3); 
    } else if (type === 'wrong') { 
      osc.type = 'triangle'; osc.frequency.setValueAtTime(150, audioCtx.currentTime); osc.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 0.15); 
      gain.gain.setValueAtTime(0.4, audioCtx.currentTime); gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3); 
    }
    osc.start(); osc.stop(audioCtx.currentTime + 0.3);
  } catch(e) {}
}

function showScreen(name) { 
  Object.values(screens).forEach(s => s.classList.add("hidden")); 
  screens[name].classList.remove("hidden"); 
  
  // Lógica para esconder o botão ⚙️
  const accBtn = document.getElementById("btn-open-acc");
  if (name === "start") {
    accBtn.style.display = "flex"; // Mostra só no menu
  } else {
    accBtn.style.display = "none"; // Esconde no jogo e no fim
  }
}

document.getElementById("btn-start-tf").addEventListener("click", () => iniciarJogo('tf'));
document.getElementById("btn-start-dpad").addEventListener("click", () => iniciarJogo('dpad'));
document.getElementById("btn-restart").addEventListener("click", () => iniciarJogo(gameMode));

function iniciarJogo(modo) {
  gameMode = modo;
  
  if (gameMode === 'tf') {
    CARDS = [...CARDS_TF];
    document.body.classList.add('tf-mode');
    document.getElementById("txt-left").textContent = "Falso";
    document.getElementById("txt-right").textContent = "Verdadeiro";
  } else {
    CARDS = [...CARDS_DPAD];
    document.body.classList.remove('tf-mode');
  }

  index = 0; score = 0; streak = 0; maxStreak = 0; mistakes = 0; lives = 3;
  currentWave = 1; correctInWave = 0; isSuperDrop = false; isAnimating = false; isLearnPhase = true;
  
  atualizarCoracoes();
  scoreEl.textContent = score; streakEl.textContent = streak;
  currentWaveEl.textContent = currentWave;
  statsContainer.classList.remove("on-fire");
  fireIcon.classList.add("hidden"); quizCard.className = "card quiz-card";
  document.getElementById("badges-container").innerHTML = "";
  screens.end.classList.remove("game-over");
  document.getElementById("end-title").textContent = "Fim do Drop!";
  
  clearInterval(timerInterval);
  if (timerBar) timerBar.classList.remove("danger");

  showScreen("game");
  carregarFaseAprender();
}

// FUNÇÃO PARA GRIFAR PALAVRAS
function processarTexto(texto) {
  if (!isHighlightActive) return texto;
  const keywords = ["proporção inversa", "proporção direta", "aumenta", "diminui", "dobra", "metade", "substitua", "correta"];
  let textoProcessado = texto;
  
  keywords.forEach(kw => {
    const regex = new RegExp(`\\b(${kw})\\b`, 'gi');
    textoProcessado = textoProcessado.replace(regex, '<span class="highlight">$1</span>');
  });
  
  return textoProcessado;
}

function carregarFaseAprender() {
  if (index >= CARDS.length) { finalizarJogo(true); return; }
  
  window.speechSynthesis.cancel();
  isLearnPhase = true;
  const card = CARDS[index];
  if (!card) return;
  
  progressBar.style.width = `${(index / CARDS.length) * 100}%`;

  conceptTitle.innerHTML = processarTexto(card.conceptTitle);
  conceptText.innerHTML = processarTexto(card.conceptText);
  learnCard.classList.remove("hidden");
  quizCard.classList.add("hidden");
  quizButtons.classList.add("hidden");
  clearInterval(timerInterval);
}

document.getElementById("btn-learned").addEventListener("click", () => {
  if (!isLearnPhase || isAnimating) return;
  window.speechSynthesis.cancel();
  isLearnPhase = false;
  
  learnCard.classList.add("hidden");
  quizCard.classList.remove("hidden");
  quizButtons.classList.remove("hidden");
  
  const card = CARDS[index];
  if (card) {
    cardTextEl.innerHTML = processarTexto(card.text);
    
    if (gameMode === 'dpad') {
      document.getElementById("txt-up").textContent = card.options.up;
      document.getElementById("txt-down").textContent = card.options.down;
      document.getElementById("txt-left").textContent = card.options.left;
      document.getElementById("txt-right").textContent = card.options.right;
    }

    quizCard.className = "card quiz-card";
    
    if (correctInWave === 5) {
      isSuperDrop = true;
      quizCard.classList.add("golden-card");
      quizLabel.textContent = "💎 CARD DOURADO (BOSS)";
    } else {
      isSuperDrop = false;
      quizLabel.textContent = "Fase 2: O Swipe";
    }
  }
  resetarCard();
  iniciarTimer();
});

function resetarCard() {
  quizCard.style.transition = "none";
  quizCard.style.transform = "translate(0, 0) rotate(0deg)";
  quizCard.style.opacity = "1";
  document.body.classList.remove("shake");
  iconLeft.classList.remove("active"); iconRight.classList.remove("active");
  iconUp.classList.remove("active"); iconDown.classList.remove("active");
}

function iniciarTimer() {
  clearInterval(timerInterval);
  if (readingMode || !timerBar) return;
  
  let maxTime = isSuperDrop ? 6000 : 10000; 
  timeLeft = maxTime;
  
  timerBar.style.transition = "none";
  timerBar.style.width = "100%";
  timerBar.style.backgroundColor = "var(--pastel-green)";
  timerBar.classList.remove("danger");

  timerInterval = setInterval(() => {
    timeLeft -= 50;
    let pct = (timeLeft / maxTime) * 100;
    timerBar.style.width = `${pct}%`;
    
    if (timeLeft <= (maxTime * 0.25)) {
      timerBar.classList.add("danger");
    } else if (timeLeft <= (maxTime * 0.6)) {
      timerBar.style.backgroundColor = "var(--pastel-yellow)";
    }

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      if (!isAnimating && !isLearnPhase) perderVida(); 
    }
  }, 50);
}

function criarParticulas(cor) {
  const rect = quizCard.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  for (let i = 0; i < 15; i++) {
    const p = document.createElement("div");
    p.className = "particle";
    p.style.backgroundColor = cor;
    p.style.left = `${centerX}px`;
    p.style.top = `${centerY}px`;
    document.body.appendChild(p);

    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 100 + 50;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance;

    p.style.transition = "transform 0.6s cubic-bezier(0.1, 0.8, 0.2, 1), opacity 0.6s ease";
    
    requestAnimationFrame(() => {
      p.style.transform = `translate(${tx}px, ${ty}px) scale(0)`;
      p.style.opacity = "0";
    });

    setTimeout(() => p.remove(), 600);
  }
}

function responder(direcao) {
  if (isAnimating || isLearnPhase) return;
  
  isAnimating = true;
  clearInterval(timerInterval);
  window.speechSynthesis.cancel();

  const card = CARDS[index];
  if (!card) return;
  
  const acertou = direcao === card.answer;
  
  criarParticulas(acertou ? "var(--pastel-green)" : "var(--pastel-red)");

  let tx = 0, ty = 0;
  if (direcao === 'right') tx = 600;
  if (direcao === 'left') tx = -600;
  if (direcao === 'up') ty = -600;
  if (direcao === 'down') ty = 600;

  quizCard.style.transition = "transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.25s ease";
  quizCard.style.transform = `translate(${tx}px, ${ty}px) rotate(${tx * 0.03}deg)`;
  quizCard.style.opacity = "0";

  if (acertou) {
    let pontosGanhos = 10 + (streak * 2);
    if (isSuperDrop) { 
      pontosGanhos *= 3; 
      comboTextEl.textContent = `TURBO x3! 💎`;
      comboTextEl.classList.remove("show"); void comboTextEl.offsetWidth; comboTextEl.classList.add("show");
    }

    score += pontosGanhos; 
    streak++; correctInWave++;
    if (streak > maxStreak) maxStreak = streak;
    
    feedbackEl.textContent = "✔ Boa! " + card.explanation;
    feedbackEl.className = "feedback correct";
    playSound('correct', streak);
    
    floatingScore.textContent = `+${pontosGanhos}`;
    floatingScore.style.color = isSuperDrop ? "var(--gold)" : "var(--pastel-green)";
    floatingScore.classList.remove("show"); void floatingScore.offsetWidth; floatingScore.classList.add("show");

    if (navigator.vibrate) navigator.vibrate(hapticsMap[direcao] || 30);

    if (streak >= 3) {
      statsContainer.classList.add("on-fire");
      if (streak % 3 === 0) {
        comboTextEl.textContent = `COMBO x${streak}! 🔥`;
        comboTextEl.classList.remove("show"); void comboTextEl.offsetWidth; comboTextEl.classList.add("show");
        confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 }, colors: ['#C6A0F6', '#A6DA95', '#FFA500'] });
      }
    }
  } else {
    mistakes++;
    perderVida(); 
    return; 
  }

  scoreEl.textContent = score; 
  scoreEl.classList.remove("score-pop"); void scoreEl.offsetWidth; scoreEl.classList.add("score-pop");
  streakEl.textContent = streak;

  setTimeout(() => {
    try {
      index++; 
      feedbackEl.className = "feedback"; feedbackEl.textContent = "";
      isAnimating = false; 
      
      if (correctInWave === 6) {
        avancarOnda();
      } else {
        carregarFaseAprender();
      }
    } catch (erro) { index = CARDS.length; finalizarJogo(true); }
  }, 400);
}

function avancarOnda() {
  waveTitle.textContent = `Onda ${currentWave} Concluída! 🌊`;
  waveOverlay.classList.remove("hidden");
  playSound('correct', 7);
  
  setTimeout(() => {
    waveOverlay.classList.add("hidden");
    currentWave++;
    correctInWave = 0;
    currentWaveEl.textContent = currentWave;
    carregarFaseAprender();
  }, 2000);
}

function perderVida() {
  lives--;
  atualizarCoracoes();
  playSound('wrong');
  if (navigator.vibrate) navigator.vibrate([50, 100, 50]);
  document.body.classList.add("shake"); setTimeout(() => document.body.classList.remove("shake"), 300);
  
  feedbackEl.textContent = "💔 Você perdeu uma vida!";
  feedbackEl.className = "feedback wrong";
  
  streak = 0; statsContainer.classList.remove("on-fire"); fireIcon.classList.add("hidden");

  setTimeout(() => {
    if (lives <= 0) {
      finalizarJogo(false); 
    } else {
      feedbackEl.className = "feedback"; feedbackEl.textContent = "";
      index++; 
      carregarFaseAprender();
    }
    isAnimating = false;
  }, 1000);
}

function finalizarJogo(vitoria) {
  clearInterval(timerInterval);
  showScreen("end"); progressBar.style.width = "100%";
  
  if (!vitoria) {
    screens.end.classList.add("game-over");
    document.getElementById("end-title").textContent = "GAME OVER 💔";
  } else {
    screens.end.classList.remove("game-over");
    document.getElementById("end-title").textContent = "Fim do Drop!";
    try { confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, colors: ['#C6A0F6', '#A6DA95', '#8AADF4', '#EED49F', '#FFD700'] }); } catch(e) {}
  }

  document.getElementById("final-score").textContent = score;
  document.getElementById("final-streak").textContent = maxStreak;
  
  const badgeContainer = document.getElementById("badges-container");
  if (mistakes === 0 && score > 0) badgeContainer.innerHTML += `<span class="badge-conf">🎯 Precisão Cirúrgica</span>`;
  if (maxStreak >= 5) badgeContainer.innerHTML += `<span class="badge-conf">🔥 Em Chamas</span>`;
}

const btnUp = document.getElementById("btn-up"), btnDown = document.getElementById("btn-down"), btnLeft = document.getElementById("btn-left"), btnRight = document.getElementById("btn-right");

btnUp.addEventListener("click", () => responder('up'));
btnDown.addEventListener("click", () => responder('down'));
btnLeft.addEventListener("click", () => responder('left'));
btnRight.addEventListener("click", () => responder('right'));

[[btnUp, 'Cima', 'txt-up'], [btnDown, 'Baixo', 'txt-down'], [btnLeft, 'Esquerda', 'txt-left'], [btnRight, 'Direita', 'txt-right']].forEach(([btn, dir, txtId]) => {
  const triggerTTS = () => lerBotao(document.getElementById(txtId).textContent, dir);
  btn.addEventListener("mouseenter", triggerTTS);
  btn.addEventListener("touchstart", triggerTTS, {passive: true});
});

document.addEventListener("keydown", (e) => {
  if (isLearnPhase || isAnimating) return;
  const key = e.key.toLowerCase();
  
  if (gameMode === 'tf' && (key === "arrowup" || key === "arrowdown" || key === "w" || key === "s")) return;

  if (key === "arrowright" || key === "d") responder('right');
  if (key === "arrowleft" || key === "a") responder('left');
  if (key === "arrowup" || key === "w") responder('up');
  if (key === "arrowdown" || key === "s") responder('down');
});

// ACESSIBILIDADE
const btnOpenAcc = document.getElementById("btn-open-acc"), btnCloseAcc = document.getElementById("btn-close-acc"), accModal = document.getElementById("acc-modal");
btnOpenAcc.addEventListener("click", () => accModal.classList.remove("hidden"));
btnCloseAcc.addEventListener("click", () => accModal.classList.add("hidden"));
accModal.addEventListener("click", (e) => { if (e.target === accModal) accModal.classList.add("hidden"); });

document.getElementById("acc-dyslexia").addEventListener("change", (e) => { document.body.classList.toggle("dyslexia-mode", e.target.checked); });
document.getElementById("acc-colorblind").addEventListener("change", (e) => { document.body.classList.toggle("colorblind-mode", e.target.checked); });
document.getElementById("acc-contrast").addEventListener("change", (e) => { document.body.classList.toggle("high-contrast", e.target.checked); });
document.getElementById("acc-reduce-motion").addEventListener("change", (e) => { document.body.classList.toggle("reduce-motion", e.target.checked); });
document.getElementById("acc-focus").addEventListener("change", (e) => { document.body.classList.toggle("focus-mode", e.target.checked); });

document.getElementById("acc-highlight").addEventListener("change", (e) => { 
  isHighlightActive = e.target.checked; 
  if (!isLearnPhase && CARDS[index]) cardTextEl.innerHTML = processarTexto(CARDS[index].text);
  else if (isLearnPhase && CARDS[index]) {
    conceptTitle.innerHTML = processarTexto(CARDS[index].conceptTitle);
    conceptText.innerHTML = processarTexto(CARDS[index].conceptText);
  }
});

document.getElementById("acc-tap-only").addEventListener("change", (e) => { document.body.classList.toggle("tap-only-mode", e.target.checked); });

document.getElementById("acc-threshold").addEventListener("input", (e) => { 
  swipeThreshold = parseInt(e.target.value); 
  document.getElementById("threshold-val").textContent = `${swipeThreshold}px`;
});

document.getElementById("acc-zen").addEventListener("change", (e) => {
  readingMode = e.target.checked;
  if (readingMode) { clearInterval(timerInterval); if(timerBar) timerBar.style.width = "0%"; }
  else if (!isLearnPhase) { iniciarTimer(); }
});
document.getElementById("acc-swipe-only").addEventListener("change", (e) => { document.body.classList.toggle("swipe-only-mode", e.target.checked); });

// SWIPE MOBILE
let startX = 0, startY = 0, arrastando = false;
function pegarX(e) { return e.touches ? e.touches[0].clientX : e.clientX; }
function pegarY(e) { return e.touches ? e.touches[0].clientY : e.clientY; }
function iniciarArraste(e) {
  if (isAnimating || isLearnPhase || document.body.classList.contains('tap-only-mode')) return;
  arrastando = true; startX = pegarX(e); startY = pegarY(e); quizCard.style.transition = "none";
}
function moverArraste(e) {
  if (!arrastando || isAnimating) return;
  const dx = pegarX(e) - startX;
  const dy = pegarY(e) - startY;
  
  if (gameMode === 'tf' && Math.abs(dy) > Math.abs(dx)) return;

  quizCard.style.transform = `translate(${dx}px, ${dy}px) rotate(${dx * 0.05}deg)`;
  
  iconLeft.classList.remove("active"); iconRight.classList.remove("active"); iconUp.classList.remove("active"); iconDown.classList.remove("active");
  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 30) { quizCard.className = "card quiz-card glow-green"; iconRight.classList.add("active"); }
    else if (dx < -30) { quizCard.className = "card quiz-card glow-red"; iconLeft.classList.add("active"); }
  } else {
    if (dy < -30) { quizCard.className = "card quiz-card glow-yellow"; iconUp.classList.add("active"); }
    else if (dy > 30) { quizCard.className = "card quiz-card glow-blue"; iconDown.classList.add("active"); }
  }
}
function finalizarArraste(e) {
  if (!arrastando) return;
  arrastando = false;
  const dx = (e.changedTouches ? e.changedTouches[0].clientX : e.clientX) - startX;
  const dy = (e.changedTouches ? e.changedTouches[0].clientY : e.clientY) - startY;
  
  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > swipeThreshold) responder('right');
    else if (dx < -swipeThreshold) responder('left');
    else resetarCard();
  } else {
    if (gameMode === 'tf') { resetarCard(); return; }
    
    if (dy < -swipeThreshold) responder('up');
    else if (dy > swipeThreshold) responder('down');
    else resetarCard();
  }
}
quizCard.addEventListener("mousedown", iniciarArraste);
document.addEventListener("mousemove", moverArraste);
document.addEventListener("mouseup", finalizarArraste);
quizCard.addEventListener("touchstart", iniciarArraste);
document.addEventListener("touchmove", moverArraste);
document.addEventListener("touchend", finalizarArraste);