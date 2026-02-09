export default async function handler(req, res) {
    // Chave da OpenAI injetada conforme solicitado
    const OPENAI_KEY = "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";
    
    const { answers, motive } = req.body;

    const prompt = `Analise como um Neuropsicólogo de elite focado em vícios. 
    O usuário quer parar por este motivo: "${motive}". 
    Respostas do Quiz: ${JSON.stringify(answers)}.

    Retorne APENAS um objeto JSON puro, sem markdown, sem explicações, seguindo exatamente esta estrutura:
    {
        "dias": "01",
        "money": "valor total economizado no mês",
        "hours": "total de horas recuperadas",
        "perfilRisco": "análise brutal do vício dele",
        "plano": {
            "manha": "ação específica",
            "tarde": "ação específica",
            "noite": "ação específica"
        },
        "urgencia": {
            "tecnica": "técnica de choque imediato",
            "choque": "frase para impedir a recaída agora"
        }
    }`;

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    { 
                        role: "system", 
                        content: "Você é um assistente especializado em neuropsicologia que fornece diagnósticos brutais e precisos em formato JSON." 
                    },
                    { 
                        role: "user", 
                        content: prompt 
                    }
                ],
                response_format: { "type": "json_object" },
                temperature: 0.7
            })
        });

        const data = await response.json();

        if (data.error) {
            console.error("Erro da OpenAI:", data.error.message);
            return res.status(500).json({ error: data.error.message });
        }

        if (data.choices && data.choices[0].message.content) {
            const cleanJson = JSON.parse(data.choices[0].message.content);
            res.status(200).json(cleanJson);
        } else {
            res.status(500).json({ error: "A OpenAI não retornou conteúdo válido." });
        }

    } catch (e) {
        console.error("ERRO NA REQUISIÇÃO:", e);
        res.status(500).json({ error: e.message });
    }
}
