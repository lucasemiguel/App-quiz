export default async function handler(req, res) {
    // CHAVE INJETADA DIRETAMENTE PARA ELIMINAR ERRO DE VARIÁVEL
    const GEMINI_KEY = "AIzaSyAz3dfb9cKYZaJzqFI5lr1MU8BF3R-qh4E";
    
    const { answers, motive } = req.body;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`;

    const prompt = `Analise como um Neuropsicólogo de elite focado em vícios. 
    O usuário quer parar por este motivo: "${motive}". 
    Respostas do Quiz: ${JSON.stringify(answers)}.

    Retorne APENAS um objeto JSON puro, sem markdown, sem explicações:
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
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();
        
        if (!data.candidates || !data.candidates[0].content.parts[0].text) {
            console.error("Resposta inválida da Google AI:", data);
            return res.status(500).json({ error: "IA não gerou texto" });
        }

        let text = data.candidates[0].content.parts[0].text;
        
        // Limpeza de possíveis marcas de markdown da IA
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const cleanJson = JSON.parse(jsonMatch[0]);
            res.status(200).json(cleanJson);
        } else {
            res.status(500).json({ error: "JSON não encontrado na resposta" });
        }

    } catch (e) {
        console.error("Erro na API:", e);
        res.status(500).json({ error: e.message });
    }
}
