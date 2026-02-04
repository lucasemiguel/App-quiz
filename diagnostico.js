async function gerarDiagnosticoIA() {
    const motive = localStorage.getItem('userMotive');
    const answers = JSON.parse(localStorage.getItem('userAnswers')) || [];
    
    // Limpa o que tinha antes para não mostrar o plano antigo
    localStorage.removeItem('diagnosticoGerado');

    try {
        // MUITO IMPORTANTE: Verifique se o nome do arquivo na pasta api é exatamente 'generate-plan.js'
        // Se o nome do arquivo for outro, mude o nome abaixo:
        const response = await fetch('/api/generate-plan', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ answers, motive })
        });

        const data = await response.json();
        
        if (data.plan) {
            // Remove possíveis blocos de código markdown que a IA as vezes coloca
            const htmlLimpo = data.plan.replace(/```html|```/g, '');
            
            localStorage.setItem('diagnosticoGerado', htmlLimpo);
            
            // Redireciona APÓS ter certeza que salvou
            window.location.href = 'sucesso.html';
        } else {
            console.error("A API não retornou o plano:", data);
            alert("Erro na IA. Verifique se a API Key está correta na Vercel.");
        }
    } catch (error) {
        console.error("Erro na conexão:", error);
        alert("Erro de conexão. Verifique o console (F12).");
    }
}
