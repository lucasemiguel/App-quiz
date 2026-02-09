async function gerarDiagnosticoIA() {
    const motive = localStorage.getItem('userMotive');
    const answers = JSON.parse(localStorage.getItem('userAnswers')) || [];

    // Chave inserida diretamente para ignorar falhas da Vercel
    const GEMINI_KEY = "AIzaSyAz3dfb9cKYZaJzqFI5lr1MU8BF3R-qh4E";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`;

    console.log("LOG: Iniciando conexão direta com Google Gemini...");

    const prompt = `Analise como um Neuropsicólogo de elite focado em vícios. 
    Motivo do usuário: "${motive}". 
    Respostas do Quiz: ${JSON.stringify(answers)}.

    Retorne APENAS um objeto JSON puro, seguindo EXATAMENTE esta estrutura:
    {
        "dias": "01",
        "money": "valor total economizado no mês",
        "hours": "total de horas recuperadas",
        "perfilRisco": "análise brutal do vício",
        "plano": {
            "manha": "ação específica",
            "tarde": "ação específica",
            "noite": "ação específica"
        },
        "urgencia": {
            "tecnica": "técnica imediata",
            "choque": "frase de impacto"
        }
    }`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("ERRO DIRETO NA GOOGLE:", errorData);
            throw new Error(`Google respondeu com erro: ${response.status}`);
        }

        const data = await response.json();
        console.log("LOG: Resposta recebida da Google:", data);

        if (data.candidates && data.candidates[0].content.parts[0].text) {
            let text = data.candidates[0].content.parts[0].text;
            
            // Limpeza de Markdown caso a IA envie ```json ... ```
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) throw new Error("JSON não encontrado na resposta");
            
            const finalData = JSON.parse(jsonMatch[0]);

            // Salva no localStorage com os fallbacks de segurança
            const dataToSave = {
                dias: finalData.dias || "01",
                money: finalData.money || "Calculando...",
                hours: finalData.hours || "Calculando...",
                perfilRisco: finalData.perfilRisco || "Análise em processamento.",
                plano: {
                    manha: finalData.plano?.manha || "Hidratação e foco.",
                    tarde: finalData.plano?.tarde || "Evite gatilhos.",
                    noite: finalData.plano?.noite || "Higiene do sono."
                },
                urgencia: {
                    tecnica: finalData.urgencia?.tecnica || "Respire fundo.",
                    choque: finalData.urgencia?.choque || "Lembre-se do seu 'porquê'."
                }
            };

            localStorage.setItem('appData', JSON.stringify(dataToSave));
            console.log("LOG: Dados salvos. Redirecionando...");
            
            setTimeout(() => {
                window.location.assign('sucesso.html');
            }, 500);

        } else {
            throw new Error("Resposta da IA incompleta");
        }

    } catch (error) {
        console.error("ERRO CRÍTICO:", error);
        alert("Ocorreu uma falha na conexão direta. Verifique o console para detalhes técnicos.");
        
        if (typeof showPaymentOptions === "function") {
            showPaymentOptions();
        }
    }
}
