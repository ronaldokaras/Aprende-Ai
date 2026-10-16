/* ============================================================
   BANCO DE DADOS — Aprende Aí v2
   ============================================================ */

// ===== RESPOSTAS DEMO PARA A DÚVIDA =====
const RESPOSTAS_DEMO = {
  fotossintese: {
    explicacao: 'Fotossíntese é o processo em que as plantas usam a luz do sol para produzir seu próprio alimento. Elas pegam água do solo, gás carbônico do ar e, com a luz, transformam tudo em glicose (açúcar) e oxigênio.',
    exemplo: 'Pense numa planta como uma pequena fábrica: a luz do sol é a energia, a água e o gás carbônico são as matérias-primas, e o açúcar é o produto. O oxigênio é o "brinde" que ela libera para nós.',
    quiz: '1) O que a planta produz na fotossíntese?\n   a) Açúcar e oxigênio ✅\n   b) Somente água\n   c) Gás carbônico\n\n2) De onde vem a energia da fotossíntese?\n   a) Do solo\n   b) Da luz do sol ✅\n   c) Da água'
  },
  equacao: {
    explicacao: 'Uma equação do 1º grau é uma igualdade com uma letra (incógnita) elevada a 1. Resolver é descobrir o valor dessa letra. Você isola a letra de um lado, passando os números para o outro com a operação inversa.',
    exemplo: 'Exemplo: 2x + 4 = 10\n1) Passe o 4 subtraindo: 2x = 10 - 4 = 6\n2) Divida por 2: x = 6/2 = 3\nPronto, x = 3.',
    quiz: '1) Resolva: x + 5 = 12\n   a) x = 7 ✅\n   b) x = 17\n   c) x = 5\n\n2) Resolva: 3x = 15\n   a) x = 3\n   b) x = 5 ✅\n   c) x = 12'
  },
  sujeito: {
    explicacao: 'Sujeito é quem pratica ou sobre quem se fala na frase. Predicado é tudo o que se diz sobre o sujeito. Ex: "Maria correu no parque." → Sujeito: Maria. Predicado: correu no parque.',
    exemplo: 'Na frase "O cachorro late muito":\n- Sujeito: O cachorro (quem late?)\n- Predicado: late muito (o que se diz dele?)\n\nDica: pergunte "quem?" ou "o quê?" antes do verbo.',
    quiz: '1) Em "Pedro estuda muito", qual é o sujeito?\n   a) Pedro ✅\n   b) estuda\n   c) muito\n\n2) Em "As flores são bonitas", o predicado é:\n   a) As flores\n   b) são bonitas ✅\n   c) flores'
  },
  revolucao: {
    explicacao: 'A Revolução Industrial começou na Inglaterra no século XVIII. Foi quando as fábricas substituíram a produção manual. Máquinas a vapor, tear mecânico e ferrovias mudaram tudo: as pessoas saíram do campo para as cidades, e o trabalho virou assalariado.',
    exemplo: 'Antes: um artesão fazia 1 camisa por dia em casa.\nDepois: uma fábrica com 50 máquinas fazia 500 camisas por dia.\nIsso barateou produtos, mas criou jornadas de 16h e trabalho infantil.',
    quiz: '1) Onde começou a Revolução Industrial?\n   a) França\n   b) Inglaterra ✅\n   c) Alemanha\n\n2) Qual foi uma consequência dela?\n   a) Êxodo rural ✅\n   b) Fim das cidades\n   c) Volta ao artesanato'
  },
  porcentagem: {
    explicacao: 'Porcentagem é uma forma de expressar uma parte de 100. "15%" significa 15 em cada 100. Para calcular, você multiplica o valor pelo percentual e divide por 100 (ou multiplica por 0,15 no caso de 15%).',
    exemplo: 'Quanto é 20% de 150?\n1) 20% = 0,20\n2) 150 × 0,20 = 30\nOu: 10% de 150 = 15 → 20% = 30.',
    quiz: '1) Quanto é 10% de 80?\n   a) 8 ✅\n   b) 10\n   c) 16\n\n2) Quanto é 25% de 200?\n   a) 25\n   b) 50 ✅\n   c) 75'
  },
  clima: {
    explicacao: 'Clima é o padrão médio do tempo em uma região ao longo de muitos anos. Tempo é o estado da atmosfera em um momento específico (hoje está chovendo).',
    exemplo: 'Dizer "hoje está quente" fala do tempo. Dizer "o clima do Nordeste é semiárido" fala do clima. O clima ajuda a prever o que é normal em cada região.',
    quiz: '1) "Hoje choveu em SP" refere-se a:\n   a) Clima\n   b) Tempo ✅\n   c) Bioma\n\n2) O clima subtropical é típico de:\n   a) Norte\n   b) Sul ✅\n   c) Nordeste'
  }
};

// ===== BANCO DE QUIZ =====
const BANCO_QUIZ = {
  matematica: [
    { pergunta: 'Quanto é 7 × 8?', opcoes: ['54', '56', '48', '64'], correta: 1 },
    { pergunta: 'Quanto é 15% de 200?', opcoes: ['15', '20', '30', '25'], correta: 2 },
    { pergunta: 'Resolva: x + 5 = 12', opcoes: ['x = 7', 'x = 17', 'x = 5', 'x = 60'], correta: 0 },
    { pergunta: 'Quanto é 2³?', opcoes: ['6', '8', '9', '5'], correta: 1 },
    { pergunta: 'Qual é a área de um quadrado de lado 6?', opcoes: ['12', '24', '36', '18'], correta: 2 },
    { pergunta: 'Quanto é 1/2 + 1/4?', opcoes: ['2/6', '3/4', '1/6', '2/4'], correta: 1 },
    { pergunta: 'Se 3x = 15, quanto vale x?', opcoes: ['3', '5', '12', '45'], correta: 1 },
    { pergunta: 'Qual é o valor de 10²?', opcoes: ['20', '100', '1000', '12'], correta: 1 },
    { pergunta: 'Quanto é 9 × 9?', opcoes: ['72', '81', '99', '18'], correta: 1 },
    { pergunta: 'Resolva: 2x - 4 = 10', opcoes: ['x = 3', 'x = 7', 'x = 5', 'x = 14'], correta: 1 },
    { pergunta: 'Quanto é 30% de 90?', opcoes: ['27', '30', '18', '45'], correta: 0 },
    { pergunta: 'Área de um retângulo 5 × 8?', opcoes: ['13', '40', '26', '45'], correta: 1 }
  ],
  portugues: [
    { pergunta: 'Em "Pedro estuda muito", qual é o sujeito?', opcoes: ['Pedro', 'estuda', 'muito', 'Pedro estuda'], correta: 0 },
    { pergunta: 'Qual é o plural de "cidadão"?', opcoes: ['cidadãos', 'cidadões', 'cidadãs', 'cidadans'], correta: 0 },
    { pergunta: 'Em "As flores são bonitas", o predicado é:', opcoes: ['As flores', 'são bonitas', 'flores', 'bonitas'], correta: 1 },
    { pergunta: 'Qual palavra está escrita corretamente?', opcoes: ['Excessão', 'Exceção', 'Esceção', 'Eceção'], correta: 1 },
    { pergunta: '"Mas" é usado para:', opcoes: ['Quantidade', 'Oposição', 'Tempo', 'Lugar'], correta: 1 },
    { pergunta: 'Qual é o feminino de "ator"?', opcoes: ['atora', 'atriz', 'atris', 'atoresa'], correta: 1 },
    { pergunta: 'Um texto dissertativo-argumentativo tem:', opcoes: ['Só narração', 'Tese, argumentos e conclusão', 'Só diálogos', 'Só descrição'], correta: 1 },
    { pergunta: 'Qual é o antônimo de "feliz"?', opcoes: ['Alegre', 'Triste', 'Contente', 'Animado'], correta: 1 },
    { pergunta: 'Em "Ela correu rápido", o advérbio é:', opcoes: ['Ela', 'correu', 'rápido', 'nenhum'], correta: 2 },
    { pergunta: 'Plural de "lápis"?', opcoes: ['lápises', 'lápis', 'lapises', 'lápizes'], correta: 1 }
  ],
  historia: [
    { pergunta: 'Em que ano o Brasil foi "descoberto" pelos portugueses?', opcoes: ['1492', '1500', '1822', '1889'], correta: 1 },
    { pergunta: 'Em que ano o Brasil se tornou independente?', opcoes: ['1500', '1808', '1822', '1889'], correta: 2 },
    { pergunta: 'Quem proclamou a República no Brasil?', opcoes: ['Dom Pedro I', 'Dom Pedro II', 'Deodoro da Fonseca', 'Getúlio Vargas'], correta: 2 },
    { pergunta: 'A Revolução Industrial começou em qual país?', opcoes: ['França', 'Inglaterra', 'Alemanha', 'EUA'], correta: 1 },
    { pergunta: 'Qual foi o primeiro produto explorado no Brasil colonial?', opcoes: ['Café', 'Ouro', 'Pau-brasil', 'Cana-de-açúcar'], correta: 2 },
    { pergunta: 'A escravidão foi abolida no Brasil em:', opcoes: ['1822', '1871', '1888', '1889'], correta: 2 },
    { pergunta: 'Quem foi o primeiro presidente do Brasil?', opcoes: ['Getúlio Vargas', 'Deodoro da Fonseca', 'Dom Pedro II', 'Juscelino'], correta: 1 },
    { pergunta: 'A Lei Áurea foi assinada por:', opcoes: ['Dom Pedro I', 'Princesa Isabel', 'Getúlio Vargas', 'Tiradentes'], correta: 1 }
  ],
  geografia: [
    { pergunta: 'Qual é a capital do Brasil?', opcoes: ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador'], correta: 2 },
    { pergunta: 'Qual é o maior bioma brasileiro?', opcoes: ['Cerrado', 'Amazônia', 'Caatinga', 'Pantanal'], correta: 1 },
    { pergunta: 'Quantos estados tem o Brasil?', opcoes: ['25', '26', '27', '28'], correta: 1 },
    { pergunta: 'Qual é o rio mais extenso do Brasil?', opcoes: ['São Francisco', 'Amazonas', 'Paraná', 'Tietê'], correta: 1 },
    { pergunta: 'O clima subtropical é típico de qual região?', opcoes: ['Norte', 'Nordeste', 'Sul', 'Centro-Oeste'], correta: 2 },
    { pergunta: 'Qual região tem o semiárido?', opcoes: ['Sul', 'Sudeste', 'Nordeste', 'Norte'], correta: 2 },
    { pergunta: 'O Pantanal fica principalmente em:', opcoes: ['Amazônia', 'Mato Grosso', 'Bahia', 'Paraná'], correta: 1 },
    { pergunta: 'Qual é o ponto mais alto do Brasil?', opcoes: ['Pico da Neblina', 'Pão de Açúcar', 'Serra do Mar', 'Chapada'], correta: 0 }
  ],
  quimica: [
    { pergunta: 'Qual é a fórmula química da água?', opcoes: ['H2O', 'CO2', 'O2', 'H2O2'], correta: 0 },
    { pergunta: 'Qual gás as plantas absorvem na fotossíntese?', opcoes: ['Oxigênio', 'Nitrogênio', 'Gás carbônico', 'Hélio'], correta: 2 },
    { pergunta: 'Qual é o símbolo químico do ouro?', opcoes: ['Ag', 'Au', 'Fe', 'Cu'], correta: 1 },
    { pergunta: 'Qual o pH de uma solução neutra?', opcoes: ['0', '7', '14', '10'], correta: 1 },
    { pergunta: 'Água + açúcar é uma mistura:', opcoes: ['Heterogênea', 'Homogênea', 'Composta', 'Pura'], correta: 1 },
    { pergunta: 'Símbolo do ferro?', opcoes: ['Fe', 'Fr', 'Fi', 'Fo'], correta: 0 },
    { pergunta: 'O que é um elemento químico?', opcoes: ['Mistura', 'Substância pura simples', 'Solução', 'Composto'], correta: 1 },
    { pergunta: 'Fórmula do gás carbônico?', opcoes: ['CO', 'CO2', 'C2O', 'O2'], correta: 1 }
  ],
  biologia: [
    { pergunta: 'Qual organela faz a fotossíntese?', opcoes: ['Mitocôndria', 'Cloroplasto', 'Núcleo', 'Ribossomo'], correta: 1 },
    { pergunta: 'Células animais NÃO possuem:', opcoes: ['Núcleo', 'Parede celular', 'Membrana', 'Citoplasma'], correta: 1 },
    { pergunta: 'O DNA fica principalmente no:', opcoes: ['Citoplasma', 'Núcleo', 'Mitocôndria', 'Vacúolo'], correta: 1 },
    { pergunta: 'Quem produz energia na célula?', opcoes: ['Cloroplasto', 'Mitocôndria', 'Lisossomo', 'Golgi'], correta: 1 },
    { pergunta: 'A unidade básica da vida é a:', opcoes: ['Célula', 'Tecido', 'Órgão', 'Molécula'], correta: 0 }
  ]
};

// ===== FLASHCARDS =====
const BANCO_FLASHCARDS = [
  { materia: 'Matemática', pergunta: 'Quanto é 15% de 200?', resposta: '30. Truque: 10% de 200 = 20; 5% = 10; soma = 30.' },
  { materia: 'Matemática', pergunta: 'Fórmula de Bhaskara?', resposta: 'x = (-b ± √(b² - 4ac)) / 2a' },
  { materia: 'Matemática', pergunta: 'Área do círculo?', resposta: 'A = π · r²' },
  { materia: 'Matemática', pergunta: 'O que é número primo?', resposta: 'Número divisível só por 1 e por ele mesmo. Ex: 2, 3, 5, 7, 11...' },
  { materia: 'Matemática', pergunta: 'Regra de três simples', resposta: 'Multiplica em cruz e isola o x. Ex: 4→10 e 6→x → 4x = 60 → x = 15.' },
  { materia: 'Português', pergunta: 'Quando usar "mas" e "mais"?', resposta: '"Mas" = porém (oposição). "Mais" = quantidade.' },
  { materia: 'Português', pergunta: 'O que é sujeito?', resposta: 'Quem pratica ou sobre quem se fala na frase.' },
  { materia: 'Português', pergunta: 'O que é predicado?', resposta: 'Tudo o que se diz sobre o sujeito.' },
  { materia: 'Português', pergunta: 'Estrutura da dissertação?', resposta: 'Introdução (tese) + Desenvolvimento (argumentos) + Conclusão (proposta).' },
  { materia: 'Português', pergunta: 'Quando usar crase?', resposta: 'Fusão de "a" + "a". Use antes de palavra feminina. Teste: se virar "ao" no masculino, tem crase.' },
  { materia: 'História', pergunta: 'Ano da Independência do Brasil?', resposta: '1822, por Dom Pedro I.' },
  { materia: 'História', pergunta: 'Ano da abolição da escravidão?', resposta: '1888, pela Lei Áurea.' },
  { materia: 'História', pergunta: 'O que foi a Revolução Industrial?', resposta: 'Substituição do trabalho manual por máquinas, começando na Inglaterra no séc. XVIII.' },
  { materia: 'História', pergunta: 'Quem proclamou a República?', resposta: 'Deodoro da Fonseca, em 1889.' },
  { materia: 'Geografia', pergunta: 'Quantos estados tem o Brasil?', resposta: '26 estados + Distrito Federal.' },
  { materia: 'Geografia', pergunta: 'O que é clima?', resposta: 'Padrão do tempo numa região ao longo de anos.' },
  { materia: 'Geografia', pergunta: 'Maior bioma brasileiro?', resposta: 'Amazônia.' },
  { materia: 'Química', pergunta: 'Fórmula da água?', resposta: 'H₂O — dois hidrogênios e um oxigênio.' },
  { materia: 'Química', pergunta: 'O que é mistura homogênea?', resposta: 'Quando não dá pra ver os componentes. Ex: água + açúcar.' },
  { materia: 'Química', pergunta: 'O que é pH?', resposta: 'Escala de 0 a 14 que mede acidez. 7 = neutro; <7 ácido; >7 base.' },
  { materia: 'Biologia', pergunta: 'O que é fotossíntese?', resposta: 'Plantas usam luz + CO₂ + água para produzir glicose e oxigênio.' },
  { materia: 'Biologia', pergunta: 'Unidade básica da vida?', resposta: 'A célula.' },
  { materia: 'Biologia', pergunta: 'Onde fica o DNA?', resposta: 'Principalmente no núcleo da célula.' }
];

// ===== PÍLULAS DE CONHECIMENTO (FEED) =====
const BANCO_PILULAS = [
  { tag: 'Matemática', titulo: 'Porcentagem em 30 segundos', conteudo: 'Para calcular 20% de 50: divida 50 por 10 (=5) e multiplique por 2 = 10. Regra rápida: 10% é só mover a vírgula uma casa para a esquerda.' },
  { tag: 'Português', titulo: 'Quando usar "mas" ou "mais"', conteudo: '"Mas" é conjunção (= porém): "Estudei, mas não passei."\n\n"Mais" indica quantidade: "Quero mais tempo."\n\nDica: se puder trocar por "porém", é "mas".' },
  { tag: 'História', titulo: 'Brasil Colônia em 1 minuto', conteudo: 'De 1500 a 1822, o Brasil foi colônia de Portugal. Explorou pau-brasil, cana-de-açúcar e ouro. A economia girava em torno do trabalho escravizado. Em 1822, Dom Pedro I declarou a independência.' },
  { tag: 'Química', titulo: 'O que é uma mistura?', conteudo: 'Mistura é a união de duas ou mais substâncias sem reação química. Ex: água + açúcar.\n\nPode ser homogênea (não dá para ver os componentes) ou heterogênea (dá para ver, como água + areia).' },
  { tag: 'Geografia', titulo: 'Clima x Tempo', conteudo: 'Clima = padrão do tempo numa região ao longo de anos.\nTempo = estado momentâneo.\n\nEx: "Hoje está chovendo" (tempo) x "O clima do Sul é subtropical" (clima).' },
  { tag: 'Matemática', titulo: 'Regra de três simples', conteudo: 'Se 4 canetas custam R$ 10, quanto custam 6?\n\n4 → 10\n6 → x\n\nMultiplica em X: 4x = 60 → x = 15.\n\nRegra: multiplique em cruz e isole o x.' },
  { tag: 'Português', titulo: 'Crase: quando usar', conteudo: 'Crase é a fusão de "a" (preposição) + "a" (artigo).\n\nUse antes de palavra feminina: "Vou à escola."\n\nTeste: troque por palavra masculina. Se virar "ao", tem crase.' },
  { tag: 'História', titulo: 'Era Vargas em 40s', conteudo: 'Getúlio Vargas governou de 1930 a 1945 e 1951 a 1954. Criou a CLT, o salário mínimo, a Petrobras e o voto feminino. Governou com mão de ferro no Estado Novo (1937-45).' },
  { tag: 'Biologia', titulo: 'Fotossíntese', conteudo: 'As plantas usam luz solar + água + gás carbônico para produzir glicose (alimento) e oxigênio.\n\nFórmula: 6CO₂ + 6H₂O + luz → C₆H₁₂O₆ + 6O₂' },
  { tag: 'Física', titulo: 'Leis de Newton', conteudo: '1ª (inércia): corpo parado tende a ficar parado.\n2ª (F = m · a): força = massa × aceleração.\n3ª (ação e reação): toda ação gera reação igual e oposta.' },
  { tag: 'Matemática', titulo: 'Potências rápidas', conteudo: '2³ = 2×2×2 = 8\n3² = 9\n10² = 100\nQualquer número elevado a 0 = 1.\nQualquer número elevado a 1 = ele mesmo.' },
  { tag: 'Português', titulo: 'Sujeito e predicado', conteudo: 'Sujeito = de quem se fala.\nPredicado = o que se diz sobre o sujeito.\n\n"O gato dormiu no sofá."\nSujeito: O gato\nPredicado: dormiu no sofá' },
  { tag: 'Geografia', titulo: 'Regiões do Brasil', conteudo: 'Norte (Amazônia), Nordeste (semiárido), Centro-Oeste (Cerrado/Pantanal), Sudeste (mais industrializado), Sul (clima subtropical).' },
  { tag: 'Química', titulo: 'pH em 20 segundos', conteudo: 'Escala de 0 a 14.\n7 = neutro (água pura)\n<7 = ácido (limão, vinagre)\n>7 = básico/alcalino (sabão, bicarbonato)' },
  { tag: 'História', titulo: 'Independência em 30s', conteudo: '7 de setembro de 1822. Dom Pedro I declarou a Independência às margens do Ipiranga. O Brasil deixou de ser colônia portuguesa e virou império.' }
];

// ===== MATÉRIAS =====
const MATERIAS = [
  { id: 'matematica', nome: 'Matemática', emoji: '🔢', cor: 'azul' },
  { id: 'portugues', nome: 'Português', emoji: '📖', cor: 'verde' },
  { id: 'historia', nome: 'História', emoji: '🏛️', cor: 'amarelo' },
  { id: 'geografia', nome: 'Geografia', emoji: '🌎', cor: 'roxo' },
  { id: 'quimica', nome: 'Química', emoji: '🧪', cor: 'azul' },
  { id: 'biologia', nome: 'Biologia', emoji: '🧬', cor: 'verde' }
];

// ===== DICAS =====
const DICAS = [
  'Estude em blocos de 25 minutos e descanse 5. Técnica Pomodoro.',
  'Explique o conteúdo em voz alta. Se travar, é porque não entendeu ainda.',
  'Revise a matéria no mesmo dia. Isso fixa 3x mais.',
  'Beba água e durma bem. O cérebro aprende enquanto você dorme.',
  'Foque no que você errou, não no que já sabe.',
  'Resumos curtos funcionam melhor que reler o texto inteiro.',
  'Teste-se em vez de reler. O cérebro aprende mais errando e corrigindo.',
  '3 minutos por dia já fazem diferença. Consistência > intensidade.',
  'Use o mapa de dificuldades: ele mostra exatamente onde você precisa reforçar.',
  'Ganhe pontos todos os dias. O streak mantém o hábito vivo.'
];

// ===== CONQUISTAS =====
const TODAS_CONQUISTAS = [
  { id: 'primeira', emoji: '🌟', nome: 'Primeiro passo', desc: 'Ganhou 10 pontos' },
  { id: 'estudante', emoji: '📚', nome: 'Estudante', desc: 'Ganhou 50 pontos' },
  { id: 'mestre', emoji: '🎓', nome: 'Mestre', desc: 'Ganhou 200 pontos' },
  { id: 'lenda', emoji: '👑', nome: 'Lenda', desc: 'Ganhou 500 pontos' },
  { id: 'streak3', emoji: '🔥', nome: 'Em chamas', desc: '3 dias seguidos' },
  { id: 'streak7', emoji: '⚡', nome: 'Constante', desc: '7 dias seguidos' },
  { id: 'streak14', emoji: '💎', nome: 'Imparável', desc: '14 dias seguidos' },
  { id: 'quiz', emoji: '🎯', nome: 'Precisão', desc: 'Acertou um quiz inteiro' },
  { id: 'duvida', emoji: '💬', nome: 'Curioso', desc: 'Tirou uma dúvida' },
  { id: 'flash10', emoji: '🃏', nome: 'Memória de ferro', desc: 'Dominou 10 cards' },
  { id: 'prova', emoji: '📝', nome: 'Guerreiro', desc: 'Fez uma prova completa' },
  { id: 'foco25', emoji: '⏱️', nome: 'Focado', desc: 'Completou um Pomodoro' },
  { id: 'missao', emoji: '🎖️', nome: 'Missão cumprida', desc: 'Completou a missão do dia' },
  { id: 'rapido5', emoji: '⚡', nome: 'Veloz', desc: 'Fez 5 estudos rápidos' }
];

// ===== NÍVEIS =====
const NIVEIS = [
  { min: 0,   titulo: 'Iniciante',   emoji: '🌱' },
  { min: 50,  titulo: 'Aprendiz',    emoji: '📘' },
  { min: 120, titulo: 'Estudante',   emoji: '📗' },
  { min: 250, titulo: 'Avançado',    emoji: '📙' },
  { min: 400, titulo: 'Expert',      emoji: '📕' },
  { min: 600, titulo: 'Mestre',      emoji: '🎓' },
  { min: 900, titulo: 'Lenda',       emoji: '👑' }
];

// ===== MISSÕES DO DIA (templates) =====
const MISSOES_TEMPLATES = [
  { id: 'quiz1', texto: 'Faça 1 quiz completo', tipo: 'quiz', meta: 1 },
  { id: 'flash3', texto: 'Revise 3 flashcards', tipo: 'flash', meta: 3 },
  { id: 'pilula2', texto: 'Leia 2 pílulas', tipo: 'pilula', meta: 2 },
  { id: 'rapido1', texto: 'Complete 1 estudo rápido', tipo: 'rapido', meta: 1 },
  { id: 'duvida1', texto: 'Tire 1 dúvida', tipo: 'duvida', meta: 1 },
  { id: 'foco1', texto: 'Complete 1 ciclo de foco', tipo: 'foco', meta: 1 }
];