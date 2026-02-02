async function gerarDiagnosticoIA() {
    const motive = localStorage.getItem('userMotive');
    const answers = JSON.parse(localStorage.getItem('userAnswers')) || [];
    
    const API_KEY = "AIzaSyAz3dfb9cKYZaJzqFI5lr1MU8BF3R-qh4E"; 
    const URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

    const prompt = `
        Aja como um neuropsicólogo especialista em vícios. 
        Dados: Motivo: ${motive}, Respostas: ${answers.join(", ")}.
        
        Crie um plano hiper-personalizado seguindo RIGOROSAMENTE este formato:

        [ANALISE]
        (Escreva aqui a análise técnica dos gatilhos e riscos de forma empática em HTML usando <h3> e <p>)

        [TAREFAS]
        (Liste 3 tarefas práticas e curtas para hoje, separadas por vírgula)

        [MUSICA]
        (Recomende um tipo de frequência ou estilo musical relaxante para o perfil dele)
    `;

    try {
        const response = await fetch(URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();
        
        if (data.candidates && data.candidates[0].content.parts[0].text) {
            const resultadoTotal = data.candidates[0].content.parts[0].text;
            
            // Salvamos o texto bruto para tratar no sucesso.html
            localStorage.setItem('diagnosticoGerado', resultadoTotal);
            
            // Pequeno delay para garantir que o navegador salvou antes de mudar de página
            setTimeout(() => {
                window.location.href = 'sucesso.html';
            }, 500);
        } else {
            window.location.href = 'sucesso.html';
        }
    } catch (error) {
        console.error("Erro:", error);
        window.location.href = 'sucesso.html';
    }
}
