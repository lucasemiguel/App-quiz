export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { answers, motive } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    // Mudança estratégica: usando o sufixo -exp que é o mais comum para o 2.0 flash
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    role: "user",
                    parts: [{ text: `Gere um plano de sobriedade completo em português. Motivo: ${motive}. Respostas: ${JSON.stringify(answers)}. Estruture com títulos em Markdown.` }]
                }]
            })
        });

        const data = await response.json();

        if (data.error) {
            console.error("Erro específico do Google:", data.error);
            return res.status(500).json({ error: data.error.message });
        }

        if (data.candidates && data.candidates[0].content) {
            return res.status(200).json({ plan: data.candidates[0].content.parts[0].text });
        }

        return res.status(500).json({ error: "Resposta vazia da IA" });
    } catch (err) {
        return res.status(500).json({ error: "Erro de conexão" });
    }
}
