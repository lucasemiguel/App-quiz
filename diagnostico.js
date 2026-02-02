async function gerarDiagnosticoIA() {
    const motive = localStorage.getItem('userMotive');
    const answers = JSON.parse(localStorage.getItem('userAnswers')) || [];
    
    // COLE SUA CHAVE REAL ENTRE AS ASPAS ABAIXO
    const API_KEY = "AIzaSyAz3dfb9cKYZaJzqFI5lr1MU8BF3R-qh4E"; 
    
    const URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

    const prompt = `
        Analise de forma técnica e empática:
        Motivo de querer parar: ${motive}
        Respostas do usuário: ${answers.join(", ")}
        
        Crie um Plano de Recuperação com:
        1. Análise de gatilhos.
        2. Plano de ação para os primeiros 7 dias.
        Use formatação HTML simples (títulos h3, listas ul).
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
            const resultado = data.candidates[0].content.parts[0].text;
            localStorage.setItem('diagnosticoGerado', resultado);
            window.location.href = 'sucesso.html';
        } else {
            console.error("Erro na resposta:", data);
            window.location.href = 'sucesso.html';
        }
    } catch (error) {
        console.error("Erro na chamada:", error);
        window.location.href = 'sucesso.html';
    }
}
