async function gerarDiagnosticoIA() {
    const motive = localStorage.getItem('userMotive');
    const answers = JSON.parse(localStorage.getItem('userAnswers'));
    
    // Substitua pela sua chave de API real
    const API_KEY = "SUA_CHAVE_AQUI"; 
    
    // Usando a v1 estável em vez de v1beta
    const URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${API_KEY}`;

    const prompt = `
        Analise os seguintes dados de um usuário buscando sobriedade:
        Motivo: ${motive}
        Respostas do Diagnóstico: ${answers.join(", ")}
        
        Crie um plano de ação direto, técnico e empático com:
        1. Análise de Gatilhos (especialmente o das 18h se mencionado).
        2. Impacto Financeiro Estimado.
        3. Cronograma de Sobriedade para os primeiros 30 dias.
        Responda em formato HTML amigável para ser inserido em uma div.
    `;

    try {
        const response = await fetch(URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }]
            })
        });

        const data = await response.json();
        
        if (data.candidates && data.candidates[0].content.parts[0].text) {
            const resultadoHTML = data.candidates[0].content.parts[0].text;
            // Salva o diagnóstico para mostrar na página de sucesso
            localStorage.setItem('diagnosticoGerado', resultadoHTML);
            window.location.href = 'sucesso.html';
        } else {
            throw new Error("Resposta da IA inválida");
        }
    } catch (error) {
        console.error("Erro na API:", error);
        // Em caso de erro, redireciona para o pagamento/sucesso mesmo assim
        window.location.href = 'sucesso.html';
    }
}
