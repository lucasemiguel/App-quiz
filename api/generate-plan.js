export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Post only' });

    const apiKey = process.env.GEMINI_API_KEY;
    const { answers, motive } = req.body;

    // Esta é a URL definitiva para 2026 usando o modelo 'latest' para evitar o erro 404
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ 
                        text: `Aja como um neuropsicólogo. Com base no motivo "${motive}" e nos dados ${JSON.stringify(answers)}, gere um plano de sobriedade prático em Português. Use títulos com ### e negritos com **.` 
                    }]
                }]
            })
        });

        const data = await response.json();

        // Se der erro, vamos capturar exatamente o que o Google diz agora
        if (data.error) {
            return res.status(200).json({ 
                plan: `ERRO DO SISTEMA: ${data.error.message} (Código: ${data.error.status})` 
            });
        }

        if (data.candidates && data.candidates[0].content) {
            return res.status(200).json({ plan: data.candidates[0].content.parts[0].text });
        }

        return res.status(200).json({ plan: "O Google não conseguiu processar os dados. Tente novamente." });

    } catch (err) {
        return res.status(200).json({ plan: "Erro de conexão Vercel-Google: " + err.message });
    }
}
