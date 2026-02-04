// Dentro do seu handler da API
text: `Aja como um desenvolvedor de apps de saúde mental e neuropsicólogo.
Motivo do usuário: "${motive}".
Dados do Quiz: ${JSON.stringify(answers)}.

Crie um Dashboard de Sobriedade EXTREMAMENTE personalizado em HTML e CSS (use Tailwind).
Não escreva um texto. Construa uma INTERFACE de aplicativo.

Regras:
1. Se o usuário estiver em crise financeira, crie um card de calculadora de economia.
2. Se o gatilho for solidão, crie um card de "Chat de Apoio" ou "Ligar para Alguém".
3. Se o gatilho for às 18h, crie um alerta visual para esse horário.
4. Inclua um 'Botão de Pânico' personalizado para a dor dele.
5. Adicione uma frase de impacto baseada no 'Porquê' dele: "${motive}".

Retorne APENAS o código HTML dos cards, sem <html> ou <body>, prontos para inserir numa <div>.`
