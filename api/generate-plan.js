export default async function handler(req, res) {
    const { answers, motive } = req.body;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const prompt = `
        Aja como um analista de dados e neuropsicólogo. Analise estas respostas: ${JSON.stringify(answers)} e este motivo: "${motive}".
        Retorne EXCLUSIVAMENTE um objeto JSON (sem markdown) com:
        {
            "diasSobrio": 1,
            "dinheiroEconomizado": "valor numérico baseado no quiz",
            "tempoGanhoDiario": "em minutos",
            "gatilhoDominante": "título curto",
            "gatilhoSecundario": "título curto",
            "analiseGatilhos": "texto curto e profundo",
            "missoes": ["missão 1", "missão 2", "missão 3"],
            "fraseImpacto": "frase baseada no motivo ${motive}"
        }
    `;

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });
        const data = await response.json();
        const textResponse = data.candidates[0].content.parts[0].text;
        // Limpa qualquer resíduo de texto que não seja JSON
        const jsonOnly = textResponse.substring(textResponse.indexOf('{'), textResponse.lastIndexOf('}') + 1);
        res.status(200).json(JSON.parse(jsonOnly));
    } catch (e) {
        res.status(500).json({ error: "Falha na estrutura de dados" });
    }
}
