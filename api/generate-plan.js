export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Post only' });

    const apiKey = process.env.GEMINI_API_KEY;
    const { answers, motive } = req.body;

    // Mudança do endpoint para a versão estável que aceita o modelo sem erro 404
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `Aja como um neuropsicólogo. Gere um plano de sobriedade detalhado para o motivo: ${motive}. Baseie-se nestas respostas: ${JSON.stringify(answers)}. Use Markdown.` }] }]
            })
        });

        const data = await response.json();

        if (data.error) {
            return res.status(200).json({ plan: `ERRO TÉCNICO: ${data.error.message}` });
        }

        if (data.candidates) {
            return res.status(200).json({ plan: data.candidates[0].content.parts[0].text });
        }
        return res.status(500).json({ error: "Erro na resposta" });
    } catch (err) {
        return res.status(500).json({ error: "Erro de rede" });
    }
}
