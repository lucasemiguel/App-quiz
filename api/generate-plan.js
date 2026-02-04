export default async function handler(req, res) {
    const { answers, motive } = req.body;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const prompt = `Analise como um Neuropsicólogo de elite. Usuário quer parar por: "${motive}". Dados: ${JSON.stringify(answers)}. 
    Retorne APENAS um JSON (sem texto fora das chaves):
    {
        "dias": "01",
        "money": "Cálculo exato baseado no gasto informado",
        "hours": "Cálculo exato baseado no tempo informado",
        "perfilRisco": "Análise psicológica brutal e direta sobre o vício dele",
        "plano": {
            "manha": "Ação de bloqueio",
            "tarde": "Substituição de hábito",
            "noite": "Contenção de fissura"
        },
        "urgencia": {
            "tecnica": "Intervenção cognitiva imediata",
            "choque": "Lembrete do que ele vai perder se beber hoje"
        }
    }`;

    try {
        const response = await fetch(url, { method: 'POST', body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }) });
        const data = await response.json();
        let text = data.candidates[0].content.parts[0].text;
        const jsonOnly = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
        res.status(200).json(JSON.parse(jsonOnly));
    } catch (e) {
        res.status(500).json({ error: "Erro na geração dos dados" });
    }
}
