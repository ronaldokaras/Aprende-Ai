# Aprende Aí 📚

App completo de aprendizagem para quem tem pouco tempo.
## Link Para Acessar
https://ronaldokaras.github.io/Aprende-Ai/

## 🚀 Como rodar
1. Crie a pasta `aprende-ai/` e coloque os 7 arquivos dentro
2. Abra `index.html` no navegador
   - Dica: use a extensão **Live Server** no VS Code
3. No celular: abra no Chrome → menu (⋮) → **"Adicionar à tela inicial"** → vira app

## 📦 Funcionalidades
- 💬 **Tirar dúvida** com IA (demo com respostas prontas)
- 🎯 **Quiz** com 5 questões sorteadas
- 📱 **Pílulas** de conhecimento (feed de 30s)
- 🃏 **Flashcards** com repetição espaçada (SM-2 simplificado)
- ⚡ **Estudo rápido** de 3 minutos
- 📝 **Modo prova** com 10 questões, cronômetro e relatório
- ⏱️ **Modo foco** (Pomodoro 25 min)
- 🏆 **Gamificação** completa: pontos, streak, 10 conquistas
- 📊 **Mapa de dificuldades** pessoal
- ♿ **Acessibilidade**: A+, A-, alto contraste, leitura em voz alta, VLibras
- 📱 **PWA** — funciona offline

## 🤖 Como ligar IA de verdade
No `app.js`, na função `explicar()`, substitua o bloco de demo por:

```javascript
const resposta = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer SUA_CHAVE'
  },
  body: JSON.stringify({
    model: 'gpt-4o-mini',
    messages: [{
      role: 'user',
      content: `Explique "${pergunta}" em linguagem simples, dê um exemplo e crie um quiz de 2 perguntas. Responda em JSON: {explicacao, exemplo, quiz}`
    }]
  })
});
const dados = await resposta.json();
const c = JSON.parse(dados.choices[0].message.content);
document.getElementById('txt-explicacao').innerText = c.explicacao;
document.getElementById('txt-exemplo').innerText = c.exemplo;
document.getElementById('txt-quiz').innerText = c.quiz;