export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Post only' });

    const apiKey = process.env.GEMINI_API_KEY;
    const { answers, motive } = req.body;

    // O endpoint que o Google está forçando em 2026 para chaves de API padrão
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ 
                        text: `Aja como um neuropsicólogo. Com base no motivo "${motive}" e nos dados ${JSON.stringify(answers)}, gere um plano de sobriedade curto e prático em Português usando Markdown.` 
                    }]
                }]
            })
        });

        const data = await response.json();

        if (data.error) {
            // Se der erro 404 de novo, ele vai me dizer qual modelo a sua conta TEM permissão de usar
            return res.status(200).json({ 
                plan: `ERRO DE PERMISSÃO GOOGLE: ${data.error.message} (Status: ${data.error.status})` 
            });
        }

        if (data.candidates && data.candidates[0].content) {
            return res.status(200).json({ plan: data.candidates[0].content.parts[0].text });
        }

        return res.status(200).json({ plan: "O Google respondeu, mas o formato foi inesperado." });

    } catch (err) {
        return res.status(200).json({ plan: "Erro de conexão: " + err.message });
    }
}
