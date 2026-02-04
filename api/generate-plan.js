export default async function handler(req, res) {
    const { answers, motive } = req.body;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const prompt = `
        Aja como um Neuropsicólogo Especialista em Reabilitação. 
        Analise o motivo: "${motive}" e respostas: ${JSON.stringify(answers)}.
        
        Gere um JSON BRUTO (sem markdown) para um app premium:
        {
            "dias": 1,
            "money": "valor real calculado",
            "hours": "valor real calculado",
            "perfilRisco": "Análise técnica do porquê o usuário bebe (ex: fuga emocional, hábito social)",
            "plano": {
                "manha": "Bloqueio de gatilho matinal",
                "tarde": "Substituição neuroquímica",
                "noite": "Estratégia de contenção para o horário crítico"
            },
            "urgencia": {
                "tecnica": "Uma técnica de 'Urge Surfing' (técnica real de reabilitação) específica para o gatilho dele",
                "choque": "Um lembrete brutal das consequências negativas que ele descreveu"
            },
            "recompensa": "Cálculo do que ele compra em 6 meses com essa economia"
        }`;

    try {
        const response = await fetch(url, { method: 'POST', body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }) });
        const data = await response.json();
        const text = data.candidates[0].content.parts[0].text;
        const json = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
        res.status(200).json(JSON.parse(json));
    } catch (e) { res.status(500).json({ error: "Erro na IA" }); }
}
