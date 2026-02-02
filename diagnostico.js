async function gerarDiagnosticoIA() {
    const motive = localStorage.getItem('userMotive');
    const answers = JSON.parse(localStorage.getItem('userAnswers')) || [];
    
    // SUA CHAVE API ATUAL
    const API_KEY = "AIzaSyAz3dfb9cKYZaJzqFI5lr1MU8BF3R-qh4E"; 
    const URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

    const prompt = `
        Aja como um neuropsicólogo clínico. O usuário quer parar pelo motivo: "${motive}".
        Respostas do Quiz: ${answers.join(", ")}.

        Gere um plano estruturado EXATAMENTE com estas etiquetas:

        [ANALISE]
        Crie uma análise técnica e empática em HTML (use <h3> para títulos e <p> para parágrafos). Fale dos gatilhos específicos das respostas.

        [TAREFAS]
        Liste 3 tarefas curtas, práticas e personalizadas para hoje, separadas APENAS por vírgula.

        [MUSICA]
        Sugira uma frequência (ex: 528Hz) ou estilo musical para o estado emocional dele.
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
            localStorage.setItem('diagnosticoGerado', data.candidates[0].content.parts[0].text);
            // Delay de segurança antes de mudar de página
            setTimeout(() => {
                window.location.href = 'sucesso.html';
            }, 600);
        } else {
            window.location.href = 'sucesso.html';
        }
    } catch (error) {
        console.error("Erro na IA:", error);
        window.location.href = 'sucesso.html';
    }
}
