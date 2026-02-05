async function gerarDiagnosticoIA() {
    const motive = localStorage.getItem('userMotive');
    const answers = JSON.parse(localStorage.getItem('userAnswers')) || [];

    console.log("LOG: Iniciando requisição para /api/generate-plan...");

    try {
        const response = await fetch('/api/generate-plan', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ answers, motive })
        });

        // Verificação de Status da Rota
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`ERRO NA API (${response.status}):`, errorText);
            alert(`Erro na API: ${response.status}. Verifique o log do console.`);
            return;
        }

        const data = await response.json();
        console.log("LOG: Dados brutos recebidos da IA:", data);

        if (data && (data.dias || data.perfil)) {
            // Salva os dados garantindo que o nome da chave seja appData
            localStorage.setItem('appData', JSON.stringify(data));
            console.log("LOG: Dados salvos no localStorage com sucesso.");
            
            // Redireciona
            window.location.assign('sucesso.html');
        } else {
            console.error("ERRO: A IA respondeu, mas os dados vieram vazios ou em formato errado.", data);
            alert("A IA respondeu em um formato que o app não entendeu. Veja o console.");
        }

    } catch (error) {
        console.error("ERRO CRÍTICO DE CONEXÃO:", error);
        alert("Não foi possível conectar à API. A rota pode estar errada ou o servidor fora do ar.");
    }
}
