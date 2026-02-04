export default async function handler(req, res) {
    const { answers, motive } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const prompt = `
        Aja como o melhor especialista em comportamento humano e vícios do Brasil.
        O usuário quer parar de beber por: "${motive}". Dados do Quiz: ${JSON.stringify(answers)}.

        Crie um Plano de Sobriedade de ALTO VALOR (estilo Produto Premium).
        Retorne APENAS um JSON com esta estrutura:
        {
            "perfil": {
                "dias": 1,
                "economiaMensalEstimada": "valor real calculado",
                "horasRecuperadasMes": "valor real calculado",
                "nivelDeRisco": "Baixo/Médio/Alto/Crítico"
            },
            "psicologia": {
                "analiseGatilhos": "Explicação profunda de como o cérebro dele reage aos gatilhos achados",
                "seuPorquêReforçado": "Uma frase poderosa baseada no motivo dele: ${motive}"
            },
            "planoAcao": {
                "manha": "Ação específica para evitar o primeiro gole",
                "tarde": "Ação de produtividade",
                "noite": "Ação para o horário crítico (geralmente quando bebem)"
            },
            "botaoPanico": {
                "exercicio": "Um exercício de respiração ou técnica de 5 minutos para a hora da fissura",
                "fraseEmergencia": "O que ele deve dizer a si mesmo no momento da tentação"
            },
            "recompensa": "O que ele poderá comprar em 30 dias com o dinheiro economizado"
        }
    `;

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });
        const data = await response.json();
        const textResponse = data.candidates[0].content.parts[0].text;
        const jsonOnly = textResponse.substring(textResponse.indexOf('{'), textResponse.lastIndexOf('}') + 1);
        res.status(200).json(JSON.parse(jsonOnly));
    } catch (e) {
        res.status(500).json({ error: "Erro na geração do plano premium" });
    }
}
