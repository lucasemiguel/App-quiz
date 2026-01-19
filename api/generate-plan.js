export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { answers, motive } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    // Usando o modelo confirmado pelo seu diagnóstico
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    role: "user",
                    parts: [{
                        text: `Atue como Especialista em Neuropsicologia. Crie um plano de sobriedade para o motivo: ${motive}. Use estas respostas de perfil: ${JSON.stringify(answers)}. Estruture em 5 tópicos com Markdown.`
                    }]
                }],
                generationConfig: {
                    maxOutputTokens: 1000,
                    temperature: 0.7
                }
            })
        });

        const data = await response.json();

        // Se houver erro, vamos ver nos logs da Vercel
        if (data.error) {
            console.error("Erro do Google 2.0:", JSON.stringify(data.error));
            return res.status(500).json({ error: data.error.message });
        }

        if (data.candidates && data.candidates[0].content) {
            const planText = data.candidates[0].content.parts[0].text;
            return res.status(200).json({ plan: planText });
        }

        return res.status(500).json({ error: "Falha ao gerar conteúdo" });

    } catch (err) {
        return res.status(500).json({ error: "Erro de conexão servidor" });
    }
}
