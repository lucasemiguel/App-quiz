export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { answers, motive } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    // Usando o endpoint 'gemini-1.5-flash-latest' que resolve o erro 404 na versão v1beta
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: `Aja como um neuropsicólogo especialista em vícios. Com base no motivo "${motive}" e nas respostas ${JSON.stringify(answers)}, gere um plano de sobriedade personalizado. Use Markdown para formatar.` }]
                }]
            })
        });

        const data = await response.json();

        if (data.error) {
            return res.status(200).json({ plan: `ERRO TÉCNICO: ${data.error.message}` });
        }

        if (data.candidates && data.candidates[0].content) {
            return res.status(200).json({ plan: data.candidates[0].content.parts[0].text });
        }

        return res.status(500).json({ error: "Falha na geração do conteúdo." });
    } catch (err) {
        return res.status(500).json({ error: "Erro de conexão com o servidor." });
    }
}
