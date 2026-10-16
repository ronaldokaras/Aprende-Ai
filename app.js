/* ============================================================
   APRENDE AÍ v2 — App completo melhorado
   ============================================================ */

// ===== ESTADO =====
let estado = JSON.parse(localStorage.getItem('aprendeai') || '{}');
estado.pontos = estado.pontos || 0;
estado.streak = estado.streak || 0;
estado.conquistas = estado.conquistas || [];
estado.ultimoDia = estado.ultimoDia || null;
estado.diasEstudados = estado.diasEstudados || [];
estado.errosPorMateria = estado.errosPorMateria || {};
estado.acertosPorMateria = estado.acertosPorMateria || {};
estado.flashcards = estado.flashcards || [];
estado.totalQuizzes = estado.totalQuizzes || 0;
estado.totalDuvidas = estado.totalDuvidas || 0;
estado.pilulasLidas = estado.pilulasLidas || [];
estado.totalRapidos = estado.totalRapidos || 0;
estado.missaoDia = estado.missaoDia || null;
estado.missaoProgresso = estado.missaoProgresso || 0;
estado.missaoCompleta = estado.missaoCompleta || false;
estado.vistoOnboarding = estado.vistoOnboarding || false;
estado.temaEscuro = estado.temaEscuro || false;
estado.historico = estado.historico || [];

// ===== NAVEGAÇÃO =====
function irPara(idTela) {
  document.querySelectorAll('.tela').forEach(t => t.classList.remove('ativa'));
  const tela = document.getElementById(idTela);
  if (tela) tela.classList.add('ativa');

  document.querySelectorAll('.nav-item').forEach(n => {
    n.classList.toggle('ativo', n.dataset.tela === idTela);
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (idTela === 'tela-quiz') reiniciarQuiz();
  if (idTela === 'tela-flashcards') carregarFlashcard();
  if (idTela === 'tela-feed') renderizarFeed();
  if (idTela === 'tela-estudar') {
    renderizarMapa();
    renderizarMaterias();
  }
  if (idTela === 'tela-home') {
    renderizarRecomendacao();
    renderizarMissao();
  }
  if (idTela === 'tela-perfil') atualizarInterface();
}

// ===== ACESSIBILIDADE =====
let tamanhoFonte = 100;
function aumentarFonte() {
  tamanhoFonte = Math.min(tamanhoFonte + 10, 150);
  document.body.style.fontSize = tamanhoFonte + '%';
}
function diminuirFonte() {
  tamanhoFonte = Math.max(tamanhoFonte - 10, 80);
  document.body.style.fontSize = tamanhoFonte + '%';
}
function alternarContraste() {
  document.body.classList.toggle('contraste');
}
function alternarTema() {
  estado.temaEscuro = !estado.temaEscuro;
  document.body.classList.toggle('escuro', estado.temaEscuro);
  salvar();
  const btn = document.getElementById('btn-tema');
  if (btn) btn.innerText = estado.temaEscuro ? '☀️' : '🌙';
}

// ===== VOZ =====
function ouvirTexto(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const texto = el.innerText;
  if ('speechSynthesis' in window) {
    speechSynthesis.cancel();
    const fala = new SpeechSynthesisUtterance(texto);
    fala.lang = 'pt-BR';
    fala.rate = 1;
    speechSynthesis.speak(fala);
  } else {
    alert('Seu navegador não suporta leitura em voz alta.');
  }
}

// ===== NÍVEIS =====
function getNivel() {
  let nivel = NIVEIS[0];
  for (const n of NIVEIS) {
    if (estado.pontos >= n.min) nivel = n;
  }
  return nivel;
}

function getProximoNivel() {
  const atual = getNivel();
  const idx = NIVEIS.findIndex(n => n.min === atual.min);
  return NIVEIS[idx + 1] || null;
}

function progressoNivel() {
  const atual = getNivel();
  const prox = getProximoNivel();
  if (!prox) return 100;
  const base = atual.min;
  const range = prox.min - base;
  return Math.min(100, Math.round(((estado.pontos - base) / range) * 100));
}

// ===== PONTOS E STREAK =====
function ganharPontos(qtd, motivo = '') {
  estado.pontos += qtd;
  if (motivo) {
    estado.historico.unshift({
      pts: qtd,
      motivo,
      data: new Date().toLocaleString('pt-BR')
    });
    if (estado.historico.length > 20) estado.historico.pop();
  }
  atualizarInterface();
  salvar();
  mostrarToast(`+${qtd} pts${motivo ? ' · ' + motivo : ''}`);
}

function atualizarStreak() {
  const hoje = new Date().toDateString();
  const ontem = new Date(Date.now() - 86400000).toDateString();

  if (estado.ultimoDia !== hoje) {
    estado.streak = (estado.ultimoDia === ontem) ? estado.streak + 1 : 1;
    estado.ultimoDia = hoje;
    if (!estado.diasEstudados.includes(hoje)) {
      estado.diasEstudados.push(hoje);
      if (estado.diasEstudados.length > 30) estado.diasEstudados.shift();
    }
    // Nova missão diária
    sortearMissao();
    estado.missaoProgresso = 0;
    estado.missaoCompleta = false;
    salvar();
  }
}

function salvar() {
  localStorage.setItem('aprendeai', JSON.stringify(estado));
}

function atualizarInterface() {
  const nivel = getNivel();
  const prox = getProximoNivel();

  const elPontos = document.getElementById('pontos-total');
  if (elPontos) elPontos.innerText = estado.pontos;

  const elStreak = document.getElementById('streak-dias');
  if (elStreak) elStreak.innerText = estado.streak;

  const elCards = document.getElementById('cards-dominados');
  if (elCards) elCards.innerText = estado.flashcards.filter(f => f.nivel >= 3).length;

  const elPerfilPts = document.getElementById('perfil-pontos');
  if (elPerfilPts) elPerfilPts.innerText = estado.pontos + ' pontos';

  const elPerfilStreak = document.getElementById('perfil-streak');
  if (elPerfilStreak) elPerfilStreak.innerText = estado.streak + ' dias seguidos';

  const elNivel = document.getElementById('perfil-nivel');
  if (elNivel) elNivel.innerText = `${nivel.emoji} ${nivel.titulo}`;

  const elNivelHome = document.getElementById('nivel-home');
  if (elNivelHome) elNivelHome.innerHTML = `${nivel.emoji} <strong>${nivel.titulo}</strong>`;

  const barra = document.getElementById('barra-nivel');
  if (barra) {
    const pct = progressoNivel();
    barra.style.width = pct + '%';
    const txt = document.getElementById('txt-nivel-prog');
    if (txt) {
      txt.innerText = prox
        ? `${estado.pontos}/${prox.min} pts para ${prox.titulo}`
        : 'Nível máximo alcançado! 👑';
    }
  }

  renderizarConquistas();
  renderizarGraficoSemana();
  renderizarStats();
  renderizarHistorico();
  renderizarMissao();
  renderizarRecomendacao();
}

// ===== TOAST =====
function mostrarToast(msg) {
  let t = document.getElementById('toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    document.body.appendChild(t);
  }
  t.innerText = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2200);
}

// ===== CELEBRAÇÃO =====
function celebrar(titulo, sub) {
  const overlay = document.getElementById('celebra-overlay');
  if (!overlay) return;
  document.getElementById('celebra-titulo').innerText = titulo;
  document.getElementById('celebra-sub').innerText = sub || '';
  overlay.classList.add('ativo');
  setTimeout(() => overlay.classList.remove('ativo'), 2800);
}

// ===== CONQUISTAS =====
function desbloquearConquista(id) {
  if (!estado.conquistas.includes(id)) {
    estado.conquistas.push(id);
    salvar();
    renderizarConquistas();
    const c = TODAS_CONQUISTAS.find(x => x.id === id);
    if (c) celebrar(`${c.emoji} ${c.nome}`, c.desc);
  }
}

function renderizarConquistas() {
  const container = document.getElementById('conquistas');
  if (!container) return;
  container.innerHTML = TODAS_CONQUISTAS.map(c => {
    const ativa = estado.conquistas.includes(c.id) ? 'desbloqueada' : '';
    return `
      <div class="conquista ${ativa}">
        <span>${c.emoji}</span>
        <strong>${c.nome}</strong>
        <small>${c.desc}</small>
      </div>
    `;
  }).join('');
}

function verificarConquistas() {
  if (estado.pontos >= 10) desbloquearConquista('primeira');
  if (estado.pontos >= 50) desbloquearConquista('estudante');
  if (estado.pontos >= 200) desbloquearConquista('mestre');
  if (estado.pontos >= 500) desbloquearConquista('lenda');
  if (estado.streak >= 3) desbloquearConquista('streak3');
  if (estado.streak >= 7) desbloquearConquista('streak7');
  if (estado.streak >= 14) desbloquearConquista('streak14');
  const dominados = estado.flashcards.filter(f => f.nivel >= 3).length;
  if (dominados >= 10) desbloquearConquista('flash10');
  if (estado.totalRapidos >= 5) desbloquearConquista('rapido5');
  if (estado.missaoCompleta) desbloquearConquista('missao');
}

// ===== MISSÃO DO DIA =====
function sortearMissao() {
  const idx = Math.floor(Math.random() * MISSOES_TEMPLATES.length);
  estado.missaoDia = MISSOES_TEMPLATES[idx];
  estado.missaoProgresso = 0;
  estado.missaoCompleta = false;
  salvar();
}

function registrarMissao(tipo) {
  if (!estado.missaoDia || estado.missaoCompleta) return;
  if (estado.missaoDia.tipo !== tipo) return;

  estado.missaoProgresso++;
  if (estado.missaoProgresso >= estado.missaoDia.meta) {
    estado.missaoCompleta = true;
    ganharPontos(25, 'Missão do dia');
    desbloquearConquista('missao');
    celebrar('🎖️ Missão cumprida!', '+25 pontos bônus');
  }
  salvar();
  renderizarMissao();
}

function renderizarMissao() {
  const box = document.getElementById('missao-box');
  if (!box) return;

  if (!estado.missaoDia) sortearMissao();

  const m = estado.missaoDia;
  const pct = Math.min(100, Math.round((estado.missaoProgresso / m.meta) * 100));
  const completa = estado.missaoCompleta;

  box.innerHTML = `
    <div class="missao-header">
      <span>🎯 Missão do dia</span>
      ${completa ? '<span class="badge-ok">Concluída</span>' : ''}
    </div>
    <p class="missao-texto">${m.texto}</p>
    <div class="barra-missao">
      <div class="barra-missao-fill" style="width:${pct}%"></div>
    </div>
    <small>${estado.missaoProgresso}/${m.meta}${completa ? ' · +25 pts' : ''}</small>
  `;
}

// ===== RECOMENDAÇÃO INTELIGENTE =====
function getMateriaFraca() {
  let pior = null;
  let menorTaxa = 101;
  MATERIAS.forEach(m => {
    const a = estado.acertosPorMateria[m.id] || 0;
    const e = estado.errosPorMateria[m.id] || 0;
    const total = a + e;
    if (total >= 2) {
      const taxa = (a / total) * 100;
      if (taxa < menorTaxa) {
        menorTaxa = taxa;
        pior = m;
      }
    }
  });
  return pior;
}

function renderizarRecomendacao() {
  const box = document.getElementById('recomendacao');
  if (!box) return;

  const hoje = new Date().toDateString();
  const cardsHoje = estado.flashcards.filter(f => f.proximaRevisao <= hoje).length;
  const fraca = getMateriaFraca();

  let html = '';
  if (cardsHoje > 0) {
    html = `
      <div class="rec-card" onclick="irPara('tela-flashcards')">
        <span class="rec-emoji">🃏</span>
        <div>
          <strong>Revise ${cardsHoje} flashcard${cardsHoje > 1 ? 's' : ''}</strong>
          <small>Você tem cards prontos para hoje</small>
        </div>
        <span class="rec-seta">→</span>
      </div>`;
  } else if (fraca) {
    html = `
      <div class="rec-card" onclick="estudarMateria('${fraca.id}')">
        <span class="rec-emoji">${fraca.emoji}</span>
        <div>
          <strong>Reforce ${fraca.nome}</strong>
          <small>É onde você mais erra — 5 min de quiz</small>
        </div>
        <span class="rec-seta">→</span>
      </div>`;
  } else {
    html = `
      <div class="rec-card" onclick="iniciarRapido()">
        <span class="rec-emoji">⚡</span>
        <div>
          <strong>Estudo rápido de 3 min</strong>
          <small>Pílula + quiz + flashcard</small>
        </div>
        <span class="rec-seta">→</span>
      </div>`;
  }
  box.innerHTML = html;
}

// ===== GRÁFICO SEMANA =====
function renderizarGraficoSemana() {
  const container = document.getElementById('grafico-semana');
  if (!container) return;

  const dias = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
  const hoje = new Date();
  const semana = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(hoje);
    d.setDate(d.getDate() - i);
    const str = d.toDateString();
    semana.push({
      label: dias[d.getDay()],
      ativo: estado.diasEstudados.includes(str),
      hoje: i === 0
    });
  }

  container.innerHTML = semana.map(d =>
    `<div class="dia-quadrado ${d.ativo ? 'ativo' : ''} ${d.hoje ? 'hoje' : ''}">${d.label}</div>`
  ).join('');
}

function renderizarStats() {
  const container = document.getElementById('stats-perfil');
  if (!container) return;

  const totalAcertos = Object.values(estado.acertosPorMateria).reduce((a, b) => a + b, 0);
  const totalErros = Object.values(estado.errosPorMateria).reduce((a, b) => a + b, 0);
  const total = totalAcertos + totalErros;
  const taxa = total > 0 ? Math.round((totalAcertos / total) * 100) : 0;

  container.innerHTML = `
    <div class="stat-linha"><span>📝 Quizzes feitos</span><strong>${estado.totalQuizzes}</strong></div>
    <div class="stat-linha"><span>💬 Dúvidas tiradas</span><strong>${estado.totalDuvidas}</strong></div>
    <div class="stat-linha"><span>🎯 Taxa de acerto</span><strong>${taxa}%</strong></div>
    <div class="stat-linha"><span>🃏 Cards dominados</span><strong>${estado.flashcards.filter(f => f.nivel >= 3).length}</strong></div>
    <div class="stat-linha"><span>📱 Pílulas lidas</span><strong>${estado.pilulasLidas.length}</strong></div>
    <div class="stat-linha"><span>⚡ Estudos rápidos</span><strong>${estado.totalRapidos}</strong></div>
  `;
}

function renderizarHistorico() {
  const container = document.getElementById('historico-perfil');
  if (!container) return;
  if (!estado.historico.length) {
    container.innerHTML = '<p style="color:var(--texto-suave);font-size:0.85rem;">Nenhuma atividade ainda.</p>';
    return;
  }
  container.innerHTML = estado.historico.slice(0, 8).map(h => `
    <div class="hist-item">
      <span>+${h.pts}</span>
      <small>${h.motivo}</small>
      <em>${h.data}</em>
    </div>
  `).join('');
}

// ===== ZERAR =====
function zerarProgresso() {
  if (confirm('Tem certeza que quer zerar todo o progresso?')) {
    estado = {
      pontos: 0, streak: 0, conquistas: [], ultimoDia: null,
      diasEstudados: [], errosPorMateria: {}, acertosPorMateria: {},
      flashcards: [], totalQuizzes: 0, totalDuvidas: 0, pilulasLidas: [],
      totalRapidos: 0, missaoDia: null, missaoProgresso: 0,
      missaoCompleta: false, vistoOnboarding: true, temaEscuro: estado.temaEscuro,
      historico: []
    };
    salvar();
    atualizarInterface();
    mostrarToast('Progresso zerado');
  }
}

// ===== DÚVIDA =====
function preencher(texto) {
  document.getElementById('input-duvida').value = texto;
}

async function explicar() {
  const pergunta = document.getElementById('input-duvida').value.trim();
  if (!pergunta) return alert('Digite uma dúvida primeiro!');

  const btn = document.getElementById('btn-explicar');
  btn.innerText = 'Pensando... 🤔';
  btn.disabled = true;

  await new Promise(r => setTimeout(r, 600));

  const chave = pergunta.toLowerCase();
  let resposta;

  if (chave.includes('fotoss') || chave.includes('planta')) resposta = RESPOSTAS_DEMO.fotossintese;
  else if (chave.includes('equa') || chave.includes('grau') || chave.includes('x +') || chave.includes('x+')) resposta = RESPOSTAS_DEMO.equacao;
  else if (chave.includes('sujeito') || chave.includes('predicado')) resposta = RESPOSTAS_DEMO.sujeito;
  else if (chave.includes('revolu') || chave.includes('industrial')) resposta = RESPOSTAS_DEMO.revolucao;
  else if (chave.includes('porcent') || chave.includes('%')) resposta = RESPOSTAS_DEMO.porcentagem;
  else if (chave.includes('clima') || chave.includes('tempo')) resposta = RESPOSTAS_DEMO.clima;
  else {
    resposta = {
      explicacao: `Aqui a IA explicaria "${pergunta}" em linguagem simples. No modo demo usamos respostas prontas. Tente: fotossíntese, equação do 1º grau, sujeito e predicado, Revolução Industrial, porcentagem ou clima.`,
      exemplo: 'Exemplo: imagine que você está explicando isso para um amigo de 10 anos. Comece pelo "o que é", depois dê um exemplo do dia a dia.',
      quiz: '1) Pergunta fácil sobre o tema\n2) Pergunta média\n3) Pergunta desafio'
    };
  }

  document.getElementById('txt-explicacao').innerText = resposta.explicacao;
  document.getElementById('txt-exemplo').innerText = resposta.exemplo;
  document.getElementById('txt-quiz').innerText = resposta.quiz;
  document.getElementById('resultado').classList.add('ativo');

  btn.innerText = 'Explicar agora';
  btn.disabled = false;

  estado.totalDuvidas++;
  ganharPontos(10, 'Dúvida');
  registrarMissao('duvida');
  desbloquearConquista('duvida');
  verificarConquistas();
}

// ===== QUIZ =====
let quizQuestoes = [];
let quizAtual = 0;
let acertosQuiz = 0;
let quizMateriaAtual = 'todas';

function sortearQuestoes(materia, qtd) {
  let pool = [];
  if (materia === 'todas') {
    Object.keys(BANCO_QUIZ).forEach(m => {
      BANCO_QUIZ[m].forEach(q => pool.push({ ...q, materia: m }));
    });
  } else {
    pool = (BANCO_QUIZ[materia] || []).map(q => ({ ...q, materia }));
  }
  return pool.sort(() => 0.5 - Math.random()).slice(0, qtd);
}

function reiniciarQuiz(materia = 'todas') {
  quizMateriaAtual = materia;
  quizQuestoes = sortearQuestoes(materia, 5);
  quizAtual = 0;
  acertosQuiz = 0;
  const btn = document.getElementById('btn-proximo');
  if (btn) btn.style.display = 'none';
  const fb = document.getElementById('quiz-feedback');
  if (fb) fb.innerText = '';
  renderizarPerguntaQuiz();
}

function renderizarPerguntaQuiz() {
  if (quizAtual >= quizQuestoes.length) return finalizarQuiz();

  const q = quizQuestoes[quizAtual];
  document.getElementById('quiz-progresso').innerText =
    `Pergunta ${quizAtual + 1} de ${quizQuestoes.length}`;
  document.getElementById('quiz-pergunta').innerText = q.pergunta;

  // barra de progresso
  const bar = document.getElementById('quiz-barra');
  if (bar) {
    bar.style.width = ((quizAtual) / quizQuestoes.length * 100) + '%';
  }

  const container = document.getElementById('quiz-opcoes');
  container.innerHTML = '';

  q.opcoes.forEach((op, i) => {
    const btn = document.createElement('button');
    btn.className = 'opcao';
    btn.innerText = op;
    btn.onclick = () => responderQuiz(i, btn);
    container.appendChild(btn);
  });
}

function responderQuiz(indice, btn) {
  const q = quizQuestoes[quizAtual];
  const botoes = document.querySelectorAll('#quiz-opcoes .opcao');
  botoes.forEach(b => b.disabled = true);

  const feedback = document.getElementById('quiz-feedback');
  const mat = q.materia;

  if (indice === q.correta) {
    btn.classList.add('correta');
    acertosQuiz++;
    estado.acertosPorMateria[mat] = (estado.acertosPorMateria[mat] || 0) + 1;
    feedback.style.color = '#28a745';
    feedback.innerText = '✅ Acertou!';
  } else {
    btn.classList.add('errada');
    botoes[q.correta].classList.add('correta');
    estado.errosPorMateria[mat] = (estado.errosPorMateria[mat] || 0) + 1;
    feedback.style.color = '#dc3545';
    feedback.innerText = '❌ Errou. A resposta certa está destacada.';
  }

  salvar();
  document.getElementById('btn-proximo').style.display = 'block';
}

function proximoQuiz() {
  quizAtual++;
  document.getElementById('btn-proximo').style.display = 'none';
  document.getElementById('quiz-feedback').innerText = '';
  renderizarPerguntaQuiz();
}

function finalizarQuiz() {
  const pontos = acertosQuiz * 5;
  ganharPontos(pontos, 'Quiz');
  estado.totalQuizzes++;
  registrarMissao('quiz');
  if (acertosQuiz === quizQuestoes.length) desbloquearConquista('quiz');
  verificarConquistas();

  const bar = document.getElementById('quiz-barra');
  if (bar) bar.style.width = '100%';

  document.getElementById('quiz-progresso').innerText = 'Quiz finalizado';
  document.getElementById('quiz-pergunta').innerText =
    `🎉 Você acertou ${acertosQuiz} de ${quizQuestoes.length}!\n+${pontos} pontos`;
  document.getElementById('quiz-opcoes').innerHTML = '';
  document.getElementById('quiz-feedback').innerText = '';
}

// ===== FEED DE PÍLULAS =====
let pilulasVisiveis = 0;

function renderizarFeed() {
  const container = document.getElementById('feed-container');
  if (!container) return;
  if (container.children.length === 0) {
    pilulasVisiveis = 0;
    carregarMaisPilulas();
  }
}

function carregarMaisPilulas() {
  const container = document.getElementById('feed-container');
  const lote = BANCO_PILULAS.slice(pilulasVisiveis, pilulasVisiveis + 4);

  lote.forEach((p, idx) => {
    const realIdx = pilulasVisiveis + idx;
    const div = document.createElement('div');
    div.className = 'pilula';
    div.innerHTML = `
      <div>
        <span class="pilula-tag">${p.tag}</span>
        <h3 class="pilula-titulo">${p.titulo}</h3>
        <p class="pilula-conteudo">${p.conteudo}</p>
      </div>
      <div class="pilula-acoes">
        <button class="pilula-save" onclick="salvarPilula(${realIdx}, this)">💾 Salvar</button>
        <button class="pilula-like" onclick="curtirPilula(${realIdx}, this)">❤️ Útil</button>
      </div>
    `;
    container.appendChild(div);
  });

  pilulasVisiveis += lote.length;
  const btnMais = document.querySelector('#tela-feed .btn-secundario');
  if (btnMais && pilulasVisiveis >= BANCO_PILULAS.length) {
    btnMais.style.display = 'none';
  }
}

function salvarPilula(idx, btn) {
  if (!estado.pilulasLidas.includes(idx)) {
    estado.pilulasLidas.push(idx);
    ganharPontos(2, 'Pílula');
    registrarMissao('pilula');
    verificarConquistas();
  }
  btn.classList.add('ativo');
  btn.innerText = '✓ Salvo';
}

function curtirPilula(idx, btn) {
  btn.classList.toggle('ativo');
}

// ===== FLASHCARDS COM REPETIÇÃO ESPAÇADA =====
const INTERVALOS = [0, 1, 3, 7, 14, 30, 60];

function inicializarFlashcards() {
  if (estado.flashcards.length === 0) {
    estado.flashcards = BANCO_FLASHCARDS.map((f, i) => ({
      id: i,
      nivel: 0,
      proximaRevisao: new Date().toDateString()
    }));
    salvar();
  } else if (estado.flashcards.length < BANCO_FLASHCARDS.length) {
    // adiciona novos cards se o banco cresceu
    for (let i = estado.flashcards.length; i < BANCO_FLASHCARDS.length; i++) {
      estado.flashcards.push({
        id: i,
        nivel: 0,
        proximaRevisao: new Date().toDateString()
      });
    }
    salvar();
  }
}

function getCardAtual() {
  const hoje = new Date().toDateString();
  const disponiveis = estado.flashcards.filter(f => f.proximaRevisao <= hoje);
  if (disponiveis.length === 0) return null;
  return disponiveis[Math.floor(Math.random() * disponiveis.length)];
}

function carregarFlashcard() {
  inicializarFlashcards();
  const cardEstado = getCardAtual();

  const total = estado.flashcards.length;
  const hoje = new Date().toDateString();
  const restantes = estado.flashcards.filter(f => f.proximaRevisao <= hoje).length;

  document.getElementById('flash-total').innerText = total;
  document.getElementById('flash-restantes').innerText = restantes;

  if (!cardEstado) {
    document.getElementById('flash-pergunta').innerText = '🎉 Você revisou tudo por hoje!';
    document.getElementById('flash-tag').innerText = 'Pronto';
    document.getElementById('flash-frente').style.display = 'block';
    document.getElementById('flash-verso').style.display = 'none';
    document.getElementById('flash-acoes').style.display = 'none';
    document.querySelector('#card-flash small').innerText = 'Volte amanhã para novas revisões.';
    return;
  }

  const dados = BANCO_FLASHCARDS[cardEstado.id];
  document.getElementById('flash-tag').innerText = dados.materia;
  document.getElementById('flash-pergunta').innerText = dados.pergunta;
  document.getElementById('flash-resposta').innerText = dados.resposta;
  document.getElementById('flash-frente').style.display = 'block';
  document.getElementById('flash-verso').style.display = 'none';
  document.getElementById('flash-acoes').style.display = 'none';

  window._cardAtualId = cardEstado.id;
}

function virarFlash() {
  const frente = document.getElementById('flash-frente');
  const verso = document.getElementById('flash-verso');
  if (frente.style.display !== 'none') {
    frente.style.display = 'none';
    verso.style.display = 'block';
    document.getElementById('flash-acoes').style.display = 'flex';
  }
}

function respondeuFlash(acertou) {
  const card = estado.flashcards.find(f => f.id === window._cardAtualId);
  if (!card) return;

  if (acertou) {
    card.nivel = Math.min(card.nivel + 1, INTERVALOS.length - 1);
    ganharPontos(3, 'Flashcard');
  } else {
    card.nivel = 0;
  }

  const dias = INTERVALOS[card.nivel];
  const proxima = new Date();
  proxima.setDate(proxima.getDate() + dias);
  card.proximaRevisao = proxima.toDateString();

  registrarMissao('flash');
  salvar();
  verificarConquistas();
  atualizarInterface();
  carregarFlashcard();
}

function resetarFlashcards() {
  if (confirm('Zerar o progresso de todos os flashcards?')) {
    estado.flashcards = BANCO_FLASHCARDS.map((f, i) => ({
      id: i, nivel: 0, proximaRevisao: new Date().toDateString()
    }));
    salvar();
    carregarFlashcard();
    atualizarInterface();
  }
}

// ===== ESTUDO RÁPIDO (3 min) =====
function iniciarRapido() {
  irPara('tela-rapido');
  document.getElementById('rapido-intro').style.display = 'block';
  document.getElementById('rapido-conteudo').style.display = 'none';
}

function comecarRapido() {
  const pilula = BANCO_PILULAS[Math.floor(Math.random() * BANCO_PILULAS.length)];
  const questoes = sortearQuestoes('todas', 1);
  const flashIdx = Math.floor(Math.random() * BANCO_FLASHCARDS.length);
  const flash = BANCO_FLASHCARDS[flashIdx];

  const conteudo = document.getElementById('rapido-conteudo');
  document.getElementById('rapido-intro').style.display = 'none';
  conteudo.style.display = 'block';

  conteudo.innerHTML = `
    <div class="card" style="border-left:5px solid #ffcc00;">
      <span class="pilula-tag">${pilula.tag}</span>
      <h3 class="pilula-titulo">${pilula.titulo}</h3>
      <p class="pilula-conteudo" style="font-size:0.9rem;">${pilula.conteudo}</p>
    </div>

    <div class="card">
      <p class="quiz-progresso">🎯 Quiz rápido</p>
      <h4 style="font-size:0.95rem; margin-bottom:10px;">${questoes[0].pergunta}</h4>
      <div class="quiz-opcoes" id="rapido-opcoes"></div>
      <p class="quiz-feedback" id="rapido-feedback"></p>
    </div>

    <div class="card" style="text-align:center;">
      <p class="quiz-progresso">🃏 Flashcard</p>
      <h4 style="font-size:0.95rem; margin-bottom:10px;">${flash.pergunta}</h4>
      <p style="color:#666; font-size:0.85rem;" id="rapido-resposta" hidden>${flash.resposta}</p>
      <button class="btn-secundario" id="rapido-revelar" onclick="revelarRapido()">Ver resposta</button>
    </div>

    <button class="btn-primario" onclick="finalizarRapido()">Finalizar sessão · +10 pts</button>
  `;

  const opcContainer = document.getElementById('rapido-opcoes');
  questoes[0].opcoes.forEach((op, i) => {
    const btn = document.createElement('button');
    btn.className = 'opcao';
    btn.innerText = op;
    btn.onclick = () => {
      const q = questoes[0];
      document.querySelectorAll('#rapido-opcoes .opcao').forEach(b => b.disabled = true);
      const fb = document.getElementById('rapido-feedback');
      if (i === q.correta) {
        btn.classList.add('correta');
        fb.style.color = '#28a745';
        fb.innerText = '✅ Acertou! +5 pontos';
        ganharPontos(5, 'Quiz rápido');
      } else {
        btn.classList.add('errada');
        document.querySelectorAll('#rapido-opcoes .opcao')[q.correta].classList.add('correta');
        fb.style.color = '#dc3545';
        fb.innerText = '❌ Errou.';
      }
      verificarConquistas();
    };
    opcContainer.appendChild(btn);
  });
}

function revelarRapido() {
  document.getElementById('rapido-resposta').hidden = false;
  document.getElementById('rapido-revelar').style.display = 'none';
}

function finalizarRapido() {
  estado.totalRapidos++;
  ganharPontos(10, 'Estudo rápido');
  registrarMissao('rapido');
  verificarConquistas();
  celebrar('⚡ Sessão concluída!', '+10 pontos bônus');
  irPara('tela-home');
}

// ===== MODO PROVA =====
let provaQuestoes = [];
let provaRespostas = [];
let provaTimer = null;
let provaSegundos = 0;

function iniciarProva() {
  const materia = document.getElementById('prova-materia').value;
  provaQuestoes = sortearQuestoes(materia, 10);
  provaRespostas = new Array(provaQuestoes.length).fill(null);
  provaSegundos = 0;

  document.getElementById('prova-intro').style.display = 'none';
  const container = document.getElementById('prova-conteudo');
  container.style.display = 'block';

  let html = `<div class="prova-cronometro" id="prova-cronometro">⏱️ 00:00</div>`;

  provaQuestoes.forEach((q, i) => {
    html += `
      <div class="prova-questao">
        <h4>${i + 1}. ${q.pergunta}</h4>
        ${q.opcoes.map((op, j) => `
          <label>
            <input type="radio" name="prova-q${i}" value="${j}" onchange="registrarResposta(${i}, ${j})">
            ${op}
          </label>
        `).join('')}
      </div>
    `;
  });

  html += `<button class="btn-primario" onclick="finalizarProva()">Finalizar prova</button>`;
  container.innerHTML = html;

  provaTimer = setInterval(() => {
    provaSegundos++;
    const m = String(Math.floor(provaSegundos / 60)).padStart(2, '0');
    const s = String(provaSegundos % 60).padStart(2, '0');
    const el = document.getElementById('prova-cronometro');
    if (el) el.innerText = `⏱️ ${m}:${s}`;
  }, 1000);
}

function registrarResposta(qIdx, rIdx) {
  provaRespostas[qIdx] = rIdx;
}

function finalizarProva() {
  clearInterval(provaTimer);

  let acertos = 0;
  const pontosFracos = {};

  provaQuestoes.forEach((q, i) => {
    if (provaRespostas[i] === q.correta) {
      acertos++;
      estado.acertosPorMateria[q.materia] = (estado.acertosPorMateria[q.materia] || 0) + 1;
    } else {
      pontosFracos[q.materia] = (pontosFracos[q.materia] || 0) + 1;
      estado.errosPorMateria[q.materia] = (estado.errosPorMateria[q.materia] || 0) + 1;
    }
  });

  const nota = Math.round((acertos / provaQuestoes.length) * 10 * 10) / 10;
  const minutos = Math.floor(provaSegundos / 60);
  const segundos = provaSegundos % 60;

  const pontosGanhos = acertos * 10;
  ganharPontos(pontosGanhos, 'Prova');
  desbloquearConquista('prova');
  verificarConquistas();

  const container = document.getElementById('prova-conteudo');

  let html = `
    <div class="nota-final">
      <strong>${nota}</strong>
      <span>Nota final</span>
      <p style="margin-top:10px; font-size:0.9rem;">
        ${acertos} de ${provaQuestoes.length} acertos · ${minutos}m ${segundos}s
      </p>
    </div>
    <div class="relatorio-final">
      <h3 style="font-size:1rem; margin-bottom:12px;">📊 Relatório personalizado</h3>
  `;

  if (Object.keys(pontosFracos).length === 0) {
    html += `<p style="font-size:0.9rem; color:#28a745;">🎉 Você acertou tudo! Continue assim.</p>`;
  } else {
    html += `<p style="font-size:0.9rem; margin-bottom:10px;">Foque nestas matérias:</p>`;
    Object.entries(pontosFracos).sort((a, b) => b[1] - a[1]).forEach(([mat, qtd]) => {
      const nome = MATERIAS.find(m => m.id === mat)?.nome || mat;
      html += `<div class="ponto-fraco">
        <strong>${nome}</strong> — ${qtd} ${qtd === 1 ? 'erro' : 'erros'}
      </div>`;
    });
    html += `<p style="font-size:0.85rem; color:#666; margin-top:12px;">
      💡 Dica: use os <strong>flashcards</strong> dessas matérias por 5 min hoje mesmo.
    </p>`;
  }

  html += `</div>
    <button class="btn-primario" onclick="irPara('tela-estudar')">Voltar para estudar</button>
    <button class="btn-secundario" onclick="reiniciarProva()">🔄 Fazer outra prova</button>
  `;

  container.innerHTML = html;

  estado.totalQuizzes++;
  salvar();
}

function reiniciarProva() {
  document.getElementById('prova-intro').style.display = 'block';
  document.getElementById('prova-conteudo').style.display = 'none';
}

// ===== MODO FOCO (POMODORO) =====
let focoTimer = null;
let focoSegundos = 25 * 60;
let focoRodando = false;

function alternarFoco() {
  if (focoRodando) {
    clearInterval(focoTimer);
    focoRodando = false;
    document.getElementById('btn-foco').innerText = 'Retomar foco';
    document.getElementById('foco-circulo').classList.remove('ativo');
    document.getElementById('foco-status').innerText = 'Pausado';
  } else {
    focoRodando = true;
    document.getElementById('btn-foco').innerText = 'Pausar';
    document.getElementById('foco-circulo').classList.add('ativo');
    document.getElementById('foco-status').innerText = 'Focando... 📚';

    focoTimer = setInterval(() => {
      focoSegundos--;
      atualizarFocoDisplay();
      if (focoSegundos <= 0) {
        clearInterval(focoTimer);
        focoRodando = false;
        document.getElementById('foco-circulo').classList.remove('ativo');
        document.getElementById('foco-status').innerText = '🎉 Ciclo concluído! Descanse 5 min.';
        document.getElementById('btn-foco').innerText = 'Iniciar foco';
        ganharPontos(20, 'Pomodoro');
        registrarMissao('foco');
        desbloquearConquista('foco25');
        verificarConquistas();
        focoSegundos = 25 * 60;
        celebrar('⏱️ Foco concluído!', '+20 pontos');
      }
    }, 1000);
  }
}

function atualizarFocoDisplay() {
  const m = String(Math.floor(focoSegundos / 60)).padStart(2, '0');
  const s = String(focoSegundos % 60).padStart(2, '0');
  document.getElementById('foco-tempo').innerText = `${m}:${s}`;
}

function resetarFoco() {
  clearInterval(focoTimer);
  focoRodando = false;
  focoSegundos = 25 * 60;
  atualizarFocoDisplay();
  document.getElementById('btn-foco').innerText = 'Iniciar foco';
  document.getElementById('foco-circulo').classList.remove('ativo');
  document.getElementById('foco-status').innerText = 'Pronto para focar?';
}

// ===== MAPA DE DIFICULDADES =====
function renderizarMapa() {
  const container = document.getElementById('mapa-dificuldades');
  if (!container) return;

  const temDados = Object.keys(estado.errosPorMateria).length > 0 ||
                   Object.keys(estado.acertosPorMateria).length > 0;

  if (!temDados) {
    container.innerHTML = `<p style="color:var(--texto-suave); font-size:0.9rem;">
      Faça quizzes para o app identificar onde você erra mais.
    </p>`;
    return;
  }

  let html = '';
  MATERIAS.forEach(m => {
    const acertos = estado.acertosPorMateria[m.id] || 0;
    const erros = estado.errosPorMateria[m.id] || 0;
    const total = acertos + erros;
    if (total === 0) return;

    const taxa = Math.round((acertos / total) * 100);
    let classe = '';
    if (taxa >= 70) classe = '';
    else if (taxa >= 50) classe = 'medio';
    else classe = 'ruim';

    html += `
      <div class="materia-item">
        <span>${m.emoji} ${m.nome}</span>
        <div class="barra"><div class="barra-fill ${classe}" style="width:${taxa}%"></div></div>
        <strong>${taxa}%</strong>
      </div>
    `;
  });

  container.innerHTML = html || `<p style="color:var(--texto-suave); font-size:0.9rem;">Ainda sem dados suficientes.</p>`;
}

// ===== MATÉRIAS =====
function renderizarMaterias() {
  const container = document.getElementById('lista-materias');
  if (!container) return;

  container.innerHTML = MATERIAS.map(m => {
    const qtd = (BANCO_QUIZ[m.id] || []).length;
    return `
    <button class="acao-card ${m.cor}" onclick="estudarMateria('${m.id}')">
      <span class="acao-emoji">${m.emoji}</span>
      <strong>${m.nome}</strong>
      <small>${qtd} questões</small>
    </button>
  `;
  }).join('');
}

function estudarMateria(id) {
  irPara('tela-quiz');
  reiniciarQuiz(id);
}

// ===== ONBOARDING =====
function fecharOnboarding() {
  estado.vistoOnboarding = true;
  salvar();
  document.getElementById('onboarding').classList.remove('ativo');
}

// ===== INICIALIZAÇÃO =====
function init() {
  atualizarStreak();
  if (estado.temaEscuro) document.body.classList.add('escuro');
  const btnTema = document.getElementById('btn-tema');
  if (btnTema) btnTema.innerText = estado.temaEscuro ? '☀️' : '🌙';

  atualizarInterface();
  inicializarFlashcards();
  renderizarMaterias();
  renderizarMapa();

  const hora = new Date().getHours();
  let saud;
  if (hora < 12) saud = 'Bom dia! ☀️';
  else if (hora < 18) saud = 'Boa tarde! 🌤️';
  else saud = 'Boa noite! 🌙';
  const elSaud = document.getElementById('saudacao');
  if (elSaud) elSaud.innerText = saud;

  const elDica = document.getElementById('dica-dia');
  if (elDica) elDica.innerText = DICAS[Math.floor(Math.random() * DICAS.length)];

  if (!estado.vistoOnboarding) {
    const onb = document.getElementById('onboarding');
    if (onb) onb.classList.add('ativo');
  }

  reiniciarQuiz();
}

document.addEventListener('DOMContentLoaded', init);

// ===== SERVICE WORKER (PWA) =====
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js').catch(() => {});
}