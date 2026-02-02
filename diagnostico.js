async function gerarDiagnosticoIA() {
    const answers = JSON.parse(localStorage.getItem('userAnswers'));
    const motive = localStorage.getItem('userMotive');
    
    // Substitua pela sua Chave de API de forma segura
    const API_KEY = "SUA_CHAVE_AQUI"; 
    const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

    const prompt = `Atue como um especialista em recuperação comportamental. 
    Analise estas respostas de um quiz de sobriedade: ${answers.join(", ")}. 
    O motivo principal do usuário é: "${motive}".
    Gere um plano de 90 dias dividido em: 
    1. Análise de Gatilhos (baseado nas respostas).
    2. Plano de Ação Financeira.
    3. Estratégia Mental de Emergência.
    Seja empático, direto e técnico. Use Markdown para formatar.`;

    try {
        const response = await fetch(URL, {
            method: 'POST',
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();
        const text = data.candidates[0].content.parts[0].text;
        
        // Salva o resultado para exibir na página de sucesso
        localStorage.setItem('diagnosticoFinal', text);
        window.location.href = 'sucesso.html';
    } catch (error) {
        console.error("Erro na API:", error);
        alert("Erro ao conectar com a IA. Verifique sua conexão ou chave de API.");
    }
}
