export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Post only' });

    const apiKey = process.env.GEMINI_API_KEY;
    const { answers, motive } = req.body;

    // A URL mais estável disponível, sem betas ou sufixos complexos
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ 
                        text: `Aja como um neuropsicólogo. Gere um plano de sobriedade para o motivo: "${motive}". Dados: ${JSON.stringify(answers)}. Responda em Português com Markdown.` 
                    }]
                }]
            })
        });

        const data = await response.json();

        // Se der erro, ele vai cuspir o JSON INTEIRO para eu ler o que o Google quer
        if (data.error) {
            return res.status(200).json({ 
                plan: `DETALHE TÉCNICO DO GOOGLE: ${JSON.stringify(data.error)}` 
            });
        }

        if (data.candidates && data.candidates[0].content) {
            return res.status(200).json({ plan: data.candidates[0].content.parts[0].text });
        }

        return res.status(200).json({ plan: "O Google retornou um formato inesperado. Verifique os logs." });

    } catch (err) {
        return res.status(200).json({ plan: "Erro de conexão Vercel-Google: " + err.message });
    }
}
