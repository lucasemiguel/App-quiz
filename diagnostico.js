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

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`ERRO NA API (${response.status}):`, errorText);
            throw new Error(`Servidor respondeu com erro ${response.status}`);
        }

        const rawData = await response.json();
        console.log("LOG: Resposta bruta da IA recebida:", rawData);

        // Tratamento para garantir que pegamos o objeto correto
        // Se a IA retornar dentro de uma propriedade 'perfil' ou direto no objeto
        let finalData = rawData;
        
        // Validação mínima para não salvar lixo
        if (finalData && (finalData.dias || finalData.perfilRisco || finalData.plano)) {
            
            // Forçamos valores padrão caso a IA esqueça algum campo para não quebrar o Dashboard
            const dataToSave = {
                dias: finalData.dias || "01",
                money: finalData.money || "Calculando...",
                hours: finalData.hours || "Calculando...",
                perfilRisco: finalData.perfilRisco || "Análise em processamento.",
                plano: {
                    manha: finalData.plano?.manha || "Inicie com hidratação e foco.",
                    tarde: finalData.plano?.tarde || "Evite gatilhos sociais.",
                    noite: finalData.plano?.noite || "Higiene do sono e repouso."
                },
                urgencia: {
                    tecnica: finalData.urgencia?.tecnica || "Respire profundamente 10 vezes.",
                    choque: finalData.urgencia?.choque || "Lembre-se do seu motivo inegociável."
                }
            };

            localStorage.setItem('appData', JSON.stringify(dataToSave));
            console.log("LOG: appData salvo com sucesso. Redirecionando...");
            
            // O timeout garante que o browser teve tempo de salvar no disco antes de mudar a página
            setTimeout(() => {
                window.location.assign('sucesso.html');
            }, 500);

        } else {
            console.error("ERRO: Formato de dados inválido", finalData);
            alert("A IA gerou um plano incompleto. Tentando novamente...");
            // Opcional: recarregar ou tentar novamente automaticamente
        }

    } catch (error) {
        console.error("ERRO CRÍTICO NO PROCESSO:", error);
        alert("Ocorreu uma falha na conexão com a inteligência artificial. Por favor, verifique sua conexão ou tente novamente em instantes.");
        
        // Em caso de erro, removemos o loader do index para o usuário tentar clicar de novo
        if(document.getElementById('quiz-container')) {
            showPaymentOptions(); // Função que está no seu index.html para restaurar os botões
        }
    }
}
