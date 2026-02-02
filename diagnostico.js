async function gerarDiagnosticoIA() {
    const motive = localStorage.getItem('userMotive');
    const answers = JSON.parse(localStorage.getItem('userAnswers')) || [];

    try {
        // Chamando a sua API na Vercel (que já tem a chave e o prompt novo)
        // Certifique-se que o nome do arquivo na pasta api é 'generate-plan.js'
        const response = await fetch('/api/generate-plan', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ answers, motive })
        });

        const data = await response.json();
        
        // A sua API da Vercel retorna o resultado dentro de 'plan'
        if (data.plan) {
            localStorage.setItem('diagnosticoGerado', data.plan);
            
            // Aguarda o salvamento e redireciona
            setTimeout(() => {
                window.location.href = 'sucesso.html';
            }, 600);
        } else {
            console.error("Resposta sem plano:", data);
            window.location.href = 'sucesso.html';
        }
    } catch (error) {
        console.error("Erro ao conectar com a API da Vercel:", error);
        window.location.href = 'sucesso.html';
    }
}
