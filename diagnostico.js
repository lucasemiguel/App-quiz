/**
 * Solicita o diagnóstico à API e gerencia o estado da aplicação.
 * @author Status Sóbrio Team
 */
async function gerarDiagnosticoIA() {
    const motive = localStorage.getItem('userMotive');
    const answers = JSON.parse(localStorage.getItem('userAnswers')) || [];

    // Estado visual de carregamento (opcional, caso tenha um spinner no botão)
    console.log("Iniciando geração de plano personalizado...");

    try {
        const response = await fetch('/api/generate-plan', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ answers, motive })
        });

        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

        const data = await response.json();

        if (data.plan) {
            // Sanitização profissional: Remove tags de Markdown caso a IA as envie
            const sanitizedHtml = data.plan.replace(/```html|```/g, '').trim();
            
            localStorage.setItem('diagnosticoGerado', sanitizedHtml);
            
            // Redirecionamento imediato após persistência dos dados
            window.location.assign('sucesso.html');
        } else {
            throw new Error("Payload de resposta inválido");
        }
    } catch (error) {
        console.error("[Internal Error]:", error);
        // Fallback: Redireciona mesmo em erro para que a página de sucesso trate a falha
        window.location.assign('sucesso.html');
    }
}
